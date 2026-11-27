"""Запросы к языковой модели Mistral.

Ключ берётся из переменной MISTRAL_API_KEY (файл ml/.env). Без ключа или при
ошибке сети клиент возвращает None, и бот отвечает без модели.
"""

import json
import logging
import os
import urllib.error
import urllib.request
from typing import Protocol

API_URL = "https://api.mistral.ai/v1/chat/completions"
DEFAULT_MODEL = "mistral-small-latest"
TIMEOUT_SECONDS = 20

log = logging.getLogger(__name__)


class LanguageModel(Protocol):
    def complete(self, system: str, user: str, json_mode: bool = False) -> str | None:
        """Ответ модели или None, если ответить не получилось. json_mode — ответ строго JSON-объектом."""
        ...


def read_key() -> str | None:
    # Кавычки вокруг значения в .env не должны стать частью ключа
    key = os.getenv("MISTRAL_API_KEY", "").strip().strip("\"'")
    return key or None


class MistralClient:
    def __init__(self, api_key: str | None = None, model: str | None = None) -> None:
        self.api_key = api_key if api_key is not None else read_key()
        self.model = model or os.getenv("MISTRAL_MODEL", DEFAULT_MODEL)

    def complete(self, system: str, user: str, json_mode: bool = False) -> str | None:
        if not self.api_key:
            return None
        body = {
            "model": self.model,
            "temperature": 0.2,
            "max_tokens": 400,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        }
        if json_mode:
            body["response_format"] = {"type": "json_object"}
        request = urllib.request.Request(
            API_URL,
            data=json.dumps(body).encode(),
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
                data = json.load(response)
            return data["choices"][0]["message"]["content"].strip()
        except urllib.error.HTTPError as error:
            # Текст ошибки без ключа: Mistral его не возвращает
            log.warning("Mistral ответил %s: %s", error.code, error.read()[:300])
        except (urllib.error.URLError, TimeoutError, KeyError, IndexError, ValueError) as error:
            log.warning("Mistral недоступен: %s", error)
        return None


EMBEDDINGS_URL = "https://api.mistral.ai/v1/embeddings"
EMBEDDING_MODEL = "mistral-embed"


class Embeddings(Protocol):
    def embed(self, texts: list[str]) -> list[list[float]] | None:
        """Векторы текстов в том же порядке или None, если посчитать не получилось."""
        ...


class MistralEmbeddings:
    """Векторы смысла фраз. Фразы базы знаний повторяются в каждом запросе — кэшируем их в памяти."""

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key if api_key is not None else read_key()
        self._cache: dict[str, list[float]] = {}

    def embed(self, texts: list[str]) -> list[list[float]] | None:
        if not self.api_key:
            return None
        missing = list(dict.fromkeys(text for text in texts if text not in self._cache))
        if missing:
            request = urllib.request.Request(
                EMBEDDINGS_URL,
                data=json.dumps({"model": EMBEDDING_MODEL, "input": missing}).encode(),
                headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            )
            try:
                with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
                    data = json.load(response)
                for text, item in zip(missing, data["data"], strict=True):
                    self._cache[text] = item["embedding"]
            except urllib.error.HTTPError as error:
                log.warning("Mistral embeddings ответил %s: %s", error.code, error.read()[:300])
                return None
            except (urllib.error.URLError, TimeoutError, KeyError, ValueError) as error:
                log.warning("Mistral embeddings недоступен: %s", error)
                return None
        return [self._cache[text] for text in texts]
