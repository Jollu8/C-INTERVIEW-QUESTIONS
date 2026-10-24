# 💾 8. Диски и I/O

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy


---

## 🔹 HDD vs SSD

1. (L1 [T]) В чём фундаментальная разница между HDD и SSD?

   **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

   **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


2. (L1 [T]) Почему HDD чувствителен к seek time?

   **Ответ:** File offsets не обязаны соответствовать соседним physical blocks: fragmentation/другие streams добавляют seeks и очередь. HDD платит механикой, SSD — IOPS/metadata; измерять физический путь и не переносить HDD assumptions напрямую.

   **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


3. (L1 [T]) Почему SSD обычно быстрее на random read?

   **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

   **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


4. (L1 [T]) Что такое latency и throughput в контексте дисков?

   **Ответ:** Latency — время одной операции с определёнными границами, throughput — завершённая работа в единицу времени. После saturation рост offered load повышает queue/p99, а не обязательно useful throughput; считать ошибки отдельно.

   **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


5. (L1 [T]) Почему HDD лучше проявляет себя на sequential I/O, чем на random I/O?

   **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

   **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


6. (L1 [T]) Почему у SSD нет механической головки, но всё равно есть неравномерность latency?

   **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


7. (L1 [T]) Что такое IOPS?

   **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта.

   **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


8. (L1 [T]) Почему сравнивать диски только по IOPS — недостаточно?

   **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта.

   **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


9. (L1 [T]) Что такое erase block у SSD?

   **Ответ:** NAND программируется страницами и стирается более крупными erase blocks; in-place overwrite на уровне host скрывает relocation/GC FTL. Host block size, filesystem page и flash geometry — разные уровни.

   **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


10. (L1 [T]) Почему SSD и HDD по-разному влияют на дизайн storage engine?

    **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


11. (L1 [P]) Написать benchmark sequential read для файла на Linux

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


12. (L1 [P]) Написать benchmark random read для файла на Linux

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


13. (L1 [P]) Сравнить latency HDD и SSD на 4KB reads

    **Ответ:** DB page size не обязан равняться OS page size или device sector. Выбор влияет на fanout, amplification, buffer occupancy и torn-write handling; типичный PostgreSQL block — 8 KiB при обычном build, Linux page часто 4 KiB. Benchmark отдельно sequential/random и read/write mix с известным block size, queue depth и direct/buffered режимом. Работать с выделенными тестовыми файлами, проверить data integrity и длительный steady state; не уничтожать рабочий dataset.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


14. (L1 [P]) Реализовать простой fio-подобный microbenchmark на C/C++

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


15. (L1 [P]) Измерить throughput при разных размерах блока: 4KB, 64KB, 1MB

    **Ответ:** DB page size не обязан равняться OS page size или device sector. Выбор влияет на fanout, amplification, buffer occupancy и torn-write handling; типичный PostgreSQL block — 8 KiB при обычном build, Linux page часто 4 KiB. Benchmark отдельно sequential/random и read/write mix с известным block size, queue depth и direct/buffered режимом. Работать с выделенными тестовыми файлами, проверить data integrity и длительный steady state; не уничтожать рабочий dataset.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


16. (L2 [T]) Почему SSD имеет высокую производительность, но не “бесплатную”?

    **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


17. (L2 [T]) Что такое SSD controller и FTL?

    **Ответ:** FTL/flash GC и wear leveling добавляют внутренние rewrites и задержки, особенно при низком свободном месте. Fresh-device burst не отражает steady-state p99/endurance; учитывать TRIM, overprovisioning и power-loss protection.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


18. (L2 [T]) Почему write amplification важна именно для SSD?

    **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


19. (L2 [T]) Почему TRIM/discard влияет на долгосрочную производительность SSD?

    **Ответ:** TRIM/discard сообщает SSD, какие logical blocks больше не нужны, помогая FTL reclamation. Это не команда немедленного безопасного стирания и не гарантия одинаковой latency; поддержка зависит от всего storage stack.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


20. (L2 [T]) Почему HDD может показывать стабильный throughput, но ужасный p99 latency?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Latency — время одной операции с определёнными границами, throughput — завершённая работа в единицу времени. После saturation рост offered load повышает queue/p99, а не обязательно useful throughput; считать ошибки отдельно.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


21. (L2 [T]) Как queue depth влияет на SSD throughput?

    **Ответ:** Queue depth увеличивает число in-flight I/O и может раскрыть parallelism устройства до насыщения. После него растёт преимущественно waiting/p99, поэтому maximum IOPS при большой QD не является latency SLO.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


22. (L2 [T]) Почему NVMe отличается от SATA SSD не только пропускной способностью?

    **Ответ:** NVMe рассчитан на много parallel queues и низкий protocol overhead PCIe storage, SATA/AHCI имеют иные очереди/интерфейс. Реальный выигрыш ограничивают workload, QD, CPU и устройство, а не только номинальный bandwidth.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


23. (L2 [T]) Почему SSD хуже предсказуем по latency под mixed workload?

    **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


24. (L2 [T]) Почему device cache и контроллер влияют на durability semantics?

    **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


25. (L2 [T]) Как выбор диска влияет на B-Tree vs LSM engine?

    **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


26. (L2 [P]) Написать benchmark с configurable queue depth

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


27. (L2 [P]) Реализовать mixed workload: 70% read / 30% write

    **Ответ:** Benchmark отдельно sequential/random и read/write mix с известным block size, queue depth и direct/buffered режимом. Работать с выделенными тестовыми файлами, проверить data integrity и длительный steady state; не уничтожать рабочий dataset.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


28. (L2 [P]) Измерить p50/p95/p99 latency для HDD и SSD

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Benchmark отдельно sequential/random и read/write mix с известным block size, queue depth и direct/buffered режимом. Работать с выделенными тестовыми файлами, проверить data integrity и длительный steady state; не уничтожать рабочий dataset.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


29. (L2 [P]) Сравнить buffered I/O и O_DIRECT на SSD

    **Ответ:** Узнать filesystem/device alignment constraints, использовать aligned buffers/offsets/lengths и обработать short I/O/errors. Async buffers/FD живут до completion; проверить actual direct path и отдельно выполнить требуемый durability barrier.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


30. (L2 [P]) Построить profile зависимости throughput от block size и queue depth

    **Ответ:** Queue depth увеличивает число in-flight I/O и может раскрыть parallelism устройства до насыщения. После него растёт преимущественно waiting/p99, поэтому maximum IOPS при большой QD не является latency SLO. Benchmark отдельно sequential/random и read/write mix с известным block size, queue depth и direct/buffered режимом. Работать с выделенными тестовыми файлами, проверить data integrity и длительный steady state; не уничтожать рабочий dataset.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


31. (L2 [D]) Почему SSD не даёт ожидаемого прироста после миграции с HDD?

    **Ответ:** Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


32. (L2 [D]) Почему disk util низкий, а latency высокая?

    **Ответ:** Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


33. (L2 [D]) Почему random write на SSD деградирует со временем?

    **Ответ:** Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


34. (L2 [D]) Почему sequential benchmark быстрый, а реальная БД всё равно медленная?

    **Ответ:** Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission. Проверить исключённый setup, compiler dead-code removal, coordinated omission, cache/durability differences и saturation самого генератора. Повторить baseline и изменение на одинаковой конфигурации с проверкой полезного результата.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


35. (L2 [D]) Почему одна и та же нагрузка на HDD “тормозит” сильнее ночью?

    **Ответ:** Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


36. (L3 [T]) Как SSD FTL скрывает реальное физическое размещение данных?

    **Ответ:** FTL/flash GC и wear leveling добавляют внутренние rewrites и задержки, особенно при низком свободном месте. Fresh-device burst не отражает steady-state p99/endurance; учитывать TRIM, overprovisioning и power-loss protection.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


37. (L3 [T]) Почему device-level garbage collection влияет на latency spikes?

    **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

    **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


38. (L3 [T]) Как write cache и flush/fua влияют на correctness?

    **Ответ:** Persistence зависит от flush/FUA/barrier пути до контроллера и его power-loss поведения. O_DIRECT не выключает volatile device cache, а VM/hypervisor может добавить ещё один слой с собственными гарантиями.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


39. (L3 [T]) Почему queue depth может улучшать throughput и ухудшать tail latency одновременно?

    **Ответ:** Queue depth увеличивает число in-flight I/O и может раскрыть parallelism устройства до насыщения. После него растёт преимущественно waiting/p99, поэтому maximum IOPS при большой QD не является latency SLO. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


40. (L3 [T]) Как NUMA и PCIe topology влияют на NVMe performance?

    **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality. Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


41. (L3 [T]) Почему storage engine не должен считать SSD “просто быстрым HDD”?

    **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


42. (L3 [T]) Как zoned devices меняют дизайн log-structured storage?

    **Ответ:** Zoned devices требуют определённой последовательности записи внутри zones и управления write pointers/reset. Log-structured placement естественно подходит, но zone GC, capacity и crash recovery должны соблюдать device constraints.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


43. (L3 [T]) Почему benchmarking storage без контроля page cache и readahead даёт ложные выводы?

    **Ответ:** Readahead заранее подтягивает ожидаемые страницы последовательного файла. Random/sparse доступ, лишние reads и cache pollution способны уменьшить пользу; сравнить physical bytes, faults и полезную latency. Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


44. (L3 [T]) Как filesystem и scheduler Linux искажают “чистую” картину устройства?

    **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


45. (L3 [T]) Почему устройство может быть bottleneck по latency, а не по bandwidth?

    **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


46. (L3 [P]) Реализовать latency histogram для device I/O

    **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные. Benchmark отдельно sequential/random и read/write mix с известным block size, queue depth и direct/buffered режимом. Работать с выделенными тестовыми файлами, проверить data integrity и длительный steady state; не уничтожать рабочий dataset.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


47. (L3 [P]) Реализовать benchmark с pinning thread → CPU → NUMA node

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


48. (L3 [P]) Реализовать тест влияния fsync/fdatasync/FUA на latency

    **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


49. (L3 [P]) Реализовать synthetic WAL-like append benchmark

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


50. (L3 [P]) Реализовать synthetic LSM compaction benchmark для HDD vs SSD

    **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


51. (L3 [D]) Как доказать, что latency spikes приходят из SSD GC, а не из filesystem?

    **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

    **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


52. (L3 [D]) Почему NVMe показывает высокий bandwidth, но poor small-write latency?

    **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта. Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


53. (L3 [D]) Почему migration на более быстрый диск не помогла p99?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


54. (L3 [D]) Как расследовать влияние NUMA/PCIe placement на NVMe throughput?

    **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality. Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


55. (L3 [D]) Почему синтетический benchmark и production workload дают противоположные выводы?

    **Ответ:** Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission. Проверить исключённый setup, compiler dead-code removal, coordinated omission, cache/durability differences и saturation самого генератора. Повторить baseline и изменение на одинаковой конфигурации с проверкой полезного результата.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


56. (L4 [S]) Когда HDD всё ещё оправдан для storage systems?

    **Ответ:** Выбирать носитель по устойчивой нагрузке, p99, capacity/endurance и power-loss protection. Разделить логическую durability от маркетинговой скорости NVMe, спланировать запас и отказ/restore.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


57. (L4 [S]) Как проектировать storage engine отдельно под HDD и под SSD?

    **Ответ:** Выбирать носитель по устойчивой нагрузке, p99, capacity/endurance и power-loss protection. Разделить логическую durability от маркетинговой скорости NVMe, спланировать запас и отказ/restore.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


58. (L4 [S]) Когда стоит инвестировать в NVMe, а когда bottleneck не в диске?

    **Ответ:** Выбирать носитель по устойчивой нагрузке, p99, capacity/endurance и power-loss protection. Разделить логическую durability от маркетинговой скорости NVMe, спланировать запас и отказ/restore.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


59. (L4 [S]) Как выбирать block sizes, queue depth и flush policy под конкретный класс устройств?

    **Ответ:** Queue depth увеличивает число in-flight I/O и может раскрыть parallelism устройства до насыщения. После него растёт преимущественно waiting/p99, поэтому maximum IOPS при большой QD не является latency SLO.

    **Рекомендация:** Выбирать носитель по устойчивой нагрузке, p99, capacity/endurance и power-loss protection. Разделить логическую durability от маркетинговой скорости NVMe, спланировать запас и отказ/restore.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


60. (L4 [S]) Как объяснять команде, что “быстрый диск” не отменяет плохую архитектуру I/O path?

    **Ответ:** Выбирать носитель по устойчивой нагрузке, p99, capacity/endurance и power-loss protection. Разделить логическую durability от маркетинговой скорости NVMe, спланировать запас и отказ/restore.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


---

## 🔹 Sequential vs random I/O

61. (L1 [T]) Что такое sequential I/O?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


62. (L1 [T]) Что такое random I/O?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


63. (L1 [T]) Почему sequential I/O обычно быстрее random I/O?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


64. (L1 [T]) Почему HDD особенно плохо переносит random I/O?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


65. (L1 [T]) Почему SSD тоже имеет разницу между sequential и random workload?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


66. (L1 [T]) Что такое access pattern?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


67. (L1 [T]) Почему append-only log использует преимущества sequential I/O?

    **Ответ:** Append-only избегает in-place перезаписи существующего префикса и удобно группирует log writes. Нужны framing/checksum и safe truncation/recycling; append syscall не гарантирует power-loss atomicity или отсутствие amplification.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


68. (L1 [T]) Почему B-Tree и LSM создают разный I/O pattern?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


69. (L1 [T]) Почему размер блока влияет на observed throughput?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


70. (L1 [T]) Почему prefetch/readahead чаще полезен именно для sequential reads?

    **Ответ:** Readahead заранее подтягивает ожидаемые страницы последовательного файла. Random/sparse доступ, лишние reads и cache pollution способны уменьшить пользу; сравнить physical bytes, faults и полезную latency. Prefetch полезен, если адрес известен достаточно заранее и есть bandwidth/cache capacity. Pointer dependency, случайные accesses, неверная distance и cache pollution могут убрать выигрыш; сравнивать physical bytes и stalled cycles.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


71. (L1 [P]) Реализовать sequential file scanner на C++

    **Ответ:** Генерировать известный набор offsets и одинаковый объём, отдельно контролировать block size, depth и cache state. Использовать pread/pwrite, корректно обрабатывать short I/O и проверять прочитанные данные.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


72. (L1 [P]) Реализовать random block reader

    **Ответ:** Генерировать известный набор offsets и одинаковый объём, отдельно контролировать block size, depth и cache state. Использовать pread/pwrite, корректно обрабатывать short I/O и проверять прочитанные данные.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


73. (L1 [P]) Сравнить throughput sequential vs random reads

    **Ответ:** Генерировать известный набор offsets и одинаковый объём, отдельно контролировать block size, depth и cache state. Использовать pread/pwrite, корректно обрабатывать short I/O и проверять прочитанные данные.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


74. (L1 [P]) Сравнить latency random 4KB vs sequential 1MB reads

    **Ответ:** DB page size не обязан равняться OS page size или device sector. Выбор влияет на fanout, amplification, buffer occupancy и torn-write handling; типичный PostgreSQL block — 8 KiB при обычном build, Linux page часто 4 KiB. Генерировать известный набор offsets и одинаковый объём, отдельно контролировать block size, depth и cache state. Использовать pread/pwrite, корректно обрабатывать short I/O и проверять прочитанные данные.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


75. (L1 [P]) Реализовать benchmark для append-only writes

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


76. (L2 [T]) Почему fragmented file превращает “почти sequential” workload в random-like?

    **Ответ:** File offsets не обязаны соответствовать соседним physical blocks: fragmentation/другие streams добавляют seeks и очередь. HDD платит механикой, SSD — IOPS/metadata; измерять физический путь и не переносить HDD assumptions напрямую.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


77. (L2 [T]) Как block allocator filesystem влияет на locality?

    **Ответ:** Allocator overhead включает bookkeeping, contention и удержание arenas. Arena/slab подходят при известных size/lifetime, но требуют alignment/ownership и bounded capacity; RSS без live allocation analysis не доказывает leak.

    **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


78. (L2 [T]) Почему large sequential I/O может быть неэффективным при чрезмерном buffering?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


79. (L2 [T]) Почему mixed workload ломает предположения о sequential locality?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


80. (L2 [T]) Как readahead помогает и когда вредит?

    **Ответ:** Readahead заранее подтягивает ожидаемые страницы последовательного файла. Random/sparse доступ, лишние reads и cache pollution способны уменьшить пользу; сравнить physical bytes, faults и полезную latency.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


81. (L2 [T]) Что такое locality of reference?

    **Ответ:** Spatial locality использует соседние bytes/pages, temporal — повторные обращения к недавним данным. Logical key order не гарантирует physical row/file locality, а concurrent streams могут разрушить sequential access.

    **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


82. (L2 [T]) Почему range scan в индексе может выродиться в random I/O?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


83. (L2 [T]) Как compaction в LSM превращает writes в большие sequential streams?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


84. (L2 [T]) Почему B-Tree page splits создают более random write pattern?

    **Ответ:** Split распределяет keys/records между страницами и публикует separator/links в правильном порядке. Он добавляет allocation, logging и parent updates, иногда каскад до root; запас свободного места меняет частоту, а не необходимость корректного split.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


85. (L2 [T]) Как размер working set влияет на реальный I/O pattern?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


86. (L2 [P]) Реализовать benchmark fragment-aware sequential access

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


87. (L2 [P]) Реализовать random-vs-sequential scan по mmap и по pread

    **Ответ:** Отобразить проверенный размер файла, использовать offsets и checked spans вместо persisted pointers, удерживать mapping lifetime. MAP_SHARED updates требуют explicit crash-safe protocol/sync, а fault benchmark различает minor/major и cold/warm working set.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


88. (L2 [P]) Измерить эффект readahead на range scan

    **Ответ:** Задать hint/distance/окно, измерить physical bytes и полезную latency при sequential/random/mixed workload. Prefetch не должен читать за bounds или вытеснять критичный cache; сравнить с hardware/OS baseline.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


89. (L2 [P]) Реализовать synthetic B-Tree-like page access pattern

    **Ответ:** Объявить occupancy/separator invariants, реализовать search и insert split, затем delete rebalance и linked-leaf range. Concurrency вводить через доказанный latch/version protocol; проверять после interleavings keys/order/depth и equivalence reference map.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


90. (L2 [P]) Реализовать synthetic LSM compaction write stream

    **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


91. (L2 [D]) Почему sequential scan не достигает паспортного bandwidth?

    **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта. Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования. Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


92. (L2 [D]) Почему supposedly sequential workload внезапно стал random-like?

    **Ответ:** Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


93. (L2 [D]) Почему random reads на SSD всё равно дают большой p99?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


94. (L2 [D]) Почему range query деградировала после роста таблицы?

    **Ответ:** Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


95. (L2 [D]) Почему prefetching не дал ожидаемого эффекта?

    **Ответ:** Prefetch полезен, если адрес известен достаточно заранее и есть bandwidth/cache capacity. Pointer dependency, случайные accesses, неверная distance и cache pollution могут убрать выигрыш; сравнивать physical bytes и stalled cycles. Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


96. (L3 [T]) Как Linux readahead algorithm взаимодействует с access patterns?

    **Ответ:** Readahead заранее подтягивает ожидаемые страницы последовательного файла. Random/sparse доступ, лишние reads и cache pollution способны уменьшить пользу; сравнить physical bytes, faults и полезную latency.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


97. (L3 [T]) Как page cache сглаживает разницу между sequential и random reads?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


98. (L3 [T]) Почему CPU cache/TLB/cache lines тоже важны для “I/O” pattern?

    **Ответ:** TLB кэширует translations, и большой случайный working set повышает translation misses/page walks. Huge pages увеличивают охват TLB, но требуют оценки fragmentation, allocation stalls и реального выигрыша.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


99. (L3 [T]) Как параллельные потоки могут разрушать sequential locality?

    **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


100. (L3 [T]) Почему queue merging и I/O scheduler особенно важны для HDD?

     **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


101. (L3 [T]) Как filesystem fragmentation влияет на long-term performance?

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать. Fragmentation может означать holes внутри page, разнесённые extents или allocator slack — сначала назвать слой. Live bytes, allocated file size и RSS измеряют разное; compaction/rebuild не всегда возвращает место ОС немедленно.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


102. (L3 [T]) Почему log-structured design старается превратить random writes в sequential?

     **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


103. (L3 [T]) Как direct I/O меняет поведение sequential vs random patterns?

     **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


104. (L3 [T]) Почему “random” workload часто имеет скрытую spatial/temporal locality?

     **Ответ:** Sequential I/O использует соседние offsets, random — разнесённые; для HDD разница особенно велика. Batching/readahead уменьшают накладные расходы, но queue depth и cache могут изменять наблюдаемую картину.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


105. (L3 [T]) Как проектировать benchmark так, чтобы он действительно измерял pattern, а не page cache?

     **Ответ:** Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


106. (L3 [P]) Реализовать per-offset trace access pattern analyzer

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


107. (L3 [P]) Реализовать benchmark с переключением readahead on/off

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


108. (L3 [P]) Реализовать multi-thread mixed random/sequential workload generator

     **Ответ:** Генерировать известный набор offsets и одинаковый объём, отдельно контролировать block size, depth и cache state. Использовать pread/pwrite, корректно обрабатывать short I/O и проверять прочитанные данные.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


109. (L3 [P]) Реализовать access heatmap по файлу/страницам

     **Ответ:** Генерировать известный набор offsets и одинаковый объём, отдельно контролировать block size, depth и cache state. Использовать pread/pwrite, корректно обрабатывать short I/O и проверять прочитанные данные.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


110. (L3 [P]) Реализовать scan benchmark с pinning и controlled cache eviction

     **Ответ:** Реализовать map key→replacement metadata и byte capacity; hit обновляет policy, victim исключает pinned/in-flight entries. Dirty victim flush следует WAL-before-data; test scan pollution, concurrency, failed writeback и exhaustion.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


111. (L3 [D]) Как доказать, что проблема именно в fragmentation/randomization access pattern?

     **Ответ:** Fragmentation может означать holes внутри page, разнесённые extents или allocator slack — сначала назвать слой. Live bytes, allocated file size и RSS измеряют разное; compaction/rebuild не всегда возвращает место ОС немедленно. Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


112. (L3 [D]) Почему sequential throughput хороший, а запросы БД всё равно медленные?

     **Ответ:** Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


113. (L3 [D]) Как расследовать readahead thrashing?

     **Ответ:** Readahead заранее подтягивает ожидаемые страницы последовательного файла. Random/sparse доступ, лишние reads и cache pollution способны уменьшить пользу; сравнить physical bytes, faults и полезную latency. Control loop без hysteresis/cooldown может многократно переносить данные/ресурсы между решениями. Использовать стабильное окно, разные пороги входа/выхода и budget изменений; учитывать delayed metrics и стоимость прогрева. Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


114. (L3 [D]) Почему смешанный workload убил throughput на HDD, хотя каждый по отдельности был нормальным?

     **Ответ:** Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


115. (L3 [D]) Как отличить CPU-bound iterator problem от настоящего storage random I/O bottleneck?

     **Ответ:** Снять offset/size distribution, requests merged, queue depth и read-ahead эффект. Разделить реальные device reads и cache hits; selective index probes могут превратить последовательный scan в множество random reads.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


116. (L4 [S]) Как проектировать storage layout так, чтобы максимизировать sequential locality?

     **Ответ:** Предпочитать coalesced/последовательный доступ там, где workload позволяет, не читая чрезмерно лишние байты. На SSD random всё ещё расходует IOPS и metadata, поэтому решение проверять по latency и bytes.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


117. (L4 [S]) Когда выгодно специально менять layout данных ради scan-heavy workload?

     **Ответ:** Предпочитать coalesced/последовательный доступ там, где workload позволяет, не читая чрезмерно лишние байты. На SSD random всё ещё расходует IOPS и metadata, поэтому решение проверять по latency и bytes.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


118. (L4 [S]) Как выбирать между B-Tree-like и log-structured write path с точки зрения access patterns?

     **Ответ:** Предпочитать coalesced/последовательный доступ там, где workload позволяет, не читая чрезмерно лишние байты. На SSD random всё ещё расходует IOPS и metadata, поэтому решение проверять по latency и bytes.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


119. (L4 [S]) Как строить observability для random/sequential mix в production?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


120. (L4 [S]) Как объяснять разработчикам, что “логически простой range query” не означает “физически sequential I/O”?

     **Ответ:** Предпочитать coalesced/последовательный доступ там, где workload позволяет, не читая чрезмерно лишние байты. На SSD random всё ещё расходует IOPS и metadata, поэтому решение проверять по latency и bytes.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

## 🔹 fsync

121. (L1 [T]) Что делает fsync?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Пример:** write→fsync(file)→ACK; для durable публикации нового имени может требоваться sync parent directory.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


122. (L1 [T]) Чем fsync отличается от write?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


123. (L1 [T]) Почему успешный write не означает durability?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


124. (L1 [T]) Чем fsync отличается от fdatasync?

     **Ответ:** fsync синхронизирует данные и нужную file metadata, fdatasync может пропустить metadata, не нужную для чтения содержимого. Создание/rename требует отдельно учитывать durability parent directory; проверить return errors обязательно.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


125. (L1 [T]) Почему fsync важен для WAL и transactional systems?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


126. (L1 [T]) Почему fsync может быть очень дорогим?

     **Ответ:** Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


127. (L1 [T]) Что такое dirty pages в контексте page cache?

     **Ответ:** Dirty page изменена в памяти и ещё не приведена к устойчивому backing state. Для DB pages нужен WAL-before-data, для OS cache — writeback/sync по контракту; один dirty flag не содержит всего recovery protocol.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


128. (L1 [T]) Почему kernel может откладывать запись на устройство?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


129. (L1 [T]) Что значит “данные записаны в page cache, но не на диск”?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


130. (L1 [T]) Почему fsync влияет на commit latency?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


131. (L1 [P]) Написать программу, сравнивающую write-only и write+fsync

     **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

     **Типичная ошибка:** Приравнивать O_DIRECT, write completion или sync_file_range к успешному durable flush.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


132. (L1 [P]) Измерить latency fsync на разных размерах payload

     **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


133. (L1 [P]) Реализовать append+fsync loop для WAL-like workload

     **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


134. (L1 [P]) Сравнить fsync и fdatasync

     **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


135. (L1 [P]) Реализовать benchmark group commit с одним fsync на batch

     **Ответ:** Committers публикуют target LSN в bounded queue, один flusher пишет и sync общий префикс. После успеха продвинуть durable watermark и разбудить только покрытых waiters; error/cancel/restart не должны давать ранний ACK или lost wakeup.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


136. (L2 [T]) Почему fsync может flush-ить больше, чем ожидает приложение?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


137. (L2 [T]) Почему fsync одного файла может зависеть от состояния filesystem journal?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


138. (L2 [T]) Что такое group commit и почему он уменьшает цену fsync на транзакцию?

     **Ответ:** Group commit объединяет несколько ожидающих commit за одним durable flush. Он сохраняет гарантию ACK после flush для каждой транзакции, но добавляет очередь и время накопления группы.

     **Пример:** Три commit ждут LSN 10/20/30; один успешный flush до 30 позволяет подтвердить все три.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


139. (L2 [T]) Почему разные filesystem ведут себя по-разному относительно fsync?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


140. (L2 [T]) Почему fsync latency может быть “зубчатой”?

     **Ответ:** Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


141. (L2 [T]) Почему mount options могут менять реальную durability semantics?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


142. (L2 [T]) Почему write cache на устройстве усложняет интерпретацию fsync?

     **Ответ:** Persistence зависит от flush/FUA/barrier пути до контроллера и его power-loss поведения. O_DIRECT не выключает volatile device cache, а VM/hypervisor может добавить ещё один слой с собственными гарантиями.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


143. (L2 [T]) Почему fsync на виртуалках/облаке может вести себя особенно нестабильно?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


144. (L2 [T]) Что такое sync_file_range и почему это не замена fsync?

     **Ответ:** sync_file_range управляет writeback диапазона, но не даёт полного durability обещания fsync, включая нужную metadata и требования storage flush. Использовать его как единственный барьер перед durable ACK нельзя.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


145. (L2 [T]) Почему frequent fsync разрушает throughput write-heavy системы?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


146. (L2 [P]) Реализовать batched group commit через отдельный flush thread

     **Ответ:** Committers публикуют target LSN в bounded queue, один flusher пишет и sync общий префикс. После успеха продвинуть durable watermark и разбудить только покрытых waiters; error/cancel/restart не должны давать ранний ACK или lost wakeup.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


147. (L2 [P]) Реализовать configurable commit policy: every txn / every N ms / every N records

     **Ответ:** Выполнить write loop с обработкой EINTR/short writes, затем fsync/fdatasync и проверить результат до ACK. Для replace писать temp, sync, rename, sync directory; fault tests включают ошибки flush и потерю незавершённого хвоста.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


148. (L2 [P]) Реализовать latency histogram для fsync

     **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


149. (L2 [P]) Реализовать crash-injection тесты вокруг fsync boundaries

     **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


150. (L2 [P]) Реализовать benchmark влияния concurrent writers на fsync cost

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


151. (L2 [D]) Почему fsync latency резко вырос после релиза?

     **Ответ:** Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing. Измерить время write и sync раздельно, pending dirty bytes, flush queue и device errors. Проверить фактические syscalls/ordering, filesystem/mount/device cache и виртуализированный storage; page cache способен скрывать отсутствие durability.

     **Типичная ошибка:** Приравнивать O_DIRECT, write completion или sync_file_range к успешному durable flush.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


152. (L2 [D]) Почему после падения часть подтверждённых транзакций потерялась?

     **Ответ:** Измерить время write и sync раздельно, pending dirty bytes, flush queue и device errors. Проверить фактические syscalls/ordering, filesystem/mount/device cache и виртуализированный storage; page cache способен скрывать отсутствие durability.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


153. (L2 [D]) Почему fdatasync не дал существенного выигрыша?

     **Ответ:** Измерить время write и sync раздельно, pending dirty bytes, flush queue и device errors. Проверить фактические syscalls/ordering, filesystem/mount/device cache и виртуализированный storage; page cache способен скрывать отсутствие durability.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


154. (L2 [D]) Почему один slow fsync ломает p99 всей БД?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing. Измерить время write и sync раздельно, pending dirty bytes, flush queue и device errors. Проверить фактические syscalls/ordering, filesystem/mount/device cache и виртуализированный storage; page cache способен скрывать отсутствие durability.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


155. (L2 [D]) Почему на тестовой машине всё durable, а в production бывают потери?

     **Ответ:** Измерить время write и sync раздельно, pending dirty bytes, flush queue и device errors. Проверить фактические syscalls/ordering, filesystem/mount/device cache и виртуализированный storage; page cache способен скрывать отсутствие durability.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


156. (L3 [T]) Как fsync взаимодействует с journaled filesystems?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


157. (L3 [T]) Как storage cache, barriers и flush commands влияют на guarantees fsync?

     **Ответ:** Persistence зависит от flush/FUA/barrier пути до контроллера и его power-loss поведения. O_DIRECT не выключает volatile device cache, а VM/hypervisor может добавить ещё один слой с собственными гарантиями.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


158. (L3 [T]) Почему verifying durability требует crash testing, а не только code review?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


159. (L3 [T]) Как проектировать WAL path, чтобы минимизировать число fsync?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


160. (L3 [T]) Почему commit order, write order и durability order могут расходиться?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


161. (L3 [T]) Как io_uring и async interfaces соотносятся с fsync semantics?

     **Ответ:** Async completion означает завершение указанной операции, а не автоматически durable persistence. Buffer/FD должны жить до нужного completion, short I/O/errors/cancellation обрабатываются явно; flush/barrier семантика задаётся отдельно.

     **Источник:** [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


162. (L3 [T]) Почему page cache writeback daemon влияет на observed fsync latency?

     **Ответ:** Buffered writes создают dirty pages и позже background writeback; при превышении порогов writer может быть throttled. Быстрый write benchmark до накопления dirty debt измеряет RAM buffering, а не устойчивую скорость диска. Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


163. (L3 [T]) Как measuring fsync без контроля соседней нагрузки даёт ложные выводы?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


164. (L3 [T]) Почему bursty fsync pattern может создавать sawtooth latency в системе?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


165. (L3 [T]) Как проектировать durable pipeline с учётом filesystem + device + virtualization stack?

     **Ответ:** Успешный write обычно означает передачу в kernel cache, а fsync запрашивает устойчивость данных/нужной metadata и возвращает ошибки. fdatasync отличается охватом metadata; для durable создания/rename может требоваться sync каталога.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


166. (L3 [P]) Реализовать flush coordinator для group commit

     **Ответ:** Committers публикуют target LSN в bounded queue, один flusher пишет и sync общий префикс. После успеха продвинуть durable watermark и разбудить только покрытых waiters; error/cancel/restart не должны давать ранний ACK или lost wakeup.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


167. (L3 [P]) Реализовать trace pipeline: write time → fsync enqueue → fsync done → client ack

     **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


168. (L3 [P]) Реализовать kill -9 / crash harness для WAL durability test

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


169. (L3 [P]) Реализовать adaptive batching по observed fsync latency

     **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


170. (L3 [P]) Реализовать benchmark для ext4/xfs/tmpfs-подобных режимов с одинаковым workload

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


171. (L3 [D]) Как доказать, что bottleneck в fsync, а не в mutex вокруг WAL?

     **Ответ:** Измерить время write и sync раздельно, pending dirty bytes, flush queue и device errors. Проверить фактические syscalls/ordering, filesystem/mount/device cache и виртуализированный storage; page cache способен скрывать отсутствие durability.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


172. (L3 [D]) Почему group commit улучшил throughput, но ухудшил fairness между клиентами?

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput. Измерить batch size, queue wait, flush duration и p99 commit; отличить batching delay от storage stalls. Проверить что waiter не просыпается по written LSN вместо durable LSN и не теряет wakeup.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


173. (L3 [D]) Как расследовать ложное чувство durability в облачной среде?

     **Ответ:** Измерить время write и sync раздельно, pending dirty bytes, flush queue и device errors. Проверить фактические syscalls/ordering, filesystem/mount/device cache и виртуализированный storage; page cache способен скрывать отсутствие durability.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


174. (L3 [D]) Почему latency spike совпадает с background writeback, а не с foreground writes?

     **Ответ:** Buffered writes создают dirty pages и позже background writeback; при превышении порогов writer может быть throttled. Быстрый write benchmark до накопления dirty debt измеряет RAM buffering, а не устойчивую скорость диска. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Измерить время write и sync раздельно, pending dirty bytes, flush queue и device errors. Проверить фактические syscalls/ordering, filesystem/mount/device cache и виртуализированный storage; page cache способен скрывать отсутствие durability.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


175. (L3 [D]) Как отличить filesystem-induced fsync stalls от device-level stalls?

     **Ответ:** Измерить время write и sync раздельно, pending dirty bytes, flush queue и device errors. Проверить фактические syscalls/ordering, filesystem/mount/device cache и виртуализированный storage; page cache способен скрывать отсутствие durability.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


176. (L4 [S]) Когда допустимо ослабить fsync policy ради latency?

     **Ответ:** Задать ACK durability и RPO, применять group commit без раннего ACK либо явно разрешённый periodic sync. sync_file_range и O_DIRECT не являются заменой fsync для гарантии power-loss persistence.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


177. (L4 [S]) Как выбирать commit durability tiers для разных классов данных?

     **Ответ:** Задать ACK durability и RPO, применять group commit без раннего ACK либо явно разрешённый periodic sync. sync_file_range и O_DIRECT не являются заменой fsync для гарантии power-loss persistence.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


178. (L4 [S]) Как проектировать storage engine так, чтобы fsync не был единственной глобальной точкой боли?

     **Ответ:** Задать ACK durability и RPO, применять group commit без раннего ACK либо явно разрешённый periodic sync. sync_file_range и O_DIRECT не являются заменой fsync для гарантии power-loss persistence.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


179. (L4 [S]) Как объяснять продуктовым командам цену “синхронной durability”?

     **Ответ:** Задать ACK durability и RPO, применять group commit без раннего ACK либо явно разрешённый periodic sync. sync_file_range и O_DIRECT не являются заменой fsync для гарантии power-loss persistence.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


180. (L4 [S]) Как строить rollout/validation стратегии для изменений в flush policy?

     **Ответ:** Validation проверяет completeness и values/invariants на согласованной boundary; равное число строк не исключает разные значения/дубликаты. Comparisons учитывают versions, concurrent writes и canonical encoding, а failures требуют repair/retry protocol.

     **Рекомендация:** Задать ACK durability и RPO, применять group commit без раннего ACK либо явно разрешённый periodic sync. sync_file_range и O_DIRECT не являются заменой fsync для гарантии power-loss persistence.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


---

## 🔹 Page cache

181. (L1 [T]) Что такое page cache в Linux?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


182. (L1 [T]) Зачем операционная система кэширует файловые страницы?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


183. (L1 [T]) Как page cache ускоряет reads?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


184. (L1 [T]) Как page cache влияет на writes?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


185. (L1 [T]) Почему page cache не равен buffer pool БД?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Чтение сразу после write может вернуть данные из page cache, хотя они ещё не устойчивы на storage. Даже restart процесса сохраняет kernel cache; durability проверяется sync/ordering и нужной моделью отказа носителя.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


186. (L1 [T]) Что такое cache hit и cache miss?

     **Ответ:** Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого.

     **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)


187. (L1 [T]) Почему page cache может маскировать настоящую стоимость I/O?

     **Ответ:** Чтение сразу после write может вернуть данные из page cache, хотя они ещё не устойчивы на storage. Даже restart процесса сохраняет kernel cache; durability проверяется sync/ordering и нужной моделью отказа носителя.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


188. (L1 [T]) Что такое dirty page в page cache?

     **Ответ:** Dirty page изменена в памяти и ещё не приведена к устойчивому backing state. Для DB pages нужен WAL-before-data, для OS cache — writeback/sync по контракту; один dirty flag не содержит всего recovery protocol.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


189. (L1 [T]) Почему после reboot/page cache drop benchmark меняется радикально?

     **Ответ:** Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


190. (L1 [T]) Почему большая RAM может скрыть проблемы storage layout?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


191. (L1 [P]) Измерить “cold cache” и “warm cache” чтение одного и того же файла

     **Ответ:** Сравнить buffered read/pread и mmap на одинаковых файлах/working set; измерить minor/major faults, RSS/cache и физические bytes. Удерживать lifetime mapping/views, избегать некорректного смешивания overlapping direct/buffered writes.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


192. (L1 [P]) Реализовать benchmark page cache hit/miss

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


193. (L1 [P]) Сравнить buffered read и повторный buffered read

     **Ответ:** Сравнить buffered read/pread и mmap на одинаковых файлах/working set; измерить minor/major faults, RSS/cache и физические bytes. Удерживать lifetime mapping/views, избегать некорректного смешивания overlapping direct/buffered writes.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


194. (L1 [P]) Реализовать scan большого файла и измерить page cache effect

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


195. (L1 [P]) Реализовать тест write→read через page cache без fsync

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


196. (L2 [T]) Как page cache взаимодействует с readahead?

     **Ответ:** Readahead заранее подтягивает ожидаемые страницы последовательного файла. Random/sparse доступ, лишние reads и cache pollution способны уменьшить пользу; сравнить physical bytes, faults и полезную latency.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


197. (L2 [T]) Почему double caching (page cache + DB buffer pool) может быть дорогим?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


198. (L2 [T]) Почему mmap обычно использует page cache?

     **Ответ:** mmap даёт memory view файла, но обращения могут вызывать page faults, а MAP_SHARED не делает update crash-atomic. Pointer/view обязан жить не дольше mapping/file generation, внешние offsets и lengths проверяются.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html)


199. (L2 [T]) Как eviction policy page cache влияет на workload БД?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


200. (L2 [T]) Почему large scans могут вытеснить hot working set?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


201. (L2 [T]) Что такое page cache thrashing?

     **Ответ:** Control loop без hysteresis/cooldown может многократно переносить данные/ресурсы между решениями. Использовать стабильное окно, разные пороги входа/выхода и budget изменений; учитывать delayed metrics и стоимость прогрева.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


202. (L2 [T]) Почему page cache writeback может создавать latency spikes?

     **Ответ:** Buffered writes создают dirty pages и позже background writeback; при превышении порогов writer может быть throttled. Быстрый write benchmark до накопления dirty debt измеряет RAM buffering, а не устойчивую скорость диска. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


203. (L2 [T]) Как memory pressure влияет на storage latency через page cache?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


204. (L2 [T]) Почему page cache complicates benchmarking?

     **Ответ:** Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


205. (L2 [T]) Когда page cache помогает БД, а когда мешает?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


206. (L2 [P]) Реализовать benchmark влияния sequential scan на hot random reads

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


207. (L2 [P]) Сравнить mmap и pread на warm cache

     **Ответ:** Отобразить проверенный размер файла, использовать offsets и checked spans вместо persisted pointers, удерживать mapping lifetime. MAP_SHARED updates требуют explicit crash-safe protocol/sync, а fault benchmark различает minor/major и cold/warm working set.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


208. (L2 [P]) Реализовать synthetic double-caching workload

     **Ответ:** Сравнить buffered read/pread и mmap на одинаковых файлах/working set; измерить minor/major faults, RSS/cache и физические bytes. Удерживать lifetime mapping/views, избегать некорректного смешивания overlapping direct/buffered writes.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


209. (L2 [P]) Реализовать measurement hot-set vs cold-set in cache

     **Ответ:** Сравнить buffered read/pread и mmap на одинаковых файлах/working set; измерить minor/major faults, RSS/cache и физические bytes. Удерживать lifetime mapping/views, избегать некорректного смешивания overlapping direct/buffered writes.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


210. (L2 [P]) Реализовать trace cache hit ratio before/after large scan

     **Ответ:** Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого. Сравнить buffered read/pread и mmap на одинаковых файлах/working set; измерить minor/major faults, RSS/cache и физические bytes. Удерживать lifetime mapping/views, избегать некорректного смешивания overlapping direct/buffered writes.

     **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


211. (L2 [D]) Почему после большого аналитического запроса OLTP latency выросла?

     **Ответ:** Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


212. (L2 [D]) Почему тесты на dev-машине “быстрые”, а в cold production — медленные?

     **Ответ:** Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


213. (L2 [D]) Почему reads почти не идут на диск, но p99 всё равно плохой?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


214. (L2 [D]) Почему после роста RAM performance почти не изменилась?

     **Ответ:** Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


215. (L2 [D]) Почему page cache помогает одному workload и ломает другой?

     **Ответ:** Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


216. (L3 [T]) Как Linux page cache и DB buffer pool конкурируют за память?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


217. (L3 [T]) Почему page cache может скрывать fragmentation/random I/O проблемы?

     **Ответ:** Fragmentation может означать holes внутри page, разнесённые extents или allocator slack — сначала назвать слой. Live bytes, allocated file size и RSS измеряют разное; compaction/rebuild не всегда возвращает место ОС немедленно.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


218. (L3 [T]) Как madvise/fadvise/readahead hints влияют на page cache behavior?

     **Ответ:** Readahead заранее подтягивает ожидаемые страницы последовательного файла. Random/sparse доступ, лишние reads и cache pollution способны уменьшить пользу; сравнить physical bytes, faults и полезную latency.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


219. (L3 [T]) Почему mmap page faults — это часть I/O path, а не просто memory access?

     **Ответ:** mmap даёт memory view файла, но обращения могут вызывать page faults, а MAP_SHARED не делает update crash-atomic. Pointer/view обязан жить не дольше mapping/file generation, внешние offsets и lengths проверяются. Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


220. (L3 [T]) Как writeback threads и dirty_ratio/dirty_background_ratio влияют на latency?

     **Ответ:** Buffered writes создают dirty pages и позже background writeback; при превышении порогов writer может быть throttled. Быстрый write benchmark до накопления dirty debt измеряет RAM buffering, а не устойчивую скорость диска.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


221. (L3 [T]) Почему page cache complicates durability reasoning?

     **Ответ:** Чтение сразу после write может вернуть данные из page cache, хотя они ещё не устойчивы на storage. Даже restart процесса сохраняет kernel cache; durability проверяется sync/ordering и нужной моделью отказа носителя.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


222. (L3 [T]) Как NUMA affects page cache access cost?

     **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)


223. (L3 [T]) Почему measuring disk throughput без отделения cache effects бесполезно?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


224. (L3 [T]) Как page cache взаимодействует с direct I/O and O_DIRECT workloads?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


225. (L3 [T]) Когда storage engine должен consciously bypass page cache?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


226. (L3 [P]) Реализовать benchmark с controlled cold/warm cache phases

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


227. (L3 [P]) Реализовать cache pollution test: scan vs point lookups

     **Ответ:** Сравнить buffered read/pread и mmap на одинаковых файлах/working set; измерить minor/major faults, RSS/cache и физические bytes. Удерживать lifetime mapping/views, избегать некорректного смешивания overlapping direct/buffered writes.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


228. (L3 [P]) Реализовать trace page faults + latency correlation

     **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные. Minor fault устанавливает/меняет mapping без обязательного disk read, major обычно требует I/O. Рост faults может быть cold mapping, CoW, reclaim/pressure; mmap не делает working set бесплатным и всегда резидентным. Сравнить buffered read/pread и mmap на одинаковых файлах/working set; измерить minor/major faults, RSS/cache и физические bytes. Удерживать lifetime mapping/views, избегать некорректного смешивания overlapping direct/buffered writes.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


229. (L3 [P]) Реализовать experiment: mmap + madvise vs pread

     **Ответ:** Отобразить проверенный размер файла, использовать offsets и checked spans вместо persisted pointers, удерживать mapping lifetime. MAP_SHARED updates требуют explicit crash-safe protocol/sync, а fault benchmark различает minor/major и cold/warm working set.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


230. (L3 [P]) Реализовать working-set estimator для buffer pool vs page cache competition

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


231. (L3 [D]) Как доказать, что проблема в page cache thrashing, а не в SSD?

     **Ответ:** Control loop без hysteresis/cooldown может многократно переносить данные/ресурсы между решениями. Использовать стабильное окно, разные пороги входа/выхода и budget изменений; учитывать delayed metrics и стоимость прогрева. Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


232. (L3 [D]) Почему after switching to mmap memory usage and latency became unpredictable?

     **Ответ:** mmap даёт memory view файла, но обращения могут вызывать page faults, а MAP_SHARED не делает update crash-atomic. Pointer/view обязан жить не дольше mapping/file generation, внешние offsets и lengths проверяются. Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


233. (L3 [D]) Как расследовать spikes из-за background writeback?

     **Ответ:** Buffered writes создают dirty pages и позже background writeback; при превышении порогов writer может быть throttled. Быстрый write benchmark до накопления dirty debt измеряет RAM buffering, а не устойчивую скорость диска. Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html)


234. (L3 [D]) Почему buffer pool tuning не помог, потому что bottleneck был в page cache?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


235. (L3 [D]) Как отличить cache hit CPU overhead от настоящего device I/O latency?

     **Ответ:** Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого. Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


236. (L4 [S]) Когда БД должна полагаться на page cache, а когда строить свой buffer pool?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Рекомендация:** Выбирать OS-managed cache или собственный pool по управляемости, predictability и двойному caching. Учитывать readahead, cgroups, NUMA, dirty throttling и отказ фонового flush, а не только microbenchmark hit latency.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


237. (L4 [S]) Как проектировать memory budget между cache layers?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Рекомендация:** Выбирать OS-managed cache или собственный pool по управляемости, predictability и двойному caching. Учитывать readahead, cgroups, NUMA, dirty throttling и отказ фонового flush, а не только microbenchmark hit latency.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


238. (L4 [S]) Когда стоит использовать mmap-heavy design, а когда explicit IO path?

     **Ответ:** mmap даёт memory view файла, но обращения могут вызывать page faults, а MAP_SHARED не делает update crash-atomic. Pointer/view обязан жить не дольше mapping/file generation, внешние offsets и lengths проверяются.

     **Рекомендация:** Выбирать OS-managed cache или собственный pool по управляемости, predictability и двойному caching. Учитывать readahead, cgroups, NUMA, dirty throttling и отказ фонового flush, а не только microbenchmark hit latency.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


239. (L4 [S]) Как строить benchmarking methodology, не обманываемую page cache?

     **Ответ:** Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission.

     **Рекомендация:** Принимать решение по репрезентативным workload classes и SLO, а не одному synthetic score. Для storage отдельно зафиксировать fsync/power-loss режим, fill level, device steady state и фоновые costs.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


240. (L4 [S]) Как объяснять команде, что “всё в памяти” не означает “проблем с I/O больше нет”?

     **Ответ:** Выбирать OS-managed cache или собственный pool по управляемости, predictability и двойному caching. Учитывать readahead, cgroups, NUMA, dirty throttling и отказ фонового flush, а не только microbenchmark hit latency.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


---

## 🔹 Direct I/O

241. (L1 [T]) Что такое Direct I/O?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


242. (L1 [T]) Чем O_DIRECT отличается от обычного buffered I/O?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


243. (L1 [T]) Почему Direct I/O часто используют БД?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


244. (L1 [T]) Что значит “обход page cache”?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


245. (L1 [T]) Почему alignment важен для Direct I/O?

     **Ответ:** Alignment влияет на допустимость и стоимость loads, пересечение lines/pages и SIMD. Over-aligned buffer требует подходящего allocator; больше padding не всегда лучше из-за footprint/cache pressure.

     **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


246. (L1 [T]) Почему Direct I/O не означает автоматически более высокую производительность?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


247. (L1 [T]) Почему Direct I/O часто сложнее в реализации?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


248. (L1 [T]) Что происходит с caching, если приложение использует Direct I/O?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


249. (L1 [T]) Почему Direct I/O полезен для собственного buffer pool?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


250. (L1 [T]) Какие типичные ограничения у O_DIRECT на Linux?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


251. (L1 [P]) Открыть файл с O_DIRECT и выполнить aligned read

     **Ответ:** Узнать filesystem/device alignment constraints, использовать aligned buffers/offsets/lengths и обработать short I/O/errors. Async buffers/FD живут до completion; проверить actual direct path и отдельно выполнить требуемый durability barrier.

     **Типичная ошибка:** Сравнивать direct и buffered benchmarks с разной durability и cache state.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


252. (L1 [P]) Выделить aligned buffer через posix_memalign

     **Ответ:** Alignment влияет на допустимость и стоимость loads, пересечение lines/pages и SIMD. Over-aligned buffer требует подходящего allocator; больше padding не всегда лучше из-за footprint/cache pressure. Узнать поддерживаемые alignment/offset/length constraints, выделить aligned buffer и обрабатывать short I/O/errors. Сравнить с buffered path; для durability выполнить нужный sync, не освобождать buffer до async completion.

     **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


253. (L1 [P]) Сравнить buffered vs direct read latency

     **Ответ:** Узнать поддерживаемые alignment/offset/length constraints, выделить aligned buffer и обрабатывать short I/O/errors. Сравнить с buffered path; для durability выполнить нужный sync, не освобождать buffer до async completion.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


254. (L1 [P]) Сравнить buffered vs direct write throughput

     **Ответ:** Узнать поддерживаемые alignment/offset/length constraints, выделить aligned buffer и обрабатывать short I/O/errors. Сравнить с buffered path; для durability выполнить нужный sync, не освобождать buffer до async completion.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


255. (L1 [P]) Реализовать простой page reader с O_DIRECT

     **Ответ:** Узнать filesystem/device alignment constraints, использовать aligned buffers/offsets/lengths и обработать short I/O/errors. Async buffers/FD живут до completion; проверить actual direct path и отдельно выполнить требуемый durability barrier.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


256. (L2 [T]) Почему small unaligned I/O особенно плох для Direct I/O?

     **Ответ:** Alignment влияет на допустимость и стоимость loads, пересечение lines/pages и SIMD. Over-aligned buffer требует подходящего allocator; больше padding не всегда лучше из-за footprint/cache pressure.

     **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


257. (L2 [T]) Когда buffered I/O выигрывает у Direct I/O?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


258. (L2 [T]) Почему Direct I/O убирает double caching, но не убирает все bottlenecks?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


259. (L2 [T]) Как Direct I/O влияет на readahead/prefetch semantics?

     **Ответ:** Readahead заранее подтягивает ожидаемые страницы последовательного файла. Random/sparse доступ, лишние reads и cache pollution способны уменьшить пользу; сравнить physical bytes, faults и полезную latency. Prefetch полезен, если адрес известен достаточно заранее и есть bandwidth/cache capacity. Pointer dependency, случайные accesses, неверная distance и cache pollution могут убрать выигрыш; сравнивать physical bytes и stalled cycles.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


260. (L2 [T]) Почему Direct I/O требует своего scheduling и buffering в userspace?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


261. (L2 [T]) Почему WAL и data files могут использовать разные I/O modes?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


262. (L2 [T]) Как Direct I/O взаимодействует с fsync/fdatasync?

     **Ответ:** fsync синхронизирует данные и нужную file metadata, fdatasync может пропустить metadata, не нужную для чтения содержимого. Создание/rename требует отдельно учитывать durability parent directory; проверить return errors обязательно.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


263. (L2 [T]) Почему Direct I/O может улучшить predictability p99?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


264. (L2 [T]) Почему throughput с O_DIRECT может быть ниже на маленьких блоках?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


265. (L2 [T]) Что такое async direct I/O и зачем он нужен?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


266. (L2 [P]) Реализовать aligned page cache-less reader

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


267. (L2 [P]) Реализовать simple user-space readahead для O_DIRECT

     **Ответ:** Узнать filesystem/device alignment constraints, использовать aligned buffers/offsets/lengths и обработать short I/O/errors. Async buffers/FD живут до completion; проверить actual direct path и отдельно выполнить требуемый durability barrier.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


268. (L2 [P]) Реализовать write batching поверх Direct I/O

     **Ответ:** Узнать filesystem/device alignment constraints, использовать aligned buffers/offsets/lengths и обработать short I/O/errors. Async buffers/FD живут до completion; проверить actual direct path и отдельно выполнить требуемый durability barrier.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


269. (L2 [P]) Сравнить O_DIRECT и mmap/pread на point lookups

     **Ответ:** Узнать filesystem/device alignment constraints, использовать aligned buffers/offsets/lengths и обработать short I/O/errors. Async buffers/FD живут до completion; проверить actual direct path и отдельно выполнить требуемый durability barrier.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


270. (L2 [P]) Реализовать benchmark влияния alignment и block size

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


271. (L2 [D]) Почему переход на O_DIRECT не ускорил БД?

     **Ответ:** Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Типичная ошибка:** Сравнивать direct и buffered benchmarks с разной durability и cache state.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


272. (L2 [D]) Почему p99 стал лучше, а average throughput хуже?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


273. (L2 [D]) Почему часть reads внезапно начала падать с EINVAL?

     **Ответ:** Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


274. (L2 [D]) Почему after O_DIRECT CPU usage вырос?

     **Ответ:** Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


275. (L2 [D]) Почему Direct I/O ломает прежние предположения о warm cache?

     **Ответ:** Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


276. (L3 [T]) Как проектировать собственный buffer pool при Direct I/O?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


277. (L3 [T]) Как alignment, huge pages и page size ОС влияют на Direct I/O path?

     **Ответ:** DB page size не обязан равняться OS page size или device sector. Выбор влияет на fanout, amplification, buffer occupancy и torn-write handling; типичный PostgreSQL block — 8 KiB при обычном build, Linux page часто 4 KiB. TLB кэширует translations, и большой случайный working set повышает translation misses/page walks. Huge pages увеличивают охват TLB, но требуют оценки fragmentation, allocation stalls и реального выигрыша.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


278. (L3 [T]) Как io_uring сочетается с O_DIRECT?

     **Ответ:** Async completion означает завершение указанной операции, а не автоматически durable persistence. Buffer/FD должны жить до нужного completion, short I/O/errors/cancellation обрабатываются явно; flush/barrier семантика задаётся отдельно.

     **Источник:** [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


279. (L3 [T]) Почему O_DIRECT уменьшает cache pollution, но требует больше userspace complexity?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


280. (L3 [T]) Как Direct I/O влияет на observability и benchmarking?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


281. (L3 [T]) Почему mixed buffered + direct access к одним и тем же файлам опасен?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


282. (L3 [T]) Как проектировать prefetch, eviction и batching без помощи page cache?

     **Ответ:** Prefetch полезен, если адрес известен достаточно заранее и есть bandwidth/cache capacity. Pointer dependency, случайные accesses, неверная distance и cache pollution могут убрать выигрыш; сравнивать physical bytes и stalled cycles.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


283. (L3 [T]) Как Direct I/O взаимодействует с filesystem journaling и metadata updates?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


284. (L3 [T]) Когда Direct I/O особенно полезен для LSM compaction или large scans?

     **Ответ:** O_DIRECT обычно обходит page cache для данных и предъявляет filesystem/device-specific alignment constraints. Не означает автоматическую долговечность: write completion и durable persistence — разные события.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


285. (L3 [T]) Почему Direct I/O не отменяет необходимости продуманного memory allocator и IO scheduler в приложении?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Allocator overhead включает bookkeeping, contention и удержание arenas. Arena/slab подходят при известных size/lifetime, но требуют alignment/ownership и bounded capacity; RSS без live allocation analysis не доказывает leak.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


286. (L3 [P]) Реализовать mini buffer pool поверх O_DIRECT

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


287. (L3 [P]) Реализовать async O_DIRECT read queue

     **Ответ:** Узнать filesystem/device alignment constraints, использовать aligned buffers/offsets/lengths и обработать short I/O/errors. Async buffers/FD живут до completion; проверить actual direct path и отдельно выполнить требуемый durability barrier.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


288. (L3 [P]) Реализовать benchmark для buffered vs direct на mixed workload

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


289. (L3 [P]) Реализовать adaptive prefetcher для O_DIRECT scans

     **Ответ:** Узнать filesystem/device alignment constraints, использовать aligned buffers/offsets/lengths и обработать short I/O/errors. Async buffers/FD живут до completion; проверить actual direct path и отдельно выполнить требуемый durability barrier.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


290. (L3 [P]) Реализовать tracing: submit → complete → copy/parse latency per request

     **Ответ:** Узнать поддерживаемые alignment/offset/length constraints, выделить aligned buffer и обрабатывать short I/O/errors. Сравнить с buffered path; для durability выполнить нужный sync, не освобождать buffer до async completion.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


291. (L3 [D]) Как доказать, что bottleneck после O_DIRECT — userspace buffering, а не диск?

     **Ответ:** Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


292. (L3 [D]) Почему direct path улучшил OLTP, но ухудшил analytics scans?

     **Ответ:** Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


293. (L3 [D]) Как расследовать interaction bugs between O_DIRECT and fallback buffered path?

     **Ответ:** Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


294. (L3 [D]) Почему after enabling O_DIRECT memory pressure decreased, but latency remained high?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


295. (L3 [D]) Как отличить device bottleneck от alignment-induced inefficiency?

     **Ответ:** Alignment влияет на допустимость и стоимость loads, пересечение lines/pages и SIMD. Over-aligned buffer требует подходящего allocator; больше padding не всегда лучше из-за footprint/cache pressure. Проверить EINVAL/fallback, реальный I/O path, alignment и request sizes; собрать queue depth/completion latency. Отделить cache эффект от async/parallelism и убедиться, что benchmark сравнивает равную durability.

     **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


296. (L4 [S]) Когда имеет смысл переходить на Direct I/O?

     **Ответ:** Полезен при собственном buffer pool и необходимости управлять cache/I/O, но повышает сложность. Выбирать вместе с async backend, filesystem и recovery; не включать как универсальную кнопку ускорения.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


297. (L4 [S]) Как выбирать между buffered I/O, mmap и O_DIRECT для разных компонентов БД?

     **Ответ:** mmap даёт memory view файла, но обращения могут вызывать page faults, а MAP_SHARED не делает update crash-atomic. Pointer/view обязан жить не дольше mapping/file generation, внешние offsets и lengths проверяются.

     **Рекомендация:** Полезен при собственном buffer pool и необходимости управлять cache/I/O, но повышает сложность. Выбирать вместе с async backend, filesystem и recovery; не включать как универсальную кнопку ускорения.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


298. (L4 [S]) Как проектировать storage engine, который может переключаться между I/O modes?

     **Ответ:** Полезен при собственном buffer pool и необходимости управлять cache/I/O, но повышает сложность. Выбирать вместе с async backend, filesystem и recovery; не включать как универсальную кнопку ускорения.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


299. (L4 [S]) Как объяснять команде, что O_DIRECT — это архитектурное решение, а не тюнинг-флажок?

     **Ответ:** Полезен при собственном buffer pool и необходимости управлять cache/I/O, но повышает сложность. Выбирать вместе с async backend, filesystem и recovery; не включать как универсальную кнопку ускорения.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


300. (L4 [S]) Как строить rollout и validation strategy для перехода на Direct I/O в production?

     **Ответ:** Validation проверяет completeness и values/invariants на согласованной boundary; равное число строк не исключает разные значения/дубликаты. Comparisons учитывают versions, concurrent writes и canonical encoding, а failures требуют repair/retry protocol.

     **Рекомендация:** Полезен при собственном buffer pool и необходимости управлять cache/I/O, но повышает сложность. Выбирать вместе с async backend, filesystem и recovery; не включать как универсальную кнопку ускорения.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html)


---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Как HDD vs SSD влияет на выбор между buffered I/O и Direct I/O?

     **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


302. (L2 [T]) Почему fsync, page cache и Direct I/O нельзя обсуждать по отдельности?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


303. (L2 [T]) Как sequential/random access patterns влияют на storage engine design?

     **Ответ:** HDD ограничен механическими seek/rotation, SSD/NVMe — IOPS/bandwidth, controller/queueing, flash write amplification и endurance. Носитель не отменяет требования к ordering/flush и честности power-loss guarantees.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


304. (L2 [T]) Почему page cache может скрыть проблемы random I/O на тестах?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


305. (L2 [T]) Как WAL path и data read path могут требовать разных I/O стратегий?

     **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

     **Пример:** pageLSN=120 нельзя flush как durable page, пока durable WAL LSN меньше 120.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


306. (L2 [T]) Почему tail latency storage subsystem часто определяется не bandwidth, а flush/cache/writeback behavior?

     **Ответ:** Buffered writes создают dirty pages и позже background writeback; при превышении порогов writer может быть throttled. Быстрый write benchmark до накопления dirty debt измеряет RAM buffering, а не устойчивую скорость диска. IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


307. (L2 [T]) Как allocator, memcpy, checksum и compression внезапно становятся “I/O bottleneck”, хотя диск свободен?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


308. (L2 [T]) Почему benchmarking storage без контроля cache, alignment и concurrency почти бесполезен?

     **Ответ:** Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission. Alignment влияет на допустимость и стоимость loads, пересечение lines/pages и SIMD. Over-aligned buffer требует подходящего allocator; больше padding не всегда лучше из-за footprint/cache pressure.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [C++ working draft: Library](https://eel.is/c++draft/library); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


309. (L2 [T]) Как NUMA, CPU pinning и PCIe topology влияют на seemingly pure disk benchmarks?

     **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality. Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


310. (L2 [T]) Почему most real production incidents — это комбинация page cache + fsync + background IO + access pattern?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


311. (L2 [P]) Реализовать end-to-end benchmark: WAL append + fsync + random reads + scan

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


312. (L2 [P]) Реализовать dashboard: IOPS, bandwidth, avg/p99 latency, dirty pages, cache hit ratio

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


313. (L2 [P]) Реализовать chaos test: memory pressure + background writeback + foreground reads

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


314. (L2 [P]) Реализовать synthetic DB-like workload: B-Tree random IO vs LSM sequential flush/compaction

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Типичная ошибка:** Удалять tombstone, пока старая версия может сохраниться вне compaction inputs или в живом snapshot.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


315. (L2 [P]) Реализовать trace pipeline: app submit → syscall → page cache/direct path → device complete

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


316. (L3 [D]) Почему после перехода на SSD p50 улучшился, а p99 почти не изменился?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


317. (L3 [D]) Почему disk util низкий, но БД медленная?

     **Ответ:** Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


318. (L3 [D]) Как доказать, что bottleneck в page cache/writeback, а не в устройстве?

     **Ответ:** Buffered writes создают dirty pages и позже background writeback; при превышении порогов writer может быть throttled. Быстрый write benchmark до накопления dirty debt измеряет RAM buffering, а не устойчивую скорость диска. Проверить memory pressure, reclaim, dirty/writeback, faults и working set против RAM. Отличить OS cache от buffer pool; cold/warm runs и конкурентный scan выявляют eviction/cache pollution.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html)


319. (L3 [D]) Почему одна и та же система стабильна на synthetic benchmark и нестабильна в production?

     **Ответ:** Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission. Проверить исключённый setup, compiler dead-code removal, coordinated omission, cache/durability differences и saturation самого генератора. Повторить baseline и изменение на одинаковой конфигурации с проверкой полезного результата.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


320. (L3 [D]) Как расследовать инцидент “данные не потерялись, но storage latency стала непредсказуемой”?

     **Ответ:** Сопоставить latency distribution, queue depth, IOPS/bytes, device errors/thermal throttling и application waits. Utilization 100% на разных устройствах имеет разную интерпретацию; измерять предел при нужном SLO.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


321. (L4 [S]) Как выбирать I/O strategy для новой БД: buffered, mmap, O_DIRECT, hybrid?

     **Ответ:** mmap даёт memory view файла, но обращения могут вызывать page faults, а MAP_SHARED не делает update crash-atomic. Pointer/view обязан жить не дольше mapping/file generation, внешние offsets и lengths проверяются.

     **Рекомендация:** Выбирать носитель по устойчивой нагрузке, p99, capacity/endurance и power-loss protection. Разделить логическую durability от маркетинговой скорости NVMe, спланировать запас и отказ/restore.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


322. (L4 [S]) Какие anti-patterns в disk/I/O layer чаще всего приводят к painful production incidents?

     **Ответ:** Выбирать носитель по устойчивой нагрузке, p99, capacity/endurance и power-loss protection. Разделить логическую durability от маркетинговой скорости NVMe, спланировать запас и отказ/restore.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


323. (L4 [S]) Как строить observability storage path с первого дня?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


324. (L4 [S]) Как проектировать storage subsystem под SSD/NVMe, не забывая про portability и correctness?

     **Ответ:** Выбирать носитель по устойчивой нагрузке, p99, capacity/endurance и power-loss protection. Разделить логическую durability от маркетинговой скорости NVMe, спланировать запас и отказ/restore.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


325. (L4 [S]) Как объяснить команде, что “диски и I/O” — это не про syscalls, а про end-to-end latency model?

     **Ответ:** Выбирать носитель по устойчивой нагрузке, p99, capacity/endurance и power-loss protection. Разделить логическую durability от маркетинговой скорости NVMe, спланировать запас и отказ/restore.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


---
