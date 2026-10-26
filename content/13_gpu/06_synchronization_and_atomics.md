# Синхронизация и атомарные операции

Цель — научиться устанавливать корректные зависимости между потоками GPU и выбирать механизм с нужными участниками, областью действия и порядком памяти. Здесь общие понятия гонки данных и публикации результата применяются к CUDA; функции с похожими названиями не следует считать взаимозаменяемыми без проверки их гарантий.

Предпосылки: [архитектура GPU и warp](01_gpu_architecture.md), [индексация потоков](03_kernels_and_indexing.md), [shared memory и ресурсы блока](05_shared_memory_and_resources.md). Для связи с общими принципами полезна [модель памяти многопроцессорных систем](../12_computer_architecture/08_coherence_and_memory_models.md).

## Лёгкий уровень

1. Когда два обращения разных потоков образуют гонку данных, а когда параллельные обращения допустимы? Сравните чтение одного входного элемента всеми потоками, запись каждого потока в собственный элемент и одновременное увеличение общего счётчика через обычное `counter++`.

   **Ответ:** Гонка возможна при конфликтующих неупорядоченных обращениях к одному объекту, когда хотя бы одно — запись и нет допустимой атомарной схемы. Совместное чтение безопасно, уникальные выходы безопасны, обычный общий `counter++` теряет обновления и создаёт гонку.

   **Типичная ошибка:** Считать одинаковый записываемый результат оправданием гонки.

   **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

2. Какую задачу решает барьер блока `__syncthreads()` при обмене через shared memory? Для загрузки тайла несколькими потоками и последующего чтения соседних элементов укажите участников барьера и объясните, какие обращения должны завершиться до начала зависимых чтений.

   **Ответ:** `__syncthreads()` синхронизирует блок и упорядочивает предшествующие обращения памяти для его участников. После совместной загрузки тайла все нужные записи должны завершиться до зависимых чтений соседей. Участие должно соответствовать контракту блокового барьера.

   **Типичная ошибка:** Читать соседний shared-элемент до барьера.

   **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

3. Почему барьер блока нельзя произвольно помещать в ветвь, которую выполняет только часть его продолжающих работу потоков? Разберите блок из 256 потоков, где барьер вызывают только потоки с `threadIdx.x < 128`, и предложите структуру вычисления, в которой условные записи не нарушают коллективное участие.

   **Ответ:** Условие входа в блоковый барьер должно быть согласовано между требуемыми участниками. В примере половина продолжающих работу потоков пропускает барьер — протокол некорректен. Условными делают записи, а общий барьер выносят после ветви.

   **Типичная ошибка:** Ставить `__syncthreads()` внутри `if(threadIdx.x<128)`.

   **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

4. Что означает атомарность обновления одного значения и почему обычное сложение со счётчиком её не обеспечивает? Для двух потоков, каждый из которых добавляет единицу к исходному нулю, постройте возможное чередование чтения и записи, затем сформулируйте требование к атомарной операции.

   **Ответ:** Обычный increment включает чтение и запись: оба потока могут прочитать 0 и записать 1. Атомарная read-modify-write операция неделимо обновляет один объект, так что два атомарных прибавления дают 2 при допустимом типе и отсутствии переполнения.

   **Типичная ошибка:** Считать одну строку исходника неделимой операцией.

   **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

5. Чем барьер блока отличается от ожидания завершения ядра на CPU? Для двух последовательных ядер, первое из которых записывает массив, а второе его читает, определите, где нужна зависимость между операциями и почему `__syncthreads()` внутри первого ядра её не заменяет.

   **Ответ:** Блоковый барьер действует внутри одного kernel и блока. Зависимость A→B задают одним stream либо event/wait между streams; CPU ждёт только если ему нужен результат. Это обеспечивает готовность всей нужной работы A перед чтениями B.

   **Типичная ошибка:** Использовать `__syncthreads()` как межъядерный барьер.

   **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

6. Почему принадлежность двух потоков одному warp сама по себе недостаточна для безопасного обмена через shared memory? Рассмотрите запись значения одной lane и чтение другой, затем укажите, какие гарантии нужно установить явно с учётом independent thread scheduling.

   **Ответ:** Independent scheduling не гарантирует, что запись одной lane завершена до чтения другой. После записей и перед чтениями shared используют корректный `__syncwarp(mask)` либо блоковый барьер. Маска и участие должны охватывать фактических производителей и потребителей.

   **Типичная ошибка:** Полагаться на близкие номера lanes.

   **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

7. Для чего в `__syncwarp(mask)` задаётся маска участников? В warp из 32 lane составьте маску для lane 0–15 и перечислите условия, которые должны выполнить вызывающие и остальные незавершившиеся потоки, чтобы такой барьер был корректным.

   **Ответ:** Маска lane 0…15 равна `0x0000ffff`. Вызывающая lane входит в mask; все названные незавершившиеся участники выполняют соответствующий вызов с согласованной маской. На старых архитектурах есть дополнительные требования сходимости, которые проверяют отдельно.

   **Типичная ошибка:** Использовать full mask, когда часть названных lanes не участвует.

   **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

8. Почему пометка общего флага словом `volatile` не создаёт корректный протокол синхронизации? В схеме «производитель записывает данные и флаг, потребитель ждёт флаг» перечислите отдельные требования к атомарности, порядку памяти и возможности продолжения работы производителя.

   **Ответ:** `volatile` не обеспечивает атомарность флага и release/acquire-публикацию данных. Нужны совместимые атомарные операции нужного scope, запись данных до release, чтение после acquire и доказательство прогресса производителя. Буфер нельзя переиспользовать до окончания чтения.

   **Типичная ошибка:** Заменять atomic flag на volatile flag.

   **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

## Средний уровень

9. Где нужны барьеры при повторном использовании одного shared-буфера в цикле? Для фаз «загрузить тайл → прочитать соседние значения → загрузить следующий тайл» найдите как зависимость чтения от записи, так и опасность перезаписи до окончания чтений других потоков.

   **Ответ:** Нужны барьер после загрузки до чтений и барьер после чтений до перезаписи следующего тайла. Первый устраняет read-after-write опасность, второй — write-after-read. Участие сохраняют для всех итераций общего протокола.

   **Типичная ошибка:** Оставлять только барьер после загрузки.

   **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

10. Как сохранить корректное участие блока в обработке последнего неполного тайла? Для 1000 элементов и блоков по 256 потоков сравните условное выполнение полезных операций и ранний выход части потоков, явно проследив и барьеры, и наличие всех данных, которые читают оставшиеся участники.

    **Ответ:** В последнем блоке полезны 232 потока. Остальные не читают вход за границей, но при необходимости инициализируют нейтральные shared-ячейки и участвуют в коллективных фазах. Ранний выход допустим только при отдельном доказательстве корректного участия и наличия всех читаемых данных.

    **Типичная ошибка:** Оставлять shared-ячейки хвоста неинициализированными.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

11. Чем обмен значениями через `__shfl_sync` отличается от обмена через shared memory и `__syncwarp`? Спроектируйте передачу регистра lane 0 всем участникам полного warp и отдельно определите, устанавливает ли shuffle порядок для посторонних обращений к памяти.

    **Ответ:** `__shfl_sync` передаёт регистровое значение между lanes без shared. Для полного участвующего warp `v=__shfl_sync(0xffffffff,v,0)` распространяет значение lane 0. Shuffle сам по себе не является барьером памяти для посторонних global/shared обращений.

    **Типичная ошибка:** Использовать shuffle как публикацию несвязанных записей памяти.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

12. Как безопасно выбрать участников warp-операции при условии, зависящем от данных? Для предиката `index < n` опишите получение маски через `__ballot_sync` в точке совместного участия и объясните, почему вызов `__activemask()` уже внутри расходящейся ветви не обязан описывать всех логических участников задачи.

    **Ответ:** В точке совместного участия получают `mask=__ballot_sync(parentMask,index<n)` и только выбранные lanes выполняют согласованную операцию с mask. `__activemask()` внутри ветви отражает текущую активность исполнения и может не включать всех логических участников предиката.

    **Типичная ошибка:** Выводить маску задачи из случайного момента выполнения ветви.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

13. Какие ограничения накладывает `__shfl_down_sync` на источник значения и маску? Для последних 13 полезных lane разработайте шаги суммирования, при которых ни один используемый результат не зависит от неучаствующей lane, и отдельно проверьте допустимые значения `width`.

    **Ответ:** Для lanes 0…12 маску получают заранее; все они выполняют каждый shuffle с допустимым width=32. При шагах 8,4,2,1 прибавляют результат только если `lane+offset<13`; значения из неучаствующих источников не используют. Для разреженной маски сначала задают корректное отображение рангов.

    **Типичная ошибка:** Передавать width=13: width должен быть допустимой степенью двойки.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

14. Чем ожидание других потоков отличается от упорядочивания обращений вызывающего потока? Сравните `__syncthreads()`, `__threadfence_block()`, `__threadfence()` и `__threadfence_system()`, сформулировав, какие из них сами создают точку коллективного ожидания и какие дополнительные условия нужны для публикации данных.

    **Ответ:** `__syncthreads` включает коллективное ожидание и порядок памяти блока. Fences block/device/system упорядочивают обращения вызывающего потока в соответствующей области, но не ждут других участников. Публикация дополнительно требует атомарного протокола и чтения опубликованного состояния.

    **Типичная ошибка:** Принимать `__threadfence()` за барьер всей grid.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

15. Чем memory order отличается от thread scope в `cuda::atomic_ref` или `cuda::atomic`? Для отдельного статистического счётчика и флага готовности массива выберите порядок операций и область участников, затем объясните, почему один только device scope не означает release/acquire-публикацию массива.

    **Ответ:** Memory order задаёт упорядочивание, scope — круг участников атомарности/синхронизации. Независимому статистическому счётчику часто достаточно relaxed device scope; флаг массива требует release/acquire и scope, охватывающий обоих участников. Выбор также зависит от поддержанной памяти.

    **Типичная ошибка:** Считать device scope синонимом acquire/release.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

16. Какие гарантии имеет классический `atomicAdd` по отношению к обновляемому адресу и к другим записям потока? Разберите ситуацию, где поток записывает элемент массива и увеличивает счётчик завершения, а читатель по счётчику решает читать весь массив; какие доказательства требуются сверх атомарности счётчика?

    **Ответ:** Классический `atomicAdd` атомарно изменяет адрес счётчика, но не публикует автоматически другие записи как release. Для чтения массива по счётчику нужны доказанное упорядочивание всех писателей, видимость данных и корректное наблюдение готовности. Проще разделить фазы kernels либо применить явный атомарный протокол.

    **Типичная ошибка:** Читать весь массив после relaxed-счётчика без публикации его элементов.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

## Сложный уровень

17. Как построить протокол однократной публикации данных между двумя блоками через atomic flag? На уровне модели памяти опишите release-запись и acquire-чтение с областью, охватывающей обоих участников, затем отдельно проверьте возможность прогресса при ожидании и запрет преждевременного повторного использования буфера.

    **Ответ:** Производитель пишет payload, затем release-store флага; потребитель читает флаг acquire-load до нужного значения и лишь затем payload. Для двух блоков нужен минимум device scope и совместимая память. Отдельно доказывают, что producer сможет исполняться, и исключают повторное использование до окончания чтения.

    **Типичная ошибка:** Считать корректную память доказательством отсутствия deadlock.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

18. Почему самодельный барьер всей сетки на глобальном счётчике может зависнуть даже при корректных атомарных операциях? Для GPU, который одновременно размещает не более 80 блоков, рассмотрите запуск 800 блоков с активным ожиданием и сопоставьте зависимость от планирования с разделением работы на два ядра.

    **Ответ:** Первые 80 резидентных блоков могут занять все ресурсы и ждать остальные 720, которые не получают возможности стартовать. Атомарность счётчика не решает планирование. Два kernels в одном stream дают документированную границу фаз без такого активного ожидания.

    **Типичная ошибка:** Строить grid barrier на предположении одновременного запуска всех блоков.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

19. Какие требования нужны для `cooperative_groups::this_grid().sync()`? Для выбранного GPU и ядра проверьте поддержку cooperative launch, подходящий способ запуска и допустимый размер сетки с учётом ресурсов на блок, затем объясните, почему получение объекта группы при обычном запуске не подтверждает возможность grid barrier.

    **Ответ:** Проверяют поддержку cooperative launch и запускают через соответствующий API. Grid ограничивают допустимым совместным размещением с учётом kernel, B, shared и числа SM; все участники вызывают sync согласованно. Сам объект `this_grid()` при обычном запуске не обеспечивает этот контракт.

    **Типичная ошибка:** Добавлять `grid.sync()` без изменения способа запуска.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

20. Как block clusters и distributed shared memory расширяют обмен данными между блоками на поддерживаемом GPU? Для выбранной архитектуры проверьте способ запуска кластера, допустимые размеры, доступ к shared memory другого блока и необходимые точки `cluster.sync()`, включая завершение удалённых обращений до выхода владельца памяти. Объясните, как передача группы Cooperative Groups в функцию делает её требования к участникам явными и почему барьер кластера не становится барьером всей сетки.

    **Ответ:** Clusters на поддерживаемых GPU позволяют группе блоков обращаться к distributed shared memory. Проверяют допустимые размеры/launch, синхронизируют готовность владельцев и завершение удалённых обращений до их выхода. Переданная группа делает участников функции явными; `cluster.sync()` охватывает только кластер.

    **Типичная ошибка:** Обращаться к shared блока после завершения его жизни.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

21. Как проверить корректность взаимодействия CPU и GPU через атомарный флаг в общей доступной памяти? Для выбранной платформы установите поддержку system-scope atomics и одновременного доступа к данному виду памяти, совместимые host/device атомарные операции, выравнивание и release/acquire-порядок, затем определите срок жизни данных.

    **Ответ:** Проверяют доступность памяти обеим сторонам, concurrent access, поддержку system-scope atomics, выравнивание и совместимость host/device операций. GPU публикует release, CPU наблюдает acquire или наоборот; allocation живёт до завершения обоих участников. Обычная pinned-память сама по себе всех гарантий не даёт.

    **Типичная ошибка:** Смешивать неатомарный CPU load с атомарным GPU store флага.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

22. Почему уменьшение числа атомарных обновлений часто требует дополнительной синхронизации и памяти? Сравните один глобальный `atomicAdd` на каждый из миллиона элементов, накопление частичных сумм по warp и по блоку, оценив число обновлений и обозначив места, где промежуточные результаты становятся доступными другим участникам.

    **Ответ:** Для миллиона элементов прямой подход делает миллион обновлений; по полным warp — около 31 250, по блокам 256 — около 3907. Локальное объединение требует shuffle либо shared и барьеров; частичные результаты должны быть готовы до финального атомарного update.

    **Типичная ошибка:** Сокращать атомики, забыв стоимость локальной reduction.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

23. Какие ошибки остаются возможными в многократно используемой очереди producer–consumer после добавления release/acquire-флага? Разберите повторную публикацию в той же ячейке, различение поколений, переполнение счётчика и прогресс участников, затем сформулируйте, какие инварианты понадобятся прежде, чем оптимизировать такую очередь.

    **Ответ:** Release/acquire решает публикацию одной версии, но не владение ячейкой следующего поколения. Нужны различение поколений, отсутствие ABA/небезопасного wraparound, единственный владелец записи, подтверждение освобождения и доказательство прогресса. Счётчики и ёмкость выбирают с явными инвариантами.

    **Типичная ошибка:** Повторно публиковать в ещё читаемую ячейку.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

24. Как составить проверку сложного ядра, в котором смешаны shared memory, warp-операции и атомарная публикация? Выберите размеры с неполным warp и неполным блоком, входы с разными ветвлениями и многократные запуски, затем сопоставьте ручное доказательство зависимостей с возможностями и ограничениями Compute Sanitizer `racecheck` и `synccheck`.

    **Ответ:** Проверяют N=0,1,13,31,33,255,257 и неоднородные ветви, многократные повторы и CPU-эталон. Ручной граф зависимостей дополняют memcheck, racecheck и synccheck. Racecheck прежде всего проверяет shared hazards и не доказывает корректность глобальной атомарной очереди или прогресс.

    **Типичная ошибка:** Считать чистый отчёт sanitizer полным доказательством отсутствия гонок.

    **Источник:** [CUDA C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html); [CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

## Критерий освоения

Вы можете назвать участников каждой синхронизации, показать порядок зависимых обращений и отличить атомарность отдельной операции от публикации других данных. Вы проверяете корректность масок и коллективных вызовов, учитываете область атомарных операций и отдельно доказываете прогресс схем с ожиданием между блоками.

Официальные источники: [CUDA Programming Guide: C/C++ Language Extensions](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html), [CUDA Programming Guide: CUDA C++ Memory Model](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html).

[← Shared memory, регистры и ресурсы блока](05_shared_memory_and_resources.md) · [Оглавление](README.md) · [Streams, events и CUDA Graphs →](07_streams_events_and_graphs.md)
