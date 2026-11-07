"""Значения полей анкет. Совпадают с src/pages/onboarding/options.ts."""

from enum import StrEnum


class Language(StrEnum):
    RU = "ru"
    EN = "en"
    DE = "de"
    FR = "fr"
    ES = "es"
    ZH = "zh"


class Skill(StrEnum):
    INTERFACES = "Интерфейсы"
    GRAPHIC_DESIGN = "Графический дизайн"
    CSHARP = "C#"
    PYTHON = "Python"
    JAVASCRIPT = "JavaScript"
    REACT = "React"
    SQL = "SQL"
    DATA_ANALYTICS = "Аналитика данных"
    MACHINE_LEARNING = "Машинное обучение"
    PROJECT_MANAGEMENT = "Управление проектами"
    MARKETING = "Маркетинг"


class StudentLevel(StrEnum):
    BEGINNER = "beginner"
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class SkillLevel(StrEnum):
    """Уровень владения навыком у наставника."""

    BASIC = "basic"
    CONFIDENT = "confident"
    ADVANCED = "advanced"
    EXPERT = "expert"


class Task(StrEnum):
    NEW_PROFESSION = "Освоить новую профессию"
    INTERVIEW = "Подготовиться к собеседованию"
    WORK_PROJECT = "Разобраться в рабочем проекте"
    CAREER_PLAN = "Построить карьерный план"
    LEVEL_UP = "Прокачать навыки"
    FEEDBACK = "Получить обратную связь по работам"


class Direction(StrEnum):
    PROFESSION = "Освоение профессии"
    INTERVIEW = "Подготовка к собеседованию"
    CAREER = "Карьерный рост"
    REVIEW = "Ревью кода и работ"
    PROJECT = "Помощь с проектом"
    SOFT_SKILLS = "Soft skills"


# Задачи ученика и направления наставника названы по-разному
TASK_TO_DIRECTION: dict[Task, Direction] = {
    Task.NEW_PROFESSION: Direction.PROFESSION,
    Task.INTERVIEW: Direction.INTERVIEW,
    Task.WORK_PROJECT: Direction.PROJECT,
    Task.CAREER_PLAN: Direction.CAREER,
    Task.LEVEL_UP: Direction.REVIEW,
    Task.FEEDBACK: Direction.REVIEW,
}


class Position(StrEnum):
    FRONTEND = "Frontend-разработчик"
    BACKEND = "Backend-разработчик"
    UX_UI = "UX/UI-дизайнер"
    GRAPHIC_DESIGNER = "Графический дизайнер"
    DATA_ANALYST = "Аналитик данных"
    ML_ENGINEER = "ML-инженер"
    QA = "Тестировщик"
    PROJECT_MANAGER = "Проектный менеджер"
    MARKETER = "Маркетолог"
    TEAM_LEAD = "Тимлид"


class Experience(StrEnum):
    UNDER_1 = "<1"
    YEARS_1_3 = "1-3"
    YEARS_3_5 = "3-5"
    YEARS_5_10 = "5-10"
    OVER_10 = "10+"


class Format(StrEnum):
    ONLINE = "online"
    OFFLINE = "offline"
    MIXED = "mixed"


class Availability(StrEnum):
    """Часов в неделю."""

    H_1_2 = "1-2"
    H_3_5 = "3-5"
    H_6_10 = "6-10"
    H_10_PLUS = "10+"


class Deadline(StrEnum):
    """Срок цели ученика."""

    M1 = "1m"
    M3 = "3m"
    M6 = "6m"
    M6_PLUS = "6m+"


class Duration(StrEnum):
    """Срок, на который наставник готов брать ученика."""

    M1 = "1m"
    M3 = "3m"
    M6 = "6m"


class PriceModel(StrEnum):
    HOUR = "hour"
    SESSION = "session"
    PACKAGE = "package"
    MONTH = "month"
