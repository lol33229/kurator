import time

from kurator_ml.evaluate import evaluate, model_ranker
from kurator_ml.options import Availability, Experience, Format, Language, SkillLevel, StudentLevel
from kurator_ml.rating import PLATFORM_MEAN, smoothed_rating
from kurator_ml.recommender import (
    WEIGHTS,
    Recommender,
    availability_score,
    format_score,
    level_score,
    passes_filters,
    skills_score,
)
from kurator_ml.schemas import RecommendationRequest
from kurator_ml.synthetic import generate
from kurator_ml.text_similarity import TrigramSimilarity


def sample():
    mentors, students, truth = generate(mentors=5, students=1, seed=3, noise=0)
    return mentors[0], students[0]


def test_weights_sum_to_one():
    assert abs(sum(WEIGHTS.values()) - 1) < 1e-9


def test_skills_score_counts_mentor_level():
    mentor, student = sample()
    skill = student.skills[0]
    student = student.model_copy(update={"skills": [skill]})
    expert = mentor.model_copy(update={"skills": {skill: SkillLevel.EXPERT}})
    basic = mentor.model_copy(update={"skills": {skill: SkillLevel.BASIC}})
    without = mentor.model_copy(update={"skills": {s: SkillLevel.EXPERT for s in mentor.skills if s != skill} or {}})
    assert skills_score(student, expert) == 1.0
    assert skills_score(student, basic) == 0.6
    if without.skills:
        assert skills_score(student, without) == 0.0


def test_level_score_does_not_punish_extra_experience():
    mentor, student = sample()
    beginner = student.model_copy(update={"level": StudentLevel.BEGINNER})
    advanced = student.model_copy(update={"level": StudentLevel.ADVANCED})
    senior = mentor.model_copy(update={"experience": Experience.OVER_10})
    junior = mentor.model_copy(update={"experience": Experience.UNDER_1})
    assert level_score(beginner, senior) == 1.0
    assert level_score(advanced, junior) < 0.1


def test_format_and_availability_scores():
    mentor, student = sample()
    online = student.model_copy(update={"format": Format.ONLINE, "availability": Availability.H_1_2})
    assert format_score(online, mentor.model_copy(update={"format": Format.ONLINE})) == 1.0
    assert format_score(online, mentor.model_copy(update={"format": Format.MIXED})) == 0.5
    assert format_score(online, mentor.model_copy(update={"format": Format.OFFLINE})) == 0.0
    assert availability_score(online, mentor.model_copy(update={"availability": Availability.H_10_PLUS})) < 0.1


def test_filters_by_language_and_budget():
    mentor, student = sample()
    assert passes_filters(student, mentor)
    assert not passes_filters(student, mentor.model_copy(update={"language": Language.ZH}))
    assert not passes_filters(student.model_copy(update={"budget_to": mentor.price - 1}), mentor)


def test_text_similarity_handles_word_endings():
    text = TrigramSimilarity()
    close = text.similarity("Хочу развиваться в аналитике данных", "Аналитика данных")
    far = text.similarity("Хочу развиваться в аналитике данных", "Графический дизайн")
    assert close > far


def test_recommend_respects_request():
    mentors, students, _ = generate(mentors=50, students=1)
    student = students[0]
    excluded = mentors[0].id
    response = Recommender().recommend(
        RecommendationRequest(student=student, mentors=mentors, min_score=50, limit=5, excluded_mentor_ids=[excluded])
    )
    scores = [item.score for item in response.recommendations]
    assert len(scores) <= 5
    assert scores == sorted(scores, reverse=True)
    assert all(score >= 50 for score in scores)
    assert excluded not in {item.mentor_id for item in response.recommendations}


def test_explanation_is_short_and_free_of_sensitive_data():
    mentors, students, _ = generate(mentors=30, students=5)
    for student in students:
        response = Recommender().recommend(RecommendationRequest(student=student, mentors=mentors, min_score=0, limit=3))
        for item in response.recommendations:
            assert 1 <= len(item.reasons) <= 3
            assert all(str(student.age) not in reason for reason in item.reasons)


def test_rating_smoothing():
    assert smoothed_rating(None, 0) == PLATFORM_MEAN
    newcomer = smoothed_rating(5.0, 1)
    veteran = smoothed_rating(4.8, 60)
    assert PLATFORM_MEAN < newcomer < 5.0
    assert veteran > newcomer


def test_quality_on_synthetic_data():
    mentors, students, truth = generate(mentors=100, students=200, seed=7)
    answers = {item.student_id: item.mentor_id for item in truth}
    metrics = evaluate(model_ranker(Recommender()), mentors, students, answers)
    assert metrics.hit_rate_at_5 >= 0.85


def test_response_time_for_1000_mentors():
    mentors, students, _ = generate(mentors=1000, students=5, seed=11)
    recommender = Recommender()
    for student in students:
        started = time.perf_counter()
        recommender.recommend(RecommendationRequest(student=student, mentors=mentors))
        assert time.perf_counter() - started < 2


def test_free_mentor_is_accepted():
    mentors, students, _ = generate(mentors=3, students=1)
    free = mentors[0].model_copy(update={"price": 0})
    request = RecommendationRequest(student=students[0], mentors=[free, *mentors[1:]], min_score=0)
    ids = [item.mentor_id for item in Recommender().recommend(request).recommendations]
    assert free.id in ids
