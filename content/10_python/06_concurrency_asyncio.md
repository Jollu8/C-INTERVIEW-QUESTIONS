# Потоки, процессы и asyncio

Этап 6 основного маршрута Python для системного разработчика.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Чем конкурентность отличается от параллельного выполнения и как это влияет на выбор модели приложения?

   **Ответ:** Concurrency — перекрытие прогресса нескольких работ, parallelism — их одновременное исполнение. Async I/O даёт concurrency на одном loop thread, threads/processes/native kernels могут давать parallelism при нужной реализации.

   **Источник:** [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html); [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

2. Чем I/O-bound работа отличается от CPU-bound и почему это различие важно для Python?

   **Ответ:** I/O-bound тратит время на внешнее ожидание, CPU-bound — вычисления. Thread/async помогают перекрыть I/O; для Python bytecode CPU на GIL-build часто нужны процессы/native либо проверенная free-threaded сборка.

   **Источник:** [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html); [Python 3.14: library/multiprocessing.html](https://docs.python.org/3.14/library/multiprocessing.html); [Python 3.14: howto/free-threading-python.html](https://docs.python.org/3.14/howto/free-threading-python.html)

3. Какие задачи решают `threading`, `multiprocessing` и `asyncio`?

   **Ответ:** Threading делит process memory, multiprocessing запускает изолированные процессы/IPC, asyncio планирует cooperative coroutines. Выбор определяется waits, shared state, serialization и cancellation, не только числом задач.

   **Источник:** [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html); [Python 3.14: library/multiprocessing.html](https://docs.python.org/3.14/library/multiprocessing.html); [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

4. Что такое coroutine, Task и event loop в asyncio?

   **Ответ:** Coroutine — awaitable computation, Task — запланированное выполнение coroutine с result/cancel state, event loop обслуживает readiness/callbacks/tasks. Внутри loop задачи уступают управление кооперативно.

   **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

5. Что происходит при вызове функции `async def` без последующего ожидания или планирования?

   **Ответ:** Возвращается coroutine object, тело не выполняется. Нужны await/create_task внутри running loop либо asyncio.run верхнего уровня; забытый coroutine обычно даёт RuntimeWarning.

   **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

6. Как `Lock`, `Event` и `Queue` помогают координировать потоки?

   **Ответ:** Lock защищает critical section/invariant, Event сообщает состояние/signal, Queue передаёт работу с синхронизацией. Несколько отдельных thread-safe calls не делают их комбинацию атомарной.

   **Источник:** [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html); [Python 3.14: library/queue.html](https://docs.python.org/3.14/library/queue.html)

7. Какую задачу решает ограниченная очередь и что означает backpressure?

   **Ответ:** Bounded Queue ограничивает накопление; put ждёт/отказывает при полном buffer, замедляя producer. Лимит workers не ограничивает число созданных tasks/ожидающих результатов сам по себе.

   **Источник:** [Python 3.14: library/queue.html](https://docs.python.org/3.14/library/queue.html); [Python 3.14: library/asyncio-queue.html](https://docs.python.org/3.14/library/asyncio-queue.html)

8. Что означает GIL в обычной сборке CPython и почему это не характеристика всех реализаций Python?

   **Ответ:** В обычном CPython GIL ограничивает одновременное выполнение Python code threads одного interpreter, но освобождается при многих waits/native calls. Это implementation/build характеристика; Python допускает иные runtimes/free-threaded CPython.

   **Источник:** [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html); [Python 3.14: howto/free-threading-python.html](https://docs.python.org/3.14/howto/free-threading-python.html)

## Средний уровень — применение

9. Почему GIL не заменяет синхронизацию логической операции «проверить → изменить»?

   **Ответ:** Между check и update могут пройти другие operations/threads/callbacks; GIL не гарантирует business atomicity всего блока. Использовать общий lock/transaction либо single-owner protocol для всех участников.

   **Источник:** [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html)

10. Когда многопоточное выполнение CPU-bound работы может ускоряться за счёт native-кода, освобождающего GIL?

    **Ответ:** Если native library действительно releases GIL на тяжёлом участке и thread-safe, threads могут вычислять параллельно. Python callbacks/объекты и internal BLAS threads могут снова ограничивать/переподписывать CPU.

    **Источник:** [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html); [NumPy: Thread safety](https://numpy.org/doc/stable/reference/thread_safety.html)

11. Какие затраты сериализации, запуска и передачи данных нужно учитывать при выборе ProcessPoolExecutor?

    **Ответ:** Startup/import, pickle/IPC copies, scheduling и result serialization входят в end-to-end. Large arrays могут сделать процессы медленнее; shared memory требует lifetime/synchronization и metadata layout.

    **Источник:** [Python 3.14: library/multiprocessing.html](https://docs.python.org/3.14/library/multiprocessing.html); [Python 3.14: library/concurrent.futures.html](https://docs.python.org/3.14/library/concurrent.futures.html)

12. Как выбор start method процессов влияет на imports, ресурсы и переносимость приложения?

    **Ответ:** Spawn запускает новый interpreter/imports, fork наследует address space/ресурсы и опасен с multithreaded parent, forkserver отделяет fork origin. В Python 3.14 default на поддерживающем POSIX обычно forkserver, Windows/macOS — spawn; выбирать/проверять явно.

    **Источник:** [Python 3.14: library/multiprocessing.html](https://docs.python.org/3.14/library/multiprocessing.html)

13. Чем `await operation()` отличается от `create_task(operation())` для порядка выполнения?

    **Ответ:** Await выполняет dependency и ждёт результат до продолжения текущей coroutine; create_task планирует отдельную Task, позволяя перекрытие с другой работой. Результат/ошибку Task всё равно нужно await/наблюдать.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

14. Как устроена кооперативная отмена Task и где должна происходить очистка ресурсов?

    **Ответ:** Cancel запрашивает ввод CancelledError при следующей подходящей точке; finally/async with освобождают ресурсы. После cleanup обычно re-raise; подавление отмены может сломать TaskGroup/timeout semantics.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

15. Чем `TaskGroup` и `gather` отличаются по обработке ошибки одной из задач?

    **Ответ:** TaskGroup при первой обычной ошибке отменяет siblings, ждёт их и выдаёт ExceptionGroup. Gather по умолчанию распространяет первую ошибку, но не отменяет остальные только из-за этого; return_exceptions меняет представление результатов.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

16. Почему blocking I/O и долгий CPU-цикл внутри coroutine мешают другим задачам event loop?

    **Ответ:** Пока coroutine не отдаёт управление, loop не исполняет других handlers/tasks. Async signature не превращает sync read/time.sleep/CPU loop в неблокирующий; применять async API, to_thread для подходящего I/O или process/native CPU path.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

17. Как ограничивать число одновременно выполняющихся запросов и размер ожидающей очереди отдельно?

    **Ответ:** Semaphore ограничивает active operations, bounded queue/worker pool — waiting jobs, streaming sink — accumulated output. Не создавать бесконечный список tasks, каждая из которых ждёт semaphore.

    **Источник:** [Python 3.14: library/asyncio-queue.html](https://docs.python.org/3.14/library/asyncio-queue.html); [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

18. Как корректно завершить producer/consumer pipeline, не потеряв исключения и не оставив ожидающих задач?

    **Ответ:** Остановить admission, передать sentinel/shutdown или cancel по контракту, drain/abort queue, task_done в finally и join/await всех workers. Исключения доставить owner, cleanup и deadline не должны оставлять скрытые зависшие задачи.

    **Источник:** [Python 3.14: library/queue.html](https://docs.python.org/3.14/library/queue.html); [Python 3.14: library/asyncio-queue.html](https://docs.python.org/3.14/library/asyncio-queue.html); [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

## Сложный уровень — ограничения и проектирование

19. Чем обычная и free-threaded сборки CPython 3.14 отличаются по требованиям к расширениям и синхронизации общего состояния?

    **Ответ:** В free-threaded build Python threads могут исполняться параллельно, но shared invariants требуют locks. Extensions должны явно поддерживать режим; неподготовленный extension способен включить GIL, поэтому проверять build и runtime mode.

    **Источник:** [Python 3.14: howto/free-threading-python.html](https://docs.python.org/3.14/howto/free-threading-python.html); [Python 3.14: howto/free-threading-extensions.html](https://docs.python.org/3.14/howto/free-threading-extensions.html)

20. Почему механическая замена потоков процессами может ухудшить производительность при больших массивах?

    **Ответ:** Массивы сериализуются/копируются, startup/cache warmup и IPC могут стоить больше compute. Сравнивать batches/shared-memory views с thread-safe GIL-releasing native work, включая synchronization и копирование в измерение.

    **Источник:** [Python 3.14: library/multiprocessing.html](https://docs.python.org/3.14/library/multiprocessing.html); [NumPy: Thread safety](https://numpy.org/doc/stable/reference/thread_safety.html)

21. Как ошибка дедлайна отличается от отмены по инициативе вызывающего кода и как сохранить это различие в API?

    **Ответ:** Deadline — лимит времени операции, external cancellation — просьба владельца завершить её. Timeout context преобразует вызванную им отмену в TimeoutError снаружи, а чужой CancelledError следует сохранить, чтобы caller отличал причины.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

22. Как `ExceptionGroup` и `except*` помогают обрабатывать несколько ошибок структурированной конкурентности?

    **Ответ:** ExceptionGroup переносит несколько ошибок, except* выбирает подгруппу по типу и сохраняет остальные для propagation. Обрабатывать только ожидаемые failures, не теряя nested structure и cancellation semantics.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html); [Python 3.14: library/exceptions.html](https://docs.python.org/3.14/library/exceptions.html)

23. Как организовать передачу результата из рабочего потока в event loop через потокобезопасные интерфейсы?

    **Ответ:** Использовать loop.call_soon_threadsafe для callback или asyncio.run_coroutine_threadsafe для coroutine; возвращённый concurrent future наблюдать из worker. Asyncio primitives обычно не предназначены для прямого вызова из другого thread.

    **Источник:** [Python 3.14: library/asyncio-eventloop.html](https://docs.python.org/3.14/library/asyncio-eventloop.html); [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

24. Какие риски возникают при отмене ожидания работы, уже запущенной в потоке или отдельном процессе?

    **Ответ:** Отмена await/to_thread обычно не останавливает уже работающую sync функцию; running process future тоже нельзя произвольно безопасно отменить. Нужны cooperative stop/deadline, lifecycle owner и отдельный termination protocol при допустимых побочных эффектах.

    **Типичная ошибка:** Считать отмену await доказательством остановки уже работающего thread/process.

    **Источник:** [Python 3.14: library/concurrent.futures.html](https://docs.python.org/3.14/library/concurrent.futures.html); [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

25. Как измерить масштабируемость параллельной обработки, разделив полезную работу, contention, ожидание I/O и передачу данных?

    **Ответ:** Для каждого worker count измерить completed throughput/p99, compute, queue wait, serialization/copy и contention. Удержать input/correctness, учитывать CPU/BLAS oversubscription и startup, сравнить с последовательным baseline.

    **Источник:** [Python 3.14: library/concurrent.futures.html](https://docs.python.org/3.14/library/concurrent.futures.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

## Разбор кода

26. Почему вызывающий код ещё не запустил тело coroutine и как выполнить её корректно?

   **Условие:**

   ```python
   import asyncio

   async def work():
       print("started")
       return 1

   result = work()
   print(type(result))
   ```

    **Ответ:** `work()` создал coroutine object, строка started не печатается; type показывает coroutine. Выполнить `asyncio.run(work())` вне running loop либо await work() внутри, затем использовать возвращённое 1.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

27. Какая операция блокирует event loop и какие варианты замены подходят для разных видов работы?

   **Условие:**

   ```python
   import asyncio
   import time

   async def work():
       time.sleep(1)
       return 42
   ```

    **Ответ:** time.sleep блокирует loop thread. Для ожидания нужен await asyncio.sleep; blocking library I/O можно вынести в to_thread, CPU-bound Python — в process/проверенный native parallel path.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

28. Какую гонку содержит операция независимо от предположения о GIL и где нужен общий lock?

   **Условие:**

   ```python
   cache = {}

   def get_or_create(key, factory):
       if key not in cache:
           cache[key] = factory()
       return cache[key]
   ```

    **Ответ:** Два callers могут оба пройти `key not in cache` и вызвать factory, затем перезаписать результат. Общий lock охватывает check/create/publish либо per-key singleflight; factory под lock требует учета reentrancy/deadlock.

    **Источник:** [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html)

29. Какие проблемы возникают при потере ссылки на Task и как обеспечить наблюдение результата и завершение работы?

   **Условие:**

   ```python
   import asyncio

   async def save():
       await asyncio.sleep(1)
       raise RuntimeError("save failed")

   async def main():
       asyncio.create_task(save())
       return "done"

   asyncio.run(main())
   ```

    **Ответ:** Task не наблюдается и loop хранит лишь слабые ссылки; asyncio.run при завершении main отменяет оставшуюся работу. Держать owner/TaskGroup, await result и shutdown, иначе save может не завершиться и ошибка потеряется.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

30. Почему код не даёт гарантии корректного завершения consumer и как явно передать сигнал остановки?

   **Условие:**

   ```python
   import queue
   import threading

   q = queue.Queue()

   def consume():
       while True:
           item = q.get()
           print(item)

   worker = threading.Thread(target=consume)
   worker.start()
   q.put(1)
   worker.join()
   ```

    **Ответ:** Worker после первого item навсегда ждёт q.get, поэтому join зависнет. Послать уникальный sentinel/shutdown, task_done выполнять в finally при использовании queue.join, а join ограничить deadline и передать worker exceptions owner.

    **Источник:** [Python 3.14: library/queue.html](https://docs.python.org/3.14/library/queue.html); [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html)

## Практические задачи

31. Как реализовать ограниченный producer/consumer pipeline с корректной остановкой при ошибке и проверкой отсутствия зависших потоков?

    **Ответ:** Bounded Queue, фиксированные workers, stop/error channel и owner try-finally. Sentinel/shutdown policy различает drain/abort, все accepted items получают outcome, workers join с deadline; barrier tests проверяют ошибку producer/consumer и отсутствие живых threads.

    **Источник:** [Python 3.14: library/queue.html](https://docs.python.org/3.14/library/queue.html); [Python 3.14: library/threading.html](https://docs.python.org/3.14/library/threading.html)

32. Как сравнить ThreadPoolExecutor и ProcessPoolExecutor на одной задаче, включив время передачи данных в end-to-end измерение?

    **Ответ:** Одна pure top-level функция/одинаковые данные, одинаковые counts/проверка результата; измерить cold startup и warm throughput отдельно. End-to-end включает submit/pickle/IPC/result, число BLAS/OS threads контролируется.

    **Источник:** [Python 3.14: library/concurrent.futures.html](https://docs.python.org/3.14/library/concurrent.futures.html); [Python 3.14: library/multiprocessing.html](https://docs.python.org/3.14/library/multiprocessing.html)

33. Как написать asyncio-клиент с лимитом одновременных запросов, timeout, отменой и ограничением числа накопленных результатов?

    **Ответ:** Фиксированные async workers читают bounded queue, каждый request имеет semaphore при необходимости и общий timeout/deadline. TaskGroup владеет workers, results пишутся streaming в bounded sink; cancellation закрывает connections и наблюдается owner.

    **Пример:**

    ```python
    import asyncio

    async def run_jobs(jobs, process, sink, *, workers=4, capacity=8):
        if workers < 1 or capacity < 1:
            raise ValueError("positive workers and capacity required")
        queue = asyncio.Queue(maxsize=capacity)
        stop = object()

        async def produce():
            for job in jobs:  # jobs — быстрый синхронный iterable.
                await queue.put(job)
            for _ in range(workers):
                await queue.put(stop)

        async def consume():
            while True:
                job = await queue.get()
                try:
                    if job is stop:
                        return
                    async with asyncio.timeout(5):
                        result = await process(job)
                    await sink(result)  # Sink сам ограничивает buffering.
                finally:
                    queue.task_done()

        async with asyncio.TaskGroup() as group:
            group.create_task(produce())
            for _ in range(workers):
                group.create_task(consume())
    ```

    **Типичная ошибка:** Создавать по Task на каждый вход, полагая, что semaphore ограничил память ожидающих tasks.

    **Рекомендация:** Process и sink должны поддерживать cooperative cancellation и закрывать свои ресурсы.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html); [Python 3.14: library/asyncio-queue.html](https://docs.python.org/3.14/library/asyncio-queue.html)

34. Как протестировать отмену группы задач и доказать, что все открытые ресурсы закрываются?

    **Ответ:** Fake resources отмечают enter/exit, Events удерживают tasks на известном await, затем owner cancel. Await завершения группы, проверить close ровно один раз и отсутствие pending children; отдельный case — failure acquisition до enter завершения.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html); [Python 3.14: library/contextlib.html](https://docs.python.org/3.14/library/contextlib.html); [pytest: Documentation](https://docs.pytest.org/en/stable/)

35. Как подготовить аудит общего состояния библиотеки перед запуском на free-threaded CPython 3.14?

    **Ответ:** Inventory shared dicts/caches/singletons/counters, compound operations, Python/native callbacks и third-party binaries. Проверить явную синхронизацию/ownership и extension support, прогнать stress/invariants на обеих builds и измерить фактический runtime GIL state.

    **Источник:** [Python 3.14: howto/free-threading-python.html](https://docs.python.org/3.14/howto/free-threading-python.html); [Python 3.14: howto/free-threading-extensions.html](https://docs.python.org/3.14/howto/free-threading-extensions.html)

## Что прочитать

- [Python: threading](https://docs.python.org/3.14/library/threading.html)
- [Python: asyncio tasks](https://docs.python.org/3.14/library/asyncio-task.html)
- [Python: multiprocessing](https://docs.python.org/3.14/library/multiprocessing.html)
- [Python: free threading](https://docs.python.org/3.14/howto/free-threading-python.html)

[← Предыдущая тема](./05_quality_typing_testing.md) · [План раздела](./README.md) · [Следующая тема →](./07_numpy_and_performance.md)
