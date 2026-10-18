# GPU и параллельные вычисления

План раздела. Готовой базы вопросов CUDA пока нет. Предварительные знания: C++, lifetime, конкурентность, архитектура памяти, линейная алгебра и floating point.

| Этап | Темы | Практика |
| --- | --- | --- |
| Модель исполнения | Host/device, kernels, grid, blocks, threads, SM, warps, SIMT | Vector addition с проверкой размеров и ошибок API |
| Память | Global/shared/registers, coalescing, bank conflicts, transfers | Transpose с тестами для некратных размеров |
| Синхронизация | Barriers, atomics, streams, events, зависимости | Проверить границы синхронизации и зависимости pipeline |
| Алгоритмы | Reduction, scan, histogram, matrix multiplication | Сравнить с CPU и библиотечной реализацией, задать численные допуски |
| Производительность | Timing, warm-up, asynchronous execution, bandwidth, occupancy, divergence, roofline | Раздельно измерить kernel и end-to-end; объяснить bottleneck |
| Инструменты и библиотеки | Compute Sanitizer, Nsight Systems/Compute, cuBLAS, cuFFT | Найти ошибку памяти и подтвердить оптимизацию профилем |

Чтение по порядку: [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/index.html), затем [CUDA Best Practices Guide](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html). Версии toolkit, GPU и поддерживаемые возможности фиксируйте в каждом эксперименте.

Для оборудования других производителей модель и инструменты могут отличаться. Раздел должен явно отделять общие принципы параллелизма от особенностей CUDA.
