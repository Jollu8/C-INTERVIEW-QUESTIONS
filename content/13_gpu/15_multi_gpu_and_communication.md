# Несколько GPU, топология и обмен данными

Цель — распределять вычисления и данные, сохраняя корректные зависимости, и объяснять пределы ускорения стоимостью обмена. Предварительно нужны [streams и events](07_streams_events_and_graphs.md), [передачи и Unified Memory](08_transfers_and_unified_memory.md), [параллельные алгоритмы](09_reduction_scan_and_histogram.md) и [NUMA на CPU](../12_computer_architecture/09_multicore_and_numa.md). Поддержку P2P, механизмов межпроцессного обмена и сетевого доступа проверяйте для конкретных GPU, ОС и соединений.

## Лёгкий уровень

1. Какие ресурсы добавляет второй GPU и какие расходы появляются вместе с ним? Для обработки большого массива разделите полезную работу, исходное распределение данных, обмен между устройствами и сбор результата; почему удвоение числа GPU не обещает двукратного ускорения?

   **Ответ:** Второй GPU добавляет вычислительные ресурсы и отдельную память. Время включает разбиение/распределение входа, локальное вычисление, обмен зависимыми данными и сбор выхода. Последовательная часть, дисбаланс, каналы и дополнительные запуски ограничивают ускорение.

   **Типичная ошибка:** Суммировать FLOPS устройств без оценки обмена.

   **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

2. Чем отдельная память каждого GPU отличается от единого логического адресного пространства? Объясните, почему возможность представить адрес одним указателем ещё не даёт произвольному GPU право и возможность обратиться к соответствующим данным.

   **Ответ:** UVA — единая схема виртуальных адресов, а не объединение всех allocations в автоматически доступную память. Для чужого allocation нужны поддержанный peer access/другой механизм, корректное отображение и зависимости. Физическое размещение влияет на скорость.

   **Типичная ошибка:** Разыменовывать чужой device pointer только потому, что он помещается в указатель.

   **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

3. Как отличить номер устройства CUDA, физический GPU и rank участника коммуникации? Разберите процесс, которому доступны только два выбранных устройства из четырёх, и объясните, почему отображение рангов на устройства нужно фиксировать явно.

   **Ответ:** CUDA ordinal — индекс в видимом процессу списке, physical GPU определяется UUID/PCI bus ID, rank — логический участник communicator. При видимости физических GPU 1 и 3 они могут стать ordinal 0 и 1; ranks назначают отдельно и сохраняют mapping.

   **Типичная ошибка:** Считать rank, ordinal и физический номер одним идентификатором.

   **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

4. Какие варианты управления несколькими GPU существуют на CPU? Сравните один поток с переключением текущего устройства, несколько потоков одного процесса и отдельный процесс на GPU; какие состояния и ресурсы нужно связать с конкретным устройством?

   **Ответ:** Один host-поток может переключать `cudaSetDevice`, несколько — управлять своими устройствами, отдельные процессы — иметь отдельные контексты/ranks. Allocations, streams, events и handles связывают с устройством и владельцем; current device — состояние host-потока.

   **Типичная ошибка:** Создавать stream на одном GPU, а запускать через него работу другого.

   **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

5. Какие пути могут соединять GPU друг с другом и с CPU? Нарисуйте возможную топологию PCIe, NVLink и CPU sockets, затем укажите, какие соединения могут стать общими узкими местами при одновременном обмене.

   **Ответ:** GPU могут делить PCIe switch/root complex, подключаться NVLink и находиться у разных CPU sockets. Межсокетный канал, общий PCIe uplink и сетевой адаптер могут ограничивать одновременные передачи. Фактическую топологию снимают на целевой машине.

   **Типичная ошибка:** Предполагать одинаковую bandwidth между всеми парами GPU.

   **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

6. Чем peer-to-peer copy отличается от передачи через промежуточный host buffer? Проследите размещение данных на обоих путях и объясните, какие возможности нужно проверить до выбора реализации.

   **Ответ:** Peer copy передаёт между device allocations по поддержанному пути; host staging делает A→pinned host→B. Проверяют доступность P2P, топологию, включение access при необходимости и поддержанные API. Для fallback нужно сохранить обе зависимости и lifetime промежуточного host-слота.

   **Типичная ошибка:** Считать наличие NVLink достаточной проверкой всех условий P2P.

   **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

7. Чем разделение массива на независимые части отличается от разбиения задачи с обменом граничными данными? Сравните поэлементное преобразование и одномерный stencil, определив, какие данные должны получить соседние GPU.

   **Ответ:** Поэлементное преобразование делит вход на независимые диапазоны. Stencil требует соседние старые значения за локальной границей: halo радиуса r перед вычислением краёв. Внутреннюю область можно считать независимо от прихода halo при правильных буферах.

   **Типичная ошибка:** Обрабатывать края локальной части как внешнюю границу всей задачи.

   **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

8. Какие задачи решают Broadcast, Reduce, AllReduce и AllGather? Для четырёх участников с короткими целочисленными массивами покажите ожидаемый результат каждой операции и укажите, кто должен получить итоговые данные.

   **Ответ:** Для ranks со скалярами [1],[2],[3],[4] Broadcast от root=0 даёт всем [1]; Reduce(sum) даёт root [10]; AllReduce — всем [10]; AllGather — всем [1,2,3,4] в порядке ranks. Для массивов reduction действует покомпонентно, gather конкатенирует.

   **Типичная ошибка:** Путать сумму AllReduce с конкатенацией AllGather.

   **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

## Средний уровень

9. Как установить и проверить доступ peer GPU к памяти другого устройства? Разберите обнаружение поддержки, направление доступа и настройку, затем предусмотрите вариант работы без P2P; почему поддержка одной пары не доказывает поддержку всех пар системы?

   **Ответ:** Для направления A→память B проверяют `cudaDeviceCanAccessPeer(A,B)` и включают peer access при current device A по контракту API. Обратное направление проверяется отдельно, как и каждая другая пара. При отсутствии поддержки используют host staging или библиотечный маршрут.

   **Типичная ошибка:** Проверить одну пару и распространить результат на всю систему.

   **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

10. Как связать producer на GPU A, передачу и consumer на GPU B? Нарисуйте граф зависимостей и выберите документированные механизмы событий и streams, учитывая, на каком устройстве создан каждый ресурс и когда буфер можно использовать повторно.

    **Ответ:** Producer A завершается до peer copy, copy — до consumer B; это связывают поддержанными cross-device event/stream waits либо host-ожиданием как простым вариантом. Event записывают в stream своего device, ресурсы создают на нужных GPU. Source reuse разрешён после копии, destination — после consumer.

    **Типичная ошибка:** Считать факт вызова peer copy завершением производителя.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

11. Как оценить стоимость передачи в модели `T = α + S / B`? Для `α = 10 мкс`, `B = 25 GB/s` в десятичных единицах сравните одну передачу размером 8 MB и восемь последовательных передач по 1 MB без перекрытия; какие ограничения реального оборудования модель пока не учитывает?

    **Ответ:** 8 MB/25 GB/s=320 мкс, плюс 10 — 330 мкс. Восемь копий по 1 MB дают `8*(10+40)=400 мкс`. Модель не учитывает contention, реальные engines, протокол, NUMA, измеренную bandwidth на размере и возможное перекрытие.

    **Типичная ошибка:** Приписывать каждому байту отдельную launch latency.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

12. Как разложить массив из `N` элементов по `P` GPU, если `N` не кратно `P`? Сформулируйте границы непересекающихся частей, обработку пустых частей и порядок восстановления исходного результата, затем проверьте маленький пример с `N = 10`, `P = 3`.

    **Ответ:** Пусть q=N/P,r=N%P; длина части p равна q+(p<r), начало `p*q+min(p,r)`. Для N=10,P=3 диапазоны [0,4),[4,7),[7,10). При P>N пустые части пропускают в вычислении, но сохраняют согласованное участие в обязательных collectives.

    **Типичная ошибка:** Использовать N/P для всех частей и терять остаток.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

13. Как спроектировать halo exchange для одномерного stencil радиуса два? Для четырёх GPU, каждый из которых хранит непрерывный участок, определите объём граничных данных, обработку внешних границ и вычисления, которые могут идти до завершения обмена.

    **Ответ:** Каждому внутреннему GPU нужны 2 элемента слева и 2 справа старого состояния. Для четырёх непериодических частей три границы передают по 2 элемента в каждую сторону: всего 12 элементов полезных отправок. Внешние края задаёт граничное правило; interior можно считать во время обмена.

    **Типичная ошибка:** Пересылать новые значения вместо предыдущего временного слоя.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

14. Какие условия должны совпадать у вызовов NCCL collective на разных ranks? На примере AllReduce проверьте communicator, порядок операций, количество элементов и тип, затем объясните, почему локально успешный вызов ещё не подтверждает завершение всей коллективной операции.

    **Ответ:** Ranks communicator согласуют порядок collective, count, datatype и reduction op; для rooted операций также root. Вызов ставит работу в stream и не подтверждает глобальное завершение. Проверяют NCCL status, async error и completion stream; несовпадение контрактов может зависнуть.

    **Типичная ошибка:** Вызывать AllReduce с разным count на разных ranks.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

15. Чем локальная сумма на каждом GPU с последующим Reduce отличается от передачи всех исходных данных одному GPU? Составьте модель объёма обмена и полезной работы; как изменить требование, если результат нужен каждому участнику?

    **Ответ:** Сначала каждый GPU сводит локальные N/P элементов в скаляр, затем Reduce передаёт только частичные итоги, логически порядка P скаляров вместо порядка N исходных значений. Результат на каждом устройстве требует AllReduce. Реальные байты зависят от алгоритма collective.

    **Типичная ошибка:** Собирать все входы на root для обычной скалярной суммы.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

16. Как размещение host threads и pinned buffers относительно NUMA-узлов влияет на multi-GPU pipeline? Предложите сравнение локального и удалённого CPU-размещения, сохраняя одинаковую топологию GPU и объём данных.

    **Ответ:** Host threads и pinned pages размещают рядом с соответствующим GPU через affinity/first-touch и проверяемое NUMA размещение. Сравнивают локальный и удалённый случай при том же GPU mapping и объёме. Измеряют host staging, DMA и межсокетный трафик.

    **Типичная ошибка:** Считать pinned allocation автоматически локальной своему GPU.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

## Сложный уровень

17. Почему сильное и слабое масштабирование отвечают на разные вопросы? Для фиксированного общего объёма и фиксированного объёма на GPU предложите два эксперимента, учитывая последовательную часть, обмен и изменение размеров локальных задач.

    **Ответ:** Strong scaling фиксирует общий N и измеряет ускорение при росте P; локальная задача уменьшается и обмен становится заметнее. Weak scaling фиксирует N/P и проверяет рост полного времени при росте системы. Для обоих фиксируют полезную работу, topology и расходы подготовки.

    **Типичная ошибка:** Сравнивать strong и weak scaling как одну метрику.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

18. Как оценить предел ускорения multi-GPU stencil при росте числа устройств? Свяжите объём локальной области и границы с вычислением и обменом, затем определите, при каких размерах дробление задачи начинает увеличивать долю коммуникации.

    **Ответ:** Для 1D fixed-N stencil локальное вычисление примерно пропорционально N/P, а halo фиксированного радиуса остаётся примерно постоянным на соседнюю пару. Когда compute приближается к latency+halo/B, добавление GPU мало помогает. Для многомерных сеток важна растущая доля поверхности к объёму.

    **Типичная ошибка:** Экстраполировать линейное ускорение до произвольно малого локального участка.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

19. Как сравнить ring и tree схемы коллективного обмена в учебной модели? Задайте число участников, размер сообщения, latency и bandwidth, сравните число последовательных шагов и объём передач и объясните, почему выбор NCCL может зависеть от реальной топологии и размера входа.

    **Ответ:** В простой ring AllReduce модель даёт `2(P-1)*α+2(P-1)/P*S/B` на rank. Учебное reduce+broadcast tree имеет около `2*ceil(log2(P))` последовательных стадий; модель байтов зависит от сегментации и связей. Для P=4 ring имеет 6 шагов, tree около 4; NCCL выбирает по размеру и топологии.

    **Типичная ошибка:** Объявлять tree всегда быстрее только по числу стадий.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

20. Как проверить, что перекрытие коммуникации и вычисления приносит пользу? Сопоставьте timeline, изолированные длительности и end-to-end результат; какие общие ресурсы GPU и соединений способны увеличить время обеих одновременно выполняемых стадий?

    **Ответ:** Сравнивают compute и communication изолированно и одновременно, затем полное время с реальным DAG. Overlap виден на timeline, но обе стадии могут замедлиться из-за общей DRAM bandwidth, SM или канала. Выигрыш подтверждает end-to-end, а не площадь перекрытия.

    **Типичная ошибка:** Считать любую одновременность полезным ускорением.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

21. Один rank завершился с ошибкой, а остальные ожидают collective: как спроектировать обработку отказа? Определите наблюдение асинхронных ошибок, согласованное прекращение новых операций, тайм-аут и завершение рабочих процессов, сверяя допустимые действия с версией NCCL.

    **Ответ:** Проверяют статусы NCCL/CUDA и async error communicator, следят за worker liveness и deadline. При отказе прекращают новые задачи и согласованно завершают/abort ресурсы по правилам версии, затем перезапускают нужную группу. Тайм-аут — средство диагностики/ограничения ожидания, не исправление коллективного протокола.

    **Типичная ошибка:** Оставлять остальные ranks бесконечно ждать погибшего участника.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

22. Как разделить данные между GPU разной производительности и ёмкости памяти? Предложите модель выбора долей по измеренной скорости, размеру рабочего набора и объёму обмена; как проверить, что новая балансировка не переносит ограничение на самый медленный канал?

    **Ответ:** Начальные доли выбирают пропорционально измеренной скорости с ограничением memory budget и halo/workspace. Затем оценивают полное время каждой части вместе с передачами и корректируют доли, стремясь выровнять критические окончания. Самый медленный канал может ограничить выигрыш даже при сбалансированном compute.

    **Типичная ошибка:** Распределять только по пиковой скорости арифметики.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

23. Чем GPUDirect RDMA отличается от обычной передачи CPU → GPU и от GPU P2P внутри узла? Нарисуйте роли GPU memory, сетевого адаптера и регистрации памяти, затем перечислите необходимые гарантии видимости, завершения и lifetime на границе сетевого API и CUDA.

    **Ответ:** GPUDirect RDMA позволяет поддержанному сетевому устройству обращаться к зарегистрированной GPU memory, в отличие от CPU staging и внутринодового GPU P2P. Нужны совместимая topology/driver/NIC и регистрация. Сетевое completion и видимость для CUDA связывают документированным протоколом; deregister/free — после всех доступов.

    **Типичная ошибка:** Считать сетевой completion автоматическим универсальным CUDA memory fence.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

24. Подготовьте план проверки multi-GPU приложения на разных системах. Как сохранить отображение ranks, топологию, поддержку P2P, версии, размеры сообщений, профиль обмена и численные допуски, чтобы отличить ошибку алгоритма от ограничения конфигурации или изменённого порядка редукции?

    **Ответ:** Сохраняют rank→UUID/ordinal/host, topology, P2P matrix, версии, message sizes и launch/streams. Проверяют single-GPU эталон, разделение, halo и collectives на малых/некратных размерах, профилируют compute/comm отдельно. Численный допуск учитывает изменённый порядок reduction, аппаратные пропуски отмечают явно.

    **Типичная ошибка:** Приписывать неверный результат топологии без проверки алгоритма и контракта.

    **Источник:** [Multi-GPU Systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html); [NCCL User Guide](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html).

## Критерий освоения

Вы можете нарисовать размещение данных и граф зависимостей для двух GPU, оценить объём обмена и сравнить ускорение с реальной стоимостью коммуникации. Для collective определены все участники и контракт вызовов; обработка ошибки не оставлена на бесконечное ожидание других ranks.

Источники: [CUDA: multi-GPU systems](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/multi-gpu-systems.html), [NCCL: collective operations](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html).

[← Отладка и корректность](14_debugging_and_correctness.md) · [Оглавление](README.md) · [Интеграция и проекты →](16_integration_and_projects.md)
