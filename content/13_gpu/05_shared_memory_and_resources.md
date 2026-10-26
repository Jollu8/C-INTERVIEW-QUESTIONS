# Shared memory, регистры и ресурсы блока

Цель — научиться выбирать место хранения промежуточных данных и оценивать цену повторного использования: обращения к памяти, синхронизацию и занятые ресурсы SM. Организация банков, доступные объёмы памяти и правила выделения ресурсов зависят от архитектуры; численные задания ниже задают собственную учебную модель.

Предпосылки: [архитектура GPU](01_gpu_architecture.md), [ядра и индексация](03_kernels_and_indexing.md), [global memory и обращения к данным](04_global_memory.md). Для практических заданий понадобится [сборка и запуск CUDA](02_cuda_toolchain.md), а правила барьеров подробно разбираются в [следующей теме](06_synchronization_and_atomics.md).

## Лёгкий уровень

1. Какие данные естественно хранить в регистрах потока, какие — в shared memory блока, а какие — в global memory? Для поэлементного сложения массивов и суммы элементов одного блока определите владельцев входных данных, промежуточных результатов и итогового значения.

   **Ответ:** Регистры естественны для индекса и аккумулятора потока, shared — для совместного промежуточного результата блока, global — для входов/выходов и обмена между запусками. В сумме массивов каждый поток пишет свой global-элемент; в блочной reduction значения совместно объединяются, итог пишет назначенный поток.

   **Типичная ошибка:** Хранить межблоковый результат только в shared.

   **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

2. Что означает общий доступ потоков блока к переменной с `__shared__` и как долго существует её экземпляр? Разберите два блока, каждый из которых записывает `shared[0]`, и определите, могут ли они таким способом обменяться значениями при обычном запуске ядра.

   **Ответ:** Каждый блок имеет собственный экземпляр shared memory, доступный его потокам и существующий на время блока. Два блока, записывающие `shared[0]`, изменяют разные объекты и при обычном запуске так не обмениваются данными.

   **Типичная ошибка:** Принимать shared за общую память всей grid.

   **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

3. Почему локальная переменная в исходном CUDA C++ не обязательно всё время хранится в регистре? Сравните скалярный аккумулятор, небольшой массив с индексом времени компиляции и массив с индексом из входных данных; какие сведения о размещении нужно искать после компиляции?

   **Ответ:** Компилятор может держать скаляр в регистре, разложить статически индексируемый массив по регистрам либо разместить динамически индексируемый массив в local memory. Ресурсное давление также вызывает spills. Проверяют `-Xptxas=-v`, PTX/SASS и профиль local loads/stores.

   **Типичная ошибка:** Выводить размещение только из объявления C++.

   **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

4. Чем local memory в терминологии CUDA отличается от shared memory, несмотря на похожий бытовой смысл слова «локальная»? Для временного массива каждого потока укажите область видимости и возможное физическое место хранения, затем объясните, какие задержки и трафик стоит исследовать.

   **Ответ:** Local memory приватна потоку по адресации, но обычно обслуживается через иерархию device memory и кэши. Shared memory — явно совместная память блока на SM. Для временного массива изучают кэш, local-трафик и зависимые задержки.

   **Типичная ошибка:** Считать local memory быстрым аналогом shared.

   **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

5. Зачем загружать фрагмент входного массива в shared memory, если исходные данные уже доступны из global memory? Для блока, который несколько раз использует один и тот же фрагмент, перечислите новые затраты и предложите случай, когда дополнительное копирование не окупится.

   **Ответ:** Тайл в shared позволяет повторно использовать загруженные данные и менять порядок обращений. Дополнительны загрузка/запись shared, барьеры, адресная арифметика и расход ресурса SM. Для однократного использования или уже эффективного кэша копирование может не окупиться.

   **Типичная ошибка:** Считать любое использование shared ускорением.

   **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

6. Чем статический массив `__shared__ float tile[256]` отличается от `extern __shared__ float tile[]`? Опишите, где задаётся объём каждого варианта, и рассчитайте число байт для динамического массива из 768 элементов `float` по 4 байта.

   **Ответ:** Статический объём известен при компиляции, динамический задаётся третьим параметром launch в байтах. Для 768 float нужно `768*4=3072` байта, сверх статической shared. Общий объём должен соответствовать пределам kernel/устройства.

   **Типичная ошибка:** Передавать число элементов вместо байтов.

   **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

7. Почему запись одних потоков в shared memory и последующее чтение другими требуют установленного порядка выполнения? Для схемы «каждый поток записал свой элемент, затем поток 0 читает все элементы» обозначьте место передачи данных и требования к участникам синхронизации, не полагаясь на близкие номера потоков.

   **Ответ:** После записей всего тайла и до чтения чужих элементов ставят блоковый барьер с корректным участием. Он устанавливает завершение предшествующих обращений и их видимость участникам. Поток 0 не может предполагать, что остальные уже записали данные.

   **Типичная ошибка:** Защищать барьером только поток 0.

   **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

8. Что называют тайлом и какую часть задачи обслуживает один тайл при обработке матрицы? Для матрицы `100 × 70` и тайла `16 × 16` определите число тайлов и опишите, как обработать крайние области, сохранив корректность загрузок и совместной работы блока.

   **Ответ:** Тайл — ограниченный фрагмент, совместно обслуживаемый блоком. Для размеров 100 и 70 нужны `ceil(100/16)*ceil(70/16)=7*5=35` тайлов. В хвостах загрузки/записи ограничивают координатами, недостающие значения при необходимости заменяют нейтральными; барьеры остаются коллективными.

   **Типичная ошибка:** Делать ранний выход, пропускающий нужную инициализацию тайла.

   **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

## Средний уровень

9. Как связаны адрес элемента в shared memory и номер обслуживающего его банка? В учебной модели с 32 банками, шириной слова 4 байта и отображением `bank = word_index % 32` найдите банки для обращений 32 потоков к `s[lane]`, `s[2 * lane]` и `s[32 * lane]`.

   **Ответ:** При `bank=word_index%32` доступ `s[lane]` использует 32 разных банка; `s[2*lane]` — 16 банков по два разных слова; `s[32*lane]` — один банк с 32 разными словами. В заданной модели это степени конфликта 1,2,32.

   **Типичная ошибка:** Переносить эту модель на любые типы и инструкции без проверки.

   **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

10. Когда обращения нескольких потоков к одному банку создают конфликт и чем чтение одного общего слова отличается от чтения разных слов этого банка? Для той же учебной модели сравните чтение всеми потоками `s[0]`, чтение `s[32 * lane]` и запись всеми потоками в `s[0]`; отдельно оцените производительность и корректность.

    **Ответ:** Чтение всеми lanes одного `s[0]` допускает broadcast; разные `s[32*lane]` конфликтуют по банку. Обычная одновременная запись всеми в `s[0]` создаёт гонку и неопределённого победителя, даже если аппаратное обслуживание быстрое.

    **Типичная ошибка:** Путать broadcast чтений с безопасностью конкурентной записи.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

11. Почему добавление столбца может изменить поведение транспонирования через shared memory? Для массивов `float tile[32][32]` и `float tile[32][33]` выведите номера банков при чтении столбца одним warp в указанной модели и объясните, какие допущения надо перепроверить для других типов и инструкций.

    **Ответ:** При чтении `tile[lane][c]` шаг 32 даёт банк c для всех lanes; шаг 33 даёт `(lane+c)%32`, то есть разные банки. Padding устраняет этот конфликт в учебной 4-байтной модели. Для других типов/инструкций проверяют фактическое разбиение запроса.

    **Типичная ошибка:** Добавлять padding без анализа адресов реально конфликтующей инструкции.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

12. Как разместить несколько массивов в одном динамическом буфере shared memory без пересечения и нарушения выравнивания? Спроектируйте размещение 257 значений `float` и 129 значений `double`, задав размеры типов 4 и 8 байт и необходимое выравнивание соответственно 4 и 8 байт; вычислите смещение второго массива и общий объём.

    **Ответ:** Первый массив занимает `257*4=1028` байт. Следующее смещение выравнивают вверх до 8: 1032; второй занимает `129*8=1032`, всего 2064 байта. Базовый динамический буфер также должен гарантировать нужное выравнивание.

    **Типичная ошибка:** Выравнивать только смещение, забыв выравнивание базы.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

13. Как размер блока и число регистров на поток ограничивают число одновременно размещённых блоков? Для учебного SM с 65 536 регистрами по 32 бита, максимумом 2048 потоков и максимумом 16 блоков рассчитайте верхние границы для блоков по 256 потоков при 32 и 64 регистрах на поток, пока игнорируя гранулярность выделения и shared memory.

    **Ответ:** При 256 потоках предел по потокам — 8 блоков. При 32 регистрах блок требует 8192 и регистры допускают 8; при 64 — 16384 и 4. С ограничением 16 блоков итоговые верхние границы равны 8 и 4.

    **Типичная ошибка:** Считать доступные регистры числом регистров на поток без умножения на блок.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

14. Как добавить ограничение shared memory к предыдущей оценке размещения? Пусть тому же SM доступны 64 КиБ shared memory, а блок использует 20 КиБ: определите число активных блоков и долю активных warp при двух вариантах расхода регистров, считая warp равным 32 потокам и максимум — 64 warp на SM.

    **Ответ:** Shared ограничивает размещение `floor(64/20)=3` блоками. В обоих вариантах регистров минимум ограничений равен 3; это 768 потоков и 24 warp, occupancy `24/64=37,5%`. Гранулярность реального выделения здесь по условию не учитывается.

    **Типичная ошибка:** Округлять 3,2 блока вверх.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

15. Что такое register spilling и почему ограничение числа регистров способно одновременно увеличить теоретическое размещение и замедлить ядро? Составьте сравнение двух сборок с отчётом компилятора, числом обращений к local memory и временем выполнения, отдельно проверяя одинаковость вычисляемого результата.

    **Ответ:** Spilling переносит часть состояния в local memory, добавляя загрузки/записи. Ограничение регистров может увеличить число блоков, но увеличить трафик и зависимости. Сравнивают одинаковые результаты, ptxas-отчёт, local-трафик, реальные активные warp и время двух сборок.

    **Типичная ошибка:** Выбирать меньше регистров только по росту теоретической occupancy.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

16. Как оценить выигрыш от тайлинга до написания оптимизированного ядра? Для stencil, в котором каждый выходной элемент использует соседей в радиусе 2 по одной оси, рассчитайте число загружаемых элементов на блок из 256 результатов с учётом halo и сравните его с прямым вариантом без явно организованного повторного использования.

    **Ответ:** Для 256 выходов и радиуса 2 нужны `256+2*2=260` входов с halo. Прямой вариант логически делает `256*5=1280` чтений, отношение около 4,92; кэш способен уже устранять часть DRAM-повторов. Нужно учесть края, shared и барьеры.

    **Типичная ошибка:** Объявлять отношение логических чтений гарантированным ускорением.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

## Сложный уровень

17. Почему увеличение числа вычисляемых одним потоком элементов может дать ускорение при меньшей occupancy? Спроектируйте сравнение вариантов с 1, 4 и 8 результатами на поток, связав число независимых операций, расход регистров, возможные spills и абсолютное время выполнения.

    **Ответ:** Несколько результатов на поток дают независимые инструкции и повторное использование входов, но увеличивают регистры. Сравнивают 1,4,8 результатов при одинаковом объёме, проверяя хвосты, spills, готовые warp и абсолютное время. Меньшая occupancy может сочетаться с большим полезным ILP.

    **Типичная ошибка:** Отбрасывать более быстрый вариант из-за меньшей occupancy.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

18. Как выбрать размер тайла, если одновременно меняются повторное использование, длина границы и число размещаемых блоков? Для двух квадратных входных тайлов и одного квадратного тайла промежуточных результатов одинаковой стороны, все с элементами `float` по 4 байта, составьте бюджет shared memory для сторон 16, 24 и 32, затем укажите дополнительные ограничения, без которых такой расчёт не определяет лучший вариант.

    **Ответ:** Три квадратных float-тайла требуют `3*T*T*4=12*T²` байт: 3072,6912,12288 для T=16,24,32. Дополнительно нужны бюджеты регистров/потоков, halo/padding, число блоков, хвосты и стоимость барьеров. Лучший T выбирают по измерению.

    **Типичная ошибка:** Определять лучший тайл только по вместимости shared.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

19. Как проверить, что найденное ограничение размещения соответствует реальному GPU, а не только непрерывному делению доступных ресурсов? Сопоставьте расчёт, `cudaOccupancyMaxActiveBlocksPerMultiprocessor` и данные профилировщика, учитывая гранулярность выделения регистров, допустимую конфигурацию ядра и фактический объём статической и динамической shared memory.

    **Ответ:** Верхнюю оценку сверяют с `cudaOccupancyMaxActiveBlocksPerMultiprocessor` для конкретного kernel, B и dynamic shared. Затем сравнивают с профилем реального запуска. Расхождения объясняют гранулярностью регистров, пределами блоков, статической shared и недостаточным числом блоков grid.

    **Типичная ошибка:** Путать предельную occupancy с достигнутой на маленькой задаче.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

20. Когда изменение разделения ресурсов между L1 и shared memory может повлиять на ядро? Для выбранного GPU выясните доступные настройки, предел динамической shared memory и необходимость явного opt-in, затем составьте эксперимент, в котором размер входного рабочего набора и размер тайла меняются независимо.

    **Ответ:** На архитектурах с общим ресурсом L1/shared настройка меняет доступный бюджет и кэш. Проверяют supported carveout, dynamic shared limit и необходимость `cudaFuncSetAttribute` opt-in. Независимо варьируют рабочий набор и размер тайла, измеряют hits, размещение блоков и время.

    **Типичная ошибка:** Предполагать, что запрос carveout гарантирует точное физическое разделение.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

21. Чем асинхронная загрузка из global memory в shared memory внутри ядра отличается от передачи CPU–GPU через `cudaMemcpyAsync`? Для `cuda::memcpy_async` и варианта с Tensor Memory Accelerator (TMA) сравните поддерживаемые архитектуры, требования к описанию данных, размерам и выравниванию. Найдите предусмотренный выбранным API протокол барьера и ожидания завершения: какое событие учитывает arrival, когда завершён перенос и когда загруженные данные разрешено читать участникам?

    **Ответ:** Это внутридевайсная передача global→shared, а не DMA CPU–GPU. Для поддержанного пути `cuda::memcpy_async` на подходящих GPU используют barrier/pipeline completion; TMA на поддерживаемых архитектурах добавляет tensor descriptors, требования размеров/выравнивания и transaction-aware barrier. Arrival участников не равен завершению байтов: чтение разрешено после предусмотренного API ожидания полной фазы.

    **Типичная ошибка:** Считать вызов arrival достаточным подтверждением завершения асинхронной копии.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

22. Как организовать двойную буферизацию тайлов, если загрузка следующего фрагмента должна перекрываться с обработкой текущего? Нарисуйте последовательность фаз для трёх тайлов и обозначьте, кто начинает копирование, кто ожидает его завершения и когда разрешена перезапись каждого shared-буфера.

    **Ответ:** Сначала загружают T0 в A и ждут готовности; во время вычисления T0 загружают T1 в B. После окончания чтений A его можно использовать под T2, пока считают T1. Каждый буфер имеет отдельные ready и consumed условия; commit/wait и барьеры задают по выбранному API.

    **Типичная ошибка:** Перезаписывать A после завершения копирования, пока его ещё читают.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

23. Какие дополнительные ошибки возможны при управлении асинхронным pipeline из расходящихся ветвей warp? Для выбранного API исследуйте правила коллективного участия, commit и wait, а затем предложите проверку случая с неполным последним тайлом, где часть потоков не загружает полезные данные.

    **Ответ:** Расходящиеся commit/arrival могут менять фактическое число операций pipeline и ломать ожидания; коллективные API имеют требования к участникам. Для хвоста сохраняют согласованные commit/wait, а полезные копии предицируют или заполняют нейтрально. Проверяют версии API, неполные warp и synccheck.

    **Типичная ошибка:** Исключать неактивные данные вместе с обязательным коллективным участием.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

24. Как доказать пользу оптимизации shared memory, если после устранения bank conflicts время почти не изменилось? Спланируйте исследование трафика global/local memory, барьеров, загрузки вычислительных блоков и occupancy, отдельно сравнив исходное ядро, вариант с padding и вариант с асинхронной загрузкой на одинаковых входах.

    **Ответ:** Сначала подтверждают уменьшение конфликтов счётчиками. Затем сравнивают время и ищут доминирующий global/local-трафик, барьеры, низкий параллелизм или compute bottleneck. Padding и async-вариант проверяют отдельно на одинаковых входах; оптимизация недоминирующей части может почти не влиять на итог.

    **Типичная ошибка:** Объявлять оптимизацию успешной только по одному улучшенному счётчику.

    **Источник:** [CUDA Best Practices: Shared Memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory); [Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

## Критерий освоения

Вы можете обосновать размещение данных, рассчитать расход регистров и shared memory в заданной модели и объяснить ограничения этого расчёта на реальном GPU. Вы проверяете жизненный цикл тайлов, корректность обмена данными и влияние оптимизации на время работы, а поддержку асинхронных копирований подтверждаете для выбранного API и архитектуры.

Официальные источники: [CUDA Best Practices Guide: Memory Optimizations](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#memory-optimizations), [CUDA Programming Guide: Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html).

[← Global memory и обращения к данным](04_global_memory.md) · [Оглавление](README.md) · [Синхронизация и атомарные операции →](06_synchronization_and_atomics.md)
