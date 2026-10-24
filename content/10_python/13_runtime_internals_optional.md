# Дополнительно: модель объектов и CPython internals

Дополнительная ветка; проходите по задачам выбранной роли.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Какие утверждения о Python относятся к языку, а какие только к конкретной версии CPython?

   **Ответ:** Язык задаёт binding/identity/protocols/semantics, CPython — конкретные refcount/GC/layout/bytecode optimizations. Фиксировать implementation/version/build; GIL и address-based id не являются универсальным контрактом Python.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: library/sys.html](https://docs.python.org/3.14/library/sys.html)

2. Чем достижимость объекта отличается от наличия циклических ссылок и почему reference counting не решает все случаи самостоятельно?

   **Ответ:** Reachable объект доступен от roots независимо от cycles; unreachable cycle может держать положительные внутренние refcounts. Циклический GC дополняет counting, а timing/алгоритм зависят от реализации/build.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: library/gc.html](https://docs.python.org/3.14/library/gc.html)

3. Почему момент освобождения Python-объекта нельзя использовать как общий контракт освобождения внешнего ресурса?

   **Ответ:** Object destruction может откладываться из-за aliases/cycles/tracebacks/GC/shutdown. Close/with задают явную external resource boundary независимо от timing финализации; __del__ не гарантирует нормальную error propagation.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html); [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html)

4. Какие задачи решают weak references и чем они отличаются от обычного владения объектом?

   **Ответ:** Weakref позволяет наблюдать объект, не удерживая его обычной сильной ссылкой. После исчезновения referent ref() даёт None; callback/cache use требует проверки race/lifetime, не все types поддерживают weak references.

   **Источник:** [Python 3.14: library/weakref.html](https://docs.python.org/3.14/library/weakref.html)

5. Как `__slots__` меняет хранение атрибутов и какие ограничения это создаёт для класса и его наследников?

   **Ответ:** Slots задают descriptors для перечисленных атрибутов и могут убрать instance __dict__/__weakref__, если их нет у bases/в slots. Подкласс без собственного slots может снова получить dict; slots не дают общей immutable semantics.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

6. Как descriptor protocol связан с методами, `property` и доступом к атрибутам?

   **Ответ:** Descriptor определяет __get__/__set__/__delete__, меняя attribute access. Functions bind methods через non-data descriptor, property обычно data descriptor; default lookup соблюдает descriptor precedence.

   **Источник:** [Python 3.14: howto/descriptor.html](https://docs.python.org/3.14/howto/descriptor.html)

7. Чем data descriptor отличается от non-data descriptor по приоритету поиска атрибута?

   **Ответ:** Data descriptor с __set__ или __delete__ имеет приоритет над instance dict; non-data descriptor может быть shadow instance attribute. После этого учитываются class/MRO attributes и fallback getattr по обычному object lookup.

   **Источник:** [Python 3.14: howto/descriptor.html](https://docs.python.org/3.14/howto/descriptor.html)

8. Как метакласс отличается от декоратора класса и когда сложность метакласса оправданна?

   **Ответ:** Метакласс участвует в создании класса/namespace и выборе типа class object; class decorator преобразует уже созданный класс. Для простой регистрации/проверки часто достаточно decorator/__init_subclass__, meta оправдана нужными creation invariants.

   **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

9. Что показывают bytecode и `dis` и почему их детали нельзя считать стабильным API языка между версиями?

   **Ответ:** Dis показывает bytecode конкретного interpreter/version, специализацию/cache details по режиму. Opcodes/offsets и optimization не стабильны между версиями и не определяют универсальные атомарные границы исходного Python.

   **Источник:** [Python 3.14: library/dis.html](https://docs.python.org/3.14/library/dis.html)

10. Какие различия reference management, GIL и совместимости extensions нужно отдельно изучить для обычной и free-threaded сборок CPython 3.14?

    **Ответ:** Free-threaded build использует изменённые reference/GC механизмы и параллельный доступ; отдельные refcount values нельзя трактовать как точное число владельцев. Extensions должны заявить/обеспечить поддержку и strong-reference/critical-section правила; проверить runtime GIL mode.

    **Источник:** [Python 3.14: howto/free-threading-python.html](https://docs.python.org/3.14/howto/free-threading-python.html); [Python 3.14: howto/free-threading-extensions.html](https://docs.python.org/3.14/howto/free-threading-extensions.html); [Python 3.14: c-api/refcounting.html](https://docs.python.org/3.14/c-api/refcounting.html)

## Разбор кода

11. Почему удаление имени не доказывает немедленного уничтожения цикла и какие наблюдения зависят от реализации?

   **Условие:**

   ```python
   class Node:
       pass

   a = Node()
   a.self = a
   del a
   ```

    **Ответ:** Del удаляет binding a, но self-cycle остаётся во внутреннем графе; недостижимый cycle может позже собрать GC. Момент и наблюдения зависят от implementation/GC и скрытых refs debugger; нужен explicit close для external resources.

    **Источник:** [Python 3.14: library/gc.html](https://docs.python.org/3.14/library/gc.html); [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

12. Что останется доступно через weak reference после удаления сильной ссылки в данном запуске CPython и почему нельзя переносить наблюдение как гарантию всего языка?

   **Условие:**

   ```python
   import weakref

   class Item:
       pass

   item = Item()
   ref = weakref.ref(item)
   del item
   print(ref())
   ```

    **Ответ:** В обычном CPython при данном простом запуске без других strong refs ref() обычно вернёт None после DECREF. Free-threaded/deferred collection и иные implementations могут иметь другой timing; weakref не гарантирует immediate finalization для всего Python.

    **Источник:** [Python 3.14: library/weakref.html](https://docs.python.org/3.14/library/weakref.html); [Python 3.14: howto/free-threading-python.html](https://docs.python.org/3.14/howto/free-threading-python.html)

13. Почему присваивание не создаёт произвольный новый атрибут и как наследование может изменить ограничения?

   **Условие:**

   ```python
   class Point:
       __slots__ = ("x", "y")

   p = Point()
   p.x = 1
   p.label = "origin"
   ```

    **Ответ:** Point без dict допускает x/y, присваивание label вызывает AttributeError. Subclass без slots может добавить __dict__; slots=() сохраняет ограничения при подходящих bases, а base с dict уже предоставляет его.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

14. Почему собственное чтение атрибута в этом методе снова вызывает тот же метод и как избежать рекурсии?

   **Условие:**

   ```python
   class Item:
       def __getattribute__(self, name):
           print(self.name)
           return object.__getattribute__(self, name)

   print(Item().value)
   ```

    **Ответ:** Self.name внутри __getattribute__ снова вызывает тот же метод до RecursionError. Использовать object.__getattribute__ для внутреннего чтения либо ограниченный fallback __getattr__; отсутствие value затем должно дать нормальный AttributeError.

    **Источник:** [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

15. Как data descriptor влияет на поиск атрибута и почему запись в `__dict__` не обязательно меняет читаемое значение?

   **Условие:**

   ```python
   class Fixed:
       def __get__(self, obj, owner):
           return 42

       def __set__(self, obj, value):
           raise AttributeError("read only")

   class Item:
       value = Fixed()

   item = Item()
   item.__dict__["value"] = 7
   print(item.value)
   ```

    **Ответ:** Fixed — data descriptor из-за __set__, поэтому имеет приоритет над item.__dict__ и вывод будет 42. Прямое присваивание item.value вызовет __set__ и AttributeError; запись в dict не отменяет precedence.

    **Источник:** [Python 3.14: howto/descriptor.html](https://docs.python.org/3.14/howto/descriptor.html)

## Практические задачи

16. Как провести эксперимент reference counting и циклического GC, явно зафиксировав CPython version, сборку и ограничения метода наблюдения?

    **Ответ:** Записать implementation/sys.version/sysconfig/GIL state и GC настройки, отключить мешающие скрытые references. Создать acyclic и cyclic objects с weakrefs, сравнить до/после del и gc.collect; getrefcount добавляет временную ссылку, timing не обобщать как язык.

    **Рекомендация:** Фиксировать build/GIL/GC settings; не переносить численные refcounts и timing finalization как гарантию языка.

    **Источник:** [Python 3.14: library/gc.html](https://docs.python.org/3.14/library/gc.html); [Python 3.14: library/weakref.html](https://docs.python.org/3.14/library/weakref.html); [Python 3.14: library/sys.html](https://docs.python.org/3.14/library/sys.html); [Python 3.14: howto/free-threading-python.html](https://docs.python.org/3.14/howto/free-threading-python.html)

17. Как реализовать descriptor с проверкой диапазона значения и тестами доступа через класс и экземпляр?

    **Ответ:** Descriptor с __set_name__ выбирает private storage name, __get__ возвращает self при obj=None, __set__ валидирует type/range и записывает через safe attribute path. Тестировать class/instance access, boundaries, invalid value и отсутствие shared instance state.

    **Пример:**

    ```python
    class Percent:
        def __set_name__(self, owner, name):
            self.storage = "_" + name

        def __get__(self, obj, owner=None):
            if obj is None:
                return self
            return object.__getattribute__(obj, self.storage)

        def __set__(self, obj, value):
            if type(value) is not int or not 0 <= value <= 100:
                raise ValueError("integer percent in [0, 100] required")
            object.__setattr__(obj, self.storage, value)

    class Progress:
        percent = Percent()

    a, b = Progress(), Progress()
    a.percent, b.percent = 10, 20
    assert a.percent == 10 and b.percent == 20
    assert isinstance(Progress.percent, Percent)
    ```

    **Типичная ошибка:** Возвращать instance value при доступе к descriptor через класс без obj.

    **Источник:** [Python 3.14: howto/descriptor.html](https://docs.python.org/3.14/howto/descriptor.html); [pytest: Documentation](https://docs.pytest.org/en/stable/)

18. Как сравнить память и ограничения экземпляров со `__dict__` и `__slots__`, не подменяя полную память одним `getsizeof`?

    **Ответ:** Сравнить много instances одинаковых fields с/без slots в isolated process/controlled allocation, учитывать __dict__, referents и retained memory. Getsizeof одного объекта неполон; проверить weakref/subclass/dynamic attribute behaviour отдельно от memory gain.

    **Источник:** [Python 3.14: library/sys.html](https://docs.python.org/3.14/library/sys.html); [Python 3.14: library/tracemalloc.html](https://docs.python.org/3.14/library/tracemalloc.html); [Python 3.14: reference/datamodel.html](https://docs.python.org/3.14/reference/datamodel.html)

19. Как исследовать удержание объектов через traceback, cache или замыкание и отличить его от недостижимого цикла?

    **Ответ:** Снять tracemalloc snapshots и weakref lifetime, проверить roots: caches, closure cells, exception traceback frames. Удерживаемый root объект reachable и GC не обязан его удалить; очистить owner по lifecycle и повторить без observer-induced references.

    **Источник:** [Python 3.14: library/gc.html](https://docs.python.org/3.14/library/gc.html); [Python 3.14: library/tracemalloc.html](https://docs.python.org/3.14/library/tracemalloc.html); [Python 3.14: library/weakref.html](https://docs.python.org/3.14/library/weakref.html)

20. Как составить перечень глобального состояния extension или библиотеки, требующего проверки при переходе на free-threaded CPython?

    **Ответ:** Inventory static/global caches/counters/singletons, mutable Python/native state, borrowed refs, callbacks и allocator ownership. Для каждого указать owner/lock/critical section/per-interpreter state и dependencies, затем проверять stress/invariants на GIL/free-threaded builds до заявления поддержки.

    **Источник:** [Python 3.14: howto/free-threading-extensions.html](https://docs.python.org/3.14/howto/free-threading-extensions.html); [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html)

## Что прочитать

- [Python: data model](https://docs.python.org/3.14/reference/datamodel.html)
- [Python: descriptor HOWTO](https://docs.python.org/3.14/howto/descriptor.html)
- [Python: gc](https://docs.python.org/3.14/library/gc.html)
- [Python: free threading](https://docs.python.org/3.14/howto/free-threading-python.html)

[← Предыдущая тема](./12_security_optional.md) · [План раздела](./README.md)
