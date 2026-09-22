# Compile_time

## Лёгкий уровень

1. Что в C++ означает выражение “вычисление на этапе компиляции”?

**Ответ:** Это выполнение вычислений, резолв типов или генерация структур данных непосредственно компилятором во время сборки исходного кода программы, в результате чего полученные значения внедряются прямо в результирующий бинарный файл без нагрузки на runtime.

**Пример:**

```cpp
constexpr int square(int x) { return x * x; }
constexpr int val = square(5); // Вычислено компилятором: val = 25
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

2. Чем вычисление на этапе компиляции отличается от вычисления во время выполнения?

**Ответ:** Вычисления compile-time происходят на машине разработчика в процессе компиляции и оперируют только детерминированными константами. Runtime-вычисления производятся процессором во время работы скомпилированной программы и зависят от динамического контекста (ввода пользователя, состояния ОС, сети).

**Пример:**

```cpp
#include <iostream>

constexpr int compile_time_val = 10 * 20; // Вычислено компилятором
int x;
// std::cin >> x; int runtime_val = x * 20; // Вычисляется во время работы
```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression)

3. Почему вычисления на этапе компиляции вообще полезны?

**Ответ:** Они обеспечивают принцип zero-cost abstractions (нулевая стоимость во время исполнения), переносят обнаружение логических и типовых ошибок со стадии продакшена на этап сборки (fail-fast) и позволяют статически выделять память нужного объема под предрассчитанные данные.

**Пример:**

```cpp
#include <array>

constexpr std::size_t calculate_size() { return 8 * 16; }
std::array<int, calculate_size()> buffer; // Выделение массива точного размера на стеке
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

4. Какие задачи удобно решать на этапе компиляции?

**Ответ:** Предрасчет тригонометрических и математических таблиц (lookup tables), хеширование строк (например, для switch по строкам), парсинг строк форматирования, валидацию размерностей величин и проверку соответствия типов интерфейсам шаблонов.

**Пример:**

```cpp
constexpr uint32_t fnv1a(const char* str, size_t n) {
    uint32_t hash = 2166136261u;
    for (size_t i = 0; i < n; ++i) {
        hash = (hash ^ static_cast<uint8_t>(str[i])) * 16777619u;
    }
    return hash;
}
constexpr auto id = fnv1a("USER_LOGIN", 10);
```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression)

5. Что такое константное выражение в C++?

**Ответ:** Это выражение (_constant expression_), которое не зависит от состояния выполнения программы и может быть полностью вычислено компилятором в процессе трансляции согласно строгим правилам стандарта.

**Пример:**

```cpp
constexpr int a = 10;
constexpr int b = a + 32; // Константное выражение
```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression)

6. Что такое compile-time constant?

**Ответ:** Это именованная величина, значение которой зафиксировано и гарантированно известно компилятору, что позволяет использовать её в качестве аргумента нетиповых шаблонов, границ массивов или меток `case`.

**Пример:**

```cpp
constexpr int MaxRetries = 3; // compile-time constant
```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression)

7. Чем обычная константа отличается от значения, известного компилятору на этапе компиляции?

**Ответ:** Обычная константа `const` является константой доступа (запрещает модификацию после инициализации), но её значение может быть получено динамически во время выполнения. Значение этапа компиляции (`constexpr`) обязано быть известно и вычислено еще до компоновки программы.

**Пример:**

```cpp
int get_val(); // runtime-функция

const int a = get_val();     // Константа времени выполнения
// constexpr int b = get_val(); // Ошибка компиляции!
constexpr int c = 42;        // Compile-time константа
```

**Источник:** [Cppreference: const](https://en.cppreference.com/w/cpp/language/cv)

8. Что такое `const`?

**Ответ:** Ключевое слово (квалификатор типа), сообщающее компилятору, что объект не подлежит изменению после того, как он был проинициализирован.

**Пример:**

```cpp
const double PI = 3.1415926535;
// PI = 3.0; // Ошибка: объект read-only
```

**Источник:** [Cppreference: cv-qualifiers](https://en.cppreference.com/w/cpp/language/cv)

9. Чем `const` отличается от `constexpr`?

**Ответ:** `const` регулирует изменяемость объекта в коде (read-only семантика в runtime или compile-time), а `constexpr` гарантирует, что объект или функция пригодны для использования в контексте вычислений времени компиляции. Любой объект `constexpr` неявно является `const`.

**Пример:**

```cpp
int x = 5;
const int r = x;      // OK: const, значение получено в рантайме
// constexpr int c = x; // Ошибка: x не константное выражение
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

10. Что такое `constexpr`?

**Ответ:** Спецификатор, введенный в C++11, который указывает, что значение переменной или результат вызова функции можно вычислить во время компиляции, если все аргументы и зависимости доступны на этапе сборки.

**Пример:**

```cpp
constexpr int multiply(int a, int b) { return a * b; }
constexpr int res = multiply(6, 7); // 42 на этапе компиляции
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

11. Что такое `consteval`?

**Ответ:** Ключевое слово, добавленное в C++20, определяющее _immediate function_ (немедленную функцию): такая функция обязана вычисляться строго на этапе компиляции, а любая попытка её выполнения в runtime вызывает безусловную ошибку сборки.

**Пример:**

```cpp
consteval int only_compile_time(int n) { return n * 2; }

int x = 10;
// int bad = only_compile_time(x); // Ошибка: x не compile-time константа
constexpr int good = only_compile_time(10); // OK
```

**Источник:** [Cppreference: consteval specifier](https://en.cppreference.com/w/cpp/language/consteval)

12. Что такое `constinit`?

**Ответ:** Ключевое слово из C++20, требующее, чтобы статическая переменная или переменная локального потока (`thread_local`) обязательно была инициализирована на этапе компиляции (_constant initialization_), при этом сама переменная остается изменяемой в рантайме.

**Пример:**

```cpp
constexpr int get_seed() { return 1337; }
constinit int global_seed = get_seed(); // Гарантированная статическая инициализация

void update() { global_seed++; } // Переменную можно изменять в runtime
```

**Источник:** [Cppreference: constinit specifier](https://en.cppreference.com/w/cpp/language/constinit)

13. Что такое `static_assert`?

**Ответ:** Механизм статической проверки утверждений, проверяющий булево константное выражение на этапе компиляции. Если выражение ложно, процесс компиляции немедленно прерывается с выводом ошибки.

**Пример:**

```cpp
static_assert(sizeof(void*) == 8, "Только 64-битные архитектуры поддерживаются");
```

**Источник:** [Cppreference: static_assert declaration](https://en.cppreference.com/w/cpp/language/static_assert)

14. Для чего нужен `static_assert`?

**Ответ:** Он используется для валидации инвариантов типов, проверки корректности аргументов шаблонов, соблюдения платформенных ограничений (выравнивание, размеры примитивов) и раннего предотвращения ошибок компиляции с понятными сообщениями.

**Пример:**

```cpp
#include <type_traits>

template <typename T>
void serialize(T val) {
    static_assert(std::is_trivially_copyable_v<T>, "T обязан быть тривиально копируемым");
}
```

**Источник:** [Cppreference: static_assert declaration](https://en.cppreference.com/w/cpp/language/static_assert)

15. Чем `static_assert` отличается от обычного `assert`?

**Ответ:** `static_assert` выполняется компилятором, требует константного выражения и останавливает сборку программы. Макрос `assert` работает в runtime, выполняет проверки в процессе выполнения программы и полностью вырезается оптимизатором при сборке с определенным флагом `NDEBUG`.

**Пример:**

```cpp
#include <cassert>

constexpr int A = 4;
static_assert(A > 0); // Проверка при сборке

void test(int runtime_arg) {
    assert(runtime_arg > 0); // Проверка при запуске (в Debug-сборке)
}
```

**Источник:** [Cppreference: assert vs static_assert](https://en.cppreference.com/w/cpp/error/assert)

16. На каком этапе срабатывает `static_assert`?

**Ответ:** На этапе семантического анализа и инстанцирования шаблонов во время компиляции исходного текста программы до запуска линковщика и стадии выполнения.

**Пример:**

```cpp
static_assert(2 + 2 == 4); // Вычисляется на этапе анализа выражений компилятором
```

**Источник:** [Cppreference: static_assert](https://en.cppreference.com/w/cpp/language/static_assert)

17. Что такое `sizeof` в контексте compile-time?

**Ответ:** Это встроенный невычисляемый унарный оператор, который возвращает размер типа или объекта в байтах в виде константного выражения времени компиляции (типа `std::size_t`).

**Пример:**

```cpp
constexpr std::size_t int_size = sizeof(int);
int buffer[sizeof(double) * 2]; // Допустимо: sizeof - константное выражение
```

**Источник:** [Cppreference: sizeof operator](https://en.cppreference.com/w/cpp/language/sizeof)

18. Что такое `alignof` в контексте compile-time?

**Ответ:** Это оператор времени компиляции (C++11), возвращающий требование к байтовому выравниванию указанного типа в памяти в виде константы типа `std::size_t`.

**Пример:**

```cpp
constexpr std::size_t align = alignof(double);
static_assert(alignof(char) == 1);
```

**Источник:** [Cppreference: alignof operator](https://en.cppreference.com/w/cpp/language/alignof)

19. Что такое типовая информация, доступная компилятору до запуска программы?

**Ответ:** Это метаданные о структуре типов, известные компилятору из деклараций: размер, выравнивание, наличие тривиального деструктора, конструктора перемещения, модификаторы `const`/`volatile`, взаимосвязи наследования и квалификаторы ссылок.

**Пример:**

```cpp
#include <type_traits>

struct MyStruct { int a; double b; };
constexpr bool is_pod = std::is_standard_layout_v<MyStruct>; // Метаинформация о типе
```

**Источник:** [Cppreference: Type support](https://en.cppreference.com/w/cpp/types)

20. Почему размер типа можно узнать на этапе компиляции?

**Ответ:** В C++ статическая типизация: компилятор сам определяет лейаут структуры в памяти (смещение полей, паддинг, размер базовых классов и указатель на vtable) в соответствии с целевой ABI платформы, поэтому размер любого законченного (_complete_) типа фиксирован на этапе сборки.

**Пример:**

```cpp
struct Point { int x; int y; };
static_assert(sizeof(Point) == sizeof(int) * 2);
```

**Источник:** [Cppreference: sizeof](https://en.cppreference.com/w/cpp/language/sizeof)

21. Что такое литеральный тип?

**Ответ:** Это тип данных (_LiteralType_), объекты которого могут создаваться, инициализироваться и использоваться в константных выражениях (`constexpr`). К ним относятся скалярные типы, ссылки, constexpr-массивы и классы с тривиальным или constexpr-деструктором и хотя бы одним constexpr-конструктором.

**Пример:**

```cpp
struct LiteralPoint {
    int x;
    int y;
    constexpr LiteralPoint(int px, int py) : x(px), y(py) {}
}; // LiteralPoint - литеральный тип
```

**Источник:** [Cppreference: LiteralType](https://en.cppreference.com/w/cpp/named_req/LiteralType)

22. Почему некоторые объекты можно создавать в `constexpr`-контексте, а некоторые нет?

**Ответ:** Чтобы объект мог создаваться в `constexpr`-контексте, он должен быть литеральным типом: его конструктор и деструктор не должны обращаться к неконстантным глобальным состояниям, аппаратуре, системным вызовам ОС или нетривиальному освобождению ресурсов, неподдерживаемому интерпретатором компилятора.

**Пример:**

```cpp
#include <fstream>

constexpr int a = 5; // OK: скалярный тип
// constexpr std::ifstream file("test.txt"); // Ошибка: обращение к ресурсам ОС запрещено в constexpr
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

23. Что такое `enum class` и почему его значения часто удобны как compile-time-константы?

**Ответ:** `enum class` — это строго типизированное перечисление с изолированной областью видимости. Его элементы являются строго типизированными именованными compile-time константами целочисленного типа, что предотвращает случайные неявные преобразования.

**Пример:**

```cpp
enum class PacketType : uint8_t { Handshake = 1, Data = 2, Ping = 3 };

template <PacketType T>
void handlePacket() {}

handlePacket<PacketType::Data>(); // Значение перечисления как аргумент шаблона
```

**Источник:** [Cppreference: Enumeration declaration](https://en.cppreference.com/w/cpp/language/enum)

24. Что такое нетиповой параметр шаблона?

**Ответ:** Это параметр шаблона (_Non-Type Template Parameter, NTTP_), представляющий собой конкретное значение константного выражения (целое число, указатель, ссылка, с C++20 — литеральный объект или double), а не тип данных.

**Пример:**

```cpp
template <int N>
struct Factorial {
    static constexpr int value = N * Factorial<N - 1>::value;
};

template <>
struct Factorial<0> {
    static constexpr int value = 1;
};
```

**Источник:** [Cppreference: Template parameters](https://en.cppreference.com/w/cpp/language/template_parameters#Non-type_template_parameter)

25. Почему размер `std::array<T, N>` должен быть известен на этапе компиляции?

**Ответ:** `std::array` инкапсулирует обычный C-массив фиксированного размера `T elements[N]` и располагает его на стеке или в статическом сегменте; для вычисления смещений и резервирования стекового кадра размер массива обязан быть константой времени компиляции.

**Пример:**

```cpp
#include <array>

constexpr size_t count = 4;
std::array<double, count> arr; // Размер count обязан быть compile-time константой
```

**Источник:** [Cppreference: std::array](https://en.cppreference.com/w/cpp/container/array)

26. Что такое шаблонное метапрограммирование в самом общем смысле?

**Ответ:** Это подход к разработке, при котором компилятор C++ используется как среда выполнения (виртуальная машина), где шаблоны служат инструкциями для порождения новых типов данных, алгоритмических преобразований и предрасчетов до запуска бинарного файла.

**Пример:**

```cpp
template <bool Condition, typename TrueType, typename FalseType>
struct IfThenElse { using type = TrueType; };

template <typename TrueType, typename FalseType>
struct IfThenElse<false, TrueType, FalseType> { using type = FalseType; };
```

**Источник:** [Cppreference: Template metaprogramming](https://en.cppreference.com/w/cpp/language/templates)

27. Почему шаблоны исторически стали инструментом compile-time-вычислений?

**Ответ:** Механизм подстановки и специализации шаблонов C++ оказался Тьюринг-полным (случайно обнаружено Эрвином Унру в 1994 году), что позволило выражать циклы через рекурсию шаблонов, а ветвления — через частичные специализации.

**Пример:**

```cpp
template <unsigned n>
struct Fib {
    static constexpr unsigned val = Fib<n - 1>::val + Fib<n - 2>::val;
};
template <> struct Fib<0> { static constexpr unsigned val = 0; };
template <> struct Fib<1> { static constexpr unsigned val = 1; };
```

**Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates)

28. Что такое `if constexpr`?

**Ответ:** Конструкция статического ветвления (введена в C++17), позволяющая отбрасывать невыбранные ветви алгоритма на этапе компиляции, не инстанцируя и не транслируя содержащийся в них невалидный для данного типа код.

**Пример:**

```cpp
template <typename T>
auto getValue(T t) {
    if constexpr (std::is_pointer_v<T>) {
        return *t; // Компилируется только если T - указатель
    } else {
        return t;  // Компилируется для всех остальных типов
    }
}
```

**Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if#Constexpr_if)

29. Чем `if constexpr` отличается от обычного `if`?

**Ответ:** Обычный `if` вычисляется в runtime (все ветви обязаны успешно компилироваться для любых подставляемых типов). В `if constexpr` условие проверяется компилятором, и код невыбранной ветви отбрасывается, не требуя синтаксической и типовой валидности для конкретного инстанцированного типа.

**Пример:**

```cpp
template <typename T>
void print_first(T val) {
    if constexpr (requires { val[0]; }) {
        // Обычный if тут привел бы к ошибке компиляции для int
        std::cout << val[0];
    }
}
```

**Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if#Constexpr_if)

30. Что такое `std::integral_constant`?

**Ответ:** Базовый шаблонный класс стандартной библиотеки из `<type_traits>`, оборачивающий статическую константу заданного типа в структуру, превращая compile-time значение в тип C++.

**Пример:**

```cpp
#include <type_traits>

using two_t = std::integral_constant<int, 2>;
static_assert(two_t::value == 2);
```

**Источник:** [Cppreference: std::integral_constant](https://en.cppreference.com/w/cpp/types/integral_constant)

31. Что такое `std::true_type`?

**Ответ:** Стандартный псевдоним типа, определенный как `std::integral_constant<bool, true>`, используемый в type traits для обозначения успешных статических проверок предикатов.

**Пример:**

```cpp
#include <type_traits>

static_assert(std::true_type::value == true);
```

**Источник:** [Cppreference: std::integral_constant](https://en.cppreference.com/w/cpp/types/integral_constant)

32. Что такое `std::false_type`?

**Ответ:** Стандартный псевдоним типа, определенный как `std::integral_constant<bool, false>`, применяемый для индикации отрицательного результата в предикатах типов.

**Пример:**

```cpp
#include <type_traits>

static_assert(std::false_type::value == false);
```

**Источник:** [Cppreference: std::integral_constant](https://en.cppreference.com/w/cpp/types/integral_constant)

33. Что такое type trait?

**Ответ:** Это шаблонный класс или псевдоним, предоставляющий интерфейс для запроса характеристик типов (является ли тип указателем, ссылкой, классом) или трансформации типов (снятие константности, добавление ссылок) на этапе компиляции.

**Пример:**

```cpp
#include <type_traits>

constexpr bool check = std::is_floating_point<float>::value; // true
```

**Источник:** [Cppreference: Type traits](https://en.cppreference.com/w/cpp/header/type_traits)

34. Для чего нужны type traits?

**Ответ:** Они используются в обобщенном коде для интроспекции параметров шаблонов, валидации контрактов через `static_assert`, ограничения перегрузок через SFINAE/Concepts и оптимизации алгоритмов под конкретные свойства типов (например, копирование через `memmove`).

**Пример:**

```cpp
#include <type_traits>

template <typename T>
void copy_elements(T* dst, const T* src, size_t n) {
    if constexpr (std::is_trivially_copyable_v<T>) {
        // Оптимизированный путь для простых типов
    }
}
```

**Источник:** [Cppreference: Type traits](https://en.cppreference.com/w/cpp/header/type_traits)

35. Что делает `std::is_same`?

**Ответ:** Проверяет, являются ли два переданных типа данных идентичными (с учетом `const`, ссылок и модификаторов), возвращая `std::true_type` или `std::false_type`.

**Пример:**

```cpp
#include <type_traits>

static_assert(std::is_same<int, int>::value);
static_assert(!std::is_same<int, const int>::value);
```

**Источник:** [Cppreference: std::is_same](https://en.cppreference.com/w/cpp/types/is_same)

36. Что делает `std::is_integral`?

**Ответ:** Проверяет, относится ли тип к целочисленным фундаментальным типам языка C++ (включая `bool`, `char`, `int`, `long long` и их cv-квалифицированные версии).

**Пример:**

```cpp
#include <type_traits>

static_assert(std::is_integral_v<long>);
static_assert(!std::is_integral_v<double>);
```

**Источник:** [Cppreference: std::is_integral](https://en.cppreference.com/w/cpp/types/is_integral)

37. Что делает `std::is_pointer`?

**Ответ:** Проверяет, является ли переданный тип сырым указателем на объект или функцию (не распространяется на умные указатели или указатели на члены класса).

**Пример:**

```cpp
#include <type_traits>

static_assert(std::is_pointer_v<int*>);
static_assert(!std::is_pointer_v<std::nullptr_t>);
```

**Источник:** [Cppreference: std::is_pointer](https://en.cppreference.com/w/cpp/types/is_pointer)

38. Что делает `std::is_reference`?

**Ответ:** Проверяет, относится ли тип к ссылочному типу (lvalue-ссылка `T&` или rvalue-ссылка `T&&`).

**Пример:**

```cpp
#include <type_traits>

static_assert(std::is_reference_v<int&>);
static_assert(std::is_reference_v<int&&>);
static_assert(!std::is_reference_v<int>);
```

**Источник:** [Cppreference: std::is_reference](https://en.cppreference.com/w/cpp/types/is_reference)

39. Что делает `std::is_const`?

**Ответ:** Проверяет, помечен ли переданный тип верхнеуровневым квалификатором `const`.

**Пример:**

```cpp
#include <type_traits>

static_assert(std::is_const_v<const int>);
static_assert(!std::is_const_v<const int*>); // Указатель не константный (указывает на const)
static_assert(std::is_const_v<int* const>);  // Сам указатель константен
```

**Источник:** [Cppreference: std::is_const](https://en.cppreference.com/w/cpp/types/is_const)

40. Что такое `_v`-формы traits, например `std::is_same_v`?

**Ответ:** Это шаблонные переменные (_variable templates_), добавленные в C++17, предоставляющие сокращенный синтаксический доступ к значению `::value` соответствующего трейта.

**Пример:**

```cpp
#include <type_traits>

// Вместо std::is_integral<T>::value:
template <typename T>
constexpr bool is_num = std::is_integral_v<T>;
```

**Источник:** [Cppreference: Variable template](https://en.cppreference.com/w/cpp/language/variable_template)

41. Чем `std::is_same<T, U>::value` отличается от `std::is_same_v<T, U>`?

**Ответ:** По результату они функционально эквивалентны. `_v` форма короче в записи, не требует обращения к вложенным именам и несколько снижает нагрузку на компилятор при инстанцировании шаблонов.

**Пример:**

```cpp
#include <type_traits>

static_assert(std::is_same<int, int>::value == std::is_same_v<int, int>);
```

**Источник:** [Cppreference: std::is_same](https://en.cppreference.com/w/cpp/types/is_same)

42. Что такое `_t`-алиасы traits, например `std::remove_reference_t`?

**Ответ:** Это шаблонные псевдонимы типов (_alias templates_), добавленные в C++14, позволяющие обращаться к результату трансформации типа напрямую без использования связки `typename ...::type`.

**Пример:**

```cpp
#include <type_traits>

// До C++14: typename std::remove_reference<T>::type
// Начиная с C++14:
using CleanType = std::remove_reference_t<int&>; // int
```

**Источник:** [Cppreference: Type traits aliases](https://en.cppreference.com/w/cpp/header/type_traits)

43. Что такое `decltype`?

**Ответ:** Ключевое слово (оператор времени компиляции), выводящее объявленный точный тип выражения или сущности без фактического вычисления самого выражения.

**Пример:**

```cpp
int x = 10;
decltype(x) y = 20; // y имеет тип int
decltype((x)) ref = x; // ref имеет тип int& (выражение lvalue в скобках)
```

**Источник:** [Cppreference: decltype specifier](https://en.cppreference.com/w/cpp/language/decltype)

44. Что такое `auto` и как он связан с выводом типа на этапе компиляции?

**Ответ:** `auto` — это спецификатор плейсхолдера типа, поручающий компилятору вывести фактический тип переменной на этапе сборки на основе типа её инициализатора (по правилам вывода аргументов шаблонов с отбрасыванием ссылок и константности).

**Пример:**

```cpp
auto val = 42;      // int
const auto& r = val; // const int&
```

**Источник:** [Cppreference: auto specifier](https://en.cppreference.com/w/cpp/language/auto)

45. Что такое `decltype(auto)`?

**Ответ:** Спецификатор плейсхолдера типа (C++14), выводящий тип выражения по строгим правилам оператора `decltype`, сохраняя ссылки и cv-квалификаторы инициализатора без их неявного отбрасывания.

**Пример:**

```cpp
int x = 10;
int& getRef() { return x; }

auto a = getRef();           // Тип: int (копия)
decltype(auto) b = getRef(); // Тип: int& (ссылка сохранена)
```

**Источник:** [Cppreference: auto specifier](https://en.cppreference.com/w/cpp/language/auto)

46. Что такое зависимость кода от типов на этапе компиляции?

**Ответ:** Это фундаментальное свойство обобщенного кода, при котором конкретный бинарный код, структуры данных и пути исполнения формируются компилятором в строгой зависимости от свойств подставленных аргументов типов.

**Пример:**

```cpp
template <typename T>
void allocate() {
    T buffer[sizeof(T)]; // Размер и выравнивание зависят от свойств типа T
}
```

**Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates)

47. Что такое compile-time branch?

**Ответ:** Это выбор пути компиляции (ветвление), выполняемый компилятором (через `if constexpr`, специализацию шаблонов или перегрузку по концептам), при котором ненужные ветки кода полностью исключаются из бинарного файла.

**Пример:**

```cpp
template <typename T>
void execute() {
    if constexpr (sizeof(T) > 4) {
        // Путь для больших типов
    } else {
        // Путь для малых типов
    }
}
```

**Источник:** [Cppreference: if constexpr](https://en.cppreference.com/w/cpp/language/if#Constexpr_if)

48. Что такое compile-time error?

**Ответ:** Это ошибка, обнаруженная компилятором на этапе лексического, синтаксического или семантического анализа исходного кода, полностью предотвращающая успешную сборку бинарного файла.

**Пример:**

```cpp
// static_assert(false, "Compiler halts"); // compile-time error
```

**Источник:** [Cppreference: compile time](https://en.cppreference.com/w/cpp)

49. Почему иногда лучше получить ошибку на этапе компиляции, чем на этапе выполнения?

**Ответ:** Ошибка компиляции обнаруживается мгновенно при сборке проекта, защищая от сбоев в продакшене, не требует написания отдельных runtime-тестов на тривиальные контракты и исключает непредвиденные аварийные остановки систем у пользователей.

**Пример:**

```cpp
template <typename T>
void process(T val) {
    static_assert(std::is_integral_v<T>, "Ошибка видна разработчику сразу при сборке");
}
```

**Источник:** [Cppreference: static_assert](https://en.cppreference.com/w/cpp/language/static_assert)

50. Какие основные инструменты compile-time-программирования есть в современном C++?

**Ответ:** Ключевые слова `constexpr`, `consteval`, `constinit`; статические проверки `static_assert`; операторы `decltype`, `sizeof`, `alignof`; конструкции `if constexpr`; концепты и ограничения (`concepts` / `requires`); библиотека `<type_traits>` и fold expressions.

**Пример:**

```cpp
template <typename T>
requires std::is_integral_v<T>
consteval T double_it(T val) {
    return val * 2;
}
```

**Источник:** [Cppreference: Constexpr](https://en.cppreference.com/w/cpp/language/constexpr)

---

## Ниже среднего уровня

51. Когда `const`-переменная не гарантирует, что её значение известно на этапе компиляции?

**Ответ:** Когда инициализирующее выражение переменной зависит от runtime-данных (вызова системных функций, динамических параметров, ввода/вывода) или когда переменная имеет внешний тип компоновки без определения в единице трансляции.

**Пример:**

```cpp
#include <ctime>

const time_t start_time = std::time(nullptr); // const, но значение известно только при запуске
```

**Источник:** [Cppreference: cv-qualifiers](https://en.cppreference.com/w/cpp/language/cv)

52. Почему `constexpr` требует более строгих условий, чем `const`?

**Ответ:** `constexpr` гарантирует возможность использования значения в контексте константных выражений компилятора, поэтому компилятор обязан иметь возможность вычислить инициализатор без запуска приложения, запрещая любые динамические зависимости.

**Пример:**

```cpp
int get_id();
const int a = get_id();     // Разрешено для const
// constexpr int b = get_id(); // Ошибка для constexpr: get_id() неизвестен в compile-time
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

53. Что такое `constexpr`-переменная?

**Ответ:** Это переменная, чье значение полностью вычислено компилятором на этапе трансляции кода. Такая переменная неявно является константной (`const`) и может использоваться в любых контекстах, требующих compile-time констант.

**Пример:**

```cpp
constexpr int BufferLimit = 1024;
int memory[BufferLimit];
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

54. Какие ограничения есть у инициализатора `constexpr`-переменной?

**Ответ:** Инициализатор обязан быть константным выражением: тип переменной должен быть литеральным, в инициализаторе нельзя использовать неконстантные вызовы функций, сырое неконстантное приведение типов (`reinterpret_cast`), неинициализированную память или операции ввода-вывода.

**Пример:**

```cpp
int runtime_val = 10;
// constexpr int bad = runtime_val; // Ошибка: runtime_val не константное выражение
constexpr int good = 10 * 2;        // OK
```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression)

55. Что такое `constexpr`-функция?

**Ответ:** Это функция, которая спроектирована так, чтобы её можно было выполнять как во время компиляции (если все переданные аргументы — константные выражения), так и в рантайме (если аргументы динамические).

**Пример:**

```cpp
constexpr int add(int a, int b) { return a + b; }
constexpr int c = add(2, 3); // Вычисление на этапе компиляции
int x = 5;
int r = add(x, 2);           // Вычисление в runtime
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

56. Чем `constexpr`-функция отличается от обычной функции?

**Ответ:** Она может вызываться в контексте константных выражений (например в параметрах шаблонов). Начиная с C++11 к её телу предъявляются требования стандарта (отсутствие нелитеральных типов, ассемблерных вставок, неконстантных статических переменных и т.д.).

**Пример:**

```cpp
// Обычная функция:
int square_rt(int x) { return x * x; }
// constexpr-функция:
constexpr int square_ct(int x) { return x * x; }

// static_assert(square_rt(2) == 4); // Ошибка: square_rt не constexpr
static_assert(square_ct(2) == 4);   // OK
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

57. Всегда ли вызов `constexpr`-функции вычисляется на этапе компиляции?

**Ответ:** Нет. Вызов вычисляется на этапе компиляции только тогда, когда результат используется в контексте, где обязательно требуется константное выражение (например, инициализатор `constexpr` переменной, параметр шаблона), либо если функция вызвана с константными аргументами и компилятор решил провести оптимизацию.

**Пример:**

```cpp
constexpr int compute(int x) { return x * 10; }

int a = 5;
int res1 = compute(a); // Вычисляется в runtime!
constexpr int res2 = compute(5); // Вычисляется в compile-time
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

58. Когда `constexpr`-функция может вычисляться во время выполнения?

**Ответ:** Когда хотя бы один из её аргументов не является константным выражением времени компиляции, либо когда результат вызова присваивается обычной не-`constexpr` переменной и компилятор отказался от агрессивного вычисления констант.

**Пример:**

```cpp
constexpr int mult(int a, int b) { return a * b; }

void run(int runtime_arg) {
    int val = mult(runtime_arg, 2); // Аргумент неизвестен компилятору -> Runtime
}
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

59. Почему одна и та же `constexpr`-функция может работать и на compile time, и на runtime?

**Ответ:** Это фундаментальный дизайн стандарта: устранить необходимость дублировать один и тот же алгоритм в двух версиях (одну для метапрограммирования, вторую — для выполнения с пользовательскими входными данными).

**Пример:**

```cpp
constexpr size_t my_strlen(const char* s) {
    size_t len = 0;
    while (s[len] != '\0') ++len;
    return len;
}
// Работает и для compile-time литералов, и для runtime-строк
```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr)

60. Что такое immediate function?

**Ответ:** Это функция, объявленная со спецификатором `consteval` (введена в C++20). Каждый её вызов обязан давать результат на этапе компиляции, иначе генерируется ошибка трансляции.

**Пример:**

```cpp
consteval int make_mask(int bit) { return 1 << bit; }
constexpr int mask = make_mask(3); // OK: 8 на этапе компиляции
```

**Источник:** [Cppreference: consteval specifier](https://en.cppreference.com/w/cpp/language/consteval)

61. Чем `consteval` отличается от `constexpr`?

**Ответ:** `constexpr`-функция гибридна (может исполняться и в runtime, и в compile-time в зависимости от контекста). Функция `consteval` принципиально не может существовать или вызываться во время выполнения программы.

**Пример:**

```cpp
constexpr int f_expr(int x) { return x; }
consteval int f_eval(int x) { return x; }

void check(int runtime_var) {
    f_expr(runtime_var); // OK
    // f_eval(runtime_var); // Ошибка компиляции!
}
```

**Источник:** [Cppreference: consteval specifier](https://en.cppreference.com/w/cpp/language/consteval)

62. Когда `consteval` удобнее `constexpr`?

**Ответ:** Когда для корректности или безопасности критично, чтобы вызов не «утек» в runtime: например, при валидации SQL-инъекций в строках форматов, генерации хешей доступа, или парсинге `std::format`.

**Пример:**

```cpp
#include <string_view>

consteval void validate_format(std::string_view fmt) {
    // Если формат невалиден - кидаем ошибку компиляции
}
```

**Источник:** [Cppreference: consteval specifier](https://en.cppreference.com/w/cpp/language/consteval)

63. Почему `consteval` гарантирует вычисление именно на этапе компиляции?

**Ответ:** Стандарт C++ предписывает компилятору требовать, чтобы контекст каждого вызова immediate-функции являлся константным подвыражением; компилятор не генерирует обычный машинный код вызова функции для runtime.

**Пример:**

```cpp
consteval int get_magic() { return 0xBEEF; }
int x = get_magic(); // Гарантированно подставится литерал 0xBEEF
```

**Источник:** [Cppreference: consteval specifier](https://en.cppreference.com/w/cpp/language/consteval)

64. Что такое `constinit`-переменная?

**Ответ:** Это статическая (`static`) или потоковая (`thread_local`) переменная, для которой компилятор гарантирует выполнение статической инициализации константным выражением до начала выполнения любого другого кода.

**Пример:**

```cpp
constinit static int counter = 0; // Инициализируется на этапе компиляции
```

**Источник:** [Cppreference: constinit specifier](https://en.cppreference.com/w/cpp/language/constinit)

65. Чем `constinit` отличается от `constexpr`?

**Ответ:** `constexpr` делает переменную константной (неизменяемой в дальнейшем). `constinit` гарантирует только константную инициализацию, оставляя саму переменную изменяемой (мутабельной) во время выполнения программы.

**Пример:**

```cpp
constinit static int state = 100;
void change() {
    state = 200; // Разрешено! (с constexpr было бы запрещено)
}
```

**Источник:** [Cppreference: constinit specifier](https://en.cppreference.com/w/cpp/language/constinit)

66. Для чего нужен `constinit` у глобальных или статических объектов?

**Ответ:** Для предотвращения проблемы Static Initialization Order Fiasco: он гарантирует, что глобальный объект инициализируется еще на этапе сборки/загрузки, исключая обращение к неинициализированной памяти из других единиц трансляции.

**Пример:**

```cpp
struct Config { int port; };
constinit Config server_cfg{8080}; // Гарантированно готов до запуска main()
```

**Источник:** [Cppreference: constinit specifier](https://en.cppreference.com/w/cpp/language/constinit)

67. Что такое constant initialization?

**Ответ:** Это форма статической инициализации, при которой глобальные или статические переменные заполняются фиксированными значениями на этапе компиляции/загрузки до выполнения любого динамического кода программы.

**Пример:**

```cpp
static int global_val = 10 * 5; // Constant initialization
```

**Источник:** [Cppreference: Constant initialization](https://en.cppreference.com/w/cpp/language/constant_initialization)

68. Что такое dynamic initialization?

**Ответ:** Это инициализация статических или глобальных переменных во время выполнения программы (например, вызовом нетривиального конструктора или runtime-функции) при старте до вызова функции `main()`.

**Пример:**

```cpp
int init_func();
int dynamic_global = init_func(); // Dynamic initialization в рантайме
```

**Источник:** [Cppreference: Initialization](https://en.cppreference.com/w/cpp/language/initialization)

69. Почему порядок инициализации глобальных объектов важен даже в compile-time-теме?

**Ответ:** Порядок динамической инициализации между различными единицами трансляции (`.cpp` файлами) стандартом не определен. Перенос инициализации в compile-time исключает гонки и неопределенное поведение при межмодульных зависимостях.

**Пример:**

```cpp
// File A.cpp: int val = 5;
// File B.cpp: int another = val * 2; // Опасность чтения мусора, если val не constexpr/constinit
```

**Источник:** [Cppreference: Initialization order](https://en.cppreference.com/w/cpp/language/initialization)

70. Что такое static initialization order fiasco?

**Ответ:** Это баг в C++, когда объект в одной единице трансляции обращается к глобальному объекту из другой единицы трансляции во время динамической инициализации до того, как второй объект успел проинициализироваться.

**Пример:**

```cpp
// Logger.cpp: Logger g_logger;
// Client.cpp: int init = g_logger.log("start"); // UB, если g_logger еще не сконструирован
```

**Источник:** [Cppreference: Initialization](https://en.cppreference.com/w/cpp/language/initialization)

71. Как `constexpr` и `constinit` помогают уменьшить проблемы с инициализацией?

**Ответ:** Они принуждают компилятор выполнить инициализацию на этапе сборки (zero/constant initialization). Такие переменные физически размещаются в бинарном файле с готовыми значениями и не подвержены проблеме порядка инициализации.

**Пример:**

```cpp
constinit static int safe_state = 42; // Готов всегда до входа в любые функции
```

**Источник:** [Cppreference: constinit specifier](https://en.cppreference.com/w/cpp/language/constinit)

72. Что такое значение, пригодное для использования в контексте constant expression?

**Ответ:** Это литерал, константа перечисления или `constexpr`/`const` объект интегрального/литерального типа, инициализированный константным выражением, значение которого доступно компилятору в текущей точке программы.

**Пример:**

```cpp
const int x = 12; // Пригодно для constant expression
int arr[x];       // Валидный массив фиксированного размера
```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression)

73. Что такое integral constant expression?

**Ответ:** Это выражение целочисленного типа или типа перечисления, которое может быть полностью вычислено во время компиляции (используется для размеров битовых полей, параметров шаблонов, перечислений).

**Пример:**

```cpp
struct BitField {
    int field : (4 + 2); // 6 - integral constant expression
};
```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression)

74. Почему размеры массивов часто должны быть compile-time-константами?

**Ответ:** Размер массива на стеке должен быть известен транслятору для корректного резервирования памяти в кадре стека функции и генерации машинных инструкций со статическими смещениями адресов (VLA не входят в стандарт C++).

**Пример:**

```cpp
constexpr size_t N = 16;
int stack_array[N]; // Память рассчитывается при компиляции
```

**Источник:** [Cppreference: Array declaration](https://en.cppreference.com/w/cpp/language/array)

75. Что такое `switch case` constant expression?

**Ответ:** Это метка `case` внутри оператора `switch`: стандарт языка жестко требует, чтобы значение за меткой `case` было целочисленным константным выражением, известным компилятору.

**Пример:**

```cpp
constexpr int CMD_START = 1;
switch (cmd) {
    case CMD_START: // Обязано быть compile-time константой
        break;
}
```

**Источник:** [Cppreference: switch statement](https://en.cppreference.com/w/cpp/language/switch)

76. Почему метки `case` должны быть известны на этапе компиляции?

**Ответ:** Это необходимо компилятору для оптимизации управляющей логики: построения статических таблиц переходов (_jump tables_) или бинарного поиска инструкций без последовательных цепочек сравнения `cmp`.

**Пример:**

```cpp
// Компилятор может превратить switch в быстрый косвенный переход по таблице адресов
```

**Источник:** [Cppreference: switch statement](https://en.cppreference.com/w/cpp/language/switch)

77. Как `static_assert` помогает документировать требования к типам и значениям?

**Ответ:** Он делает неявные архитектурные требования к типам явными и машиночитаемыми, гарантируя, что нарушение любого предусловия будет остановлено при попытке компиляции с выводом понятного пояснения.

**Пример:**

```cpp
template <typename T>
struct RingBuffer {
    static_assert(sizeof(T) <= 256, "Тип T слишком велик для размещения в буфере");
};
```

**Источник:** [Cppreference: static_assert declaration](https://en.cppreference.com/w/cpp/language/static_assert)

78. Что такое сообщение в `static_assert`?

**Ответ:** Это строка-литерал (начиная с C++11; в C++26 расширено пользовательскими compile-time строками), передаваемая вторым параметром, которая распечатывается в терминал компилятора при нарушении проверяемого условия. Начиная с C++17 сообщение опционально.

**Пример:**

```cpp
static_assert(sizeof(int) >= 4, "Требуется 32-битный int как минимум");
static_assert(sizeof(short) == 2); // Начиная с C++17 без явного сообщения
```

**Источник:** [Cppreference: static_assert declaration](https://en.cppreference.com/w/cpp/language/static_assert)

79. Почему `static_assert` полезен для шаблонного кода?

**Ответ:** Он защищает от нечитаемых многостраничных ошибок инстанцирования в глубине шаблонных библиотек, позволяя разработчику выдать лаконичную и понятную причину сбоя прямо на входе в интерфейс шаблона.

**Пример:**

```cpp
template <typename T>
void send(T val) {
    static_assert(std::is_default_constructible_v<T>, "T обязан иметь конструктор по умолчанию!");
}
```

**Источник:** [Cppreference: static_assert](https://en.cppreference.com/w/cpp/language/static_assert)

80. Что такое зависимое условие в `static_assert` внутри шаблона?

**Ответ:** Это логическое выражение, результат которого напрямую зависит от параметров шаблона (типов или значений), поэтому компилятор вычисляет его только во время фактического инстанцирования шаблона с конкретными аргументами, а не при первом синтаксическом разборе.

**Пример:**

```cpp
template <typename T>
void func() {
    static_assert(sizeof(T) > 0); // Зависимое условие: вычисляется при подстановке T
}
```

**Источник:** [Cppreference: Dependent names](https://en.cppreference.com/w/cpp/language/dependent_name)

81. Почему `static_assert(false)` внутри шаблона может быть проблемой?

**Ответ:** Согласно стандарту до C++23 (DR), если `static_assert` не зависит от параметров шаблона, компилятор имеет право остановить сборку сразу при разборе шаблона (в первой фазе two-phase lookup), даже если этот шаблон ни разу не инстанцировался.

**Пример:**

```cpp
template <typename T>
void bad_handler() {
    // static_assert(false, "Fail"); // Может упасть даже без вызова bad_handler<int>()
}
```

**Источник:** [Cppreference: static_assert declaration](https://en.cppreference.com/w/cpp/language/static_assert)

82. Что такое идиома `dependent_false<T>`?

**Ответ:** Это шаблонный хак, делающий булеву константу `false` зависимой от типового параметра шаблона `T`, что заставляет компилятор отложить проверку `static_assert` до момента реального инстанцирования ветви.

**Пример:**

```cpp
template <typename T>
struct dependent_false : std::false_type {};

template <typename T>
constexpr bool dependent_false_v = dependent_false<T>::value;
```

**Источник:** [Cppreference: static_assert](https://en.cppreference.com/w/cpp/language/static_assert)

83. Для чего используют `dependent_false<T>`?

**Ответ:** Для генерации ошибки компиляции внутри невыбранных веток `if constexpr` или дефолтных шаблонных обработчиков только тогда, когда неподдерживаемый тип был фактически передан в функцию.

**Пример:**

```cpp
template <typename T>
void process(T val) {
    if constexpr (std::is_integral_v<T>) {
        // ...
    } else {
        static_assert(dependent_false_v<T>, "Тип не поддерживается!");
    }
}
```

**Источник:** [Cppreference: static_assert](https://en.cppreference.com/w/cpp/language/static_assert)

84. Что такое `noexcept(expr)` как вычисление на этапе компиляции?

**Ответ:** Это оператор времени компиляции (не путать со спецификатором `noexcept`), проверяющий, может ли потенциально выражение `expr` выбросить исключение, и возвращающий результат типа `bool` на этапе сборки.

**Пример:**

```cpp
void safe() noexcept;
void risky();

static_assert(noexcept(safe()) == true);
static_assert(noexcept(risky()) == false);
```

**Источник:** [Cppreference: noexcept operator](https://en.cppreference.com/w/cpp/language/noexcept)

85. Почему выражение `noexcept(expr)` само по себе является compile-time-информацией?

**Ответ:** Оператор анализирует только статическую информацию: спецификаторы `noexcept` вызываемых функций и типы операций без выполнения тела функции, поэтому результат формируется исключительно компилятором.

**Пример:**

```cpp
constexpr bool can_throw = !noexcept(1 + 2); // false
```

**Источник:** [Cppreference: noexcept operator](https://en.cppreference.com/w/cpp/language/noexcept)

86. Что такое feature-test macros?

**Ответ:** Это стандартизированный набор макросов препроцессора (вида `__cpp_*`), определенных стандартной библиотекой и языком, позволяющих проверить поддержку конкретных возможностей языка и библиотек компилятором.

**Пример:**

```cpp
#include <version>

#if defined(__cpp_concepts) && __cpp_concepts >= 201907L
// Поддержка концептов C++20 гарантирована
#endif
```

**Источник:** [Cppreference: Feature testing](https://en.cppreference.com/w/cpp/feature_test)

87. Для чего нужны `__cpp_*` макросы?

**Ответ:** Они позволяют писать переносимый код под разные компиляторы и версии стандартов, подключая современные фичи (например, `constexpr`-векторы или concepts) там, где они поддерживаются, и используя fallback-решения там, где поддержки еще нет.

**Пример:**

```cpp
#if __cpp_constexpr >= 201304L
    // C++14 свободный constexpr
#endif
```

**Источник:** [Cppreference: Feature testing](https://en.cppreference.com/w/cpp/feature_test)

88. Как проверить поддержку языковой возможности на этапе компиляции?

**Ответ:** Через проверку наличия и числовой версии соответствующего feature-test макроса в препроцессоре после включения системного заголовка `<version>`.

**Пример:**

```cpp
#include <version>

#ifdef __cpp_lib_format
#include <format>
#endif
```

**Источник:** [Cppreference: Feature testing](https://en.cppreference.com/w/cpp/feature_test)

89. Что такое условная компиляция?

**Ответ:** Это директивы препроцессора (`#if`, `#ifdef`, `#ifndef`), позволяющие включать или исключать фрагменты исходного текста из передачи в компилятор на основе платформенных дефайнов или опций сборщика.

**Пример:**

```cpp
#ifdef _WIN32
    void platformInit() { /* Windows */ }
#else
    void platformInit() { /* POSIX */ }
#endif
```

**Источник:** [Cppreference: Conditional inclusion](https://en.cppreference.com/w/cpp/preprocessor/conditional)

90. Чем условная компиляция через препроцессор отличается от `if constexpr`?

**Ответ:** Препроцессор работает до трансляции кода: он просто вырезает текст, игнорируя синтаксис C++, типы и области видимости. `if constexpr` — конструкция самого языка C++: обе ветви проверяются на корректность синтаксиса и соблюдают систему типов C++.

**Пример:**

```cpp
// Препроцессор: не знает ничего о типах
// if constexpr: проверяет условия свойств типов из C++
template <typename T>
void f() {
    if constexpr (std::is_integral_v<T>) { /* валидируется семантически */ }
}
```

**Источник:** [Cppreference: if constexpr](https://en.cppreference.com/w/cpp/language/if#Constexpr_if)

91. Что делает препроцессор до этапа компиляции?

**Ответ:** Выполняет текстовую обработку файлов: удаляет комментарии, вставляет содержимое заголовочных файлов (`#include`), раскрывает макроопределения (`#define`) и фильтрует фрагменты текста согласно директивам условной компиляции.

**Пример:**

```cpp
#define MULTIPLY(a, b) ((a) * (b)) // Текстовая подстановка до компиляции
```

**Источник:** [Cppreference: Preprocessor](https://en.cppreference.com/w/cpp/preprocessor)

92. Почему препроцессор не равен compile-time-вычислению языка C++?

**Ответ:** Препроцессор работает с потоком текстовых токенов до построения абстрактного синтаксического дерева (AST): он не понимает систему типов C++, области видимости, шаблоны, константные выражения и правила вычисления языка.

**Пример:**

```cpp
// Препроцессор не может проверить sizeof(T) или std::is_same_v<T, U>
```

**Источник:** [Cppreference: Preprocessor](https://en.cppreference.com/w/cpp/preprocessor)

93. Что такое `#if`, `#ifdef`, `#elif`?

**Ответ:** Директивы условной компиляции препроцессора: `#if` проверяет константное целочисленное макровыражение, `#ifdef` проверяет факт объявления идентификатора макроса, а `#elif` задает альтернативную ветку проверки.

**Пример:**

```cpp
#define LEVEL 2
#if LEVEL > 1
int debug_mode = 1;
#elif LEVEL == 1
int debug_mode = 0;
#endif
```

**Источник:** [Cppreference: Conditional inclusion](https://en.cppreference.com/w/cpp/preprocessor/conditional)

94. Когда уместнее `#if`, а когда `if constexpr`?

**Ответ:** `#if` применяется для платформозависимых заголовков, флагов компилятора и внешних макросов; `if constexpr` используется внутри функций и методов для ветвления по свойствам типов, параметрам шаблонов и constexpr-значениям.

**Пример:**

```cpp
#if defined(__linux__)
    // Только тут есть <sys/epoll.h>
#endif

template <typename T>
void act() {
    if constexpr (sizeof(T) == 4) {} // Ветвление внутри C++
}
```

**Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if#Constexpr_if)

95. Что такое compile-time типобезопасность?

**Ответ:** Это свойство языка C++, при котором несовместимость операций над типами данных отслеживается компилятором, делая невозможным запуск программы с некорректным использованием интерфейсов.

**Пример:**

```cpp
struct Seconds { int val; };
struct Meters { int val; };

void set_speed(Meters m, Seconds s);
// set_speed(Seconds{10}, Meters{100}); // Ошибка компиляции (не перепутать аргументы)
```

**Источник:** [Cppreference: Type support](https://en.cppreference.com/w/cpp/types)

96. Почему шаблоны позволяют переносить часть ошибок из runtime в compile time?

**Ответ:** Они вычисляют результирующие типы и контракты для каждого конкретного набора параметров при сборке, заменяя динамические проверки (например, динамическое приведение типов `dynamic_cast`) строгим статическим соответствием.

**Пример:**

```cpp
template <typename T>
void serialize(const T& obj) {
    static_assert(std::is_class_v<T>, "Ошибочный вызов с примитивным типом отловлен при сборке");
}
```

**Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates)

97. Что такое compile-time-проверка интерфейса типа?

**Ответ:** Это проверка (через concepts, SFINAE или expressions), что пользовательский тип данных реализует требуемый набор методов, операторов или вложенных типов, до генерации результирующего бинарного кода функции.

**Пример:**

```cpp
template <typename T>
requires requires(T a, T b) { a + b; }
T add(T x, T y) { return x + y; }
```

**Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints)

98. Что такое template instantiation?

**Ответ:** Процесс генерации компилятором реального кода класса или функции из шаблона на основе переданных конкретных шаблонных аргументов (_инстанцирование_).

**Пример:**

```cpp
template <typename T>
struct Box { T value; };

Box<int> b; // Инстанцируется конкретный класс Box<int>
```

**Источник:** [Cppreference: Template instantiation](https://en.cppreference.com/w/cpp/language/template_specialization)

99. Когда компилятор инстанцирует шаблон?

**Ответ:** При неявном инстанцировании — в момент первого обращения к шаблону, когда требуется определить полный тип объекта или сгенерировать вызов функции. При явном — по специальной директиве разработчика (`template class Box<int>;`).

**Пример:**

```cpp
template <typename T> void print(T) {}

int main() {
    print(5); // Неявное инстанцирование print<int>(int)
}
```

**Источник:** [Cppreference: Template instantiation](https://en.cppreference.com/w/cpp/language/template_specialization)

100. Почему реализация шаблона должна быть доступна компилятору при инстанцировании?

**Ответ:** Поскольку компилятор генерирует машинный код под каждую комбинацию параметров заново, ему необходимо видеть полное определение тела функции или класса прямо в текущей единице трансляции (поэтому шаблоны обычно объявляются и реализуются в заголовочных файлах `.hpp`).

**Пример:**

```cpp
// В Header.hpp размещают и декларацию, и реализацию:
template <typename T>
T get_max(T a, T b) { return a > b ? a : b; }
```

**Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates)

## Средний уровень

101. Что такое compile-time programming в современном C++?

**Ответ:** Это парадигма разработки, при которой часть логики, проверок, структур данных и вычислений выполняется компилятором во время сборки с использованием `constexpr`, `consteval`, шаблонов и концептов.

**Пример:**

```cpp
template <auto V>
constexpr auto value_v = V;

```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression?utm_source=gemini)

102. Чем compile-time programming отличается от классического template metaprogramming?

**Ответ:** Классический TMP опирается на побочные эффекты системы типов (рекурсивные специализации структур, SFINAE), напоминая функциональный язык. Современный compile-time programming использует привычный императивный синтаксис (циклы `for`, ветвления `if`, локальные переменные в `constexpr`/`consteval`).

**Пример:**

```cpp
constexpr int sum_modern(int n) {
    int s = 0;
    for (int i = 1; i <= n; ++i) s += i;
    return s;
}

```

**Источник:** [Cppreference: constexpr specifier](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

103. Почему современный C++ всё чаще использует `constexpr`, а не только TMP-рекурсию?

**Ответ:** Код на `constexpr` значительно легче читать, писать и отлаживать; он компилируется быстрее за счет меньшего числа инстанцирований шаблонов и не раздувает стек компилятора.

**Пример:**

```cpp
constexpr int fact(int n) {
    return (n <= 1) ? 1 : n * fact(n - 1);
}

```

**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

104. Что такое рекурсия шаблонов?

**Ответ:** Идиома метапрограммирования, где шаблон структуры ссылается на экземпляр самого себя с измененными аргументами, пока не достигнет базового случая полной или частичной специализации.

**Пример:**

```cpp
template<int N> struct Fact { static constexpr int value = N * Fact<N - 1>::value; };
template<> struct Fact<0> { static constexpr int value = 1; };

```

**Источник:** [Cppreference: Class template specialization](https://en.cppreference.com/w/cpp/language/template_specialization?utm_source=gemini)

105. Как выглядело классическое compile-time-вычисление до появления богатого `constexpr`?

**Ответ:** Оно реализовывалось через `struct` с вложенными `enum` или `static const int` константами и явной рекурсивной специализацией шаблонов классов.

**Пример:**

```cpp
template <int N>
struct Fib {
    enum { val = Fib<N-1>::val + Fib<N-2>::val };
};
template <> struct Fib<0> { enum { val = 0 }; };
template <> struct Fib<1> { enum { val = 1 }; };

```

**Источник:** [Cppreference: Template Metaprogramming History](https://en.cppreference.com/w/cpp/language/templates?utm_source=gemini)

106. Что такое метафункция в шаблонном стиле?

**Ответ:** Это шаблон класса, принимающий типы или нетиповые параметры в качестве входных аргументов и возвращающий результат через свои вложенные типы (`::type`) или константы (`::value`).

**Пример:**

```cpp
template <typename T>
struct AddConst {
    using type = const T;
};

```

**Источник:** [Cppreference: Type traits](https://en.cppreference.com/w/cpp/types?utm_source=gemini)

107. Почему шаблон класса может играть роль функции на этапе компиляции?

**Ответ:** Шаблон класса принимает аргументы на этапе трансляции, осуществляет вычисления на основе сопоставления образцов (специализаций) и публикует возвращаемое значение через публичные члены.

**Пример:**

```cpp
template <typename T>
struct Identity { using type = T; };
using Res = Identity<int>::type;

```

**Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates?utm_source=gemini)

108. Что такое вложенный `::value` в метафункции?

**Ответ:** Традиционное соглашение по именованию статичного константного поля структуры, которое возвращает вычисленное значение (обычно логическое или числовое).

**Пример:**

```cpp
template <typename T>
struct IsPointer { static constexpr bool value = false; };
template <typename T>
struct IsPointer<T*> { static constexpr bool value = true; };

```

**Источник:** [Cppreference: std::integral_constant](https://en.cppreference.com/w/cpp/types/integral_constant?utm_source=gemini)

109. Что такое вложенный `::type` в метафункции?

**Ответ:** Традиционное соглашение по именованию типа-псевдонима (`using` или `typedef`), служащего результатом преобразования типов метафункцией.

**Пример:**

```cpp
template <typename T>
struct RemovePointer { using type = T; };
template <typename T>
struct RemovePointer<T*> { using type = T; };

```

**Источник:** [Cppreference: Type support](https://en.cppreference.com/w/cpp/types?utm_source=gemini)

110. Чем метафункции, возвращающие тип, отличаются от метафункций, возвращающих значение?

**Ответ:** Метафункции первого вида оперируют в пространстве типов и экспортируют `using type = ...`, а метафункции второго вида оперируют данными и экспортируют `static constexpr auto value = ...`.

**Пример:**

```cpp
using TypeRes = std::remove_reference<int&>::type; // Возвращает тип int
constexpr bool ValRes = std::is_integral<int>::value; // Возвращает bool true

```

**Источник:** [Cppreference: type traits](https://en.cppreference.com/w/cpp/types?utm_source=gemini)

111. Что делает `std::conditional`?

**Ответ:** Предоставляет compile-time аналог тернарного оператора для типов: если булево условие `true`, его член `type` становится `T`, иначе `F`.

**Пример:**

```cpp
#include <type_traits>
using Chosen = std::conditional<true, int, double>::type; // int

```

**Источник:** [Cppreference: std::conditional](https://en.cppreference.com/w/cpp/types/conditional?utm_source=gemini)

112. Что делает `std::conditional_t`?

**Ответ:** Вспомогательный шаблон-псевдоним (C++14), сокращающий обращение к вложенному члену `typename std::conditional<B, T, F>::type`.

**Пример:**

```cpp
#include <type_traits>
using Type = std::conditional_t<sizeof(void*) == 8, std::uint64_t, std::uint32_t>;

```

**Источник:** [Cppreference: std::conditional](https://en.cppreference.com/w/cpp/types/conditional?utm_source=gemini)

113. Что делает `std::enable_if`?

**Ответ:** Предоставляет тип `type`, только если константное условие истинно. Если условие ложно, вложенный `type` отсутствует, что провоцирует SFINAE.

**Пример:**

```cpp
#include <type_traits>
template <typename T>
typename std::enable_if<std::is_integral_v<T>, void>::type foo(T) {}

```

**Источник:** [Cppreference: std::enable_if](https://en.cppreference.com/w/cpp/types/enable_if?utm_source=gemini)

114. Почему `std::enable_if` считают старым, но всё ещё важным инструментом compile-time-ограничений?

**Ответ:** С C++20 его вытеснили `concepts` и `requires`, но `enable_if` фундаментально важен для поддержки библиотек старых стандартов (C++11/14/17) и понимания механики SFINAE.

**Пример:**

```cpp
template <typename T, typename = std::enable_if_t<std::is_floating_point_v<T>>>
void calculate(T val) {}

```

**Источник:** [Cppreference: std::enable_if](https://en.cppreference.com/w/cpp/types/enable_if?utm_source=gemini)

115. Что такое SFINAE?

**Ответ:** Принцип компилятора C++, согласно которому неудачная попытка подстановки шаблонных аргументов не порождает ошибку компиляции, а просто исключает данную перегрузку из списка кандидатов.

**Пример:**

```cpp
template <typename T>
auto f(T t) -> decltype(t.clear(), void()) {} // Активно только если есть .clear()
void f(...) {} // Резервная перегрузка

```

**Источник:** [Cppreference: SFINAE](https://en.cppreference.com/w/cpp/language/sfinae?utm_source=gemini)

116. Как расшифровывается SFINAE?

**Ответ:** **S**ubstitution **F**ailure **I**s **N**ot **A**n **E**rror («Неудача при подстановке — не ошибка»).

**Пример:**

```cpp
// Трактуется как штатное поведение overload resolution

```

**Источник:** [Cppreference: SFINAE](https://en.cppreference.com/w/cpp/language/sfinae?utm_source=gemini)

117. В чём идея “substitution failure is not an error”?

**Ответ:** Дать возможность автору перегрузок определять шаблоны под специфичные свойства типов, не приводя к падению сборки, если тип для другой перегрузки не содержит нужного поля или метода.

**Пример:**

```cpp
template <typename T>
auto serialize(T& t) -> decltype(t.serialize()) { return t.serialize(); }

```

**Источник:** [Cppreference: SFINAE](https://en.cppreference.com/w/cpp/language/sfinae?utm_source=gemini)

118. Как SFINAE влияет на выбор перегрузки на этапе компиляции?

**Ответ:** Во время этапа overload resolution невалидные специализации отбрасываются, и компилятор беспрепятственно выбирает наиболее подходящего кандидата из оставшихся.

**Пример:**

```cpp
template <typename T, std::enable_if_t<std::is_integral_v<T>, int> = 0>
void process(T) {}
template <typename T, std::enable_if_t<!std::is_integral_v<T>, int> = 0>
void process(T) {}

```

**Источник:** [Cppreference: Overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution?utm_source=gemini)

119. Чем SFINAE отличается от обычной ошибки компиляции?

**Ответ:** Ошибка в немедленном контексте подстановки (заголовке шаблона/сигнатуре) отбрасывает функцию (SFINAE). Ошибка внутри уже инстанцированного тела функции приводит к безусловному сбою компиляции (Hard Error).

**Пример:**

```cpp
template <typename T>
void bad(T t) {
    t.non_existent(); // Hard error при инстанцировании тела, не SFINAE!
}

```

**Источник:** [Cppreference: SFINAE](https://en.cppreference.com/w/cpp/language/sfinae?utm_source=gemini)

120. Что такое detection idiom?

**Ответ:** Паттерн TMP, использующий SFINAE и невычисляемый контекст для детекции наличия определенных членов, типов, операций или операторов у типа `T`.

**Пример:**

```cpp
template <typename, typename = void>
struct has_type_member : std::false_type {};

template <typename T>
struct has_type_member<T, T::value_type std::void_t<typename>> : std::true_type {};

```

**Источник:** [Cppreference: Detection Idiom](https://en.cppreference.com/w/cpp/experimental/is_detected?utm_source=gemini)

121. Для чего нужен detection idiom?

**Ответ:** Чтобы адаптировать логику обобщенных алгоритмов под возможности переданного типа: например, использовать метод `.reserve()`, если он присутствует у контейнера.

**Пример:**

```cpp
template <typename Container>
void try_reserve(Container& c, std::size_t n) {
    if constexpr (requires { c.reserve(n); }) {
        c.reserve(n);
    }
}

```

**Источник:** [Cppreference: std::void_t](https://en.cppreference.com/w/cpp/types/void_t?utm_source=gemini)

122. Что такое `std::void_t`?

**Ответ:** Утилитный шаблонный псевдоним (C++17), отображающий любой набор типов в тип `void`. Незаменим для лаконичной реализации SFINAE-проверок.

**Пример:**

```cpp
#include <type_traits>
template <typename... Ts>
using void_t = void;

```

**Источник:** [Cppreference: std::void_t](https://en.cppreference.com/w/cpp/types/void_t?utm_source=gemini)

123. Как `void_t` помогает обнаруживать свойства типов?

**Ответ:** Если проверяемое выражение внутри `std::void_t<...>` невалидно для типа, происходит ошибка подстановки (SFINAE), и специализация отбрасывается в пользу общей ветки `false_type`.

**Пример:**

```cpp
template <typename T, typename = void>
struct has_size : std::false_type {};

template <typename T>
struct has_size<T, std::void_t<decltype(std::declval<T>().size())>> : std::true_type {};

```

**Источник:** [Cppreference: std::void_t](https://en.cppreference.com/w/cpp/types/void_t?utm_source=gemini)

124. Как проверить существование вложенного типа на этапе компиляции?

**Ответ:** В современном C++20 — через `requires { typename T::type; }`, а в C++17 — через специализацию с `std::void_t<typename T::type>`.

**Пример:**

```cpp
template <typename T>
concept HasValueType = requires {
    typename T::value_type;
};

```

**Источник:** [Cppreference: Requires expression](https://en.cppreference.com/w/cpp/language/requires?utm_source=gemini)

125. Как проверить существование метода у типа на этапе компиляции?

**Ответ:** Проще всего через `requires`-выражение C++20, передав фиктивный вызов метода с параметрами.

**Пример:**

```cpp
template <typename T>
concept Printable = requires(T t) {
    t.print();
};

```

**Источник:** [Cppreference: Requires expression](https://en.cppreference.com/w/cpp/language/requires?utm_source=gemini)

126. Как проверить поддержку оператора `+` у типа?

**Ответ:** Проверить валидность выражения `a + b` через концепт или `std::is_invocable` со `std::plus`.

**Пример:**

```cpp
template <typename T>
concept Addable = requires(T a, T b) {
    a + b;
};

```

**Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints?utm_source=gemini)

127. Что такое compile-time introspection?

**Ответ:** Способность программы на C++ исследовать свойства типов (наличие методов, операторов, конструкторов) на этапе компиляции без привлечения runtime-структур.

**Пример:**

```cpp
static_assert(std::is_copy_constructible_v<int>);

```

**Источник:** [Cppreference: Type traits](https://en.cppreference.com/w/cpp/types?utm_source=gemini)

128. Чем compile-time introspection отличается от RTTI?

**Ответ:** Compile-time интроспекция выполняется компилятором без оверхеда в бинарнике и работает с конкретными типами шаблонов, тогда как RTTI (`typeid`, `dynamic_cast`) требует виртуальных таблиц в runtime.

**Пример:**

```cpp
// Compile-time
constexpr bool b = std::is_polymorphic_v<int>;

```

**Источник:** [Cppreference: RTTI](https://en.cppreference.com/w/cpp/language/typeid?utm_source=gemini)

129. Почему `typeid` — не то же самое, что type traits?

**Ответ:** `typeid` возвращает структуру `std::type_info` во время выполнения, чье имя компиляторо-зависимо. Type traits вычисляются строго в compile-time и позволяют ветвить логику компиляции.

**Пример:**

```cpp
#include <typeinfo>
auto name = typeid(int).name(); // Runtime
constexpr bool same = std::is_same_v<int, int>; // Compile-time

```

**Источник:** [Cppreference: typeid operator](https://en.cppreference.com/w/cpp/language/typeid?utm_source=gemini)

130. Что такое `std::declval`?

**Ответ:** Утилитарная функция, возвращающая rvalue-ссылку на тип `T`, позволяющая имитировать экземпляр объекта в невычисляемых контекстах без реального вызова его конструктора.

**Пример:**

```cpp
#include <utility>
using RetType = decltype(std::declval<std::string>().size());

```

**Источник:** [Cppreference: std::declval](https://en.cppreference.com/w/cpp/utility/declval?utm_source=gemini)

131. Для чего нужен `std::declval` в невычисляемом контексте?

**Ответ:** Чтобы вызывать методы или применять операторы к типам, которые не имеют конструктора по умолчанию либо вовсе некопируемы/неперемещаемы.

**Пример:**

```cpp
struct NonDefault {
    NonDefault(int) {}
    int get() { return 1; }
};
using Val = decltype(std::declval<NonDefault>().get());

```

**Источник:** [Cppreference: std::declval](https://en.cppreference.com/w/cpp/utility/declval?utm_source=gemini)

132. Почему `std::declval` нельзя реально вызывать во время выполнения?

**Ответ:** `std::declval` не имеет реализации (только объявление) и содержит `static_assert(false)` при фактической кодогенерации, поэтому runtime-вызов приведет к ошибке линковки или компиляции.

**Пример:**

```cpp
// auto x = std::declval<int>(); // Ошибка сборки!

```

**Источник:** [Cppreference: std::declval](https://en.cppreference.com/w/cpp/utility/declval?utm_source=gemini)

133. Что такое невычисляемый контекст?

**Ответ:** Контекст C++, в котором выражения анализируются компилятором исключительно ради получения их типов или размеров, но машинный код для них не генерируется (`sizeof`, `decltype`, `noexcept`, `typeid`, `requires`).

**Пример:**

```cpp
int* p = nullptr;
decltype(*p) ref = *p; // Разыменования в runtime не происходит!

```

**Источник:** [Cppreference: Expressions: Unevaluated operands](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/expressions%2523Unevaluated_operands&utm_source=gemini)

134. Что такое `requires`-expression?

**Ответ:** Конструкция C++20, производящая `bool`-значение на этапе компиляции на основе синтаксической валидности набора требований к типам или выражениям.

**Пример:**

```cpp
template <typename T>
concept HasToString = requires(T v) {
    { v.to_string() } -> std::same_as<std::string>;
};

```

**Источник:** [Cppreference: Requires expression](https://en.cppreference.com/w/cpp/language/requires?utm_source=gemini)

135. Чем `requires`-expression упрощает compile-time-проверку интерфейса?

**Ответ:** Оно заменяет сложные многострочные SFINAE-шаблоны лаконичным блоком кода, где перечисляются необходимые операции точно так, как они выглядели бы в коде.

**Пример:**

```cpp
template <typename T>
concept Summable = requires(T a, T b) { a + b; };

```

**Источник:** [Cppreference: Requires expression](https://en.cppreference.com/w/cpp/language/requires?utm_source=gemini)

136. Что такое concept?

**Ответ:** Именованный набор предикатов и синтаксических требований на этапе компиляции, используемый для ограничения параметров шаблона (C++20).

**Пример:**

```cpp
template <typename T>
concept Integral = std::is_integral_v<T>;

```

**Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints?utm_source=gemini)

137. Почему concepts считаются современным способом выражения compile-time-требований?

**Ответ:** Они встроены в ядро языка, проверяются быстрее SFINAE, читаются как спецификации интерфейсов и кардинально улучшают диагностику ошибок компилятора.

**Пример:**

```cpp
void run(std::integral auto x) {}

```

**Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints?utm_source=gemini)

138. Чем concepts лучше `enable_if` по читаемости?

**Ответ:** Избавляют сигнатуры функций от паразитных параметров шаблона и метафункций преобразования типов, делая код чистым и самодокументируемым.

**Пример:**

```cpp
// concepts:
template <std::floating_point T>
void f(T);
// enable_if:
template <typename T, std::enable_if_t<std::is_floating_point_v<T>, int> = 0>
void f(T);

```

**Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints?utm_source=gemini)

139. Что такое constrained template?

**Ответ:** Шаблон, аргументы которого ограничены концептами или `requires`-условиями, делающими инстанцирование возможным только для подходящих типов.

**Пример:**

```cpp
template <typename T> requires std::copyable<T>
class Storage {};

```

**Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints?utm_source=gemini)

140. Как constraints влияют на выбор шаблонной перегрузки?

**Ответ:** Если подходят несколько перегрузок, компилятор производит subsumption-анализ: функция с более строгими (специфичными) ограничениями побеждает менее ограниченную.

**Пример:**

```cpp
template <typename T> void f(T);
template <std::integral T> void f(T); // Победит для int

```

**Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints?utm_source=gemini)

141. Что такое `if constexpr` в generic-коде?

**Ответ:** Инструкция условного ветвления времени компиляции, при которой невыбранная ветка полностью отбрасывается и не генерирует бинарный код.

**Пример:**

```cpp
template <typename T>
void print(T val) {
    if constexpr (std::is_pointer_v<T>) *val;
    else val;
}

```

**Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if?utm_source=gemini)

142. Почему `if constexpr` удобнее tag dispatch во многих случаях?

**Ответ:** Вся вариативная логика пишется в одной функции без необходимости создавать вспомогательные перегрузки функций и фиктивные структуры-теги.

**Пример:**

```cpp
template <typename T>
void advance(T& it, int n) {
    if constexpr (std::is_same_v<T, int*>) it += n;
    else while(n--) ++it;
}

```

**Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if?utm_source=gemini)

143. Что такое tag dispatch?

**Ответ:** Идиома выбора перегрузки функции времени компиляции, при которой в функцию передается фиктивный аргумент-тег (например, `std::random_access_iterator_tag()`).

**Пример:**

```cpp
void impl(int* it, std::random_access_iterator_tag);

```

**Источник:** [Cppreference: Tag dispatch](https://en.cppreference.com/w/cpp/iterator/iterator_tags?utm_source=gemini)

144. Чем tag dispatch отличается от `if constexpr`?

**Ответ:** Tag dispatch опирается на стандартный механизм overload resolution через отдельные функции, а `if constexpr` организует ветвление прямо внутри единого тела функции.

**Пример:**

```cpp
// if constexpr устраняет необходимость писать impl-функции

```

**Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if?utm_source=gemini)

145. Что такое compile-time branching по свойствам типа?

**Ответ:** Выбор альтернативных алгоритмов или структур данных на этапе компиляции на основе предикатов `type_traits` или `concepts`.

**Пример:**

```cpp
template <typename T>
auto get_value(T&& obj) {
    if constexpr (std::is_reference_v<T>) return std::ref(obj);
    else return obj;
}

```

**Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if?utm_source=gemini)

146. Что такое `std::is_same_v<T, U>` как условие для `if constexpr`?

**Ответ:** Булева константа, служащая условием ветвления compile-time `if`: блок кода компилируется только если типы `T` и `U` строго идентичны.

**Пример:**

```cpp
template <typename T>
void test() {
    if constexpr (std::is_same_v<T, void>) { /* ... */ }
}

```

**Источник:** [Cppreference: std::is_same](https://en.cppreference.com/w/cpp/types/is_same?utm_source=gemini)

147. Что такое variadic templates?

**Ответ:** Шаблоны с переменным числом аргументов (появились в C++11), позволяющие принимать произвольное количество типов или значений через параметр-пакет.

**Пример:**

```cpp
template <typename... Args>
void log_all(Args... args);

```

**Источник:** [Cppreference: Parameter pack](https://en.cppreference.com/w/cpp/language/parameter_pack?utm_source=gemini)

148. Что такое parameter pack?

**Ответ:** Шаблонный параметр (типовой, нетиповой или шаблонный), представляющий собой последовательность из нуля или более аргументов шаблона (`Ts...`).

**Пример:**

```cpp
template <typename... Elements>
struct Tuple {};

```

**Источник:** [Cppreference: Parameter pack](https://en.cppreference.com/w/cpp/language/parameter_pack?utm_source=gemini)

149. Что такое `sizeof...(Ts)`?

**Ответ:** Оператор этапа компиляции, возвращающий точное количество элементов в пакете параметров `Ts`.

**Пример:**

```cpp
template <typename... Ts>
constexpr std::size_t count = sizeof...(Ts);
static_assert(count<int, double> == 2);

```

**Источник:** [Cppreference: sizeof...](https://en.cppreference.com/w/cpp/language/sizeof...?utm_source=gemini)

150. Что такое fold expression?

**Ответ:** Механизм C++17, позволяющий свернуть пакет параметров по бинарному оператору без необходимости написания рекурсивных шаблонов.

**Пример:**

```cpp
template <typename... Args>
auto sum(Args... args) {
    return (... + args); // Унарная левая свертка
}

```

**Источник:** [Cppreference: Fold expression](https://en.cppreference.com/w/cpp/language/fold?utm_source=gemini)


## Выше среднего уровня

151. Чем fold expressions удобнее рекурсии по parameter pack?

**Ответ:** Fold expressions (C++17) заменяют громоздкую шаблонную рекурсию с базовыми случаями останова лаконичным синтаксисом свёртки операторов напрямую над пакетом параметров, значительно ускоряя время компиляции и снижая нагрузку на стек инстанцирования.

**Пример:**

```cpp
template <typename... Args>
auto sum(Args... args) {
    return (... + args); // Unary left fold: (((arg0 + arg1) + arg2) + ...)
}
```

**Источник:** [Cppreference: Fold expression](https://en.cppreference.com/w/cpp/language/fold?utm_source=gemini)

152. Что такое индексная последовательность?

**Ответ:** Индексная последовательность — это compile-time структура данных, представляющая собой пакет нетиповых целочисленных констант `size_t...` (обычно от 0 до N-1), упакованный в шаблонный тип для последующей распаковки в аргументы функций или методы индексации.

**Пример:**

```cpp
#include <utility>

template <std::size_t... Is>
void inspect_indices(std::index_sequence<Is...>) {
    // Is... доступен как пакет значений: 0, 1, 2, ...
}

```

**Источник:** [Cppreference: std::integer_sequence](https://en.cppreference.com/w/cpp/utility/integer_sequence?utm_source=gemini)

153. Для чего нужен `std::index_sequence`?

**Ответ:** `std::index_sequence` служит псевдонимом для `std::integer_sequence<std::size_t, ...>` и применяется в качестве тега в сигнатурах функций, позволяя с помощью pattern matching захватить непрерывный диапазон индексов и распаковать их через `...`.

**Пример:**

```cpp
#include <utility>
#include <iostream>

template <std::size_t... Is>
void print_indices(std::index_sequence<Is...>) {
    ((std::cout << Is << ' '), ...);
}

void run() {
    print_indices(std::make_index_sequence<4>{}); // 0 1 2 3
}

```

**Источник:** [Cppreference: std::integer_sequence](https://en.cppreference.com/w/cpp/utility/integer_sequence?utm_source=gemini)

154. Что такое `std::integer_sequence`?

**Ответ:** `std::integer_sequence` — это обобщённый шаблонный класс из заголовочного файла `<utility>`, представляющий фиксированную compile-time последовательность целых чисел произвольного целочисленного типа `T`.

**Пример:**

```cpp
#include <utility>

using IntSeq = std::integer_sequence<int, -2, -1, 0, 1, 2>;

```

**Источник:** [Cppreference: std::integer_sequence](https://en.cppreference.com/w/cpp/utility/integer_sequence?utm_source=gemini)

155. Как `index_sequence` помогает работать с `tuple` на этапе компиляции?

**Ответ:** Поскольку `std::get<I>(tuple)` требует compile-time константу `I`, `index_sequence` позволяет сгенерировать пакет индексов `0...N-1` и распаковать весь кортеж в аргументы вызова произвольной функции за одну операцию.

**Пример:**

```cpp
#include <tuple>
#include <utility>

template <typename Tuple, std::size_t... Is>
void call_impl(Tuple&& t, std::index_sequence<Is...>) {
    sink(std::get<Is>(std::forward<Tuple>(t))...);
}

template <typename Tuple>
void call(Tuple&& t) {
    constexpr auto size = std::tuple_size_v<std::decay_t<Tuple>>;
    call_impl(std::forward<Tuple>(t), std::make_index_sequence<size>{});
}

```

**Источник:** [Cppreference: std::apply](https://en.cppreference.com/w/cpp/utility/apply?utm_source=gemini)

156. Что такое tuple metaprogramming?

**Ответ:** Tuple metaprogramming — это техника метапрограммирования, использующая `std::tuple` как гетерогенный список значений или типов на этапе компиляции, реализующая над ним алгоритмы обхода, фильтрации, конкатенации и трансформации.

**Пример:**

```cpp
#include <tuple>
#include <type_traits>

auto t = std::make_tuple(1, 2.5, 'a');
auto cat = std::tuple_cat(t, std::make_tuple("str"));

```

**Источник:** [Cppreference: std::tuple](https://en.cppreference.com/w/cpp/utility/tuple?utm_source=gemini)

157. Что делает `std::tuple_size`?

**Ответ:** `std::tuple_size` — это шаблонная структура-трейт, возвращающая количество элементов в кортежеподобном типе (`std::tuple`, `std::pair`, `std::array`) во вложенной статической константе `value`.

**Пример:**

```cpp
#include <tuple>

using Target = std::tuple<int, double, char>;
constexpr std::size_t count = std::tuple_size_v<Target>; // 3

```

**Источник:** [Cppreference: std::tuple_size](https://en.cppreference.com/w/cpp/utility/tuple_size?utm_source=gemini)

158. Что делает `std::tuple_element`?

**Ответ:** `std::tuple_element` — это вспомогательный класс-трейт, который извлекает тип элемента с заданным индексом `I` из переданного типа кортежа.

**Пример:**

```cpp
#include <tuple>
#include <type_traits>

using T = std::tuple<int, double, std::string>;
static_assert(std::is_same_v<std::tuple_element_t<1, T>, double>);

```

**Источник:** [Cppreference: std::tuple_element](https://en.cppreference.com/w/cpp/utility/tuple_element?utm_source=gemini)

159. Как получить N-й тип из `tuple` на этапе компиляции?

**Ответ:** N-й тип извлекается с помощью псевдонима типа `std::tuple_element_t<N, TupleType>`, где `N` — целочисленная константа времени компиляции.

**Пример:**

```cpp
#include <tuple>

using MyTuple = std::tuple<float, int, char>;
using SecondType = std::tuple_element_t<1, MyTuple>; // int

```

**Источник:** [Cppreference: std::tuple_element](https://en.cppreference.com/w/cpp/utility/tuple_element?utm_source=gemini)

160. Что такое typelist?

**Ответ:** Typelist — это легковесный шаблонный тип без полей данных, служащий контейнером исключительно для пакета типов `Types...` на этапе компиляции.

**Пример:**

```cpp
template <typename... Ts>
struct TypeList {};

using MyTypes = TypeList<int, float, double>;

```

**Источник:** [Modern C++ Design: Typelists (Andrei Alexandrescu)](https://en.wikipedia.org/wiki/Modern_C++_Design?utm_source=gemini)

161. Как typelist моделирует список типов на этапе компиляции?

**Ответ:** Typelist моделирует неизменяемый список через шаблонную структуру, где каждый тип является элементом коллекции, а операции манипуляции со списком реализуются с помощью сопоставления с образцом (pattern matching) через специализации шаблонов.

**Пример:**

```cpp
template <typename Head, typename... Tail>
struct Front;

template <template <typename...> class TL, typename Head, typename... Tail>
struct Front<TL<Head, Tail...>> {
    using type = Head;
};

```

**Источник:** [Modern C++ Design: Generic Programming and Design Patterns Applied](https://en.wikipedia.org/wiki/Modern_C++_Design?utm_source=gemini)

162. Что такое transform над typelist?

**Ответ:** Transform над typelist — это метафункция, принимающая список типов и унарную операцию (метафункцию), применяющая её к каждому элементу и возвращающая новый typelist с преобразованными типами.

**Пример:**

```cpp
template <typename List, template <typename> class MetaFn>
struct Transform;

template <template <typename...> class TL, typename... Ts, template <typename> class MetaFn>
struct Transform<TL<Ts...>, MetaFn> {
    using type = TL<typename MetaFn<Ts>::type...>;
};

```

**Источник:** [Boost.Mp11: mp_transform](https://www.google.com/search?q=https://www.boost.org/doc/libs/release/libs/mp11/doc/html/mp11.html%2523mp_transform&utm_source=gemini)

163. Что такое filter над typelist?

**Ответ:** Filter над typelist — это compile-time алгоритм, который удаляет из списка все типы, не удовлетворяющие заданному предикату (метафункции, возвращающей булево значение в compile time).

**Пример:**

```cpp
#include <type_traits>

template <typename List, template <typename> class Predicate>
struct Filter;

// Базовые случаи и рекурсивная сборка через conditional_t

```

**Источник:** [Boost.Mp11: mp_filter](https://www.google.com/search?q=https://www.boost.org/doc/libs/release/libs/mp11/doc/html/mp11.html%2523mp_filter&utm_source=gemini)

164. Что такое fold над typelist?

**Ответ:** Fold (или reduce/accumulate) над typelist — это метафункция, агрегирующая все элементы списка в один результирующий тип с помощью бинарной метафункции и начального аккумулятора.

**Пример:**

```cpp
template <typename List, typename State, template <typename, typename> class Op>
struct FoldLeft;

template <template <typename...> class TL, typename State, template <typename, typename> class Op>
struct FoldLeft<TL<>, State, Op> {
    using type = State;
};

template <template <typename...> class TL, typename Head, typename... Tail, typename State, template <typename, typename> class Op>
struct FoldLeft<TL<Head, Tail...>, State, Op> {
    using type = typename FoldLeft<TL<Tail...>, typename Op<State, Head>::type, Op>::type;
};

```

**Источник:** [Boost.Mp11: mp_fold](https://www.google.com/search?q=https://www.boost.org/doc/libs/release/libs/mp11/doc/html/mp11.html%2523mp_fold&utm_source=gemini)

165. Что такое compile-time container?

**Ответ:** Compile-time контейнер — это структура данных, чья память и элементы полностью размещаются, заполняются и обрабатываются во время компиляции внутри `constexpr`/`consteval` контекста без обращений к динамическому рантайм-состоянию ОС.

**Пример:**

```cpp
#include <array>

constexpr std::array<int, 4> squares = {0, 1, 4, 9};
static_assert(squares[2] == 4);

```

**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

166. Что такое non-type template parameter?

**Ответ:** Non-type template parameter (NTTP) — это параметр шаблона, который принимает конкретное значение константного выражения времени компиляции (число, указатель, ссылку, перечисление, а с C++20 — и структурные классы), а не тип.

**Пример:**

```cpp
template <int Size>
struct Buffer {
    char data[Size];
};

Buffer<128> buf;

```

**Источник:** [Cppreference: Non-type template parameter](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/template_parameters%2523Non-type_template_parameter&utm_source=gemini)

167. Какие типы значений можно использовать как нетиповые параметры шаблона в современном C++?

**Ответ:** В современном C++ (начиная с C++20) в качестве NTTP разрешены целочисленные типы, `enum`, указатели и ссылки на объекты со статическим временем жизни, `std::nullptr_t`, числа с плавающей точкой (`float`, `double`), а также любые структурные классы (structural types, удовлетворяющие требованиям LiteralType с публичными нестатическими членами).

**Пример:**

```cpp
struct Point {
    int x, y;
};

template <Point P, Scale double>
struct ScaledPoint {};

ScaledPoint<Point{10, 1.5 20},> sp; // Корректно в C++20

```

**Источник:** [Cppreference: Template parameters](https://en.cppreference.com/w/cpp/language/template_parameters?utm_source=gemini)

168. Что даёт `template<auto N>`?

**Ответ:** Начиная с C++17, конструкция `template<auto N>` позволяет компилятору автоматически выводить тип нетипового аргумента шаблона по переданному константному значению, устраняя необходимость дублировать тип в сигнатуре.

**Пример:**

```cpp
template <auto N>
struct ConstantHolder {
    static constexpr auto value = N;
};

ConstantHolder<42> a;       // N имеет тип int
ConstantHolder<'c'> b;      // N имеет тип char

```

**Источник:** [Cppreference: Template parameters: auto](https://en.cppreference.com/w/cpp/language/template_parameters?utm_source=gemini)

169. Чем `template<auto N>` удобнее старых форм нетиповых параметров?

**Ответ:** Он избавляет от необходимости писать связки вида `template <typename T, T N>`, уменьшает визуальный шум в шаблонных интерфейсах и делает код по-настоящему generic для любых допустимых констант.

**Пример:**

```cpp
// C++14:
template <typename T, T Val>
struct OldHelper {};

// C++17:
template <auto Val>
struct NewHelper {};

```

**Источник:** [Cppreference: Type deduction for template arguments](https://en.cppreference.com/w/cpp/language/template_argument_deduction?utm_source=gemini)

170. Что такое compile-time string как параметр шаблона?

**Ответ:** Это механизм передачи строкового литерала в шаблон в качестве NTTP, реализованный в C++20 через структурную обёртку с фиксированным внутренним массивом `char`.

**Пример:**

```cpp
#include <algorithm>

template <std::size_t N>
struct FixedString {
    char buf[N]{};
    constexpr FixedString(const char (&str)[N]) {
        std::copy_n(str, N, buf);
    }
};

template <FixedString Str>
void print_tag() {
    // Доступ к Str.buf во время компиляции
}

void test() {
    print_tag<"COMPILE_TIME_LITERAL">();
}

```

**Источник:** [Cppreference: Non-type template parameter](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/template_parameters%2523Non-type_template_parameter&utm_source=gemini)

171. Почему строки как параметры шаблона долгое время были неудобны?

**Ответ:** До C++20 указатели на строковые литералы имели внутреннюю линковку (internal linkage) или требовали указатель с внешним связыванием, из-за чего прямой синтаксис `template <const char*>` не принимал строковые литералы вида `"hello"` в качестве аргумента.

**Пример:**

```cpp
template <const char* Str>
struct StringHolder {};

// Ошибка до C++20:
// StringHolder<"text"> sh;

```

**Источник:** [Cppreference: Non-type template parameter (History)](https://en.cppreference.com/w/cpp/language/template_parameters?utm_source=gemini)

172. Как современные стандарты упростили работу с нетиповыми параметрами?

**Ответ:** C++17 добавил вывод типов через `auto`, а C++20 ввёл концепцию структурных типов (structural types), разрешив числа с плавающей запятой, пользовательские литеральные классы с открытыми полями и строковые обёртки в качестве параметров шаблонов.

**Пример:**

```cpp
template <double Factor>
constexpr double scale(double val) { return val * Factor; }

constexpr auto result = scale<0.5>(100.0); // C++20

```

**Источник:** [P0732R2: Class Types in Non-Type Template Parameters](https://www.google.com/search?q=https://wg21.link/p0732r2&utm_source=gemini)

173. Что такое `constexpr`-конструктор?

**Ответ:** `constexpr`-конструктор — это конструктор, помеченный спецификатором `constexpr`, что позволяет создавать и инициализировать объекты класса во время вычисления константных выражений компилятором.

**Пример:**

```cpp
struct Point {
    int x, y;
    constexpr Point(int a, int b) : x(a), y(b) {}
};

constexpr Point p{10, 20};

```

**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

174. Какие требования предъявляются к классу, который должен участвовать в constant evaluation?

**Ответ:** Класс должен относиться к категории LiteralType: иметь `constexpr` (или тривиальный) деструктор, хотя бы один `constexpr`-конструктор (если он не агрегат), и все его поля и базовые классы также должны быть литеральными типами без неинициализированных членов.

**Пример:**

```cpp
struct Literal {
    int a;
    constexpr Literal(int val) : a(val) {}
    constexpr ~Literal() = default; // Обязательно constexpr деструктор с C++20
};

```

**Источник:** [Cppreference: LiteralType](https://en.cppreference.com/w/cpp/named_req/LiteralType?utm_source=gemini)

175. Что такое literal class type?

**Ответ:** Literal class type — это тип класса, объекты которого могут быть созданы, инициализированы и уничтожены в константных выражениях (`constexpr` / `consteval`).

**Пример:**

```cpp
#include <type_traits>

struct Data { int x; };
static_assert(std::is_literal_type_v<Data>);

```

**Источник:** [Cppreference: std::is_literal_type](https://en.cppreference.com/w/cpp/types/is_literal_type?utm_source=gemini)

176. Что такое `constexpr`-метод?

**Ответ:** Это метод класса со спецификатором `constexpr`, который может выполняться на этапе компиляции, если экземпляр класса и аргументы вызова доступны во время константного вычисления (с C++14 такие методы по умолчанию не являются `const`).

**Пример:**

```cpp
struct Box {
    int width;
    constexpr int area() const { return width * width; }
};

```

**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

177. Когда у метода есть шанс быть вызванным на этапе компиляции?

**Ответ:** Метод вызывается на этапе компиляции, когда он сам объявлен как `constexpr` (или `consteval`), а контекст его вызова требует константного выражения (`constinit`, NTTP, инициализация `constexpr` переменной, ветка `if constexpr`).

**Пример:**

```cpp
struct Counter {
    constexpr int calc(int a) { return a * 2; }
};

constexpr int val = Counter{}.calc(5); // На этапе компиляции
int runtime_var = 10;
int res = Counter{}.calc(runtime_var); // На этапе выполнения

```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression?utm_source=gemini)

178. Что такое `constexpr`-контейнер или `constexpr`-объект?

**Ответ:** Это объект или структура данных, полностью созданная и размещённая в контексте вычисления константных выражений, состояние которой зафиксировано на этапе компиляции или модифицируется строго в `constexpr` функциях.

**Пример:**

```cpp
#include <array>

constexpr auto table = [] {
    std::array<int, 5> a{};
    for (int i = 0; i < 5; ++i) a[i] = i * i;
    return a;
}();

```

**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

179. Какие ограничения исторически мешали писать сложный `constexpr`-код?

**Ответ:** В C++11 тело `constexpr`-функции могло содержать только один оператор `return`, запрещались локальные переменные, ветвления (`if`, `switch`), циклы (`for`, `while`) и динамическое выделение памяти; методы не могли мутировать внутреннее состояние.

**Пример:**

```cpp
// Стиль C++11 (только тернарный оператор и рекурсия):
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

```

**Источник:** [Cppreference: constexpr (C++11 limitations)](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

180. Почему с новыми стандартами возможности `constexpr` постепенно расширялись?

**Ответ:** Комитет стремился унифицировать синтаксис compile-time и runtime кода, сократить необходимость использования трюков шаблонного метапрограммирования и перенести валидацию и генерацию вспомогательных таблиц в безопасный императивный стиль.

**Пример:**

```cpp
// C++14: циклы и локальные переменные
// C++20: std::vector, std::string, виртуальные функции, dynamic_cast

```

**Источник:** [WG21: constexpr history overview](https://isocpp.org/?utm_source=gemini)

181. Что такое `constexpr`-цикл?

**Ответ:** Это стандартный императивный цикл (`for`, `while`, `do-while`), выполняемый виртуальной машиной компилятора в процессе вычисления константного выражения.

**Пример:**

```cpp
constexpr int sum_first(int n) {
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        res += i;
    }
    return res;
}
static_assert(sum_first(3) == 6);

```

**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

182. Когда в `constexpr` стали доступны более привычные конструкции вроде циклов и ветвлений?

**Ответ:** Полноценная поддержка локальных переменных, мутаций, условий `if`/`switch` и циклов `for`/`while` была добавлена в стандарте C++14 (предложение N3652).

**Пример:**

```cpp
constexpr int clamp_val(int x, int low, int high) {
    if (x < low) return low;
    if (x > high) return high;
    return x;
}

```

**Источник:** [N3652: Relaxing constraints on constexpr functions](https://www.google.com/search?q=https://wg21.link/n3652&utm_source=gemini)

183. Почему современный `constexpr` уже похож на обычный код, а не на узкий поднабор языка?

**Ответ:** Начиная с C++20/C++23 в `constexpr` разрешены динамическое выделение памяти (`transient allocation`), виртуальные вызовы, обработка исключений (в фазе вычисления без проброса наружу), а также алгоритмы стандартной библиотеки и контейнеры (`std::vector`, `std::string`).

**Пример:**

```cpp
#include <vector>
#include <numeric>

constexpr int sum_vec() {
    std::vector<int> v = {1, 2, 3, 4}; // Выделяется и освобождается в compile time
    return std::accumulate(v.begin(), v.end(), 0);
}
static_assert(sum_vec() == 10);

```

**Источник:** [Cppreference: Constant evaluation](https://en.cppreference.com/w/cpp/language/constant_expression?utm_source=gemini)

184. Что такое `std::array` как удобный compile-time-контейнер?

**Ответ:** `std::array` — это обёртка нулевой стоимости над C-массивом фиксированного размера с constexpr-интерфейсом итераторов и доступа к элементам, позволяющая безопасно оперировать коллекцией внутри константных выражений.

**Пример:**

```cpp
#include <array>

constexpr auto create_array() {
    std::array<int, 3> arr{1, 2, 3};
    arr[0] = 42;
    return arr;
}
constexpr auto a = create_array();

```

**Источник:** [Cppreference: std::array](https://en.cppreference.com/w/cpp/container/array?utm_source=gemini)

185. Почему `std::vector` долгое время был ограниченно применим в compile-time-контексте?

**Ответ:** До C++20 компилятору запрещалось вызывать операторы динамического выделения памяти (`operator new`/`delete`), из-за чего любые динамические структуры данных приводили к ошибке компиляции.

**Пример:**

```cpp
#include <vector>

// В C++20 разрешено только transient allocation (память должна быть освобождена до конца evaluation):
constexpr auto compute() {
    std::vector<int> v{1, 2, 3};
    return v.size(); // Освобождение происходит при выходе
}

```

**Источник:** [P0784R7: More constexpr containers](https://www.google.com/search?q=https://wg21.link/p0784r7&utm_source=gemini)

186. Что такое compile-time-хеш, таблица или lookup?

**Ответ:** Это предварительно сгенерированная на этапе сборки структура данных (например, lookup-таблица синусов, совершенная хеш-таблица или trie), позволяющая в рантайме находить значения за $O(1)$ без накладных расходов на инициализацию.

**Пример:**

```cpp
constexpr uint32_t fnv1a(const char* s, std::size_t n) {
    uint32_t hash = 2166136261u;
    for (std::size_t i = 0; i < n; ++i) {
        hash = (hash ^ static_cast<uint8_t>(s[i])) * 16777619u;
    }
    return hash;
}
constexpr auto tag = fnv1a("USER_ID", 7);

```

**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

187. Когда имеет смысл генерировать данные на этапе компиляции, а не во время выполнения?

**Ответ:** Это оправдано, когда входные данные неизменны и известны до запуска, вычисления дороги для критического пути приложения (криптография, парсинг регулярных выражений, математические таблицы), либо когда требуется ранняя проверка корректности данных.

**Пример:**

```cpp
constexpr auto SINE_TABLE = [] {
    std::array<double, 360> table{};
    // генерация значений
    return table;
}();

```

**Источник:** [Cppreference: Constant expressions](https://en.cppreference.com/w/cpp/language/constant_expression?utm_source=gemini)

188. Что такое precomputation на этапе компиляции?

**Ответ:** Precomputation — это архитектурный паттерн, при котором вычисления, преобразования формата или генерация структур переносятся из времени выполнения приложения на шаг сборки средствами компилятора.

**Пример:**

```cpp
constexpr int fib(int n) {
    return (n <= 1) ? n : fib(n - 1) + fib(n - 2);
}
constexpr int fib20 = fib(20); // 6765 вычислено компилятором

```

**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

189. Какие плюсы даёт перенос вычислений с runtime на compile time?

**Ответ:** Повышается производительность рантайма (нулевая латентность вычислений), уменьшается энергопотребление, минимизируются аллокации памяти, а ошибки параметров выявляются мгновенно на этапе сборки.

**Пример:**

```cpp
// Вместо парсинга строки формата в рантайме:
// std::format проверяет корректность аргументов в compile-time

```

**Источник:** [Cppreference: std::format](https://en.cppreference.com/w/cpp/utility/format/format?utm_source=gemini)

190. Какие минусы у чрезмерного compile-time-программирования?

**Ответ:** Существенное замедление сборки проектов, разрастание бинарных файлов (code bloat), повышенное потребление оперативной памяти компилятором и трудность отладки при возникновении неочевидных ошибок.

**Пример:**

```cpp
// Глубокие шаблонные структуры многократно раздувают PCH и компиляторные трансляции

```

**Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates?utm_source=gemini)

---

## Сложный уровень

191. Почему compile-time-вычисления могут сильно увеличивать время компиляции?

**Ответ:** Компилятор выполняет compile-time код через встроенный интерпретатор AST с постоянными валидациями Undefined Behavior, сопоставлением шаблонов и глубоким отслеживанием константных контекстов без рантайм JIT-оптимизаций.

**Пример:**

```cpp
template <int N>
struct DeepInst : DeepInst<N - 1> {};
template <>
struct DeepInst<0> {};
// Форсирует N обращений к AST и создание N уникальных типов

```

**Источник:** [Cppreference: Template metaprogramming](https://en.cppreference.com/w/cpp/language/templates?utm_source=gemini)

192. Что такое compile-time cost?

**Ответ:** Compile-time cost — это совокупные затраты ресурсов разработчика и сборочной инфраструктуры (время трансляции единицы, пиковое потребление RAM компилятором, нагрузка на линковщик) при использовании сложных метапрограммных абстракций.

**Пример:**

```cpp
// Сложные SFINAE-перегрузки или поиск в typelist из сотен типов
// увеличивают compile-time cost в геометрической прогрессии

```

**Источник:** [LLVM Clang Compiler Performance Documentation](https://clang.llvm.org/docs/index.html?utm_source=gemini)

193. Что такое code bloat в контексте шаблонов и compile-time-генерации?

**Ответ:** Code bloat — это нежелательное увеличение размера исполняемого файла из-за дублирования идентичного по логике машинного кода, генерируемого для каждого уникального набора аргументов шаблона.

**Пример:**

```cpp
template <typename T>
struct VectorOperations {
    void process() { /* 100 строк кода */ }
};
// VectorOperations<int*>, VectorOperations<void*>, VectorOperations<char*>
// сгенерируют 3 идентичные функции в бинарнике

```

**Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates?utm_source=gemini)

194. Почему множество инстанцирований шаблонов может раздувать бинарный файл?

**Ответ:** Каждый уникальный набор шаблонных параметров создает отдельный тип и отдельный набор бинарных символов; если компилятор не может агрессивно заинлайнить или объединить их через ICF (Identical Code Folding), они сохраняются в объектном файле.

**Пример:**

```cpp
template <int N>
void execute() { /* уникальный код */ }
// Вызов execute<0>()...execute<1000>() инстанцирует 1000 отдельных тел функций

```

**Источник:** [GCC: Template Instantiation](https://gcc.gnu.org/onlinedocs/gcc/Template-Instantiation.html?utm_source=gemini)

195. Что такое instantiation depth?

**Ответ:** Instantiation depth — это глубина рекурсивного инстанцирования шаблонов, отслеживаемая компилятором для предотвращения зацикливания и исчерпания памяти (регулируется флагом `-ftemplate-depth`).

**Пример:**

```cpp
template <int N>
struct Infinite : Infinite<N + 1> {};
// Превысит предел -ftemplate-depth (по умолчанию 1024 в Clang)

```

**Источник:** [GCC Options Controlling C++ Dialect](https://gcc.gnu.org/onlinedocs/gcc/C_002b_002b-Dialect-Options.html?utm_source=gemini)

196. Почему глубокая рекурсия шаблонов может приводить к проблемам компилятора?

**Ответ:** Каждая новая глубина рекурсии сохраняет структуру в таблицах символов и потребляет стек компилятора, что может вызывать стековое переполнение процесса компилятора (`SIGSEGV`) или аварийный останов по таймауту памяти (OOM Killer).

**Пример:**

```cpp
// Ошибка: template instantiation depth exceeds maximum

```

**Источник:** [Clang Compiler Manual](https://clang.llvm.org/docs/UsersManual.html?utm_source=gemini)

197. Что такое lazy instantiation шаблонов?

**Ответ:** Lazy instantiation (ленивое инстанцирование) — это правило C++, согласно которому методы и члены шаблона класса компилируются только тогда, когда к ним происходит явное обращение в коде.

**Пример:**

```cpp
template <typename T>
struct SafeHolder {
    void valid() {}
    void invalid() { T::non_existent_method(); }
};

SafeHolder<int> s;
s.valid(); // Корректно, метод invalid() не инстанцируется и не ломает сборку

```

**Источник:** [Cppreference: Class template instantiation](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/class_template%2523Implicit_instantiation&utm_source=gemini)

198. Почему не весь шаблонный код инстанцируется сразу?

**Ответ:** Такой дизайн языка минимизирует время компиляции, экономит память и позволяет использовать один и тот же шаблонный класс с типами, поддерживающими лишь часть его полного интерфейса.

**Пример:**

```cpp
#include <vector>

struct NoDefault { NoDefault(int) {} };
std::vector<NoDefault> v; // resize() требует дефолтный конструктор, но вектор компилируется, пока resize() не вызван

```

**Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector?utm_source=gemini)

199. Как ленивая инстанциация помогает generic-коду оставаться гибким?

**Ответ:** Она позволяет предоставлять в рамках одного универсального типа расширенный API, где неподходящие методы инвалидируются только при попытке их вызова, без необходимости дробления класса на десятки узких базовых классов.

**Пример:**

```cpp
template <typename T>
struct Wrapper {
    T value;
    void print() { std::cout << value; } // Требует operator<< только если print вызван
};

```

**Источник:** [C++ Templates: The Complete Guide (Vandevoorde, Josuttis)](https://www.google.com/search?q=https://www.josuttis.com/tmplbook/&utm_source=gemini)

200. Что такое two-phase lookup?

**Ответ:** Two-phase lookup (двухфазный поиск имён) — это алгоритм разрешения имён в шаблонах: на фазе 1 (при парсинге шаблона) проверяются независимые имена, а на фазе 2 (при инстанцировании) разрешаются зависимые имена с использованием ADL.

**Пример:**

```cpp
void independent();

template <typename T>
void test(T val) {
    independent(); // Фаза 1
    dependent(val); // Фаза 2: поиск dependent отложен до инстанцирования
}

```

**Источник:** [Cppreference: Two-phase name lookup](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/dependent_name%2523Lookup_rules&utm_source=gemini)

201. Почему two-phase lookup важен именно для шаблонов и compile-time-проверок?

**Ответ:** Он защищает код от непреднамеренного связывания имен в месте определения шаблона, гарантируя, что поведение generic-кода адаптируется под аргументы типов пользователя через ADL в фазе инстанцирования.

**Пример:**

```cpp
namespace Custom {
    struct Item {};
    void swap(Item&, Item&);
}
// Generic std::swap находит Custom::swap только благодаря фазе 2

```

**Источник:** [Cppreference: Dependent name](https://en.cppreference.com/w/cpp/language/dependent_name?utm_source=gemini)

202. Что такое dependent name?

**Ответ:** Dependent name (зависимое имя) — это идентификатор внутри шаблона, значение, тип или сущность которого напрямую или косвенно зависят от параметров данного шаблона.

**Пример:**

```cpp
template <typename T>
void check() {
    using Type = typename T::InnerType; // Зависит от T
    T::action();                         // Зависит от T
}

```

**Источник:** [Cppreference: Dependent names](https://en.cppreference.com/w/cpp/language/dependent_name?utm_source=gemini)

203. Почему для некоторых зависимых имён нужен `typename`?

**Ответ:** По правилам синтаксического разбора компилятор считает любое зависимое составное имя по умолчанию переменной (значением). Ключевое слово `typename` сообщает компилятору, что имя является вложенным типом, предотвращая синтаксическую неоднозначность.

**Пример:**

```cpp
template <typename T>
void process() {
    typename T::SubType* ptr; // Без typename трактуется как умножение T::SubType на ptr
}

```

**Источник:** [Cppreference: Dependent names: typename](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/dependent_name%2523The_typename_disambiguator_for_dependent_names&utm_source=gemini)

204. Когда нужен ключевой слово `template` перед зависимым именем?

**Ответ:** Ключевое слово `template` используется после операторов доступа (`.`, `->`, `::`), когда после зависимого имени следует шаблон функции или класса, чтобы компилятор интерпретировал символ `<` как открытие списка шаблонных аргументов, а не оператор «меньше».

**Пример:**

```cpp
template <typename T>
void exec(T obj) {
    obj.template compute<int>(); // Без template компилятор воспримет < как меньше
}

```

**Источник:** [Cppreference: The template disambiguator](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/dependent_name%2523The_template_disambiguator_for_dependent_names&utm_source=gemini)

205. Что такое partial specialization?

**Ответ:** Partial specialization (частичная специализация) — это форма настройки шаблона класса или переменной, при которой часть шаблонных аргументов фиксируется или уточняется (например, до указателей, массивов или ссылок), а остальные остаются обобщёнными.

**Пример:**

```cpp
template <typename T>
struct Trait { static constexpr bool is_ptr = false; };

template <typename T>
struct Trait<T*> { static constexpr bool is_ptr = true; }; // Частичная специализация

```

**Источник:** [Cppreference: Partial template specialization](https://en.cppreference.com/w/cpp/language/partial_specialization?utm_source=gemini)

206. Когда partial specialization удобнее `if constexpr`?

**Ответ:** Частичная специализация незаменима, когда для разных типов требуется полностью изменить layout класса (набор полей данных, базовые классы), тогда как `if constexpr` работает только внутри тел функций.

**Пример:**

```cpp
// std::vector<bool> оптимизирует хранение бит в полях класса через специализацию:
template <typename T> struct Storage { T data; };
template <> struct Storage<void> {}; // Изменение структуры данных

```

**Источник:** [Cppreference: Class template](https://en.cppreference.com/w/cpp/language/class_template?utm_source=gemini)

207. Что такое полная специализация шаблона?

**Ответ:** Полная (явная) специализация шаблона — это вариант реализации шаблона, в котором для всех без исключения шаблонных параметров указаны конкретные типы или значения.

**Пример:**

```cpp
template <typename T>
struct Printer { static void run() { std::cout << "generic"; } };

template <>
struct Printer<int> { static void run() { std::cout << "int specialized"; } };

```

**Источник:** [Cppreference: Explicit specialization](https://en.cppreference.com/w/cpp/language/template_specialization?utm_source=gemini)

208. Чем специализация отличается от перегрузки?

**Ответ:** Перегрузка (overloading) создаёт самостоятельные функции и участвует в первичном формировании candidate set; специализация же модифицирует конкретную ветку уже выбранного шаблона и не участвует в первичном поиске функции.

**Пример:**

```cpp
// Перегрузка:
template <typename T> void foo(T);
template <typename T> void foo(T*);

// Специализация (не перегрузка):
template <> void foo<int>(int);

```

**Источник:** [Sutter’s Mill: Why Not Specialize Function Templates?](http://www.gotw.ca/publications/mill17.htm?utm_source=gemini)

209. Что такое partial ordering шаблонов функций?

**Ответ:** Partial ordering — это свод правил языка, по которым компилятор сравнивает сигнатуры двух перегруженных шаблонов функций, подставляя вымышленные уникальные типы, чтобы определить, какой из них принимает более специфичное подмножество аргументов.

**Пример:**

```cpp
template <typename T> void process(T);    // Шаблон 1
template <typename T> void process(T*);   // Шаблон 2: более специализированный
// process((int*)nullptr) выберет Шаблон 2

```

**Источник:** [Cppreference: Partial ordering of function templates](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/function_template%2523Function_template_overloading&utm_source=gemini)

210. Как компилятор выбирает более специализированный шаблон?

**Ответ:** Компилятор преобразует аргументы шаблона A в уникальные фиктивные типы и пытается вывести из них параметры шаблона B; если B успешно выводится из A, но A не может быть выведен из B, шаблон A признаётся более специализированным.

**Пример:**

```cpp
template <typename T> void f(T);
template <typename T> void f(const T&); // Более специализирован для lvalue

```

**Источник:** [Cppreference: Function template overload](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/function_template%2523Function_template_overloading&utm_source=gemini)

211. Почему compile-time-перегрузки могут быть неоднозначными?

**Ответ:** Неоднозначность (ambiguity) возникает, если ни один из перегруженных шаблонов не является более специализированным, чем другой, либо если их предикаты ограничений взаимно не поглощают (subsume) друг друга при одинаковом скоре сопоставления типов.

**Пример:**

```cpp
template <typename T> void run(T, int);
template <typename T> void run(int, T);
// run(1, 1); // Ошибка: вызов неоднозначен

```

**Источник:** [Cppreference: Overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution?utm_source=gemini)

212. Что такое subsumption в concepts?

**Ответ:** Subsumption (поглощение) — это логический процесс, при котором компилятор раскладывает ограничения концептов в дизъюнктивные/конъюнктивные нормальные формы и доказывает, что ограничение $P$ влечёт за собой ограничение $Q$ ($P \implies Q$), определяя более строгий шаблон.

**Пример:**

```cpp
template <typename T> concept Integral = std::is_integral_v<T>;
template <typename T> concept SignedIntegral = Integral<T> && std::is_signed_v<T>;

template <Integral T> void handle(T);
template <SignedIntegral T> void handle(T); // Поглощает Integral T, вызов для int выберет эту ветку

```

**Источник:** [Cppreference: Constraints and concepts: Subsumption](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/constraints%2523Partial_ordering_of_constraints&utm_source=gemini)

213. Как concepts влияют на порядок выбора перегрузок?

**Ответ:** При равенстве сигнатур функций компилятор оценивает их constraints; функция с более строгими ограничениями (subsuming all others) побеждает в overload resolution без неоднозначности.

**Пример:**

```cpp
template <std::input_iterator I> void advance(I&);
template <std::random_access_iterator I> void advance(I&); // Будет выбрана для указателей/векторов

```

**Источник:** [Cppreference: Overload resolution of constrained templates](https://en.cppreference.com/w/cpp/language/overload_resolution?utm_source=gemini)

214. Почему constrained overloads удобнее старого SFINAE?

**Ответ:** Они синтаксически чище, проверяются компилятором быстрее, не требуют генерации лишних типов в сигнатуре (вроде `std::enable_if_t`), и генерируют короткие понятные сообщения об ошибках, если ни одна ветка не подошла.

**Пример:**

```cpp
// Вместо: template <typename T, typename = std::enable_if_t<std::is_integral_v<T>>>
template <std::integral T>
void clean_func(T val);

```

**Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/language/constraints?utm_source=gemini)

215. Что такое abbreviated function templates?

**Ответ:** Abbreviated function templates (сокращённые шаблоны функций) — это синтаксис C++20, позволяющий объявлять параметры шаблона функции через ключевое слово `auto` (с концептом или без) прямо в списке аргументов.

**Пример:**

```cpp
void print(const auto& item); // Эквивалентно template <typename T> void print(const T& item);

```

**Источник:** [Cppreference: Function template](https://en.cppreference.com/w/cpp/language/function_template?utm_source=gemini)

216. Что означает запись вроде `std::integral auto x`?

**Ответ:** Эта запись декларирует шаблонную переменную или аргумент функции, тип которого выводится автоматически, но жестко ограничен концептом `std::integral` на этапе компиляции.

**Пример:**

```cpp
#include <concepts>

void process(std::integral auto x) {
    // x гарантированно целочисленного типа
}

```

**Источник:** [Cppreference: Concept auto syntax](https://en.cppreference.com/w/cpp/language/constraints?utm_source=gemini)

217. Чем compile-time-ограничения улучшают сообщения об ошибках?

**Ответ:** Вместо каскадного проваливания компилятора вглубь чужого кода реализации с сотнями строк логов (`inside std::vector<...>::push_back`), ошибка фиксируется в точке вызова: компилятор точно сообщает, какой предикат концепта не удовлетворен.

**Пример:**

```cpp
// Clang выведет: "constraints not satisfied: type 'double' does not satisfy 'Integral'"

```

**Источник:** [Bjarne Stroustrup: Concepts: The Future of Generic Programming](https://isocpp.org/?utm_source=gemini)

218. Почему хорошие сообщения компилятора особенно важны в metaprogramming-коде?

**Ответ:** Метапрограммирование оперирует абстрактными типами без стека вызовов рантайма; без точных диагностик любая ошибка превращается в многостраничные простыни нечитаемого вывода подстановок шаблонов.

**Пример:**

```cpp
// Ошибка в depth 50 typelist без static_assert приводит к нечитаемым распечаткам типов

```

**Источник:** [WG21 P0782: Error Reporting for Concepts](https://www.google.com/search?q=https://wg21.link/p0782&utm_source=gemini)

219. Что такое `static_assert`-ориентированный дизайн шаблонного API?

**Ответ:** Это практика намеренного принятия широких типов в шаблонах с последующей проверкой инвариантов внутри тела функции через `static_assert` с человекочитаемыми сообщениями, вместо их полного отсечения через SFINAE.

**Пример:**

```cpp
template <typename T>
void process(T val) {
    static_assert(std::is_floating_point_v<T>, "process() requires an IEEE floating point type!");
}

```

**Источник:** [Cppreference: static_assert](https://en.cppreference.com/w/cpp/language/static_assert?utm_source=gemini)

220. Как писать понятные `static_assert` для сложного generic-кода?

**Ответ:** Сообщение должно чётко формулировать требование, называть некорректный переданный тип и по возможности указывать, какому контракту он должен удовлетворять.

**Пример:**

```cpp
template <typename T>
struct Serializer {
    static_assert(requires(T t) { t.serialize(); },
        "Custom type must implement '.serialize()' member function!");
};

```

**Источник:** [C++ Core Guidelines: T.40: Use concepts to specify requirements](https://www.google.com/search?q=https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines%2523Rt-concepts&utm_source=gemini)

221. Почему compile-time-проверки должны быть как можно ближе к причине ошибки?

**Ответ:** Ранняя локализация предотвращает глубокое распространение некорректных типов по зависимым шаблонам, исключает генерацию вторичных фантомных ошибок и ускоряет поиск проблемы программистом.

**Пример:**

```cpp
// Проверка на входе в API защищает от ошибок в закрытых внутренних хелперах библиотеки

```

**Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

222. Что такое compile-time validation пользовательского типа?

**Ответ:** Это автоматическая проверка структуры или атрибутов пользовательского типа на этапе компиляции (проверка наличия методов, совпадения сигнатур, тривиальной копируемости) перед его интеграцией в контейнер или алгоритм.

**Пример:**

```cpp
template <typename T>
void register_type() {
    static_assert(std::is_trivially_copyable_v<T>, "Type must be trivially copyable for IPC.");
}

```

**Источник:** [Cppreference: type_traits](https://en.cppreference.com/w/cpp/header/type_traits?utm_source=gemini)

223. Что такое structural requirements для шаблонного параметра?

**Ответ:** Это синтаксические требования к форме типа: существование определенных конструкторов, внутренних типов (`value_type`), перегруженных операторов или методов с заданной сигнатурой.

**Пример:**

```cpp
template <typename T>
concept HasSize = requires(T a) {
    { a.size() } -> std::same_as<std::size_t>;
};

```

**Источник:** [Cppreference: Requires expression](https://en.cppreference.com/w/cpp/language/requires?utm_source=gemini)

224. Что такое semantic requirements и почему их труднее проверить на этапе компиляции?

**Ответ:** Семантические требования — это аксиомы поведения (например, ассоциативность операции сложения, сложность $O(1)$ или транзитивность отношения порядка), которые компилятор не может верифицировать механическим анализом AST.

**Пример:**

```cpp
// std::strict_weak_order проверяет синтаксис bool cmp(a, b),
// но не может в compile-time доказать транзитивность (a < b && b < c => a < c)

```

**Источник:** [Cppreference: Concept strict_weak_order](https://en.cppreference.com/w/cpp/concepts/strict_weak_order?utm_source=gemini)

225. Почему не всё, что важно для корректности, можно выразить через compile-time constraints?

**Ответ:** Из-за ограничений вычислимости (проблема останова Тьюринга), невозможности смоделировать внешнюю рантайм-среду (сеть, ввод пользователя) и отсутствия формальных семантических доказательств в компиляторе.

**Пример:**

```cpp
// Нельзя проверить на этапе компиляции, что итераторы input_iterator не указывают в освобожденную память

```

**Источник:** [The C++ Programming Language (Bjarne Stroustrup)](https://www.stroustrup.com/4th.html?utm_source=gemini)

226. Что такое compile-time-polymorphism?

**Ответ:** Это разрешение полиморфных вызовов во время компиляции через шаблоны, концепты или перегрузки без использования таблиц виртуальных функций (vtable) и динамического диспетчеризирования.

**Пример:**

```cpp
template <typename Renderer>
void render_frame(Renderer& r) {
    r.draw(); // Полиморфизм без vtable
}

```

**Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates?utm_source=gemini)

227. Чем статический полиморфизм связан с compile-time?

**Ответ:** Он разрешается полностью на этапе компиляции: типы фиксируются в точках вызова, что позволяет оптимизатору инлайнить функции и удалять абстракции до генерации ассемблерного кода.

**Пример:**

```cpp
// Прямой вызов функции без чтения указателя на vtable в runtime

```

**Источник:** [Cppreference: Virtual functions vs Templates](https://en.cppreference.com/w/cpp/language/virtual?utm_source=gemini)

228. Что такое CRTP и почему его относят к compile-time-техникам?

**Ответ:** CRTP (Curiously Recurring Template Pattern) — это паттерн проектирования, в котором производный класс наследуется от шаблонного базового класса, передавая самого себя в качестве параметра шаблона: `class D : public B<D>`.

**Пример:**

```cpp
template <typename Derived>
struct Base {
    void interface() {
        static_cast<Derived*>(this)->implementation();
    }
};

struct Concrete : Base<Concrete> {
    void implementation() { /* compile-time resolution */ }
};

```

**Источник:** [Wikipedia: Curiously recurring template pattern](https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern?utm_source=gemini)

229. Как CRTP позволяет убирать часть runtime-полиморфизма?

**Ответ:** Вызов виртуального метода заменяется статическим приведением `static_cast<Derived*>(this)` к известному в compile time типу наследника, избавляя объект от указателя `vptr` и исключая накладные расходы на косвенный вызов.

**Пример:**

```cpp
Concrete c;
c.interface(); // Вызывается напрямую без обращения к таблице виртуальных функций

```

**Источник:** [Cppreference: Static dispatch via CRTP](https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern?utm_source=gemini)

230. Когда compile-time-полиморфизм лучше виртуальных функций?

**Ответ:** В высоконагруженных циклах, микрооптимизациях и критических к латентности системах, где требуется агрессивный инлайнинг кода, а также при отсутствии необходимости хранить гетерогенные коллекции в едином массиве в рантайме.

**Пример:**

```cpp
// Высокопроизводительные библиотеки матриц (Eigen), где вызовы должны заинлайниться в AVX инструкции

```

**Источник:** [Eigen Library: Expression Templates](https://www.google.com/search?q=https://eigen.tuxfamily.org/index.php%253Ftitle%253DExpression_templates&utm_source=gemini)

231. Когда runtime-полиморфизм всё же уместнее?

**Ответ:** Когда типы объектов становятся известны только во время выполнения программы (загрузка динамических плагинов, реакция на ввод пользователя) или когда требуется хранить гетерогенные наборы элементов в одном контейнере без комбинаторного взрыва сигнатур.

**Пример:**

```cpp
#include <vector>
#include <memory>

std::vector<std::unique_ptr<Widget>> ui_elements; // Runtime контейнер

```

**Источник:** [Cppreference: Virtual functions](https://en.cppreference.com/w/cpp/language/virtual?utm_source=gemini)

232. Что такое type-level programming?

**Ответ:** Это парадигма программирования на C++, в которой сущностями вычислений являются типы, а не значения данных: операции выполняются над списками типов, а результат вычислений оформляется в виде создания новых типов.

**Пример:**

```cpp
using IntPtr = std::add_pointer_t<int>; // Вычисление типа int -> int*

```

**Источник:** [Boost.Hana: Type computations](https://www.google.com/search?q=https://www.boost.org/doc/libs/release/libs/hana/&utm_source=gemini)

233. Чем type-level programming отличается от value-level programming?

**Ответ:** Type-level оперирует сигнатурами, метафункциями и инстанцированием классов компилятора, существуя исключительно до генерации бинарника; value-level манипулирует конкретными значениями переменных в памяти.

**Пример:**

```cpp
// Type-level:
using ResType = std::conditional_t<true, int, double>;

// Value-level:
auto res_val = true ? 1 : 2.0;

```

**Источник:** [Cppreference: std::conditional](https://en.cppreference.com/w/cpp/types/conditional?utm_source=gemini)

234. Почему типы могут использоваться как носители информации на этапе компиляции?

**Ответ:** Поскольку система типов C++ строго статична и уникальна, каждый специализированный тип (например, `std::integral_constant<int, 42>`) несет в себе закодированные метаданные, различимые компилятором на шаге сопоставления сигнатур.

**Пример:**

```cpp
template <int V>
struct Tag { static constexpr int value = V; };
// Tag<1> и Tag<2> — принципиально разные типы для компилятора

```

**Источник:** [Cppreference: std::integral_constant](https://en.cppreference.com/w/cpp/types/integral_constant?utm_source=gemini)

235. Что такое вычисление через типы, а не через значения?

**Ответ:** Это реализация алгоритмов через шаблонную рекурсию и pattern matching псевдонимов типов `using type = ...`, где результат и промежуточные состояния вычислений кодируются именами созданных структур.

**Пример:**

```cpp
template <int N>
struct Factorial {
    static constexpr int value = N * Factorial<N - 1>::value;
};
template <>
struct Factorial<0> {
    static constexpr int value = 1;
};

```

**Источник:** [Cppreference: Template metaprogramming](https://en.wikipedia.org/wiki/Template_metaprogramming?utm_source=gemini)

236. Что такое empty base optimization и как она связана с шаблонным дизайном?

**Ответ:** EBO (Empty Base Optimization) — это оптимизация компилятора, гарантирующая, что наследование от пустого класса не увеличивает размер производного объекта (размер пустого класса-члена без EBO равен минимум 1 байт). В шаблонах это позволяло включать stateless-аллокаторы без оверхеда памяти.

**Пример:**

```cpp
struct Empty {};
struct BaseOptimized : Empty { int x; }; // sizeof == sizeof(int)
struct Unoptimized { Empty e; int x; };  // sizeof > sizeof(int) из-за padding

```

**Источник:** [Cppreference: Empty base optimization](https://en.cppreference.com/w/cpp/language/ebo?utm_source=gemini)

237. Что такое `[[no_unique_address]]` и чем он полезен в compile-time-обёртках?

**Ответ:** Это атрибут C++20, разрешающий компилятору не выделять уникальный байт адреса для нестатического поля класса, если его тип пуст, что вытесняет громоздкий EBO при проектировании generic-контейнеров и кортежей.

**Пример:**

```cpp
struct Empty {};
struct Holder {
    [[no_unique_address]] Empty e;
    int value;
};
static_assert(sizeof(Holder) == sizeof(int));

```

**Источник:** [Cppreference: attribute no_unique_address](https://en.cppreference.com/w/cpp/language/attributes/no_unique_address?utm_source=gemini)

238. Что такое policy-based design?

**Ответ:** Policy-based design — это подход к проектированию, при котором класс собирается из независимых взаимозаменяемых compile-time стратегий (политик), передаваемых в качестве шаблонных параметров (популяризирован Андреем Александреску).

**Пример:**

```cpp
template <typename ThreadingPolicy, typename StoragePolicy>
struct Manager : private ThreadingPolicy, private StoragePolicy {
    void run() {
        ThreadingPolicy::lock();
        StoragePolicy::save();
    }
};

```

**Источник:** [Modern C++ Design: Policy-Based Class Design](https://en.wikipedia.org/wiki/Modern_C++_Design?utm_source=gemini)

239. Как compile-time-параметры помогают строить policy-based архитектуру?

**Ответ:** Компилятор инлайнит вызовы всех переданных политик напрямую в результирующий код без накладных расходов на полиморфизм и виртуальные таблицы, комбинируя ортогональные аспекты логики в compile time.

**Пример:**

```cpp
struct SingleThreadedPolicy { void lock() {} }; // Нулевая стоимость

```

**Источник:** [C++ Design Patterns: Policy-Based Design](https://en.wikipedia.org/wiki/Policy-based_design?utm_source=gemini)

240. Что такое mixin на шаблонах?

**Ответ:** Mixin на шаблонах — это паттерн, в котором класс параметризуется типом своего будущего базового класса: `template <class Base> class Mixin : public Base`, что позволяет гибко инжектировать функционал слоями в compile time.

**Пример:**

```cpp
template <typename Base>
struct LoggingMixin : public Base {
    void execute() {
        std::cout << "Log before\n";
        Base::execute();
    }
};

```

**Источник:** [Wikipedia: Mixin](https://en.wikipedia.org/wiki/Mixin?utm_source=gemini)

---

## Очень сложный уровень

241. Что такое reflection и почему эта тема тесно связана с compile-time-программированием?

**Ответ:** Reflection (рефлексия) — это способность программы исследовать свою собственную структуру (имена полей, типы, функции). В C++ она строится строго как static compile-time механизм: компилятор преобразует элементы AST в неизменяемые метаобъекты во время компиляции, не неся рантайм-издержек.

**Пример:**

```cpp
// Планируемый стандарт C++26 (P2996):
constexpr auto meta_info = ^^int;
constexpr auto name = std::meta::name_of(meta_info);

```

**Источник:** [P2996R2: Reflection for C++26](https://www.google.com/search?q=https://wg21.link/p2996r2&utm_source=gemini)

242. Какие возможности интроспекции типов уже есть в C++ без полноценной рефлексии?

**Ответ:** В распоряжении разработчиков есть заголовочный файл `<type_traits>` (проверка свойств типов), concepts/requires-clauses (проверка выражений), structured binding, `std::tuple_size`, а также платформенные макросы `__PRETTY_FUNCTION__` / `std::source_location`.

**Пример:**

```cpp
#include <type_traits>

static_assert(std::is_polymorphic_v<std::exception>);

```

**Источник:** [Cppreference: Type support (type traits)](https://en.cppreference.com/w/cpp/types?utm_source=gemini)

243. Чем compile-time introspection через traits/concepts отличается от полноценной reflection?

**Ответ:** Traits и concepts работают ad-hoc «снаружи-внутрь»: они могут лишь проверить гипотезу о типе (например, «есть ли метод `foo()`?»), но не могут итерироваться по внутренностям структуры («верни мне список всех полей и их имена»).

**Пример:**

```cpp
// Concepts: проверяют конкретный вызов
template <typename T> concept CanFly = requires(T t) { t.fly(); };
// Рефлексия: способна динамически обойти поля struct Person { int age; string name; }

```

**Источник:** [P2996: Reflection for C++26 Motivation](https://wg21.link/p2996?utm_source=gemini)

244. Что такое customization point object и как он связан с compile-time-механизмами?

**Ответ:** Customization Point Object (CPO) — это функциональный объект с запретом на ADL в месте вызова, который в compile time через SFINAE/concepts диспетчеризирует вызов между методом класса, специализированным свободным ADL-методом или дефолтной реализацией.

**Пример:**

```cpp
// std::ranges::begin — классический пример CPO.
// Он предотвращает некорректный неквалифицированный поиск и проверяет концепты вызова в compile-time.

```

**Источник:** [Cppreference: Customization point object](https://en.cppreference.com/w/cpp/ranges/cpo?utm_source=gemini)

245. Почему ranges heavily rely на compile-time constraints и concepts?

**Ответ:** Пайплайны диапазонов комбинируют адаптеры на этапе сборки; без строгих концептов и ограничений любая несовместимость категорий итераторов или константности приводила бы к глубоким ошибкам инстанцирования внутри десятков вложенных view.

**Пример:**

```cpp
#include <ranges>
#include <vector>

std::vector<int> v = {1, 2, 3};
auto res = v | std::views::filter([](int x) { return x % 2 == 0; })
             | std::views::transform([](int x) { return x * 2; });

```

**Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges?utm_source=gemini)

246. Что такое borrowed range и почему это partly compile-time-свойство?

**Ответ:** Borrowed range — это концепт диапазона, чьи итераторы безопасно продолжают жить после уничтожения самого объекта (например, ссылки `T&`, `std::string_view` или `std::span`). Это свойство регистрируется на этапе компиляции специализацией переменной-трейта `std::ranges::enable_borrowed_range`.

**Пример:**

```cpp
#include <ranges>
#include <span>

static_assert(std::ranges::borrowed_range<std::span<int>>);

```

**Источник:** [Cppreference: std::ranges::borrowed_range](https://en.cppreference.com/w/cpp/ranges/borrowed_range?utm_source=gemini)

247. Что такое iterator category как compile-time-характеристика?

**Ответ:** Это маркер типа (тег или концепт), определяющий на этапе компиляции набор поддерживаемых операций итератора (последовательный доступ, двунаправленный, произвольный доступ) для выбора оптимального алгоритма.

**Пример:**

```cpp
#include <iterator>

using Cat = std::iterator_traits<int*>::iterator_category;
static_assert(std::is_same_v<Cat, std::random_access_iterator_tag>);

```

**Источник:** [Cppreference: Iterator categories](https://en.cppreference.com/w/cpp/iterator/iterator_tags?utm_source=gemini)

248. Как старые теги итераторов использовались для compile-time-dispatch?

**Ответ:** Функции делегировали работу вспомогательным перегрузкам, передавая экземпляр тега `typename std::iterator_traits<It>::iterator_category{}` в качестве аргумента, заставляя компилятор выбрать наиболее эффективную перегрузку.

**Пример:**

```cpp
template <typename Iter>
void advance_impl(Iter& i, int n, std::random_access_iterator_tag) { i += n; }

template <typename Iter>
void advance_impl(Iter& i, int n, std::input_iterator_tag) { while (n--) ++i; }

```

**Источник:** [Cppreference: Tag dispatch](https://en.cppreference.com/w/cpp/iterator/iterator_tags?utm_source=gemini)

249. Как concepts меняют старый подход с tag dispatch?

**Ответ:** Concepts позволяют избавиться от промежуточных функций с фиктивными тегами аргументов, объявляя перегрузки алгоритма напрямую через ограничения концептов итераторов (`requires std::random_access_iterator<I>`).

**Пример:**

```cpp
template <std::input_iterator I>
void my_advance(I& i, int n) { while (n--) ++i; }

template <std::random_access_iterator I>
void my_advance(I& i, int n) { i += n; }

```

**Источник:** [Cppreference: std::advance](https://en.cppreference.com/w/cpp/iterator/advance?utm_source=gemini)

250. Что такое `std::invoke_result`?

**Ответ:** `std::invoke_result` — это шаблонный трейт из `<type_traits>` (пришедший на смену `std::result_of` в C++17), который вычисляет тип возвращаемого значения при вызове вызываемого объекта `Callable` с заданными типами аргументов `Args...`.

**Пример:**

```cpp
#include <type_traits>

auto add(int a, double b) -> double { return a + b; }
using Ret = std::invoke_result_t<decltype(add), int, double>; // double

```

**Источник:** [Cppreference: std::invoke_result](https://en.cppreference.com/w/cpp/types/result_of?utm_source=gemini)

251. Что такое `std::is_invocable`?

**Ответ:** `std::is_invocable` — это трейт проверки вызываемости, определяющий в compile time, может ли объект типа `Callable` быть вызван с аргументами `Args...` с использованием семантики `std::invoke`.

**Пример:**

```cpp
#include <type_traits>

auto lambda = [](int x) { return x; };
static_assert(std::is_invocable_v<decltype(lambda), int>);
static_assert(!std::is_invocable_v<decltype(lambda), std::string>);

```

**Источник:** [Cppreference: std::is_invocable](https://en.cppreference.com/w/cpp/types/is_invocable?utm_source=gemini)

252. Как на этапе компиляции проверить, можно ли вызвать callable с заданными аргументами?

**Ответ:** С помощью концепта `std::invocable<Callable, Args...>`, трейта `std::is_invocable_v<Callable, Args...>` или через `requires`-выражение.

**Пример:**

```cpp
#include <concepts>

template <typename F, typename... Args>
requires std::invocable<F, Args...>
void execute(F&& f, Args&&... args) {
    std::invoke(std::forward<F>(f), std::forward<Args>(args)...);
}

```

**Источник:** [Cppreference: std::invocable](https://en.cppreference.com/w/cpp/concepts/invocable?utm_source=gemini)

253. Что такое `std::common_type`?

**Ответ:** `std::common_type` — это метафункция, находящая общий базовый тип, к которому могут быть неявно приведены все переданные типы `T...` (использует тернарный оператор `decltype(true ? declval<T>() : declval<U>())`).

**Пример:**

```cpp
#include <type_traits>

using Common = std::common_type_t<int, double, float>; // double

```

**Источник:** [Cppreference: std::common_type](https://en.cppreference.com/w/cpp/types/common_type?utm_source=gemini)

254. Что такое `std::common_reference`?

**Ответ:** `std::common_reference` (C++20) — это расширенный трейт, определяющий тип ссылки, к которой могут быть безопасно приведены ссылки разных типов с учетом квалификаторов `const` и value-категорий.

**Пример:**

```cpp
#include <type_traits>

struct Base {};
struct Derived : Base {};

using Ref = std::common_reference_t<Derived&, Base& const>; // const Base&

```

**Источник:** [Cppreference: std::common_reference](https://en.cppreference.com/w/cpp/types/common_reference?utm_source=gemini)

255. Почему вычисление общего типа — это compile-time-задача?

**Ответ:** Вычисление общего типа требует анализа графа преобразований типов и применения правил приведения выражений до генерации машинных инструкций, гарантируя строгую статическую типизацию.

**Пример:**

```cpp
// Необходимо при реализации generic-контейнеров, таких как std::variant или conditional-тернарников

```

**Источник:** [Cppreference: std::common_type](https://en.cppreference.com/w/cpp/types/common_type?utm_source=gemini)

256. Что такое `std::remove_cvref_t`?

**Ответ:** `std::remove_cvref_t` (C++20) — вспомогательный псевдоним типа, который удаляет с переданного типа одновременно модификаторы `const`, `volatile`, а также ссылки `&` и `&&`.

**Пример:**

```cpp
#include <type_traits>

using Raw = std::remove_cvref_t<const int&>; // int

```

**Источник:** [Cppreference: std::remove_cvref](https://en.cppreference.com/w/cpp/types/remove_cvref?utm_source=gemini)

257. Почему normalize-типы важны в compile-time-коде?

**Ответ:** Нормализация типов устраняет поверхностные различия (наличие ссылок и cv-квалификаторов), предотвращая раздувание шаблонных специализаций и гарантируя корректное сопоставление в ассоциативных compile-time мапах и typelist.

**Пример:**

```cpp
// Without remove_cvref: TypeList<const int&> != TypeList<int>

```

**Источник:** [Boost.Mp11 Documentation](https://www.boost.org/doc/libs/release/libs/mp11/?utm_source=gemini)

258. Что такое decay типа?

**Ответ:** Decay типа — это набор неявных преобразований типов при передаче аргументов по значению: сжатие lvalue/rvalue ссылок, удаление `const`/`volatile`, преобразование функций в указатели на функции и массивов `T[]` в указатели `T*`.

**Пример:**

```cpp
#include <type_traits>

using Decayed = std::decay_t<int[5]>; // int*

```

**Источник:** [Cppreference: std::decay](https://en.cppreference.com/w/cpp/types/decay?utm_source=gemini)

259. Что такое reference collapsing?

**Ответ:** Reference collapsing (схлопывание ссылок) — это фундаментальное правило C++, по которому ссылка на ссылку преобразуется по принципу: если хотя бы одна из ссылок является lvalue-ссылкой (`&`), итогом становится lvalue-ссылка `&`; только комбинация `&&` + `&&` даёт rvalue-ссылку `&&`.

**Пример:**

```cpp
using T = int&;
using Collapsed = T&&; // int&

```

**Источник:** [Cppreference: Reference declaration: Reference collapsing](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/reference%2523Reference_collapsing&utm_source=gemini)

260. Почему reference collapsing — часть compile-time-логики вывода типов?

**Ответ:** Схлопывание ссылок происходит непосредственно в процессе дедукции аргументов шаблонов функций компилятором, формируя фундамент механизма универсальных ссылок.

**Пример:**

```cpp
template <typename T>
void forward_val(T&& arg); // T выводится как U& или U, затем применяется collapsing

```

**Источник:** [Cppreference: Template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction?utm_source=gemini)

261. Как forwarding references зависят от правил вывода типов на этапе компиляции?

**Ответ:** При передаче lvalue аргумента типа `X` компилятор выводит `T` как `X&`, что в связке с `T&&` порождает `X& &&` $\to$ `X&`; при передаче rvalue `T` выводится как `X`, порождая `X&&`.

**Пример:**

```cpp
int a = 5;
forward_val(a); // T = int&, arg = int&
forward_val(5); // T = int, arg = int&&

```

**Источник:** [Cppreference: Forwarding reference](https://www.google.com/search?q=https://en.cppreference.com/w/cpp/language/reference%2523Forwarding_references&utm_source=gemini)

262. Почему perfect forwarding — это во многом compile-time-механизм?

**Ответ:** Потому что информация о value category аргументов сохраняется в типах на этапе вывода шаблонных параметров и восстанавливается через статический `static_cast` без участия рантайм-инструкций.

**Пример:**

```cpp
template <typename T>
void wrapper(T&& arg) {
    target(std::forward<T>(arg));
}

```

**Источник:** [Cppreference: std::forward](https://en.cppreference.com/w/cpp/utility/forward?utm_source=gemini)

263. Что делает `std::forward` с точки зрения compile-time-информации о value category?

**Ответ:** `std::forward` принимает тип `T` и выполняет статический каст `static_cast<T&&>(val)`, восстанавливая исходный статус rvalue, если аргумент был rvalue, или сохраняя lvalue ссылку.

**Пример:**

```cpp
// std::forward<T>(u) возвращает static_cast<T&&>(u)

```

**Источник:** [Cppreference: std::forward](https://en.cppreference.com/w/cpp/utility/forward?utm_source=gemini)

264. Почему неправильный вывод типа ломает generic-код ещё на этапе компиляции?

**Ответ:** Ошибочный вывод типа (например, случайная потеря ссылки или константности) приводит к вызову непредусмотренных перегрузок, попыткам вызова удалённых конструкторов копирования или нарушению constraints концептов.

**Пример:**

```cpp
// Вывод T вместо T& для некопируемого типа (std::unique_ptr) приведет к ошибке компиляции copy constructor

```

**Источник:** [Effective Modern C++ (Scott Meyers)](https://www.aristeia.com/EMC++.html?utm_source=gemini)

265. Что такое compile-time-построение конечных автоматов, таблиц или DSL?

**Ответ:** Это практика трансляции предметно-ориентированного языка или графа состояний конечного автомата в статические массивы переходов и специализированные структуры типов на этапе компиляции (например, CTRE для регулярных выражений).

**Пример:**

```cpp
// CTRE (Compile Time Regular Expressions):
// Регулярное выражение парсится компилятором в оптимальный конечный автомат

```

**Источник:** [Compile Time Regular Expressions Library (CTRE)](https://github.com/hanickadot/compile-time-regular-expressions?utm_source=gemini)

266. Когда compile-time-генерация кода оправдана, а когда избыточна?

**Ответ:** Оправдана при доказанном выигрыше в скорости выполнения критического пути, гарантиях безопасности типов и строгой иммутабельности данных; избыточна, если время сборки вырастает непропорционально, а алгоритм прост и тривиально оптимизируется компилятором в рантайме.

**Пример:**

```cpp
// Оправдано: валидация формата строки std::format
// Избыточно: compile-time реализация сложных GUI-деревьев

```

**Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

267. Почему compile-time-программирование может улучшить runtime-производительность, но ухудшить developer experience?

**Ответ:** Устранение рантайм-кода дает максимальную производительность, однако время компиляции многократно возрастает, падает отзывчивость Language Server (LSP/IDE), усложняется отладка и чтение кода коллегами.

**Пример:**

```cpp
// Программист ждет перекомпиляцию файла 30 секунд вместо 1 секунды из-за тяжелых мета-заголовков

```

**Источник:** [CppCon: Compile-time Metaprogramming and DX](https://cppcon.org/?utm_source=gemini)

268. Как найти баланс между compile-time-мощью и читаемостью кода?

**Ответ:** Применять императивный `constexpr`/`consteval` вместо шаблонных метафункций, изолировать метапрограммирование за лаконичными открытыми API-интерфейсами и избегать преждевременной compile-time оптимизации.

**Пример:**

```cpp
// Предпочитать constexpr функции классам с type traits

```

**Источник:** [C++ Core Guidelines: P.9: Don't waste time or space](https://www.google.com/search?q=https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines%2523Rp-waste&utm_source=gemini)

269. Когда лучше использовать `constexpr`, а когда templates?

**Ответ:** `constexpr` функции предпочтительнее для любых вычислений над значениями данных (математика, структуры, логика), а шаблоны следует оставить для работы с типами (контейнеры, гетерогенные наборы, тайп-трейты).

**Пример:**

```cpp
constexpr int compute(int a) { return a * 2; } // Лучше, чем template <int N> struct Compute;

```

**Источник:** [Cppreference: constexpr vs templates](https://en.cppreference.com/w/cpp/language/constexpr?utm_source=gemini)

270. Когда лучше использовать concepts, а когда `static_assert`?

**Ответ:** Concepts следует использовать для участия в overload resolution и ограничения интерфейсов шаблонов, а `static_assert` — внутри уже выбранной ветки для генерации детального диагностического сообщения о нарушении внутреннего инварианта.

**Пример:**

```cpp
template <typename T>
requires std::is_arithmetic_v<T> // Concepts для выбора функции
void calculate(T val) {
    static_assert(sizeof(T) >= 4, "T must be at least 32-bit"); // static_assert для контракта
}

```

**Источник:** [Cppreference: Constraints vs static_assert](https://en.cppreference.com/w/cpp/language/constraints?utm_source=gemini)

271. Когда лучше использовать `if constexpr`, а когда специализацию?

**Ответ:** `if constexpr` лучше использовать для ветвления логики алгоритмов внутри функций без фрагментации реализации, а специализацию — если требуется изменить компоновку полей класса или если ветки требуют кардинально разных базовых классов.

**Пример:**

```cpp
template <typename T>
void process(T val) {
    if constexpr (std::is_pointer_v<T>) {
        // Ветка указателя
    } else {
        // Обычная ветка
    }
}

```

**Источник:** [Cppreference: if statement](https://en.cppreference.com/w/cpp/language/if?utm_source=gemini)

272. Когда compile-time-магия делает API хуже, а не лучше?

**Ответ:** Когда сигнатуры типов становятся нечитаемыми, ошибки компилятора занимают экраны терминала, нарушается автодополнение в IDE и невозможно инкапсулировать детали реализации за стабильной ABI-границей.

**Пример:**

```cpp
// Сигнатуры вроде: Expression<BinaryOp<Add, Terminal<int>, Sub<Terminal<float>>>>

```

**Источник:** [API Design for C++ (Martin Reddy)](https://www.apibook.com/?utm_source=gemini)

273. Какие признаки говорят, что compile-time-решение слишком сложно для своей задачи?

**Ответ:** Наличие рекурсивных шаблонных хаков, время сборки файла более нескольких секунд, невозможность объяснить контракт интерфейса за две минуты и необходимость использования сотен строк `std::conditional` вместо простого `if`.

**Пример:**

```cpp
// Использование сложных SFINAE-конструкций там, где достаточно обычного enum или constexpr-функции

```

**Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

274. Почему compile-time-программирование не должно подменять хороший дизайн API?

**Ответ:** Потому что задача API — решать бизнес-задачу пользователя просто и безопасно; избыточная шаблонная гибкость часто провоцирует протекание абстракций и превращает код в головоломку.

**Пример:**

```cpp
// Хороший API прост в вызове: parser.parse("data"), без явной передачи десятка compile-time тегов

```

**Источник:** [API Design for C++](https://www.apibook.com/?utm_source=gemini)

275. Что такое “ошибка на этапе компиляции как часть UX библиотеки”?

**Ответ:** Это осознанное проектирование библиотеки, при котором некорректное использование API пресекается не падением рантайма, а специально отформатированным, человекочитаемым сообщением компилятора (`static_assert` или concept).

**Пример:**

```cpp
static_assert(always_false<T>, "You forgot to register a serializer for this type!");

```

**Источник:** [Standard Library UX: Concepts and static assertions](https://wg21.link/?utm_source=gemini)

276. Почему compile-time-интерфейс библиотеки должен быть понятным, а не только мощным?

**Ответ:** Пользователи библиотеки должны тратить время на решение прикладных задач, а не на декодирование замысловатых ошибок компилятора и расшифровку недокументированных параметров шаблонов.

**Пример:**

```cpp
// Простые concepts вроде std::invocable понятны любому разработчику без погружения в AST библиотеки

```

**Источник:** [C++ Core Guidelines: T.1: Use templates to raise the level of abstraction](https://www.google.com/search?q=https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines%2523Rt-use&utm_source=gemini)

277. Какие компромиссы между скоростью компиляции, размером бинарника и скоростью выполнения особенно важны?

**Ответ:** Классический треугольник компромиссов: форсированный compile-time расчет и тотальный инлайнинг дают максимальную скорость runtime, но платят за это раздуванием бинарника (code bloat) и замедлением времени сборки проектов.

**Пример:**

```cpp
// Балансировка между полным разворотом циклов через NTTP и стандартным циклом for в runtime

```

**Источник:** [Optimizing C++ (Agner Fog)](https://www.agner.org/optimize/?utm_source=gemini)

278. Почему compile-time-код нужно оценивать не только по корректности, но и по стоимости сопровождения?

**Ответ:** Сложные шаблонные метапрограммы с трудом поддаются рефакторингу, требуют специалистов высокой квалификации и могут непреднамеренно сломаться при обновлении версии компилятора из-за мелких изменений в стандарте.

**Пример:**

```cpp
// Код на старом SFINAE часто ломается при переходе на новые стандарты с более строгим two-phase lookup

```

**Источник:** [Software Engineering at Google (Titus Winters)](https://abseil.io/resources/swe-book?utm_source=gemini)

279. Какие типичные ошибки делают разработчики при использовании `constexpr`, `consteval`, concepts и шаблонов?

**Ответ:**

- Забывают делать деструкторы и методы `constexpr`.
- Случайно передают в `consteval` аргументы, не являющиеся константами времени компиляции.
- Пишут неконсистентные предикаты концептов, ломающие subsumption.
- Допускают комбинаторный взрыв инстанцирований шаблонов при тривиальных операциях.

**Пример:**

```cpp
consteval int square(int n) { return n * n; }
int x = 5;
// square(x); // Ошибка: x не константа времени компиляции!

```

**Источник:** [Cppreference: consteval](https://en.cppreference.com/w/cpp/language/consteval?utm_source=gemini)

280. Какие основные практические принципы по теме `Compile_time` ты бы сформулировал для современного C++?

**Ответ:**

1. **Constexpr first:** отдавать предпочтение `constexpr`/`consteval` функциям перед шаблонным метапрограммированием.
2. **Concepts over SFINAE:** использовать concepts для ограничения интерфейсов и выбора перегрузок.
3. **Fail early, fail clearly:** использовать понятные `static_assert` с конкретными подсказками.
4. **Don't over-meta:** помнить о времени сборки и когнитивной нагрузке коллег — переносить в compile time только то, что действительно критично для скорости или безопасности.

**Пример:**

```cpp
// Современный C++:
template <std::integral T>
constexpr T add(T a, T b) noexcept {
    return a + b;
}

```

**Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

[<- Prev](./11_exceptions.md) [Next ->](./13_low_level.md)
