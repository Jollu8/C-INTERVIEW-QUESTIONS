
У каждого пункта есть:
* **вопрос**
* **мини-пример кода**
* **типичная ошибка / red flag на интервью**

Я сместил акцент в сторону того, что реально проверяют на **Senior C++ interview**: memory model, lifetime, atomics, lock discipline, wait/notify, thread pools, cancellation, performance, API design и reasoning about correctness.

---

# 1. Memory model и базовая корректность

1. **Что такое data race в терминах C++ и почему это UB?**
   Пример:

   ```cpp
   int x = 0;
   // thread A
   x = 1;
   // thread B
   if (x == 1) { /* ... */ }
   ```

   Ошибка: говорить “ну максимум прочитается старое значение”. Нет — в C++ это **undefined behavior**, а не просто stale read.

2. **Чем race condition отличается от data race?**
   Пример:

   ```cpp
   std::atomic<int> a{0};
   // оба потока делают a.fetch_add(1);
   ```

   Ошибка: считать, что любой race condition — это data race. Race condition шире; data race — конкретное нарушение модели памяти.

3. **Что такое happens-before и зачем он нужен?**
   Пример:

   ```cpp
   std::atomic<bool> ready = false;
   int data = 0;

   // producer
   data = 42;
   ready.store(true, std::memory_order_release);

   // consumer
   if (ready.load(std::memory_order_acquire)) {
       use(data);
   }
   ```

   Ошибка: объяснять happens-before как “просто порядок строк в коде”.

4. **Почему `volatile` не решает задачи синхронизации?**
   Пример:

   ```cpp
   volatile bool ready = false; // не годится для межпоточной синхронизации
   ```

   Ошибка: говорить, что `volatile` “делает переменную потокобезопасной”.

5. **Когда `memory_order_relaxed` корректен?**
   Пример:

   ```cpp
   std::atomic<uint64_t> counter{0};
   counter.fetch_add(1, std::memory_order_relaxed);
   ```

   Ошибка: использовать `relaxed` для публикации данных, где нужна видимость других записей.

6. **В чем смысл acquire/release?**
   Пример:

   ```cpp
   payload = make_payload();
   published.store(1, std::memory_order_release);

   if (published.load(std::memory_order_acquire)) {
       consume(payload);
   }
   ```

   Ошибка: помнить только определения, но не уметь связать их с publication pattern.

7. **Когда нужен `seq_cst`, а когда это избыточно?**
   Пример:

   ```cpp
   flag.store(true, std::memory_order_seq_cst);
   ```

   Ошибка: отвечать “всегда ставлю seq_cst, чтобы точно работало” — это тревожный сигнал, если человек не понимает компромиссы.

8. **Что такое torn read / torn write и когда это важно?**
   Пример:

   ```cpp
   struct Pair { uint64_t a, b; };
   Pair p; // concurrent access без синхронизации
   ```

   Ошибка: думать, что “раз это одна переменная, чтение всегда атомарно”.

9. **Почему plain `bool` как stop flag между потоками — ошибка?**
   Пример:

   ```cpp
   bool stop = false;
   // worker: while (!stop) {}
   ```

   Ошибка: считать, что “на моем компе работает”.

10. **Что такое false sharing?**
    Пример:

    ```cpp
    struct Counters {
        std::atomic<int> a;
        std::atomic<int> b;
    };
    ```

    Ошибка: искать проблему только в locks и не учитывать cache line contention.

11. **Как уменьшить false sharing?**
    Пример:

    ```cpp
    struct alignas(64) PaddedCounter {
        std::atomic<int> value{0};
    };
    ```

    Ошибка: бездумно добавлять padding везде, не измеряя.

12. **Почему код может работать на x86 и ломаться на ARM?**
    Пример:

    ```cpp
    // некорректный код без proper ordering может "случайно" жить на x86
    ```

    Ошибка: считать модель памяти CPU одинаковой везде.

13. **Что такое publication safety?**
    Пример:

    ```cpp
    obj = new Widget(...);
    ready.store(true, std::memory_order_release);
    ```

    Ошибка: публиковать указатель без синхронизации и надеяться, что конструктор “сам все гарантирует”.

14. **Нужен ли `std::atomic_thread_fence` в обычном коде?**
    Пример:

    ```cpp
    std::atomic_thread_fence(std::memory_order_release);
    ```

    Ошибка: использовать fences вместо понятных atomic load/store без необходимости.

15. **Почему UB от data race особенно опасен для оптимизатора?**
    Пример:

    ```cpp
    while (!done) { /* spin */ } // done не atomic
    ```

    Ошибка: думать, что компилятор “не станет ломать очевидную логику”.

---

# 2. Жизненный цикл потоков и lifetime

16. **Что произойдет, если уничтожить joinable `std::thread`?**
    Пример:

    ```cpp
    std::thread t([]{});
    // no join / detach
    ```

    Ошибка: забыть про `std::terminate()`.

17. **Почему `detach()` чаще smell, чем решение?**
    Пример:

    ```cpp
    std::thread([] { work(); }).detach();
    ```

    Ошибка: использовать detach как способ “не думать про lifecycle”.

18. **Когда `std::jthread` лучше `std::thread`?**
    Пример:

    ```cpp
    std::jthread t([](std::stop_token st) {
        while (!st.stop_requested()) { /* ... */ }
    });
    ```

    Ошибка: не знать про auto-join и cooperative cancellation.

19. **Почему запускать поток в конструкторе объекта опасно?**
    Пример:

    ```cpp
    struct X {
        X() : t([this]{ run(); }) {}
        void run();
        std::thread t;
    };
    ```

    Ошибка: игнорировать то, что объект может быть еще не полностью сконструирован.

20. **Почему останавливать поток в деструкторе может быть трудно?**
    Пример:

    ```cpp
    ~Worker() {
        stop = true;
        cv.notify_all();
        t.join();
    }
    ```

    Ошибка: забыть разбудить поток, который спит на `condition_variable`.

21. **Чем опасен `this` в async callback?**
    Пример:

    ```cpp
    pool.enqueue([this] { use_members(); });
    ```

    Ошибка: не контролировать lifetime объекта, захваченного в задачу.

22. **Когда нужен `shared_from_this()` в concurrent code?**
    Пример:

    ```cpp
    auto self = shared_from_this();
    pool.enqueue([self] { self->do_work(); });
    ```

    Ошибка: захватывать raw `this`, когда задача может пережить объект.

23. **Почему `shared_ptr` не делает объект thread-safe?**
    Пример:

    ```cpp
    std::shared_ptr<State> s;
    ```

    Ошибка: путать потокобезопасность refcount с потокобезопасностью `State`.

24. **Какие проблемы у `thread_local` в сервисном коде?**
    Пример:

    ```cpp
    thread_local Cache cache;
    ```

    Ошибка: забывать про память, teardown, reuse worker threads и скрытое состояние.

25. **Чем опасен reference capture в задаче?**
    Пример:

    ```cpp
    int x = 42;
    pool.enqueue([&] { use(x); });
    ```

    Ошибка: ссылка переживает стековый объект.

26. **Когда move capture обязателен?**
    Пример:

    ```cpp
    auto p = std::make_unique<Job>();
    pool.enqueue([job = std::move(p)] { job->run(); });
    ```

    Ошибка: случайно копировать тяжелые объекты или некомпилируемо пытаться копировать `unique_ptr`.

27. **Можно ли безопасно передавать ссылку в `std::thread`?**
    Пример:

    ```cpp
    int x = 0;
    std::thread t([](int& v){ v++; }, std::ref(x));
    ```

    Ошибка: не объяснить условия безопасности lifetime + synchronization.

28. **Как корректно завершать long-running worker?**
    Пример:

    ```cpp
    while (!stop.load()) {
        // process
    }
    ```

    Ошибка: забыть, что stop flag сам по себе не будит поток из `wait()`.

29. **Почему “fire-and-forget background thread” опасен в библиотеке?**
    Пример:

    ```cpp
    void start() { std::thread([]{ background(); }).detach(); }
    ```

    Ошибка: прятать неявные фоновые потоки внутри API без явного shutdown.

30. **Что интервьюер хочет услышать про ownership в concurrent API?**
    Пример:

    ```cpp
    void submit(Task t);
    ```

    Ошибка: не описать, кто владеет задачей, когда она будет исполнена и когда можно уничтожать связанные объекты.

---

# 3. Mutex, lock discipline и deadlock

31. **Почему RAII обязателен для locks?**
    Пример:

    ```cpp
    std::lock_guard<std::mutex> g(m);
    ```

    Ошибка: использовать ручной `lock()/unlock()` в коде с исключениями и ранними return.

32. **Когда `std::unique_lock` нужен вместо `lock_guard`?**
    Пример:

    ```cpp
    std::unique_lock<std::mutex> lk(m);
    cv.wait(lk, pred);
    ```

    Ошибка: не знать, что `condition_variable` требует `unique_lock`.

33. **Что делает `std::scoped_lock` и когда он полезен?**
    Пример:

    ```cpp
    std::scoped_lock lk(m1, m2);
    ```

    Ошибка: брать два mutex вручную в разном порядке.

34. **Почему нельзя вызывать user callback под mutex?**
    Пример:

    ```cpp
    std::lock_guard lk(m);
    cb(state);
    ```

    Ошибка: игнорировать reentrancy, latency и potential deadlock.

35. **Что такое lock hierarchy?**
    Пример:

    ```cpp
    // всегда сначала m_user, потом m_session
    ```

    Ошибка: не иметь фиксированного порядка захвата mutex в большой системе.

36. **Как возникает ABBA deadlock?**
    Пример:

    ```cpp
    // T1: lock(m1), lock(m2)
    // T2: lock(m2), lock(m1)
    ```

    Ошибка: считать, что это только “теоретическая” проблема.

37. **Что такое lock convoy?**
    Пример:

    ```cpp
    std::mutex global;
    ```

    Ошибка: один “универсальный” mutex на весь hot path.

38. **Почему критическая секция должна быть короткой?**
    Пример:

    ```cpp
    std::lock_guard lk(m);
    update_state();
    ```

    Ошибка: держать lock во время IO, sleep, allocation-heavy работы.

39. **Когда `shared_mutex` помогает, а когда вредит?**
    Пример:

    ```cpp
    std::shared_mutex sm;
    ```

    Ошибка: автоматически выбирать RW lock для read-mostly сценария без измерений.

40. **Почему recursive mutex обычно плохой сигнал?**
    Пример:

    ```cpp
    std::recursive_mutex rm;
    ```

    Ошибка: лечить симптомы вместо исправления lock design.

41. **Чем опасен `try_lock` loop?**
    Пример:

    ```cpp
    while (!m.try_lock()) {}
    ```

    Ошибка: превращать ожидание в busy spin.

42. **Почему нельзя брать lock и потом ждать на сети/диске?**
    Пример:

    ```cpp
    std::lock_guard lk(m);
    socket.read(...);
    ```

    Ошибка: блокировать прогресс всей системы из-за внешнего slow dependency.

43. **Как проектировать thread-safe класс: coarse lock или fine-grained lock?**
    Пример:

    ```cpp
    class Cache { std::mutex m; /* ... */ };
    ```

    Ошибка: сразу дробить на 10 mutex без явной необходимости.

44. **Почему интерфейс `empty()` + `pop()` для thread-safe queue спорный?**
    Пример:

    ```cpp
    if (!q.empty()) q.pop();
    ```

    Ошибка: TOCTOU — состояние меняется между вызовами.

45. **Какой интерфейс queue лучше?**
    Пример:

    ```cpp
    std::optional<T> try_pop();
    ```

    Ошибка: проектировать API, требующее внешней синхронизации для базовой корректности.

---

# 4. Condition variable и wait/notify протоколы

46. **Почему `cv.wait()` всегда должен быть с predicate?**
    Пример:

    ```cpp
    cv.wait(lk, [&]{ return ready; });
    ```

    Ошибка: использовать `if (!ready) cv.wait(lk);`.

47. **Что такое spurious wakeup?**
    Пример:

    ```cpp
    cv.wait(lk);
    ```

    Ошибка: не знать, что поток может проснуться без notify.

48. **Что такое lost wakeup и как его избежать?**
    Пример:

    ```cpp
    {
        std::lock_guard lk(m);
        ready = true;
    }
    cv.notify_one();
    ```

    Ошибка: считать, что condition_variable “запоминает сигнал”.

49. **Почему state + mutex + cv — это единый протокол?**
    Пример:

    ```cpp
    bool ready = false;
    std::mutex m;
    std::condition_variable cv;
    ```

    Ошибка: обновлять `ready` вне того же mutex, с которым ждут.

50. **Когда `notify_one()` лучше `notify_all()`?**
    Пример:

    ```cpp
    cv.notify_one();
    ```

    Ошибка: будить всех без причины и получать thundering herd.

51. **Когда `notify_all()` необходим?**
    Пример:

    ```cpp
    shutdown = true;
    cv.notify_all();
    ```

    Ошибка: при shutdown будить только одного ожидающего worker.

52. **Нужно ли делать notify под lock?**
    Пример:

    ```cpp
    {
        std::lock_guard lk(m);
        ready = true;
    }
    cv.notify_one();
    ```

    Ошибка: отвечать догматично. Важна корректность протокола; часто notify после unlock удобнее.

53. **Как корректно завершать consumer, ждущий очередь?**
    Пример:

    ```cpp
    cv.wait(lk, [&]{ return stop || !q.empty(); });
    ```

    Ошибка: ждать только `!q.empty()` и зависнуть навсегда при shutdown.

54. **Почему timeout в `wait_for` не заменяет predicate?**
    Пример:

    ```cpp
    cv.wait_for(lk, 100ms, pred);
    ```

    Ошибка: использовать таймаут как костыль вместо корректного условия.

55. **Как выглядит bounded blocking queue?**
    Пример:

    ```cpp
    not_full.wait(lk, [&]{ return q.size() < cap || stop; });
    not_empty.wait(lk, [&]{ return !q.empty() || stop; });
    ```

    Ошибка: один cv на все, без четкого разделения условий и без shutdown semantics.

56. **Чем semaphore концептуально отличается от cv?**
    Пример:

    ```cpp
    std::counting_semaphore<128> sem{0};
    ```

    Ошибка: не понимать, что semaphore хранит permits, а cv — нет.

57. **Когда semaphore удобнее очереди + cv?**
    Пример:

    ```cpp
    sem.acquire();
    ```

    Ошибка: тащить mutex+cv для простого “есть N разрешений”.

58. **Как использовать `atomic_wait` для флага?**
    Пример:

    ```cpp
    std::atomic<int> state{0};
    state.wait(0);
    ```

    Ошибка: не знать о C++20 механизме и городить cv для простейшего случая.

59. **Почему `while (!flag) {}` обычно плохо?**
    Пример:

    ```cpp
    while (!ready.load(std::memory_order_acquire)) {}
    ```

    Ошибка: жечь CPU там, где можно блокироваться.

60. **Когда spin-wait все-таки допустим?**
    Пример:

    ```cpp
    for (int i = 0; i < 100; ++i) {
        if (flag.load()) break;
    }
    ```

    Ошибка: не уметь объяснить, что это только для очень короткого ожидания и hot low-latency сценариев.

---

# 5. Atomics и CAS

61. **Когда atomic counter — правильное решение?**
    Пример:

    ```cpp
    std::atomic<uint64_t> requests{0};
    requests.fetch_add(1, std::memory_order_relaxed);
    ```

    Ошибка: защищать такой счетчик mutex-ом в hot path без причины.

62. **Когда atomic недостаточно и нужен mutex?**
    Пример:

    ```cpp
    std::atomic<int> size;
    std::vector<int> v;
    ```

    Ошибка: думать, что atomic одного поля автоматически защищает всю структуру.

63. **Что делает `fetch_add` и чем он полезнее `x = x + 1`?**
    Пример:

    ```cpp
    a.fetch_add(1);
    ```

    Ошибка: не понимать read-modify-write атомарность.

64. **Что такое CAS?**
    Пример:

    ```cpp
    int expected = 0;
    flag.compare_exchange_strong(expected, 1);
    ```

    Ошибка: не уметь словами объяснить compare-and-swap без заученной формулы.

65. **Чем `compare_exchange_weak` отличается от `strong`?**
    Пример:

    ```cpp
    while (!x.compare_exchange_weak(expected, desired)) {}
    ```

    Ошибка: не знать про spurious failure у weak.

66. **Почему CAS обычно пишут в цикле?**
    Пример:

    ```cpp
    int expected = x.load();
    while (!x.compare_exchange_weak(expected, expected + 1)) {}
    ```

    Ошибка: один вызов CAS и надежда, что “должно хватить”.

67. **Что такое ABA problem?**
    Пример:

    ```cpp
    // stack head: A -> B -> ...
    // A removed, later another node reuses same address A
    ```

    Ошибка: думать, что сравнение указателей всегда достаточно.

68. **Как борются с ABA?**
    Пример:

    ```cpp
    struct TaggedPtr { Node* p; uint64_t tag; };
    ```

    Ошибка: не упомянуть tagged pointers / hazard pointers / epoch reclamation.

69. **Почему lock-free структура упирается не только в CAS, но и в reclamation?**
    Пример:

    ```cpp
    Node* old = head.load();
    delete old; // опасно
    ```

    Ошибка: забывать про безопасное освобождение памяти.

70. **Что такое hazard pointers?**
    Пример:

    ```cpp
    // поток публикует "я сейчас читаю этот node"
    ```

    Ошибка: считать, что удалять node можно сразу после CAS.

71. **Что такое epoch-based reclamation?**
    Пример:

    ```cpp
    // retired nodes освобождаются позже, когда все потоки вышли из epoch
    ```

    Ошибка: не видеть, что reclaim — центральная часть lock-free design.

72. **Почему lock-free не гарантирует low latency?**
    Пример:

    ```cpp
    while (!cas()) { /* retry */ }
    ```

    Ошибка: путать absence of mutex с bounded latency.

73. **Что такое wait-free и почему это редко?**
    Пример:

    ```cpp
    // каждая операция завершается за конечное число шагов
    ```

    Ошибка: называть любую atomic структуру wait-free.

74. **Почему `is_lock_free()` не главный критерий дизайна?**
    Пример:

    ```cpp
    std::atomic<MyType> a;
    a.is_lock_free();
    ```

    Ошибка: строить архитектуру вокруг этого флага без profiling.

75. **Когда relaxed atomics ломают логику, хотя счетчик “правильный”?**
    Пример:

    ```cpp
    data = 42;
    ready.store(true, std::memory_order_relaxed); // недостаточно
    ```

    Ошибка: путать атомарность флага и видимость связанных данных.

---

# 6. Thread-safe структуры и API design

76. **Как бы вы спроектировали thread-safe queue для interview?**
    Пример:

    ```cpp
    bool push(T);
    std::optional<T> try_pop();
    std::optional<T> wait_pop();
    void shutdown();
    ```

    Ошибка: дать только `empty()` и `pop()` без atomicity на уровне интерфейса.

77. **Почему `size()` у concurrent queue часто сомнителен?**
    Пример:

    ```cpp
    auto n = q.size();
    ```

    Ошибка: обещать точное значение без оговорок о concurrency semantics.

78. **Нужно ли делать все методы класса thread-safe?**
    Пример:

    ```cpp
    class Session { ... };
    ```

    Ошибка: отвечать “да, конечно”. Иногда правильнее explicit external synchronization.

79. **Что лучше: internal synchronization или external?**
    Пример:

    ```cpp
    // synchronized wrapper vs unsynchronized core
    ```

    Ошибка: не обсуждать trade-offs composability vs safety.

80. **Почему composable thread-safe APIs сложны?**
    Пример:

    ```cpp
    if (!cache.contains(k)) cache.insert(k, v);
    ```

    Ошибка: не замечать, что thread-safe individual methods не дают thread-safe compound operation.

81. **Как спроектировать cancelable blocking API?**
    Пример:

    ```cpp
    std::optional<T> wait_pop(std::stop_token st);
    ```

    Ошибка: блокировать навсегда без возможности shutdown/cancel.

82. **Почему strong exception safety важна в concurrent контейнере?**
    Пример:

    ```cpp
    q.push(T(...)); // конструктор/копирование может бросить
    ```

    Ошибка: забывать, что инварианты под lock должны оставаться корректными даже при exception.

83. **Нужно ли возвращать ссылки на внутренние данные thread-safe контейнера?**
    Пример:

    ```cpp
    T& front(); // опасный API
    ```

    Ошибка: exposing internal state beyond lock lifetime.

84. **Как сделать singleton thread-safe в современном C++?**
    Пример:

    ```cpp
    MyType& instance() {
        static MyType x;
        return x;
    }
    ```

    Ошибка: предлагать broken double-checked locking как default решение.

85. **Почему double-checked locking исторически tricky?**
    Пример:

    ```cpp
    if (!p) {
        std::lock_guard lk(m);
        if (!p) p = new X;
    }
    ```

    Ошибка: не понимать publication/reordering проблемы и тонкости atomic pointer.

---

# 7. Thread pools, tasks и execution

86. **Зачем нужен thread pool вместо “новый поток на задачу”?**
    Пример:

    ```cpp
    pool.enqueue(task);
    ```

    Ошибка: игнорировать цену thread creation/destruction и oversubscription.

87. **Как выбирать размер thread pool?**
    Пример:

    ```cpp
    auto n = std::thread::hardware_concurrency();
    ```

    Ошибка: всегда отвечать “по числу ядер” без учета IO-bound vs CPU-bound workload.

88. **Почему CPU-bound и IO-bound задачи нельзя бездумно мешать в один pool?**
    Пример:

    ```cpp
    // CPU tasks + long blocking DB calls in same pool
    ```

    Ошибка: не замечать starvation CPU tasks из-за блокирующих задач.

89. **Что такое work stealing?**
    Пример:

    ```cpp
    // каждый worker имеет local deque, idle workers крадут задачи
    ```

    Ошибка: не уметь объяснить, зачем это нужно для load balancing.

90. **Какая типичная ошибка в простом thread pool на mutex + cv?**
    Пример:

    ```cpp
    cv.wait(lk, [&]{ return stop || !tasks.empty(); });
    ```

    Ошибка: путать semantics shutdown и “доработать оставшиеся задачи”.

91. **Как выглядит корректный shutdown thread pool?**
    Пример:

    ```cpp
    stop = true;
    cv.notify_all();
    for (auto& t : workers) t.join();
    ```

    Ошибка: не определить clearly, что происходит с уже queued tasks.

92. **Почему future внутри того же thread pool может вызвать deadlock?**
    Пример:

    ```cpp
    pool.enqueue([&] { return fut.get(); });
    ```

    Ошибка: worker блокируется, ожидая задачу, которая сама должна выполниться в том же исчерпанном pool.

93. **Что такое backpressure и зачем он нужен?**
    Пример:

    ```cpp
    if (queue_size > limit) reject_or_block();
    ```

    Ошибка: делать unbounded queue и удивляться росту latency/memory.

94. **Почему bounded queue может быть лучше unbounded?**
    Пример:

    ```cpp
    BlockingQueue<Task> q(capacity);
    ```

    Ошибка: оптимизировать throughput, полностью забыв про tail latency и memory blow-up.

95. **Что важно в контракте `submit()`?**
    Пример:

    ```cpp
    auto fut = pool.submit([] { return 42; });
    ```

    Ошибка: не объяснить lifetime, cancel semantics, exception propagation и shutdown behavior.

---

# 8. `std::async`, futures, coroutines

96. **Почему `std::async` часто избегают в production infra-коде?**
    Пример:

    ```cpp
    auto f = std::async([] { return work(); });
    ```

    Ошибка: не знать про неоднозначную policy по умолчанию и слабую управляемость execution.

97. **В чем проблема `std::launch::deferred`?**
    Пример:

    ```cpp
    auto f = std::async(std::launch::deferred, work);
    ```

    Ошибка: ожидать, что задача уже крутится на фоне.

98. **Как распространяются исключения через `future`?**
    Пример:

    ```cpp
    auto f = std::async([]() -> int { throw std::runtime_error("x"); });
    f.get();
    ```

    Ошибка: забывать, что исключение выйдет в `get()`, а не в worker thread наружу.

99. **Делают ли coroutines код автоматически многопоточным?**
    Пример:

    ```cpp
    task<int> foo() { co_return 42; }
    ```

    Ошибка: отвечать “да, coroutine — это про multithreading”. Нет, coroutine — это про suspension/resumption, не обязательно про другой поток.

100. **Что senior-кандидат должен уметь объяснить про coroutine + concurrency?**
     Пример:
     `cpp
         co_await scheduler.schedule();
         `
     Ошибка: не уметь разделить три вещи:
     - где выполняется continuation,
     - кто владеет coroutine frame,
     - как устроены cancellation, synchronization и lifetime.

---

# 9. Типичные мини-задачи, которые любят на senior interview

Ниже — короткий список задач, которые часто идут сразу после таких вопросов. Это полезно, потому что интервью обычно быстро переходит от теории к дизайну или коду.

1. Реализовать **thread-safe queue** с `wait_pop`, `try_pop`, `shutdown`.
2. Найти баг в коде с **plain bool stop flag**.
3. Исправить broken code с `condition_variable`, где `wait()` написан через `if`.
4. Объяснить, почему API `empty() -> pop()` некомпозируем в concurrency.
5. Реализовать **bounded queue** с producer/consumer.
6. Найти **deadlock** при захвате двух mutex.
7. Переписать глобальный mutex на **sharded locking**.
8. Объяснить, когда **atomic counter** лучше mutex.
9. Нарисовать корректный shutdown для **thread pool**.
10. Объяснить, почему код с `detach()` опасен по lifecycle.

---

# 10. Что особенно отличает strong senior answer

На senior-собеседовании обычно смотрят не только на знание терминов, а на то, слышно ли у кандидата следующее:

* он различает **correctness** и **performance**
* он умеет говорить про **lifetime / ownership**
* он понимает, что thread-safe методы не равны thread-safe протоколу
* он умеет объяснить **publication**, **shutdown**, **cancellation**
* он знает, что большинство concurrency-багов — это не “не тот mutex”, а плохой **API contract**
* он осторожен с lock-free и не продает его как магическое ускорение
* он говорит про **measurement**, **contention**, **tail latency**, **false sharing**, **reclamation**
