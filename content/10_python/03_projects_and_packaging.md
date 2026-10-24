# Модули, окружения, packaging и CLI

Этап 3 основного маршрута Python для системного разработчика.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Чем модуль отличается от пакета и какую роль может выполнять `__init__.py`?

   **Ответ:** Модуль — единица импорта с namespace; package может содержать submodules и имеет package search path. Regular package обычно имеет __init__.py, namespace package может обходиться без него; init выполняет package initialization.

   **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

2. Как отличаются `import module` и `from module import name`?

   **Ответ:** `import module` связывает имя модуля, `from module import name` связывает текущий объект атрибута с локальным именем. Поздняя перепривязка module.name не перепривязывает уже импортированное имя автоматически.

   **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

3. Зачем нужен блок `if __name__ == "__main__"`?

   **Ответ:** Позволяет выполнять CLI entry code при запуске модуля как программы и не выполнять его при обычном import. Лучше вызывать `main()` и передавать её result в SystemExit.

   **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html); [Python 3.14: library/sys.html](https://docs.python.org/3.14/library/sys.html)

4. Какую задачу решает виртуальное окружение и что оно не изолирует?

   **Ответ:** Venv отделяет interpreter environment/site-packages, но не sandbox ОС, доступ к файлам, сеть или все native/system libraries. Окружение обычно пересоздают из требований, а не копируют между машинами.

   **Источник:** [Python 3.14: library/venv.html](https://docs.python.org/3.14/library/venv.html)

5. Зачем использовать `python -m pip` вместо предположения, что команда `pip` относится к нужному интерпретатору?

   **Ответ:** `python -m pip` запускает pip выбранным interpreter, уменьшая риск установки в другое окружение. Сам `python` всё равно должен быть нужным executable/venv.

   **Источник:** [Python 3.14: library/venv.html](https://docs.python.org/3.14/library/venv.html); [pip: Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/)

6. Для чего нужен `pyproject.toml` и какие категории настроек он может содержать?

   **Ответ:** Файл конфигурации project/build/tools: [build-system], [project], [tool.*] и другие стандартизованные таблицы. Наличие pyproject не означает автоматическое разрешение/lock всех зависимостей.

   **Источник:** [PyPA: pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/)

7. Чем импортируемое имя пакета может отличаться от имени дистрибутива при установке?

   **Ответ:** Distribution name задаёт установочный пакет/metadata, import name — Python namespace. Например distribution `Pillow` импортируется как PIL; механическое преобразование дефиса в underscore не универсально.

   **Источник:** [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/)

8. Какие задачи решает `argparse` в консольной программе?

   **Ответ:** Описывает аргументы, типы/choices, defaults, help и ошибки usage. Доменные/межполевые ограничения проверяются отдельно; bool флаги требуют подходящего action, а не type=bool.

   **Источник:** [Python 3.14: library/argparse.html](https://docs.python.org/3.14/library/argparse.html)

## Средний уровень — применение

9. Как формируется `sys.path` и почему локальный файл может затенить стандартный модуль?

   **Ответ:** Search path зависит от режима запуска, environment и installation, затем используется import machinery. Каталог script/current path может оказаться раньше stdlib: json.py затеняет json; смотреть module.__file__/spec.

   **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html); [Python 3.14: library/sys.html](https://docs.python.org/3.14/library/sys.html)

10. Как `sys.modules` влияет на повторный импорт модуля?

    **Ответ:** sys.modules кеширует modules по полному имени; повторный import обычно возвращает существующий object без нового выполнения тела. Удаление/перезагрузка не перепривязывают все старые references безопасно.

    **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

11. Как возникают циклические импорты и почему перенос импорта внутрь функции не всегда устраняет архитектурную причину?

    **Ответ:** A импортирует B, который читает ещё не инициализированный A. Перенос import откладывает проблему, но лучше выделить общие interfaces/data и уменьшить side effects/dependency cycles.

    **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

12. Чем `python script.py` отличается от `python -m package.module` для импортов и структуры приложения?

    **Ответ:** При script.py файл запускается как __main__ с script directory в search path; -m ищет module через import system и задаёт package context. Для package-relative imports использовать документированный module/entry-point запуск.

    **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

13. Что означает layout `src/` и от каких ошибок при тестировании он помогает защититься?

    **Ответ:** Исходники под src не импортируются случайно из repository root без установки. Тесты лучше проверяют installed distribution и включённые resources, хотя editable install всё ещё не заменяет wheel test.

    **Источник:** [PyPA: src and flat layouts](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/)

14. Чем build-system requirements отличаются от runtime dependencies и test dependencies?

    **Ответ:** Build requirements нужны backend/сборке в build environment, runtime dependencies — установленной программе, test dependencies — проверкам. Extras/dependency groups/build isolation имеют разные роли.

    **Источник:** [PyPA: pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/)

15. Чем wheel отличается от source distribution и когда пользователю потребуется компилятор?

    **Ответ:** Wheel — готовый installable artifact, в том числе platform/ABI-specific binary; sdist — исходники для сборки. Компилятор нужен при сборке native extension из source, но не для совместимого готового binary wheel.

    **Источник:** [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/)

16. Как editable install отличается от установки собранного wheel?

    **Ответ:** Editable связывает installation с working tree и может скрывать missing packaged files/build steps. Wheel фиксирует содержимое артефакта; проверить его в clean environment вне repo.

    **Источник:** [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/); [PyPA: src and flat layouts](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/)

17. Как передавать настройки через CLI, окружение и файл с предсказуемым порядком приоритетов?

    **Ответ:** Зафиксировать defaults < file < environment < explicit CLI; отличать «не передано» от False/0/пустой строки. После merge выполнить type/range/межполевую validation, secrets не выводить.

    **Источник:** [Python 3.14: library/argparse.html](https://docs.python.org/3.14/library/argparse.html); [PyPA: pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/)

18. Как выбрать коды завершения CLI и разделить диагностический вывод и данные результата?

    **Ответ:** 0 означает успех, ненулевые коды — документированные классы ошибок; argparse обычно использует 2 для usage. Машинный result в stdout, диагностика в stderr, исключения переводятся на CLI boundary.

    **Источник:** [Python 3.14: library/argparse.html](https://docs.python.org/3.14/library/argparse.html); [Python 3.14: library/sys.html](https://docs.python.org/3.14/library/sys.html)

## Сложный уровень — ограничения и проектирование

19. Какие сведения нужно фиксировать для воспроизводимого окружения и почему один список прямых зависимостей не решает задачу полностью?

    **Ответ:** Фиксировать Python/build/platform, весь resolved dependency graph, hashes/artifacts, native ABI/system libraries и toolchain. Только прямые зависимости не исключают дрейф transitive versions/build outcomes.

    **Источник:** [pip: Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/)

20. Чем constraints, требования зависимостей и lock-файл отличаются по назначению и области применения?

    **Ответ:** Requirements объявляют, что установить; constraints ограничивают версии, но сами не требуют installation. Lock фиксирует разрешённый набор/artefacts по правилам инструмента и платформы; переносимость lock не предполагается автоматически.

    **Источник:** [pip: Requirements and constraints](https://pip.pypa.io/en/stable/user_guide/#constraints-files); [pip: Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/)

21. Как проверить, что wheel работает вне каталога исходников, а тесты не импортируют случайную локальную копию?

    **Ответ:** Build wheel, установить без editable в новую venv, сменить cwd за пределы repo, проверить module.__file__ и CLI/resources. Тестовый runner не должен добавлять исходный src в sys.path.

    **Типичная ошибка:** Проверять только editable install из repository root.

    **Рекомендация:** Делать release smoke test из clean venv и другого cwd по собранному wheel.

    **Источник:** [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/); [PyPA: src and flat layouts](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/)

22. Как организовать необязательные зависимости, чтобы базовый импорт не требовал NumPy или native extension?

    **Ответ:** Объявить extras/optional dependencies и выполнять тяжёлый import только в соответствующей функции/адаптере. При отсутствии backend дать actionable error, не скрывая unrelated ImportError внутри установленной библиотеки.

    **Источник:** [PyPA: pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/); [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

23. Как `importlib.resources` помогает получать файлы пакета без предположения о текущем рабочем каталоге?

    **Ответ:** `files(package).joinpath(name)` обращается к packaged resources независимо от cwd; для реального Path использовать `as_file` в context. Ресурс может быть в archive, поэтому произвольный filesystem path не гарантирован.

    **Источник:** [Python 3.14: library/importlib.resources.html](https://docs.python.org/3.14/library/importlib.resources.html)

24. Какие проблемы возникают при выполнении сетевых запросов и запуске потоков на уровне импорта модуля?

    **Ответ:** Import получает побочные эффекты, задержки/ошибки сети, непредсказуемый shutdown/re-import и трудное тестирование. Инициализацию выполнять явно в main/startup/lifecycle, не запускать workers скрыто при import.

    **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

25. Как выпускать CLI для нескольких платформ, если часть функциональности зависит от Linux и C++ библиотеки?

    **Ответ:** Отделить portable core от Linux/native adapters, объявить supported Python/platform tags/extras и проверять installation matrix. Native wheels собираются под совместимые ABI, недоступные функции явно сообщают об ограничении.

    **Источник:** [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/); [pybind11: Build systems](https://pybind11.readthedocs.io/en/stable/compiling.html)

## Разбор кода

26. Почему импорт из установленного пакета не гарантирует нахождение файла и как изменить доступ к ресурсу?

   **Условие:**

   ```python
   from pathlib import Path

   def load_defaults():
       return Path("defaults.json").read_text()
   ```

    **Ответ:** Path относительно cwd не относится автоматически к каталогу package. Положить defaults в distribution и читать `importlib.resources.files(pkg).joinpath('defaults.json').read_text(encoding='utf-8')`.

    **Источник:** [Python 3.14: library/importlib.resources.html](https://docs.python.org/3.14/library/importlib.resources.html)

27. Какой объект изменится при присваивании и почему импортированное имя не становится автоматически связанным с последующими присваиваниями в модуле?

   **Условие:**

   ```python
   # settings.py
   LIMIT = 10

   # client.py
   from settings import LIMIT
   import settings
   settings.LIMIT = 20
   print(LIMIT, settings.LIMIT)
   ```

    **Ответ:** Меняется settings.LIMIT, локальный LIMIT остаётся связан со старым int: вывод `10 20`. Для актуального module state читать settings.LIMIT; для стабильной configuration лучше explicit settings object.

    **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

28. Почему булевый аргумент обрабатывается неожиданно и какой способ интерфейса лучше выбрать?

   **Условие:**

   ```python
   import argparse

   p = argparse.ArgumentParser()
   p.add_argument("--verbose", type=bool)
   print(p.parse_args(["--verbose", "false"]).verbose)
   ```

    **Ответ:** Будет True: `bool('false')` истинен как для непустой строки. Использовать `action='store_true'`/BooleanOptionalAction либо явный parser допустимых textual values.

    **Пример:**

    ```python
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", action=argparse.BooleanOptionalAction, default=False)
    assert parser.parse_args(["--no-verbose"]).verbose is False
    assert parser.parse_args(["--verbose"]).verbose is True
    ```

    **Источник:** [Python 3.14: library/argparse.html](https://docs.python.org/3.14/library/argparse.html)

29. Почему такой файл в рабочем каталоге мешает импортам и как обнаружить затенение?

   **Условие:**

   ```python
   # Имя текущего файла: json.py
   import json

   print(json.loads("{}"))
   ```

    **Ответ:** Локальный json.py импортируется вместо stdlib, иногда как partially initialized duplicate при запуске script. Переименовать файл и проверить `json.__file__`, sys.path и лишние cached artifacts.

    **Источник:** [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

30. Почему импорт этого модуля меняет поведение чужого приложения и где должна находиться настройка?

   **Условие:**

   ```python
   import logging

   logging.basicConfig(level=logging.DEBUG)
   print("module loaded")

   def run():
       pass
   ```

    **Ответ:** Import вызывает print и пытается настроить root logging, влияя на host application; basicConfig может ничего не сделать при существующих handlers. Библиотека использует getLogger(__name__), конфигурация/print — в CLI entry point.

    **Источник:** [Python 3.14: library/logging.html](https://docs.python.org/3.14/library/logging.html); [Python 3.14: reference/import.html](https://docs.python.org/3.14/reference/import.html)

## Практические задачи

31. Как упаковать маленький CLI в wheel, установить его в чистое окружение и проверить запуск из другого каталога?

    **Ответ:** Создать pyproject с backend/project metadata и [project.scripts] entry point, build wheel. В новой venv установить artifact, перейти в temporary directory и проверить command/help/exit/output, включая package resources.

    **Источник:** [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/); [PyPA: pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/)

32. Как организовать проект с `src/`, unit-тестами и отдельной командой запуска без модификации `sys.path` в тестах?

    **Ответ:** Code в src/package, tests с импортами public package API, pyproject с entry point и test dependencies. Установить проект, а release smoke test выполнять на wheel; не добавлять вручную repo paths.

    **Источник:** [PyPA: src and flat layouts](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/); [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/)

33. Как реализовать валидируемые настройки с приоритетом CLI → environment → file → defaults и тестами каждого уровня?

    **Ответ:** Parse CLI с sentinel для отсутствующих значений, environment преобразовать по схеме, загрузить bounded config, затем merge в заданном порядке. Parametrized tests проверяют каждое перекрытие, False/0, invalid input и отсутствие secrets в errors.

    **Источник:** [Python 3.14: library/argparse.html](https://docs.python.org/3.14/library/argparse.html); [pytest: Documentation](https://docs.pytest.org/en/stable/)

34. Как проверить установку пакета из sdist на машине без доступа к каталогу разработчика?

    **Ответ:** Собрать sdist, проверить содержимое, перенести только archive в чистую среду и установить/собрать wheel с объявленными build dependencies. Проверить resource files, native build и CLI без доступа к developer tree.

    **Источник:** [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/); [pip: Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/)

35. Как спроектировать CLI benchmark с машинным JSON-выводом, человекочитаемыми ошибками в stderr и документированными exit codes?

    **Ответ:** Entry main валидирует input, запускает работу и пишет один schema-versioned JSON result в stdout; logging/errors — stderr. Usage/runtime/timeout имеют документированные ненулевые codes и тесты subprocess boundary.

    **Источник:** [Python 3.14: library/argparse.html](https://docs.python.org/3.14/library/argparse.html); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html); [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html)

## Что прочитать

- [Python Packaging Guide](https://packaging.python.org/en/latest/tutorials/packaging-projects/)
- [Python: import system](https://docs.python.org/3.14/reference/import.html)
- [Python: argparse](https://docs.python.org/3.14/library/argparse.html)

[← Предыдущая тема](./02_protocols_and_resources.md) · [План раздела](./README.md) · [Следующая тема →](./04_data_and_linux.md)
