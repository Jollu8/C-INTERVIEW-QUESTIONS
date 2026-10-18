# Архитектура компьютеров и взаимодействие с устройствами

План раздела. Сначала используйте существующие вопросы C++ Low level, Performance и Linux; новые вопросы добавляйте после проверки пересечений.

| Этап | Темы | Практическая проверка |
| --- | --- | --- |
| CPU | ISA и микроархитектура, x86-64/ARM, registers, pipeline, branch prediction, out-of-order execution | Изучить дизассемблирование функции; связать инструкции с исходником |
| Иерархия памяти | Cache lines, locality, associativity, TLB, page faults, prefetching | Измерить обход массива и объяснить зависимость от размера |
| Многоядерность | Cache coherence, consistency, false sharing, NUMA | Сравнить размещение счётчиков и привязку потоков |
| Векторизация | SIMD, alignment, aliasing, AoS/SoA, compiler reports | Проверить автовекторизацию и сравнить корректность и скорость |
| Устройства | PCIe, MMIO, DMA, IOMMU, interrupts, polling | Разобрать путь передачи буфера по документации; различать CPU atomics и device barriers |
| Системное ПО | ABI, calling conventions, ELF, kernel/user space, драйверный lifecycle | Проследить вызов от приложения до системного интерфейса |

Уже есть: [Low level](../01_cpp/13_low_level.md), [Performance](../01_cpp/15_performance.md), [Linux advanced](../04_system_linux/08_advanced.md).

Чтение: [CS:APP](https://csapp.cs.cmu.edu/3e/), [CMU 15-418](https://www.cs.cmu.edu/~418/), [документация ядра Linux](https://docs.kernel.org/). Уточняйте архитектуру и ОС: гарантии C++ не заменяют платформенные правила доступа к устройствам.
