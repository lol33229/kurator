from kurator_ml.options import TASK_TO_DIRECTION
from kurator_ml.synthetic import generate


def test_counts_and_unique_ids():
    mentors, students, truth = generate(mentors=50, students=200)
    assert len(mentors) == 50
    assert len(students) == len(truth) == 200
    assert len({mentor.id for mentor in mentors}) == 50
    assert len({student.id for student in students}) == 200


def test_same_seed_gives_same_data():
    first = generate(mentors=10, students=20, seed=7)
    second = generate(mentors=10, students=20, seed=7)
    assert first == second


def test_student_matches_target_mentor():
    mentors, students, truth = generate(mentors=30, students=100, noise=0)
    by_id = {mentor.id: mentor for mentor in mentors}
    for student, answer in zip(students, truth):
        target = by_id[answer.mentor_id]
        assert set(student.skills) <= set(target.skills)
        assert student.format == target.format
        assert student.availability == target.availability
        assert student.budget_to >= target.price
        mapped = {TASK_TO_DIRECTION[task] for task in student.tasks}
        # Задачи ученика либо совпадают с направлениями наставника, либо выбраны случайно
        assert mapped <= set(target.directions) or len(student.tasks) == 1
