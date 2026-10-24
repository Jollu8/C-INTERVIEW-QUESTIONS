# Дополнительно: обработка данных и pandas

Дополнительная ветка; проходите по задачам выбранной роли.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Когда для анализа результатов достаточно стандартной библиотеки, а когда полезны NumPy и pandas?

   **Ответ:** Stdlib достаточно для streaming CSV/JSON и небольших aggregates; NumPy полезен typed numeric kernels, pandas — labelled tables/joins/groupby. Выбор учитывать memory/dtypes/объём, не подключать DataFrame лишь ради одного поля.

   **Источник:** [Python 3.14: library/csv.html](https://docs.python.org/3.14/library/csv.html); [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html); [pandas: User guide](https://pandas.pydata.org/docs/user_guide/)

2. Чем таблица DataFrame отличается от числового ndarray по модели данных и возможным dtype столбцов?

   **Ответ:** DataFrame — labelled rows/columns с потенциально разными column dtypes и missing-value policies. Ndarray обычно homogeneous typed n-dimensional buffer; object dtype и extension arrays добавляют нюансы.

   **Источник:** [pandas: User guide](https://pandas.pydata.org/docs/user_guide/); [NumPy: ndarray](https://numpy.org/doc/stable/reference/arrays.ndarray.html)

3. Почему автоматическое определение dtype при чтении CSV может нарушить контракт идентификатора?

   **Ответ:** CSV хранит текст без schema: inference превратит 001 в число 1 и потеряет representation. Задать строковый ID dtype/NA rules и validate, не восстанавливать leading zeros эвристикой после чтения.

   **Рекомендация:** Identifier читать и проверять как string до любой автоматической numeric inference.

   **Источник:** [pandas: IO tools](https://pandas.pydata.org/docs/user_guide/io.html)

4. Как различаются отсутствующее значение, пустая строка, ноль и некорректная запись в наборе результатов?

   **Ответ:** Missing означает отсутствие наблюдения, empty string — конкретное текстовое значение по schema, zero — реальное измерение, invalid — нарушение контракта. Нужны nullable columns/status/rejected rows и явная статистическая policy.

   **Источник:** [pandas: Missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html)

5. Как явно определить единицы времени, timezone и правила интерпретации timestamp?

   **Ответ:** Хранить unit/duration vs instant, offset/timezone и parsing format, нормализовать instants по declared UTC policy. Наивный timestamp не имеет определённой timezone; DST ambiguous/nonexistent times обрабатываются явно.

   **Источник:** [pandas: IO tools](https://pandas.pydata.org/docs/user_guide/io.html)

6. Как join по неуникальному ключу может неожиданно увеличить число строк?

   **Ответ:** Для key с m строками слева и n справа many-to-many даёт m×n combinations. Validate='many_to_one'/'one_to_one' проверяет expected cardinality, indicator выявляет unmatched keys.

   **Источник:** [pandas: merge](https://pandas.pydata.org/docs/reference/api/pandas.merge.html)

7. Как обработка чанками ограничивает память и почему не каждая агрегация допускает независимое объединение результатов?

   **Ответ:** Bounded chunks уменьшают resident input, но все накопленные frames или global sort всё равно требуют много памяти. Sum/count mergeable, mean требует веса, exact quantiles — исходные данные/иной алгоритм.

   **Источник:** [pandas: Scaling to large datasets](https://pandas.pydata.org/docs/user_guide/scale.html); [pandas: Group by](https://pandas.pydata.org/docs/user_guide/groupby.html)

8. Когда Parquet может быть удобнее CSV и какие сведения о схеме нужно сохранять?

   **Ответ:** Parquet хранит typed columnar данные/metadata и удобен для projection/compression. Зафиксировать schema, ID dtype, nullable/timestamp/timezone и engine/version; CSV проще для interchange, но теряет типы без внешней schema.

   **Источник:** [pandas: IO tools](https://pandas.pydata.org/docs/user_guide/io.html)

9. Как проверить данные на уровне схемы, диапазонов и отношений между полями?

   **Ответ:** Сначала names/types/nullability, затем ranges/uniqueness и cross-field правила, например successful⇒duration≥0. Rejected rows имеют отдельный журнал с безопасной причиной; type conversion не заменяет validation.

   **Источник:** [pandas: User guide](https://pandas.pydata.org/docs/user_guide/); [pandas: Missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html)

10. Как изменение dtype и категориальное кодирование влияют на память и допустимые значения?

    **Ответ:** Компактные dtypes/category экономят память при подходящем диапазоне/cardinality. Narrowing может переполниться, category ограничивает набор/unknown policy; object/string/category semantics и память измерять на фактической версии.

    **Источник:** [pandas: User guide](https://pandas.pydata.org/docs/user_guide/); [pandas: IO tools](https://pandas.pydata.org/docs/user_guide/io.html)

## Разбор кода

11. Почему строковый идентификатор может потерять ведущие нули при автоматическом чтении?

   **Условие:**

   ```python
   from io import StringIO
   import pandas as pd

   frame = pd.read_csv(StringIO("id,value\n001,7\n"))
   print(frame.dtypes)
   print(frame["id"].iloc[0])
   ```

    **Ответ:** ID обычно будет integer 1, leading zeros потеряны. Читать `dtype={'id':'string'}` и при необходимости настраивать keep_default_na/na_values; проверять round-trip исходного identifier.

    **Источник:** [pandas: IO tools](https://pandas.pydata.org/docs/user_guide/io.html)

12. Почему join создаёт больше строк, чем ожидалось, и как выразить требуемую кардинальность?

   **Условие:**

   ```python
   import pandas as pd

   left = pd.DataFrame({"id": [1, 1], "x": [10, 20]})
   right = pd.DataFrame({"id": [1, 1], "y": [30, 40]})
   print(left.merge(right, on="id"))
   ```

    **Ответ:** Получатся четыре строки: две слева × две справа для id=1. Если ожидался many-to-one, `validate='many_to_one'` даст ошибку; ключ metadata должен быть проверенно unique.

    **Источник:** [pandas: merge](https://pandas.pydata.org/docs/reference/api/pandas.merge.html)

13. Почему среднее из средних может дать неверный результат и какую информацию нужно хранить для объединения чанков?

   **Условие:**

   ```python
   chunk_means = [10.0, 100.0]
   chunk_sizes = [1000, 1]
   print(sum(chunk_means) / len(chunk_means))
   ```

    **Ответ:** 55 — неверное объединённое mean; правильное `(10*1000+100*1)/1001 ≈ 10.08991`. Хранить sum/count либо mean/count с корректным weighted merge и defined missing policy.

    **Источник:** [pandas: Group by](https://pandas.pydata.org/docs/user_guide/groupby.html); [Python 3.14: library/statistics.html](https://docs.python.org/3.14/library/statistics.html)

14. Почему формальное заполнение пропусков нулём меняет смысл статистики?

   **Условие:**

   ```python
   import pandas as pd

   latency = pd.Series([1.0, None, 2.0])
   print(latency.fillna(0).mean())
   ```

    **Ответ:** Missing подменяется реальным zero: mean становится 1 вместо mean наблюдённых значений 1.5. Выбрать drop/impute/error policy с сохранением missing count/status, не объявлять любой NaN нулём.

    **Источник:** [pandas: Missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html)

15. Почему такое накопление не ограничивает память размером одного чанка?

   **Условие:**

   ```python
   import pandas as pd

   frames = []
   for chunk in pd.read_csv("results.csv", chunksize=10000):
       frames.append(chunk)
   result = pd.concat(frames)
   ```

    **Ответ:** List frames удерживает все chunks, concat выделяет ещё итоговую table. Для bounded memory агрегировать/писать chunks сразу и освобождать их; operations с глобальным состоянием требуют отдельного memory/external algorithm budget.

    **Источник:** [pandas: Scaling to large datasets](https://pandas.pydata.org/docs/user_guide/scale.html)

## Практические задачи

16. Как построить загрузчик отчётов benchmark с явной схемой, единицами, валидацией и отдельным журналом отклонённых строк?

    **Ответ:** Явная schema/dtypes/units, bounded chunk reader, validation и normalized typed output. Bad rows/status идут отдельно, counters accepted/rejected проверяются; fixtures покрывают leading zeros, NULL/empty, invalid dates и oversized records.

    **Источник:** [pandas: IO tools](https://pandas.pydata.org/docs/user_guide/io.html); [pandas: Missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html)

17. Как вычислить объединённое среднее по чанкам без сохранения всех строк и проверить результат на неравных чанках?

    **Ответ:** На chunk получить sum/count валидных observations и объединить по policy; для устойчивости использовать подходящий summation/mean merge. Проверить unequal sizes, empty/all-missing chunks и сравнить с full reference без сохранения всех строк в основном пути.

    **Пример:**

    ```python
    import math

    def chunked_mean(chunks):
        total = 0.0
        count = 0
        for chunk in chunks:  # Числа уже валидированы, missing policy применена.
            total = math.fsum((total, math.fsum(chunk)))
            count += len(chunk)
        return total / count if count else None

    assert math.isclose(chunked_mean([[10.0] * 1000, [100.0]]), 10100 / 1001)
    assert chunked_mean([[], []]) is None
    ```

    **Типичная ошибка:** Усреднять средние чанков без учёта числа валидных измерений.

    **Источник:** [pandas: Group by](https://pandas.pydata.org/docs/user_guide/groupby.html); [Python 3.14: library/statistics.html](https://docs.python.org/3.14/library/statistics.html)

18. Как выполнить join результатов и metadata с проверкой ожидаемой кардинальности и обнаружением потерянных ключей?

    **Ответ:** Сначала проверить unique key metadata, затем left merge с validate='many_to_one' и indicator=True. Проверить row count/left_only и null keys: pandas может сопоставлять null keys друг с другом, что отличается от обычного SQL expectation.

    **Источник:** [pandas: merge](https://pandas.pydata.org/docs/reference/api/pandas.merge.html)

19. Как преобразовать серию CSV в Parquet с проверкой dtype и обратного чтения без потери идентификаторов?

    **Ответ:** Каждый CSV читать с explicit schema/ID strings и NA/timestamp rules, писать совместимые Parquet chunks/partitions. Сверить schema, counts и identifier values после read-back, сохранить manifest/engine/version и не смешивать conflicting schemas молча.

    **Источник:** [pandas: IO tools](https://pandas.pydata.org/docs/user_guide/io.html)

20. Как подготовить анализ latency с различением отсутствующих измерений, ошибок запуска и настоящих нулевых значений?

    **Ответ:** Отдельные status/error/measurement fields, null для отсутствия и zero только при valid measurement. Статистика по declared success/valid subset с counts всех exclusions, группировка по сопоставимому workload/unit и сохранением failures.

    **Источник:** [pandas: Missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html); [pandas: Group by](https://pandas.pydata.org/docs/user_guide/groupby.html)

## Что прочитать

- [pandas: user guide](https://pandas.pydata.org/docs/user_guide/index.html)
- [pandas: merge](https://pandas.pydata.org/docs/user_guide/merging.html)
- [pandas: scaling](https://pandas.pydata.org/docs/user_guide/scale.html)

[← Предыдущая тема](./10_backend_optional.md) · [План раздела](./README.md) · [Следующая тема →](./12_security_optional.md)
