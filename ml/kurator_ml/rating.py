"""Рейтинг наставника со сглаживанием.

У новичка с одной пятёркой средняя оценка 5,0, но доверять ей рано. Байесовское
среднее подтягивает оценку к средней по платформе, пока отзывов мало.
"""

# Средняя оценка по платформе и вес «виртуальных» отзывов с этой оценкой
PLATFORM_MEAN = 4.3
PRIOR_WEIGHT = 5


def smoothed_rating(rating: float | None, reviews_count: int) -> float:
    if rating is None or reviews_count <= 0:
        return PLATFORM_MEAN
    return (PRIOR_WEIGHT * PLATFORM_MEAN + reviews_count * rating) / (PRIOR_WEIGHT + reviews_count)
