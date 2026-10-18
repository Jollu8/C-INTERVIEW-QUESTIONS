# Дополнительно: модель объектов и CPython internals

Дополнительная ветка; проходите по задачам выбранной роли.

Вопросы и задачи для самопроверки. Ответы пока не добавлены. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Какие утверждения о Python относятся к языку, а какие только к конкретной версии CPython?

2. Чем достижимость объекта отличается от наличия циклических ссылок и почему reference counting не решает все случаи самостоятельно?

3. Почему момент освобождения Python-объекта нельзя использовать как общий контракт освобождения внешнего ресурса?

4. Какие задачи решают weak references и чем они отличаются от обычного владения объектом?

5. Как `__slots__` меняет хранение атрибутов и какие ограничения это создаёт для класса и его наследников?

6. Как descriptor protocol связан с методами, `property` и доступом к атрибутам?

7. Чем data descriptor отличается от non-data descriptor по приоритету поиска атрибута?

8. Как метакласс отличается от декоратора класса и когда сложность метакласса оправданна?

9. Что показывают bytecode и `dis` и почему их детали нельзя считать стабильным API языка между версиями?

10. Какие различия reference management, GIL и совместимости extensions нужно отдельно изучить для обычной и free-threaded сборок CPython 3.14?

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

13. Почему присваивание не создаёт произвольный новый атрибут и как наследование может изменить ограничения?

   **Условие:**

   ```python
   class Point:
       __slots__ = ("x", "y")

   p = Point()
   p.x = 1
   p.label = "origin"
   ```

14. Почему собственное чтение атрибута в этом методе снова вызывает тот же метод и как избежать рекурсии?

   **Условие:**

   ```python
   class Item:
       def __getattribute__(self, name):
           print(self.name)
           return object.__getattribute__(self, name)

   print(Item().value)
   ```

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

## Практические задачи

16. Как провести эксперимент reference counting и циклического GC, явно зафиксировав CPython version, сборку и ограничения метода наблюдения?

17. Как реализовать descriptor с проверкой диапазона значения и тестами доступа через класс и экземпляр?

18. Как сравнить память и ограничения экземпляров со `__dict__` и `__slots__`, не подменяя полную память одним `getsizeof`?

19. Как исследовать удержание объектов через traceback, cache или замыкание и отличить его от недостижимого цикла?

20. Как составить перечень глобального состояния extension или библиотеки, требующего проверки при переходе на free-threaded CPython?

## Что прочитать

- [Python: data model](https://docs.python.org/3.14/reference/datamodel.html)
- [Python: descriptor HOWTO](https://docs.python.org/3.14/howto/descriptor.html)
- [Python: gc](https://docs.python.org/3.14/library/gc.html)
- [Python: free threading](https://docs.python.org/3.14/howto/free-threading-python.html)

[← Предыдущая тема](./12_security_optional.md) · [План раздела](./README.md)
