"""База знаний чат-бота и поиск по ней.

Бэкенд может передать свою базу в запросе. Если не передал, используется
встроенная — те же материалы, что в админке и в боте на фронте.
"""

from dataclasses import dataclass

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
    score: float


class KnowledgeSearch:
    """Ищет материалы, похожие на вопрос: по заголовку, формулировкам и тексту ответа."""

    def __init__(self) -> None:
        self.similarity = TrigramSimilarity()

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
