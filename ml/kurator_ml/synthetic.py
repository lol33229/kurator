"""Синтетические ученики и наставники для обучения и проверки подбора.

Каждый ученик строится от «целевого» наставника: навыки, задачи, формат и график
берутся у него с небольшим шумом. Поэтому для каждого ученика известен правильный
ответ, и можно считать, попал ли он в топ рекомендаций.

Запуск: python -m kurator_ml.synthetic --mentors 100 --students 300 --out data/synthetic
"""

import argparse
import json
import random
from pathlib import Path

from pydantic import BaseModel

from kurator_ml.options import (
    TASK_TO_DIRECTION,
    Availability,
    Deadline,
    Direction,
    Duration,
    Experience,
    Format,
    Language,
    Position,
    PriceModel,
    Skill,
    SkillLevel,
    StudentLevel,
    Task,
)
from kurator_ml.schemas import MentorProfile, StudentProfile

# Типичные навыки для каждой должности
POSITION_SKILLS: dict[Position, list[Skill]] = {
    Position.FRONTEND: [Skill.JAVASCRIPT, Skill.REACT, Skill.INTERFACES],
    Position.BACKEND: [Skill.PYTHON, Skill.CSHARP, Skill.SQL],
    Position.UX_UI: [Skill.INTERFACES, Skill.GRAPHIC_DESIGN],
    Position.GRAPHIC_DESIGNER: [Skill.GRAPHIC_DESIGN, Skill.INTERFACES, Skill.MARKETING],
    Position.DATA_ANALYST: [Skill.SQL, Skill.PYTHON, Skill.DATA_ANALYTICS],
    Position.ML_ENGINEER: [Skill.PYTHON, Skill.MACHINE_LEARNING, Skill.DATA_ANALYTICS],
    Position.QA: [Skill.PYTHON, Skill.SQL, Skill.JAVASCRIPT],
    Position.PROJECT_MANAGER: [Skill.PROJECT_MANAGEMENT, Skill.MARKETING],
    Position.MARKETER: [Skill.MARKETING, Skill.DATA_ANALYTICS, Skill.GRAPHIC_DESIGN],
    Position.TEAM_LEAD: [Skill.PROJECT_MANAGEMENT, Skill.PYTHON, Skill.JAVASCRIPT],
}

# Какой уровень ученика подходит к опыту наставника
LEVEL_BY_EXPERIENCE: dict[Experience, list[StudentLevel]] = {
    Experience.UNDER_1: [StudentLevel.BEGINNER],
    Experience.YEARS_1_3: [StudentLevel.BEGINNER, StudentLevel.BASIC],
    Experience.YEARS_3_5: [StudentLevel.BASIC, StudentLevel.INTERMEDIATE],
    Experience.YEARS_5_10: [StudentLevel.BASIC, StudentLevel.INTERMEDIATE, StudentLevel.ADVANCED],
    Experience.OVER_10: list(StudentLevel),
}

DEADLINE_BY_DURATION: dict[Duration, Deadline] = {
    Duration.M1: Deadline.M1,
    Duration.M3: Deadline.M3,
    Duration.M6: Deadline.M6,
}

CITIES = ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань", "Нижний Новгород"]
NAMES = ["Алексей", "Мария", "Иван", "Анна", "Дмитрий", "Елена", "Сергей", "Ольга", "Никита", "Дарья"]

GOAL_TEMPLATES = [
    "Хочу стать {position} и уверенно работать с {skills}",
    "Нужна помощь, чтобы подтянуть {skills} и перейти в профессию {position}",
    "Готовлюсь к работе {position}, хочу разобраться в {skills} на практике",
]

PRICE_RANGE = {
    PriceModel.HOUR: (1000, 5000),
    PriceModel.SESSION: (1500, 6000),
    PriceModel.PACKAGE: (8000, 30000),
    PriceModel.MONTH: (10000, 40000),
}


class GroundTruth(BaseModel):
    student_id: str
    mentor_id: str


def make_mentor(rng: random.Random, index: int) -> MentorProfile:
    position = rng.choice(list(Position))
    pool = POSITION_SKILLS[position]
    skills = rng.sample(pool, k=rng.randint(2, len(pool)))
    # Иногда у наставника есть навык не из своей области
    if rng.random() < 0.3:
        skills.append(rng.choice(list(Skill)))
    price_model = rng.choice(list(PriceModel))
    low, high = PRICE_RANGE[price_model]
    return MentorProfile(
        id=f"m{index:04d}",
        first_name=rng.choice(NAMES),
        city=rng.choice(CITIES),
        language=Language.RU if rng.random() < 0.9 else Language.EN,
        position=position,
        experience=rng.choice(list(Experience)),
        skills={skill: rng.choice(list(SkillLevel)) for skill in skills},
        directions=rng.sample(list(Direction), k=rng.randint(1, 3)),
        format=rng.choice(list(Format)),
        availability=rng.choice(list(Availability)),
        price_model=price_model,
        price=rng.randrange(low, high, 500),
        free_trial=rng.random() < 0.4,
        duration=rng.choice(list(Duration)),
        rating=round(rng.uniform(3.5, 5.0), 1),
        reviews_count=rng.randint(0, 60),
        completed_mentorships=rng.randint(0, 40),
    )


def make_student(rng: random.Random, index: int, target: MentorProfile, noise: float) -> StudentProfile:
    """Ученик, которому лучше всего подходит target; noise — доля случайно испорченных полей."""

    def noisy(value, options):
        return rng.choice(list(options)) if rng.random() < noise else value

    mentor_skills = list(target.skills)
    skills = rng.sample(mentor_skills, k=rng.randint(1, len(mentor_skills)))
    tasks = [task for task, direction in TASK_TO_DIRECTION.items() if direction in target.directions]
    tasks = rng.sample(tasks, k=rng.randint(1, len(tasks))) if tasks else [rng.choice(list(Task))]
    budget_to = target.price + rng.randrange(0, 5000, 500)
    goal = rng.choice(GOAL_TEMPLATES).format(
        position=target.position.value.lower(),
        skills=", ".join(skill.value for skill in skills),
    )
    return StudentProfile(
        id=f"s{index:04d}",
        first_name=rng.choice(NAMES),
        age=rng.randint(16, 45),
        city=noisy(target.city, CITIES),
        language=target.language,
        skills=skills,
        level=rng.choice(LEVEL_BY_EXPERIENCE[target.experience]),
        tasks=tasks,
        format=noisy(target.format, Format),
        availability=noisy(target.availability, Availability),
        budget_from=max(0, budget_to - 10000),
        budget_to=budget_to,
        goal=goal,
        deadline=DEADLINE_BY_DURATION[target.duration] if target.duration else Deadline.M3,
    )


def generate(mentors: int, students: int, seed: int = 42, noise: float = 0.15):
    rng = random.Random(seed)
    mentor_list = [make_mentor(rng, i) for i in range(mentors)]
    student_list, truth = [], []
    for i in range(students):
        target = rng.choice(mentor_list)
        student = make_student(rng, i, target, noise)
        student_list.append(student)
        truth.append(GroundTruth(student_id=student.id, mentor_id=target.id))
    return mentor_list, student_list, truth


def save(path: Path, items: list[BaseModel]) -> None:
    data = [item.model_dump(mode="json") for item in items]
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--mentors", type=int, default=100)
    parser.add_argument("--students", type=int, default=300)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--noise", type=float, default=0.15)
    parser.add_argument("--out", type=Path, default=Path("data/synthetic"))
    args = parser.parse_args()

    mentors, students, truth = generate(args.mentors, args.students, args.seed, args.noise)
    args.out.mkdir(parents=True, exist_ok=True)
    save(args.out / "mentors.json", mentors)
    save(args.out / "students.json", students)
    save(args.out / "ground_truth.json", truth)
    print(f"Сохранено в {args.out}: {len(mentors)} наставников, {len(students)} учеников")


if __name__ == "__main__":
    main()
