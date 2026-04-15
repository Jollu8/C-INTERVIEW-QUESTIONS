# C++ INTERVIEW-QUESTIONS

[![CI](https://github.com/Jollu8/C-INTERVIEW-QUESTIONS/actions/workflows/ci.yml/badge.svg)](https://github.com/Jollu8/C-INTERVIEW-QUESTIONS/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Tests](https://img.shields.io/badge/tests-pytest-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Status](https://img.shields.io/badge/status-in%20progress-orange)

````markdown
## C++ INTERVIEW-QUESTIONS

Структурированный сборник 20000+ вопросов и материалов для подготовки к техническим собеседованиям.

Репозиторий охватывает не только C/C++, но и широкий инженерный стек:
алгоритмы, concurrency, Linux, networking, инструменты разработки, тестирование, архитектуру, базы данных и Python.

---

## 🚀 Quick Start

```bash
# 1. Установить зависимости
pip install -r requirements.txt

# 2. Сгенерировать индекс
python scripts/build_index.py

# 3. Посчитать статистику
python scripts/stats.py

# 4. Проверить ссылки
python scripts/validate_links.py

# 5. Проверить метаданные
python scripts/validate_meta.py

# 6. Запустить тесты
pytest
````

---

## 📌 О проекте

Это не просто список вопросов, а **структурированная база знаний**.

Особенность проекта:

* вопросы идут последовательно;
* темы углубляются постепенно;
* допускаются повторения для закрепления;
* структура важнее "уникальности каждого вопроса".

Большинство вопросов:

* собраны из открытых источников;
* дополнены и расширены;
* частично сгенерированы с помощью ИИ.

---

## 🧠 Тематические разделы

* [01_cpp](./content/01_cpp/README.md) — C/C++
* [02_algorithms_and_ds](./content/02_algorithms_and_ds/README.md) — алгоритмы
* [03_concurrency](./content/03_concurrency/README.md) — многопоточность
* [04_system_linux](./content/04_system_linux/README.md) — Linux / system
* [05_networking](./content/05_networking/README.md) — сети
* [06_tools_build_debug](./content/06_tools_build_debug/README.md) — инструменты
* [07_testing_and_quality](./content/07_testing_and_quality/README.md) — тестирование
* [08_architecture_and_design](./content/08_architecture_and_design/README.md) — архитектура
* [09_database_and_storage](./content/09_database_and_storage/README.md) — базы данных
* [10_python](./content/10_python/README.md) — Python

---

## ⚙️ Как работает репозиторий

Проект содержит не только контент, но и пайплайн обработки:

### 1. Индексация

```bash
python scripts/build_index.py
```

* сканирует `content/**/*.md`
* извлекает:

    * заголовки
    * ссылки
    * количество вопросов
* формирует `generated/index.json`

---

### 2. Статистика

```bash
python scripts/stats.py
```

Генерирует:

* общее количество тем
* количество вопросов
* распределение по секциям

→ `generated/stats.json`

---

### 3. Валидация ссылок

```bash
python scripts/validate_links.py
```

Проверяет:

* все локальные markdown-ссылки
* отсутствие битых путей

---

### 4. Валидация метаданных

```bash
python scripts/validate_meta.py
```

Проверяет:

* структуру `index.json`
* обязательные поля
* уникальность `id`
* существование файлов

---

### 5. Тесты

```bash
pytest
```

Покрывают:

* структуру проекта
* ссылки
* уникальность id
* консистентность данных

---

## 📂 Структура репозитория

```text
content/        — вопросы и темы
generated/      — сгенерированные артефакты
schemas/        — JSON schema
scripts/        — утилиты
templates/      — шаблоны
tests/          — проверки
```

---

## ➕ Как добавить новый вопрос

1. Используй шаблон:

```
templates/question_file.md
```

2. Размести файл в нужной секции:

```
content/<section>/<topic>.md
```

3. После добавления:

```bash
python scripts/build_index.py
python scripts/validate_meta.py
pytest
```

---

## 🛠 Требования

* Python 3.10+
* pip

---

## 🤝 Contribution

См. `CONTRIBUTING.md`

---

## ⚠️ Важно

В репозитории могут встречаться:

* Undefined Behavior
* tricky cases
* неоднозначные вопросы

Это сделано намеренно для глубины понимания.

---

## 🙏 Благодарности

ИИ использовался для:

* редактирования текста
* переформулирования
* генерации части вопросов
* структурирования проекта

