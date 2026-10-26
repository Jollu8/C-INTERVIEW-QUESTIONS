# GPU и параллельные вычисления

В разделе 16 тем и 384 подробных вопроса и задания без готовых ответов. Маршрут ведёт от устройства GPU и первого kernel до параллельных алгоритмов, библиотек, профилирования, нескольких GPU и интеграции в приложение. Основная практическая платформа — CUDA C++ на NVIDIA GPU; общие принципы параллелизма и особенности конкретного API рассматриваются отдельно.

## Предварительные знания и порядок изучения

Нужны массивы, указатели, время жизни объектов и владение ресурсами в C++, базовые представления о потоках и синхронизации, целочисленной и floating-point арифметике. Для матричных задач понадобятся размеры матриц и умножение, для FFT — комплексные числа и основы преобразования Фурье. Память и параллельное выполнение на CPU можно повторить в [архитектуре компьютеров](../12_computer_architecture/README.md), численные основы — в [математике](../11_math/README.md).

Проходите темы 1–3 до первого корректного kernel, затем память и синхронизацию в темах 4–8. Темы 9–12 посвящены алгоритмам и библиотечным решениям. Измерения из темы 13 и проверки из темы 14 используйте с первого эксперимента; несколько GPU и сложную интеграцию разбирайте после устойчивой версии для одного GPU.

В каждой теме 24 вопроса: по 8 на каждом из трёх уровней.

| Уровень | Что требуется от ответа | Критерий перехода |
| --- | --- | --- |
| Лёгкий | Объяснить понятие, показать размещение данных или работу потоков на маленьком примере | Различаете программную модель, аппаратные ресурсы и задачи CPU и GPU |
| Средний | Проследить обращения и зависимости, выполнить расчёт, выбрать реализацию под заданные условия | Можете объяснить корректность, обработать границы и проверить гипотезу измерением |
| Сложный | Спроектировать алгоритм или pipeline, разобрать ограничения, подтвердить оптимизацию | Можете сравнить решения на одинаковой задаче и обосновать область применимости результата |

Сначала сформулируйте собственный ответ и схему исполнения. Если возникают пробелы, найдите конкретный раздел документации и вернитесь к вопросу. Не переходите к ускорению, пока не проверены результат, границы доступа, зависимости и время жизни буферов. Для floating point заранее определите допустимую ошибку и требование к воспроизводимости.

## Темы и вопросы

| Тема | Что охватывает | Вопросов |
| --- | --- | ---: |
| [1. Архитектура GPU и модель исполнения](./01_gpu_architecture.md) | Host/device, SM, warps, SIMT, divergence, latency hiding | 24 |
| [2. CUDA: окружение, сборка и совместимость](./02_cuda_toolchain.md) | Driver/runtime/toolkit, nvcc, PTX/SASS, compute capability, ошибки запуска | 24 |
| [3. Kernels, индексы и разбиение задачи](./03_kernels_and_indexing.md) | Grid/block/thread, 1D–3D, bounds, grid-stride loops, большие размеры | 24 |
| [4. Global memory и размещение данных](./04_global_memory.md) | Coalescing, alignment, stride, AoS/SoA, caches, constant/texture memory | 24 |
| [5. Shared memory и ресурсы SM](./05_shared_memory_and_resources.md) | Банки, tiling, registers, spills, occupancy, асинхронное копирование | 24 |
| [6. Синхронизация, атомики и модель памяти](./06_synchronization_and_atomics.md) | Barriers, masks, shuffles, ordering, scopes, cooperative groups | 24 |
| [7. Streams, events и CUDA Graphs](./07_streams_events_and_graphs.md) | Асинхронность, зависимости, перекрытие, capture, время жизни ресурсов | 24 |
| [8. Передачи CPU–GPU и Unified Memory](./08_transfers_and_unified_memory.md) | Pinned/pageable memory, batching, zero-copy, migration, prefetch | 24 |
| [9. Reduction, scan и histogram](./09_reduction_scan_and_histogram.md) | Коллективные примитивы, сегменты, compaction, атомарная конкуренция | 24 |
| [10. Линейная алгебра и Tensor Cores](./10_linear_algebra_and_tensor_cores.md) | GEMM, tiling, arithmetic intensity, precision, accumulation, epilogue | 24 |
| [11. Разреженные и нерегулярные алгоритмы](./11_sparse_and_irregular_algorithms.md) | Stencil, CSR/COO, SpMV, frontiers, сортировка, балансировка | 24 |
| [12. Библиотеки, FFT и случайные числа](./12_libraries_fft_and_random.md) | Thrust/CUB, cuBLAS/cuSPARSE/cuFFT/cuRAND, workspace, планы, DSP | 24 |
| [13. Профилирование и оптимизация](./13_profiling_and_optimization.md) | Timing, Nsight Systems/Compute, Roofline, counters, bottlenecks | 24 |
| [14. Отладка, тестирование и численная корректность](./14_debugging_and_correctness.md) | Compute Sanitizer, async errors, races, границы, допуски, determinism | 24 |
| [15. Несколько GPU и обмен данными](./15_multi_gpu_and_communication.md) | P2P, PCIe/NVLink, NCCL, collectives, partitioning, scaling, RDMA | 24 |
| [16. Интеграция, переносимость и сквозные проекты](./16_integration_and_projects.md) | C++/Python, ownership, memory pools, deployment, HIP/SYCL, полный pipeline | 24 |

К каждому из 384 вопросов добавлены ответ, типичная ошибка и источник; примеры и расчёты приведены там, где они помогают разобрать задачу. В веб-тренажёре вопросы доступны и с фильтром «Только с ответами».

## Практические рубежи

| После тем | Задание | Что сохранить для проверки |
| --- | --- | --- |
| 1–3 | Сложение векторов и двумерное преобразование с проверкой размеров, индексов и ошибок | CPU-эталон, тесты нулевых и некратных размеров, параметры сборки и запуска |
| 4–6 | Transpose с shared-memory tile и корректной синхронизацией | Схему обращений, обработку неполных tiles, результат проверки памяти и сравнение вариантов |
| 7–8 | Потоковая обработка порций данных с зависимостями и повторным использованием буферов | Timeline передач и kernels, границы владения, время полной обработки и отдельных стадий |
| 9–12 | Reduction, histogram или GEMM; отдельно FFT для задачи свёртки | Контракт операции, граничные случаи, численные допуски и сравнение с библиотекой |
| 13–14 | Оптимизация одной измеренной проблемы | Профили до и после, контрольный эксперимент и подтверждение корректности |
| 15–16 | Распределение задачи по двум GPU либо законченный CPU–GPU pipeline на одном | Разбиение работы, расходы обмена, завершение при ошибках и воспроизводимый end-to-end отчёт |

## Как работать с оборудованием и документацией

Фиксируйте модель GPU, compute capability, driver, toolkit, библиотеки, компилятор, параметры запуска и доступные ресурсы. Поддержку Tensor Cores, cluster operations, Unified Memory, P2P и инструментов проверяйте по документации конкретной конфигурации. Числовые задачи задают учебные параметры и не заменяют спецификацию устройства.

Без совместимого NVIDIA GPU можно пройти вопросы, расчёты, схемы и CPU-эталоны. Измерения CUDA и проверки Compute Sanitizer требуют поддерживаемой среды; их результаты нельзя получить из одного чтения кода. Для AMD, Intel и других платформ потребуются соответствующие API, компиляторы и инструменты; переносимость корректности и переносимость скорости проверяются отдельно.

Раздел даёт основу вычислений общего назначения на GPU. Полные курсы графики, ray tracing, обучения нейросетей, распределённого HPC и проектирования GPU требуют отдельных маршрутов; здесь они появляются как контекст и направления продолжения.

## Что читать дальше

| Источник | Как использовать |
| --- | --- |
| [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/index.html) | Programming model → SIMT kernels → asynchronous execution → память и углублённые возможности |
| [CUDA Best Practices Guide](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html) | Проверка результата → измерения → память → исполнение → сравнение CPU/GPU |
| [NVCC](https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/index.html), [CUDA Compatibility](https://docs.nvidia.com/deploy/cuda-compatibility/index.html) | Сборка host/device-кода и проверка совместимости выбранных версий |
| [Nsight Systems](https://docs.nvidia.com/nsight-systems/UserGuide/index.html), [Nsight Compute](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html) | Сначала найти дорогую стадию приложения, затем исследовать конкретный kernel |
| [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/index.html) | Выбрать проверку памяти, инициализации или синхронизации и понять её область покрытия |
| [cuBLAS](https://docs.nvidia.com/cuda/cublas/index.html), [cuFFT](https://docs.nvidia.com/cuda/cufft/index.html), [cuSPARSE](https://docs.nvidia.com/cuda/cusparse/index.html), [cuRAND](https://docs.nvidia.com/cuda/curand/index.html) | Уточнить layout, типы, размеры, workspace, поток выполнения и контракт результата |
| [NCCL](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html) | Коллективные операции, ранги, буферы, порядок вызовов и диагностика обмена |
| [HIP: перенос CUDA-кода](https://rocm.docs.amd.com/projects/HIP/en/latest/how-to/hip_porting_guide.html), [SYCL 2020](https://registry.khronos.org/SYCL/specs/sycl-2020/html/sycl-2020.html) | Сравнить модели выполнения, памяти и синхронизации перед переносом алгоритма |

Ссылки ведут на обновляемую документацию. В ответе и эксперименте указывайте использованную редакцию и отдельно проверяйте доступность API в установленном toolkit.
