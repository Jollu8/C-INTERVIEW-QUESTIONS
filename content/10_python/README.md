# Python для системного разработчика

Язык, автоматизация, тестирование и вычислительные эксперименты. Добавлено 395 вопросов и задач в 13 темах; ответы пока не добавлены. Основной маршрут рассчитан на C++/Linux, LTE/NR и развитие в GPU; backend выделен в дополнительную ветку.

| Этап | Темы | Практика и критерий освоения |
| --- | --- | --- |
| 1. Модель языка | Имена и объекты, identity/equality, mutability, hashability, области видимости, функции, аргументы, closures/decorators, comprehensions | Объяснить aliasing, default arguments и shallow/deep copy |
| 2. Протоколы и управление ресурсами | Classes, composition, MRO, dunder methods, iterators, generators, context managers, exceptions/chaining | Потоково прочитать файл с гарантированным закрытием ресурса |
| 3. Организация проекта | Modules/imports, environments, pip, pyproject.toml, packaging, CLI/configuration | Установить проект в чистое окружение и запустить CLI |
| 4. Данные и Linux | pathlib, JSON/CSV, bytes/bytearray/memoryview, struct, binary formats, subprocess, signals, sockets | Разобрать бинарный пакет с проверкой длины; запустить benchmark с timeout и обработкой exit code |
| 5. Качество | pytest, fixtures, parametrization, mocking boundaries, integration tests, typing, Protocol, dataclasses, logging/debugging | Проверить parser на повреждённых данных и типизировать интерфейс |
| 6. Concurrency | threading, processes, queues, synchronization, asyncio, cancellation, backpressure | Выбрать модель для I/O и CPU работы, объяснить расходы передачи данных |
| 7. NumPy и измерения | ndarray, dtype, shape/strides, views/copies, broadcasting, vectorization, profiling, memory | Сравнить цикл и NumPy; проверить результат, layout и расход памяти |
| 8. Интеграция C/C++ | ctypes, buffer protocol, pybind11, ownership/lifetime, ошибки на границе языков | Вызвать C++ обработку массива и обосновать lifetime буфера |
| 9. Инженерные эксперименты | Автоматизация сборок, серии benchmark, статистика, графики, воспроизводимость | Собрать результаты C++ программы и построить latency/throughput отчёт |

## Вопросы по темам

Основной маршрут — темы 1–9 (315 вопросов). Темы 10–13 — дополнительные ветки (80 вопросов). Разборы кода включают намеренные ошибки; не запускайте фрагменты вслепую.

| Тема | Вопросов |
| --- | ---: |
| [1. Модель языка, объекты и функции](./01_language_model.md) | 35 |
| [2. Протоколы, классы и управление ресурсами](./02_protocols_and_resources.md) | 35 |
| [3. Модули, окружения, packaging и CLI](./03_projects_and_packaging.md) | 35 |
| [4. Файлы, бинарные данные, процессы и Linux](./04_data_and_linux.md) | 35 |
| [5. Тестирование, typing и диагностика](./05_quality_typing_testing.md) | 35 |
| [6. Потоки, процессы и asyncio](./06_concurrency_asyncio.md) | 35 |
| [7. NumPy, память и производительность](./07_numpy_and_performance.md) | 35 |
| [8. Интеграция Python с C и C++](./08_cpp_integration.md) | 35 |
| [9. Автоматизация и воспроизводимые эксперименты](./09_engineering_experiments.md) | 35 |
| [10. Дополнительно: Python backend](./10_backend_optional.md) | 20 |
| [11. Дополнительно: обработка данных и pandas](./11_data_processing_optional.md) | 20 |
| [12. Дополнительно: безопасность Python-приложений](./12_security_optional.md) | 20 |
| [13. Дополнительно: модель объектов и CPython internals](./13_runtime_internals_optional.md) | 20 |

В тренажёре отключите фильтр «Только с ответами», чтобы видеть эти вопросы. Самостоятельно сформулируйте ответ, затем проверьте его по документации и эксперименту. Число вопросов не является оценкой глубины освоения.

## Как готовить вопросы

Для каждого этапа нужны объяснения, разбор кода и практические задачи. Указывайте версию Python; особенности CPython отделяйте от гарантий языка. GIL рассматривайте отдельно для обычной и free-threaded сборки: наличие GIL не устраняет необходимость синхронизации логических операций.

Не дублируйте asyncio в нескольких разделах: основы конкурентности → модель asyncio → прикладная задача. Profiling изучается как инструмент проверки гипотез, а не список названий утилит.

## Дополнительные ветки

- Backend: HTTP, WSGI/ASGI, framework, database access, background tasks.
- Data: pandas, большие наборы данных, streaming и форматы хранения.
- Security: недоверенная десериализация, shell injection, secrets и зависимости; базовые правила включаются и в основной маршрут.
- Runtime internals: reference counting, GC, descriptors, metaclasses — по необходимости и с привязкой к реализации.

Чтение: [Python Tutorial](https://docs.python.org/3/tutorial/), [Packaging Guide](https://packaging.python.org/en/latest/tutorials/packaging-projects/), [free threading](https://docs.python.org/3/howto/free-threading-python.html), [NumPy Learn](https://numpy.org/learn/), [pybind11](https://pybind11.readthedocs.io/en/stable/).
