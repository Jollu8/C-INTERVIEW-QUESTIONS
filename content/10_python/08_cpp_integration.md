# Интеграция Python с C и C++

Этап 8 основного маршрута Python для системного разработчика.

Вопросы и задачи для самопроверки. Ответы пока не добавлены. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Когда стоит вызывать C/C++ из Python, а когда достаточно стандартной библиотеки или NumPy?

2. Какие задачи решают `ctypes`, Python C API и pybind11 и чем различаются их границы применения?

3. Почему наличие C++ функции само по себе не означает наличие стабильного C ABI для `ctypes`?

4. Зачем явно задавать `argtypes` и `restype` в `ctypes`?

5. Что такое buffer protocol и какие сведения он предоставляет о данных?

6. Что означает владение объектом на границе Python/C++?

7. Почему raw pointer на данные не описывает их размер, layout и lifetime?

8. Какие ошибки C++ можно преобразовать в Python exceptions, а какие сбои нельзя обработать как обычное исключение?

## Средний уровень — применение

9. Как отличить копирование массива в extension от передачи представления на существующий буфер?

10. Как проверить dtype, размер, alignment, contiguity и доступность записи входного буфера?

11. Чем borrowed reference отличается от owned reference в Python C API?

12. Как выбрать return value policy в pybind11 для значения, указателя и ссылки на внутренний объект?

13. Как `keep_alive` и связь с владельцем помогают выразить зависимости lifetime?

14. Когда можно освобождать GIL вокруг C++ вычисления и какие операции в этом участке запрещены без его получения?

15. Как callback из C++ обратно в Python меняет требования к GIL, lifetime и обработке исключений?

16. Почему нельзя освобождать память произвольным allocator, отличным от использованного при её выделении?

17. Какие ограничения у передачи Python-объектов между процессами и почему адрес буфера не является межпроцессным контрактом?

18. Как организовать сборку native extension через pyproject.toml и проверить установку wheel?

## Сложный уровень — ограничения и проектирование

19. Как описать контракт zero-copy API, если вызывающий код может изменить размер или содержимое исходного буфера?

20. Как предотвратить dangling reference при возврате view на память C++ объекта?

21. Как обеспечить exception safety, если ошибка возникает после частичного создания Python и C++ ресурсов?

22. Как изменяются требования к состоянию extension и синхронизации при поддержке free-threaded CPython 3.14?

23. Почему освобождение GIL само по себе не делает C++ библиотеку потокобезопасной?

24. Как отдельно измерить Python overhead, преобразование типов, копирование, передачу управления и собственно вычисление?

25. Как организовать завершение фонового native-потока, который может вызывать Python callback при закрытии приложения?

## Разбор кода

26. Какой риск создаёт неописанная сигнатура функции и какие сведения о C API необходимы для исправления?

   **Условие:**

   ```python
   import ctypes

   lib = ctypes.CDLL("./libbuffer.so")
   ptr = lib.create_buffer(1024)
   print(ptr)
   ```

27. Почему возвращаемый буфер не имеет корректного lifetime и как изменить владение?

   **Условие:**

   ```cpp
   // Фрагмент C++ extension с pybind11.
   #include <pybind11/numpy.h>
   #include <vector>
   namespace py = pybind11;

   py::array_t<double> values() {
       std::vector<double> data{1.0, 2.0};
       return py::array_t<double>(
           {2}, {sizeof(double)}, data.data(), py::none());
   }
   ```

28. Почему доступ к Python-объекту внутри участка без GIL нарушает требования обычной GIL-сборки CPython?

   **Условие:**

   ```cpp
   // Фрагмент C++ extension с pybind11.
   #include <pybind11/pybind11.h>
   namespace py = pybind11;

   void run(py::object callback) {
       py::gil_scoped_release release;
       callback();
   }
   ```

29. Почему один адрес недостаточен для безопасной обработки массива в native-коде?

   **Условие:**

   ```python
   import numpy as np

   a = np.arange(12, dtype=np.float64)[::2]
   address = a.ctypes.data
   print(address, a.shape, a.strides)
   ```

30. Что может произойти, если native-библиотека сохраняет callback после возврата, и как выразить владение?

   **Условие:**

   ```python
   import ctypes

   CALLBACK = ctypes.CFUNCTYPE(None, ctypes.c_int)

   def register(lib):
       callback = CALLBACK(lambda value: print(value))
       lib.set_callback.argtypes = [CALLBACK]
       lib.set_callback.restype = None
       lib.set_callback(callback)
   ```

## Практические задачи

31. Как обернуть C функцию обработки буфера через ctypes с явной сигнатурой, размером, временем жизни и освобождением памяти?

32. Как написать pybind11-функцию суммирования NumPy-массива с проверкой dtype/layout и тестом неконтинуального входа?

33. Как реализовать C++ объект с возвращаемым Python view, доказать сохранение владельца и протестировать удаление исходной ссылки?

34. Как проверить преобразование C++ исключения в Python exception без утечки ресурсов и потери сообщения?

35. Как сравнить копирующий и zero-copy интерфейсы на нескольких размерах данных с одинаковой проверкой результата?

## Что прочитать

- [Python: ctypes](https://docs.python.org/3.14/library/ctypes.html)
- [Python: buffer protocol](https://docs.python.org/3.14/c-api/buffer.html)
- [pybind11: lifetime policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html)
- [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html)

[← Предыдущая тема](./07_numpy_and_performance.md) · [План раздела](./README.md) · [Следующая тема →](./09_engineering_experiments.md)
