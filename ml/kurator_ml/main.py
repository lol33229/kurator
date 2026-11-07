"""ML-сервис платформы «Куратор»."""

from fastapi import FastAPI, HTTPException

from kurator_ml import __version__
from kurator_ml.schemas import (
    ChatbotRequest,
    ChatbotResponse,
    RecommendationRequest,
    RecommendationResponse,
    ReviewModerationRequest,
    ReviewModerationResponse,
)

app = FastAPI(
    title="Куратор: ML-сервис",
    version=__version__,
    description="Подбор наставников, модерация отзывов и чат-бот по базе знаний.",
)

NOT_READY = "Будет реализовано на следующих этапах"


@app.get("/health", tags=["Служебное"])
def health() -> dict[str, str]:
    return {"status": "ok", "version": __version__}


@app.post("/recommendations", tags=["Подбор"], responses={501: {"description": NOT_READY}})
def recommend(request: RecommendationRequest) -> RecommendationResponse:
    """Ранжированный список наставников с процентом совместимости и объяснением."""
    raise HTTPException(status_code=501, detail=NOT_READY)


@app.post("/moderation/review", tags=["Модерация"], responses={501: {"description": NOT_READY}})
def moderate_review(request: ReviewModerationRequest) -> ReviewModerationResponse:
    """Решение по отзыву: опубликовать, отправить на ручную проверку или отклонить."""
    raise HTTPException(status_code=501, detail=NOT_READY)


@app.post("/chatbot/ask", tags=["Чат-бот"], responses={501: {"description": NOT_READY}})
def ask_chatbot(request: ChatbotRequest) -> ChatbotResponse:
    """Ответ по базе знаний куратора с источниками и уверенностью."""
    raise HTTPException(status_code=501, detail=NOT_READY)
