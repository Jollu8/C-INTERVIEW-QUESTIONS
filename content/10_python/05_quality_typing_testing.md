# Тестирование, typing и диагностика

Этап 5 основного маршрута Python для системного разработчика.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Чем unit-тест отличается от интеграционного и как выбрать границу проверяемого компонента?

   **Ответ:** Unit проверяет ограниченный компонент с контролируемыми dependencies, integration — их настоящее взаимодействие. Граница следует риску/контракту: parser bytes→record и subprocess transport требуют разных проверок.

   **Источник:** [pytest: Documentation](https://docs.pytest.org/en/stable/)

2. Как устроены `assert` и проверка исключения через `pytest.raises`?

   **Ответ:** Assert проверяет наблюдаемый outcome, pytest показывает подробности failure. `with pytest.raises(ValueError, match=...):` ограничивает участок, который обязан выбросить ошибку; слишком широкий scope даёт ложный успех.

   **Источник:** [pytest: Documentation](https://docs.pytest.org/en/stable/)

3. Для чего нужны fixtures в pytest и чем fixture отличается от обычной функции-помощника?

   **Ответ:** Fixture внедряет подготовленную dependency, управляет scope/cache/teardown; helper вызывается явно и не участвует в lifecycle pytest. Yield fixture освобождает ресурс после теста, но acquisition до yield должна сама учитывать partial failure.

   **Источник:** [pytest: Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)

4. Как параметризация помогает проверять один контракт на нескольких наборах входных данных?

   **Ответ:** Parametrize запускает отдельный case для каждого набора параметров с отдельным result. Хорошие case IDs и boundaries помогают увидеть контракт; shared mutable input не копируется автоматически.

   **Источник:** [pytest: Parametrization](https://docs.pytest.org/en/stable/how-to/parametrize.html)

5. Что дают type hints и какие проверки они сами по себе не выполняют во время исполнения?

   **Ответ:** Hints помогают type checker/IDE и описывают intended API, но не включают runtime type enforcement. Проверять внешние bytes/JSON и бизнес-ограничения нужно явным validator.

   **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html)

6. Чем `list[int]` отличается от `int | None` в описании контракта функции?

   **Ответ:** `list[int]` — список целых элементов для static analysis, `int | None` — union числа и отсутствия значения. Ни один сам не преобразует вход и не гарантирует runtime валидность.

   **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html)

7. Какие методы и данные помогает описать `dataclass`?

   **Ответ:** Dataclass генерирует init/repr/equality и другие методы по fields/configuration. Validation, deep immutability и корректность business invariants не добавляются автоматически.

   **Источник:** [Python 3.14: library/dataclasses.html](https://docs.python.org/3.14/library/dataclasses.html)

8. Чем logging полезнее случайных `print` в библиотеке и приложении?

   **Ответ:** Logging даёт уровни, handlers, формат/context и управление выводом host application. Библиотека не должна печатать произвольные сообщения или сама навязывать global config.

   **Источник:** [Python 3.14: library/logging.html](https://docs.python.org/3.14/library/logging.html)

## Средний уровень — применение

9. Как scope fixture влияет на изоляцию тестов и разделяемое изменяемое состояние?

   **Ответ:** Function scope обычно изолирует mutable fixture на тест; module/session делит объект между тестами. Выбор более широкого scope требует reset/read-only contract, а не только ускорения setup.

   **Источник:** [pytest: Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)

10. Где нужно применять patch, чтобы заменить имя, которое действительно использует проверяемый модуль?

    **Ответ:** Patch применять в namespace, где код ищет имя. После `from transport import send` в service patch нужен `service.send`, а не только `transport.send`; проверить actual import/use.

    **Источник:** [Python 3.14: library/unittest.mock.html](https://docs.python.org/3.14/library/unittest.mock.html)

11. Как выбрать между mock, fake и реальным компонентом для теста subprocess или сетевого parser?

    **Ответ:** Mock полезен на узкой внешней boundary/error case, fake — для stateful контракта, real component — для encoding/transport/installation semantics. Не заменять всё, если тест перестаёт проверять нужное поведение.

    **Источник:** [Python 3.14: library/unittest.mock.html](https://docs.python.org/3.14/library/unittest.mock.html); [pytest: Documentation](https://docs.pytest.org/en/stable/)

12. Почему проверка деталей вызовов mock может дать хрупкий тест без проверки полезного поведения?

    **Ответ:** Вызов внутреннего helper может измениться при корректном refactor, а called=True не проверяет сохранённые данные/ошибки. Проверять public output/state/side effects и ограничивать mock assertions действительно значимым protocol.

    **Источник:** [Python 3.14: library/unittest.mock.html](https://docs.python.org/3.14/library/unittest.mock.html)

13. Как `Protocol` описывает структурный интерфейс и чем он отличается от обязательного наследования?

    **Ответ:** Protocol задаёт structural methods/attributes: соответствие возможно без explicit subclass. Static conformance не равно runtime validation; runtime_checkable проверяет ограниченную доступность members, не полные signatures/semantics.

    **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html)

14. Чем `TypedDict` отличается от `dataclass` для работы с данными, пришедшими из JSON?

    **Ответ:** TypedDict описывает dict shape для checker, runtime остаётся обычный dict без автоматической проверки. Dataclass создаёт instance с fields/methods; JSON нужно валидировать и явно преобразовать в модель.

    **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html); [Python 3.14: library/dataclasses.html](https://docs.python.org/3.14/library/dataclasses.html)

15. Что означают `Any`, `object`, `cast` и narrowing и чем они отличаются по роли в статическом анализе?

    **Ответ:** Any ослабляет проверку, object требует narrowing перед специфичными операциями. Cast сообщает checker предполагаемый тип без преобразования/проверки; narrowing выводит более узкий тип из проверок/control flow.

    **Типичная ошибка:** Использовать cast как parser или runtime type check.

    **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html)

16. Почему `frozen=True` у dataclass не делает автоматически неизменяемым весь граф вложенных объектов?

    **Ответ:** Frozen запрещает обычное присваивание dataclass fields, но вложенный list/dict остаётся mutable. Для глубокого immutable контракта нужны immutable constituents и контроль aliases.

    **Источник:** [Python 3.14: library/dataclasses.html](https://docs.python.org/3.14/library/dataclasses.html)

17. Как организовать logging библиотеки, не навязывая приложению handlers и уровень логирования?

    **Ответ:** `logger = logging.getLogger(__name__)`, у reusable library при необходимости NullHandler. Handlers/levels/format настраивает application entry point; secrets не логируются по умолчанию.

    **Источник:** [Python 3.14: library/logging.html](https://docs.python.org/3.14/library/logging.html)

18. Как сохранять traceback при логировании исключения и не выводить секретные данные?

    **Ответ:** В except использовать logger.exception или exc_info=True и безопасный контекст. Traceback/locals/payload могут раскрывать secrets, поэтому выбирать allowlisted fields и очищать сообщения вложенных exceptions.

    **Источник:** [Python 3.14: library/logging.html](https://docs.python.org/3.14/library/logging.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Сложный уровень — ограничения и проектирование

19. Как тестировать конкурентный код без предположения, что произвольный `sleep` гарантирует порядок событий?

    **Ответ:** Events/barriers/controlled futures задают порядок, timeouts ограничивают зависание, финальный join/await доказывает завершение. Sleep лишь меняет вероятность расписания и не является синхронизацией.

    **Источник:** [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html); [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

20. Как выбрать инварианты parser для property-based testing и сочетать их с фиксированными regression cases?

    **Ответ:** Round-trip encode/decode, независимость от chunk boundaries, bounded allocation, deterministic errors на malformed input. Property генератор покрывает широкое пространство, минимальные counterexamples сохраняются как regression cases.

    **Рекомендация:** Сохранять минимизированные counterexamples как фиксированные regression tests.

    **Источник:** [Hypothesis: Property-based testing](https://hypothesis.readthedocs.io/en/latest/)

21. Как организовать контрактные тесты для нескольких реализаций одного `Protocol`?

    **Ответ:** Одна contract suite параметризуется factories implementations и проверяет одинаковые public outcomes/ошибки/lifecycle. Protocol даёт shape, тесты — semantics; fake не должен иметь более слабый error/ordering contract.

    **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html); [pytest: Parametrization](https://docs.pytest.org/en/stable/how-to/parametrize.html)

22. Почему 100% coverage не гарантирует проверку поведения и как обнаружить пропущенные ветви требований?

    **Ответ:** Coverage показывает выполненные lines/branches, но не правильность oracle, data cases и внешние failures. Связать требования/инварианты с cases, использовать boundaries, negative tests и при необходимости mutation testing.

    **Источник:** [pytest: Documentation](https://docs.pytest.org/en/stable/)

23. Как различать flaky test, недетерминированный контракт и реальную гонку в реализации?

    **Ответ:** Зафиксировать seed/order/environment/trace, проверить, допускает ли контракт несколько outcomes. Flake может быть test isolation/timing, реальная гонка — нарушенный инвариант; воспроизводимость controlled scheduling помогает различить.

    **Источник:** [pytest: Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html); [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html)

24. Какие границы runtime validation нужны, если входные данные приходят извне, а внутри используется статическая типизация?

    **Ответ:** На ingress проверить schema/types/size/ranges и преобразовать в внутреннюю typed model. Не доверять annotations/cast/TypedDict как parser; validation нужна также после untyped/native interfaces.

    **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html); [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

25. Как расследовать утечку памяти, отделив удержание Python-объектов от памяти native-библиотеки и поведения allocator?

    **Ответ:** Tracemalloc snapshots показывают отслеженные Python allocations, referrers/lifetime — удержание; RSS/native профили показывают другие уровни. Cache/allocator retention и shared buffers не равны unreachable leak.

    **Источник:** [Python 3.14: library/tracemalloc.html](https://docs.python.org/3.14/library/tracemalloc.html); [Python 3.14: library/gc.html](https://docs.python.org/3.14/library/gc.html)

## Разбор кода

26. Почему разные экземпляры могут разделять список и какое объявление задаёт независимые значения?

   **Условие:**

   ```python
   from dataclasses import dataclass
   from typing import ClassVar

   @dataclass
   class Result:
       values: ClassVar[list[int]] = []

   a = Result()
   b = Result()
   a.values.append(1)
   print(b.values)
   ```

    **Ответ:** `ClassVar` делает values атрибутом класса, не instance field; вывод `[1]`. Нужен `values: list[int] = field(default_factory=list)` без ClassVar.

    **Пример:**

    ```python
    from dataclasses import dataclass, field

    @dataclass
    class Result:
        values: list[int] = field(default_factory=list)

    a, b = Result(), Result()
    a.values.append(1)
    assert b.values == []
    assert a.values is not b.values
    ```

    **Источник:** [Python 3.14: library/dataclasses.html](https://docs.python.org/3.14/library/dataclasses.html); [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html)

27. Какой тип напечатан на самом деле и почему аннотация или `cast` не валидирует вход?

   **Условие:**

   ```python
   from typing import cast

   value = cast(int, "42")
   print(type(value))
   ```

    **Ответ:** Напечатается `<class 'str'>`: cast вернул тот же объект. Для parsing нужен `int(text)` с обработкой ValueError, а для type guard — runtime проверка по контракту.

    **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html)

28. Что потеряется в диагностике ошибки и как сохранить связь с исходным исключением?

   **Условие:**

   ```python
   def parse(text):
       try:
           return int(text)
       except ValueError:
           raise RuntimeError("parse failed") from None
   ```

    **Ответ:** `from None` скрывает показ исходного ValueError как context, хотя metadata связи может оставаться. Захватить `as exc` и `raise RuntimeError(...) from exc`, либо bare raise для сохранения исходного типа.

    **Источник:** [Python 3.14: tutorial/errors.html](https://docs.python.org/3.14/tutorial/errors.html)

29. Почему fixture создаёт зависимость тестов от порядка запуска и как выбрать изоляцию?

   **Условие:**

   ```python
   # Этот фрагмент предназначен для pytest.
   import pytest

   @pytest.fixture(scope="module")
   def buffer():
       return []

   def test_add(buffer):
       buffer.append(1)

   def test_empty(buffer):
       assert buffer == []
   ```

    **Ответ:** Module fixture отдаёт один list: после test_add test_empty видит `[1]`. Выбрать function scope/new object на тест либо явный lifecycle reset для намеренно shared ресурса.

    **Источник:** [pytest: Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)

30. Почему такой тест не проверяет контракт функции и какие наблюдаемые результаты нужно проверить?

   **Условие:**

   ```python
   from unittest.mock import Mock

   store = Mock()
   store.save({"id": 7})
   assert store.save.called
   ```

    **Ответ:** Тест вызывает Mock напрямую и проверяет собственный вызов mock, не функцию приложения. Вызывать настоящую функцию и проверять state/result/arguments boundary и failure propagation; предпочтительно fake store для meaningful semantics.

    **Источник:** [Python 3.14: library/unittest.mock.html](https://docs.python.org/3.14/library/unittest.mock.html)

## Практические задачи

31. Как разработать набор тестов бинарного parser для пустого входа, границ длины, усечённого заголовка и повреждённого payload?

    **Ответ:** Parametrize valid/empty/header-minus-one/max/max+one/truncated/corrupt, проверять точный outcome и отсутствие непредусмотренного allocation. Добавить fragmentation/round-trip properties и отдельные regression cases.

    **Источник:** [pytest: Documentation](https://docs.pytest.org/en/stable/); [Hypothesis: Property-based testing](https://hypothesis.readthedocs.io/en/latest/)

32. Как описать `Protocol` хранилища результатов, создать in-memory fake и прогнать общие контрактные тесты?

    **Ответ:** Protocol с save/load и документированными not-found/duplicate semantics; in-memory fake повторяет их. Общую suite запускать на fake и real adapter factories, проверяя ownership/copy behavior и failures.

    **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html); [pytest: Parametrization](https://docs.pytest.org/en/stable/how-to/parametrize.html)

33. Как протестировать timeout запуска процесса без секундных ожиданий и без подмены всей бизнес-логики mock-объектами?

    **Ответ:** Внедрить subprocess runner и заставить fake бросить TimeoutExpired, оставив orchestration/serialization настоящими. Проверить status/artifacts/cleanup; отдельный короткий integration test покрывает реальную boundary без долгих sleep.

    **Источник:** [Python 3.14: library/unittest.mock.html](https://docs.python.org/3.14/library/unittest.mock.html); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

34. Как добавить типизацию к функции обработки JSON, отделив runtime validation от внутренней модели данных?

    **Ответ:** Внешнее значение объявить object, валидировать keys/types/ranges и возвращать dataclass/TypedDict по узкому API. Type checker проверяет внутренние branches; invalid payload cases подтверждают runtime boundary.

    **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html); [Python 3.14: library/dataclasses.html](https://docs.python.org/3.14/library/dataclasses.html)

35. Как организовать диагностический отчёт о падении benchmark с traceback, параметрами запуска и фильтрацией секретов?

    **Ответ:** Структурировать report status/exit code/run ID/safe parameters и traceback. Capture logs test проверяет наличие диагностической причины и отсутствие заранее заданных secret markers, включая exception messages.

    **Источник:** [Python 3.14: library/logging.html](https://docs.python.org/3.14/library/logging.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Что прочитать

- [pytest: fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)
- [Python: typing](https://docs.python.org/3.14/library/typing.html)
- [Python: dataclasses](https://docs.python.org/3.14/library/dataclasses.html)
- [Python: logging](https://docs.python.org/3.14/library/logging.html)

[← Предыдущая тема](./04_data_and_linux.md) · [План раздела](./README.md) · [Следующая тема →](./06_concurrency_asyncio.md)
