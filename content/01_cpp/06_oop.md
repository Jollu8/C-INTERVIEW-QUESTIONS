# ООП

Примеры — независимые фрагменты в контексте C++20, если не указано иное. Стандартные заголовки для краткости опущены: подключайте используемые компоненты (`<string>`, `<vector>`, `<memory>`, `<utility>`, `<stdexcept>` и другие). Фрагменты с одними объявлениями не всегда являются законченными программами; намеренно ошибочные действия закомментированы. Ссылки на рабочий проект стандарта ведут на обновляемый текст.

## Лёгкий уровень

1. Что такое объектно-ориентированное программирование?

   **Ответ:** ООП организует программу вокруг объектов, которые объединяют состояние и операции над ним.

   **Пример:**

   ```cpp
   class Counter {
       int n = 0;

     public:
       void increment() { ++n; }
       int value() const { return n; }
   };
   ```

   **Источник:** [Cppreference: classes](https://en.cppreference.com/w/cpp/language/classes)

2. Какие основные идеи лежат в основе ООП?

   **Ответ:** Основные идеи ООП — инкапсуляция, абстракция, наследование и полиморфизм.

   **Пример:**

   ```cpp
   struct Shape {
       virtual double area() const = 0;
       virtual ~Shape() = default;
   };
   struct Square : Shape {
       double side = 2;
       double area() const override { return side * side; }
   };
   ```

   **Источник:** [Cppreference: classes](https://en.cppreference.com/w/cpp/language/classes)

3. Что такое объект?

   **Ответ:** Объект — область памяти с типом, значением и временем жизни.

   **Пример:**

   ```cpp
   int number = 42; // number — объект типа int, не обязательно экземпляр класса
   ```

   **Источник:** [Cppreference: object](https://en.cppreference.com/w/cpp/language/object)

4. Что такое класс?

   **Ответ:** Класс — пользовательский тип, описывающий данные, операции и правила создания объектов.

   **Пример:**

   ```cpp
   class Counter {
       int n = 0;

     public:
       int value() const { return n; }
   };
   ```

   **Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

5. Чем класс отличается от объекта?

   **Ответ:** Класс является описанием типа, а объект — конкретным экземпляром этого типа.

   **Пример:**

   ```cpp
   struct Point {
       int x, y;
   };                      // тип
   Point a{1, 2}, b{3, 4}; // два объекта
   ```

   **Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

6. Что такое экземпляр класса?

   **Ответ:** Это объект, созданный с типом конкретного класса.

   **Пример:**

   ```cpp
   struct User {
       std::string name;
   };
   User user{"Anna"};
   ```

   **Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

7. Что такое состояние объекта?

   **Ответ:** Это значения его полей и связанных ресурсов в определённый момент времени.

   **Пример:**

   ```cpp
   struct Lamp {
       bool on = false;
   };
   void example() {
       Lamp lamp;
       lamp.on = true;
   }
   ```

   **Источник:** [Cppreference: data members](https://en.cppreference.com/w/cpp/language/data_members)

8. Что такое поведение объекта?

   **Ответ:** Это набор операций, доступных через функции-члены и другие функции интерфейса.

   **Пример:**

   ```cpp
   struct Lamp {
       bool on = false;
       void switch_on() { on = true; }
   };
   ```

   **Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

9. Что такое поля класса?

   **Ответ:** Поля — данные-члены, составляющие состояние объектов класса.

   **Пример:**

   ```cpp
   struct Point {
       int x = 0;
       int y = 0;
   };
   ```

   **Источник:** [Cppreference: data members](https://en.cppreference.com/w/cpp/language/data_members)

10. Что такое методы класса?

    **Ответ:** Методы — функции-члены класса. Нестатические методы работают с конкретным объектом, а статические не имеют неявного объекта и `this`.

    **Пример:**

    ```cpp
    struct Counter {
        int n = 0;
        void increment() { ++n; }
    };
    ```

    **Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

11. Что такое атрибуты объекта?

    **Ответ:** Это свойства или данные, описывающие состояние объекта; в C++ обычно они представлены полями.

    **Пример:**

    ```cpp
    struct Book {
        std::string title;
        int pages = 0;
    }; // атрибуты предметной модели
    ```

    **Источник:** [Cppreference: data members](https://en.cppreference.com/w/cpp/language/data_members)

12. Что такое данные-члены класса?

    **Ответ:** Это объявленные в классе переменные, которые бывают нестатическими или статическими.

    **Пример:**

    ```cpp
    struct Item {
        int id = 0;
        inline static int next_id = 1;
    }; // C++17
    ```

    **Источник:** [Cppreference: data members](https://en.cppreference.com/w/cpp/language/data_members)

13. Что такое функции-члены класса?

    **Ответ:** Это функции, объявленные членами класса. В обычном нестатическом методе доступен `this`; статический метод его не имеет. Начиная с C++23, есть также методы с явно заданным объектным параметром, в которых неявного `this` нет.

    **Пример:**

    ```cpp
    struct X {
        int n = 1;
        int get() const { return n; }
        static int zero() { return 0; }
    };
    ```

    **Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

14. Как объявить класс в C++?

    **Ответ:** Используют `class Name { ... };`, после закрывающей фигурной скобки ставится точка с запятой.

    **Пример:**

    ```cpp
    class Widget; // предварительное объявление
    class Widget {
      public:
        void run() {}
    }; // определение
    ```

    **Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

15. Как создать объект класса?

    **Ответ:** Объявите переменную типа класса, например `Widget widget{};`.

    **Пример:**

    ```cpp
    struct Widget {
        int value = 0;
    };
    Widget widget{};
    ```

    **Источник:** [Cppreference: initialization](https://en.cppreference.com/w/cpp/language/initialization)

16. Что такое спецификатор доступа?

    **Ответ:** Он определяет, какие части класса доступны из разных контекстов программы.

    **Пример:**

    ```cpp
    class Counter {
      private:
        int n = 0;

      public:
        int value() const { return n; }
    };
    ```

    **Источник:** [Cppreference: access](https://en.cppreference.com/w/cpp/language/access)

17. Какие спецификаторы доступа есть в C++?

    **Ответ:** `public`, `protected` и `private`.

    **Пример:**

    ```cpp
    class Base {
      public:
        void run() {}

      protected:
        int state = 0;

      private:
        int secret = 1;
    };
    ```

    **Источник:** [Cppreference: access](https://en.cppreference.com/w/cpp/language/access)

18. Что означает `public`?

    **Ответ:** Объявленные после него члены доступны внешнему коду при доступном самом объекте или типе.

    **Пример:**

    ```cpp
    struct Widget {
      public:
        void run() {}
    };
    void example() {
        Widget w;
        w.run();
    }
    ```

    **Источник:** [Cppreference: access](https://en.cppreference.com/w/cpp/language/access)

19. Что означает `private`?

    **Ответ:** Члены доступны самому классу и его друзьям, но не обычному внешнему коду.

    **Пример:**

    ```cpp
    class Box {
        int value = 0;

      public:
        int get() const { return value; }
    };
    // Box{}.value; // недоступно
    ```

    **Источник:** [Cppreference: access](https://en.cppreference.com/w/cpp/language/access)

20. Что означает `protected`?

    **Ответ:** Члены доступны самому классу, его друзьям и в предусмотренных правилами случаях производным классам и их друзьям. Для нестатических protected-членов доступ из наследника через произвольный объект базы ограничен.

    **Пример:**

    ```cpp
    struct Base {
      protected:
        int value = 0;
    };
    struct Derived : Base {
        void reset() { value = 0; }
    };
    ```

    **Источник:** [Cppreference: access](https://en.cppreference.com/w/cpp/language/access)

21. Какой доступ по умолчанию у членов `class`?

    **Ответ:** `private`.

    **Пример:**

    ```cpp
    class Box {
        int value = 0;
    }; // private
    // Box{}.value; // ошибка доступа
    ```

    **Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

22. Какой доступ по умолчанию у членов `struct`?

    **Ответ:** `public`.

    **Пример:**

    ```cpp
    struct Box {
        int value = 0;
    };
    int n = Box{}.value; // public
    ```

    **Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

23. Чем `class` отличается от `struct` в C++?

    **Ответ:** Главное различие — доступ по умолчанию и режим наследования: у `class` private, у `struct` public.

    **Пример:**

    ```cpp
    struct Base {};
    class A : Base {};  // private-наследование
    struct B : Base {}; // public-наследование
    ```

    **Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

24. Что такое инкапсуляция?

    **Ответ:** Это объединение данных и операций с контролем доступа к внутреннему представлению объекта.

    **Пример:**

    ```cpp
    class Level {
        int n = 0;

      public:
        void set(int v) {
            if (v < 0)
                throw std::invalid_argument("negative");
            n = v;
        }
    };
    ```

    **Источник:** [Cppreference: access](https://en.cppreference.com/w/cpp/language/access)

25. Зачем скрывать данные внутри класса?

    **Ответ:** Чтобы защищать инварианты и менять реализацию без изменения внешнего контракта.

    **Пример:**

    ```cpp
    class Level {
        int n = 0;

      public:
        void set(int v) {
            if (v < 0)
                throw std::invalid_argument("negative");
            n = v;
        }
    };
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

26. Почему прямой доступ ко всем полям объекта считается плохой практикой?

    **Ответ:** Когда поля связаны инвариантами, прямое изменение позволяет нарушить их и связывает клиентов с представлением. Для простой структуры независимых данных публичные поля вполне уместны.

    **Пример:**

    ```cpp
    struct Range {
        int low, high;
    };
    Range invalid{10, 2}; // публичные поля не обеспечивают low <= high
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

27. Что такое интерфейс класса?

    **Ответ:** Это доступные клиенту типы, функции и гарантии, описывающие способы использования класса.

    **Пример:**

    ```cpp
    class Stack {
      public:
        void push(int);
        int pop();
        bool empty() const;

      private:
        std::vector<int> data;
    };
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

28. Что такое реализация класса?

    **Ответ:** Это внутренние поля и код методов, обеспечивающие поведение класса.

    **Пример:**

    ```cpp
    class Stack {
        std::vector<int> data;

      public:
        void push(int x) { data.push_back(x); }
    };
    ```

    **Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

29. Что такое метод доступа к данным объекта?

    **Ответ:** Это функция, через которую читают или изменяют состояние объекта по правилам интерфейса.

    **Пример:**

    ```cpp
    class Box {
        int n = 0;

      public:
        int get() const { return n; }
        void set(int v) { n = v; }
    };
    ```

    **Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

30. Что такое геттер?

    **Ответ:** Геттер — метод, возвращающий поле или производное от него значение.

    **Пример:**

    ```cpp
    class Box {
        int n = 42;

      public:
        int value() const { return n; }
    };
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

31. Что такое сеттер?

    **Ответ:** Сеттер — метод изменения свойства объекта. Он может проверять новое значение, но сам по себе термин не гарантирует наличия валидации.

    **Пример:**

    ```cpp
    class Level {
        int n = 0;

      public:
        void set(int v) {
            if (v < 0)
                throw std::invalid_argument("negative");
            n = v;
        }
    };
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

32. Когда геттеры и сеттеры действительно полезны?

    **Ответ:** Когда доступ нужно контролировать, валидировать, логировать или сохранить возможность изменить хранение.

    **Пример:**

    ```cpp
    class Celsius {
        double value_ = 0;

      public:
        double fahrenheit() const { return value_ * 1.8 + 32; }
    };
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

33. Почему сеттеры не всегда стоит делать для всех полей?

    **Ответ:** Универсальные сеттеры ослабляют инварианты и превращают объект в открытую структуру.

    **Пример:**

    ```cpp
    class Range {
        int low = 0, high = 0;

      public:
        void set(int a, int b) {
            if (a > b)
                throw std::invalid_argument("range");
            low = a;
            high = b;
        }
    };
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

34. Что такое конструктор?

    **Ответ:** Конструктор — специальная функция, инициализирующая объект при создании.

    **Пример:**

    ```cpp
    struct Point {
        int x;
        explicit Point(int value) : x(value) {}
    };
    ```

    **Источник:** [Cppreference: initializer list](https://en.cppreference.com/w/cpp/language/initializer_list)

35. Когда вызывается конструктор?

    **Ответ:** При инициализации объекта, если правила инициализации выбирают конструктор, в том числе для баз и полей. Агрегатная инициализация класса может инициализировать его элементы без вызова конструктора самого агрегата.

    **Пример:**

    ```cpp
    struct Item {
        Item() { std::cout << "created"; }
    };
    void example() { Item item; }
    ```

    **Источник:** [Cppreference: initializer list](https://en.cppreference.com/w/cpp/language/initializer_list)

36. Для чего нужен конструктор?

    **Ответ:** Он устанавливает начальное состояние объекта и проверяет необходимые условия его существования.

    **Пример:**

    ```cpp
    class Positive {
        int n;

      public:
        explicit Positive(int x) : n(x) {
            if (x <= 0)
                throw std::invalid_argument("positive required");
        }
    };
    ```

    **Источник:** [C++ Core Guidelines: constructors](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

37. Что такое конструктор по умолчанию?

    **Ответ:** Это конструктор, который можно вызвать без аргументов.

    **Пример:**

    ```cpp
    struct X {
        explicit X(int value = 0) {}
    };
    X x; // конструктор по умолчанию, хотя параметр есть
    ```

    **Источник:** [Cppreference: default constructor](https://en.cppreference.com/w/cpp/language/default_constructor)

38. Когда компилятор может сгенерировать конструктор по умолчанию?

    **Ответ:** Если класс не имеет пользовательских объявлений конструкторов или шаблонов конструкторов, компилятор неявно объявляет конструктор по умолчанию. При невозможности инициализировать базы или поля он может оказаться удалённым. Нужный конструктор можно также явно объявить через `= default`.

    **Пример:**

    ```cpp
    struct A {
        int n = 0;
    }; // неявный default constructor
    struct B {
        explicit B(int) {}
    };
    // B b; // конструктора без аргументов нет
    ```

    **Источник:** [Cppreference: default constructor](https://en.cppreference.com/w/cpp/language/default_constructor)

39. Что такое деструктор?

    **Ответ:** Деструктор — специальная функция, выполняемая при разрушении объекта класса. После его тела разрушаются поля и базы; формально время жизни объекта класса заканчивается при начале вызова деструктора.

    **Пример:**

    ```cpp
    struct Trace {
        ~Trace() { std::cout << "destroyed"; }
    };
    ```

    **Источник:** [Cppreference: destructor](https://en.cppreference.com/w/cpp/language/destructor)

40. Когда вызывается деструктор?

    **Ответ:** Для автоматического объекта — при выходе из области, в том числе при раскрутке стека; для динамического — при корректном удалении, для временного — по правилам времени жизни. Аварийное завершение не гарантирует вызов всех деструкторов.

    **Пример:**

    ```cpp
    struct Trace {
        ~Trace() { std::cout << "destroyed"; }
    };
    void example() {
        {
            Trace t;
        } /* t уже уничтожен */
    }
    ```

    **Источник:** [Cppreference: destructor](https://en.cppreference.com/w/cpp/language/destructor)

41. Для чего нужен деструктор?

    **Ответ:** Для освобождения ресурсов, которыми владеет объект, и выполнения финальных действий lifetime.

    **Пример:**

    ```cpp
    struct Buffer {
        std::vector<int> data;
    };
    // Неявный ~Buffer() вызывает ~vector(), освобождающий память.
    ```

    **Источник:** [C++ Core Guidelines: RAII](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

42. Может ли класс иметь несколько конструкторов?

    **Ответ:** Да, конструкторы можно перегружать разными списками параметров.

    **Пример:**

    ```cpp
    struct Point {
        int x;
        Point() : x(0) {}
        explicit Point(int v) : x(v) {}
    };
    ```

    **Источник:** [Cppreference: constructors](https://en.cppreference.com/w/cpp/language/initializer_list)

43. Что такое перегрузка конструкторов?

    **Ответ:** Это несколько конструкторов, принимающих разные параметры и создающих объект разными способами.

    **Пример:**

    ```cpp
    struct Text {
        std::string data;
        Text() = default;
        explicit Text(std::string s) : data(std::move(s)) {}
    };
    ```

    **Источник:** [Cppreference: constructors](https://en.cppreference.com/w/cpp/language/initializer_list)

44. Можно ли перегружать методы класса?

    **Ответ:** Да, если методы различаются списком параметров или cv/ref-квалификаторами.

    **Пример:**

    ```cpp
    struct Printer {
        void print(int) {}
        void print(const std::string &) {}
    };
    ```

    **Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

45. По каким правилам методы считаются перегруженными?

    **Ответ:** Они различаются по параметрам и квалификаторам; одного возвращаемого типа недостаточно.

    **Пример:**

    ```cpp
    struct Box {
        int n = 0;
        int &get() { return n; }
        const int &get() const { return n; }
    };
    ```

    **Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

46. Можно ли перегрузить метод только по возвращаемому типу?

    **Ответ:** Нет: одинаковые параметры обычных методов и различие только возвращаемого типа не образуют допустимые перегрузки. Для шаблонов действуют дополнительные правила, но обычный вызов тоже не выбирает функцию лишь по ожидаемому результату.

    **Пример:**

    ```cpp
    struct X {
        int get(); /* double get(); // недопустимая перегрузка */
    };
    ```

    **Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

47. Что такое объект на стеке?

    **Ответ:** В практическом смысле это объект автоматической длительности хранения; физическое размещение стандарт не гарантирует.

    **Пример:**

    ```cpp
    struct Widget {};
    void example() { Widget local; } // автоматическая длительность хранения
    ```

    **Источник:** [Cppreference: storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

48. Что такое объект в динамической памяти?

    **Ответ:** Это объект динамической длительности хранения, созданный средствами динамического выделения.

    **Пример:**

    ```cpp
    struct Widget {};
    void example() {
        auto p = std::make_unique<Widget>();
    } // динамический объект, RAII-владелец
    ```

    **Источник:** [Cppreference: dynamic storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

49. Чем отличается `Class obj;` от `Class* p = new Class;`?

    **Ответ:** Внутри функции без `static` первая запись создаёт объект автоматической длительности хранения; вторая — динамический объект и локальный указатель на него. Динамическим объектом нужно управлять отдельно, обычно через RAII. В других контекстах длительность хранения `obj` может быть иной.

    **Пример:**

    ```cpp
    struct Widget {};
    void example() {
        Widget obj;
        Widget *p = new Widget;
        delete p;
    }
    ```

    **Источник:** [Cppreference: new expression](https://en.cppreference.com/w/cpp/language/new)

50. Почему управление временем жизни объекта важно в ООП?

    **Ответ:** Ошибки lifetime приводят к утечкам, use-after-free и нарушению инвариантов объекта.

    **Пример:**

    ```cpp
    struct Widget {};
    void example() {
        auto p = std::make_unique<Widget>();
    } // уничтожение при выходе из функции
    ```

    **Источник:** [C++ Core Guidelines: RAII](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

## Ниже среднего уровня

51. Что такое `this` в методе класса?

    **Ответ:** `this` — указатель на объект, для которого вызван нестатический метод.

    **Пример:**

    ```cpp
    struct X {
        X *self() { return this; }
    };
    ```

    **Источник:** [Cppreference: this pointer](https://en.cppreference.com/w/cpp/language/this)

52. Что хранит указатель `this`?

    **Ответ:** Адрес текущего объекта.

    **Пример:**

    ```cpp
    struct X {
        const X *address() const { return this; }
    };
    X x;
    bool same = x.address() == &x;
    ```

    **Источник:** [Cppreference: this pointer](https://en.cppreference.com/w/cpp/language/this)

53. Можно ли обращаться к полям объекта без `this->` внутри метода?

    **Ответ:** Да, нестатические поля обычно неявно ищутся через текущий объект.

    **Пример:**

    ```cpp
    struct Counter {
        int n = 0;
        void increment() { ++n; }
    }; // то же, что ++this->n
    ```

    **Источник:** [Cppreference: this pointer](https://en.cppreference.com/w/cpp/language/this)

54. Когда `this->` действительно нужен?

    **Ответ:** Например, при совпадении имени параметра с полем, а также при обращении из шаблонного производного класса к члену зависимой базы. В последнем случае `this->` делает обращение зависимым и откладывает поиск.

    **Пример:**

    ```cpp
    struct Box {
        int value;
        explicit Box(int value) { this->value = value; }
    };
    ```

    **Источник:** [Cppreference: dependent name](https://en.cppreference.com/w/cpp/language/dependent_name)

55. Что такое константный метод класса?

    **Ответ:** Это нестатический метод с квалификатором `const`: через `this` нельзя изменять обычные поля объекта. `mutable`-поля и внешние объекты могут меняться, поэтому `const` не означает полную чистоту функции.

    **Пример:**

    ```cpp
    struct Box {
        int value = 0;
        int get() const { return value; }
    };
    ```

    **Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

56. Как объявить `const`-метод?

    **Ответ:** Добавьте `const` после списка параметров: `int size() const;`.

    **Пример:**

    ```cpp
    struct Box {
        int value = 0;
        int get() const { return value; }
    };
    ```

    **Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

57. Что можно делать внутри `const`-метода?

    **Ответ:** Читать поля, вызывать доступные const-методы и изменять mutable-поля либо другие объекты, если их типы и время жизни это допускают. Константность указателя-члена не делает автоматически константным объект по этому указателю.

    **Пример:**

    ```cpp
    struct Box {
        int value = 1;
        mutable int reads = 0;
        int get() const {
            ++reads;
            return value;
        }
    };
    ```

    **Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

58. Почему `const`-методы важны для интерфейса класса?

    **Ответ:** Они позволяют выполнять операции чтения через `const`-объекты и ссылки.

    **Пример:**

    ```cpp
    struct Box {
        int n = 1;
        int get() const { return n; }
    };
    int read(const Box &b) { return b.get(); }
    ```

    **Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

59. Что такое инициализация полей класса?

    **Ответ:** Это создание и начальная настройка полей до выполнения тела конструктора.

    **Пример:**

    ```cpp
    struct Box {
        int count = 0;
        std::string label{"new"};
    };
    ```

    **Источник:** [Cppreference: initialization](https://en.cppreference.com/w/cpp/language/initialization)

60. Чем инициализация полей в списке инициализации отличается от присваивания в теле конструктора?

    **Ответ:** Список сразу конструирует поле, а присваивание выполняется уже после его инициализации.

    **Пример:**

    ```cpp
    struct A {
        std::string name;
        explicit A(std::string s) : name(std::move(s)) {}
    };
    struct B {
        std::string name;
        explicit B(std::string s) { name = std::move(s); }
    }; // сначала пустая строка
    ```

    **Источник:** [Cppreference: initializer list](https://en.cppreference.com/w/cpp/language/initializer_list)

61. Что такое список инициализации конструктора?

    **Ответ:** Это часть после `:`, где инициализируются базовые классы и поля.

    **Пример:**

    ```cpp
    struct Point {
        int x, y;
        Point(int a, int b) : x(a), y(b) {}
    };
    ```

    **Источник:** [Cppreference: initializer list](https://en.cppreference.com/w/cpp/language/initializer_list)

62. Почему `const`-поля нужно инициализировать именно в списке инициализации?

    **Ответ:** Обычное const-поле должно получить значение при инициализации: присваивать ему в теле конструктора уже нельзя. Список инициализации — не единственный способ: допустим и инициализатор поля в объявлении, а для подходящих агрегатов — агрегатная инициализация.

    **Пример:**

    ```cpp
    struct Id {
        const int value;
        explicit Id(int n) : value(n) {}
    };
    struct FixedId {
        const int value = 42;
    }; // допустим и инициализатор поля
    ```

    **Источник:** [Cppreference: cv qualification](https://en.cppreference.com/w/cpp/language/cv)

63. Почему ссылки-члены нужно инициализировать в списке инициализации?

    **Ответ:** Ссылку нужно связать с объектом при инициализации; позднее присваивание изменяет объект по ссылке, а не саму привязку. Помимо списка конструктора возможны допустимый инициализатор поля и агрегатная инициализация; важно обеспечить время жизни объекта, на который она ссылается.

    **Пример:**

    ```cpp
    struct View {
        int &value;
        explicit View(int &x) : value(x) {}
    };
    int n = 1;
    View view{n};
    ```

    **Источник:** [Cppreference: reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

64. В каком порядке инициализируются поля класса?

    **Ответ:** В порядке объявления полей в классе, после базовых классов и до тела конструктора.

    **Пример:**

    ```cpp
    struct Pair {
        int first;
        int second;
        Pair() : first(1), second(first + 1) {}
    };
    ```

    **Источник:** [Cppreference: initializer list](https://en.cppreference.com/w/cpp/language/initializer_list)

65. Зависит ли порядок инициализации от порядка в списке инициализации?

    **Ответ:** Нет, порядок списка не меняет порядок, заданный объявлениями класса.

    **Пример:**

    ```cpp
    struct Pair {
        int first;
        int second;
        Pair() : second(2), first(1) {}
    }; // всё равно first, затем second
    ```

    **Источник:** [Cppreference: initializer list](https://en.cppreference.com/w/cpp/language/initializer_list)

66. Почему порядок объявления полей важнее порядка в конструкторе?

    **Ответ:** Именно порядок объявлений определяет реальные зависимости и порядок создания членов.

    **Пример:**

    ```cpp
    struct Text {
        std::string data;
        std::size_t size;
        Text() : data("abc"), size(data.size()) {}
    };
    ```

    **Источник:** [Cppreference: initializer list](https://en.cppreference.com/w/cpp/language/initializer_list)

67. Что такое статические члены класса?

    **Ответ:** Это поля и функции, не принадлежащие отдельному объекту. Статическое поле не входит в каждый экземпляр, а статическая функция не имеет `this`.

    **Пример:**

    ```cpp
    struct Config {
        inline static int limit = 10;
        static int get_limit() { return limit; }
    };
    ```

    **Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

68. Чем статическое поле отличается от обычного поля?

    **Ответ:** Нестатическое поле есть у каждого объекта, а статическое поле относится к классу. Обычно оно общее для всех экземпляров; у `thread_local static` отдельная сущность для каждого потока, а у разных специализаций шаблона — свои статические поля.

    **Пример:**

    ```cpp
    struct Item {
        int id = 0;
        inline static int total = 0;
    }; // id у каждого свой, total общий
    ```

    **Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

69. Что такое статический метод класса?

    **Ответ:** Это метод без неявного `this`, не зависящий от конкретного объекта.

    **Пример:**

    ```cpp
    struct Math {
        static int square(int x) { return x * x; }
    };
    int n = Math::square(3);
    ```

    **Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

70. Чем статический метод отличается от обычного?

    **Ответ:** Он не имеет `this` и напрямую работает только со статическими членами и аргументами.

    **Пример:**

    ```cpp
    struct X {
        int n = 1;
        static int read(const X &x) { return x.n; }
    }; // объект передан явно
    ```

    **Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

71. Может ли статический метод обращаться к нестатическим полям без объекта?

    **Ответ:** Нет, ему нужен явный объект или указатель на объект.

    **Пример:**

    ```cpp
    struct X {
        int n = 1;
        static int read(const X &x) { return x.n; }
    };
    ```

    **Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

72. Когда удобно использовать статические поля?

    **Ответ:** Для состояния, общего для всех объектов класса, например счётчика экземпляров.

    **Пример:**

    ```cpp
    struct Config {
        inline static int max_connections = 10;
    }; // синхронизация при совместной записи — отдельная задача
    ```

    **Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

73. Когда удобно использовать статические методы?

    **Ответ:** Для операций, связанных с классом, но не требующих состояния конкретного объекта.

    **Пример:**

    ```cpp
    struct Point {
        int x, y;
        static Point origin() { return {0, 0}; }
    };
    Point p = Point::origin();
    ```

    **Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

74. Что такое дружественная функция?

    **Ответ:** Это внешняя функция, которой класс предоставил доступ к private и protected членам.

    **Пример:**

    ```cpp
    class Box {
        int n = 1;
        friend int read(const Box &b) { return b.n; }
    };
    ```

    **Источник:** [Cppreference: friend](https://en.cppreference.com/w/cpp/language/friend)

75. Что даёт `friend`-функции доступ к приватным членам?

    **Ответ:** Она получает специальное разрешение обращаться к private и protected членам конкретного класса.

    **Пример:**

    ```cpp
    class Box {
        int n = 1;
        friend int read(const Box &);
    };
    int read(const Box &b) { return b.n; }
    ```

    **Источник:** [Cppreference: friend](https://en.cppreference.com/w/cpp/language/friend)

76. Когда `friend` оправдан?

    **Ответ:** Когда внешней функции или оператору нужен контролируемый доступ к внутреннему представлению класса.

    **Пример:**

    ```cpp
    class Id {
        int n = 0;
        friend bool operator==(const Id &, const Id &) = default;
    }; // C++20
    ```

    **Источник:** [Cppreference: friend](https://en.cppreference.com/w/cpp/language/friend)

77. Что такое дружественный класс?

    **Ответ:** Это класс, которому другой класс предоставил доступ к своим private и protected членам.

    **Пример:**

    ```cpp
    class Box {
        int value = 1;
        friend class Inspector;
    };
    struct Inspector {
        int read(const Box &b) const { return b.value; }
    };
    ```

    **Источник:** [Cppreference: friend](https://en.cppreference.com/w/cpp/language/friend)

78. Почему чрезмерное использование `friend` может ухудшать дизайн?

    **Ответ:** Оно расширяет связанность и ослабляет инкапсуляцию, связывая код с деталями реализации.

    **Пример:**

    ```cpp
    class Box {
        int value = 0;
        friend class Editor;
    };
    struct Editor {
        void reset(Box &b) { b.value = 0; }
    }; // Editor зависит от представления Box
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

79. Что такое композиция в ООП?

    **Ответ:** Композиция строит объект из других объектов, которыми он управляет или владеет.

    **Пример:**

    ```cpp
    struct Engine {};
    struct Car {
        Engine engine;
    }; // engine — часть Car
    ```

    **Источник:** [Cppreference: object](https://en.cppreference.com/w/cpp/language/object)

80. Что значит, что один объект содержит другой объект?

    **Ответ:** Один класс имеет поле или подобъект другого типа и определяет его роль в своём состоянии.

    **Пример:**

    ```cpp
    struct Address {
        std::string city;
    };
    struct User {
        Address address;
    };
    ```

    **Источник:** [Cppreference: data members](https://en.cppreference.com/w/cpp/language/data_members)

81. Чем композиция отличается от простого использования другого класса?

    **Ответ:** При композиции другой объект является частью состояния и обычно связан с lifetime владельца.

    **Пример:**

    ```cpp
    struct Engine {};
    struct Car {
        Engine engine;
    };                              // композиция
    void inspect(const Engine &) {} // только использование
    ```

    **Источник:** [Cppreference: data members](https://en.cppreference.com/w/cpp/language/data_members)

82. Что такое агрегация?

    **Ответ:** В ООП это отношение «целое — части», при котором части могут существовать независимо, например команда со ссылками на внешних игроков. Не следует путать его с термином «агрегат» в C++, описывающим категорию типов и правила инициализации.

    **Пример:**

    ```cpp
    struct Player {};
    struct Team {
        std::vector<Player *> members;
    }; // не владеет игроками
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

83. Чем композиция отличается от агрегации?

    **Ответ:** При композиции владелец отвечает за lifetime частей, а при агрегации части могут существовать отдельно.

    **Пример:**

    ```cpp
    struct Part {};
    struct Owner {
        Part part;
    }; // композиция
    struct Group {
        Part &part;
    }; // невладеющая связь
    ```

    **Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

84. Как время жизни объекта-владельца связано с композицией?

    **Ответ:** Непосредственные поля создаются до тела конструктора владельца и разрушаются после тела его деструктора. Владеемый через smart pointer объект можно заменить или освободить раньше; если владение сохранено, он освобождается при разрушении владельца.

    **Пример:**

    ```cpp
    struct Part {
        ~Part() { std::cout << "part destroyed"; }
    };
    struct Whole {
        Part part;
    };
    void example() { Whole w; } // уничтожается и w.part
    ```

    **Источник:** [Cppreference: object lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

85. Что такое отношение “has-a”?

    **Ответ:** Это отношение содержания: объект имеет другую сущность как часть своего состояния или зависимости.

    **Пример:**

    ```cpp
    struct Engine {};
    struct Car {
        Engine engine;
    }; // Car has an Engine
    ```

    **Источник:** [Cppreference: data members](https://en.cppreference.com/w/cpp/language/data_members)

86. Почему композицию часто предпочитают наследованию?

    **Ответ:** Она уменьшает связанность и позволяет заменять детали без расширения иерархии типов.

    **Пример:**

    ```cpp
    struct Logger {
        void log() const {}
    };
    struct Service {
        Logger logger;
        void run() { logger.log(); }
    }; // Service не является Logger
    ```

    **Источник:** [C++ Core Guidelines: object-oriented programming](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

87. Что такое наследование?

    **Ответ:** Это создание производного класса на основе одного или нескольких базовых классов.

    **Пример:**

    ```cpp
    struct Animal {};
    struct Dog : Animal {};
    ```

    **Источник:** [Cppreference: derived class](https://en.cppreference.com/w/cpp/language/derived_class)

88. Что означает отношение “is-a”?

    **Ответ:** Производный объект должен быть корректно используем там, где ожидается объект базового типа.

    **Пример:**

    ```cpp
    struct Animal {
        virtual void speak() const = 0;
        virtual ~Animal() = default;
    };
    struct Dog : Animal {
        void speak() const override {}
    };
    void listen(const Animal &a) { a.speak(); }
    ```

    **Источник:** [Cppreference: derived class](https://en.cppreference.com/w/cpp/language/derived_class)

89. Когда наследование уместно?

    **Ответ:** Когда есть устойчивое отношение подстановки и производный класс расширяет контракт базового.

    **Пример:**

    ```cpp
    struct Shape {
        virtual double area() const = 0;
        virtual ~Shape() = default;
    };
    struct Square : Shape {
        double side = 1;
        double area() const override { return side * side; }
    };
    ```

    **Источник:** [C++ Core Guidelines: object-oriented programming](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

90. Когда наследование неуместно?

    **Ответ:** Когда нужна только повторная реализация или связь означает “has-a”; тогда обычно лучше композиция.

    **Пример:**

    ```cpp
    struct Engine {};
    struct Car {
        Engine engine;
    }; // машина содержит двигатель, но не является двигателем
    ```

    **Источник:** [C++ Core Guidelines: object-oriented programming](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

91. Как объявить производный класс в C++?

    **Ответ:** Укажите базовый класс после двоеточия, например `class Dog : public Animal {};`.

    **Пример:**

    ```cpp
    class Animal {};
    class Dog : public Animal {};
    Dog dog;
    ```

    **Источник:** [Cppreference: derived class](https://en.cppreference.com/w/cpp/language/derived_class)

92. Что наследуется от базового класса?

    **Ответ:** Производный класс получает базовые подобъекты и доступные ему члены, но не становится копией исходного класса.

    **Пример:**

    ```cpp
    struct Animal {
        void eat() {}
    };
    struct Dog : Animal {};
    void example() {
        Dog dog;
        dog.eat();
    }
    ```

    **Источник:** [Cppreference: derived class](https://en.cppreference.com/w/cpp/language/derived_class)

93. Что не наследуется от базового класса буквально как член?

    **Ответ:** Деструктор и специальные операции производного класса не становятся простыми копиями соответствующих операций базы: они объявляются по собственным правилам. Конструкторы можно явно наследовать через `using Base::Base`; базовая часть всё равно создаётся и уничтожается как подобъект.

    **Пример:**

    ```cpp
    struct Base {
        explicit Base(int) {}
    };
    struct Derived : Base {
        using Base::Base;
    }; // явное наследование конструкторов
    Derived d{42};
    ```

    **Источник:** [Cppreference: derived class](https://en.cppreference.com/w/cpp/language/derived_class)

94. Что происходит с приватными членами базового класса в производном?

    **Ответ:** Они остаются частью базового подобъекта, но напрямую недоступны производному классу.

    **Пример:**

    ```cpp
    class Animal {
        int age = 1;

      public:
        int get_age() const { return age; }
    };
    struct Dog : Animal {
        int age() const { return get_age(); }
    }; // прямой доступ к полю запрещён
    ```

    **Источник:** [Cppreference: access](https://en.cppreference.com/w/cpp/language/access)

95. Как `public`-наследование влияет на интерфейс?

    **Ответ:** Public-члены базы остаются public, protected-члены — protected; преобразование к доступной однозначной базе разрешено внешнему коду. Поведенческую подстановку (LSP) сам спецификатор `public` не гарантирует.

    **Пример:**

    ```cpp
    struct Animal {
        void eat() {}
    };
    struct Dog : public Animal {};
    Dog dog;
    Animal &animal = dog;
    ```

    **Источник:** [Cppreference: derived class](https://en.cppreference.com/w/cpp/language/derived_class)

96. Чем `public`, `protected` и `private` наследование отличаются друг от друга?

    **Ответ:** При public-наследовании public/protected-члены сохраняют уровни доступа; при protected оба становятся protected, при private — private. Приватные члены базы напрямую не открываются. Меняется также доступность преобразования к базовому типу.

    **Пример:**

    ```cpp
    struct Base {
        void run() {}
    };
    struct Public : public Base {};
    struct Private : private Base {};
    Public p;
    Base &b = p;
    // Private q; Base& bad = q; // база недоступна снаружи
    ```

    **Источник:** [Cppreference: derived class](https://en.cppreference.com/w/cpp/language/derived_class)

97. Что такое базовый класс?

    **Ответ:** Это класс, чьи свойства и интерфейс используются при формировании производного класса.

    **Пример:**

    ```cpp
    struct Animal {};
    struct Dog : Animal {}; // Animal — база
    ```

    **Источник:** [Cppreference: derived class](https://en.cppreference.com/w/cpp/language/derived_class)

98. Что такое производный класс?

    **Ответ:** Это класс, который наследует один или несколько базовых классов и может расширять их поведение.

    **Пример:**

    ```cpp
    struct Animal {};
    struct Dog : Animal {
        void bark() {}
    };
    ```

    **Источник:** [Cppreference: derived class](https://en.cppreference.com/w/cpp/language/derived_class)

99. В каком порядке вызываются конструкторы базового и производного классов?

    **Ответ:** Сначала создаются виртуальные базы, затем непосредственные невиртуальные базы в порядке списка наследования, затем поля в порядке объявления и, наконец, выполняется тело конструктора производного класса.

    **Пример:**

    ```cpp
    struct Base {
        Base() { std::cout << "Base "; }
    };
    struct Derived : Base {
        Derived() { std::cout << "Derived"; }
    };
    Derived d; // Base Derived
    ```

    **Источник:** [Cppreference: initialization order](https://en.cppreference.com/w/cpp/language/initializer_list)

100. В каком порядке вызываются деструкторы базового и производного классов?

     **Ответ:** Сначала выполняется тело деструктора производного класса, затем разрушаются его поля в обратном порядке объявления, невиртуальные базы в обратном порядке построения и, для полного объекта, виртуальные базы.

     **Пример:**

     ```cpp
     struct Base {
         ~Base() { std::cout << "Base"; }
     };
     struct Derived : Base {
         ~Derived() { std::cout << "Derived "; }
     };
     void example() { Derived d; } // при выходе: Derived Base
     ```

     **Источник:** [Cppreference: destructor](https://en.cppreference.com/w/cpp/language/destructor)

## Средний уровень

101. Что такое полиморфизм в ООП?

     **Ответ:** Полиморфизм позволяет обращаться к объектам разных типов через общий интерфейс.

     **Пример:**

     ```cpp
     struct Shape {
         virtual int area() const = 0;
         virtual ~Shape() = default;
     };
     struct Square : Shape {
         int area() const override { return 4; }
     };
     int measure(const Shape &shape) { return shape.area(); }
     ```

     **Источник:** [Cppreference: virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

102. Какие виды полиморфизма обычно выделяют в C++?

     **Ответ:** Обычно выделяют статический полиморфизм времени компиляции и динамический полиморфизм через виртуальные функции.

     **Пример:**

     ```cpp
     template <class T> void draw_static(T &x) { x.draw(); }
     struct Shape {
         virtual void draw() = 0;
         virtual ~Shape() = default;
     };
     void draw_dynamic(Shape &x) { x.draw(); }
     ```

     **Источник:** [Cppreference: virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

103. Что такое статический полиморфизм?

     **Ответ:** Это выбор конкретной реализации на этапе компиляции через шаблоны, перегрузки или CRTP.

     **Пример:**

     ```cpp
     struct Icon {
         void draw() {}
     };
     template <class T> void draw(T &value) { value.draw(); }
     void example() {
         Icon icon;
         draw(icon);
     }
     ```

     **Источник:** [Cppreference: templates](https://en.cppreference.com/w/cpp/language/templates)

104. Что такое динамический полиморфизм?

     **Ответ:** Это выбор переопределённого виртуального метода во время выполнения по фактическому типу объекта.

     **Пример:**

     ```cpp
     struct Shape {
         virtual void draw() = 0;
         virtual ~Shape() = default;
     };
     struct Circle : Shape {
         void draw() override {}
     };
     void example() {
         auto p = std::make_unique<Circle>();
         Shape &shape = *p;
         shape.draw();
     }
     ```

     **Источник:** [Cppreference: virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

105. Чем перегрузка функций относится к полиморфизму?

     **Ответ:** Перегрузка позволяет одному имени обозначать разные реализации, выбранные по параметрам вызова.

     **Пример:**

     ```cpp
     void print(int) {}
     void print(const std::string &) {}
     void example() {
         print(1);
         print(std::string{"one"});
     }
     ```

     **Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

106. Что такое виртуальная функция?

     **Ответ:** Это функция-член, которую производный класс может переопределить для динамического вызова.

     **Пример:**

     ```cpp
     struct Shape {
         virtual void draw() const = 0;
         virtual ~Shape() = default;
     };
     ```

     **Источник:** [Cppreference: virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

107. Как объявить виртуальный метод?

     **Ответ:** Добавьте `virtual` в объявление метода базового класса.

     **Пример:**

     ```cpp
     struct Base {
         virtual void run() {}
         virtual ~Base() = default;
     };
     ```

     **Источник:** [Cppreference: virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

108. Что даёт ключевое слово `virtual`?

     **Ответ:** Оно разрешает переопределение метода и динамический выбор реализации через базовый интерфейс.

     **Пример:**

     ```cpp
     struct Base {
         virtual int run() { return 1; }
         virtual ~Base() = default;
     };
     struct Derived : Base {
         int run() override { return 2; }
     };
     Derived d;
     Base *p = &d;
     int n = p->run(); // 2
     ```

     **Источник:** [Cppreference: virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

109. Когда происходит позднее связывание вызова метода?

     **Ответ:** При виртуальном вызове конечный переопределитель определяется динамическим типом объекта; обычный пример — вызов через базовую ссылку. Явная квалификация `Base::run()` подавляет виртуальную диспетчеризацию. При конструировании и разрушении действуют ограничения текущего класса.

     **Пример:**

     ```cpp
     struct Base {
         virtual int run() { return 1; }
     };
     struct Derived : Base {
         int run() override { return 2; }
     };
     Derived d;
     Base &ref = d;
     int n = ref.run(); // 2
     ```

     **Источник:** [Cppreference: virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

110. Чем позднее связывание отличается от раннего?

     **Ответ:** Раннее связывание опирается на статические сведения, например при вызове невиртуальной функции. Виртуальный вызов выбирает конечный переопределитель по динамическому типу; оптимизатор может определить его заранее, не меняя семантику. Сам синтаксис через точку или стрелку этого различия не задаёт.

     **Пример:**

     ```cpp
     struct Base {
         int fixed() { return 1; }
         virtual int run() { return 1; }
     };
     struct Derived : Base {
         int fixed() { return 2; }
         int run() override { return 2; }
     };
     Derived d;
     Base &b = d;
     int a = b.fixed(); // 1: по статическому типу
     int c = b.run();   // 2: по динамическому типу
     ```

     **Источник:** [Cppreference: virtual functions](https://en.cppreference.com/w/cpp/language/virtual)

111. Почему для динамического полиморфизма нужен указатель или ссылка на базовый класс?

     **Ответ:** Ссылка или указатель позволяют обращаться к исходному объекту без копирования его базовой части. Это обычный способ получить динамическое поведение через базовый интерфейс, но виртуальный вызов допустим и через выражение объекта производного типа.

     **Пример:**

     ```cpp
     struct Base {
         virtual int f() const { return 1; }
     };
     struct Derived : Base {
         int f() const override { return 2; }
     };
     Derived d;
     Base &b = d;
     int n = b.f(); // 2
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

112. Что произойдёт, если вызвать переопределённый метод через объект по значению?

     **Ответ:** Если объект сохраняет производный тип, вызывается его переопределение. Если же производный объект скопирован в отдельный объект базового типа, возникает срезка, и вызов относится уже к базовому объекту.

     **Пример:**

     ```cpp
     struct Base {
         virtual int f() { return 1; }
     };
     struct Derived : Base {
         int f() override { return 2; }
     };
     Derived d;
     Base b = d;
     int a = d.f(); // 2
     int c = b.f(); // 1, b — самостоятельный Base
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

113. Что такое переопределение метода?

     **Ответ:** Это объявление в производном классе функции, соответствующей виртуальной функции базы по имени, параметрам и cv/ref-квалификаторам. Возвращаемый тип должен совпадать или быть допустимо ковариантным.

     **Пример:**

     ```cpp
     struct Base {
         virtual void run() const {}
     };
     struct Derived : Base {
         void run() const override {}
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

114. Чем переопределение отличается от перегрузки?

     **Ответ:** Переопределение меняет реализацию виртуальной операции в производном классе. Перегрузка задаёт несколько функций одного имени с разными параметрами; выбор перегрузки происходит по статическим типам.

     **Пример:**

     ```cpp
     struct Base {
         virtual void f(int) {}
     };
     struct Derived : Base {
         void f(int) override {}
         void f(double) {}
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

115. Что такое сокрытие метода базового класса?

     **Ответ:** Объявление имени в производном классе может скрыть одноимённые объявления базы при поиске, даже если параметры разные и переопределения нет.

     **Пример:**

     ```cpp
     struct Base {
         void f(int) {}
     };
     struct Derived : Base {
         void f() {}
     };
     // Derived{}.f(1); // Base::f скрыта
     ```

     **Источник:** [Рабочий проект стандарта C++: class.member.lookup](https://eel.is/c++draft/class.member.lookup)

116. Почему методы базового класса могут скрываться в производном?

     **Ответ:** Поиск имени и выбор перегрузки — разные этапы. Найдя имя в производном классе, поиск обычно не добавляет одноимённые функции из базы; их можно вернуть через `using`.

     **Пример:**

     ```cpp
     struct Base {
         void f(int) {}
     };
     struct Derived : Base {
         using Base::f;
         void f() {}
     };
     void example() {
         Derived d;
         d.f(1);
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: class.member.lookup](https://eel.is/c++draft/class.member.lookup)

117. Для чего нужен `override`?

     **Ответ:** `override` требует, чтобы функция действительно переопределяла виртуальную функцию базы. Несовпадение сигнатуры становится ошибкой компиляции; доступно с C++11.

     **Пример:**

     ```cpp
     struct Base {
         virtual void run() const {}
     };
     struct Derived : Base {
         void run() const override {}
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

118. Почему `override` полезен для безопасности кода?

     **Ответ:** Он обнаруживает случайное создание новой функции вместо переопределения, например из-за забытого `const`. Также помогает найти последствия изменения интерфейса базы.

     **Пример:**

     ```cpp
     struct Base {
         virtual void run() const {}
     };
     struct Derived : Base {
         // void run() override {} // ошибка: не совпадает const
         void run() const override {}
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

119. Что такое `final` для метода?

     **Ответ:** `final` у виртуальной функции запрещает её дальнейшее переопределение в производных классах. Сам класс при этом может оставаться открытым для наследования.

     **Пример:**

     ```cpp
     struct Base {
         virtual void run() {}
     };
     struct Derived : Base {
         void run() final {}
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

120. Что такое `final` для класса?

     **Ответ:** `final` после имени класса запрещает использовать этот класс как базовый. Виртуальные функции для этого не обязательны.

     **Пример:**

     ```cpp
     struct Token final {
         int value = 0;
     };
     // struct Special : Token {}; // ошибка
     ```

     **Источник:** [Рабочий проект стандарта C++: class.pre](https://eel.is/c++draft/class.pre)

121. Зачем запрещать дальнейшее переопределение?

     **Ответ:** Чтобы зафиксировать поведение, которое не должно меняться в дальнейших наследниках, и явно закрыть точку расширения. Это может помочь оптимизации, но не гарантирует ускорения.

     **Пример:**

     ```cpp
     struct Base {
         virtual int version() const { return 1; }
     };
     struct Stable : Base {
         int version() const final { return 2; }
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

122. Что такое чисто виртуальная функция?

     **Ответ:** Чисто виртуальная функция объявляется с `= 0` и делает класс абстрактным, если её конечный переопределитель остаётся чистым. У такой функции может существовать отдельное определение; чистый виртуальный деструктор всё равно требует определения.

     **Пример:**

     ```cpp
     struct Shape {
         virtual double area() const = 0;
         virtual ~Shape() = default;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.abstract](https://eel.is/c++draft/class.abstract)

123. Как объявить чисто виртуальную функцию?

     **Ответ:** В объявлении виртуальной функции после декларатора ставят `= 0`. Производный конкретный класс должен предоставить непустой в смысле абстрактности конечный переопределитель.

     **Пример:**

     ```cpp
     struct Task {
         virtual void run() = 0;
         virtual ~Task() = default;
     };
     struct Job : Task {
         void run() override {}
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.abstract](https://eel.is/c++draft/class.abstract)

124. Что такое абстрактный класс?

     **Ответ:** Это класс, у которого хотя бы одна виртуальная функция имеет чистый конечный переопределитель. Его нельзя создать как самостоятельный объект, но он может быть базовым подобъектом.

     **Пример:**

     ```cpp
     struct Base {
         virtual void run() = 0;
     };
     struct Derived : Base {
         void run() override {}
     };
     Derived d;
     Base &b = d;
     ```

     **Источник:** [Рабочий проект стандарта C++: class.abstract](https://eel.is/c++draft/class.abstract)

125. Можно ли создавать объекты абстрактного класса?

     **Ответ:** Самостоятельные объекты — нет. Ссылки и указатели на абстрактный тип допустимы и обычно указывают на конкретные производные объекты.

     **Пример:**

     ```cpp
     struct Shape {
         virtual void draw() = 0;
     };
     Shape *p = nullptr;
     // Shape s; // ошибка: абстрактный класс
     ```

     **Источник:** [Рабочий проект стандарта C++: class.abstract](https://eel.is/c++draft/class.abstract)

126. Для чего нужны абстрактные классы?

     **Ответ:** Для задания общего контракта, от которого зависят клиенты, и отделения этого контракта от конкретных реализаций. Абстрактная база также может содержать общую реализацию.

     **Пример:**

     ```cpp
     struct Writer {
         virtual void write(std::string_view) = 0;
         virtual ~Writer() = default;
     };
     void greet(Writer &w) { w.write("hello"); }
     ```

     **Источник:** [Рабочий проект стандарта C++: class.abstract](https://eel.is/c++draft/class.abstract)

127. Что такое интерфейсный класс в стиле C++?

     **Ответ:** Обычно это абстрактный класс с публичными чисто виртуальными операциями, без данных, и с виртуальным деструктором при полиморфном удалении. Отдельного ключевого слова `interface` в стандартном C++ нет.

     **Пример:**

     ```cpp
     struct Reader {
         virtual int read() = 0;
         virtual ~Reader() = default;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.abstract](https://eel.is/c++draft/class.abstract)

128. Чем абстрактный класс похож на интерфейс?

     **Ответ:** Он задаёт операции, которые должны поддерживать конкретные реализации, и допускает работу через базовый тип. Степень сходства зависит от возможностей интерфейсов сравниваемого языка.

     **Пример:**

     ```cpp
     struct Runnable {
         virtual void run() = 0;
         virtual ~Runnable() = default;
     };
     void execute(Runnable &x) { x.run(); }
     ```

     **Источник:** [Рабочий проект стандарта C++: class.abstract](https://eel.is/c++draft/class.abstract)

129. Чем абстрактный класс в C++ отличается от интерфейса в других языках?

     **Ответ:** В C++ абстрактный класс может иметь поля, конструкторы и обычные методы; он участвует в множественном наследовании. Сравнение с другими языками нужно уточнять: их интерфейсы тоже могут иметь реализацию по умолчанию.

     **Пример:**

     ```cpp
     struct Counter {
         int n = 0;
         void reset() { n = 0; }
         virtual void step() = 0;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.abstract](https://eel.is/c++draft/class.abstract)

130. Можно ли у абстрактного класса иметь поля и обычные методы?

     **Ответ:** Да. Абстрактность запрещает создавать самостоятельный объект класса, но не запрещает хранить состояние или предоставлять реализацию части операций.

     **Пример:**

     ```cpp
     struct Base {
         int count = 0;
         int value() const { return count; }
         virtual void run() = 0;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.abstract](https://eel.is/c++draft/class.abstract)

131. Что такое виртуальный деструктор?

     **Ответ:** Это деструктор с виртуальной диспетчеризацией, позволяющий корректно уничтожить производный объект через указатель на базу. У производного класса деструктор остаётся виртуальным автоматически.

     **Пример:**

     ```cpp
     struct Base {
         virtual ~Base() = default;
     };
     struct Derived : Base {
         std::vector<int> data;
     };
     std::unique_ptr<Base> p = std::make_unique<Derived>();
     ```

     **Источник:** [Рабочий проект стандарта C++: class.dtor](https://eel.is/c++draft/class.dtor)

132. Почему базовому классу с виртуальными методами обычно нужен виртуальный деструктор?

     **Ответ:** Если объект разрешено удалять через указатель на базу, её деструктор обычно должен быть публичным и виртуальным. Альтернатива для неполиморфного уничтожения — защищённый невиртуальный деструктор, запрещающий такое удаление клиентам.

     **Пример:**

     ```cpp
     struct Interface {
         virtual void run() = 0;
         virtual ~Interface() = default;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-dtor)

133. Что будет, если удалить производный объект через указатель на базовый класс без виртуального деструктора?

     **Ответ:** При обычном `delete` поведение неопределено: это не просто гарантированный пропуск деструктора наследника. Исключение в современных правилах связано со специальным destroying delete; в обычных интерфейсах полагаться на него не следует.

     **Пример:**

     ```cpp
     struct Base {
         ~Base() = default;
     };
     struct Derived : Base {
         std::string text;
     };
     // Base* p = new Derived; delete p; // неопределённое поведение
     ```

     **Источник:** [Рабочий проект стандарта C++: expr.delete](https://eel.is/c++draft/expr.delete)

134. Что такое upcasting?

     **Ответ:** Upcasting — преобразование указателя или ссылки от производного типа к базовому. Для доступной однозначной базы оно обычно неявное и не копирует объект.

     **Пример:**

     ```cpp
     struct Base {};
     struct Derived : Base {};
     Derived d;
     Base *p = &d;
     Base &b = d;
     ```

     **Источник:** [Рабочий проект стандарта C++: conv.ptr](https://eel.is/c++draft/conv.ptr)

135. Почему указатель на производный класс можно неявно привести к указателю на базовый?

     **Ответ:** Производный объект содержит базовый подобъект, поэтому преобразование может дать указатель на эту часть. База должна быть доступной и однозначной; её адрес может отличаться от адреса полного объекта.

     **Пример:**

     ```cpp
     struct Base {};
     struct Derived : public Base {};
     Derived d;
     Base *p = &d;
     ```

     **Источник:** [Рабочий проект стандарта C++: conv.ptr](https://eel.is/c++draft/conv.ptr)

136. Что такое downcasting?

     **Ответ:** Downcasting — переход от указателя или ссылки на базу к производному типу. `dynamic_cast` выполняет runtime-проверку подходящего полиморфного объекта, а `static_cast` требует внешнего доказательства корректности.

     **Пример:**

     ```cpp
     struct Base {
         virtual ~Base() = default;
     };
     struct Derived : Base {};
     Derived d;
     Base *b = &d;
     Derived *p = dynamic_cast<Derived *>(b);
     ```

     **Источник:** [Рабочий проект стандарта C++: expr.dynamic.cast](https://eel.is/c++draft/expr.dynamic.cast)

137. Почему downcasting опасен?

     **Ответ:** Фактический объект может не иметь ожидаемого производного типа. Непроверенное приведение с неверным предположением ведёт к неопределённому поведению; проверяемый cast возвращает неуспех.

     **Пример:**

     ```cpp
     struct Base {
         virtual ~Base() = default;
     };
     struct Derived : Base {};
     Base b;
     auto *p = dynamic_cast<Derived *>(&b); // nullptr
     ```

     **Источник:** [Рабочий проект стандарта C++: expr.dynamic.cast](https://eel.is/c++draft/expr.dynamic.cast)

138. Когда используют `dynamic_cast`?

     **Ответ:** Когда при работе с полиморфной иерархией нужно безопасно проверить производный тип или выполнить cross-cast между базовыми интерфейсами. Частые такие проверки могут указывать на нехватку операции в интерфейсе.

     **Пример:**

     ```cpp
     struct Base {
         virtual ~Base() = default;
     };
     struct Derived : Base {
         void extra() {}
     };
     void use(Base &b) {
         if (auto *d = dynamic_cast<Derived *>(&b))
             d->extra();
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: expr.dynamic.cast](https://eel.is/c++draft/expr.dynamic.cast)

139. Чем `dynamic_cast` для указателей отличается от `dynamic_cast` для ссылок?

     **Ответ:** При неудаче указательное приведение возвращает `nullptr`, а приведение к ссылке бросает `std::bad_cast`. Нулевой исходный указатель также даёт нулевой результат.

     **Пример:**

     ```cpp
     struct Base {
         virtual ~Base() = default;
     };
     struct Derived : Base {};
     void example() {
         Base b;
         auto *p = dynamic_cast<Derived *>(&b);
         try {
             (void)dynamic_cast<Derived &>(b);
         } catch (const std::bad_cast &) {
         }
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: expr.dynamic.cast](https://eel.is/c++draft/expr.dynamic.cast)

140. Что такое RTTI?

     **Ответ:** RTTI — информация о типах во время выполнения. В C++ с ней связаны `typeid` и проверяемые преобразования `dynamic_cast` в полиморфных иерархиях.

     **Пример:**

     ```cpp
     struct Base {
         virtual ~Base() = default;
     };
     struct Derived : Base {};
     Derived d;
     Base &b = d;
     bool is_derived = typeid(b) == typeid(Derived);
     ```

     **Источник:** [Рабочий проект стандарта C++: expr.typeid](https://eel.is/c++draft/expr.typeid)

141. Для чего нужен `typeid`?

     **Ответ:** `typeid` возвращает сведения `std::type_info` о типе. Для полиморфного glvalue учитывается динамический тип, в остальных обычных случаях — статический; формат `name()` не переносим.

     **Пример:**

     ```cpp
     struct Base {
         virtual ~Base() = default;
     };
     struct Derived : Base {};
     Derived d;
     Base &b = d;
     bool same = typeid(b) == typeid(Derived);
     ```

     **Источник:** [Рабочий проект стандарта C++: expr.typeid](https://eel.is/c++draft/expr.typeid)

142. Почему `dynamic_cast` работает только с полиморфными типами?

     **Ответ:** Утверждение верно только для runtime-проверяемых downcast/cross-cast: исходный тип должен быть полиморфным. `dynamic_cast` к доступной однозначной базе допустим и без виртуальных функций.

     **Пример:**

     ```cpp
     struct Base {};
     struct Derived : Base {};
     Derived d;
     Base *b = dynamic_cast<Base *>(&d); // допустимо без virtual
     ```

     **Источник:** [Рабочий проект стандарта C++: expr.dynamic.cast](https://eel.is/c++draft/expr.dynamic.cast)

143. Что такое срезка объекта (object slicing)?

     **Ответ:** Срезка возникает при копировании или перемещении производного объекта в отдельный объект базового типа: в результате остаётся только базовая часть.

     **Пример:**

     ```cpp
     struct Base {
         int x = 1;
     };
     struct Derived : Base {
         int y = 2;
     };
     Derived d;
     Base b = d; // b не содержит y
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.ctor](https://eel.is/c++draft/class.copy.ctor)

144. Когда возникает object slicing?

     **Ответ:** Типичные случаи — параметры по значению базового типа, возвращаемый базовый объект и контейнер базовых значений. Само преобразование ссылки или указателя срезку не выполняет.

     **Пример:**

     ```cpp
     struct Base {};
     struct Derived : Base {
         int extra = 1;
     };
     void consume(Base) {}
     void example() {
         Derived d;
         consume(d);
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.ctor](https://eel.is/c++draft/class.copy.ctor)

145. Почему передача производного объекта по значению в базовый тип опасна для полиморфизма?

     **Ответ:** Параметр становится отдельным базовым объектом и больше не представляет исходный производный объект. Поэтому его виртуальные вызовы не сохраняют поведение наследника.

     **Пример:**

     ```cpp
     struct Base {
         virtual int f() const { return 1; }
     };
     struct Derived : Base {
         int f() const override { return 2; }
     };
     int call(Base b) { return b.f(); } // call(Derived{}) возвращает 1
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

146. Как избежать object slicing?

     **Ответ:** Передавать полиморфные объекты по ссылке или указателю, хранить владеющие указатели и при необходимости использовать виртуальный `clone()`. Публичное копирование полиморфной базы часто запрещают.

     **Пример:**

     ```cpp
     struct Base {
         virtual void run() = 0;
         virtual ~Base() = default;
     };
     void execute(Base &b) { b.run(); }
     std::vector<std::unique_ptr<Base>> objects;
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#ES-slice)

147. Почему для полиморфизма чаще используют ссылки и указатели?

     **Ответ:** Они обращаются к существующему объекту, сохраняя его динамический тип, и не требуют копировать базовую часть. Отдельно нужно выбрать и явно выразить владение и допустимость `nullptr`.

     **Пример:**

     ```cpp
     struct Base {
         virtual void run() = 0;
         virtual ~Base() = default;
     };
     void execute(Base &object) { object.run(); }
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

148. Что такое виртуальная таблица на концептуальном уровне?

     **Ответ:** В типичной реализации vtable содержит адреса виртуальных функций и служебные сведения, а объект хранит указатель на соответствующую таблицу. Стандарт требует поведение виртуальных вызовов, но не именно такую структуру.

     **Пример:**

     ```cpp
     struct Base {
         virtual int f() { return 1; }
     };
     struct Derived : Base {
         int f() override { return 2; }
     };
     // Типичный ABI выбирает нужную реализацию через таблицу.
     ```

     **Источник:** [Itanium C++ ABI: virtual table layout](https://itanium-cxx-abi.github.io/cxx-abi/abi.html#vtable)

149. Обязан ли программист знать внутреннюю реализацию виртуальных вызовов?

     **Ответ:** Для правильного использования достаточно правил языка. Детали ABI нужны при анализе производительности, отладке, взаимодействии бинарных модулей и изменении публичных библиотечных классов.

     **Пример:**

     ```cpp
     struct Base {
         virtual void run() = 0;
         virtual ~Base() = default;
     };
     void execute(Base &b) { b.run(); } // код не зависит от устройства vtable
     ```

     **Источник:** [Itanium C++ ABI: virtual table layout](https://itanium-cxx-abi.github.io/cxx-abi/abi.html#vtable)

150. Как виртуальные функции влияют на производительность и память?

     **Ответ:** Типичная реализация добавляет объекту служебные указатели и использует косвенные вызовы, что может мешать инлайнингу. Компилятор способен девиртуализировать вызов; размер и скорость зависят от ABI и конкретного кода.

     **Пример:**

     ```cpp
     struct Plain {
         int n;
     };
     struct Poly {
         int n;
         virtual void run() {}
     };
     // Сравнение sizeof(Plain) и sizeof(Poly) характеризует только текущую реализацию.
     ```

     **Источник:** [Itanium C++ ABI: virtual table layout](https://itanium-cxx-abi.github.io/cxx-abi/abi.html#vtable)

## Выше среднего уровня

151. Что такое правило трёх?

     **Ответ:** Если классу нужен собственный деструктор, копирующий конструктор или копирующее присваивание для управления ресурсом, обычно нужно продумать все три. Это рекомендация дизайна, а не требование объявлять их в каждом классе.

     **Пример:**

     ```cpp
     struct Owner {
         Owner() = default;
         ~Owner();
         Owner(const Owner &);
         Owner &operator=(const Owner &);
     }; // объявления: семантика владения должна быть согласованной
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-five)

152. В каких случаях класс должен определять собственные копирующие операции и деструктор?

     **Ответ:** Когда автоматическое почленное копирование не соответствует владению: например, класс сам освобождает уникальный сырой ресурс. Нужно реализовать корректную копию либо запретить копирование; RAII-члены часто устраняют эту необходимость.

     **Пример:**

     ```cpp
     struct File {
         explicit File(std::FILE *f) : handle(f) {}
         ~File() {
             if (handle)
                 std::fclose(handle);
         }
         File(const File &) = delete;
         File &operator=(const File &) = delete;

       private:
         std::FILE *handle;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-dtor-release)

153. Что такое копирующий конструктор?

     **Ответ:** Это конструктор, создающий объект из другого объекта того же класса, обычно с параметром `const T&`. Сгенерированный вариант копирует базы и нестатические поля по их правилам.

     **Пример:**

     ```cpp
     struct User {
         std::string name;
         User(const User &) = default;
         explicit User(std::string n) : name(std::move(n)) {}
     };
     User a{"Anna"};
     User b = a;
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.ctor](https://eel.is/c++draft/class.copy.ctor)

154. Когда вызывается копирующий конструктор?

     **Ответ:** При инициализации из подходящего объекта, передаче по значению и некоторых возвратах. Вызов может быть устранён правилами copy elision; некоторые случаи C++17 вообще не требуют копирования.

     **Пример:**

     ```cpp
     struct X {
         X() = default;
         X(const X &) { std::cout << "copy"; }
     };
     void example() {
         X a;
         X b = a;
     } // копирующий конструктор
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.ctor](https://eel.is/c++draft/class.copy.ctor)

155. Что такое оператор копирующего присваивания?

     **Ответ:** Это специальная функция `operator=`, присваивающая состояние уже существующему объекту из другого объекта того же класса. Обычно возвращает `T&` для цепочек присваиваний.

     **Пример:**

     ```cpp
     struct X {
         std::string text;
         X &operator=(const X &) = default;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.assign](https://eel.is/c++draft/class.copy.assign)

156. Когда вызывается оператор присваивания?

     **Ответ:** Когда левый операнд уже существует и выполняется присваивание. Для rvalue может быть выбран перемещающий оператор; запись `T b = a` при объявлении является инициализацией.

     **Пример:**

     ```cpp
     struct X {
         int n = 0;
     };
     void example() {
         X a{1}, b{2};
         b = a;
     } // копирующее присваивание
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.assign](https://eel.is/c++draft/class.copy.assign)

157. Чем инициализация объекта отличается от присваивания уже существующему объекту?

     **Ответ:** Инициализация создаёт объект и его подобъекты, а присваивание изменяет существующее состояние, учитывая ранее принадлежащие объекту ресурсы.

     **Пример:**

     ```cpp
     std::string a = "first";
     void example() {
         std::string b = a;
         b = "second";
     } // создание, затем присваивание
     ```

     **Источник:** [Рабочий проект стандарта C++: dcl.init](https://eel.is/c++draft/dcl.init)

158. Почему класс с сырым ресурсом часто не может полагаться на сгенерированные операции копирования?

     **Ответ:** Сгенерированная копия сырого указателя копирует адрес, а не ресурс. Если обе копии считают себя владельцами, они попытаются освободить один ресурс дважды.

     **Пример:**

     ```cpp
     struct BadOwner {
         int *p = new int(1);
         ~BadOwner() { delete p; }
     };
     // BadOwner a; BadOwner b = a; // обе копии владеют одним адресом
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.ctor](https://eel.is/c++draft/class.copy.ctor)

159. Что такое глубокое копирование?

     **Ответ:** Это создание независимой копии принадлежащих объекту данных, а не только адреса. Глубину копирования определяет контракт: разделяемые внешние зависимости не обязательно дублировать.

     **Пример:**

     ```cpp
     struct Data {
         std::vector<int> values;
     };
     Data a{{1, 2}}, b = a; // элементы vector скопированы в отдельное хранилище
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.ctor](https://eel.is/c++draft/class.copy.ctor)

160. Что такое поверхностное копирование?

     **Ответ:** Это копирование непосредственных полей, например указателей, с сохранением ссылок на те же внешние объекты. Для невладеющих представлений такая семантика может быть правильной.

     **Пример:**

     ```cpp
     int n = 1;
     struct View {
         int *p;
     };
     View a{&n}, b = a; // a.p и b.p указывают на n
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.ctor](https://eel.is/c++draft/class.copy.ctor)

161. Почему поверхностное копирование часто приводит к ошибкам?

     **Ответ:** Если владеющий класс копирует только адрес, появляются двойное освобождение, висячие указатели или непредвиденное совместное изменение данных. Для явного совместного владения существуют другие контракты, например `shared_ptr`.

     **Пример:**

     ```cpp
     struct BadOwner {
         int *p = new int(1);
         ~BadOwner() { delete p; }
     };
     // Копирование BadOwner не создаёт новый int.
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-copy-semantic)

162. Что такое правило пяти?

     **Ответ:** К трём операциям управления ресурсом добавляются перемещающий конструктор и перемещающее присваивание. Если одну из пяти операций определяют или удаляют вручную, нужно осознанно определить судьбу остальных.

     **Пример:**

     ```cpp
     struct Owner {
         Owner() = default;
         ~Owner() = default;
         Owner(const Owner &) = delete;
         Owner &operator=(const Owner &) = delete;
         Owner(Owner &&) noexcept = default;
         Owner &operator=(Owner &&) noexcept = default;
         std::unique_ptr<int> p;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-five)

163. Почему с появлением move semantics правило трёх расширилось до правила пяти?

     **Ответ:** Перемещение позволяет передавать ресурсы без копирования. Кроме того, пользовательские объявления копирующих операций или деструктора влияют на автоматическое объявление move-операций, поэтому их нужно рассматривать вместе.

     **Пример:**

     ```cpp
     struct X {
         std::unique_ptr<int> p;
         ~X() = default; // подавляет неявное объявление move-конструктора
         X() = default;
         X(X &&) noexcept = default;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.ctor](https://eel.is/c++draft/class.copy.ctor)

164. Что такое перемещающий конструктор?

     **Ответ:** Это конструктор, обычно принимающий `T&&` и создающий объект с передачей ресурсов источника. Источник должен остаться в состоянии, соответствующем контракту класса.

     **Пример:**

     ```cpp
     struct Buffer {
         std::vector<int> data;
         Buffer() = default;
         Buffer(Buffer &&) noexcept = default;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.ctor](https://eel.is/c++draft/class.copy.ctor)

165. Что такое оператор перемещающего присваивания?

     **Ответ:** Это оператор `operator=(T&&)`, передающий состояние в уже существующий объект. Он должен корректно обработать прежние ресурсы получателя и состояние источника.

     **Пример:**

     ```cpp
     struct Buffer {
         std::vector<int> data;
         Buffer &operator=(Buffer &&) noexcept = default;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.copy.assign](https://eel.is/c++draft/class.copy.assign)

166. Когда перемещение эффективнее копирования?

     **Ответ:** Когда ресурс можно передать сменой указателей или дескрипторов вместо копирования содержимого. Для маленьких значений либо встроенных массивов перемещение может стоить столько же, сколько копирование.

     **Пример:**

     ```cpp
     std::vector<int> a(1000, 7);
     std::vector<int> b = std::move(a); // передача хранилища обычного vector
     ```

     **Источник:** [Рабочий проект стандарта C++: vector.cons](https://eel.is/c++draft/vector.cons)

167. Что такое правило нуля?

     **Ответ:** Класс делегирует владение готовым RAII-типам и не определяет вручную деструктор, копирование и перемещение. Сгенерированные операции получают подходящую семантику от членов.

     **Пример:**

     ```cpp
     struct User {
         std::string name;
         std::vector<int> scores;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-zero)

168. Почему правило нуля считается предпочтительным в современном C++?

     **Ответ:** Оно уменьшает объём специального кода и вероятность ошибок копирования, освобождения и исключительной безопасности. Изменение состава полей автоматически учитывается сгенерированными операциями.

     **Пример:**

     ```cpp
     struct Document {
         std::string title;
         std::vector<std::string> lines;
     };
     Document a, b = a;
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-zero)

169. Как RAII связано с ООП?

     **Ответ:** RAII связывает владение ресурсом со временем жизни объекта: приобретение оформляется при создании, освобождение — при разрушении. Классы делают эту связь автоматической и пригодной для исключений.

     **Пример:**

     ```cpp
     void example(std::mutex &mutex) {
         std::lock_guard<std::mutex> lock(mutex);
     } // unlock при выходе
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii)

170. Почему класс часто выступает владельцем ресурса?

     **Ответ:** Класс объединяет ресурс, правила его использования и освобождения в одном контракте. Клиенту не приходится вручную согласовывать каждую ветвь завершения с очисткой.

     **Пример:**

     ```cpp
     struct Image {
         std::vector<std::byte> pixels;
     }; // vector управляет выделенной памятью
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii)

171. Какие ресурсы, кроме памяти, может инкапсулировать класс?

     **Ответ:** Файлы, сокеты, блокировки, потоки, транзакции и системные дескрипторы. Конкретное завершающее действие зависит от ресурса: закрыть, разблокировать, присоединить поток или откатить транзакцию.

     **Пример:**

     ```cpp
     void example() {
         std::ifstream input("data.txt");
     } // файловый ресурс закрывается автоматически
     ```

     **Источник:** [Рабочий проект стандарта C++: filebuf.members](https://eel.is/c++draft/filebuf.members)

172. Почему деструктор подходит для освобождения ресурса?

     **Ответ:** При нормальном выходе из области и раскрутке стека уничтожаются полностью созданные автоматические объекты. Поэтому деструктор обеспечивает очистку; при аварийном завершении программы такие вызовы не гарантируются.

     **Пример:**

     ```cpp
     struct Trace {
         ~Trace() { std::cout << "cleanup"; }
     };
     void example() {
         Trace t;
         throw std::runtime_error("failure");
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: except.ctor](https://eel.is/c++draft/except.ctor)

173. Что такое инвариант класса?

     **Ответ:** Инвариант — условие корректности состояния, которое класс поддерживает на границах публичных операций. Внутри операции допустимы временные изменения, если некорректное состояние не становится наблюдаемым.

     **Пример:**

     ```cpp
     class Range {
         int low, high;

       public:
         Range(int a, int b) : low(a), high(b) {
             if (a > b)
                 throw std::invalid_argument("range");
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-struct)

174. Почему конструктор должен устанавливать корректный инвариант объекта?

     **Ответ:** После успешного создания клиент должен иметь право пользоваться объектом согласно контракту. Если корректное состояние установить нельзя, конструктор может бросить исключение: завершённый объект тогда не появляется.

     **Пример:**

     ```cpp
     class Positive {
         int n;

       public:
         explicit Positive(int x) : n(x) {
             if (x <= 0)
                 throw std::invalid_argument("positive required");
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-ctor)

175. Что значит “объект всегда должен оставаться валидным”?

     **Ответ:** Объект должен сохранять инварианты и оставаться пригодным для предусмотренных операций, в том числе после ошибок. Это не означает неизменность состояния и не отменяет предусловия отдельных методов.

     **Пример:**

     ```cpp
     std::vector<int> values;
     // Пустой vector валиден; values.front() всё равно требует непустого контейнера.
     ```

     **Источник:** [Рабочий проект стандарта C++: defns.valid](https://eel.is/c++draft/defns.valid)

176. Как инкапсуляция помогает сохранять инварианты?

     **Ответ:** Скрытое представление вынуждает менять состояние через операции, проверяющие связанные условия. Одного `private` недостаточно: сами методы тоже должны соблюдать контракт.

     **Пример:**

     ```cpp
     class Range {
         int low = 0, high = 0;

       public:
         void set(int a, int b) {
             if (a > b)
                 throw std::invalid_argument("range");
             low = a;
             high = b;
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-private)

177. Что такое исключительная безопасность методов класса?

     **Ответ:** Это гарантии о состоянии объектов и ресурсов, если метод завершился исключением. Они должны быть частью контракта, особенно для операций, меняющих несколько связанных полей.

     **Пример:**

     ```cpp
     class Names {
         std::vector<std::string> data;

       public:
         void replace(std::vector<std::string> next) { data.swap(next); }
     }; // подготовка аргумента до изменения data
     ```

     **Источник:** [Boost: Exception Safety](https://www.boost.org/doc/user-guide/exception-safety.html)

178. Какие базовые уровни гарантий исключительной безопасности бывают?

     **Ответ:** Обычно выделяют отсутствие гарантий, базовую гарантию (нет утечек, инварианты сохранены), сильную (при неудаче нет наблюдаемого изменения) и гарантию отсутствия исключений. `noexcept` запрещает выход исключения, но само по себе не доказывает успешность операции.

     **Пример:**

     ```cpp
     void reset(std::vector<int> &data) noexcept {
         data.clear();
     } // для int очистка не бросает
     ```

     **Источник:** [Boost: Exception Safety](https://www.boost.org/doc/user-guide/exception-safety.html)

179. Почему методы, изменяющие состояние, особенно важны с точки зрения strong guarantee?

     **Ответ:** Частичное обновление нескольких полей может оставить неожиданное состояние. Сильная гарантия позволяет трактовать операцию как «всё или ничего»; обычно сначала готовят новое состояние, затем фиксируют его небросающим действием.

     **Пример:**

     ```cpp
     struct Data {
         std::vector<int> values;
         void replace(const std::vector<int> &source) {
             auto next = source;
             values.swap(next);
         }
     };
     ```

     **Источник:** [Boost: Exception Safety](https://www.boost.org/doc/user-guide/exception-safety.html)

180. Что такое `noexcept` для методов перемещения и почему это важно?

     **Ответ:** `noexcept` сообщает, что исключение не должно выйти из операции: иначе вызывается `std::terminate`. Небросающее перемещение помогает контейнерам безопасно переносить элементы; объявлять его следует только при соблюдении этого контракта.

     **Пример:**

     ```cpp
     struct Item {
         std::unique_ptr<int> p;
         Item(Item &&) noexcept = default;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: except.spec](https://eel.is/c++draft/except.spec)

181. Как `std::vector` использует `noexcept` у move-конструктора элементов?

     **Ответ:** При перераспределении памяти `vector` обычно перемещает элементы, если move-конструктор небросающий, а иначе копирует, когда копирование доступно, чтобы сохранить сильную гарантию. Для некопируемого типа с бросающим move некоторые гарантии ослаблены.

     **Пример:**

     ```cpp
     struct Item {
         Item() = default;
         Item(const Item &) = default;
         Item(Item &&) noexcept = default;
     };
     std::vector<Item> items(2); // небросающий move подходит для переноса
     ```

     **Источник:** [Рабочий проект стандарта C++: vector.modifiers](https://eel.is/c++draft/vector.modifiers)

182. Что такое идиома copy-and-swap?

     **Ответ:** Copy-and-swap сначала создаёт копию нового состояния, затем обменивает её с текущим объектом. Старое состояние освобождается при разрушении временного; небросающий swap обеспечивает сильную гарантию.

     **Пример:**

     ```cpp
     struct Text {
         std::string value;
         Text &operator=(Text other) {
             value.swap(other.value);
             return *this;
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-swap)

183. Когда copy-and-swap полезна для оператора присваивания?

     **Ответ:** Когда обычное почленное присваивание не даёт нужной гарантии, а полную копию и небросающий обмен реализовать просто. Цена — возможная лишняя аллокация и потеря переиспользования существующего буфера.

     **Пример:**

     ```cpp
     struct Data {
         std::vector<int> values;
         Data &operator=(const Data &other) {
             auto next = other.values;
             values.swap(next);
             return *this;
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-copy-assignment)

184. Что такое self-assignment и почему его учитывают?

     **Ответ:** Self-assignment — присваивание объекта самому себе. Реализация не должна уничтожить данные до их чтения; проверка адреса — один из способов, но корректные RAII-члены часто справляются без неё.

     **Пример:**

     ```cpp
     struct X {
         std::vector<int> data;
         X &operator=(const X &) = default;
     };
     void example() {
         X x;
         X &alias = x;
         x = alias;
     }
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-copy-self)

185. Что такое self-move и почему это сложнее?

     **Ответ:** Это присваивание из `std::move` того же объекта. Раннее освобождение ресурсов может уничтожить источник; контракт обычно требует хотя бы валидного состояния, но не обязательно сохранения прежнего значения.

     **Пример:**

     ```cpp
     struct X {
         std::vector<int> data;
         X &operator=(X &&other) noexcept {
             if (this != &other)
                 data = std::move(other.data);
             return *this;
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-move-self)

186. Что такое объект в “валидном, но не определённом логически” состоянии после перемещения?

     **Ответ:** Обычно имеется в виду «валидное, но неуточнённое состояние»: инварианты соблюдены, но конкретное значение не обещано. Стандартная библиотека задаёт такую гарантию для большинства moved-from объектов; пользовательские классы должны документировать свою.

     **Пример:**

     ```cpp
     std::string source = "hello";
     std::string target = std::move(source);
     void example() { source.clear(); } // допустимо независимо от оставшегося значения
     ```

     **Источник:** [Рабочий проект стандарта C++: lib.types.movedfrom](https://eel.is/c++draft/lib.types.movedfrom)

187. Почему moved-from объект должен оставаться корректно разрушаемым?

     **Ответ:** Время жизни источника не заканчивается при перемещении, поэтому его деструктор всё равно будет вызван. Источник не должен повторно освобождать переданные ресурсы.

     **Пример:**

     ```cpp
     auto source = std::make_unique<int>(7);
     auto target = std::move(source); // source == nullptr, его уничтожение безопасно
     ```

     **Источник:** [Рабочий проект стандарта C++: unique.ptr.single.ctor](https://eel.is/c++draft/unique.ptr.single.ctor)

188. Когда стоит явно удалять операции копирования через `= delete`?

     **Ответ:** Когда копирование не имеет смысла или нарушает уникальность владения: например, у блокировки или уникального дескриптора. Явный `= delete` делает запрет частью интерфейса и улучшает диагностику.

     **Пример:**

     ```cpp
     struct Session {
         Session() = default;
         Session(const Session &) = delete;
         Session &operator=(const Session &) = delete;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: dcl.fct.def.delete](https://eel.is/c++draft/dcl.fct.def.delete)

189. Когда стоит явно разрешать операции по умолчанию через `= default`?

     **Ответ:** Когда нужно явно зафиксировать стандартную семантику или вернуть автоматически не объявленную операцию. `= default` не гарантирует доступность: операция может оказаться удалённой из-за членов класса.

     **Пример:**

     ```cpp
     struct Base {
         virtual ~Base() = default;
     };
     struct X {
         X() = default;
         X(const X &) = default;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: dcl.fct.def.default](https://eel.is/c++draft/dcl.fct.def.default)

190. Что означает, что класс является move-only?

     **Ответ:** Это тип, который можно перемещать, но нельзя копировать. Обычно он выражает исключительное владение передаваемым ресурсом.

     **Пример:**

     ```cpp
     struct Owner {
         std::unique_ptr<int> p;
     };
     static_assert(!std::is_copy_constructible_v<Owner>);
     static_assert(std::is_move_constructible_v<Owner>);
     ```

     **Источник:** [Рабочий проект стандарта C++: unique.ptr](https://eel.is/c++draft/unique.ptr)

191. Почему `std::unique_ptr` — хороший пример move-only типа?

     **Ответ:** `unique_ptr` имеет одного владельца ресурса, запрещает копирование и передаёт владение при перемещении. Перемещённый источник становится пустым.

     **Пример:**

     ```cpp
     auto a = std::make_unique<int>(42);
     auto b = std::move(a); // a == nullptr, b владеет int
     ```

     **Источник:** [Рабочий проект стандарта C++: unique.ptr](https://eel.is/c++draft/unique.ptr)

192. Что такое value type в проектировании классов?

     **Ответ:** Value type представляет значение, а не уникальную сущность: копирование даёт независимое логически равное значение, равенство обычно сравнивает содержимое. Детали физического хранения могут отличаться.

     **Пример:**

     ```cpp
     struct Point {
         int x, y;
         bool operator==(const Point &) const = default;
     };
     Point a{1, 2}, b = a;
     bool equal = a == b;
     ```

     **Источник:** [Martin Fowler: Value Object](https://martinfowler.com/bliki/ValueObject.html)

193. Что такое entity/object с идентичностью в предметной области?

     **Ответ:** Сущность сохраняет идентичность при изменении атрибутов. Например, пользователь остаётся тем же пользователем после смены имени; идентичность часто представлена устойчивым ID, а не адресом памяти.

     **Пример:**

     ```cpp
     struct User {
         int id;
         std::string name;
     };
     User u{7, "Anna"}; // смена name не должна менять id
     ```

     **Источник:** [Martin Fowler: Value Object](https://martinfowler.com/bliki/ValueObject.html)

194. Чем объект-значение отличается от объекта-сущности в проектировании?

     **Ответ:** Объекты-значения взаимозаменяемы при равном содержимом. Сущности различаются идентичностью, даже когда остальные атрибуты совпадают; это решение предметной модели, а не автоматическое свойство C++-класса.

     **Пример:**

     ```cpp
     struct User {
         int id;
         std::string name;
     };
     User a{1, "Alex"}, b{2, "Alex"}; // разные сущности
     ```

     **Источник:** [Martin Fowler: Value Object](https://martinfowler.com/bliki/ValueObject.html)

195. Когда сравнение объектов должно быть по значению, а когда по идентичности?

     **Ответ:** По значению сравнивают величины вроде координат и дат; по идентичности — сущности, чьи атрибуты могут меняться. Контракт `==` должен явно отражать выбранный смысл; при необходимости лучше отдельные именованные проверки.

     **Пример:**

     ```cpp
     struct User {
         int id;
         std::string name;
     };
     bool same_entity(const User &a, const User &b) { return a.id == b.id; }
     ```

     **Источник:** [Martin Fowler: Value Object](https://martinfowler.com/bliki/ValueObject.html)

196. Что такое оператор `==` как часть интерфейса класса?

     **Ответ:** Оператор равенства определяет, когда два объекта считаются равными для клиента. Для обычного равенства ожидаются рефлексивность, симметричность и транзитивность; defaulted `==` C++20 сравнивает базы и поля.

     **Пример:**

     ```cpp
     struct Point {
         int x, y;
         bool operator==(const Point &) const = default;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.eq](https://eel.is/c++draft/class.eq)

197. Какие операторы часто перегружают в пользовательских классах?

     **Ответ:** Сравнение, присваивание, арифметику, индексирование, вызов, разыменование и потоковый вывод — если они естественны для типа. Не каждый класс должен предоставлять все операции.

     **Пример:**

     ```cpp
     struct Vector2 {
         int x, y;
         friend Vector2 operator+(Vector2 a, Vector2 b) { return {a.x + b.x, a.y + b.y}; }
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: over.oper](https://eel.is/c++draft/over.oper)

198. Когда перегрузка операторов улучшает интерфейс, а когда только путает?

     **Ответ:** Когда обычная запись передаёт привычный смысл операции: сложение величин или доступ к элементу. Неожиданные побочные эффекты и несвязанные действия под привычным символом ухудшают интерфейс.

     **Пример:**

     ```cpp
     struct Seconds {
         int value;
         friend Seconds operator+(Seconds a, Seconds b) { return {a.value + b.value}; }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ro-conventional)

199. Почему перегрузка должна сохранять естественную семантику оператора?

     **Ответ:** Клиенты и generic-алгоритмы опираются на привычные отношения между операциями. Например, равенство не должно неожиданно менять сравниваемые объекты; согласованность — часть контракта.

     **Пример:**

     ```cpp
     struct Id {
         int value;
         bool operator==(const Id &) const = default;
     }; // сравнение не меняет value
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ro-conventional)

200. Что такое fluent interface и уместен ли он в C++-классах?

     **Ответ:** Fluent interface строит читаемые цепочки операций, часто возвращая `*this`. В C++ он уместен для конфигурации и builders, но нужно учитывать время жизни временных объектов и возможность частично настроенного состояния.

     **Пример:**

     ```cpp
     struct Options {
         int port = 80;
         Options &with_port(int p) {
             port = p;
             return *this;
         }
     };
     void example() {
         Options options;
         options.with_port(8080).with_port(9090);
     }
     ```

     **Источник:** [Martin Fowler: Fluent Interface](https://martinfowler.com/bliki/FluentInterface.html)

## Сложный уровень

201. Что такое множественное наследование?

     **Ответ:** Это наследование одного класса от нескольких непосредственных базовых классов. Каждый невиртуальный путь даёт собственный базовый подобъект.

     **Пример:**

     ```cpp
     struct Named {
         std::string name;
     };
     struct Identified {
         int id = 0;
     };
     struct Entity : Named, Identified {};
     ```

     **Источник:** [Рабочий проект стандарта C++: class.mi](https://eel.is/c++draft/class.mi)

202. Когда множественное наследование может быть полезно?

     **Ответ:** Когда объект реализует несколько независимых интерфейсов или объединяет небольшие ортогональные возможности. Особенно понятен случай баз без общего изменяемого состояния.

     **Пример:**

     ```cpp
     struct Readable {
         virtual int read() = 0;
         virtual ~Readable() = default;
     };
     struct Writable {
         virtual void write(int) = 0;
         virtual ~Writable() = default;
     };
     struct Memory : Readable, Writable {
         int n = 0;
         int read() override { return n; }
         void write(int x) override { n = x; }
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.mi](https://eel.is/c++draft/class.mi)

203. Какие проблемы создаёт множественное наследование?

     **Ответ:** Неоднозначность имён и преобразований, повторные базовые подобъекты, сложный порядок построения и более тесные зависимости. Виртуальное наследование решает часть проблем, но добавляет свои правила.

     **Пример:**

     ```cpp
     struct A {
         void run() {}
     };
     struct B {
         void run() {}
     };
     struct C : A, B {};
     void example() {
         C c;
         c.A::run(); /* c.run(); // неоднозначно */
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: class.mi](https://eel.is/c++draft/class.mi)

204. Что такое ромбовидное наследование?

     **Ответ:** Это схема, в которой две ветви наследования ведут к одной общей базе, а нижний класс наследует обе ветви. Без виртуального наследования в нём обычно две копии общей базы.

     **Пример:**

     ```cpp
     struct A {
         int n = 0;
     };
     struct B : A {};
     struct C : A {};
     struct D : B, C {}; // два подобъекта A
     ```

     **Источник:** [Рабочий проект стандарта C++: class.mi](https://eel.is/c++draft/class.mi)

205. Почему ромбовидное наследование создаёт неоднозначность?

     **Ответ:** Для обращения к члену общей базы или преобразования к ней нужно выбрать, по какой ветви идти. Если правило выбора не задано, преобразование или поиск может быть неоднозначным.

     **Пример:**

     ```cpp
     struct A {
         int n = 0;
     };
     struct B : A {};
     struct C : A {};
     struct D : B, C {};
     void example() {
         D d;
         d.B::n = 1; /* d.n = 1; // неоднозначно */
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: class.mi](https://eel.is/c++draft/class.mi)

206. Что такое виртуальное наследование?

     **Ответ:** База, указанная с `virtual` в списке наследования, представлена общим подобъектом для соответствующих виртуальных путей внутри самого производного объекта. Это отдельный механизм, не связанный с виртуальностью методов.

     **Пример:**

     ```cpp
     struct A {
         int n = 0;
     };
     struct B : virtual A {};
     struct C : virtual A {};
     struct D : B, C {};
     ```

     **Источник:** [Рабочий проект стандарта C++: class.mi](https://eel.is/c++draft/class.mi)

207. Как виртуальное наследование помогает решить проблему ромба?

     **Ответ:** Если обе ветви наследуют общую базу виртуально, нижний объект содержит один общий подобъект этой базы. Конфликты переопределений и другие неоднозначности при этом могут оставаться.

     **Пример:**

     ```cpp
     struct A {
         int n = 0;
     };
     struct B : virtual A {};
     struct C : virtual A {};
     struct D : B, C {};
     D d;
     A *a = &d; // путь к общему A однозначен
     ```

     **Источник:** [Рабочий проект стандарта C++: class.mi](https://eel.is/c++draft/class.mi)

208. Чем виртуальное наследование усложняет объектную модель?

     **Ответ:** Виртуальные базы инициализирует самый производный класс; меняются layout и способы вычисления смещений к базе. Реализация часто требует дополнительных служебных данных, но стандарт не задаёт конкретную схему.

     **Пример:**

     ```cpp
     struct A {
         explicit A(int) {}
     };
     struct B : virtual A {
         B() : A(1) {}
     };
     struct D : B {
         D() : A(2), B() {}
     }; // значение выбирает D
     ```

     **Источник:** [Рабочий проект стандарта C++: class.base.init](https://eel.is/c++draft/class.base.init)

209. Что такое pure interface class и почему его иногда безопаснее использовать при множественном наследовании?

     **Ответ:** Это база, задающая операции без состояния и существенной общей реализации. Несколько таких интерфейсов проще объединять, потому что меньше конфликтов владения и инвариантов; правила неоднозначности языка всё равно действуют.

     **Пример:**

     ```cpp
     struct Runnable {
         virtual void run() = 0;
         virtual ~Runnable() = default;
     };
     struct Named {
         virtual std::string_view name() const = 0;
         virtual ~Named() = default;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-abstract)

210. Что такое CRTP?

     **Ответ:** CRTP (Curiously Recurring Template Pattern) передаёт производный тип параметром шаблонной базы. База может вызывать его операции через статическое приведение при условии, что действительно является частью этого объекта.

     **Пример:**

     ```cpp
     template <class D> struct Base {
         void run() { static_cast<D &>(*this).impl(); }
     };
     struct Job : Base<Job> {
         void impl() {}
     };
     void example() {
         Job job;
         job.run();
     }
     ```

     **Источник:** [LLVM: InstVisitor, статический полиморфизм](https://llvm.org/doxygen/InstVisitor_8h_source.html)

211. Почему CRTP относят к статическому полиморфизму?

     **Ответ:** Тип реализации известен из аргумента шаблона, поэтому вызов производной операции разрешается статически. Виртуальная диспетчеризация для этого приёма не требуется.

     **Пример:**

     ```cpp
     template <class D> struct Base {
         int value() const { return static_cast<const D &>(*this).impl(); }
     };
     struct X : Base<X> {
         int impl() const { return 7; }
     };
     ```

     **Источник:** [LLVM: InstVisitor, статический полиморфизм](https://llvm.org/doxygen/InstVisitor_8h_source.html)

212. Чем CRTP отличается от виртуального полиморфизма?

     **Ответ:** CRTP связывает базу с конкретным типом при компиляции, а виртуальная база предоставляет общий runtime-интерфейс разным типам. `Base<A>` и `Base<B>` при CRTP — разные типы, не единая полиморфная база.

     **Пример:**

     ```cpp
     template <class D> struct Base {};
     struct A : Base<A> {};
     struct B : Base<B> {};
     static_assert(!std::is_same_v<Base<A>, Base<B>>);
     ```

     **Источник:** [Рабочий проект стандарта C++: temp.class](https://eel.is/c++draft/temp.class)

213. Когда статический полиморфизм выгоднее динамического?

     **Ответ:** Когда набор типов известен при компиляции, нужна специализация и важны возможности инлайнинга. Взамен возможны рост бинарного файла и времени сборки; выигрыш надо измерять.

     **Пример:**

     ```cpp
     template <class T> int value(const T &x) { return x.value(); }
     struct Item {
         int value() const { return 7; }
     };
     int n = value(Item{});
     ```

     **Источник:** [Рабочий проект стандарта C++: temp.inst](https://eel.is/c++draft/temp.inst)

214. Что такое шаблонный метод как паттерн проектирования?

     **Ответ:** Template Method — паттерн, где базовая реализация задаёт последовательность шагов, а наследники переопределяют отдельные шаги. Слово «шаблонный» здесь не означает использование C++ templates.

     **Пример:**

     ```cpp
     class Task {
       public:
         void run() {
             prepare();
             execute();
         }
         virtual ~Task() = default;

       protected:
         virtual void prepare() {}
         virtual void execute() = 0;
     };
     ```

     **Источник:** [Herb Sutter: Overriding Virtual Functions, NVI](https://herbsutter.com/2013/05/22/gotw-5-solution-overriding-virtual-functions/)

215. Как шаблонный метод связан с наследованием и виртуальными функциями?

     **Ответ:** Скелет алгоритма размещают в базе, изменяемые шаги делают виртуальными. Вызов базового алгоритма тогда сохраняет общий порядок, но выполняет выбранные наследником шаги.

     **Пример:**

     ```cpp
     class Task {
       public:
         void run() {
             step();
             step();
         }
         virtual ~Task() = default;

       protected:
         virtual void step() = 0;
     };
     struct Job : Task {
         void step() override {}
     };
     ```

     **Источник:** [Herb Sutter: Overriding Virtual Functions, NVI](https://herbsutter.com/2013/05/22/gotw-5-solution-overriding-virtual-functions/)

216. Что такое NVI-идиома (non-virtual interface)?

     **Ответ:** NVI предоставляет публичную невиртуальную операцию, которая выполняет общие проверки и вызывает непубличный виртуальный хук. Это отделяет контракт клиента от механизма настройки наследниками.

     **Пример:**

     ```cpp
     class Task {
       public:
         void run() { do_run(); }
         virtual ~Task() = default;

       private:
         virtual void do_run() = 0;
     };
     ```

     **Источник:** [Herb Sutter: Overriding Virtual Functions, NVI](https://herbsutter.com/2013/05/22/gotw-5-solution-overriding-virtual-functions/)

217. Почему иногда полезно делать публичный невиртуальный метод и защищённый виртуальный хук?

     **Ответ:** Так база контролирует предусловия, постусловия и общие действия, а наследник меняет только разрешённый шаг. Хук можно сделать private, если производному не нужен прямой доступ: переопределение всё равно разрешено.

     **Пример:**

     ```cpp
     class Task {
       public:
         void run() {
             if (!ready)
                 throw std::logic_error("not ready");
             do_run();
         }
         virtual ~Task() = default;

       protected:
         virtual void do_run() = 0;

       private:
         bool ready = true;
     };
     ```

     **Источник:** [Herb Sutter: Overriding Virtual Functions, NVI](https://herbsutter.com/2013/05/22/gotw-5-solution-overriding-virtual-functions/)

218. Что такое скрытие базового интерфейса из-за перегрузок в производном классе?

     **Ответ:** Объявление функции с тем же именем в наследнике скрывает базовые перегрузки при обычном поиске, даже если параметры не совпадают. Это не обязательно переопределение виртуальной функции.

     **Пример:**

     ```cpp
     struct Base {
         void f(int) {}
     };
     struct Derived : Base {
         void f() {}
     };
     // Derived{}.f(1); // базовая перегрузка скрыта
     ```

     **Источник:** [Рабочий проект стандарта C++: class.member.lookup](https://eel.is/c++draft/class.member.lookup)

219. Для чего используют `using Base::method;` в производном классе?

     **Ответ:** `using` вводит базовые перегрузки в набор видимых функций производного класса. После этого обычное разрешение перегрузки может выбрать базовую или новую функцию.

     **Пример:**

     ```cpp
     struct Base {
         void f(int) {}
     };
     struct Derived : Base {
         using Base::f;
         void f() {}
     };
     void example() {
         Derived d;
         d.f(1);
         d.f();
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: namespace.udecl](https://eel.is/c++draft/namespace.udecl)

220. Что такое ковариантный возвращаемый тип?

     **Ответ:** Это разрешённое уточнение возвращаемого типа виртуальной функции: вместо указателя или ссылки на базовый класс переопределение возвращает соответствующий указатель или ссылку на производный.

     **Пример:**

     ```cpp
     struct Base {
         virtual Base *self() { return this; }
     };
     struct Derived : Base {
         Derived *self() override { return this; }
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

221. В каких случаях C++ разрешает ковариантность для виртуальных методов?

     **Ответ:** Для указателей на классы, lvalue-ссылок на классы или rvalue-ссылок на классы одного соответствующего вида. База результата должна быть доступной и однозначной; действуют ограничения cv-квалификаторов и полноты. Значения и `unique_ptr<Derived>` вместо `unique_ptr<Base>` не ковариантны.

     **Пример:**

     ```cpp
     struct Base {
         virtual Base &self() { return *this; }
     };
     struct Derived : Base {
         Derived &self() override { return *this; }
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

222. Почему ковариантность удобна в иерархиях классов?

     **Ответ:** Вызов через производный статический тип получает более точный результат без дополнительного приведения. При вызове через базовый интерфейс выражение имеет базовый возвращаемый тип.

     **Пример:**

     ```cpp
     struct Base {
         virtual Base *self() { return this; }
     };
     struct Derived : Base {
         Derived *self() override { return this; }
     };
     Derived d;
     Derived *p = d.self();
     Base &b = d;
     Base *q = b.self();
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

223. Что такое абстракция в ООП?

     **Ответ:** Абстракция выделяет существенные понятия и операции, скрывая ненужные клиенту подробности. Хороший интерфейс объясняет, что делает объект, без требования знать его хранение.

     **Пример:**

     ```cpp
     class Stack {
       public:
         void push(int);
         int pop();

       private:
         std::vector<int> data;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-abstract)

224. Чем абстракция отличается от инкапсуляции?

     **Ответ:** Абстракция выбирает понятия и контракт, а инкапсуляция ограничивает доступ к представлению и поддерживает этот контракт. Они связаны, но простого `private` недостаточно для хорошей абстракции.

     **Пример:**

     ```cpp
     class Temperature {
         double c = 0;

       public:
         double celsius() const { return c; }
     }; // единицы выражены интерфейсом
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-interface)

225. Почему хороший класс должен скрывать детали реализации?

     **Ответ:** Чтобы клиент зависел от смысла операций, а не от расположения полей и устройства алгоритма. Это облегчает проверку инвариантов и последующую замену реализации.

     **Пример:**

     ```cpp
     class Names {
         std::vector<std::string> data;

       public:
         std::size_t size() const { return data.size(); }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-abstract)

226. Что такое pImpl-идиома?

     **Ответ:** pImpl хранит реализацию за указателем на неполный вложенный или отдельный тип, определённый в `.cpp`. При `unique_ptr<Impl>` деструктор владельца обычно определяют там, где `Impl` уже полный.

     **Пример:**

     ```cpp
     class Widget {
         struct Impl;
         std::unique_ptr<Impl> impl;

       public:
         Widget();
         ~Widget();
     };
     // В widget.cpp:
     struct Widget::Impl {
         int value = 0;
     };
     Widget::Widget() : impl(std::make_unique<Impl>()) {}
     Widget::~Widget() = default;
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-pimpl)

227. Для чего используют pImpl?

     **Ответ:** Чтобы убрать внутренние зависимости из публичного заголовка, уменьшить пересборку клиентов и упростить сохранение ABI. pImpl не гарантирует совместимость при произвольных изменениях публичного интерфейса.

     **Пример:**

     ```cpp
     class Widget {
         struct Impl;
         std::unique_ptr<Impl> impl;

       public:
         Widget();
         ~Widget();
         void run();
     }; // Impl определён отдельно
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-pimpl)

228. Как pImpl влияет на компиляцию и зависимость заголовков?

     **Ответ:** Клиенту нужен только заголовок с указателем на неполный тип. Изменение внутреннего `Impl` обычно пересобирает реализацию библиотеки, не требуя заново компилировать клиентов при неизменном заголовке.

     **Пример:**

     ```cpp
     class Widget {
         struct Impl;
         std::unique_ptr<Impl> impl;

       public:
         ~Widget();
     }; // детали Impl не включены в заголовок
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-pimpl)

229. Какие издержки у pImpl есть по памяти и производительности?

     **Ответ:** Обычно появляются динамическая аллокация, косвенный доступ и отдельное хранение реализации; часть инлайнинга усложняется. Есть альтернативы с внутренним буфером, но они имеют другие ограничения и сложность.

     **Пример:**

     ```cpp
     class Widget {
         struct Impl;
         std::unique_ptr<Impl> impl;

       public:
         Widget();
         ~Widget();
     }; // объект хранит указатель, Impl — отдельно
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-pimpl)

230. Что такое сильная связность класса?

     **Ответ:** Здесь имеется в виду высокая внутренняя связность, cohesion: данные и методы класса работают на одну содержательную задачу. Это не высокая связанность, coupling, с другими классами.

     **Пример:**

     ```cpp
     class Stack {
         std::vector<int> data;

       public:
         void push(int x) { data.push_back(x); }
         bool empty() const { return data.empty(); }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-related)

231. Что такое слабая связанность между классами?

     **Ответ:** Это небольшое число явных зависимостей через устойчивые интерфейсы, без знания внутреннего устройства соседних классов. Полное отсутствие зависимостей не является обязательной целью.

     **Пример:**

     ```cpp
     struct Logger {
         virtual void write(std::string_view) = 0;
         virtual ~Logger() = default;
     };
     struct Service {
         Logger &logger;
         void run() { logger.write("run"); }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-abstract)

232. Почему высокая связность внутри класса желательна?

     **Ответ:** Связанные операции используют общие инварианты и данные, поэтому изменения одной ответственности остаются локальными. Несвязанные обязанности, наоборот, заставляют класс меняться по разным причинам.

     **Пример:**

     ```cpp
     struct Point {
         double x, y;
         double length() const { return std::hypot(x, y); }
     }; // операция относится к тем же данным
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-related)

233. Почему слабая связанность между модулями полезна?

     **Ответ:** Стабильные небольшие контракты ограничивают распространение изменений, облегчают тестовые подстановки и независимую разработку. Избыточное число искусственных интерфейсов тоже имеет цену.

     **Пример:**

     ```cpp
     struct Clock {
         virtual int now() const = 0;
         virtual ~Clock() = default;
     };
     int age(const Clock &clock, int started) { return clock.now() - started; }
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-abstract)

234. Что такое “знает слишком много” в дизайне класса?

     **Ответ:** Класс чрезмерно зависит от внутренней структуры, порядка действий или конкретных реализаций соседей. Вместо чтения чужих полей полезнее запросить готовую операцию у владельца этих данных.

     **Пример:**

     ```cpp
     struct Order {
         int total() const { return 100; }
     };
     int checkout(const Order &order) {
         return order.total();
     } // не обходит внутренности заказа
     ```

     **Источник:** [Law of Demeter: General Formulation](https://www2.ccs.neu.edu/research/demeter/demeter-method/LawOfDemeter/general-formulation.html)

235. Что такое Law of Demeter в контексте ООП?

     **Ответ:** Law of Demeter рекомендует ограничивать прямое знание объекта ближайшими сотрудниками, а не цепочкой внутренних объектов. Это рекомендация управления зависимостями, а не запрет любого выражения с несколькими точками.

     **Пример:**

     ```cpp
     struct Order {
         std::string shipping_city() const { return "Moscow"; }
     };
     auto city = Order{}.shipping_city(); // контракт вместо обхода структуры клиента
     ```

     **Источник:** [Law of Demeter: General Formulation](https://www2.ccs.neu.edu/research/demeter/demeter-method/LawOfDemeter/general-formulation.html)

236. Почему длинные цепочки вызовов через чужие объекты ухудшают дизайн?

     **Ответ:** Они могут привязать вызывающий код сразу к нескольким внутренним уровням модели. Изменение любого уровня ломает клиента; цепочки fluent API или локальных преобразований не обязательно имеют эту проблему.

     **Пример:**

     ```cpp
     struct Order {
         bool can_ship() const { return true; }
     };
     bool ready(const Order &order) {
         return order.can_ship();
     } // решение делегировано владельцу
     ```

     **Источник:** [Law of Demeter: General Formulation](https://www2.ccs.neu.edu/research/demeter/demeter-method/LawOfDemeter/general-formulation.html)

237. Что такое dependency injection на уровне классов?

     **Ответ:** Dependency injection передаёт зависимость объекту извне, например через конструктор, вместо её скрытого создания внутри. Зависимость может быть интерфейсом, конкретным типом или callable.

     **Пример:**

     ```cpp
     struct Clock {
         virtual int now() const = 0;
         virtual ~Clock() = default;
     };
     class Timer {
         Clock &clock;

       public:
         explicit Timer(Clock &c) : clock(c) {}
         int now() const { return clock.now(); }
     };
     ```

     **Источник:** [Martin Fowler: Dependency Injection](https://martinfowler.com/articles/injection.html)

238. Как dependency injection уменьшает связанность?

     **Ответ:** Класс перестаёт выбирать и создавать конкретную реализацию зависимости. Тест или внешний код может передать другой объект без изменения логики класса, соблюдая время жизни и контракт.

     **Пример:**

     ```cpp
     struct Clock {
         virtual int now() const = 0;
         virtual ~Clock() = default;
     };
     struct FakeClock : Clock {
         int now() const override { return 42; }
     };
     struct Timer {
         Clock &clock;
         int now() const { return clock.now(); }
     };
     FakeClock c;
     Timer timer{c};
     ```

     **Источник:** [Martin Fowler: Dependency Injection](https://martinfowler.com/articles/injection.html)

239. Почему зависимость от абстракции лучше зависимости от конкретной реализации?

     **Ответ:** Стабильная абстракция может защитить бизнес-логику от изменяемых деталей инфраструктуры. Это полезно на границе вариативности; для простого устойчивого типа дополнительный интерфейс может быть лишним.

     **Пример:**

     ```cpp
     struct Store {
         virtual void save(int) = 0;
         virtual ~Store() = default;
     };
     void finish(Store &store) { store.save(42); }
     ```

     **Источник:** [Martin Fowler: Dependency Injection](https://martinfowler.com/articles/injection.html)

240. Что такое полиморфный интерфейс как средство расширяемости?

     **Ответ:** Новый класс реализует существующий интерфейс, и клиент может использовать его без знания конкретного типа. Для этого контракт базы должен быть достаточным и устойчивым.

     **Пример:**

     ```cpp
     struct Formatter {
         virtual std::string format(int) const = 0;
         virtual ~Formatter() = default;
     };
     struct Decimal : Formatter {
         std::string format(int n) const override { return std::to_string(n); }
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

241. Что такое LSP — принцип подстановки Барбары Лисков?

     **Ответ:** LSP требует, чтобы объекты подтипа можно было использовать вместо объектов базового типа без нарушения ожидаемых свойств программы. Речь о поведении: нельзя усиливать предусловия или ослаблять обещанные результаты базы.

     **Пример:**

     ```cpp
     struct Reader {
         virtual int read() = 0;
         virtual ~Reader() = default;
     };
     // Если Reader обещает -1 на EOF, наследник обязан сохранить этот контракт.
     ```

     **Источник:** [Liskov, Wing: A Behavioral Notion of Subtyping](https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf)

242. Почему не всякое наследование удовлетворяет LSP?

     **Ответ:** Язык проверяет структуру наследования и совместимость сигнатур, но не все поведенческие обещания. Производный метод может компилироваться, одновременно нарушая требования клиентов базы.

     **Пример:**

     ```cpp
     struct Writer {
         virtual void write(int) = 0;
         virtual ~Writer() = default;
     };
     struct RejectingWriter : Writer {
         void write(int) override { throw std::logic_error("unsupported"); }
     };
     // Нарушение LSP, если Writer обещал принимать любой int без такого отказа.
     ```

     **Источник:** [Liskov, Wing: A Behavioral Notion of Subtyping](https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf)

243. Как нарушение LSP проявляется на практике?

     **Ответ:** Код, корректный для базового контракта, ломается на наследнике: получает неожиданное исключение, изменённый инвариант или неверный результат. Пример — «только для чтения» объект, подставленный под интерфейс обязательной записи.

     **Пример:**

     ```cpp
     struct Writer {
         virtual void write(int) = 0;
         virtual ~Writer() = default;
     };
     struct ReadOnly : Writer {
         void write(int) override { throw std::logic_error("read only"); }
     }; // не подтип обещанного записывающего объекта
     ```

     **Источник:** [Liskov, Wing: A Behavioral Notion of Subtyping](https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf)

244. Что такое OCP — принцип открытости/закрытости?

     **Ответ:** OCP рекомендует предусматривать нужные расширения поведения без изменения стабильного клиентского кода. Он не запрещает правки вообще: важно выбрать реальные оси расширения, а не строить абстракции на все случаи.

     **Пример:**

     ```cpp
     struct Rule {
         virtual bool accept(int) const = 0;
         virtual ~Rule() = default;
     };
     bool check(const Rule &rule, int value) { return rule.accept(value); }
     ```

     **Источник:** [Robert C. Martin: The Open-Closed Principle](https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html)

245. Как полиморфизм помогает соблюдать OCP?

     **Ответ:** Клиент вызывает базовую операцию, а новую стратегию добавляют отдельным производным классом. Код клиента не меняется, пока новый вариант укладывается в прежний контракт.

     **Пример:**

     ```cpp
     struct Rule {
         virtual bool accept(int) const = 0;
         virtual ~Rule() = default;
     };
     struct Positive : Rule {
         bool accept(int x) const override { return x > 0; }
     };
     bool check(const Rule &r, int x) { return r.accept(x); }
     ```

     **Источник:** [Robert C. Martin: The Open-Closed Principle](https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html)

246. Что такое SRP — принцип единственной ответственности для класса?

     **Ответ:** SRP предлагает объединять код, меняющийся по одной причине, и разделять обязанности, меняющиеся по разным причинам или для разных заинтересованных сторон. Это не правило «один метод на класс».

     **Пример:**

     ```cpp
     struct Invoice {
         int total() const { return 100; }
     };
     struct InvoicePrinter {
         void print(const Invoice &x) { std::cout << x.total(); }
     }; // расчёт отделён от вывода
     ```

     **Источник:** [Robert C. Martin: The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

247. Как понять, что у класса слишком много обязанностей?

     **Ответ:** Класс меняется из-за несвязанных требований, имеет несвязанные группы полей и требует множества зависимостей для простого теста. Например, расчёты, база данных и верстка отчёта в одном классе часто имеют разные причины изменений.

     **Пример:**

     ```cpp
     struct Report {
         std::string text;
     };
     struct Renderer {
         std::string render(const Report &r) { return r.text; }
     };
     struct Storage {
         void save(const Report &) {}
     };
     ```

     **Источник:** [Robert C. Martin: The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

248. Что такое ISP — принцип разделения интерфейсов?

     **Ответ:** ISP рекомендует ориентировать интерфейсы на нужды клиентов, не заставляя их зависеть от неиспользуемых операций. Несколько небольших ролей часто лучше одного универсального интерфейса.

     **Пример:**

     ```cpp
     struct Reader {
         virtual int read() = 0;
         virtual ~Reader() = default;
     };
     struct Writer {
         virtual void write(int) = 0;
         virtual ~Writer() = default;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-small)

249. Почему слишком “толстый” интерфейс неудобен?

     **Ответ:** Он усложняет реализации и тестовые объекты, распространяет изменения и заставляет некоторые классы изображать неподдерживаемые операции. Разделение по ролям делает контракт точнее.

     **Пример:**

     ```cpp
     struct Printable {
         virtual void print() const = 0;
         virtual ~Printable() = default;
     };
     // Печатающему клиенту не нужны методы scan() и fax().
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-small)

250. Что такое DIP — принцип инверсии зависимостей?

     **Ответ:** DIP предлагает направлять зависимости высокоуровневой политики и низкоуровневых деталей к устойчивым абстракциям. Инъекция зависимостей помогает это реализовать, но сама по себе не гарантирует правильного направления зависимостей.

     **Пример:**

     ```cpp
     struct Orders {
         virtual void save(int id) = 0;
         virtual ~Orders() = default;
     };
     struct Checkout {
         Orders &orders;
         void finish(int id) { orders.save(id); }
     }; // не зависит от SQL-класса
     ```

     **Источник:** [Martin Fowler: Dependency Injection](https://martinfowler.com/articles/injection.html)

251. Почему SOLID особенно важен в ООП-дизайне?

     **Ответ:** SOLID помогает обсуждать границы ответственности, контракты и направления зависимостей в изменяемой системе. Это ориентиры с компромиссами, а не требование добавлять интерфейс или наследование к каждому классу.

     **Пример:**

     ```cpp
     struct Report {
         std::string text;
     };
     struct Printer {
         void print(const Report &r) { std::cout << r.text; }
     }; // отдельная причина изменения — формат вывода
     ```

     **Источник:** [Robert C. Martin: The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

252. Когда наследование лучше заменить композицией?

     **Ответ:** Когда отношение означает «содержит» или «использует», нужна только повторная реализация либо независимые варианты поведения. Публичное наследование стоит сохранять для реального поведенческого подтипа.

     **Пример:**

     ```cpp
     struct Engine {
         void start() {}
     };
     struct Car {
         Engine engine;
         void start() { engine.start(); }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-domain)

253. Почему фраза “prefer composition over inheritance” стала классической?

     **Ответ:** Композиция позволяет явно выбирать зависимости и делегировать работу, не связываясь с внутренним устройством базы. Это уменьшает риск хрупких иерархий; наследование интерфейсов при этом остаётся полезным.

     **Пример:**

     ```cpp
     struct Logger {
         void log() {}
     };
     struct Service {
         Logger logger;
         void run() { logger.log(); }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-domain)

254. Какие признаки говорят, что иерархия наследования получилась неудачной?

     **Ответ:** Наследник отключает обещанные операции, клиенты постоянно делают downcast, база знает конкретных наследников, а изменения затрагивают много уровней. Следует пересмотреть контракты и разделить независимые роли.

     **Пример:**

     ```cpp
     struct Writable {
         virtual void write(int) = 0;
         virtual ~Writable() = default;
     };
     // ReadOnly не стоит делать наследником Writable, если он всегда отвергает write().
     ```

     **Источник:** [Liskov, Wing: A Behavioral Notion of Subtyping](https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf)

255. Почему хрупкий базовый класс — реальная проблема больших систем?

     **Ответ:** Производные классы могут зависеть не только от публичного контракта, но и от порядка внутренних вызовов базы. Изменение базы тогда ломает множество наследников, иногда даже без ошибки компиляции.

     **Пример:**

     ```cpp
     struct Base {
         virtual void step() {}
         void run() {
             step();
             step();
         }
     };
     struct Count : Base {
         int n = 0;
         void step() override { ++n; }
     };
     // Изменение числа вызовов step() меняет наблюдаемый результат Count.
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-domain)

256. Что такое fragile base class problem?

     **Ответ:** Fragile base class problem — ситуация, когда изменение базовой реализации неожиданно нарушает производные классы. Особенно уязвимы зависимости от недокументированных вызовов виртуальных методов и protected-состояния.

     **Пример:**

     ```cpp
     struct Base {
       protected:
         int state = 0;
     };
     struct Derived : Base {
         int value() const { return state; }
     }; // зависимость от представления базы
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-protected)

257. Почему изменение базового класса может ломать производные классы?

     **Ответ:** Могут измениться смысл protected-полей, порядок виртуальных вызовов, инварианты, разрешение перегрузок или бинарное размещение. Совместимость исходного кода не равна сохранению поведения и ABI.

     **Пример:**

     ```cpp
     struct Base {
         virtual void hook() {}
         void run() { hook(); }
     };
     // Добавление ещё одного hook() в run() может повторить побочный эффект наследника.
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-domain)

258. Что такое бинарная совместимость интерфейса класса?

     **Ответ:** Бинарная совместимость означает, что уже скомпилированный клиент продолжает корректно работать с новой библиотекой без пересборки при соблюдении её ABI. Важны layout, имена символов, соглашения вызовов, vtable и другие детали платформы.

     **Пример:**

     ```cpp
     struct PublicType {
         int count;
     };
     // Изменение count на long может изменить layout и нарушить ABI.
     ```

     **Источник:** [Itanium C++ ABI: virtual table layout](https://itanium-cxx-abi.github.io/cxx-abi/abi.html#vtable)

259. Почему изменение набора виртуальных методов может ломать ABI?

     **Ответ:** В типичном ABI виртуальные функции связаны с позициями таблицы и служебными переходами. Изменение сигнатуры, порядка или состава может нарушить ожидания старого клиента; некоторые добавления допустимы лишь при конкретных ABI-условиях.

     **Пример:**

     ```cpp
     struct API {
         virtual void first() = 0;
         virtual ~API() = default;
     };
     // Вставка нового virtual перед first() может сдвинуть позиции vtable.
     ```

     **Источник:** [Itanium C++ ABI: virtual table layout](https://itanium-cxx-abi.github.io/cxx-abi/abi.html#vtable)

260. Как дизайн публичных классов связан с обратной совместимостью?

     **Ответ:** Публичные поля, inline-код, виртуальные методы и правила владения становятся обязательствами перед клиентами. Для долгоживущих библиотек полезны узкие интерфейсы, версионирование и pImpl, но сохранение поведения тоже требует внимания.

     **Пример:**

     ```cpp
     class API {
         struct Impl;
         std::unique_ptr<Impl> impl;

       public:
         API();
         ~API();
         void run();
     }; // детали хранения скрыты
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Ri-pimpl)

## Очень сложный уровень / дизайн и архитектура

261. Что такое объектная модель программы на уровне предметной области?

     **Ответ:** Это набор понятий предметной области, их связей, состояний и допустимых операций. Он описывает смысл системы, а не просто повторяет таблицы базы данных или структуру экранов.

     **Пример:**

     ```cpp
     struct OrderLine {
         int quantity;
         int unit_price;
         int total() const { return quantity * unit_price; }
     }; // при допустимом диапазоне int
     ```

     **Источник:** [Martin Fowler: Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html)

262. Как отличить хороший доменный объект от “мешка данных”?

     **Ответ:** Хороший доменный объект выражает осмысленные операции и защищает свои инварианты. Простая структура данных тоже уместна, если её роль — передача значений без сложного поведения.

     **Пример:**

     ```cpp
     class Quantity {
         int value;

       public:
         explicit Quantity(int n) : value(n) {
             if (n < 0)
                 throw std::invalid_argument("quantity");
         }
         int get() const { return value; }
     };
     ```

     **Источник:** [Martin Fowler: Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html)

263. Что такое anemic domain model?

     **Ответ:** Anemic domain model — модель, где объекты в основном хранят данные, а вся предметная логика находится в отдельных сервисах. Это проблемно, когда декларируется богатая объектная модель, но её инварианты нигде не локализованы; простые сценарии могут обходиться без такой модели.

     **Пример:**

     ```cpp
     struct Order {
         bool paid = false;
     };
     void mark_paid(Order &order) { order.paid = true; } // поведение вынесено наружу
     ```

     **Источник:** [Martin Fowler: Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html)

264. Почему класс только с геттерами/сеттерами и без поведения часто считается слабым дизайном?

     **Ответ:** Если у объекта есть сложные инварианты, набор универсальных сеттеров заставляет клиентов самостоятельно соблюдать порядок изменений. Осмысленные операции лучше выражают допустимые переходы; для DTO такое поведение не требуется.

     **Пример:**

     ```cpp
     class Order {
         bool paid = false;

       public:
         void pay() {
             if (paid)
                 throw std::logic_error("already paid");
             paid = true;
         }
     };
     ```

     **Источник:** [Martin Fowler: Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html)

265. Когда простой DTO-класс всё же уместен?

     **Ответ:** Для передачи данных между слоями, сериализации, результатов запросов и простых записей без взаимосвязанных инвариантов. DTO не обязан быть полноценным доменным объектом.

     **Пример:**

     ```cpp
     struct UserDto {
         int id;
         std::string name;
     };
     ```

     **Источник:** [Martin Fowler: Data Transfer Object](https://martinfowler.com/eaaCatalog/dataTransferObject.html)

266. Что такое rich domain model?

     **Ответ:** Rich domain model объединяет предметные данные с операциями и правилами их изменения. Координация внешних систем может оставаться в сервисах, не превращая объект в универсальный центр приложения.

     **Пример:**

     ```cpp
     class Order {
         bool cancelled = false;

       public:
         void cancel() {
             if (cancelled)
                 throw std::logic_error("already cancelled");
             cancelled = true;
         }
     };
     ```

     **Источник:** [Martin Fowler: Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html)

267. Почему поведение должно жить рядом с данными, которые оно защищает?

     **Ответ:** Тогда правила проверяются в одном месте, и все клиенты используют одинаковый контракт. Если логика разбросана снаружи, новая точка изменения данных легко забудет нужную проверку.

     **Пример:**

     ```cpp
     class Range {
         int low = 0, high = 0;

       public:
         void set(int a, int b) {
             if (a > b)
                 throw std::invalid_argument("range");
             low = a;
             high = b;
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-struct)

268. Как инварианты предметной области встраиваются в методы класса?

     **Ответ:** Конструктор проверяет начальное состояние, методы — допустимость перехода и сохранение связанных условий. При ошибке объект должен остаться в состоянии, соответствующем заявленной гарантии.

     **Пример:**

     ```cpp
     class Stock {
         int count = 5;

       public:
         void take(int n) {
             if (n < 0 || n > count)
                 throw std::invalid_argument("stock");
             count -= n;
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-ctor)

269. Почему публичные поля часто разрушают возможность контролировать корректность объекта?

     **Ответ:** Любой клиент может присвоить несовместимые значения, минуя проверки, и класс теряет контроль над переходами состояния. Для независимых полей простой структуры публичный доступ может быть разумным.

     **Пример:**

     ```cpp
     struct BadRange {
         int low, high;
     };
     BadRange invalid{10, 1}; // контракт low <= high не обеспечен
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-private)

270. Что такое фабричный метод?

     **Ответ:** В паттерне Factory Method создание объекта делегируется переопределяемому методу, возвращающему общий продукт. В разговорной речи фабричным методом также называют просто функцию создания; эти значения стоит различать.

     **Пример:**

     ```cpp
     struct Product {
         virtual ~Product() = default;
     };
     struct Creator {
         virtual std::unique_ptr<Product> create() const = 0;
         virtual ~Creator() = default;
     };
     struct ConcreteCreator : Creator {
         std::unique_ptr<Product> create() const override {
             return std::make_unique<Product>();
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-factory)

271. Когда фабрика лучше публичного конструктора?

     **Ответ:** Когда нужны именованные варианты создания, выбор конкретного типа, кэширование или возврат результата с ошибкой. Конструктор удобен для прямого создания одного типа с понятными аргументами.

     **Пример:**

     ```cpp
     class Temperature {
         double c;
         explicit Temperature(double x) : c(x) {}

       public:
         static Temperature from_celsius(double x) { return Temperature{x}; }
         static Temperature from_fahrenheit(double x) { return Temperature{(x - 32) / 1.8}; }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-factory)

272. Что такое статическая фабричная функция?

     **Ответ:** Это статическая функция класса, возвращающая созданный объект или владеющий указатель. У неё нет `this`; она может вызвать закрытый конструктор и дать операции понятное имя.

     **Пример:**

     ```cpp
     class Id {
         int value;
         explicit Id(int n) : value(n) {}

       public:
         static Id from_int(int n) { return Id{n}; }
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: class.static.mfct](https://eel.is/c++draft/class.static.mfct)

273. Как фабрика помогает скрыть сложность создания объекта?

     **Ответ:** Она собирает зависимости, проверяет параметры и выбирает реализацию в одном месте. Клиент получает готовый объект и не повторяет последовательность настройки.

     **Пример:**

     ```cpp
     struct Task {
         virtual void run() = 0;
         virtual ~Task() = default;
     };
     struct Job : Task {
         void run() override {}
     };
     std::unique_ptr<Task> make_task() { return std::make_unique<Job>(); }
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-factory)

274. Что такое dependency ownership и почему это вопрос дизайна класса?

     **Ответ:** Это решение, кто отвечает за время жизни зависимости и может ли передавать или разделять владение. Оно влияет на копирование, разрушение и допустимость хранения ссылок внутри класса.

     **Пример:**

     ```cpp
     struct Dependency {};
     struct Owner {
         std::unique_ptr<Dependency> dependency;
     };
     struct Observer {
         Dependency &dependency;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-owner)

275. Когда класс должен владеть зависимостью, а когда только ссылаться на неё?

     **Ответ:** Владеть стоит, если объект отвечает за создание и завершение жизни ресурса; ссылаться — если время жизни обеспечивает внешний владелец. Невладеющая зависимость должна переживать все обращения к ней.

     **Пример:**

     ```cpp
     struct Logger {};
     struct Service {
         Logger &logger;
     };
     void example() {
         Logger logger;
         Service service{logger};
     } // logger живёт дольше service
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-ptr)

276. Как smart pointers влияют на ООП-дизайн?

     **Ответ:** Они выражают владение в типах и автоматизируют освобождение: `unique_ptr` — исключительное, `shared_ptr` — совместное, `weak_ptr` — наблюдение без продления жизни. Невладеющие ссылки не нужно автоматически заменять на `shared_ptr`.

     **Пример:**

     ```cpp
     struct Node {
         std::weak_ptr<Node> parent;
         std::vector<std::shared_ptr<Node>> children;
     }; // parent не создаёт цикл владения
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-smartptrs)

277. Когда поле типа `std::unique_ptr<T>` отражает композицию/владение?

     **Ответ:** Когда класс отвечает за отдельный объект и освобождает его вместе со своим состоянием либо явно передаёт владение. Объект может быть заменён или сброшен раньше разрушения владельца.

     **Пример:**

     ```cpp
     struct Engine {};
     struct Car {
         std::unique_ptr<Engine> engine = std::make_unique<Engine>();
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: unique.ptr](https://eel.is/c++draft/unique.ptr)

278. Когда поле типа `T&` или `T*` отражает невладение?

     **Ответ:** По принятому соглашению ссылка или сырой указатель обычно наблюдают за внешним объектом. Сам язык не кодирует владение в `T*`, поэтому контракт важен; ссылка предполагает существующий объект, указатель может быть нулевым.

     **Пример:**

     ```cpp
     struct Logger {};
     struct Service {
         Logger &required;
         Logger *optional = nullptr;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-ptr)

279. Почему владение должно быть явно выражено в типе?

     **Ответ:** Это помогает понять обязанности по освобождению, запреты копирования и передачу ресурсов прямо из интерфейса. Скрытое владение сырым указателем требует дополнительной документации и чаще приводит к ошибкам.

     **Пример:**

     ```cpp
     struct Item {};
     std::unique_ptr<Item> make_item() {
         return std::make_unique<Item>();
     } // владение передаётся вызывающему
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-owner)

280. Что такое value semantics и reference semantics в контексте классов?

     **Ответ:** При value semantics копии представляют независимые значения; при reference semantics несколько дескрипторов могут наблюдать один объект. Это семантика операций, а не только способ передачи аргумента в C++.

     **Пример:**

     ```cpp
     std::vector<int> a{1}, b = a; // независимые значения
     auto p = std::make_shared<int>(1);
     auto q = p; // один разделяемый объект
     ```

     **Источник:** [Martin Fowler: Value Object](https://martinfowler.com/bliki/ValueObject.html)

281. Когда класс лучше проектировать как value type?

     **Ответ:** Для величин без самостоятельной идентичности: координат, дат, денег, настроек и небольших результатов вычисления. Полезны естественные копирование, перемещение и сравнение; стоимость копии тоже учитывают.

     **Пример:**

     ```cpp
     struct Point {
         int x, y;
         bool operator==(const Point &) const = default;
     };
     Point a{1, 2}, b = a;
     ```

     **Источник:** [Martin Fowler: Value Object](https://martinfowler.com/bliki/ValueObject.html)

282. Когда класс логичнее проектировать как полиморфную сущность?

     **Ответ:** Когда у объекта есть значимое время жизни или идентичность, а поведение выбирается среди реализаций во время выполнения. Само наличие идентичности не требует виртуальных функций.

     **Пример:**

     ```cpp
     struct Connection {
         virtual void send(std::string_view) = 0;
         virtual ~Connection() = default;
     };
     std::vector<std::unique_ptr<Connection>> connections;
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-domain)

283. Почему полиморфные базовые классы часто делают некопируемыми?

     **Ответ:** Публичное копирование базовой части допускает срезку и частичное присваивание. Копирующие операции можно сделать protected для использования в наследниках либо удалить; полиморфную копию предоставляют отдельно.

     **Пример:**

     ```cpp
     class Base {
       public:
         virtual ~Base() = default;

       protected:
         Base() = default;
         Base(const Base &) = default;
         Base &operator=(const Base &) = default;
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-copy-virtual)

284. Как реализуют полиморфное копирование через `clone()`?

     **Ответ:** База объявляет виртуальную функцию копирования, а каждый конкретный наследник создаёт копию собственного типа и возвращает её через общий владеющий указатель.

     **Пример:**

     ```cpp
     struct Base {
         virtual std::unique_ptr<Base> clone() const = 0;
         virtual ~Base() = default;
     };
     struct Derived : Base {
         int value = 7;
         std::unique_ptr<Base> clone() const override {
             return std::make_unique<Derived>(*this);
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-copy)

285. Какие недостатки есть у паттерна `virtual clone()`?

     **Ответ:** Нужны реализации для конкретных типов, обычно возникает аллокация, а семантику копирования зависимостей приходится определять отдельно. Возврат `unique_ptr<Derived>` не переопределяет функцию, возвращающую `unique_ptr<Base>`: ковариантность умных указателей не поддерживается.

     **Пример:**

     ```cpp
     struct Base {
         virtual std::unique_ptr<Base> clone() const = 0;
         virtual ~Base() = default;
     };
     struct Derived : Base {
         std::unique_ptr<Base> clone() const override {
             return std::make_unique<Derived>(*this);
         }
     };
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-copy)

286. Почему возвращать `std::unique_ptr<Base>` из `clone()` обычно лучше, чем сырой указатель?

     **Ответ:** `unique_ptr` явно передаёт исключительное владение и автоматически освобождает копию, в том числе при исключениях. Сырой указатель не объясняет, кто должен вызвать `delete`.

     **Пример:**

     ```cpp
     struct Base {
         virtual std::unique_ptr<Base> clone() const = 0;
         virtual ~Base() = default;
     };
     std::unique_ptr<Base> duplicate(const Base &b) { return b.clone(); }
     ```

     **Источник:** [Рабочий проект стандарта C++: unique.ptr](https://eel.is/c++draft/unique.ptr)

287. Что такое slicing в контексте копирования полиморфных объектов и как его избегают?

     **Ответ:** Копирование в базовое значение сохраняет лишь базовый подобъект. Для сохранения динамического типа используют виртуальное копирование или подходящую полиморфную обёртку, а для простого доступа — ссылки и указатели.

     **Пример:**

     ```cpp
     struct Base {
         virtual std::unique_ptr<Base> clone() const = 0;
         virtual ~Base() = default;
     };
     std::unique_ptr<Base> copy(const Base &object) { return object.clone(); }
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#ES-slice)

288. Что такое type erasure и как оно связано с полиморфизмом без наследования?

     **Ответ:** Type erasure скрывает конкретный тип за единым интерфейсом обёртки. Исходные типы не обязаны наследовать общую базу; внутри обёртки могут применяться виртуальные функции, таблицы указателей или другие механизмы диспетчеризации.

     **Пример:**

     ```cpp
     std::function<int(int)> f = [](int x) { return x + 1; };
     int result = f(3); // тип лямбды скрыт за std::function
     ```

     **Источник:** [Рабочий проект стандарта C++: func.wrap.func](https://eel.is/c++draft/func.wrap.func)

289. Чем type erasure отличается от классического виртуального интерфейса?

     **Ответ:** При классическом подходе реализации явно наследуют общий интерфейс. При type erasure адаптация выполняется обёрткой, поэтому уже существующие несвязанные типы можно использовать без изменения их иерархий.

     **Пример:**

     ```cpp
     struct Twice {
         int operator()(int x) const { return x * 2; }
     };
     std::function<int(int)> a = Twice{};
     std::function<int(int)> b = [](int x) { return x + 1; };
     ```

     **Источник:** [Рабочий проект стандарта C++: func.wrap.func](https://eel.is/c++draft/func.wrap.func)

290. Когда `std::function` можно рассматривать как пример type erasure?

     **Ответ:** `std::function<R(Args...)>` хранит разные копируемые callable с совместимым вызовом и предоставляет одну сигнатуру. Конкретный тип цели скрыт; пустой вызов бросает `std::bad_function_call`. Для move-only целей с C++23 есть `std::move_only_function`.

     **Пример:**

     ```cpp
     std::function<int(int)> f = [](int x) { return x * x; };
     int n = f(4);
     ```

     **Источник:** [Рабочий проект стандарта C++: func.wrap.func](https://eel.is/c++draft/func.wrap.func)

291. Может ли шаблонный полиморфизм заменить ООП-наследование?

     **Ответ:** В задачах со статически известными типами — да: шаблоны проверяют нужные операции без общей базы. Для runtime-выбора и разнородных коллекций может понадобиться виртуальный интерфейс, type erasure или `variant`.

     **Пример:**

     ```cpp
     template <class T> void execute(T &x) { x.run(); }
     struct Job {
         void run() {}
     };
     void example() {
         Job job;
         execute(job);
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: temp.inst](https://eel.is/c++draft/temp.inst)

292. В каких задачах шаблоны удобнее иерархий классов?

     **Ответ:** Для контейнеров, алгоритмов, статических политик и численных вычислений, где типы известны при компиляции. Они позволяют сохранять точные типы и специализировать реализацию.

     **Пример:**

     ```cpp
     struct Point {
         int x;
     };
     std::vector<Point> points{{1}, {2}};
     ```

     **Источник:** [Рабочий проект стандарта C++: temp.class](https://eel.is/c++draft/temp.class)

293. Когда виртуальный полиморфизм удобнее шаблонов?

     **Ответ:** Когда конкретная реализация выбирается во время выполнения, нужна коллекция разных объектов или стабильная граница между модулями. При динамической загрузке отдельно обеспечивают ABI и время жизни модулей.

     **Пример:**

     ```cpp
     struct Task {
         virtual void run() = 0;
         virtual ~Task() = default;
     };
     void execute_all(std::vector<std::unique_ptr<Task>> &tasks) {
         for (auto &task : tasks)
             task->run();
     }
     ```

     **Источник:** [Рабочий проект стандарта C++: class.virtual](https://eel.is/c++draft/class.virtual)

294. Что такое hybrid design — сочетание ООП и generic programming?

     **Ответ:** Это сочетание шаблонной реализации с runtime-интерфейсами там, где они нужны. Например, шаблонный адаптер оборачивает разные callable в один базовый интерфейс.

     **Пример:**

     ```cpp
     struct Task {
         virtual void run() = 0;
         virtual ~Task() = default;
     };
     template <class F> struct TaskImpl : Task {
         F f;
         explicit TaskImpl(F fn) : f(std::move(fn)) {}
         void run() override { f(); }
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: temp.class](https://eel.is/c++draft/temp.class)

295. Почему современный C++ редко ограничивается только “классическим ООП”?

     **Ответ:** C++ поддерживает несколько стилей: объекты и RAII управляют состоянием, шаблоны обобщают алгоритмы, функции выражают преобразования. Выбор механизма определяется задачей, а не обязательной иерархией классов.

     **Пример:**

     ```cpp
     std::vector<int> values{1, 2, 3};
     void example() {
         std::ranges::for_each(values, [](int &x) { x *= 2; });
     }
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#P-multiparadigm)

296. Какие типичные анти-паттерны встречаются в ООП на C++?

     **Ответ:** Срезка, неявное владение сырыми указателями, невиртуальное удаление через базу, чрезмерное наследование и нарушение инвариантов. Часть проблем обнаруживается типами и анализаторами, часть требует проверки контрактов.

     **Пример:**

     ```cpp
     struct Base {
         virtual ~Base() = default;
     };
     struct Derived : Base {};
     std::unique_ptr<Base> p =
         std::make_unique<Derived>(); // явное владение и корректное разрушение
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-dtor)

297. Почему “бог-объект” считается плохим дизайном?

     **Ответ:** Он объединяет несвязанные обязанности и зависимости, поэтому трудно тестируется и меняется по множеству причин. Разделять его нужно по ответственности, а не механически по числу строк.

     **Пример:**

     ```cpp
     struct Invoice {
         int amount;
     };
     struct Printer {
         void print(const Invoice &x) { std::cout << x.amount; }
     };
     struct Repository {
         void save(const Invoice &) {}
     };
     ```

     **Источник:** [Robert C. Martin: The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

298. Что такое циклические зависимости между классами и чем они вредны?

     **Ответ:** Классы зависят друг от друга по объявлениям, поведению или владению. Это осложняет сборку и тестирование; цикл сильных `shared_ptr` дополнительно удерживает объекты. Forward declaration решает часть зависимостей заголовков, `weak_ptr` — подходящий цикл владения.

     **Пример:**

     ```cpp
     struct Node {
         std::weak_ptr<Node> parent;
         std::vector<std::shared_ptr<Node>> children;
     };
     ```

     **Источник:** [Рабочий проект стандарта C++: util.smartptr.weak](https://eel.is/c++draft/util.smartptr.weak)

299. Почему чрезмерная вложенность наследования усложняет сопровождение?

     **Ответ:** Чтобы понять поведение, приходится прослеживать много баз, переопределений и инвариантов. Независимые вариации часто проще выразить отдельными компонентами вместо новых уровней наследования.

     **Пример:**

     ```cpp
     struct Logger {
         void log() {}
     };
     struct Service {
         Logger logger;
         void run() { logger.log(); }
     }; // отдельная роль вместо дополнительного уровня базы
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rh-domain)

300. Какие основные принципы хорошего ООП-дизайна на C++ ты бы сформулировал?

     **Ответ:** Явные контракты и владение, сохранение инвариантов, RAII и правило нуля, небольшие связанные обязанности и корректная подстановка наследников. Выбирать композицию, шаблоны или виртуальность по реальным требованиям и проверять ошибки, время жизни и стоимость решений.

     **Пример:**

     ```cpp
     class Names {
         std::vector<std::string> data;

       public:
         void add(std::string name) { data.push_back(std::move(name)); }
         std::size_t size() const { return data.size(); }
     }; // владение и очистка у vector
     ```

     **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-zero)

[<- Prev](./05_function.md)         [Next ->](./07_templates.md)
