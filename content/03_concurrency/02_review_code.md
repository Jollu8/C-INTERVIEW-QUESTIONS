
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


Ниже — разбор задач в формате вопрос-ответ с примерами кода, подводными камнями и ссылками на первоисточники.

---

1. Реализовать thread-safe queue с wait_pop, try_pop, shutdown

   **Ответ:** Классическая очередь требует синхронизации через `std::mutex` и `std::condition_variable`. Для поддержки graceful shutdown вводится флаг остановки; при его установке все ожидающие потоки пробуждаются через `notify_all()`. Метод `wait_pop` должен возвращать `std::optional<T>` или `bool`, сигнализируя о закрытии очереди.

   **Пример:**

   ```cpp
   #include <mutex>
   #include <condition_variable>
   #include <queue>
   #include <optional>

   template <typename T>
   class ConcurrentQueue {
       std::queue<T> queue_;
       mutable std::mutex mutex_;
       std::condition_variable cv_;
       bool stopped_ = false;

   public:
       void push(T value) {
           {
               std::lock_guard lock(mutex_);
               if (stopped_) return;
               queue_.push(std::move(value));
           }
           cv_.notify_one();
       }

       std::optional<T> wait_pop() {
           std::unique_lock lock(mutex_);
           cv_.wait(lock, [this] { return !queue_.empty() || stopped_; });
           if (queue_.empty() && stopped_) return std::nullopt;

           T item = std::move(queue_.front());
           queue_.pop();
           return item;
       }

       bool try_pop(T& value) {
           std::lock_guard lock(mutex_);
           if (queue_.empty()) return false;
           value = std::move(queue_.front());
           queue_.pop();
           return true;
       }

       void shutdown() {
           {
               std::lock_guard lock(mutex_);
               stopped_ = true;
           }
           cv_.notify_all();
       }
   };

   ```

   **Типичная ошибка:** Забыть разбудить все заблокированные потоки (`cv_.notify_all()`) во время `shutdown()`, что приводит к вечному зависанию консьюмеров при завершении работы приложения.

   **Источник:** [Anthony Williams: C++ Concurrency in Action (Chapter 4: Synchronizing concurrent operations)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition)

   ---

2. Найти баг в коде с plain bool stop flag

   **Ответ:** Использование обычного `bool` без синхронизации для передачи сигнала остановки между потоками приводит к состоянию гонки данных (data race), что является UB (Undefined Behavior). Компилятор имеет право заоптимизировать чтение такого флага в бесконечный цикл (кешировав его в регистре процессора), а аппаратная память может не опубликовать изменения между ядрами.

   **Пример:**

   ```cpp
   // ОШИБКА:
   bool stop = false;
   void worker() {
       while (!stop) { /* компилятор может превратить это в if (!stop) while(true); */ }
   }

   // РЕШЕНИЕ:
   #include <atomic>
   std::atomic<bool> stop{false};
   void worker_fixed() {
       while (!stop.load(std::memory_order_relaxed)) {
           // Выполнение работы
       }
   }

   ```

   **Типичная ошибка:** Полагаться на ключевое слово `volatile bool`. В стандарте C++ `volatile` не дает атомарности и не вставляет memory barriers; он предназначен для memory-mapped I/O, а не для потокобезопасности.

   **Источник:** [Cppreference: std::atomic](https://en.cppreference.com/w/cpp/atomic/atomic)

   ---

3. Исправить broken code с condition_variable, где wait() написан через if

   **Ответ:** Ожидание `condition_variable` через конструкцию `if` приводит к багам из-за ложных пробуждений (spurious wakeups), а также в ситуациях, когда несколько потоков конкурируют за один и тот же элемент, и первый проснувшийся поток успевает забрать данные раньше остальных. Ожидание всегда должно выполняться в цикле `while` или с предикатом.

   **Пример:**

   ```cpp
   std::mutex mtx;
   std::condition_variable cv;
   std::queue<int> q;

   // ОШИБКА:
   // std::unique_lock lock(mtx);
   // if (q.empty()) cv.wait(lock); // Уязвимо к spurious wakeup!
   // int x = q.front(); q.pop();

   // РЕШЕНИЕ:
   std::unique_lock lock(mtx);
   cv.wait(lock, [&q] { return !q.empty(); });
   int x = q.front();
   q.pop();

   ```

   **Типичная ошибка:** Полагаться на то, что `condition_variable::notify_one()` пробуждает ровно один поток исключительно в момент готовности данных. Операционная система может выдать ложное пробуждение без какого-либо явного сигнала.

   **Источник:** [Cppreference: std::condition_variable::wait](https://en.cppreference.com/w/cpp/thread/condition_variable/wait)

   ---

4. Объяснить, почему API empty() -> pop() некомпозируем в concurrency

   **Ответ:** Разделение проверки состояния (`empty()`) и модификации (`pop()`) порождает race condition вида Check-Then-Act (TOCTOU: Time of check to time of use). Даже если каждый метод по отдельности потокобезопасен и берет мьютекс, между вызовом `empty()` и вызовом `pop()` другой поток может опустошить контейнер.

   **Пример:**

   ```cpp
   // Потоконебезопасный протокол использования:
   if (!queue.empty()) { // Поток А проверяет: true
                         // Контекст переключается. Поток Б выполняет empty() и pop(). Очередь пуста!
       auto item = queue.pop(); // Поток А пытается сделать pop() из пустой очереди -> UB / Crash
   }

   // Решение на уровне контракта API:
   std::optional<T> item = queue.try_pop(); // Атомарная проверка и извлечение в одной критической секции

   ```

   **Типичная ошибка:** Попытка сделать API «привычным» и похожим на STL (`std::stack`, `std::queue`). В конкурентном коде интерфейс должен объединять проверку и действие в единую атомарную операцию.

   **Источник:** [Herb Sutter: Modern C++ Concurrency (Item: Avoid Compound Operations)](https://herbsutter.com/)

   ---

5. Реализовать bounded queue с producer/consumer

   **Ответ:** Ограниченная очередь (bounded queue) требует блокировки как консьюмеров при опустошении, так и продюсеров при заполнении до заданного лимита (`capacity`). Это реализуется с помощью одного мьютекса и двух условных переменных (например, `not_full_` и `not_empty_`).

   **Пример:**

   ```cpp
   #include <mutex>
   #include <condition_variable>
   #include <queue>

   template <typename T>
   class BoundedQueue {
       std::queue<T> queue_;
       const size_t capacity_;
       std::mutex mtx_;
       std::condition_variable not_full_;
       std::condition_variable not_empty_;

   public:
       explicit BoundedQueue(size_t cap) : capacity_(cap) {}

       void push(T item) {
           std::unique_lock lock(mtx_);
           not_full_.wait(lock, [this] { return queue_.size() < capacity_; });
           queue_.push(std::move(item));
           not_empty_.notify_one();
       }

       T pop() {
           std::unique_lock lock(mtx_);
           not_empty_.wait(lock, [this] { return !queue_.empty(); });
           T item = std::move(queue_.front());
           queue_.pop();
           not_full_.notify_one();
           return item;
       }
   };

   ```

   **Типичная ошибка:** Использовать одну общую условную переменную вместо двух и будить потоки через `notify_one()`. В таком случае продюсер может разбудить другого продюсера вместо консьюмера, что приводит к deadlock.

   **Источник:** [POSIX Threads: Producer-Consumer Condition Variables Pattern](https://en.wikipedia.org/wiki/Producer–consumer_problem)

   ---

6. Найти deadlock при захвате двух mutex

   **Ответ:** Взаимная блокировка (deadlock) возникает, когда два или более потоков пытаются захватить одни и те же мьютексы в разном порядке (нарушение принципа иерархии блокировок). Для безопасного захвата нескольких примитивов синхронизации необходимо использовать алгоритм `std::lock` или RAII-обертку `std::scoped_lock`.

   **Пример:**

   ```cpp
   struct Account {
       std::mutex mtx;
       int balance = 0;
   };

   // ОШИБКА: Поток 1: transfer(a, b), Поток 2: transfer(b, a) -> Deadlock!
   // void transfer(Account& from, Account& to, int amount) {
   //     std::unique_lock lockA(from.mtx);
   //     std::unique_lock lockB(to.mtx);
   //     ...
   // }

   // РЕШЕНИЕ (C++17):
   void transfer(Account& from, Account& to, int amount) {
       if (&from == &to) return;
       std::scoped_lock lock(from.mtx, to.mtx); // Deadlock-free захват без фиксированного порядка вызова
       from.balance -= amount;
       to.balance += amount;
   }

   ```

   **Типичная ошибка:** Забыть проверку на самоприсваивание / совпадение ссылок (`&from == &to`). Попытка захватить нерекурсивный `std::mutex` дважды в одном потоке приводит к немедленному deadlock (или UB).

   **Источник:** [Cppreference: std::scoped_lock](https://en.cppreference.com/w/cpp/thread/scoped_lock)

   ---

7. Переписать глобальный mutex на sharded locking

   **Ответ:** Единый глобальный мьютекс создает сильное бутылочное горлышко (contention) при масштабировании на множество ядер. Sharded (striped) locking разбивает общее состояние на $N$ независимых шардов (корзин), каждый из которых защищен собственным мьютексом. Номер шарда определяется через хеш ключа.

   **Пример:**

   ```cpp
   #include <vector>
   #include <mutex>
   #include <unordered_map>
   #include <string>

   template <typename K, typename V>
   class ShardedMap {
       struct Shard {
           mutable std::mutex mtx;
           std::unordered_map<K, V> map;
       };
       static constexpr size_t NumShards = 16;
       std::vector<Shard> shards_{NumShards};

       Shard& get_shard(const K& key) {
           return shards_[std::hash<K>{}(key) % NumShards];
       }

   public:
       void insert(const K& key, V val) {
           auto& shard = get_shard(key);
           std::lock_guard lock(shard.mtx);
           shard.map[key] = std::move(val);
       }
   };

   ```

   **Типичная ошибка:** Размещать структуры `Shard` плотно в одном непрерывном массиве без выравнивания по размеру кэш-линии (`alignas(hardware_destructive_interference_size)`). Это приводит к **false sharing**, когда запись в один мьютекс инвалидирует кэш соседнего мьютекса.

   **Источник:** [Cppreference: std::hardware_destructive_interference_size](https://en.cppreference.com/w/cpp/thread/hardware_destructive_interference_size)

   ---

8. Объяснить, когда atomic counter лучше mutex

   **Ответ:** `std::atomic<T>` значительно эффективнее мьютекса в сценариях с низкой и средней конкуренцией (low contention), когда критическая секция сводится к одной простой операции (инкремент, флаг). Атомики компилируются в простые инструкции процессора (например, `lock xadd` на x86) и избегают накладных расходов ядра ОС на усыпление/пробуждение потоков и context switch.

   **Пример:**

   ```cpp
   #include <atomic>

   class Metrics {
       std::atomic<uint64_t> requests_count_{0};

   public:
       void record_request() {
           // Не требует блокировки ядра ОС, атомарный инкремент на уровне инструкций CPU:
           requests_count_.fetch_add(1, std::memory_order_relaxed);
       }

       uint64_t get() const {
           return requests_count_.load(std::memory_order_relaxed);
       }
   };

   ```

   **Типичная ошибка:** Использовать атомики при высокой конкуренции (high contention) сотен потоков в цикле CAS (compare-and-swap), что вызывает лавину инвалидаций кэш-линий (cache line bouncing) и проигрывает по latency даже backoff-мьютексам. Также атомики не подходят, если нужно атомарно обновить два зависимых значения.

   **Источник:** [Fedman: Memory Barriers & Cache Coherency (MESI protocol)](https://en.wikipedia.org/wiki/MESI_protocol)

   ---

9. Нарисовать корректный shutdown для thread pool

   **Ответ:** Корректный shutdown требует атомарного перехода пула в закрытое состояние, пробуждения всех спящих воркеров через условную переменную и ожидания завершения всех потоков через `join()`. В зависимости от контракта API, пул либо дорабатывает оставшиеся задачи в очереди, либо сбрасывает их.

   **Пример:**

   ```cpp
   #include <vector>
   #include <thread>
   #include <queue>
   #include <functional>
   #include <mutex>
   #include <condition_variable>

   class ThreadPool {
       std::vector<std::thread> workers_;
       std::queue<std::function<void()>> tasks_;
       std::mutex mtx_;
       std::condition_variable cv_;
       bool stop_ = false;

   public:
       ThreadPool(size_t threads) {
           for (size_t i = 0; i < threads; ++i) {
               workers_.emplace_back([this] {
                   while (true) {
                       std::function<void()> task;
                       {
                           std::unique_lock lock(mtx_);
                           cv_.wait(lock, [this] { return stop_ || !tasks_.empty(); });
                           if (stop_ && tasks_.empty()) return;
                           task = std::move(tasks_.front());
                           tasks_.pop();
                       }
                       task();
                   }
               });
           }
       }

       ~ThreadPool() {
           {
               std::lock_guard lock(mtx_);
               stop_ = true;
           }
           cv_.notify_all();
           for (std::thread& worker : workers_) {
               if (worker.joinable()) worker.join();
           }
       }
   };

   ```

   **Типичная ошибка:** Вызывать `notify_all()` до установки флага `stop_ = true` под мьютексом, либо забывать `worker.join()` в деструкторе, из-за чего вызывается `std::terminate`.

   **Источник:** [Cppreference: std::thread::~thread](https://en.cppreference.com/w/cpp/thread/thread/%7Ethread)

   ---

10. Объяснить, почему код с detach() опасен по lifecycle

   **Ответ:** Метод `std::thread::detach()` отделяет поток выполнения от объекта C++, передавая управление исполнением среде выполнения. Если фоновый поток обращается к объектам по ссылке или указателю (включая переменные стека, ресурсы родительского объекта или глобальные статические синглтоны), их уничтожение в основном потоке приводит к use-after-free и UB.

   **Пример:**

   ```cpp
   // ОШИБКА:
   void launch_async_worker() {
       int local_data = 42;
       std::thread([&local_data] {
           // Функция launch_async_worker завершилась, local_data на стеке уничтожена!
           std::this_thread::sleep_for(std::chrono::milliseconds(10));
           int val = local_data; // UB: Use-after-free
       }).detach();
   }

   // РЕШЕНИЕ:
   // Использовать явное управление временем жизни: std::jthread (C++20),
   // передачу владения копированием/shared_ptr или скоуп-менеджеры (joinable).

   ```

   **Типичная ошибка:** Считать, что `detach()` позволяет «запустить и забыть» задачу без последствий. При выходе из `main()` статические деструкторы разрушают глобальные объекты, пока detached-потоки продолжают исполняться, что вызывает спорадические сегфолты при завершении программы.

   **Источник:** [C++ Core Guidelines: CP.26: Don't detach() a thread](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rconc-detach)

   ---

# 10. Что особенно отличает strong senior answer


На senior-собеседовании оценивается системный подход к архитектуре, надёжности и ресурсам:

* **Correctness vs Performance:** Сначала доказывается абсолютная корректность протокола синхронизации и отсутствие гонок данных, и только затем обсуждается оптимизация задержек или пропускной способности.
* **Lifetime & Ownership:** Чёткое понимание того, кто владеет разделяемым ресурсом, в какой момент он разрушается и как предотвратить use-after-free (RAII, `std::shared_ptr`, `std::jthread`).
* **Thread-safe API Contract:** Понимание того, что набор отдельно взятых потокобезопасных методов не образует потокобезопасного сценария использования (классическая проблема `empty()` / `pop()`).
* **Publication & Visibility:** Понимание работы модели памяти C++: как запись одного потока становится видна другому потоку (отношения *happens-before*, *synchronizes-with*, барьеры памяти и релаксированные операции).
* **Graceful Shutdown & Cancellation:** Проектирование систем с возможностью предсказуемой остановки без зависания очередей, утечек задач и обрыва ресурсов.
* **Прагматичный Lock-Free:** Трезвая оценка lock-free структур: понимание того, что они сложны в тестировании, подвержены проблеме ABA, часто проигрывают мьютексам при сильной конкуренции и требуют явных стратегий безопасного освобождения памяти.
* **Продакшен-метрики и железо:** Обсуждение поведения кода на реальном оборудовании: contention, tail latency (хвостовые задержки), cache line bouncing, false sharing и safe memory reclamation (hazard pointers, epoch-based reclamation).
