## 1. Основы

1. Что такое concurrency?

   **Ответ:** Concurrency (конкурентность) — это архитектурное свойство системы, позволяющее декомпозировать программу на независимые потоки управления (задачи), которые могут продвигаться вперед независимо, перекрываясь во времени. На одноядерном процессоре это достигается за счет вытесняющей многозадачности (timeslicing).

   **Пример:**

   ```
   // Конкурентное выполнение двух задач:
   void task1() { /* обработка сети */ }
   void task2() { /* обновление интерфейса */ }
   // Задачи запускаются в отдельных потоках и могут чередоваться на одном ядре

   ```

   **Источник:** [Rob Pike: Concurrency is not Parallelism](https://go.dev/blog/waza-talk?utm_source=gemini)

2. Что такое parallelism?

   **Ответ:** Parallelism (параллелизм) — это одновременное физическое выполнение нескольких вычислительных инструкций или задач в один и тот же момент времени на разных физических ядрах процессора, процессорах или векторных исполнительных блоках (SIMD/GPU).

   **Пример:**

   ```
   #include <algorithm>
   #include <execution>
   #include <vector>

   // Параллельная сортировка на доступных физических ядрах CPU:
   std::vector<int> data(1'000'000);
   std::sort(std::execution::par, data.begin(), data.end());

   ```

   **Источник:** [cppreference: Execution policies](https://en.cppreference.com/w/cpp/algorithm/execution_policy_tag_t?utm_source=gemini)

3. Чем concurrency отличается от parallelism?

   **Ответ:** Concurrency — это про структурирование программы как набора независимых процессов, которые потенциально могут выполняться параллельно («concurrency is about structure»). Parallelism — это про фактическое аппаратное одновременное выполнение вычислений («parallelism is about execution»). Конкурентная программа может исполняться на единственном ядре, параллельная всегда требует аппаратной множественности.

   **Пример:**

   ```
   // Одноядерный CPU: Concurrency есть (потоки переключаются), Parallelism равен 1.
   // 8-ядерный CPU: Concurrency + Parallelism (до 8 потоков на такт).

   ```

   **Источник:** [Anthony Williams: C++ Concurrency in Action (Chapter 1)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

4. Чем поток отличается от процесса?

   **Ответ:** Процесс — это изолированная сущность операционной системы со своим собственным виртуальным адресным пространством, таблицей файловых дескрипторов и защитой памяти. Поток (thread) — это легковесная единица выполнения внутри процесса: все потоки одного процесса делят общее адресное пространство, кучу и глобальные переменные, имея при этом собственные стеки и регистры процессора.

   **Пример:**

   ```
   int shared_global = 0; // Доступна ВСЕМ потокам внутри одного процесса
   // В разных процессах у каждого была бы своя изолированная копия shared_global

   ```

   **Источник:** [Silberschatz, Galvin: Operating System Concepts (Processes and Threads)](https://www.os-book.com/?utm_source=gemini)

5. Что такое context switch?

   **Ответ:** Context switch (переключение контекста) — процедура ядра операционной системы или планировщика, сохраняющая состояние регистров процессора, программного счетчика (PC) и указателя стека (SP) текущего активного потока, и загружающая сохраненное состояние другого потока для продолжения его исполнения.

   **Пример:**

   ```
   // Запуск сотен потоков провоцирует постоянные переключения контекста:
   // ОС: сохранить R1-R15 потока 1 -> переключить CR3/SP -> загрузить регистры потока 2

   ```

   **Источник:** [Linux man-pages: sched(7)](https://man7.org/linux/man-pages/man7/sched.7.html?utm_source=gemini)

6. Почему context switch дорогой?

   **Ответ:** Помимо прямого времени работы ядра ОС на смену таблиц и регистров (\~1–3 мкс), основная стоимость вызвана косвенным ущербом для аппаратуры: сброс конвейера CPU, инвалидация буфера ассоциативной трансляции (TLB) при смене процессов и вытеснение горячих данных из процессорных кэшей L1/L2 (ухудшение cache locality).

   **Пример:**

   ```
   // Высокий показатель cswch в утилите vmstat говорит о деградации:
   // vmstat 1 -> поле 'cs' (context switches per second) > 100 000

   ```

   **Источник:** [Brendan Gregg: Systems Performance (Context Switches)](https://www.brendangregg.com/methodology.html?utm_source=gemini)

7. Что такое race condition?

   **Ответ:** Race condition (состояние гонки) — логическая ошибка синхронизации, при которой корректность поведения или конечный результат программы зависят от случайного порядка или таймингов чередования выполнения инструкций независимых потоков.

   **Пример:**

   ```
   // Поток A: if (queue.empty() == false)
   // Поток B успел вызвать queue.pop()
   // Поток A: auto item = queue.pop(); // Ошибка: очередь уже пуста!

   ```

   **Источник:** [ISO C++ Guidelines: Concurrency (CP.2)](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#cp2-avoid-data-races)

8. Что такое data race в C++?

   **Ответ:** Data race (гонка по данным) — специфическая ситуация в памяти C++, возникающая, когда два или более потока одновременно обращаются к одной и той же ячейке памяти (конфликтный доступ), хотя бы один из них выполняет операцию записи, и между этими обращениями нет отношения синхронизации (happens-before).

   **Пример:**

   ```
   int counter = 0;
   // Поток 1: counter++;
   // Поток 2: counter++; // Data race, если нет std::atomic или std::mutex

   ```

   **Источник:** [ISO C++ Standard: Data races (§ 6.9.2.2 \[intro.races\])](https://eel.is/c++draft/intro.races?utm_source=gemini)

9. Чем data race опасен в C++?

   **Ответ:** Согласно стандарту C++, любое наличие data race приводит к Неопределенному Поведению (Undefined Behavior). Компилятор имеет право предполагать отсутствие гонок по данным, что приводит к некорректным оптимизациям (вынос чтений из цикла, разрыв неатомарных операций на части) и разрушению структур в памяти.

   **Пример:**

   ```
   // Чтение неатомарного double может прочитать 4 байта старого значения
   // и 4 байта нового значения (Tearing / повреждение значения в памяти).

   ```

   **Источник:** [Hans Boehm: Threads Cannot be Implemented as a Library (PLDI 2005)](https://www.hpl.hp.com/techreports/2004/HPL-2004-209.pdf?utm_source=gemini)

10. Что такое deadlock?

    **Ответ:** Deadlock (взаимная блокировка) — критическое состояние многопоточной системы, при котором два или более потока взаимно заблокированы в ожидании освобождения ресурсов (например, мьютексов), удерживаемых друг другом, и ни один из них не может продолжить работу.

    **Пример:**

    ```
    // Поток 1 удерживает mtxA, ждет mtxB
    // Поток 2 удерживает mtxB, ждет mtxA -> Deadlock

    ```

    **Источник:** [Coffman, E. G.: System Deadlocks (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/356586.356588?utm_source=gemini)

11. Что такое livelock?

    **Ответ:** Livelock (активная блокировка) — состояние системы, при котором два или более потока активно меняют свои внутренние состояния в ответ на действия друг друга, потребляя 100% времени CPU, но не совершают никакого полезного прогресса в алгоритме.

    **Пример:**

    ```
    // Два потока бесконечно уступают ресурс друг другу в цикле:
    while (resource_busy) {
        yield(); // Оба вежливо отступают и снова сталкиваются
    }

    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Deadlock and Livelock)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

12. Что такое starvation?

    **Ответ:** Starvation (голодание) — ситуация, при которой поток с корректной логикой выполнения длительное время или бесконечно не может получить доступ к необходимому разделяемому ресурсу или кванту процессорного времени из-за несправедливого распределения ресурсов в пользу других потоков.

    **Пример:**

    ```
    // Высокоприоритетные потоки непрерывно захватывают мьютекс,
    // из-за чего низкоприоритетный поток голодает (не может войти в секцию).

    ```

    **Источник:** [The Art of Multiprocessor Programming (Herlihy & Shavit)](https://www.elsevier.com/books/the-art-of-multiprocessor-programming/herlihy/978-0-12-397337-5?utm_source=gemini)

13. Что такое contention?

    **Ответ:** Contention (конкуренция / соперничество за ресурс) — состояние, возникающее, когда несколько параллельных потоков одновременно запрашивают доступ к одной и той же критической секции, мьютексу, кэш-линии или аппаратному блоку.

    **Пример:**

    ```
    std::mutex mtx;
    // 16 потоков на 16 ядрах одновременно делают mtx.lock():
    // Высокий contention приводит к сериализации и задержкам на замке.

    ```

    **Источник:** [Brendan Gregg: Systems Performance (Contention)](https://www.brendangregg.com/methodology.html?utm_source=gemini)

14. Почему многопоточность может замедлять код?

    **Ответ:** Из-за накладных расходов синхронизации: затраты на захват и освобождение блокировок, сериализация потоков в очередях мьютексов (contention), переключения контекста ядра, промахи кэша CPU (cache bouncing) и эффект ложного разделения данных (false sharing).

    **Пример:**

    ```
    // Параллельный подсчет с записью в общий атомик работает медленнее одного потока:
    std::atomic<int> sum{0};
    // Потоки перегружают шину когерентности памяти (Cache Invalidation storm)

    ```

    **Источник:** [Fedore Pikus: The Art of Writing Efficient Programs](https://www.packtpub.com/product/the-art-of-writing-efficient-programs/9781800208117?utm_source=gemini)

15. Что такое thread-safe код?

    **Ответ:** Thread-safe (потокобезопасный) код — это фрагмент программы (функция, класс, модуль), гарантирующий корректность своего поведения, сохранение инвариантов структур данных и отсутствие data races при одновременном обращении к нему из нескольких потоков без дополнительной внешней синхронизации со стороны пользователя.

    **Пример:**

    ```
    class SafeCounter {
        std::atomic<int> val_{0};
    public:
        void inc() { val_.fetch_add(1, std::memory_order_relaxed); } // Thread-safe
    };

    ```

    **Источник:** [C++ Core Guidelines: CP.con: Concurrency Rules](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#cpcon-concurrency)

## 2. Модель памяти

16. Что такое memory model в C++?

    **Ответ:** Модель памяти C++ (формализована в стандарте C++11) — это спецификация, определяющая контракт между программистом, компилятором и аппаратурой: правила взаимодействия потоков через оперативную память, допустимые переупорядочивания операций и гарантии видимости записей между потоками.

    **Пример:**

    ```
    // Стандарт определяет семантику атомиков, гонок и барьеров:
    #include <atomic>
    std::atomic<int> a;

    ```

    **Источник:** [cppreference: Memory model](https://en.cppreference.com/w/cpp/language/memory_model?utm_source=gemini)

17. Что такое happens-before?

    **Ответ:** Отношение happens-before («произошло-до») — фундаментальное транзитивное отношение порядка между двумя операциями в C++. Если операция $A$ happens-before операции $B$, то все изменения в памяти, сделанные операцией $A$, гарантированно видимы операции $B$, и $A$ логически предшествует $B$.

    **Пример:**

    ```
    // Запись данных (A) happens-before чтения этих данных (B)
    // благодаря межпоточной синхронизации acquire-release.

    ```

    **Источник:** [ISO C++ Standard: Happens before order (§ 6.9.2.1 \[intro.multithread\])](https://eel.is/c++draft/intro.multithread?utm_source=gemini)

18. Что такое sequenced-before?

    **Ответ:** Sequenced-before — отношение строгого частичного порядка между вычислениями, выполняемыми внутри **одного и того же** потока управления, задаваемое грамматическими правилами языка C++ (например, точка с запятой или оператор запятая).

    **Пример:**

    ```
    int a = 1; // Вычисление A sequenced-before вычисления B:
    int b = a + 2; // B

    ```

    **Источник:** [cppreference: Order of evaluation](https://en.cppreference.com/w/cpp/language/eval_order?utm_source=gemini)

19. Что такое synchronization?

    **Ответ:** Синхронизация — это применение языковых или аппаратных механизмов (мьютексов, атомарных операций, барьеров памяти), устанавливающих отношение межпоточного упорядочивания (synchronizes-with), что исключает состояние гонки и обеспечивает корректную передачу данных между потоками.

    **Пример:**

    ```
    std::atomic<bool> flag{false};
    // Поток 1: flag.store(true, std::memory_order_release); // Synchronizes-with
    // Поток 2: while(!flag.load(std::memory_order_acquire)); // потоком 2

    ```

    **Источник:** [Jeff Preshing: Synchronizes-With vs Happens-Before](https://preshing.com/20130823/the-synchronizes-with-relation/?utm_source=gemini)

20. Что такое visibility?

    **Ответ:** Visibility (видимость) — свойство многопоточной памяти, определяющее, когда модификация ячейки памяти, выполненная одним ядром процессора (сохраненная в локальный Store Buffer/L1-кэш), становится фактически доступной для чтения инструкциями, исполняемыми на другом ядре.

    **Пример:**

    ```
    // Без барьера запись в переменную x может часами оставаться в Store Buffer ядра
    // и быть невидимой для другого ядра CPU.

    ```

    **Источник:** [A Primer on Memory Consistency and Cache Coherence (Sorin et al.)](https://www.morganclaypool.com/doi/abs/10.2200/S00346ED1V01Y201104CAC016?utm_source=gemini)

21. Что такое ordering?

    **Ответ:** Ordering (упорядочивание) — правила и ограничения, накладываемые на последовательность исполнения операций чтения (`load`) и записи (`store`) в память, предотвращающие их опасную перестановку оптимизаторами компилятора или суперскалярным процессором.

    **Пример:**

    ```
    std::atomic_thread_fence(std::memory_order_seq_cst); // Барьер упорядочивания

    ```

    **Источник:** [cppreference: std::memory_order](https://en.cppreference.com/w/cpp/atomic/memory_order?utm_source=gemini)

22. Что такое compiler reordering?

    **Ответ:** Compiler reordering — перестановка порядка инструкций чтения и записи в память оптимизатором компилятора на этапе генерации ассемблерного кода для более эффективного заполнения конвейера CPU, если такая перестановка не нарушает правил вычисления в рамках текущего единичного потока (As-If Rule).

    **Пример:**

    ```
    // Исходный код:       // Компилятор может сгенерировать:
    ready = true;          val = 42;
    val = 42;              ready = true; // Для другого потока флаг готов раньше значения!

    ```

    **Источник:** [Agner Fog: Optimizing Subroutines in C++](https://www.agner.org/optimize/optimizing_cpp.pdf?utm_source=gemini)

23. Что такое CPU reordering?

    **Ответ:** CPU reordering — аппаратное переупорядочивание инструкций суперскалярным процессором во время выполнения программы (Out-of-Order Execution). Процессор отправляет запросы в память через Store Buffer и инвалидационные очереди в произвольном порядке для минимизации простоев шины.

    **Пример:**

    ```
    // На уровне кремния запись может задержаться в Store Buffer,
    // а чтение выполниться спекулятивно раньше этой записи.

    ```

    **Источник:** [Intel 64 Architecture Memory Ordering Whitepaper](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html?utm_source=gemini)

24. Почему на x86 код иногда “случайно работает”, а на ARM ломается?

    **Ответ:** Архитектура x86 реализует сильную модель памяти TSO (Total Store Order), где аппаратные перестановки строго ограничены (запрещены перестановки Store-Store, Load-Load, Load-Store; возможен только Store-Load). Архитектура ARM имеет слабую модель памяти (Weakly-Ordered), где процессор имеет право переставлять любые операции памяти местами, обнажая пропущенные барьеры синхронизации.

    **Пример:**

    ```
    // Без явного std::memory_order_release:
    // На x86 запись флага не обойдет запись данных аппаратно.
    // На ARM процессор свободно переставит записи местами, сломав логику.

    ```

    **Источник:** [Arm Architecture Reference Manual (Memory Model)](https://developer.arm.com/documentation/ddi0487/latest/?utm_source=gemini)

25. Что такое `memory_order_relaxed`?

    **Ответ:** `memory_order_relaxed` — режим упорядочивания памяти, гарантирующий исключительно атомарность модификации целевой переменной и отсутствие разрыва байтов (non-tearing), но полностью исключающий любые ограничения на перестановку операций относительно других чтений и записей.

    **Пример:**

    ```
    std::atomic<int> counter{0};
    // Просто счетчик: не синхронизирует состояние других данных
    counter.fetch_add(1, std::memory_order_relaxed);

    ```

    **Источник:** [cppreference: memory_order_relaxed](https://en.cppreference.com/w/cpp/atomic/memory_order?utm_source=gemini#Relaxed_ordering?utm_source=gemini)

26. Что такое `memory_order_acquire`?

    **Ответ:** `memory_order_acquire` — операция чтения из атомика, запрещающая компилятору и процессору переносить любые последующие операции чтения или записи в память **выше** (до) этой операции acquire.

    **Пример:**

    ```
    while (!ready.load(std::memory_order_acquire));
    // Все последующие чтения данных гарантированно увидят актуальные значения:
    int x = payload_data;

    ```

    **Источник:** [ISO C++ Standard: Acquire-Release (§ 31.4 \[atomics.order\])](https://eel.is/c++draft/atomics.order?utm_source=gemini)

27. Что такое `memory_order_release`?

    **Ответ:** `memory_order_release` — операция записи в атомик, запрещающая компилятору и процессору переносить любые предшествующие операции чтения или записи в память **ниже** (после) этой операции release.

    **Пример:**

    ```
    payload_data = 42; // Подготовка данных
    // Публикация: запись данных не опустится ниже флага:
    ready.store(true, std::memory_order_release);

    ```

    **Источник:** [cppreference: memory_order_release](https://en.cppreference.com/w/cpp/atomic/memory_order?utm_source=gemini#Release-Acquire_ordering?utm_source=gemini)

28. Что дает acquire-release пара?

    **Ответ:** Пара «запись с `release`» в одном потоке и «чтение с `acquire`» того же значения в другом потоке формирует межпоточное отношение synchronizes-with. Это гарантирует, что всё, что было записано первым потоком до вызова `release`, становится полностью видимым второму потоку после вызова `acquire`.

    **Пример:**

    ```
    // Поток 1: data = 100; ready.store(true, memory_order_release);
    // Поток 2: if (ready.load(memory_order_acquire)) assert(data == 100); // Всегда верно!

    ```

    **Источник:** [Jeff Preshing: The Purpose of memory_order_consume/acquire/release](https://preshing.com/20120913/acquire-and-release-semantics/?utm_source=gemini)

29. Что такое `memory_order_seq_cst`?

    **Ответ:** `memory_order_seq_cst` (Sequentially Consistent) — самый строгий режим по умолчанию. Он включает в себя acquire-release семантику и дополнительно накладывает гарантию единого глобального порядка (total globally consistent order) всех `seq_cst` операций во всей программе, одинаково наблюдаемого всеми потоками.

    **Пример:**

    ```
    std::atomic<int> x{0}, y{0};
    // По умолчанию операции используют seq_cst:
    x.store(1); // Гарантирует абсолютную предсказуемость порядка для всех CPU

    ```

    **Источник:** [Leslie Lamport: How to Make a Multiprocessor Computer That Correctly Executes Multiprocess Programs](https://lamport.azurewebsites.net/pubs/multi.pdf?utm_source=gemini)

30. Когда `relaxed` оправдан?

    **Ответ:** Он оправдан тогда, когда атомарная переменная используется изолированно и не служит флагом готовности или защитником других структур данных: например, счетчики посещений сайта, генераторы уникальных числовых ID, сбор метрик или прогресс-бары.

    **Пример:**

    ```
    std::atomic<uint64_t> metrics_requests_total{0};
    metrics_requests_total.fetch_add(1, std::memory_order_relaxed); // Идеально

    ```

    **Источник:** [C++ Core Guidelines: CP.atomic: Don't use relaxed unless you have to](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

## 3. `std::thread`, `std::jthread`

31. Как создать поток в C++?

    **Ответ:** Создать поток можно через инстанцирование объекта `std::thread` (начиная с C++11), передав ему в конструктор вызываемый объект (функцию, лямбду, функтор или метод класса) и его аргументы. Поток запускается на исполнение немедленно в момент создания.

    **Пример:**

    ```
    #include <thread>
    void worker(int id) { /*...*/ }

    std::thread t(worker, 1);
    t.join();

    ```

    **Источник:** [cppreference: std::thread::thread](https://en.cppreference.com/w/cpp/thread/thread/thread?utm_source=gemini)

32. Что делает `join()`?

    **Ответ:** Метод `join()` блокирует выполнение вызывающего потока до тех пор, пока целевой поток, ассоциированный с объектом `std::thread`, полностью не завершит свое выполнение и не вернет управление. После этого поток перестает быть joinable (`t.joinable() == false`).

    **Пример:**

    ```
    std::thread t([]() { /* долгая работа */ });
    t.join(); // Ждем завершения t перед тем, как продолжить main

    ```

    **Источник:** [cppreference: std::thread::join](https://en.cppreference.com/w/cpp/thread/thread/join?utm_source=gemini)

33. Что делает `detach()`?

    **Ответ:** Метод `detach()` разрывает связь между объектом `std::thread` в программе и реальным низкоуровневым потоком операционной системы. Поток становится фоновым (daemon-like), продолжает жить самостоятельно, а его ресурсы автоматически освобождаются ОС при его завершении.

    **Пример:**

    ```
    std::thread t([]() { background_cleanup(); });
    t.detach(); // t больше не ассоциирован с потоком выполнения

    ```

    **Источник:** [cppreference: std::thread::detach](https://en.cppreference.com/w/cpp/thread/thread/detach?utm_source=gemini)

34. Что будет, если уничтожить joinable `std::thread`?

    **Ответ:** Если деструктор `std::thread` вызывается для объекта, который всё еще является `joinable` (для него не были вызваны ни `join()`, ни `detach()`), рантайм C++ немедленно аварийно завершает работу всей программы вызовом `std::terminate()`.

    **Пример:**

    ```
    void bad_func() {
        std::thread t([](){});
        // Забыли t.join(); при выходе из функции сработает std::terminate()
    }

    ```

    **Источник:** [cppreference: std::thread::\~thread](https://en.cppreference.com/w/cpp/thread/thread/~thread?utm_source=gemini)

35. Почему `detach()` часто плохая идея?

    **Ответ:** Поток с `detach()` теряет предсказуемый жизненный цикл. Если программа завершит `main()`, фоновый detached-поток будет грубо уничтожен посреди выполнения, не вызвав деструкторы стековых объектов, либо он может попытаться обратиться к уже освобожденной глобальной памяти процесса, вызвав Segmentation Fault.

    **Пример:**

    ```
    void start() {
        int local_data = 42;
        std::thread([&local_data](){ /* обращение к умершей local_data! */ }).detach();
    }

    ```

    **Источник:** [C++ Core Guidelines: CP.26: Don't detach a thread](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#cp26-dont-detach-a-thread)

36. Когда `detach()` допустим?

    **Ответ:** `detach()` допустим крайне редко: только для долгоживущих системных фоновых сервисов уровня всего процесса (например, фоновый поток мониторинга оборудования или логирования), которые оперируют строго бесконечным циклом и не используют ссылки на локальные стековые объекты.

    **Пример:**

    ```
    // Фоновый сборщик статистики, не использующий внешние локальные ресурсы:
    std::thread([]() { run_os_heartbeat(); }).detach();

    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Detaching threads)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

37. Чем `std::jthread` лучше `std::thread`?

    **Ответ:** Класс `std::jthread` (C++20) реализует идиому RAII: он автоматически вызывает `request_stop()` и `join()` в своем деструкторе, предотвращая падение программы по `std::terminate()`. Кроме того, он нативно интегрирован с механизмом кооперативной отмены задач через `std::stop_token`.

    **Пример:**

    ```
    #include <thread>
    void task() {
        std::jthread jt([](std::stop_token st) {
            while (!st.stop_requested()) { /* работа */ }
        });
    } // В конце блока деструктор jt сам запросит остановку и сделает join!

    ```

    **Источник:** [cppreference: std::jthread](https://en.cppreference.com/w/cpp/thread/jthread?utm_source=gemini)

38. Что такое cooperative cancellation?

    **Ответ:** Кооперативная отмена — это безопасный подход к остановке потоков, при котором поток нельзя принудительно убить извне (что привело бы к зависшим мьютексам и утечкам памяти). Вместо этого управляющий поток выставляет запрос на остановку, а рабочий поток периодически сам опрашивает этот флаг и корректно освобождает ресурсы.

    **Пример:**

    ```
    if (stop_token.stop_requested()) {
        cleanup();
        return; // Поток сам решает корректно выйти
    }

    ```

    **Источник:** [ISO C++ Standard: Stop tokens (§ 32.3 \[thread.stoptoken\])](https://eel.is/c++draft/thread.stoptoken?utm_source=gemini)

39. Что такое `std::stop_token`?

    **Ответ:** `std::stop_token` (C++20) — легковесный потокобезопасный объект, передаваемый в исполняемую функцию `std::jthread`. Он позволяет проверять, поступил ли запрос на остановку потока (`stop_requested()`), или регистрировать обратные вызовы (`std::stop_callback`) на случай отмены.

    **Пример:**

    ```
    std::jthread worker([](std::stop_token st) {
        while (!st.stop_requested()) {
            do_step();
        }
    });
    worker.request_stop(); // Выставляет флаг в st

    ```

    **Источник:** [cppreference: std::stop_token](https://en.cppreference.com/w/cpp/thread/stop_token?utm_source=gemini)

40. Как корректно останавливать worker thread?

    **Ответ:** 1) Послать сигнал остановки (через `std::stop_source` или атомарный флаг); 2) Разбудить поток, если он находится в состоянии ожидания (через `condition_variable.notify_all()` или `std::condition_variable_any`); 3) Внутри потока обработать выход из цикла, завершить транзакции и освободить память; 4) Выполнить `join()`.

    **Пример:**

    ```
    // C++20: jthread делает это автоматически благодаря интеграции stop_token
    std::jthread th([](std::stop_token st) {
        while (!st.stop_requested()) {
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
        }
    });

    ```

    **Источник:** [C++ Core Guidelines: CP.42: Don't wait without a condition](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

## 4. Передача данных между потоками

41. Чем опасна передача ссылки в поток?

    **Ответ:** Опасностью возникновения висячей ссылки (Dangling Reference) и Data Race. Если поток переживет область видимости переменной, на которую ссылается, он обратится к уничтоженной памяти на чужом стеке (Use-After-Free), что приведет к непредсказуемому крашу.

    **Пример:**

    ```
    void bad() {
        int val = 10;
        // Ошибка: val будет уничтожен при выходе из bad(), а поток продолжит чтение
        std::thread t([](int& x) { use(x); }, std::ref(val));
        t.detach();
    }

    ```

    **Источник:** [Scott Meyers: Effective Modern C++ (Item 37)](https://www.oreilly.com/library/view/effective-modern-c/9781491903988/?utm_source=gemini)

42. Когда безопасно передавать указатель в поток?

    **Ответ:** Передача указателя безопасна, когда: 1) объект живет дольше потока (например, статический объект); 2) владение объектом монопольно передается потоку (через `std::unique_ptr`); 3) доступ к данным за указателем синхронизирован мьютексом.

    **Пример:**

    ```
    auto ptr = std::make_unique<Data>();
    std::thread t([](std::unique_ptr<Data> p) { p->work(); }, std::move(ptr));
    t.join();

    ```

    **Источник:** [C++ Core Guidelines: CP.31: Pass small values by value, others by unique_ptr](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

43. Когда лучше передавать данные по значению?

    **Ответ:** Передача по значению предпочтительна для небольших объектов, примитивных типов и структур данных, когда потоку требуется собственный независимый снимок (snapshot) состояния без накладных расходов на межпоточную синхронизацию и без рисков гонок по памяти.

    **Пример:**

    ```
    int config_id = 42;
    std::thread t([config_id]() { /* Изолированная копия config_id */ });
    t.join();

    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Passing arguments)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

44. Что делать с владением объектом между потоками?

    **Ответ:** Необходимо явно моделировать семантику владения (ownership): передавать эксклюзивное владение через семантику перемещения `std::unique_ptr`, разделять владение через `std::shared_ptr`, либо передавать сообщения через потокобезопасные очереди задач (Actor/Message Passing model).

    **Пример:**

    ```
    std::queue<std::unique_ptr<Task>> task_queue; // Владение передается через очередь

    ```

    **Источник:** [C++ Core Guidelines: I.11: Never transfer ownership by a raw pointer](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

45. Чем `shared_ptr` не решает все проблемы синхронизации?

    **Ответ:** `std::shared_ptr` защищает только собственный контрольный блок (счетчик ссылок потокобезопасен). Сам объект, на который указывает `shared_ptr`, никак не защищен: одновременное чтение и запись данных внутри объекта из разных потоков является классическим Data Race.

    **Пример:**

    ```
    auto ptr = std::make_shared<std::vector<int>>();
    // Поток 1: ptr->push_back(1);
    // Поток 2: ptr->push_back(2); // DATA RACE! Объекту требуется mutex

    ```

    **Источник:** [cppreference: std::shared_ptr thread safety](https://en.cppreference.com/w/cpp/memory/shared_ptr?utm_source=gemini#Thread_safety?utm_source=gemini)

46. Атомарен ли сам `shared_ptr`?

    **Ответ:** Нет, сам экземпляр `std::shared_ptr` (пара: указатель на объект + указатель на контрольный блок) не атомарен. Конкурентное переприсваивание одного и того же объекта `shared_ptr` из двух потоков требует использования `std::atomic<std::shared_ptr<T>>` (начиная с C++20) или функций `std::atomic_load/store`.

    **Пример:**

    ```
    // C++20 потокобезопасный указатель:
    std::atomic<std::shared_ptr<Config>> global_config;
    global_config.store(std::make_shared<Config>());

    ```

    **Источник:** [cppreference: std::atomic](https://en.cppreference.com/w/cpp/memory/shared_ptr/atomic2?utm_source=gemini)<std::shared_ptr>

47. Что такое publication объекта между потоками?

    **Ответ:** Publication (публикация) — это процесс конструирования и последующего предоставления ссылки или указателя на объект другим потокам. Публикация считается безопасной, только если гарантировано, что читающие потоки увидят полностью проинициализированный объект со всеми его инвариантами.

    **Пример:**

    ```
    // Опасная публикация: указатель опубликован, но поля объекта еще не доехали из Store Buffer!

    ```

    **Источник:** [Java Concurrency in Practice (Goetz et al. - Safe Publication)](https://jcip.net/?utm_source=gemini)

48. Как безопасно публиковать объект?

    **Ответ:** Безопасная публикация достигается через: 1) захват и освобождение `std::mutex`; 2) запись указателя через `std::atomic` с `memory_order_release` и чтение с `memory_order_acquire`; 3) статическую инициализацию (Meyers Singleton); 4) передачу через `std::promise` / `std::future`.

    **Пример:**

    ```
    std::atomic<Data*> published_ptr{nullptr};
    // Поток 1:
    auto* d = new Data();
    published_ptr.store(d, std::memory_order_release); // Безопасная публикация

    ```

    **Источник:** [C++ Core Guidelines: CP.22: Never call a virtual function while holding a lock](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

49. Почему обычный флаг `bool ready` между потоками опасен?

    **Ответ:** Обычный `bool ready` не гарантирует атомарности и упорядочивания инструкций. Это прямой Data Race (Undefined Behavior), приводящий к тому, что компилятор может закэшировать чтение флага в регистр и уйти в бесконечный цикл, либо переставить чтение данных до проверки флага.

    **Пример:**

    ```
    bool ready = false;
    // Компилятор может превратить "while (!ready)" в бесконечный цикл:
    // if (!ready) while(true);

    ```

    **Источник:** [Hans Boehm: Threads Cannot be Implemented as a Library](https://www.hpl.hp.com/techreports/2004/HPL-2004-209.pdf?utm_source=gemini)

50. Когда нужен `std::atomic<bool>` для флага?

    **Ответ:** `std::atomic<bool>` обязателен всегда, когда флаг читается одним потоком и модифицируется другим без удержания общего мьютекса. Это предотвращает Data Race, запрещает компилятору выкидывать чтение переменной и гарантирует атомарность операции на уровне шины CPU.

    **Пример:**

    ```
    std::atomic<bool> is_running{true};
    void stop() { is_running.store(false); }

    ```

    **Источник:** [cppreference: std::atomic](https://en.cppreference.com/w/cpp/atomic/atomic?utm_source=gemini)

## 5. Mutex и RAII

51. Что делает `std::mutex`?

    **Ответ:** `std::mutex` (взаимное исключение) — базовый примитив синхронизации, гарантирующий, что в любой момент времени только один поток может владеть блокировкой и исполнять критическую секцию кода, переводя остальные претендующие потоки в состояние блокировки (сна).

    **Пример:**

    ```
    #include <mutex>
    std::mutex mtx;
    void safe_print() {
        mtx.lock();
        // Только 1 поток здесь
        mtx.unlock();
    }

    ```

    **Источник:** [cppreference: std::mutex](https://en.cppreference.com/w/cpp/thread/mutex?utm_source=gemini)

52. Почему лучше RAII-обертки, чем ручной `lock/unlock`?

    **Ответ:** Ручной `lock/unlock` приводит к утечкам блокировок (Deadlock) при генерации исключений, неожиданных выходах по `return` или `break`. RAII-обертки гарантируют освобождение мьютекса в деструкторе при раскрутке стека в любых обстоятельствах.

    **Пример:**

    ```
    std::lock_guard<std::mutex> lock(mtx);
    if (error) return; // Мьютекс освободится АВТОМАТИЧЕСКИ

    ```

    **Источник:** [C++ Core Guidelines: CP.20: Use RAII, never plain lock()/unlock()](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#cp20-use-raii-never-plain-lockunlock)

53. Что делает `std::lock_guard`?

    **Ответ:** `std::lock_guard` — легковесная некопируемая RAII-обертка, которая захватывает переданный мьютекс в своем конструкторе (`mtx.lock()`) и безусловно освобождает его в деструкторе при выходе из области видимости (`mtx.unlock()`).

    **Пример:**

    ```
    void add(int x) {
        std::lock_guard<std::mutex> lock(mtx);
        shared_list.push_back(x);
    } // mtx освобожден здесь

    ```

    **Источник:** [cppreference: std::lock_guard](https://en.cppreference.com/w/cpp/thread/lock_guard?utm_source=gemini)

54. Что делает `std::unique_lock`?

    **Ответ:** `std::unique_lock` — расширенная гибкая RAII-обертка над мьютексом. В отличие от `lock_guard`, она поддерживает отложенный захват (`std::defer_lock`), явный ручной `unlock()` и `lock()`, перемещение владения (MoveConstructible) и необходима для работы с `std::condition_variable`.

    **Пример:**

    ```
    std::unique_lock<std::mutex> lock(mtx);
    // временно отпускаем мьютекс:
    lock.unlock();
    do_heavy_work();
    lock.lock();

    ```

    **Источник:** [cppreference: std::unique_lock](https://en.cppreference.com/w/cpp/thread/unique_lock?utm_source=gemini)

55. Что делает `std::scoped_lock`?

    **Ответ:** `std::scoped_lock` (C++17) — вариативная RAII-обертка, способная атомарно захватывать сразу несколько переданных мьютексов с использованием алгоритма предотвращения deadlock (аналогично `std::lock`), и безопасно освобождать их при уничтожении.

    **Пример:**

    ```
    void transfer(Account& from, Account& to, double amount) {
        // Безопасный захват двух мьютексов без риска Deadlock:
        std::scoped_lock lock(from.mtx, to.mtx);
        from.balance -= amount;
        to.balance += amount;
    }

    ```

    **Источник:** [cppreference: std::scoped_lock](https://en.cppreference.com/w/cpp/thread/scoped_lock?utm_source=gemini)

56. Когда нужен `unique_lock`, а не `lock_guard`?

    **Ответ:** Он необходим: 1) при интеграции с `std::condition_variable::wait()`; 2) когда требуется временно отпустить мьютекс внутри критической секции для выполнения долгой работы; 3) при передаче владения локом из функции; 4) при попытках захвата по таймауту (`std::timed_mutex`).

    **Пример:**

    ```
    std::unique_lock<std::mutex> lk(mtx);
    cv.wait(lk, []{ return ready; }); // lock_guard здесь передать нельзя!

    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Flexible locking)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

57. Что такое критическая секция?

    **Ответ:** Критическая секция — участок программного кода, осуществляющий доступ к разделяемым разделяемым изменяемым данным (shared mutable state), одновременное нахождение в котором более чем одного потока приводит к состоянию гонки.

    **Пример:**

    ```
    {
        std::lock_guard<std::mutex> lock(mtx);
        /* НАЧАЛО КРИТИЧЕСКОЙ СЕКЦИИ */
        shared_data++;
        /* КОНЕЦ КРИТИЧЕСКОЙ СЕКЦИИ */
    }

    ```

    **Источник:** [Dijkstra, E. W.: Cooperating Sequential Processes](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD01xx/EWD123.html?utm_source=gemini)

58. Почему критическая секция должна быть короткой?

    **Ответ:** Пока поток удерживает блокировку, все остальные потоки, претендующие на этот мьютекс, выстраиваются в очередь и усыпляются ядром ОС (contention). Длинные критические секции убивают масштабируемость системы, превращая параллельную программу в строго последовательную.

    **Пример:**

    ```
    // ПЛОХО: долгий I/O под замком
    { std::lock_guard lk(mtx); write_to_disk(data); }

    // ХОРОШО: под замком только копирование, I/O снаружи
    Data copy;
    { std::lock_guard lk(mtx); copy = data; }
    write_to_disk(copy);

    ```

    **Источник:** [C++ Core Guidelines: CP.21: Move non-shared code outside critical sections](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

59. Почему плохо вызывать чужой код под mutex?

    **Ответ:** Вызов внешнего («чужого») неизвестного кода (коллбэков, виртуальных функций, плагинов) под мьютексом чреват: 1) непредсказуемой задержкой; 2) исключением, ломающим инвариант; 3) вызовом повторного входа (reentrancy) в этот же мьютекс; 4) взаимной блокировкой (deadlock), если чужой код попытается взять другой лок.

    **Пример:**

    ```
    void notify_listeners() {
        std::lock_guard<std::mutex> lk(mtx);
        user_callback(); // ОПАСНО: callback может внутри захватить другой мьютекс!
    }

    ```

    **Источник:** [C++ Core Guidelines: CP.22: Never call an unknown function while holding a lock](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

60. Что такое lock granularity?

    **Ответ:** Lock granularity (гранулярность блокировок) — степень детализации разделения данных по мьютексам: Coarse-grained (крупнозернистая — один глобальный мьютекс на всю подсистему/таблицу) или Fine-grained (мелкозернистая — отдельный мьютекс на каждую строку, узел дерева или корзину хэш-таблицы).

    **Пример:**

    ```
    // Coarse: std::mutex global_tree_mtx;
    // Fine: struct Node { std::mutex node_mtx; ... };

    ```

    **Источник:** [The Art of Multiprocessor Programming (Fine-Grained Synchronization)](https://www.elsevier.com/books/the-art-of-multiprocessor-programming/herlihy/978-0-12-397337-5?utm_source=gemini)

## 6. Deadlock и стратегии захвата

61. Как обычно возникает deadlock?

    **Ответ:** Deadlock возникает при одновременном выполнении 4 условий Коффмана, чаще всего по сценарию перекрестного захвата (ABBA-deadlock): Поток 1 захватывает мьютекс A и ожидает мьютекс B, в то время как Поток 2 захватывает мьютекс B и ожидает мьютекс A.

    **Пример:**

    ```
    // Поток 1: lock(A); lock(B);
    // Поток 2: lock(B); lock(A); // Встретились -> Deadlock

    ```

    **Источник:** [Edward G. Coffman: System Deadlocks (1971)](https://dl.acm.org/doi/10.1145/356586.356588?utm_source=gemini)

62. Как избегать deadlock?

    **Ответ:** 1) Всегда захватывать мьютексы в строго фиксированном глобальном порядке; 2) Использовать `std::scoped_lock` или `std::lock` для одновременного захвата нескольких мьютексов; 3) Не вызывать неизвестный код под блокировкой; 4) Использовать блокировки с таймаутом (`std::unique_lock` + `try_lock_for`).

    **Пример:**

    ```
    std::scoped_lock lock(mtxA, mtxB); // Исключает deadlock

    ```

    **Источник:** [C++ Core Guidelines: CP.25: Prefer std::scoped_lock for multi-mutex locking](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

63. Что такое global lock ordering?

    **Ответ:** Global lock ordering (глобальный порядок захвата) — архитектурная договоренность или иерархия, предписывающая всем разработчикам проекта захватывать независимые мьютексы строго в определенной последовательности (например, по их уникальным адресам в памяти или уровням иерархии).

    **Пример:**

    ```
    // Захват мьютексов всегда в порядке возрастания адресов:
    void lock_two(std::mutex& a, std::mutex& b) {
        if (&a < &b) { a.lock(); b.lock(); }
        else         { b.lock(); a.lock(); }
    }

    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Hierarchical mutex)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

64. Что делает `std::lock`?

    **Ответ:** Функция `std::lock(m1, m2, ...)` атомарно захватывает произвольное количество переданных мьютексов, используя внутренний алгоритм предотвращения взаимных блокировок (deadlock avoidance algorithm, основанный на циклическом переборе с `try_lock`).

    **Пример:**

    ```
    std::unique_lock lk1(mtx1, std::defer_lock);
    std::unique_lock lk2(mtx2, std::defer_lock);
    std::lock(lk1, lk2); // Deadlock-free захват обоих

    ```

    **Источник:** [cppreference: std::lock](https://en.cppreference.com/w/cpp/thread/lock?utm_source=gemini)

65. Что такое try-lock strategy?

    **Ответ:** Стратегия неблокирующего захвата: поток пытается захватить ресурс с помощью метода `try_lock()`. Если мьютекс уже занят другим потоком, текущий поток не засыпает, а немедленно возвращает `false` и переходит к выполнению альтернативной полезной работы или отступает.

    **Пример:**

    ```
    if (mtx.try_lock()) {
        // Делаем задачу
        mtx.unlock();
    } else {
        // Ресурс занят, делаем что-то другое
    }

    ```

    **Источник:** [cppreference: std::mutex::try_lock](https://en.cppreference.com/w/cpp/thread/mutex/try_lock?utm_source=gemini)

66. Минус `try_lock`-циклов?

    **Ответ:** Плотный цикл `try_lock` превращается в активное ожидание (busy-waiting / spinning), которое сжигает 100% ресурсов ядра процессора, перегружает межъядерную шину кэша и может приводить к голоданию (starvation) или livelock.

    **Пример:**

    ```
    while (!mtx.try_lock()) {
        // Сжигает такты CPU впустую
    }

    ```

    **Источник:** [Agner Fog: Optimizing Subroutines in C++](https://www.agner.org/optimize/optimizing_cpp.pdf?utm_source=gemini)

67. Что такое recursive mutex?

    **Ответ:** `std::recursive_mutex` — тип мьютекса, который один и тот же поток может успешно захватывать повторно несколько раз без возникновения самоблокировки (self-deadlock). Мьютекс ведет счетчик захватов и освобождается только тогда, когда поток вызовет `unlock()` соответствующее число раз.

    **Пример:**

    ```
    #include <mutex>
    std::recursive_mutex r_mtx;
    void recursive_func(int n) {
        std::lock_guard<std::recursive_mutex> lk(r_mtx);
        if (n > 0) recursive_func(n - 1); // Безопасно для одного потока
    }

    ```

    **Источник:** [cppreference: std::recursive_mutex](https://en.cppreference.com/w/cpp/thread/recursive_mutex?utm_source=gemini)

68. Почему recursive mutex обычно не любят?

    **Ответ:** Он маскирует плохую архитектуру и потерю контроля над состоянием: если функция берет лок повторно, значит инварианты структуры данных могут быть разрушены предшествующим незавершенным вызовом. Кроме того, `std::recursive_mutex` медленнее обычного и не работает с `std::condition_variable`.

    **Пример:**

    ```
    // Наличие recursive_mutex часто говорит о том, что код не разбит четко
    // на публичные синхронизирующие методы и приватные методы реализации.

    ```

    **Источник:** [C++ Core Guidelines: CP.23: Prefer std::mutex over std::recursive_mutex](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#cp23-prefer-stdmutex-over-stdrecursive_mutex)

69. Что такое priority inversion?

    **Ответ:** Инверсия приоритетов — проблема планирования, когда низкоприоритетный поток захватывает мьютекс, после чего его вытесняет среднеприоритетный поток; в итоге высокоприоритетный поток, ожидающий этот мьютекс, простаивает дольше, чем менее приоритетные задачи.

    **Пример:**

    ```
    // Классический баг марсохода Mars Pathfinder (1997):
    // High-priority поток ждал мьютекс, заблокированный Low-priority потоком,
    // который не мог выполниться из-за потоков со средним приоритетом.

    ```

    **Источник:** [Mike Jones: What Really Happened on Mars? (Priority Inversion)](https://www.cs.unc.edu/~anderson/teach/comp737/notes/mars_pathfinder.html?utm_source=gemini)

70. Как уменьшать риск deadlock в больших системах?

    **Ответ:** 1) Разрабатывать строгую иерархию блокировок (lock levels); 2) Минимизировать разделяемое изменяемое состояние в пользу очередей сообщений и Actor-моделей; 3) Проводить статический и динамический анализ кода (ThreadSanitizer); 4) Захватывать не более одной блокировки за раз.

    **Пример:**

    ```
    # Сборка с детектором гонок и дэдлоков Clang/GCC:
    g++ -fsanitize=thread -g main.cpp

    ```

    **Источник:** [Google Sanitizers: ThreadSanitizer](https://github.com/google/sanitizers/wiki/ThreadSanitizerCppManual?utm_source=gemini)

## 7. Condition variable, semaphore, ожидание

71. Для чего нужна `std::condition_variable`?

    **Ответ:** `std::condition_variable` — примитив синхронизации, позволяющий потоку освободить мьютекс и эффективно уснуть (заблокироваться без траты CPU), пока другой поток не изменит разделяемое состояние и не уведомит об этом через `notify_one()` или `notify_all()`.

    **Пример:**

    ```
    #include <condition_variable>
    std::condition_variable cv;
    std::mutex mtx;
    bool ready = false;

    // Ожидание:
    std::unique_lock lk(mtx);
    cv.wait(lk, []{ return ready; });

    ```

    **Источник:** [cppreference: std::condition_variable](https://en.cppreference.com/w/cpp/thread/condition_variable?utm_source=gemini)

72. Почему `wait()` делают в цикле?

    **Ответ:** Проверка в цикле (`while(!ready) wait()`) обязательна из-за: 1) ложных пробуждений (spurious wakeups); 2) гонки между пробужденными потоками: пока поток просыпался и захватывал мьютекс, другой поток мог успеть изменить условие обратно.

    **Пример:**

    ```
    // cv.wait(lk, predicate) внутри разворачивается именно в такой цикл:
    while (!ready) {
        cv.wait(lk);
    }

    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Waiting for conditions)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

73. Что такое spurious wakeup?

    **Ответ:** Spurious wakeup (ложное пробуждение) — пробуждение потока из состояния ожидания на условной переменной операционной системой при отсутствии реального вызова `notify()` со стороны других потоков (допускается реализациями POSIX и Windows ради производительности ядерных примитивов).

    **Пример:**

    ```
    // Поток проснулся, но данные еще не готовы: без проверки предиката будет ошибка!

    ```

    **Источник:** [POSIX standard: pthread_cond_timedwait (Spurious wakeups)](https://pubs.opengroup.org/onlinepubs/9699919799/functions/pthread_cond_wait.html?utm_source=gemini)

74. Почему predicate важен?

    **Ответ:** Предикат — это булева функция, проверяющая реальное состояние разделяемых данных. Он защищает алгоритм от преждевременного выхода при ложных пробуждениях и гарантирует, что поток продолжит работу только тогда, когда требуемые данные действительно готовы.

    **Пример:**

    ```
    cv.wait(lk, [&queue]() { return !queue.empty(); }); // Предикат

    ```

    **Источник:** [C++ Core Guidelines: CP.42: Don't wait without a condition](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#cp42-dont-wait-without-a-condition)

75. Когда использовать `notify_one()`?

    **Ответ:** `notify_one()` используется тогда, когда изменение состояния может быть обработано ровно одним потоком (например, в очередь пришла одна новая задача для пула потоков), чтобы избежать паразитных пробуждений остальных воркеров.

    **Пример:**

    ```
    queue.push(task);
    cv.notify_one(); // Просыпается ровно 1 рабочий поток

    ```

    **Источник:** [cppreference: std::condition_variable::notify_one](https://en.cppreference.com/w/cpp/thread/condition_variable/notify_one?utm_source=gemini)

76. Когда нужен `notify_all()`?

    **Ответ:** `notify_all()` необходим, когда: 1) изменившееся условие касается всех ожидающих (сигнал завершения программы / shutdown); 2) один вызов удовлетворяет предикаты сразу нескольких потоков (например, пришло сразу несколько пакетов данных).

    **Пример:**

    ```
    is_stopping = true;
    cv.notify_all(); // Будим все потоки для штатного выхода

    ```

    **Источник:** [cppreference: std::condition_variable::notify_all](https://en.cppreference.com/w/cpp/thread/condition_variable/notify_all?utm_source=gemini)

77. Что такое thundering herd?

    **Ответ:** Thundering herd (проблема громогласного стада) — ситуация, когда событие пробуждает одновременно множество спящих потоков (`notify_all`), но задачу может выполнить только один из них; в результате все потоки начинают бороться за один мьютекс, растрачивая ресурсы CPU на переключения контекста.

    **Пример:**

    ```
    // 50 потоков проснулись по notify_all, 1 забрал элемент из очереди,
    // остальные 49 снова заснули, потратив тысячи тактов процессора.

    ```

    **Источник:** [Wikipedia: Thundering herd problem](https://en.wikipedia.org/wiki/Thundering_herd_problem?utm_source=gemini)

78. Нужно ли держать mutex во время `notify_*`?

    **Ответ:** Держать мьютекс во время вызова `notify` не требуется и часто не рекомендуется. Оптимальный паттерн: изменить данные под мьютексом, освободить мьютекс (`lk.unlock()`), и только потом вызвать `notify()`, чтобы разбуженный поток не наткнулся на еще заблокированный мьютекс (anti-pessimization).

    **Пример:**

    ```
    {
        std::lock_guard lk(mtx);
        ready = true;
    } // Мьютекс освобожден
    cv.notify_one(); // Разбуженный поток сразу сможет захватить мьютекс!

    ```

    **Источник:** [cppreference: std::condition_variable::notify_one](https://en.cppreference.com/w/cpp/thread/condition_variable/notify_one?utm_source=gemini)

79. Что такое semaphore?

    **Ответ:** Семафор — примитив синхронизации, управляющий доступом к общему ресурсу с помощью внутреннего целочисленного счетчика доступных разрешений (кредитов). Потоки уменьшают счетчик при входе (`acquire`) и увеличивают при выходе (`release`).

    **Пример:**

    ```
    #include <semaphore>
    // Семафор, разрешающий одновременный доступ не более чем 3 потокам:
    std::counting_semaphore<3> sem(3);
    sem.acquire(); // Взять кредит
    // работа
    sem.release(); // Вернуть кредит

    ```

    **Источник:** [Dijkstra, E. W.: Over seinpalen (Semaphores)](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD00xx/EWD74.html?utm_source=gemini)

80. Чем semaphore отличается от condition variable?

    **Ответ:** Семафор обладает внутренней памятью состояния (счетчик сохраняет вызовы `release`, даже если в данный момент никто не ждет). Condition variable памяти не имеет: вызов `notify` в момент, когда никто не ждет на `wait`, полностью теряется. Кроме того, семафор не требует сопутствующего мьютекса для ожидания.

    **Пример:**

    ```
    sem.release(); // Счетчик стал 1.
    sem.acquire(); // Следующий поток сразу пройдет без сна.

    ```

    **Источник:** [The Little Book of Semaphores (Allen B. Downey)](https://greenteapress.com/wp/semaphores/?utm_source=gemini)

## 8. Современные примитивы C++20+

81. Что такое `std::counting_semaphore`?

    **Ответ:** `std::counting_semaphore` (C++20) — шаблонный класс семафора общего вида, поддерживающий произвольное максимальное неотрицательное количество разрешений, задаваемое через шаблонный параметр.

    **Пример:**

    ```
    #include <semaphore>
    std::counting_semaphore<10> connection_pool_limiter(10);

    ```

    **Источник:** [cppreference: std::counting_semaphore](https://en.cppreference.com/w/cpp/thread/counting_semaphore?utm_source=gemini)

82. Что такое `std::binary_semaphore`?

    **Ответ:** `std::binary_semaphore` (C++20) — псевдоним (alias) для `std::counting_semaphore<1>`. Он принимает только два значения счетчика: 0 и 1. В отличие от мьютекса, бинарный семафор может быть освобожден (`release`) из совершенно другого потока, нежели тот, который вызвал `acquire`.

    **Пример:**

    ```
    std::binary_semaphore signal(0);
    // Поток 1: signal.acquire(); // Ждет сигнала от потока 2
    // Поток 2: signal.release(); // Посылает сигнал

    ```

    **Источник:** [cppreference: std::counting_semaphore](https://en.cppreference.com/w/cpp/thread/counting_semaphore?utm_source=gemini)

83. Что такое `std::latch`?

    **Ответ:** `std::latch` (C++20) — одноразовый синхронизационный барьер обратного отсчета. Потоки декрементируют счетчик (`count_down`), а ждущие потоки блокируются (`wait`), пока счетчик не достигнет нуля. После обнуления защелка не может быть перезапущена.

    **Пример:**

    ```
    #include <latch>
    std::latch start_gate(3); // Ждем 3 воркеров
    // В каждом потоке: start_gate.count_down();
    // В главном потоке: start_gate.wait(); // Все 3 готовы!

    ```

    **Источник:** [cppreference: std::latch](https://en.cppreference.com/w/cpp/thread/latch?utm_source=gemini)

84. Что такое `std::barrier`?

    **Ответ:** `std::barrier` (C++20) — многоразовый фазовый барьер для группы потоков. Потоки подходят к барьеру и блокируются на вызове `arrive_and_wait()`. Когда все $N$ потоков фазы пришли, барьер выполняет завершающий коллбэк (completion function) и автоматически открывается для следующей итерации.

    **Пример:**

    ```
    #include <barrier>
    std::barrier sync_point(4, []{ std::cout << "Phase complete!\n"; });
    // Потоки синхронно шагают от фазы к фазе:
    sync_point.arrive_and_wait();

    ```

    **Источник:** [cppreference: std::barrier](https://en.cppreference.com/w/cpp/thread/barrier?utm_source=gemini)

85. Когда latch удобнее condition variable?

    **Ответ:** Когда нужно реализовать разовую синхронизацию инициализации (one-shot rendezvous): дождаться старта пула из $N$ потоков или завершения пачки асинхронных задач. `std::latch` не требует мьютексов, очередей и предикатов, работая значительно быстрее и компактнее.

    **Пример:**

    ```
    std::latch done(10);
    // 10 воркеров делают: done.count_down();
    done.wait(); // Код тривиален и безопасен

    ```

    **Источник:** [Bryce Adelstein Lelbach: The C++20 Synchronization Library (CppCon)](https://www.youtube.com/watch?v=ZQFzMfHIxng?utm_source=gemini&utm_source=gemini)

86. Когда barrier полезен?

    **Ответ:** В фазовых циклических параллельных алгоритмах: физическое моделирование, клеточные автоматы, параллельный рендеринг, перемножение матриц, где на шаге $K+1$ всем потокам требуются готовые результаты шага $K$ от всех соседей.

    **Пример:**

    ```
    for (int step = 0; step < STEPS; ++step) {
        compute_local_cells();
        barrier.arrive_and_wait(); // Ждем всех перед обменом границами
    }

    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Synchronizing with barriers)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

87. Что такое `atomic_wait` / `atomic_notify_*`?

    **Ответ:** Это функции C++20 (`std::atomic::wait`, `notify_one`, `notify_all`), предоставляющие возможность блокирующего ожидания изменения значения атомарной переменной без явного создания `std::condition_variable` и мьютекса (внутри использует быстрые системные вызовы типа Linux `futex`).

    **Пример:**

    ```
    std::atomic<int> a{0};
    // Поток 1: ждет, пока значение равно 0
    a.wait(0);

    // Поток 2: меняет и будит
    a.store(1);
    a.notify_one();

    ```

    **Источник:** [cppreference: std::atomic::wait](https://en.cppreference.com/w/cpp/atomic/atomic/wait?utm_source=gemini)

88. Чем `atomic_wait` хорош?

    **Ответ:** Он не требует накладных расходов на создание объектов `std::condition_variable` и `std::mutex`, использует минимально возможный объем памяти (прямо внутри 4-байтного атомика) и опирается на нативную поддержку системных ядерных вызовов парковки потоков (`futex` в Linux, `WaitOnAddress` в Windows).

    **Пример:**

    ```
    // Реализация сверхлегкого события (Event) на базе 1 атомика:
    std::atomic<bool> flag{false};

    ```

    **Источник:** [Olivier Giroux: The C++20 Synchronization Library](https://wg21.link/p1135r1?utm_source=gemini)

89. Когда spin-wait лучше block-wait?

    **Ответ:** Активное ожидание (spin-wait) выгоднее, когда ожидаемая задержка наступления события экстремально мала (меньше времени переключения контекста ОС — порядка единиц микросекунд или сотен наносекунд), что устраняет оверхед на системный вызов усыпления и пробуждения ядра.

    **Пример:**

    ```
    // Высокочастотный спин-лок с паузой процессора:
    while (flag.test_and_set(std::memory_order_acquire)) {
        #if defined(__x86_64__)
        _mm_pause(); // Снижает нагрузку на конвейер CPU
        #endif
    }

    ```

    **Источник:** [Intel 64 and IA-32 Architectures Optimization Reference Manual (PAUSE instruction)](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html?utm_source=gemini)

90. Когда spin-wait плох?

    **Ответ:** При длительном ожидании или высокой конкуренции: поток на 100% сжигает вычислительную мощность ядра CPU, генерирует лишнее тепло (троттлинг), отбирает процессорное время у других потоков и может спровоцировать проблему инверсии приоритетов.

    **Пример:**

    ```
    // Если поток-владелец был вытеснен планировщиком ОС, крутящийся спинлок
    // будет бессмысленно жечь миллионы тактов, ожидая его возвращения.

    ```

    **Источник:** [Linux Kernel: Locking and Spinlocks](https://www.kernel.org/doc/Documentation/locking/spinlocks.txt?utm_source=gemini)

## 9. Atomics и lock-free

91. Что такое `std::atomic<T>`?

    **Ответ:** `std::atomic<T>` — шаблонный класс, инкапсулирующий значение типа `T` и гарантирующий, что все операции чтения, записи и модификации над ним выполняются атомарно (неделимо на машинном уровне) без возникновения Data Race.

    **Пример:**

    ```
    #include <atomic>
    std::atomic<int> counter{0};
    counter++; // Атомарная инструкция (lock inc на x86)

    ```

    **Источник:** [cppreference: std::atomic](https://en.cppreference.com/w/cpp/atomic/atomic?utm_source=gemini)

92. Что значит lock-free?

    **Ответ:** Lock-free (свободный от блокировок) — свойство параллельного алгоритма, гарантирующее, что в любой момент времени хотя бы один поток в системе гарантированно совершает полезный прогресс за конечное число шагов, даже если часть остальных потоков была приостановлена планировщиком ОС.

    **Пример:**

    ```
    // Lock-free очередь: задержка одного потока не блокирует остальные потоки намертво

    ```

    **Источник:** [Maurice Herlihy: Wait-Free Synchronization (ACM TOPLAS)](https://dl.acm.org/doi/10.1145/114005.102808?utm_source=gemini)

93. Что значит wait-free?

    **Ответ:** Wait-free (свободный от ожидания) — самый сильный класс неблокирующих алгоритмов: каждый поток гарантированно завершает свою операцию за строго ограниченное конечное число шагов, независимо от скорости, задержек и действий всех остальных потоков системы.

    **Пример:**

    ```
    // Чтение значения из std::atomic<int> является wait-free (одна инструкция mov).

    ```

    **Источник:** [Herlihy & Shavit: The Art of Multiprocessor Programming](https://www.elsevier.com/books/the-art-of-multiprocessor-programming/herlihy/978-0-12-397337-5?utm_source=gemini)

94. Что значит obstruction-free?

    **Ответ:** Obstruction-free (свободный от препятствий) — слабейший класс неблокирующей синхронизации: поток гарантированно завершит свою операцию за конечное число шагов, если все остальные конкурирующие потоки будут временно приостановлены.

    **Пример:**

    ```
    // Алгоритмы на базе Software Transactional Memory (STM) часто obstruction-free.

    ```

    **Источник:** [Herlihy, Luchangco, Moir: Obstruction-Free Synchronization (IEEE)](https://ieeexplore.ieee.org/document/1208884?utm_source=gemini)

95. Что такое CAS?

    **Ответ:** CAS (Compare-And-Swap / Compare-Exchange) — фундаментальная атомарная инструкция процессора (`CMPXCHG` на x86): она сравнивает текущее значение ячейки памяти с ожидаемым, и только в случае равенства заменяет его на новое значение, возвращая признак успеха.

    **Пример:**

    ```
    int expected = 5;
    std::atomic<int> val{5};
    bool success = val.compare_exchange_strong(expected, 10); // val стал 10

    ```

    **Источник:** [cppreference: std::atomic::compare_exchange](https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange?utm_source=gemini)

96. Чем `compare_exchange_weak` отличается от `strong`?

    **Ответ:** `compare_exchange_weak` может завершиться ложной неудачей (spurious failure — вернуть `false`, даже если значение совпадало с ожидаемым, например из-за прерывания на LL/SC процессорах вроде ARM). `weak` быстрее и предпочтителен внутри циклов `while`, а `strong` гарантирует отсутствие ложных сбоев и используется вне циклов.

    **Пример:**

    ```
    int expected = head.load();
    // В цикле ВСЕГДА используем weak для производительности:
    while (!head.compare_exchange_weak(expected, new_node)) {
        // повтор при неудаче
    }

    ```

    **Источник:** [cppreference: std::atomic::compare_exchange_weak](https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange?utm_source=gemini)

97. Что такое ABA problem?

    **Ответ:** Проблема ABA — ошибка в lock-free алгоритмах на CAS: ячейка памяти имела значение `A`, другой поток изменил ее на `B`, а затем вернул значение обратно на `A`. Поток, выполняющий CAS, видит `A`, ошибочно полагает, что состояние системы не менялось, и совершает повреждение данных (например, обращается к удаленному узлу списка).

    **Пример:**

    ```
    // Лечение: версионирование указателей (Tagged Pointers), Hazard Pointers или std::shared_ptr

    ```

    **Источник:** [Damian Dechev et al.: Practical Lock-Free Algorithms (ABA Prevention)](https://dl.acm.org/doi/10.1145/1810931.1810943?utm_source=gemini)

98. Почему lock-free не означает faster?

    **Ответ:** При высокой конкуренции (contention) циклы `compare_exchange` непрерывно перезапускаются (retries), вызывая шквал инвалидаций кэш-линий по шине процессора (cache line bouncing), что приводит к катастрофическому падению производительности по сравнению с мьютексом, который просто усыпляет лишние потоки.

    **Пример:**

    ```
    // 64 потока долбят один lock-free стек: 63 потока промахиваются на CAS на каждой итерации.

    ```

    **Источник:** [Fedore Pikus: The Art of Writing Efficient Programs (Lock-free pitfalls)](https://www.packtpub.com/product/the-art-of-writing-efficient-programs/9781800208117?utm_source=gemini)

99. Когда mutex лучше atomics?

    **Ответ:** Мьютекс превосходит атомики, когда критическая секция обновляет сразу несколько связанных переменных (сложный составной инвариант структуры данных), а также когда внутри секции требуется нетривиальная работа (выделение памяти, I/O), которую невозможно выразить единичным CAS.

    **Пример:**

    ```
    // Защитить сбалансированное красно-черное дерево или составной класс банковского счета
    // через мьютекс несравнимо проще, надежнее и быстрее, чем строить lock-free дерево.

    ```

    **Источник:** [C++ Core Guidelines: CP.atomic: Don't use atomics for complex invariants](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

100. Главное правило по concurrency в C++?

     **Ответ:** **«Make it correct first, keep it simple, and measure before optimizing»**. Начинать проектирование следует с минимизации разделяемого состояния, изоляции данных по потокам и использования стандартных высокоуровневых примитивов (`std::jthread`, `std::scoped_lock`, параллельные алгоритмы STL). К сложным lock-free структурам и тонкому ручному `memory_order` следует переходить только при доказанной профилировщиком необходимости.

     **Пример:**

     ```
     // Золотой стандарт надежного параллелизма:
     // 1. Независимые данные
     // 2. RAII блокировки
     // 3. Замер через perf / VTune / ThreadSanitizer

     ```

     **Источник:** [Bjarne Stroustrup, Herb Sutter: C++ Core Guidelines (Concurrency Philosophy)](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#cpcon-concurrency)




     [Next ->](./02_review_code.md)
