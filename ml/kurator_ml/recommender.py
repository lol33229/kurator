"""Подбор наставников, версия 1: взвешенная сумма 8 критериев из ТЗ.

Каждый критерий даёт оценку от 0 до 1, итоговый процент — взвешенная сумма.
Объяснение строится из тех же оценок, поэтому оно всегда совпадает с тем,
почему наставник на самом деле оказался в списке.
"""

from dataclasses import dataclass

from kurator_ml.domain import (
    AVAILABILITY_RANK,
    DEADLINE_MONTHS,
    DURATION_MONTHS,
    EXPERIENCE_RANK,
    MIN_EXPERIENCE_FOR_LEVEL,
    POSITION_SKILLS,
    SKILL_LEVEL_WEIGHT,
)
from kurator_ml.options import TASK_TO_DIRECTION, Availability, Experience, Format, Skill
from kurator_ml.rating import smoothed_rating
from kurator_ml.schemas import (
    Criterion,
    FactorContribution,
    MentorProfile,
    Recommendation,
    RecommendationRequest,
    RecommendationResponse,
    StudentProfile,
)
from kurator_ml.text_similarity import TextSimilarity, TrigramSimilarity

MODEL_VERSION = "v1-rules"

# Веса критериев, в сумме 1
WEIGHTS: dict[Criterion, float] = {
    "skills": 0.25,
    "goals": 0.20,
    "interests": 0.10,
    "level": 0.10,
    "availability": 0.10,
    "format": 0.10,
    "duration": 0.05,
    "domain": 0.10,
}

# Сколько пунктов показываем в «Почему подходит?»
MAX_REASONS = 3
# Критерий попадает в объяснение, только если оценка не ниже этой
REASON_THRESHOLD = 0.6

EXPERIENCE_LABELS = {
    Experience.UNDER_1: "менее 1 года",
    Experience.YEARS_1_3: "1–3 года",
    Experience.YEARS_3_5: "3–5 лет",
    Experience.YEARS_5_10: "5–10 лет",
    Experience.OVER_10: "более 10 лет",
}
AVAILABILITY_LABELS = {
    Availability.H_1_2: "1–2 часа в неделю",
    Availability.H_3_5: "3–5 часов в неделю",
    Availability.H_6_10: "6–10 часов в неделю",
    Availability.H_10_PLUS: "более 10 часов в неделю",
}
FORMAT_LABELS = {Format.ONLINE: "онлайн", Format.OFFLINE: "офлайн", Format.MIXED: "смешанный"}


@dataclass
class Scored:
    mentor: MentorProfile
    scores: dict[Criterion, float]
    matched_skills: list[Skill]
    matched_goals: list[str]

    @property
    def total(self) -> float:
        return sum(WEIGHTS[criterion] * score for criterion, score in self.scores.items())


def clamp(value: float) -> float:
    return max(0.0, min(1.0, value))


def mentor_text(mentor: MentorProfile) -> str:
    """Текст профиля наставника для сравнения с целью ученика."""
    parts = [mentor.position.value, *mentor.directions, *mentor.skills, mentor.about]
    return " ".join(str(part) for part in parts)


# ---------- Критерии ----------


def skills_score(student: StudentProfile, mentor: MentorProfile) -> float:
    """Доля навыков ученика, которые есть у наставника, с учётом уровня владения."""
    weights = [SKILL_LEVEL_WEIGHT[mentor.skills[skill]] if skill in mentor.skills else 0.0 for skill in student.skills]
    return sum(weights) / len(weights)


def goals_score(student: StudentProfile, mentor: MentorProfile, text: TextSimilarity) -> float:
    """Задачи ученика против направлений наставника и близость текста цели."""
    covered = sum(TASK_TO_DIRECTION[task] in mentor.directions for task in student.tasks) / len(student.tasks)
    # Сырая косинусная близость коротких текстов редко выше 0,5, поэтому растягиваем
    similarity = clamp(text.similarity(student.goal, mentor_text(mentor)) * 2)
    return 0.5 * covered + 0.5 * similarity


def interests_score(student: StudentProfile, mentor: MentorProfile) -> float:
    """Пересечение интересов; пока в анкете нет интересов, сравниваем навыки."""
    if student.interests:
        mentor_topics = {topic.lower() for topic in [*mentor.directions, *mentor.skills]}
        return sum(interest.lower() in mentor_topics for interest in student.interests) / len(student.interests)
    student_skills, mentor_skills = set(student.skills), set(mentor.skills)
    return len(student_skills & mentor_skills) / len(student_skills | mentor_skills)


def level_score(student: StudentProfile, mentor: MentorProfile) -> float:
    """Опыта наставника должно хватать для уровня ученика; лишний опыт не штрафуем."""
    shortage = MIN_EXPERIENCE_FOR_LEVEL[student.level] - EXPERIENCE_RANK[mentor.experience]
    return clamp(1 - 0.35 * max(0, shortage))


def availability_score(student: StudentProfile, mentor: MentorProfile) -> float:
    distance = abs(AVAILABILITY_RANK[student.availability] - AVAILABILITY_RANK[mentor.availability])
    return clamp(1 - 0.4 * distance)


def format_score(student: StudentProfile, mentor: MentorProfile) -> float:
    if student.format == mentor.format:
        return 1.0
    if Format.MIXED in (student.format, mentor.format):
        return 0.5
    return 0.0


def duration_score(student: StudentProfile, mentor: MentorProfile) -> float:
    """Срок цели ученика против срока, на который готов наставник."""
    if mentor.duration is None:
        return 0.5
    wanted, offered = DEADLINE_MONTHS[student.deadline], DURATION_MONTHS[mentor.duration]
    return clamp(1 - 0.15 * abs(wanted - offered))


def domain_score(student: StudentProfile, mentor: MentorProfile, text: TextSimilarity) -> float:
    """Близость навыков и цели ученика к профессии наставника."""
    typical = POSITION_SKILLS[mentor.position]
    overlap = sum(skill in typical for skill in student.skills) / len(student.skills)
    similarity = clamp(text.similarity(student.goal, mentor.position.value) * 2)
    return 0.7 * overlap + 0.3 * similarity


def score_mentor(student: StudentProfile, mentor: MentorProfile, text: TextSimilarity) -> Scored:
    scores: dict[Criterion, float] = {
        "skills": skills_score(student, mentor),
        "goals": goals_score(student, mentor, text),
        "interests": interests_score(student, mentor),
        "level": level_score(student, mentor),
        "availability": availability_score(student, mentor),
        "format": format_score(student, mentor),
        "duration": duration_score(student, mentor),
        "domain": domain_score(student, mentor, text),
    }
    matched_skills = [skill for skill in student.skills if skill in mentor.skills]
    matched_goals = [task.value for task in student.tasks if TASK_TO_DIRECTION[task] in mentor.directions]
    return Scored(mentor, scores, matched_skills, matched_goals)


# ---------- Объяснение ----------


def reason_for(criterion: Criterion, scored: Scored, student: StudentProfile) -> str | None:
    mentor = scored.mentor
    if criterion == "skills" and scored.matched_skills:
        return "Владеет нужными навыками: " + ", ".join(skill.value for skill in scored.matched_skills)
    if criterion == "goals" and scored.matched_goals:
        return "Помогает с вашими задачами: " + ", ".join(goal.lower() for goal in scored.matched_goals)
    if criterion == "level":
        return f"Опыт {EXPERIENCE_LABELS[mentor.experience]} подходит для вашего уровня"
    if criterion == "availability":
        return f"Совпадает доступность: {AVAILABILITY_LABELS[mentor.availability]}"
    if criterion == "format":
        return f"Удобный формат: {FORMAT_LABELS[mentor.format]}"
    if criterion == "duration" and mentor.duration:
        return f"Готов заниматься {DURATION_MONTHS[mentor.duration]} мес. — как в вашей цели"
    if criterion == "domain":
        return f"Работает в вашей области: {mentor.position.value}"
    if criterion == "interests" and student.interests:
        return "Общие интересы с вашими"
    return None


def explain(scored: Scored, student: StudentProfile) -> list[str]:
    """Пункты «Почему подходит?»: критерии с наибольшим вкладом в итог."""
    ranked = sorted(scored.scores, key=lambda criterion: WEIGHTS[criterion] * scored.scores[criterion], reverse=True)
    reasons = []
    for criterion in ranked:
        if scored.scores[criterion] < REASON_THRESHOLD:
            continue
        reason = reason_for(criterion, scored, student)
        if reason:
            reasons.append(reason)
        if len(reasons) == MAX_REASONS:
            break
    return reasons


# ---------- Подбор ----------


def passes_filters(student: StudentProfile, mentor: MentorProfile) -> bool:
    """Жёсткие условия: общий язык и цена в пределах бюджета."""
    if student.language != mentor.language:
        return False
    return student.budget_to is None or mentor.price <= student.budget_to


class Recommender:
    def __init__(self, text: TextSimilarity | None = None) -> None:
        self.text = text or TrigramSimilarity()

    def rank(self, student: StudentProfile, mentors: list[MentorProfile], excluded: set[str] | None = None) -> list[Scored]:
        """Все подходящие наставники по убыванию совместимости, без порога."""
        excluded = excluded or set()
        scored = [
            score_mentor(student, mentor, self.text)
            for mentor in mentors
            if mentor.id not in excluded and passes_filters(student, mentor)
        ]
        # При равной совместимости выше тот, у кого надёжнее рейтинг
        scored.sort(
            key=lambda item: (round(item.total, 4), smoothed_rating(item.mentor.rating, item.mentor.reviews_count)),
            reverse=True,
        )
        return scored

    def recommend(self, request: RecommendationRequest) -> RecommendationResponse:
        ranked = self.rank(request.student, request.mentors, set(request.excluded_mentor_ids))
        recommendations = []
        for item in ranked:
            percent = round(item.total * 100)
            if percent < request.min_score:
                continue
            recommendations.append(
                Recommendation(
                    mentor_id=item.mentor.id,
                    score=percent,
                    factors=[
                        FactorContribution(criterion=criterion, score=round(score, 3), weight=WEIGHTS[criterion])
                        for criterion, score in item.scores.items()
                    ],
                    matched_skills=item.matched_skills,
                    matched_goals=item.matched_goals,
                    reasons=explain(item, request.student),
                )
            )
            if len(recommendations) == request.limit:
                break
        return RecommendationResponse(
            student_id=request.student.id,
            recommendations=recommendations,
            model_version=MODEL_VERSION,
        )
