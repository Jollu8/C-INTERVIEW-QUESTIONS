# NumPy, память и производительность

Этап 7 основного маршрута Python для системного разработчика.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Чем `numpy.ndarray` отличается от списка Python с числовыми объектами?

   **Ответ:** Ndarray хранит typed buffer и metadata dtype/shape/strides, обычно без отдельного Python object на каждое число. List хранит ссылки на Python objects, допускает разнородность; object-dtype ndarray снова содержит Python references.

   **Источник:** [NumPy: ndarray](https://numpy.org/doc/stable/reference/arrays.ndarray.html)

2. Что описывают `dtype`, `shape`, `ndim`, `size` и `itemsize` массива?

   **Ответ:** Dtype задаёт representation элемента, shape — длины осей, ndim — число осей, size — число элементов, itemsize — bytes на элемент. Для views nbytes не равен всей удерживаемой allocation владельца.

   **Источник:** [NumPy: ndarray](https://numpy.org/doc/stable/reference/arrays.ndarray.html)

3. Чем поэлементное умножение отличается от матричного произведения в NumPy?

   **Ответ:** `a*b` — elementwise с broadcasting, `a@b`/matmul — matrix-product semantics последних осей. Совпадение результата на частном input не делает операции взаимозаменяемыми.

   **Источник:** [NumPy: Array fundamentals](https://numpy.org/doc/stable/user/basics.html); [NumPy: Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html)

4. Какую задачу решает broadcasting и какие размеры осей совместимы?

   **Ответ:** Размеры сравниваются справа: равные или один из них 1 совместимы, отсутствующая ось считается 1. Broadcast может не копировать input, но output/intermediates всё равно могут быть огромными.

   **Источник:** [NumPy: Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html)

5. Чем view отличается от независимой копии массива?

   **Ответ:** View делит data buffer и имеет собственную metadata; copy имеет независимые данные для обычного numeric array. Изменение view влияет на aliases, а object-dtype copy всё ещё может делить referenced Python objects.

   **Источник:** [NumPy: Copies and views](https://numpy.org/doc/stable/user/basics.copies.html)

6. Что означают C-contiguous и Fortran-contiguous layout?

   **Ответ:** C-order хранит последнюю ось с наиболее быстрым изменением, Fortran — первую. Флаги contiguity определяются shape/strides; некоторые формы могут быть одновременно C и F contiguous.

   **Источник:** [NumPy: ndarray](https://numpy.org/doc/stable/reference/arrays.ndarray.html)

7. Почему `numpy.vectorize` нельзя автоматически считать ускорением вычислений?

   **Ответ:** Vectorize — удобная оболочка поэлементных Python calls, а не автоматическая компиляция/SIMD. Для ускорения нужны native ufunc/batched algorithms и замер workload.

   **Типичная ошибка:** Считать numpy.vectorize компилятором Python-цикла.

   **Источник:** [NumPy: vectorize](https://numpy.org/doc/stable/reference/generated/numpy.vectorize.html)

8. Что нужно проверить кроме скорости, прежде чем заменить Python-цикл векторизованной операцией?

   **Ответ:** Результат/shape, dtype/promotion, rounding/overflow/NaN, mutation/aliasing и peak memory. Проверять на boundaries и реалистичных размерах, измеряя end-to-end с нужными conversions.

   **Источник:** [NumPy: Array fundamentals](https://numpy.org/doc/stable/user/basics.html); [NumPy: Type promotion](https://numpy.org/doc/stable/reference/arrays.promotion.html)

## Средний уровень — применение

9. Как `strides` определяет адрес элемента и почему срез с шагом может быть неконтинуальным?

   **Ответ:** Byte offset равен сумме index_i×stride_i относительно view origin. Шаг/transpose/отрицательные strides меняют layout без обязательной копии; contiguous pointer-only loop может читать неправильные элементы.

   **Источник:** [NumPy: ndarray](https://numpy.org/doc/stable/reference/arrays.ndarray.html)

10. Когда basic indexing возвращает view, а advanced indexing создаёт копию?

    **Ответ:** Basic slicing обычно возвращает view, advanced integer/boolean indexing — copy при retrieval. Прямое `a[idx]=...` всё же пишет в a; scalar indexing может вернуть scalar, не array view.

    **Источник:** [NumPy: Copies and views](https://numpy.org/doc/stable/user/basics.copies.html)

11. Почему `reshape` не всегда позволяет обойтись без копирования и как проверить фактическое разделение памяти?

    **Ответ:** Reshape меняет metadata, если layout позволяет, иначе может создать copy. Использовать shares_memory/may_share_memory с их ограничениями, а не лишь проверку `.base is original`.

    **Источник:** [NumPy: Copies and views](https://numpy.org/doc/stable/user/basics.copies.html)

12. Как временные массивы при chained operations влияют на пиковую память и memory bandwidth?

    **Ответ:** Каждый этап `a*b+c` может выделить full-size temporary и повторно пройти память. Out buffers/chunking/fusion уменьшают peak/bandwidth, но должны сохранять dtype, aliasing и numerical semantics.

    **Источник:** [NumPy: Universal functions](https://numpy.org/doc/stable/reference/ufuncs.html)

13. Как различаются переполнение фиксированного NumPy integer и рост Python `int`?

    **Ответ:** Python int растёт по точности, NumPy integer фиксированного dtype может переполниться/обернуться. Promotion/warnings зависят от операции/версии; проверять ranges и выбирать расширенный dtype до вычисления.

    **Источник:** [NumPy: Type promotion](https://numpy.org/doc/stable/reference/arrays.promotion.html)

14. Как NumPy выбирает dtype результата и почему неявное преобразование может быть нежелательно для бинарного формата?

    **Ответ:** Результат определяется type promotion правилом для input dtypes/Python scalars и конкретного ufunc. Для binary contract задавать dtype/endian явно и валидировать values перед cast, не рассчитывать на неявный безопасный narrowing.

    **Источник:** [NumPy: Type promotion](https://numpy.org/doc/stable/reference/arrays.promotion.html)

15. Как `out=` и in-place операции меняют требования к dtype, aliasing и владению данными?

    **Ответ:** Out требует подходящих shape/dtype/writability/casting; in-place меняет исходные данные и все aliases. Overlap и temporary-copy behaviour зависят от операции, поэтому проверять контракт и память.

    **Источник:** [NumPy: Universal functions](https://numpy.org/doc/stable/reference/ufuncs.html); [NumPy: Copies and views](https://numpy.org/doc/stable/user/basics.copies.html)

16. Как выбор оси reduction влияет на layout обращений к памяти и точность результата?

    **Ответ:** Axis определяет какие элементы объединяются и stride pattern. Order/algorithm/dtype накопления влияют на rounding; NumPy может применять pairwise sum лишь на определённых paths, поэтому фиксировать axis/layout.

    **Источник:** [NumPy: sum](https://numpy.org/doc/stable/reference/generated/numpy.sum.html)

17. Чем elapsed time, CPU time и профиль вызовов отличаются по диагностической ценности?

    **Ответ:** Elapsed включает ожидание и scheduling, CPU time — потреблённое процессом CPU, profile — распределение затрат по calls. Профилирование добавляет overhead и не всегда раскрывает внутренний native kernel.

    **Источник:** [Python 3.14: library/time.html](https://docs.python.org/3.14/library/time.html); [Python 3.14: library/profile.html](https://docs.python.org/3.14/library/profile.html)

18. Какие ограничения есть у `sys.getsizeof` и `tracemalloc` при оценке массива и памяти native-кода?

    **Ответ:** Getsizeof поверхностный и может иначе учитывать owner/view, tracemalloc покрывает отслеживаемые allocations, не весь native/device footprint. Сопоставить array.nbytes, owner retention, RSS/peak и специализированные native измерения.

    **Источник:** [Python 3.14: library/sys.html](https://docs.python.org/3.14/library/sys.html); [Python 3.14: library/tracemalloc.html](https://docs.python.org/3.14/library/tracemalloc.html); [NumPy: ndarray](https://numpy.org/doc/stable/reference/arrays.ndarray.html)

## Сложный уровень — ограничения и проектирование

19. Как отличить memory-bound вычисление от Python overhead и затрат native-библиотеки?

    **Ответ:** Измерить время Python calls/allocations, native samples и bytes touched/bandwidth при разных размерах. Scaling по working set/threads помогает отделить interpreter overhead от memory saturation/BLAS compute.

    **Источник:** [Python 3.14: library/profile.html](https://docs.python.org/3.14/library/profile.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

20. Как число потоков BLAS может повлиять на сравнение NumPy, C++ и multiprocessing?

    **Ответ:** BLAS может сам запускать threads; несколько processes×BLAS threads создают oversubscription и непредсказуемый p99. Фиксировать library/thread limits и сравнивать при одинаковом CPU budget.

    **Источник:** [NumPy: Global configuration](https://numpy.org/doc/stable/reference/global_state.html); [Python 3.14: library/multiprocessing.html](https://docs.python.org/3.14/library/multiprocessing.html)

21. Как формулировать численный допуск, если CPU и GPU выполняют reduction в разном порядке?

    **Ответ:** Выбрать atol по абсолютной погрешности около нуля, rtol — по масштабу и допустимой относительной ошибке; отдельно NaN/Inf. Document reference и norm/algorithm; default allclose не универсален и асимметричен относительно reference.

    **Рекомендация:** Сохранять reference dtype, norm, atol/rtol и policy NaN/Inf вместе с benchmark.

    **Источник:** [NumPy: allclose](https://numpy.org/doc/stable/reference/generated/numpy.allclose.html); [NumPy: sum](https://numpy.org/doc/stable/reference/generated/numpy.sum.html)

22. Почему ускорение одного kernel не гарантирует ускорения pipeline с копированием и преобразованием layout?

    **Ответ:** Pipeline включает dtype/layout conversion, transfers/allocations и synchronization. Ускоренный kernel может занимать малую долю общего времени; сравнивать отдельные стадии и end-to-end с одинаковой точностью.

    **Источник:** [CuPy: Performance best practices](https://docs.cupy.dev/en/stable/user_guide/performance.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

23. Как спроектировать обработку массива, превышающего доступную RAM, с chunking и ограничением временных результатов?

    **Ответ:** Читать bounded chunks/tiles, переиспользовать рабочие buffers и объединять только корректно mergeable aggregates. Для neighbourhood algorithms нужны overlap halos, для global sort/quantile — иной внешний алгоритм/явная approximation.

    **Источник:** [NumPy: Array fundamentals](https://numpy.org/doc/stable/user/basics.html); [Python 3.14: library/io.html](https://docs.python.org/3.14/library/io.html)

24. Какие условия нужно проверить перед передачей неконтинуального NumPy-массива в C/C++ функцию?

    **Ответ:** Native API должен принимать strides либо требовать/создать contiguous copy, проверить dtype/byteorder/alignment/shape/bounds/writability. Удерживать owner на время использования; conversion может нарушить promise zero-copy.

    **Источник:** [pybind11: NumPy and buffers](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html); [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html)

25. Как проверить безопасность совместного доступа к общему NumPy-массиву из нескольких потоков, учитывая режим GIL и изменяемость?

    **Ответ:** Разрешён concurrent read immutable buffer, conflicting writes требуют locks/ownership. Resize при активных readers опасен; NumPy releases GIL в части kernels, free-threaded режим не делает общие arrays/objects автоматически safe.

    **Источник:** [NumPy: Thread safety](https://numpy.org/doc/stable/reference/thread_safety.html)

## Разбор кода

26. Почему изменение среза отражается в исходном массиве и как получить независимый результат?

   **Условие:**

   ```python
   import numpy as np

   a = np.arange(6)
   b = a[1:4]
   b[:] = -1
   print(a)
   ```

    **Ответ:** Вывод `[0 -1 -1 -1 4 5]`: basic slice разделяет storage. `b = a[1:4].copy()` даёт независимый numeric buffer.

    **Пример:**

    ```python
    import numpy as np

    a = np.arange(6)
    b = a[1:4].copy()
    b[:] = -1
    assert a.tolist() == [0, 1, 2, 3, 4, 5]
    assert not np.shares_memory(a, b)
    ```

    **Источник:** [NumPy: Copies and views](https://numpy.org/doc/stable/user/basics.copies.html)

27. Почему изменение результата индексации не изменяет исходный массив?

   **Условие:**

   ```python
   import numpy as np

   a = np.arange(5)
   b = a[[1, 3]]
   b[:] = 0
   print(a, b)
   ```

    **Ответ:** Advanced indexing создало copy; a остаётся `[0 1 2 3 4]`, b становится `[0 0]`. Для изменения исходных позиций нужно `a[[1,3]] = 0`.

    **Источник:** [NumPy: Copies and views](https://numpy.org/doc/stable/user/basics.copies.html)

28. Какую форму будет иметь результат и почему это не поэлементное сложение двух векторов одной формы?

   **Условие:**

   ```python
   import numpy as np

   a = np.ones((3, 1))
   b = np.arange(4)
   print((a + b).shape)
   ```

    **Ответ:** Форма `(3,4)`: размеры (3,1) и (4,) расширяются до (3,4), создавая все суммы row/column. Это outer-like broadcasting, не попарное сложение равных vectors.

    **Источник:** [NumPy: Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html)

29. Как интерпретировать результат с учётом фиксированного dtype и как избежать нежелательного переполнения?

   **Условие:**

   ```python
   import numpy as np

   a = np.array([250], dtype=np.uint8)
   print(a + np.array([10], dtype=np.uint8))
   ```

    **Ответ:** Вывод `[4]`: сложение двух uint8 arrays даёт uint8 с wrap 260 mod 256. Сначала расширить dtype, например `a.astype(np.uint16)+10`, и проверить диапазон перед обратным narrowing.

    **Источник:** [NumPy: Type promotion](https://numpy.org/doc/stable/reference/arrays.promotion.html)

30. Почему оптимизация меняет контракт относительно входного массива и что проверить перед её использованием?

   **Условие:**

   ```python
   import numpy as np

   def normalize(values):
       values -= values.mean()
       return values

   a = np.array([1.0, 2.0, 3.0])
   b = normalize(a)
   print(a, b)
   ```

    **Ответ:** Функция меняет a и возвращает тот же object; оба показывают `[-1.,0.,1.]`. Для независимого результата выделить copy/выражение, проверить floating dtype, writable flag, aliases и numerical edge cases.

    **Источник:** [NumPy: Universal functions](https://numpy.org/doc/stable/reference/ufuncs.html); [NumPy: Copies and views](https://numpy.org/doc/stable/user/basics.copies.html)

## Практические задачи

31. Как сравнить цикл Python и NumPy на одинаковых данных, отдельно измерив создание массивов и вычисление?

    **Ответ:** Подготовить одинаковые values/dtype, отдельно замерить conversion/allocation и steady compute, проверить output с нужным tolerance. Warmup/repeats и размеры до/сверх cache, memory footprint входят в report.

    **Источник:** [Python 3.14: library/timeit.html](https://docs.python.org/3.14/library/timeit.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

32. Как реализовать потоковую статистику больших массивов с ограничением памяти и проверкой против эталона на небольшом наборе?

    **Ответ:** Поддерживать count/sum либо устойчивые mergeable mean/M2 по chunks, не усреднять unweighted chunk means. Ограничить buffers, проверить против small full-array reference на неравных chunks/NaN policy/большом dynamic range.

    **Источник:** [NumPy: sum](https://numpy.org/doc/stable/reference/generated/numpy.sum.html); [Python 3.14: library/statistics.html](https://docs.python.org/3.14/library/statistics.html)

33. Как написать набор тестов view/copy/strides, включающий transpose, срез с шагом и advanced indexing?

    **Ответ:** Parametrize numeric shapes/dtypes и operations: basic slice/step/transpose/advanced indexing. Проверять values, shape/strides, shares_memory и mutation propagation, включая non-contiguous/negative-stride cases.

    **Источник:** [NumPy: Copies and views](https://numpy.org/doc/stable/user/basics.copies.html); [pytest: Documentation](https://docs.pytest.org/en/stable/)

34. Как исследовать пиковую память выражения с несколькими временными массивами и подтвердить пользу chunking или `out=`?

    **Ответ:** Изолированно измерить peak RSS и tracked allocations/array buffers для исходного expression и chunk/out вариантов. Проверить равный output и ownership, чтобы меньшая память не оказалась изменением input или dtype.

    **Источник:** [Python 3.14: library/tracemalloc.html](https://docs.python.org/3.14/library/tracemalloc.html); [NumPy: Universal functions](https://numpy.org/doc/stable/reference/ufuncs.html)

35. Как подготовить benchmark reduction с разными dtype и размерами, фиксируя численную ошибку и layout входа?

    **Ответ:** Матрица sizes×dtypes×axis/layout, отдельные warmup/repeats и правильный accumulator/reference. Сохранить error norm/tolerance, NaN/overflow policy, versions/BLAS thread count и timings без смешения setup.

    **Источник:** [NumPy: sum](https://numpy.org/doc/stable/reference/generated/numpy.sum.html); [NumPy: allclose](https://numpy.org/doc/stable/reference/generated/numpy.allclose.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

## Что прочитать

- [NumPy: copies and views](https://numpy.org/doc/stable/user/basics.copies.html)
- [NumPy: broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html)
- [Python: profiling](https://docs.python.org/3.14/library/profile.html)
- [Python: tracemalloc](https://docs.python.org/3.14/library/tracemalloc.html)

[← Предыдущая тема](./06_concurrency_asyncio.md) · [План раздела](./README.md) · [Следующая тема →](./08_cpp_integration.md)
