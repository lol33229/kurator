"""Смысловая близость текстов: цель ученика против профиля наставника.

Сейчас используется сравнение по буквенным триграммам: работает без сети и
устойчиво к окончаниям русских слов («аналитика» и «аналитике» близки).
"""

import math
import re
from collections import Counter
from typing import Protocol

WORD = re.compile(r"[a-zа-яё0-9#+]+")


class TextSimilarity(Protocol):
    def similarity(self, left: str, right: str) -> float:
        """Близость от 0 до 1."""
        ...


def _trigrams(text: str) -> Counter[str]:
    grams: Counter[str] = Counter()
    for word in WORD.findall(text.lower().replace("ё", "е")):
        padded = f" {word} "
        grams.update(padded[i : i + 3] for i in range(len(padded) - 2))
    return grams


class TrigramSimilarity:
    """Косинусная близость по триграммам; профили наставников кэшируются."""

    def __init__(self) -> None:
        self._cache: dict[str, tuple[Counter[str], float]] = {}

    def _vector(self, text: str) -> tuple[Counter[str], float]:
        cached = self._cache.get(text)
        if cached is None:
            grams = _trigrams(text)
            cached = (grams, math.sqrt(sum(count * count for count in grams.values())))
            self._cache[text] = cached
        return cached

    def similarity(self, left: str, right: str) -> float:
        (a, norm_a), (b, norm_b) = self._vector(left), self._vector(right)
        if not norm_a or not norm_b:
            return 0.0
        if len(a) > len(b):
            a, b = b, a
        dot = sum(count * b[gram] for gram, count in a.items())
        return dot / (norm_a * norm_b)
