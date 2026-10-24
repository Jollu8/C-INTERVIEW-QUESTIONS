# Интеграция Python с C и C++

Этап 8 основного маршрута Python для системного разработчика.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Когда стоит вызывать C/C++ из Python, а когда достаточно стандартной библиотеки или NumPy?

   **Ответ:** Выносить измеренный compute bottleneck или нужный native API, когда выигрыш превышает conversion/call/build costs. Сначала проверить stdlib/NumPy batching; интеграция оправдана также доступом к отсутствующей функциональности.

   **Источник:** [Python 3.14: library/profile.html](https://docs.python.org/3.14/library/profile.html); [pybind11: Build systems](https://pybind11.readthedocs.io/en/stable/compiling.html)

2. Какие задачи решают `ctypes`, Python C API и pybind11 и чем различаются их границы применения?

   **Ответ:** Ctypes вызывает доступный C-compatible ABI через FFI, Python C API создаёт extension с CPython ownership правилами, pybind11 оборачивает C++ с converters/policies. Они различаются ABI, build/lifetime/GIL обязанностями.

   **Источник:** [Python 3.14: library/ctypes.html](https://docs.python.org/3.14/library/ctypes.html); [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html); [pybind11: Return value policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html)

3. Почему наличие C++ функции само по себе не означает наличие стабильного C ABI для `ctypes`?

   **Ответ:** C++ имеет name mangling, overloads, templates и compiler-specific ABI. Для ctypes нужен явно документированный C wrapper, например extern C functions с стабильными типами/error/allocator contract.

   **Источник:** [Python 3.14: library/ctypes.html](https://docs.python.org/3.14/library/ctypes.html)

4. Зачем явно задавать `argtypes` и `restype` в `ctypes`?

   **Ответ:** Argtypes задаёт conversion/calling contract параметров, restype — result representation; default int может обрезать pointer. Ошибка сигнатуры ведёт не только к Python exception, но и memory corruption/крашу.

   **Источник:** [Python 3.14: library/ctypes.html](https://docs.python.org/3.14/library/ctypes.html)

5. Что такое buffer protocol и какие сведения он предоставляет о данных?

   **Ответ:** Протокол предоставляет buffer pointer, length, readonly, format/itemsize, shape/strides и exporter lifetime. Consumer обязан запросить нужные flags и отпустить export; view не автоматически contiguous.

   **Источник:** [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html)

6. Что означает владение объектом на границе Python/C++?

   **Ответ:** Кто удерживает object/storage, кто и каким allocator освобождает и до какого момента valid references. Return policy/base/capsule выражают это; сырой pointer не передаёт ownership автоматически.

   **Источник:** [Python 3.14: c-api/refcounting.html](https://docs.python.org/3.14/c-api/refcounting.html); [pybind11: Return value policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html)

7. Почему raw pointer на данные не описывает их размер, layout и lifetime?

   **Ответ:** Нужны length/shape, dtype/endian, strides/alignment, writable rights и owner lifetime. Даже валидный адрес может указывать на уже освобождённый или неконтинуальный buffer.

   **Источник:** [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html); [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html)

8. Какие ошибки C++ можно преобразовать в Python exceptions, а какие сбои нельзя обработать как обычное исключение?

   **Ответ:** Пойманные std exceptions можно translate в Python error с корректным message/cleanup. Segfault, UB, out-of-bounds и corrupt heap не превращаются надёжно в обычные recoverable Python exceptions.

   **Источник:** [pybind11: Exceptions](https://pybind11.readthedocs.io/en/stable/advanced/exceptions.html)

## Средний уровень — применение

9. Как отличить копирование массива в extension от передачи представления на существующий буфер?

   **Ответ:** Проверять converter flags/forcecast, ownership/base и actual memory sharing/mutation на обеих сторонах. Один быстрый вызов не доказывает zero-copy; dtype/contiguity conversion может выделить temporary.

   **Источник:** [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html)

10. Как проверить dtype, размер, alignment, contiguity и доступность записи входного буфера?

    **Ответ:** В boundary проверить exact supported dtype/byteorder, ndim/shape/length, overflow вычисления size, strides/alignment и readonly. Принять stride-aware путь либо явную copy/reject policy, не reinterpret несовместимых bytes.

    **Источник:** [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html); [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html)

11. Чем borrowed reference отличается от owned reference в Python C API?

    **Ответ:** Owned reference несёт обязанность DECREF/передачи владения, borrowed требует удержания владельца и действительности объекта. В free-threaded race borrowed из меняемого container особенно опасен; применять appropriate strong-reference APIs.

    **Источник:** [Python 3.14: c-api/refcounting.html](https://docs.python.org/3.14/c-api/refcounting.html); [Python 3.14: howto/free-threading-extensions.html](https://docs.python.org/3.14/howto/free-threading-extensions.html)

12. Как выбрать return value policy в pybind11 для значения, указателя и ссылки на внутренний объект?

    **Ответ:** Для by-value позволить copy/move, owning pointer — transfer только при действительном владении; reference/internal view должен удерживать owner, например reference_internal. Automatic policy не всегда угадывает намерение API.

    **Источник:** [pybind11: Return value policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html)

13. Как `keep_alive` и связь с владельцем помогают выразить зависимости lifetime?

    **Ответ:** Keep_alive связывает nurse/patient lifetimes, return reference_internal — returned child с parent instance. Это не фиксирует resize/mutation invalidation: owner живой, но его buffer всё равно может переместиться.

    **Источник:** [pybind11: Return value policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html)

14. Когда можно освобождать GIL вокруг C++ вычисления и какие операции в этом участке запрещены без его получения?

    **Ответ:** В обычной сборке release вокруг участка без обращения к Python objects/API, при удержанных native buffers и thread-safe library. Перед callback/converter/reference management получить нужный Python execution context/GIL вновь.

    **Источник:** [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html)

15. Как callback из C++ обратно в Python меняет требования к GIL, lifetime и обработке исключений?

    **Ответ:** Callback требует живого Python callable, разрешённого thread/interpreter context и GIL в обычной сборке. Exception передать owner через явный channel; C callbacks не должны пропускать C++ exception через C ABI.

    **Источник:** [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html); [Python 3.14: library/ctypes.html](https://docs.python.org/3.14/library/ctypes.html); [pybind11: Exceptions](https://pybind11.readthedocs.io/en/stable/advanced/exceptions.html)

16. Почему нельзя освобождать память произвольным allocator, отличным от использованного при её выделении?

    **Ответ:** New/delete, malloc/free и library-specific create/destroy не взаимозаменяемы. В разных runtime/allocator mismatch даёт UB; expose matching destroy и явно задавать ownership/capsule deleter.

    **Источник:** [Python 3.14: library/ctypes.html](https://docs.python.org/3.14/library/ctypes.html); [pybind11: Return value policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html)

17. Какие ограничения у передачи Python-объектов между процессами и почему адрес буфера не является межпроцессным контрактом?

    **Ответ:** Обычные objects сериализуются/копируются либо не поддерживаются, raw address относится к address space процесса. Shared memory передаёт name/offset/shape/dtype с общей lifetime/synchronization, не произвольный pointer.

    **Источник:** [Python 3.14: library/multiprocessing.html](https://docs.python.org/3.14/library/multiprocessing.html); [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html)

18. Как организовать сборку native extension через pyproject.toml и проверить установку wheel?

    **Ответ:** Pyproject объявляет backend/build deps и extension build, wheel получает подходящие platform/Python/ABI tags. Установка в чистую venv вне source tree проверяет linkage/resources/import, включая supported free-threaded build отдельно.

    **Источник:** [pybind11: Build systems](https://pybind11.readthedocs.io/en/stable/compiling.html); [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/)

## Сложный уровень — ограничения и проектирование

19. Как описать контракт zero-copy API, если вызывающий код может изменить размер или содержимое исходного буфера?

    **Ответ:** Запретить resize/reallocation на время export либо вернуть owned stable storage/copy. Для concurrent contents задать immutable/read lock/ownership protocol и сроки использования; живой owner не гарантирует стабильность указателя.

    **Рекомендация:** Разделить обещания «без копии», «без изменения input» и «потокобезопасно»: это разные свойства.

    **Источник:** [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html); [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html)

20. Как предотвратить dangling reference при возврате view на память C++ объекта?

    **Ответ:** Array/view должен содержать base/capsule/owner reference, сохраняющий storage до последнего consumer. Не возвращать local vector.data(); защищать от последующего resize и проверить удаление исходной Python ссылки.

    **Источник:** [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html); [pybind11: Return value policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html)

21. Как обеспечить exception safety, если ошибка возникает после частичного создания Python и C++ ресурсов?

    **Ответ:** RAII для native resources и pybind reference holders, публикация результата только после успешного construction. На каждом failure path освобождать ровно своего owner и translate exception с GIL/context; deleter не должен выбрасывать.

    **Источник:** [pybind11: Exceptions](https://pybind11.readthedocs.io/en/stable/advanced/exceptions.html); [Python 3.14: c-api/refcounting.html](https://docs.python.org/3.14/c-api/refcounting.html)

22. Как изменяются требования к состоянию extension и синхронизации при поддержке free-threaded CPython 3.14?

    **Ответ:** Аудит global/static state, caches, borrowed refs, callbacks и C API critical sections. Заявлять free-thread support только после синхронизации и тестов совместимых dependencies; наличие free-threaded Python не делает extension безопасным автоматически.

    **Источник:** [Python 3.14: howto/free-threading-extensions.html](https://docs.python.org/3.14/howto/free-threading-extensions.html); [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html)

23. Почему освобождение GIL само по себе не делает C++ библиотеку потокобезопасной?

    **Ответ:** GIL protecting Python execution не защищает native static data после release. Самой библиотеке нужны documented thread safety, locks либо per-call/thread state; проверить callbacks, allocators и shared buffers.

    **Источник:** [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html); [NumPy: Thread safety](https://numpy.org/doc/stable/reference/thread_safety.html)

24. Как отдельно измерить Python overhead, преобразование типов, копирование, передачу управления и собственно вычисление?

    **Ответ:** Сравнить no-op boundary, type conversion/copy-only и native compute при одинаковых sizes/output. Отдельно end-to-end, warmup/allocation/layout, threads и small-call batching; не вычитать несопоставимые median timings как точную декомпозицию.

    **Источник:** [Python 3.14: library/profile.html](https://docs.python.org/3.14/library/profile.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

25. Как организовать завершение фонового native-потока, который может вызывать Python callback при закрытии приложения?

    **Ответ:** Остановить новые callbacks, cooperative stop worker, дождаться join пока interpreter/objects ещё живы. Не держать GIL при join, если worker ждёт его для callback; исключения/timeout и поздние callbacks имеют явный lifecycle protocol.

    **Источник:** [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html)

## Разбор кода

26. Какой риск создаёт неописанная сигнатура функции и какие сведения о C API необходимы для исправления?

   **Условие:**

   ```python
   import ctypes

   lib = ctypes.CDLL("./libbuffer.so")
   ptr = lib.create_buffer(1024)
   print(ptr)
   ```

    **Ответ:** Без restype pointer ошибочно трактуется как c_int и может обрезаться; нужны точные prototype/ABI/size/error/ownership данные. Если C API возвращает void*, задать argtypes size_t/restype c_void_p и matching destroy, не угадывать сигнатуру.

    **Источник:** [Python 3.14: library/ctypes.html](https://docs.python.org/3.14/library/ctypes.html)

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

    **Ответ:** Local vector уничтожается при return, а base=None не удерживает его storage: view может висеть на freed memory. Выделить owning NumPy array и заполнить его либо heap owner с capsule deleter/base.

    **Пример:**

    ```cpp
    #include <pybind11/numpy.h>
    namespace py = pybind11;

    py::array_t<double> values() {
        py::array_t<double> result(2); // Storage принадлежит NumPy array.
        auto data = result.mutable_unchecked<1>();
        data(0) = 1.0;
        data(1) = 2.0;
        return result;
    }
    ```

    **Типичная ошибка:** Удерживать только Python view, не обеспечив lifetime исходной native allocation.

    **Источник:** [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html)

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

    **Ответ:** Callback обращается к Python без GIL: возможны pybind assertions/crash/UB. Release только для чистого native участка; перед Python вызовом scoped_acquire, соблюдая thread/interpreter/lifetime и порядок уничтожения py::object.

    **Источник:** [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html)

29. Почему один адрес недостаточен для безопасной обработки массива в native-коде?

   **Условие:**

   ```python
   import numpy as np

   a = np.arange(12, dtype=np.float64)[::2]
   address = a.ctypes.data
   print(address, a.shape, a.strides)
   ```

    **Ответ:** Срез имеет stride 16 bytes при itemsize 8: contiguous pointer loop увидит и пропущенные элементы/неверные bounds. Передать shape/strides и owner либо сделать проверенную contiguous copy; учитывать mutability/alignment.

    **Источник:** [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html); [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html)

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

    **Ответ:** После register локальная ctypes wrapper может быть GC'd, пока C хранит pointer, что опасно при следующем вызове. Owner хранит сильную ссылку до unregister и завершения in-flight callbacks; errors передаются безопасно, ABI точно описан.

    **Источник:** [Python 3.14: library/ctypes.html](https://docs.python.org/3.14/library/ctypes.html)

## Практические задачи

31. Как обернуть C функцию обработки буфера через ctypes с явной сигнатурой, размером, временем жизни и освобождением памяти?

    **Ответ:** По C header задать argtypes/restype, проверить length/range и writable layout, удерживать buffer до completion. Возвращённую allocation обернуть owner с matching destroy; test success/error/zero length и повторное освобождение запрещено.

    **Источник:** [Python 3.14: library/ctypes.html](https://docs.python.org/3.14/library/ctypes.html); [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html)

32. Как написать pybind11-функцию суммирования NumPy-массива с проверкой dtype/layout и тестом неконтинуального входа?

    **Ответ:** Принимать py::array с exact dtype/ndim/layout validation, отклонять incompatible input либо документированно copy. Стридовый вариант учитывает strides, GIL releases после захвата owner; тесты сравнивают reference на contiguous/step/transpose/empty.

    **Источник:** [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html); [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html)

33. Как реализовать C++ объект с возвращаемым Python view, доказать сохранение владельца и протестировать удаление исходной ссылки?

    **Ответ:** Storage принадлежит heap C++ owner, view имеет base/capsule/return policy с ownership link. После del исходной ссылки читать view безопасно, deleter срабатывает после последнего view; отдельно проверить запрет resize/reallocation.

    **Источник:** [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html); [pybind11: Return value policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html)

34. Как проверить преобразование C++ исключения в Python exception без утечки ресурсов и потери сообщения?

    **Ответ:** Native function бросает std::invalid_argument после создания RAII test resources, binding переводит в Python exception. Pytest проверяет type/message/cause policy и счётчик destructors на failure/success; native sanitizers покрывают память.

    **Источник:** [pybind11: Exceptions](https://pybind11.readthedocs.io/en/stable/advanced/exceptions.html); [pytest: Documentation](https://docs.pytest.org/en/stable/)

35. Как сравнить копирующий и zero-copy интерфейсы на нескольких размерах данных с одинаковой проверкой результата?

    **Ответ:** Матрица sizes/layout/dtypes, same numerical oracle и mutation/lifetime contract. Раздельно замерить allocation/conversion/call/kernel, end-to-end и peak memory; zero-copy не обещать для input, требующего forcecast/contiguous conversion.

    **Источник:** [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

## Что прочитать

- [Python: ctypes](https://docs.python.org/3.14/library/ctypes.html)
- [Python: buffer protocol](https://docs.python.org/3.14/c-api/buffer.html)
- [pybind11: lifetime policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html)
- [pybind11: GIL and free threading](https://pybind11.readthedocs.io/en/stable/advanced/misc.html)

[← Предыдущая тема](./07_numpy_and_performance.md) · [План раздела](./README.md) · [Следующая тема →](./09_engineering_experiments.md)
