"""База знаний чат-бота и поиск по ней.

Бэкенд может передать свою базу в запросе. Если не передал, используется
встроенная — те же материалы, что в админке и в боте на фронте.
"""

import math
import statistics
from dataclasses import dataclass

from kurator_ml.llm import Embeddings
from kurator_ml.schemas import KnowledgeDocument
from kurator_ml.text_similarity import TrigramSimilarity

DEFAULT_KNOWLEDGE = [
    KnowledgeDocument(
        id="request",
        title="Как отправить заявку наставнику",
        questions=["Как отправить заявку?", "Как выбрать ментора?", "Где кнопка «Отправить заявку»?"],
        answer="Откройте раздел «Менторы», выберите наставника и нажмите «Отправить заявку» в его карточке. "
        "Наставник получит уведомление и ответит в течение 2 дней.",
        audience="mentee",
    ),
    KnowledgeDocument(
        id="find-mentor",
        title="Как найти ментора",
        questions=["Как найти наставника?", "Как подобрать ментора?", "Где поиск менторов?"],
        answer="Откройте раздел «Менторы»: ИИ уже подобрал наставников под вашу анкету. "
        "Уточните выдачу фильтрами, а подходящих кандидатов добавьте в сравнение.",
        audience="mentee",
    ),
    KnowledgeDocument(
        id="reschedule",
        title="Как перенести встречу",
        questions=["Как перенести встречу?", "Можно ли поменять время встречи?"],
        answer="Откройте встречу в разделе «События» и нажмите «Перенести». Предупредите вторую сторону минимум за сутки.",
    ),
    KnowledgeDocument(
        id="meeting",
        title="Как назначить встречу",
        questions=["Как назначить встречу?", "Как созвониться?", "Как добавить встречу в календарь?"],
        answer="Откройте чат в «Сообщениях» и нажмите «Назначить встречу». "
        "Укажите тему, дату, время, длительность и формат — собеседник получит приглашение.",
    ),
    KnowledgeDocument(
        id="change-mentor",
        title="Как сменить наставника",
        questions=["Хочу другого наставника", "Как сменить ментора?"],
        answer="Напишите куратору через ИИ-бота или оставьте обращение в карточке пары. Куратор инициирует повторный подбор.",
        audience="mentee",
    ),
    KnowledgeDocument(
        id="price",
        title="Стоимость наставничества",
        questions=["Сколько стоит ментор?", "Наставничество платное?"],
        answer="Стоимость указана в карточке каждого ментора. "
        "Есть наставники, которые занимаются бесплатно — их можно найти через фильтр.",
    ),
    KnowledgeDocument(
        id="complaint",
        title="Как пожаловаться на пользователя",
        questions=["Как подать жалобу?", "Наставник ведёт себя некорректно"],
        answer="Откройте профиль пользователя и нажмите «Пожаловаться». Куратор рассмотрит жалобу в течение суток.",
    ),
    KnowledgeDocument(
        id="compatibility",
        title="Как считается совместимость",
        questions=["Как считается совместимость?", "Что значит процент совместимости?", "Как работает подбор?"],
        answer="ИИ сравнивает анкеты по навыкам, целям, интересам, уровню и опыту, графику, формату встреч, "
        "продолжительности и направлению. Каждый критерий даёт свой вклад, а итог показывается в процентах.",
    ),
    KnowledgeDocument(
        id="accept-request",
        title="Как принять заявку",
        questions=["Как принять заявку?", "Где новые запросы от менти?"],
        answer="Откройте заявку на главной в блоке «Новые запросы». Посмотрите анкету и процент совместимости, "
        "затем нажмите «Принять заявку». После этого откроются чат и контакты менти.",
        audience="mentor",
    ),
    KnowledgeDocument(
        id="rate-mentee",
        title="Как оценить менти",
        questions=["Как оценить менти?", "Как оставить отзыв о менти?"],
        answer="После создания пары в профиле менти появляется кнопка «Оценить». "
        "Поставьте общую оценку и оцените вовлечённость, выполнение заданий и пунктуальность.",
        audience="mentor",
    ),
]


@dataclass
class Found:
    document: KnowledgeDocument
    # Похожесть по буквам (триграммы), 0–1
    score: float
    # Похожесть по смыслу (косинус эмбеддингов); None — эмбеддинги не считались
    semantic: float | None = None


# Смысловая похожесть у mistral-embed на русском «шумная»: несвязанные фразы дают 0,68–0,76.
# Поэтому по смыслу только добираем кандидатов для модели, если материал заметно выше остальных
SEMANTIC_MIN = 0.75
SEMANTIC_MARGIN = 0.04
SEMANTIC_LIMIT = 2


def _cosine(left: list[float], right: list[float]) -> float:
    dot = sum(a * b for a, b in zip(left, right, strict=True))
    norm = math.sqrt(sum(a * a for a in left) * sum(b * b for b in right))
    return dot / norm if norm else 0.0


class KnowledgeSearch:
    """Ищет материалы, похожие на вопрос: по буквам, а с эмбеддингами — ещё и по смыслу."""

    def __init__(self, embeddings: Embeddings | None = None) -> None:
        self.similarity = TrigramSimilarity()
        self.embeddings = embeddings

    def score(self, question: str, document: KnowledgeDocument) -> float:
        # Формулировки важнее всего; ответ учитываем слабее, он длинный и общий
        phrases = [document.title, *document.questions]
        best_phrase = max(self.similarity.similarity(question, phrase) for phrase in phrases)
        in_answer = self.similarity.similarity(question, document.answer)
        return max(best_phrase, 0.8 * in_answer)

    def search(self, question: str, documents: list[KnowledgeDocument], role: str | None, limit: int = 3) -> list[Found]:
        visible = [doc for doc in documents if role is None or doc.audience in ("all", role)]
        found = [Found(doc, self.score(question, doc)) for doc in visible]
        found.sort(key=lambda item: item.score, reverse=True)
        return found[:limit]

    def candidates(self, question: str, documents: list[KnowledgeDocument], role: str | None, relevant: float) -> list[Found]:
        """Материалы для модели: похожие по буквам плюс заметно близкие по смыслу."""
        lexical = [item for item in self.search(question, documents, role) if item.score >= relevant]
        semantic = self._semantic(question, documents, role)
        chosen = {item.document.id: item for item in lexical}
        for item in semantic:
            if item.document.id in chosen:
                chosen[item.document.id].semantic = item.semantic
            else:
                chosen[item.document.id] = item
        return sorted(chosen.values(), key=lambda item: max(item.score, item.semantic or 0), reverse=True)

    def _semantic(self, question: str, documents: list[KnowledgeDocument], role: str | None) -> list[Found]:
        visible = [doc for doc in documents if role is None or doc.audience in ("all", role)]
        if self.embeddings is None or len(visible) < 2:
            return []
        phrases = [[doc.title, *doc.questions] for doc in visible]
        vectors = self.embeddings.embed([question, *(phrase for group in phrases for phrase in group)])
        if vectors is None:
            return []
        query, rest = vectors[0], iter(vectors[1:])
        scored = []
        for doc, group in zip(visible, phrases, strict=True):
            best = max(_cosine(query, next(rest)) for _ in group)
            scored.append(Found(doc, self.score(question, doc), best))
        median = statistics.median(item.semantic for item in scored)
        picked = [item for item in scored if item.semantic >= SEMANTIC_MIN and item.semantic - median >= SEMANTIC_MARGIN]
        picked.sort(key=lambda item: item.semantic, reverse=True)
        return picked[:SEMANTIC_LIMIT]
