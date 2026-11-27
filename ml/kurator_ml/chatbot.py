"""Чат-бот по базе знаний.

1. Если пользователь просит живого человека — сразу передаём куратору.
2. Ищем похожие материалы: по буквам и, если есть эмбеддинги Mistral, по смыслу.
   Ничего похожего нет — передаём куратору.
3. Mistral формулирует ответ только по найденным материалам.
   Если модель не нашла ответа в них — передаём куратору.
4. Модель недоступна — отвечаем текстом материала, если он точно подходит.
"""

import re

from kurator_ml.knowledge import DEFAULT_KNOWLEDGE, Found, KnowledgeSearch
from kurator_ml.llm import Embeddings, LanguageModel, MistralClient, MistralEmbeddings
from kurator_ml.schemas import ChatbotRequest, ChatbotResponse, ChatbotSource

# Ниже — в базе нет ничего похожего, модель не спрашиваем
RELEVANT = 0.33
# Выше — материал точно про этот вопрос, можно ответить им без модели
CONFIDENT = 0.55
# В источники попадают материалы не дальше этого от лучшего
SOURCE_GAP = 0.1

NO_ANSWER = "НЕТ_ОТВЕТА"

HANDOFF_ANSWER = "Передал ваш вопрос куратору. Он ответит здесь же, в чате, в течение часа."
UNKNOWN_ANSWER = "Пока не знаю ответа на этот вопрос. Передал его куратору — он ответит здесь же, в чате."

# Просьба позвать человека: «куратор», «оператор», «живой человек», «поддержка»
HUMAN = re.compile(r"куратор|оператор|поддержк|жив\w* человек|(позов|позва|связ)\w*.{0,20}человек", re.IGNORECASE)

SYSTEM_PROMPT = f"""Ты ИИ-помощник платформы наставничества «Куратор».
Отвечай на русском, коротко (до 3 предложений), дружелюбно и на «вы».
Используй только факты из материалов базы знаний ниже. Не придумывай разделы, кнопки, сроки и цены.
Синонимы считай одним и тем же: встреча, созвон и занятие; ментор и наставник; ученик и менти.
Если материал отвечает на вопрос в общем виде (например, как перенести встречу, без конкретной даты) — ответь по нему.
Если в материалах совсем нет ответа на вопрос, ответь ровно словом {NO_ANSWER} и ничего больше."""


def _strength(item: Found) -> float:
    return max(item.score, item.semantic or 0.0)


def _context(found: list[Found]) -> str:
    return "\n\n".join(
        f"[{item.document.title}]\nПохожие вопросы: {'; '.join(item.document.questions)}\nОтвет: {item.document.answer}"
        for item in found
    )


class Chatbot:
    def __init__(self, model: LanguageModel | None = None, embeddings: Embeddings | None = None) -> None:
        self.model = model or MistralClient()
        # Свою модель подставляют в тестах — там без эмбеддингов, если их не передали явно
        if embeddings is None and model is None:
            embeddings = MistralEmbeddings()
        self.search = KnowledgeSearch(embeddings)

    def ask(self, request: ChatbotRequest) -> ChatbotResponse:
        question = request.question.strip()
        if HUMAN.search(question):
            return ChatbotResponse(answer=HANDOFF_ANSWER, sources=[], confidence=1.0, handoff_to_curator=True)

        documents = request.knowledge if request.knowledge is not None else DEFAULT_KNOWLEDGE
        found = self.search.candidates(question, documents, request.role, RELEVANT)
        if not found:
            return self._unknown(0.0)

        # Без модели отвечаем только по совпадению текста: смысловая похожесть слишком шумная
        best = max(found, key=lambda item: item.score)
        confidence = round(min(_strength(found[0]), 1.0), 2)
        reply = self.model.complete(SYSTEM_PROMPT, f"Материалы:\n{_context(found)}\n\nВопрос пользователя: {question}")

        if reply is None:
            # Модель недоступна: отвечаем материалом, только если он точно подходит
            if best.score >= CONFIDENT:
                return self._answer(best.document.answer, [best], confidence)
            return self._unknown(confidence)

        if NO_ANSWER in reply.upper():
            return self._unknown(confidence)
        return self._answer(reply, found, confidence)

    @staticmethod
    def _answer(text: str, found: list[Found], confidence: float) -> ChatbotResponse:
        # Модель видит до трёх материалов, а в источники идут только близкие к лучшему
        close = [item for item in found if _strength(item) >= _strength(found[0]) - SOURCE_GAP]
        sources = [
            ChatbotSource(document_id=item.document.id, title=item.document.title, fragment=item.document.answer[:200])
            for item in close
        ]
        return ChatbotResponse(answer=text, sources=sources, confidence=confidence, handoff_to_curator=False)

    @staticmethod
    def _unknown(confidence: float) -> ChatbotResponse:
        return ChatbotResponse(answer=UNKNOWN_ANSWER, sources=[], confidence=confidence, handoff_to_curator=True)
