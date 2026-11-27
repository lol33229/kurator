"""ML-сервис платформы «Куратор»."""

import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from kurator_ml import __version__
from kurator_ml.chatbot import Chatbot
from kurator_ml.moderation import Moderator
from kurator_ml.recommender import Recommender
from kurator_ml.schemas import (
    ChatbotRequest,
    ChatbotResponse,
    RecommendationRequest,
    RecommendationResponse,
    ReviewModerationRequest,
    ReviewModerationResponse,
)

# Ключ Mistral лежит в ml/.env, в git он не попадает
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

app = FastAPI(
    title="Куратор: ML-сервис",
    version=__version__,
    description="Подбор наставников, модерация отзывов и чат-бот по базе знаний.",
)

# С каких адресов сайту можно обращаться к сервису напрямую (пока нет бэкенда).
# Локальный сайт — с любого порта: Vite берёт 5174 и дальше, если 5173 занят
CORS_ORIGINS = [origin for origin in os.getenv("ML_CORS_ORIGINS", "").split(",") if origin]
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

recommender = Recommender()
chatbot = Chatbot()
moderator = Moderator()


@app.get("/health", tags=["Служебное"])
def health() -> dict[str, str]:
    return {"status": "ok", "version": __version__}


@app.post("/recommendations", tags=["Подбор"])
def recommend(request: RecommendationRequest) -> RecommendationResponse:
    """Ранжированный список наставников с процентом совместимости и объяснением."""
    return recommender.recommend(request)


@app.post("/moderation/review", tags=["Модерация"])
def moderate_review(request: ReviewModerationRequest) -> ReviewModerationResponse:
    """Решение по отзыву: опубликовать, отправить на ручную проверку или отклонить."""
    return moderator.review(request)


@app.post("/chatbot/ask", tags=["Чат-бот"])
def ask_chatbot(request: ChatbotRequest) -> ChatbotResponse:
    """Ответ по базе знаний с источниками и уверенностью; если ответа нет — передаём куратору."""
    return chatbot.ask(request)
