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


def test_recommendations_returns_ranked_mentors():
    mentors, students, _ = generate(mentors=20, students=1)
    body = {
        "student": students[0].model_dump(mode="json"),
        "mentors": [mentor.model_dump(mode="json") for mentor in mentors],
        "min_score": 0,
    }
    response = client.post("/recommendations", json=body)
    assert response.status_code == 200
    data = response.json()
    assert data["model_version"] == "v1-rules"
    assert data["recommendations"]
    first = data["recommendations"][0]
    assert {"mentor_id", "score", "factors", "matched_skills", "matched_goals", "reasons"} <= set(first)
    assert len(first["factors"]) == 8


def test_recommendations_rejects_unknown_skill():
    mentors, students, _ = generate(mentors=1, students=1)
    student = students[0].model_dump(mode="json")
    student["skills"] = ["Вязание"]
    body = {"student": student, "mentors": [mentors[0].model_dump(mode="json")]}
    assert client.post("/recommendations", json=body).status_code == 422


def test_moderation_rejects_bad_rating():
    body = {"review_id": "r1", "text": "Отличный наставник", "rating": 7}
    assert client.post("/moderation/review", json=body).status_code == 422


def test_local_site_on_any_port_can_call_service():
    for origin in ("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"):
        headers = {"Origin": origin, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type"}
        response = client.options("/chatbot/ask", headers=headers)
        assert response.status_code == 200
        assert response.headers["access-control-allow-origin"] == origin


def test_foreign_site_is_rejected():
    headers = {"Origin": "https://example.com", "Access-Control-Request-Method": "POST"}
    assert client.options("/chatbot/ask", headers=headers).status_code == 400
