# 02_Типы

## Лёгкий уровень

1. Что такое тип данных в C++?

	**Ответ:** Тип описывает множество допустимых значений, операции над ними и требования к хранению объекта.

	**Пример:** `int count{};` задаёт целочисленный тип `count`.

	**Типичная ошибка:** Считать тип только размером в байтах.

	**Источник:** [Cppreference: types](https://en.cppreference.com/w/cpp/language/types)

2. Зачем переменной нужен тип?

	**Ответ:** Тип позволяет компилятору проверять операции, выбирать представление и определять размер объекта.

	**Пример:** Для `int + double` компилятор применяет правила преобразования типов.

	**Типичная ошибка:** Игнорировать потери данных при несовместимых преобразованиях.

	**Источник:** [Cppreference: type system](https://en.cppreference.com/w/cpp/language/type)

3. Какие категории типов существуют в C++?

	**Ответ:** Есть фундаментальные, составные, определяемые пользователем и производные типы; стандарт также выделяет cv-квалифицированные варианты.

	**Пример:** `int` фундаментален, `int*` производен, `struct User` пользовательский.

	**Типичная ошибка:** Смешивать тип объекта и категорию значения выражения.

	**Источник:** [Cppreference: type system](https://en.cppreference.com/w/cpp/language/type)

4. Что такое фундаментальные типы?

	**Ответ:** Это встроенные типы языка: `void`, `std::nullptr_t`, булевы, целые, вещественные и некоторые символьные типы.

	**Пример:** `bool`, `char`, `int` и `double` — фундаментальные типы.

	**Типичная ошибка:** Называть `std::string` фундаментальным типом: это библиотечный класс.

	**Источник:** [Cppreference: fundamental types](https://en.cppreference.com/w/cpp/language/types)

5. Что такое пользовательские типы?

	**Ответ:** Это типы, которые программист определяет через `class`, `struct`, `union`, `enum` и псевдонимы.

	**Пример:** `struct Point { int x; int y; };`.

	**Типичная ошибка:** Использовать пользовательский тип без поддержания его инвариантов.

	**Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

6. Что такое производные типы?

	**Ответ:** Производные типы строятся из других типов: указатели, ссылки, массивы, функции и указатели на члены.

	**Пример:** `int*`, `int&`, `int[4]` и `int()` — производные формы.

	**Типичная ошибка:** Путать указатель на массив с массивом указателей.

	**Источник:** [Cppreference: declarations](https://en.cppreference.com/w/cpp/language/declarations)

7. Что такое тип `int`?

	**Ответ:** `int` — знаковый целый тип, предназначенный для обычных целочисленных вычислений.

	**Пример:** `int temperature{-5};`.

	**Типичная ошибка:** Предполагать одинаковый размер `int` на всех платформах.

	**Источник:** [Cppreference: integer types](https://en.cppreference.com/w/cpp/language/types)

8. Для чего обычно используют `int`?

	**Ответ:** Для счётчиков, индексов небольших контейнеров и целых значений, когда диапазона `int` достаточно.

	**Пример:** `for (int i{}; i < 10; ++i) {}`.

	**Типичная ошибка:** Использовать `int` для размера объекта, который сравнивается с `size_t`.

	**Источник:** [C++ Core Guidelines: integer types](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#es103-dont-overuse-unsigned-types)

9. Чем `short` отличается от `int`?

	**Ответ:** `short` гарантированно не шире `int` и может занимать меньше памяти, но его фактический размер зависит от реализации.

	**Пример:** `short port{80};` допустим, если диапазона достаточно.

	**Типичная ошибка:** Выбирать `short` автоматически ради экономии памяти без измерений.

	**Источник:** [Cppreference: integer types](https://en.cppreference.com/w/cpp/language/types)

10. Чем `long` отличается от `int`?

	**Ответ:** `long` имеет диапазон не меньше `int`, но его размер различается, например между Windows и Unix-платформами.

	**Пример:** Для фиксированного формата лучше использовать `std::int32_t`, а не `long`.

	**Типичная ошибка:** Считать `long` всегда 64-битным.

	**Источник:** [Cppreference: integer types](https://en.cppreference.com/w/cpp/language/types)

11. Чем `long long` отличается от `long`?

	**Ответ:** `long long` гарантированно не уже `long` и имеет минимум 64 бита; точный размер также зависит от реализации.

	**Пример:** `long long total{9'000'000'000LL};`.

	**Типичная ошибка:** Забывать суффикс `LL` у больших целочисленных литералов.

	**Источник:** [Cppreference: integer types](https://en.cppreference.com/w/cpp/language/types)

12. Что такое знаковый целый тип?

	**Ответ:** Знаковый целый тип может представлять отрицательные, нулевые и положительные целые значения.

	**Пример:** `int delta{-10};`.

	**Типичная ошибка:** Полагаться на переполнение знакового типа: оно приводит к неопределённому поведению.

	**Источник:** [Cppreference: integer types](https://en.cppreference.com/w/cpp/language/types)

13. Что такое беззнаковый целый тип?

	**Ответ:** Беззнаковый тип представляет неотрицательные значения и использует весь диапазон битов для величины.

	**Пример:** `unsigned count{10};`.

	**Типичная ошибка:** Использовать unsigned как средство защиты от отрицательных значений, не учитывая правила арифметики.

	**Источник:** [Cppreference: integer types](https://en.cppreference.com/w/cpp/language/types)

14. Чем `signed int` отличается от `unsigned int`?

	**Ответ:** `signed int` поддерживает отрицательные значения, а `unsigned int` — только неотрицательные и обычно имеет больший верхний предел.

	**Пример:** `-1 < 1u` может дать неожиданный результат из-за преобразования типов.

	**Типичная ошибка:** Сравнивать signed и unsigned без явного согласования типов.

	**Источник:** [Cppreference: usual arithmetic conversions](https://en.cppreference.com/w/cpp/language/usual_arithmetic_conversions)

15. Что такое тип `char`?

	**Ответ:** `char` — отдельный целый тип размером один байт, пригодный для хранения символов базового набора и небольших целых значений.

	**Пример:** `char separator{','};`.

	**Типичная ошибка:** Предполагать, что `char` всегда знаковый.

	**Источник:** [Cppreference: character types](https://en.cppreference.com/w/cpp/language/types)

16. Для чего обычно используют `char`?

	**Ответ:** Для отдельных символов, байтовых буферов и элементов C-строк.

	**Пример:** `char initial{'A'};`.

	**Типичная ошибка:** Использовать `char` для произвольных Unicode-кодов.

	**Источник:** [Cppreference: character types](https://en.cppreference.com/w/cpp/language/types)

17. Может ли `char` хранить число?

	**Ответ:** Да, `char` является целым типом и может хранить небольшие целые значения, но его диапазон и знаковость зависят от реализации.

	**Пример:** `char byte{65};` обычно соответствует символу `A` в ASCII-совместимых кодировках.

	**Типичная ошибка:** Путать числовой код символа с универсальным Unicode code point.

	**Источник:** [Cppreference: character types](https://en.cppreference.com/w/cpp/language/types)

18. Что такое тип `bool`?

	**Ответ:** `bool` — логический тип для представления истинности условия.

	**Пример:** `bool valid = size > 0;`.

	**Типичная ошибка:** Кодировать несколько независимых состояний одним `bool`.

	**Источник:** [Cppreference: bool type](https://en.cppreference.com/w/cpp/language/types)

19. Какие значения хранит `bool`?

	**Ответ:** `bool` хранит `true` или `false`; при преобразовании к целому они дают `1` и `0`.

	**Пример:** `bool ok{true}; int flag = ok;`.

	**Типичная ошибка:** Ожидать сохранения исходного ненулевого числа после преобразования в `bool`.

	**Источник:** [Cppreference: bool type](https://en.cppreference.com/w/cpp/language/types)

20. Что такое тип `float`?

	**Ответ:** `float` — вещественный тип одинарной точности; его точность и формат зависят от реализации, обычно используется IEEE 754.

	**Пример:** `float ratio{0.5f};`.

	**Типичная ошибка:** Использовать `float` для финансовых расчётов без анализа ошибок округления.

	**Источник:** [Cppreference: floating-point types](https://en.cppreference.com/w/cpp/language/types)

21. Что такое тип `double`?

	**Ответ:** `double` — вещественный тип минимум такой же точности, как `float`, обычно с более широким диапазоном и большей точностью.

	**Пример:** `double distance{3.141592653589793};`.

	**Типичная ошибка:** Сравнивать результаты вычислений `double` на точное равенство.

	**Источник:** [Cppreference: floating-point types](https://en.cppreference.com/w/cpp/language/types)

22. Чем `float` отличается от `double`?

	**Ответ:** `double` обычно занимает больше памяти и даёт большую точность; `float` выбирают при жёстких ограничениях памяти или требованиях API.

	**Пример:** Графический буфер может использовать `float`, а научные вычисления — `double`.

	**Типичная ошибка:** Считать удвоенное имя гарантией ровно двукратной точности.

	**Источник:** [Cppreference: floating-point types](https://en.cppreference.com/w/cpp/language/types)

23. Что такое `long double`?

	**Ответ:** `long double` — вещественный тип с точностью не меньше `double`; фактический формат платформозависим.

	**Пример:** `long double value{1.0L};`.

	**Типичная ошибка:** Ожидать одинаковую точность `long double` на всех компиляторах.

	**Источник:** [Cppreference: floating-point types](https://en.cppreference.com/w/cpp/language/types)

24. Когда используют вещественные типы?

	**Ответ:** Когда нужны дробные значения и допустима конечная точность представления, например в физике, графике и измерениях.

	**Пример:** `double seconds{elapsed_ticks / frequency};`.

	**Типичная ошибка:** Хранить деньги в `float` или `double` без продуманной модели округления.

	**Источник:** [Cppreference: floating-point types](https://en.cppreference.com/w/cpp/language/types)

25. Что показывает оператор `sizeof`?

	**Ответ:** `sizeof` возвращает размер типа или объекта в байтах типа `std::size_t`; выражение обычно не вычисляется.

	**Пример:** `sizeof(int)` и `sizeof value`.

	**Типичная ошибка:** Считать результат `sizeof` количеством битов.

	**Источник:** [Cppreference: sizeof](https://en.cppreference.com/w/cpp/language/sizeof)

26. Почему размер типа может зависеть от платформы?

	**Ответ:** Стандарт задаёт минимальные требования, а ABI, архитектура и компилятор выбирают конкретные размеры и выравнивание.

	**Пример:** `long` имеет разный размер в распространённых Windows и Unix ABI.

	**Типичная ошибка:** Сохранять бинарные данные, полагаясь на размер обычного `int`.

	**Источник:** [Cppreference: fundamental types](https://en.cppreference.com/w/cpp/language/types)

27. Как узнать размер типа в байтах?

	**Ответ:** Используйте оператор `sizeof`, например `sizeof(std::uint32_t)`.

	**Пример:** `static_assert(sizeof(std::uint32_t) == 4);`.

	**Типичная ошибка:** Использовать `sizeof(pointer)` как размер объекта, на который указывает указатель.

	**Источник:** [Cppreference: sizeof](https://en.cppreference.com/w/cpp/language/sizeof)

28. Что такое диапазон значений типа?

	**Ответ:** Это множество значений, которые тип способен представить без потери или неопределённого поведения.

	**Пример:** Границы `int` можно получить через `std::numeric_limits<int>`.

	**Типичная ошибка:** Определять диапазон только по размеру типа и забывать про знак.

	**Источник:** [Cppreference: numeric_limits](https://en.cppreference.com/w/cpp/types/numeric_limits)

29. Почему нельзя хранить любое число в любом типе?

	**Ответ:** У каждого типа ограничены диапазон, точность и способ представления значения.

	**Пример:** `std::uint8_t byte{300};` не может представить `300` без потери.

	**Типичная ошибка:** Игнорировать предупреждения компилятора о сужающих преобразованиях.

	**Источник:** [Cppreference: implicit conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

30. Что такое переполнение типа?

	**Ответ:** Переполнение происходит, когда результат не представим в типе; для знаковых целых это неопределённое поведение, для unsigned действует арифметика по модулю.

	**Пример:** `std::uint8_t x{255}; ++x;` даёт `0`, а signed overflow использовать нельзя.

	**Типичная ошибка:** Считать одинаковыми правила signed и unsigned переполнения.

	**Источник:** [Cppreference: arithmetic operators](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

31. Чем отличается символьный литерал от строкового с точки зрения типа?

	**Ответ:** `'A'` имеет тип `char`, а `"A"` — массив `const char[2]`, включая завершающий нулевой символ.

	**Пример:** `char c{'A'}; const char* text{"A"};`.

	**Типичная ошибка:** Передать строковый литерал в параметр типа `char`.

	**Источник:** [Cppreference: character literal](https://en.cppreference.com/w/cpp/language/character_literal)

32. Какой тип имеет литерал `10`?

	**Ответ:** Обычно это `int`; тип может стать шире, если значение не помещается в `int`.

	**Пример:** `auto value = 10;` выводит `int`.

	**Типичная ошибка:** Считать все целые литералы типом `long`.

	**Источник:** [Cppreference: integer literal](https://en.cppreference.com/w/cpp/language/integer_literal)

33. Какой тип имеет литерал `10.0`?

	**Ответ:** Литерал с десятичной точкой имеет тип `double`, если не указан суффикс `f` или `L`.

	**Пример:** `10.0f` — `float`, `10.0L` — `long double`.

	**Типичная ошибка:** Писать `float`-литерал без суффикса и получать ненужное преобразование.

	**Источник:** [Cppreference: floating-point literal](https://en.cppreference.com/w/cpp/language/floating_literal)

34. Какой тип имеет литерал `true`?

	**Ответ:** Литерал `true` имеет тип `bool`.

	**Пример:** `static_assert(std::is_same_v<decltype(true), bool>);`.

	**Типичная ошибка:** Использовать `1` и `0`, когда API ожидает осмысленное логическое значение.

	**Источник:** [Cppreference: bool literals](https://en.cppreference.com/w/cpp/language/bool_literal)

35. Какой тип имеет литерал `'A'`?

	**Ответ:** Обычный символьный литерал `'A'` имеет тип `char`.

	**Пример:** `static_assert(std::is_same_v<decltype('A'), char>);`.

	**Типичная ошибка:** Путать тип `char` с гарантией определённой кодировки.

	**Источник:** [Cppreference: character literal](https://en.cppreference.com/w/cpp/language/character_literal)

36. Какой тип имеет строковый литерал `"ABC"`?

	**Ответ:** Его тип — `const char[4]`: три символа и завершающий `\0`.

	**Пример:** `sizeof("ABC")` равно `4`.

	**Типичная ошибка:** Забывать завершающий нулевой символ при работе с C API.

	**Источник:** [Cppreference: string literal](https://en.cppreference.com/w/cpp/language/string_literal)

37. Что такое `auto`?

	**Ответ:** `auto` просит компилятор вывести тип переменной из инициализатора.

	**Пример:** `auto count = 10;` выводит `int`.

	**Типичная ошибка:** Ожидать, что `auto` сохранит ссылку и `const` без правил вывода.

	**Источник:** [Cppreference: placeholder type](https://en.cppreference.com/w/cpp/language/auto)

38. Когда `auto` определяет тип автоматически?

	**Ответ:** При наличии инициализатора, возвращаемого выражения или параметра шаблона, где разрешён placeholder type.

	**Пример:** `auto value = make_value();`.

	**Типичная ошибка:** Объявить `auto value;` без информации для вывода.

	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

39. В чём плюс использования `auto`?

	**Ответ:** `auto` уменьшает дублирование, сохраняет точный тип шаблонного выражения и облегчает рефакторинг.

	**Пример:** `for (const auto& item : container) {}`.

	**Типичная ошибка:** Использовать `auto`, когда тип важен для понимания контракта.

	**Источник:** [C++ Core Guidelines: type deduction](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#es11-use-auto-to-avoid-redundant-repetition-of-type-names)

40. Когда `auto` ухудшает читаемость кода?

	**Ответ:** Когда тип неочевиден из инициализатора или несёт важную семантику, например владение или ширину целого.

	**Пример:** `auto result = get();` может скрывать дорогой или nullable тип.

	**Типичная ошибка:** Считать краткость достаточной причиной скрывать публичный тип.

	**Источник:** [C++ Core Guidelines: type deduction](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#es11-use-auto-to-avoid-redundant-repetition-of-type-names)

41. Что такое `const` с точки зрения типа?

	**Ответ:** `const` — cv-квалификатор, запрещающий изменение объекта через конкретное выражение доступа.

	**Пример:** `const int value{5};` нельзя присвоить новое значение.

	**Типичная ошибка:** Путать `const` объекта и `const` самого указателя.

	**Источник:** [Cppreference: cv qualifiers](https://en.cppreference.com/w/cpp/language/cv)

42. Что означает `const int x = 5;`?

	**Ответ:** Объявляется объект типа `const int`, и он инициализируется значением `5`.

	**Пример:** `x = 6;` будет ошибкой компиляции.

	**Типичная ошибка:** Пытаться отложить инициализацию обычного `const`-объекта.

	**Источник:** [Cppreference: const qualifier](https://en.cppreference.com/w/cpp/language/cv)

43. Можно ли изменить объект типа `const int`?

	**Ответ:** Нельзя изменить его через корректный интерфейс языка; попытка снять `const` и записать в изначально константный объект приводит к неопределённому поведению.

	**Пример:** `const_cast<int&>(value) = 6;` допустим синтаксически, но небезопасен для const-объекта.

	**Типичная ошибка:** Считать `const_cast` способом безопасно изменить любую константу.

	**Источник:** [Cppreference: const_cast](https://en.cppreference.com/w/cpp/language/const_cast)

44. Что такое ссылка?

	**Ответ:** Ссылка — альтернативное имя существующего объекта; после инициализации она не переназначается на другой объект.

	**Пример:** `int value{}; int& ref = value;`.

	**Типичная ошибка:** Возвращать ссылку на объект, который уже уничтожен.

	**Источник:** [Cppreference: references](https://en.cppreference.com/w/cpp/language/reference)

45. Чем ссылка отличается от копии?

	**Ответ:** Ссылка обращается к тому же объекту, а копия создаёт отдельный объект со своим временем жизни и значением.

	**Пример:** `int copy = value; int& alias = value;`.

	**Типичная ошибка:** Ожидать независимости от ссылки после изменения исходного объекта.

	**Источник:** [Cppreference: references](https://en.cppreference.com/w/cpp/language/reference)

46. Что такое указатель?

	**Ответ:** Указатель — объект, хранящий адрес другого объекта или функции либо специальное нулевое значение.

	**Пример:** `int value{}; int* pointer = &value;`.

	**Типичная ошибка:** Разыменовывать нулевой или висячий указатель.

	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

47. Чем указатель отличается от ссылки?

	**Ответ:** Указатель может быть `nullptr`, переназначаться и разыменовываться явно; ссылка должна быть привязана к объекту при инициализации.

	**Пример:** `pointer = nullptr;` допустимо, переназначить `ref` нельзя.

	**Типичная ошибка:** Использовать ссылку, когда отсутствие объекта — часть контракта.

	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

48. Что хранит указатель?

	**Ответ:** Указатель хранит адрес или значение, обозначающее отсутствие адреса; сам указатель не владеет объектом автоматически.

	**Пример:** `int* pointer = &value;` хранит адрес `value`.

	**Типичная ошибка:** Приписывать raw pointer владение ресурсом без явного контракта.

	**Источник:** [C++ Core Guidelines: pointers](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r-raw)

49. Что такое `nullptr`?

	**Ответ:** `nullptr` — литерал типа `std::nullptr_t`, который однозначно обозначает нулевой указатель.

	**Пример:** `int* pointer = nullptr;`.

	**Типичная ошибка:** Использовать `0` для выбора перегрузки указателя и целого числа.

	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

50. Чем `0`, `NULL` и `nullptr` отличаются в современном C++?

	**Ответ:** `0` — целочисленный литерал, `NULL` — макрос, обычно совместимый с нулём, а `nullptr` специально имеет тип нулевого указателя.

	**Пример:** `f(nullptr)` однозначно выбирает указательную перегрузку.

	**Типичная ошибка:** Использовать `NULL` в перегруженном API.

	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

51. Что такое массив как тип?

	**Ответ:** Массив — тип фиксированного числа элементов одного типа, расположенных последовательно.

	**Пример:** `int values[3]{1, 2, 3};` имеет тип `int[3]`.

	**Типичная ошибка:** Путать массив с указателем на первый элемент.

	**Источник:** [Cppreference: array](https://en.cppreference.com/w/cpp/language/array)

52. Что означает запись `int arr[10];` с точки зрения типа?

	**Ответ:** Она объявляет массив из десяти элементов типа `int`, то есть `arr` имеет тип `int[10]`.

	**Пример:** `sizeof(arr)` равен `10 * sizeof(int)` в месте объявления.

	**Типичная ошибка:** Считать, что `sizeof(arr)` всегда равен размеру указателя.

	**Источник:** [Cppreference: array](https://en.cppreference.com/w/cpp/language/array)

53. Что такое `enum`?

	**Ответ:** `enum` определяет перечисление — тип с набором именованных значений и целочисленным underlying type.

	**Пример:** `enum Color { red, green, blue };`.

	**Типичная ошибка:** Не учитывать неявные преобразования обычного enum к целому.

	**Источник:** [Cppreference: enum](https://en.cppreference.com/w/cpp/language/enum)

54. Для чего нужен `enum class`?

	**Ответ:** `enum class` создаёт scoped и type-safe перечисление, уменьшая риск конфликтов имён и неявных преобразований.

	**Пример:** `enum class Color { red, green }; Color color = Color::red;`.

	**Типичная ошибка:** Писать `red` вместо квалифицированного `Color::red`.

	**Источник:** [Cppreference: enum](https://en.cppreference.com/w/cpp/language/enum)

55. Чем `enum class` отличается от обычного `enum`?

	**Ответ:** Его значения находятся в области перечисления и не преобразуются неявно в `int`; underlying type можно задать явно.

	**Пример:** `enum class Status : std::uint8_t { ok, error };`.

	**Типичная ошибка:** Делать `static_cast<int>` без необходимости и терять типобезопасность.

	**Источник:** [Cppreference: enum](https://en.cppreference.com/w/cpp/language/enum)

56. Что такое `struct` как пользовательский тип?

	**Ответ:** `struct` определяет класс-тип; по умолчанию его члены и наследование публичные.

	**Пример:** `struct Point { int x{}; int y{}; };`.

	**Типичная ошибка:** Считать `struct` отдельным механизмом памяти, отличным от `class`.

	**Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

57. Что такое `class` как тип?

	**Ответ:** `class` определяет пользовательский тип с данными, функциями-членами, инвариантами и правилами доступа.

	**Пример:** `class Counter { int value{}; public: void increment() { ++value; } };`.

	**Типичная ошибка:** Открывать все поля публично и обходить инварианты класса.

	**Источник:** [Cppreference: class](https://en.cppreference.com/w/cpp/language/class)

58. Что такое `union`?

	**Ответ:** `union` содержит несколько членов, которые используют одну область памяти; одновременно корректно активен обычно один член.

	**Пример:** `union Value { int number; float real; };`.

	**Типичная ошибка:** Читать неактивный член без учёта правил lifetime и aliasing.

	**Источник:** [Cppreference: union](https://en.cppreference.com/w/cpp/language/union)

59. Что такое псевдоним типа?

	**Ответ:** Псевдоним — другое имя уже существующего типа, а не новый отдельный тип.

	**Пример:** `using Count = std::size_t;`.

	**Типичная ошибка:** Ожидать, что `using UserId = int` обеспечит сильную типобезопасность.

	**Источник:** [Cppreference: type alias](https://en.cppreference.com/w/cpp/language/type_alias)

60. Чем `using` отличается от `typedef`?

	**Ответ:** Оба создают псевдоним, но `using` обычно читаемее и удобнее для шаблонных alias declarations.

	**Пример:** `using Table = std::vector<std::string>;`.

	**Типичная ошибка:** Считать `using` новым типом вместо псевдонима.

	**Источник:** [Cppreference: type alias](https://en.cppreference.com/w/cpp/language/type_alias)

## Средний уровень

61. Что такое неявное преобразование типов?

	**Ответ:** Это автоматическая смена типа по правилам языка без явного cast в исходном коде.

	**Пример:** `double value = 3;` преобразует `int` к `double`.

	**Типичная ошибка:** Не замечать потерю точности или диапазона.

	**Источник:** [Cppreference: implicit conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

62. В каких случаях компилятор выполняет неявное преобразование?

	**Ответ:** При инициализации, присваивании, передаче параметров, выборе перегрузки и арифметических операциях.

	**Пример:** `long value = short_value;`.

	**Типичная ошибка:** Путать допустимость преобразования с его безопасностью.

	**Источник:** [Cppreference: implicit conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

63. Что такое явное преобразование типов?

	**Ответ:** Это преобразование, явно указанное программистом через `static_cast`, `const_cast`, `reinterpret_cast` или `dynamic_cast`.

	**Пример:** `double ratio = static_cast<double>(count) / total;`.

	**Типичная ошибка:** Использовать C-style cast, скрывающий вид и риск операции.

	**Источник:** [Cppreference: explicit conversions](https://en.cppreference.com/w/cpp/language/explicit_cast)

64. Чем опасно преобразование `double` в `int`?

	**Ответ:** Дробная часть отбрасывается, а значение вне диапазона `int` может привести к неопределённому поведению.

	**Пример:** `static_cast<int>(3.9)` даёт `3`.

	**Типичная ошибка:** Ожидать математическое округление.

	**Источник:** [Cppreference: floating-integral conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

65. Что такое сужающее преобразование?

	**Ответ:** Это преобразование, потенциально теряющее диапазон, точность или размер; списочная инициализация часто запрещает его.

	**Пример:** `int value{3.9};` не компилируется.

	**Типичная ошибка:** Обходить диагностику фигурных скобок неосмысленным cast.

	**Источник:** [Cppreference: list initialization](https://en.cppreference.com/w/cpp/language/list_initialization)

66. Почему `int x = 3.9;` считается потенциально опасным?

	**Ответ:** Значение неявно преобразуется к `int`, дробная часть теряется без обязательной ошибки компилятора.

	**Пример:** После инициализации `x` равен `3`.

	**Типичная ошибка:** Считать такое присваивание округлением до ближайшего.

	**Источник:** [Cppreference: implicit conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

67. Что такое promotions целочисленных типов?

	**Ответ:** Узкие целые типы вроде `char` и `short` обычно преобразуются к `int` или `unsigned int` перед арифметикой.

	**Пример:** `char a{}, b{}; auto sum = a + b;` обычно имеет тип `int`.

	**Типичная ошибка:** Ожидать арифметику в исходном типе `char`.

	**Источник:** [Cppreference: integer promotions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

68. Что такое usual arithmetic conversions?

	**Ответ:** Это правила приведения арифметических операндов к общему типу перед операцией.

	**Пример:** В `int_value + double_value` целое преобразуется к `double`.

	**Типичная ошибка:** Игнорировать знак и ранг типов при смешении signed и unsigned.

	**Источник:** [Cppreference: usual arithmetic conversions](https://en.cppreference.com/w/cpp/language/usual_arithmetic_conversions)

69. Какой тип получится в выражении `int + double`?

	**Ответ:** Обычно результат имеет тип `double`: `int` преобразуется к `double` перед сложением.

	**Пример:** `auto result = 1 + 2.5;` имеет тип `double`.

	**Типичная ошибка:** Считать, что результат останется целым из-за первого операнда.

	**Источник:** [Cppreference: usual arithmetic conversions](https://en.cppreference.com/w/cpp/language/usual_arithmetic_conversions)

70. Почему выражения с `unsigned` могут вести себя неожиданно?

	**Ответ:** Смешанные выражения могут преобразовать отрицательное signed значение к unsigned, а unsigned переполняется по модулю.

	**Пример:** `-1 < 1u` обычно ложно.

	**Типичная ошибка:** Использовать unsigned для обычных циклов с возможным уменьшением до нуля.

	**Источник:** [Cppreference: usual arithmetic conversions](https://en.cppreference.com/w/cpp/language/usual_arithmetic_conversions)

71. Чем опасно сравнение `int` и `size_t`?

	**Ответ:** `size_t` обычно unsigned, поэтому отрицательный `int` может преобразоваться в большое положительное значение.

	**Пример:** `for (int i = size - 1; i >= 0; --i)` опасен, если `size` — `size_t`.

	**Типичная ошибка:** Сравнивать signed и unsigned без приведения к общей осмысленной модели.

	**Источник:** [Cppreference: usual arithmetic conversions](https://en.cppreference.com/w/cpp/language/usual_arithmetic_conversions)

72. Что такое `size_t`?

	**Ответ:** `size_t` — беззнаковый тип, способный представить размер любого объекта в памяти.

	**Пример:** `std::size_t length = text.size();`.

	**Типичная ошибка:** Пытаться представить отрицательное значение размера.

	**Источник:** [Cppreference: size_t](https://en.cppreference.com/w/cpp/types/size_t)

73. Где обычно используют `size_t`?

	**Ответ:** Для размеров объектов, количества элементов и индексов контейнеров, когда отрицательные значения не нужны.

	**Пример:** `for (std::size_t i{}; i < values.size(); ++i) {}`.

	**Типичная ошибка:** Вычитать `1` из пустого `size_t` и получить большое число.

	**Источник:** [Cppreference: size_t](https://en.cppreference.com/w/cpp/types/size_t)

74. Что такое `ptrdiff_t`?

	**Ответ:** `std::ptrdiff_t` — знаковый тип результата разности двух указателей в одном массиве.

	**Пример:** `auto distance = last - first;`.

	**Типичная ошибка:** Вычитать указатели, относящиеся к разным массивам.

	**Источник:** [Cppreference: ptrdiff_t](https://en.cppreference.com/w/cpp/types/ptrdiff_t)

75. Какой тип возвращает `sizeof`?

	**Ответ:** `sizeof` возвращает `std::size_t`.

	**Пример:** `std::size_t bytes = sizeof(value);`.

	**Типичная ошибка:** Сравнивать результат с отрицательным `int` без учёта unsigned-преобразования.

	**Источник:** [Cppreference: sizeof](https://en.cppreference.com/w/cpp/language/sizeof)

76. Что такое фиксированные по размеру типы `int32_t`, `uint64_t` и подобные?

	**Ответ:** Это типы из `<cstdint>` с точно указанной шириной, если реализация предоставляет соответствующий тип.

	**Пример:** `std::uint32_t packet_id{};`.

	**Типичная ошибка:** Использовать тип без проверки его наличия на экзотической платформе.

	**Источник:** [Cppreference: integer types](https://en.cppreference.com/w/cpp/types/integer)

77. Когда лучше использовать фиксированные целые типы вместо обычного `int`?

	**Ответ:** Когда размер важен для протокола, файла, ABI или аппаратного регистра.

	**Пример:** Формат пакета может требовать `std::uint32_t`.

	**Типичная ошибка:** Использовать фиксированный тип для любого локального счётчика без необходимости.

	**Источник:** [Cppreference: integer types](https://en.cppreference.com/w/cpp/types/integer)

78. Что такое `std::byte`?

	**Ответ:** `std::byte` — тип для необработанных байтовых данных, не предназначенный для арифметики как обычное число.

	**Пример:** `std::byte flag{0x01};`.

	**Типичная ошибка:** Неявно использовать `std::byte` в арифметическом выражении.

	**Источник:** [Cppreference: std::byte](https://en.cppreference.com/w/cpp/types/byte)

79. Чем `std::byte` отличается от `unsigned char`?

	**Ответ:** `unsigned char` — целый тип и может участвовать в арифметике, а `std::byte` подчёркивает семантику необработанных данных.

	**Пример:** Для побитовых операций над байтами можно явно использовать `std::to_integer`.

	**Типичная ошибка:** Ожидать неявное преобразование `std::byte` в `int`.

	**Источник:** [Cppreference: std::byte](https://en.cppreference.com/w/cpp/types/byte)

80. Что такое `wchar_t`?

	**Ответ:** `wchar_t` — отдельный целый тип для широких символов, но его размер и кодировка зависят от платформы.

	**Пример:** `wchar_t symbol{L'A'};`.

	**Типичная ошибка:** Считать `wchar_t` переносимым способом хранения любого Unicode-символа.

	**Источник:** [Cppreference: character types](https://en.cppreference.com/w/cpp/language/types)

81. Для чего нужны `char16_t` и `char32_t`?

	**Ответ:** Они предназначены для кодовых единиц UTF-16 и UTF-32 соответственно, но не гарантируют, что один элемент равен целому пользовательскому символу.

	**Пример:** `char32_t code_point{U'Ж'};`.

	**Типичная ошибка:** Путать кодовую единицу, code point и grapheme cluster.

	**Источник:** [Cppreference: character types](https://en.cppreference.com/w/cpp/language/types)

82. Для чего нужен `char8_t`?

	**Ответ:** `char8_t` представляет кодовые единицы UTF-8 и используется с литералами `u8` в современном C++.

	**Пример:** `const char8_t* text = u8"Привет";`.

	**Типичная ошибка:** Передавать `char8_t*` в старый API, ожидающий `char*`, без явного решения по кодировке.

	**Источник:** [Cppreference: character types](https://en.cppreference.com/w/cpp/language/types)

83. Почему `char` не равен “символу Unicode”?

	**Ответ:** `char` хранит один байт, а Unicode-кодовая точка может занимать несколько байтов в UTF-8 или требовать более широкого представления.

	**Пример:** Символ `Ж` занимает несколько UTF-8 кодовых единиц.

	**Типичная ошибка:** Итерироваться по UTF-8 строке как по массиву готовых символов.

	**Источник:** [Cppreference: character types](https://en.cppreference.com/w/cpp/language/types)

84. Что такое C-строка с точки зрения типа?

	**Ответ:** Это последовательность `char`, заканчивающаяся нулевым символом `\0`; строковый литерал имеет массивный тип.

	**Пример:** `const char text[] = "ABC";` имеет четыре элемента.

	**Типичная ошибка:** Передать буфер без места для завершающего нуля.

	**Источник:** [Cppreference: string literal](https://en.cppreference.com/w/cpp/language/string_literal)

85. Какой тип имеет выражение `const char*`?

	**Ответ:** Это указатель на `const char`: сам указатель можно переназначить, но символы через него изменять нельзя.

	**Пример:** `const char* text = "ABC";`.

	**Типичная ошибка:** Пытаться записать через указатель в строковый литерал.

	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

86. Чем `char*` отличается от `const char*`?

	**Ответ:** Через `char*` можно изменять объект `char`, если он действительно изменяем, а через `const char*` — только читать.

	**Пример:** `char buffer[] = "ABC"; char* p = buffer;`.

	**Типичная ошибка:** Снимать `const` с литерала или другого изначально константного объекта.

	**Источник:** [Cppreference: cv-qualified types](https://en.cppreference.com/w/cpp/language/cv)

87. Чем `const int*` отличается от `int* const`?

	**Ответ:** `const int*` — изменяемый указатель на константный `int`, а `int* const` — константный указатель на изменяемый `int`.

	**Пример:** `const int* a; int* const b = &value;`.

	**Типичная ошибка:** Читать `const` только слева, игнорируя положение относительно `*`.

	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

88. Что такое указатель на константу?

	**Ответ:** Это указатель, через который нельзя изменять объект: `const T*` или `T const*`.

	**Пример:** `const int* view = &value;`.

	**Типичная ошибка:** Считать сам указатель неизменяемым.

	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

89. Что такое константный указатель?

	**Ответ:** Это указатель, который после инициализации нельзя переназначить: `T* const`.

	**Пример:** `int* const pointer = &value;`.

	**Типичная ошибка:** Принимать неизменяемость адреса за неизменяемость объекта.

	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

90. Можно ли сделать константным и указатель, и объект одновременно?

	**Ответ:** Да, тип `const T* const` запрещает и изменение объекта через указатель, и переназначение самого указателя.

	**Пример:** `const int* const pointer = &value;`.

	**Типичная ошибка:** Забыть, что это ограничение действует через данный путь доступа.

	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

91. Что такое ссылка на константу?

	**Ответ:** `const T&` — ссылка, через которую нельзя изменять объект; она может привязываться к временным значениям.

	**Пример:** `const std::string& name = "Ada";`.

	**Типичная ошибка:** Возвращать такую ссылку на временный объект из функции.

	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

92. Почему `const T&` часто используют в параметрах функций?

	**Ответ:** Она избегает копирования большого объекта и позволяет принимать как lvalue, так и временные значения без изменения аргумента.

	**Пример:** `void print(const std::string& text);`.

	**Типичная ошибка:** Передавать по `const&` дешёвые типы, усложняя интерфейс без выгоды.

	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rf-con)

93. Что такое rvalue-ссылка?

	**Ответ:** `T&&` — ссылка, которая обычно привязывается к временному объекту и позволяет реализовать перемещение.

	**Пример:** `std::string&& temporary = std::string{"text"};`.

	**Типичная ошибка:** Использовать объект после того, как его состояние было перемещено.

	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

94. Для чего используют `T&&`?

	**Ответ:** Для move-конструкторов, move-присваивания и передачи временных объектов с возможностью эффективно перенести ресурс.

	**Пример:** `Buffer(Buffer&& other) noexcept;`.

	**Типичная ошибка:** Вызывать `std::move` без понимания последующего состояния объекта.

	**Источник:** [Cppreference: move constructor](https://en.cppreference.com/w/cpp/language/move_constructor)

95. Что такое `decltype`?

	**Ответ:** `decltype` получает тип выражения по правилам, сохраняющим важные свойства ссылочности.

	**Пример:** `decltype(value) copy{};`.

	**Типичная ошибка:** Ожидать от `decltype` тех же правил, что и от `auto`.

	**Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

96. Чем `decltype(x)` отличается от `auto`?

	**Ответ:** Для некруглых выражений `decltype(x)` сохраняет объявленный тип `x`, включая `const` и ссылку, а `auto` обычно выводит значение без них.

	**Пример:** Для `const int x{}` `decltype(x)` — `const int`, `auto y = x` — `int`.

	**Типичная ошибка:** Использовать `auto` там, где нужно сохранить ссылочность.

	**Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

97. Что такое `decltype(auto)`?

	**Ответ:** Это placeholder, который выводит тип по правилам `decltype`, включая ссылки и `const`.

	**Пример:** `decltype(auto) get() { return (value); }` может вернуть ссылку.

	**Типичная ошибка:** Вернуть ссылку на локальный объект через `decltype(auto)`.

	**Источник:** [Cppreference: decltype specifier](https://en.cppreference.com/w/cpp/language/decltype)

98. Как `auto` ведёт себя с `const` и ссылками?

	**Ответ:** При выводе по значению `auto` обычно снимает top-level `const` и ссылочность; `auto&` и `const auto&` сохраняют их явно.

	**Пример:** `const int x{}; auto a = x; const auto& b = x;`.

	**Типичная ошибка:** Ожидать, что `auto a = x` будет константной ссылкой.

	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

99. Что происходит с ссылочностью при выводе типа через `auto`?

	**Ответ:** Ссылка обычно не становится частью типа переменной при `auto x = expression`; для сохранения используют `auto&`, `auto&&` или `decltype(auto)`.

	**Пример:** `auto& alias = value;` обращается к исходному объекту.

	**Типичная ошибка:** Изменить копию вместо элемента контейнера из-за `for (auto item : values)`.

	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

100. Что такое top-level const?

	**Ответ:** Это `const`, применённый к самому объекту, например `int* const`: константен указатель, а не объект по адресу.

	**Пример:** `const int value` имеет top-level const.

	**Типичная ошибка:** Путать его с `const int*`, где const относится к целому объекту.

	**Источник:** [Cppreference: cv qualifiers](https://en.cppreference.com/w/cpp/language/cv)

101. Что такое low-level const?

	**Ответ:** Это `const`, применённый к подобъекту или типу, на который указывает/ссылается объект, например `const int*`.

	**Пример:** Через `const int* pointer` нельзя менять `*pointer`.

	**Типичная ошибка:** Считать, что low-level const запрещает переназначение самого указателя.

	**Источник:** [Cppreference: cv qualifiers](https://en.cppreference.com/w/cpp/language/cv)

102. Что такое тип функции?

	**Ответ:** Тип функции определяется возвращаемым типом и списком параметров; cv/ref-квалификаторы важны для функций-членов.

	**Пример:** `int(double)` — тип функции, принимающей `double` и возвращающей `int`.

	**Типичная ошибка:** Включать имя функции в её тип.

	**Источник:** [Cppreference: function type](https://en.cppreference.com/w/cpp/language/function)

103. Что такое указатель на функцию?

	**Ответ:** Это объект, хранящий адрес функции с совместимой сигнатурой.

	**Пример:** `int (*operation)(int, int) = add;`.

	**Типичная ошибка:** Перепутать указатель на функцию с вызовом функции.

	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

104. Что такое ссылка на функцию?

	**Ответ:** Это ссылка, связанная с функцией и позволяющая вызывать её через другое имя без копирования функции.

	**Пример:** `int (&operation)(int, int) = add;`.

	**Типичная ошибка:** Возвращать ссылку на функцию, которая недоступна после выгрузки модуля.

	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

105. Какой тип у лямбда-выражения?

	**Ответ:** У каждой лямбды есть уникальный безымянный closure type, генерируемый компилятором.

	**Пример:** `auto add = [](int a, int b) { return a + b; };`.

	**Типичная ошибка:** Ожидать, что две одинаково записанные лямбды имеют один тип.

	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

106. Почему тип лямбды нельзя явно написать обычным способом?

	**Ответ:** Closure type уникален и не имеет имени в исходном языке; его обычно хранят в `auto` или передают шаблону.

	**Пример:** `std::function<int(int)>` стирает конкретный тип лямбды.

	**Типичная ошибка:** Использовать `std::function` везде, хотя шаблонный параметр может избежать накладных расходов.

	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

107. Что такое массив указателей?

	**Ответ:** Это массив, каждый элемент которого является указателем.

	**Пример:** `int* values[5]{};`.

	**Типичная ошибка:** Читать объявление как указатель на массив.

	**Источник:** [Cppreference: array](https://en.cppreference.com/w/cpp/language/array)

108. Что такое указатель на массив?

	**Ответ:** Это указатель, указывающий на целый массив фиксированного типа и размера.

	**Пример:** `int (*pointer)[5] = &values;`.

	**Типичная ошибка:** Использовать неправильную арифметику указателя и потерять размер массива.

	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

109. Чем `int* arr[5]` отличается от `int (*arr)[5]`?

	**Ответ:** Первое — массив пяти указателей на `int`, второе — один указатель на массив пяти `int`.

	**Пример:** Скобки вокруг `*arr` меняют структуру объявления.

	**Типичная ошибка:** Игнорировать правило чтения деклараций справа налево.

	**Источник:** [Cppreference: array declaration](https://en.cppreference.com/w/cpp/language/array)

110. Что такое массив ссылок и почему его нельзя создать?

	**Ответ:** Стандарт не разрешает массив ссылок: ссылка не является объектом, который можно разместить как независимый элемент массива.

	**Пример:** Вместо этого используют массив указателей или `std::reference_wrapper<T>`.

	**Типичная ошибка:** Пытаться объявить `int& values[3]`.

	**Источник:** [Cppreference: references](https://en.cppreference.com/w/cpp/language/reference)

## Сложный уровень

111. Что такое неполный тип?

	**Ответ:** Неполный тип объявлен, но его размер и состав ещё неизвестны.

	**Пример:** `class Node; Node* next;`.

	**Типичная ошибка:** Создавать объект неполного типа по значению.

	**Источник:** [Cppreference: incomplete type](https://en.cppreference.com/w/cpp/language/type)

112. Когда можно объявить тип, не зная его полного определения?

	**Ответ:** Для указателей, ссылок и некоторых деклараций функций; полный тип нужен при создании объекта или обращении к членам.

	**Пример:** `struct Impl; std::unique_ptr<Impl> impl;` при корректном деструкторе.

	**Типичная ошибка:** Вызвать метод через указатель до подключения определения класса.

	**Источник:** [Cppreference: type](https://en.cppreference.com/w/cpp/language/type)

113. Что такое forward declaration?

	**Ответ:** Это предварительное объявление сущности, сообщающее компилятору её имя до полного определения.

	**Пример:** `class Database; void use(Database&);`.

	**Типичная ошибка:** Дублировать несовместимое объявление и определение.

	**Источник:** [Cppreference: class declaration](https://en.cppreference.com/w/cpp/language/class)

114. Почему неполный тип нельзя использовать везде?

	**Ответ:** Компилятор не знает его размер, layout и члены, поэтому нельзя создать объект по значению или обратиться к полю.

	**Пример:** Указатель `Node*` допустим, а `Node node;` — нет.

	**Типичная ошибка:** Размещать inline-код, требующий полного определения.

	**Источник:** [Cppreference: incomplete type](https://en.cppreference.com/w/cpp/language/type)

115. Что такое выравнивание типа?

	**Ответ:** Выравнивание — требование к допустимому адресу начала объекта определённого типа.

	**Пример:** `double` может требовать более строгого выравнивания, чем `char`.

	**Типичная ошибка:** Читать объект из произвольного адреса через неподходящий указатель.

	**Источник:** [Cppreference: object](https://en.cppreference.com/w/cpp/language/object)

116. Что показывает `alignof`?

	**Ответ:** `alignof(T)` возвращает требуемое выравнивание типа `T` в байтах.

	**Пример:** `static_assert(alignof(int) <= sizeof(int));`.

	**Типичная ошибка:** Принимать `alignof` за размер типа.

	**Источник:** [Cppreference: alignof](https://en.cppreference.com/w/cpp/language/alignof)

117. Почему два типа одинакового размера могут иметь разное выравнивание?

	**Ответ:** Размер и требование к адресу — разные свойства; ABI может требовать разные границы для доступа.

	**Пример:** Два 16-байтных типа могут выравниваться по 8 и 16 байт.

	**Типичная ошибка:** Определять выравнивание как `sizeof(T)`.

	**Источник:** [Cppreference: object](https://en.cppreference.com/w/cpp/language/object)

118. Что такое padding в объектах?

	**Ответ:** Padding — неиспользуемые байты, добавленные для выравнивания полей или размера объекта.

	**Пример:** После `char` перед `int` часто появляется padding.

	**Типичная ошибка:** Сериализовать структуру напрямую и считать padding частью стабильного формата.

	**Источник:** [Cppreference: object representation](https://en.cppreference.com/w/cpp/language/object)

119. Почему структура может занимать больше памяти, чем сумма её полей?

	**Ответ:** Между полями и в конце структуры может быть padding для выравнивания.

	**Пример:** `struct S { char c; int value; };` часто больше `1 + sizeof(int)`.

	**Типичная ошибка:** Удалять padding упаковкой и получать невыровненный доступ.

	**Источник:** [Cppreference: data members](https://en.cppreference.com/w/cpp/language/data_members)

120. Как порядок полей влияет на размер структуры?

	**Ответ:** Группировка крупных и совместимых по выравниванию полей может уменьшить padding.

	**Пример:** `int, char, char` обычно компактнее, чем `char, int, char`.

	**Типичная ошибка:** Менять порядок публичных полей в ABI-совместимом типе без оценки последствий.

	**Источник:** [Cppreference: data members](https://en.cppreference.com/w/cpp/language/data_members)

121. Что такое underlying type у перечисления?

	**Ответ:** Это целочисленный тип, используемый для хранения значения enum.

	**Пример:** `enum class State : std::uint8_t { idle, busy };`.

	**Типичная ошибка:** Путать underlying type с типом самого перечисления.

	**Источник:** [Cppreference: enum](https://en.cppreference.com/w/cpp/language/enum)

122. Можно ли явно задать underlying type для `enum class`?

	**Ответ:** Да, после имени перечисления указывают двоеточие и целочисленный тип.

	**Пример:** `enum class Error : std::uint16_t { none, io };`.

	**Типичная ошибка:** Выбирать слишком узкий тип для всех возможных enumerators.

	**Источник:** [Cppreference: enum](https://en.cppreference.com/w/cpp/language/enum)

123. Чем удобен `enum class` для типобезопасности?

	**Ответ:** Его значения не попадают в окружающую область имён и не преобразуются неявно в целые числа.

	**Пример:** `State::idle` нельзя случайно передать как `int` без cast.

	**Типичная ошибка:** Повсеместно снимать типобезопасность через `static_cast`.

	**Источник:** [Cppreference: enum](https://en.cppreference.com/w/cpp/language/enum)

124. Что такое bit-field?

	**Ответ:** Bit-field — член класса, которому задают количество битов для хранения целочисленного значения.

	**Пример:** `struct Flags { unsigned ready : 1; };`.

	**Типичная ошибка:** Рассчитывать layout bit-field одинаково на разных ABI.

	**Источник:** [Cppreference: bit-field](https://en.cppreference.com/w/cpp/language/bit_field)

125. В каких случаях bit-field полезен?

	**Ответ:** Для компактного хранения флагов и форматов, где layout определён конкретной платформой или протоколом.

	**Пример:** Несколько однобитных признаков в аппаратном регистре.

	**Типичная ошибка:** Использовать bit-field для переносимой сетевой сериализации без явного кодирования.

	**Источник:** [Cppreference: bit-field](https://en.cppreference.com/w/cpp/language/bit_field)

126. Какие ограничения есть у bit-field?

	**Ответ:** Нельзя взять обычный адрес bit-field; размер и размещение зависят от реализации, а типы и ширина ограничены правилами языка.

	**Пример:** `auto pointer = &flags.ready;` некорректен.

	**Типичная ошибка:** Передавать bit-field туда, где требуется ссылка на объект.

	**Источник:** [Cppreference: bit-field](https://en.cppreference.com/w/cpp/language/bit_field)

127. Что такое активный член `union`?

	**Ответ:** Активный член — последний созданный член union, чьё значение сейчас доступно по правилам lifetime.

	**Пример:** `Value value; value.number = 42;` активирует `number`.

	**Типичная ошибка:** Не отслеживать, какой член был создан последним.

	**Источник:** [Cppreference: union](https://en.cppreference.com/w/cpp/language/union)

128. Почему чтение неактивного члена `union` может быть проблемой?

	**Ответ:** Оно может нарушить lifetime и правила представления типа; переносимый код должен явно управлять активным членом.

	**Пример:** Для альтернативных значений безопаснее использовать `std::variant`.

	**Типичная ошибка:** Считать union универсальным способом type punning.

	**Источник:** [Cppreference: union](https://en.cppreference.com/w/cpp/language/union)

129. Что такое strict aliasing?

	**Ответ:** Это правила, ограничивающие типы выражений, через которые можно обращаться к объекту.

	**Пример:** Нельзя бездумно читать `float` через `int*`.

	**Типичная ошибка:** Нарушать правила ради микрооптимизации.

	**Источник:** [Cppreference: object](https://en.cppreference.com/w/cpp/language/object)

130. Почему нарушение strict aliasing опасно?

	**Ответ:** Компилятор может предположить отсутствие конфликта объектов и оптимизировать код так, что результат станет неожиданным.

	**Пример:** Значение, записанное через несовместимый указатель, может быть проигнорировано оптимизатором.

	**Типичная ошибка:** Отключать оптимизации вместо исправления модели доступа к памяти.

	**Источник:** [Cppreference: object](https://en.cppreference.com/w/cpp/language/object)

131. Что такое type punning?

	**Ответ:** Это интерпретация тех же битов как значения другого типа.

	**Пример:** Для переносимого копирования представления используют `std::bit_cast`.

	**Типичная ошибка:** Реализовывать punning через опасное разыменование несовместимого указателя.

	**Источник:** [Cppreference: bit_cast](https://en.cppreference.com/w/cpp/numeric/bit_cast)

132. Почему `reinterpret_cast` требует особой осторожности?

	**Ответ:** Он меняет интерпретацию адреса или битов без проверки смысловой совместимости и легко нарушает lifetime, alignment или aliasing.

	**Пример:** Преобразование указателя не создаёт объект нового типа.

	**Типичная ошибка:** Использовать `reinterpret_cast` как универсальный cast.

	**Источник:** [Cppreference: reinterpret_cast](https://en.cppreference.com/w/cpp/language/reinterpret_cast)

133. Чем `static_cast` отличается от `reinterpret_cast`?

	**Ответ:** `static_cast` выполняет проверяемые на этапе компиляции преобразования, а `reinterpret_cast` меняет интерпретацию представления или адреса.

	**Пример:** Числовое преобразование — `static_cast`, смена типа указателя — потенциально `reinterpret_cast`.

	**Типичная ошибка:** Выбирать cast по удобству, а не по семантике операции.

	**Источник:** [Cppreference: cast operators](https://en.cppreference.com/w/cpp/language/explicit_cast)

134. Чем `const_cast` отличается от остальных приведений типов?

	**Ответ:** Он меняет cv-квалификаторы указателя или ссылки; сам по себе не превращает объект в другой тип.

	**Пример:** `const_cast<char*>(text)`.

	**Типичная ошибка:** Записывать через снятый `const` в изначально константный объект.

	**Источник:** [Cppreference: const_cast](https://en.cppreference.com/w/cpp/language/const_cast)

135. В каких случаях применяют `dynamic_cast`?

	**Ответ:** Для безопасного runtime-проверяемого downcast в иерархии полиморфных классов.

	**Пример:** `if (auto* derived = dynamic_cast<Derived*>(base)) {}`.

	**Типичная ошибка:** Использовать downcast вместо хорошо спроектированного виртуального интерфейса.

	**Источник:** [Cppreference: dynamic_cast](https://en.cppreference.com/w/cpp/language/dynamic_cast)

136. Почему `dynamic_cast` работает только с полиморфными типами?

	**Ответ:** Ему нужна runtime-информация о динамическом типе, которая связана с наличием виртуальной функции.

	**Пример:** Базовый класс с виртуальным деструктором поддерживает такой cast.

	**Типичная ошибка:** Забыть виртуальный член в базовом классе.

	**Источник:** [Cppreference: dynamic_cast](https://en.cppreference.com/w/cpp/language/dynamic_cast)

137. Что такое RTTI?

	**Ответ:** RTTI — механизм информации о типе во время выполнения, используемый, в частности, `dynamic_cast` и `typeid`.

	**Пример:** `typeid(*base).name()` получает информацию о динамическом типе.

	**Типичная ошибка:** Принимать имя типа от `name()` за стабильный переносимый идентификатор.

	**Источник:** [Cppreference: typeid](https://en.cppreference.com/w/cpp/language/typeid)

138. Для чего нужен `typeid`?

	**Ответ:** `typeid` возвращает объект `std::type_info`, описывающий статический или динамический тип выражения.

	**Пример:** `if (typeid(value) == typeid(int)) {}`.

	**Типичная ошибка:** Разыменовать null-указатель в `typeid(*pointer)` для полиморфного типа.

	**Источник:** [Cppreference: typeid](https://en.cppreference.com/w/cpp/language/typeid)

139. Чем проверка типа во время выполнения отличается от проверки на этапе компиляции?

	**Ответ:** Runtime-проверка использует фактический объект во время выполнения, а compile-time проверка выполняется шаблонами, traits или concepts до запуска.

	**Пример:** `dynamic_cast` против `static_assert(std::is_integral_v<T>);`.

	**Типичная ошибка:** Откладывать известную на этапе компиляции ошибку до runtime.

	**Источник:** [Cppreference: type traits](https://en.cppreference.com/w/cpp/header/type_traits)

140. Что такое trivial type?

	**Ответ:** Trivial type имеет простые правила создания, копирования и уничтожения без пользовательской нетривиальной логики.

	**Пример:** Многие структуры только с фундаментальными полями trivial.

	**Типичная ошибка:** Делать вывод о triviality только по отсутствию методов в исходнике.

	**Источник:** [Cppreference: is_trivial](https://en.cppreference.com/w/cpp/types/is_trivial)

141. Что такое standard-layout type?

	**Ответ:** Это тип с ограничениями layout, делающими его представление более предсказуемым для совместимости с C и низкоуровневыми API.

	**Пример:** Простая структура без сложного наследования часто standard-layout.

	**Типичная ошибка:** Принимать standard-layout за гарантию отсутствия padding.

	**Источник:** [Cppreference: is_standard_layout](https://en.cppreference.com/w/cpp/types/is_standard_layout)

142. Что такое aggregate type?

	**Ответ:** Aggregate — тип, который можно инициализировать списком элементов без пользовательского конструктора и ряда других ограничений.

	**Пример:** `struct Point { int x; int y; };` — типичный aggregate.

	**Типичная ошибка:** Считать любую `struct` агрегатом независимо от конструкторов и базовых классов.

	**Источник:** [Cppreference: aggregate initialization](https://en.cppreference.com/w/cpp/language/aggregate_initialization)

143. Что такое aggregate initialization?

	**Ответ:** Это инициализация aggregate через список значений его элементов в порядке объявления.

	**Пример:** `Point point{10, 20};`.

	**Типичная ошибка:** Полагаться на порядок полей как на стабильный публичный контракт без необходимости.

	**Источник:** [Cppreference: aggregate initialization](https://en.cppreference.com/w/cpp/language/aggregate_initialization)

144. Почему не каждая структура является агрегатом?

	**Ответ:** Пользовательские или защищённые конструкторы, закрытые поля, базовые классы и другие ограничения могут лишить тип aggregate-свойств.

	**Пример:** `struct S { S() {} int value; };` не является простым aggregate.

	**Типичная ошибка:** Добавить конструктор и не заметить изменение доступной инициализации.

	**Источник:** [Cppreference: aggregate initialization](https://en.cppreference.com/w/cpp/language/aggregate_initialization)

145. Что такое literal type?

	**Ответ:** Literal type допускает создание объектов и вычислений в constant expression при соблюдении требований языка.

	**Пример:** `int` и подходящие простые `struct` могут быть literal types.

	**Типичная ошибка:** Считать любой класс с `constexpr`-методом literal type.

	**Источник:** [Cppreference: literal type](https://en.cppreference.com/w/cpp/named_req/LiteralType)

146. Почему literal type важен для `constexpr`?

	**Ответ:** `constexpr`-выражение может использовать только типы и операции, разрешённые для вычисления на этапе компиляции.

	**Пример:** `constexpr int size = 2 * 3;`.

	**Типичная ошибка:** Ожидать compile-time вычисление функции с недопустимыми побочными эффектами.

	**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr)

147. Что такое cv-квалификаторы типа?

	**Ответ:** `const` и `volatile` изменяют правила доступа к объекту и образуют cv-qualified варианты типов.

	**Пример:** `const volatile int status;`.

	**Типичная ошибка:** Принимать cv-квалификаторы за новый независимый класс типов.

	**Источник:** [Cppreference: cv qualifiers](https://en.cppreference.com/w/cpp/language/cv)

148. Что такое `volatile` и когда он действительно нужен?

	**Ответ:** `volatile` сообщает компилятору, что доступы к объекту нельзя устранять или произвольно объединять; он применим к memory-mapped I/O и специальным аппаратным сценариям.

	**Пример:** `volatile std::uint32_t* device_register;`.

	**Типичная ошибка:** Использовать `volatile` вместо атомиков или mutex.

	**Источник:** [Cppreference: cv qualifiers](https://en.cppreference.com/w/cpp/language/cv)

149. Почему `volatile` не является средством синхронизации потоков?

	**Ответ:** Он не гарантирует атомарность, порядок памяти или отсутствие data race между потоками.

	**Пример:** Для общего счётчика используют `std::atomic<int>`, а не `volatile int`.

	**Типичная ошибка:** Считать видимость отдельного чтения гарантией корректности протокола.

	**Источник:** [Cppreference: memory_order](https://en.cppreference.com/w/cpp/atomic/memory_order)

150. Что такое reference collapsing?

	**Ответ:** При создании ссылки на ссылку компилятор сворачивает комбинацию в одну ссылку по специальным правилам.

	**Пример:** `T& &&` превращается в `T&`.

	**Типичная ошибка:** Применять обычную интуицию к `T&&` в шаблоне.

	**Источник:** [Cppreference: reference collapsing](https://en.cppreference.com/w/cpp/language/reference)

151. Какие правила схлопывания ссылок существуют?

	**Ответ:** `&` с чем угодно даёт `&`, а `&& &&` даёт `&&`; только две rvalue-ссылки сохраняют `&&`.

	**Пример:** `T&& &` становится `T&`.

	**Типичная ошибка:** Забывать, что присутствие lvalue-ссылки доминирует.

	**Источник:** [Cppreference: reference collapsing](https://en.cppreference.com/w/cpp/language/reference)

152. Как reference collapsing связан с шаблонами?

	**Ответ:** Он позволяет одному шаблонному параметру `T&&` сохранять категорию переданного выражения после вывода `T`.

	**Пример:** Для lvalue `T` выводится как ссылка, и `T&&` схлопывается в `T&`.

	**Типичная ошибка:** Называть любой `T&&` forwarding reference без условий вывода.

	**Источник:** [Cppreference: forwarding reference](https://en.cppreference.com/w/cpp/language/reference)

153. Что такое forwarding reference?

	**Ответ:** Это `T&&` в контексте вывода типа шаблонного параметра или `auto&&`, способная принять lvalue и rvalue.

	**Пример:** `template<class T> void f(T&& value);`.

	**Типичная ошибка:** Принимать `Widget&&` за forwarding reference: конкретный тип не выводится.

	**Источник:** [Cppreference: forwarding reference](https://en.cppreference.com/w/cpp/language/reference)

154. Чем forwarding reference отличается от обычной rvalue-ссылки?

	**Ответ:** Обычная `T&&` с конкретным `T` принимает rvalue, а forwarding reference использует deduction и может принять обе категории.

	**Пример:** `void f(std::string&&);` не принимает lvalue.

	**Типичная ошибка:** Терять категорию аргумента внутри шаблона без `std::forward`.

	**Источник:** [Cppreference: forward](https://en.cppreference.com/w/cpp/utility/forward)

155. Как вывод типа работает для шаблонного параметра `T`?

	**Ответ:** Компилятор сопоставляет тип аргумента с формой параметра, учитывая ссылки, cv-квалификаторы и преобразования, разрешённые deduction.

	**Пример:** В `template<class T> void f(T value);` `const int` обычно выводится как `int`.

	**Типичная ошибка:** Ожидать, что вывод применяет произвольные пользовательские преобразования.

	**Источник:** [Cppreference: template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction)

156. Почему `T`, `T&`, `const T&` и `T&&` выводятся по-разному?

	**Ответ:** Форма параметра задаёт, сохраняются ли ссылки, const и категория значения исходного аргумента.

	**Пример:** `T&` принимает только lvalue и сохраняет изменяемость.

	**Типичная ошибка:** Использовать одну форму параметра для всех контрактов.

	**Источник:** [Cppreference: template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction)

157. Что такое decay типа?

	**Ответ:** Decay — набор преобразований, обычно снимающих ссылки/cv и превращающих массив или функцию в указатель.

	**Пример:** `std::decay_t<int[3]>` — `int*`.

	**Типичная ошибка:** Применять decay там, где важен размер массива.

	**Источник:** [Cppreference: decay](https://en.cppreference.com/w/cpp/types/decay)

158. Как массив превращается в указатель при передаче в функцию?

	**Ответ:** В большинстве выражений массив преобразуется в указатель на первый элемент; параметр массива функции также корректируется к указателю.

	**Пример:** `void f(int values[3])` фактически принимает `int*`.

	**Типичная ошибка:** Ожидать, что функция узнает размер массива из такого параметра.

	**Источник:** [Cppreference: array-to-pointer conversion](https://en.cppreference.com/w/cpp/language/implicit_conversion)

159. Почему тип массива часто “теряется” при передаче параметром?

	**Ответ:** Сигнатура параметра массива преобразуется к указателю, поэтому размер не входит в тип параметра.

	**Пример:** `void f(int (&values)[3])` сохраняет размер, а `void f(int values[3])` — нет.

	**Типичная ошибка:** Проверять размер через `sizeof(values)` внутри функции и получать размер указателя.

	**Источник:** [Cppreference: array parameters](https://en.cppreference.com/w/cpp/language/array)

160. Как сохранить размер массива в шаблонной функции?

	**Ответ:** Передайте массив по ссылке с параметром размера или используйте `std::array`/`std::span`.

	**Пример:** `template<class T, std::size_t N> void f(T (&)[N]);`.

	**Типичная ошибка:** Принимать массив по значению и ожидать сохранения его типа.

	**Источник:** [Cppreference: template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction)
161. Что такое `std::remove_reference`?

	**Ответ:** Trait удаляет ссылочность из типа и предоставляет результат через `::type` или `_t`.

	**Пример:** `std::remove_reference_t<int&>` — `int`.

	**Типичная ошибка:** Ожидать удаления `const` вместе со ссылкой.

	**Источник:** [Cppreference: remove_reference](https://en.cppreference.com/w/cpp/types/remove_reference)

162. Что делает `std::remove_const`?

	**Ответ:** Trait удаляет top-level `const` из типа, но не const внутри указуемого объекта.

	**Пример:** `remove_const_t<const int>` — `int`.

	**Типичная ошибка:** Ожидать превращения `const int*` в `int*`.

	**Источник:** [Cppreference: remove_cv](https://en.cppreference.com/w/cpp/types/remove_cv)

163. Что делает `std::decay`?

	**Ответ:** Он применяет стандартные decay-преобразования: снимает cv/ref и превращает массивы и функции в указатели.

	**Пример:** `std::decay_t<const int&>` — `int`.

	**Типичная ошибка:** Использовать decay в generic-коде, где нужна точная форма аргумента.

	**Источник:** [Cppreference: decay](https://en.cppreference.com/w/cpp/types/decay)

164. Для чего нужен `std::is_same`?

	**Ответ:** Он проверяет на этапе компиляции, совпадают ли два типа.

	**Пример:** `static_assert(std::is_same_v<int, int>);`.

	**Типичная ошибка:** Сравнивать типы во время выполнения, когда достаточно compile-time проверки.

	**Источник:** [Cppreference: is_same](https://en.cppreference.com/w/cpp/types/is_same)

165. Что такое `std::underlying_type`?

	**Ответ:** Trait получает целочисленный underlying type перечисления.

	**Пример:** `std::underlying_type_t<State>`.

	**Типичная ошибка:** Применять его к типу, который не является enum.

	**Источник:** [Cppreference: underlying_type](https://en.cppreference.com/w/cpp/types/underlying_type)

166. Когда полезен `std::common_type`?

	**Ответ:** Он определяет общий тип, к которому могут быть приведены несколько типов, например для условного выражения или арифметики.

	**Пример:** `std::common_type_t<int, double>` — `double`.

	**Типичная ошибка:** Принимать common type за лучший тип бизнес-логики.

	**Источник:** [Cppreference: common_type](https://en.cppreference.com/w/cpp/types/common_type)

167. Что такое type traits?

	**Ответ:** Type traits — шаблоны, предоставляющие свойства и преобразования типов на этапе компиляции.

	**Пример:** `std::is_integral_v<T>` проверяет целочисленность типа.

	**Типичная ошибка:** Скрывать сложными traits простой контракт функции.

	**Источник:** [Cppreference: type traits](https://en.cppreference.com/w/cpp/header/type_traits)

168. Как type traits помогают писать обобщённый код?

	**Ответ:** Они позволяют выбирать реализацию, проверять требования и преобразовывать типы без runtime-ветвлений.

	**Пример:** `static_assert(std::is_move_constructible_v<T>);`.

	**Типичная ошибка:** Проверять второстепенные свойства и не описывать основное требование API.

	**Источник:** [Cppreference: type traits](https://en.cppreference.com/w/cpp/header/type_traits)

169. Что такое SFINAE в контексте типов?

	**Ответ:** Substitution Failure Is Not An Error: невозможная подстановка в контексте шаблона удаляет кандидат вместо ошибки компиляции.

	**Пример:** `std::enable_if_t<std::is_integral_v<T>, int>` ограничивает перегрузку.

	**Типичная ошибка:** Использовать SFINAE там, где понятнее concepts.

	**Источник:** [Cppreference: SFINAE](https://en.cppreference.com/w/cpp/language/sfinae)

170. Как ограничения по типам влияют на выбор шаблона?

	**Ответ:** Ограничение исключает неподходящие специализации из набора кандидатов и делает выбор более точным.

	**Пример:** Концепт `std::integral<T>` ограничивает функцию целыми типами.

	**Типичная ошибка:** Оставлять несколько пересекающихся ограничений с неоднозначным выбором.

	**Источник:** [Cppreference: constraints](https://en.cppreference.com/w/cpp/language/constraints)

171. Что такое `std::enable_if`?

	**Ответ:** Это старый механизм SFINAE, включающий тип или перегрузку только при выполнении условия.

	**Пример:** `std::enable_if_t<std::is_enum_v<T>, int> value`.

	**Типичная ошибка:** Размещать сложное условие в нескольких местах и ухудшать диагностику.

	**Источник:** [Cppreference: enable_if](https://en.cppreference.com/w/cpp/types/enable_if)

172. Для чего применяют `if constexpr` при работе с типами?

	**Ответ:** Он выбирает ветвь на этапе компиляции и не инстанцирует неподходящую ветвь шаблона.

	**Пример:** `if constexpr (std::is_pointer_v<T>) { ... }`.

	**Типичная ошибка:** Использовать обычный `if` и ожидать, что невалидная ветвь не будет компилироваться.

	**Источник:** [Cppreference: if constexpr](https://en.cppreference.com/w/cpp/language/if)

173. Что такое концепты и чем они лучше старых приёмов ограничения типов?

	**Ответ:** Concepts — именованные compile-time требования, которые делают интерфейс и диагностику понятнее, чем вложенный SFINAE.

	**Пример:** `template<std::integral T> T twice(T value);`.

	**Типичная ошибка:** Использовать слишком общий концепт и оставлять неясные требования внутри тела.

	**Источник:** [Cppreference: constraints](https://en.cppreference.com/w/cpp/language/constraints)

174. Как тип влияет на перегрузку функций?

	**Ответ:** Тип аргументов участвует в выборе наиболее подходящей перегрузки с учётом стандартных и пользовательских преобразований.

	**Пример:** `f(int)` выбирается точнее для аргумента типа `int`, чем `f(double)`.

	**Типичная ошибка:** Добавлять перегрузку, которая начинает конфликтовать с существующими преобразованиями.

	**Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

175. Что такое точное совпадение типа при перегрузке?

	**Ответ:** Это ситуация, когда тип аргумента уже совпадает с параметром без преобразования; такой кандидат обычно предпочтительнее.

	**Пример:** `void f(int); f(1);`.

	**Типичная ошибка:** Путать точное совпадение с совпадением после promotion.

	**Источник:** [Cppreference: implicit conversion sequence](https://en.cppreference.com/w/cpp/overload_resolution)

176. Как неявные преобразования влияют на выбор перегруженной функции?

	**Ответ:** Компилятор ранжирует последовательности преобразований; более дешёвая последовательность получает преимущество.

	**Пример:** `f(long)` может проиграть `f(int)` для аргумента `int`.

	**Типичная ошибка:** Надеяться на выбор перегрузки без проверки неоднозначности.

	**Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

177. Почему перегрузки с `int`, `long`, `double` и `unsigned` могут давать неоднозначность?

	**Ответ:** Для некоторых аргументов несколько кандидатов требуют преобразований одинакового ранга.

	**Пример:** Вызов с `short` может подходить и к `int`, и к `unsigned` в зависимости от правил promotion.

	**Типичная ошибка:** Добавлять перегрузки для каждого числового типа без единой стратегии.

	**Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

178. Что такое nullable type?

	**Ответ:** Nullable type может представлять отсутствие значения наряду с обычным значением.

	**Пример:** `int*` может быть `nullptr`.

	**Типичная ошибка:** Документировать nullable-семантику только комментарием.

	**Источник:** [C++ Core Guidelines: pointers](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f23-use-a-not_nullt-to-indicate-that-null-is-not-a-valid-value)

179. Почему указатель считают nullable-типом?

	**Ответ:** Он имеет специальное нулевое значение, не обозначающее объект.

	**Пример:** `if (pointer != nullptr) { use(*pointer); }`.

	**Типичная ошибка:** Разыменовать указатель до проверки.

	**Источник:** [Cppreference: nullptr](https://en.cppreference.com/w/cpp/language/nullptr)

180. Что такое `std::optional<T>` как оболочка над типом?

	**Ответ:** `std::optional<T>` хранит либо значение `T`, либо состояние отсутствия значения.

	**Пример:** `std::optional<int> find_id();`.

	**Типичная ошибка:** Вызвать `.value()` без проверки наличия.

	**Источник:** [Cppreference: optional](https://en.cppreference.com/w/cpp/utility/optional)

181. В чём смысл `std::variant`?

	**Ответ:** `std::variant` представляет безопасное объединение нескольких альтернативных типов и хранит одну активную альтернативу.

	**Пример:** `std::variant<int, std::string> value;`.

	**Типичная ошибка:** Обращаться к неверной альтернативе через `std::get` и получать исключение.

	**Источник:** [Cppreference: variant](https://en.cppreference.com/w/cpp/utility/variant)

182. Когда `std::variant` лучше, чем `union`?

	**Ответ:** Когда нужны разные типы с автоматическим управлением lifetime и проверяемым активным состоянием.

	**Пример:** `std::visit` обрабатывает текущую альтернативу.

	**Типичная ошибка:** Использовать union там, где важна переносимая типобезопасность.

	**Источник:** [Cppreference: variant](https://en.cppreference.com/w/cpp/utility/variant)

183. Для чего нужен `std::any`?

	**Ответ:** `std::any` хранит значение произвольного copyable-типа и позволяет извлечь его с проверкой типа.

	**Пример:** `std::any value = 42; auto number = std::any_cast<int>(value);`.

	**Типичная ошибка:** Использовать `any`, когда известный набор альтернатив лучше описывает API.

	**Источник:** [Cppreference: any](https://en.cppreference.com/w/cpp/utility/any)

184. Чем `std::any` отличается от `std::variant`?

	**Ответ:** `variant` заранее знает закрытый набор типов и проверяется компилятором, а `any` допускает открытый набор и требует runtime-проверки.

	**Пример:** Для `int|string` выбирают `variant`, для plugin payload может подойти `any`.

	**Типичная ошибка:** Жертвовать типобезопасностью ради удобства контейнера.

	**Источник:** [Cppreference: any](https://en.cppreference.com/w/cpp/utility/any)

185. Что такое “сильный тип” и зачем он нужен?

	**Ответ:** Сильный тип выражает отдельное понятие и не допускает случайной подстановки другого значения с тем же представлением.

	**Пример:** `struct UserId { int value; };` отличается от `OrderId`.

	**Типичная ошибка:** Называть псевдоним `using UserId = int` сильным типом.

	**Источник:** [C++ Core Guidelines: type safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#es46-avoid-mixed-เป)

186. Почему иногда лучше создать отдельный тип вместо использования `int`?

	**Ответ:** Отдельный тип предотвращает перепутывание единиц, идентификаторов и состояний на этапе компиляции.

	**Пример:** `Meters` и `Seconds` могут иметь разные операции.

	**Типичная ошибка:** Передавать сырые числа без обозначения единиц измерения.

	**Источник:** [C++ Core Guidelines: type safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#es46-avoid-mixed-types)

187. В каких случаях `bool` — плохой выбор для представления состояния?

	**Ответ:** Когда состояний больше двух или смысл флага неочевиден в вызове функции.

	**Пример:** `enum class ConnectionState { disconnected, connecting, connected };`.

	**Типичная ошибка:** `open(true, false)` без понятного названия параметров.

	**Источник:** [C++ Core Guidelines: enum](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#enum)

188. Почему `enum class` часто лучше набора целых констант?

	**Ответ:** Он группирует значения, предотвращает конфликты имён и случайные числовые преобразования.

	**Пример:** `enum class Mode { read, write };`.

	**Типичная ошибка:** Хранить режимы в `int` и принимать любой номер.

	**Источник:** [Cppreference: enum](https://en.cppreference.com/w/cpp/language/enum)

189. Когда лучше использовать `std::string_view`, а не `std::string`?

	**Ответ:** Когда функция только читает существующий диапазон символов и не должна владеть или копировать его.

	**Пример:** `bool is_keyword(std::string_view word);`.

	**Типичная ошибка:** Сохранить view дольше исходной строки.

	**Источник:** [Cppreference: string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

190. Какие риски связаны со временем жизни данных у `std::string_view`?

	**Ответ:** `string_view` не владеет памятью, поэтому становится висячим после уничтожения или изменения исходной строки.

	**Пример:** Нельзя возвращать view на локальный `std::string`.

	**Типичная ошибка:** Считать view безопасной заменой `std::string` в хранилище.

	**Источник:** [Cppreference: string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

191. Почему signed overflow — это проблема на уровне языка?

	**Ответ:** Переполнение знакового целого не определено стандартом, поэтому компилятор может оптимизировать код, исходя из его невозможности.

	**Пример:** `int max = std::numeric_limits<int>::max(); ++max;` некорректен.

	**Типичная ошибка:** Ожидать перенос бита как у unsigned.

	**Источник:** [Cppreference: arithmetic operators](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

192. Почему unsigned overflow формально допустим, но всё равно опасен?

	**Ответ:** Он определён по модулю, но может нарушить инварианты размера, времени или индекса.

	**Пример:** `std::uint8_t value{255}; ++value;` становится `0`.

	**Типичная ошибка:** Считать defined behavior автоматически корректным бизнес-результатом.

	**Источник:** [Cppreference: integer arithmetic](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

193. Что происходит при сравнении отрицательного `int` с `unsigned`?

	**Ответ:** Отрицательный `int` обычно преобразуется в unsigned и становится большим положительным числом.

	**Пример:** `-1 < 1u` обычно ложно.

	**Типичная ошибка:** Игнорировать предупреждения signed/unsigned comparison.

	**Источник:** [Cppreference: usual arithmetic conversions](https://en.cppreference.com/w/cpp/language/usual_arithmetic_conversions)

194. Почему `auto` с фигурными скобками может вывести неожиданный тип?

	**Ответ:** Copy-list initialization с `auto` может вывести `std::initializer_list`, а direct-list initialization — обычный тип элемента.

	**Пример:** `auto a = {1, 2};` — `initializer_list<int>`, `auto b{1};` — `int`.

	**Типичная ошибка:** Писать `auto x = {1, 2.0};` и ожидать общий numeric type.

	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

195. Чем различаются `auto x = {1};` и `auto x{1};`?

	**Ответ:** Первое обычно выводит `std::initializer_list<int>`, второе — `int`.

	**Пример:** `static_assert(std::is_same_v<decltype(x), int>);` применим ко второй форме.

	**Типичная ошибка:** Считать формы синтаксически взаимозаменяемыми.

	**Источник:** [Cppreference: auto](https://en.cppreference.com/w/cpp/language/auto)

196. Как `decltype((x))` отличается от `decltype(x)`?

	**Ответ:** Для неквалифицированного имени `decltype(x)` использует объявленный тип, а скобки превращают выражение в обычное lvalue-выражение и обычно дают ссылку.

	**Пример:** Для `int x{}` `decltype(x)` — `int`, `decltype((x))` — `int&`.

	**Типичная ошибка:** Добавить скобки в `decltype` и незаметно изменить возвращаемый тип.

	**Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

197. Почему скобки влияют на результат `decltype`?

	**Ответ:** Особое правило действует только для неквалифицированного имени; скобки делают выражение lvalue и включают правила value category.

	**Пример:** `decltype((value))` может использоваться для сохранения ссылки.

	**Типичная ошибка:** Ожидать, что скобки всегда ничего не меняют в type deduction.

	**Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

198. Что такое value category и как она связана с типами?

	**Ответ:** Value category описывает, как выражение связано с объектом: lvalue, xvalue или prvalue; это влияет на связывание ссылок и перегрузку.

	**Пример:** Именованная переменная — lvalue, `std::move(value)` — xvalue.

	**Типичная ошибка:** Считать value category частью самого объявленного типа.

	**Источник:** [Cppreference: value categories](https://en.cppreference.com/w/cpp/language/value_category)

199. Чем lvalue, xvalue и prvalue отличаются в контексте вывода типа?

	**Ответ:** lvalue обозначает устойчивый объект, xvalue — объект, ресурсы которого можно перенести, prvalue — чистое временное значение.

	**Пример:** `T&` связывается с lvalue, `T&&` — с xvalue/prvalue.

	**Типичная ошибка:** Называть любую временную переменную prvalue: имя переменной делает выражение lvalue.

	**Источник:** [Cppreference: value categories](https://en.cppreference.com/w/cpp/language/value_category)

200. Почему выражение имеет не только тип, но и категорию значения?

	**Ответ:** Один и тот же тип может требовать разного обращения: его можно изменять, перемещать или использовать как временный результат.

	**Пример:** Перегрузки `f(T&)` и `f(T&&)` выбираются по категории аргумента.

	**Типичная ошибка:** Анализировать только `decltype` и забывать о категории выражения.

	**Источник:** [Cppreference: value categories](https://en.cppreference.com/w/cpp/language/value_category)

201. Как тип влияет на эффективность передачи параметров?

	**Ответ:** Он определяет стоимость копирования, возможность перемещения, владение и требования к времени жизни.

	**Пример:** Большой `std::vector` обычно передают по ссылке или перемещают.

	**Типичная ошибка:** Выбирать передачу по ссылке только по размеру, игнорируя семантику владения.

	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#fcall-parameter-passing)

202. Когда лучше передавать по значению, а когда по `const T&`?

	**Ответ:** По значению — для дешёвых типов или когда нужна собственная копия; по `const T&` — для чтения потенциально дорогого объекта без копии.

	**Пример:** `void set_name(std::string name)` может затем переместить параметр в поле.

	**Типичная ошибка:** Всегда использовать `const&`, включая `int` и `bool`.

	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#fcall-parameter-passing)

203. Когда имеет смысл передавать по `T&&`?

	**Ответ:** Когда функция принимает временный объект и хочет явно потребить или переместить его ресурс.

	**Пример:** `void consume(std::string&& text);`.

	**Типичная ошибка:** Использовать `T&&` как универсальную оптимизацию без требований к API.

	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

204. Почему выбор типа может влиять на ABI и совместимость модулей?

	**Ответ:** Размер, выравнивание, calling convention и layout типов участвуют в бинарном интерфейсе.

	**Пример:** Замена `std::uint32_t` на тип другой ширины меняет формат ABI.

	**Типичная ошибка:** Менять layout публичной структуры без пересборки зависимых модулей.

	**Источник:** [Cppreference: object representation](https://en.cppreference.com/w/cpp/language/object)

205. В чём разница между типовой безопасностью и удобством неявных преобразований?

	**Ответ:** Неявные преобразования сокращают запись, но могут скрывать ошибочную передачу значения; строгие типы делают ошибку видимой компилятору.

	**Пример:** Сильные типы для `UserId` и `OrderId` предотвращают их смешение.

	**Типичная ошибка:** Добавлять неявные конструкторы только ради удобства вызова.

	**Источник:** [C++ Core Guidelines: type safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#type)

206. Почему тип `bool` иногда приводит к ошибкам в перегрузке?

	**Ответ:** `bool` участвует в числовых преобразованиях, поэтому может неожиданно выбрать перегрузку с `int` или создать неоднозначность.

	**Пример:** `f(bool)` и `f(int)` требуют осмысленного API при вызове с литералами.

	**Типичная ошибка:** Использовать bool-параметры как безымянные режимы.

	**Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

207. Когда стоит предпочесть `std::array<T, N>` обычному массиву `T[N]`?

	**Ответ:** Когда нужен фиксированный размер, но также интерфейс контейнера, копирование, итераторы и совместимость со стандартными алгоритмами.

	**Пример:** `std::array<int, 3> values{1, 2, 3};`.

	**Типичная ошибка:** Использовать C-массив и терять размер при передаче функции.

	**Источник:** [Cppreference: array](https://en.cppreference.com/w/cpp/container/array)

208. Чем `std::array` полезнее с точки зрения типа?

	**Ответ:** Размер `N` является частью типа, а объект предоставляет `size()`, итераторы и стандартный интерфейс контейнера.

	**Пример:** `std::tuple_size_v<decltype(values)>` равен `N`.

	**Типичная ошибка:** Считать `std::array` динамическим контейнером.

	**Источник:** [Cppreference: std::array](https://en.cppreference.com/w/cpp/container/array)

209. Как выбрать подходящий целочисленный тип для счётчика, индекса и размера?

	**Ответ:** Используйте обычный signed тип для локальной арифметики, `size_t` для размеров API контейнеров, а фиксированный тип — для внешнего формата или ABI.

	**Пример:** Размер файла в протоколе — `std::uint64_t`, индекс `vector` — `std::size_t`.

	**Типичная ошибка:** Использовать unsigned в цикле, который должен корректно идти ниже нуля.

	**Источник:** [C++ Core Guidelines: integer types](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#es107-dont-use-unsigned-for-subscripts-prefer-gslindex)

210. По каким принципам вы бы выбирали типы в новом C++-проекте для безопасности читаемости и переносимости?

	**Ответ:** Выбирайте тип по смыслу, владению, диапазону и точности; ограничивайте неявные преобразования, используйте стандартные контейнеры и фиксированные типы на границах системы.

	**Пример:** `std::string_view` для невладеющего чтения, `std::string` для владения, `enum class` для режимов.

	**Типичная ошибка:** Выбирать тип только по минимальному размеру или привычке.

	**Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

[<- Prev](./01_base.md)         [Next ->](./03_pointers.md)
