# Отладка, тестирование и численная корректность

Цель — объяснять ошибки через индексы, зависимости, память и время жизни ресурсов, а численные расхождения — через контракт вычисления. Предварительно нужны [kernels и индексы](03_kernels_and_indexing.md), [синхронизация](06_synchronization_and_atomics.md) и [асинхронное исполнение](07_streams_events_and_graphs.md). Задачи используют CUDA C++; правила floating point дополнительно рассмотрены в [представлении данных CPU](../12_computer_architecture/02_data_representation.md).

## Лёгкий уровень

1. Какие ошибки может обнаружить компилятор, какие возвращает вызов CUDA API, а какие проявляются во время исполнения kernel? Приведите пример каждой категории и объясните, почему успешная сборка и запуск процесса ещё не подтверждают корректность вычисления.

   **Ответ:** Компилятор обнаруживает, например, неверный тип/недопустимый вызов; API возвращает ошибку параметров/выделения; kernel может получить illegal access во время исполнения. Дополнительно бывают молча неверные результаты. Нужны проверки статусов, завершения и сравнение с контрактом.

   **Типичная ошибка:** Считать сборку доказательством корректности вычисления.

   **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

2. Почему ошибка GPU может быть сообщена при более позднем вызове runtime, чем породившая её операция? Проследите последовательность двух launches и синхронизации; какие сведения о порядке вызовов и их результатах нужно сохранить для локализации причины?

   **Ответ:** Запуски асинхронны: K1 и K2 могут быть поставлены раньше обнаружения сбоя K1 при sync. Сохраняют порядок, stream/device, конфигурацию и все статусы. В диагностическом режиме проверяют completion после каждого kernel, учитывая влияние сериализации.

   **Типичная ошибка:** Обвинять второй kernel только потому, что ошибка пришла после него.

   **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

3. Чем проверка launch status отличается от проверки завершения kernel? Составьте план проверки недопустимой конфигурации запуска и выхода за границу массива, уточнив назначение `cudaGetLastError`, `cudaPeekAtLastError` и выбранной точки ожидания по документации API.

   **Ответ:** Launch status проверяет постановку и конфигурацию, completion — исполнение. `cudaPeekAtLastError` не очищает состояние, `cudaGetLastError` очищает; далее проверяют stream/event sync. Out-of-bounds надёжнее исследовать memcheck: не каждое логически неверное обращение обязательно аварийно.

   **Типичная ошибка:** Ожидать, что любая ошибка границы вернётся сразу из launch.

   **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

4. Какие размеры входа первыми проверять у поэлементного kernel? Составьте набор для пустого массива, одного элемента, размеров меньше block и размеров рядом с кратными block; как CPU-эталон поможет обнаружить пропуск или повторную обработку элементов?

   **Ответ:** Минимальный набор N=0,1,B-1,B,B+1,2B-1,2B+1. CPU-эталон с различимыми элементами и sentinel выхода помогает найти пропуски; для повторов используют счётчики посещений, потому что повторная одинаковая запись может быть незаметна.

   **Типичная ошибка:** Проверять только размеры, кратные блоку.

   **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

5. Как различить неправильный индекс, неинициализированное значение и использование уже освобождённого буфера? Для каждого случая предложите минимальный вход и наблюдение, которое сузит поиск, сохраняя исходный порядок выполнения программы.

   **Ответ:** Неверный индекс исследуют memcheck и адресными формулами на малом хвосте; uninitialized value — initcheck и явной инициализацией; use-after-free — графом lifetime/event-зависимостей и memcheck. Сохраняют async-порядок и меняют один фактор, иначе гонка может скрыться.

   **Типичная ошибка:** Добавлять общий sync и считать исчезновение ошибки доказательством исправления.

   **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

6. Почему два правильных алгоритма суммирования `float` могут дать разные результаты? Покажите роль порядка сложений и округления; какое требование приложения определяет, нужны ли побитовое совпадение, абсолютный или относительный допуск?

   **Ответ:** Float-сложение округляется и не ассоциативно: `(1e20f + -1e20f)+3≈3`, а `1e20f+(-1e20f+3)≈0`. Допустимое расхождение задаёт приложение: bitwise reproducibility требует фиксированных гарантий, численная близость — обоснованных atol/rtol и эталона.

   **Типичная ошибка:** Объявлять любое отличие float ошибкой или автоматически допустимым.

   **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

7. Чем out-of-bounds access отличается от data race? Сравните запись по неверному индексу и запись двух потоков в одну допустимую ячейку без нужной синхронизации; может ли один и тот же kernel содержать обе ошибки?

   **Ответ:** Out-of-bounds нарушает допустимый адресный диапазон; race возникает у конфликтующих неупорядоченных доступов даже к валидной ячейке. Kernel может содержать обе ошибки одновременно. Исправление границы не устанавливает отсутствующую синхронизацию.

   **Типичная ошибка:** Принимать успешный memcheck за отсутствие data races.

   **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

8. Какие виды проблем исследуют memcheck, racecheck, initcheck и synccheck из Compute Sanitizer? Подберите инструмент для четырёх небольших сценариев и уточните по документации область памяти и условия, которые реально покрывает каждая проверка.

   **Ответ:** Memcheck ищет неверные/невыровненные обращения, racecheck — прежде всего shared hazards, initcheck — неинициализированные global reads, synccheck — нарушения проверяемых барьеров/warp synchronization. Выбирают режим под сценарий и проверяют его ограничения в установленной версии.

   **Типичная ошибка:** Считать racecheck универсальным детектором глобальных гонок.

   **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

## Средний уровень

9. Как локализовать kernel, после которого результат впервые становится неверным? Разбейте цепочку операций на проверяемые стадии, выберите минимальные точки наблюдения и объясните, как добавленная синхронизация может изменить проявление гонки.

   **Ответ:** Сохраняют или проверяют результат после каждой существенной стадии, затем сужают первую неверную границу. Проверки не обязаны копировать весь массив: подходят контрольные элементы/инварианты и малый вход. Добавленный sync может скрыть async race, поэтому причинное исправление проверяют и без него.

   **Типичная ошибка:** Оставлять диагностический sync как необъяснённое исправление.

   **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

10. Как проверить корректность участия потоков в барьере следующего kernel при `n = 17` и запуске одного block из 32 потоков? Опишите ожидаемое преобразование, исследуйте пути до барьера и выхода потоков и сверьте правила условного вызова с документацией выбранной CUDA и архитектуры. Предложите проверку инструментом и объясните, почему отсутствие предупреждений само по себе не доказывает корректность.

    **Условие:**

    ```cpp
    __global__ void rotate(const float* input, float* output, int n) {
        __shared__ float tile[32];
        int i = threadIdx.x;
        if (i < n) {
            tile[i] = input[i];
            __syncthreads();
            output[i] = tile[(i + 1) % n];
        }
    }
    ```

    **Ответ:** Для n=17 ожидается циклический сдвиг: output[0…15]=input[1…16], output[16]=input[0]. Барьер находится в неравномерной ветви; поведение такой структуры нельзя обосновать общим безопасным контрактом участия. Переносят загрузку под условие, барьер — вне ветви, затем условную запись. Проверяют n=0…32 с synccheck и анализом всех путей.

    **Пример:**

    ```cpp
    // Один блок из 32 потоков, 0 <= n <= 32,
    // input и output не пересекаются.
    __global__ void rotate_safe(const float* input, float* output, int n) {
        __shared__ float tile[32];
        int i = threadIdx.x;
        if (i < n) tile[i] = input[i];
        __syncthreads();
        if (i < n) output[i] = tile[(i + 1) % n];
    }
    ```

    **Типичная ошибка:** Считать отсутствие предупреждения доказательством допустимости условного барьера.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

11. Как спроектировать тест для гонки между двумя streams, использующими один временный буфер? Укажите ожидаемые зависимости и время жизни данных, затем сравните вариант с явными событиями и исследуемый вариант без предположения, что редкое проявление означает допустимость программы.

    **Ответ:** Двум streams дают различимые входы и один workspace, многократно чередуют нагрузку. Корректный контроль использует отдельные workspaces либо event от последнего потребителя к следующему писателю. Сравнивают результаты и DAG; редкость повреждения без зависимости не делает программу корректной.

    **Типичная ошибка:** Проверять гонку только последовательной подачей запросов.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

12. Почему отсутствие предупреждений racecheck не доказывает отсутствие всех гонок программы? Проверьте покрываемые области памяти и примитивы, затем предложите отдельный разбор глобальных данных, межблочного обмена и одновременного доступа CPU.

    **Ответ:** Racecheck покрывает определённые hazards/примитивы, главным образом shared memory, а не произвольный глобальный протокол. Global buffer, межблоковые flags и CPU/GPU доступ разбирают через атомики, scope, ordering и lifetime вручную, дополняя stress-тестами.

    **Типичная ошибка:** Считать чистый racecheck доказательством прогресса очереди.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

13. Как выбрать эталон и допуски для GEMM с пониженной точностью входа и более точным накоплением? Учитывайте длину редукции, масштаб данных, cancellation и выходной формат; почему одна фиксированная относительная ошибка неудобна около нуля?

    **Ответ:** Эталон должен учитывать округление storage-входов и отдельно высокоточную оценку математики задачи. Допуски зависят от K, масштаба, cancellation, multiplication/accumulation/output types. Используют abs+rel правило и отдельные проверки near-zero; при необходимости — нормы ошибки.

    **Типичная ошибка:** Применять один rtol без atol к результатам около нуля.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

14. Как проверить специальные floating-point значения без ложных выводов? Составьте входы с `+0`, `-0`, NaN, бесконечностями и субнормальными числами, затем определите, какие различия допускаются контрактом операции и выбранными настройками компилятора.

    **Ответ:** Сравнивают NaN через isnan, Inf — по классу/знаку, ±0 — с signbit только если знак значим для контракта. Субнормальные проверяют с учётом flush-to-zero и compiler math flags. Для каждой операции отдельно определяют ожидаемые специальные значения.

    **Типичная ошибка:** Проверять NaN равенством либо считать +0 и -0 всегда взаимозаменяемыми.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

15. Как метаморфические проверки помогают, если точный эталон большого GPU-расчёта слишком дорог? Предложите свойства для transpose, histogram и FFT round trip; какие ошибки могут сохранять выбранное свойство и поэтому требуют дополнительного независимого теста?

    **Ответ:** Transpose дважды должен вернуть исходник, сумма histogram — N, inverse(forward(x))/N — x в допуске. Эти свойства дополняют дешёвый независимый эталон: например две взаимно согласованные неверные перестановки тоже могут пройти round-trip.

    **Типичная ошибка:** Подменять все проверки одним обратимым свойством.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

16. Как включить GPU-проверки в CI с неоднородными исполнителями? Разделите проверку исходников, CPU-эталоны и реальные запуски CUDA, задайте матрицу поддерживаемых GPU/toolkit и способ явно сообщать о пропущенном аппаратном тесте.

    **Ответ:** На всех runners проверяют структуру/компиляцию и CPU-эталоны; на совместимых GPU — execution, sanitizer и численные режимы. Матрица фиксирует GPU/CC, toolkit/driver и библиотеки. Отсутствующий GPU означает явный skipped с причиной, а не passed.

    **Типичная ошибка:** Подменять аппаратную проверку импортом CUDA-библиотеки.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

## Сложный уровень

17. Как расследовать ошибку, исчезающую при запуске под отладчиком или с принудительной синхронизацией? Сохраните минимальный асинхронный сценарий и составьте гипотезы о lifetime, зависимостях, неинициализированной памяти и синхронизации, подбирая по одному изменению для проверки каждой.

    **Ответ:** Исчезновение под debugger/sync указывает на зависимость проявления от timing. По одному проверяют удержание владельца, явный event, инициализацию scratch и участие в барьерах, сохраняя минимальный async сценарий. После исправления возвращают обычную конкурентность и stress-тест.

    **Типичная ошибка:** Считать исчезновение бага под отладчиком подтверждением его отсутствия.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

18. После ошибки доступа последующие вызовы CUDA продолжают возвращать ошибки: как определить допустимый способ восстановления? Проверьте контракт конкретной ошибки и состояние контекста, затем спроектируйте прекращение новых запросов, сохранение диагностики и решение о перезапуске рабочего процесса.

    **Ответ:** После тяжёлой device error контекст может быть непригоден для продолжения; читают контракт конкретного cudaError. Прекращают новые запросы, сохраняют первый сбой и отменяют зависимые операции; для poisoned context обычно нужен перезапуск worker/process. Сброс last-error не восстанавливает память/контекст.

    **Типичная ошибка:** Бесконечно очищать last error и повторять вычисление.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

19. Как отличить ошибку алгоритма от допустимой недетерминированности порядка floating-point атомарных сложений? Сравните распределение результатов на повторных запусках, более точный эталон и вариант с фиксированным деревом редукции; какие выводы нельзя сделать из одного совпавшего результата?

    **Ответ:** Разный порядок атомарных float additions даёт разное округление. Сравнивают многократные результаты с более точным эталоном, пределом допустимой ошибки и фиксированным деревом reduction; проверяют также число вкладов. Один совпавший запуск не исключает потерянные обновления или гонку.

    **Типичная ошибка:** Объяснять любую большую ошибку недетерминированностью float.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

20. Какие требования нужно уточнить для воспроизводимости между моделями GPU и версиями библиотек? Разберите FMA, математические функции, порядок редукции, math mode и документированные гарантии библиотек; как сохранить параметры, необходимые для повторения эксперимента?

    **Ответ:** Уточняют требование: статистическое, численное или побитовое совпадение. Фиксируют GPU, toolkit/libs, math mode, FMA/fast-math, reduction algorithm, seed и mapping. Межархитектурные math functions и библиотечные алгоритмы имеют конкретные гарантии, которые проверяют, а не предполагают.

    **Типичная ошибка:** Обещать bitwise reproducibility по одному seed.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

21. При размерах больше `2^31` kernel повреждает память, хотя мелкие тесты проходят: как построить расследование? Проверьте типы индексов, промежуточные произведения, размеры выделений и вычисление grid, затем предложите уменьшенную модель, воспроизводящую переполнение без огромного буфера.

    **Ответ:** Ищут signed int индексы, узкие произведения до cast, переполнение bytes и ceil-grid. Проверяют искусственные координаты около 2^31/2^32 в широком эталоне либо модель с намеренно меньшей разрядностью. Реальный большой запуск делают только после проверки памяти и лимитов.

    **Типичная ошибка:** Расширять только конечную переменную, оставляя узкую арифметику.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

22. Как диагностировать deadlock в схеме межблочного ожидания атомарных флагов? Разберите гарантии планирования и прогресса ожидающих и ещё не начавших blocks; какие условия отличают произвольный launch от документированного механизма grid synchronization?

    **Ответ:** Проверяют, кто ждёт и может ли производитель получить ресурсы, а также корректность atomic scope/order. Снижение grid может раскрыть ресурсную зависимость, но не доказать общий прогресс. Предпочитают kernel boundaries или документированный cooperative launch в его пределах.

    **Типичная ошибка:** Лечить deadlock увеличением таймаута.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

23. Как оценить ошибку длинного вычислительного pipeline, если каждый отдельный kernel проходит тест с локальным допуском? Определите значимые для приложения инварианты, чувствительность к входам и способ сравнения конечного результата; почему сумма одинаковых локальных допусков не всегда даёт полезную оценку?

    **Ответ:** Проверяют конечные инварианты приложения и ошибку на репрезентативных/плохо обусловленных входах относительно более точного pipeline. Локальные ошибки могут усиливаться чувствительными стадиями или компенсироваться; простая сумма одинаковых допусков не учитывает усиление. Задают конечный error budget и анализируют вклад стадий.

    **Типичная ошибка:** Принимать прохождение каждого kernel в отдельности за качество всей цепочки.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

24. Подготовьте минимальный воспроизводимый отчёт об ошибке GPU-вычисления. Какие исходники, вход, ожидаемый результат, версии, конфигурация запуска, сообщения sanitizer и данные о частоте проявления позволят проверить проблему без доступа к полному приложению?

    **Ответ:** Минимальный отчёт содержит запускаемый код, точные команды/вход/seed, expected/actual, GPU/CC, driver/toolkit/libs, launch/streams и первый error. Прилагают sanitizer log, частоту проявления и условия async-нагрузки. Уменьшение сохраняет ошибку и важные зависимости.

    **Типичная ошибка:** Присылать только скриншот поздней ошибки без воспроизводимого входа.

    **Источник:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html); [Floating-Point Computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

## Критерий освоения

Вы проверяете границы, зависимости и lifetime отдельно от численной точности, знаете область покрытия выбранного инструмента и умеете уменьшить ошибочный сценарий. Ожидаемый результат и допуски сформулированы до оптимизации, а аппаратные проверки действительно выполняются в поддерживаемой среде.

Источники: [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html), [CUDA: floating-point computation](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/mathematical-functions.html).

[← Профилирование и оптимизация](13_profiling_and_optimization.md) · [Оглавление](README.md) · [Несколько GPU →](15_multi_gpu_and_communication.md)
