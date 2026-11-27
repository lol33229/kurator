import pytest
from fastapi.testclient import TestClient

from kurator_ml.main import app
from kurator_ml.moderation import Moderator
from kurator_ml.schemas import ReviewModerationRequest


class FakeModel:
    """Подменяет Mistral: отдаёт заданный JSON и считает вызовы."""

    def __init__(self, reply: str | None) -> None:
        self.reply = reply
        self.calls = 0

    def complete(self, system: str, user: str, json_mode: bool = False) -> str | None:
        self.calls += 1
        return self.reply


CLEAN = '{"toxicity": false, "spam": false, "personal_data": false, "rating_mismatch": false}'


def moderate(text: str, rating: int = 5, reply: str | None = CLEAN) -> tuple:
    model = FakeModel(reply)
    result = Moderator(model).review(ReviewModerationRequest(review_id="r1", text=text, rating=rating))
    return result, model


def test_clean_review_is_published():
    result, model = moderate("Анна помогла разобраться с pandas и подготовиться к стажировке, очень довольна.")
    assert result.verdict == "publish"
    assert result.reasons == []
    assert model.calls == 1


@pytest.mark.parametrize("text", ["Наставник просто идиот, ничего не объясняет", "Бля, опять перенёс встречу"])
def test_toxic_review_is_rejected_without_model(text):
    result, model = moderate(text, rating=1)
    assert result.verdict == "reject"
    assert "toxicity" in result.reasons
    assert model.calls == 0


def test_words_inside_other_words_are_not_toxic():
    # «употребляю», «оскорбления», «балл» не должны срабатывать
    result, _ = moderate("Употребляю термины правильно, оскорбления не терплю, ставлю высший балл")
    assert result.verdict == "publish"


def test_link_with_promo_is_spam():
    result, _ = moderate("Лучший курс тут: https://cheap-courses.ru, промокод SALE50", rating=5)
    assert result.verdict == "reject"
    assert "spam" in result.reasons


def test_contacts_go_to_manual_review():
    result, _ = moderate("Отличный наставник, пишите мне +7 912 345-67-89 или @ivan_mentor", rating=5)
    assert result.verdict == "manual_review"
    assert "personal_data" in result.reasons


def test_rating_against_text_goes_to_manual_review():
    result, _ = moderate("Ужасный опыт, не рекомендую никому", rating=5)
    assert result.verdict == "manual_review"
    assert result.reasons == ["rating_mismatch"]


def test_model_flags_hidden_problems():
    result, _ = moderate("Ну такой себе специалист, мягко говоря", rating=2, reply='{"toxicity": true, "spam": false}')
    assert result.verdict == "manual_review"
    assert result.reasons == ["toxicity"]


def test_without_model_clean_review_is_published_with_low_confidence():
    result, _ = moderate("Хорошие встречи, всё по делу", rating=4, reply=None)
    assert result.verdict == "publish"
    assert result.confidence < 0.9


def test_endpoint(monkeypatch):
    import kurator_ml.main as main

    monkeypatch.setattr(main, "moderator", Moderator(FakeModel(CLEAN)))
    response = TestClient(app).post("/moderation/review", json={"review_id": "r9", "text": "Спасибо за помощь!", "rating": 5})
    assert response.status_code == 200
    assert response.json() == {"review_id": "r9", "verdict": "publish", "reasons": [], "confidence": 0.9}
