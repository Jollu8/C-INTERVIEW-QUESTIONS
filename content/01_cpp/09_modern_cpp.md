# Modern C++

## Лёгкий уровень

1. Что обычно понимают под термином Modern C++?

   **Ответ:** Под Modern C++ понимают свод практик, идиом и возможностей языка, появившихся начиная со стандарта C++11 (C++11, C++14, C++17, C++20, C++23), ориентированных на безопасность памяти, семантику перемещения, RAII, вывод типов и вычисления на этапе компиляции.

   **Пример:**

   ```cpp
   #include <memory>
   #include <vector>

   auto ptr = std::make_unique<std::vector<int>>(); // Modern C++: авто-вывод и умные указатели
   ```

   **Источник:** [Cppreference: C++ language](https://en.cppreference.com/w/cpp/language)

2. Почему Modern C++ обычно связывают с C++11 и более новыми стандартами?

   **Ответ:** Стандарт C++11 кардинально обновил язык, внедрив фундаментальные механизмы: семантику перемещения (`move semantics`), автоматический вывод типов (`auto`), лямбды, умные указатели и модель памяти для многопоточности.

   **Пример:**

   ```cpp
   auto lambda = [](int x) { return x * 2; };
   ```

   **Источник:** [Cppreference: C++11](https://en.cppreference.com/w/cpp/11)

3. Чем современный стиль C++ отличается от “старого” C with Classes-подхода?

   **Ответ:** Старый стиль опирался на ручные аллокации, макросы, сырые указатели и си-массивы. Modern C++ опирается на строгую типизацию, обобщенное программирование, алгоритмы стандартной библиотеки и семантику значений.

   **Пример:**

   ```cpp
   #include <vector>
   #include <algorithm>

   std::vector<int> v = {3, 1, 2};
   std::sort(v.begin(), v.end()); // Вместо qsort и void*
   ```

   **Источник:** [Cppreference: Algorithms library](https://en.cppreference.com/w/cpp/algorithm)

4. Почему в modern C++ стараются меньше использовать сырой `new` и `delete`?

   **Ответ:** Ручное управление через `new`/`delete` подвержено утечкам памяти при возникновении исключений (exception safety) и ошибкам повторного освобождения (double free). Умные указатели и контейнеры делают освобождение детерминированным и автоматическим.

   **Пример:**

   ```cpp
   #include <memory>

   void safe() {
       auto ptr = std::make_unique<int>(42); // delete вызовется автоматически при любом выходе
   }
   ```

   **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

5. Почему в modern C++ предпочитают RAII ручному управлению ресурсами?

   **Ответ:** RAII связывает время жизни ресурса со временем жизни объекта в стеке, гарантируя своевременное освобождение ресурса даже при досрочных возвратах и выбросе исключений.

   **Пример:**

   ```cpp
   #include <mutex>

   std::mutex mtx;
   void task() {
       std::lock_guard<std::mutex> lock(mtx); // разблокировка в деструкторе lock
   }
   ```

   **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

6. Что такое RAII в современном C++?

   **Ответ:** RAII (Resource Acquisition Is Initialization) — идиома, согласно которой захват ресурса (памяти, сокета, файла, мьютекса) выполняется в конструкторе, а его освобождение строго в деструкторе объекта.

   **Пример:**

   ```cpp
   #include <fstream>

   void write() {
       std::ofstream file("log.txt");
       file << "message";
   } // файл гарантированно закроется при уничтожении file
   ```

   **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

7. Почему automatic storage duration часто предпочтительнее динамического выделения памяти?

   **Ответ:** Объекты со временем жизни в автоматической памяти (на стеке) не требуют вызова системного аллокатора, размещаются непрерывно, кэш-дружелюбны и удаляются процессором за одну инструкцию смещения стекового указателя.

   **Пример:**

   ```cpp
   #include <array>

   std::array<int, 1024> stack_arr; // быстро, без кучи
   ```

   **Источник:** [Cppreference: Storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

8. Что такое `nullptr`?

   **Ответ:** `nullptr` — это ключевое слово C++11, литерал константы нулевого указателя, имеющий независимый тип `std::nullptr_t`.

   **Пример:**

   ```cpp
   int* p = nullptr;
   ```

   **Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

9. Чем `nullptr` лучше `NULL` и `0`?

   **Ответ:** `nullptr` строго типизирован и неявно приводится только к типам указателей, исключая неоднозначность при перегрузке функций между целочисленными типами (`int`) и указателями.

   **Пример:**

   ```cpp
   void f(int);
   void f(int*);

   // f(NULL);    // Ошибка или вызов f(int) в зависимости от платформы
   f(nullptr); // Однозначный вызов f(int*)
   ```

   **Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

10. Что такое `auto`?

    **Ответ:** `auto` — спецификатор, предписывающий компилятору вывести тип переменной на этапе компиляции из типа её инициализирующего выражения.

    **Пример:**

    ```cpp
    auto count = 10;      // int
    auto pi = 3.14;       // double
    ```

    **Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

11. Когда `auto` улучшает читаемость кода?

    **Ответ:** При работе с длинными и сложными типами (итераторы, замыкания лямбд, типы из шаблонов), а также когда тип переменной явно виден в правой части выражения.

    **Пример:**

    ```cpp
    #include <map>
    #include <string>

    std::map<std::string, int> m;
    auto it = m.begin(); // вместо std::map<std::string, int>::iterator
    ```

    **Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

12. Когда `auto` ухудшает читаемость кода?

    **Ответ:** Когда тип инициализатора неочевиден читателю (например, при вызове незнакомой функции `auto x = calculate();`), либо когда компилятор выводит прокси-тип вместо ожидаемого значения (например, с `std::vector<bool>`).

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<bool> flags = {true, false};
    auto b = flags[0]; // b имеет тип std::vector<bool>::reference, а не bool!
    ```

    **Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

13. Что такое range-based `for`?

    **Ответ:** Это цикл C++11, позволяющий последовательно обходить все элементы диапазона или контейнера без явного использования индексов и итераторов.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> nums = {1, 2, 3};
    for (const auto& x : nums) {
        // обработка x
    }
    ```

    **Источник:** [Cppreference: Range-based for loop](https://en.cppreference.com/w/cpp/language/range-for)

14. Чем range-based `for` удобнее обычного цикла по индексам?

    **Ответ:** Он исключает ошибки выхода за границы массива (off-by-one errors), делает код лаконичным и одинаково работает с контейнерами без произвольного доступа (`std::list`, `std::set`).

    **Пример:**

    ```cpp
    #include <set>

    std::set<int> s = {10, 20};
    for (auto val : s) { /* ... */ } // с индексами не сработало бы
    ```

    **Источник:** [Cppreference: Range-based for loop](https://en.cppreference.com/w/cpp/language/range-for)

15. Что такое uniform initialization?

    **Ответ:** Единая концепция инициализации через фигурные скобки `{}`, унифицирующая синтаксис инициализации базовых типов, агрегатов, конструкторов классов и списков инициализации.

    **Пример:**

    ```cpp
    int a{5};
    int arr[]{1, 2, 3};
    ```

    **Источник:** [Cppreference: List initialization](https://en.cppreference.com/w/cpp/language/list_initialization)

16. Что такое список инициализации в фигурных скобках `{}`?

    **Ответ:** Это синтаксическая конструкция (`braced-init-list`), передающая список аргументов в конструктор или заполняющая поля агрегата.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v{1, 2, 3, 4};
    ```

    **Источник:** [Cppreference: List initialization](https://en.cppreference.com/w/cpp/language/list_initialization)

17. Почему инициализация через `{}` считается важной частью modern C++?

    **Ответ:** Она запрещает неявные сужающие преобразования типов (narrowing conversions) и решает проблему "Most Vexing Parse", когда объявление объекта ошибочно распознавалось как объявление функции.

    **Пример:**

    ```cpp
    struct Device {};
    // Device d(); // компилятор считал это функцией d, возвращающей Device
    Device d{};    // гарантированно создаёт объект
    ```

    **Источник:** [Cppreference: List initialization](https://en.cppreference.com/w/cpp/language/list_initialization)

18. Что такое `= delete`?

    **Ответ:** Спецификатор, явно запрещающий вызов помеченной специальной функции-члена класса или перегрузки обычной функции на этапе компиляции.

    **Пример:**

    ```cpp
    struct NonCopyable {
        NonCopyable(const NonCopyable&) = delete;
        NonCopyable& operator=(const NonCopyable&) = delete;
    };
    ```

    **Источник:** [Cppreference: Deleted functions](https://en.cppreference.com/w/cpp/language/function#Deleted_functions)

19. Что такое `= default`?

    **Ответ:** Спецификатор, требующий от компилятора сгенерировать реализацию специальной функции-члена (конструктора, деструктора, оператора копирования/перемещения) по умолчанию.

    **Пример:**

    ```cpp
    struct Base {
        virtual ~Base() = default;
    };
    ```

    **Источник:** [Cppreference: Defaulted functions](https://en.cppreference.com/w/cpp/language/function#Defaulted_functions)

20. Зачем явно запрещать некоторые операции через `= delete`?

   **Ответ:** Чтобы выразить инварианты владения (например, запретить копирование для уникальных ресурсов вроде файлов или сокетов) или защититься от нежелательных неявных преобразований типов аргументов.

   **Пример:**

   ```cpp
   void process(int);
   void process(double) = delete; // запрет вызова с double
   ```

   **Источник:** [Cppreference: Deleted functions](https://en.cppreference.com/w/cpp/language/function#Deleted_functions)

21. Что такое `override`?

    **Ответ:** Контекстное ключевое слово, указывающее компилятору, что виртуальный метод наследника обязан переопределять виртуальный метод базового класса с точно совпадающей сигнатурой.

    **Пример:**

    ```cpp
    struct Base {
        virtual void run(int);
    };

    struct Derived : Base {
        void run(int) override; // компилятор проверит совпадение сигнатуры
    };
    ```

    **Источник:** [Cppreference: override](https://en.cppreference.com/w/cpp/language/override)

22. Почему `override` полезен в современном C++?

    **Ответ:** Он исключает ошибки опечаток в именах методов и расхождений в сигнатурах (`const`, типы параметров), превращая потенциальный тихий баг в ошибку компиляции.

    **Пример:**

    ```cpp
    struct Base {
        virtual void compute(double) const;
    };
    struct Derived : Base {
        // void compute(int) override; // Ошибка компиляции: метод не переопределяет базу
    };
    ```

    **Источник:** [Cppreference: override](https://en.cppreference.com/w/cpp/language/override)

23. Что такое `final`?

    **Ответ:** Спецификатор, запрещающий дальнейшее наследование от класса либо дальнейшее переопределение виртуального метода в дочерних классах.

    **Пример:**

    ```cpp
    struct NonDerivable final {};
    // struct Child : NonDerivable {}; // Ошибка компиляции
    ```

    **Источник:** [Cppreference: final](https://en.cppreference.com/w/cpp/language/final)

24. Когда имеет смысл помечать метод `final`?

    **Ответ:** Когда дизайн иерархии требует зафиксировать поведение метода, а также для девиртуализации вызовов компилятором (превращения виртуального вызова в прямой быстрый вызов).

    **Пример:**

    ```cpp
    struct Base {
        virtual void print();
    };
    struct Middle : Base {
        void print() final; // дальше запрещено переопределять
    };
    ```

    **Источник:** [Cppreference: final](https://en.cppreference.com/w/cpp/language/final)

25. Что такое `enum class`?

    **Ответ:** Это строго типизированное перечисление с областью видимости (scoped enumeration), введенное в C++11.

    **Пример:**

    ```cpp
    enum class Color { Red, Green, Blue };
    Color c = Color::Red;
    ```

    **Источник:** [Cppreference: Enumeration](https://en.cppreference.com/w/cpp/language/enum)

26. Чем `enum class` лучше обычного `enum`?

    **Ответ:** Имена значений не засоряют внешнее пространство имен, отсутствует неявное приведение к целому числу (`int`), и можно явно указывать базовый целочисленный тип хранения.

    **Пример:**

    ```cpp
    enum class Status : char { Ok, Error };
    // int x = Status::Ok; // Ошибка компиляции: нет неявного приведения
    ```

    **Источник:** [Cppreference: Enumeration](https://en.cppreference.com/w/cpp/language/enum)

27. Что такое `using` для псевдонимов типов?

    **Ответ:** Синтаксическая конструкция (type alias), определяющая новое имя для существующего типа данных, заменяющая устаревший `typedef`.

    **Пример:**

    ```cpp
    using IntVector = std::vector<int>;
    ```

    **Источник:** [Cppreference: Type alias](https://en.cppreference.com/w/cpp/language/type_alias)

28. Чем `using` удобнее `typedef`?

    **Ответ:** Синтаксис `using` более читаем (напоминает присваивание) и напрямую поддерживает создание шаблонных псевдонимов (`alias templates`), что невозможно с `typedef`.

    **Пример:**

    ```cpp
    template <typename T>
    using StringMap = std::map<std::string, T>;
    ```

    **Источник:** [Cppreference: Type alias](https://en.cppreference.com/w/cpp/language/type_alias)

29. Что такое `static_assert`?

    **Ответ:** Механизм проверки условий на этапе компиляции, прерывающий сборку с информативным сообщением, если константное булево выражение равно `false`.

    **Пример:**

    ```cpp
    static_assert(sizeof(void*) == 8, "Only 64-bit architecture is supported");
    ```

    **Источник:** [Cppreference: static_assert](https://en.cppreference.com/w/cpp/language/static_assert)

30. Для чего нужен `static_assert`?

    **Ответ:** Для проверки инвариантов шаблонов, ограничений размеров типов, свойств платформ и валидации метапрограммирования до запуска исполняемого файла.

    **Пример:**

    ```cpp
    #include <type_traits>

    template <typename T>
    void verify() {
        static_assert(std::is_integral_v<T>, "T must be an integral type");
    }
    ```

    **Источник:** [Cppreference: static_assert](https://en.cppreference.com/w/cpp/language/static_assert)

31. Что такое лямбда-выражение?

    **Ответ:** Это анонимный функциональный объект (замыкание), определяемый непосредственно по месту использования с возможностью захвата локальных переменных из контекста.

    **Пример:**

    ```cpp
    auto square = [](int x) { return x * x; };
    int y = square(5); // 25
    ```

    **Источник:** [Cppreference: Lambda expressions](https://en.cppreference.com/w/cpp/language/lambda)

32. Почему лямбды считаются одной из ключевых возможностей modern C++?

    **Ответ:** Они позволили естественным образом писать предикаты и функции обратного вызова прямо внутри вызовов алгоритмов STL без написания отдельных именованных классов-функторов.

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> v = {1, 2, 3, 4};
    int count = std::count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
    ```

    **Источник:** [Cppreference: Lambda expressions](https://en.cppreference.com/w/cpp/language/lambda)

33. Что такое smart pointer?

    **Ответ:** Это RAII-класс-обёртка над сырым указателем, инкапсулирующий владение динамическим ресурсом и автоматически освобождающий его при выходе из области видимости.

    **Пример:**

    ```cpp
    #include <memory>

    std::unique_ptr<int> p(new int(10));
    ```

    **Источник:** [Cppreference: Smart pointers](https://en.cppreference.com/w/cpp/memory)

34. Какие основные smart pointers есть в стандартной библиотеке?

    **Ответ:** В `<memory>` входят три основных умных указателя: `std::unique_ptr` (единоличное владение), `std::shared_ptr` (разделяемое владение) и `std::weak_ptr` (невладеющая ссылка на `shared_ptr`).

    **Пример:**

    ```cpp
    #include <memory>

    std::unique_ptr<int> u;
    std::shared_ptr<int> s;
    std::weak_ptr<int> w;
    ```

    **Источник:** [Cppreference: Smart pointers](https://en.cppreference.com/w/cpp/memory)

35. Что такое `std::unique_ptr`?

    **Ответ:** Умный указатель, реализующий модель эксклюзивного (единоличного) владения объектом в динамической памяти. Запрещает копирование, но поддерживает перемещение.

    **Пример:**

    ```cpp
    #include <memory>

    auto p1 = std::make_unique<int>(10);
    // auto p2 = p1; // Ошибка компиляции: копирование запрещено
    auto p2 = std::move(p1); // владение перешло к p2
    ```

    **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

36. Что такое `std::shared_ptr`?

    **Ответ:** Умный указатель, реализующий разделяемое владение через контрольный блок со счётчиком ссылок (`reference count`). Объект уничтожается, когда последний `shared_ptr` выходит из жизни.

    **Пример:**

    ```cpp
    #include <memory>

    auto sp1 = std::make_shared<int>(20);
    auto sp2 = sp1; // счетчик равен 2
    ```

    **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

37. Что такое `std::weak_ptr`?

    **Ответ:** Невладеющий умный указатель, ссылающийся на объект, управляемый `std::shared_ptr`, без увеличения основного счетчика ссылок (используется для предотвращения циклических зависимостей).

    **Пример:**

    ```cpp
    #include <memory>

    auto sp = std::make_shared<int>(42);
    std::weak_ptr<int> wp = sp;
    if (auto locked = wp.lock()) {
        // объект еще жив
    }
    ```

    **Источник:** [Cppreference: std::weak_ptr](https://en.cppreference.com/w/cpp/memory/weak_ptr)

38. Что такое `std::make_unique`?

    **Ответ:** Стандартная функция создания `std::unique_ptr` (C++14), идеально передающая аргументы в конструктор объекта и возвращающая созданный умный указатель.

    **Пример:**

    ```cpp
    #include <memory>

    auto p = std::make_unique<int>(100);
    ```

    **Источник:** [Cppreference: std::make_unique](https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique)

39. Что такое `std::make_shared`?

    **Ответ:** Фабричная функция, выделяющая память под контрольный блок и целевой объект в едином непрерывном куске памяти за одну системную аллокацию.

    **Пример:**

    ```cpp
    #include <memory>

    auto sp = std::make_shared<std::string>("abc");
    ```

    **Источник:** [Cppreference: std::make_shared](https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared)

40. Почему `make_unique` и `make_shared` обычно предпочтительнее явного `new`?

    **Ответ:** Они гарантируют безопасность исключений (exception safety) при конструировании сложных выражений аргументов, избавляют от дублирования типа и повышают производительность (`make_shared` объединяет аллокацию объекта и счетчика).

    **Пример:**

    ```cpp
    #include <memory>

    void f(std::shared_ptr<int>, int);
    int get_val();

    // f(std::shared_ptr<int>(new int(5)), get_val()); // Опасно до C++17 при исключении в get_val
    f(std::make_shared<int>(5), get_val());             // Всегда безопасно
    ```

    **Источник:** [Cppreference: std::make_shared](https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared)

41. Что такое move semantics?

    **Ответ:** Семантика перемещения — механизм передачи ресурсов (буферов памяти, дескрипторов) от временного или более ненужного объекта к новому без выполнения глубокого копирования данных.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> a = {1, 2, 3};
    std::vector<int> b = std::move(a); // b забирает внутренний указатель на массив a
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

42. Почему move semantics стали важны в C++11?

    **Ответ:** Они устранили паразитные накладные расходы на копирование тяжелых объектов при передаче по значению и возврате из функций, позволив создавать типы только для перемещения (`unique_ptr`, `thread`).

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> create_large() {
        std::vector<int> v(1000000);
        return v; // перемещается за O(1)
    }
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

43. Что такое rvalue reference?

    **Ответ:** Ссылка на временный объект (или объект, явно приведенный к категории rvalue), объявляемая через синтаксис `T&&`, используемая для связывания с ресурсами, готовыми к перемещению.

    **Пример:**

    ```cpp
    int&& rref = 42; // связывается с литералом 42
    ```

    **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

44. Как объявить `T&&`?

   **Ответ:** Путем добавления двойного амперсанда `&&` после имени типа: для конкретного типа это объявляет rvalue-ссылку.

   **Пример:**

   ```cpp
   #include <string>

   void consume(std::string&& s); // принимает только rvalue
   ```

   **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

45. Что делает `std::move`?

    **Ответ:** `std::move` выполняет безусловное статическое приведение переданного lvalue-выражения к типу rvalue-ссылки (`static_cast<std::remove_reference_t<T>&&>(t)`), сигнализируя, что объект можно опустошить.

    **Пример:**

    ```cpp
    #include <utility>
    #include <string>

    std::string s = "data";
    auto&& r = std::move(s); // r имеет тип std::string&&
    ```

    **Источник:** [Cppreference: std::move](https://en.cppreference.com/w/cpp/utility/move)

46. Почему `std::move` сам по себе ничего не перемещает?

    **Ответ:** `std::move` — это всего лишь приведение типов во время компиляции. Фактическое перемещение данных совершает вызванный конструктор перемещения или оператор перемещающего присваивания.

    **Пример:**

    ```cpp
    #include <utility>

    int a = 5;
    std::move(a); // ничего не произошло, a все еще 5
    ```

    **Источник:** [Cppreference: std::move](https://en.cppreference.com/w/cpp/utility/move)

47. Что такое `constexpr`?

    **Ответ:** Спецификатор, обозначающий, что значение переменной или результат функции может быть вычислен на этапе компиляции при условии передачи константных аргументов.

    **Пример:**

    ```cpp
    constexpr int square(int x) { return x * x; }
    constexpr int val = square(5); // вычислено компилятором
    ```

    **Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr)

48. Чем `constexpr` отличается от `const`?

    **Ответ:** `const` означает неизменяемость (read-only) в runtime и может инициализироваться динамическими данными, а `constexpr` требует обязательной инициализации константным выражением во время компиляции.

    **Пример:**

    ```cpp
    int get_runtime_val();

    const int a = get_runtime_val();     // корректно
    // constexpr int b = get_runtime_val(); // Ошибка компиляции
    ```

    **Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr)

49. Что такое `noexcept`?

    **Ответ:** Спецификатор функции, гарантирующий, что функция не выбрасывает исключений. Если функция с `noexcept` все же выбросит исключение, будет немедленно вызвана `std::terminate`.

    **Пример:**

    ```cpp
    void safe_func() noexcept {}
    ```

    **Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

50. Почему `noexcept` важен в современном C++?

    **Ответ:** Он позволяет компилятору генерировать более компактный и быстрый код без обвязки раскрутки стека и критичен для STL-контейнеров (например, `vector` использует перемещение только если move-конструктор типа помечен `noexcept`).

    **Пример:**

    ```cpp
    struct Item {
        Item(Item&&) noexcept = default; // std::vector будет перемещать элементы при реаллокации
    };
    ```

    **Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

## Ниже среднего уровня

51. Почему в modern C++ предпочитают инициализацию объекта сразу при создании?

    **Ответ:** Это исключает нахождение переменной в неопределенном или невалидном состоянии, гарантирует соблюдение инвариантов класса и позволяет объявлять переменные как `const`.

    **Пример:**

    ```cpp
    int calculate();
    const int result = calculate(); // вместо int result; result = calculate();
    ```

    **Источник:** [Cppreference: Initialization](https://en.cppreference.com/w/cpp/language/initialization)

52. Чем инициализация отличается от присваивания?

    **Ответ:** Инициализация создает объект в неинициализированной памяти через вызов конструктора, а присваивание заменяет значение уже существующего и ранее инициализированного объекта через `operator=`.

    **Пример:**

    ```cpp
    #include <string>

    std::string s1 = "init"; // инициализация (конструктор)
    std::string s2;          // инициализация дефолтная
    s2 = "assigned";         // присваивание
    ```

    **Источник:** [Cppreference: Initialization](https://en.cppreference.com/w/cpp/language/initialization)

53. Что такое narrowing conversion?

    **Ответ:** Сужающее преобразование — это неявное преобразование значения одного типа в другой, при котором может произойти потеря данных (например, `double` в `int` или `long long` в `short`).

    **Пример:**

    ```cpp
    double d = 3.99;
    int i = d; // narrowing: значение усекается до 3
    ```

    **Источник:** [Cppreference: List initialization](https://en.cppreference.com/w/cpp/language/list_initialization)

54. Почему инициализация через `{}` помогает избегать narrowing conversions?

    **Ответ:** Стандарт строго запрещает сужающие преобразования внутри braced-init-list `{}`; при попытке выполнить такое преобразование компилятор выдает ошибку.

    **Пример:**

    ```cpp
    // int x{3.14}; // Ошибка компиляции: narrowing conversion
    ```

    **Источник:** [Cppreference: List initialization](https://en.cppreference.com/w/cpp/language/list_initialization)

55. Чем `int x = 3.14;` отличается от `int x{3.14};`?

    **Ответ:** Запись `int x = 3.14;` компилируется с неявным отсечением дробной части (`x` равен 3), а `int x{3.14};` отклоняется компилятором как некорректный код.

    **Пример:**

    ```cpp
    int a = 3.14; // Компилируется
    // int b{3.14}; // Ошибка компиляции
    ```

    **Источник:** [Cppreference: List initialization](https://en.cppreference.com/w/cpp/language/list_initialization)

56. Что такое delegating constructors?

    **Ответ:** Делегирующие конструкторы (C++11) — возможность конструктора класса вызвать другой конструктор того же класса в своем списке инициализации.

    **Пример:**

    ```cpp
    class Widget {
        int x;
    public:
        Widget(int val) : x(val) {}
        Widget() : Widget(42) {} // делегирование
    };
    ```

    **Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

57. Что такое inherited constructors?

    **Ответ:** Унаследованные конструкторы (C++11) — механизм, позволяющий производному классу объявить `using Base::Base;`, автоматически унаследовав все конструкторы базового класса.

    **Пример:**

    ```cpp
    struct Base {
        Base(int, double);
    };
    struct Derived : Base {
        using Base::Base; // наследует Base(int, double)
    };
    ```

    **Источник:** [Cppreference: using declaration](https://en.cppreference.com/w/cpp/language/using_declaration)

58. Для чего нужны делегирующие конструкторы?

    **Ответ:** Для исключения дублирования общей логики инициализации полей между несколькими перегруженными конструкторами класса (принцип DRY).

    **Пример:**

    ```cpp
    struct Point {
        int x, y;
        Point(int x, int y) : x(x), y(y) {}
        Point(int v) : Point(v, v) {} // переиспользование логики
    };
    ```

    **Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

59. Что такое member initializer list?

    **Ответ:** Список инициализации членов класса — синтаксическая конструкция между заголовком конструктора и его телом, начинающаяся с двоеточия, где поля инициализируются напрямую.

    **Пример:**

    ```cpp
    struct Node {
        int id;
        Node(int i) : id(i) {} // member initializer list
    };
    ```

    **Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

60. Почему поля класса лучше инициализировать в списке инициализации, а не присваивать в теле конструктора?

    **Ответ:** В теле конструктора поля сначала конструируются по умолчанию, а затем перезаписываются оператором присваивания, что приводит к двойной работе и не работает для `const`-полей и ссылок.

    **Пример:**

    ```cpp
    #include <string>

    struct User {
        std::string name;
        User(const std::string& n) : name(n) {} // сразу конструирует копированием
    };
    ```

    **Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

61. Что такое in-class member initializers?

    **Ответ:** Инициализация полей по месту их объявления в теле класса (C++11) значениями по умолчанию без необходимости прописывать их в каждом конструкторе.

    **Пример:**

    ```cpp
    struct Config {
        int timeout = 3000;
        bool enabled = true;
    };
    ```

    **Источник:** [Cppreference: Non-static member initialization](https://en.cppreference.com/w/cpp/language/data_members#Member_initialization)

62. Чем полезны значения полей по умолчанию прямо в объявлении класса?

    **Ответ:** Они гарантируют, что ни одно поле не останется неинициализированным при добавлении новых конструкторов, и уменьшают размер конструкторов по умолчанию.

    **Пример:**

    ```cpp
    struct Connection {
        int port = 8080;
        Connection() = default; // port гарантированно будет 8080
    };
    ```

    **Источник:** [Cppreference: Non-static member initialization](https://en.cppreference.com/w/cpp/language/data_members#Member_initialization)

63. Что такое `decltype`?

    **Ответ:** Оператор, вычисляющий точный тип переданного выражения во время компиляции без фактического выполнения этого выражения.

    **Пример:**

    ```cpp
    int x = 0;
    decltype(x) y = 10; // int
    ```

    **Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

64. Чем `decltype` отличается от `auto`?

    **Ответ:** `auto` отбрасывает ссылки и верхние `const`-квалификаторы (подобно правилам передачи аргументов по значению в шаблонах), а `decltype` точно сохраняет тип выражения вместе со ссылочностью и константностью.

    **Пример:**

    ```cpp
    const int& ref = 10;
    auto a = ref;             // int
    decltype(ref) b = ref;   // const int&
    ```

    **Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

65. Что такое trailing return type?

    **Ответ:** Синтаксис указания типа возвращаемого значения функции после списка параметров через `auto ... -> ReturnType`.

    **Пример:**

    ```cpp
    auto add(int a, int b) -> int {
        return a + b;
    }
    ```

    **Источник:** [Cppreference: Function declaration](https://en.cppreference.com/w/cpp/language/function#Return_type_deduction)

66. Когда запись `auto f() -> T` удобнее обычной формы?

    **Ответ:** Когда тип возвращаемого значения зависит от имен параметров функции (в шаблонных функциях с `decltype`), а также при объявлении лямбд или сложных типов указателей на функции.

    **Пример:**

    ```cpp
    template <typename T, typename U>
    auto multiply(T t, U u) -> decltype(t * u) {
        return t * u;
    }
    ```

    **Источник:** [Cppreference: Function declaration](https://en.cppreference.com/w/cpp/language/function#Return_type_deduction)

67. Что такое `decltype(auto)`?

    **Ответ:** Спецификатор вывода типа (C++14), выводящий тип выражения по правилам `decltype`, но с лаконичным синтаксисом `auto`.

    **Пример:**

    ```cpp
    int val = 42;
    int& get_ref() { return val; }

    decltype(auto) r = get_ref(); // int& (с обычным auto было бы int)
    ```

    **Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

68. Почему `decltype(auto)` требует аккуратности?

    **Ответ:** Добавление круглых скобок вокруг имени переменной в операторе `return` превращает имя переменной в lvalue-выражение `(x)`, заставляя `decltype(auto)` вывести ссылку на локальную переменную, создавая висячую ссылку.

    **Пример:**

    ```cpp
    decltype(auto) dangerous() {
        int x = 10;
        return (x); // ОШИБКА: возвращает int& на локальный x!
    }
    ```

    **Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

69. Что такое value category выражения?

    **Ответ:** Категория значения выражения — характеристика выражения в C++, определяющая два ключевых свойства: имеет ли оно идентичность (identity) и может ли быть перемещено (can be moved from).

    **Пример:**

    ```cpp
    int x = 10; // 'x' имеет категорию lvalue, а литерал '10' — prvalue
    ```

    **Источник:** [Cppreference: Value categories](https://en.cppreference.com/w/cpp/language/value_category)

70. Какие основные value categories есть в современном C++?

    **Ответ:** Фундаментальные категории: `lvalue`, `prvalue` (pure rvalue) и `xvalue` (eXpiring value). Они объединяются в обобщенные: `glvalue` (`lvalue` + `xvalue`) и `rvalue` (`prvalue` + `xvalue`).

    **Пример:**

    ```cpp
    // prvalue: 42, Foo()
    // xvalue: std::move(obj)
    // lvalue: именованные переменные x, ref
    ```

    **Источник:** [Cppreference: Value categories](https://en.cppreference.com/w/cpp/language/value_category)

71. Что такое lvalue?

    **Ответ:** Выражение, определяющее идентифицируемый объект, адрес которого можно взять через оператор `&` (обычно именованные переменные, ссылки, возвращаемые функциями `T&`).

    **Пример:**

    ```cpp
    int a = 5;
    int* p = &a; // 'a' является lvalue
    ```

    **Источник:** [Cppreference: Value categories](https://en.cppreference.com/w/cpp/language/value_category)

72. Что такое prvalue?

    **Ответ:** Чистое значение (pure rvalue) — выражение, вычисляющее значение для инициализации объекта или операнда, не имеющее постоянного адреса (литералы, временные объекты, возвращенные по значению `T`).

    **Пример:**

    ```cpp
    int x = 10 + 20; // '10 + 20' — prvalue
    ```

    **Источник:** [Cppreference: Value categories](https://en.cppreference.com/w/cpp/language/value_category)

73. Что такое xvalue?

    **Ответ:** Объект с идентичностью (адресом в памяти), время жизни которого подходит к концу, и ресурсы которого разрешено опустошить (например, результат `std::move(obj)`).

    **Пример:**

    ```cpp
    #include <utility>
    #include <string>

    std::string s = "test";
    // std::move(s) является xvalue
    ```

    **Источник:** [Cppreference: Value categories](https://en.cppreference.com/w/cpp/language/value_category)

74. Почему value categories важны для move semantics?

    **Ответ:** Они определяют правила разрешения перегрузок: конструкторы перемещения принимают только выражения категории `rvalue` (`prvalue` и `xvalue`), защищая устойчивые `lvalue` от случайного опустошения.

    **Пример:**

    ```cpp
    #include <utility>
    #include <vector>

    std::vector<int> v;
    // std::vector<int> v2 = v;            // v — lvalue, вызовется копирование
    std::vector<int> v3 = std::move(v); // xvalue (rvalue), вызовется перемещение
    ```

    **Источник:** [Cppreference: Value categories](https://en.cppreference.com/w/cpp/language/value_category)

75. Что такое perfect forwarding?

    **Ответ:** Идеальная передача аргументов — техника в шаблонах, позволяющая передать аргумент в другую функцию с сохранением исходной категории значения (lvalue передается как lvalue, rvalue как rvalue) и `const`-квалификаторов.

    **Пример:**

    ```cpp
    #include <utility>

    template <typename T>
    void wrapper(T&& arg) {
        target(std::forward<T>(arg));
    }
    ```

    **Источник:** [Cppreference: std::forward](https://en.cppreference.com/w/cpp/utility/forward)

76. Для чего нужен `std::forward`?

    **Ответ:** Он выполняет условное приведение к rvalue: если шаблонный параметр `T` не является lvalue-ссылкой, аргумент приводится к rvalue, восстанавливая исходную семантику временного объекта.

    **Пример:**

    ```cpp
    #include <utility>

    template <typename T>
    void forwarder(T&& x) {
        process(std::forward<T>(x));
    }
    ```

    **Источник:** [Cppreference: std::forward](https://en.cppreference.com/w/cpp/utility/forward)

77. Чем `std::forward` отличается от `std::move`?

    **Ответ:** `std::move` преобразует аргумент в rvalue **всегда и безусловно**, а `std::forward` — **только если** аргумент был изначально передан как rvalue.

    **Пример:**

    ```cpp
    #include <utility>

    // std::move(x) -> всегда xvalue
    // std::forward<T>(x) -> xvalue или lvalue в зависимости от T
    ```

    **Источник:** [Cppreference: std::forward](https://en.cppreference.com/w/cpp/utility/forward)

78. Что такое forwarding reference?

    **Ответ:** Универсальная ссылка — ссылка вида `T&&`, где `T` является выводимым типом шаблона функции (или `auto&&`), способная связываться как с lvalue, так и с rvalue.

    **Пример:**

    ```cpp
    template <typename T>
    void f(T&& param); // param — forwarding reference
    ```

    **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization#Forwarding_references)

79. Чем forwarding reference отличается от обычной rvalue-ссылки?

    **Ответ:** Обычная rvalue-ссылка (`Widget&&`) привязана к конкретному типу и принимает **только** rvalue, а forwarding reference (`T&&` с дедукцией типа) благодаря правилам сжатия ссылок может стать lvalue-ссылкой `T&`.

    **Пример:**

    ```cpp
    template <typename T> void f(T&&); // forwarding reference
    void g(std::vector<int>&&);       // обычная rvalue reference
    ```

    **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization#Forwarding_references)

80. Что такое reference collapsing?

    **Ответ:** Правила сжатия ссылок при инстанцировании шаблонов: ссылка на ссылку всегда сворачивается в одиночную ссылку по правилу: `&` с любой другой ссылкой даёт `&`, а `&&` и `&&` даёт `&&`.

    **Пример:**

    ```cpp
    // T&  + &  -> T&
    // T&  + && -> T&
    // T&& + &  -> T&
    // T&& + && -> T&&
    ```

    **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

81. Почему `const T&` по-прежнему часто используют в modern C++?

    **Ответ:** Это стандартный, безопасный и дешевый способ передачи входных параметров без копирования для объектов, которые внутри функции только читаются.

    **Пример:**

    ```cpp
    #include <string>

    void print(const std::string& msg); // нет копирования, безопасность от мутаций
    ```

    **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

82. Когда лучше передавать объект по значению, а не по `const T&`?

    **Ответ:** Для тривиальных скалярных типов размером до 16 байт (`int`, `double`, `std::string_view`, `std::span`), а также когда функция всё равно обязана создать собственную копию объекта (идиома pass-by-value with move).

    **Пример:**

    ```cpp
    #include <string>
    #include <utility>

    struct Person {
        std::string name;
        Person(std::string n) : name(std::move(n)) {} // универсально для lvalue и rvalue
    };
    ```

    **Источник:** [Cppreference: Parameter declaration](https://en.cppreference.com/w/cpp/language/function#Parameter_list)

83. Когда лучше возвращать объект по значению?

    **Ответ:** При возврате локально созданных объектов или вычисленных результатов: благодаря copy elision и семантике перемещения это работает максимально эффективно без риска висячих ссылок.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> make_data() {
        std::vector<int> res = {1, 2, 3};
        return res; // безопасно и бесплатно
    }
    ```

    **Источник:** [Cppreference: Return statement](https://en.cppreference.com/w/cpp/language/return)

84. Почему современный C++ часто поощряет возврат по значению?

    **Ответ:** Стандарты гарантируют исключение копирования (copy elision), превращая возврат по значению в конструирование объекта сразу по месту вызова в вызывающей функции.

    **Пример:**

    ```cpp
    struct Heavy {};
    Heavy create() { return Heavy(); }
    Heavy h = create(); // 0 копирований и 0 перемещений
    ```

    **Источник:** [Cppreference: Copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

85. Что такое copy elision?

    **Ответ:** Оптимизация (начиная с C++17 в ряде случаев обязательная), при которой компилятор полностью пропускает вызовы конструкторов копирования и перемещения, размещая объект сразу в целевом буфере.

    **Пример:**

    ```cpp
    struct Big { Big() = default; Big(const Big&) = delete; };
    Big b = Big(); // Работает в C++17 даже при удаленном конструкторе копирования!
    ```

    **Источник:** [Cppreference: Copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

86. Что такое NRVO?

    **Ответ:** Named Return Value Optimization — разновидность copy elision, при которой компилятор объединяет память именованной локальной переменной с областью возврата функции.

    **Пример:**

    ```cpp
    #include <string>

    std::string build() {
        std::string result = "prefix";
        result += "_suffix";
        return result; // NRVO: result создается сразу в вызывающем фрейме
    }
    ```

    **Источник:** [Cppreference: Copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

87. Почему copy elision важен для эффективности modern C++?

    **Ответ:** Он гарантирует нулевые накладные расходы на возврат любых структур данных из функций, делая код чище и избавляя от старой практики передачи неконстантных ссылок-приёмников аргументами (`void func(Data& out)`).

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> generate();
    auto v = generate(); // идеальная производительность
    ```

    **Источник:** [Cppreference: Copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

88. Что такое rule of three?

    **Ответ:** Правило трех (C++98): если класс явно объявляет деструктор, конструктор копирования или оператор присваивания копированием, он почти наверняка должен явно реализовать все три.

    **Пример:**

    ```cpp
    class RawMemory {
        int* data;
    public:
        RawMemory(const RawMemory&);
        RawMemory& operator=(const RawMemory&);
        ~RawMemory();
    };
    ```

    **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

89. Что такое rule of five?

    **Ответ:** Правило пяти (C++11): с появлением семантики перемещения класс, управляющий ресурсом, должен явно объявить пять специальных функций: деструктор, конструктор копирования, оператор присваивания копированием, конструктор перемещения и оператор присваивания перемещением.

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

90. Что такое rule of zero?

    **Ответ:** Правило нуля: современные классы не должны объявлять ни одну из пяти специальных функций, доверяя управление ресурсами готовым RAII-типам (`std::unique_ptr`, `std::vector`, `std::string`).

    **Пример:**

    ```cpp
    #include <string>
    #include <vector>

    struct Customer {
        int id;
        std::string name;
        std::vector<int> orders;
        // Никаких явных деструкторов и копирований: всё работает само
    };
    ```

    **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

91. Почему rule of zero считается предпочтительным подходом?

    **Ответ:** Оно делает код компактным, защищенным от утечек и ошибок ручного копирования/перемещения, перекладывая рутину на стандартную библиотеку.

    **Пример:**

    ```cpp
    #include <memory>

    struct FileManager {
        std::unique_ptr<FILE, decltype(&fclose)> file; // деструктор не нужен!
    };
    ```

    **Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

92. Что такое move constructor?

    **Ответ:** Конструктор, принимающий неконстантную rvalue-ссылку на объект того же типа (`Class(Class&& noexcept)`), перемещающий его состояние и оставляющий источник в корректном состоянии.

    **Пример:**

    ```cpp
    struct Buffer {
        int* ptr = nullptr;
        Buffer(Buffer&& other) noexcept : ptr(other.ptr) {
            other.ptr = nullptr;
        }
    };
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

93. Что такое move assignment operator?

    **Ответ:** Перегрузка `operator=(Class&& noexcept)`, освобождающая текущие ресурсы целевого объекта и забирающая ресурсы у перемещаемого rvalue-источника.

    **Пример:**

    ```cpp
    struct Buffer {
        int* ptr = nullptr;
        Buffer& operator=(Buffer&& other) noexcept {
            if (this != &other) {
                delete ptr;
                ptr = other.ptr;
                other.ptr = nullptr;
            }
            return *this;
        }
    };
    ```

    **Источник:** [Cppreference: Move assignment operator](https://en.cppreference.com/w/cpp/language/move_assignment)

94. Чем копирование отличается от перемещения?

    **Ответ:** Копирование создает независимый дубликат исходных данных ($O(N)$ по времени и памяти), а перемещение просто перенаправляет внутренние указатели/дескрипторы ($O(1)$ по времени).

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> a(1000000);
    std::vector<int> b = a;            // Копирование: аллокация новой памяти
    std::vector<int> c = std::move(a); // Перемещение: обмен указателями
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

95. Почему moved-from объект должен оставаться валидным?

    **Ответ:** Потому что для moved-from объекта в будущем обязательно вызовется деструктор при выходе из области видимости, а также ему может быть присвоено новое значение.

    **Пример:**

    ```cpp
    #include <string>

    std::string s1 = "hello";
    std::string s2 = std::move(s1);
    // s1 теперь moved-from: деструктор s1 должен отработать без сбоя
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

96. Что означает “валидный, но не определённый логически” объект после перемещения?

    **Ответ:** Объект находится в корректном с точки зрения языка состоянии (инварианты класса не нарушены, деструктор отработает успешно), но его конкретное значение спецификацией не зафиксировано (часто пустой).

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v1 = {1, 2};
    std::vector<int> v2 = std::move(v1);
    // v1 валиден, v1.empty() скорее всего true, но полагаться на старые данные нельзя
    ```

    **Источник:** [Cppreference: Move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

97. Что такое `std::swap` и почему он важен в современном коде?

    **Ответ:** Функция обмена значениями двух объектов, которая в modern C++ реализована через move-операции за $O(1)$, являясь основой идиомы copy-and-swap.

    **Пример:**

    ```cpp
    #include <utility>
    #include <vector>

    std::vector<int> a = {1}, b = {2};
    std::swap(a, b); // быстрое перемещение
    ```

    **Источник:** [Cppreference: std::swap](https://en.cppreference.com/w/cpp/algorithm/swap)

98. Почему `noexcept` move-конструктор влияет на контейнеры STL?

    **Ответ:** Чтобы сохранить строгую гарантию безопасности исключений (strong exception safety) при реаллокации вектора: если перемещение может бросить исключение, вектор вынужден копировать элементы.

    **Пример:**

    ```cpp
    #include <utility>

    struct Item {
        Item(Item&&) noexcept; // гарантия noexcept открывает путь быстрой реаллокации
    };
    ```

    **Источник:** [Cppreference: std::move_if_noexcept](https://en.cppreference.com/w/cpp/utility/move_if_noexcept)

99. Что такое `std::exchange`?

    **Ответ:** Утилита (C++14), заменяющая значение переменной новым значением и возвращающая её старое значение.

    **Пример:**

    ```cpp
    #include <utility>

    int val = 10;
    int old = std::exchange(val, 20); // old = 10, val = 20
    ```

    **Источник:** [Cppreference: std::exchange](https://en.cppreference.com/w/cpp/utility/exchange)

100. Когда `std::exchange` удобен при написании move-операций?

     **Ответ:** Он идеально подходит для перемещения ресурсов (указателей, дескрипторов) в конструкторах перемещения, обнуляя поле источника за одно выражение.

     **Пример:**

     ```cpp
     #include <utility>

     struct Socket {
         int fd = -1;
         Socket(Socket&& other) noexcept : fd(std::exchange(other.fd, -1)) {}
     };
     ```

     **Источник:** [Cppreference: std::exchange](https://en.cppreference.com/w/cpp/utility/exchange)

## Средний уровень

101. Что такое `std::optional`?

     **Ответ:** Шаблонный тип (C++17), представляющий значение, которое может существовать либо отсутствовать (`std::nullopt`), без динамического выделения памяти.

     **Пример:**

     ```cpp
     #include <optional>

     std::optional<int> try_parse(const char* str);
     ```

     **Источник:** [Cppreference: std::optional](https://en.cppreference.com/w/cpp/utility/optional)

102. Когда `std::optional<T>` лучше, чем особое значение-сентинел?

     **Ответ:** Когда диапазон допустимых значений типа полон и невозможно выделить "магическое число" (вроде `-1`, `0` или `nullptr`), либо когда тип не имеет естественного дефолтного значения.

     **Пример:**

     ```cpp
     #include <optional>

     std::optional<int> find_temp() {
         return std::nullopt; // температура может быть и -1, и 0, сентинел опасен
     }
     ```

     **Источник:** [Cppreference: std::optional](https://en.cppreference.com/w/cpp/utility/optional)

103. Чем `std::optional` лучше пары вида `bool + T`?

     **Ответ:** `std::optional` не конструирует объект типа `T`, пока значение отсутствует (важно для дорогих типов), предотвращает доступ к неинициализированным полям и предоставляет идиоматичный интерфейс (`value_or`, `value`).

     **Пример:**

     ```cpp
     #include <optional>

     std::optional<std::string> opt;
     // Память выделена только под буфер, сам объект std::string не конструировался
     ```

     **Источник:** [Cppreference: std::optional](https://en.cppreference.com/w/cpp/utility/optional)

104. Что такое `std::variant`?

     **Ответ:** Типобезопасное дискриминированное объединение (tagged union) из C++17, способное хранить в себе значение одного из заданных типов.

     **Пример:**

     ```cpp
     #include <variant>
     #include <string>

     std::variant<int, double, std::string> v = "modern c++";
     ```

     **Источник:** [Cppreference: std::variant](https://en.cppreference.com/w/cpp/utility/variant)

105. Чем `std::variant` лучше `union` в современном C++?

     **Ответ:** Он автоматически вызывает конструкторы и деструкторы активного типа (включая сложные типы со строками и векторами), знает свой текущий тип через индекс и предотвращает UB при некорректном чтении.

     **Пример:**

     ```cpp
     #include <variant>
     #include <string>

     std::variant<int, std::string> v = std::string("test");
     // int x = std::get<int>(v); // бросает std::bad_variant_access, предотвращая порчу памяти
     ```

     **Источник:** [Cppreference: std::variant](https://en.cppreference.com/w/cpp/utility/variant)

106. Что такое `std::visit`?

     **Ответ:** Функция сопоставления шаблонов (паттерн Посетитель) для `std::variant`, применяющая переданный функтор (или перегруженную лямбду) к текущему активному значению варианта.

     **Пример:**

     ```cpp
     #include <variant>
     #include <iostream>

     std::variant<int, double> v = 3.14;
     std::visit([](auto&& val) { std::cout << val; }, v);
     ```

     **Источник:** [Cppreference: std::visit](https://en.cppreference.com/w/cpp/utility/variant/visit)

107. Что такое `std::any`?

     **Ответ:** Типобезопасный контейнер одиночного значения любого копируемого типа (C++17), скрывающий тип данных за счет стирания типов (type erasure).

     **Пример:**

     ```cpp
     #include <any>
     #include <string>

     std::any a = 5;
     a = std::string("text");
     std::string s = std::any_cast<std::string>(a);
     ```

     **Источник:** [Cppreference: std::any](https://en.cppreference.com/w/cpp/utility/any)

108. Когда `std::any` уместен, а когда слишком динамичен?

     **Ответ:** Уместен в плагинах, парсерах универсальных конфигураций или GUI-событиях. Слишком динамичен (и нежелателен) в строгой бизнес-логике, так как требует приведения типов в runtime и может вызывать скрытые динамические аллокации.

     **Пример:**

     ```cpp
     #include <any>

     void on_event(std::any payload); // уместно для слабосвязанной шины событий
     ```

     **Источник:** [Cppreference: std::any](https://en.cppreference.com/w/cpp/utility/any)

109. Что такое `std::string_view`?

     **Ответ:** Легковесное невладеющее константное представление (view) непрерывной последовательности символов (C++17), состоящее из указателя и длины.

     **Пример:**

     ```cpp
     #include <string_view>

     void log_message(std::string_view sv);
     ```

     **Источник:** [Cppreference: std::basic_string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

110. Чем `std::string_view` отличается от `std::string`?

     **Ответ:** Он никогда не владеет памятью, не копирует строку при создании подстроки через `substr` (сложность $O(1)$) и не гарантирует наличие нулевого терминатора `\0`.

     **Пример:**

     ```cpp
     #include <string_view>

     std::string_view sv = "Hello, World!";
     auto sub = sv.substr(0, 5); // O(1) без выделения памяти в куче
     ```

     **Источник:** [Cppreference: std::basic_string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

111. Какие риски lifetime связаны со `std::string_view`?

     **Ответ:** Риск появления висячего указателя (dangling pointer), если исходный объект `std::string` или временный литерал был уничтожен или изменен до окончания использования `string_view`.

     **Пример:**

     ```cpp
     #include <string>
     #include <string_view>

     std::string_view get_view() {
         std::string s = "temp";
         return s; // ОШИБКА: s уничтожается при выходе, возвращается висячий view
     }
     ```

     **Источник:** [Cppreference: std::basic_string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

112. Что такое `std::span`?

     **Ответ:** Невладеющее представление непрерывного диапазона однородных объектов в памяти (C++20), абстрагирующее `std::vector`, `std::array` и C-массивы.

     **Пример:**

     ```cpp
     #include <span>
     #include <vector>

     void print_all(std::span<const int> data);
     ```

     **Источник:** [Cppreference: std::span](https://en.cppreference.com/w/cpp/container/span)

113. Чем `std::span` отличается от контейнера?

     **Ответ:** Он не управляет жизненным циклом элементов, не аллоцирует память, копируется за $O(1)$ и передается по значению как пара "указатель + размер".

     **Пример:**

     ```cpp
     #include <span>

     int arr[] = {1, 2, 3};
     std::span<int> sp(arr); // размер объекта всего 16 байт
     ```

     **Источник:** [Cppreference: std::span](https://en.cppreference.com/w/cpp/container/span)

114. Почему `span` удобен для параметров функций?

     **Ответ:** Он позволяет функции работать с непрерывными данными из любого источника (стек, куча, сырой буфер ОС) без шаблонизации и без жесткой привязки к `std::vector`.

     **Пример:**

     ```cpp
     #include <span>
     #include <vector>

     void inspect(std::span<const int> s);

     int raw[3] = {1, 2, 3};
     std::vector<int> v = {4, 5};
     // inspect(raw); // работает
     // inspect(v);   // работает
     ```

     **Источник:** [Cppreference: std::span](https://en.cppreference.com/w/cpp/container/span)

115. Какие ошибки lifetime возможны при использовании `std::span`?

     **Ответ:** Обращение к памяти после освобождения (Use-After-Free), если нижележащий контейнер был реаллоцирован (`vector::push_back`) или вышел из области видимости.

     **Пример:**

     ```cpp
     #include <span>
     #include <vector>

     std::vector<int> v = {1, 2};
     std::span<int> sp = v;
     v.push_back(3); // реаллокация буфера v инвалидирует sp
     ```

     **Источник:** [Cppreference: std::span](https://en.cppreference.com/w/cpp/container/span)

116. Что такое structured bindings?

     **Ответ:** Структурированное связывание (C++17) — синтаксис декомпозиции кортежей, пар, массивов или полей структур в отдельные именованные переменные через `auto [x, y] = ...`.

     **Пример:**

     ```cpp
     #include <utility>

     std::pair<int, double> get_data();
     auto [id, score] = get_data();
     ```

     **Источник:** [Cppreference: Structured binding](https://en.cppreference.com/w/cpp/language/structured_binding)

117. Для чего удобны structured bindings?

     **Ответ:** Для обхода ассоциативных контейнеров по ключу и значению, а также для распаковки функций, возвращающих несколько значений через кортеж или структуру.

     **Пример:**

     ```cpp
     #include <map>
     #include <string>

     std::map<std::string, int> ages;
     for (const auto& [name, age] : ages) {
         // name и age доступны напрямую
     }
     ```

     **Источник:** [Cppreference: Structured binding](https://en.cppreference.com/w/cpp/language/structured_binding)

118. Когда structured bindings делают код чище?

     **Ответ:** Когда они устраняют бессмысленные обращения вроде `it->first` и `it->second` или `std::get<0>(t)`, сразу присваивая полям предметные имена.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s;
     auto [it, inserted] = s.insert(42); // вместо res.first и res.second
     ```

     **Источник:** [Cppreference: Structured binding](https://en.cppreference.com/w/cpp/language/structured_binding)

119. Что такое `if` с инициализатором?

     **Ответ:** Конструкция C++17 вида `if (init; condition)`, позволяющая инициализировать переменную прямо перед проверкой условия, ограничивая её область видимости только блоками `if` и `else`.

     **Пример:**

     ```cpp
     #include <map>

     std::map<int, int> m;
     if (auto it = m.find(1); it != m.end()) {
         // it доступен здесь
     }
     // it недоступен здесь
     ```

     **Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if)

120. Что такое `switch` с инициализатором?

     **Ответ:** Конструкция C++17 вида `switch (init; condition)`, локализующая объявление переменной исключительно внутри оператора `switch`.

     **Пример:**

     ```cpp
     int get_code();
     switch (int code = get_code(); code) {
         case 0: break;
         default: break;
     }
     ```

     **Источник:** [Cppreference: switch statement](https://en.cppreference.com/w/cpp/language/switch)

121. Почему `if (auto it = ...; it != ...)` полезен для ограничения области видимости?

     **Ответ:** Он предотвращает утечку временных итераторов и статус-кодов во внешнюю область видимости, защищая от случайного переиспользования устаревших переменных в последующем коде.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 2};
     if (auto it = std::find(v.begin(), v.end(), 1); it != v.end()) {
         // работа с it
     }
     ```

     **Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if)

122. Что такое inline variables?

     **Ответ:** Возможность (C++17) объявлять глобальные или статические переменные с ключевым словом `inline`, разрешая их многократное включение через заголовочные файлы без нарушения One Definition Rule (ODR).

     **Пример:**

     ```cpp
     // header.hpp
     inline constexpr int GlobalMaxUsers = 100;
     ```

     **Источник:** [Cppreference: inline specifier](https://en.cppreference.com/w/cpp/language/inline)

123. Зачем понадобились inline variables в C++17?

     **Ответ:** Чтобы создавать header-only библиотеки со статическими переменными или константами без необходимости создавать отдельный `.cpp`-файл для их определения.

     **Пример:**

     ```cpp
     struct Settings {
         static inline std::string app_name = "CoreApp"; // в заголовочном файле
     };
     ```

     **Источник:** [Cppreference: inline specifier](https://en.cppreference.com/w/cpp/language/inline)

124. Что такое `[[nodiscard]]`?

     **Ответ:** Стандартный атрибут (C++17), предписывающий компилятору генерировать предупреждение (warning), если возвращаемое функцией значение было проигнорировано вызывающей стороной.

     **Пример:**

     ```cpp
     [[nodiscard]] bool check_security();
     void run() {
         // check_security(); // Warning: ignoring return value
     }
     ```

     **Источник:** [Cppreference: attribute nodiscard](https://en.cppreference.com/w/cpp/language/attributes/nodiscard)

125. Почему `[[nodiscard]]` полезен для API?

     **Ответ:** Он предотвращает критические ошибки, когда разработчик забывает проверить код ошибки, статус валидации или путает модифицирующие методы с константными (например, `empty()` вместо `clear()`).

     **Пример:**

     ```cpp
     struct ErrorCode {};
     [[nodiscard]] ErrorCode send_packet();
     ```

     **Источник:** [Cppreference: attribute nodiscard](https://en.cppreference.com/w/cpp/language/attributes/nodiscard)

126. Что такое `[[maybe_unused]]`?

     **Ответ:** Атрибут (C++17), подавляющий предупреждения компилятора о неиспользуемой переменной, параметре функции или типе.

     **Пример:**

     ```cpp
     void debug_log([[maybe_unused]] int code) {
         // используется только в debug сборке
     }
     ```

     **Источник:** [Cppreference: attribute maybe_unused](https://en.cppreference.com/w/cpp/language/attributes/maybe_unused)

127. Когда имеет смысл использовать `[[fallthrough]]`?

     **Ответ:** В операторе `switch`, когда переход на следующую `case`-ветку без `break` сделан намеренно, чтобы подавить предупреждение компилятора об опасном провале.

     **Пример:**

     ```cpp
     switch (int mode = 1; mode) {
         case 1:
             // подготовка
             [[fallthrough]];
         case 2:
             // действие
             break;
     }
     ```

     **Источник:** [Cppreference: attribute fallthrough](https://en.cppreference.com/w/cpp/language/attributes/fallthrough)

128. Что такое атрибуты в современном C++?

    **Ответ:** Унифицированный синтаксис квадратных скобок `[[attribute]]` (начиная с C++11), передающий компилятору стандартизированные директивы для оптимизаций, проверок статического анализатора и подавления предупреждений.

    **Пример:**

    ```cpp
    [[noreturn]] void terminate_system();
    ```

    **Источник:** [Cppreference: Attributes](https://en.cppreference.com/w/cpp/language/attributes)

129. Что такое `std::byte`?

     **Ответ:** Тип (C++17), представляющий ровно один байт "сырых" данных без числовой или символьной семантики, определенный как `enum class std::byte : unsigned char`.

     **Пример:**

     ```cpp
     #include <cstddef>

     std::byte b{0xA5};
     ```

     **Источник:** [Cppreference: std::byte](https://en.cppreference.com/w/cpp/types/byte)

130. Чем `std::byte` отличается от `unsigned char`?

     **Ответ:** Для него запрещены неявные арифметические операции (`+`, `-`) и текстовый ввод-вывод: разрешены только побитовые операции (`&`, `|`, `^`, `~`), что исключает логические ошибки рассмотрения бинарного байта как числа или символа.

     **Пример:**

     ```cpp
     #include <cstddef>

     std::byte b1{1}, b2{2};
     // auto b3 = b1 + b2; // Ошибка компиляции
     auto b4 = b1 | b2;   // Разрешено
     ```

     **Источник:** [Cppreference: std::byte](https://en.cppreference.com/w/cpp/types/byte)

131. Что такое `char8_t`?

     **Ответ:** Отдельный фундаментальный тип символа (C++20) для представления кодовых единиц UTF-8, предотвращающий путаницу между обычными строками и UTF-8 строковыми литералами `u8"..."`.

     **Пример:**

     ```cpp
     const char8_t* u8str = u8"Привет";
     ```

     **Источник:** [Cppreference: Fundamental types](https://en.cppreference.com/w/cpp/language/types)

132. Почему современные стандарты добавляют более явные средства для работы с текстом и кодировками?

    **Ответ:** Исторический тип `char` мог быть знаковым или беззнаковым в зависимости от компилятора, а смешивание кодировок (ASCII, UTF-8, системных локалей) порождало трудноуловимые баги повреждения текста.

    **Пример:**

    ```cpp
    #include <string_view>

    std::u8string_view sv = u8"test"; // однозначная семантика UTF-8
    ```

    **Источник:** [Cppreference: Character types](https://en.cppreference.com/w/cpp/language/types#Character_types)

133. Что такое CTAD?

     **Ответ:** Class Template Argument Deduction — возможность компилятора (C++17) автоматически выводить типы шаблонных параметров класса из типов переданных в конструктор аргументов.

     **Пример:**

     ```cpp
     #include <pair>

     // До C++17: std::pair<int, double> p(1, 2.0);
     std::pair p(1, 2.0); // CTAD выводит pair<int, double>
     ```

     **Источник:** [Cppreference: Class template argument deduction](https://en.cppreference.com/w/cpp/language/class_template_argument_deduction)

134. Как расшифровывается Class Template Argument Deduction?

     **Ответ:** Вывод аргументов шаблона класса.

     **Пример:**

     ```cpp
     #include <mutex>

     std::mutex m;
     std::lock_guard lock(m); // вместо std::lock_guard<std::mutex>
     ```

     **Источник:** [Cppreference: Class template argument deduction](https://en.cppreference.com/w/cpp/language/class_template_argument_deduction)

135. Когда CTAD упрощает запись шаблонного кода?

     **Ответ:** При использовании контейнеров, блокировок мьютексов (`std::lock_guard`), кортежей (`std::tuple`) и умных указателей, избавляя от дублирования типов и устаревших хелперов вроде `std::make_pair`.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector v = {1, 2, 3}; // выведен std::vector<int>
     ```

     **Источник:** [Cppreference: Class template argument deduction](https://en.cppreference.com/w/cpp/language/class_template_argument_deduction)

136. Что такое deduction guides?

     **Ответ:** Руководства по выведению типов — явные правила для компилятора, объясняющие, как сопоставлять типы параметров конструктора со специфическими шаблонными параметрами класса при CTAD.

     **Пример:**

     ```cpp
     template <typename T>
     struct Container {
         T value;
     };

     // Deduction guide:
     Container(const char*) -> Container<std::string>;
     ```

     **Источник:** [Cppreference: Deduction guides](https://en.cppreference.com/w/cpp/language/class_template_argument_deduction#User-defined_deduction_guides)

137. Что такое fold expressions?

     **Ответ:** Выражения свертки (C++17) — синтаксис для применения бинарного оператора к элементам пакета параметров шаблона (`parameter pack`) без необходимости написания рекурсивных шаблонов.

     **Пример:**

     ```cpp
     template <typename... Args>
     auto sum(Args... args) {
         return (... + args); // унарная левая свертка
     }
     ```

     **Источник:** [Cppreference: Fold expression](https://en.cppreference.com/w/cpp/language/fold)

138. Чем fold expression удобнее рекурсии по parameter pack?

     **Ответ:** Код пишется в одну строку, компилируется значительно быстрее (меньше инстанцирований шаблонов) и легче читается без необходимости объявлять терминальную базовую функцию.

     **Пример:**

     ```cpp
     #include <iostream>

     template <typename... Args>
     void print_all(Args... args) {
         (std::cout << ... << args) << '\n';
     }
     ```

     **Источник:** [Cppreference: Fold expression](https://en.cppreference.com/w/cpp/language/fold)

139. Что такое variadic templates?

     **Ответ:** Шаблоны с переменным числом аргументов (C++11), позволяющие принимать произвольное количество параметров любых типов через `typename... Args`.

     **Пример:**

     ```cpp
     template <typename... Ts>
     struct TupleWrapper {};
     ```

     **Источник:** [Cppreference: Parameter pack](https://en.cppreference.com/w/cpp/language/parameter_pack)

140. Для чего нужны variadic templates?

     **Ответ:** Для создания универсальных структур данных (`std::tuple`, `std::variant`), фабрик создания объектов (`std::make_unique`), безопасного форматирования (`std::format`) и идеальной передачи аргументов (`emplace`).

     **Пример:**

     ```cpp
     template <typename T, typename... Args>
     T create(Args&&... args) {
         return T(std::forward<Args>(args)...);
     }
     ```

     **Источник:** [Cppreference: Parameter pack](https://en.cppreference.com/w/cpp/language/parameter_pack)

141. Что такое `if constexpr`?

     **Ответ:** Конструкция ветвления на этапе компиляции (C++17): компилятор анализирует константное условие и транслирует в бинарный код только ту ветку, условие которой истинно (отброшенная ветка даже не инстанцируется).

     **Пример:**

     ```cpp
     #include <type_traits>

     template <typename T>
     auto get_val(T t) {
         if constexpr (std::is_pointer_v<T>)
             return *t;
         else
             return t;
     }
     ```

     **Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if)

142. Чем `if constexpr` отличается от обычного `if`?

     **Ответ:** Обычный `if` вычисляется в runtime, требуя, чтобы обе ветки были синтаксически и семантически валидны для переданного типа; `if constexpr` отбрасывает неактивную ветку на этапе компиляции.

     **Пример:**

     ```cpp
     template <typename T>
     void process(T val) {
         if constexpr (requires { val.custom_method(); }) {
             val.custom_method(); // не вызовет ошибку компиляции для int!
         }
     }
     ```

     **Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if)

143. Почему `if constexpr` упростил шаблонный код?

     **Ответ:** Он заменил сложные конструкции со специализациями шаблонов, тег-диспатчеризацией и громоздким SFINAE (`std::enable_if`) на понятный процедурный стиль ветвления.

     **Пример:**

     ```cpp
     #include <type_traits>

     template <typename T>
     void handle(T x) {
         if constexpr (std::is_integral_v<T>) { /* ... */ }
     }
     ```

     **Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if)

144. Что такое `constexpr if` в проектировании generic-кода?

     **Ответ:** Это фундамент статического полиморфизма, позволяющий алгоритмам адаптировать свою реализацию под свойства типов без накладных расходов виртуальных таблиц.

     **Пример:**

     ```cpp
     template <typename Iter>
     void advance_it(Iter& it, int n) {
         if constexpr (/* RandomAccessIterator */ true) {
             it += n;
         } else {
             while (n--) ++it;
         }
     }
     ```

     **Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if)

145. Что такое `std::invoke`?

     **Ответ:** Стандартная универсальная функция (C++17), вызывающая любой переданный Callable-объект с заданным набором аргументов по общим правилам INVOKE.

     **Пример:**

     ```cpp
     #include <functional>

     void func(int x);
     std::invoke(func, 10);
     ```

     **Источник:** [Cppreference: std::invoke](https://en.cppreference.com/w/cpp/utility/functional/invoke)

146. Какие callable-объекты может вызывать `std::invoke`?

     **Ответ:** Обычные функции, функциональные объекты (функторы), лямбды, указатели на функции-члены классов и указатели на поля данных классов.

     **Пример:**

     ```cpp
     #include <functional>

     struct User { int id = 1; int get_id() { return id; } };
     User u;
     int a = std::invoke(&User::get_id, u); // вызов метода
     int b = std::invoke(&User::id, u);     // доступ к полю
     ```

     **Источник:** [Cppreference: std::invoke](https://en.cppreference.com/w/cpp/utility/functional/invoke)

147. Что такое `std::apply`?

     **Ответ:** Функция (C++17), распаковывающая элементы кортежеподобного объекта (`std::tuple`, `std::pair`, `std::array`) в виде аргументов функции и вызывающая ее.

     **Пример:**

     ```cpp
     #include <tuple>

     int add(int a, int b);
     auto t = std::make_tuple(1, 2);
     int sum = std::apply(add, t); // add(1, 2)
     ```

     **Источник:** [Cppreference: std::apply](https://en.cppreference.com/w/cpp/utility/apply)

148. Для чего нужен `std::apply` с `tuple`?

     **Ответ:** Для передачи сохраненного набора разнородных параметров в функцию или конструктор без необходимости вручную извлекать каждое поле через `std::get<N>`.

     **Пример:**

     ```cpp
     #include <tuple>

     struct Point { Point(int, int); };
     auto coords = std::make_tuple(10, 20);
     Point p = std::apply([](auto... args) { return Point(args...); }, coords);
     ```

     **Источник:** [Cppreference: std::apply](https://en.cppreference.com/w/cpp/utility/apply)

149. Что такое `std::as_const`?

     **Ответ:** Вспомогательная функция (C++17), принимающая ссылку на объект и возвращающая константную ссылку на него (`const T&`).

     **Пример:**

     ```cpp
     #include <utility>

     int x = 10;
     const int& r = std::as_const(x);
     ```

     **Источник:** [Cppreference: std::as_const](https://en.cppreference.com/w/cpp/utility/as_const)

150. Когда `std::as_const` полезен для читаемости и безопасности?

     **Ответ:** Когда необходимо гарантировать вызов константной перегрузки метода или функции без явного и опасного `const_cast` или `static_cast<const T&>`.

     **Пример:**

     ```cpp
     #include <utility>
     #include <vector>

     std::vector<int> v = {1, 2};
     // Вызов константной версии begin() для предотвращения модификаций:
     auto it = std::as_const(v).begin();
     ```

     **Источник:** [Cppreference: std::as_const](https://en.cppreference.com/w/cpp/utility/as_const)

## Выше среднего уровня

151. Что такое concepts в C++20?

    **Ответ:** Концепты — именованные предикаты времени компиляции, накладывающие явные требования к типам параметров шаблона (наличие методов, типов, операций).

    **Пример:**

    ```cpp
    #include <concepts>

    template <typename T>
    concept Numeric = std::integral<T> || std::floating_point<T>;
    ```

    **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/concepts)

152. Для чего были добавлены concepts?

     **Ответ:** Для повышения выразительности шаблонного кода, замены непрозрачного SFINAE и получения четких и понятных сообщений об ошибках компиляции при нарушении интерфейса типа.

     **Пример:**

     ```cpp
     template <std::integral T>
     T gcd(T a, T b);
     ```

     **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/concepts)

153. Чем concepts лучше старого SFINAE по читаемости?

     **Ответ:** Вместо загромождения сигнатур через `std::enable_if_t<...>` требования объявляются лаконично прямо в заголовке шаблона в виде ограничений, понятных человеку.

     **Пример:**

     ```cpp
     // Concepts:
     template <typename T> requires std::copyable<T>
     void clone(T obj);
     ```

     **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/concepts)

154. Что такое `requires`-clause?

     **Ответ:** Предложение в заголовке функции или класса (`requires condition`), задающее ограничение на параметры шаблона с помощью булевых констант или концептов.

     **Пример:**

     ```cpp
     template <typename T>
     void execute(T x) requires (sizeof(T) > 4) {}
     ```

     **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints#Requires_clauses)

155. Что такое `requires`-expression?

     **Ответ:** Синтаксический блок проверки `requires(params) { requirements; }`, вычисляющий в compile-time, являются ли валидными указанные выражения и типы для проверяемых параметров.

     **Пример:**

     ```cpp
     template <typename T>
     concept Printable = requires(T x) {
         std::cout << x;
     };
     ```

     **Источник:** [Cppreference: Requires expression](https://en.cppreference.com/w/cpp/language/requires)

156. Как ограничить шаблон с помощью concept?

     **Ответ:** Тремя способами: подставив имя концепта вместо ключевого слова `typename`, через `requires`-clause или через концепт в сокращенном синтаксисе `void f(Concept auto x)`.

     **Пример:**

     ```cpp
     #include <concepts>

     void sort(std::sortable auto& container); // terse syntax
     ```

     **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints)

157. Что такое `std::integral`?

     **Ответ:** Стандартный концепт C++20, проверяющий, что тип является целочисленным (`int`, `char`, `long` и т.д., кроме типов с плавающей точкой).

     **Пример:**

     ```cpp
     #include <concepts>

     template <std::integral T>
     bool is_even(T val) { return val % 2 == 0; }
     ```

     **Источник:** [Cppreference: std::integral](https://en.cppreference.com/w/cpp/concepts/integral)

158. Что такое `std::same_as`?

     **Ответ:** Стандартный концепт C++20, проверяющий строгое совпадение двух типов с учетом взаимной конвертируемости.

     **Пример:**

     ```cpp
     #include <concepts>

     template <typename T, typename U>
     requires std::same_as<T, U>
     void match(T, U) {}
     ```

     **Источник:** [Cppreference: std::same_as](https://en.cppreference.com/w/cpp/concepts/same_as)

159. Что такое constrained templates?

     **Ответ:** Шаблоны с ограничениями (constrained templates) — шаблоны функций или классов, для которых заданы формальные ограничения с помощью концептов, влияющие на порядок выбора перегрузок.

     **Пример:**

     ```cpp
     #include <concepts>

     template <typename T> void print(T);                  // (1) общий
     template <std::integral T> void print(T);             // (2) более ограниченный, предпочтителен для int
     ```

     **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints)

160. Почему concepts улучшают сообщения об ошибках компилятора?

    **Ответ:** Компилятор прерывает инстанцирование в точке вызова функции и четко сообщает, какое конкретно требование концепта не было удовлетворено, не раскручивая километровые стеки ошибок внутренних шаблонов.

    **Пример:**

    ```cpp
    #include <concepts>

    template <std::integral T> void f(T);
    // f("hello"); // Ошибка: string does not satisfy 'integral'
    ```

    **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/concepts)

161. Что такое ranges в C++20?

    **Ответ:** Библиотека диапазонов, перерабатывающая итерирование в C++: позволяет работать с контейнерами целиком, компоновать алгоритмы в цепочки и выполнять вычисления лениво.

    **Пример:**

    ```cpp
    #include <vector>
    #include <ranges>

    std::vector<int> v = {1, 2, 3, 4};
    auto r = v | std::views::reverse;
    ```

    **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

162. Чем ranges отличаются от классического подхода “пара итераторов”?

     **Ответ:** Ranges оперируют объектом диапазона как единым целым (не нужно писать `v.begin(), v.end()`), поддерживают различные типы конца диапазона (sentinels) и пайплайны.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {3, 1, 2};
     std::ranges::sort(v); // вместо std::sort(v.begin(), v.end())
     ```

     **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

163. Что такое view в ranges?

     **Ответ:** Легковесный объект диапазона, не владеющий элементами (или владеющий с затратами $O(1)$), который дешево копируется и перемещается за фиксированное время.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2, 3};
     auto v_view = std::views::all(v); // O(1)
     ```

     **Источник:** [Cppreference: std::ranges::view](https://en.cppreference.com/w/cpp/ranges/view)

164. Чем view отличается от контейнера?

     **Ответ:** Контейнер владеет элементами и памятью, отвечая за их создание и уничтожение, а view является лишь окном просмотра или преобразователем существующего диапазона.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> c(100);       // контейнер (память в куче)
     auto w = c | std::views::take(5); // view (без памяти)
     ```

     **Источник:** [Cppreference: std::ranges::view](https://en.cppreference.com/w/cpp/ranges/view)

165. Что такое ленивые вычисления в ranges?

     **Ответ:** Элементы не преобразуются и не фильтруются заранее в буфер; вычисление происходит "на лету" строго в момент инкремента и разыменования итератора view.

     **Пример:**

     ```cpp
     #include <ranges>

     auto squares = std::views::iota(1) | std::views::transform([](int x){ return x * x; });
     // Никаких вычислений не происходило до фактического чтения *squares.begin()
     ```

     **Источник:** [Cppreference: std::ranges::view](https://en.cppreference.com/w/cpp/ranges/view)

166. Что делает `std::views::filter`?

     **Ответ:** Адаптер диапазона, лениво отбирающий только те элементы, которые удовлетворяют заданному предикату.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2, 3, 4};
     auto evens = v | std::views::filter([](int x) { return x % 2 == 0; });
     ```

     **Источник:** [Cppreference: std::ranges::filter_view](https://en.cppreference.com/w/cpp/ranges/filter_view)

167. Что делает `std::views::transform`?

     **Ответ:** Адаптер диапазона, лениво применяющий функцию преобразования к каждому элементу исходного диапазона при доступе к нему.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2, 3};
     auto doubled = v | std::views::transform([](int x) { return x * 2; });
     ```

     **Источник:** [Cppreference: std::ranges::transform_view](https://en.cppreference.com/w/cpp/ranges/transform_view)

168. Что делает `std::views::take`?

     **Ответ:** Создает view, выдающий не более $N$ первых элементов из базового диапазона.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {10, 20, 30, 40};
     auto first2 = v | std::views::take(2); // 10, 20
     ```

     **Источник:** [Cppreference: std::ranges::take_view](https://en.cppreference.com/w/cpp/ranges/take_view)

169. Почему композиция views через `|` делает код более декларативным?

     **Ответ:** Она позволяет читать конвейер обработки данных слева направо в виде понятной последовательности шагов вместо глубоко вложенных вызовов функций.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> nums = {1, 2, 3, 4, 5, 6};
     auto pipeline = nums
         | std::views::filter([](int x) { return x % 2 == 0; })
         | std::views::transform([](int x) { return x * 10; })
         | std::views::take(2);
     ```

     **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

170. Какие риски lifetime есть у views?

     **Ответ:** Если view построен поверх временного контейнера (rvalue), то после завершения полного выражения контейнер уничтожается, и view становится висячим.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> get_temp();
     // auto bad_view = get_temp() | std::views::filter(...); // Опасно: временный вектор уничтожен!
     ```

     **Источник:** [Cppreference: std::ranges::view](https://en.cppreference.com/w/cpp/ranges/view)

171. Что такое borrowed range?

     **Ответ:** Концепт диапазона, итераторы которого гарантированно остаются валидными даже после уничтожения самого объекта диапазона (например, ссылки `T&` или `std::span`).

     **Пример:**

     ```cpp
     #include <ranges>
     #include <span>

     static_assert(std::ranges::borrowed_range<std::span<int>>);
     ```

     **Источник:** [Cppreference: std::ranges::borrowed_range](https://en.cppreference.com/w/cpp/ranges/borrowed_range)

172. Почему borrowed ranges важны для безопасности?

     **Ответ:** Алгоритмы ranges предотвращают возврат висячих итераторов из временных контейнеров: если аргумент-rvalue не является `borrowed_range`, алгоритм возвращает защитный тип `std::ranges::dangling`.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> make_v();
     auto it = std::ranges::find(make_v(), 42); // it имеет тип std::ranges::dangling
     ```

     **Источник:** [Cppreference: std::ranges::dangling](https://en.cppreference.com/w/cpp/ranges/dangling)

173. Что такое `std::ranges::sort`?

     **Ответ:** Ranges-версия алгоритма сортировки, принимающая диапазон целиком, поддерживающая концепты и проекции (projections).

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {4, 1, 3};
     std::ranges::sort(v);
     ```

     **Источник:** [Cppreference: std::ranges::sort](https://en.cppreference.com/w/cpp/algorithm/ranges/sort)

174. Чем `ranges::sort` отличается от старого `std::sort`?

     **Ответ:** Он не требует явной пары `(v.begin(), v.end())`, проверяет ограничения на итераторы на этапе компиляции через концепты и поддерживает третий аргумент-проекцию.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     struct Item { int cost; };
     std::vector<Item> items = {{50}, {10}};
     std::ranges::sort(items, {}, &Item::cost); // сортировка по полю без лямбды
     ```

     **Источник:** [Cppreference: std::ranges::sort](https://en.cppreference.com/w/cpp/algorithm/ranges/sort)

175. Что такое projections в ranges-алгоритмах?

     **Ответ:** Вызываемый объект (лямбда или указатель на член класса), который трансформирует каждый элемент перед передачей в предикат или оператор сравнения алгоритма.

     **Пример:**

     ```cpp
     #include <vector>
     #include <string>
     #include <algorithm>

     std::vector<std::string> words = {"apple", "pear"};
     // Поиск строки по ее длине:
     auto it = std::ranges::find(words, 4, &std::string::length);
     ```

     **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

176. Что такое coroutines в C++20?

    **Ответ:** Корутины — функции, выполнение которых может быть приостановлено с сохранением состояния (без блокировки потока) и возобновлено позже с точки остановки.

    **Пример:**

    ```cpp
    // Функция становится корутиной при наличии co_await, co_yield или co_return
    ```

    **Источник:** [Cppreference: Coroutines](https://en.cppreference.com/w/cpp/language/coroutines)

177. Для каких задач корутины полезны?

     **Ответ:** Для асинхронного неблокирующего ввода-вывода (сетевые серверы), обработки потоковых событий и создания ленивых генераторов последовательностей.

     **Пример:**

     ```cpp
     // Генератор бесконечной последовательности без блокировки потоков
     ```

     **Источник:** [Cppreference: Coroutines](https://en.cppreference.com/w/cpp/language/coroutines)

178. Чем coroutine отличается от обычной функции?

     **Ответ:** Обычная функция может только завершиться и вернуть управление вызывающему коду, уничтожив свой стековый фрейм, а корутина сохраняет свой контекст (стек/состояние) в куче при приостановке.

     **Пример:**

     ```cpp
     // Состояние корутины живет в coroutine frame
     ```

     **Источник:** [Cppreference: Coroutines](https://en.cppreference.com/w/cpp/language/coroutines)

179. Что такое `co_await`?

     **Ответ:** Унарный оператор в корутине, приостанавливающий ее выполнение до тех пор, пока ожидаемый объект (Awaitable) не завершит асинхронную операцию.

     **Пример:**

     ```cpp
     // co_await async_read_data();
     ```

     **Источник:** [Cppreference: co_await](https://en.cppreference.com/w/cpp/language/coroutines)

180. Что такое `co_yield`?

     **Ответ:** Ключевое слово, возвращающее промежуточное значение вызывающему коду и приостанавливающее выполнение корутины (основа генераторов).

     **Пример:**

     ```cpp
     // co_yield current_value;
     ```

     **Источник:** [Cppreference: co_yield](https://en.cppreference.com/w/cpp/language/coroutines)

181. Что такое `co_return`?

     **Ответ:** Ключевое слово для окончательного завершения выполнения корутины (аналог `return` для обычных функций).

     **Пример:**

     ```cpp
     // co_return result;
     ```

     **Источник:** [Cppreference: co_return](https://en.cppreference.com/w/cpp/language/coroutines)

182. Что такое generator-подход и как он связан с корутинами?

     **Ответ:** Паттерн создания ленивых коллекций: корутина вычисляет и отдает следующий элемент последовательности по одному через `co_yield` только тогда, когда его запрашивает потребитель.

     **Пример:**

     ```cpp
     // std::generator<int> (C++23)
     ```

     **Источник:** [Cppreference: std::generator](https://en.cppreference.com/w/cpp/coroutine/generator)

183. Что такое modules в C++20?

    **Ответ:** Модули — современный компонент языка, заменяющий текстовое включение заголовочных файлов `#include` на изолированную семантическую трансляцию и импорт интерфейсов.

    **Пример:**

    ```cpp
    // import std; (C++23) или import my_module;
    ```

    **Источник:** [Cppreference: Modules](https://en.cppreference.com/w/cpp/language/modules)

184. Зачем были добавлены modules?

     **Ответ:** Для многократного ускорения компиляции больших проектов, устранения загрязнения макросами и избавления от костылей заголовочных файлов (`#pragma once`, include guards).

     **Пример:**

     ```cpp
     export module math;
     export int add(int a, int b) { return a + b; }
     ```

     **Источник:** [Cppreference: Modules](https://en.cppreference.com/w/cpp/language/modules)

185. Чем modules отличаются от `#include`?

     **Ответ:** `#include` выполняет слепую текстовую подстановку файла preprocessor-ом, а `import` загружает предварительно скомпилированный интерфейсный блок модуля без проникновения внутренних макросов во внешний код.

     **Пример:**

     ```cpp
     import math; // макросы из math не утекают в текущий файл
     ```

     **Источник:** [Cppreference: Modules](https://en.cppreference.com/w/cpp/language/modules)

186. Какие проблемы заголовков пытаются решить modules?

     **Ответ:** Порядок зависимостей включений, случайные конфликты макросов препроцессора, избыточный многократный парсинг одних и тех же файлов в тысячах единиц трансляции.

     **Пример:**

     ```cpp
     // Модуль компилируется ровно один раз
     ```

     **Источник:** [Cppreference: Modules](https://en.cppreference.com/w/cpp/language/modules)

187. Что такое interface unit у модуля?

     **Ответ:** Единица трансляции модуля, содержащая объявление `export module Name;`, определяющая экспортируемые наружу типы, функции и интерфейсы.

     **Пример:**

     ```cpp
     export module my_lib;
     export void hello();
     ```

     **Источник:** [Cppreference: Modules](https://en.cppreference.com/w/cpp/language/modules)

188. Что такое `import`?

     **Ответ:** Директива модуля, объявляющая зависимость от указанного модуля и делающая доступными все его экспортированные декларации.

     **Пример:**

     ```cpp
     import my_lib;
     int main() { hello(); }
     ```

     **Источник:** [Cppreference: Modules](https://en.cppreference.com/w/cpp/language/modules)

189. Почему modules не являются просто “красивой заменой include”?

     **Ответ:** Они принципиально изолируют видимость макросов, разделяют интерфейс и реализацию на уровне компилятора, меняют модель линковки и систему сборки проектов.

     **Пример:**

     ```cpp
     // Макрос, объявленный внутри модуля, не виден импортеру
     ```

     **Источник:** [Cppreference: Modules](https://en.cppreference.com/w/cpp/language/modules)

190. Что такое feature-test macros?

     **Ответ:** Стандартизированные макросы (C++20), позволяющие условно проверять в препроцессоре, поддерживает ли текущий компилятор конкретную возможность языка или библиотеки.

     **Пример:**

     ```cpp
     #ifdef __cpp_concepts
     // использовать concepts
     #endif
     ```

     **Источник:** [Cppreference: Feature testing](https://en.cppreference.com/w/cpp/feature_test)

191. Зачем нужны feature-test macros в portable modern C++?

    **Ответ:** Они обеспечивают переносимость кодовой базы между различными компиляторами (GCC, Clang, MSVC), которые внедряют свежие стандарты языка с разной скоростью.

    **Пример:**

    ```cpp
    #if __cpp_lib_span >= 202002L
    #include <span>
    #endif
    ```

    **Источник:** [Cppreference: Feature testing](https://en.cppreference.com/w/cpp/feature_test)

192. Что такое `__cpp_*`-макросы?

     **Ответ:** Это именованные целочисленные константы препроцессора (год и месяц принятия фичи, например `201907L`), соответствующие определенным фичам языка или стандартной библиотеки.

     **Пример:**

     ```cpp
     int ver = __cpp_binary_literals;
     ```

     **Источник:** [Cppreference: Feature testing](https://en.cppreference.com/w/cpp/feature_test)

193. Почему modern C++-код часто требует проверки поддержки фич компилятором?

     **Ответ:** Поскольку крупные кроссплатформенные проекты собираются на широком спектре окружений и версий компиляторов, где поддержка новейших стандартов (C++20/C++23) может быть частичной.

     **Пример:**

     ```cpp
     #include <version> // заголовок для проверки библиотечных макросов
     ```

     **Источник:** [Cppreference: Header `<version>`](https://en.cppreference.com/w/cpp/header/version)

194. Что такое compile-time programming в современном C++?

     **Ответ:** Парадигма программирования, при которой вычисления, проверки типов, генерация таблиц и валидация выполняются компилятором до запуска программы через `constexpr`, `consteval` и метапрограммирование.

     **Пример:**

     ```cpp
     constexpr auto primes = generate_prime_table();
     ```

     **Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr)

195. Чем `constexpr`-подход отличается от классического template metaprogramming?

     **Ответ:** `constexpr`-код пишется на чистом привычном C++ (с циклами `for`, условиями `if` и локальными переменными), тогда как старое шаблонное метапрограммирование требовало громоздкой функциональной рекурсии типов.

     **Пример:**

     ```cpp
     constexpr int factorial(int n) {
         int res = 1;
         for (int i = 2; i <= n; ++i) res *= i; // обычный цикл!
         return res;
     }
     ```

     **Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr)

196. Когда `consteval` лучше, чем `constexpr`?

     **Ответ:** `consteval` (immediate function из C++20) гарантирует, что функция обязана выполниться **только** во время компиляции. Если это невозможно, компилятор выдает ошибку, исключая нежелательное падение в runtime.

     **Пример:**

     ```cpp
     consteval int must_compile_time(int n) {
         return n * 2;
     }
     int x = 5;
     // must_compile_time(x); // Ошибка: x не константа компиляции
     ```

     **Источник:** [Cppreference: consteval](https://en.cppreference.com/w/cpp/language/consteval)

197. Что такое `constinit`?

     **Ответ:** Ключевое слово (C++20), предписывающее компилятору проверить, что переменная со статическим или thread-local временем жизни инициализируется константным выражением на этапе компиляции, но сама переменная остается изменяемой в runtime.

     **Пример:**

     ```cpp
     constinit static int counter = 100; // инициализация строго во время компиляции
     void inc() { counter++; }          // модификация разрешена
     ```

     **Источник:** [Cppreference: constinit](https://en.cppreference.com/w/cpp/language/constinit)

198. Чем `constinit` отличается от `constexpr`?

     **Ответ:** `constexpr` создает неизменяемую (`const`) переменную, а `constinit` гарантирует только момент ее начальной инициализации (во время сборки), сохраняя возможность изменять значение переменной в рантайме.

     **Пример:**

     ```cpp
     constinit int dynamic_counter = 0;
     // constexpr int locked = 0; // locked нельзя изменить
     ```

     **Источник:** [Cppreference: constinit](https://en.cppreference.com/w/cpp/language/constinit)

199. Почему инициализация глобальных объектов остаётся важной темой даже в modern C++?

     **Ответ:** Неправильный порядок инициализации глобальных объектов из разных файлов может привести к обращению к еще не сконструированному объекту (крах программы до входа в `main`).

     **Пример:**

     ```cpp
     // обращение к неинициализированному логгеру из другого .cpp
     ```

     **Источник:** [Cppreference: Initialization](https://en.cppreference.com/w/cpp/language/initialization)

200. Что такое static initialization order fiasco?

     **Ответ:** Катастрофа порядка статической инициализации — трудноотлаживаемая ошибка, возникающая, когда порядок динамической инициализации глобальных/статических переменных в разных единицах трансляции не определен стандартом.

     **Пример:**

     ```cpp
     // File1.cpp: int A = get_b() + 1;
     // File2.cpp: int B = 10; int get_b() { return B; }
     // Если File1 инициализируется раньше, get_b() вернет 0 вместо 10!
     ```

     **Источник:** [Cppreference: Initialization](https://en.cppreference.com/w/cpp/language/initialization)

## Сложный уровень

201. Почему “prefer composition over inheritance” особенно актуально в modern C++?

     **Ответ:** Наследование увеличивает связность, раздувает таблицы виртуальных функций и ухудшает кэш-локальность. Композиция в сочетании с концептами, лямбдами и шаблонами обеспечивает большую гибкость без динамического полиморфизма.

     **Пример:**

     ```cpp
     struct Engine {};
     class Car {
         Engine engine; // композиция вместо наследования от Engine
     };
     ```

     **Источник:** [Cppreference: Derived classes](https://en.cppreference.com/w/cpp/language/derived_class)

202. Почему value semantics считаются важной частью современного стиля?

     **Ответ:** Семантика значений гарантирует, что объекты независимы, локальны в памяти, легко тестируются, свободны от неявных сайд-эффектов разделяемых указателей и оптимизируются через move semantics.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> a = {1, 2};
     std::vector<int> b = a; // полное разделение состояния
     ```

     **Источник:** [Cppreference: Copy constructors](https://en.cppreference.com/w/cpp/language/copy_constructor)

203. Когда стоит проектировать тип как value type?

     **Ответ:** Всегда, когда объект концептуально представляет собой законченное данное (число, строку, точку, вектор, дату, матрицу), идентичность которого определяется его содержимым, а не его адресом в памяти.

     **Пример:**

     ```cpp
     struct Complex { double re, im; };
     ```

     **Источник:** [Cppreference: Classes](https://en.cppreference.com/w/cpp/language/classes)

204. Когда нужен polymorphic interface, а когда шаблонный полиморфизм?

     **Ответ:** Динамический интерфейс (`virtual`) нужен при плагинной архитектуре или когда гетерогенные объекты выбираются в рантайме. Шаблонный полиморфизм (concepts/шаблоны) предпочтителен для высокопроизводительного кода с известными типами на этапе сборки.

     **Пример:**

     ```cpp
     // Шаблонный полиморфизм (инлайнится):
     template <typename Renderer>
     void render_scene(Renderer& r);
     ```

     **Источник:** [Cppreference: Virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

205. Чем static polymorphism отличается от dynamic polymorphism?

     **Ответ:** Динамический полиморфизм разрешает вызовы в рантайме через таблицы виртуальных указателей (vtable), а статический — во время компиляции через шаблоны без накладных расходов на косвенные вызовы.

     **Пример:**

     ```cpp
     // Dynamic: Base* ptr -> vtable
     // Static: template <typename T> void run(T t) -> прямое инлайнирование
     ```

     **Источник:** [Cppreference: Virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

206. Когда CRTP уместен в modern C++?

     **Ответ:** Curiously Recurring Template Pattern уместен для статического полиморфизма (добавления общего функционала классам без оверхеда vtable) и статической проверки интерфейсов, хотя в C++20 он частично заменяется `concepts` и Deducing this (C++23).

     **Пример:**

     ```cpp
     template <typename Derived>
     struct Printable {
         void print() { static_cast<Derived*>(this)->show(); }
     };
     struct Text : Printable<Text> { void show(); };
     ```

     **Источник:** [Cppreference: Derived classes](https://en.cppreference.com/w/cpp/language/derived_class)

207. Почему type erasure считают важной современной техникой?

     **Ответ:** Стирание типов объединяет преимущества семантики значений и динамического полиморфизма: позволяет хранить любые разнородные типы с одинаковым интерфейсом без общего наследования (`std::function`, `std::any`).

     **Пример:**

     ```cpp
     #include <functional>

     std::function<void()> callback; // хранит лямбду, функтор или функцию
     ```

     **Источник:** [Cppreference: std::function](https://en.cppreference.com/w/cpp/utility/functional/function)

208. Когда `std::function` удобнее шаблонного параметра callable?

     **Ответ:** Когда нужно сохранить обработчик в коллекцию (массив коллбэков), передать его через границу интерфейса в файл реализации или избежать шаблонного раздувания сигнатур классов.

     **Пример:**

     ```cpp
     #include <functional>
     #include <vector>

     class Button {
         std::vector<std::function<void()>> on_click;
     };
     ```

     **Источник:** [Cppreference: std::function](https://en.cppreference.com/w/cpp/utility/functional/function)

209. В чём цена `std::function` по сравнению с шаблонным вызовом?

     **Ответ:** Вызов происходит через косвенный указатель на функцию (не инлайнится), и если замыкание превышает порог SBO (Small Buffer Optimization), происходит динамическое выделение памяти в куче.

     **Пример:**

     ```cpp
     #include <functional>

     // Шаблон: прямой инлайн вызова (0 ns)
     // std::function: косвенный вызов + возможная аллокация
     ```

     **Источник:** [Cppreference: std::function](https://en.cppreference.com/w/cpp/utility/functional/function)

210. Что такое small object optimization и как она может влиять на `std::function`?

     **Ответ:** Оптимизация малых объектов (SOO/SBO) выделяет небольшой внутренний буфер в самом объекте `std::function`; замыкания малого размера помещаются в буфер без аллокаций в куче, а крупные — требуют вызова `new`.

     **Пример:**

     ```cpp
     #include <functional>

     int x = 10;
     std::function<int()> f = [x]() { return x; }; // без кучи (SBO)
     ```

     **Источник:** [Cppreference: std::function](https://en.cppreference.com/w/cpp/utility/functional/function)

211. Почему чрезмерная динамическая аллокация считается плохим тоном в modern C++?

     **Ответ:** Аллокации в куче (`malloc`/`operator new`) являются системными блокирующими вызовами, фрагментируют память и приводят к промахам процессорного кэша при обходе указателей.

     **Пример:**

     ```cpp
     // Предпочтительно: std::vector<Point> (непрерывно)
     // Плохо: std::vector<std::unique_ptr<Point>> (разрозненно в куче)
     ```

     **Источник:** [Cppreference: Memory allocation](https://en.cppreference.com/w/cpp/memory)

212. Почему невладеющие указатели и представления данных требуют особой дисциплины lifetime?

     **Ответ:** Потому что `string_view`, `span`, сырые указатели и ссылки не продлевают жизнь объекту-владельцу: малейшее изменение структуры-владельца делает их висячими.

     **Пример:**

     ```cpp
     #include <string_view>
     #include <string>

     std::string_view sv;
     {
         std::string s = "test";
         sv = s;
     }
     // sv[0] — обращение к удаленной памяти!
     ```

     **Источник:** [Cppreference: std::basic_string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

213. Что такое ownership semantics?

     **Ответ:** Семантика владения — строгая концепция проектирования, определяющая, какой компонент системы единолично или совместно владеет ресурсом и несет ответственность за его освобождение.

     **Пример:**

     ```cpp
     // std::unique_ptr — монопольное владение
     // std::shared_ptr — коллективное владение
     // T* / T& / span — отсутствие владения
     ```

     **Источник:** [Cppreference: Smart pointers](https://en.cppreference.com/w/cpp/memory)

214. Почему ownership должен быть явно выражен в типе?

     **Ответ:** Чтобы разработчик и компилятор видели контракт жизненного цикла прямо из сигнатуры функции, не заглядывая в документацию и исключая утечки или случайные удаления.

     **Пример:**

     ```cpp
     #include <memory>

     void take_ownership(std::unique_ptr<int> ptr); // ясно: владение передано
     void inspect(const int* ptr);                  // ясно: просто просмотр
     ```

     **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

215. Когда поле типа `std::unique_ptr<T>` лучше отражает дизайн, чем сырой `T*`?

     **Ответ:** Всегда, когда объект класса владеет динамически выделенной сущностью и обязан уничтожить её вместе со своей смертью (композиция полиморфных объектов или pImpl).

     **Пример:**

     ```cpp
     #include <memory>

     struct Device {};
     class Controller {
         std::unique_ptr<Device> dev; // явное владение ресурсом
     };
     ```

     **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

216. Когда `T&` лучше, чем `T*`, для невладеющей зависимости?

     **Ответ:** Когда зависимость является строго обязательной и никогда не может быть `nullptr`: ссылка гарантирует существование валидного объекта в точке вызова.

     **Пример:**

     ```cpp
     struct Logger {};
     void process_transaction(Logger& log); // логгер обязан существовать
     ```

     **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

217. Почему `std::shared_ptr` не должен использоваться “по умолчанию”?

     **Ответ:** `shared_ptr` размывает архитектурные границы владения, создает накладные расходы на атомарный счетчик ссылок и контрольный блок и часто маскирует ошибки архитектуры.

     **Пример:**

     ```cpp
     // В 90% случаев достаточно std::unique_ptr или владения по значению
     ```

     **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

218. В чём опасность неразборчивого применения `shared_ptr`?

     **Ответ:** Возникновение утечек из-за циклических ссылок, случайное удержание тяжелых объектов в памяти дольше положенного и падение производительности из-за атомарных синхронизаций кэш-линий процессора.

     **Пример:**

     ```cpp
     // Увеличение и уменьшение счетчика shared_ptr требует atomic-инструкций (lock xadd)
     ```

     **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

219. Что такое циклическое владение через `shared_ptr`?

     **Ответ:** Ситуация, когда два или более объекта хранят `std::shared_ptr` друг на друга: счетчик ссылок каждого из них никогда не опустится до нуля, приводя к перманентной утечке памяти.

     **Пример:**

     ```cpp
     #include <memory>

     struct B;
     struct A { std::shared_ptr<B> b; };
     struct B { std::shared_ptr<A> a; }; // Цикл!
     ```

     **Источник:** [Cppreference: std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

220. Как `weak_ptr` помогает разрывать циклы?

     **Ответ:** Заменяя одну из сильных ссылок на `std::weak_ptr`: слабый указатель не увеличивает счетчик владения, позволяя объекту штатно уничтожиться.

     **Пример:**

     ```cpp
     #include <memory>

     struct A;
     struct B {
         std::weak_ptr<A> a; // цикл разорван
     };
     ```

     **Источник:** [Cppreference: std::weak_ptr](https://en.cppreference.com/w/cpp/memory/weak_ptr)

221. Что такое pImpl-идиома и почему она до сих пор актуальна?

     **Ответ:** Pointer to Implementation — идиома сокрытия деталей реализации и приватных полей за непрозрачным указателем на неполный тип (incomplete type), стабилизирующая ABI и ускоряющая время компиляции зависимых файлов.

     **Пример:**

     ```cpp
     // Widget.h
     class Widget {
         struct Impl;
         std::unique_ptr<Impl> pImpl;
     public:
         Widget();
         ~Widget();
     };
     ```

     **Источник:** [Cppreference: Pimpl](https://en.cppreference.com/w/cpp/language/pimpl)

222. Как modern C++ влияет на реализацию pImpl?

     **Ответ:** Использование `std::unique_ptr` автоматизирует удаление `Impl`, но требует явного объявления деструктора и move-операций в `.cpp`-файле, где тип `Impl` уже полностью определен.

     **Пример:**

     ```cpp
     // Widget.cpp
     struct Widget::Impl {};
     Widget::~Widget() = default; // определение деструктора строго в .cpp!
     ```

     **Источник:** [Cppreference: Pimpl](https://en.cppreference.com/w/cpp/language/pimpl)

223. Почему `unique_ptr` хорошо сочетается с pImpl?

     **Ответ:** Он идеально отражает семантику монопольного владения реализацией, не тратит лишнюю память (размер равен одному сырому указателю) и запрещает случайное копирование объекта класса.

     **Пример:**

     ```cpp
     #include <memory>

     struct EngineImpl;
     struct Engine {
         std::unique_ptr<EngineImpl> impl;
     };
     ```

     **Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

224. Что такое ABI и почему он важен для библиотек C++?

     **Ответ:** Application Binary Interface — низкоуровневый контракт бинарной совместимости скомпилированного кода (расположение полей в памяти, порядок вызовов, манглинг имен). Изменение ABI ломает совместимость с уже собранными библиотеками без полной пересборки.

     **Пример:**

     ```cpp
     // Добавление поля в класс меняет sizeof(Class) и ломает ABI
     ```

     **Источник:** [Cppreference: ABI](https://en.cppreference.com/w/cpp/language)

225. Почему новые возможности языка не всегда автоматически подходят для публичного ABI?

     **Ответ:** Передача сложных типов вроде `std::string_view` или стандартных шаблонов через границы динамических библиотек (DLL/.so) связывает пользователей библиотеки с конкретной версией компилятора и реализацией STL.

     **Пример:**

     ```cpp
     // Для чистого C-ABI часто используют примитивные типы (const char*, size_t)
     ```

     **Источник:** [Cppreference: ABI](https://en.cppreference.com/w/cpp/language)

226. Что такое hidden friends и когда они полезны?

     **Ответ:** Дружественные функции (часто операторы), определенные непосредственно внутри тела класса; они не видны в пространстве имен и находятся только через Argument-Dependent Lookup (ADL), что сокращает время компиляции и предотвращает нежелательные неявные приведения.

     **Пример:**

     ```cpp
     class Number {
         int val = 0;
     public:
         friend bool operator==(const Number& a, const Number& b) {
             return a.val == b.val;
         }
     };
     ```

     **Источник:** [Cppreference: Friend function](https://en.cppreference.com/w/cpp/language/friend)

227. Что такое customization point object?

     **Ответ:** CPO — функциональный объект (начиная с C++20, как `std::ranges::begin`), защищающий вызов от спуфинга через ADL и проверяющий ограничения времени жизни типов для перегрузок алгоритмов.

     **Пример:**

     ```cpp
     #include <ranges>

     // std::ranges::begin — это функциональный CPO
     ```

     **Источник:** [Cppreference: Customization point object](https://en.cppreference.com/w/cpp/ranges/cpo)

228. Почему современная стандартная библиотека использует CPO-подход?

     **Ответ:** Чтобы предоставить единую и безопасную точку входа для пользовательских перегрузок функций алгоритмов и диапазонов без случайного захвата мусорных функций из глобальной области видимости.

     **Пример:**

     ```cpp
     #include <ranges>

     // Вызов std::ranges::swap безопаснее неквалифицированного swap
     ```

     **Источник:** [Cppreference: Customization point object](https://en.cppreference.com/w/cpp/ranges/cpo)

229. Чем generic programming в modern C++ отличается от старого подхода “максимум виртуальных классов”?

     **Ответ:** Обобщенное программирование фокусируется на поведении и возможностях типов (через концепты), а не на их родстве в иерархии наследования, обеспечивая идеальный инлайнинг кода компилятором.

     **Пример:**

     ```cpp
     // Достаточно соответствовать концепту, наследоваться от абстрактного Base не требуется
     template <std::regular T>
     void store(T item);
     ```

     **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/concepts)

230. Почему concepts, ranges и type traits часто работают вместе?

    **Ответ:** Type traits анализируют и трансформируют свойства типов, concepts объединяют эти свойства в строгие интерфейсные контракты, а ranges применяют эти контракты к потокам данных и алгоритмам.

    **Пример:**

    ```cpp
    #include <ranges>
    #include <type_traits>
    #include <concepts>

    template <std::ranges::input_range R>
    requires std::is_integral_v<std::ranges::range_value_t<R>>
    void process(R&& r);
    ```

    **Источник:** [Cppreference: Concepts library](https://en.cppreference.com/w/cpp/concepts)

231. Что такое `std::filesystem` и почему его относят к modern C++-инструментам?

     **Ответ:** Стандартная кроссплатформенная библиотека (C++17) для безопасной и переносимой манипуляции путями, файлами и директориями без платформозависимых Си-функций (`POSIX`/`WinAPI`).

     **Пример:**

     ```cpp
     #include <filesystem>

     namespace fs = std::filesystem;
     fs::create_directories("sandbox/a/b");
     ```

     **Источник:** [Cppreference: Filesystem library](https://en.cppreference.com/w/cpp/filesystem)

232. Какие задачи решает `std::filesystem`?

     **Ответ:** Обход директорий (`directory_iterator`), проверка существования и разрешений файлов, получение метаданных (размер, время модификации), создание символических ссылок и работа с путями (`fs::path`).

     **Пример:**

     ```cpp
     #include <filesystem>

     for (const auto& entry : std::filesystem::directory_iterator(".")) {
         // обработка файлов
     }
     ```

     **Источник:** [Cppreference: Filesystem library](https://en.cppreference.com/w/cpp/filesystem)

233. Что такое `std::chrono` в современном стиле проектирования?

     **Ответ:** Библиотека работы со временем, реализующая строгую типизацию промежутков времени (durations), моментов времени (time_points) и часов (clocks) с автоматическим вычислением коэффициентов перевода единиц на этапе компиляции.

     **Пример:**

     ```cpp
     #include <chrono>

     using namespace std::chrono_literals;
     auto timeout = 500ms; // тип std::chrono::milliseconds
     ```

     **Источник:** [Cppreference: Date and time library](https://en.cppreference.com/w/cpp/chrono)

234. Почему strongly typed time durations безопаснее голых целых чисел?

     **Ответ:** Они исключают критические ошибки единиц измерения (например, случайную передачу секунд в функцию, ожидающую миллисекунды), выполняя конвертацию автоматически или блокируя ошибочный код при сборке.

     **Пример:**

     ```cpp
     #include <chrono>

     void delay(std::chrono::milliseconds ms);
     // delay(5); // Ошибка: неявная передача голого числа запрещена
     delay(std::chrono::seconds(2)); // Корректно: компилятор сам переведет в 2000 ms
     ```

     **Источник:** [Cppreference: std::chrono::duration](https://en.cppreference.com/w/cpp/chrono/duration)

235. Что такое `std::jthread` и чем он отличается от `std::thread`?

     **Ответ:** Поток исполнения (C++20), автоматически вызывающий `join()` в своем деструкторе (RAII) и имеющий встроенную поддержку кооперативной отмены задач через токены остановки (`std::stop_token`).

     **Пример:**

     ```cpp
     #include <thread>

     void worker(std::stop_token st);
     std::jthread jt(worker); // автоматически завершится и сделает join при выходе из скоупа
     ```

     **Источник:** [Cppreference: std::jthread](https://en.cppreference.com/w/cpp/thread/jthread)

236. Что такое `stop_token` и отмена работы в современном многопоточном коде?

     **Ответ:** Стандартизированный механизм потокобезопасного сигнала остановки: источник (`std::stop_source`) запрашивает отмену, а рабочий поток опрашивает свой `std::stop_token` через `stop_requested()` или ждет на прерываемом `condition_variable_any`.

     **Пример:**

     ```cpp
     #include <thread>

     void run(std::stop_token st) {
         while (!st.stop_requested()) {
             // выполнение итерации работы
         }
     }
     ```

     **Источник:** [Cppreference: std::stop_token](https://en.cppreference.com/w/cpp/thread/stop_token)

237. Почему современный C++ поощряет типобезопасность сильнее, чем старые стили кода?

     **Ответ:** Чтобы максимально перенести обнаружение ошибок с этапа ночного runtime-сбоя на этап сборки программы компилятором (принцип "Make interfaces easy to use correctly and hard to use incorrectly").

     **Пример:**

     ```cpp
     // Использование enum class вместо int масок
     ```

     **Источник:** [Cppreference: Type system](https://en.cppreference.com/w/cpp/language/type)

238. Почему `enum class`, `optional`, `variant` и strong typedef-подход улучшают модель данных?

     **Ответ:** Они делают недопустимые состояния программы невыразимыми в коде (make illegal states unrepresentable), явно документируя намерения в типах.

     **Пример:**

     ```cpp
     struct UserId { int value; }; // strong type вместо сырого int
     ```

     **Источник:** [Cppreference: Classes](https://en.cppreference.com/w/cpp/language/classes)

239. Когда `std::expected` концептуально лучше исключений или `optional`?

     **Ответ:** `std::expected` (C++23) лучше `optional`, так как возвращает подробную причину ошибки в случае сбоя, и лучше исключений на горячих путях кода, так как не вызывает просадок производительности на раскрутку стека.

     **Пример:**

     ```cpp
     #include <expected>
     #include <string>

     std::expected<double, std::string> calculate(double x);
     ```

     **Источник:** [Cppreference: std::expected](https://en.cppreference.com/w/cpp/utility/expected)

240. В каких задачах `optional` недостаточен без информации об ошибке?

     **Ответ:** В сетевых запросах, парсинге файлов и операциях ввода-вывода, где вызывающему коду критически важно знать, почему именно произошел сбой (таймаут, неверный формат, отказ в доступе).

     **Пример:**

     ```cpp
     // optional вернет nullopt, а expected вернет ErrorCode::AccessDenied
     ```

     **Источник:** [Cppreference: std::expected](https://en.cppreference.com/w/cpp/utility/expected)

241. Почему современный API часто старается быть explicit в отношении ошибок, владения и времени жизни?

     **Ответ:** Это делает вызов функции предсказуемым: разработчику не нужно гадать, бросает ли функция исключения, утечет ли переданный указатель и нужно ли его удалять.

     **Пример:**

     ```cpp
     // Сигнатура говорит всё сама за себя:
     // std::expected<Session, NetError> connect(std::string_view host);
     ```

     **Источник:** [Cppreference: Design principles](https://en.cppreference.com/w/cpp)

242. Что такое `explicit` у конструкторов и операторов преобразования?

     **Ответ:** Спецификатор, запрещающий компилятору использовать данный конструктор или оператор приведения типов для неявных (автоматических) преобразований.

     **Пример:**

     ```cpp
     struct Vector {
         explicit Vector(int size); // запрещает неявное приведение: Vector v = 10;
     };
     ```

     **Источник:** [Cppreference: explicit specifier](https://en.cppreference.com/w/cpp/language/explicit)

243. Почему `explicit` особенно важен в generic-коде?

     **Ответ:** В шаблонах неявные преобразования могут приводить к инстанцированию совершенно непреднамеренных перегрузок или созданию дорогих скрытых временных копий.

     **Пример:**

     ```cpp
     struct Handle {
         explicit operator bool() const noexcept; // explicit bool исключает участие в операциях арифметики
     };
     ```

     **Источник:** [Cppreference: explicit specifier](https://en.cppreference.com/w/cpp/language/explicit)

244. Когда неявные преобразования вредят modern C++-дизайну?

     **Ответ:** Когда они маскируют тяжелые аллокации (например, неявное конструирование `std::string` из литерала) или приводят к неоднозначностям при вызове перегруженных функций.

     **Пример:**

     ```cpp
     void print(std::string);
     // print("text"); // создание временного объекта std::string
     ```

     **Источник:** [Cppreference: Implicit conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

245. Что такое `[[nodiscard]]`-ориентированный API-дизайн?

     **Ответ:** Практика проектирования, при которой все фабричные методы, алгоритмические расчеты и функции, возвращающие статус выполнения или новые ресурсы, снабжаются атрибутом `[[nodiscard]]`.

     **Пример:**

     ```cpp
     class Transaction {
     public:
         [[nodiscard]] bool commit();
     };
     ```

     **Источник:** [Cppreference: attribute nodiscard](https://en.cppreference.com/w/cpp/language/attributes/nodiscard)

246. Почему маленькие чистые функции хорошо сочетаются с современным стилем C++?

     **Ответ:** Они легко инлайнятся компилятором, могут выполняться в `constexpr`/`consteval` контексте, идеально комбинируются в пайплайнах ranges и не имеют побочных эффектов.

     **Пример:**

     ```cpp
     constexpr auto is_positive = [](auto x) { return x > 0; };
     ```

     **Источник:** [Cppreference: Functions](https://en.cppreference.com/w/cpp/language/functions)

247. Почему modern C++ — это не только новые фичи, но и новый стиль проектирования?

     **Ответ:** Это фундаментальный переход от низкоуровневых манипуляций памятью и запутанных иерархий классов к декларативному, типобезопасному дизайну с фокусом на семантику значений и RAII.

     **Пример:**

     ```cpp
     // Вместо сотен строк с указателями — несколько строк со стандартными контейнерами и диапазонами
     ```

     **Источник:** [Cppreference: C++ language](https://en.cppreference.com/w/cpp/language)

248. Какие старые практики формально допустимы, но обычно считаются плохими в modern C++?

     **Ответ:** Использование макросов вместо `constexpr`/`inline`, сырые массивы `T[]` вместо `std::array`/`std::vector`, Си-приведения `(Type)val` вместо C++-кастов, `NULL` вместо `nullptr`, и ручное управление через `new`/`delete`.

     **Пример:**

     ```cpp
     // Плохо: #define BUFFER_SIZE 1024
     // Хорошо: constexpr size_t BufferSize = 1024;
     ```

     **Источник:** [Cppreference: C++ Core Guidelines](https://en.cppreference.com/w/cpp)

249. Почему “modern C++” не означает “использовать все новые возможности сразу”?

     **Ответ:** Избыточное усложнение кода метапрограммированием, ненужными корутинами и сложными концептами ухудшает читаемость и замедляет сборку; инструмент должен точно соответствовать решаемой задаче (принцип KISS).

     **Пример:**

     ```cpp
     // Простой цикл for часто лучше сложного пайплайна ranges из 10 звеньев
     ```

     **Источник:** [Cppreference: C++ language](https://en.cppreference.com/w/cpp/language)

250. Какие основные принципы хорошего кода в modern C++ ты бы сформулировал?

     **Ответ:**

     1. **Управление ресурсами:** используйте RAII и правило нуля (`Rule of Zero`); избегайте сырых `new`/`delete`.
     2. **Семантика данных:** отдавайте предпочтение семантике значений (`Value Semantics`) и `std::vector` по умолчанию.
     3. **Интерфейсы:** делайте интерфейсы самодокументируемыми (`std::string_view`, `std::span`, `[[nodiscard]]`, `enum class`).
     4. **Вычисления:** переносите проверки и генерацию констант в compile-time (`constexpr`, `concepts`, `static_assert`).
     5. **Лаконичность:** используйте стандартные алгоритмы и диапазоны (`std::ranges`) вместо изобретения собственных циклов.

     **Пример:**

     ```cpp
     #include <span>
     #include <algorithm>

     // Современный интерфейс: безопасный, понятный, неизменяемый
     [[nodiscard]] constexpr int sum_positive(std::span<const int> values) {
         int total = 0;
         for (int x : values) {
             if (x > 0) total += x;
         }
         return total;
     }
     ```

     **Источник:** [Cppreference: Standard library](https://en.cppreference.com/w/cpp/standard_library)


[<- Prev](./08_stl.md)      [Next ->](./10_raii_move_semantics.md)
