"""Модерация отзывов.

1. Правила: мат и оскорбления, реклама со ссылками, контакты, оценка против текста.
   Явное нарушение — отклоняем сразу, сомнительное — на ручную проверку куратору.
2. Если правила ничего не нашли, текст проверяет Mistral: скрытая грубость,
   реклама и контакты, которые не ловятся словарём. Находка модели — тоже на ручную проверку.
3. Модель недоступна — чистый по правилам отзыв публикуем, но с меньшей уверенностью.
"""

import json
import re

from kurator_ml.llm import LanguageModel, MistralClient
from kurator_ml.schemas import ModerationReason, ReviewModerationRequest, ReviewModerationResponse

# Слова ищем с начала слова: «бля» не должно срабатывать на «употребляю»
PROFANITY = re.compile(r"\b(ху[йеёия]|пизд|ёб|еб[аеуи]|бля|сук[аи]|муд[аи]|гандон|пидор|залуп|шлюх)", re.IGNORECASE)
INSULT = re.compile(r"\b(идиот|дебил|туп(ой|ая|ое|ые|ица)|урод|кретин|придур|ничтожеств|бездар)", re.IGNORECASE)

LINK = re.compile(r"https?://|www\.|\b[\w-]+\.(ru|com|net|org|io|me|рф)\b", re.IGNORECASE)
PROMO = re.compile(r"промокод|скидк|заработ|казино|ставк[иа]|кредит|подпиш|переходи|пишите в (телеграм|тг|личку)", re.IGNORECASE)

PHONE = re.compile(r"(\+7|\b8)[\s\-(]*\d{3}[\s\-)]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
MESSENGER = re.compile(r"(?<![\w.])@[a-z0-9_]{4,}|t\.me/|wa\.me/|vk\.com/", re.IGNORECASE)

NEGATIVE = re.compile(r"ужасн|отвратит|кошмар|не рекомендую|худш|обман|зря потрат", re.IGNORECASE)
POSITIVE = re.compile(r"отличн|прекрасн|(?<!не )рекомендую|лучш(ий|ая) (наставник|ментор)|супер|спасибо огромное", re.IGNORECASE)

SYSTEM_PROMPT = """Ты модератор отзывов на платформе наставничества. Отзыв пишет участник пары о наставнике или ученике.
Проверь отзыв и ответь JSON-объектом с полями true/false:
- "toxicity": оскорбления, грубость, унижение, угрозы (критика по делу — не токсичность);
- "spam": реклама, ссылки на сторонние сервисы, призывы что-то купить или куда-то перейти;
- "personal_data": телефоны, почта, ники в мессенджерах, адреса, паспортные данные;
- "rating_mismatch": оценка явно противоречит тексту.
Отвечай только JSON без пояснений."""


def _rule_reasons(text: str, rating: int) -> tuple[list[ModerationReason], bool]:
    """Нарушения по правилам и признак, что отзыв надо отклонить сразу."""
    reasons: list[ModerationReason] = []
    reject = False
    if PROFANITY.search(text) or INSULT.search(text):
        reasons.append("toxicity")
        reject = True
    has_link, has_promo = bool(LINK.search(text)), bool(PROMO.search(text))
    if has_link or has_promo:
        reasons.append("spam")
        reject = reject or (has_link and has_promo)
    if PHONE.search(text) or EMAIL.search(text) or MESSENGER.search(text):
        reasons.append("personal_data")
    if (rating >= 4 and NEGATIVE.search(text)) or (rating <= 2 and POSITIVE.search(text) and not NEGATIVE.search(text)):
        reasons.append("rating_mismatch")
    return reasons, reject


def _parse_flags(reply: str) -> list[ModerationReason] | None:
    """Флаги из ответа модели; None — ответ не разобрать."""
    match = re.search(r"\{.*\}", reply, re.DOTALL)
    if not match:
        return None
    try:
        data = json.loads(match.group())
    except ValueError:
        return None
    flags: list[ModerationReason] = ["toxicity", "spam", "personal_data", "rating_mismatch"]
    return [flag for flag in flags if data.get(flag) is True]


class Moderator:
    def __init__(self, model: LanguageModel | None = None) -> None:
        self.model = model or MistralClient()

    def review(self, request: ReviewModerationRequest) -> ReviewModerationResponse:
        text = request.text.strip()
        reasons, reject = _rule_reasons(text, request.rating)

        def answer(verdict, found, confidence) -> ReviewModerationResponse:
            return ReviewModerationResponse(review_id=request.review_id, verdict=verdict, reasons=found, confidence=confidence)

        if reject:
            return answer("reject", reasons, 0.95)
        if reasons:
            return answer("manual_review", reasons, 0.8)

        reply = self.model.complete(SYSTEM_PROMPT, f"Оценка: {request.rating} из 5\nОтзыв: {text}", json_mode=True)
        flags = _parse_flags(reply) if reply is not None else None
        if flags is None:
            # Модель недоступна или ответила непонятно: по правилам чисто — публикуем
            return answer("publish", [], 0.6)
        if flags:
            return answer("manual_review", flags, 0.7)
        return answer("publish", [], 0.9)
