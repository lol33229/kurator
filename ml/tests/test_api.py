from fastapi.testclient import TestClient

from kurator_ml.main import app
from kurator_ml.synthetic import generate

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_contract_is_published():
    paths = client.get("/openapi.json").json()["paths"]
    assert {"/recommendations", "/moderation/review", "/chatbot/ask"} <= set(paths)


def test_recommendations_accepts_valid_request():
    mentors, students, _ = generate(mentors=5, students=1)
    body = {
        "student": students[0].model_dump(mode="json"),
        "mentors": [mentor.model_dump(mode="json") for mentor in mentors],
    }
    # Запрос проходит проверку контракта, сам подбор ещё не реализован
    assert client.post("/recommendations", json=body).status_code == 501


def test_recommendations_rejects_unknown_skill():
    mentors, students, _ = generate(mentors=1, students=1)
    student = students[0].model_dump(mode="json")
    student["skills"] = ["Вязание"]
    body = {"student": student, "mentors": [mentors[0].model_dump(mode="json")]}
    assert client.post("/recommendations", json=body).status_code == 422


def test_moderation_rejects_bad_rating():
    body = {"review_id": "r1", "text": "Отличный наставник", "rating": 7}
    assert client.post("/moderation/review", json=body).status_code == 422
