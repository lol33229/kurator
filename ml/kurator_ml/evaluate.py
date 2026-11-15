"""Оценка подбора на синтетических данных.

Для каждого ученика известен «целевой» наставник. Считаем, насколько высоко он
оказался в выдаче, и сравниваем с простыми базовыми вариантами.

"""

import argparse
import math
import random
import time
from collections.abc import Callable
from dataclasses import dataclass

from kurator_ml.recommender import Recommender, passes_filters
from kurator_ml.schemas import MentorProfile, StudentProfile
from kurator_ml.synthetic import generate

Ranker = Callable[[StudentProfile, list[MentorProfile]], list[str]]


@dataclass
class Metrics:
    hit_rate_at_5: float
    mrr: float
    ndcg_at_10: float


def evaluate(ranker: Ranker, mentors: list[MentorProfile], students: list[StudentProfile], answers: dict[str, str]) -> Metrics:
    hits, reciprocal, ndcg = 0, 0.0, 0.0
    for student in students:
        ranking = ranker(student, mentors)
        target = answers[student.id]
        if target not in ranking:
            continue
        position = ranking.index(target) + 1
        hits += position <= 5
        reciprocal += 1 / position
        # Правильный ответ один, поэтому NDCG@10 = 1 / log2(позиция + 1)
        ndcg += 1 / math.log2(position + 1) if position <= 10 else 0
    count = len(students)
    return Metrics(hits / count, reciprocal / count, ndcg / count)


def model_ranker(recommender: Recommender) -> Ranker:
    return lambda student, mentors: [item.mentor.id for item in recommender.rank(student, mentors)]


# Базовые варианты фильтруют наставников так же, как модель, и отличаются только порядком


def candidates(student: StudentProfile, mentors: list[MentorProfile]) -> list[MentorProfile]:
    return [mentor for mentor in mentors if passes_filters(student, mentor)]


def skills_only_ranker(student: StudentProfile, mentors: list[MentorProfile]) -> list[str]:
    """Базовый вариант: только число совпавших навыков."""
    pool = candidates(student, mentors)
    ordered = sorted(pool, key=lambda mentor: len(set(student.skills) & set(mentor.skills)), reverse=True)
    return [mentor.id for mentor in ordered]


def random_ranker(seed: int) -> Ranker:
    rng = random.Random(seed)

    def rank(student: StudentProfile, mentors: list[MentorProfile]) -> list[str]:
        pool = [mentor.id for mentor in candidates(student, mentors)]
        return rng.sample(pool, len(pool))

    return rank


def measure_latency(recommender: Recommender, mentors: list[MentorProfile], students: list[StudentProfile]) -> float:
    """Самое долгое время одного подбора, в секундах."""
    slowest = 0.0
    for student in students:
        started = time.perf_counter()
        recommender.rank(student, mentors)
        slowest = max(slowest, time.perf_counter() - started)
    return slowest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--mentors", type=int, default=300)
    parser.add_argument("--students", type=int, default=500)
    parser.add_argument("--noise", type=float, default=0.15)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    mentors, students, truth = generate(args.mentors, args.students, args.seed, args.noise)
    answers = {item.student_id: item.mentor_id for item in truth}
    recommender = Recommender()

    rankers = {
        "Случайный порядок": random_ranker(args.seed),
        "Только навыки": skills_only_ranker,
        "Подбор v1": model_ranker(recommender),
    }
    print(f"{args.mentors} наставников, {args.students} учеников, шум {args.noise:.0%}\n")
    print(f"{'Вариант':<20}{'HitRate@5':>11}{'MRR':>8}{'NDCG@10':>10}")
    for name, ranker in rankers.items():
        metrics = evaluate(ranker, mentors, students, answers)
        print(f"{name:<20}{metrics.hit_rate_at_5:>11.3f}{metrics.mrr:>8.3f}{metrics.ndcg_at_10:>10.3f}")

    big_mentors, big_students, _ = generate(1000, 20, args.seed + 1, args.noise)
    slowest = measure_latency(Recommender(), big_mentors, big_students)
    print(f"\nСамый долгий подбор среди 1000 наставников: {slowest:.3f} с (требование ТЗ — не более 2 с)")


if __name__ == "__main__":
    main()
