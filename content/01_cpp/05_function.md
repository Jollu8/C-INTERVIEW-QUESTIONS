# Функции

## Лёгкий уровень

1. Что такое функция в C++?

	**Ответ:** Функция — именованный блок кода с параметрами и, возможно, возвращаемым результатом.

	**Источник:** [Cppreference: functions](https://en.cppreference.com/w/cpp/language/functions)

2. Для чего нужны функции в программе?

	**Ответ:** Функции выделяют самостоятельные операции, уменьшают дублирование и позволяют повторно использовать код.

	**Источник:** [Cppreference: functions](https://en.cppreference.com/w/cpp/language/functions)

3. Чем функция отличается от обычного блока кода?

	**Ответ:** У функции есть собственное имя, параметры, тип результата и отдельный контекст вызова; блок сам по себе вызываемым объектом не является.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

4. Что такое вызов функции?

	**Ответ:** Вызов передаёт управление телу функции и передаёт ей вычисленные аргументы.

	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

5. Что такое имя функции?

	**Ответ:** Это идентификатор, которым обозначают функцию в объявлениях и выражениях вызова.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

6. Что такое сигнатура функции?

	**Ответ:** В практическом смысле это имя и набор параметров, по которым компилятор различает перегрузки; возвращаемый тип сам по себе перегрузку не образует.

	**Источник:** [Cppreference: function overloading](https://en.cppreference.com/w/cpp/language/overload_resolution)

7. Что такое тип возвращаемого значения функции?

	**Ответ:** Это тип результата, который функция обязана вернуть, если он не `void`.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

8. Для чего функции нужен возвращаемый тип?

	**Ответ:** Он описывает тип результата для проверки вызова и выбора допустимых преобразований.

	**Источник:** [Cppreference: return statement](https://en.cppreference.com/w/cpp/language/return)

9. Что означает `void` у функции?

	**Ответ:** `void` означает, что функция не возвращает значения.

	**Источник:** [Cppreference: void type](https://en.cppreference.com/w/cpp/language/types)

10. Что делает оператор `return`?

	**Ответ:** Он завершает выполнение текущей функции и, если указан операнд, передаёт результат вызывающему коду.

	**Источник:** [Cppreference: return statement](https://en.cppreference.com/w/cpp/language/return)

11. Можно ли использовать `return` в функции с типом `void`?

	**Ответ:** Да, можно написать `return;` для немедленного завершения функции.

	**Источник:** [Cppreference: return statement](https://en.cppreference.com/w/cpp/language/return)

12. Что такое параметры функции?

	**Ответ:** Параметры — локальные имена и типы, объявленные в списке функции для получения входных данных.

	**Источник:** [Cppreference: function parameter](https://en.cppreference.com/w/cpp/language/function)

13. Что такое аргументы функции?

	**Ответ:** Аргументы — выражения, переданные при конкретном вызове функции.

	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

14. Чем параметры отличаются от аргументов?

	**Ответ:** Параметры задаются в объявлении функции, а аргументы — в месте её вызова.

	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

15. Как объявить функцию без параметров?

	**Ответ:** Например: `int read_value();` — список `()` означает отсутствие параметров в C++.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

16. Как объявить функцию с одним параметром?

	**Ответ:** Укажите тип и имя параметра, например `void print(int value);`.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

17. Как объявить функцию с несколькими параметрами?

	**Ответ:** Параметры перечисляют через запятую, например `int add(int left, int right);`.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

18. Что такое определение функции?

	**Ответ:** Определение содержит объявление функции и её тело, то есть реализацию.

	**Источник:** [Cppreference: function definition](https://en.cppreference.com/w/cpp/language/function)

19. Что такое объявление функции?

	**Ответ:** Объявление сообщает компилятору имя функции, параметры и возвращаемый тип без обязательного тела.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

20. Чем объявление функции отличается от её определений?

	**Ответ:** Объявление вводит интерфейс, а определение дополнительно содержит тело функции.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

21. Что такое прототип функции?

	**Ответ:** Прототип — объявление, описывающее сигнатуру функции до её вызова или определения.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

22. Зачем нужен прототип функции?

	**Ответ:** Он позволяет компилятору проверить аргументы и тип результата при вызове функции, определённой позже.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

23. Можно ли вызвать функцию до её определения?

	**Ответ:** Да, если до вызова доступно корректное объявление функции.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

24. Когда компилятору достаточно только объявления функции?

	**Ответ:** Для компиляции вызова достаточно объявления; определение понадобится линкеру, если функция действительно используется.

	**Источник:** [Cppreference: translation unit](https://en.cppreference.com/w/cpp/language/translation_units)

25. Что делает функция `main()`?

	**Ответ:** В hosted-программе `main` является определённой стандартом точкой входа и возвращает код завершения среды выполнения.

	**Источник:** [Cppreference: main function](https://en.cppreference.com/w/cpp/language/main_function)

26. Почему `main()` считается особенной функцией?

	**Ответ:** Её вызывает среда выполнения, и для неё действуют специальные правила сигнатуры и завершения программы.

	**Источник:** [Cppreference: main function](https://en.cppreference.com/w/cpp/language/main_function)

27. Можно ли вызывать одну функцию из другой?

	**Ответ:** Да, если вызывающая функция видит объявление вызываемой функции.

	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

28. Можно ли вызывать функцию несколько раз?

	**Ответ:** Да, каждый вызов создаёт новый экземпляр контекста выполнения функции, кроме состояния объектов со специальным lifetime.

	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

29. Что происходит при каждом вызове функции?

	**Ответ:** Вычисляются аргументы, создаются параметры и локальные объекты, выполняется тело, затем управление и результат возвращаются вызывающему коду.

	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

30. Где “живут” локальные переменные функции?

	**Ответ:** Они имеют автоматическую длительность хранения, если не объявлены иначе; конкретное физическое размещение стандарт не гарантирует.

	**Источник:** [Cppreference: storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

31. Что такое локальная переменная функции?

	**Ответ:** Это переменная, объявленная внутри тела функции или её блока и доступная только в соответствующей области видимости.

	**Источник:** [Cppreference: scope](https://en.cppreference.com/w/cpp/language/scope)

32. Что такое область видимости параметров функции?

	**Ответ:** Параметр доступен от точки объявления до конца тела функции, а в определённых конструкциях также участвует в области объявления функции.

	**Источник:** [Cppreference: scope](https://en.cppreference.com/w/cpp/language/scope)

33. Когда создаются параметры функции?

	**Ответ:** Параметры инициализируются при входе в функцию значениями соответствующих аргументов.

	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

34. Когда уничтожаются параметры функции?

	**Ответ:** Параметры с автоматической длительностью уничтожаются при выходе из функции.

	**Источник:** [Cppreference: storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

35. Можно ли внутри функции объявить переменную с тем же именем, что и снаружи?

	**Ответ:** Да, локальное объявление скроет внешнее имя в своей области видимости.

	**Источник:** [Cppreference: scope](https://en.cppreference.com/w/cpp/language/scope)

36. Что такое тело функции?

	**Ответ:** Тело — составной оператор, содержащий инструкции, локальные объявления и управляющую логику функции.

	**Источник:** [Cppreference: function definition](https://en.cppreference.com/w/cpp/language/function)

37. Что такое инструкция `return expression;`?

	**Ответ:** Она вычисляет `expression`, инициализирует им результат функции и завершает текущий вызов.

	**Источник:** [Cppreference: return statement](https://en.cppreference.com/w/cpp/language/return)

38. Что произойдёт, если функция с ненулевым возвращаемым типом не вернёт значение?

	**Ответ:** Если управление дойдёт до конца такой функции, поведение неопределено, кроме специальных правил для `main` и некоторых других случаев.

	**Источник:** [Cppreference: return statement](https://en.cppreference.com/w/cpp/language/return)

39. Можно ли иметь несколько `return` в одной функции?

	**Ответ:** Да, это обычный способ завершать функцию из разных ветвей управления.

	**Источник:** [Cppreference: return statement](https://en.cppreference.com/w/cpp/language/return)

40. Когда это бывает удобно?

	**Ответ:** Несколько `return` удобны для раннего выхода при ошибке, пустом результате или выполненном условии.

	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

41. Что такое функция, ничего не принимающая и ничего не возвращающая?

	**Ответ:** Это функция с пустым списком параметров и типом `void`, например `void reset();`.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

42. Что такое функция, принимающая аргументы, но ничего не возвращающая?

	**Ответ:** Это функция с параметрами и возвращаемым типом `void`, например `void log(int code);`.

	**Источник:** [Cppreference: void type](https://en.cppreference.com/w/cpp/language/types)

43. Что такое функция, не принимающая аргументы, но возвращающая значение?

	**Ответ:** Это функция с пустым списком параметров и ненулевым типом результата, например `int size();`.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

44. Что такое функция, принимающая аргументы и возвращающая результат?

	**Ответ:** Это функция, которая получает параметры и формирует значение указанного возвращаемого типа, например `int add(int, int);`.

	**Источник:** [Cppreference: function declaration](https://en.cppreference.com/w/cpp/language/function)

45. Почему функции улучшают читаемость программы?

	**Ответ:** Хорошо названная функция скрывает детали реализации и делает намерение участка программы явным.

	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

46. Почему функции уменьшают дублирование кода?

	**Ответ:** Общую операцию реализуют один раз и вызывают из нескольких мест.

	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

47. Что такое повторное использование кода через функции?

	**Ответ:** Это вызов одной реализации с разными аргументами в разных частях программы.

	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

48. Что такое “одна функция — одна задача”?

	**Ответ:** Это принцип, по которому функция имеет одну ясную ответственность и одну причину для изменения.

	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

49. Почему слишком большие функции неудобны?

	**Ответ:** Их сложнее читать, тестировать, переиспользовать и безопасно изменять из-за большого числа взаимосвязанных обязанностей.

	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

50. По каким признакам можно понять, что функцию стоит разбить на несколько?

	**Ответ:** На это указывают несколько независимых обязанностей, глубокая вложенность, длинные ветвления, дублирование и трудность изолированного тестирования.

	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

## Ниже среднего уровня

51. Что такое передача аргумента по значению?

	**Ответ:** Функция получает собственную копию значения аргумента.
	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

52. Что происходит с параметром при передаче по значению?

	**Ответ:** Параметр инициализируется значением аргумента и существует независимо от исходного объекта.
	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

53. Можно ли изменить исходную переменную через параметр, переданный по значению?

	**Ответ:** Нет, изменение копии не изменяет исходную переменную.
	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

54. Что такое передача по ссылке?

	**Ответ:** Параметр-ссылка становится другим именем переданного объекта и позволяет работать с ним напрямую.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

55. Чем передача по ссылке отличается от передачи по значению?

	**Ответ:** Ссылка не создаёт копию и может изменить исходный объект, если не является `const`.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

56. Что такое передача по указателю?

	**Ответ:** Функции передают значение указателя, через которое она может обратиться к объекту или проверить `nullptr`.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

57. Когда удобно передавать аргумент по указателю?

	**Ответ:** Когда отсутствие объекта допустимо, требуется переназначаемый адрес или явно выражается работа с указателем.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

58. Когда удобно передавать аргумент по ссылке?

	**Ответ:** Когда аргумент обязателен и функция должна работать с существующим объектом без копирования.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

59. Что такое `const`-ссылка в параметре функции?

	**Ответ:** Это ссылка, через которую нельзя изменять объект; она также может привязываться к временным значениям.
	**Источник:** [Cppreference: reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

60. Почему `const T&` часто используют для больших объектов?

	**Ответ:** Она передаёт объект без копирования и запрещает функции менять исходное значение.
	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

61. Чем `T&` отличается от `const T&`?

	**Ответ:** `T&` допускает изменение объекта и требует подходящего lvalue, а `const T&` запрещает изменение и принимает временные значения.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

62. Что такое выходной параметр функции?

	**Ответ:** Это параметр, через который функция записывает результат вместо или в дополнение к `return`.
	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

63. Почему выходные параметры часто ухудшают читаемость?

	**Ответ:** По месту вызова не всегда видно, какие аргументы изменятся и сколько результатов функция возвращает.
	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

64. Когда лучше вернуть результат через `return`, а не через параметр?

	**Ответ:** Когда результат один или его можно выразить объектом значения, поскольку такой интерфейс проще читать и тестировать.
	**Источник:** [C++ Core Guidelines: return values](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

65. Можно ли вернуть несколько значений из функции?

	**Ответ:** Да, например через `struct`, `std::pair`, `std::tuple` или специальный тип результата.
	**Источник:** [Cppreference: structured binding](https://en.cppreference.com/w/cpp/language/structured_binding)

66. Какие способы вернуть несколько значений существуют в C++?

	**Ответ:** Используют структуру результата, `std::pair`, `std::tuple`, контейнер или параметры-выходы.
	**Источник:** [Cppreference: tuple](https://en.cppreference.com/w/cpp/utility/tuple)

67. Что такое функция с параметрами по умолчанию?

	**Ответ:** Это функция, для некоторых параметров которой задано значение, используемое при отсутствии аргумента.
	**Источник:** [Cppreference: default arguments](https://en.cppreference.com/w/cpp/language/default_arguments)

68. Как объявить параметр по умолчанию?

	**Ответ:** Значение указывают после `=` в объявлении, например `void log(int level = 1);`.
	**Источник:** [Cppreference: default arguments](https://en.cppreference.com/w/cpp/language/default_arguments)

69. Где обычно указывают значения по умолчанию — в объявлении или в определении?

	**Ответ:** Обычно в доступном вызывающему коду объявлении, часто в заголовочном файле; повторно в определении их не задают.
	**Источник:** [Cppreference: default arguments](https://en.cppreference.com/w/cpp/language/default_arguments)

70. Какие ограничения есть у параметров по умолчанию?

	**Ответ:** После параметра со значением по умолчанию обязательные параметры обычно недопустимы, а аргумент должен быть допустимым выражением.
	**Источник:** [Cppreference: default arguments](https://en.cppreference.com/w/cpp/language/default_arguments)

71. Почему параметры по умолчанию должны идти в конце списка параметров?

	**Ответ:** Иначе вызов без аргумента был бы неоднозначен: компилятор не знал бы, какой параметр пропущен.
	**Источник:** [Cppreference: default arguments](https://en.cppreference.com/w/cpp/language/default_arguments)

72. Что такое перегрузка функций?

	**Ответ:** Это наличие нескольких функций с одним именем, но различающимися списками параметров.
	**Источник:** [Cppreference: function overloading](https://en.cppreference.com/w/cpp/language/overload_resolution)

73. Когда функции считаются перегруженными?

	**Ответ:** Когда их объявления находятся в одной области и отличаются типами, количеством или категориями параметров.
	**Источник:** [Cppreference: function overloading](https://en.cppreference.com/w/cpp/language/overload_resolution)

74. Можно ли перегрузить функции только по возвращаемому типу?

	**Ответ:** Нет, возвращаемый тип не участвует в выборе перегрузки.
	**Источник:** [Cppreference: function overloading](https://en.cppreference.com/w/cpp/language/overload_resolution)

75. Почему нельзя перегружать только по возвращаемому типу?

	**Ответ:** Вызов без контекста результата не давал бы однозначного способа выбрать функцию.
	**Источник:** [Cppreference: function overloading](https://en.cppreference.com/w/cpp/language/overload_resolution)
76. Как компилятор выбирает нужную перегрузку?

	**Ответ:** Он строит множество кандидатов и выбирает лучшую последовательность неявных преобразований.
	**Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

77. Что такое неоднозначность при перегрузке?

	**Ответ:** Это ситуация, когда несколько кандидатов одинаково хорошо подходят вызову и выбрать один нельзя.
	**Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

78. Как неявные преобразования влияют на выбор перегруженной функции?

	**Ответ:** Предпочтение получает перегрузка с лучшей последовательностью преобразований, например без преобразования вместо пользовательского.
	**Источник:** [Cppreference: implicit conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion)

79. Почему перегрузка с `int`, `double` и `long` может быть опасной?

	**Ответ:** Один аргумент может одинаково подходить нескольким числовым перегрузкам после преобразований, что создаёт неоднозначность или неожиданный выбор.
	**Источник:** [Cppreference: overload resolution](https://en.cppreference.com/w/cpp/language/overload_resolution)

80. Что такое inline-функция?

	**Ответ:** `inline` разрешает одинаковое определение функции в нескольких единицах трансляции и не требует обязательной подстановки тела.
	**Источник:** [Cppreference: inline specifier](https://en.cppreference.com/w/cpp/language/inline)

81. Что означает `inline` с точки зрения языка?

	**Ответ:** Он задаёт правила ODR для функции и её определения, а не приказ компилятору встраивать вызов.
	**Источник:** [Cppreference: inline specifier](https://en.cppreference.com/w/cpp/language/inline)

82. Гарантирует ли `inline` реальную подстановку тела функции?

	**Ответ:** Нет, решение о встраивании принимает оптимизатор независимо от ключевого слова.
	**Источник:** [Cppreference: inline specifier](https://en.cppreference.com/w/cpp/language/inline)

83. Для чего `inline` важен помимо оптимизации?

	**Ответ:** Он позволяет определить функцию в заголовке и включить это определение в несколько единиц трансляции без нарушения ODR.
	**Источник:** [Cppreference: inline specifier](https://en.cppreference.com/w/cpp/language/inline)

84. Что такое рекурсивная функция?

	**Ответ:** Это функция, которая прямо или косвенно вызывает саму себя.
	**Источник:** [Cppreference: recursion](https://en.cppreference.com/w/cpp/language/function)

85. Что такое рекурсия?

	**Ответ:** Рекурсия — решение задачи через вызов той же функции для меньшего или более простого экземпляра задачи.
	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

86. Что такое базовый случай рекурсии?

	**Ответ:** Это условие, при котором функция прекращает рекурсивные вызовы и возвращает результат напрямую.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

87. Что такое рекурсивный случай?

	**Ответ:** Это ветвь, которая вызывает функцию снова с аргументом, приближающимся к базовому случаю.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

88. Что произойдёт, если в рекурсии нет условия остановки?

	**Ответ:** Вызовы будут продолжаться до исчерпания стека и обычно завершатся ошибкой переполнения стека.
	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

89. Что такое глубина рекурсии?

	**Ответ:** Это максимальное число одновременно активных рекурсивных вызовов.
	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

90. Чем рекурсия отличается от цикла?

	**Ответ:** Рекурсия использует вложенные вызовы и стек, а цикл повторяет тело в рамках одного вызова.
	**Источник:** [Cppreference: statements](https://en.cppreference.com/w/cpp/language/statements)

91. Когда рекурсия удобнее цикла?

	**Ответ:** Когда структура задачи естественно рекурсивна, например дерево, граф или рекурсивное разбиение.
	**Источник:** [Cppreference: statements](https://en.cppreference.com/w/cpp/language/statements)

92. Когда цикл удобнее рекурсии?

	**Ответ:** Когда повторение линейное и важны предсказуемое использование стека и отсутствие вложенных вызовов.
	**Источник:** [Cppreference: statements](https://en.cppreference.com/w/cpp/language/statements)

93. Что такое хвостовая рекурсия?

	**Ответ:** Это рекурсия, в которой рекурсивный вызов является последней операцией функции.
	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

94. Гарантирует ли C++ оптимизацию хвостовой рекурсии?

	**Ответ:** Нет, стандарт C++ не требует обязательного устранения хвостовых вызовов.
	**Источник:** [Cppreference: compiler support](https://en.cppreference.com/w/cpp/compiler_support)

95. Что такое статическая локальная переменная в функции?

	**Ответ:** Это локальная переменная со статической длительностью хранения и областью видимости внутри функции.
	**Источник:** [Cppreference: storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

96. Когда создаётся локальная `static`-переменная?

	**Ответ:** Её инициализация происходит при первом прохождении объявления, если она не была инициализирована ранее.
	**Источник:** [Cppreference: storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

97. Сколько раз инициализируется локальная `static`-переменная?

	**Ответ:** Один раз за время существования программы, после чего сохраняет своё значение между вызовами.
	**Источник:** [Cppreference: storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

98. Как локальная `static`-переменная влияет на поведение функции?

	**Ответ:** Она добавляет скрытое сохраняемое состояние, поэтому результат может зависеть от предыдущих вызовов.
	**Источник:** [Cppreference: storage duration](https://en.cppreference.com/w/cpp/language/storage_duration)

99. Почему функции со скрытым состоянием сложнее тестировать?

	**Ответ:** Их результат зависит не только от текущих аргументов, но и от порядка предыдущих вызовов.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

100. Что такое чистая функция в общем смысле?

	**Ответ:** Это функция без наблюдаемых побочных эффектов, результат которой определяется только входными значениями.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

## Средний уровень

101. Что такое чистая функция в стиле функционального программирования?

	**Ответ:** Это функция без побочных эффектов, всегда возвращающая один результат для одинаковых входов.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

102. Какие свойства обычно есть у чистой функции?

	**Ответ:** Детерминированность, отсутствие наблюдаемого изменения внешнего состояния и зависимость результата только от аргументов.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

103. Почему чистые функции легче тестировать?

	**Ответ:** Их можно проверять независимо от глобального состояния, времени, ввода-вывода и порядка выполнения тестов.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

104. Что такое побочный эффект функции?

	**Ответ:** Это наблюдаемое изменение состояния или взаимодействие с внешним миром помимо возврата результата.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

105. Какие действия считаются побочными эффектами?

	**Ответ:** Запись в глобальные данные, изменение аргументов, ввод-вывод, работу с файлами, сетью и синхронизацию.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

106. Почему ввод-вывод считается побочным эффектом?

	**Ответ:** Результат и состояние операции зависят от внешнего устройства или среды, а не только от аргументов функции.
	**Источник:** [Cppreference: iostream](https://en.cppreference.com/w/cpp/io)

107. Почему изменение глобальной переменной — это побочный эффект?

	**Ответ:** Оно изменяет состояние, доступное другим частям программы и последующим вызовам.
	**Источник:** [C++ Core Guidelines: globals](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

108. Что такое детерминированная функция?

	**Ответ:** Это функция, которая при одинаковом состоянии и аргументах даёт один и тот же результат.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

109. Чем детерминированная функция отличается от недетерминированной?

	**Ответ:** Недетерминированная зависит от факторов вроде времени, случайности, глобального состояния или внешнего ввода.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

110. Что такое функция без состояния?

	**Ответ:** Это функция, не хранящая данные между вызовами и использующая только параметры и локальные значения.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

111. Почему отсутствие состояния облегчает сопровождение кода?

	**Ответ:** Поведение легче предсказать, тесты меньше зависят от порядка запуска, а зависимости видны в интерфейсе.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

112. Что такое идемпотентность функции?

	**Ответ:** Повторное применение операции к уже обработанному результату не меняет итоговое состояние.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

113. Всегда ли чистая функция идемпотентна?

	**Ответ:** Нет. Чистая функция может возвращать разные значения при разных входах, даже если не меняет состояние.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

114. Всегда ли идемпотентная функция является чистой?

	**Ответ:** Нет. Операция может быть идемпотентной, но всё равно выполнять ввод-вывод или менять внешнее состояние.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

115. Что такое композиция функций?

	**Ответ:** Это построение новой операции, в которой результат одной функции становится входом другой.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

116. Почему композиция считается важной идеей функционального программирования?

	**Ответ:** Она позволяет собирать сложное поведение из небольших независимо проверяемых операций.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

117. Что значит “результат одной функции передаётся в другую”?

	**Ответ:** Вызов первой функции вычисляется и его результат используется как аргумент последующего вызова.
	**Источник:** [Cppreference: function call](https://en.cppreference.com/w/cpp/language/operator_other)

118. Что такое функция высшего порядка?

	**Ответ:** Это функция, принимающая callable-объект, возвращающая его или делающая и то и другое.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

119. Какая функция называется функцией высшего порядка?

	**Ответ:** Любая функция, для которой другая функция или callable является входом либо результатом.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

120. Почему функции высшего порядка важны в C++?

	**Ответ:** Они позволяют обобщать алгоритмы, передавая стратегию обработки данных отдельно от обхода.
	**Источник:** [Cppreference: algorithms](https://en.cppreference.com/w/cpp/algorithm)

121. Что такое указатель на функцию?

	**Ответ:** Это указатель, содержащий адрес функции определённого типа и вызываемый через оператор `()`.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

122. Как объявить указатель на функцию?

	**Ответ:** Например: `int (*operation)(int, int) = nullptr;`.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

123. Как вызвать функцию через указатель на функцию?

	**Ответ:** Передайте аргументы через указатель: `operation(1, 2)` или `(*operation)(1, 2)`.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

124. В каких случаях используют указатели на функции?

	**Ответ:** Для простых callback-интерфейсов, таблиц диспетчеризации и выбора алгоритма во время выполнения.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

125. Что такое ссылка на функцию?

	**Ответ:** Это ссылка, привязанная к функции и вызываемая без копирования адреса функции.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

126. Чем ссылка на функцию отличается от указателя на функцию?

	**Ответ:** Ссылка должна быть привязана к функции и не бывает null, а указатель может быть null и переназначаться.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

127. Что такое тип функции?

	**Ответ:** Это тип, описывающий возвращаемый тип и параметры функции без указания объекта-владельца.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

128. Чем тип функции отличается от указателя на функцию?

	**Ответ:** Тип функции описывает саму сигнатуру, а указатель — объект, который хранит адрес функции этой сигнатуры.
	**Источник:** [Cppreference: pointer](https://en.cppreference.com/w/cpp/language/pointer)

129. Можно ли передавать функцию как аргумент в другую функцию?

	**Ответ:** Да, через указатель, ссылку, шаблонный callable-параметр или `std::function`.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

130. Можно ли возвращать функцию из функции напрямую?

	**Ответ:** Сам объект типа функции вернуть нельзя, но можно вернуть указатель, ссылку или объект-замыкание.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

131. Почему напрямую вернуть “саму функцию” нельзя, но можно вернуть указатель или объект-функтор?

	**Ответ:** Функция не является обычным объектом-значением, тогда как указатель и функтор имеют объектный тип.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

132. Что такое функтор в C++?

	**Ответ:** Функтор — объект, который можно вызвать как функцию, обычно благодаря перегруженному `operator()`.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

133. Какой объект называют функциональным объектом?

	**Ответ:** Любой объект, поддерживающий синтаксис вызова: функцию, указатель, лямбду, функтор или `std::function`.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

134. Что такое перегрузка `operator()`?

	**Ответ:** Это определение операции вызова для объекта класса.
	**Источник:** [Cppreference: operators](https://en.cppreference.com/w/cpp/language/operators)

135. Почему объект с `operator()` может вести себя как функция?

	**Ответ:** Выражение `object(args)` преобразуется в вызов его перегруженного оператора.
	**Источник:** [Cppreference: operators](https://en.cppreference.com/w/cpp/language/operators)

136. Чем функтор отличается от обычной функции?

	**Ответ:** Функтор является объектом и может хранить состояние, тогда как обычная функция сама состояния не хранит.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

137. Когда функтор удобнее, чем указатель на функцию?

	**Ответ:** Когда callback должен хранить настройки, состояние или иметь несколько вариантов поведения через перегрузку.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

138. Может ли функтор хранить состояние?

	**Ответ:** Да, его поля хранят состояние между вызовами объекта.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

139. Что такое лямбда-выражение?

	**Ответ:** Это выражение, создающее безымянный объект-замыкание с заданными параметрами, захватами и телом.
	**Источник:** [Cppreference: lambda expression](https://en.cppreference.com/w/cpp/language/lambda)

140. Для чего в C++ нужны лямбды?

	**Ответ:** Они позволяют кратко передавать локальное поведение в алгоритмы, callback-и и другие функции.
	**Источник:** [Cppreference: lambda expression](https://en.cppreference.com/w/cpp/language/lambda)

141. Как выглядит простейшая лямбда без параметров?

	**Ответ:** Например: `[] { return 42; }`.
	**Источник:** [Cppreference: lambda expression](https://en.cppreference.com/w/cpp/language/lambda)

142. Как выглядит лямбда с параметрами?

	**Ответ:** Например: `[](int value) { return value * 2; }`.
	**Источник:** [Cppreference: lambda expression](https://en.cppreference.com/w/cpp/language/lambda)

143. Как указать возвращаемый тип у лямбды явно?

	**Ответ:** После списка параметров используют trailing return type: `[](int value) -> long { return value; }`.
	**Источник:** [Cppreference: lambda expression](https://en.cppreference.com/w/cpp/language/lambda)

144. Что такое список захвата в лямбде?

	**Ответ:** Это часть `[]`, определяющая, какие внешние локальные имена доступны объекту-замыканию.
	**Источник:** [Cppreference: lambda capture](https://en.cppreference.com/w/cpp/language/lambda)

145. Что означает захват `[ ]`?

	**Ответ:** Пустой список означает, что лямбда ничего из внешней области видимости не захватывает.
	**Источник:** [Cppreference: lambda capture](https://en.cppreference.com/w/cpp/language/lambda)

146. Что означает захват `[=]`?

	**Ответ:** Это неявный захват используемых локальных сущностей по значению.
	**Источник:** [Cppreference: lambda capture](https://en.cppreference.com/w/cpp/language/lambda)

147. Что означает захват `[&]`?

	**Ответ:** Это неявный захват используемых локальных сущностей по ссылке.
	**Источник:** [Cppreference: lambda capture](https://en.cppreference.com/w/cpp/language/lambda)

148. Чем захват по значению отличается от захвата по ссылке?

	**Ответ:** Значение хранит копию состояния, а ссылка обращается к исходному объекту и требует, чтобы его lifetime был достаточным.
	**Источник:** [Cppreference: lambda capture](https://en.cppreference.com/w/cpp/language/lambda)

149. Можно ли смешивать разные способы захвата?

	**Ответ:** Да, например `[&, limit]` захватывает остальные используемые объекты по ссылке, а `limit` — по значению.
	**Источник:** [Cppreference: lambda capture](https://en.cppreference.com/w/cpp/language/lambda)

150. Почему lifetime захваченных объектов важен для корректности лямбд?

	**Ответ:** Лямбда с захватом по ссылке становится некорректной, если вызывается после уничтожения захваченного объекта.
	**Источник:** [Cppreference: lambda capture](https://en.cppreference.com/w/cpp/language/lambda)

## Выше среднего уровня

151. Что такое замыкание (closure)?

	**Ответ:** Замыкание — объект, содержащий лямбда-тело и захваченное им состояние.
	**Источник:** [Cppreference: lambda expression](https://en.cppreference.com/w/cpp/language/lambda)

152. Почему лямбда с захватом создаёт объект-замыкание?

	**Ответ:** Захваченные значения нужно где-то хранить, поэтому компилятор создаёт уникальный объектный тип.
	**Источник:** [Cppreference: lambda expression](https://en.cppreference.com/w/cpp/language/lambda)

153. Есть ли у каждой лямбды свой уникальный тип?

	**Ответ:** Да, каждая лямбда имеет уникальный безымянный тип замыкания.
	**Источник:** [Cppreference: lambda expression](https://en.cppreference.com/w/cpp/language/lambda)

154. Почему тип лямбды нельзя обычно записать вручную?

	**Ответ:** Его имя не задаётся в исходном коде, поэтому используют `auto`, шаблонный параметр или `std::function`.
	**Источник:** [Cppreference: lambda expression](https://en.cppreference.com/w/cpp/language/lambda)

155. Как `auto` помогает работать с лямбдами?

	**Ответ:** `auto` выводит уникальный тип замыкания без необходимости знать его имя.
	**Источник:** [Cppreference: type deduction](https://en.cppreference.com/w/cpp/language/auto)

156. Что такое обобщённая лямбда?

	**Ответ:** Это лямбда с параметрами `auto`, для которых компилятор создаёт шаблонный вызов.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

157. Что означает параметр `auto` в лямбде?

	**Ответ:** Тип параметра выводится отдельно для каждого вызова, как у шаблонной функции.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

158. Чем обобщённая лямбда похожа на шаблонную функцию?

	**Ответ:** Обе позволяют одному телу работать с разными типами, известными при компиляции.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

159. Что такое `mutable` у лямбды?

	**Ответ:** Он разрешает изменять поля, содержащие значения, захваченные по значению.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

160. Когда нужен `mutable` при захвате по значению?

	**Ответ:** Когда тело должно менять собственную копию захваченного значения между вызовами.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

161. Что можно и что нельзя изменять внутри обычной лямбды без `mutable`?

	**Ответ:** Нельзя изменять захваченные по значению копии, но можно менять захваченные по ссылке объекты при наличии прав доступа.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

162. Можно ли лямбду сохранить в переменную?

	**Ответ:** Да, обычно её сохраняют в переменную с `auto` или совместимый type-erased тип.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

163. Можно ли передать лямбду в алгоритм STL?

	**Ответ:** Да, алгоритмы принимают callable-предикаты и операции, включая лямбды.
	**Источник:** [Cppreference: algorithms](https://en.cppreference.com/w/cpp/algorithm)

164. Что такое `std::function`?

	**Ответ:** Это type-erased объект-обёртка, способная хранить вызываемый объект заданной сигнатуры.
	**Источник:** [Cppreference: std::function](https://en.cppreference.com/w/cpp/utility/functional/function)

165. Для чего нужен `std::function`?

	**Ответ:** Он предоставляет единый тип для хранения и передачи разных совместимых callable-объектов.
	**Источник:** [Cppreference: std::function](https://en.cppreference.com/w/cpp/utility/functional/function)

166. Чем `std::function` отличается от указателя на функцию?

	**Ответ:** `std::function` хранит также лямбды и функторы, может владеть состоянием и обычно имеет дополнительные накладные расходы.
	**Источник:** [Cppreference: std::function](https://en.cppreference.com/w/cpp/utility/functional/function)

167. Почему `std::function` может хранить и обычную функцию, и лямбду, и функтор?

	**Ответ:** Он стирает конкретный тип callable и сохраняет только требуемую сигнатуру вызова.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

168. В чём цена удобства `std::function`?

	**Ответ:** Возможны косвенный вызов, динамическое выделение и потеря части оптимизаций по сравнению с шаблонным callable-параметром.
	**Источник:** [Cppreference: std::function](https://en.cppreference.com/w/cpp/utility/functional/function)

169. Когда лучше использовать шаблонный параметр callable вместо `std::function`?

	**Ответ:** В горячем или обобщённом коде, когда конкретный тип известен на этапе компиляции и нужна максимальная оптимизация.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

170. Что такое callable-объект в C++?

	**Ответ:** Это сущность, которую можно вызвать синтаксисом `()`, включая функции, указатели, лямбды и функторы.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

171. Какие сущности в C++ можно вызвать как функцию?

	**Ответ:** Функции, указатели и ссылки на функции, объекты с `operator()`, лямбды, `std::function` и указатели на методы.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

172. Что такое predicate в алгоритмах STL?

	**Ответ:** Это callable, возвращающий значение, интерпретируемое как истина или ложь.
	**Источник:** [Cppreference: named requirements](https://en.cppreference.com/w/cpp/named_req/Predicate)

173. Какие стандартные алгоритмы принимают предикаты?

	**Ответ:** Например, `find_if`, `count_if`, `remove_if`, `all_of`, `any_of`, `none_of` и `sort` с компаратором.
	**Источник:** [Cppreference: algorithms](https://en.cppreference.com/w/cpp/algorithm)

174. Что такое унарный предикат?

	**Ответ:** Это предикат, принимающий один аргумент.
	**Источник:** [Cppreference: named requirements](https://en.cppreference.com/w/cpp/named_req/Predicate)

175. Что такое бинарный предикат?

	**Ответ:** Это предикат, принимающий два аргумента.
	**Источник:** [Cppreference: named requirements](https://en.cppreference.com/w/cpp/named_req/Predicate)

176. Почему предикат должен быть “чистым” по возможности?

	**Ответ:** Отсутствие побочных эффектов делает результат алгоритма предсказуемым и безопасным при повторных вызовах.
	**Источник:** [Cppreference: named requirements](https://en.cppreference.com/w/cpp/named_req/Predicate)

177. Что такое компаратор?

	**Ответ:** Компаратор — callable, определяющий относительный порядок двух объектов.
	**Источник:** [Cppreference: named requirements](https://en.cppreference.com/w/cpp/named_req/Compare)

178. Где используются компараторы?

	**Ответ:** В `sort`, упорядоченных контейнерах, бинарном поиске и других алгоритмах сравнения.
	**Источник:** [Cppreference: named requirements](https://en.cppreference.com/w/cpp/named_req/Compare)

179. Почему корректность компаратора важна для `std::sort`?

	**Ответ:** Алгоритм требует согласованного отношения порядка; нарушение требований даёт неопределённые или неверные результаты.
	**Источник:** [Cppreference: std::sort](https://en.cppreference.com/w/cpp/algorithm/sort)

180. Что такое strict weak ordering?

	**Ответ:** Это свойства компаратора, обеспечивающие согласованное транзитивное отношение “меньше” и эквивалентности.
	**Источник:** [Cppreference: named requirements](https://en.cppreference.com/w/cpp/named_req/Compare)

181. Почему некорректный компаратор может ломать алгоритмы?

	**Ответ:** Алгоритм опирается на его логическую согласованность; противоречивые ответы нарушают предпосылки поиска и сортировки.
	**Источник:** [Cppreference: named requirements](https://en.cppreference.com/w/cpp/named_req/Compare)

182. Что такое callback-функция?

	**Ответ:** Это функция или callable, переданный другому коду для обратного вызова при наступлении события.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

183. Где часто применяются callback’и?

	**Ответ:** В обработчиках событий, асинхронных API, алгоритмах, таймерах и системах уведомлений.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

184. Чем callback на указателе на функцию отличается от callback на лямбде?

	**Ответ:** Указатель передаёт только адрес функции, а лямбда может захватывать и хранить состояние.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

185. Что такое API, принимающий callable?

	**Ответ:** Это интерфейс, параметром которого является вызываемый объект с требуемой сигнатурой и семантикой.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

186. Почему шаблонные функции хорошо сочетаются с callable-аргументами?

	**Ответ:** Они сохраняют конкретный тип callable, избегают type erasure и позволяют компилятору оптимизировать вызов.
	**Источник:** [Cppreference: function template](https://en.cppreference.com/w/cpp/language/function_template)

187. Что такое инстанцирование шаблонной функции?

	**Ответ:** Это создание конкретной версии шаблона для набора выведенных или явно заданных типов.
	**Источник:** [Cppreference: function template](https://en.cppreference.com/w/cpp/language/function_template)

188. Что такое шаблон функции?

	**Ответ:** Это параметризованное описание функции, из которого компилятор создаёт конкретные функции.
	**Источник:** [Cppreference: function template](https://en.cppreference.com/w/cpp/language/function_template)

189. Чем шаблон функции отличается от перегрузки?

	**Ответ:** Перегрузки являются отдельными функциями, а шаблон описывает семейство функций для разных типов.
	**Источник:** [Cppreference: function template](https://en.cppreference.com/w/cpp/language/function_template)

190. Когда шаблон функции удобнее обычной перегрузки?

	**Ответ:** Когда одна и та же логика должна работать с большим числом совместимых типов.
	**Источник:** [Cppreference: function template](https://en.cppreference.com/w/cpp/language/function_template)

191. Можно ли специализировать шаблон функции?

	**Ответ:** Да, допустима явная специализация, хотя часто предпочтительнее перегрузка или специализация класса.
	**Источник:** [Cppreference: template specialization](https://en.cppreference.com/w/cpp/language/template_specialization)

192. Что такое вывод аргументов шаблона функции?

	**Ответ:** Компилятор определяет параметры шаблона из типов переданных аргументов вызова.
	**Источник:** [Cppreference: template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction)

193. Когда компилятор сам выводит `T` в `template<typename T>`?

	**Ответ:** Когда `T` встречается в типах параметров функции и из переданных аргументов можно однозначно получить его значение.
	**Источник:** [Cppreference: template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction)

194. Когда вывод типа шаблона невозможен?

	**Ответ:** Когда параметр не связан с аргументами, типы конфликтуют или требуемое преобразование не участвует в выводе.
	**Источник:** [Cppreference: template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction)

195. Что такое универсальная функция `max` в виде шаблона?

	**Ответ:** Это шаблон, который сравнивает два значения совместимого типа и возвращает большее.
	**Источник:** [Cppreference: std::max](https://en.cppreference.com/w/cpp/algorithm/max)

196. Какие проблемы могут возникнуть у шаблонной функции `max` с разными типами?

	**Ответ:** Вывод может не найти общий тип или выбор преобразований может привести к потере точности.
	**Источник:** [Cppreference: template argument deduction](https://en.cppreference.com/w/cpp/language/template_argument_deduction)

197. Что такое `constexpr`-функция?

	**Ответ:** Это функция, которую разрешено вычислять во время компиляции, если вызов и аргументы удовлетворяют требованиям constant expression.
	**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr)

198. Когда `constexpr`-функция может вычисляться на этапе компиляции?

	**Ответ:** Когда вызов используется в контексте постоянного выражения и все операции допустимы для такого вычисления.
	**Источник:** [Cppreference: constant expression](https://en.cppreference.com/w/cpp/language/constant_expression)

199. Всегда ли вызов `constexpr`-функции вычисляется на этапе компиляции?

	**Ответ:** Нет, в обычном runtime-контексте она может выполняться во время работы программы.
	**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr)

200. Чем `constexpr`-функция отличается от обычной?

	**Ответ:** Она дополнительно удовлетворяет требованиям для compile-time вычисления, но может вызываться и во время выполнения.
	**Источник:** [Cppreference: constexpr](https://en.cppreference.com/w/cpp/language/constexpr)

## Сложный уровень

201. Что такое `consteval`-функция?

	**Ответ:** Это immediate-функция, каждый вызов которой обязан быть вычислен во время компиляции.
	**Источник:** [Cppreference: consteval](https://en.cppreference.com/w/cpp/language/consteval)

202. Чем `consteval` отличается от `constexpr`?

	**Ответ:** `constexpr` допускает runtime-вызов, а `consteval` требует constant evaluation.
	**Источник:** [Cppreference: consteval](https://en.cppreference.com/w/cpp/language/consteval)

203. Что такое `constinit` и почему это не функция?

	**Ответ:** `constinit` требует статической инициализации переменной; это спецификатор объявления объекта, а не вычислимый callable.
	**Источник:** [Cppreference: constinit](https://en.cppreference.com/w/cpp/language/constinit)

204. Что такое `noexcept` у функции?

	**Ответ:** Это спецификация, описывающая, может ли функция выбросить исключение.
	**Источник:** [Cppreference: noexcept specification](https://en.cppreference.com/w/cpp/language/noexcept_spec)

205. Что означает спецификатор `noexcept`?

	**Ответ:** `noexcept(true)` обещает отсутствие выхода исключения из функции; нарушение приводит к вызову `std::terminate`.
	**Источник:** [Cppreference: noexcept specification](https://en.cppreference.com/w/cpp/language/noexcept_spec)

206. Как `noexcept` влияет на поведение и оптимизацию?

	**Ответ:** Он участвует в типе и выборе перегрузок, позволяет применять более эффективные стратегии и задаёт поведение при исключении.
	**Источник:** [Cppreference: noexcept specification](https://en.cppreference.com/w/cpp/language/noexcept_spec)

207. Почему корректная пометка `noexcept` важна для move-операций и контейнеров?

	**Ответ:** Контейнеры могут предпочесть перемещение копированию, если оно гарантированно не выбрасывает исключения.
	**Источник:** [Cppreference: move constructors](https://en.cppreference.com/w/cpp/language/move_constructor)

208. Что такое trailing return type?

	**Ответ:** Это запись возвращаемого типа после списка параметров: `auto f(int value) -> long`.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

209. Когда запись `auto f(...) -> T` удобнее классической формы?

	**Ответ:** Она удобна в шаблонах, когда возвращаемый тип зависит от имён параметров или выражений после списка аргументов.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

210. Что такое `decltype(auto)` в возвращаемом типе функции?

	**Ответ:** Он выводит тип результата по правилам `decltype`, сохраняя ссылочность и `const` выражения.
	**Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

211. Чем `auto` и `decltype(auto)` отличаются при возврате значения?

	**Ответ:** `auto` обычно выводит значение без ссылочных квалификаторов, а `decltype(auto)` сохраняет категорию и точный тип выражения.
	**Источник:** [Cppreference: return type deduction](https://en.cppreference.com/w/cpp/language/function)

212. Почему возврат ссылки через `auto` и `decltype(auto)` может вести себя по-разному?

	**Ответ:** `auto` применяет обычный вывод с удалением ссылок, а `decltype(auto)` следует правилам `decltype` и может вывести ссылку.
	**Источник:** [Cppreference: decltype](https://en.cppreference.com/w/cpp/language/decltype)

213. Что такое перегрузка по `const` для методов класса?

	**Ответ:** Это отдельные `const` и неконстантная версии метода, различающиеся квалификацией неявного `this`.
	**Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

214. Почему методы класса тоже являются функциями?

	**Ответ:** Они имеют параметры, возвращаемый тип, тело и правила вызова, но дополнительно связаны с объектом класса.
	**Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

215. Что такое функция-член класса?

	**Ответ:** Это функция, объявленная в классе и имеющая доступ к его членам через неявный объект.
	**Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

216. Чем функция-член отличается от обычной свободной функции?

	**Ответ:** Функция-член вызывается в контексте объекта и получает неявный `this`, а свободная функция такого объекта не имеет.
	**Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

217. Что такое неявный параметр `this`?

	**Ответ:** Это указатель на объект, для которого вызван нестатический метод.
	**Источник:** [Cppreference: this pointer](https://en.cppreference.com/w/cpp/language/this)

218. Почему у неконстантного и константного метода разные сигнатуры?

	**Ответ:** Квалификатор `const` меняет тип неявного объекта и разрешает вызов метода на `const`-объекте.
	**Источник:** [Cppreference: member functions](https://en.cppreference.com/w/cpp/language/member_functions)

219. Что такое статический метод класса?

	**Ответ:** Это функция-член без неявного `this`, принадлежащая классу, а не отдельному объекту.
	**Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

220. Чем `static`-метод отличается от обычного метода?

	**Ответ:** Он не имеет `this`, поэтому напрямую обращается только к статическим членам и явным аргументам.
	**Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

221. Может ли `static`-метод обращаться к нестатическим полям без объекта?

	**Ответ:** Нет, ему нужен явный объект или указатель для доступа к нестатическому полю.
	**Источник:** [Cppreference: static members](https://en.cppreference.com/w/cpp/language/static)

222. Что такое дружественная функция?

	**Ответ:** Это не член класса, которому класс явно предоставил доступ к своим private и protected членам.
	**Источник:** [Cppreference: friend](https://en.cppreference.com/w/cpp/language/friend)

223. Когда используют `friend`-функции?

	**Ответ:** Когда внешней функции или оператору нужен контролируемый доступ к внутреннему представлению класса.
	**Источник:** [Cppreference: friend](https://en.cppreference.com/w/cpp/language/friend)

224. Чем свободная функция иногда лучше метода класса?

	**Ответ:** Она уменьшает связанность, не требует доступа к состоянию и позволяет симметрично работать с несколькими типами.
	**Источник:** [C++ Core Guidelines: interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

225. Что такое ADL (argument-dependent lookup)?

	**Ответ:** ADL добавляет пространства имён, связанные с типами аргументов, к обычному поиску вызываемой функции.
	**Источник:** [Cppreference: ADL](https://en.cppreference.com/w/cpp/language/adl)

226. Как ADL влияет на поиск функции?

	**Ответ:** Он может найти перегрузку в пространстве имён типа аргумента даже без квалифицированного имени.
	**Источник:** [Cppreference: ADL](https://en.cppreference.com/w/cpp/language/adl)

227. Почему для перегрузки операторов часто используют свободные функции?

	**Ответ:** Свободная функция обеспечивает симметричные преобразования левого и правого операндов и поддерживает ADL.
	**Источник:** [Cppreference: operator overloading](https://en.cppreference.com/w/cpp/language/operators)

228. Что такое перегрузка операторов как частный случай функций?

	**Ответ:** Это определение функции с именем оператора, задающей поведение оператора для пользовательских типов.
	**Источник:** [Cppreference: operator overloading](https://en.cppreference.com/w/cpp/language/operators)

229. Почему `operator+` и `operator<<` — это тоже функции?

	**Ответ:** Операторный синтаксис является альтернативной записью вызова соответствующей функции или функции-члена.
	**Источник:** [Cppreference: operator overloading](https://en.cppreference.com/w/cpp/language/operators)

230. Что такое variadic templates для функций?

	**Ответ:** Это шаблоны, принимающие пакет параметров произвольной длины.
	**Источник:** [Cppreference: parameter pack](https://en.cppreference.com/w/cpp/language/parameter_pack)

231. Что такое функция с переменным числом шаблонных параметров?

	**Ответ:** Это функция, чей шаблонный параметр-пакет может содержать ноль или больше типов или значений.
	**Источник:** [Cppreference: parameter pack](https://en.cppreference.com/w/cpp/language/parameter_pack)

232. Чем variadic templates лучше старых C-style variadic functions?

	**Ответ:** Они сохраняют типы аргументов и позволяют проверять их на этапе компиляции.
	**Источник:** [Cppreference: parameter pack](https://en.cppreference.com/w/cpp/language/parameter_pack)

233. Почему C-style `...` считается менее безопасным?

	**Ответ:** Типы и количество аргументов не проверяются сигнатурой, поэтому ошибки обнаруживаются поздно или дают неопределённое поведение.
	**Источник:** [Cppreference: variadic arguments](https://en.cppreference.com/w/cpp/language/variadic_arguments)

234. Что такое fold expression?

	**Ответ:** Это компактная форма свёртки parameter pack бинарным оператором.
	**Источник:** [Cppreference: fold expressions](https://en.cppreference.com/w/cpp/language/fold)

235. Как fold expressions связаны с функциями и пакетами параметров?

	**Ответ:** Они позволяют выполнить одну операцию над всеми аргументами пакета без ручной рекурсии.
	**Источник:** [Cppreference: fold expressions](https://en.cppreference.com/w/cpp/language/fold)

236. Что такое perfect forwarding?

	**Ответ:** Это передача аргумента дальше с сохранением его исходной value category и cv-квалификаторов.
	**Источник:** [Cppreference: forwarding references](https://en.cppreference.com/w/cpp/language/reference)

237. Почему perfect forwarding важен для обобщённых функций?

	**Ответ:** Он позволяет не терять свойства lvalue или rvalue и избежать лишних копирований при передаче дальше.
	**Источник:** [Cppreference: forwarding references](https://en.cppreference.com/w/cpp/language/reference)

238. Что такое forwarding reference?

	**Ответ:** Это параметр вида `T&&` в контексте вывода `T`, который может связываться и с lvalue, и с rvalue.
	**Источник:** [Cppreference: forwarding reference](https://en.cppreference.com/w/cpp/language/reference)

239. Чем `T&&` в шаблоне отличается от обычной rvalue-ссылки?

	**Ответ:** При выводе типа `T&&` может быть forwarding reference, тогда как `Widget&&` принимает только rvalue.
	**Источник:** [Cppreference: reference collapsing](https://en.cppreference.com/w/cpp/language/reference)

240. Что делает `std::forward`?

	**Ответ:** Он восстанавливает исходную value category аргумента, переданного через forwarding reference.
	**Источник:** [Cppreference: std::forward](https://en.cppreference.com/w/cpp/utility/forward)

241. Чем `std::forward` отличается от `std::move`?

	**Ответ:** `std::move` безусловно приводит выражение к xvalue, а `std::forward` делает это условно по выведенному типу.
	**Источник:** [Cppreference: std::forward](https://en.cppreference.com/w/cpp/utility/forward)

242. Почему неправильный `std::move` внутри шаблонной функции может быть ошибкой?

	**Ответ:** Он может превратить исходный lvalue в rvalue и преждевременно передать или изменить объект.
	**Источник:** [Cppreference: std::move](https://en.cppreference.com/w/cpp/utility/move)

243. Что такое value category аргумента в контексте вызова функции?

	**Ответ:** Это классификация выражения как lvalue, xvalue или prvalue, влияющая на связывание параметров и выбор перегрузки.
	**Источник:** [Cppreference: value category](https://en.cppreference.com/w/cpp/language/value_category)

244. Почему lvalue и rvalue важны для перегрузки функций?

	**Ответ:** Они позволяют различать доступные для изменения объекты и временные значения, выбирая подходящую перегрузку.
	**Источник:** [Cppreference: value category](https://en.cppreference.com/w/cpp/language/value_category)

245. Как перегружают функции по `T&`, `const T&` и `T&&`?

	**Ответ:** Создают перегрузки с этими типами параметров; компилятор выбирает вариант согласно value category и `const` объекта.
	**Источник:** [Cppreference: reference](https://en.cppreference.com/w/cpp/language/reference)

246. Почему выбор между этими параметрами влияет на производительность?

	**Ответ:** Он определяет возможность изменения, копирования или перемещения объекта и тем самым стоимость вызова.
	**Источник:** [C++ Core Guidelines: parameter passing](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

247. Что такое copy elision при возврате из функции?

	**Ответ:** Это устранение копирования или перемещения результата с непосредственным созданием объекта в месте назначения.
	**Источник:** [Cppreference: copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

248. Что такое NRVO?

	**Ответ:** Named Return Value Optimization — оптимизация возврата именованного локального объекта без копирования.
	**Источник:** [Cppreference: copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

249. Как возврат объекта по значению связан с современными оптимизациями?

	**Ответ:** RVO, NRVO и move semantics часто устраняют или удешевляют копирование результата.
	**Источник:** [Cppreference: copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

250. Почему возвращать объект по значению в C++ часто не так дорого, как кажется?

	**Ответ:** Современный стандарт гарантирует часть copy elision, а в остальных случаях обычно используется перемещение.
	**Источник:** [Cppreference: copy elision](https://en.cppreference.com/w/cpp/language/copy_elision)

## Очень сложный уровень / с уклоном в функциональное программирование

251. Что такое функциональный стиль программирования в контексте C++?

	**Ответ:** Это подход с акцентом на чистые функции, преобразование значений, композицию и минимизацию изменяемого состояния.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

252. Чем функциональный стиль отличается от чисто функционального языка?

	**Ответ:** C++ поддерживает функциональные приёмы, но также имеет изменяемое состояние, исключения, указатели и побочные эффекты.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

253. Какие элементы функционального программирования поддерживает C++?

	**Ответ:** Лямбды, функции высшего порядка, замыкания, алгоритмы STL, ranges, `const` и шаблоны.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

254. Почему C++ нельзя назвать чисто функциональным языком?

	**Ответ:** Язык разрешает мутабельные объекты, побочные эффекты, процедурный код и прямое управление ресурсами.
	**Источник:** [Cppreference: language](https://en.cppreference.com/w/cpp/language)

255. Что такое неизменяемость данных (immutability)?

	**Ответ:** Это свойство, при котором состояние объекта после создания не изменяется.
	**Источник:** [Cppreference: cv qualification](https://en.cppreference.com/w/cpp/language/cv)

256. Почему неизменяемость помогает уменьшать количество ошибок?

	**Ответ:** Она сокращает число возможных состояний и скрытых зависимостей между участками программы.
	**Источник:** [C++ Core Guidelines: immutability](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

257. Как `const` помогает писать код в более функциональном стиле?

	**Ответ:** `const` запрещает непреднамеренное изменение объектов и явно фиксирует намерения интерфейса.
	**Источник:** [Cppreference: cv qualification](https://en.cppreference.com/w/cpp/language/cv)

258. Что такое преобразование данных без изменения исходного состояния?

	**Ответ:** Это создание нового результата на основе входных данных без мутации исходного объекта.
	**Источник:** [Cppreference: algorithms](https://en.cppreference.com/w/cpp/algorithm)

259. Почему функции вида “взял данные → вернул новые данные” удобны для тестирования?

	**Ответ:** Их результат можно проверять по входу без подготовки и проверки скрытого внешнего состояния.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

260. Что такое map-концепция в функциональном стиле?

	**Ответ:** Это применение одной функции к каждому элементу последовательности с получением новой последовательности результатов.
	**Источник:** [Cppreference: ranges](https://en.cppreference.com/w/cpp/ranges)

261. Как идею map можно выразить через STL-алгоритмы или ranges?

	**Ответ:** Используют `std::transform` или представление `std::ranges::transform_view`.
	**Источник:** [Cppreference: transform](https://en.cppreference.com/w/cpp/algorithm/transform)
262. Что такое filter-концепция?

	**Ответ:** Это выбор элементов последовательности, для которых предикат возвращает `true`.
	**Источник:** [Cppreference: filter_view](https://en.cppreference.com/w/cpp/ranges/filter_view)

263. Какую роль играют предикаты в filter-подобных операциях?

	**Ответ:** Предикат определяет условие, по которому каждый элемент принимается или отбрасывается.
	**Источник:** [Cppreference: filter_view](https://en.cppreference.com/w/cpp/ranges/filter_view)

264. Что такое reduce/fold-концепция?

	**Ответ:** Это последовательное объединение элементов диапазона с аккумулятором и бинарной операцией.
	**Источник:** [Cppreference: accumulate](https://en.cppreference.com/w/cpp/algorithm/accumulate)

265. Чем fold отличается от обычного цикла по смыслу?

	**Ответ:** Fold явно выражает свёртку последовательности в одно значение, скрывая детали обхода.
	**Источник:** [Cppreference: fold expressions](https://en.cppreference.com/w/cpp/language/fold)

266. Что такое аккумулятор в fold-операции?

	**Ответ:** Это текущее промежуточное значение, которое обновляется операцией для каждого элемента.
	**Источник:** [Cppreference: accumulate](https://en.cppreference.com/w/cpp/algorithm/accumulate)

267. Как `std::accumulate` связан с функциональным стилем?

	**Ответ:** Он применяет переданную бинарную операцию к диапазону и аккумулятору без ручного управления циклом.
	**Источник:** [Cppreference: accumulate](https://en.cppreference.com/w/cpp/algorithm/accumulate)

268. Что такое частичное применение функции?

	**Ответ:** Это создание новой функции с заранее зафиксированными некоторыми аргументами исходной функции.
	**Источник:** [Cppreference: bind](https://en.cppreference.com/w/cpp/utility/functional/bind)

269. Что такое currying в теории функционального программирования?

	**Ответ:** Это преобразование функции нескольких аргументов в цепочку функций по одному аргументу.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

270. Поддерживает ли C++ currying напрямую?

	**Ответ:** Нет, отдельного встроенного оператора currying нет, но его можно выразить шаблонами и лямбдами.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

271. Как можно имитировать currying с помощью лямбд?

	**Ответ:** Возвращайте лямбду, которая захватывает первый аргумент и принимает следующий.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

272. Что такое композиция функций `f(g(x))`?

	**Ответ:** Это применение `g` к `x`, а затем передача результата функции `f`.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

273. Почему композиция удобна для построения пайплайнов обработки данных?

	**Ответ:** Небольшие преобразования можно соединять в последовательность с явно заданным порядком обработки.
	**Источник:** [Cppreference: ranges](https://en.cppreference.com/w/cpp/ranges)

274. Что такое pipeline-стиль работы с данными?

	**Ответ:** Это последовательная передача результата одного преобразования на вход следующего.
	**Источник:** [Cppreference: ranges](https://en.cppreference.com/w/cpp/ranges)

275. Как ranges в современном C++ помогают писать код в более декларативном стиле?

	**Ответ:** Views и адаптеры описывают, какие преобразования применить к диапазону, не задавая вручную детали обхода.
	**Источник:** [Cppreference: ranges](https://en.cppreference.com/w/cpp/ranges)

276. Почему лямбды особенно важны для функционального подхода в C++?

	**Ответ:** Они позволяют прямо на месте задавать операции преобразования, фильтрации и свёртки.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

277. Что такое функция как значение первого класса и в какой степени это есть в C++?

	**Ответ:** Это способность передавать и возвращать поведение; в C++ её реализуют через указатели, лямбды, функторы и обёртки.
	**Источник:** [Cppreference: function objects](https://en.cppreference.com/w/cpp/utility/functional)

278. Какие ограничения есть у C++ по сравнению с языками, где функции — полноценные first-class citizens?

	**Ответ:** Функции C++ не являются обычными копируемыми значениями, поэтому для хранения используют объекты, указатели или type erasure.
	**Источник:** [Cppreference: function](https://en.cppreference.com/w/cpp/language/function)

279. Почему состояние, захваченное лямбдой, может мешать “чистоте” функции?

	**Ответ:** Результат может зависеть от изменяемого состояния замыкания, а не только от явных аргументов.
	**Источник:** [Cppreference: lambda](https://en.cppreference.com/w/cpp/language/lambda)

280. Когда лямбда остаётся чистой функцией, а когда перестаёт ей быть?

	**Ответ:** Она чиста без наблюдаемых эффектов и с детерминированным результатом; ввод-вывод, мутация или внешнее состояние нарушают это свойство.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

281. Почему захват по ссылке может быть опасен для lifetime?

	**Ответ:** Замыкание может пережить объект, на который ссылается захваченная ссылка, и получить dangling reference.
	**Источник:** [Cppreference: lambda capture](https://en.cppreference.com/w/cpp/language/lambda)

282. Почему захват по значению часто безопаснее?

	**Ответ:** Замыкание хранит собственную копию значения и не зависит от lifetime исходной локальной переменной.
	**Источник:** [Cppreference: lambda capture](https://en.cppreference.com/w/cpp/language/lambda)

283. Что такое ленивые вычисления в функциональном стиле?

	**Ответ:** Это вычисление значения только в момент, когда оно действительно требуется.
	**Источник:** [Cppreference: ranges](https://en.cppreference.com/w/cpp/ranges)

284. Поддерживает ли C++ ленивые вычисления?

	**Ответ:** Да, например через ranges views, генераторы библиотек и пользовательские callable-объекты.
	**Источник:** [Cppreference: ranges](https://en.cppreference.com/w/cpp/ranges)

285. Как ranges/views реализуют элементы ленивости?

	**Ответ:** View хранит описание операции и вычисляет очередной элемент при обращении к итератору.
	**Источник:** [Cppreference: view](https://en.cppreference.com/w/cpp/ranges/view)

286. Чем eager evaluation отличается от lazy evaluation?

	**Ответ:** Eager вычисляет результат сразу, а lazy откладывает вычисления до фактического использования.
	**Источник:** [Cppreference: ranges](https://en.cppreference.com/w/cpp/ranges)

287. Почему lazy-подход может быть эффективнее по памяти и времени?

	**Ответ:** Он не создаёт промежуточные коллекции и может не вычислять элементы, которые никогда не потребуются.
	**Источник:** [Cppreference: ranges](https://en.cppreference.com/w/cpp/ranges)

288. Какие риски по lifetime появляются у view-типов и ленивых вычислений?

	**Ответ:** View обычно не владеет источником, поэтому обращение после его уничтожения приводит к недействительным ссылкам.
	**Источник:** [Cppreference: view](https://en.cppreference.com/w/cpp/ranges/view)

289. Почему `std::string_view` и подобные невладеющие объекты требуют аккуратности?

	**Ответ:** Они хранят только представление диапазона символов и не продлевают lifetime исходной строки.
	**Источник:** [Cppreference: basic_string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

290. Что такое монада на теоретическом уровне и почему это редко объясняют на базовом курсе C++?

	**Ответ:** Это абстракция композиции вычислений с контекстом; термин требует отдельной теории и не является конструкцией языка C++.
	**Источник:** [Cppreference: functional](https://en.cppreference.com/w/cpp/utility/functional)

291. Какие идеи монадо-подобного стиля можно встретить в `std::optional`?

	**Ответ:** `optional` позволяет последовательно передавать значение между операциями, сохраняя состояние “значение отсутствует”.
	**Источник:** [Cppreference: optional](https://en.cppreference.com/w/cpp/utility/optional)

292. Как `std::optional` помогает строить более функциональные цепочки вычислений?

	**Ответ:** Он явно представляет возможное отсутствие результата и позволяет отделить вычисление от проверки наличия значения.
	**Источник:** [Cppreference: optional](https://en.cppreference.com/w/cpp/utility/optional)

293. Что такое обработка ошибок через возвращаемое значение вместо исключений в функциональном стиле?

	**Ответ:** Функция возвращает тип результата, содержащий успех или ошибку, а вызывающий код явно композирует эти состояния.
	**Источник:** [Cppreference: optional](https://en.cppreference.com/w/cpp/utility/optional)

294. Почему композиция функций сложнее, если функции имеют побочные эффекты?

	**Ответ:** Нужно учитывать порядок, состояние и повторяемость эффектов, поэтому простое соединение преобразований уже недостаточно.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

295. Как отделение вычислений от эффектов улучшает архитектуру программы?

	**Ответ:** Чистую логику можно тестировать отдельно, а ввод-вывод и другие эффекты сосредоточить на границах системы.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

296. Почему чистые маленькие функции хорошо подходят для модульного тестирования?

	**Ответ:** Они имеют короткий контракт, минимум зависимостей и предсказуемый результат для каждого набора входов.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

297. Почему функциональный стиль не означает полный отказ от ООП в C++?

	**Ответ:** Оба подхода совместимы: объекты могут инкапсулировать ресурсы, а чистые функции обрабатывать их значения.
	**Источник:** [Cppreference: language](https://en.cppreference.com/w/cpp/language)

298. В каких задачах функциональный стиль особенно удобен в C++?

	**Ответ:** В преобразовании коллекций, конвейерах данных, параллельных алгоритмах и коде с небольшими независимыми операциями.
	**Источник:** [Cppreference: algorithms](https://en.cppreference.com/w/cpp/algorithm)

299. Когда функциональный стиль в C++ может ухудшить читаемость или производительность?

	**Ответ:** Сложные цепочки, чрезмерное type erasure или лишние временные объекты могут скрыть контроль потока и добавить расходы.
	**Источник:** [C++ Core Guidelines: performance](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

300. Какие основные принципы написания хороших функций в современном C++ ты бы сформулировал?

	**Ответ:** Делайте функции короткими и проверяемыми, явно выражайте зависимости, избегайте скрытого состояния и выбирайте понятные типы результатов.
	**Источник:** [C++ Core Guidelines: functions](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)


[<- Prev](./04_memory.md)           [Next ->](./06_oop.md)