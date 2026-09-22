# Exceptions

## Лёгкий уровень

1. Что такое исключение в C++?

**Ответ:** Исключение в C++ — это механизм сигнализирования и обработки аномальных условий или ошибок во время выполнения программы, позволяющий прервать стандартный поток исполнения и передать управление соответствующему блоку-обработчику.

**Пример:**

```cpp
#include <stdexcept>

void test(int val) {
    if (val < 0) {
        throw std::invalid_argument("Negative value not allowed");
    }
}
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

2. Для чего в языке нужен механизм исключений?

**Ответ:** Механизм исключений нужен для разделения логики обнаружения ошибки и логики её обработки, обеспечения надежного освобождения ресурсов через раскрутку стека (RAII) и сообщений об ошибках там, где невозможно вернуть код возврата (например, в конструкторах или перегруженных операторах).

**Пример:**

```cpp
struct Matrix {
    Matrix(int rows, int cols) {
        if (rows <= 0 || cols <= 0) {
            throw std::invalid_argument("Dimensions must be positive");
        }
    }
};
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

3. Чем исключения отличаются от обычного возврата кода ошибки?

**Ответ:** Код ошибки требует ручной проверки на каждом уровне стека вызовов и может быть непреднамеренно проигнорирован вызывающей стороной, загрязняя сигнатуры функций. Исключение невозможно проигнорировать (необработанное исключение завершает программу), и оно автоматически поднимается вверх по стеку вызовов, уничтожая локальные объекты.

**Пример:**

```cpp
// Код возврата: легко забыть проверить
int err = doWork();
if (err != 0) { /* handle */ }

// Исключение: нельзя пропустить
doWorkOrThrow(); // при ошибке выбросит исключение и раскрутит стек
```

**Источник:** [Cppreference: Exceptions vs error codes](https://en.cppreference.com/w/cpp/error)

4. Что означает `throw`?

**Ответ:** Ключевое слово `throw` используется для инициализации и выброса исключения: оно прерывает нормальный ход выполнения функции, передает объект-исключение в подсистему обработки исключений и запускает процесс раскрутки стека.

**Пример:**

```cpp
#include <stdexcept>

void validateAge(int age) {
    if (age < 0) {
        throw std::runtime_error("Age cannot be negative");
    }
}
```

**Источник:** [Cppreference: throw expression](https://en.cppreference.com/w/cpp/language/throw)

5. Что означает `try`?

**Ответ:** Ключевое слово `try` открывает блок кода (`compound statement`), внутри которого отслеживается возникновение исключений. За блоком `try` обязательно должен следовать один или несколько блоков `catch`.

**Пример:**

```cpp
try {
    // Код, потенциально генерирующий исключение
    riskyOperation();
} catch (...) {
    // Обработка
}
```

**Источник:** [Cppreference: try-block](https://en.cppreference.com/w/cpp/language/try_catch)

6. Что означает `catch`?

**Ответ:** Ключевое слово `catch` определяет обработчик исключения (exception handler), следующий за блоком `try`. Он перехватывает объект выброшенного типа (или совместимого производного типа) и содержит код по устранению или логированию проблемы.

**Пример:**

```cpp
#include <iostream>
#include <stdexcept>

try {
    throw std::runtime_error("Something broke");
} catch (const std::exception& e) {
    std::cerr << "Caught: " << e.what() << '\n';
}
```

**Источник:** [Cppreference: try-block handlers](https://en.cppreference.com/w/cpp/language/try_catch)

7. Как связаны `try`, `throw` и `catch`?

**Ответ:** `throw` генерирует исключение, `try` определяет контролируемую область, откуда исключение ожидается, а `catch` ловит и обрабатывает исключение, прерывая его дальнейший подъем по стеку.

**Пример:**

```cpp
try {                 // 1. Контролируем выполнение
    throw 42;         // 2. Выбрасываем исключение
} catch (int code) {  // 3. Перехватываем подходящий тип
    // Обработка ошибки со значением code == 42
}
```

**Источник:** [Cppreference: try, throw and catch](https://en.cppreference.com/w/cpp/language/exceptions)

8. Что значит “выбросить исключение”?

**Ответ:** «Выбросить исключение» означает инициализировать объект ошибки с помощью оператора `throw`, прервать прямолинейное выполнение программы в текущей точке и инициировать механизм поиска подходящего блока `catch` с попутной очисткой стека.

**Пример:**

```cpp
#include <stdexcept>

void checkFile(bool exists) {
    if (!exists) {
        throw std::runtime_error("File not found"); // выброс исключения
    }
}
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw)

9. Что значит “поймать исключение”?

**Ответ:** «Поймать исключение» означает сопоставить тип выброшенного объекта с типом, объявленным в блоке `catch`, передать этот объект внутрь блока и продолжить выполнение программы в нормальном режиме после завершения данного обработчика.

**Пример:**

```cpp
#include <iostream>
#include <stdexcept>

try {
    throw std::out_of_range("Index error");
} catch (const std::out_of_range& e) { // поймали исключение
    std::cout << "Successfully caught out_of_range: " << e.what() << '\n';
}
```

**Источник:** [Cppreference: Handling exceptions](https://en.cppreference.com/w/cpp/language/try_catch)

10. Что происходит после выброса исключения?

**Ответ:** После `throw` текущая функция немедленно останавливается, и runtime начинает процесс раскрутки стека (stack unwinding): в обратном порядке уничтожаются все локальные объекты текущей области видимости, а система ищет ближайший обрамляющий блок `try/catch`, способный перехватить тип этого исключения.

**Пример:**

```cpp
#include <iostream>

struct Resource {
    ~Resource() { std::cout << "Resource cleaned up\n"; }
};

void run() {
    Resource r;
    throw std::runtime_error("Boom!"); // Сначала вызовется ~Resource(), затем исключение полетит выше
}
```

**Источник:** [Cppreference: Stack unwinding](https://en.cppreference.com/w/cpp/language/throw#Stack_unwinding)

11. Можно ли выбросить исключение без `try`?

**Ответ:** Да, выражение `throw` может находиться внутри любой функции без прямого обрамления в блок `try`. В этом случае исключение покинет текущую функцию и начнет раскручивать стек вызовов, пока не встретит подходящий `try/catch` на более высоком уровне.

**Пример:**

```cpp
#include <stdexcept>

void divide(int a, int b) {
    if (b == 0) {
        throw std::invalid_argument("Division by zero"); // Блока try внутри функции нет
    }
}
```

**Источник:** [Cppreference: throw expression](https://en.cppreference.com/w/cpp/language/throw)

12. Что произойдёт, если исключение нигде не будет поймано?

**Ответ:** Если исключение не перехвачено ни одним блоком `catch` и достигает границы функции `main()`, вызывается функция `std::terminate()`, которая по умолчанию завершает выполнение программы (обычно вызывая `std::abort()`) без гарантии вызова деструкторов оставшихся объектов.

**Пример:**

```cpp
int main() {
    throw 1; // Никто не ловит -> вызывается std::terminate() -> аварийное завершение
}
```

**Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

13. Что такое обработчик исключения?

**Ответ:** Обработчик исключения (exception handler) — это блок `catch(...)`, прикрепленный к блоку `try`, принимающий параметр определенного типа и предназначенный для устранения ошибки, протоколирования или корректного восстановления состояния программы.

**Пример:**

```cpp
#include <iostream>

try {
    throw 404;
} catch (int errorCode) { // Обработчик для типа int
    std::cout << "Error code caught: " << errorCode << '\n';
}
```

**Источник:** [Cppreference: Handlers](https://en.cppreference.com/w/cpp/language/try_catch)

14. Что такое тип исключения?

**Ответ:** Тип исключения — это тип C++ объекта, переданного в оператор `throw` (например, `int`, `const char*`, `std::runtime_error`, пользовательский класс `MyException`). Именно по совпадению или отношению наследования этого типа выбирается соответствующий блок `catch`.

**Пример:**

```cpp
struct CustomError {};

void fail() {
    throw CustomError(); // Тип исключения: CustomError
}
```

**Источник:** [Cppreference: Exception handling](https://en.cppreference.com/w/cpp/language/exceptions)

15. Можно ли выбрасывать объект любого типа?

**Ответ:** В C++ технически можно выбрасывать объект практически любого типа, поддерживающего копирование или перемещение (включая примитивные типы `int`, указатели `const char*`, структуры и классы).

**Пример:**

```cpp
throw 42;
throw "Error message";
throw true;
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw)

16. Почему в современном C++ обычно не рекомендуют бросать примитивы вроде `int`?

**Ответ:** Бросание примитивов не несет контекста ошибки, не предоставляет понятного описания (как метод `what()`), не образует иерархии для полиморфного перехвата, затрудняет поддержку и ломает предсказуемость обработки ошибок стандартными библиотеками.

**Пример:**

```cpp
// Плохо:
throw 404; // Что значит 404? Код HTTP? Байт? Смещение?

// Хорошо:
#include <stdexcept>
throw std::runtime_error("HTTP 404: Resource not found");
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

17. Как выглядит простой пример `throw std::runtime_error("error");`?

**Ответ:** Это стандартный способ выброса ошибки времени выполнения с текстовым описанием сути сбоя.

**Пример:**

```cpp
#include <iostream>
#include <stdexcept>

void process() {
    throw std::runtime_error("Database connection timeout");
}

int main() {
    try {
        process();
    } catch (const std::runtime_error& err) {
        std::cerr << "Caught: " << err.what() << '\n';
    }
}
```

**Источник:** [Cppreference: std::runtime_error](https://en.cppreference.com/w/cpp/error/runtime_error)

18. Что такое стандартные исключения в C++?

**Ответ:** Стандартные исключения — это набор встроенных классов стандартной библиотеки C++, унаследованных от `std::exception`, используемых STL и предназначенных для уведомления о типовых ошибках (нехватка памяти, выход за пределы массива, неверные аргументы и т. д.).

**Пример:**

```cpp
#include <vector>
#include <iostream>
#include <stdexcept>

int main() {
    std::vector<int> v;
    try {
        v.at(10); // выбрасывает стандартное std::out_of_range
    } catch (const std::out_of_range& e) {
        std::cout << e.what() << '\n';
    }
}
```

**Источник:** [Cppreference: std::exception hierarchy](https://en.cppreference.com/w/cpp/error/exception)

19. Что такое `std::exception`?

**Ответ:** `std::exception` — это базовый полиморфный класс для всех исключений, выбрасываемых компонентами стандартной библиотеки C++. Он объявлен в заголовке `<exception>` и предоставляет виртуальный метод `what()`.

**Пример:**

```cpp
#include <exception>
#include <iostream>

void inspectException(const std::exception& e) {
    std::cout << "Handled: " << e.what() << '\n';
}
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

20. Почему `std::exception` важен как базовый класс для многих исключений?

**Ответ:** Наследование от `std::exception` дает возможность организовывать полиморфный перехват любых стандартных и пользовательских ошибок через одну общую ссылку `const std::exception&`, обеспечивая единый интерфейс получения текста ошибки через `what()`.

**Пример:**

```cpp
#include <iostream>
#include <exception>

try {
    runApplication();
} catch (const std::exception& e) { // Ловит любые дочерние исключения
    std::cerr << "Fatal error: " << e.what() << '\n';
}
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

21. Что делает метод `what()`?

**Ответ:** Метод `what()` является виртуальным константным методом класса `std::exception` (и его наследников), который возвращает пояснительное сообщение о произошедшей ошибке в виде нуль-терминированной строки.

**Пример:**

```cpp
#include <stdexcept>
#include <iostream>

std::runtime_error err("Network disconnected");
std::cout << err.what() << '\n'; // Выводит: Network disconnected
```

**Источник:** [Cppreference: std::exception::what](https://en.cppreference.com/w/cpp/error/exception/what)

22. Что возвращает `what()`?

**Ответ:** Метод `what()` возвращает указатель типа `const char*` на массив символов, содержащий текст диагностического сообщения, хранящийся внутри объекта исключения.

**Пример:**

```cpp
#include <exception>
#include <stdexcept>

const char* getErrorMessage(const std::exception& ex) {
    return ex.what(); // Возвращает const char*
}
```

**Источник:** [Cppreference: std::exception::what](https://en.cppreference.com/w/cpp/error/exception/what)

23. Что такое строка сообщения об ошибке в исключении?

**Ответ:** Это текстовая диагностическая информация, передаваемая в конструктор класса исключения (например, `std::runtime_error`), которая сохраняется внутри объекта и возвращается методом `what()` для информирования разработчика или записи в лог.

**Пример:**

```cpp
#include <stdexcept>
#include <string>

std::string reason = "Disk full: " + std::to_string(0) + " bytes left";
throw std::runtime_error(reason); // Передача строки сообщения
```

**Источник:** [Cppreference: std::runtime_error](https://en.cppreference.com/w/cpp/error/runtime_error)

24. Что такое `std::runtime_error`?

**Ответ:** `std::runtime_error` — это стандартный класс исключений (наследник `std::exception`), предназначенный для сообщения об ошибках, которые невозможно легко обнаружить или предсказать статическим анализом программы до момента её выполнения (сбои ввода-вывода, системные сбои, тайм-ауты).

**Пример:**

```cpp
#include <stdexcept>

void readSensor() {
    bool sensorOk = false;
    if (!sensorOk) {
        throw std::runtime_error("Hardware sensor failed to respond");
    }
}
```

**Источник:** [Cppreference: std::runtime_error](https://en.cppreference.com/w/cpp/error/runtime_error)

25. Что такое `std::logic_error`?

**Ответ:** `std::logic_error` — это стандартный класс исключений (наследник `std::exception`), отражающий ошибки в логике самой программы и нарушение внутренних инвариантов, которые теоретически можно предотвратить предварительными проверками в коде (например, нарушение предусловий).

**Пример:**

```cpp
#include <stdexcept>

void setPercentage(int p) {
    if (p < 0 || p > 100) {
        throw std::logic_error("Percentage outside valid range [0, 100]");
    }
}
```

**Источник:** [Cppreference: std::logic_error](https://en.cppreference.com/w/cpp/error/logic_error)

26. Чем `runtime_error` отличается от `logic_error` по смыслу?

**Ответ:** `logic_error` сигнализирует о дефекте в логике кода (баге программы, который программист обязан был предусмотреть), тогда как `runtime_error` сигнализирует о внешних непредсказуемых факторах среды выполнения (недоступность файла, разрыв сетевого соединения, сбой внешнего устройства).

**Пример:**

```cpp
// logic_error: ошибка в вызывающем коде (нарушен контракт)
if (ptr == nullptr) throw std::logic_error("Null pointer provided");

// runtime_error: сбой окружения, код корректен
if (!file.is_open()) throw std::runtime_error("Cannot open file from OS");
```

**Источник:** [Cppreference: std::logic_error](https://en.cppreference.com/w/cpp/error/logic_error)

27. Что такое `std::out_of_range`?

**Ответ:** `std::out_of_range` — это класс исключения (наследник `std::logic_error`), сигнализирующий о попытке обращения к элементу за пределами допустимого диапазона (например, в `std::vector::at` или `std::string::at`).

**Пример:**

```cpp
#include <vector>
#include <stdexcept>

std::vector<int> data = {1, 2, 3};
int val = data.at(5); // выбрасывает std::out_of_range
```

**Источник:** [Cppreference: std::out_of_range](https://en.cppreference.com/w/cpp/error/out_of_range)

28. Что такое `std::invalid_argument`?

**Ответ:** `std::invalid_argument` — класс исключения (наследник `std::logic_error`), сообщающий о передаче некорректного аргумента в функцию (например, недопустимого формата строки в `std::stoi`).

**Пример:**

```cpp
#include <string>
#include <stdexcept>

int main() {
    int num = std::stoi("not_a_number"); // выбрасывает std::invalid_argument
}
```

**Источник:** [Cppreference: std::invalid_argument](https://en.cppreference.com/w/cpp/error/invalid_argument)

29. Что такое `std::bad_alloc`?

**Ответ:** `std::bad_alloc` — это класс стандартного исключения (прямой потомок `std::exception`), выбрасываемый стандартными операторами выделения динамической памяти (например, `new`), когда запрошенный объем памяти не может быть выделен операционной системой.

**Пример:**

```cpp
#include <new>
#include <iostream>

try {
    size_t huge = static_cast<size_t>(-1) / 2;
    int* p = new int[huge];
} catch (const std::bad_alloc& e) {
    std::cout << "Memory allocation failure: " << e.what() << '\n';
}
```

**Источник:** [Cppreference: std::bad_alloc](https://en.cppreference.com/w/cpp/memory/new/bad_alloc)

30. Когда может возникнуть `std::bad_alloc`?

**Ответ:** `std::bad_alloc` возникает при исчерпании доступной виртуальной памяти процесса, чрезмерной фрагментации кучи или попытке выделить нереалистично огромный непрерывный блок памяти через оператор `new` или контейнеры STL (например, `std::vector::resize`).

**Пример:**

```cpp
#include <vector>

void allocateHuge() {
    std::vector<int> hugeVec;
    hugeVec.reserve(1'000'000'000'000ULL); // std::bad_alloc при нехватке памяти
}
```

**Источник:** [Cppreference: operator new](https://en.cppreference.com/w/cpp/memory/new/operator_new)

31. Что такое блок `try`?

**Ответ:** Блок `try` — это составной оператор, предваряемый ключевым словом `try`, определяющий область кода, в которой активируется отслеживание исключений для последующей передачи управления обработчикам `catch`.

**Пример:**

```cpp
try {
    auto result = 100 / 1;
} catch (...) {}
```

**Источник:** [Cppreference: try-block](https://en.cppreference.com/w/cpp/language/try_catch)

32. Что такое блок `catch`?

**Ответ:** Блок `catch` — это часть составной конструкции `try/catch`, содержащая тип перехватываемого значения и тело функции-обработчика, исполняемого в случае возникновения совпадения типа выброшенного исключения.

**Пример:**

```cpp
try {
    throw "Fatal";
} catch (const char* msg) { // блок catch
    // Реакция на ошибку
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

33. Можно ли после одного `try` иметь несколько `catch`?

**Ответ:** Да, к одному блоку `try` можно привязать сколь угодно много блоков `catch`, каждый из которых будет специализироваться на перехвате конкретного типа исключений.

**Пример:**

```cpp
try {
    step();
} catch (const std::out_of_range& e) {
    // 1-й обработчик
} catch (const std::runtime_error& e) {
    // 2-й обработчик
} catch (...) {
    // 3-й обработчик
}
```

**Источник:** [Cppreference: Multiple catch blocks](https://en.cppreference.com/w/cpp/language/try_catch)

34. Как выбирается подходящий `catch`?

**Ответ:** Блоки `catch` проверяются строго сверху вниз по порядку их объявления в коде. Активируется первый блок, чей объявленный тип совпадает с типом исключения, является его открытым базовым классом или представляет собой `catch(...)`.

**Пример:**

```cpp
#include <stdexcept>
#include <iostream>

try {
    throw std::runtime_error("Err");
} catch (const std::exception& e) { // Сработает этот, так как он первый подходящий базовый класс
    std::cout << "Caught base: " << e.what() << '\n';
} catch (const std::runtime_error& e) {
    std::cout << "Caught derived\n"; // Никогда не выполнится
}
```

**Источник:** [Cppreference: Catch matching](https://en.cppreference.com/w/cpp/language/try_catch)

35. Почему порядок `catch`-блоков важен?

**Ответ:** Порядок критичен, так как обработчики сопоставляются последовательно. Если блок базового класса (например, `std::exception`) поместить перед производным классом (например, `std::runtime_error`), производный блок никогда не получит управления, став недостижимым кодом.

**Пример:**

```cpp
// ПРАВИЛЬНО: от частного к общему
try {
    doAction();
} catch (const std::out_of_range& e) {
    // Частный случай
} catch (const std::exception& e) {
    // Общий случай
}
```

**Источник:** [Cppreference: Handler matching](https://en.cppreference.com/w/cpp/language/try_catch)

36. Что такое `catch (...)`?

**Ответ:** `catch (...)` (catch-all) — это универсальный обработчик исключений, способный перехватить абсолютно любое выброшенное исключение независимо от его типа (включая типы, не унаследованные от `std::exception`, и примитивы).

**Пример:**

```cpp
try {
    throw 42;
} catch (...) {
    // Будет перехвачено любое исключение
}
```

**Источник:** [Cppreference: catch-all](https://en.cppreference.com/w/cpp/language/try_catch)

37. Когда используют `catch (...)`?

**Ответ:** `catch (...)` используют на верхних уровнях архитектуры приложения, на границах потоков выполнения, в деструкторах или на стыке с C-библиотеками (C ABI), чтобы предотвратить аварийный вызов `std::terminate()` при непредвиденном исключении.

**Пример:**

```cpp
#include <iostream>

void threadEntryPoint() {
    try {
        runTask();
    } catch (...) {
        std::cerr << "Unknown catastrophic error in thread!\n";
    }
}
```

**Источник:** [Cppreference: try-catch handlers](https://en.cppreference.com/w/cpp/language/try_catch)

38. Чем `catch (...)` отличается от `catch(const std::exception&)`?

**Ответ:** `catch(const std::exception&)` перехватывает только объекты `std::exception` и его наследников, предоставляя доступ к информации об ошибке через `.what()`. `catch (...)` перехватывает абсолютно всё, но не дает прямого доступа к объекту исключения или его методам.

**Пример:**

```cpp
try {
    throw "raw C-string";
} catch (const std::exception& e) {
    // Сюда не попадет
} catch (...) {
    // Попадет сюда!
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

39. Что такое стековая раскрутка при исключении?

**Ответ:** Стековая раскрутка (stack unwinding) — это автоматический процесс освобождения стековых фреймов, при котором для всех локальных объектов, сконструированных между точкой входа в `try` и выражением `throw`, гарантированно вызываются деструкторы в порядке, обратном их созданию.

**Пример:**

```cpp
#include <iostream>

struct Tracer {
    std::string name;
    Tracer(std::string n) : name(n) {}
    ~Tracer() { std::cout << "Destruct: " << name << '\n'; }
};

void run() {
    Tracer a("first");
    Tracer b("second");
    throw std::runtime_error("Error"); // Раскрутка стека: вызовется ~Tracer для b, затем для a
}
```

**Источник:** [Cppreference: Stack unwinding](https://en.cppreference.com/w/cpp/language/throw#Stack_unwinding)

40. Почему при исключении вызываются деструкторы локальных объектов?

**Ответ:** Вызов деструкторов заложен стандартом C++ как фундаментальная гарантия управления временем жизни объектов, обеспечивающая очистку занятой памяти и освобождение ресурсов при досрочном покидании области видимости.

**Пример:**

```cpp
#include <fstream>

void writeFile() {
    std::ofstream out("log.txt"); // Ресурс ОС (файловый дескриптор)
    throw std::runtime_error("IO error");
    // Файл будет автоматически закрыт деструктором out при раскрутке стека
}
```

**Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

41. Что такое RAII в контексте исключений?

**Ответ:** RAII (_Resource Acquisition Is Initialization_) — идиома, связывающая владение ресурсом со временем жизни автоматического объекта. В контексте исключений RAII гарантирует отсутствие утечек: при возникновении исключения деструктор автоматически освободит ресурс в процессе раскрутки стека.

**Пример:**

```cpp
#include <memory>

void safeFunction() {
    auto ptr = std::make_unique<int[]>(1000); // Ресурс под защитой RAII
    throw std::runtime_error("Fail");         // Память ptr освободится автоматически
}
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

42. Почему RAII делает код безопаснее при исключениях?

**Ответ:** Без RAII программист вынужден вручную освобождать каждый ресурс перед каждым потенциальным `throw`, что приводит к утечкам ресурсов при непредвиденных ошибках. RAII делегирует освобождение компилятору и деструкторам, делая очистку не зависящей от путей выхода из функции.

**Пример:**

```cpp
#include <mutex>

std::mutex mtx;

void safeLock() {
    std::lock_guard<std::mutex> lock(mtx); // Гарантированно снимет блокировку при throw
    throw std::runtime_error("Error while locked");
}
```

**Источник:** [Cppreference: std::lock_guard](https://en.cppreference.com/w/cpp/thread/lock_guard)

43. Можно ли выбрасывать исключение из функции `main()`?

**Ответ:** Да, из функции `main()` можно выбрасывать исключения (напрямую или через вызываемые функции), но если они не пойманы внутри `main()`, программа завершится аварийно через вызов `std::terminate()`.

**Пример:**

```cpp
int main() {
    throw std::runtime_error("Fatal startup error"); // Допустимо компилятором, но приведет к terminate
}
```

**Источник:** [Cppreference: main function](https://en.cppreference.com/w/cpp/language/main_function)

44. Что произойдёт, если исключение дойдёт до `main()` и не будет поймано?

**Ответ:** Вызовется функция `std::terminate()`. При этом стандарт не гарантирует вызов деструкторов локальных объектов, созданных в `main()`, что приводит к моментальной остановке процесса.

**Пример:**

```cpp
#include <iostream>

struct Guard {
    ~Guard() { std::cout << "~Guard()\n"; } // Может не вызваться!
};

int main() {
    Guard g;
    throw 1; // std::terminate()
}
```

**Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

45. Зачем оборачивать тело `main()` в `try/catch`?

**Ответ:** Это делается для глобального перехвата всех непредвиденных ошибок, логирования их стека/сообщения в лог-файлы или консоль, а также для обеспечения корректного завершения программы с предсказуемым кодом возврата вместо аварийного падения.

**Пример:**

```cpp
#include <iostream>
#include <exception>

int main() {
    try {
        runApp();
        return 0;
    } catch (const std::exception& e) {
        std::cerr << "Unhandled top-level error: " << e.what() << '\n';
        return 1;
    } catch (...) {
        std::cerr << "Unknown non-standard exception!\n";
        return 2;
    }
}
```

**Источник:** [Cppreference: try-block](https://en.cppreference.com/w/cpp/language/try_catch)

46. Можно ли написать `throw;` без объекта?

**Ответ:** Да, выражение `throw;` без операнда допустимо и используется исключительно внутри блока `catch` (или функций, вызываемых из него) для повторного возбуждения (_rethrow_) текущего обрабатываемого исключения.

**Пример:**

```cpp
try {
    // ...
} catch (...) {
    throw; // Повторный выброс
}
```

**Источник:** [Cppreference: Rethrow](https://en.cppreference.com/w/cpp/language/throw#The_rethrow_expression)

47. Что означает `throw;` внутри `catch`?

**Ответ:** Это инструкция повторного выброса (_rethrow_), которая возобновляет полет текущего активного объекта исключения вверх по стеку к внешним блокам `try/catch` с полным сохранением его оригинального динамического типа.

**Пример:**

```cpp
#include <iostream>
#include <stdexcept>

void logAndRethrow() {
    try {
        throw std::out_of_range("Invalid index");
    } catch (const std::exception& e) {
        std::cout << "Logged: " << e.what() << '\n';
        throw; // Пробрасываем оригинальный std::out_of_range дальше
    }
}
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw#The_rethrow_expression)

48. Чем `throw;` отличается от `throw e;`?

**Ответ:** `throw;` повторно выбрасывает существующий исходный объект полиморфного типа без его копирования. Выражение `throw e;` создает новый объект-исключение через конструктор копирования переменной `e`, что при ловле по базовому типу приводит к срезке объекта (_object slicing_).

**Пример:**

```cpp
try {
    throw std::runtime_error("Error");
} catch (const std::exception& e) {
    // throw e; // ПЛОХО: срежет до std::exception
    throw;      // ХОРОШО: сохранит реальный тип std::runtime_error
}
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw)

49. Что такое повторный выброс исключения?

**Ответ:** Повторный выброс исключения (_rethrow_) — это передача уже пойманного исключения дальше вверх по стеку вызовов (обычно после частичной обработки, закрытия локального контекста или записи в лог).

**Пример:**

```cpp
try {
    processTransaction();
} catch (const std::exception& e) {
    rollbackTransaction();
    throw; // Повторный выброс для уведомления верхних слоев
}
```

**Источник:** [Cppreference: throw expression](https://en.cppreference.com/w/cpp/language/throw#The_rethrow_expression)

50. Почему важно различать повторный выброс и выброс копии?

**Ответ:** Различие критично для сохранения полиморфизма и производительности: повторный выброс (`throw;`) не вызывает лишнего копирования и сохраняет динамический тип объекта, а выброс копии (`throw e;`) влечет срезку типа (_slicing_) и потерю метаданных ошибки.

**Пример:**

```cpp
struct CustomDerived : public std::runtime_error {
    CustomDerived() : std::runtime_error("Custom details") {}
};

try {
    try {
        throw CustomDerived();
    } catch (const std::exception& e) {
        throw; // Внешний catch увидит CustomDerived
        // throw e; // Внешний catch увидит только std::exception (срезка!)
    }
} catch (const CustomDerived& d) {
    // Поймает только при throw;
}
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw)

## Ниже среднего уровня

51. Почему исключения обычно ловят по ссылке?

**Ответ:** Ловля по ссылке исключает создание лишней копии объекта-исключения и предотвращает срезку типов (_object slicing_), позволяя работать с полиморфными объектами через базовый интерфейс.

**Пример:**

```cpp
try {
    doSomething();
} catch (const std::exception& e) { // Без копирования и срезки
    std::cout << e.what() << '\n';
}
```

**Источник:** [Cppreference: try-catch handlers](https://en.cppreference.com/w/cpp/language/try_catch)

52. Почему обычно рекомендуют `catch(const std::exception& e)`?

**Ответ:** Данная конструкция является идиоматической: она гарантирует перехват всех стандартных и пользовательских исключений, защищает объект от непреднамеренной модификации в блоке-обработчике и предотвращает срезку производных классов.

**Пример:**

```cpp
#include <iostream>
#include <exception>

void handleErrors() {
    try {
        run();
    } catch (const std::exception& e) {
        std::cerr << "Safe handling: " << e.what() << '\n';
    }
}
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

53. Чем ловля по значению отличается от ловли по ссылке?

**Ответ:** При ловле по значению (`catch (std::exception e)`) создается новый объект путем вызова конструктора копирования, что тратит ресурсы (а при нехватке памяти может привести к краху) и обрезает производный объект до полей базового класса.

**Пример:**

```cpp
// По значению (плохо):
catch (std::exception e) { /* копия + срезка */ }

// По ссылке (хорошо):
catch (const std::exception& e) { /* оригинал без копий */ }
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

54. Почему ловля по значению может привести к slicing?

**Ответ:** Если производный класс ловится сигнатурой базового класса по значению, то компилятор конструирует объект базового класса, копируя только его срез, а все расширенные поля производного класса отбрасываются вместе с его таблицей виртуальных методов (`vtable`).

**Пример:**

```cpp
struct Base : std::exception {
    const char* what() const noexcept override { return "Base"; }
};
struct Derived : Base {
    const char* what() const noexcept override { return "Derived"; }
};

try {
    throw Derived();
} catch (Base b) {
    // b.what() вернет "Base", так как произошла срезка!
}
```

**Источник:** [Cppreference: Object slicing](https://en.cppreference.com/w/cpp/language/copy_constructor)

55. Что такое object slicing применительно к исключениям?

**Ответ:** Это потеря специфического состояния и поведения производного объекта-исключения, когда он копируется в переменную своего базового класса при объявлении `catch (BaseException e)`.

**Пример:**

```cpp
#include <iostream>

struct MyError : public std::runtime_error {
    int errorCode = 503;
    MyError() : std::runtime_error("Service Unavailable") {}
};

try {
    throw MyError();
} catch (std::runtime_error err) { // Slicing: поле errorCode недоступно
    std::cout << err.what() << '\n';
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

56. Почему ловля по `const`-ссылке обычно считается лучшей практикой?

**Ответ:** Она исключает накладные расходы на копирование, полностью сохраняет виртуальную диспетчеризацию методов производного класса и сигнализирует компилятору и читателю кода, что обработчик является инспектирующим и не изменяет состояние ошибки.

**Пример:**

```cpp
try {
    compute();
} catch (const std::logic_error& e) { // Чистое чтение состояния ошибки
    logError(e.what());
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

57. Можно ли ловить исключение по неконстантной ссылке?

**Ответ:** Да, язык C++ разрешает синтаксис `catch (MyException& e)`, предоставляя возможность модифицировать пойманный объект-исключение в обработчике.

**Пример:**

```cpp
struct ModifiableException {
    int retryCount = 0;
};

try {
    throw ModifiableException();
} catch (ModifiableException& e) {
    e.retryCount++; // Изменяем состояние объекта
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

58. Когда это бывает нужно?

**Ответ:** Это требуется, когда обработчик хочет обогатить объект исключения дополнительным контекстом (добавить трассировку стека, таймстемп или метку узла) перед его повторным пробросом через `throw;`.

**Пример:**

```cpp
struct TracedError : public std::runtime_error {
    std::string context;
    TracedError(const char* m) : std::runtime_error(m) {}
};

try {
    // ...
} catch (TracedError& err) {
    err.context += " -> Checked in module B";
    throw; // Проброс дополненного исключения
}
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw)

59. Что такое пользовательский класс исключения?

**Ответ:** Это созданный разработчиком тип данных (обычно структура или класс), предназначенный для описания предметных доменных ошибок конкретной программы или библиотеки.

**Пример:**

```cpp
#include <stdexcept>

class DatabaseConnectionException : public std::runtime_error {
public:
    explicit DatabaseConnectionException(const std::string& host)
        : std::runtime_error("Could not connect to host: " + host) {}
};
```

**Источник:** [Cppreference: Derived classes](https://en.cppreference.com/w/cpp/language/derived_class)

60. Как создать собственное исключение, наследующееся от `std::exception`?

**Ответ:** Для этого создают производный класс от `std::exception` и переопределяют виртуальный метод `what() noexcept`, возвращающий описание ошибки.

**Пример:**

```cpp
#include <exception>

class MyCustomException : public std::exception {
public:
    const char* what() const noexcept override {
        return "My custom failure occurred";
    }
};
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

61. Нужно ли всегда наследоваться именно от `std::exception`?

**Ответ:** Формально язык не обязывает это делать, но на практике это негласный стандарт индустрии, так как отказ от наследования делает исключение «невидимым» для базовых блоков `catch (const std::exception&)`.

**Пример:**

```cpp
// Плохо: невозможно перехватить через std::exception
class AlienError {};

// Хорошо: интегрируется в общую экосистему
class AppError : public std::exception {};
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

62. Почему наследование от `std::exception` удобно для единообразной обработки?

**Ответ:** Это обеспечивает архитектурную целостность: вызывающий код может установить единый централизованный обработчик, логирующий `e.what()`, и корректно ловить как стандартные ошибки контейнеров/выделения памяти, так и любые ошибки пользовательского кода.

**Пример:**

```cpp
void execute(std::function<void()> task) {
    try {
        task();
    } catch (const std::exception& ex) {
        // Единый логгер для любых типов ошибок
        log(ex.what());
    }
}
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

63. Когда лучше использовать готовое стандартное исключение, а не писать своё?

**Ответ:** Готовые стандартные исключения (такие как `std::invalid_argument`, `std::out_of_range`, `std::runtime_error`) предпочтительнее, если ошибка является типовой, не содержит специализированных полей и не требует отдельного узкого блока `catch`.

**Пример:**

```cpp
#include <stdexcept>

void setSpeed(int speed) {
    if (speed < 0) {
        // Достаточно готового класса
        throw std::invalid_argument("Speed cannot be negative");
    }
}
```

**Источник:** [Cppreference: Standard exceptions](https://en.cppreference.com/w/cpp/error/exception)

64. Чем `std::runtime_error` удобен как базовый класс для пользовательского исключения?

**Ответ:** Он уже реализует внутреннее хранение строки сообщения (`std::string`) и переопределяет метод `what()`, избавляя разработчика от написания собственной логики хранения и управления строковым буфером.

**Пример:**

```cpp
#include <stdexcept>
#include <string>

class ConfigParseError : public std::runtime_error {
public:
    ConfigParseError(int line, const std::string& msg)
        : std::runtime_error("Line " + std::to_string(line) + ": " + msg) {}
};
```

**Источник:** [Cppreference: std::runtime_error](https://en.cppreference.com/w/cpp/error/runtime_error)

65. Что такое исключение логической ошибки?

**Ответ:** Это исключение, сигнализирующее о нарушении контракта функции, инварианта класса или алгоритмической логики программы (например, обращение по несуществующему индексу), вызванное ошибкой в самом исходном коде.

**Пример:**

```cpp
#include <stdexcept>

int getElementAt(int index, int size) {
    if (index < 0 || index >= size) {
        throw std::length_error("Index violates contract constraints");
    }
    return 0;
}
```

**Источник:** [Cppreference: std::logic_error](https://en.cppreference.com/w/cpp/error/logic_error)

66. Что такое исключение ошибки времени выполнения?

**Ответ:** Это исключение, вызванное внешними условиями, которые невозможно гарантированно устранить превентивной проверкой в коде (например, обрыв сетевого сокета, ошибка файловой системы, отсутствие прав доступа к файлу).

**Пример:**

```cpp
#include <stdexcept>

void readSocketData() {
    bool networkLost = true;
    if (networkLost) {
        throw std::runtime_error("Connection reset by peer");
    }
}
```

**Источник:** [Cppreference: std::runtime_error](https://en.cppreference.com/w/cpp/error/runtime_error)

67. Почему не каждая ошибка программы должна обрабатываться исключением?

**Ответ:** Исключения имеют значительный оверхед при возникновении (тяжелый процесс раскрутки стека), усложняют контроль потока управления и избыточны для ожидаемых штатных ситуаций (например, валидация пользовательского ввода или неуспешный поиск в мапе).

**Пример:**

```cpp
#include <optional>
#include <string>

// Лучше вернуть std::optional, чем бросать исключение на штатный ввод
std::optional<int> tryParseInt(const std::string& str);
```

**Источник:** [Cppreference: std::optional](https://en.cppreference.com/w/cpp/utility/optional)

68. Когда исключение уместнее, чем код возврата?

**Ответ:** Исключения уместнее, когда сбой критичен и нормальное продолжение функции невозможно, при сбоях в конструкторах/операторах (где физически нет возвращаемого значения), а также при необходимости передать ошибку через множество слоев абстракции наверх.

**Пример:**

```cpp
struct DatabaseDriver {
    DatabaseDriver(const std::string& connString) {
        if (!connect(connString)) {
            throw std::runtime_error("Cannot initialize essential DB connection");
        }
    }
};
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw)

69. Когда код возврата может быть лучше исключения?

**Ответ:** Код возврата (или типы вроде `std::optional`/`std::expected`) лучше в высоконагруженных циклах, системах жесткого реального времени, в микроконтроллерах (где исключения отключены флагом `-fno-exceptions`) и для ожидаемых событий валидации.

**Пример:**

```cpp
#include <string_view>

// Возврат false/true лучше исключений для регулярной валидации
bool isValidEmail(std::string_view email) {
    return email.find('@') != std::string_view::npos;
}
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

70. Что такое normal flow и exceptional flow?

**Ответ:** Normal flow (штатный поток) — это путь исполнения программы при отсутствии сбоев. Exceptional flow (исключительный поток) — альтернативный путь исполнения при возникновении ошибки, активирующий механизм раскрутки стека и поиск обработчика в обход обычных `return`.

**Пример:**

```cpp
void run() {
    // Normal flow:
    prepare();
    execute();
    cleanup();

    // При возникновении исключения в execute():
    // Активируется exceptional flow -> cleanup() не вызовется напрямую,
    // управление мгновенно передается наверх в catch.
}
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

71. Почему исключения предназначены не для обычной логики ветвления?

**Ответ:** Использование исключений для ветвления (control flow) делает код тяжело читаемым («goto на стероидах»), мешает оптимизациям компилятора и кардинально просаживает производительность из-за затрат на выброс и перехват исключений.

**Пример:**

```cpp
// АНТИПАТТЕРН: использование исключений вместо цикла/условия
try {
    while (true) {
        processItem(queue.popOrThrow());
    }
} catch (const QueueEmptyException&) {
    // Выход из цикла через исключение - так делать нельзя!
}
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

72. Что такое stack unwinding?

**Ответ:** Это системный механизм C++, который при генерации исключения последовательно проходит по цепочке стековых кадров снизу вверх, уничтожая (через вызовы деструкторов) все созданные в этих кадрах локальные автоматические объекты.

**Пример:**

```cpp
#include <iostream>

struct LogOnExit {
    ~LogOnExit() { std::cout << "Stack unwound successfully\n"; }
};

void f() {
    LogOnExit l;
    throw 1; // Запуск stack unwinding
}
```

**Источник:** [Cppreference: Stack unwinding](https://en.cppreference.com/w/cpp/language/throw#Stack_unwinding)

73. Какие объекты уничтожаются во время stack unwinding?

**Ответ:** Уничтожаются все автоматические (стековые) объекты с автоматической продолжительностью жизни (_automatic storage duration_), которые были полностью сконструированы к моменту выполнения инструкции `throw`.

**Пример:**

```cpp
void foo() {
    std::string a = "test"; // Будет уничтожена
    int b = 10;             // Память освободится
    static int c = 20;      // НЕ будет уничтожен (статическое время жизни)
    throw std::runtime_error("err");
}
```

**Источник:** [Cppreference: Storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

74. Уничтожаются ли уже полностью сконструированные локальные объекты при раскрутке стека?

**Ответ:** Да, язык гарантирует, что для каждого полностью сконструированного автоматического объекта деструктор будет вызван в порядке, строго обратном порядку завершения его конструктора.

**Пример:**

```cpp
struct A { ~A() {} };
struct B { ~B() {} };

void f() {
    A a;
    B b;
    throw 0; // ~B(), затем ~A()
}
```

**Источник:** [Cppreference: Stack unwinding](https://en.cppreference.com/w/cpp/language/throw#Stack_unwinding)

75. Что происходит с объектом, конструктор которого выбросил исключение?

**Ответ:** Объект считается несконструированным, его время жизни официально не начинается, поэтому собственный деструктор этого объекта **не вызывается**. Однако для всех его полей и базовых классов, которые уже успели сконструироваться до момента `throw`, автоматически вызываются деструкторы.

**Пример:**

```cpp
#include <iostream>

struct MyClass {
    MyClass() {
        std::cout << "Init start\n";
        throw std::runtime_error("Constructor failed");
    }
    ~MyClass() {
        std::cout << "Destructor called\n"; // НЕ вызовется никогда
    }
};
```

**Источник:** [Cppreference: Constructors and member initializer lists](https://en.cppreference.com/w/cpp/language/constructor)

76. Вызывается ли деструктор у объекта, который не был полностью сконструирован?

**Ответ:** Нет, деструктор неконструированного объекта компилятором никогда не вызывается, так как объект так и не начал формально существовать.

**Пример:**

```cpp
struct Test {
    Test() { throw 1; }
    ~Test() { std::terminate(); } // Не будет вызван
};
```

**Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

77. Что происходит с уже сконструированными полями объекта, если конструктор выбросил исключение?

**Ответ:** Деструкторы всех полей класса и базовых подклассов, чьи конструкторы успели успешно завершиться в списке инициализации до точки выброса исключения, вызываются автоматически в порядке, обратном порядку их инициализации.

**Пример:**

```cpp
#include <iostream>
#include <string>

struct Holder {
    std::string s1; // 1. Сконструируется
    std::string s2; // 2. Сконструируется
    Holder() : s1("first"), s2("second") {
        throw std::runtime_error("Error in body");
        // ~s2(), затем ~s1() вызовутся автоматически
    }
};
```

**Источник:** [Cppreference: Member initialization](https://en.cppreference.com/w/cpp/language/initializer_list)

78. Почему порядок инициализации полей важен для exception safety?

**Ответ:** Порядок инициализации всегда определяется порядком объявления полей в классе. Если одно поле захватывает сырой ресурс, а второе выбрасывает исключение, ресурс первого поля утечет, если он не обернут в RAII.

**Пример:**

```cpp
// ОПАСНО: при исключении в p2, сырой указатель p1 утечет!
struct Danger {
    int* p1;
    int* p2;
    Danger() : p1(new int(1)), p2(new int[10000000000ULL]) {}
};

// БЕЗОПАСНО:
struct Safe {
    std::unique_ptr<int> p1;
    std::unique_ptr<int[]> p2;
    Safe() : p1(std::make_unique<int>(1)), p2(new int[10000000000ULL]) {}
};
```

**Источник:** [Cppreference: Initialization order](https://en.cppreference.com/w/cpp/language/data_members)

79. Можно ли бросать исключения из конструктора?

**Ответ:** Да, это разрешено стандартом и является единственным общепринятым идиоматическим способом сообщить внешнему миру о невозможности создать экземпляр объекта.

**Пример:**

```cpp
#include <fstream>
#include <stdexcept>

struct FileViewer {
    std::ifstream file;
    FileViewer(const std::string& path) : file(path) {
        if (!file.is_open()) {
            throw std::runtime_error("Failed to open file: " + path);
        }
    }
};
```

**Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

80. Когда это нормальная практика?

**Ответ:** Это считается лучшей практикой в случаях нарушения предусловий создания объекта, недоступности системных ресурсов, невалидных переданных аргументах или сбоях валидации инвариантов класса.

**Пример:**

```cpp
#include <stdexcept>

class PositiveNumber {
    int value;
public:
    PositiveNumber(int v) : value(v) {
        if (value <= 0) {
            throw std::invalid_argument("Value must be > 0");
        }
    }
};
```

**Источник:** [Cppreference: Constructor](https://en.cppreference.com/w/cpp/language/constructor)

81. Почему конструктор не может “вернуть ошибку” обычным `return`?

**Ответ:** Конструктор в C++ не имеет возвращаемого значения в своей сигнатуре; оператор `return;` просто досрочно завершает тело конструктора, в результате чего вызывающий код получит не полностью инициализированный объект, считая его валидным.

**Пример:**

```cpp
struct BadSocket {
    int fd = -1;
    BadSocket() {
        if (true) return; // fd остался -1, но объект "создан"!
    }
};
```

**Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

82. Почему конструктор должен либо создать валидный объект, либо выбросить исключение?

**Ответ:** Это фундаментальный принцип идиомы RAII: успешное завершение конструктора должно гарантировать полную готовность объекта к работе (соблюдение его инварианта), исключая появление в программе объектов в полусломанном или неинициализированном состоянии.

**Пример:**

```cpp
class ValidConnection {
public:
    ValidConnection(const std::string& ip) {
        if (!connectTo(ip)) {
            throw std::runtime_error("Connection failure");
        }
        // Если дошли сюда, инвариант гарантирован
    }
private:
    bool connectTo(const std::string&) { return false; }
};
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

83. Можно ли бросать исключение из деструктора?

**Ответ:** Формально синтаксис позволяет это при наличии спецификатора `noexcept(false)`, но в C++ это категорически запрещено архитектурно, поскольку деструкторы по умолчанию считаются `noexcept(true)` начиная с C++11.

**Пример:**

```cpp
struct Risky {
    ~Risky() noexcept(false) { // Крайне опасно!
        throw std::runtime_error("Never do this");
    }
};
```

**Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

84. Почему выбрасывать исключения из деструктора опасно?

**Ответ:** Если деструктор выбрасывает исключение в момент, когда уже идет раскрутка стека из-за другого первичного исключения, среда выполнения C++ мгновенно вызывает `std::terminate()`, что приводит к аварийному падению программы.

**Пример:**

```cpp
struct Bomb {
    ~Bomb() noexcept(false) { throw 2; }
};

void explode() {
    Bomb b;
    throw 1; // Раскрутка стека вызывает ~Bomb(), который кидает 2 -> std::terminate()
}
```

**Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

85. Что произойдёт, если деструктор выбросит исключение во время stack unwinding?

**Ответ:** В программе возникнет состояние одновременного наличия двух активных исключений, которое среда выполнения C++ не в состоянии разрешить, что приводит к немедленному вызову функции `std::terminate()`.

**Пример:**

```cpp
#include <exception>

struct Bad {
    ~Bad() noexcept(false) { throw 1; }
};

int main() {
    try {
        Bad b;
        throw 2; // Во время раскрутки летит Bad::~Bad -> std::terminate()
    } catch (...) {}
}
```

**Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

86. Что такое `std::terminate`?

**Ответ:** `std::terminate` — это встроенная функция стандартной библиотеки, предназначенная для аварийного прекращения работы программы в случаях критического нарушения механизма обработки исключений.

**Пример:**

```cpp
#include <exception>

void failInstantly() {
    std::terminate(); // Аварийный останов программы
}
```

**Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

87. Когда вызывается `std::terminate`?

**Ответ:** `std::terminate` вызывается при выбросе исключения из функции `noexcept`, при неперехваченном исключении, при выбросе исключения из деструктора во время раскрутки стека, а также при разрушении активного объекта `std::thread`, который не был предварительно присоединен (`join`) или отсоединен (`detach`).

**Пример:**

```cpp
void badFunc() noexcept {
    throw std::runtime_error("Violation of noexcept"); // Вызовет std::terminate
}
```

**Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

88. Что такое `noexcept`?

**Ответ:** `noexcept` — это спецификатор функции (и одноименный оператор времени компиляции), гарантирующий, что данная функция не выпустит наружу никаких исключений.

**Пример:**

```cpp
void safeOperation() noexcept {
    // Гарантированно не выпускает исключений
}
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

89. Что означает `noexcept` у функции?

**Ответ:** Это обещание компилятору и вызывающему коду, что функция не генерирует исключений, что позволяет компилятору генерировать более оптимизированный бинарный код (не создавая инфраструктуру для раскрутки стека) и дает возможность контейнерам STL использовать перемещение вместо копирования.

**Пример:**

```cpp
#include <vector>

struct Item {
    Item(Item&&) noexcept {} // std::vector использует move только если есть noexcept
};
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

90. Что произойдёт, если функция, объявленная `noexcept`, всё же выбросит исключение?

**Ответ:** Исключение не сможет покинуть тело этой функции; поиск блоков `catch` на более высоких уровнях прекращается, и среда выполнения немедленно вызывает `std::terminate()`.

**Пример:**

```cpp
void brokenContract() noexcept {
    throw std::runtime_error("Surprise"); // Программа аварийно завершится
}
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

91. Почему многие деструкторы не должны бросать исключения?

**Ответ:** Деструкторы вызываются при нормальной работе и при очистке стека. Если деструктор выбрасывает исключение, он делает невозможным безопасную раскрутку стека, нарушает инварианты контейнеров STL и провоцирует аварийное завершение процесса.

**Пример:**

```cpp
struct SafeResource {
    ~SafeResource() noexcept {
        // Очистка ресурсов без генерации исключений
    }
};
```

**Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

92. Что такое функция `what()` у стандартных исключений?

**Ответ:** Это открытый виртуальный метод с сигнатурой `virtual const char* what() const noexcept;`, определенный в `std::exception`, служащий единым полиморфным интерфейсом для чтения диагностического сообщения об ошибке.

**Пример:**

```cpp
#include <iostream>
#include <stdexcept>

void printError(const std::exception& e) {
    std::cout << "Error details: " << e.what() << '\n';
}
```

**Источник:** [Cppreference: std::exception::what](https://en.cppreference.com/w/cpp/error/exception/what)

93. Что такое иерархия стандартных исключений?

**Ответ:** Это древовидная система классов стандартной библиотеки с корнем в виде `std::exception`, разделяющаяся на две основные ветви — `std::logic_error` и `std::runtime_error` — а также специальные системные классы (`std::bad_alloc`, `std::bad_cast` и др.).

**Пример:**

```text
std::exception
 ├── std::logic_error
 │    ├── std::invalid_argument
 │    ├── std::out_of_range
 │    └── ...
 ├── std::runtime_error
 │    ├── std::overflow_error
 │    └── ...
 ├── std::bad_alloc
 └── std::bad_cast
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

94. Почему полезно понимать иерархию `std::exception`?

**Ответ:** Понимание иерархии позволяет организовывать перехват исключений с нужным уровнем детализации: ловить узкоспециализированные классы ошибок там, где их можно исправить, или ловить базовые классы на верхних уровнях приложения для централизованной обработки.

**Пример:**

```cpp
try {
    process();
} catch (const std::out_of_range& e) {
    // Конкретная реакция на неверный индекс
} catch (const std::logic_error& e) {
    // Реакция на любую другую программную логическую ошибку
}
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

95. Можно ли ловить производные исключения через ссылку на базовый класс?

**Ответ:** Да, благодаря поддержке полиморфизма в механизме исключений C++, блок `catch (const Base&)` успешно ловит любой производный объект класса `Derived`, наследующего `Base`.

**Пример:**

```cpp
#include <iostream>
#include <stdexcept>

try {
    throw std::out_of_range("Out of range error");
} catch (const std::exception& e) { // Ловит std::out_of_range как базовый класс
    std::cout << e.what() << '\n';
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

96. Почему это полезно для общего обработчика?

**Ответ:** Это устраняет необходимость писать десятки дублирующихся блоков `catch` для каждого частного подтипа ошибок, позволяя перехватить все существующие и будущие производные исключения в одном месте через единый интерфейс `what()`.

**Пример:**

```cpp
try {
    runSubsystem();
} catch (const std::exception& e) {
    logger.logCritical("Subsystem failed: " + std::string(e.what()));
}
```

**Источник:** [Cppreference: std::exception](https://en.cppreference.com/w/cpp/error/exception)

97. Когда нужен более узкий `catch`, а когда общий?

**Ответ:** Узкий `catch` (например, `catch(const std::out_of_range&)`) нужен там, где конкретный сбой можно корректно нивелировать локально (например, запросить у пользователя другой индекс). Общий `catch` (`catch(const std::exception&)`) нужен на границах систем или в `main()` для логирования и безопасного завершения.

**Пример:**

```cpp
// Узкий перехват: исправляем проблему
try {
    return cache.at(key);
} catch (const std::out_of_range&) {
    return fetchFromDatabase(key);
}
```

**Источник:** [Cppreference: try-catch handlers](https://en.cppreference.com/w/cpp/language/try_catch)

98. Почему `catch(...)` часто ставят последним?

**Ответ:** Блок `catch(...)` перехватывает абсолютно любые исключения без разбора. Если поставить его первым, он заблокирует все последующие специализированные блоки `catch`, лишая возможности обработать конкретные типы ошибок.

**Пример:**

```cpp
try {
    execute();
} catch (const std::runtime_error& e) {
    // 1. Специфичный перехват
} catch (const std::exception& e) {
    // 2. Общий базовый перехват
} catch (...) {
    // 3. Последний рубеж для перехвата нестандартных исключений
}
```

**Источник:** [Cppreference: try-catch handlers](https://en.cppreference.com/w/cpp/language/try_catch)

99. Что такое propagation исключения вверх по стеку вызовов?

**Ответ:** Propagation (распространение) — это процесс передачи объекта исключения по иерархии активных стековых фреймов от функции, где произошел `throw`, через все промежуточные функции к ближайшему вызывающему контексту, содержащему подходящий блок `catch`.

**Пример:**

```cpp
void f3() { throw std::runtime_error("Boom"); }
void f2() { f3(); } // Исключение проходит насквозь
void f1() { f2(); } // Исключение проходит насквозь

int main() {
    try {
        f1();
    } catch (const std::exception& e) {
        // Поймано здесь после propagation через f3 -> f2 -> f1
    }
}
```

**Источник:** [Cppreference: Stack unwinding](https://en.cppreference.com/w/cpp/language/throw#Stack_unwinding)

100. Как исключение проходит через несколько функций, пока не будет поймано?

**Ответ:** Исключение немедленно завершает текущую функцию, вызывает деструкторы её локальных объектов, восстанавливает контекст предыдущей функции в стеке вызовов и проверяет наличие активного блока `try/catch`. Если подходящий обработчик не найден, процедура рекурсивно повторяется для следующего фрейма стека.

**Пример:**

```cpp
#include <iostream>

struct ScopeTracker {
    std::string tag;
    ScopeTracker(std::string t) : tag(t) {}
    ~ScopeTracker() { std::cout << "Unwound: " << tag << '\n'; }
};

void stepB() {
    ScopeTracker b("stepB");
    throw std::runtime_error("Fault");
}

void stepA() {
    ScopeTracker a("stepA");
    stepB();
}

int main() {
    try {
        stepA();
    } catch (const std::exception& e) {
        std::cout << "Handled in main: " << e.what() << '\n';
    }
}
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

## Средний уровень

101. Что такое exception safety?

**Ответ:** Exception safety (безопасность исключений) — это характеристика кода, определяющая его корректное поведение при возникновении исключений: отсутствие утечек ресурсов, сохранение валидности структур данных и предсказуемость инвариантов системы.

**Пример:**

```cpp
#include <memory>

void safeFunction() {
    auto ptr = std::make_unique<int>(10);
    // При возникновении исключения память гарантированно освободится
}
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

102. Какие уровни exception safety обычно выделяют?

**Ответ:** Выделяют 4 уровня: No-throw (гарантия отсутствия исключений), Strong (строгая транзакционная гарантия), Basic (базовая гарантия: инварианты сохранены, утечек нет) и No guarantee (отсутствие гарантий: утечки ресурсов, повреждение памяти).

**Пример:**

```cpp
// 1. No-throw: гарантированно не бросает
void swap(int& a, int& b) noexcept;

// 2. Strong: commit-or-rollback
void push_back(const T& x);

// 3. Basic: валидное, но произвольное состояние
// 4. No guarantee: UB / утечки
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

103. Что такое no-throw guarantee?

**Ответ:** No-throw (или no-fail) guarantee — это наивысший уровень гарантии, при котором операция обещает вызывающей стороне, что она всегда успешно завершится и никогда не выпустит наружу исключение.

**Пример:**

```cpp
void clearFlags() noexcept {
    // Операция никогда не выбросит исключение
}
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

104. Что такое strong exception guarantee?

**Ответ:** Strong exception guarantee (строгая гарантия) — поведение функции по принципу «commit-or-rollback»: операция либо завершается с полным успехом, либо при сбое оставляет состояние программы в точности таким, каким оно было до начала вызова.

**Пример:**

```cpp
#include <vector>

std::vector<int> v = {1, 2, 3};
try {
    v.push_back(4); // Если аллокация упадет, v останется {1, 2, 3}
} catch (...) {}
```

**Источник:** [Cppreference: std::vector::push_back](https://en.cppreference.com/w/cpp/container/vector/push_back)

105. Что такое basic exception guarantee?

**Ответ:** Basic guarantee — базовый уровень безопасности, гарантирующий отсутствие утечек ресурсов и сохранение валидного состояния объектов и их инвариантов, хотя конкретные значения полей могут быть изменены по сравнению с начальным состоянием.

**Пример:**

```cpp
// Контейнер остался валидным, память не утекла, но порядок элементов изменился
void sortElements(std::vector<int>& v);
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

106. Что означает отсутствие гарантии exception safety?

**Ответ:** Это состояние, при котором выброс исключения приводит к утечкам ресурсов, зависшим блокировкам мьютексов, неопределенному поведению (UB) или разрушению структур памяти.

**Пример:**

```cpp
void leakMemory() {
    int* p = new int(10);
    stepThatThrows(); // Утечка памяти p, деструктор не вызовется
    delete p;
}
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

107. Чем strong guarantee отличается от basic guarantee?

**Ответ:** Strong guarantee гарантирует полный откат к исходному состоянию до вызова (эффект транзакции), тогда как basic guarantee гарантирует лишь валидность объекта и отсутствие утечек, допуская изменение его внутреннего состояния.

**Пример:**

```cpp
// Strong: объект остался исходным
// Basic: объект целый (деструкторы работают), но состояние частично модифицировано
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

108. Что означает “операция либо успешно завершилась, либо не изменила состояние объекта”?

**Ответ:** Это определение строгой гарантии безопасности (транзакционности), где сбой любой промежуточной подзадачи нивелируется механизмом отката к исходным значениям полей.

**Пример:**

```cpp
#include <vector>

void addItems(std::vector<int>& v) {
    auto temp = v;
    temp.push_back(10); // если выбросит исключение, v не изменится
    v = std::move(temp); // noexcept коммит
}
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

109. Почему strong guarantee особенно важна для операций изменения состояния?

**Ответ:** Она позволяет клиентскому коду безопасно повторять операцию (retry), откатывать транзакции на верхнем уровне логики и избегать неконсистентности данных в распределенных или критически важных системах.

**Пример:**

```cpp
try {
    account.transfer(target, amount);
} catch (...) {
    // Точно уверены, что баланс не уменьшился
}
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

110. Что означает “объект остаётся валидным, но его состояние могло измениться”?

**Ответ:** Это суть базовой гарантии: объект не содержит висячих указателей, деструктор безопасно уничтожит его поля, но данные могут частично обновиться или очиститься.

**Пример:**

```cpp
#include <string>

std::string s = "hello";
// При ошибке внутри s может стать пустой строкой, но остается валидной std::string
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

111. Как RAII помогает обеспечивать exception safety?

**Ответ:** RAII связывает время владения ресурсом со временем жизни автоматического объекта, благодаря чему при раскрутке стека деструктор освобождает ресурс безотносительно пути выхода из блока.

**Пример:**

```cpp
#include <mutex>

std::mutex m;
void f() {
    std::lock_guard<std::mutex> lock(m); // Освободит мьютекс при любом throw
    throw std::runtime_error("fail");
}
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

112. Почему ресурсы нужно заворачивать в объекты, а не держать в сырых указателях?

**Ответ:** Сырой указатель не имеет деструктора, который автоматически вызывается при раскрутке стека; обертка (например `std::unique_ptr`) вызывает освобождение в собственном деструкторе.

**Пример:**

```cpp
#include <memory>

auto ptr = std::make_unique<int>(5); // Память никогда не утечет при исключении
```

**Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

113. Почему raw `new` и `delete` особенно опасны в коде, который может бросать исключения?

**Ответ:** Если между `new` и `delete` возникнет исключение, выполнение функции прервется до вызова `delete`, что вызовет утечку ресурса в куче.

**Пример:**

```cpp
int* p = new int(10);
step2(); // Если тут throw, delete p никогда не выполнится
delete p;
```

**Источник:** [Cppreference: operator delete](https://en.cppreference.com/w/cpp/memory/new/operator_delete)

114. Как утечка памяти может возникнуть из-за исключения?

**Ответ:** Она возникает, когда динамически выделенный ресурс удерживается через локальную переменную без деструктора (сырой указатель), а промежуточный вызов функции инициирует раскрутку стека.

**Пример:**

```cpp
void leak() {
    FILE* f = fopen("test.txt", "r");
    doParsing(); // throw -> fclose(f) пропускается навсегда
    fclose(f);
}
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

115. Почему `std::unique_ptr` помогает делать код exception-safe?

**Ответ:** Деструктор `std::unique_ptr` гарантированно вызывается механизмом раскрутки стека при возникновении исключения и вызывает `delete` для управляемого объекта.

**Пример:**

```cpp
#include <memory>

void safe() {
    std::unique_ptr<int> p(new int(10));
    throw std::runtime_error("Error"); // p будет уничтожен, память освобождена
}
```

**Источник:** [Cppreference: std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

116. Почему контейнеры STL обычно безопаснее ручного управления памятью?

**Ответ:** Контейнеры STL инкапсулируют управление памятью в деструкторах по идиоме RAII и реализуют стандартизированные гарантии безопасности исключений для своих методов.

**Пример:**

```cpp
#include <vector>

void process() {
    std::vector<int> buf(1000); // Очистит память сама при любой ошибке
    throw 1;
}
```

**Источник:** [Cppreference: Containers library](https://en.cppreference.com/w/cpp/container)

117. Что такое идиома copy-and-swap в контексте exception safety?

**Ответ:** Это паттерн проектирования операции присваивания, где сначала создается локальная копия через копирующий конструктор (потенциально бросающий исключение), а затем выполняется обмен ресурсами с текущим объектом через бессбойный `swap` (`noexcept`).

**Пример:**

```cpp
#include <utility>

struct Buffer {
    int* data;
    size_t size;
    Buffer& operator=(Buffer other) noexcept { // Копия создается аргументом
        std::swap(data, other.data);          // No-throw обмен
        std::swap(size, other.size);
        return *this;
    }
};
```

**Источник:** [Cppreference: Copy assignment operator](https://en.cppreference.com/w/cpp/language/copy_assignment)

118. Почему copy-and-swap помогает добиться strong guarantee?

**Ответ:** Вся рискованная работа по выделению ресурсов выполняется во время создания временной копии; если она падает, текущий объект остается нетронутым, а если завершается успехом — операция обмена не может выбросить исключений.

**Пример:**

```cpp
MyClass& operator=(const MyClass& other) {
    MyClass temp(other); // Бросит здесь -> *this не затронут
    swap(*this, temp);   // noexcept операция
    return *this;
}
```

**Источник:** [Cppreference: Copy assignment operator](https://en.cppreference.com/w/cpp/language/copy_assignment)

119. Когда copy-and-swap может быть неидеален по производительности?

**Ответ:** Когда объект уже владеет выделенным буфером достаточного размера, и создание временной копии влечет лишнюю дорогую аллокацию и копирование в куче вместо переиспользования существующей памяти.

**Пример:**

```cpp
std::vector<int> a(1'000'000);
std::vector<int> b(1'000'000);
a = b; // Поэлементное копирование без реаллокации быстрее, чем copy-and-swap
```

**Источник:** [Cppreference: std::vector::operator=](https://en.cppreference.com/w/cpp/container/vector/operator%3D)

120. Почему временные объекты часто помогают писать exception-safe код?

**Ответ:** Они локализуют опасные вычисления в изолированной области памяти: при возникновении сбоя временный объект просто самоуничтожается, не успев повредить глобальное или долговременное состояние.

**Пример:**

```cpp
#include <string>

std::string oldState = "initial";
std::string newState = oldState + "_modified"; // Временный объект
oldState = std::move(newState);                 // Применение результата
```

**Источник:** [Cppreference: Lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

121. Как локальные объекты помогают автоматическому освобождению ресурсов?

**Ответ:** Благодаря автоматическому времени жизни (_automatic storage duration_) локальные объекты гарантированно разрушаются деструктором при выходе управления за границы фигурных скобок `{}` блока, в том числе по исключению.

**Пример:**

```cpp
void func() {
    std::string text = "Allocated buffer";
    throw std::runtime_error("Exit"); // text.~string() вызовется автоматически
}
```

**Источник:** [Cppreference: Storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

122. Почему конструирование сложного объекта лучше разбивать на безопасные шаги?

**Ответ:** Разделение на независимые шаги с использованием RAII для каждого поля предотвращает утечки, если сбой происходит в середине сложного конструктора.

**Пример:**

```cpp
#include <memory>

struct ComplexObj {
    std::unique_ptr<int> part1;
    std::unique_ptr<int> part2;
    ComplexObj() : part1(std::make_unique<int>(1)), part2(std::make_unique<int>(2)) {}
};
```

**Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

123. Что такое invariant класса?

**Ответ:** Инвариант класса — это совокупность логических условий и ограничений на состояние полей объекта, которые всегда должны выполняться до и после вызова любого открытого метода класса.

**Пример:**

```cpp
class SafeRange {
    int minVal;
    int maxVal; // Инвариант: minVal <= maxVal
public:
    SafeRange(int min, int max) : minVal(min), maxVal(max) {
        if (minVal > maxVal) throw std::logic_error("Invalid invariant");
    }
};
```

**Источник:** [Cppreference: Classes](https://en.cppreference.com/w/cpp/language/classes)

124. Почему методы класса должны сохранять инвариант даже при исключении?

**Ответ:** Если инвариант нарушен (например указатель смотрит на освобожденную память), последующий вызов любого другого метода или деструктора приведет к неопределенному поведению (UB).

**Пример:**

```cpp
// При сбое объект должен остаться валидным, чтобы деструктор отработал штатно
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

125. Что такое partially modified object?

**Ответ:** Это объект, часть полей которого была изменена операцией до момента возникновения исключения, в результате чего объект оказался в рассогласованном промежуточном состоянии.

**Пример:**

```cpp
struct DataPair {
    int length = 0;
    int* ptr = nullptr;
    void update(int newLen) {
        length = newLen;       // Поле изменено
        ptr = new int[newLen]; // Если тут throw bad_alloc, length остался неверным!
    }
};
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

126. Почему частично изменённое состояние опасно после исключения?

**Ответ:** Оно делает инвариант объекта некорректным, что приводит к крашам при последующем обращении, двойному освобождению памяти (`double free`) или неконсистентным вычислениям.

**Пример:**

```cpp
// Если размер контейнера обновился, а массив не выделился -> segfault при итерации
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

127. Что такое commit/rollback-подход?

**Ответ:** Архитектурный подход, при котором опасные вычисления производятся в локальной копии/буфере, и только после успешного завершения всех рискованных шагов состояние атомарно фиксируется (commit).

**Пример:**

```cpp
void updateData(std::vector<int>& v) {
    auto temp = v;
    temp.push_back(100); // Фаза подготовки
    v = std::move(temp); // Commit (noexcept)
}
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

128. Как commit/rollback связан со strong guarantee?

**Ответ:** Подход commit/rollback является основным идиоматическим способом реализации строгой гарантии безопасности (strong guarantee) в C++.

**Пример:**

```cpp
// Если в процессе подготовки выброшено исключение -> rollback (исходный объект не тронут)
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

129. Что такое scope guard?

**Ответ:** Scope guard — это объект, откладывающий выполнение заданного действия (например функции отката) до момента выхода из текущей области видимости через свой деструктор.

**Пример:**

```cpp
template<typename F>
struct ScopeGuard {
    F func;
    ~ScopeGuard() { func(); }
};
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

130. Как scope guard помогает откатывать действия при исключении?

**Ответ:** Scope guard взводится на случай сбоя и выполняет откат изменений при раскрутке стека, если операция не была подтверждена (dismiss) до успешного завершения блока.

**Пример:**

```cpp
bool success = false;
auto rollback = ScopeGuard([&]() { if (!success) revertChanges(); });
doWork();
success = true; // Успех: откат не требуется
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

131. Почему транзакционный стиль полезен для exception-safe кода?

**Ответ:** Он исключает промежуточные разрушительные состояния: вызывающий код уверен, что операция либо выполнена целиком, либо не выполнена вовсе.

**Пример:**

```cpp
// Все изменения применяются в конце через noexcept операции
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

132. Как `std::vector` зависит от `noexcept` move-конструктора элементов?

**Ответ:** При реаллокации буфера `std::vector` перемещает элементы только в том случае, если их конструктор перемещения помечен `noexcept`; иначе он откатывается к копированию для сохранения strong guarantee.

**Пример:**

```cpp
#include <vector>

struct A {
    A(A&&) noexcept {} // vector будет перемещать элементы при resize
};
```

**Источник:** [Cppreference: std::move_if_noexcept](https://en.cppreference.com/w/cpp/utility/move_if_noexcept)

133. Почему контейнер может копировать вместо перемещения, если move не `noexcept`?

**Ответ:** Если перемещение третьего элемента в новый буфер выбросит исключение, вернуть первые два перемещенных элемента обратно в старый буфер без потерь невозможно, что разрушило бы strong guarantee.

**Пример:**

```cpp
struct Risky {
    Risky(Risky&&) {} // Нет noexcept -> std::vector будет копировать!
};
```

**Источник:** [Cppreference: std::vector::reserve](https://en.cppreference.com/w/cpp/container/vector/reserve)

134. Как `noexcept` влияет на оптимизацию и надёжность библиотечного кода?

**Ответ:** `noexcept` снимает с компилятора необходимость генерировать таблицы и код раскрутки стека для вызова, уменьшает бинарный размер и дает зеленый свет move-оптимизациям в стандартных контейнерах.

**Пример:**

```cpp
void fastSwap(int& a, int& b) noexcept {
    int tmp = a; a = b; b = tmp;
}
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

135. Что такое повторный выброс через `throw;`?

**Ответ:** Это возобновление полета текущего активного объекта-исключения из блока `catch` без создания нового объекта.

**Пример:**

```cpp
try {
    throw std::runtime_error("Fail");
} catch (...) {
    logError();
    throw; // Повторный выброс
}
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw#The_rethrow_expression)

136. Почему `throw;` сохраняет исходный динамический тип исключения?

**Ответ:** `throw;` не выполняет инициализации копированием, а оперирует уже аллоцированным объектом исключения в специальной памяти среды выполнения, сохраняя указатель на таблицу виртуальных методов (`vtable`).

**Пример:**

```cpp
// Сохраняет производный CustomException, даже будучи пойманным как std::exception&
```

**Источник:** [Cppreference: throw expression](https://en.cppreference.com/w/cpp/language/throw#The_rethrow_expression)

137. Почему `throw e;` может изменить тип или сделать копию?

**Ответ:** Выражение `throw e;` инициализирует новый объект исключения вызовом конструктора копирования статического типа переменной `e`, что срезает производный тип до типа переменной `e`.

**Пример:**

```cpp
catch (const std::exception& e) {
    throw e; // Срезка: создастся чистый std::exception
}
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw)

138. Что такое nested try/catch?

**Ответ:** Это размещение одного блока `try/catch` внутри тела другого блока `try` или внутри блока `catch`.

**Пример:**

```cpp
try {
    try {
        riskyOp1();
    } catch (const std::invalid_argument&) {
        fallbackOp();
    }
    riskyOp2();
} catch (...) {}
```

**Источник:** [Cppreference: try-block](https://en.cppreference.com/w/cpp/language/try_catch)

139. Когда полезны вложенные обработчики исключений?

**Ответ:** Они полезны для попытки альтернативного решения локального сбоя (fallback) без прерывания основной процедуры или для безопасного логирования внутри внешнего блока `catch`.

**Пример:**

```cpp
try {
    // Вторичная попытка восстановления внутри catch
} catch (...) {}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

140. Можно ли в `catch` выбросить другое исключение?

**Ответ:** Да, внутри блока `catch` разрешено выбрасывать новые объекты исключений для трансляции ошибки на более высокий логический уровень.

**Пример:**

```cpp
#include <system_error>
#include <stdexcept>

try {
    readDisk();
} catch (const std::system_error& err) {
    throw std::runtime_error("Application failed to read config");
}
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw)

141. Когда имеет смысл преобразовывать одно исключение в другое?

**Ответ:** При пересечении архитектурных слоев (boundary abstraction): например, когда низкоуровневая ошибка парсера JSON переводится в бизнесовое `UserNotFoundException`.

**Пример:**

```cpp
catch (const SqlException& e) {
    throw ServiceUnavailableException("DB error");
}
```

**Источник:** [Cppreference: Exception handling](https://en.cppreference.com/w/cpp/language/exceptions)

142. Почему при преобразовании исключений важно сохранять контекст?

**Ответ:** Потеря низкоуровневой причины сбоя сильно затрудняет отладку и анализ корневых причин инцидентов в логах.

**Пример:**

```cpp
// Плохо: throw std::runtime_error("Failed");
// Хорошо: включить e.what() в новое исключение
```

**Источник:** [Cppreference: std::nested_exception](https://en.cppreference.com/w/cpp/error/nested_exception)

143. Что такое `std::nested_exception`?

**Ответ:** Класс стандартной библиотеки (из заголовка `<exception>`), позволяющий захватывать и вкладывать текущее активное исключение внутрь нового объекта исключения.

**Пример:**

```cpp
#include <exception>

struct MyWrapperException : public std::exception, public std::nested_exception {};
```

**Источник:** [Cppreference: std::nested_exception](https://en.cppreference.com/w/cpp/error/nested_exception)

144. Для чего нужны `std::throw_with_nested` и `std::rethrow_if_nested`?

**Ответ:** `std::throw_with_nested` выбрасывает новое исключение, автоматически упаковывая в него текущее перехваченное, а `std::rethrow_if_nested` извлекает и повторно выбрасывает вложенное исключение для размотки цепочки причин.

**Пример:**

```cpp
#include <exception>
#include <stdexcept>

try {
    throw std::runtime_error("Root cause");
} catch (...) {
    std::throw_with_nested(std::logic_error("Higher level error"));
}
```

**Источник:** [Cppreference: std::throw_with_nested](https://en.cppreference.com/w/cpp/error/throw_with_nested)

145. Почему вложенные исключения полезны в слоях абстракции?

**Ответ:** Они позволяют сформировать полный стек причин сбоя (_cause chain_), подобно механизмам в Java или C#, сохраняя детали каждого слоя от драйвера до пользовательского интерфейса.

**Пример:**

```cpp
// GUI -> Logic -> DB connection -> OS Socket timeout
```

**Источник:** [Cppreference: std::nested_exception](https://en.cppreference.com/w/cpp/error/nested_exception)

146. Что такое обработка ошибок на границе модуля или подсистемы?

**Ответ:** Это локализация и изоляция внутренних типов исключений подсистемы, их трансляция в общесистемные типы или коды ошибок для предотвращения утечки деталей реализации.

**Пример:**

```cpp
// Экспортная C API функция
extern "C" int api_call() noexcept {
    try {
        internalCppMethod();
        return 0;
    } catch (...) {
        return -1; // Не выпускаем исключения за границу C ABI
    }
}
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

147. Почему не всегда стоит ловить исключение слишком рано?

**Ответ:** На низких уровнях программы часто нет достаточного контекста, чтобы принять правильное решение о ликвидации ошибки или уведомлении пользователя.

**Пример:**

```cpp
// Функция чтения байт не знает, перезапустить ли сервер или показать диалоговое окно
```

**Источник:** [Cppreference: Exception handling](https://en.cppreference.com/w/cpp/language/exceptions)

148. Почему иногда лучше дать исключению подняться выше?

**Ответ:** Исключение поднимется до того уровня архитектуры, где существует стратегия восстановления (например, повтор HTTP-запроса или транзакции), попутно корректно очистив стек через RAII.

**Пример:**

```cpp
// Ловим на уровне контроллера приложения, а не внутри низкоуровневого парсера
```

**Источник:** [Cppreference: Stack unwinding](https://en.cppreference.com/w/cpp/language/throw#Stack_unwinding)

149. Что такое “ловить только там, где можешь осмысленно обработать”?

**Ответ:** Архитектурное правило, запрещающее перехватывать ошибки ради самого факта перехвата: ловить исключение следует лишь тогда, когда код готов исправить сбой, предпринять альтернативные действия или залогировать и безопасно перезапустить операцию.

**Пример:**

```cpp
// Плохо: поймать и ничего не сделать
// Хорошо: перехватить для повторного коннекта к БД
```

**Источник:** [Cppreference: Exception handling](https://en.cppreference.com/w/cpp/language/exceptions)

150. Почему пустой `catch` без действий часто плохая практика?

**Ответ:** Пустой блок `catch` маскирует наличие критических сбоев («глотает ошибку»), оставляя программу в поврежденном состоянии и делая отладку крайне сложной.

**Пример:**

```cpp
// АНТИПАТТЕРН:
try {
    saveImportantData();
} catch (...) {} // Ошибка скрыта, данные потеряны навсегда
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

## Выше среднего уровня

151. Что такое `std::exception_ptr`?

**Ответ:** `std::exception_ptr` — это специальный разделяемый тип умного указателя (nullable shared ownership pointer), способный хранить ссылку на любой объект исключения и управлять его временем жизни.

**Пример:**

```cpp
#include <exception>

std::exception_ptr eptr = nullptr;
```

**Источник:** [Cppreference: std::exception_ptr](https://en.cppreference.com/w/cpp/error/exception_ptr)

152. Для чего нужен `std::current_exception()`?

**Ответ:** Функция `std::current_exception()` возвращает экземпляр `std::exception_ptr`, указывающий на обрабатываемое в данный момент исключение внутри блока `catch` (или создающий его копию в куче).

**Пример:**

```cpp
#include <exception>

std::exception_ptr globalErr;
try {
    throw 1;
} catch (...) {
    globalErr = std::current_exception(); // Захватили исключение
}
```

**Источник:** [Cppreference: std::current_exception](https://en.cppreference.com/w/cpp/error/current_exception)

153. Что делает `std::rethrow_exception()`?

**Ответ:** Функция `std::rethrow_exception(std::exception_ptr p)` принимает объект указателя на исключение и заново выбрасывает сохраненное в нем исходное исключение.

**Пример:**

```cpp
#include <exception>

void processError(std::exception_ptr p) {
    if (p) {
        std::rethrow_exception(p); // Выбрасывает исключение снова
    }
}
```

**Источник:** [Cppreference: std::rethrow_exception](https://en.cppreference.com/w/cpp/error/rethrow_exception)

154. Зачем передавать исключения между потоками?

**Ответ:** Поток выполнения (_thread_) не может выбросить исключение непосредственно в родительский поток: исключение в дочернем потоке привело бы к `std::terminate()`. Передача через `std::exception_ptr` позволяет уведомить главный поток о проблемах в асинхронной задаче.

**Пример:**

```cpp
#include <future>

std::future<int> f = std::async([]() -> int {
    throw std::runtime_error("Thread error");
});
// f.get() заново выбросит ошибку в основном потоке!
```

**Источник:** [Cppreference: std::promise::set_exception](https://en.cppreference.com/w/cpp/thread/promise/set_exception)

155. Почему исключение нельзя просто “перенести” из одного потока в другой обычным образом?

**Ответ:** Каждый поток имеет свой собственный независимый стек вызовов; механизм раскрутки стека привязан к конкретному потоку и не может перейти границу потоков в ОС.

**Пример:**

```cpp
// Стек потока A не виден при раскрутке стека потока B
```

**Источник:** [Cppreference: Thread](https://en.cppreference.com/w/cpp/thread)

156. Как `exception_ptr` помогает хранить и позже перевыбрасывать исключение?

**Ответ:** Он сохраняет полиморфный объект исключения в управляемой памяти и позволяет вызвать `std::rethrow_exception(ptr)` в произвольном месте, в любое время и в любом потоке программы.

**Пример:**

```cpp
#include <exception>
#include <thread>

std::exception_ptr p;
std::thread t([&]() {
    try { throw std::runtime_error("Async err"); }
    catch (...) { p = std::current_exception(); }
});
t.join();
if (p) std::rethrow_exception(p); // Выброс в главном потоке
```

**Источник:** [Cppreference: std::exception_ptr](https://en.cppreference.com/w/cpp/error/exception_ptr)

157. Что такое `std::uncaught_exceptions()`?

**Ответ:** Функция из `<exception>` (C++17), возвращающая точное количество активных исключений, находящихся в процессе раскрутки стека в текущем потоке.

**Пример:**

```cpp
#include <exception>
#include <iostream>

void check() {
    std::cout << "Active: " << std::uncaught_exceptions() << '\n';
}
```

**Источник:** [Cppreference: std::uncaught_exceptions](https://en.cppreference.com/w/cpp/error/uncaught_exception)

158. Для чего может быть полезно количество активных непойманных исключений?

**Ответ:** Это позволяет деструкторам понимать, вызываются ли они штатно или во время аварийной раскрутки стека (если текущее значение больше значения, зафиксированного при создании объекта).

**Пример:**

```cpp
// Используется для обнаружения падения функции
```

**Источник:** [Cppreference: std::uncaught_exceptions](https://en.cppreference.com/w/cpp/error/uncaught_exception)

159. Как `std::uncaught_exceptions()` связан со scope guard и транзакциями?

**Ответ:** Он позволяет реализовать guard'ы вида `ScopeSuccess` и `ScopeFail`: если при уничтожении гварда счетчик исключений вырос — значит блок вышел по ошибке, и надо откатить транзакцию.

**Пример:**

```cpp
struct ScopeFail {
    int count = std::uncaught_exceptions();
    ~ScopeFail() {
        if (std::uncaught_exceptions() > count) {
            // Откат транзакции!
        }
    }
};
```

**Источник:** [Cppreference: std::uncaught_exceptions](https://en.cppreference.com/w/cpp/error/uncaught_exception)

160. Что такое function-try-block?

**Ответ:** Это синтаксическая форма блока `try/catch`, обрамляющая функцию целиком, включая её список инициализации членов конструктора (`ctor-initializer`).

**Пример:**

```cpp
struct Foo {
    Foo() try : member() {
        // Конструктор
    } catch (...) {
        // Обработка
    }
};
```

**Источник:** [Cppreference: Function-try-block](https://en.cppreference.com/w/cpp/language/function-try-block)

161. Где можно использовать function-try-block?

**Ответ:** В любых функциях: обычных свободных функциях, методах классов, но в первую очередь — в конструкторах и деструкторах.

**Пример:**

```cpp
void run() try {
    doSmth();
} catch (...) {}
```

**Источник:** [Cppreference: Function-try-block](https://en.cppreference.com/w/cpp/language/function-try-block)

162. Когда function-try-block уместен в конструкторе?

**Ответ:** Он уместен, когда необходимо перехватить исключение, возникшее в списке инициализации базовых классов или полей, чтобы залогировать сбой или транслировать его в другое исключение.

**Пример:**

```cpp
struct Derived : Base {
    Derived() try : Base() {}
    catch (const std::exception& e) {
        log("Base init failed");
    }
};
```

**Источник:** [Cppreference: Function-try-block](https://en.cppreference.com/w/cpp/language/function-try-block)

163. Чем function-try-block отличается от обычного `try` внутри тела функции?

**Ответ:** Обычный `try` внутри тела не может перехватить исключения из списка инициализации полей. Кроме того, в конце `catch` у function-try-block конструктора компилятор **автоматически делает повторный выброс (`throw;`)**.

**Пример:**

```cpp
// Конструктор не может "подавить" исключение в function-try-block; оно всегда вылетит наружу!
```

**Источник:** [Cppreference: Function-try-block](https://en.cppreference.com/w/cpp/language/function-try-block)

164. Можно ли в function-try-block конструктора поймать исключения от инициализации базовых классов и полей?

**Ответ:** Да, это единственная конструкция в языке, позволяющая перехватывать исключения, выбрасываемые конструкторами базовых классов или списком инициализации членов.

**Пример:**

```cpp
struct A { A() { throw 1; } };
struct B {
    A a;
    B() try : a() {}
    catch (...) { /* исключение из 'a' перехвачено здесь */ }
};
```

**Источник:** [Cppreference: Function-try-block](https://en.cppreference.com/w/cpp/language/function-try-block)

165. Что такое legacy dynamic exception specification?

**Ответ:** Устаревший синтаксис спецификации исключений `throw(Type1, Type2)`, который объявлял, какие именно типы функция имеет право выбрасывать во время выполнения.

**Пример:**

```cpp
// Устаревший синтаксис (удален в C++17/20):
void oldFunc() throw(int, std::bad_alloc);
```

**Источник:** [Cppreference: Dynamic exception specification](https://en.cppreference.com/w/cpp/language/except_spec)

166. Почему старые спецификации вида `throw(Type)` считаются устаревшими и удалены из современного C++?

**Ответ:** Они проверялись во время выполнения (runtime overhead), провоцировали неожиданный вызов `std::unexpected()`, не влияли на оптимизацию и плохо работали с шаблонами.

**Пример:**

```cpp
// Если oldFunc() бросала std::string -> вызывался std::unexpected() и падение программы
```

**Источник:** [Cppreference: Dynamic exception specification](https://en.cppreference.com/w/cpp/language/except_spec)

167. Чем `noexcept` лучше старых dynamic exception specifications?

**Ответ:** `noexcept` бинарен (бросает или не бросает), проверяется во время компиляции, позволяет агрессивную генерацию оптимизированного кода и исключает накладные расходы рантайма.

**Пример:**

```cpp
void modern() noexcept; // Быстро, безопасно, понятно
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

168. Что такое условный `noexcept`?

**Ответ:** Это форма спецификатора `noexcept(булево-константное-выражение)`, которая объявляет функцию бессбойной только в том случае, если предикат внутри скобок вычисляется в `true` на этапе компиляции.

**Пример:**

```cpp
template<typename T>
void doSwap(T& a, T& b) noexcept(noexcept(a.swap(b))) {
    a.swap(b);
}
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

169. Как работает `noexcept(expr)`?

**Ответ:** Как оператор времени компиляции, он возвращает `true`, если выражение `expr` не содержит потенциально бросающих исключения операций (согласно сигнатурам вызываемых функций).

**Пример:**

```cpp
constexpr bool b = noexcept(1 + 2); // true
```

**Источник:** [Cppreference: noexcept operator](https://en.cppreference.com/w/cpp/language/noexcept)

170. Когда условный `noexcept` особенно полезен в шаблонном коде?

**Ответ:** При реализации обобщенных контейнеров, оберток (`std::pair`, `std::tuple`, `std::optional`), чтобы propagate'ить статус бессбойности операций лежащих внутри пользовательских типов `T`.

**Пример:**

```cpp
template <class T1, class T2>
struct Pair {
    Pair(Pair&& p) noexcept(std::is_nothrow_move_constructible_v<T1> &&
                            std::is_nothrow_move_constructible_v<T2>) {}
};
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

171. Почему generic-код часто вычисляет `noexcept` из операций над параметрами?

**Ответ:** Чтобы предоставить максимально сильные гарантии: если тип пользователя `T` бессбоен, библиотека дает бессбойность и оптимизации; если бросает — библиотека сохраняет корректность.

**Пример:**

```cpp
// Контейнеры могут выбирать быстрый move-алгоритм
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

172. Что такое исключения в шаблонном коде?

**Ответ:** Это ситуации, когда тип-параметр шаблона `T` при копировании, присваивании или сравнении внутри шаблона генерирует исключение, о котором разработчик обобщенного алгоритма должен помнить заранее.

**Пример:**

```cpp
template<typename T>
void process(T obj) {
    T copy = obj; // T::T(const T&) может бросить исключение!
}
```

**Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates)

173. Как template-код влияет на требования к exception safety?

**Ответ:** Требования многократно возрастают: автор шаблона не знает реализацию типа `T`, поэтому обязан защищать любые операции над элементами, гарантируя базовую или строгую безопасность.

**Пример:**

```cpp
// std::vector обязан корректно раскрутить память, если T::T() выбросил bad_alloc
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

174. Почему generic-алгоритмы должны учитывать поведение операций типа `T` при исключениях?

**Ответ:** Потому что алгоритмы STL (например `std::sort`, `std::copy`) манипулируют пользовательскими типами, и сбой в компараторе `<` или копировании не должен приводить к утечке промежуточных массивов.

**Пример:**

```cpp
// Если предикат бросает исключение, сортируемый диапазон должен остаться валидным
```

**Источник:** [Cppreference: Algorithm library](https://en.cppreference.com/w/cpp/algorithm)

175. Что такое `move_if_noexcept`?

**Ответ:** Это вспомогательная шаблонная функция из `<utility>`, которая приводит аргумент к rvalue-ссылке (перемещение), если перемещение гарантированно `noexcept`, либо к const lvalue-ссылке (копирование) в противном случае.

**Пример:**

```cpp
#include <utility>

struct Type {};
Type a;
auto x = std::move_if_noexcept(a); // вернет const Type&, если move может бросить
```

**Источник:** [Cppreference: std::move_if_noexcept](https://en.cppreference.com/w/cpp/utility/move_if_noexcept)

176. Для чего нужен `std::move_if_noexcept`?

**Ответ:** Он нужен для сохранения strong exception guarantee при реаллокации внутренних буферов динамических структур данных.

**Пример:**

```cpp
// Используется внутри std::vector::reserve()
```

**Источник:** [Cppreference: std::move_if_noexcept](https://en.cppreference.com/w/cpp/utility/move_if_noexcept)

177. Почему `move_if_noexcept` важен для контейнеров и generic-библиотек?

**Ответ:** Он автоматически балансирует между максимальной производительностью (быстрый move) и строгой гарантией сохранности данных (fallback к надежному копированию).

**Пример:**

```cpp
// Безопасность важнее скорости: контейнер предпочтет копирование рискованному переносу
```

**Источник:** [Cppreference: std::move_if_noexcept](https://en.cppreference.com/w/cpp/utility/move_if_noexcept)

178. Что такое zero-cost exceptions как модель реализации?

**Ответ:** Это модель компиляции исключений (модель Itanium ABI / DWARF), при которой в обычном счастливом пути исполнения (happy path) отсутствуют накладные расходы по тактам процессора, а поиск обработчиков происходит по статическим таблицам (`unwind tables`).

**Пример:**

```cpp
// Никаких проверок if (err) в ассемблерном коде счастливого пути
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

179. Почему говорят, что исключения “ничего не стоят, пока не произошли”?

**Ответ:** В модели zero-cost код внутри блока `try` выполняется с той же скоростью, как если бы блока `try` не было вовсе: процессору не требуется выполнять дополнительные инструкции проверки флагов или кодов ошибок.

**Пример:**

```cpp
// Happy path полностью бесплатен по времени CPU
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

180. Какие компромиссы у модели zero-cost exceptions есть на практике?

**Ответ:** Увеличение размера исполняемого бинарного файла из-за таблиц раскрутки (`.eh_frame`), а также катастрофически дорогой и медленный путь при фактическом возникновении исключения (тысячи тактов на парсинг метаданных).

**Пример:**

```cpp
// Выброс исключения в миллионы раз медленнее, чем обычный if (code != 0)
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

181. Почему в некоторых проектах исключения отключают?

**Ответ:** В геймдеве, встраиваемых системах (embedded), высокочастотном трейдинге (HFT) и ядрах ОС исключения отключают ради экономии памяти ROM/RAM и для исключения непредсказуемых задержек (latencies).

**Пример:**

```bash
# Флаг сборки компилятора:
g++ -fno-exceptions main.cpp
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

182. Какие аргументы обычно приводят против использования исключений?

**Ответ:** Неявные пути выхода из функций (сложно отследить control flow), непредсказуемое время исполнения при сбое, увеличение размера бинарника, невозможность использования в некоторых системах реального времени.

**Пример:**

```cpp
// Любая строчка кода может неявно прервать выполнение
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

183. Какие аргументы обычно приводят в пользу исключений?

**Ответ:** Чистый код happy path без бесконечных проверок `if`, невозможность случайно проигнорировать сбой, автоматическая очистка стека (RAII) и возможность передавать ошибки из конструкторов.

**Пример:**

```cpp
auto obj = Object(); // Либо валидный объект, либо выброс
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

184. Почему стиль обработки ошибок должен быть единообразным в проекте?

**Ответ:** Смешивание стилей порождает хаос: разработчики забывают проверять коды возврата или оборачивать вызовы в try/catch, что влечет баги и утечки ресурсов на стыках подсистем.

**Пример:**

```cpp
// Единое соглашение: на всех уровнях либо std::expected, либо исключения
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

185. Чем опасно смешивание нескольких несовместимых стратегий обработки ошибок?

**Ответ:** Ошибки теряются: код, ожидающий исключение, пропустит ошибочный статус возврата, а код на кодах возврата упадет через `std::terminate` из-за вылетевшего чужого исключения.

**Пример:**

```cpp
// Необработанное исключение пробивает слой C-функций и крашит программу
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

186. Когда API лучше проектировать через исключения, а когда через `optional`/`expected`/коды ошибок?

**Ответ:** Исключения лучше для действительно редких, непредвиденных и катастрофических сбоев (сбой БД, дефицит памяти), а `std::optional` / `std::expected` — для частых и штатно ожидаемых бизнес-сценариев (неверный пароль, отсутствие ключа в словаре).

**Пример:**

```cpp
#include <expected>

// Ожидаемый сбой парсинга -> std::expected
std::expected<int, std::string> parseInt(std::string_view s);
```

**Источник:** [Cppreference: std::expected](https://en.cppreference.com/w/cpp/utility/expected)

187. Почему исключения неудобны для обычного ожидаемого ветвления логики?

**Ответ:** Из-за огромного штрафа по производительности (cold path) и запутывания статического анализатора и читателя кода.

**Пример:**

```cpp
// Плохо: ловить NotFoundException вместо проверки if (map.contains(key))
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

188. Что такое boundary between exception-based and error-code-based APIs?

**Ответ:** Это граница интерфейса (например C ABI библиотека или системный callback), разделяющая две зоны: зону, где ошибки транслируются исключениями, и зону, где ошибки передаются кодами возврата.

**Пример:**

```cpp
// Граница C++ кода и C-библиотеки
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

189. Почему на границе подсистем иногда делают перевод исключений в коды ошибок?

**Ответ:** Потому что внешняя подсистема (например на языке C, Go или Python) не знает внутреннюю модель исключений C++ компилятора, и пролет исключения за границу приведет к немедленному аварийному краху процесса.

**Пример:**

```cpp
extern "C" int c_api_wrapper() {
    try {
        cpp_code();
        return 0;
    } catch (...) {
        return -1; // Перевод исключения в int статус
    }
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

190. Когда библиотека должна документировать, какие исключения могут вылетать?

**Ответ:** Всегда в спецификации своего публичного API: пользователь библиотеки обязан знать типы возможных сбоев и предусловия вызова функций.

**Пример:**

```cpp
/**
 * @throws std::invalid_argument If size is zero.
 */
void allocate(size_t size);
```

**Источник:** [Cppreference: Documentation conventions](https://en.cppreference.com/w/cpp)

191. Что значит exception-neutral код?

**Ответ:** Это код, который сам не ловит и не подавляет чужие исключения, а прозрачно пропускает их через себя выше, при этом полностью гарантируя отсутствие утечек ресурсов на своем уровне (благодаря RAII).

**Пример:**

```cpp
void neutral(std::function<void()> task) {
    auto res = acquireResource(); // RAII-объект
    task();                       // Если task() бросит, res корректно освободится,
                                  // а исключение пойдет выше
}
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

192. Как написать функцию, которая не ловит, но и не ломает propagation чужих исключений?

**Ответ:** Использовать повсеместно идиому RAII (`std::unique_ptr`, `std::lock_guard`) для всех захваченных ресурсов и избегать сырых `try/catch`.

**Пример:**

```cpp
void safeForward() {
    auto file = std::make_unique<std::fstream>("data.bin");
    process(*file); // нейтрально к исключениям
}
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

193. Почему “не поймал — не испортил” иногда лучше, чем неудачная обработка?

**Ответ:** Попытка неграмотного «затыкания» исключения приводит к подавлению сигнала об аварии и продолжению работы приложения в поврежденном состоянии.

**Пример:**

```cpp
// Лучше упасть или дать обработать верхнему слою, чем скрыть сломанное состояние
```

**Источник:** [Cppreference: Exception handling](https://en.cppreference.com/w/cpp/language/exceptions)

194. Что такое strong guarantee у операции присваивания контейнера?

**Ответ:** Если операция присваивания нового содержимого контейнеру завершается исключением (например не хватило памяти), исходный контейнер сохраняет все свои прежние элементы без изменений.

**Пример:**

```cpp
std::vector<int> a = {1, 2, 3};
// a = b; -> в случае сбоя a гарантированно остается {1, 2, 3}
```

**Источник:** [Cppreference: std::vector::operator=](https://en.cppreference.com/w/cpp/container/vector/operator%3D)

195. Как спроектировать пользовательский тип с хорошей exception safety?

**Ответ:** Использовать RAII-поля вместо сырых указателей, писать `noexcept` перемещающие конструкторы и деструкторы, а модифицирующие операции строить по двухфазному принципу (подготовка и атомарный commit через swap).

**Пример:**

```cpp
class GoodType {
    std::string name;
    std::vector<int> data;
public:
    GoodType(GoodType&&) noexcept = default;
    ~GoodType() = default;
};
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

196. Почему операции, меняющие несколько ресурсов сразу, особенно сложны для exception safety?

**Ответ:** Если захват первого ресурса прошел успешно, а второго — упал с исключением, разработчик обязан аккуратно и гарантированно откатить или освободить первый ресурс.

**Пример:**

```cpp
// Захват lock1 и lock2 -> если второй упал, первый должен освободиться (std::lock)
```

**Источник:** [Cppreference: std::lock](https://en.cppreference.com/w/cpp/thread/lock)

197. Что такое двухфазное изменение состояния объекта?

**Ответ:** Разделение логики метода на две фазы: 1) вычисление нового состояния и захват ресурсов во временном объекте (рискованная фаза); 2) бессбойная замена старого состояния на новое (фаза коммита).

**Пример:**

```cpp
void mutate() {
    auto next = computeNewState(); // Фаза 1 (может бросить)
    this->state = std::move(next); // Фаза 2 (noexcept)
}
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

198. Почему сначала готовят новое состояние, а потом коммитят?

**Ответ:** Это гарантирует, что если в процессе подготовки произойдет любая ошибка или дефицит ресурсов, оригинальный объект останется полностью интактным (Strong Guarantee).

**Пример:**

```cpp
// Исходные данные остаются чистыми до момента полной уверенности в успехе
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

199. Как исключения влияют на проектирование конструкторов, фабрик и builder-паттернов?

**Ответ:** Конструкторы бросают исключения, если нарушен инвариант; фабричные методы (`Factory`) позволяют возвращать `std::expected` вместо исключений, а `Builder` валидирует всю структуру на этапе финального метода `build()`.

**Пример:**

```cpp
auto obj = Builder().withA().withB().build(); // build() проверяет консистентность
```

**Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

200. Почему factory-функция иногда удобнее конструктора с точки зрения обработки ошибок?

**Ответ:** Конструктор всегда создает объект или бросает исключение, в то время как фабричная функция может вернуть `std::expected` или `std::optional`, позволяя клиенту обрабатывать ошибку без механизма исключений.

**Пример:**

```cpp
#include <optional>

class Connection {
public:
    static std::optional<Connection> create(const std::string& url);
private:
    Connection();
};
```

**Источник:** [Cppreference: Factory function](https://en.cppreference.com/w/cpp/utility/optional)

## Сложный уровень

201. Что такое исключение, выброшенное из оператора `new`, и как его обычно обрабатывают?

**Ответ:** Это исключение `std::bad_alloc`, возникающее при невозможности выделить динамическую память. Обрабатывается в блоке `catch (const std::bad_alloc&)`, освобождая кэши, либо пропускаясь на глобальный уровень для завершения задачи.

**Пример:**

```cpp
#include <new>
#include <iostream>

try {
    int* p = new int[100000000000ULL];
} catch (const std::bad_alloc& e) {
    std::cerr << "Out of memory: " << e.what() << '\n';
}
```

**Источник:** [Cppreference: operator new](https://en.cppreference.com/w/cpp/memory/new/operator_new)

202. Что такое nothrow-версия `new` и чем она отличается от обычной?

**Ответ:** Это перегрузка оператора `new`, принимающая тег `std::nothrow`: в случае нехватки памяти она не выбрасывает `std::bad_alloc`, а возвращает нулевой указатель `nullptr`.

**Пример:**

```cpp
#include <new>

int* p = new (std::nothrow) int[1000];
if (!p) {
    // Память не выделилась
}
delete[] p;
```

**Источник:** [Cppreference: std::nothrow](https://en.cppreference.com/w/cpp/memory/new/nothrow)

203. Когда `new (std::nothrow)` уместен, а когда нет?

**Ответ:** Уместен в легаси коде, системах реального времени или портировании с C; неуместен в современном коде, так как если конструктор самого конструируемого типа бросит исключение, `nothrow new` всё равно выпустит это исключение наружу.

**Пример:**

```cpp
struct A { A() { throw std::runtime_error("err"); } };
// new (std::nothrow) A; // ВСЁ РАВНО БРОСИТ std::runtime_error!
```

**Источник:** [Cppreference: std::nothrow](https://en.cppreference.com/w/cpp/memory/new/nothrow)

204. Почему в современном C++ nothrow `new` используется редко?

**Ответ:** Большинство современных систем используют виртуальную память с перевыделением (overcommit в Linux), из-за чего `new` почти никогда не возвращает `nullptr`, а программа при реальном исчерпании физической памяти завершается механизмом OOM Killer операционной системы.

**Пример:**

```cpp
// Программа скорее будет убита ОС, чем получит nullptr при overcommit
```

**Источник:** [Cppreference: operator new](https://en.cppreference.com/w/cpp/memory/new/operator_new)

205. Что такое `std::bad_exception`?

**Ответ:** Это стандартный класс исключения, который выбрасывался средой выполнения, когда функция с устаревшей динамической спецификацией `throw(...)` пыталась выбросить тип, не включенный в список разрешенных.

**Пример:**

```cpp
#include <exception>

// Исторический класс, наследник std::exception
```

**Источник:** [Cppreference: std::bad_exception](https://en.cppreference.com/w/cpp/error/bad_exception)

206. В каких исторических сценариях он был связан со старыми exception specifications?

**Ответ:** Если функция объявляла `throw(std::bad_exception)` и бросала неразрешенный тип, runtime вместо вызова `std::unexpected()` подменял исключение на экземпляр `std::bad_exception`.

**Пример:**

```cpp
// Устарело и удалено в C++17
```

**Источник:** [Cppreference: std::bad_exception](https://en.cppreference.com/w/cpp/error/bad_exception)

207. Почему темы старых exception specifications сегодня в основном представляют исторический интерес?

**Ответ:** Они были полностью исключены из стандарта (начиная с C++17 удален `throw(Type)`, а в C++20 удален `throw()`), уступив место спецификатору `noexcept`.

**Пример:**

```cpp
// Сегодня используется только noexcept
```

**Источник:** [Cppreference: Dynamic exception specification](https://en.cppreference.com/w/cpp/language/except_spec)

208. Что такое `terminate_handler`?

**Ответ:** Это тип функционального указателя (`typedef void (*terminate_handler)();`), определяющий сигнатуру функции обратного вызова, исполняемой при вызове `std::terminate()`.

**Пример:**

```cpp
#include <exception>

void myTerminateHandler() {
    // Экстренные действия перед смертью процесса
    std::abort();
}
```

**Источник:** [Cppreference: std::terminate_handler](https://en.cppreference.com/w/cpp/error/terminate_handler)

209. Для чего нужен `std::set_terminate`?

**Ответ:** Для установки пользовательской функции `terminate_handler`, позволяющей выполнить аварийное логирование, создание crash-дампа (core dump) или сброс несохраненных данных перед фатальным завершением процесса.

**Пример:**

```cpp
#include <exception>
#include <iostream>

int main() {
    std::set_terminate([]() {
        std::cerr << "Fatal termination!\n";
        std::abort();
    });
}
```

**Источник:** [Cppreference: std::set_terminate](https://en.cppreference.com/w/cpp/error/set_terminate)

210. Когда кастомный terminate handler может быть полезен?

**Ответ:** Для интеграции со сторонними системами сбора отчетов об ошибках (Crashpad, Sentry, Breakpad), чтобы отправить разработчикам стек вызовов аварийного падения.

**Пример:**

```cpp
// Генерация minidump файла перед выходом
```

**Источник:** [Cppreference: std::set_terminate](https://en.cppreference.com/w/cpp/error/set_terminate)

211. Почему даже terminate handler не должен пытаться “спасти” программу любой ценой?

**Ответ:** К моменту вызова `terminate()` инварианты программы могут быть фундаментально разрушены, ресурсы повреждены, а повторные вызовы деструкторов могут повлечь повреждение постоянных файлов на диске. Хэндлер обязан завершить процесс аварийно через `std::abort()`.

**Пример:**

```cpp
// Попытка продолжить исполнение приведет к UB
```

**Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

212. Как логирование помогает при фатальных исключениях?

**Ответ:** Запись сообщения `e.what()` и стека вызовов в файл до вызова `abort()` позволяет ретроспективно локализовать дефект и воспроизвести аварийный сценарий.

**Пример:**

```cpp
// logger.fatal(e.what());
```

**Источник:** [Cppreference: std::terminate](https://en.cppreference.com/w/cpp/error/terminate)

213. Почему исключения и деструкторы плохо сочетаются?

**Ответ:** Деструктор не имеет механизма передачи ошибки вызывающему контексту, кроме как через исключение; но выброс исключения во время раскрутки стека мгновенно вызывает `std::terminate()`. Поэтому деструкторы обязаны быть `noexcept`.

**Пример:**

```cpp
struct Safe {
    ~Safe() noexcept {} // Деструктор не должен выпускать наружу ошибки
};
```

**Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

214. Что делать, если освобождение ресурса может само завершиться ошибкой?

**Ответ:** Предоставлять явный открытый метод закрытия (`close()`, `commit()`) для обработки ошибок вызывающим кодом, а в деструкторе вызывать его только при необходимости, проглатывая или тихо логируя ошибку.

**Пример:**

```cpp
struct File {
    void close() { /* может бросить std::runtime_error */ }
    ~File() {
        try { close(); } catch (...) { /* логируем без throw */ }
    }
};
```

**Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

215. Почему операции закрытия файла, сокета или транзакции иногда нельзя безопасно выражать через бросающий деструктор?

**Ответ:** Потому что системный вызов `close()` может вернуть ошибку (например сбой записи буфера NFS `flush`), и если деструктор бросит исключение во время раскрутки другого исключения, программа мгновенно упадет.

**Пример:**

```cpp
// Выброс исключения из деструктора при flush приводит к std::terminate
```

**Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

216. Какие альтернативы есть для операций, которые могут “ошибиться при закрытии”?

**Ответ:** Двухэтапный дизайн: явный метод фиксации состояния (`flush()`, `close()`) с возвратом кода ошибки или бросанием исключения в штатном потоке, и пассивный деструктор, гарантирующий освобождение сырых дескрипторов.

**Пример:**

```cpp
file.flush(); // Тут обрабатываем ошибки записи
// Деструктор просто закроет дескриптор без выброса исключений
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

217. Что такое explicit close/commit перед деструктором как дизайн-подход?

**Ответ:** Паттерн, в котором клиент обязан явно вызвать финальный метод для подтверждения успешного завершения операций с ресурсом, а деструктор выполняет аварийный откат, если фиксация не произошла.

**Пример:**

```cpp
Transaction tx;
tx.performActions();
tx.commit(); // Явный коммит; если опущен -> деструктор сделает безопасный rollback
```

**Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

218. Почему destructive cleanup и error reporting трудно совместить?

**Ответ:** Очистка (_cleanup_) должна выполниться безусловно в любой ситуации, а отчет об ошибке (_reporting_) требует активного потока управления и точки принятия решений, недоступной во время автоматической очистки стека.

**Пример:**

```cpp
// Конфликт обязанностей: освободить память или сообщить об отказе ввода-вывода
```

**Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

219. Что такое `noexcept(false)`?

**Ответ:** Это явное указание компилятору на то, что функция потенциально может выбрасывать исключения.

**Пример:**

```cpp
void mightThrow() noexcept(false);
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

220. Когда явное `noexcept(false)` может встретиться?

**Ответ:** Для деструкторов, которые по умолчанию в C++11 считаются `noexcept(true)`, если разработчик сознательно хочет разрешить деструктору выбрасывать исключения (крайне не рекомендуется).

**Пример:**

```cpp
struct DangerousDestructor {
    ~DangerousDestructor() noexcept(false) {
        throw 1;
    }
};
```

**Источник:** [Cppreference: Destructors](https://en.cppreference.com/w/cpp/language/destructor)

221. Почему большинство функций не помечают `noexcept(false)` явно?

**Ответ:** Потому что в C++ любая функция по умолчанию считается потенциально бросающей исключения (`noexcept(false)` по умолчанию для всех обычных функций, кроме деструкторов и автоматически сгенерированных методов).

**Пример:**

```cpp
void standardFunction(); // Уже эквивалентно noexcept(false)
```

**Источник:** [Cppreference: noexcept specifier](https://en.cppreference.com/w/cpp/language/noexcept_spec)

222. Как исключения взаимодействуют с полиморфизмом исключений?

**Ответ:** Исключения перехватываются по ссылкам на базовые классы согласно законам объектно-ориентированного полиморфизма, вызывая соответствующие виртуальные функции (например `what()`).

**Пример:**

```cpp
try {
    throw std::out_of_range("Range error");
} catch (const std::exception& e) {
    e.what(); // Виртуальный полиморфный вызов
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

223. Почему базовый обработчик через `const std::exception&` не ловит всё на свете?

**Ответ:** Он не способен перехватить типы, не унаследованные от `std::exception` (например примитивы `throw 404;` или сторонние классы ошибок).

**Пример:**

```cpp
try {
    throw "raw C-string";
} catch (const std::exception&) {
    // НЕ перехватит! Нужен catch(...)
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

224. Что произойдёт, если выбросить тип, не связанный с `std::exception`?

**Ответ:** Он сможет быть перехвачен только обработчиком своего точного типа, базового класса своего типа или блоком `catch(...)`.

**Пример:**

```cpp
try {
    throw 5;
} catch (int val) {
    // Пойман
}
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

225. Почему пользовательские библиотеки часто стандартизуют базовый тип своих исключений?

**Ответ:** Это дает пользователям библиотеки выбор: перехватывать все ошибки именно этой библиотеки через её базовый класс (например `catch (const boost::exception&)`), не трогая исключения других подсистем.

**Пример:**

```cpp
class MyLibException : public std::runtime_error { /* ... */ };
class MyLibNetworkError : public MyLibException { /* ... */ };
```

**Источник:** [Cppreference: Derived classes](https://en.cppreference.com/w/cpp/language/derived_class)

226. Что такое exception translation at subsystem boundary?

**Ответ:** Архитектурная практика перехвата низкоуровневых исключений одного домена и генерация на их основе более высокоуровневых доменных исключений текущего слоя.

**Пример:**

```cpp
try {
    lowLevelSocketRead();
} catch (const SocketClosedException& e) {
    throw UserSessionTimeoutException();
}
```

**Источник:** [Cppreference: Exception handling](https://en.cppreference.com/w/cpp/language/exceptions)

227. Почему низкоуровневые детали ошибки не всегда стоит пробрасывать в верхний слой как есть?

**Ответ:** Это нарушает инкапсуляцию подсистем (leak of implementation details) и заставляет вызывающий код верхнего уровня знать об особенностях конкретного низкоуровневого драйвера.

**Пример:**

```cpp
// Контроллеру веб-страницы не нужно знать про POSIX errno 111 (ECONNREFUSED)
```

**Источник:** [Cppreference: Exception handling](https://en.cppreference.com/w/cpp/language/exceptions)

228. Как сохранить исходную причину ошибки при переводе исключений между слоями?

**Ответ:** Использовать стандартную функциональность `std::throw_with_nested` или сохранять `std::exception_ptr` исходного исключения в поле нового исключения.

**Пример:**

```cpp
#include <exception>

try {
    connectDb();
} catch (...) {
    std::throw_with_nested(HighLevelServiceException("Service failed"));
}
```

**Источник:** [Cppreference: std::throw_with_nested](https://en.cppreference.com/w/cpp/error/throw_with_nested)

229. Почему исключения полезны для разделения основного кода и кода обработки ошибок?

**Ответ:** Они выносят весь код обработки сбоев из основного линейного потока исполнения в обособленные блоки `catch`, освобождая счастливый путь алгоритма от бесконечного визуального шума.

**Пример:**

```cpp
// happy path выглядит чисто и последовательно
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

230. Чем это улучшает читаемость happy path?

**Ответ:** Алгоритм читается как бизнес-инструкция от начала до конца без регулярных прерываний на ветвления проверок кодов ошибок.

**Пример:**

```cpp
void workflow() {
    step1();
    step2();
    step3();
}
```

**Источник:** [Cppreference: Exceptions](https://en.cppreference.com/w/cpp/language/exceptions)

231. Почему злоупотребление `try/catch` может сделать код запутанным?

**Ответ:** Обилие локальных блоков `try/catch` на каждые две строчки кода превращает программу в кашу из обработчиков, нивелируя главное преимущество исключений — централизацию обработки.

**Пример:**

```cpp
// Антипаттерн: try-catch вокруг каждого отдельного вызова функции
```

**Источник:** [Cppreference: try_catch](https://en.cppreference.com/w/cpp/language/try_catch)

232. Когда `catch(...)` оправдан для cleanup и повторного выброса?

**Ответ:** Когда необходимо освободить унаследованный не-RAII ресурс (например дескриптор из C библиотеки) перед тем, как отпустить исключение дальше наверх.

**Пример:**

```cpp
void* handle = raw_c_init();
try {
    doSteps(handle);
} catch (...) {
    raw_c_cleanup(handle);
    throw; // Проброс ошибки дальше
}
raw_c_cleanup(handle);
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw#The_rethrow_expression)

233. Почему `catch(...) { throw; }` может использоваться в редких инфраструктурных местах?

**Ответ:** Для инкремента метрик сбоев, трассировки распределенных запросов или установки точек останова отладчика перед тем, как позволить исключению раскручивать стек дальше.

**Пример:**

```cpp
catch (...) {
    metrics.incrementErrorCounter();
    throw;
}
```

**Источник:** [Cppreference: throw](https://en.cppreference.com/w/cpp/language/throw#The_rethrow_expression)

234. Что такое exception-safe конструктор составного объекта?

**Ответ:** Это конструктор, в котором инициализация всех подресурсов либо защищена типами RAII, либо обернута так, что при сбое в середине создания объекта ни один ранее созданный ресурс не утекает.

**Пример:**

```cpp
#include <memory>

struct SafeCompound {
    std::unique_ptr<int> a;
    std::unique_ptr<double> b;
    SafeCompound() : a(std::make_unique<int>(1)), b(std::make_unique<double>(2.0)) {}
};
```

**Источник:** [Cppreference: Constructors](https://en.cppreference.com/w/cpp/language/constructor)

235. Как гарантировать отсутствие утечек, если один из шагов инициализации может бросить?

**Ответ:** Делать каждое поле самостоятельным RAII-объектом: деструкторы уже созданных полей вызовутся автоматически компилятором, если последующее поле выбросит исключение.

**Пример:**

```cpp
// Все поля оборачиваются в smart pointers
```

**Источник:** [Cppreference: Member initialization](https://en.cppreference.com/w/cpp/language/initializer_list)

236. Почему композиция RAII-объектов упрощает exception safety?

**Ответ:** Она устраняет необходимость ручного написания деструкторов и блоков `catch` в конструкторах: язык C++ автоматически управляет корректной поэтапной очисткой.

**Пример:**

```cpp
// "Правило нуля" (Rule of Zero) гарантирует автоматическую безопасность
```

**Источник:** [Cppreference: Rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three)

237. Что такое invariants-before-exit при исключениях?

**Ответ:** Это требование к методу или конструктору: перед выходом из области видимости по исключению объект обязан оставаться в непротиворечивом состоянии, удовлетворяющем базовому инварианту.

**Пример:**

```cpp
// Указатели не должны указывать на удаленные блоки
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

238. Почему public API должен оставлять объекты в корректном состоянии даже при неудаче?

**Ответ:** Чтобы внешний код мог безопасно уничтожить объект, сбросить его в исходное состояние или повторить вызов без риска неопределенного поведения и зависаний.

**Пример:**

```cpp
// Гарантия Basic Safety для всех публичных методов класса
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

239. Когда strong guarantee действительно стоит усилий, а когда basic guarantee достаточно?

**Ответ:** Strong guarantee необходима для транзакционных атомарных операций (банковские счета, сохранение баз данных, манипуляции контейнеров STL), тогда как для комплексных тяжелых вычислений (например, рендеринг кадра графики) вполне достаточно basic guarantee.

**Пример:**

```cpp
// push_back в векторе требует Strong, а сложный физический движок — Basic
```

**Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

240. Какие типичные ошибки разработчики делают при использовании исключений в C++?

**Ответ:**

1. Использование сырых ресурсов (`new`/`delete`) вместо RAII, ведущее к утечкам.
2. Выброс исключений из деструкторов, приводящий к вызову `std::terminate()`.
3. Ловля исключений по значению вместо `const std::exception&` (приводит к срезке типов).
4. Использование `throw e;` вместо `throw;` для повторного проброса.
5. Использование исключений для обычного штатного ветвления управляющего потока (control flow).

**Пример:**

```cpp
// 1. Плохо: catch (std::exception e)
// 2. Плохо: ~Class() { throw 1; }ß
// 3. Плохо: throw e; вместо throw;
```

**Источник:** [Cppreference: Error handling](https://en.cppreference.com/w/cpp/error)

[<- Prev](./10_raii_move_semantics.md) [Next ->](./12_compile_time.md)
