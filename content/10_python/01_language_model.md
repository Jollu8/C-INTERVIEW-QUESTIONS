# Модель языка, объекты и функции

Этап 1 основного маршрута Python для системного разработчика.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Что связывает имя с объектом в Python и чем присваивание отличается от копирования объекта?

   **Ответ:** Присваивание связывает имя с объектом, не копируя его. Несколько имён могут ссылаться на один объект; mutation видна через все aliases, перепривязка имени меняет только эту связь.

   **Пример:** `a = []; b = a; b.append(1)` меняет и наблюдаемое `a`.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

2. Чем `is` отличается от `==` и почему сравнение с `None` обычно пишут через `is`?

   **Ответ:** `is` проверяет identity, `==` — равенство по протоколу типа. `None` — singleton, поэтому `x is None` не вызывает пользовательский `__eq__`.

   **Типичная ошибка:** Сравнивать числа/строки через `is`.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

3. Какие из `list`, `tuple`, `dict`, `set`, `str`, `bytes` изменяемы и что именно означает изменяемость контейнера?

   **Ответ:** Из перечисленных mutable: list, dict, set; immutable: tuple, str, bytes. Неизменяемый контейнер сохраняет свои ссылки, но объект по ссылке внутри может изменяться.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

4. Чем список отличается от кортежа и когда кортеж может содержать изменяемые данные?

   **Ответ:** List позволяет менять набор/порядок ссылок; tuple — нет. `([1],)` содержит mutable list, который можно изменить, не заменяя элемент кортежа.

   **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

5. Что означает hashability и какие требования она предъявляет к ключу словаря?

   **Ответ:** Объект имеет стабильный hash в течение использования и согласованное равенство: `a == b` требует `hash(a) == hash(b)`. Неравные объекты могут иметь одинаковый hash; tuple hashable лишь при hashable элементах.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

6. Чем `list.append()` отличается от `list.extend()` и какие значения они возвращают?

   **Ответ:** `append(x)` добавляет один объект, `extend(xs)` — элементы iterable. Оба изменяют list и возвращают `None`.

   **Пример:** `a=[]; a.append([1,2])` даёт вложенный список, `extend` — два числа.

   **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

7. Как работают отрицательные индексы и срезы встроенных последовательностей?

   **Ответ:** Отрицательный индекс отсчитывается от конца; выход одиночного индекса за границы даёт IndexError. Срез `[start:stop:step]` не включает stop, обрезает границы; нулевой step запрещён.

   **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

8. Какие объекты считаются ложными и чем проверка `if value` отличается от `if value is None`?

   **Ответ:** Ложны None, False, нулевые числа, пустые стандартные контейнеры и объекты с ложным `__bool__`/нулевым `__len__`. `is None` отличает отсутствие значения от допустимых 0/пустого контейнера.

   **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

## Средний уровень — применение

9. Как Python передаёт аргументы функции и почему изменение списка и перепривязка параметра дают разные эффекты у вызывающего кода?

   **Ответ:** Параметр получает ссылку на тот же объект — call by sharing. `items.append` меняет объект вызывающего, `items = [...]` лишь перепривязывает локальный параметр.

   **Источник:** [Python 3.14: tutorial/controlflow.html](https://docs.python.org/3.14/tutorial/controlflow.html)

10. Когда вычисляются значения аргументов по умолчанию и как это влияет на изменяемые объекты?

    **Ответ:** Defaults вычисляются при выполнении `def`, а не каждом вызове. Mutable default разделяется между вызовами; использовать sentinel/None и создавать список внутри.

    **Пример:** `def f(items=None): items = [] if items is None else items`

    **Источник:** [Python 3.14: tutorial/controlflow.html](https://docs.python.org/3.14/tutorial/controlflow.html)

11. Чем поверхностная копия отличается от глубокой для списка вложенных структур?

    **Ответ:** Shallow copy создаёт внешний контейнер, сохраняя ссылки на вложенные objects. Deepcopy рекурсивно копирует граф с memo, но не задаёт универсальную семантику копирования ресурсов.

    **Источник:** [Python 3.14: library/copy.html](https://docs.python.org/3.14/library/copy.html)

12. Как LEGB определяет поиск имени и когда возникает `UnboundLocalError`?

    **Ответ:** Обычный поиск идёт Local→Enclosing→Global→Builtins. Присваивание имени делает его локальным в блоке функции, если нет global/nonlocal; чтение до локального связывания вызывает UnboundLocalError.

    **Источник:** [Python 3.14: reference/executionmodel.html](https://docs.python.org/3.14/reference/executionmodel.html)

13. Чем `global` отличается от `nonlocal` и какие альтернативы им есть при проектировании функции?

    **Ответ:** `global` относится к namespace модуля, `nonlocal` — к уже связанному имени enclosing function. Альтернативы: возвращаемое состояние, объект с явным владельцем или переданный state-параметр.

    **Источник:** [Python 3.14: reference/executionmodel.html](https://docs.python.org/3.14/reference/executionmodel.html)

14. Как позиционные, keyword-only и positional-only параметры меняют контракт API?

    **Ответ:** До `/` параметры positional-only, после `*` keyword-only, обычные допускают оба способа. Ограничения помогают менять имена/развивать API без неоднозначных вызовов.

    **Пример:** `def f(path, /, *, limit=10): ...`

    **Источник:** [Python 3.14: tutorial/controlflow.html](https://docs.python.org/3.14/tutorial/controlflow.html)

15. Как работают `*args` и `**kwargs`, распаковка аргументов и конфликты имён параметров?

    **Ответ:** `*args` собирает лишние positional в tuple, `**kwargs` — keyword в dict; `*xs`/`**mapping` распаковывают вызов. Дубли значения одного параметра или неподходящие имена дают TypeError.

    **Источник:** [Python 3.14: tutorial/controlflow.html](https://docs.python.org/3.14/tutorial/controlflow.html)

16. Как замыкание захватывает переменную и что понимают под late binding?

    **Ответ:** Closure хранит доступ к переменной enclosing scope, а её значение читается при вызове. В цикле несколько функций могут видеть итоговое значение одной cell; bound default фиксирует отдельное значение.

    **Пример:** `[lambda i=i: i for i in range(3)]`

    **Источник:** [Python 3.14: reference/executionmodel.html](https://docs.python.org/3.14/reference/executionmodel.html); [Python 3.14: tutorial/controlflow.html](https://docs.python.org/3.14/tutorial/controlflow.html)

17. Как устроен декоратор функции и зачем использовать `functools.wraps`?

    **Ответ:** Декоратор получает функцию и возвращает вызываемый объект при определении. `wraps` сохраняет имя/doc/annotations и `__wrapped__`, помогая introspection; wrapper обязан сохранить нужные semantics ошибок/async.

    **Источник:** [Python 3.14: library/functools.html](https://docs.python.org/3.14/library/functools.html)

18. Чем list comprehension отличается от generator expression по вычислениям и хранению результата?

    **Ответ:** List comprehension сразу вычисляет и хранит все элементы. Generator expression создаёт ленивый одноразовый iterator, уменьшая память; вычисления/ошибки часто откладываются до iteration.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: tutorial/controlflow.html](https://docs.python.org/3.14/tutorial/controlflow.html)

## Сложный уровень — ограничения и проектирование

19. Какие гарантии о порядке элементов даёт `dict`, а какие предположения о порядке `set` делать нельзя?

    **Ответ:** Dict сохраняет insertion order как гарантию языка; обновление значения не переносит ключ, delete+insert добавляет в конец. Для set порядок iteration не является стабильным сортировочным/межзапусковым контрактом.

    **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

20. Почему нельзя основывать корректность программы на interning строк или кэшировании небольших целых чисел в CPython?

    **Ответ:** Interning/cache — детали реализации и версии, допустимые совпадения identity для некоторых значений. Использовать equality для значений и явно созданные объекты для проверки aliasing.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

21. Какие свойства `__eq__` и `__hash__` должен сохранять объект, используемый ключом словаря?

    **Ответ:** Hash должен оставаться стабильным, равные объекты — иметь одинаковый hash, equality — быть согласованной. Переопределение `__eq__` без подходящего hash обычно делает instances unhashable; mutable сравниваемые поля опасны для keys.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

22. Почему Python `int` и C++ `int` имеют разные ограничения и что это меняет при обмене бинарными данными?

    **Ответ:** Python int произвольной точности с ограничением ресурсов, C++ int имеет конечный диапазон, зависящий от платформы. Для wire format указать width/signedness/endian и проверить диапазон до packing.

    **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html); [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html)

23. Какие ошибки возможны при сравнении `float`, `NaN` и при выборе допуска через `math.isclose`?

    **Ответ:** Binary float округляется; NaN не равен даже себе. `isclose` использует relative и absolute tolerance, около нуля важен abs_tol; NaN сравнивается отдельно, допуск выбирается из задачи.

    **Источник:** [Python 3.14: library/math.html](https://docs.python.org/3.14/library/math.html)

24. Когда `deepcopy` не соответствует смыслу копирования ресурса или доменного объекта?

    **Ответ:** Файл/lock/socket или доменный singleton не получают осмысленный независимый ресурс через автоматический deepcopy. Нужен explicit clone/snapshot contract либо запрет копирования; custom `__deepcopy__` должен сохранять инварианты.

    **Источник:** [Python 3.14: library/copy.html](https://docs.python.org/3.14/library/copy.html)

25. Как спроектировать функцию так, чтобы владение изменяемыми аргументами было понятно без чтения её реализации?

    **Ответ:** Явно назвать in-place вариант, документировать mutation/aliases и возвращаемый объект; чистый вариант создаёт нужную независимую копию. Указать глубину копии и проверить, что чужие inputs не изменяются.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: library/copy.html](https://docs.python.org/3.14/library/copy.html)

## Разбор кода

26. Какие строки будут напечатаны и как убрать общее состояние между вызовами?

   **Условие:**

   ```python
   def collect(value, items=[]):
       items.append(value)
       return items

   print(collect(1))
   print(collect(2))
   ```

    **Ответ:** Будут `[1]`, затем `[1, 2]`: default list создан один раз. Заменить default на None/sentinel и выделять новый list в каждом соответствующем вызове.

    **Пример:**

    ```python
    def collect(value, items=None):
        if items is None:
            items = []
        items.append(value)
        return items

    assert collect(1) == [1]
    assert collect(2) == [2]
    ```

    **Типичная ошибка:** Считать, что default expression вычисляется для каждого вызова.

    **Источник:** [Python 3.14: tutorial/controlflow.html](https://docs.python.org/3.14/tutorial/controlflow.html)

27. Как изменится исходный список после изменения копии и как получить независимые вложенные списки?

   **Условие:**

   ```python
   import copy

   a = [[1], [2]]
   b = copy.copy(a)
   b[0].append(9)
   print(a)
   ```

    **Ответ:** Вывод `[[1, 9], [2]]`: b новый снаружи, но `b[0] is a[0]`. Для этих вложенных lists подходит deepcopy либо `[row.copy() for row in a]`.

    **Источник:** [Python 3.14: library/copy.html](https://docs.python.org/3.14/library/copy.html)

28. Что выведут функции из списка и как сохранить отдельное значение для каждой функции?

   **Условие:**

   ```python
   functions = [lambda: i for i in range(3)]
   print([f() for f in functions])
   ```

    **Ответ:** Результат `[2, 2, 2]`: closures читают одну переменную i после цикла. `lambda i=i: i` либо фабрика с отдельным scope фиксирует каждое значение.

    **Источник:** [Python 3.14: reference/executionmodel.html](https://docs.python.org/3.14/reference/executionmodel.html); [Python 3.14: tutorial/controlflow.html](https://docs.python.org/3.14/tutorial/controlflow.html)

29. Почему вызов не использует глобальное значение и какие изменения исправляют ошибку с разными контрактами?

   **Условие:**

   ```python
   counter = 10

   def tick():
       counter += 1
       return counter

   print(tick())
   ```

    **Ответ:** Возникает UnboundLocalError: `+=` читает локальный counter до assignment. `global counter` меняет shared module state; параметр/return сохраняет явную передачу состояния, closure требует nonlocal.

    **Источник:** [Python 3.14: reference/executionmodel.html](https://docs.python.org/3.14/reference/executionmodel.html)

30. Сколько независимых строк создаётся и почему изменение одной ячейки затрагивает несколько строк?

   **Условие:**

   ```python
   matrix = [[0] * 3] * 2
   matrix[0][1] = 7
   print(matrix)
   ```

    **Ответ:** Созданы две ссылки на один внутренний list; вывод `[[0, 7, 0], [0, 7, 0]]`. Независимые rows создаются comprehension: `[[0] * 3 for _ in range(2)]`.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

## Практические задачи

31. Как реализовать функцию объединения настроек без изменения входных словарей и явно определить политику для вложенных словарей?

    **Ответ:** Для shallow merge `result = {**defaults, **overrides}` сохраняет inputs и даёт overrides при конфликте. Вложенные dict заменить целиком либо рекурсивно объединять по явно заданным правилам; тестировать aliases/конфликты типов.

    **Пример:**

    ```python
    def merge_settings(defaults, overrides):
        # Shallow merge: overrides заменяет вложенный dict целиком.
        return defaults | overrides

    a = {"io": {"timeout": 10}, "workers": 2}
    b = {"io": {"timeout": 3}}
    assert merge_settings(a, b) == {"io": {"timeout": 3}, "workers": 2}
    assert a["io"]["timeout"] == 10
    ```

    **Рекомендация:** Документировать, что вложенные objects результата при shallow merge разделяются с inputs.

    **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html); [Python 3.14: library/copy.html](https://docs.python.org/3.14/library/copy.html)

32. Как написать декоратор измерения времени, сохраняющий имя и документацию функции и не скрывающий её исключения?

    **Ответ:** Wrapper с `@wraps(func)`, `perf_counter()` перед вызовом и измерением в finally; ошибку не перехватывать без необходимости. Для async нужен async wrapper с await, а emit метрики не должен скрыть исключение функции.

    **Источник:** [Python 3.14: library/functools.html](https://docs.python.org/3.14/library/functools.html); [Python 3.14: library/time.html](https://docs.python.org/3.14/library/time.html)

33. Как реализовать устойчивую к повторным элементам дедупликацию с сохранением порядка и указать требования к типам элементов?

    **Ответ:** Для hashable элементов `list(dict.fromkeys(values))` сохраняет первое вхождение. Для unhashable нужен key function либо equality scan с иной сложностью; контракт задаёт значение «дубликат».

    **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html)

34. Как спроектировать API нормализации списка значений с явным выбором между изменением входа и возвратом новой коллекции?

    **Ответ:** Два API: `normalize(values)` возвращает новую коллекцию, `normalize_inplace(values)` меняет переданную. Указать numerical edge cases, возвращаемую identity и проверить aliases вместе с содержимым.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

35. Как построить небольшой эксперимент, демонстрирующий разницу `==` и `is`, не опираясь на interning конкретной реализации?

    **Ответ:** Создать `a=[1,2]`, `b=[1,2]`, `c=a`: `a == b` истинно, `a is b` ложно, `a is c` истинно. Mutation a демонстрирует sharing c без предположений об interned literals.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

## Что прочитать

- [Python: модель данных](https://docs.python.org/3.14/reference/datamodel.html)
- [Python: функции](https://docs.python.org/3.14/tutorial/controlflow.html#defining-functions)

[План раздела](./README.md) · [Следующая тема →](./02_protocols_and_resources.md)
