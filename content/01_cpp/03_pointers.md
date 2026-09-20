# Указатели_и_ссылки

## Лёгкий уровень

1. Что такое указатель в C++?

	**Ответ:** Указатель — объект, содержащий адрес другого объекта или функции.
	**Пример:** `int value{}; int* pointer = &value;`.
	**Типичная ошибка:** Разыменовывать null или dangling pointer.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

2. Что такое ссылка в C++?

	**Ответ:** Ссылка — другое имя уже существующего объекта.
	**Пример:** `int value{}; int& alias = value;`.
	**Типичная ошибка:** Ожидать, что ссылка может быть пустой.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

3. В чём основное отличие указателя от обычной переменной?

	**Ответ:** Указатель хранит адрес, может быть null и переназначаться.
	**Пример:** `pointer = &other;`.
	**Типичная ошибка:** Приписывать указателю владение объектом автоматически.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

4. В чём основное отличие ссылки от обычной переменной?

	**Ответ:** Ссылка не создаёт отдельный объект, а предоставляет имя существующего.
	**Пример:** `alias = 3;` меняет `value`.
	**Типичная ошибка:** Считать ссылку копией.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

5. Что хранит указатель?

	**Ответ:** Адрес объекта, функции или специальное нулевое значение.
	**Пример:** `int* p = nullptr;`.
	**Типичная ошибка:** Использовать значение указателя как размер объекта.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

6. Что означает символ `*` в объявлении указателя?

	**Ответ:** Он указывает, что объявляется указатель на указанный тип.
	**Пример:** `int* p;`.
	**Типичная ошибка:** Путать `*` в декларации с разыменованием.
	**Источник:** [Cppreference: pointer declaration](https://en.cppreference.com/w/cpp/language/pointer)

7. Что означает символ `&` при получении адреса переменной?

	**Ответ:** В выражении `&x` оператор получает адрес объекта `x`.
	**Пример:** `int* p = &x;`.
	**Типичная ошибка:** Путать оператор адреса с объявлением ссылки.
	**Источник:** [Cppreference: address-of operator](https://en.cppreference.com/w/cpp/language/operator_member_access)

8. Что означает `&` в объявлении ссылки?

	**Ответ:** Он означает ссылочный тип, то есть альтернативное имя объекта.
	**Пример:** `int& ref = value;`.
	**Типичная ошибка:** Считать ссылку указателем с автоматическим разыменованием.
	**Источник:** [Cppreference: references](https://en.cppreference.com/w/cpp/language/reference)

9. Как объявить указатель на `int`?

	**Ответ:** Укажите `int*` и имя указателя.
	**Пример:** `int* pointer = nullptr;`.
	**Типичная ошибка:** Оставлять локальный указатель без инициализации.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

10. Как объявить ссылку на `int`?

	**Ответ:** Используйте `int&` и сразу привяжите ссылку к объекту.
	**Пример:** `int value{}; int& ref = value;`.
	**Типичная ошибка:** Пытаться объявить обычную ссылку без инициализатора.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

11. Что такое адрес переменной?

	**Ответ:** Это значение, идентифицирующее расположение объекта в адресном пространстве.
	**Пример:** `&value` имеет тип `int*` для `int value`.
	**Типичная ошибка:** Хранить адрес после окончания lifetime объекта.
	**Источник:** [Cppreference: object](https://en.cppreference.com/w/cpp/language/object)

12. Как получить адрес переменной?

	**Ответ:** Применить унарный оператор `&` к lvalue-объекту.
	**Пример:** `auto address = &value;`.
	**Типичная ошибка:** Брать адрес временного объекта без понимания его lifetime.
	**Источник:** [Cppreference: operator&](https://en.cppreference.com/w/cpp/language/operator_member_access)

13. Можно ли вывести адрес переменной через `cout`?

	**Ответ:** Да, `std::cout` имеет перегрузку для указателей; обычно адрес выводят как `const void*`.
	**Пример:** `std::cout << static_cast<const void*>(&value);`.
	**Типичная ошибка:** Ожидать стабильный адрес между запусками программы.
	**Источник:** [Cppreference: basic_ostream](https://en.cppreference.com/w/cpp/io/basic_ostream)

14. Что такое разыменование указателя?

	**Ответ:** Разыменование получает объект, находящийся по адресу указателя.
	**Пример:** `*pointer = 42;`.
	**Типичная ошибка:** Разыменовать null или недействительный адрес.
	**Источник:** [Cppreference: indirection](https://en.cppreference.com/w/cpp/language/operator_member_access)

15. Что делает оператор `*p`, если `p` — указатель?

	**Ответ:** Он обращается к объекту, на который указывает `p`.
	**Пример:** `int value = *p;`.
	**Типичная ошибка:** Использовать `*p` после уничтожения объекта.
	**Источник:** [Cppreference: indirection](https://en.cppreference.com/w/cpp/language/operator_member_access)

16. Как изменить значение переменной через указатель?

	**Ответ:** Разыменовать указатель слева от присваивания.
	**Пример:** `*pointer = 10;`.
	**Типичная ошибка:** Не проверить, что pointer не равен `nullptr`.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

17. Как изменить значение переменной через ссылку?

	**Ответ:** Использовать ссылку как обычное lvalue, если она не `const`.
	**Пример:** `ref = 10;`.
	**Типичная ошибка:** Пытаться менять объект через `const T&`.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

18. Что такое нулевой указатель?

	**Ответ:** Это указатель, не указывающий ни на один объект или функцию.
	**Пример:** `int* pointer = nullptr;`.
	**Типичная ошибка:** Проверять указатель сравнением с произвольным адресом.
	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

19. Что такое `nullptr`?

	**Ответ:** `nullptr` — null pointer literal типа `std::nullptr_t`.
	**Пример:** `if (pointer == nullptr) { return; }`.
	**Типичная ошибка:** Использовать `0` в перегруженном интерфейсе.
	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

20. Почему в современном C++ лучше использовать `nullptr`, а не `NULL`?

	**Ответ:** `nullptr` имеет специальный тип и не путается с целочисленными перегрузками.
	**Пример:** `f(nullptr)` однозначно выбирает указательную перегрузку.
	**Типичная ошибка:** Считать `NULL` полноценным типом указателя.
	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

21. Можно ли разыменовывать `nullptr`?

	**Ответ:** Нет, разыменование null pointer приводит к неопределённому поведению.
	**Пример:** Перед `*p` проверяйте `p != nullptr`.
	**Типичная ошибка:** Надеяться, что разыменование просто вернёт ноль.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

22. Что произойдёт при разыменовании нулевого указателя?

	**Ответ:** Поведение программы не определено стандартом; часто возникает аварийное завершение.
	**Пример:** `int value = *static_cast<int*>(nullptr);` некорректен.
	**Типичная ошибка:** Пытаться обрабатывать это как обычное исключение.
	**Источник:** [Cppreference: undefined behavior](https://en.cppreference.com/w/cpp/language/ub)

23. Можно ли объявить указатель без инициализации?

	**Ответ:** Синтаксически можно, но локальный указатель получает неопределённое значение.
	**Пример:** `int* pointer;` опасен до присваивания.
	**Типичная ошибка:** Проверять неинициализированный pointer на null.
	**Источник:** [Cppreference: default initialization](https://en.cppreference.com/w/cpp/language/default_initialization)

24. Почему неинициализированный указатель опасен?

	**Ответ:** Он может содержать произвольный адрес, а разыменование повреждает память или завершает программу.
	**Пример:** Всегда пишите `int* pointer = nullptr;`.
	**Типичная ошибка:** Считать неинициализированную память нулевой.
	**Источник:** [Cppreference: default initialization](https://en.cppreference.com/w/cpp/language/default_initialization)

25. Как правильно инициализировать указатель, если он пока ни на что не указывает?

	**Ответ:** Инициализировать его значением `nullptr`.
	**Пример:** `Widget* widget = nullptr;`.
	**Типичная ошибка:** Использовать `0` или неинициализированный указатель.
	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

26. Можно ли объявить ссылку без инициализации?

	**Ответ:** Нет, обычная ссылка должна быть привязана к объекту при объявлении.
	**Пример:** `int& ref = value;`.
	**Типичная ошибка:** Пытаться сделать «пустую ссылку».
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

27. Почему ссылка должна быть инициализирована сразу?

	**Ответ:** Ссылка всегда обозначает конкретный объект, и у языка нет отдельного состояния «не привязана».

	**Пример:** Для optional-семантики используйте pointer или `std::optional<std::reference_wrapper<T>>`.
	**Типичная ошибка:** Заменять nullable pointer ссылкой.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

28. Можно ли после создания “переназначить” ссылку на другой объект?

	**Ответ:** Нет, присваивание через ссылку изменяет исходный объект, а не привязку.
	**Пример:** `ref = other;` копирует `other` в объект, на который указывает `ref`.
	**Типичная ошибка:** Ожидать поведения указателя.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

29. Можно ли изменить значение, на которое ссылается ссылка?

	**Ответ:** Да, если ссылка не константная и объект изменяем.
	**Пример:** `int& ref = value; ref = 7;`.
	**Типичная ошибка:** Изменять объект, объявленный изначально `const`, через cast.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

30. Чем ссылка похожа на псевдоним переменной?

	**Ответ:** Обращение к ссылке обращается к тому же объекту, а отдельной копии значения не создаётся.
	**Пример:** `ref += 1;` меняет `value`.
	**Типичная ошибка:** Путать псевдоним с независимой переменной.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

31. Как связаны переменная `x` и ссылка `ref`, если `int& ref = x;`?

	**Ответ:** `ref` и `x` обозначают один и тот же объект.
	**Пример:** `&ref == &x`.
	**Типичная ошибка:** Считать, что ссылка хранит отдельную копию `x`.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

32. Что будет при изменении `x`, если есть ссылка `ref`?

	**Ответ:** Через `ref` будет видно новое значение, потому что он связан с тем же объектом.
	**Пример:** `x = 3; assert(ref == 3);`.
	**Типичная ошибка:** Кэшировать старое значение вместо чтения объекта.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

33. Что будет при изменении `ref`, если он ссылается на `x`?

	**Ответ:** Изменится `x`.
	**Пример:** `ref = 5; assert(x == 5);`.
	**Типичная ошибка:** Ожидать переназначения ссылки.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

34. Что хранит ссылка “на уровне модели языка”?

	**Ответ:** Язык рассматривает ссылку как имя объекта, а не как обязательный отдельный объект с адресом.
	**Пример:** `sizeof(ref)` равен размеру типа объекта.
	**Типичная ошибка:** Делать вывод о реализации ссылки как указателя.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

35. Чем запись `int *p;` отличается от `int& r;`?

	**Ответ:** `p` — указатель, который может быть null и требует инициализации для разыменования; `r` — ссылка, обязательно привязанная к объекту.
	**Пример:** `int* p = nullptr; int& r = value;`.
	**Типичная ошибка:** Использовать одинаковые правила проверки для них.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

36. Что такое указатель на указатель?

	**Ответ:** Это указатель, хранящий адрес другого указателя.
	**Пример:** `int value{}; int* p = &value; int** pp = &p;`.
	**Типичная ошибка:** Неправильно подсчитать уровни разыменования.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

37. Как объявить указатель на указатель типа `int`?

	**Ответ:** Использовать два символа `*`: `int**`.
	**Пример:** `int** pointer = nullptr;`.
	**Типичная ошибка:** Читать `int**` как массив указателей.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

38. Что означает выражение `**pp`?

	**Ответ:** Оно дважды разыменовывает указатель и получает объект `int`, если цепочка адресов действительна.
	**Пример:** `**pp = 10;` меняет исходное значение.
	**Типичная ошибка:** Не проверять каждый указатель в цепочке.
	**Источник:** [Cppreference: indirection](https://en.cppreference.com/w/cpp/language/operator_member_access)

39. Можно ли создать ссылку на ссылку обычным синтаксисом?

	**Ответ:** Нет, обычные ссылки на ссылки не образуются; в шаблонах подобные формы схлопываются.
	**Пример:** `T& &&` превращается в `T&`.
	**Типичная ошибка:** Считать ссылку на ссылку отдельным runtime-объектом.
	**Источник:** [Cppreference: reference collapsing](https://en.cppreference.com/w/cpp/language/reference)

40. Что такое константная ссылка?

	**Ответ:** `const T&` позволяет читать объект без изменения и может связываться с временным значением.
	**Пример:** `const std::string& name = "Ada";`.
	**Типичная ошибка:** Хранить такую ссылку дольше lifetime объекта.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

41. Как объявить `const int&`?

	**Ответ:** Написать `const int& ref` и инициализировать ссылку объектом или допустимым временным.
	**Пример:** `const int& ref = value;`.
	**Типичная ошибка:** Пытаться присвоить через `ref`.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

42. Можно ли через `const`-ссылку изменить объект?

	**Ответ:** Нет, через неё объект нельзя изменять; сам объект может быть изменяемым через другой путь.
	**Пример:** `const int& view = value;` только читает `value`.
	**Типичная ошибка:** Принимать ограничение доступа за изменение самого объекта в `const`.
	**Источник:** [Cppreference: cv qualifiers](https://en.cppreference.com/w/cpp/language/cv)

43. Что такое указатель на `const`?

	**Ответ:** Это указатель `const T*`, через который нельзя изменять объект типа `T`.
	**Пример:** `const int* view = &value;`.
	**Типичная ошибка:** Путать его с константным указателем `T* const`.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

44. Как объявить `const int* p;`?

	**Ответ:** Запись `const int* p` объявляет изменяемый указатель на константный `int`.
	**Пример:** `const int* p = &value; p = &other;`.
	**Типичная ошибка:** Считать `p` неизменяемым.
	**Источник:** [Cppreference: cv-qualified types](https://en.cppreference.com/w/cpp/language/cv)

45. Что такое константный указатель?

	**Ответ:** Это указатель, который нельзя переназначить после инициализации.
	**Пример:** `int* const p = &value;`.
	**Типичная ошибка:** Путать неизменяемый адрес с неизменяемым объектом.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

46. Как объявить `int* const p;`?

	**Ответ:** Такой указатель нужно сразу инициализировать адресом изменяемого `int`.
	**Пример:** `int value{}; int* const p = &value;`.
	**Типичная ошибка:** Оставить const pointer без инициализатора.
	**Источник:** [Cppreference: const](https://en.cppreference.com/w/cpp/language/cv)

47. Чем `const int* p` отличается от `int* const p`?

	**Ответ:** В первом случае const относится к объекту, во втором — к самому указателю.
	**Пример:** `const int* a; int* const b = &value;`.
	**Типичная ошибка:** Читать `const` без учёта его положения.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

48. Как объявить указатель, у которого и сам адрес постоянный, и данные константные?

	**Ответ:** Использовать `const T* const`.
	**Пример:** `const int* const p = &value;`.
	**Типичная ошибка:** Пытаться переназначить такой указатель.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

49. Можно ли присвоить указателю адрес другой переменной того же типа?

	**Ответ:** Да, если указатель не const и адрес доступен.
	**Пример:** `p = &other;`.
	**Типичная ошибка:** Использовать указатель после уничтожения нового объекта.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

50. Можно ли присвоить ссылке другой объект после инициализации?

	**Ответ:** Нет: присваивание через ссылку меняет связанный объект.
	**Пример:** `ref = other;` присваивает значение `other` в исходный объект.
	**Типичная ошибка:** Ожидать переназначения как у указателя.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

## Ниже среднего уровня

51. Что происходит в памяти при передаче аргумента в функцию по значению?

	**Ответ:** Создаётся отдельный параметр-копия, если оптимизация или move не меняют эту модель.
	**Пример:** `void f(int value);`.
	**Типичная ошибка:** Ожидать изменения исходного объекта.
	**Источник:** [Cppreference: function parameters](https://en.cppreference.com/w/cpp/language/function)

52. Что происходит при передаче аргумента в функцию по ссылке?

	**Ответ:** Параметр становится другим именем исходного объекта без копирования.
	**Пример:** `void increment(int& value) { ++value; }`.
	**Типичная ошибка:** Передать временный объект в неконстантную ссылку.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

53. Что происходит при передаче аргумента в функцию через указатель?

	**Ответ:** В функцию передаётся копия адреса, а доступ к объекту выполняется через разыменование.
	**Пример:** `void increment(int* value) { ++*value; }`.
	**Типичная ошибка:** Не обработать `nullptr`.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

54. Чем передача по ссылке удобнее передачи через указатель?

	**Ответ:** Ссылка выражает обязательное наличие объекта и использует обычный синтаксис доступа.
	**Пример:** `void print(const Item& item);`.
	**Типичная ошибка:** Использовать ссылку для nullable-параметра.
	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#fcall-parameter-passing)

55. Когда передача через указатель удобнее передачи по ссылке?

	**Ответ:** Когда отсутствие объекта допустимо, нужен адрес или функция меняет сам указатель.
	**Пример:** `void set_target(Node* node);`.
	**Типичная ошибка:** Не документировать владение raw pointer.
	**Источник:** [C++ Core Guidelines: raw pointers](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r3-a-raw-pointer-is-non-owning)

56. Как выглядит функция, принимающая `int*`?

	**Ответ:** Параметр объявляют как `int*`; внутри нужно учитывать возможность null.

	**Пример:** `void set(int* value) { if (value) *value = 1; }`.
	**Типичная ошибка:** Безусловно разыменовать параметр.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

57. Как выглядит функция, принимающая `int&`?

	**Ответ:** Параметр объявляют как `int&` и используют как обычный `int`.

	**Пример:** `void set(int& value) { value = 1; }`.
	**Типичная ошибка:** Пытаться проверить ссылку на null.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

58. Как выглядит функция, принимающая `const int&`?

	**Ответ:** `const int&` позволяет читать аргумент без копии и принимать временные значения.

	**Пример:** `void print(const int& value);`.
	**Типичная ошибка:** Выбирать такую форму для дешёвого `int` без причины.
	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#fcall-parameter-passing)

59. Как проверить внутри функции, что указатель не равен `nullptr`?

	**Ответ:** Используйте явное сравнение или контекстное преобразование к bool.

	**Пример:** `if (pointer != nullptr) { use(*pointer); }`.
	**Типичная ошибка:** Проверить после разыменования.
	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

60. Почему ссылку обычно не нужно проверять на `nullptr`?

	**Ответ:** Корректная ссылка уже привязана к объекту и не имеет состояния null.

	**Пример:** `void use(Item& item) { item.run(); }`.
	**Типичная ошибка:** Имитировать nullable-ссылку через опасный cast.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

61. Можно ли передать в функцию `nullptr`, если параметр — указатель?

	**Ответ:** Да, если тип параметра совместим с null pointer literal.

	**Пример:** `void f(int*); f(nullptr);`.
	**Типичная ошибка:** Не описать, что null означает в контракте функции.
	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

62. Можно ли передать “ничего”, если параметр — ссылка?

	**Ответ:** Нет, ссылка требует существующий объект; для отсутствия используйте pointer или optional.

	**Пример:** `std::optional<std::reference_wrapper<Item>>`.
	**Типичная ошибка:** Передать `nullptr` в `Item&`.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

63. Что такое возврат значения из функции по указателю?

	**Ответ:** Функция возвращает адрес объекта; caller должен понимать lifetime и возможность null.

	**Пример:** `Item* find(Item* first, std::size_t n);`.
	**Типичная ошибка:** Вернуть адрес локальной переменной.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

64. Что такое возврат значения из функции по ссылке?

	**Ответ:** Функция возвращает alias существующего объекта без копирования.

	**Пример:** `Item& front(std::vector<Item>& items);`.
	**Типичная ошибка:** Вернуть ссылку на временный или локальный объект.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

65. В каких случаях функция может возвращать ссылку?

	**Ответ:** Когда возвращаемый объект гарантированно переживает вызов, например элемент контейнера или член долгоживущего объекта.

	**Пример:** `std::string& name() { return name_; }`.
	**Типичная ошибка:** Скрыть владение и lifetime за ссылкой.
	**Источник:** [C++ Core Guidelines: return values](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f44-return-a-t-from-a-function-instead-of-a-t)

66. Почему опасно возвращать ссылку на локальную переменную?

	**Ответ:** Локальный объект уничтожается при выходе из функции, и ссылка становится dangling.

	**Пример:** `int& bad() { int value{}; return value; }`.
	**Типичная ошибка:** Проверять такую ссылку только по адресу.
	**Источник:** [Cppreference: lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

67. Почему опасно возвращать указатель на локальную переменную?

	**Ответ:** После выхода из функции адрес указывает на уничтоженный объект.

	**Пример:** `int* bad() { int value{}; return &value; }`.
	**Типичная ошибка:** Обнулять pointer вместо исправления lifetime.
	**Источник:** [Cppreference: lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

68. Что такое время жизни объекта, на который указывает указатель?

	**Ответ:** Это период, когда объект существует и доступ к нему через pointer корректен.

	**Пример:** Pointer на элемент vector может стать недействительным после reallocation.
	**Типичная ошибка:** Связывать lifetime указателя с lifetime объекта автоматически.
	**Источник:** [Cppreference: object lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

69. Что будет, если указатель указывает на уже уничтоженный объект?

	**Ответ:** Он становится dangling, а разыменование приводит к неопределённому поведению.

	**Пример:** `delete pointer; use(*pointer);`.
	**Типичная ошибка:** Проверять только `pointer != nullptr`.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

70. Что такое висячий указатель?

	**Ответ:** Это указатель, значение которого формально осталось, но объект по адресу больше не существует или недоступен.

	**Пример:** Указатель после `delete`.
	**Типичная ошибка:** Считать ненулевой адрес признаком валидности.
	**Источник:** [Cppreference: object lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

71. Что такое висячая ссылка?

	**Ответ:** Это ссылка на объект, lifetime которого закончился.

	**Пример:** Ссылка на локальный объект после возврата из функции.
	**Типичная ошибка:** Пытаться проверить ссылку на валидность.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

72. Как может появиться висячий указатель?

	**Ответ:** После `delete`, освобождения контейнером памяти, выхода локального объекта или invalidating операции.

	**Пример:** `std::vector` может инвалидировать pointer при расширении.
	**Типичная ошибка:** Не читать правила invalidation конкретного контейнера.
	**Источник:** [Cppreference: vector](https://en.cppreference.com/w/cpp/container/vector)

73. Как может появиться висячая ссылка?

	**Ответ:** При возврате ссылки на локальный объект, привязке к уничтоженному временному или invalidation элемента контейнера.

	**Пример:** `auto& ref = vector.front(); vector.push_back(value);`.
	**Типичная ошибка:** Сохранять ссылку на элемент при возможной reallocation.
	**Источник:** [Cppreference: vector](https://en.cppreference.com/w/cpp/container/vector)

74. Почему после `delete` указатель часто присваивают `nullptr`?

	**Ответ:** Это предотвращает случайное повторное использование того же адреса через конкретную переменную.

	**Пример:** `delete pointer; pointer = nullptr;`.
	**Типичная ошибка:** Считать обнуление защитой всех копий pointer.

	**Источник:** [C++ Core Guidelines: raw pointers](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r5-prefer-scoped-objects-dont-heap-allocate-unnecessarily)

75. Является ли это полной защитой от ошибок?

	**Ответ:** Нет, другие копии адреса могут остаться dangling, а manual ownership всё равно сложен.

	**Пример:** `int* alias = pointer; delete pointer; alias` всё ещё опасен.
	**Типичная ошибка:** Использовать обнуление вместо RAII.
	**Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-resource-management)

76. Можно ли взять адрес у ссылки?

	**Ответ:** Да, `&ref` даёт адрес объекта, к которому она привязана.

	**Пример:** `int* p = &ref;`.
	**Типичная ошибка:** Ожидать адрес отдельного ссылочного объекта.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

77. Что вернёт выражение `&ref`, если `ref` — ссылка на объект?

	**Ответ:** Адрес исходного объекта, а не отдельного alias.

	**Пример:** `&ref == &value`.
	**Типичная ошибка:** Считать ссылку дополнительным объектом памяти.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

78. Чем указатель отличается от ссылки с точки зрения возможности быть пустым?

	**Ответ:** Указатель может быть `nullptr`, корректная ссылка — нет.

	**Пример:** `Item* optional_item = nullptr;`.
	**Типичная ошибка:** Использовать ссылку для optional-состояния.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

79. Чем указатель отличается от ссылки с точки зрения переназначения?

	**Ответ:** Указатель можно направить на другой объект, ссылка после инициализации остаётся привязанной.

	**Пример:** `p = &other;`, но `ref = other` меняет значение.
	**Типичная ошибка:** Принять присваивание ссылке за переназначение.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

80. Чем указатель отличается от ссылки по синтаксису использования?

	**Ответ:** Pointer разыменовывают `*` и обращаются к членам через `->`, reference использует обычный `.`.

	**Пример:** `pointer->run(); reference.run();`.
	**Типичная ошибка:** Использовать `->` после объекта-ссылки.
	**Источник:** [Cppreference: member access](https://en.cppreference.com/w/cpp/language/operator_member_access)

81. Почему ссылки часто выглядят “как обычные переменные”?

	**Ответ:** Ссылка является alias, поэтому компилятор автоматически применяет доступ к связанному объекту.

	**Пример:** `ref.value` обращается к члену исходного объекта.
	**Типичная ошибка:** Забывать, что lifetime всё равно должен быть достаточным.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

82. Что такое массив и как он связан с указателями?

	**Ответ:** Массив хранит элементы подряд; в большинстве выражений его имя преобразуется в pointer на первый элемент.

	**Пример:** `int values[3]; int* p = values;`.
	**Типичная ошибка:** Путать array type с pointer type.
	**Источник:** [Cppreference: array](https://en.cppreference.com/w/cpp/language/array)

83. Почему имя массива часто преобразуется к указателю на первый элемент?

	**Ответ:** Это array-to-pointer conversion, позволяющая применять массивы к обычным pointer-интерфейсам.

	**Пример:** `values` в вызове `process(values)` становится `&values[0]`.
	**Типичная ошибка:** Ожидать сохранения размера массива.
	**Источник:** [Cppreference: array-to-pointer conversion](https://en.cppreference.com/w/cpp/language/implicit_conversion)

84. Чем `arr` отличается от `&arr[0]`?

	**Ответ:** В большинстве выражений они дают один адрес, но `arr` — массив до decay, а `&arr[0]` сразу pointer.

	**Пример:** `sizeof(arr)` сохраняет размер массива, `sizeof(&arr[0])` — размер pointer.
	**Типичная ошибка:** Считать эти выражения одинаковыми во всех контекстах.
	**Источник:** [Cppreference: array](https://en.cppreference.com/w/cpp/language/array)

85. Что такое арифметика указателей?

	**Ответ:** Это сложение и вычитание pointer с целым числом или разность pointer внутри одного массива.

	**Пример:** `p + index` указывает на элемент с таким смещением.
	**Типичная ошибка:** Выполнять арифметику для несвязанных объектов.
	**Источник:** [Cppreference: pointer arithmetic](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

86. Что означает `p + 1`, если `p` — указатель на `int`?

	**Ответ:** Он указывает на следующий `int`, то есть адрес увеличивается на `sizeof(int)` байт.

	**Пример:** Для массива `p + 1 == &values[1]`.
	**Типичная ошибка:** Ожидать сдвиг ровно на один байт.
	**Источник:** [Cppreference: pointer arithmetic](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

87. Почему `p + 1` сдвигает указатель не на 1 байт, а на размер типа?

	**Ответ:** Pointer arithmetic измеряет расстояние в элементах типа, на который указывает pointer.

	**Пример:** Для `double*` шаг равен `sizeof(double)`.
	**Типичная ошибка:** Использовать pointer arithmetic как byte arithmetic.
	**Источник:** [Cppreference: pointer arithmetic](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

88. Что означает `*(p + i)`?

	**Ответ:** Получить i-й элемент массива, начиная с адреса `p`.

	**Пример:** `*(values + 2)` эквивалентно `values[2]`.
	**Типичная ошибка:** Передать i за границы массива.
	**Источник:** [Cppreference: pointer arithmetic](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

89. Почему запись `p[i]` эквивалентна `*(p + i)`?

	**Ответ:** Индексация в C++ определена через сложение и разыменование.

	**Пример:** `p[0]` — `*(p + 0)`.
	**Типичная ошибка:** Считать `p[i]` проверяемым доступом.
	**Источник:** [Cppreference: built-in subscript operator](https://en.cppreference.com/w/cpp/language/operator_member_access)

90. Можно ли выполнять арифметику над ссылками?

	**Ответ:** Нет, ссылки не являются объектами адресной арифметики; операции выполняются над связанным объектом после преобразований.

	**Пример:** `ref + 1` — арифметика значения, а не ссылки.
	**Типичная ошибка:** Ожидать смещения alias в памяти.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

91. Что такое указатель на элемент массива?

	**Ответ:** Это pointer, содержащий адрес конкретного элемента последовательного массива.

	**Пример:** `int* current = &values[2];`.
	**Типичная ошибка:** Использовать pointer после конца lifetime массива.
	**Источник:** [Cppreference: pointer arithmetic](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

92. Как пройтись по массиву с помощью указателя?

	**Ответ:** Идти от `begin` до pointer one-past-the-end, увеличивая pointer на один элемент.

	**Пример:** `for (int* p = values; p != values + n; ++p) use(*p);`.
	**Типичная ошибка:** Разыменовать one-past-the-end pointer.
	**Источник:** [Cppreference: pointer arithmetic](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

93. Почему выход за границы массива через указатель опасен?

	**Ответ:** Он обращается к памяти вне объекта и приводит к неопределённому поведению.

	**Пример:** `*(values + n)` недопустим при размере `n`.
	**Типичная ошибка:** Проверять результат после некорректного чтения.
	**Источник:** [C++ Core Guidelines: bounds](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#bounds)

94. Можно ли сравнивать два указателя?

	**Ответ:** Да, равенство и неравенство применимы; relational comparison имеет строгие ограничения для разных объектов.

	**Пример:** `first == last` используется для итерации.
	**Типичная ошибка:** Сравнивать `<` указатели на несвязанные объекты как индексы.
	**Источник:** [Cppreference: pointer comparison](https://en.cppreference.com/w/cpp/language/operator_comparison)

95. Когда сравнение указателей имеет смысл?

	**Ответ:** Для проверки null, одинакового объекта или порядка элементов одного массива.

	**Пример:** `p >= begin && p < end` внутри одного массива.
	**Типичная ошибка:** Делать вывод о порядке двух независимых allocation.
	**Источник:** [Cppreference: pointer comparison](https://en.cppreference.com/w/cpp/language/operator_comparison)

96. Можно ли вычитать один указатель из другого?

	**Ответ:** Да, если оба указывают на элементы одного массива или one-past-the-end.

	**Пример:** `auto count = last - first;`.
	**Типичная ошибка:** Вычитать pointer разных объектов.
	**Источник:** [Cppreference: pointer arithmetic](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

97. Что показывает разность двух указателей?

	**Ответ:** Количество элементов между pointer, результат имеет тип `std::ptrdiff_t`.

	**Пример:** `&values[4] - &values[1]` равно `3`.
	**Типичная ошибка:** Читать разность как число байт.
	**Источник:** [Cppreference: pointer arithmetic](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

98. Что такое тип `ptrdiff_t` и где он связан с указателями?

	**Ответ:** Это знаковый тип для результата вычитания pointer и представления отрицательных расстояний.

	**Пример:** `std::ptrdiff_t distance = last - first;`.
	**Типичная ошибка:** Заменять его unsigned-размером.
	**Источник:** [Cppreference: ptrdiff_t](https://en.cppreference.com/w/cpp/types/ptrdiff_t)

99. Как связаны `sizeof` и указатели?

	**Ответ:** `sizeof(pointer)` даёт размер самого адреса, а не объекта, на который он указывает.

	**Пример:** `sizeof(int*)` не равен `sizeof(int)`.
	**Типичная ошибка:** Выделять память через `sizeof(pointer)` вместо `sizeof(*pointer)`.
	**Источник:** [Cppreference: sizeof](https://en.cppreference.com/w/cpp/language/sizeof)

100. Почему размер указателя не зависит от типа объекта, на который он указывает?

	**Ответ:** Pointer хранит адрес, а тип pointee нужен компилятору для проверки и арифметики; конкретный адрес имеет размер ABI.

	**Пример:** `sizeof(int*)` и `sizeof(double*)` часто одинаковы.
	**Типичная ошибка:** Делать вывод, что разные pointer имеют одинаковую арифметику.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

## Средний уровень

101. Что такое `void*`?

	**Ответ:** `void*` — указатель на неизвестный тип объекта.
	**Пример:** `void* raw = &value;`.
	**Типичная ошибка:** Разыменовать его без восстановления типа.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

102. Для чего используется `void*`?

	**Ответ:** Для низкоуровневых C API и универсальных буферов, когда тип передаётся отдельно.
	**Пример:** Callback API может принимать `void* context`.
	**Типичная ошибка:** Использовать его вместо шаблонов и терять типобезопасность.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

103. Почему `void*` нельзя разыменовывать без приведения типа?

	**Ответ:** У компилятора нет информации о размере и типе объекта, который находится по адресу.
	**Пример:** `*static_cast<int*>(raw)` после проверки контракта.
	**Типичная ошибка:** Привести к неправильному типу.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

104. Чем `void*` отличается от `int*` или `double*`?

	**Ответ:** Typed pointer знает размер шага и допустимые операции, а `void*` — нет.
	**Пример:** `p + 1` для `void*` не является стандартной pointer arithmetic.
	**Типичная ошибка:** Считать `void*` безопасным универсальным pointer.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

105. Можно ли неявно преобразовать `int*` в `void*`?

	**Ответ:** Да, pointer на объект можно неявно преобразовать в `void*`.
	**Пример:** `int value{}; void* raw = &value;`.
	**Типичная ошибка:** Забыть, какой тип нужно восстановить при обратном доступе.
	**Источник:** [Cppreference: pointer conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

106. Можно ли неявно преобразовать `void*` обратно в `int*` в C++?

	**Ответ:** Нет, обратное преобразование требует явного cast.
	**Пример:** `int* p = static_cast<int*>(raw);`.
	**Типичная ошибка:** Применять cast без гарантии исходного типа.
	**Источник:** [Cppreference: static_cast](https://en.cppreference.com/w/cpp/language/static_cast)

107. Что такое указатель на функцию?

	**Ответ:** Это pointer, хранящий адрес функции с определённой сигнатурой.
	**Пример:** `void (*callback)();`.
	**Типичная ошибка:** Не совпадение параметров и возвращаемого типа.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

108. Как объявить указатель на функцию, принимающую `int` и возвращающую `void`?

	**Ответ:** Используйте `void (*pointer)(int)`.
	**Пример:** `void (*callback)(int) = print;`.
	**Типичная ошибка:** Прочитать объявление как функцию, а не pointer.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

109. Как вызвать функцию через указатель на функцию?

	**Ответ:** Вызов выполняется обычными скобками; `(*pointer)(argument)` и `pointer(argument)` эквивалентны.
	**Пример:** `callback(42);`.
	**Типичная ошибка:** Вызвать null function pointer.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

110. Когда полезны указатели на функции?

	**Ответ:** Для callback, таблиц операций, стратегий и C-интерфейсов.
	**Пример:** Массив обработчиков команд.
	**Типичная ошибка:** Использовать pointer вместо лямбды или `std::function` без причины.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

111. Что такое ссылка на функцию?

	**Ответ:** Это reference, связанный с функцией определённой сигнатуры.
	**Пример:** `void (&callback)(int) = print;`.
	**Типичная ошибка:** Пытаться сделать reference null.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

112. Чем ссылка на функцию отличается от указателя на функцию?

	**Ответ:** Reference обязана быть привязана к функции и не может быть null или переназначена.
	**Пример:** Для optional callback удобнее pointer.
	**Типичная ошибка:** Игнорировать различие в контракте наличия.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

113. Что такое указатель на массив?

	**Ответ:** Это pointer на весь массив фиксированного типа и размера.
	**Пример:** `int (*pointer)[5] = &values;`.
	**Типичная ошибка:** Путать его с массивом pointer.
	**Источник:** [Cppreference: array](https://en.cppreference.com/w/cpp/language/array)

114. Чем `int* p[5]` отличается от `int (*p)[5]`?

	**Ответ:** Первое — массив пяти `int*`, второе — pointer на массив пяти `int`.
	**Пример:** Скобки меняют порядок связывания декларации.
	**Типичная ошибка:** Игнорировать скобки в сложных объявлениях.
	**Источник:** [Cppreference: array declaration](https://en.cppreference.com/w/cpp/language/array)

115. Что такое массив указателей?

	**Ответ:** Массив, каждый элемент которого является отдельным pointer.
	**Пример:** `const char* names[3]{};`.
	**Типичная ошибка:** Считать его двумерным массивом символов.
	**Источник:** [Cppreference: array](https://en.cppreference.com/w/cpp/language/array)

116. Где применяются массивы указателей?

	**Ответ:** В таблицах callback, списках строк разной длины и таблицах объектов.
	**Пример:** `void (*handlers[3])();`.
	**Типичная ошибка:** Не обеспечить lifetime объектов, на которые они указывают.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

117. Что такое указатель на `const`-объект?

	**Ответ:** `const T*` разрешает читать объект, но не менять его через pointer.
	**Пример:** `const int* view = &value;`.
	**Типичная ошибка:** Путать pointee const с pointer const.
	**Источник:** [Cppreference: cv](https://en.cppreference.com/w/cpp/language/cv)

118. Можно ли присвоить адрес константного объекта в обычный `int*`?

	**Ответ:** Нет, это сняло бы ограничение на изменение const-объекта.
	**Пример:** `const int value{}; int* p = &value;` не компилируется.
	**Типичная ошибка:** Обходить диагностику через `const_cast` без контракта.
	**Источник:** [Cppreference: qualification conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

119. Почему это запрещено?

	**Ответ:** Через `int*` можно было бы записать в объект, объявленный `const`, что нарушает правила языка.
	**Пример:** `const int value{};` должен оставаться неизменяемым.
	**Типичная ошибка:** Считать const только подсказкой компилятору.
	**Источник:** [Cppreference: cv](https://en.cppreference.com/w/cpp/language/cv)

120. Можно ли присвоить адрес обычного объекта в `const int*`?

	**Ответ:** Да, это добавляет ограничение доступа без изменения самого объекта.
	**Пример:** `int value{}; const int* view = &value;`.
	**Типичная ошибка:** Считать исходный `value` после этого неизменяемым через все пути.
	**Источник:** [Cppreference: qualification conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

121. Что такое ссылка на `const`?

	**Ответ:** `const T&` — read-only alias, не требующий копии.
	**Пример:** `void print(const Item& item);`.
	**Типичная ошибка:** Сохранить ссылку дольше объекта.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

122. Почему `const T&` часто используется в параметрах функций?

	**Ответ:** Она позволяет читать большой объект без копирования и принимает lvalue и temporary.
	**Пример:** `void log(const std::string& text);`.
	**Типичная ошибка:** Использовать её для дешёвых скалярных типов без нужды.
	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#fcall-parameter-passing)

123. Можно ли привязать `const T&` к временному объекту?

	**Ответ:** Да, lifetime временного продлевается на срок жизни локальной const-reference в соответствующем контексте.
	**Пример:** `const std::string& text = std::string{"x"};`.
	**Типичная ошибка:** Возвращать эту ссылку из функции.
	**Источник:** [Cppreference: reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

124. Почему обычную неконстантную ссылку нельзя привязать к временному объекту?

	**Ответ:** Это предотвращает изменение временного значения через интерфейс, который обычно ожидает долгоживущий объект.
	**Пример:** `int& ref = 1;` некорректен.
	**Типичная ошибка:** Снимать ограничение через cast.
	**Источник:** [Cppreference: reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

125. Что такое lvalue?

	**Ответ:** Lvalue — выражение, идентифицирующее объект или функцию и обычно допускающее получение адреса.
	**Пример:** Именованная переменная `value` — lvalue.
	**Типичная ошибка:** Считать все expressions с именем rvalue.
	**Источник:** [Cppreference: value categories](https://en.cppreference.com/w/cpp/language/value_category)

126. Что такое rvalue?

	**Ответ:** В учебном смысле rvalue — временное значение, не являющееся устойчивым lvalue; современная модель делит его на prvalue и xvalue.
	**Пример:** `make_string()` возвращает prvalue.
	**Типичная ошибка:** Считать именованную rvalue-reference переменную rvalue: её имя — lvalue.
	**Источник:** [Cppreference: value categories](https://en.cppreference.com/w/cpp/language/value_category)

127. Что такое lvalue-ссылка?

	**Ответ:** `T&` — reference, обычно связывающаяся с изменяемым lvalue.
	**Пример:** `int& ref = value;`.
	**Типичная ошибка:** Ожидать привязки к temporary.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

128. Что такое rvalue-ссылка?

	**Ответ:** `T&&` — reference, предназначенная для rvalue и перемещения ресурсов.
	**Пример:** `std::string&& text = make_text();`.
	**Типичная ошибка:** Использовать перемещённый объект без допустимого контракта.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

129. Как объявить rvalue-ссылку?

	**Ответ:** Указать `T&&` и инициализировать rvalue или вызвать `std::move` осознанно.
	**Пример:** `Item&& item = make_item();`.
	**Типичная ошибка:** Применять `std::move` к объекту, который ещё нужен.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

130. Для чего появились rvalue-ссылки в C++?

	**Ответ:** Они позволяют перемещать ресурсы временных объектов вместо дорогого копирования.

	**Пример:** Move-конструктор строки переносит buffer.
	**Типичная ошибка:** Реализовать move и оставить класс в недействительном состоянии.
	**Источник:** [Cppreference: move constructor](https://en.cppreference.com/w/cpp/language/move_constructor)

131. Что такое перемещение ресурсов?

	**Ответ:** Перемещение передаёт внутренний ресурс из одного объекта в другой, оставляя источник valid but unspecified.

	**Пример:** `std::vector<int> target = std::move(source);`.
	**Типичная ошибка:** Читать старое содержимое source после move.
	**Источник:** [Cppreference: move constructor](https://en.cppreference.com/w/cpp/language/move_constructor)

132. Чем перемещение отличается от копирования?

	**Ответ:** Копирование создаёт независимый ресурс, а перемещение обычно забирает ресурс и оставляет источник в допустимом состоянии.

	**Пример:** Move большого vector обычно дешевле копии.
	**Типичная ошибка:** Предполагать, что move всегда дешевле любого copy.
	**Источник:** [Cppreference: move constructor](https://en.cppreference.com/w/cpp/language/move_constructor)

133. Почему rvalue-ссылки важны для move semantics?

	**Ответ:** Они позволяют отличить временный объект, чьи ресурсы можно безопасно перенести.

	**Пример:** `Widget(Widget&& other) noexcept;`.
	**Типичная ошибка:** Забыть `noexcept` там, где контейнеру нужна безопасная перемещаемость.
	**Источник:** [Cppreference: move constructor](https://en.cppreference.com/w/cpp/language/move_constructor)

134. Что делает `std::move`?

	**Ответ:** Он без runtime-действия преобразует выражение в xvalue, разрешая выбор move-перегрузки.
	**Пример:** `target = std::move(source);`.
	**Типичная ошибка:** Думать, что `std::move` сам перемещает данные.
	**Источник:** [Cppreference: move](https://en.cppreference.com/w/cpp/utility/move)

135. Превращает ли `std::move` объект реально в “перемещённый” сам по себе?

	**Ответ:** Нет, это только cast; перемещение выполняет выбранный move-конструктор или оператор.
	**Пример:** `std::move(value);` без использования результата ничего полезного не делает.
	**Типичная ошибка:** Ставить `std::move` перед каждым return.
	**Источник:** [Cppreference: move](https://en.cppreference.com/w/cpp/utility/move)

136. Что такое perfect forwarding?

	**Ответ:** Это передача аргумента дальше с сохранением его cv-квалификаторов и value category.
	**Пример:** `std::forward<T>(value)` в forwarding wrapper.
	**Типичная ошибка:** Использовать `std::move` вместо `std::forward`.
	**Источник:** [Cppreference: forward](https://en.cppreference.com/w/cpp/utility/forward)

137. Какую роль в perfect forwarding играют ссылки?

	**Ответ:** Forwarding reference принимает lvalue/rvalue, а reference collapsing сохраняет форму аргумента.
	**Пример:** `template<class T> void call(T&& value);`.
	**Типичная ошибка:** Потерять lvalue-семантику при передаче дальше.
	**Источник:** [Cppreference: forwarding reference](https://en.cppreference.com/w/cpp/language/reference)

138. Что такое forwarding reference?

	**Ответ:** Это выводимая форма `T&&`, которая может связаться и с lvalue, и с rvalue.
	**Пример:** `template<class T> void f(T&&);`.
	**Типичная ошибка:** Называть `std::string&&` forwarding reference.
	**Источник:** [Cppreference: forwarding reference](https://en.cppreference.com/w/cpp/language/reference)

139. Чем `T&&` в шаблоне отличается от обычной rvalue-ссылки?

	**Ответ:** При deduction `T&&` становится forwarding reference, а конкретный `Widget&&` принимает только rvalue.
	**Пример:** `f(name)` работает для шаблона, но не для `void f(Widget&&)`.
	**Типичная ошибка:** Не учитывать наличие вывода `T`.
	**Источник:** [Cppreference: template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction)

140. Что такое collapsing references?

	**Ответ:** Это правила упрощения ссылок на ссылки, возникающих при подстановке шаблонных типов.
	**Пример:** `T& &&` превращается в `T&`.
	**Типичная ошибка:** Ожидать двухуровневую ссылку.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

141. Какие правила схлопывания ссылок существуют?

	**Ответ:** Любая комбинация с `&` даёт `&`; только `&& &&` остаётся `&&`.
	**Пример:** `T&& &` — `T&`.
	**Типичная ошибка:** Считать `&&` всегда rvalue-reference после подстановки.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

142. Почему ссылки на ссылки в шаблонном коде всё же возникают концептуально?

	**Ответ:** Подстановка `T`, уже являющегося reference, в `T&&` формирует такую промежуточную комбинацию перед collapsing.
	**Пример:** Для lvalue `T` выводится как `U&`, затем `U& &&` становится `U&`.
	**Типичная ошибка:** Рассматривать это как реальный объект reference-to-reference.
	**Источник:** [Cppreference: template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction)

143. Что такое `auto&`?

	**Ответ:** Это выводимая lvalue-ссылка, сохраняющая связь с исходным объектом.
	**Пример:** `auto& item = values[0];`.
	**Типичная ошибка:** Применить к temporary, который не может быть lvalue-связан.
	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

144. Что такое `const auto&`?

	**Ответ:** Это read-only ссылка с выведенным типом, принимающая lvalue и temporary.
	**Пример:** `for (const auto& item : values) {}`.
	**Типичная ошибка:** Пытаться изменить item в цикле.
	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

145. Что такое `auto&&`?

	**Ответ:** При выводе это forwarding reference, сохраняющий категорию и cv аргумента.
	**Пример:** `auto&& value = get_value();`.
	**Типичная ошибка:** Путать с всегдашней rvalue-ссылкой.
	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

146. Как `auto` ведёт себя со ссылками?

	**Ответ:** `auto` по значению снимает ссылочность, а формы `auto&`, `const auto&` и `auto&&` задают нужную семантику явно.

	**Пример:** `auto copy = ref; auto& alias = ref;`.
	**Типичная ошибка:** Изменить copy вместо исходного объекта.
	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

147. Почему `auto x = ref;` и `auto& x = ref;` дают разный результат?

	**Ответ:** Первый вариант создаёт значение-копию, второй сохраняет ссылку на исходный объект.

	**Пример:** `x = 1` меняет исходный только во втором случае.
	**Типичная ошибка:** Не заметить копирование большого объекта.
	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

148. Что такое `decltype` в контексте ссылок?

	**Ответ:** `decltype` сохраняет ссылочность и cv по специальным правилам выражения.

	**Пример:** `decltype((value))` обычно даёт `T&` для lvalue.
	**Типичная ошибка:** Ожидать правила `auto`.
	**Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

149. Чем `decltype(x)` отличается от `decltype((x))`?

	**Ответ:** Для неквалифицированного имени первое даёт объявленный тип, а второе учитывает value category и обычно даёт ссылку.

	**Пример:** `int x{}; decltype(x)` — `int`, `decltype((x))` — `int&`.
	**Типичная ошибка:** Добавить скобки и изменить API возврата.
	**Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

150. Почему скобки в `decltype` влияют на результат?

	**Ответ:** Скобки превращают специальный случай имени в общее выражение lvalue.

	**Пример:** `decltype((ref))` сохраняет reference-категорию.
	**Типичная ошибка:** Считать скобки косметикой в type deduction.
	**Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

## Сложный уровень

151. Что такое динамическая память в C++?

	**Ответ:** Память, выделяемая во время выполнения с lifetime, управляемым программой или владельцем.
	**Пример:** `auto value = std::make_unique<int>(42);`.
	**Типичная ошибка:** Использовать manual allocation без необходимости.
	**Источник:** [Cppreference: dynamic storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

152. Для чего используется оператор `new`?

	**Ответ:** Он выделяет storage и создаёт объект, возвращая pointer на него.
	**Пример:** `int* value = new int(42);`.
	**Типичная ошибка:** Забыть парный `delete`.
	**Источник:** [Cppreference: new expression](https://en.cppreference.com/w/cpp/language/new)

153. Для чего используется оператор `delete`?

	**Ответ:** Он уничтожает объект, созданный соответствующим `new`, и освобождает storage.
	**Пример:** `delete value;`.
	**Типичная ошибка:** Удалить stack object или уже удалённый адрес.
	**Источник:** [Cppreference: delete expression](https://en.cppreference.com/w/cpp/language/delete)

154. Чем `new` отличается от выделения памяти в стеке?

	**Ответ:** `new` создаёт объект с dynamic lifetime, а локальный объект обычно имеет automatic storage и уничтожается при выходе из блока.
	**Пример:** `int local{}; auto heap = new int{};`.
	**Типичная ошибка:** Называть любой объект на C++ stack в терминах реализации ABI.
	**Источник:** [Cppreference: storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

155. Что делает `delete` помимо освобождения памяти?

	**Ответ:** Сначала вызывает деструктор объекта, затем освобождает storage.
	**Пример:** `delete resource;` запускает cleanup класса.
	**Типичная ошибка:** Использовать delete через base pointer без virtual destructor.
	**Источник:** [Cppreference: delete expression](https://en.cppreference.com/w/cpp/language/delete)

156. Чем `new[]` отличается от `new`?

	**Ответ:** `new[]` создаёт массив объектов и сохраняет информацию, нужную для уничтожения элементов.
	**Пример:** `auto values = new int[3]{};`.
	**Типичная ошибка:** Освобождать такой массив обычным `delete`.
	**Источник:** [Cppreference: new expression](https://en.cppreference.com/w/cpp/language/new)

157. Чем `delete[]` отличается от `delete`?

	**Ответ:** `delete[]` уничтожает массив, а `delete` — один объект; пары должны соответствовать форме allocation.
	**Пример:** `delete[] values;`.
	**Типичная ошибка:** Смешать формы освобождения.
	**Источник:** [Cppreference: delete expression](https://en.cppreference.com/w/cpp/language/delete)

158. Что будет, если удалить массив через `delete` вместо `delete[]`?

	**Ответ:** Это неопределённое поведение.
	**Пример:** `new int[3]` требует `delete[]`.
	**Типичная ошибка:** Считать отсутствие немедленного crash признаком корректности.
	**Источник:** [Cppreference: delete expression](https://en.cppreference.com/w/cpp/language/delete)

159. Что такое утечка памяти?

	**Ответ:** Утечка — выделенный ресурс, который больше недостижим и потому не освобождён.
	**Пример:** `new int(1);` без сохранённого владельца.
	**Типичная ошибка:** Терять единственный owning pointer.
	**Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-resource-management)

160. Как утечка памяти связана с указателями?

	**Ответ:** Утечка часто возникает, когда последний owning pointer перезаписан или уничтожен без освобождения ресурса.
	**Пример:** `pointer = new int; pointer = new int;`.
	**Типичная ошибка:** Использовать raw pointer как владельца без RAII.
	**Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-resource-management)

161. Что такое owning pointer?

	**Ответ:** Это pointer, ответственный за lifetime ресурса и его освобождение.
	**Пример:** `std::unique_ptr<File> file;`.
	**Типичная ошибка:** Передавать ownership без ясного контракта.
	**Источник:** [C++ Core Guidelines: ownership](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r3-a-raw-pointer-is-non-owning)

162. Что такое non-owning pointer?

	**Ответ:** Это pointer-наблюдатель, который не освобождает объект и требует внешней гарантии lifetime.
	**Пример:** `Item* view = owner.get();`.
	**Типичная ошибка:** Хранить view после уничтожения owner.
	**Источник:** [C++ Core Guidelines: ownership](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r3-a-raw-pointer-is-non-owning)

163. Почему обычный сырой указатель (`raw pointer`) не выражает владение однозначно?

	**Ответ:** Raw pointer технически одинаков для owning и non-owning сценариев; ownership задаётся договором API.
	**Пример:** `int*` может указывать на stack, vector или heap.
	**Типичная ошибка:** Безусловно вызывать `delete` для любого pointer.
	**Источник:** [C++ Core Guidelines: R.3](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r3-a-raw-pointer-is-non-owning)

164. Что такое smart pointer?

	**Ответ:** Это класс, управляющий lifetime через RAII и выражающий ownership policy.
	**Пример:** `std::unique_ptr<T>` и `std::shared_ptr<T>`.
	**Типичная ошибка:** Выбирать shared ownership по умолчанию.
	**Источник:** [Cppreference: memory](https://en.cppreference.com/w/cpp/memory)

165. Зачем в современном C++ используют умные указатели?

	**Ответ:** Они уменьшают утечки, double delete и исключения из-за ручного управления ресурсами.
	**Пример:** `auto object = std::make_unique<Object>();`.
	**Типичная ошибка:** Считать smart pointer заменой пониманию lifetime.
	**Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-resource-management)

166. Что такое `std::unique_ptr`?

	**Ответ:** `unique_ptr` — единственный владелец объекта с автоматическим уничтожением.
	**Пример:** `auto item = std::make_unique<Item>();`.
	**Типичная ошибка:** Передать raw pointer и потерять ownership.
	**Источник:** [Cppreference: unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

167. В чём основная идея `std::unique_ptr`?

	**Ответ:** Ownership существует в одном месте и передаётся только явно через move.
	**Пример:** `auto target = std::move(source);`.
	**Типичная ошибка:** Хранить тот же ресурс в нескольких owning raw pointers.
	**Источник:** [Cppreference: unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

168. Можно ли копировать `std::unique_ptr`?

	**Ответ:** Нет, копирование запрещено; его можно перемещать.
	**Пример:** `auto second = std::move(first);`.
	**Типичная ошибка:** Пытаться передать unique_ptr по значению без move.
	**Источник:** [Cppreference: unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

169. Почему `std::unique_ptr` можно перемещать, но нельзя копировать?

	**Ответ:** Копия создала бы двух владельцев и риск double delete; move передаёт единственное владение.
	**Пример:** После move source пуст или содержит null.
	**Типичная ошибка:** Использовать source как будто он сохранил ресурс.
	**Источник:** [Cppreference: unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

170. Что такое `std::make_unique`?

	**Ответ:** Это фабрика, создающая объект и возвращающая `unique_ptr` на него.
	**Пример:** `auto item = std::make_unique<Item>(arg);`.
	**Типичная ошибка:** Забыть, что функция доступна начиная с C++14.
	**Источник:** [Cppreference: make_unique](https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique)

171. Почему `std::make_unique` обычно предпочтительнее явного `new`?

	**Ответ:** Она сразу помещает ресурс в RAII-владелец и уменьшает риск утечки при сложном выражении.
	**Пример:** `auto p = std::make_unique<T>(a, b);`.
	**Типичная ошибка:** Создавать raw pointer перед передачей в owner.
	**Источник:** [C++ Core Guidelines: R.23](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r23-prefer-make_unique-to-explicit-use-of-new)

172. Что такое `std::shared_ptr`?

	**Ответ:** Это smart pointer с совместным владением и control block со счётчиком владельцев.

	**Пример:** `auto shared = std::make_shared<Item>();`.
	**Типичная ошибка:** Использовать shared_ptr без реальной необходимости shared ownership.
	**Источник:** [Cppreference: shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

173. Как работает совместное владение в `std::shared_ptr`?

	**Ответ:** Копии shared_ptr разделяют control block; объект живёт, пока существует хотя бы один owning shared_ptr.

	**Пример:** `auto copy = shared;` увеличивает use count.
	**Типичная ошибка:** Создать два shared_ptr из одного raw pointer.
	**Источник:** [Cppreference: shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

174. Что такое счётчик ссылок у `shared_ptr`?

	**Ответ:** Это число shared owners в control block, обычно доступное через `use_count()` для диагностики.

	**Пример:** `shared.use_count()`.
	**Типичная ошибка:** Использовать use_count для логики многопоточной программы.
	**Источник:** [Cppreference: shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

175. Когда объект уничтожается при использовании `shared_ptr`?

	**Ответ:** Когда последний owning shared_ptr сбрасывается или уничтожается.

	**Пример:** `shared.reset();` может вызвать destructor.
	**Типичная ошибка:** Забыть о циклическом владении.
	**Источник:** [Cppreference: shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

176. Что такое `std::weak_ptr`?

	**Ответ:** `weak_ptr` — non-owning ссылка на объект, управляемый shared_ptr.

	**Пример:** `std::weak_ptr<Item> observer = shared;`.
	**Типичная ошибка:** Разыменовать weak_ptr без `lock()`.
	**Источник:** [Cppreference: weak_ptr](https://en.cppreference.com/w/cpp/memory/weak_ptr)

177. Зачем нужен `weak_ptr`, если уже есть `shared_ptr`?

	**Ответ:** Он наблюдает объект без продления lifetime и позволяет проверяемо получить временный shared owner.

	**Пример:** `if (auto locked = observer.lock()) { locked->run(); }`.
	**Типичная ошибка:** Хранить shared_ptr в обратной ссылке и создать цикл.
	**Источник:** [Cppreference: weak_ptr](https://en.cppreference.com/w/cpp/memory/weak_ptr)

178. Что такое циклическая ссылка между `shared_ptr`?

	**Ответ:** Два или больше объектов владеют друг другом через shared_ptr, образуя цикл control blocks.

	**Пример:** `parent` владеет child, а child владеет parent.
	**Типичная ошибка:** Считать, что выход из внешнего scope разрушит цикл.
	**Источник:** [Cppreference: shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

179. Почему циклические ссылки могут приводить к утечке памяти?

	**Ответ:** В цикле всегда остаются владельцы, поэтому счётчик ни одного объекта не достигает нуля.

	**Пример:** Два shared_ptr ссылаются друг на друга.
	**Типичная ошибка:** Использовать shared ownership для parent back-reference.
	**Источник:** [Cppreference: weak_ptr](https://en.cppreference.com/w/cpp/memory/weak_ptr)

180. Как `weak_ptr` помогает разрывать циклы владения?

	**Ответ:** Обратная связь хранится как non-owning weak_ptr и не увеличивает счётчик owners.

	**Пример:** Child хранит `weak_ptr<Parent>`.
	**Типичная ошибка:** Не проверять результат `lock()`.
	**Источник:** [Cppreference: weak_ptr](https://en.cppreference.com/w/cpp/memory/weak_ptr)

181. Чем умный указатель отличается от ссылки?

	**Ответ:** Smart pointer — объект ownership/nullable-семантики, reference — alias без самостоятельного владения.

	**Пример:** `unique_ptr<T>` может быть empty, `T&` — нет.
	**Типичная ошибка:** Возвращать smart pointer вместо ссылки без необходимости ownership.
	**Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-resource-management)

182. Когда ссылка лучше умного указателя?

	**Ответ:** Когда функция требует существующий объект и не меняет его lifetime.

	**Пример:** `void render(const Widget& widget);`.
	**Типичная ошибка:** Передавать `shared_ptr` только ради nullable-проверки.
	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#fcall-parameter-passing)

183. Когда умный указатель лучше ссылки?

	**Ответ:** Когда API передаёт, хранит или меняет ownership/lifetime объекта.

	**Пример:** `std::unique_ptr<Worker> create_worker();`.
	**Типичная ошибка:** Использовать shared_ptr, когда достаточно unique_ptr.
	**Источник:** [C++ Core Guidelines: R.20](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r20-use-unique_ptr-or-shared_ptr-to-represent-ownership)

184. Что такое ссылка на указатель?

	**Ответ:** `T*&` — reference к самому pointer, позволяющая изменить адрес в вызывающем коде.

	**Пример:** `void reset(Item*& pointer);`.
	**Типичная ошибка:** Перепутать её с указателем на pointer `T**`.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

185. Как объявить `int*&`?

	**Ответ:** Запись `int*& ref` означает ссылку на pointer к `int`.

	**Пример:** `void clear(int*& p) { p = nullptr; }`.
	**Типичная ошибка:** Читать это как `int*` с дополнительным разыменованием.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

186. В каких случаях функция принимает указатель по ссылке?

	**Ответ:** Когда ей нужно переназначить pointer caller-а, например передать новый ресурс или обнулить его.

	**Пример:** `void release(Resource*& resource);`.
	**Типичная ошибка:** Использовать такой API вместо smart pointer.
	**Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-resource-management)

187. Чем `int*&` отличается от `int**`?

	**Ответ:** `int*&` — alias одного pointer, `int**` — обычный pointer, хранящий адрес pointer.

	**Пример:** `int**` можно сделать null независимо от pointee.
	**Типичная ошибка:** Передать `int*` туда, где ожидается `int**` без адреса pointer.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

188. Когда удобнее использовать `T*&`, а когда `T**`?

	**Ответ:** `T*&` выражает обязательный pointer-объект в C++ API, `T**` удобен для C API и nullable уровней.

	**Пример:** `int*&` проще читать в типичном C++ коде.
	**Типичная ошибка:** Выбрать T** и потерять ясность ownership.
	**Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f24-use-a-ptr-to-represent-a-position)

189. Что такое `const` по отношению к умным указателям?

	**Ответ:** `const` может относиться к handle smart pointer или к объекту через параметр типа.

	**Пример:** `const std::unique_ptr<T>` нельзя переназначить, но T может быть изменяемым.
	**Типичная ошибка:** Путать const handle с const pointee.
	**Источник:** [Cppreference: unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

190. Чем `const unique_ptr<T>` отличается от `unique_ptr<const T>`?

	**Ответ:** Первый делает сам owner неизменяемым, второй запрещает менять объект через owner.

	**Пример:** `std::unique_ptr<const T> view`.
	**Типичная ошибка:** Считать эти записи взаимозаменяемыми.
	**Источник:** [Cppreference: unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr)

191. Что такое aliasing constructor у `shared_ptr`?

	**Ответ:** Он создаёт shared_ptr, который владеет одним объектом, но хранит pointer на другой связанный subobject.

	**Пример:** `std::shared_ptr<Member> view(owner, &owner->member);`.
	**Типичная ошибка:** Применить constructor без гарантии lifetime владельца.
	**Источник:** [Cppreference: shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

192. Почему владение и адрес, который возвращает умный указатель, могут логически различаться?

	**Ответ:** Shared control block может удерживать owner, пока `get()` указывает на его subobject или alias.

	**Пример:** Alias shared_ptr keeps parent alive through child address.
	**Типичная ошибка:** Освобождать `get()` вручную.
	**Источник:** [Cppreference: shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

193. Что такое double delete?

	**Ответ:** Double delete — повторное освобождение одного и того же ресурса.

	**Пример:** Два owning raw pointers вызывают `delete` для одного адреса.
	**Типичная ошибка:** Создать независимые shared_ptr из одного raw pointer.
	**Источник:** [Cppreference: delete](https://en.cppreference.com/w/cpp/language/delete)

194. Как возникает ошибка двойного удаления?

	**Ответ:** Когда ownership не уникален или pointer повторно удаляют после передачи/освобождения ресурса.

	**Пример:** `delete p; delete p;`.
	**Типичная ошибка:** Считать `p = nullptr` исправлением всех alias.
	**Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-resource-management)

195. Почему смешивание raw pointers и manual `delete` с `shared_ptr` опасно?

	**Ответ:** Shared_ptr уже владеет ресурсом; ручной delete создаёт double delete и dangling control block.

	**Пример:** `auto owner = std::make_shared<T>(); delete owner.get();` — ошибка.
	**Типичная ошибка:** Удалять результат `get()`.
	**Источник:** [Cppreference: shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr)

196. Что такое dangling observer pointer?

	**Ответ:** Это non-owning pointer, оставшийся после уничтожения наблюдаемого объекта.

	**Пример:** `T* view = owner.get(); owner.reset();`.
	**Типичная ошибка:** Проверять только ненулевое значение view.
	**Источник:** [C++ Core Guidelines: raw pointers](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r3-a-raw-pointer-is-non-owning)

197. Почему non-owning указатели требуют особой дисциплины во времени жизни объекта?

	**Ответ:** Они не продлевают lifetime и не сообщают автоматически, что объект уничтожен.

	**Пример:** Observer должен быть удалён или обновлён при уничтожении owner.
	**Типичная ошибка:** Хранить raw pointer в долгоживущем кеше.
	**Источник:** [C++ Core Guidelines: ownership](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r3-a-raw-pointer-is-non-owning)

198. Какие проблемы создаёт возврат сырого указателя из функции?

	**Ответ:** Неясны ownership, nullable-семантика и время жизни возвращаемого объекта.

	**Пример:** Лучше вернуть `unique_ptr` для передачи ownership.
	**Типичная ошибка:** Caller бездумно вызывает delete.
	**Источник:** [C++ Core Guidelines: R.30](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r30-take-smart-pointers-as-parameters-only-if-you-need-to-express-lifetime-semantics)

199. Когда возврат ссылки из функции безопасен?

	**Ответ:** Когда объект гарантированно живёт дольше ссылки и функция ясно выражает отсутствие ownership.

	**Пример:** Возврат ссылки на поле живущего объекта.
	**Типичная ошибка:** Вернуть ссылку на локальный объект.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

200. Когда возврат указателя из функции безопасен?

	**Ответ:** Когда lifetime и nullable/ownership-контракт явно определены и объект переживает использование.

	**Пример:** Pointer на элемент внешнего контейнера при известной стабильности.
	**Типичная ошибка:** Вернуть адрес local или temporary.
	**Источник:** [Cppreference: object lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

201. Почему нельзя хранить ссылку на объект, время жизни которого уже закончилось?

	**Ответ:** Ссылка становится dangling, и любое использование даёт неопределённое поведение.

	**Пример:** `const T& ref = make_t();` нельзя возвращать наружу.
	**Типичная ошибка:** Считать ссылку безопаснее pointer независимо от lifetime.
	**Источник:** [Cppreference: lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

202. Как временные объекты взаимодействуют с `const`-ссылками?

	**Ответ:** `const T&` может связаться с временным объектом и в некоторых контекстах продлить его lifetime.

	**Пример:** `const std::string& ref = std::string{"text"};`.
	**Типичная ошибка:** Возвращать ref из функции.
	**Источник:** [Cppreference: reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

203. Что такое продление времени жизни временного объекта через `const`-ссылку?

	**Ответ:** Временный объект может жить до конца lifetime локальной reference, к которой он непосредственно привязан.

	**Пример:** Локальная `const auto& ref = make();`.
	**Типичная ошибка:** Распространять это правило на любой pointer или возвращаемую reference.
	**Источник:** [Cppreference: reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

204. Всегда ли время жизни временного объекта продлевается при привязке к ссылке?

	**Ответ:** Нет, есть исключения для return, параметров функций, `new`-инициализаторов и некоторых вложенных выражений.

	**Пример:** Reference-параметр живёт только до конца полного выражения вызова.
	**Типичная ошибка:** Хранить reference на temporary после вызова.
	**Источник:** [Cppreference: reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

205. Как связаны ссылки и перегрузка функций?

	**Ответ:** Перегрузки `T&`, `const T&` и `T&&` выбираются по value category и cv аргумента.

	**Пример:** lvalue выбирает `T&`, temporary — `T&&`.
	**Типичная ошибка:** Создать неоднозначные или слишком похожие overloads.
	**Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

206. Как перегружают функции по `T&`, `const T&` и `T&&`?

	**Ответ:** Объявляют отдельные signatures, выражающие изменение, чтение или потребление объекта.

	**Пример:** `f(T&)`, `f(const T&)`, `f(T&&)`.
	**Типичная ошибка:** Добавлять все три overloads без различающей семантики.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

207. Почему выбор между `const T&` и `T&&` влияет на эффективность?

	**Ответ:** `const T&` читает без копии, а `T&&` может забрать ресурс временного или явно переданного объекта.

	**Пример:** Конструктор `Widget(std::string value)` часто принимает значение и move-ит его.
	**Типичная ошибка:** Безусловно копировать или безусловно перемещать вход.
	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#fcall-parameter-passing)

208. Как указатели участвуют в полиморфизме?

	**Ответ:** Base pointer может ссылаться на Derived object, а virtual dispatch выбирает реализацию по dynamic type.

	**Пример:** `Base* object = new Derived; object->run();`.
	**Типичная ошибка:** Отсутствие virtual destructor при удалении через base pointer.
	**Источник:** [Cppreference: virtual function](https://en.cppreference.com/w/cpp/language/virtual)

209. Почему базовый указатель может указывать на объект производного класса?

	**Ответ:** Derived object содержит базовую часть, и указатель можно безопасно upcast-ить к доступному base.

	**Пример:** `Derived derived; Base* base = &derived;`.
	**Типичная ошибка:** Ожидать доступ к Derived-членам через Base pointer.
	**Источник:** [Cppreference: implicit conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

210. Почему ссылки также используются для полиморфизма?

	**Ответ:** Base reference может обозначать Derived object и вызывать virtual functions без nullable-состояния.

	**Пример:** `void run(const Base& object);`.
	**Типичная ошибка:** Выполнить downcast без проверки динамического типа.
	**Источник:** [Cppreference: virtual](https://en.cppreference.com/w/cpp/language/virtual)

211. Что такое upcasting для указателей и ссылок?

	**Ответ:** Это преобразование Derived pointer/reference к Base, обычно неявное и безопасное.

	**Пример:** `Base& base = derived;`.
	**Типичная ошибка:** Скрыть важную ownership-семантику при upcast raw pointer.
	**Источник:** [Cppreference: implicit conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

212. Что такое downcasting?

	**Ответ:** Это попытка получить Derived pointer/reference из Base; она безопасна только при подтверждённом dynamic type.

	**Пример:** `dynamic_cast<Derived*>(base)`.
	**Типичная ошибка:** Использовать `static_cast` без гарантии типа.
	**Источник:** [Cppreference: dynamic_cast](https://en.cppreference.com/w/cpp/language/dynamic_cast)

213. Когда `dynamic_cast` применяют к указателям?

	**Ответ:** Когда нужно проверить downcast в runtime и обработать отсутствие совпадения через null.

	**Пример:** `if (auto* derived = dynamic_cast<Derived*>(base)) {}`.
	**Типичная ошибка:** Игнорировать null-result.
	**Источник:** [Cppreference: dynamic_cast](https://en.cppreference.com/w/cpp/language/dynamic_cast)

214. Когда `dynamic_cast` применяют к ссылкам?

	**Ответ:** Когда объект обязан существовать, но dynamic type нужно проверить; при ошибке бросается `std::bad_cast`.

	**Пример:** `auto& derived = dynamic_cast<Derived&>(base);`.
	**Типичная ошибка:** Не обработать исключение при неизвестном типе.
	**Источник:** [Cppreference: dynamic_cast](https://en.cppreference.com/w/cpp/language/dynamic_cast)

215. Чем поведение `dynamic_cast` для указателей отличается от ссылок при ошибке приведения?

	**Ответ:** Pointer cast возвращает `nullptr`, reference cast бросает `std::bad_cast`.

	**Пример:** Выбор формы зависит от того, является ли отсутствие Derived допустимым.
	**Типичная ошибка:** Проверять reference на null.
	**Источник:** [Cppreference: dynamic_cast](https://en.cppreference.com/w/cpp/language/dynamic_cast)

216. Что такое `nullptr_t`?

	**Ответ:** `std::nullptr_t` — тип null pointer literal `nullptr`.

	**Пример:** `std::nullptr_t value = nullptr;`.
	**Типичная ошибка:** Путать его с `void*`.
	**Источник:** [Cppreference: nullptr_t](https://en.cppreference.com/w/cpp/types/nullptr_t)

217. Какой тип имеет литерал `nullptr`?

	**Ответ:** Тип `std::nullptr_t`.

	**Пример:** `static_assert(std::is_same_v<decltype(nullptr), std::nullptr_t>);`.
	**Типичная ошибка:** Считать его integer zero.
	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

218. Почему `nullptr` устраняет неоднозначности перегрузки лучше, чем `0`?

	**Ответ:** `nullptr` преобразуется в pointer-типы, но не является целым аргументом.

	**Пример:** `f(int)` и `f(int*)`: `f(nullptr)` выбирает pointer overload.
	**Типичная ошибка:** Сохранять старые `NULL`-вызовы в перегруженном API.
	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

219. Что такое strict aliasing и как он связан с указателями?

	**Ответ:** Это ограничения на доступ к объекту через pointer несовместимого типа.

	**Пример:** Не читать `double` через `int*`.
	**Типичная ошибка:** Использовать reinterpret pointer для type punning.
	**Источник:** [Cppreference: object](https://en.cppreference.com/w/cpp/language/object)

220. Почему неверное приведение указателей может ломать оптимизации компилятора?

	**Ответ:** Нарушение aliasing позволяет компилятору предположить, что два pointer не обращаются к одному объекту.

	**Пример:** Значение может быть закэшировано вопреки записи через несовместимый pointer.
	**Типичная ошибка:** Объяснять UB поведением одного debug-запуска.
	**Источник:** [Cppreference: object](https://en.cppreference.com/w/cpp/language/object)

221. Что такое `reinterpret_cast` и почему он опасен?

	**Ответ:** Он меняет интерпретацию pointer или integer без проверки lifetime, alignment и aliasing.

	**Пример:** `auto bytes = reinterpret_cast<const std::byte*>(&value);` требует осторожного применения.
	**Типичная ошибка:** Считать cast созданием объекта другого типа.
	**Источник:** [Cppreference: reinterpret_cast](https://en.cppreference.com/w/cpp/language/reinterpret_cast)

222. Чем `static_cast` для указателей отличается от `reinterpret_cast`?

	**Ответ:** `static_cast` выполняет разрешённые compile-time преобразования в иерархии или между void/object pointers, а reinterpret меняет представление.
	**Пример:** Для проверяемого downcast используют dynamic_cast.
	**Типичная ошибка:** Заменить dynamic_cast на static_cast без инварианта.
	**Источник:** [Cppreference: static_cast](https://en.cppreference.com/w/cpp/language/static_cast)

223. Что такое `const_cast` и когда его применение допустимо?

	**Ответ:** Он меняет cv-квалификацию; допустим, когда исходный объект не был изначально const и API ошибочно требует non-const pointer.
	**Пример:** Обёртка над legacy API при доказанно mutable объекте.
	**Типичная ошибка:** Снимать const с истинно константного объекта.
	**Источник:** [Cppreference: const_cast](https://en.cppreference.com/w/cpp/language/const_cast)

224. Почему снятие `const` через `const_cast` может быть неопределённым поведением?

	**Ответ:** Запись в объект, объявленный const, запрещена даже если pointer технически стал non-const.

	**Пример:** `const int value{}; const_cast<int&>(value) = 1;`.
	**Типичная ошибка:** Считать изменение типа изменением объекта.
	**Источник:** [Cppreference: const_cast](https://en.cppreference.com/w/cpp/language/const_cast)

225. Что такое указатель на член класса?

	**Ответ:** Это специальный тип, обозначающий поле или метод класса без привязки к конкретному объекту.

	**Пример:** `int Widget::* member;`.
	**Типичная ошибка:** Использовать его как обычный address pointer.
	**Источник:** [Cppreference: pointer to member](https://en.cppreference.com/w/cpp/language/pointer)

226. Чем указатель на член класса отличается от обычного указателя?

	**Ответ:** Он требует объект класса для доступа и может иметь специальное представление, особенно при inheritance.

	**Пример:** `(widget.*member)`.
	**Типичная ошибка:** Разыменовать member pointer без объекта.
	**Источник:** [Cppreference: pointer to member](https://en.cppreference.com/w/cpp/language/pointer)

227. Как объявить указатель на поле класса?

	**Ответ:** Используйте `T Class::*`.

	**Пример:** `int Widget::* member = &Widget::size;`.
	**Типичная ошибка:** Написать `int*` вместо pointer-to-member.
	**Источник:** [Cppreference: pointer to member](https://en.cppreference.com/w/cpp/language/pointer)

228. Как объявить указатель на метод класса?

	**Ответ:** Нужно указать возвращаемый тип, класс, `::*`, имя и список параметров.

	**Пример:** `void (Widget::*method)() = &Widget::run;`.
	**Типичная ошибка:** Забыть скобки вокруг `*method`.
	**Источник:** [Cppreference: pointer to member](https://en.cppreference.com/w/cpp/language/pointer)

229. Какие операторы используют для доступа через указатель на член?

	**Ответ:** `.*` применяют к объекту, а `->*` — к pointer на объект.

	**Пример:** `(widget.*member)` и `(pointer->*member)`.
	**Типичная ошибка:** Использовать обычный `.` или `->` перед member pointer.
	**Источник:** [Cppreference: pointer to member](https://en.cppreference.com/w/cpp/language/operator_member_access)

230. Почему тема указателей и ссылок считается одной из ключевых в C++?

	**Ответ:** Они связывают типы, lifetime, ownership, полиморфизм и низкоуровневый доступ к памяти.
	**Пример:** RAII и move semantics строятся на корректной модели указателей и ссылок.
	**Типичная ошибка:** Учить синтаксис без анализа lifetime и ownership.
	**Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

[<- Prev](./02_types.md)       [Next ->](./04_memory.md)