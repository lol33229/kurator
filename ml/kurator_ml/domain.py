"""Знания о предметной области, общие для подбора и генератора данных."""

from kurator_ml.options import (
    Availability,
    Deadline,
    Duration,
    Experience,
    Position,
    Skill,
    SkillLevel,
    StudentLevel,
)

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

# Порядок значений: чем больше число, тем выше уровень, опыт или срок
EXPERIENCE_RANK = {value: rank for rank, value in enumerate(Experience)}
STUDENT_LEVEL_RANK = {value: rank for rank, value in enumerate(StudentLevel)}
AVAILABILITY_RANK = {value: rank for rank, value in enumerate(Availability)}
DEADLINE_MONTHS = {Deadline.M1: 1, Deadline.M3: 3, Deadline.M6: 6, Deadline.M6_PLUS: 6}
DURATION_MONTHS = {Duration.M1: 1, Duration.M3: 3, Duration.M6: 6}

# Насколько уровень владения наставника закрывает навык ученика
SKILL_LEVEL_WEIGHT = {
    SkillLevel.BASIC: 0.6,
    SkillLevel.CONFIDENT: 0.8,
    SkillLevel.ADVANCED: 0.9,
    SkillLevel.EXPERT: 1.0,
}

# Минимальный стаж наставника для уровня ученика (ранг из EXPERIENCE_RANK)
MIN_EXPERIENCE_FOR_LEVEL = {
    StudentLevel.BEGINNER: 0,
    StudentLevel.BASIC: 1,
    StudentLevel.INTERMEDIATE: 2,
    StudentLevel.ADVANCED: 3,
}
