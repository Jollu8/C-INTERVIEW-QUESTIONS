# Протоколы, классы и управление ресурсами

Этап 2 основного маршрута Python для системного разработчика.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Чем класс отличается от экземпляра и где обычно хранятся атрибуты экземпляра?

   **Ответ:** Класс задаёт поведение/тип, instance — конкретный объект. Атрибуты часто лежат в instance `__dict__`, но slots/descriptors и builtins используют другую организацию.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: tutorial/classes.html](https://docs.python.org/3.14/tutorial/classes.html)

2. Чем атрибут класса отличается от атрибута экземпляра?

   **Ответ:** Class attribute найден через класс/MRO и может разделяться всеми instances; instance attribute принадлежит конкретному объекту и обычно shadow одноимённый class attribute. Mutable class value не копируется при создании instance.

   **Источник:** [Python 3.14: tutorial/classes.html](https://docs.python.org/3.14/tutorial/classes.html)

3. Какие задачи решают `__init__`, `__repr__` и `__str__`?

   **Ответ:** `__init__` инициализирует уже созданный объект; `__repr__` — диагностическое представление, `__str__` — человекочитаемое. `__init__` не должен возвращать созданный объект.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

4. Чем iterable отличается от iterator и как с ними связан цикл `for`?

   **Ответ:** Iterable позволяет получить iterator через `iter`; iterator имеет `__next__` и `__iter__`, возвращающий себя. `for` получает iterator и вызывает next до StopIteration.

   **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html); [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

5. Как `yield` меняет поведение функции и когда начинается выполнение генератора?

   **Ответ:** Вызов generator function возвращает generator без выполнения тела; первый next/send запускает его до yield. Между yield сохраняются frame/locals, завершение сообщает StopIteration.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

6. Какую задачу решает `with` и какие методы реализуют протокол context manager?

   **Ответ:** `with` вызывает `__enter__`, затем `__exit__` после body при обычном выходе/исключении. Он задаёт явную границу cleanup, но не обещает выполнение при принудительном завершении процесса.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html)

7. Чем `raise` отличается от `return` при обработке ошибки?

   **Ответ:** `raise` прерывает normal flow и передаёт exception handlers, `return` успешно завершает функцию значением. Возврат error-object не делает его исключением и требует иного API контракта.

   **Источник:** [Python 3.14: tutorial/errors.html](https://docs.python.org/3.14/tutorial/errors.html)

8. Как связаны `try`, `except`, `else` и `finally` и когда выполняется каждый блок?

   **Ответ:** try выполняет защищённый код, except — подходящий handler, else — код при отсутствии exception в try, finally — cleanup при выходе. Исключение в else не обрабатывается preceding except этого try.

   **Источник:** [Python 3.14: tutorial/errors.html](https://docs.python.org/3.14/tutorial/errors.html)

## Средний уровень — применение

9. Как выбрать между наследованием и композицией при реализации источника данных?

   **Ответ:** Composition удобна для заменяемого transport/source dependency; inheritance — когда действительно нужен subtype с совместимым контрактом. При выборе учитывать shared state, extension points и тестирование fake источником.

   **Источник:** [Python 3.14: tutorial/classes.html](https://docs.python.org/3.14/tutorial/classes.html); [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html)

10. Как MRO определяет поиск методов и почему `super()` не означает просто вызов непосредственного родителя?

    **Ответ:** MRO задаёт линеаризацию поиска методов; `super()` продолжает поиск после текущего класса в MRO конкретного instance. При multiple inheritance следующий метод может принадлежать не непосредственному parent.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: tutorial/classes.html](https://docs.python.org/3.14/tutorial/classes.html)

11. Когда использовать `property`, а когда оставить обычный атрибут или метод?

    **Ответ:** Property подходит для атрибута с проверкой/вычислением при сохранении attribute API. Явный метод лучше для дорогого действия/side effects; простой атрибут достаточно без дополнительных правил.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

12. Как `__getattr__` отличается от `__getattribute__` и где легко создать рекурсию?

    **Ответ:** `__getattribute__` вызывается для обычного чтения атрибутов, `__getattr__` — как fallback при AttributeError. Внутри первого использовать `object.__getattribute__`, а не `self.name` для того же поиска.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

13. Чем повторно итерируемая коллекция отличается от одноразового итератора в контракте функции?

    **Ответ:** Коллекция обычно выдаёт новый iterator на каждый проход, iterator истощается и не обязан reset. API с несколькими проходами требует collection/factory либо явной материализации с memory budget.

    **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

14. Как `yield from` помогает делегировать работу другому генератору?

    **Ответ:** `yield from` передаёт iteration, send/throw/close и возвращаемое значение подгенератору. Это полноценная делегация generator protocol, а не только ручной цикл yield.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

15. Когда генератор освобождает ресурс и почему нельзя полагаться только на его финализацию?

    **Ответ:** Cleanup в finally выполняется при завершении/явном close, но ранний break не гарантирует close произвольного generator. Ресурс лучше держать во внешнем with/contextmanager или explicit closing.

    **Источник:** [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html); [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

16. Как `contextlib.contextmanager` преобразует генератор в менеджер контекста?

    **Ответ:** Декорированный generator выполняет acquisition до единственного yield, отдаёт value в as и cleanup после. Исключение body вводится в yield через throw; если поймать его и не re-raise, оно подавится.

    **Источник:** [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html)

17. Что означает возврат истинного значения из `__exit__` при исключении?

    **Ответ:** Истинный результат `__exit__` подавляет exception body. Возвращать его следует только для намеренно обработанного класса ошибок, иначе диагностика теряется.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html)

18. Чем `raise`, `raise error` и `raise NewError(...) from error` отличаются для диагностики ошибки?

    **Ответ:** Bare raise повторно поднимает текущую ошибку; `raise error` добавляет место явного raise к traceback. `raise NewError(...) from error` сохраняет explicit cause; `from None` скрывает показ implicit context.

    **Источник:** [Python 3.14: tutorial/errors.html](https://docs.python.org/3.14/tutorial/errors.html)

## Сложный уровень — ограничения и проектирование

19. Как построить кооперативную иерархию с множественным наследованием и совместимыми сигнатурами методов?

    **Ответ:** Все участвующие методы используют согласованные signatures и вызывают super ровно по протоколу, передавая остальные keyword arguments дальше. Избегать прямых parent calls, нарушающих MRO, проверить diamond case.

    **Источник:** [Python 3.14: tutorial/classes.html](https://docs.python.org/3.14/tutorial/classes.html)

20. Как `ExitStack` помогает управлять числом ресурсов, неизвестным до выполнения программы?

    **Ответ:** ExitStack регистрирует entered contexts/callbacks и unwinds в обратном порядке даже при partial acquisition. `pop_all` передаёт ответственность новому stack; порядок suppression следует context protocol.

    **Источник:** [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html)

21. Какие гарантии очистки ресурсов должен давать менеджер контекста при частичной ошибке инициализации?

    **Ответ:** Если `__enter__` упал, его собственный `__exit__` не вызовется: уже захваченное нужно очистить внутри acquisition. ExitStack/local try-finally регистрирует cleanup сразу после каждого успешного шага.

    **Типичная ошибка:** Надеяться на __exit__, если сам __enter__ не завершился успешно.

    **Источник:** [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html)

22. Почему `__del__` не является прямой заменой RAII и детерминированного освобождения ресурсов в C++?

    **Ответ:** Момент финализации зависит от реализации, cycles и shutdown; исключения __del__ не нормальный recovery channel. Для external resources использовать with/close, а финализатор — только дополнительную страховку.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

23. Как определить границу между доменным исключением, ошибкой программиста и инфраструктурной ошибкой?

    **Ответ:** Доменные ошибки описывают ожидаемые исходы продукта, инфраструктурные — отказ зависимости, programmer errors — нарушение кода/контракта. Переводить ошибки у boundary, сохраняя cause и не превращая все баги в «нет данных».

    **Источник:** [Python 3.14: tutorial/errors.html](https://docs.python.org/3.14/tutorial/errors.html)

24. Как оформить API, принимающее итератор, если для работы алгоритма нужны два прохода по данным?

    **Ответ:** Принимать factory iterator либо объявленную reiterable collection; альтернативно materialize в пределах лимита. `itertools.tee` может незаметно буферизовать большой разрыв проходов и не является бесплатной копией данных.

    **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html); [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

25. Какие ошибки возникают, когда исключение в `finally` или `return` из `finally` скрывает исходное исключение?

    **Ответ:** Новая exception в finally заменяет активный outcome, а return подавляет исходную ошибку. Из cleanup не возвращать business result; если cleanup тоже упал, сохранить cause/context и определённую policy ошибок.

    **Источник:** [Python 3.14: tutorial/errors.html](https://docs.python.org/3.14/tutorial/errors.html)

## Разбор кода

26. Почему состояние оказывается общим для экземпляров и как сделать его независимым?

   **Условие:**

   ```python
   class Buffer:
       values = []

   a = Buffer()
   b = Buffer()
   a.values.append(1)
   print(b.values)
   ```

    **Ответ:** Будет `[1]`: оба instance находят один `Buffer.values`. Создавать `self.values = []` в __init__ для независимого состояния.

    **Источник:** [Python 3.14: tutorial/classes.html](https://docs.python.org/3.14/tutorial/classes.html)

27. Что произойдёт во втором проходе и как изменить контракт, если нужны два прохода?

   **Условие:**

   ```python
   values = (x * x for x in range(3))
   print(list(values))
   print(list(values))
   ```

    **Ответ:** Первый вывод `[0, 1, 4]`, второй `[]`: generator истощён. Для двух проходов вернуть factory/new generator либо materialize list с явной ценой памяти.

    **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

28. Почему ошибка не выходит из блока и когда такое поведение было бы оправдано?

   **Условие:**

   ```python
   class Guard:
       def __enter__(self):
           return self

       def __exit__(self, exc_type, exc, traceback):
           return True

   with Guard():
       raise RuntimeError("failed")
   print("continued")
   ```

    **Ответ:** `__exit__` возвращает True, поэтому RuntimeError подавлен и напечатано `continued`. Возвращать False/None для propagation; suppression оправдана лишь для реально обработанной ошибки.

    **Источник:** [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html)

29. Какое значение вернётся вместо ожидаемой ошибки и как сохранить исходную диагностику?

   **Условие:**

   ```python
   def read_value():
       try:
           raise ValueError("invalid")
       finally:
           return 0

   print(read_value())
   ```

    **Ответ:** Вернётся 0: return из finally подавляет ValueError; в Python 3.14 такой flow также может сопровождаться SyntaxWarning. Убрать return из finally, оставить cleanup и обычный raise propagation.

    **Источник:** [Python 3.14: tutorial/errors.html](https://docs.python.org/3.14/tutorial/errors.html)

30. В какой момент возникнет ошибка и какой протокол нарушает итератор?

   **Условие:**

   ```python
   class Numbers:
       def __next__(self):
           return 1

   print(iter(Numbers()))
   ```

    **Ответ:** TypeError возникает уже в `iter(Numbers())`: нет __iter__ и sequence fallback. Iterator должен реализовать `__iter__` с return self и next с окончанием StopIteration, если поток конечен.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

## Практические задачи

31. Как реализовать потоковый итератор записей файла и обеспечить закрытие файла при досрочном выходе пользователя?

    **Ответ:** Выдать context manager, внутри которого открыт file и предоставляется records iterator. Внешний `with` закрывает file при break/exception; сам по себе break по произвольному генератору не закрывает ресурс по общему контракту.

    **Пример:**

    ```python
    from contextlib import contextmanager

    @contextmanager
    def open_records(path):
        with open(path, encoding="utf-8") as stream:
            yield iter(stream)

    # Caller: with open_records(path) as records: ...
    # Выход из with закрывает файл и после break из caller loop.
    ```

    **Типичная ошибка:** Ожидать, что break автоматически вызовет close у любого generator.

    **Источник:** [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html); [Python 3.14: library/io.html](https://docs.python.org/3.14/library/io.html)

32. Как написать context manager временного каталога с очисткой при нормальном завершении и при исключении?

    **Ответ:** Использовать `with tempfile.TemporaryDirectory() as path:`; он создаёт уникальный каталог и очищает при выходе. Тестировать normal/error exits и policy, если cleanup сам завершается ошибкой.

    **Источник:** [Python 3.14: library/tempfile.html](https://docs.python.org/3.14/library/tempfile.html); [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html)

33. Как реализовать адаптер источника данных через композицию и протестировать его без реальной сети?

    **Ответ:** Адаптер хранит source dependency и преобразует протокол/данные без наследования transport. Fake реализует узкий интерфейс с контролируемыми records/errors; общий contract проверяет output, cleanup и propagation ошибок.

    **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html); [Python 3.14: tutorial/classes.html](https://docs.python.org/3.14/tutorial/classes.html)

34. Как создать иерархию исключений parser так, чтобы сохранялись исходная причина, смещение и тип повреждённой записи?

    **Ответ:** Base ParseError и подклассы malformed/truncated/unsupported с fields offset/record_type. При переводе низкоуровневой ошибки `raise ParseError(...) from exc`; не включать секретный payload в текст.

    **Источник:** [Python 3.14: tutorial/errors.html](https://docs.python.org/3.14/tutorial/errors.html)

35. Как проверить очистку нескольких ресурсов, если получение третьего ресурса завершается исключением?

    **Ответ:** В ExitStack зарегистрировать первые два test resources, третий заставить упасть. Проверить обратный порядок close и освобождение каждого ровно один раз, отсутствие body и сохранение исходной причины.

    **Источник:** [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html); [pytest: Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)

## Что прочитать

- [Python: классы](https://docs.python.org/3.14/tutorial/classes.html)
- [Python: contextlib](https://docs.python.org/3.14/library/contextlib.html)
- [Python: исключения](https://docs.python.org/3.14/tutorial/errors.html)

[← Предыдущая тема](./01_language_model.md) · [План раздела](./README.md) · [Следующая тема →](./03_projects_and_packaging.md)
