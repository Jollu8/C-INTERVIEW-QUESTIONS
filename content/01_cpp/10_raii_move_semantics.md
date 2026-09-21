# RAII_move_semantics

## Лёгкий уровень

1. Что такое RAII в C++?

   **Ответ:** RAII — это базовая идиома C++, связывающая жизненный цикл ресурса с временем жизни объекта в памяти. Захват ресурса происходит при инициализации объекта, а гарантированное освобождение — при вызове его деструктора.

   **Пример:**

   ```cpp
   #include <fstream>

   void write_data() {
       std::ofstream file("log.txt"); // ресурс захвачен в конструкторе
       file << "data";
   } // ресурс гарантированно освобождается деструктором при выходе из области видимости
   ```

   **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

2. Как расшифровывается RAII?

   **Ответ:** RAII расшифровывается как Resource Acquisition Is Initialization («получение ресурса есть инициализация»).

   **Пример:**

   ```cpp
   #include <memory>

   // Инициализация объекта влечет за собой получение (acquisition) ресурса
   auto ptr = std::make_unique<int>(42);
   ```

   **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

3. В чём основная идея RAII?

   **Ответ:** Основная идея заключается в предотвращении утечек ресурсов за счет автоматического вызова деструкторов локальных объектов при выходе из области видимости, независимо от причин выхода (штатный возврат или исключение).

   **Пример:**

   ```cpp
   #include <mutex>

   std::mutex mtx;
   void safe_section() {
       std::lock_guard<std::mutex> lock(mtx); // захват мьютекса
       // при любом выходе мьютекс будет детерминированно разблокирован
   }
   ```

   **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

4. Почему RAII считается базовым идиоматическим подходом в C++?

   **Ответ:** В C++ отсутствует сборщик мусора, а деструкторы объектов со stack-based lifetime вызываются гарантированно и детерминированно. RAII делает ручное управление ресурсами ненужным и обеспечивает строгую безопасность исключений.

   **Пример:**

   ```cpp
   #include <vector>

   void compute() {
       std::vector<int> dynamic_buffer(1024); // память выделена и будет 100% очищена
   }
   ```

   **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

5. Что такое ресурс в контексте RAII?

   **Ответ:** Ресурс — это любая сущность ограниченного количества, требующая явного получения у операционной системы или подсистемы и обязательного возврата после использования.

   **Пример:**

   ```cpp
   // Примеры ресурсов: динамическая память, файловый дескриптор, сокет, захваченный мьютекс, контекст OpenGL
   int* raw_memory = new int[10]; // сырой ресурс, требующий delete[]
   ```

   **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

6. Какие ресурсы, кроме памяти, можно оборачивать в RAII?

   **Ответ:** В RAII можно оборачивать файлы, сетевые сокеты, графические контексты, потоки выполнения, примитивы синхронизации и транзакции баз данных.

   **Пример:**

   ```cpp
   #include <thread>

   void worker() {}
   void run() {
       std::jthread t(worker); // std::jthread автоматически делает join() в деструкторе
   }
   ```

   **Источник:** [Cppreference: std::jthread](https://en.cppreference.com/w/cpp/thread/jthread)

7. Почему время жизни объекта удобно связывать со временем жизни ресурса?

   **Ответ:** Границы видимости локальных объектов (scope) очевидны и проверяются компилятором, что исключает забытые вызовы функций очистки и предотвращает доступ к уже закрытым ресурсам.

   **Пример:**

   ```cpp
   {
       std::unique_ptr<int> val = std::make_unique<int>(10);
   } // ресурс val уничтожен ровно здесь, обратиться к нему ниже невозможно синтаксически
   ```

   **Источник:** [Cppreference: Storage duration and linkage](https://en.cppreference.com/w/cpp/language/storage_duration)

8. Что такое acquire в контексте RAII?

   **Ответ:** Acquire — это этап получения (захвата) ресурса: системный вызов открытия дескриптора, блокировка мьютекса или выделение блока памяти в куче, выполняемый в конструкторе.

   **Пример:**

   ```cpp
   struct FileWrapper {
       FILE* handle;
       FileWrapper(const char* path) : handle(fopen(path, "r")) {} // acquire
       ~FileWrapper() { if (handle) fclose(handle); }
   };
   ```

   **Источник:** [Cppreference: Constructors and member initializer lists](https://en.cppreference.com/w/cpp/language/initializer_list)

9. Что такое release в контексте RAII?

   **Ответ:** Release — это освобождение ранее захваченного ресурса (закрытие дескриптора, освобождение памяти, снятие лока), выполняемое в деструкторе объекта.

   **Пример:**

   ```cpp
   struct LockGuard {
       // ...
       ~LockGuard() {
           // release ресурса
       }
   };
   ```

   **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

10. Почему конструктор часто связывают с захватом ресурса?

    **Ответ:** Конструктор обеспечивает атомарный перевод объекта в валидное рабочее состояние сразу при создании; если захват не удался, конструктор выбрасывает исключение, не допуская создания полувалидного объекта.

    **Пример:**

    ```cpp
    #include <stdexcept>

    struct Socket {
        int fd;
        Socket(int port) : fd(port > 0 ? port : -1) {
            if (fd < 0) throw std::runtime_error("Failed to acquire socket");
        }
        ~Socket() { /* close(fd) */ }
    };
    ```

    **Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

11. Почему деструктор часто связывают с освобождением ресурса?

    **Ответ:** Стандарт C++ гарантирует безусловный вызов деструктора объекта при выходе из его области видимости, что делает очистку ресурса надежной и автоматической.

    **Пример:**

    ```cpp
    struct Memory {
        int* p;
        Memory() : p(new int[100]) {}
        ~Memory() { delete[] p; } // гарантированный вызов в любой точке выхода
    };
    ```

    **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

12. Что такое deterministic destruction?

    **Ответ:** Детерминированное разрушение — это гарантия того, что деструктор объекта вызывается в строго определенной точке программы (в конце его scope или оператором `delete`), а не в случайный момент времени, как при сборке мусора.

    **Пример:**

    ```cpp
    struct Tracer {
        ~Tracer() { /* срабатывает ровно на закрывающей фигурной скобке */ }
    };
    ```

    **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

13. Почему детерминированное разрушение важно для RAII?

    **Ответ:** Оно позволяет разработчику точно знать момент освобождения ресурса, предотвращая взаимные блокировки мьютексов и исчерпание лимитов критических системных ресурсов (дескрипторов файлов).

    **Пример:**

    ```cpp
    #include <mutex>

    std::mutex m;
    void execute() {
        {
            std::lock_guard<std::mutex> lk(m);
            // мьютекс удерживается только внутри этого блока
        } // гарантированное мгновенное освобождение m
    }
    ```

    **Источник:** [Cppreference: std::lock_guard](https://en.cppreference.com/w/cpp/thread/lock_guard)

14. Что такое automatic storage duration?

    **Ответ:** Это автоматическая длительность хранения — жизненный цикл локальных нестатических переменных, память под которые выделяется при входе в блок и освобождается при выходе из него.

    **Пример:**

    ```cpp
    void foo() {
        int a = 5; // automatic storage duration
    } // a автоматически уничтожается
    ```

    **Источник:** [Cppreference: Storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

15. Почему автоматические объекты особенно хорошо сочетаются с RAII?

    **Ответ:** Объекты с automatic storage duration не требуют динамического выделения памяти для своей собственной обёртки и гарантированно вызывают деструкторы при покидании стекового фрейма.

    **Пример:**

    ```cpp
    #include <memory>

    void bar() {
        std::unique_ptr<int> ptr = std::make_unique<int>(100); // сам unique_ptr на стеке
    }
    ```

    **Источник:** [Cppreference: Storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

16. Что такое динамическая память?

    **Ответ:** Динамическая память (куча / heap / free store) — это область памяти, выделяемая и освобождаемая во время выполнения программы по запросу разработчика, время жизни которой не привязано к стеку.

    **Пример:**

    ```cpp
    int* ptr = new int(42); // память выделена в heap
    delete ptr;             // ручное освобождение
    ```

    **Источник:** [Cppreference: Memory allocation](https://en.cppreference.com/w/cpp/memory)

17. Почему raw `new` и `delete` в modern C++ стараются использовать реже?

    **Ответ:** Ручные операции `new` и `delete` чреваты утечками памяти при возникновении исключений, повторным освобождением (double delete) и обращением к памяти после освобождения (use-after-free).

    **Пример:**

    ```cpp
    // Плохо:
    // int* p = new int(10); if (check()) return; delete p; // утечка при return

    // Хорошо:
    #include <memory>
    auto p = std::make_unique<int>(10);
    ```

    **Источник:** [Cppreference: std::make_unique](https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique)

18. Что такое утечка ресурса?

    **Ответ:** Утечка ресурса — состояние программы, при котором полученный ресурс теряет все доступные ссылки или указатели на него и не может быть освобожден до завершения процесса.

    **Пример:**

    ```cpp
    void leak() {
        int* arr = new int[50];
        // возврат без delete[] arr -> утечка памяти
    }
    ```

    **Источник:** [Cppreference: Memory allocation](https://en.cppreference.com/w/cpp/memory)

19. Как RAII помогает избегать утечек?

    **Ответ:** RAII передает ответственность за вызов функции освобождения деструктору локального объекта, выполнение которого гарантируется компилятором при любых путях выполнения функции.

    **Пример:**

    ```cpp
    #include <vector>

    void no_leak() {
        std::vector<int> buffer(50); // никогда не утечет
    }
    ```

    **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

20. Что такое исключение?

    **Ответ:** Исключение в C++ — это механизм обработки непредвиденных или ошибочных ситуаций во время выполнения программы, прерывающий обычный поток инструкций и передающий управление подходящему блоку `catch`.

    **Пример:**

    ```cpp
    #include <stdexcept>

    void test(int val) {
        if (val < 0) throw std::invalid_argument("Negative value");
    }
    ```

    **Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

21. Почему RAII особенно важен при исключениях?

    **Ответ:** При возникновении исключения нормальный ход выполнения прерывается, и ручной код очистки (например, в конце функции) пропускается. RAII гарантирует вызов деструкторов при аварийном раскручивании стека.

    **Пример:**

    ```cpp
    #include <memory>

    void process() {
        auto ptr = std::make_unique<int>(10);
        throw 1; // ptr будет корректно освобожден во время unwinding
    }
    ```

    **Источник:** [Cppreference: Throwing an exception](https://en.cppreference.com/w/cpp/language/throw)

22. Что такое stack unwinding?

    **Ответ:** Раскрутка стека (stack unwinding) — это автоматический процесс уничтожения всех локальных объектов во фреймах стека от точки выброса исключения до точки его перехвата в блоке `catch`.

    **Пример:**

    ```cpp
    struct Tracer {
        ~Tracer() {} // вызывается компилятором для каждого фрейма при раскрутке
    };
    ```

    **Источник:** [Cppreference: Throwing an exception](https://en.cppreference.com/w/cpp/language/throw)

23. Как stack unwinding связан с деструкторами?

    **Ответ:** В процессе раскрутки стека среда исполнения C++ последовательно вызывает деструкторы всех полностью сконструированных автоматических объектов в порядке, обратном их созданию.

    **Пример:**

    ```cpp
    void run() {
        Tracer t1;
        Tracer t2;
        throw 42; // сначала вызовется ~Tracer для t2, затем для t1
    }
    ```

    **Источник:** [Cppreference: Throwing an exception](https://en.cppreference.com/w/cpp/language/throw)

24. Почему деструкторы RAII-объектов вызываются даже при исключении?

    **Ответ:** Это фундаментальное требование стандарта языка C++: гарантированное разрушение автоматических объектов при выходе из области видимости в процессе stack unwinding.

    **Пример:**

    ```cpp
    #include <fstream>

    void write() {
        std::ofstream out("log.txt");
        throw std::runtime_error("fail"); // файл гарантированно закроется
    }
    ```

    **Источник:** [Cppreference: Throwing an exception](https://en.cppreference.com/w/cpp/language/throw)

25. Что такое smart pointer как пример RAII?

    **Ответ:** Умный указатель — это шаблонный класс, инкапсулирующий сырой динамический указатель и реализующий семантику RAII: освобождение управляемой памяти в своем деструкторе.

    **Пример:**

    ```cpp
    #include <memory>

    std::unique_ptr<int> ptr(new int(5)); // умный указатель управляет ресурсом
    ```

    **Источник:** [Cppreference: Smart pointers](https://en.cppreference.com/w/cpp/memory)

26. Что такое `std::unique_ptr`?

    **Ответ:** `std::unique_ptr` — умный указатель, реализующий модель эксклюзивного (единоличного) владения объектом в динамической памяти без накладных расходов по сравнению с сырым указателем.

    **Пример:**

    ```cpp
    #include <memory>

    std::unique_ptr<int> p = std::make_unique<int>(10);
    ```

    **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

27. Почему `std::unique_ptr` считается RAII-объектом?

    **Ответ:** Он захватывает адрес объекта при конструировании и безусловно вызывает деструктор объекта и освобождает память (через Deleter) в своем деструкторе.

    **Пример:**

    ```cpp
    #include <memory>

    {
        auto u = std::make_unique<int>(7);
    } // память освобождается деструктором u
    ```

    **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

28. Что такое `std::shared_ptr`?

    **Ответ:** `std::shared_ptr` — умный указатель, реализующий разделяемое владение ресурсом через контрольный блок со счетчиком ссылок, освобождающий ресурс, когда счетчик достигает нуля.

    **Пример:**

    ```cpp
    #include <memory>

    auto sp1 = std::make_shared<int>(20);
    auto sp2 = sp1; // разделяемое владение
    ```

    **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

29. Что такое `std::lock_guard`?

    **Ответ:** `std::lock_guard` — это RAII-обёртка над базовым мьютексом, блокирующая его в конструкторе и разблокирующая в деструкторе.

    **Пример:**

    ```cpp
    #include <mutex>

    std::mutex m;
    void safe_call() {
        std::lock_guard<std::mutex> lk(m); // lock
    } // unlock
    ```

    **Источник:** [Cppreference: std::lock_guard](https://en.cppreference.com/w/cpp/thread/lock_guard)

30. Почему `std::lock_guard` — классический пример RAII?

    **Ответ:** Он не управляет памятью, но точно следует парадигме RAII для непамятного ресурса: гарантирует снятие блокировки при любом выходе из функции, исключая deadlock.

    **Пример:**

    ```cpp
    #include <mutex>

    std::mutex mtx;
    void work(bool flag) {
        std::lock_guard<std::mutex> lock(mtx);
        if (flag) return; // разблокировка произойдет корректно
    }
    ```

    **Источник:** [Cppreference: std::lock_guard](https://en.cppreference.com/w/cpp/thread/lock_guard)

31. Что такое владение ресурсом?

    **Ответ:** Владение ресурсом — это концептуальная ответственность конкретного программного объекта или компонента за управление жизненным циклом ресурса и его обязательное финальное освобождение.

    **Пример:**

    ```cpp
    #include <memory>

    std::unique_ptr<int> owner = std::make_unique<int>(1); // owner владеет памятью
    int* observer = owner.get(); // observer не владеет ресурсом
    ```

    **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

32. Почему в дизайне типа важно явно выражать владение?

    **Ответ:** Явное владение предотвращает двойное освобождение, утечки и обращение к висячим указателям, делая интерфейс самодокументируемым и безопасным.

    **Пример:**

    ```cpp
    #include <memory>

    void consume(std::unique_ptr<int> data); // интерфейс явно забирает владение
    void observe(const int& data);           // интерфейс только читает
    ```

    **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

33. Что такое move semantics?

    **Ответ:** Семантика перемещения — механизм языка, позволяющий переносить внутренние ресурсы от временных или ненужных объектов в новые объекты без выполнения глубокого копирования.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> a = {1, 2, 3};
    std::vector<int> b = std::move(a); // b забирает буфер a за O(1)
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

34. Почему move semantics появились в C++11?

    **Ответ:** Они были введены для устранения избыточных накладных расходов на копирование тяжелых временных объектов и для возможности представления типов с уникальным владением (`unique_ptr`, `thread`).

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> make_data() {
        return std::vector<int>(1000000); // перемещается, а не копируется
    }
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

35. Чем перемещение отличается от копирования?

    **Ответ:** Копирование дублирует данные ресурса с выделением новой памяти ($O(N)$), а перемещение лишь перепривязывает указатели на существующий ресурс между объектами ($O(1)$).

    **Пример:**

    ```cpp
    #include <string>

    std::string s1 = "Very long string...";
    std::string s2 = s1;            // Копирование: новый буфер в куче
    std::string s3 = std::move(s1); // Перемещение: кража указателя
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

36. Почему копирование ресурса может быть дорогим?

    **Ответ:** Оно требует обращения к системному аллокатору для выделения нового блока памяти и побайтового переноса содержимого, что нагружает кэш процессора и замедляет работу.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v1(10'000'000);
    std::vector<int> v2 = v1; // аллокация 40 МБ и их полное копирование
    ```

    **Источник:** [Cppreference: Copy constructors](https://en.cppreference.com/w/cpp/language/copy_constructor)

37. Почему перемещение часто дешевле копирования?

    **Ответ:** Перемещение обычно сводится к копированию нескольких примитивных скалярных полей (указателя на данные, размера, вместимости) и обнулению полей источника.

    **Пример:**

    ```cpp
    struct SimpleVector {
        int* data;
        size_t size;
        // Перемещение: копируются только data и size, память не выделяется
    };
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

38. Что такое rvalue?

    **Ответ:** Rvalue — это категория выражения, обозначающая временный объект, значение литерала или объект, явно приведенный к rvalue через `std::move`, ресурсы которого можно безопасно забрать.

    **Пример:**

    ```cpp
    int x = 10;      // 10 — rvalue (prvalue)
    // std::move(x)  // rvalue (xvalue)
    ```

    **Источник:** [Cppreference: Value categories](https://en.cppreference.com/w/cpp/language/value_category)

39. Что такое rvalue-ссылка?

    **Ответ:** Это ссылочный тип, объявляемый с помощью `&&`, который может связываться только с временными объектами или выражениями категории rvalue.

    **Пример:**

    ```cpp
    int&& rref = 42; // rref связана с rvalue
    ```

    **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

40. Как объявить `T&&`?

    **Ответ:** `T&&` объявляется указанием двойного амперсанда после имени типа.

    **Пример:**

    ```cpp
    #include <string>

    void accept_rvalue(std::string&& s);
    ```

    **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

41. Что делает `std::move`?

    **Ответ:** `std::move` производит безусловное статическое приведение переданного выражения к типу rvalue-ссылки (`static_cast<std::remove_reference_t<T>&&>(t)`).

    **Пример:**

    ```cpp
    #include <utility>

    int a = 5;
    auto&& r = std::move(a); // static_cast<int&&>(a)
    ```

    **Источник:** [Cppreference: std::move](https://en.cppreference.com/w/cpp/utility/move)

42. Почему `std::move` не перемещает объект сам по себе?

    **Ответ:** `std::move` — это исключительно функция приведения типов на этапе компиляции; фактическое перемещение выполняет вызванный move-конструктор или move-оператор присваивания.

    **Пример:**

    ```cpp
    #include <utility>

    int x = 10;
    std::move(x); // Ничего не произошло в runtime, x по-прежнему 10
    ```

    **Источник:** [Cppreference: std::move](https://en.cppreference.com/w/cpp/utility/move)

43. Что такое move constructor?

    **Ответ:** Move constructor — это конструктор вида `T(T&& other) noexcept`, конструирующий новый объект путем передачи владения ресурсами от объекта `other`.

    **Пример:**

    ```cpp
    struct Buffer {
        int* data;
        Buffer(Buffer&& other) noexcept : data(other.data) {
            other.data = nullptr; // опустошение источника
        }
    };
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

44. Что такое move assignment operator?

    **Ответ:** Move assignment operator — это перегрузка оператора вида `T& operator=(T&& other) noexcept`, освобождающая текущие ресурсы объекта и забирающая ресурсы у `other`.

    **Пример:**

    ```cpp
    struct Buffer {
        int* data = nullptr;
        Buffer& operator=(Buffer&& other) noexcept {
            if (this != &other) {
                delete data;
                data = other.data;
                other.data = nullptr;
            }
            return *this;
        }
    };
    ```

    **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

45. Что такое copy constructor?

    **Ответ:** Copy constructor — конструктор вида `T(const T& other)`, создающий новый объект как независимую копию существующего объекта `other`.

    **Пример:**

    ```cpp
    struct Buffer {
        int val;
        Buffer(const Buffer& other) : val(other.val) {}
    };
    ```

    **Источник:** [Cppreference: Copy constructors](https://en.cppreference.com/w/cpp/language/copy_constructor)

46. Что такое copy assignment operator?

    **Ответ:** Copy assignment operator — перегрузка `T& operator=(const T& other)`, заменяющая текущее состояние объекта копией состояния объекта `other`.

    **Пример:**

    ```cpp
    struct Buffer {
        int val;
        Buffer& operator=(const Buffer& other) {
            if (this != &other) val = other.val;
            return *this;
        }
    };
    ```

    **Источник:** [Cppreference: Copy assignment operator](https://en.cppreference.com/w/cpp/language/copy_assignment)

47. Чем move constructor отличается от copy constructor?

    **Ответ:** Move constructor принимает неконстантную rvalue-ссылку `T&&` и забирает ресурсы без аллокаций, а copy constructor принимает `const T&` и дублирует ресурсы с созданием копии.

    **Пример:**

    ```cpp
    struct X {
        X(const X&); // Копирование
        X(X&&) noexcept; // Перемещение
    };
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

48. Чем move assignment отличается от copy assignment?

    **Ответ:** Move assignment забирает владение ресурсами у правого операнда и модифицирует его, тогда как copy assignment создает независимый дубликат, не изменяя правый операнд.

    **Пример:**

    ```cpp
    struct X {
        X& operator=(const X&); // Copy assignment
        X& operator=(X&&) noexcept; // Move assignment
    };
    ```

    **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

49. Что означает, что объект “можно перемещать”?

    **Ответ:** Это значит, что для типа определен доступный конструктор перемещения или перемещающее присваивание (тип удовлетворяет концепту `std::movable`).

    **Пример:**

    ```cpp
    #include <concepts>
    #include <memory>

    static_assert(std::movable<std::unique_ptr<int>>);
    ```

    **Источник:** [Cppreference: std::movable](https://en.cppreference.com/w/cpp/concepts/movable)

50. Что такое moved-from объект?

    **Ответ:** Moved-from объект — это объект, ресурсы которого были переданы другому объекту в результате операции перемещения.

    **Пример:**

    ```cpp
    #include <string>
    #include <utility>

    std::string a = "text";
    std::string b = std::move(a); // 'a' теперь moved-from объект
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

---

## Ниже среднего уровня

51. Что означает “объект после перемещения остаётся валидным”?

    **Ответ:** Это означает, что объект сохраняет свою целостность как экземпляр типа: его инварианты не нарушены, и для него можно безопасно вызвать деструктор или присвоить новое значение.

    **Пример:**

    ```cpp
    #include <string>

    std::string s1 = "hello";
    std::string s2 = std::move(s1);
    s1.clear(); // корректно: s1 валиден
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

52. Что означает “валидный, но не определённый логически” объект после перемещения?

    **Ответ:** Стандарт гарантирует, что состояние объекта корректно для вызова деструктора и методов без предусловий, однако конкретное значение объекта не специфицировано, и опираться на него нельзя.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v1 = {1, 2, 3};
    std::vector<int> v2 = std::move(v1);
    // v1 валиден, но v1[0] вызовет UB, так как вектор, скорее всего, пуст
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

53. Почему moved-from объект должен быть безопасен для разрушения?

    **Ответ:** Потому что компилятор в любом случае вызовет деструктор moved-from объекта при выходе из его области видимости.

    **Пример:**

    ```cpp
    struct FileOwner {
        int fd = -1;
        FileOwner(FileOwner&& o) noexcept : fd(o.fd) { o.fd = -1; }
        ~FileOwner() { if (fd != -1) { /* close(fd) */ } }
    };
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

54. Всегда ли moved-from объект можно использовать как раньше?

    **Ответ:** Нет, большинство операций над ним (кроме разрушения, очистки или присваивания нового значения) имеют неопределенный результат, если класс явно не специфицирует иное поведение.

    **Пример:**

    ```cpp
    #include <string>

    std::string s = "abc";
    std::string target = std::move(s);
    // s.substr(1); // Не рекомендуется: значение s не специфицировано
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

55. Почему состояние moved-from объекта не стоит предполагать без документации?

    **Ответ:** Стандартная библиотека и сторонние реализации могут обнулять поля, оставлять внутренние буферы пустыми или сохранять старые данные в зависимости от платформы и реализации.

    **Пример:**

    ```cpp
    #include <string>

    std::string s = "short"; // SSO может приводить к разному поведению при move
    std::string s2 = std::move(s);
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

56. Что такое rule of three?

    **Ответ:** Правило трех (C++98): если классу требуется пользовательский деструктор, конструктор копирования или копирующее присваивание, ему почти наверняка требуются все три.

    **Пример:**

    ```cpp
    class RawArray {
        int* data;
    public:
        RawArray(const RawArray&);
        RawArray& operator=(const RawArray&);
        ~RawArray();
    };
    ```

    **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

57. Что такое rule of five?

    **Ответ:** Правило пяти (C++11): если класс управляет ресурсом и явно объявляет один из специальных методов, ему следует явно объявить все пять: деструктор, копирующие конструктор и присваивание, перемещающие конструктор и присваивание.

    **Пример:**

    ```cpp
    class Resource {
    public:
        ~Resource();
        Resource(const Resource&);
        Resource& operator=(const Resource&);
        Resource(Resource&&) noexcept;
        Resource& operator=(Resource&&) noexcept;
    };
    ```

    **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

58. Почему move semantics расширили rule of three до rule of five?

    **Ответ:** Появление перемещения добавило две новые специальные функции; без их явного объявления класс либо потеряет возможность эффективного перемещения, либо перемещение сведется к дорогому копированию.

    **Пример:**

    ```cpp
    // Добавление move-операций предотвращает регресс производительности
    ```

    **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

59. Что такое rule of zero?

    **Ответ:** Правило нуля: классы не должны объявлять ни одну из пяти специальных функций-членов, если все их поля уже являются RAII-типами (`std::unique_ptr`, `std::vector`, `std::string`).

    **Пример:**

    ```cpp
    #include <string>
    #include <vector>

    struct Student {
        std::string name;
        std::vector<int> grades;
        // 0 специальных функций объявлено: компилятор сгенерирует идеальные версии
    };
    ```

    **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

60. Почему rule of zero считается предпочтительным подходом?

    **Ответ:** Оно делает код самодокументируемым, компактным и исключает человеческие ошибки при ручной реализации операций копирования, перемещения и очистки памяти.

    **Пример:**

    ```cpp
    #include <memory>

    struct Document {
        std::unique_ptr<char[]> content; // управление памятью делегировано
    };
    ```

    **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

61. Когда классу действительно нужно писать собственный деструктор?

    **Ответ:** Только когда класс напрямую владеет низкоуровневым ресурсом (сырой указатель из C API, дескриптор сокета, системная блокировка), не обернутым в готовый RAII-тип.

    **Пример:**

    ```cpp
    class CustomHandle {
        int fd;
    public:
        ~CustomHandle() { /* OS_Close(fd); */ }
    };
    ```

    **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

62. Когда классу действительно нужны собственные копирующие операции?

    **Ответ:** Когда классу необходимо реализовать специфическую логику глубокого копирования (deep copy) для низкоуровневых динамических структур или графов объектов.

    **Пример:**

    ```cpp
    struct DeepBuffer {
        int* p;
        DeepBuffer(const DeepBuffer& o) : p(new int(*o.p)) {}
    };
    ```

    **Источник:** [Cppreference: Copy constructors](https://en.cppreference.com/w/cpp/language/copy_constructor)

63. Когда классу действительно нужны собственные move-операции?

    **Ответ:** Когда класс владеет ресурсом через сырое поле (указатель или хэндл) и должен обнулить его у источника, чтобы предотвратить двойное освобождение ресурса.

    **Пример:**

    ```cpp
    struct RawSocket {
        int sock;
        RawSocket(RawSocket&& o) noexcept : sock(o.sock) { o.sock = -1; }
    };
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

64. Что значит, что класс владеет ресурсом?

    **Ответ:** Это значит, что деструктор этого класса несет прямую обязанность освободить данный ресурс, а операции копирования и перемещения обязаны гарантировать отсутствие конфликтов владения.

    **Пример:**

    ```cpp
    class DatabaseConnection {
        void* conn;
    public:
        ~DatabaseConnection() { /* disconnect(conn); */ }
    };
    ```

    **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

65. Почему класс-владелец ресурса часто должен аккуратно определить special member functions?

    **Ответ:** Неправильная реализация по умолчанию приведет к поверхностному копированию сырых указателей, что повлечет double free или use-after-free при уничтожении первого же экземпляра.

    **Пример:**

    ```cpp
    // По умолчанию компилятор просто скопирует указатель: оба объекта попытаются его удалить
    ```

    **Источник:** [Cppreference: Special member functions](https://en.cppreference.com/w/cpp/language/member_functions#Special_member_functions)

66. Что такое special member functions?

    **Ответ:** Специальные функции-члены — функции класса, которые компилятор C++ может автоматически объявить и сгенерировать при соблюдении определенных правил.

    **Пример:**

    ```cpp
    struct Empty {}; // Компилятор неявно создаст конструктор по умолчанию, деструктор и т.д.
    ```

    **Источник:** [Cppreference: Special member functions](https://en.cppreference.com/w/cpp/language/member_functions#Special_member_functions)

67. Какие функции относятся к special member functions?

    **Ответ:** Default constructor, destructor, copy constructor, copy assignment operator, move constructor и move assignment operator (всего 6 функций).

    **Пример:**

    ```cpp
    struct AllSpecial {
        AllSpecial();
        ~AllSpecial();
        AllSpecial(const AllSpecial&);
        AllSpecial& operator=(const AllSpecial&);
        AllSpecial(AllSpecial&&);
        AllSpecial& operator=(AllSpecial&&);
    };
    ```

    **Источник:** [Cppreference: Special member functions](https://en.cppreference.com/w/cpp/language/member_functions#Special_member_functions)

68. Когда компилятор генерирует move constructor автоматически?

    **Ответ:** Компилятор генерирует move-конструктор по умолчанию только тогда, когда в классе **не объявлены** пользовательские: деструктор, copy constructor, copy assignment, move assignment.

    **Пример:**

    ```cpp
    struct AutoMove {
        int x;
        // Никаких специальных функций нет: move constructor сгенерирован компилятором
    };
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

69. Когда компилятор может не сгенерировать move constructor?

    **Ответ:** Если объявлен хотя бы один пользовательский деструктор или операция копирования/присваивания, либо если хотя бы одно из полей класса не поддерживает перемещение.

    **Пример:**

    ```cpp
    struct NoAutoMove {
        ~NoAutoMove() {} // Наличие деструктора блокирует генерацию move constructor!
    };
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

70. Почему пользовательский деструктор может влиять на генерацию move-операций?

    **Ответ:** Наличие деструктора сигнализирует о нестандартном управлении ресурсом; компилятор считает автоматическое перемещение полей побайтово потенциально небезопасным.

    **Пример:**

    ```cpp
    struct Guard {
        ~Guard() {} // Move constructor не будет сгенерирован автоматически
    };
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

71. Что делает `= default` для special member functions?

    **Ответ:** Директива `= default` указывает компилятору сгенерировать стандартную поэлементную реализацию специальной функции-члена.

    **Пример:**

    ```cpp
    struct Modern {
        ~Modern() = default;
        Modern(Modern&&) noexcept = default; // восстанавливаем генерацию move
    };
    ```

    **Источник:** [Cppreference: Defaulted functions](https://en.cppreference.com/w/cpp/language/function#Defaulted_functions)

72. Что делает `= delete` для копирования или перемещения?

    **Ответ:** Директива `= delete` полностью запрещает вызов соответствующей операции, приводя к ошибке компиляции при попытке её использования.

    **Пример:**

    ```cpp
    struct NonCopyable {
        NonCopyable(const NonCopyable&) = delete;
        NonCopyable& operator=(const NonCopyable&) = delete;
    };
    ```

    **Источник:** [Cppreference: Deleted functions](https://en.cppreference.com/w/cpp/language/function#Deleted_functions)

73. Когда стоит запрещать копирование?

    **Ответ:** Когда класс управляет уникальным ресурсом (файл, сокет, поток execution), дублирование которого логически невозможно или недопустимо.

    **Пример:**

    ```cpp
    #include <thread>
    // std::jthread и std::unique_ptr имеют удаленное копирование
    ```

    **Источник:** [Cppreference: Deleted functions](https://en.cppreference.com/w/cpp/language/function#Deleted_functions)

74. Когда стоит запрещать перемещение?

    **Ответ:** Когда перемещение объекта нарушит инварианты системы (например, объект зарегистрирован по стабильному адресу в глобальном реестре или содержит самоссылающиеся указатели).

    **Пример:**

    ```cpp
    struct PinnedObserver {
        PinnedObserver(PinnedObserver&&) = delete;
    };
    ```

    **Источник:** [Cppreference: Deleted functions](https://en.cppreference.com/w/cpp/language/function#Deleted_functions)

75. Почему `std::unique_ptr` копировать нельзя?

    **Ответ:** Копирование привело бы к появлению двух независимых указателей, владеющих одним и тем же объектом в куче, нарушив контракт эксклюзивного владения и вызвав double free.

    **Пример:**

    ```cpp
    #include <memory>

    auto p1 = std::make_unique<int>(5);
    // auto p2 = p1; // Ошибка компиляции: copy constructor удален
    ```

    **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

76. Почему `std::unique_ptr` можно перемещать?

    **Ответ:** При перемещении владение ресурсом передается новому объекту, а старый указатель зануляется (`nullptr`), сохраняя инвариант строго единоличного владения.

    **Пример:**

    ```cpp
    #include <memory>

    auto p1 = std::make_unique<int>(5);
    auto p2 = std::move(p1); // p1 теперь nullptr, p2 владеет объектом
    ```

    **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

77. Что такое exclusive ownership?

    **Ответ:** Монопольное (эксклюзивное) владение — модель, при которой ровно один программный объект несет ответственность за освобождение ресурса в любой момент времени.

    **Пример:**

    ```cpp
    #include <memory>

    std::unique_ptr<int> exclusive = std::make_unique<int>(10);
    ```

    **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

78. Что такое shared ownership?

    **Ответ:** Разделяемое владение — модель, при которой несколько объектов владеют одним ресурсом, и ресурс освобождается только тогда, когда последний владелец прекращает существование.

    **Пример:**

    ```cpp
    #include <memory>

    std::shared_ptr<int> s1 = std::make_shared<int>(10);
    std::shared_ptr<int> s2 = s1;
    ```

    **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

79. Почему shared ownership сложнее unique ownership?

    **Ответ:** Оно требует поддержки дополнительного контрольного блока, потокобезопасного счетчика ссылок и подвержено проблемам циклических зависимостей и скрытого времени жизни.

    **Пример:**

    ```cpp
    // Модификация счетчика shared_ptr требует атомарных операций
    ```

    **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

80. Что такое `std::weak_ptr` и как он связан с владением?

    **Ответ:** `std::weak_ptr` — невладеющий наблюдатель за объектом под управлением `std::shared_ptr`, который позволяет проверить существование объекта и временно получить к нему доступ, не продлевая его жизнь.

    **Пример:**

    ```cpp
    #include <memory>

    auto sp = std::make_shared<int>(42);
    std::weak_ptr<int> wp = sp; // не увеличивает use_count
    ```

    **Источник:** [Cppreference: std::weak_ptr](https://en.cppreference.com/w/cpp/memory/weak_ptr)

81. Почему `shared_ptr` не является заменой всем указателям?

    **Ответ:** Он вносит оверхед по памяти и скорости (атомарные операции), размывает архитектурные границы владения и часто маскирует ошибки проектирования.

    **Пример:**

    ```cpp
    // В большинстве случаев предпочтительнее значение на стеке или std::unique_ptr
    ```

    **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

82. Что такое циклическое владение через `shared_ptr`?

    **Ответ:** Это ситуация, когда объекты ссылаются друг на друга через `std::shared_ptr`, образуя замкнутый цикл, из-за чего их счетчики ссылок никогда не станут равны 0.

    **Пример:**

    ```cpp
    #include <memory>

    struct Node {
        std::shared_ptr<Node> next;
    };
    ```

    **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

83. Почему цикл `shared_ptr` приводит к утечке?

    **Ответ:** Ни один из объектов цикла не может быть разрушен первым, так как на каждый из них всегда ссылается другой участник цикла, удерживая ненулевой счетчик ссылок.

    **Пример:**

    ```cpp
    // n1 держит n2, n2 держит n1 -> деструктор ни одного не вызовется
    ```

    **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

84. Как `weak_ptr` помогает разрывать циклы?

    **Ответ:** Замена одной из связей цикла на `std::weak_ptr` устраняет инкремент счетчика сильных ссылок, позволяя объекту разрушиться в штатном порядке.

    **Пример:**

    ```cpp
    #include <memory>

    struct Node {
        std::shared_ptr<Node> next;
        std::weak_ptr<Node> prev; // предотвращает цикл
    };
    ```

    **Источник:** [Cppreference: std::weak_ptr](https://en.cppreference.com/w/cpp/memory/weak_ptr)

85. Что такое `std::make_unique`?

    **Ответ:** Фабричная функция (C++14), создающая объект в динамической памяти и возвращающая его, обернутым в `std::unique_ptr`.

    **Пример:**

    ```cpp
    #include <memory>

    auto p = std::make_unique<int>(10);
    ```

    **Источник:** [Cppreference: std::make_unique](https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique)

86. Почему `make_unique` предпочтительнее явного `new`?

    **Ответ:** Он гарантирует безопасность исключений в сложных выражениях аргументов, исключает дублирование типа и избавляет от необходимости писать ключевое слово `new`.

    **Пример:**

    ```cpp
    #include <memory>

    void foo(std::unique_ptr<int>, std::unique_ptr<int>);
    // foo(std::make_unique<int>(1), std::make_unique<int>(2)); // полностью безопасно
    ```

    **Источник:** [Cppreference: std::make_unique](https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique)

87. Что такое `std::make_shared`?

    **Ответ:** Фабричная функция, выделяющая память под контрольный блок и сам пользовательский объект единым непрерывным блоком в куче.

    **Пример:**

    ```cpp
    #include <memory>

    auto sp = std::make_shared<std::string>("hello");
    ```

    **Источник:** [Cppreference: std::make_shared](https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared)

88. В чём преимущества `make_shared`?

    **Ответ:** Сокращение числа системных аллокаций памяти с двух до одной, лучшая кэш-локальность и исключение риска утечек при сбоях в вычислении аргументов.

    **Пример:**

    ```cpp
    // 1 аллокация вместо 2 (объект + контрольный блок)
    ```

    **Источник:** [Cppreference: std::make_shared](https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared)

89. Что такое ресурс-обёртка?

    **Ответ:** Ресурс-обёртка — класс, инкапсулирующий низкоуровневый системный ресурс и предоставляющий безопасный интерфейс доступа к нему по модели RAII.

    **Пример:**

    ```cpp
    struct FileCloser {
        FILE* f;
        ~FileCloser() { if (f) fclose(f); }
    };
    ```

    **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

90. Какие свойства делает хорошим RAII-класс?

    **Ответ:** Запрет или корректная реализация копирования, `noexcept` перемещение, невозможность остаться неинициализированным и отсутствие исключений в деструкторе.

    **Пример:**

    ```cpp
    class GoodRAII {
    public:
        GoodRAII() noexcept;
        ~GoodRAII() noexcept;
        GoodRAII(GoodRAII&&) noexcept;
        GoodRAII& operator=(GoodRAII&&) noexcept;
    };
    ```

    **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

91. Почему инвариант класса важен для RAII-типа?

    **Ответ:** Инвариант гарантирует, что объект в любой момент времени либо удерживает валидный ресурс, либо находится в явно зафиксированном пустом состоянии.

    **Пример:**

    ```cpp
    // Инвариант: ptr != nullptr либо объект помечен как empty
    ```

    **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

92. Что значит, что объект всегда должен быть либо валидным владельцем, либо в пустом состоянии?

    **Ответ:** Это гарантирует, что деструктор может безопасно проверить статус владения и не выполнит операцию освобождения над некорректным или мусорным дескриптором.

    **Пример:**

    ```cpp
    struct Handle {
        int id = -1; // -1 означает пустое состояние
        ~Handle() { if (id != -1) { /* release */ } }
    };
    ```

    **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

93. Что такое “пустое состояние” для RAII-объекта?

    **Ответ:** Состояние, в котором объект не владеет никаким ресурсом (например, после перемещения из него или дефолтного конструирования), а его деструктор превращается в no-op.

    **Пример:**

    ```cpp
    #include <memory>

    std::unique_ptr<int> p; // p в пустом состоянии (p.get() == nullptr)
    ```

    **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

94. Почему move semantics хорошо сочетаются с RAII?

    **Ответ:** Перемещение позволяет передавать владение ресурсом между областями видимости без дорогостоящего глубокого копирования и без выхода из безопасной модели RAII.

    **Пример:**

    ```cpp
    #include <memory>

    std::unique_ptr<int> create() {
        return std::make_unique<int>(10); // чистое владение передается наружу
    }
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

95. Почему возврат RAII-объекта из функции по значению обычно удобен?

    **Ответ:** Благодаря copy elision (RVO/NRVO) и дешевому перемещению возврат по значению является идиоматичным, быстрым и защищенным от утечек способом фабрикации объектов.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> get_data() {
        std::vector<int> res;
        res.push_back(1);
        return res; // RVO или Move
    }
    ```

    **Источник:** [Cppreference: Copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

96. Что такое copy elision?

    **Ответ:** Оптимизация (начиная с C++17 в ряде сценариев обязательная), при которой компилятор исключает вызовы конструкторов копирования и перемещения, размещая возвращаемый объект сразу в целевой памяти.

    **Пример:**

    ```cpp
    struct Obj { Obj() = default; Obj(const Obj&) = delete; };
    Obj factory() { return Obj(); }
    Obj o = factory(); // гарантированный copy elision в C++17
    ```

    **Источник:** [Cppreference: Copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

97. Что такое NRVO?

    **Ответ:** Named Return Value Optimization — оптимизация компилятора, устраняющая копирование или перемещение при возврате именованной локальной переменной из функции.

    **Пример:**

    ```cpp
    #include <string>

    std::string build() {
        std::string s = "test";
        return s; // NRVO конструирует 's' сразу на фрейме вызывающей функции
    }
    ```

    **Источник:** [Cppreference: Copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

98. Как copy elision влияет на эффективность возврата объектов?

    **Ответ:** Он полностью сводит накладные расходы к нулю ($0$ копирований и $0$ перемещений), позволяя возвращать даже тяжелые или некопируемые типы напрямую по значению.

    **Пример:**

    ```cpp
    // 0 тактов на копирование данных буфера
    ```

    **Источник:** [Cppreference: Copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

99. Почему в современном C++ возврат по значению часто не дорогой?

    **Ответ:** Если не сработает обязательный copy elision или NRVO, компилятор применит неявное перемещение (`std::move`), которое выполняется за единицы наносекунд.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> f() {
        std::vector<int> v(1000);
        return v; // максимум дешевый move
    }
    ```

    **Источник:** [Cppreference: Copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

100. Когда лучше передавать объект по значению, а когда по ссылке?

     **Ответ:** Передавать по ссылке `const T&` стоит для чтения без копирования. Передавать по значению с последующим `std::move` стоит тогда, когда функция в любом случае забирает себе копию объекта.

     **Пример:**

     ```cpp
     #include <string>
     #include <utility>

     struct User {
         std::string name;
         User(std::string n) : name(std::move(n)) {} // pass-by-value + move
     };
     ```

     **Источник:** [Cppreference: Function declaration](https://en.cppreference.com/w/cpp/language/function)

---

## Средний уровень

101. Что происходит с ресурсом при копировании RAII-объекта?

     **Ответ:** При корректном копировании ресурс должен быть полностью продублирован (глубокая копия), либо счетчик совместного владения должен быть инкрементирован.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> a = {1, 2};
     std::vector<int> b = a; // выделяется новый буфер, данные дублируются
     ```

     **Источник:** [Cppreference: Copy constructors](https://en.cppreference.com/w/cpp/language/copy_constructor)

102. Какие стратегии копирования ресурса существуют?

     **Ответ:** Глубокое копирование (deep copy), разделяемое владение (shared ownership через счетчик ссылок) и запрет копирования (move-only семантика).

     **Пример:**

     ```cpp
     // Deep copy: std::vector
     // Shared ownership: std::shared_ptr
     // Move-only: std::unique_ptr
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

103. Что такое глубокое копирование ресурса?

     **Ответ:** Выделение полностью нового независимого физического ресурса (памяти, файла) и побайтовое копирование исходных данных в этот новый ресурс.

     **Пример:**

     ```cpp
     struct Deep {
         int* val;
         Deep(const Deep& o) : val(new int(*o.val)) {} // deep copy
         ~Deep() { delete val; }
     };
     ```

     **Источник:** [Cppreference: Copy constructors](https://en.cppreference.com/w/cpp/language/copy_constructor)

104. Что такое поверхностное копирование ресурса?

     **Ответ:** Поверхностное копирование (shallow copy) — простое копирование численного значения дескриптора или адреса указателя без дублирования самого нижележащего ресурса.

     **Пример:**

     ```cpp
     struct Shallow {
         int* val;
         Shallow(const Shallow& o) : val(o.val) {} // копируется только адрес
     };
     ```

     **Источник:** [Cppreference: Copy constructors](https://en.cppreference.com/w/cpp/language/copy_constructor)

105. Почему поверхностное копирование владельца ресурса часто ошибочно?

     **Ответ:** Оно приводит к ситуации, когда два независимых RAII-объекта считают себя владельцами одного и того же адреса памяти или дескриптора и оба попытаются освободить его в деструкторе.

     **Пример:**

     ```cpp
     // Ведет к undefined behavior через double free
     ```

     **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

106. Что такое double delete?

     **Ответ:** Double delete — критическая ошибка и Undefined Behavior, возникающее при повторной попытке освободить (`delete` / `free`) уже ранее освобожденную область памяти.

     **Пример:**

     ```cpp
     int* p = new int(1);
     delete p;
     // delete p; // UB: повторное удаление
     ```

     **Источник:** [Cppreference: delete expression](https://en.cppreference.com/w/cpp/language/delete)

107. Как поверхностная копия указателя может привести к double delete?

     **Ответ:** Первый объект в деструкторе удаляет память по указателю, а второй объект при выходе из scope вызывает `delete` по тому же самому адресу, разрушая кучу.

     **Пример:**

     ```cpp
     // Shallow a; { Shallow b = a; } // b удалил память, a попытается удалить её позже
     ```

     **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

108. Почему move semantics помогает избежать лишних глубоких копий?

     **Ответ:** Если исходный объект является временным или больше не нужен, перемещение просто переносит готовый ресурс, избегая бесполезной аллокации и копирования данных.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v;
     v = std::vector<int>(1000); // перемещение вместо аллокации и копирования
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

109. Что обычно делает move constructor у класса-владельца?

     **Ответ:** Копирует сырые поля источника в новый объект и переводит источник в пустое состояние (зануляет указатель, ставит флаг -1).

     **Пример:**

     ```cpp
     struct Owner {
         int* res;
         Owner(Owner&& o) noexcept : res(o.res) {
             o.res = nullptr;
         }
     };
     ```

     **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

110. Почему move constructor часто “крадёт” ресурс у источника?

     **Ответ:** Перехват указателя позволяет использовать уже существующие данные в куче за константное время $O(1)$ без обращения к операционной системе.

     **Пример:**

     ```cpp
     // Забираем владение буфером без копирования байтов
     ```

     **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

111. Почему после перемещения источник обычно переводят в безопасное пустое состояние?

     **Ответ:** Чтобы деструктор источника, который неизбежно вызовется в будущем, не освободил ресурс, который теперь принадлежит целевому объекту.

     **Пример:**

     ```cpp
     struct Node {
         int* p;
         Node(Node&& o) noexcept : p(o.p) { o.p = nullptr; }
         ~Node() { delete p; } // delete nullptr безопасен
     };
     ```

     **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

112. Что обычно делает move assignment operator?

     **Ответ:** Он освобождает свой собственный текущий ресурс, переносит ресурс из правого операнда и обнуляет правый операнд.

     **Пример:**

     ```cpp
     struct Resource {
         int* ptr = nullptr;
         Resource& operator=(Resource&& o) noexcept {
             if (this != &o) {
                 delete ptr;
                 ptr = o.ptr;
                 o.ptr = nullptr;
             }
             return *this;
         }
     };
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

113. Чем move assignment сложнее move constructor?

     **Ответ:** Move assignment работает с уже инициализированным объектом, поэтому обязан предварительно очистить свои старые ресурсы и корректно обработать потенциальное самоприсваивание (`self-move`).

     **Пример:**

     ```cpp
     // Требуется очистка старого ресурса и проверка this != &other
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

114. Почему в move assignment нужно учитывать уже имеющийся ресурс слева?

     **Ответ:** Если не освободить текущий ресурс левого операнда перед перезаписью его указателя, этот ресурс будет утерян навсегда (утечка памяти или дескриптора).

     **Пример:**

     ```cpp
     // Забытый delete ptr перед ptr = other.ptr приведет к утечке старого ptr
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

115. Как избежать утечки ресурса в move assignment?

     **Ответ:** Явно освобождать удерживаемый ресурс перед перепривязкой либо использовать идиому copy-and-swap / move-and-swap.

     **Пример:**

     ```cpp
     #include <utility>

     struct Safe {
         int* data = nullptr;
         Safe& operator=(Safe&& o) noexcept {
             std::swap(data, o.data); // старый ресурс уйдет в o и удалится в его деструкторе
             return *this;
         }
     };
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

116. Что такое self-assignment?

     **Ответ:** Это операция присваивания объекта самому себе (например, `a = a;`), которая не должна нарушать инварианты класса и приводить к удалению используемых данных.

     **Пример:**

     ```cpp
     struct Item {
         Item& operator=(const Item& other) {
             if (this == &other) return *this; // защита от self-assignment
             return *this;
         }
     };
     ```

     **Источник:** [Cppreference: Copy assignment operator](https://en.cppreference.com/w/cpp/language/copy_assignment)

117. Почему self-assignment нужно учитывать для copy assignment?

     **Ответ:** Без проверки `this == &other` наивная реализация сначала удалит свои текущие данные, тем самым уничтожив исходные данные правого операнда до их копирования.

     **Пример:**

     ```cpp
     // delete data; data = new int(*other.data); // crash, если this == &other
     ```

     **Источник:** [Cppreference: Copy assignment operator](https://en.cppreference.com/w/cpp/language/copy_assignment)

118. Что такое self-move?

     **Ответ:** Присваивание объекта самому себе через rvalue-ссылку: `a = std::move(a);`.

     **Пример:**

     ```cpp
     #include <utility>
     #include <vector>

     std::vector<int> v = {1, 2};
     v = std::move(v); // self-move
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

119. Почему self-move — более тонкая ситуация?

     **Ответ:** При `self-move` объект может занулить свой собственный указатель в процессе перемещения, потеряв данные; стандарт требует, чтобы объект оставался как минимум в валидном состоянии.

     **Пример:**

     ```cpp
     // Если реализация не проверяет this != &o, обнуление o.ptr сотрет собственный ptr
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

120. Нужно ли обязательно поддерживать self-move корректно?

     **Ответ:** Да, стандарт требует, чтобы moved-from объект оставался валидным, а присваивание самому себе не приводило к UB, крашам или утечкам (даже если данные внутри будут потеряны).

     **Пример:**

     ```cpp
     struct S {
         int* p;
         S& operator=(S&& other) noexcept {
             if (this != &other) {
                 delete p;
                 p = other.p;
                 other.p = nullptr;
             }
             return *this;
         }
     };
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

121. Что такое идиома copy-and-swap?

     **Ответ:** Идиома реализации оператора присваивания, при которой аргумент принимается по значению (создается копия), а затем меняется местами с текущим объектом через `swap`.

     **Пример:**

     ```cpp
     #include <utility>

     struct Buffer {
         int* data;
         friend void swap(Buffer& a, Buffer& b) noexcept { std::swap(a.data, b.data); }
         Buffer& operator=(Buffer other) noexcept { // copy/move в зависимости от аргумента
             swap(*this, other);
             return *this;
         }
     };
     ```

     **Источник:** [Cppreference: Copy assignment operator](https://en.cppreference.com/w/cpp/language/copy_assignment)

122. Когда copy-and-swap полезна для оператора присваивания?

     **Ответ:** Она обеспечивает идеальную сильную гарантию исключений (strong exception safety) и объединяет copy- и move-присваивание в один общий элегантный метод.

     **Пример:**

     ```cpp
     // Если при создании копии вылетит bad_alloc, целевой объект останется нетронутым
     ```

     **Источник:** [Cppreference: Copy assignment operator](https://en.cppreference.com/w/cpp/language/copy_assignment)

123. Подходит ли copy-and-swap для move assignment?

     **Ответ:** Да, но отдельный move assignment через перемещение полей часто предпочтительнее для микрооптимизации, так как исключает создание лишнего стекового объекта.

     **Пример:**

     ```cpp
     // Buffer& operator=(Buffer&& other) noexcept эффективнее вызова swap с временным объектом
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

124. Что такое `swap` как часть дизайна RAII-класса?

     **Ответ:** Это легковесная небросающая исключений функция (`noexcept`), обменивающая значения внутренних сырых полей двух объектов за $O(1)$.

     **Пример:**

     ```cpp
     #include <utility>

     struct Box {
         int* val;
         void swap(Box& other) noexcept {
             std::swap(val, other.val);
         }
     };
     ```

     **Источник:** [Cppreference: std::swap](https://en.cppreference.com/w/cpp/algorithm/swap)

125. Почему `swap` часто делают `noexcept`?

     **Ответ:** `swap` оперирует обменом примитивных типов и указателей, не требуя выделения памяти; спецификатор `noexcept` критичен для предоставления гарантий исключительной безопасности.

     **Пример:**

     ```cpp
     friend void swap(Box& a, Box& b) noexcept {
         // гарантированно не бросает исключений
     }
     ```

     **Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

126. Почему `noexcept` важен для move-конструктора и move assignment?

     **Ответ:** Контейнеры стандартной библиотеки (например, `std::vector`) проверяют свойство `is_nothrow_move_constructible` и переключаются на медленное копирование, если перемещение может бросить исключение.

     **Пример:**

     ```cpp
     struct SafeMove {
         SafeMove(SafeMove&&) noexcept {} // вектор будет перемещать
     };
     ```

     **Источник:** [Cppreference: std::move_if_noexcept](https://en.cppreference.com/w/cpp/utility/move_if_noexcept)

127. Как `std::vector` использует `noexcept` при перемещении элементов?

     **Ответ:** Во время реаллокации внутреннего буфера `vector` перемещает элементы только в том случае, если их move-конструктор помечен `noexcept`, иначе он принудительно копирует их через `std::move_if_noexcept`.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<SafeMove> vec;
     vec.reserve(100); // использует перемещение при реаллокации
     ```

     **Источник:** [Cppreference: std::move_if_noexcept](https://en.cppreference.com/w/cpp/utility/move_if_noexcept)

128. Почему контейнер может предпочесть копирование вместо перемещения, если move не `noexcept`?

     **Ответ:** Чтобы сохранить строгую гарантию безопасности (strong exception safety): если перемещение третьего элемента бросит исключение, вернуть первые два элемента назад в старый буфер уже невозможно без потерь.

     **Пример:**

     ```cpp
     // Исключение посреди перемещения приведет к потере исходных данных контейнера
     ```

     **Источник:** [Cppreference: std::vector::reserve](https://en.cppreference.com/w/cpp/container/vector/reserve)

129. Что такое strong exception guarantee?

     **Ответ:** Строгая гарантия безопасности исключений (семантика транзакции): если операция завершается исключением, состояние программы остается в точности таким, каким оно было до начала операции.

     **Пример:**

     ```cpp
     // std::vector::push_back дает strong exception guarantee
     ```

     **Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

130. Что такое basic exception guarantee?

     **Ответ:** Базовая гарантия безопасности исключений: в случае исключения утечек памяти и ресурсов не происходит, и все объекты остаются в валидном, согласованном состоянии.

     **Пример:**

     ```cpp
     // Инварианты программы не нарушены, ресурсы очищены, но значения могут измениться
     ```

     **Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

131. Почему RAII помогает обеспечивать exception safety?

     **Ответ:** Деструкторы локальных RAII-объектов автоматически откатывают частичные изменения и освобождают занятые ресурсы при аварийном раскручивании стека.

     **Пример:**

     ```cpp
     void transaction() {
         // RAII rollback guard
     }
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

132. Какой уровень гарантий обычно стремятся давать операции RAII-типа?

     **Ответ:** Конструкторы стремятся давать базовую или строгую гарантию, методы модификации — строгую, а деструкторы и move-операции — гарантию отсутствия исключений (`nothrow` / `noexcept`).

     **Пример:**

     ```cpp
     // Destructor: noexcept
     // Move constructor: noexcept
     ```

     **Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

133. Почему деструктор RAII-типа обычно не должен выбрасывать исключения?

     **Ответ:** Если деструктор выбрасывает исключение во время уже идущей раскрутки стека (stack unwinding) из-за другого исключения, среда исполнения немедленно аварийно завершит программу через `std::terminate`.

     **Пример:**

     ```cpp
     struct Bad {
         ~Bad() noexcept(false) { throw 1; } // Фатально при раскрутке стека
     };
     ```

     **Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

134. Что произойдёт, если исключение вылетит из деструктора во время stack unwinding?

     **Ответ:** Программа будет аварийно завершена вызовом функции `std::terminate`, без возможности перехватить второе исключение через блок `catch`.

     **Пример:**

     ```cpp
     // Вызов std::terminate()
     ```

     **Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

135. Почему деструкторы по умолчанию считаются `noexcept`?

     **Ответ:** Начиная с C++11 деструкторы всех классов неявно объявляются как `noexcept(true)`, защищая рантайм от катастрофического падения при раскрутке стека.

     **Пример:**

     ```cpp
     struct DefaultNoexcept {
         ~DefaultNoexcept() {} // неявно noexcept
     };
     ```

     **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

136. Как RAII помогает писать код без явных `try/finally`-конструкций?

     **Ответ:** Очистка ресурса декларативно прописывается в деструкторе RAII-типа один раз, что делает ненужными искусственные блоки `finally` и гарантирует чистоту кода.

     **Пример:**

     ```cpp
     #include <memory>

     void process() {
         auto p = std::make_unique<int>(1);
         // код без громоздких блоков try/catch/finally
     }
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

137. Чем RAII отличается от ручного шаблона “взял ресурс → в конце явно освободил”?

     **Ответ:** Ручной шаблон легко ломается преждевременным `return`, оператором `break`/`goto` или выброшенным исключением, тогда как RAII работает детерминированно на аппаратном уровне раскрутки стека.

     **Пример:**

     ```cpp
     // Ручной: fopen -> if (err) return; (утечка!) -> fclose
     // RAII: ifstream -> всегда закрывается
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

138. Почему ранний `return` не ломает RAII-подход?

     **Ответ:** При выполнении оператора `return` компилятор генерирует инструкции вызова деструкторов всех созданных в данном блоке локальных объектов до возврата управления.

     **Пример:**

     ```cpp
     #include <fstream>

     void write(bool cond) {
         std::ofstream f("out.txt");
         if (cond) return; // f корректно закрывается прямо перед возвратом
     }
     ```

     **Источник:** [Cppreference: return statement](https://en.cppreference.com/w/cpp/language/return)

139. Почему несколько точек выхода из функции не страшны при RAII?

     **Ответ:** Разработчику больше не требуется сопровождать каждый `return` дублирующим кодом освобождения памяти и дескрипторов — все выходы автоматически защищены RAII.

     **Пример:**

     ```cpp
     #include <mutex>

     std::mutex m;
     int check(int val) {
         std::lock_guard<std::mutex> lk(m);
         if (val < 0) return -1;
         if (val == 0) return 0;
         return 1;
     } // мьютекс снимается во всех 3 точках выхода
     ```

     **Источник:** [Cppreference: std::lock_guard](https://en.cppreference.com/w/cpp/thread/lock_guard)

140. Что такое `std::scoped_lock`?

     **Ответ:** Это RAII-обёртка (C++17), позволяющая захватывать произвольное количество мьютексов одновременно с использованием алгоритма предотвращения deadlock.

     **Пример:**

     ```cpp
     #include <mutex>

     std::mutex m1, m2;
     void sync() {
         std::scoped_lock lock(m1, m2); // атомарный захват двух мьютексов
     }
     ```

     **Источник:** [Cppreference: std::scoped_lock](https://en.cppreference.com/w/cpp/thread/scoped_lock)

141. Чем `std::scoped_lock` отличается от `std::lock_guard`?

     **Ответ:** `std::lock_guard` может управлять только одним мьютексом, тогда как `std::scoped_lock` является вариативным шаблоном и предотвращает взаимные блокировки при захвате нескольких мьютексов.

     **Пример:**

     ```cpp
     #include <mutex>

     std::mutex a, b;
     // std::lock_guard lk(a, b); // Ошибка
     std::scoped_lock lk(a, b);   // Корректно
     ```

     **Источник:** [Cppreference: std::scoped_lock](https://en.cppreference.com/w/cpp/thread/scoped_lock)

142. Почему блокировки — важный пример для RAII?

     **Ответ:** Забытая разблокировка мьютекса приводит к мгновенному зависанию потоков (deadlock) всей программы, а RAII делает снятие блокировки надежным и безусловным.

     **Пример:**

     ```cpp
     // Избавление от ручных mtx.unlock()
     ```

     **Источник:** [Cppreference: std::lock_guard](https://en.cppreference.com/w/cpp/thread/lock_guard)

143. Что такое временный RAII-объект?

     **Ответ:** Это неименованный rvalue-объект, созданный в выражении без сохранения в именованную переменную, время жизни которого ограничено концом полного выражения.

     **Пример:**

     ```cpp
     #include <string>

     // std::string("temp") — временный объект
     ```

     **Источник:** [Cppreference: Lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

144. Почему lifetime временного RAII-объекта нужно понимать точно?

     **Ответ:** Временный объект уничтожается сразу в точке с точкой с запятой `;` текущего выражения, что может непреднамеренно рано освободить защищаемый ресурс.

     **Пример:**

     ```cpp
     #include <mutex>

     std::mutex m;
     void bug() {
         std::lock_guard<std::mutex>(m); // БАГ: временный объект уничтожен СРАЗУ же!
         // Код ниже выполняется БЕЗ защиты мьютекса!
     }
     ```

     **Источник:** [Cppreference: Lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

145. Почему безымянный `lock_guard` может быть логической ошибкой?

     **Ответ:** Безымянный `std::lock_guard<std::mutex>(m);` является временным объектом: он мгновенно захватывает мьютекс и тут же отпускает его в конце строки, оставляя критическую секцию незащищенной.

     **Пример:**

     ```cpp
     std::lock_guard<std::mutex>(m);   // Ошибка: живет 0 строк
     std::lock_guard<std::mutex> lk(m); // Правильно: живет до конца scope
     ```

     **Источник:** [Cppreference: std::lock_guard](https://en.cppreference.com/w/cpp/thread/lock_guard)

146. Что такое ownership transfer?

     **Ответ:** Передача владения — процесс перехода прав и обязанностей по управлению ресурсом от одного программного объекта-владельца к другому.

     **Пример:**

     ```cpp
     #include <memory>

     auto a = std::make_unique<int>(1);
     auto b = std::move(a); // ownership transfer от a к b
     ```

     **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

147. Как ownership transfer выражается через move semantics?

     **Ответ:** Функция или конструктор объявляет прием параметра по значению или через rvalue-ссылку `T&&`, заставляя вызывающий код явно написать `std::move`.

     **Пример:**

     ```cpp
     #include <memory>

     void take(std::unique_ptr<int> ptr);
     auto p = std::make_unique<int>(10);
     take(std::move(p)); // явный трансфер владения
     ```

     **Источник:** [Cppreference: std::move](https://en.cppreference.com/w/cpp/utility/move)

148. Почему move semantics делает передачу владения явной?

     **Ответ:** Некопируемый тип невозможно передать случайно: вызывающий код обязан написать `std::move`, явно документируя намерение отказаться от владения в пользу вызываемой функции.

     **Пример:**

     ```cpp
     // take(p);            // Ошибка компиляции: предотвращает случайный трансфер
     // take(std::move(p)); // Скомпилируется: разработчик осознает перенос
     ```

     **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

149. Что такое non-owning handle?

     **Ответ:** Невладеющий дескриптор — объект или ссылка (`T*`, `T&`, `std::string_view`, `std::span`), позволяющий использовать ресурс без права управлять его временем жизни.

     **Пример:**

     ```cpp
     #include <span>
     #include <vector>

     void read_data(std::span<const int> s); // s — невладеющий handle
     ```

     **Источник:** [Cppreference: std::span](https://en.cppreference.com/w/cpp/container/span)

150. Почему не владеющий указатель не должен освобождать ресурс?

     **Ответ:** Потому что ресурсом управляет другой объект (владелец); освобождение ресурса невладеющим указателем вызовет use-after-free или double free в реальном владельце.

     **Пример:**

     ```cpp
     #include <memory>

     auto owner = std::make_unique<int>(10);
     int* observer = owner.get();
     // delete observer; // ГРУБЕЙШАЯ ОШИБКА: сломает деструктор owner
     ```

     **Источник:** [Cppreference: std::unique_ptr::get](https://en.cppreference.com/w/cpp/memory/unique_ptr/get)

---

## Сложный уровень

151. Как спроектировать собственный RAII-класс для файла, сокета или дескриптора ОС?

     **Ответ:** Инкапсулировать сырой дескриптор в приватное поле, захватывать его в конструкторе, освобождать в деструкторе, запретить копирование (`= delete`) и реализовать перемещение с обнулением источника (`noexcept`).

     **Пример:**

     ```cpp
     class FileDescriptor {
         int fd = -1;
     public:
         explicit FileDescriptor(int fd) noexcept : fd(fd) {}
         ~FileDescriptor() { if (fd != -1) { /* ::close(fd); */ } }
         FileDescriptor(const FileDescriptor&) = delete;
         FileDescriptor& operator=(const FileDescriptor&) = delete;
         FileDescriptor(FileDescriptor&& o) noexcept : fd(o.fd) { o.fd = -1; }
         FileDescriptor& operator=(FileDescriptor&& o) noexcept {
             if (this != &o) {
                 if (fd != -1) { /* ::close(fd); */ }
                 fd = o.fd;
                 o.fd = -1;
             }
             return *this;
         }
     };
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

152. Какие инварианты должен поддерживать класс-владелец низкоуровневого дескриптора?

     **Ответ:** Дескриптор внутри класса должен быть либо валидным открытым системным хэндлом, либо иметь строго определенное сигнальное значение закрытого ресурса (например, `-1` или `nullptr`).

     **Пример:**

     ```cpp
     // Инвариант: дескриптор либо >= 0 (открыт), либо равен -1 (пуст)
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

153. Что лучше для отсутствующего ресурса: флаг, sentinel value или отдельный тип состояния?

     **Ответ:** Если операционная система имеет естественное sentinel-значение (`-1`, `nullptr`), лучше использовать его, так как это не раздувает размер структуры; в иных случаях предпочтителен `std::optional`.

     **Пример:**

     ```cpp
     int fd = -1; // Sentinel value без оверхеда по памяти
     ```

     **Источник:** [Cppreference: std::optional](https://en.cppreference.com/w/cpp/utility/optional)

154. Почему move-only типы часто хорошо подходят для представления уникального владения?

     **Ответ:** Невозможность скопировать объект гарантирует на уровне компилятора, что у ресурса не появится второй владелец, исключая ошибки конкуренции и двойного освобождения.

     **Пример:**

     ```cpp
     #include <thread>
     // std::jthread — move-only тип уникального владения потоком ОС
     ```

     **Источник:** [Cppreference: std::jthread](https://en.cppreference.com/w/cpp/thread/jthread)

155. Когда RAII-класс стоит делать некопируемым, но перемещаемым?

     **Ответ:** Когда физический ресурс неделим и уникален по своей природе: дескриптор открытого файла, сокет, аппаратное устройство, мьютекс или транзакция.

     **Пример:**

     ```cpp
     // std::unique_ptr, std::ofstream
     ```

     **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

156. Когда RAII-класс стоит делать и копируемым, и перемещаемым?

     **Ответ:** Когда ресурс можно продублировать с семантикой глубокого копирования без нарушения логики программы: динамические массивы, строки, буферы пикселей.

     **Пример:**

     ```cpp
     #include <vector>
     // std::vector копируемый (deep copy) и перемещаемый
     ```

     **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

157. Как move semantics влияет на проектирование API функций и методов?

     **Ответ:** Позволяет безопасно возвращать тяжелые объекты по значению, принимать move-only типы в качестве аргументов-приемников и использовать идиому передачи по значению с последующим `std::move`.

     **Пример:**

     ```cpp
     #include <memory>

     void register_service(std::unique_ptr<int> s); // API прямо выражает передачу прав
     ```

     **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

158. Почему параметр типа `T&&` в шаблоне не всегда обычная rvalue-ссылка?

     **Ответ:** Если `T` является выводимым шаблонным параметром функции, то `T&&` представляет собой универсальную ссылку (forwarding reference), которая может свернуться в lvalue-ссылку.

     **Пример:**

     ```cpp
     template <typename T>
     void func(T&& param); // Forwarding reference, а не rvalue reference
     ```

     **Источник:** [Cppreference: Reference collapsing](https://en.cppreference.com/w/cpp/language/reference_initialization#Forwarding_references)

159. Что такое forwarding reference?

     **Ответ:** Универсальная ссылка — ссылка вида `T&&` в контексте вывода типа шаблона, способная благодаря правилам reference collapsing связываться как с lvalue, так и с rvalue.

     **Пример:**

     ```cpp
     template <typename T>
     void forward_call(T&& arg);
     ```

     **Источник:** [Cppreference: Reference collapsing](https://en.cppreference.com/w/cpp/language/reference_initialization#Forwarding_references)

160. Как perfect forwarding связан с передачей владения и эффективностью?

     **Ответ:** Perfect forwarding передает аргументы фабричным методам (`emplace_back`, `make_unique`) с точным сохранением их категории значения, вызывая move-конструктор без создания промежуточных копий.

     **Пример:**

     ```cpp
     #include <memory>
     #include <utility>

     template <typename T, typename Arg>
     std::unique_ptr<T> create(Arg&& a) {
         return std::unique_ptr<T>(new T(std::forward<Arg>(a)));
     }
     ```

     **Источник:** [Cppreference: std::forward](https://en.cppreference.com/w/cpp/utility/forward)

161. Когда `std::forward` уместен, а когда нужен именно `std::move`?

     **Ответ:** `std::forward` используется **только** для универсальных ссылок в шаблонном коде, сохраняя исходную категорию значения; `std::move` используется для явного безусловного превращения известного объекта в rvalue.

     **Пример:**

     ```cpp
     #include <utility>

     template <typename T>
     void f(T&& x) {
         target(std::forward<T>(x)); // условное приведение
     }
     void g(int x) {
         target(std::move(x)); // безусловное приведение
     }
     ```

     **Источник:** [Cppreference: std::forward](https://en.cppreference.com/w/cpp/utility/forward)

162. Почему бездумный `std::move` может ломать логику программы?

     **Ответ:** Перемещение опустошает объект: если использовать объект после вызова `std::move`, программа обратится к неспецифицированному состоянию или зануленным указателям.

     **Пример:**

     ```cpp
     #include <string>
     #include <utility>

     std::string s = "important";
     use(std::move(s));
     // print(s); // Логическая ошибка: s теперь пустой
     ```

     **Источник:** [Cppreference: std::move](https://en.cppreference.com/w/cpp/utility/move)

163. Почему не стоит читать moved-from объект так, будто он остался неизменным?

     **Ответ:** Объект передан как донор ресурсов: его поля изменены конструктором перемещения принимающей стороны, и старые значения утеряны.

     **Пример:**

     ```cpp
     // moved-from контейнер чаще всего имеет size() == 0
     ```

     **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

164. Какие ошибки чаще всего встречаются при ручной реализации move constructor?

     **Ответ:** Забытое обнуление полей источника (ведет к double free), отсутствие спецификатора `noexcept` и случайное копирование вместо перемещения из-за забытого `std::move` на внутренних полях.

     **Пример:**

     ```cpp
     struct Buggy {
         std::string s;
         Buggy(Buggy&& o) : s(o.s) {} // ОШИБКА: o.s копируется, так как не написан std::move(o.s)
     };
     ```

     **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

165. Какие ошибки чаще всего встречаются при ручной реализации move assignment?

     **Ответ:** Отсутствие проверки на self-assignment, утечка старых собственных ресурсов перед перезаписью и пропущенный `noexcept`.

     **Пример:**

     ```cpp
     struct BadAssign {
         int* p;
         BadAssign& operator=(BadAssign&& o) {
             // забыта проверка this != &o и delete p
             p = o.p; o.p = nullptr;
             return *this;
         }
     };
     ```

     **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

166. Что такое partially formed object в контексте исключений и RAII?

     **Ответ:** Это состояние, когда конструктор базового класса или первых полей выполнился, а последующее поле выбросило исключение: сам конструируемый объект считается не созданным, и его деструктор не вызывается.

     **Пример:**

     ```cpp
     struct ComplexObject {
         int* a;
         int* b;
         ComplexObject() : a(new int(1)), b(new int(2)) {} // если new для b бросит bad_alloc, a утечет!
     };
     ```

     **Источник:** [Cppreference: Try block](https://en.cppreference.com/w/cpp/language/try_catch)

167. Как RAII помогает корректно управлять частично сконструированными объектами?

     **Ответ:** Если поля класса сами являются RAII-типами (`unique_ptr`), то при исключении в теле или списке инициализации деструкторы уже сконструированных полей вызываются автоматически.

     **Пример:**

     ```cpp
     #include <memory>

     struct SafeComplex {
         std::unique_ptr<int> a;
         std::unique_ptr<int> b;
         SafeComplex() : a(std::make_unique<int>(1)), b(std::make_unique<int>(2)) {}
         // если b бросит исключение, a автоматически удалится
     };
     ```

     **Источник:** [Cppreference: Try block](https://en.cppreference.com/w/cpp/language/try_catch)

168. Что такое compositional RAII?

     **Ответ:** Композиционный RAII — сборка сложного класса исключительно из существующих стандартных RAII-компонентов без написания собственных деструкторов и операций управления памятью.

     **Пример:**

     ```cpp
     #include <memory>
     #include <string>
     #include <vector>

     struct Profile {
         std::string name;
         std::vector<int> records;
         std::unique_ptr<FILE, decltype(&fclose)> log_file;
     };
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

169. Почему класс из нескольких RAII-полей часто не требует ручного деструктора?

     **Ответ:** Компилятор автоматически генерирует деструктор, который гарантированно вызывает деструкторы всех полей в порядке, обратном их объявлению (Rule of Zero).

     **Пример:**

     ```cpp
     // Поля vector и string сами освободят свою память
     ```

     **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

170. Почему правило нуля особенно важно для composition-based design?

     **Ответ:** Оно делает дизайн модульным, устраняет бойлерплейт и снижает риск возникновения ошибок при модификации состава полей класса.

     **Пример:**

     ```cpp
     // Добавление нового RAII-поля не требует переписывания copy/move конструкторов
     ```

     **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

171. Как `unique_ptr` помогает реализовать pImpl в стиле RAII?

     **Ответ:** `std::unique_ptr<Impl>` автоматически освобождает объект реализации при вызове деструктора интерфейсного класса, если деструктор объявлен в `.cpp`-файле с полным определением `Impl`.

     **Пример:**

     ```cpp
     // Header:
     #include <memory>
     class Widget {
         struct Impl;
         std::unique_ptr<Impl> pImpl;
     public:
         Widget();
         ~Widget(); // определение строго в .cpp
     };
     ```

     **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

172. Почему RAII важен не только для памяти, но и для транзакций, блокировок, файлов и временных состояний?

     **Ответ:** Любой разделяемый ресурс или незавершенное промежуточное состояние требует гарантированного закрытия/отката; сбой в транзакции или локе гораздо опаснее для бизнес-логики, чем утечка пары байт.

     **Пример:**

     ```cpp
     // Откат транзакции БД в случае сбоя
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

173. Что такое scope guard?

     **Ответ:** Scope guard — это вспомогательный легковесный RAII-объект, выполняющий переданное лямбда-выражение или функцию при своем разрушении при выходе из блока.

     **Пример:**

     ```cpp
     template <typename F>
     struct ScopeGuard {
         F func;
         ~ScopeGuard() { func(); }
     };
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

174. Чем scope guard похож на RAII, а чем является его частным случаем?

     **Ответ:** Он реализует механику RAII (действие в деструкторе), но является его специализированным случаем: позволяет произвольно задавать действие по месту вызова без создания отдельного именованного класса.

     **Пример:**

     ```cpp
     int fd = open(...);
     ScopeGuard guard([&]{ close(fd); });
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

175. Что такое rollback-on-failure в контексте RAII?

     **Ответ:** Паттерн, при котором scope guard отменяет выполненные изменения (делает rollback), если блок кода завершился аварийно (выбросил исключение), и деактивируется при успешном завершении (`commit`).

     **Пример:**

     ```cpp
     struct TransactionGuard {
         bool committed = false;
         void commit() { committed = true; }
         ~TransactionGuard() { if (!committed) { /* rollback */ } }
     };
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

176. Как RAII помогает строить commit/rollback-паттерны?

     **Ответ:** Метод `commit()` взводит флаг успеха в конце успешного блока, а деструктор охранника проверяет этот флаг и откатывает транзакцию, если выполнение прервалось раньше времени.

     **Пример:**

     ```cpp
     TransactionGuard tg;
     do_step1();
     do_step2();
     tg.commit(); // если шаг 1 или 2 выбросит исключение, сработает rollback
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

177. Почему порядок объявления полей важен для корректного освобождения ресурсов?

     **Ответ:** Поля уничтожаются строго в порядке, обратном их объявлению в определении класса; если один ресурс зависит от другого в деструкторе, неверный порядок приведет к use-after-free.

     **Пример:**

     ```cpp
     struct System {
         // Connection зависит от Context: Context должен быть объявлен ПЕРВЫМ,
         // чтобы он уничтожился ПОСЛЕДНИМ!
     };
     ```

     **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

178. В каком порядке уничтожаются поля RAII-объекта?

     **Ответ:** Поля класса всегда уничтожаются в порядке, строго **обратном** порядку их объявления в теле класса (снизу вверх).

     **Пример:**

     ```cpp
     struct Device {
         int a; // уничтожится вторым
         int b; // уничтожится первым
     };
     ```

     **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

179. Почему порядок разрушения обратен порядку конструирования?

     **Ответ:** Это гарантирует фундаментальный закон симметрии: позднее созданные объекты могут безопасно использовать в своих деструкторах ранее созданные базовые зависимости.

     **Пример:**

     ```cpp
     // LIFO: Last In — First Out
     ```

     **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

180. Как это влияет на классы, владеющие взаимосвязанными ресурсами?

     **Ответ:** Базовый ресурс (например, контекст библиотеки) обязан быть объявлен выше ресурсов, использующих этот контекст (например, дескрипторов текстур или буферов).

     **Пример:**

     ```cpp
     struct GraphicPipeline {
         Context ctx;      // объявляется первым -> удалится последним
         Texture texture;  // использует ctx в своем деструкторе
     };
     ```

     **Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

181. Что такое move-only callback или move-only task и почему это современная тема?

     **Ответ:** Это вызываемый объект (например, лямбда с захваченным `std::unique_ptr`), который нельзя скопировать; для их хранения и выполнения в modern C++ используют `std::move_only_function` (C++23) вместо устаревшего `std::function`.

     **Пример:**

     ```cpp
     #include <functional>
     #include <memory>

     // std::move_only_function<void()> task = [p = std::make_unique<int>(1)](){};
     ```

     **Источник:** [Cppreference: std::move_only_function](https://en.cppreference.com/w/cpp/utility/functional/move_only_function)

182. Почему некоторые ресурсы концептуально невозможно копировать, но можно перемещать?

     **Ответ:** Потому что физический ресурс в ОС существует в единственном экземпляре (например, уникальный сетевой порт или thread execution); его можно передать другому владельцу, но нельзя расщепить на два.

     **Пример:**

     ```cpp
     #include <thread>

     std::jthread t1;
     // std::jthread t2 = t1; // Невозможно логически
     std::jthread t2 = std::move(t1); // Передача права управления потоком
     ```

     **Источник:** [Cppreference: std::jthread](https://en.cppreference.com/w/cpp/thread/jthread)

183. Когда перемещение ресурса может быть почти бесплатным?

     **Ответ:** Когда ресурс представлен указателем или скалярным типом в куче: операция сводится к присваиванию пары указателей в регистрах процессора за пару процессорных тактов.

     **Пример:**

     ```cpp
     #include <memory>

     std::unique_ptr<int> a = std::make_unique<int>(5);
     std::unique_ptr<int> b = std::move(a); // 2 инструкции на ассемблере
     ```

     **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

184. Когда move operation всё равно может быть дорогой?

     **Ответ:** Когда объект использует оптимизацию малых буферов (Small String/Buffer Optimization): данные хранятся не в куче, а прямо внутри объекта на стеке, что заставляет перемещение выполнять побайтовое копирование этого буфера.

     **Пример:**

     ```cpp
     #include <string>

     std::string s1 = "small"; // хранится на стеке внутри объекта
     std::string s2 = std::move(s1); // копирует 15 байт буфера
     ```

     **Источник:** [Cppreference: std::basic_string](https://en.cppreference.com/w/cpp/string/basic_string)

185. Всегда ли имеет смысл писать move-операции вручную?

     **Ответ:** Нет, если все поля класса поддерживают перемещение, компилятор сам сгенерирует наиболее оптимальные move-операции; ручное написание повышает вероятность внесения багов.

     **Пример:**

     ```cpp
     // Лучше довериться компилятору
     ```

     **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

186. Когда лучше положиться на `= default`?

     **Ответ:** Когда вам нужно восстановить генерацию move-операций (заблокированную пользовательским деструктором), и при этом все поля класса безопасно перемещаются по умолчанию.

     **Пример:**

     ```cpp
     struct ModernEntity {
         virtual ~ModernEntity() = default;
         ModernEntity(ModernEntity&&) noexcept = default;
         ModernEntity& operator=(ModernEntity&&) noexcept = default;
     };
     ```

     **Источник:** [Cppreference: Defaulted functions](https://en.cppreference.com/w/cpp/language/function#Defaulted_functions)

187. Когда пользовательский деструктор мешает автоматически получить хорошие move-операции?

     **Ответ:** Всегда: объявление деструктора отключает неявную генерацию move-конструктора и move-assignment оператора компилятором, превращая перемещения в скрытые и дорогие копирования.

     **Пример:**

     ```cpp
     struct Heavy {
         std::vector<int> data;
         ~Heavy() {} // БАГ производительности: теперь Heavy(Heavy&&) не генерируется!
     };
     ```

     **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

188. Почему raw owning pointer в классе сегодня обычно считается тревожным сигналом?

     **Ответ:** Он указывает на нарушение Rule of Zero и свидетельствует о том, что разработчик вручную управляет памятью вместо использования `std::unique_ptr` или стандартных контейнеров, рискуя создать утечку.

     **Пример:**

     ```cpp
     // Подозрительно:
     // int* data_;
     // Идиоматично:
     // std::unique_ptr<int[]> data_;
     ```

     **Источник:** [Cppreference: Smart pointers](https://en.cppreference.com/w/cpp/memory)

189. Почему RAII и move semantics вместе считаются ядром modern C++?

     **Ответ:** RAII отвечает за детерминированную корректность и безопасность ресурсов, а move semantics устраняет накладные расходы на их передачу, превращая C++ в язык со строгими гарантиями безопасности памяти без необходимости сборщика мусора.

     **Пример:**

     ```cpp
     #include <memory>
     #include <vector>

     std::vector<std::unique_ptr<int>> container; // надежно, быстро, без утечек
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

190. Какие основные практические правила по RAII и move semantics ты бы сформулировал для нового C++-проекта?

     **Ответ:**

     1. **Rule of Zero:** проектируйте классы так, чтобы не писать деструкторы и копирования вручную; используйте готовые типы (`vector`, `string`, `unique_ptr`).
     2. **Move по умолчанию:** всегда помечайте move-конструкторы и move-присваивания как `noexcept`.
     3. **Явное владение:** используйте `std::unique_ptr` для монопольного владения, `std::shared_ptr` — только при реальной необходимости разделения ресурсов, а невладеющие ссылки передавайте через `T&`, `T*`, `string_view` или `span`.
     4. **RAII для всего:** оборачивайте любой системный захват (сокеты, файлы, мьютексы, транзакции) в RAII-объекты или scope guards.
     5. **Возврат по значению:** возвращайте фабричные и локальные объекты по значению, полагаясь на copy elision и перемещение.

     **Пример:**

     ```cpp
     #include <span>
     #include <memory>

     // Идиоматичный modern C++ дизайн
     class SafeWorker {
         std::unique_ptr<int[]> buffer_;
     public:
         SafeWorker(size_t n) : buffer_(std::make_unique<int[]>(n)) {}
         // Деструктор, copy, move сгенерированы компилятором идеально
         void process(std::span<const int> input) noexcept;
     };
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

[<- Prev](./09_modern_cpp.md)           [Next ->](./11_exceptions.md)
