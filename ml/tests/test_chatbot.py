from fastapi.testclient import TestClient

from kurator_ml.chatbot import NO_ANSWER, Chatbot
from kurator_ml.llm import MistralClient
from kurator_ml.main import app
from kurator_ml.schemas import ChatbotRequest, KnowledgeDocument


class FakeModel:
    """Подменяет Mistral: отдаёт заданный ответ и запоминает запрос."""

    def __init__(self, reply: str | None) -> None:
        self.reply = reply
        self.prompts: list[str] = []

    def complete(self, system: str, user: str, json_mode: bool = False) -> str | None:
        self.prompts.append(user)
        return self.reply


def ask(question: str, model: FakeModel, **extra) -> tuple:
    response = Chatbot(model).ask(ChatbotRequest(user_id="u1", question=question, **extra))
    return response, model


def test_answers_with_model_and_sources():
    response, model = ask("Как сменить наставника?", FakeModel("Напишите куратору, он запустит повторный подбор."))
    assert not response.handoff_to_curator
    assert response.answer.startswith("Напишите куратору")
    assert response.sources[0].document_id == "change-mentor"
    # В модель уходят найденные материалы, а не вся база
    assert "Как сменить наставника" in model.prompts[0]


def test_asking_for_human_hands_off_without_model():
    response, model = ask("Позовите, пожалуйста, живого человека", FakeModel("ответ"))
    assert response.handoff_to_curator
    assert model.prompts == []


def test_unrelated_question_hands_off_without_model():
    response, model = ask("Где посмотреть запись вебинара?", FakeModel("ответ"))
    assert response.handoff_to_curator
    assert model.prompts == []


def test_model_without_answer_hands_off():
    response, _ = ask("Можно перенести созвон на завтра?", FakeModel(NO_ANSWER))
    assert response.handoff_to_curator
    assert response.sources == []


def test_without_model_answers_only_close_match():
    exact, _ = ask("Как отправить заявку наставнику?", FakeModel(None))
    assert not exact.handoff_to_curator
    assert exact.answer.startswith("Откройте раздел «Менторы»")

    vague, _ = ask("Можно перенести созвон на завтра?", FakeModel(None))
    assert vague.handoff_to_curator


def test_role_hides_other_materials():
    # «Как принять заявку» — материал для менторов, менти его не видит
    response, model = ask("Как принять заявку?", FakeModel(None), role="mentee")
    assert all(source.document_id != "accept-request" for source in response.sources)


def test_knowledge_from_backend_replaces_default():
    docs = [KnowledgeDocument(id="kb1", title="Как удалить аккаунт", questions=["Удалить профиль"], answer="Напишите в поддержку.")]
    response, _ = ask("Как удалить аккаунт?", FakeModel(None), knowledge=docs)
    assert response.sources[0].document_id == "kb1"


def test_key_quotes_are_stripped(monkeypatch):
    monkeypatch.setenv("MISTRAL_API_KEY", '"abc123"')
    assert MistralClient().api_key == "abc123"


def test_endpoint_works_without_key(monkeypatch):
    monkeypatch.delenv("MISTRAL_API_KEY", raising=False)
    import kurator_ml.main as main

    monkeypatch.setattr(main, "chatbot", Chatbot(FakeModel(None)))
    response = TestClient(app).post("/chatbot/ask", json={"user_id": "u1", "question": "Как оценить менти?"})
    assert response.status_code == 200
    assert response.json()["sources"][0]["document_id"] == "rate-mentee"


class FakeEmbeddings:
    """Подменяет эмбеддинги: всё про перенос встреч — один вектор, остальное — другой."""

    def embed(self, texts: list[str]) -> list[list[float]]:
        about_move = ("перенес", "сдвинуть", "поменять время")
        return [[1.0, 0.0] if any(word in text.lower() for word in about_move) else [0.0, 1.0] for text in texts]


PARAPHRASE = "Не успеваю на занятие, можно его сдвинуть?"


def test_semantic_search_finds_paraphrase():
    model = FakeModel("Откройте встречу в разделе «События» и нажмите «Перенести».")
    response = Chatbot(model, FakeEmbeddings()).ask(ChatbotRequest(user_id="u1", question=PARAPHRASE))
    assert not response.handoff_to_curator
    assert response.sources[0].document_id == "reschedule"


def test_without_embeddings_paraphrase_goes_to_curator():
    model = FakeModel("ответ")
    response = Chatbot(model).ask(ChatbotRequest(user_id="u1", question=PARAPHRASE))
    assert response.handoff_to_curator
    assert model.prompts == []
