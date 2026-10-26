# Передачи данных и Unified Memory

Цель — научиться выбирать способ доступа CPU и GPU к данным, учитывать стоимость перемещений и правильно определять владельца буфера на каждом этапе. Единое виртуальное адресное пространство, mapped host memory и Unified Memory решают разные задачи; их возможности зависят от GPU, межсоединения, ОС и драйвера.

Предпосылки: [global memory и обращения к данным](04_global_memory.md), [синхронизация](06_synchronization_and_atomics.md), [streams и events](07_streams_events_and_graphs.md). Для механизмов закрепления и отображения памяти полезны [виртуальная память](../12_computer_architecture/07_virtual_memory.md) и [DMA](../12_computer_architecture/12_dma_iommu_and_interrupts.md).

## Лёгкий уровень

1. Почему для дискретного GPU важно отличать host memory от device memory? Для программы «CPU заполняет массив → GPU преобразует → CPU читает результат» укажите места хранения данных и границы, на которых потребуются передача или другой поддерживаемый механизм доступа.

   **Ответ:** В обычной модели дискретного GPU host и device имеют разную физическую память. CPU готовит host-вход, копия H2D создаёт device-вход, kernel пишет device-выход, D2H возвращает его CPU. Mapped/managed доступ — отдельные поддерживаемые механизмы с собственными правилами.

   **Типичная ошибка:** Разыменовывать обычный host-указатель на GPU без проверки платформы.

   **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

2. Какие действия выполняют `cudaMalloc`, `cudaMemcpy` и `cudaFree` в простом варианте с явно управляемой device memory? Составьте порядок действий для двух входных и одного выходного массива, затем обозначьте проверки размеров, ошибок и срока жизни всех буферов.

   **Ответ:** Для двух входов и выхода проверяют `N*sizeof(T)`, выделяют три device-буфера, копируют входы H2D, запускают работу, ждут и копируют выход D2H, затем освобождают. Проверяют каждый статус и освобождают частично созданные ресурсы при ошибке; время жизни включает все использования.

   **Типичная ошибка:** Копировать результат до завершения производителя без зависимости.

   **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

3. Почему общее виртуальное адресное пространство не означает, что любой указатель CPU можно разыменовать в ядре? Сравните указатель на обычный host-массив, память `cudaMalloc` и managed allocation, а разрешённость прямого доступа проверьте для конкретного режима платформы.

   **Ответ:** UVA унифицирует виртуальную адресацию, но не выдаёт права доступа любой памяти любому процессору. `cudaMalloc` доступен device, managed — по правилам платформы, обычный malloc требует поддержки system/pageable memory access. Без неё нужны explicit copies либо mapped allocation.

   **Типичная ошибка:** Принимать единый числовой адрес за физическую доступность памяти.

   **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

4. Из чего складывается время передачи данных и почему маленькие копирования часто используют канал не полностью? Для учебной модели `T = L + S / B`, задержки 10 мкс и полезной пропускной способности 20 ГБ/с оцените время передачи 4 КБ и 40 МБ, явно используя десятичные единицы.

   **Ответ:** Для десятичных 4 KB время `10 мкс+4000/(20*10^9) с=10,2 мкс`. Для 40 MB — `10 мкс+2 мс=2,01 мс`. На малом размере доминирует постоянная задержка, на большом — передача байтов.

   **Типичная ошибка:** Использовать 4096 байт, когда условие задаёт десятичные KB.

   **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

5. Чем pageable host memory отличается от pinned, или page-locked, host memory? Объясните, какие задачи решают `cudaMallocHost` и `cudaHostRegister`, а затем определите, кто отвечает за освобождение выделенного буфера и за снятие регистрации с уже существующей памяти.

   **Ответ:** Pageable страницы могут перемещаться ОС; pinned закреплены и подходят для DMA. `cudaMallocHost` выделяет память, освобождаемую `cudaFreeHost`; `cudaHostRegister` регистрирует существующий диапазон, который снимают через `cudaHostUnregister`, затем освобождают исходным allocator.

   **Типичная ошибка:** Освобождать зарегистрированный malloc-буфер через `cudaFreeHost`.

   **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

6. Почему название `cudaMemcpyAsync` само по себе не гарантирует перекрытие работы CPU, GPU и передачи? Сравните host-память из обычного `malloc` и закреплённую память, отдельно сформулировав вопросы о возврате управления host-потоку, завершении копирования и возможности одновременного исполнения.

   **Ответ:** Async-поведение зависит от типа памяти и направления; pageable может потребовать staging и блокировать host. Pinned создаёт необходимые условия для устойчивой async передачи, но overlap требует независимых ресурсов/команд. Возврат API, завершение копии и фактическая параллельность — разные события.

   **Типичная ошибка:** Делать вывод о готовности данных из суффикса Async.

   **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

7. Когда разрешено перезаписывать входной host-буфер и читать выходной при асинхронных передачах? Для цепочки H2D → kernel → D2H обозначьте события завершения, которые передают право доступа следующему участнику, и объясните, почему возврата из вызова API недостаточно.

   **Ответ:** Вход CPU можно перезаписать после завершения его H2D, выход читать после D2H. Kernel читает только готовый device-вход; его выход копируют после завершения записи. Event после соответствующей стадии или stream sync устанавливает эти границы.

   **Типичная ошибка:** Ждать только launch kernel перед чтением host-результата.

   **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

8. Как уменьшить трафик CPU–GPU в цепочке из пяти последовательно выполняемых kernels над одним массивом? Сравните две схемы: перед каждым kernel загрузить массив с CPU и после него вернуть результат либо один раз загрузить вход, выполнить всю цепочку на GPU и вернуть только конечный результат; рассчитайте число полных передач, считая исходные и итоговые данные находящимися на CPU.

   **Ответ:** Схема с возвратом после каждого из пяти kernels даёт 10 полных передач. При сохранении промежуточных данных на GPU нужны одна H2D и одна D2H, всего 2. Это требует отсутствия обязательной CPU-обработки между kernels.

   **Типичная ошибка:** Ускорять kernels, сохраняя ненужные промежуточные пересылки.

   **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

## Средний уровень

9. Как направление передачи и тип памяти меняют документированное поведение `cudaMemcpy` и `cudaMemcpyAsync` относительно host-потока? Для H2D из pageable-памяти, H2D из pinned-памяти и D2H найдите гарантии CUDA Runtime своей версии, отдельно рассматривая staging, момент возврата функции и готовность конечного получателя.

   **Ответ:** По Runtime API синхронная H2D из pageable может вернуть управление после staging до окончания DMA; H2D из pinned синхронна host. Синхронная D2H возвращается после копирования. Async с pageable может блокировать/stage; для async pinned завершение подтверждают отдельно. Точный контракт проверяют для установленной версии.

   **Типичная ошибка:** Считать любой `cudaMemcpy` полной синхронизацией всего устройства.

   **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

10. Когда объединение мелких передач в один пакет окупает упаковку данных на CPU? Для 1000 отдельных фрагментов по 2 КБ, модели задержки 8 мкс на вызов и канала 16 ГБ/с оцените передачи отдельно и одним блоком, затем определите допустимую стоимость упаковки и распаковки.

    **Ответ:** 1000*2000=2 000 000 байт передаются за 125 мкс при 16 GB/s. Отдельные вызовы добавляют 8000 мкс: всего 8,125 мс; пакет — 8+125=133 мкс. Упаковка и распаковка вместе должны стоить меньше 7,992 мс для строгого выигрыша в модели.

    **Типичная ошибка:** Игнорировать стоимость упаковки и десятичные единицы.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

11. Как выбрать размер чанка для конвейера из H2D, вычисления и D2H? Опишите эксперимент с фиксированным общим объёмом данных, ограниченным числом pinned-буферов и разными размерами чанков, учитывая накладные расходы, заполнение pipeline, объём памяти и пропускную способность каждого этапа.

    **Ответ:** На фиксированном объёме перебирают размеры чанков и 2–3 слота pinned/device памяти. Измеряют throughput, latency, заполнение pipeline и времена H2D/kernel/D2H; маленькие чанки страдают от launch, большие уменьшают перекрытие и увеличивают память. Выбирают по требованиям приложения.

    **Типичная ошибка:** Увеличивать число чанков без ограничения объёма pinned memory.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

12. Как передать прямоугольную часть двумерного массива с шагом строки, отличным от полезной ширины? В учебном примере host- и device-изображения имеют 1000 столбцов, 768 строк и элементы по 4 байта, но pitch источника в pinned host memory равен 4096 байтам, а приёмника на GPU — 5120 байтам; требуется скопировать 200 строк по 320 элементов из позиции `(row, col) = (50, 100)` в `(10, 20)`. Определите смещения указателей и аргументы `cudaMemcpy2DAsync`, проверив границы и единицы width, height и pitch.

    **Ответ:** Источник смещают на `50*4096+100*4=205200` байт, приёмник на `10*5120+20*4=51280`. Аргументы: dpitch=5120, spitch=4096, width=1280 байт, height=200, kind=H2D, нужный stream. Прямоугольники заканчиваются на строках 249/209 и столбцах 419/339, внутри 768×1000.

    **Типичная ошибка:** Передавать width=320 вместо 1280 байт.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

13. Что означает mapped host memory, часто называемая zero-copy, и где физически обслуживаются обращения дискретного GPU к ней? Для однократного последовательного чтения и сотни повторных чтений одного массива сравните такой доступ с предварительным копированием в device memory, учитывая задержку, трафик и доступную ширину канала.

    **Ответ:** Mapped pinned memory остаётся host-памятью, доступной GPU по поддерживаемому отображению. На дискретной системе обращения идут через межсоединение; однократное coalesced чтение иногда экономит явную копию, сто повторов обычно выгоднее обслужить из device memory. Проверяют топологию и полное время.

    **Типичная ошибка:** Принимать zero-copy за отсутствие физического трафика.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

14. Какие условия и правила владения нужны для доступа GPU к mapped pinned memory? Для выбранного GPU проверьте поддержку, способ получения допустимого device-указателя и требования синхронизации, затем разберите конфликт CPU-записи с ещё выполняющимся GPU-чтением того же диапазона.

    **Ответ:** Проверяют mapped-host поддержку и требования инициализации выбранного API, выделяют/регистрируют mapping и получают допустимый device pointer при необходимости. CPU не меняет диапазон до завершения GPU-чтения; обратное направление также требует установленного порядка и поддержанных гарантий памяти.

    **Типичная ошибка:** Писать CPU в mapped-диапазон, пока kernel его читает.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

15. Как Unified Memory меняет управление размещением данных по сравнению с явными H2D/D2H? Для массива из `cudaMallocManaged`, который CPU инициализирует, GPU обновляет, а CPU проверяет, объясните возможные миграции и отдельно установите порядок доступа, необходимый для корректного чтения результата.

    **Ответ:** Managed allocation даёт единое логическое размещение с управлением доступом/миграцией платформой. После CPU-инициализации GPU может вызвать page faults и миграции; перед CPU-проверкой ждут kernel. Единый указатель упрощает API, но не устраняет зависимости и стоимость перемещений.

    **Типичная ошибка:** Читать managed-результат CPU одновременно с незавершённой записью GPU.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

16. Что делает prefetch managed memory и чем он отличается от ожидания завершения вычисления? Составьте последовательность «инициализация CPU → prefetch на GPU → kernel → prefetch к CPU → чтение CPU», выбрав доступные в вашей версии API и явные зависимости между этапами.

    **Ответ:** После CPU-инициализации ставят prefetch на GPU в stream, затем kernel и prefetch к CPU в том же порядке, после чего CPU ждёт конечное событие. Prefetch перемещает/подготавливает размещение, но не заменяет ожидание потребителя. Сигнатуру location/device выбирают по версии runtime.

    **Типичная ошибка:** Считать постановку prefetch готовностью данных для CPU.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

## Сложный уровень

17. Почему производительность managed memory может резко ухудшиться при чередовании обращений CPU и GPU? Спроектируйте опыт с доступом к одним и тем же страницам и к раздельным диапазонам, затем определите, как по профилю отличить миграции, page faults и ожидание синхронизации.

    **Ответ:** Чередование CPU/GPU по одним страницам может вызывать ping-pong миграций и page faults. Сравнивают тот же объём с разделёнными страницами и пакетными фазами, измеряют миграции и faults в timeline отдельно от ожиданий. Возможна ложная совместность при разных элементах одной страницы.

    **Типичная ошибка:** Разделить элементы, оставив их на одних мигрирующих страницах.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

18. Какие ограничения нужно проверить прежде, чем считать память из обычного `malloc` доступной ядру благодаря HMM или аппаратной согласованности? Для конкретной системы исследуйте GPU, ОС, драйвер и атрибуты `pageableMemoryAccess`, `concurrentManagedAccess` и `pageableMemoryAccessUsesHostPageTables`, затем составьте безопасный вариант работы для системы без требуемой поддержки.

    **Ответ:** Проверяют ОС/ядро, GPU, драйвер и атрибуты pageableMemoryAccess, concurrentManagedAccess, pageableMemoryAccessUsesHostPageTables, а также документацию режима. Наличие HMM не выводят только из модели GPU. При отсутствии поддержки используют `cudaMalloc` и явные копии с проверяемыми зависимостями.

    **Типичная ошибка:** Считать любой malloc автоматически device-accessible на новой видеокарте.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

19. В каких условиях Unified Memory допускает рабочий набор больше доступной device memory и почему это не обещает приемлемой скорости? Для 24 ГБ данных и GPU с 16 ГБ памяти сравните последовательный тайловый доступ и случайное многократное обращение, явно проверяя поддержку oversubscription и стоимость вытеснения и повторного ввода страниц.

    **Ответ:** Oversubscription допускается лишь на поддерживаемой платформе и allocation. Для 24 GB на GPU 16 GB последовательные тайлы могут обеспечивать локальный рабочий набор; случайные повторы вызывают вытеснения и повторную миграцию. Измеряют faults, transfer bytes и время, сравнивая с явным out-of-core алгоритмом.

    **Типичная ошибка:** Путать возможность адресовать данные с приемлемой производительностью.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

20. Как `cudaMemAdvise` отличается от фактической передачи данных и от гарантии их постоянного нахождения на GPU? Для массива только для чтения и изменяемого массива исследуйте поддерживаемые советы о preferred location, read-mostly и accessed-by, затем составьте измерение с prefetch и без него на одной конфигурации.

    **Ответ:** MemAdvise задаёт советы системе размещения/отображения, а не гарантирует перенос или вечную резидентность. Read-mostly может помогать чтениям, preferred location и accessed-by влияют на политику; изменения данных могут менять эффект. Сравнивают advice/prefetch раздельно, проверяя поддержку и трафик.

    **Типичная ошибка:** Использовать advice вместо prefetch и синхронизации.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

21. Как спроектировать явную передачу владения managed-буфером между CPU и несколькими GPU-задачами? Обозначьте события завершения всех читателей и писателей, допустимость одновременного доступа на выбранной платформе и момент освобождения буфера, затем объясните, почему единый указатель не устраняет гонки данных.

    **Ответ:** Задают DAG всех GPU-читателей/писателей и CPU-фаз. CPU получает владение после завершения всех конфликтующих GPU-операций, а новый писатель — после старых читателей. Concurrent managed access проверяют отдельно; free выполняют после всех участников. Единый адрес не предотвращает гонку.

    **Типичная ошибка:** Ждать только одного из нескольких использующих буфер streams.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

22. Как топология CPU–GPU меняет результаты теста pinned memory и DMA? Для машины с несколькими NUMA-узлами сравните размещение host-потока и страниц рядом с GPU и на удалённом узле, учитывая affinity, first touch, межпроцессорный трафик и фактическую схему PCIe/NVLink.

    **Ответ:** Закрепляют host-поток и first-touch страниц возле NUMA-узла GPU, затем сравнивают удалённое размещение при одинаковом размере/направлении. Проверяют фактическую топологию, межсокетный трафик и throughput/latency DMA. Pinning не делает удалённые страницы локальными.

    **Типичная ошибка:** Объяснять разницу только свойствами GPU, не проверяя NUMA.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

23. Как оценить, оправдан ли offload, если ядро ускоряет только вычислительную часть? Пусть CPU выполняет задачу за 15 мс, GPU-ядро — за 2 мс, а суммарные вход и выход — 200 МБ при полезной скорости 20 ГБ/с без перекрытия: оцените время GPU-варианта и исследуйте, что меняет повторное использование данных между десятью задачами.

    **Ответ:** Передачи 200 MB при 20 GB/s занимают 10 мс; GPU-вариант — 12 мс против CPU 15, ускорение 1,25. Если десять задач сохраняют промежуточные данные и суммарные передачи остаются 200 MB, итог 10+10*2=30 мс против 150. Без reuse — 120 мс.

    **Типичная ошибка:** Умножать выигрыш kernel на всё приложение без учёта передач.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

24. Как выбрать между explicit copies, mapped host memory и Unified Memory для реального приложения? Спроектируйте сравнение на одинаковых входах с однократным и многократным использованием, измеряя полное время, хвостовую задержку, трафик и потребление host/device memory, а также проверяя ошибки, сроки жизни и результат при некратных размерах.

    **Ответ:** Сравнивают explicit copies, mapped и managed на одинаковых данных, одном и многократных проходах. Измеряют end-to-end, tail latency, transfer bytes, faults и память, отдельно cold/warm. Проверяют корректность, хвосты, владение и освобождение; выбирают режим под структуру доступа и целевую платформу.

    **Типичная ошибка:** Выбирать механизм только по простоте API или одному размеру.

    **Источник:** [CUDA Runtime: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html); [Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

## Критерий освоения

Вы можете посчитать существенный трафик и оценить его время, выбрать размещение буфера и показать, кто вправе читать и изменять его на каждом этапе. Вы проверяете документированную семантику передач, различаете единый адрес и доступность памяти, а возможности HMM, миграции и oversubscription подтверждаете для конкретной платформы.

Официальные источники: [CUDA Runtime API: API Synchronization Behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html), [CUDA Programming Guide: Unified and System Memory](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).

[← Streams, events и CUDA Graphs](07_streams_events_and_graphs.md) · [Оглавление](README.md) · [Reduction, scan и histogram →](09_reduction_scan_and_histogram.md)
