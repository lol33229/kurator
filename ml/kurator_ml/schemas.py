"""Контракт API: что ML-сервис принимает и что отвечает."""

from typing import Literal

from pydantic import BaseModel, Field

from kurator_ml.options import (
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

# ---------- Профили ----------


class StudentProfile(BaseModel):
    """Анкета ученика. Фамилия и фото сюда не передаются."""

    id: str
    first_name: str
    age: int | None = Field(None, ge=14, le=100, description="Только с согласия пользователя")
    city: str
    language: Language
    skills: list[Skill] = Field(min_length=1)
    level: StudentLevel
    tasks: list[Task] = Field(min_length=1)
    format: Format
    availability: Availability
    budget_from: int | None = Field(None, ge=0, description="Рубли")
    budget_to: int | None = Field(None, ge=0, description="Рубли")
    goal: str = Field(max_length=1000)
    deadline: Deadline
    interests: list[str] = Field(default_factory=list, description="Поля пока нет в анкете")


class MentorProfile(BaseModel):
    id: str
    first_name: str
    city: str
    language: Language
    position: Position
    experience: Experience
    skills: dict[Skill, SkillLevel] = Field(min_length=1, description="Навык и уровень владения")
    directions: list[Direction] = Field(min_length=1)
    format: Format
    availability: Availability
    price_model: PriceModel
    price: int = Field(gt=0, description="Рубли")
    free_trial: bool = False
    duration: Duration | None = Field(None, description="Поля пока нет в анкете")
    about: str = Field("", max_length=2000, description="Поля пока нет в анкете")
    rating: float | None = Field(None, ge=1, le=5)
    reviews_count: int = Field(0, ge=0)
    completed_mentorships: int = Field(0, ge=0)


# ---------- Рекомендации ----------

Criterion = Literal[
    "skills",
    "goals",
    "interests",
    "level",
    "availability",
    "format",
    "duration",
    "domain",
]


class RecommendationRequest(BaseModel):
    student: StudentProfile
    mentors: list[MentorProfile] = Field(min_length=1)
    min_score: int = Field(60, ge=0, le=100, description="Порог совместимости, %")
    limit: int = Field(20, ge=1, le=100)
    # Наставники, с которыми уже были пары: для повторного подбора
    excluded_mentor_ids: list[str] = Field(default_factory=list)


class FactorContribution(BaseModel):
    criterion: Criterion
    score: float = Field(ge=0, le=1, description="Оценка критерия")
    weight: float = Field(ge=0, le=1, description="Вес критерия в итоге")


class Recommendation(BaseModel):
    mentor_id: str
    score: int = Field(ge=0, le=100, description="Совместимость, %")
    factors: list[FactorContribution]
    matched_skills: list[Skill]
    matched_goals: list[str] = Field(description="Совпавшие задачи и направления")
    reasons: list[str] = Field(description="Пункты блока «Почему подходит?»")


class RecommendationResponse(BaseModel):
    student_id: str
    recommendations: list[Recommendation] = Field(description="По убыванию совместимости")
    model_version: str


# ---------- Модерация ----------


class ReviewModerationRequest(BaseModel):
    review_id: str
    text: str = Field(min_length=1, max_length=5000)
    rating: int = Field(ge=1, le=5)


ModerationVerdict = Literal["publish", "manual_review", "reject"]
ModerationReason = Literal["toxicity", "spam", "personal_data"]


class ReviewModerationResponse(BaseModel):
    review_id: str
    verdict: ModerationVerdict
    reasons: list[ModerationReason]
    confidence: float = Field(ge=0, le=1)


# ---------- Чат-бот ----------


class ChatbotRequest(BaseModel):
    user_id: str
    question: str = Field(min_length=1, max_length=2000)


class ChatbotSource(BaseModel):
    document_id: str
    title: str
    fragment: str


class ChatbotResponse(BaseModel):
    answer: str
    sources: list[ChatbotSource]
    confidence: float = Field(ge=0, le=1)
    # Бот не уверен: фронт показывает кнопку «передать вопрос куратору»
    handoff_to_curator: bool
