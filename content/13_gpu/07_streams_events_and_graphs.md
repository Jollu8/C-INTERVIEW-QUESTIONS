# Streams, events и CUDA Graphs

Цель — научиться описывать зависимости между операциями CPU и GPU, организовывать допустимое перекрытие и измерять полное выполнение задачи. Stream задаёт порядок команд, event позволяет связать этапы, а CUDA Graphs описывает повторяющуюся работу; реальная параллельность зависит от доступных ресурсов и свойств операций.

Предпосылки: [сборка и запуск CUDA](02_cuda_toolchain.md), [ядра и индексация](03_kernels_and_indexing.md), [синхронизация и атомарные операции](06_synchronization_and_atomics.md). Условия асинхронных передач подробно разбираются в [следующей теме](08_transfers_and_unified_memory.md).

## Лёгкий уровень

1. Что означает асинхронный относительно CPU запуск CUDA-ядра? Проследите моменты возврата управления из launch, начала вычислений и готовности результата, затем определите, какой из них измеряет простой host-таймер без ожидания завершения.

   **Ответ:** Launch ставит работу в очередь и обычно возвращает управление до её завершения. Начало device-работы зависит от очереди и ресурсов, готовность — от окончания нужных команд. Host-таймер без ожидания измеряет в основном постановку, а не полное вычисление.

   **Типичная ошибка:** Выдавать время вызова launch за длительность kernel.

   **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

2. Какую последовательность выполнения задаёт один stream? Для команд `H2D → kernel A → kernel B → D2H`, поставленных в один stream, укажите зависимости данных и момент, после которого CPU может читать полученный результат.

   **Ответ:** Один stream задаёт последовательность H2D→A→B→D2H: каждая следующая команда использует завершённый предшествующий результат. CPU читает выход после подтверждённого завершения D2H, например через event после копирования.

   **Типичная ошибка:** Считать порядок stream разрешением немедленно читать host-выход.

   **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

3. Что меняется, когда независимые задачи помещают в разные streams? Сравните отсутствие заданного порядка, возможность одновременного выполнения и гарантию одновременного выполнения, затем перечислите причины последовательного исполнения двух независимых ядер.

   **Ответ:** Разные streams допускают независимое планирование, но не гарантируют параллельное выполнение. Ядра могут занять все ресурсы, конкурировать за память либо иметь неявные зависимости default stream; устройство может ограничивать concurrent kernels.

   **Типичная ошибка:** Рассчитывать ускорение по числу созданных streams.

   **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

4. Чем `cudaDeviceSynchronize()`, `cudaStreamSynchronize()` и `cudaEventSynchronize()` отличаются по объёму ожидаемой работы? Для двух независимых streams выберите способ дождаться только одного нужного результата и объясните, какие операции другого stream он может оставить незавершёнными.

   **Ответ:** Device sync ждёт предшествующую работу устройства, stream sync — указанного stream, event sync — работу до соответствующей записи event. Для одного результата достаточно event после него или sync нужного stream; независимый другой stream может ещё работать.

   **Типичная ошибка:** Останавливать всё устройство ради одного готового буфера.

   **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

5. Что фиксирует запись CUDA event в stream? Для event, поставленного после ядра A и перед ядром B, определите, какая предшествующая работа должна закончиться к завершению event и что можно заключить о готовности результата B.

   **Ответ:** Event завершается после предшествующих ему команд stream. Event после A и перед B подтверждает A, но не подтверждает завершение B. Он может служить точкой ожидания CPU или зависимостью другого stream.

   **Типичная ошибка:** Считать event снимком завершения всех будущих команд.

   **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

6. Как связать производителя в одном stream с потребителем в другом, не заставляя CPU ждать между ними? Нарисуйте последовательность `kernel A → event → wait → kernel B`, укажите stream каждой команды и условие безопасного чтения массива, который записывает A.

   **Ответ:** В stream S1 запускают A и записывают E; в S2 ставят `cudaStreamWaitEvent(S2,E,0)`, затем B. CPU не обязан ждать: зависимость исполняется на стороне очередей. B читает только после завершения A; буфер живёт до B.

   **Типичная ошибка:** Записывать event до производителя.

   **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

7. Чем опрос `cudaStreamQuery()` или `cudaEventQuery()` отличается от блокирующего ожидания? Опишите цикл CPU, который выполняет независимую работу до готовности GPU, и определите, как отличить состояние «ещё не завершено» от ошибки API.

   **Ответ:** Query возвращает success при готовности, `cudaErrorNotReady` при незавершённости, остальные коды обрабатывают как ошибки. CPU между проверками делает полезную независимую работу и не использует выход раньше success. Бесконечный tight polling может зря загружать CPU.

   **Типичная ошибка:** Принимать любой неуспешный код за «ещё считается».

   **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

8. Почему host-буфер нельзя сразу изменять после постановки его асинхронного копирования в stream? Для повторного использования одного входного массива в следующей итерации укажите, завершение какой операции нужно подтвердить, и как сделать этот срок жизни понятным владельцу буфера.

   **Ответ:** Асинхронная H2D ещё может читать host-вход после возврата API. Его изменяют после event завершения этой копии; ожидать весь kernel для такого входа необязательно. Владельцу передают completion token/event либо используют отдельные слоты буферов.

   **Типичная ошибка:** Перезаписывать вход сразу после `cudaMemcpyAsync`.

   **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

## Средний уровень

9. Чем legacy default stream отличается от per-thread default stream? Для двух host-потоков, обычного созданного stream и неявного stream сравните возникающие зависимости, явно указав выбранный режим сборки и не предполагая, что всякий stream с номером 0 обладает одинаковой семантикой.

   **Ответ:** Legacy default stream создаёт неявные зависимости с обычными blocking streams того же контекста. Per-thread default stream — отдельный обычный stream каждого host-потока. Режим задают явно при сборке/API; nonblocking streams исключены из legacy-синхронизации.

   **Типичная ошибка:** Считать неявный stream одинаковым во всех сборках.

   **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

10. Что означает флаг `cudaStreamNonBlocking` и как он связан с legacy default stream? Разберите, почему название этого флага не гарантирует мгновенный возврат любого CUDA API и почему удаление неявной зависимости может потребовать явного event между задачами.

    **Ответ:** `cudaStreamNonBlocking` убирает участие stream в неявной синхронизации с legacy default stream. Это не обещает неблокирующее поведение любого host API. Если раньше данные защищала неявная зависимость, теперь ставят явные event/wait.

    **Типичная ошибка:** Удалить зависимость флагом, оставив потребителя без ожидания.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

11. Какие условия нужны для перекрытия передачи CPU–GPU с ядром? Составьте проверяемый список для закреплённой host-памяти, streams, независимых буферов, copy engines и свободных ресурсов, затем объясните, какие из этих условий предоставляют возможность перекрытия, но не гарантируют ускорение.

    **Ответ:** Для устойчивого async DMA используют pinned host memory, поддержанные copy engines и streams с правильными зависимостями. Передача одного чанка может перекрываться с независимым kernel другого при свободных ресурсах и отдельных буферах. Реальный overlap проверяют timeline и полным временем.

    **Типичная ошибка:** Использовать один и тот же перезаписываемый буфер для перекрывающихся этапов.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

12. Как организовать обработку входа чанками с двойной буферизацией? Для четырёх чанков изобразите постановку `H2D → kernel → D2H` в два streams и обозначьте отдельные моменты безопасного повторного использования входного host-буфера, device-буфера и выходного host-буфера.

    **Ответ:** Чанки 0 и 2 идут через слот/stream 0, 1 и 3 — через слот/stream 1. В каждом слоте порядок H2D→kernel→D2H. Host-вход переиспользуют после H2D, device-слот — после последнего device/копирующего потребителя, host-выход — после D2H и чтения CPU.

    **Типичная ошибка:** Переиспользовать слот 0 для чанка 2 до завершения его прежнего потребителя.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

13. Как оценить идеальное время pipeline в явно заданной модели? Пусть H2D занимает 2 мс, ядро — 5 мс, D2H — 3 мс, есть независимые engines для обоих направлений, а все три этапа разных чанков могут перекрываться: вычислите время для одного и десяти чанков с учётом заполнения и опустошения pipeline.

    **Ответ:** Один чанк занимает `2+5+3=10 мс`. При независимых engines установившийся интервал задаёт максимум этапов, 5 мс; десять чанков занимают `10+9*5=55 мс`. Это идеал без дополнительных launch, конкуренции и ограничений числа слотов.

    **Типичная ошибка:** Считать десять чанков как `10*5`, забыв заполнение/опустошение.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

14. Как измерить длительность ядра CUDA events и полное время задачи host-таймером? Опишите расположение start/stop events и ожидания завершения, затем отдельно задайте, включаются ли выделение памяти, первый запуск, передачи, подготовка CPU и конкурирующая работа других streams.

    **Ответ:** Start/stop events ставят вокруг kernel в том же stream; после stop ждут его и вычисляют elapsed time. Полную задачу меряют monotonic host-таймером с ожиданием конечного результата. Явно фиксируют включение подготовки, аллокаций, передач, прогрева и конкуренции.

    **Типичная ошибка:** Смешивать kernel-only и end-to-end время в одном сравнении.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

15. Почему два события, записанные в разных streams, не образуют автоматически корректный интервал одной задачи? Для двух параллельных ветвей, результаты которых объединяет третье ядро, спроектируйте общую начальную и конечную точки с явными зависимостями, чтобы измерение охватывало обе ветви.

    **Ответ:** Независимые streams не задают порядок между своими events. Общий start в управляющем stream становится зависимостью обеих ветвей; после них записывают два completion event, управляющий stream ждёт оба, запускает объединение и пишет stop. Такой интервал охватывает весь DAG.

    **Типичная ошибка:** Вычитать timestamps случайных событий из несвязанных streams.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

16. Какие расходы призваны уменьшить CUDA Graphs при повторении одной схемы работы? Для цепочки из 100 коротких ядер сравните прямую постановку команд и последовательность «построить граф → instantiate → многократно launch», отдельно учитывая подготовку, первый запуск и установившееся выполнение.

    **Ответ:** Graphs уменьшают повторную CPU-постановку множества узлов и часть расходов запуска. Сто ядер описывают один раз, instantiate создаёт исполняемый граф, затем его повторно запускают. Подготовку и первый launch измеряют отдельно; вычислительная работа kernels сама по себе не исчезает.

    **Типичная ошибка:** Ожидать сокращения арифметики после замены launch на graph replay.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

## Сложный уровень

17. Как представить зависимые и независимые этапы в CUDA Graphs? Постройте граф для двух независимых загрузок A и B, их отдельных преобразований и общего завершающего ядра, затем определите минимальные рёбра, необходимые для корректности при обычных зависимостях завершения узлов.

    **Ответ:** Минимальные рёбра: copy A→transform A→join и copy B→transform B→join. Между независимыми ветвями ребро не нужно; обычные completion-зависимости гарантируют готовность обоих входов join. Выходы и workspace ветвей должны быть независимы.

    **Типичная ошибка:** Добавлять полную последовательную цепь и терять доступный параллелизм.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

18. Чем stream capture отличается от немедленного исполнения обычной последовательности CUDA-команд? Для capture нескольких streams через event-зависимости проверьте ограничения выбранной версии CUDA, возврат всех ветвей к исходному stream и допустимость вызываемых API, а также способ обнаружить и обработать недействительный capture.

    **Ответ:** Capture записывает допустимые операции в граф вместо обычного немедленного исполнения. Ветви других streams связывают events и возвращают к исходному stream до EndCapture. Проверяют статусы Begin/EndCapture, запреты API и invalidation; при ошибке корректно завершают capture и пересоздают граф.

    **Типичная ошибка:** Вызывать недопустимое синхронное API внутри capture и игнорировать его статус.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

19. Как изменять параметры повторяемого графа, если в каждой итерации меняются указатели, размер задачи или конфигурация launch? Сравните обновление параметров узлов, обновление исполняемого графа и повторное создание, затем сформулируйте план обработки обновления, которое отклонено из-за несовместимого изменения структуры или параметров.

    **Ответ:** При неизменной структуре используют setters параметров exec-узлов либо graph exec update в пределах контракта версии. Смена топологии/недопустимых параметров может отклоняться; статус проверяют и пересоздают exec graph как fallback. Обновление не должно конфликтовать с использующей ресурсы работой.

    **Типичная ошибка:** Предполагать, что любое изменение N автоматически обновляет все узлы.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

20. Какие объекты должны сохраняться между capture, instantiate, launch и завершением графа? Для графа с обычными внешними host/device-буферами отделите время копирования значений аргументов от срока жизни памяти по указателям и объясните, почему уничтожение локального C++ объекта-владельца может испортить будущий replay.

    **Ответ:** Граф хранит значения параметров, но указатель не копирует и не владеет содержимым внешнего буфера. Device/host allocations и нужные объекты сохраняют до завершения использующих их replay; для будущих запусков адреса остаются валидными либо обновляются. Исходный graph после instantiate и exec graph имеют разные сроки жизни по API.

    **Типичная ошибка:** Захватывать адрес локального владельца, уничтоженного до replay.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

21. Как оценить число повторений, после которого подготовка графа окупится? В учебном измерении создание и instantiate стоят 3 мс, обычная итерация занимает 90 мкс, а replay — 60 мкс: найдите границу окупаемости и опишите, как изменится вывод при частом обновлении графа и переменных размерах входа.

    **Ответ:** Подготовка равна 3000 мкс, экономия итерации 30 мкс. При 100 повторах затраты равны, строгий выигрыш начинается со 101. Частые update/rebuild добавляют расходы и сдвигают границу; сравнивают реальный набор размеров и число повторов.

    **Типичная ошибка:** Не включать instantiate в оценку короткой серии.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

22. Почему увеличение числа streams или повышение их приоритета может не сократить задержку? Спроектируйте исследование задачи с двумя вычислительно тяжёлыми ядрами и потоком коротких запросов, отделив готовность к запуску, занятость ресурсов, конкуренцию за память и фактические гарантии приоритетов выбранной CUDA-платформы.

    **Ответ:** Приоритет влияет на планирование в пределах возможностей платформы, но не гарантирует немедленное вытеснение тяжёлого kernel. Изучают timeline готовности короткого запроса, резидентные блоки, bandwidth и contention. Изменяют размеры блоков/задач и число streams, оценивают tail latency.

    **Типичная ошибка:** Принимать высокий приоритет за жёсткую гарантию задержки.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

23. Как обеспечить безопасное переиспользование буфера при `cudaMallocAsync` и `cudaFreeAsync` в нескольких streams? Нарисуйте связи allocation → producer → consumer → free, проверьте поддержку memory pools и покажите, какие event-зависимости нужны, если освобождение поставлено в stream, отличный от stream последнего потребителя.

    **Ответ:** Allocation должна предшествовать всем использованиям; producer завершает запись до consumer; free ставят после всех потребителей. Между streams эти рёбра создают event/wait, включая stream освобождения. Проверяют поддержку memory pools и не используют указатель после упорядоченного free.

    **Типичная ошибка:** Освобождать в другом stream без зависимости от последнего чтения.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

24. Как проверить, что ускорение от streams или Graphs сохраняется в полном приложении? Сравните профиль временной шкалы, задержку одного запроса и пропускную способность серии запросов, учитывая прогрев, стоимость capture/update, ограничения буферов, ошибки асинхронного исполнения и проверку результатов каждой ветви.

    **Ответ:** На одинаковых входах проверяют результаты всех ветвей, измеряют latency и throughput после прогрева, а отдельно — capture/update и cold start. Timeline подтверждает реальные перекрытия и отсутствие скрытых ожиданий. Учитывают ограниченное число слотов и стоимость CPU-подготовки.

    **Типичная ошибка:** Объявлять выигрыш по одному replay без расходов полного приложения.

    **Источник:** [Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html); [CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

## Критерий освоения

Вы можете изобразить зависимости операций и сроки жизни буферов, выбрать минимально необходимое ожидание и объяснить, какие условия позволяют перекрытие. Вы различаете время постановки и завершения работы, измеряете повторяемые графы вместе с существенными расходами подготовки и проверяете поведение default stream в используемой конфигурации.

Официальные источники: [CUDA Programming Guide: Asynchronous Execution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html), [CUDA Programming Guide: CUDA Graphs](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html).

[← Синхронизация и атомарные операции](06_synchronization_and_atomics.md) · [Оглавление](README.md) · [Передачи данных и Unified Memory →](08_transfers_and_unified_memory.md)
