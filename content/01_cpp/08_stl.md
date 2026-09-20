# STL

## Лёгкий уровень

1. Что обычно понимают под STL в C++?

   **Ответ:** STL (Standard Template Library) — это историческая библиотека шаблонов C++, предоставляющая универсальные контейнеры, алгоритмы, итераторы и функциональные объекты, ставшая фундаментом стандартной библиотеки C++.

   **Пример:**

   ```cpp
   #include <vector>
   #include <algorithm>

   std::vector<int> v = {3, 1, 2};
   std::sort(v.begin(), v.end());
   ```

   **Источник:** [Cppreference: Standard library](https://en.cppreference.com/w/cpp/standard_library)

2. Что входит в стандартную библиотеку C++ помимо классической STL?

   **Ответ:** Помимо STL в стандартную библиотеку входят средства ввода-вывода (`<iostream>`, `<fstream>`), локализация (`<locale>`), математика и случайные числа (`<cmath>`, `<random>`), поддержка многопоточности (`<thread>`, `<mutex>`), работа с файловой системой (`<filesystem>`), умные указатели, RTTI и свойства типов (`<type_traits>`).

   **Пример:**

   ```cpp
   #include <iostream>
   #include <thread>
   #include <chrono>

   std::this_thread::sleep_for(std::chrono::milliseconds(10));
   std::cout << "Thread sleep completed\n";
   ```

   **Источник:** [Cppreference: Standard library headers](https://en.cppreference.com/w/cpp/header)

3. Какие основные части STL обычно выделяют?

   **Ответ:** Традиционно выделяют четыре ключевых компонента: контейнеры, алгоритмы, итераторы и функциональные объекты (функторы/предикаты), а также аллокаторы.

   **Пример:**

   ```cpp
   #include <vector>
   #include <numeric>
   #include <functional>

   std::vector<int> v = {1, 2, 3}; // контейнер
   // std::accumulate (алгоритм) + v.begin()/v.end() (итераторы) + std::plus (функтор)
   int sum = std::accumulate(v.begin(), v.end(), 0, std::plus<int>{});
   ```

   **Источник:** [Cppreference: Algorithms library](https://en.cppreference.com/w/cpp/algorithm)

4. Что такое контейнер в STL?

   **Ответ:** Контейнер — это держатель объектов определенного типа, управляющий памятью для сохраняемых элементов и предоставляющий доступ к ним через методы и итераторы.

   **Пример:**

   ```cpp
   #include <vector>

   std::vector<int> numbers = {1, 2, 3};
   numbers.push_back(4);
   ```

   **Источник:** [Cppreference: Containers library](https://en.cppreference.com/w/cpp/container)

5. Что такое алгоритм в STL?

   **Ответ:** Алгоритм в STL — это шаблонная функция, выполняющая вычислительные действия (поиск, сортировку, трансформацию и т.д.) над диапазонами элементов через итераторы, не завися от конкретного контейнера.

   **Пример:**

   ```cpp
   #include <vector>
   #include <algorithm>

   std::vector<int> v = {5, 2, 8};
   auto it = std::find(v.begin(), v.end(), 2);
   ```

   **Источник:** [Cppreference: Algorithm](https://en.cppreference.com/w/cpp/algorithm)

6. Что такое итератор в STL?

   **Ответ:** Итератор — это абстракция указателя, представляющая собой объект, указывающий на элемент последовательности и позволяющий перемещаться по элементам и читать/модифицировать их.

   **Пример:**

   ```cpp
   #include <vector>

   std::vector<int> v = {10, 20};
   std::vector<int>::iterator it = v.begin();
   int val = *it;
   ```

   **Источник:** [Cppreference: Iterator](https://en.cppreference.com/w/cpp/iterator)

7. Почему STL строится вокруг идеи “контейнер + алгоритм + итератор”?

   **Ответ:** Концепция связывает $N$ контейнеров и $M$ алгоритмов через единый интерфейс итераторов, что позволяет избежать написания $N \times M$ специализированных функций и снизить сложность до $N + M$.

   **Пример:**

   ```cpp
   #include <vector>
   #include <list>
   #include <algorithm>

   std::vector<int> vec = {1, 2, 3};
   std::list<int> lst = {1, 2, 3};

   auto f1 = std::find(vec.begin(), vec.end(), 2);
   auto f2 = std::find(lst.begin(), lst.end(), 2);
   ```

   **Источник:** [Cppreference: Iterator](https://en.cppreference.com/w/cpp/iterator)

8. Чем STL отличается от набора обычных классов и функций?

   **Ответ:** STL построена на параметрическом полиморфизме времени компиляции (templates), минимизируя накладные расходы виртуальных вызовов и обеспечивая строгую типизацию без потери производительности.

   **Пример:**

   ```cpp
   #include <algorithm>
   #include <vector>

   std::vector<double> v = {1.5, 0.2};
   std::sort(v.begin(), v.end()); // инлайнится компилятором напрямую для double
   ```

   **Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates)

9. Почему STL считается примером обобщённого программирования?

   **Ответ:** Алгоритмы и структуры данных в STL определены не через жесткие типы или иерархии наследования, а через абстрактные требования к операциям над типами (синтаксические и семантические концепты).

   **Пример:**

   ```cpp
   template <typename InputIt, typename T>
   InputIt custom_find(InputIt first, InputIt last, const T& value) {
       for (; first != last; ++first) {
           if (*first == value) return first;
       }
       return last;
   }
   ```

   **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/concepts)

10. Что такое шаблонность в STL?

    **Ответ:** Шаблонность в STL означает, что все структуры данных и функции являются шаблонами классов (`template <typename T> class vector;`) или шаблонами функций, порождающими конкретный машинный код при инстанцировании.

    **Пример:**

    ```cpp
    #include <vector>
    #include <string>

    std::vector<int> int_vec;
    std::vector<std::string> str_vec;
    ```

    **Источник:** [Cppreference: Templates](https://en.cppreference.com/w/cpp/language/templates)

11. Почему контейнеры STL обычно являются шаблонными классами?

    **Ответ:** Чтобы безопасно хранить элементы любых типов без необходимости динамического приведения типов (вроде `void*` или `Object`) и без потери информации о типе.

    **Пример:**

    ```cpp
    #include <deque>

    struct Point { int x, y; };
    std::deque<Point> points;
    ```

    **Источник:** [Cppreference: Class template](https://en.cppreference.com/w/cpp/language/class_template)

12. Почему алгоритмы STL обычно являются шаблонными функциями?

    **Ответ:** Чтобы применять одну и ту же вычислительную логику к разным типам элементов и разным типам итераторов/контейнеров.

    **Пример:**

    ```cpp
    #include <algorithm>
    #include <vector>
    #include <string>

    std::vector<std::string> words = {"banana", "apple"};
    std::sort(words.begin(), words.end());
    ```

    **Источник:** [Cppreference: Function template](https://en.cppreference.com/w/cpp/language/function_template)

13. Что такое заголовочный файл `<vector>`?

    **Ответ:** Это стандартный заголовочный файл C++, объявляющий шаблон динамического массива `std::vector` и сопутствующие функции сравнения и специализации.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v;
    ```

    **Источник:** [Cppreference: Header `<vector>`](https://en.cppreference.com/w/cpp/header/vector)

14. Что такое заголовочный файл `<list>`?

    **Ответ:** Стандартный заголовочный файл, предоставляющий контейнер двусвязного списка `std::list`.

    **Пример:**

    ```cpp
    #include <list>

    std::list<int> l = {1, 2, 3};
    ```

    **Источник:** [Cppreference: Header `<list>`](https://en.cppreference.com/w/cpp/header/list)

15. Что такое заголовочный файл `<map>`?

    **Ответ:** Заголовочный файл, содержащий объявления ассоциативных упорядоченных контейнеров на основе пар ключ-значение: `std::map` и `std::multimap`.

    **Пример:**

    ```cpp
    #include <map>

    std::map<int, double> m;
    ```

    **Источник:** [Cppreference: Header `<map>`](https://en.cppreference.com/w/cpp/header/map)

16. Что такое заголовочный файл `<set>`?

    **Ответ:** Заголовочный файл, объявляющий упорядоченные контейнеры уникальных или множественных ключей: `std::set` и `std::multiset`.

    **Пример:**

    ```cpp
    #include <set>

    std::set<int> s = {3, 1, 2};
    ```

    **Источник:** [Cppreference: Header `<set>`](https://en.cppreference.com/w/cpp/header/set)

17. Что такое заголовочный файл `<algorithm>`?

    **Ответ:** Заголовочный файл, содержащий коллекцию стандартных алгоритмов для работы с коллекциями (сортировка, поиск, манипуляция, перестановки).

    **Пример:**

    ```cpp
    #include <algorithm>
    #include <vector>

    std::vector<int> v = {1, 2, 3};
    std::reverse(v.begin(), v.end());
    ```

    **Источник:** [Cppreference: Header `<algorithm>`](https://en.cppreference.com/w/cpp/header/algorithm)

18. Что такое заголовочный файл `<iterator>`?

    **Ответ:** Заголовочный файл, определяющий категории итераторов, адаптеры итераторов (`back_inserter`), общие функции (`std::begin`, `std::advance`, `std::next`) и трейты итераторов.

    **Пример:**

    ```cpp
    #include <iterator>
    #include <vector>

    std::vector<int> v = {10, 20};
    auto next_it = std::next(v.begin());
    ```

    **Источник:** [Cppreference: Header `<iterator>`](https://en.cppreference.com/w/cpp/header/iterator)

19. Что такое заголовочный файл `<string>`?

    **Ответ:** Заголовочный файл, предоставляющий шаблоны строк `std::basic_string`, в частности `std::string` (`std::basic_string<char>`), и вспомогательные функции.

    **Пример:**

    ```cpp
    #include <string>

    std::string s = "Hello, STL!";
    ```

    **Источник:** [Cppreference: Header `<string>`](https://en.cppreference.com/w/cpp/header/string)

20. Что такое `std::vector`?

    **Ответ:** `std::vector` — это последовательный контейнер, инкапсулирующий непрерывный динамический массив с автоматическим изменением размера при добавлении элементов.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2, 3};
    v.push_back(4);
    ```

    **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

21. Для чего обычно используют `std::vector`?

    **Ответ:** `std::vector` используется как контейнер по умолчанию для хранения последовательностей данных общего назначения благодаря максимальной пространственной локальности данных и быстрому доступу по индексу.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<double> sensor_data;
    sensor_data.push_back(23.4);
    double first = sensor_data[0];
    ```

    **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

22. Что такое `std::array`?

    **Ответ:** `std::array` — это контейнер фиксированного размера, выделяющий память на стеке (или статически) непрерывным блоком, объединяющий производительность си-массивов с интерфейсом STL.

    **Пример:**

    ```cpp
    #include <array>

    std::array<int, 3> arr = {1, 2, 3};
    ```

    **Источник:** [Cppreference: std::array](https://en.cppreference.com/w/cpp/container/array)

23. Чем `std::array` отличается от обычного массива `T[N]`?

    **Ответ:** `std::array` знает свой размер (`size()`), поддерживает итераторы, безопасное обращение (`at()`), передается по значению без неявного затухания (decay) в указатель и копируется оператором `=`.

    **Пример:**

    ```cpp
    #include <array>

    std::array<int, 2> a = {1, 2};
    std::array<int, 2> b = a; // Полное копирование элементов
    ```

    **Источник:** [Cppreference: std::array](https://en.cppreference.com/w/cpp/container/array)

24. Что такое `std::list`?

    **Ответ:** `std::list` — это последовательный контейнер, реализованный в виде двусвязного списка, где каждый узел хранится отдельно в куче и содержит указатели на следующий и предыдущий элементы.

    **Пример:**

    ```cpp
    #include <list>

    std::list<int> l;
    l.push_back(10);
    l.push_front(5);
    ```

    **Источник:** [Cppreference: std::list](https://en.cppreference.com/w/cpp/container/list)

25. Что такое `std::deque`?

    **Ответ:** `std::deque` (double-ended queue) — это последовательный контейнер, обеспечивающий быструю вставку и удаление на обоих концах ($O(1)$) и произвольный доступ по индексу. Обычно реализован как массив указателей на блоки данных постоянного размера.

    **Пример:**

    ```cpp
    #include <deque>

    std::deque<int> d;
    d.push_front(1);
    d.push_back(2);
    int x = d[0];
    ```

    **Источник:** [Cppreference: std::deque](https://en.cppreference.com/w/cpp/container/deque)

26. Что такое `std::forward_list`?

    **Ответ:** `std::forward_list` — это односвязный список, узлы которого хранят указатель только на следующий элемент, что снижает накладные расходы по памяти до минимума по сравнению с `std::list`.

    **Пример:**

    ```cpp
    #include <forward_list>

    std::forward_list<int> fl = {1, 2, 3};
    fl.push_front(0);
    ```

    **Источник:** [Cppreference: std::forward_list](https://en.cppreference.com/w/cpp/container/forward_list)

27. Что такое `std::set`?

    **Ответ:** `std::set` — это ассоциативный контейнер, содержащий отсортированный набор уникальных ключей, обычно реализованный на базе сбалансированного красно-черного дерева.

    **Пример:**

    ```cpp
    #include <set>

    std::set<int> s;
    s.insert(4);
    s.insert(2);
    s.insert(4); // дубликат не добавится
    ```

    **Источник:** [Cppreference: std::set](https://en.cppreference.com/w/cpp/container/set)

28. Что такое `std::multiset`?

    **Ответ:** `std::multiset` — это ассоциативный контейнер с отсортированными ключами, в котором допускается хранение одинаковых элементов (дубликатов).

    **Пример:**

    ```cpp
    #include <set>

    std::multiset<int> ms;
    ms.insert(5);
    ms.insert(5); // успешно добавит второй элемент со значением 5
    ```

    **Источник:** [Cppreference: std::multiset](https://en.cppreference.com/w/cpp/container/multiset)

29. Что такое `std::map`?

    **Ответ:** `std::map` — это упорядоченный ассоциативный контейнер, содержащий пары "ключ-значение" с уникальными ключами, отсортированными по возрастанию (или с помощью заданного компаратора).

    **Пример:**

    ```cpp
    #include <map>
    #include <string>

    std::map<std::string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ```

    **Источник:** [Cppreference: std::map](https://en.cppreference.com/w/cpp/container/map)

30. Что такое `std::multimap`?

    **Ответ:** `std::multimap` — это упорядоченный ассоциативный контейнер пар "ключ-значение", допускающий существование нескольких элементов с одинаковым ключом.

    **Пример:**

    ```cpp
    #include <map>
    #include <string>

    std::multimap<std::string, int> mm;
    mm.insert({"score", 100});
    mm.insert({"score", 200});
    ```

    **Источник:** [Cppreference: std::multimap](https://en.cppreference.com/w/cpp/container/multimap)

31. Что такое `std::unordered_set`?

    **Ответ:** `std::unordered_set` — это ассоциативный контейнер уникальных элементов, основанный на хеш-таблице; элементы в нем не упорядочены, но поиск в среднем выполняется за $O(1)$.

    **Пример:**

    ```cpp
    #include <unordered_set>

    std::unordered_set<int> us = {10, 20, 30};
    bool found = us.contains(20);
    ```

    **Источник:** [Cppreference: std::unordered_set](https://en.cppreference.com/w/cpp/container/unordered_set)

32. Что такое `std::unordered_map`?

    **Ответ:** `std::unordered_map` — это ассоциативный контейнер пар "ключ-значение" с уникальными ключами, реализованный на основе хеш-таблицы с цепочками или открытой адресацией.

    **Пример:**

    ```cpp
    #include <unordered_map>
    #include <string>

    std::unordered_map<std::string, int> um;
    um["key"] = 42;
    ```

    **Источник:** [Cppreference: std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map)

33. Чем `map` отличается от `unordered_map` на базовом уровне?

    **Ответ:** `std::map` упорядочен, построен на деревьях поиска со сложностью операций $O(\log n)$ и требует оператора `<`, а `std::unordered_map` не упорядочен, построен на хеш-таблице со сложностью $O(1)$ в среднем и требует функции хеширования и оператора `==`.

    **Пример:**

    ```cpp
    #include <map>
    #include <unordered_map>

    std::map<int, int> m;            // отсортирован, O(log N)
    std::unordered_map<int, int> um; // произвольный порядок, O(1) в среднем
    ```

    **Источник:** [Cppreference: std::map](https://en.cppreference.com/w/cpp/container/map)

34. Что такое `std::string` в контексте стандартной библиотеки?

    **Ответ:** `std::string` — это псевдоним типа для `std::basic_string<char>`, предоставляющий непрерывный последовательный контейнер символов с поддержкой интерфейса STL и строковых операций (конкатенация, поиск подстрок).

    **Пример:**

    ```cpp
    #include <string>

    std::string str = "Hello";
    str += " World";
    char c = str[0];
    ```

    **Источник:** [Cppreference: std::basic_string](https://en.cppreference.com/w/cpp/string/basic_string)

35. Что такое `std::pair`?

    **Ответ:** `std::pair` — это шаблонная гетерогенная структура, объединяющая два произвольных значения в одну сущность с публичными полями `first` и `second`.

    **Пример:**

    ```cpp
    #include <utility>

    std::pair<int, double> p = {1, 3.14};
    int id = p.first;
    double val = p.second;
    ```

    **Источник:** [Cppreference: std::pair](https://en.cppreference.com/w/cpp/utility/pair)

36. Что такое `std::tuple`?

    **Ответ:** `std::tuple` — это кортеж, обобщение `std::pair` фиксированного размера, способный хранить произвольное число значений разных типов.

    **Пример:**

    ```cpp
    #include <tuple>
    #include <string>

    std::tuple<int, double, std::string> t{1, 2.5, "item"};
    int id = std::get<0>(t);
    ```

    **Источник:** [Cppreference: std::tuple](https://en.cppreference.com/w/cpp/utility/tuple)

37. Что такое `std::optional`?

    **Ответ:** `std::optional` (C++17) — это тип-обёртка, который может либо содержать инициализированное значение заданного типа, либо быть пустым (`std::nullopt`), заменяя использование сигнальных значений или указателей.

    **Пример:**

    ```cpp
    #include <optional>

    std::optional<int> find_even(int x) {
        if (x % 2 == 0) return x;
        return std::nullopt;
    }
    ```

    **Источник:** [Cppreference: std::optional](https://en.cppreference.com/w/cpp/utility/optional)

38. Что такое `std::variant`?

    **Ответ:** `std::variant` (C++17) — это типобезопасное дискриминированное объединение (union), способное хранить в один момент времени значение одного из заранее перечисленных альтернативных типов.

    **Пример:**

    ```cpp
    #include <variant>
    #include <string>

    std::variant<int, std::string> v = 10;
    v = "text";
    ```

    **Источник:** [Cppreference: std::variant](https://en.cppreference.com/w/cpp/utility/variant)

39. Что такое `std::any`?

    **Ответ:** `std::any` (C++17) — это типобезопасный контейнер для одиночного значения абсолютно любого CopyConstructible-типа с возможностью извлечения через `std::any_cast`.

    **Пример:**

    ```cpp
    #include <any>
    #include <string>

    std::any a = 42;
    a = std::string("abc");
    std::string s = std::any_cast<std::string>(a);
    ```

    **Источник:** [Cppreference: std::any](https://en.cppreference.com/w/cpp/utility/any)

40. Что такое `std::stack`?

    **Ответ:** `std::stack` — это контейнерный адаптер, предоставляющий семантику структуры данных LIFO (last-in, first-out) над базовым контейнером (по умолчанию `std::deque`).

    **Пример:**

    ```cpp
    #include <stack>

    std::stack<int> s;
    s.push(1);
    s.push(2);
    s.pop();
    ```

    **Источник:** [Cppreference: std::stack](https://en.cppreference.com/w/cpp/container/stack)

41. Что такое `std::queue`?

    **Ответ:** `std::queue` — это контейнерный адаптер, предоставляющий интерфейс FIFO (first-in, first-out) поверх базового контейнера (по умолчанию `std::deque`).

    **Пример:**

    ```cpp
    #include <queue>

    std::queue<int> q;
    q.push(1);
    q.push(2);
    int front_val = q.front();
    q.pop();
    ```

    **Источник:** [Cppreference: std::queue](https://en.cppreference.com/w/cpp/container/queue)

42. Что такое `std::priority_queue`?

    **Ответ:** `std::priority_queue` — это адаптер контейнера, гарантирующий, что первым извлекаемым элементом всегда является наибольший (по умолчанию) в соответствии с заданным компаратором (реализует двоичную кучу над `std::vector`).

    **Пример:**

    ```cpp
    #include <queue>

    std::priority_queue<int> pq;
    pq.push(10);
    pq.push(50);
    pq.push(20);
    int top = pq.top(); // 50
    ```

    **Источник:** [Cppreference: std::priority_queue](https://en.cppreference.com/w/cpp/container/priority_queue)

43. Почему `stack` и `queue` называют адаптерами контейнеров?

    **Ответ:** Они не реализуют собственные внутренние структуры размещения памяти, а инкапсулируют существующий контейнер (`deque`, `vector`, `list`), сужая его интерфейс до специализированных операций (`push`, `pop`, `top`/`front`).

    **Пример:**

    ```cpp
    #include <stack>
    #include <vector>

    std::stack<int, std::vector<int>> custom_stack;
    ```

    **Источник:** [Cppreference: Containers library](https://en.cppreference.com/w/cpp/container)

44. Что такое итератор “по смыслу”?

    **Ответ:** По смыслу итератор — это унифицированный курсор или указатель на элемент последовательности, абстрагирующий способ хранения данных и механизм перемещения к следующему или предыдущему элементу.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2};
    for (auto it = v.begin(); it != v.end(); ++it) {
        // it ведет себя как указатель на элемент v
    }
    ```

    **Источник:** [Cppreference: Iterator](https://en.cppreference.com/w/cpp/iterator)

45. Чем итератор похож на указатель?

    **Ответ:** Итератор синтаксически повторяет работу с сырым указателем: поддерживает разыменование (`*it`), доступ к членам через стрелку (`it->member`), инкремент (`++it`) и операторы сравнения.

    **Пример:**

    ```cpp
    #include <vector>

    struct Node { int val; };
    std::vector<Node> nodes = {{10}};
    auto it = nodes.begin();
    int v = it->val; // разыменование по аналогии с Node* ptr
    ```

    **Источник:** [Cppreference: Iterator concepts](https://en.cppreference.com/w/cpp/iterator)

46. Зачем контейнеру методы `begin()` и `end()`?

    **Ответ:** `begin()` возвращает итератор на первый элемент коллекции, а `end()` — итератор на позицию сразу за последним элементом, формируя полуоткрытый интервал $[begin, end)$ для обхода и алгоритмов.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2, 3};
    auto first = v.begin();
    auto past_end = v.end();
    ```

    **Источник:** [Cppreference: std::vector::begin](https://en.cppreference.com/w/cpp/container/vector/begin)

47. Что означает `end()` у контейнера?

    **Ответ:** `end()` указывает на фиктивную позицию past-the-end (сразу за последним элементом); он служит сигналом завершения диапазона и маркером ненахождения элемента.

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> v = {1, 2};
    bool not_found = (std::find(v.begin(), v.end(), 99) == v.end());
    ```

    **Источник:** [Cppreference: std::vector::end](https://en.cppreference.com/w/cpp/container/vector/end)

48. Можно ли разыменовывать `end()`?

    **Ответ:** Нет, разыменование `end()` приводит к неопределенному поведению (Undefined Behavior), так как он не указывает на существующий объект.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2, 3};
    auto it = v.end();
    // int val = *it; // UB: разыменование итератора конца недопустимо
    ```

    **Источник:** [Cppreference: std::vector::end](https://en.cppreference.com/w/cpp/container/vector/end)

49. Что такое range-based `for` и как он связан с `begin()`/`end()`?

    **Ответ:** Range-based `for` — это синтаксический сахар C++, разворачивающийся компилятором в цикл `for` с использованием вызовов `begin()` и `end()` (или свободных функций `std::begin`/`std::end`).

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2, 3};
    for (int x : v) {
        // эквивалентно auto __begin = v.begin(); auto __end = v.end(); ...
    }
    ```

    **Источник:** [Cppreference: Range-for loop](https://en.cppreference.com/w/cpp/language/range-for)

50. Что такое алгоритм `std::sort`?

    **Ответ:** `std::sort` — это алгоритм быстрой нестабильной сортировки элементов диапазона в порядке возрастания (со сложностью $O(N \log N)$), требующий RandomAccess-итераторов.

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> v = {4, 1, 3};
    std::sort(v.begin(), v.end());
    ```

    **Источник:** [Cppreference: std::sort](https://en.cppreference.com/w/cpp/algorithm/sort)

51. Для чего нужен `std::find`?

    **Ответ:** `std::find` выполняет линейный поиск первого элемента в диапазоне, равного заданному значению, и возвращает итератор на него (или `last`, если элемент не найден).

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> v = {10, 20, 30};
    auto it = std::find(v.begin(), v.end(), 20);
    ```

    **Источник:** [Cppreference: std::find](https://en.cppreference.com/w/cpp/algorithm/find)

52. Для чего нужен `std::count`?

    **Ответ:** `std::count` подсчитывает количество элементов в диапазоне, значение которых совпадает с заданным.

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> v = {1, 2, 2, 3, 2};
    auto cnt = std::count(v.begin(), v.end(), 2); // 3
    ```

    **Источник:** [Cppreference: std::count](https://en.cppreference.com/w/cpp/algorithm/count)

53. Для чего нужен `std::for_each`?

    **Ответ:** `std::for_each` применяет переданный функциональный объект ко всем элементам указанного диапазона по порядку.

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> v = {1, 2, 3};
    std::for_each(v.begin(), v.end(), [](int& x) { x *= 2; });
    ```

    **Источник:** [Cppreference: std::for_each](https://en.cppreference.com/w/cpp/algorithm/for_each)

54. Что делает `std::reverse`?

    **Ответ:** `std::reverse` меняет порядок элементов в диапазоне на противоположный на месте (in-place).

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> v = {1, 2, 3};
    std::reverse(v.begin(), v.end()); // {3, 2, 1}
    ```

    **Источник:** [Cppreference: std::reverse](https://en.cppreference.com/w/cpp/algorithm/reverse)

55. Что делает `std::copy`?

    **Ответ:** `std::copy` последовательно копирует элементы из исходного диапазона $[first, last)$ в целевой диапазон, начиная с указанного выходного итератора.

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> src = {1, 2, 3};
    std::vector<int> dst(3);
    std::copy(src.begin(), src.end(), dst.begin());
    ```

    **Источник:** [Cppreference: std::copy](https://en.cppreference.com/w/cpp/algorithm/copy)

56. Что делает `std::fill`?

    **Ответ:** `std::fill` присваивает заданное значение каждому элементу в диапазоне $[first, last)$.

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> v(5);
    std::fill(v.begin(), v.end(), -1);
    ```

    **Источник:** [Cppreference: std::fill](https://en.cppreference.com/w/cpp/algorithm/fill)

57. Что делает `std::min`?

    **Ответ:** `std::min` возвращает наименьшее из двух значений или наименьший элемент из списка инициализации `std::initializer_list`.

    **Пример:**

    ```cpp
    #include <algorithm>

    int m1 = std::min(10, 20);
    int m2 = std::min({5, 2, 8, 1});
    ```

    **Источник:** [Cppreference: std::min](https://en.cppreference.com/w/cpp/algorithm/min)

58. Что делает `std::max`?

    **Ответ:** `std::max` возвращает наибольшее из переданных аргументов или максимальное значение из `std::initializer_list`.

    **Пример:**

    ```cpp
    #include <algorithm>

    int val = std::max(10, 20); // 20
    ```

    **Источник:** [Cppreference: std::max](https://en.cppreference.com/w/cpp/algorithm/max)

59. Что делает `std::swap`?

    **Ответ:** `std::swap` обменивает значения двух объектов с использованием семантики перемещения.

    **Пример:**

    ```cpp
    #include <utility>

    int a = 1, b = 2;
    std::swap(a, b);
    ```

    **Источник:** [Cppreference: std::swap](https://en.cppreference.com/w/cpp/algorithm/swap)

60. Почему STL позволяет писать код короче и безопаснее, чем ручные циклы во многих случаях?

    **Ответ:** STL инкапсулирует граничные условия (исключая ошибки выхода за границы на единицу — off-by-one errors), явно выражает намерение программиста на высоком уровне абстракции и оптимизирована авторами стандартных библиотек.

    **Пример:**

    ```cpp
    #include <vector>
    #include <algorithm>

    std::vector<int> v = {1, 2, 3};
    // Вместо ручного цикла с индексами и проверками:
    bool all_positive = std::all_of(v.begin(), v.end(), [](int x) { return x > 0; });
    ```

    **Источник:** [Cppreference: Algorithms library](https://en.cppreference.com/w/cpp/algorithm)

---

## Ниже среднего уровня

61. Какие контейнеры STL относятся к последовательным?

    **Ответ:** К последовательным контейнерам относятся `std::vector`, `std::deque`, `std::list`, `std::forward_list`, `std::array` (и отчасти `std::basic_string`).

    **Пример:**

    ```cpp
    #include <vector>
    #include <deque>
    #include <list>

    std::vector<int> v;
    std::deque<int> d;
    std::list<int> l;
    ```

    **Источник:** [Cppreference: Sequence containers](https://en.cppreference.com/w/cpp/container#Sequence_containers)

62. Какие контейнеры STL относятся к ассоциативным?

    **Ответ:** К упорядоченным ассоциативным контейнерам относятся `std::set`, `std::map`, `std::multiset` и `std::multimap`.

    **Пример:**

    ```cpp
    #include <set>
    #include <map>

    std::set<int> s;
    std::map<int, int> m;
    ```

    **Источник:** [Cppreference: Associative containers](https://en.cppreference.com/w/cpp/container#Associative_containers)

63. Какие контейнеры STL относятся к неупорядоченным ассоциативным?

    **Ответ:** К неупорядоченным ассоциативным контейнерам относятся `std::unordered_set`, `std::unordered_map`, `std::unordered_multiset` и `std::unordered_multimap`.

    **Пример:**

    ```cpp
    #include <unordered_set>
    #include <unordered_map>

    std::unordered_set<int> us;
    std::unordered_map<int, int> um;
    ```

    **Источник:** [Cppreference: Unordered associative containers](https://en.cppreference.com/w/cpp/container#Unordered_associative_containers)

64. Что такое последовательный контейнер?

    **Ответ:** Последовательный контейнер организует хранение элементов в линейном порядке, определяемом пользователем (временем добавления или позицией вставки), независимо от значений самих элементов.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v;
    v.push_back(42);
    v.push_back(10); // порядок строго сохраняется: 42, затем 10
    ```

    **Источник:** [Cppreference: Sequence containers](https://en.cppreference.com/w/cpp/container#Sequence_containers)

65. Что такое ассоциативный контейнер?

    **Ответ:** Ассоциативный контейнер хранит элементы, упорядоченные по ключу, обеспечивая быстрый поиск ($O(\log n)$ или $O(1)$) по значению ключа, а не по физическому индексу.

    **Пример:**

    ```cpp
    #include <map>
    #include <string>

    std::map<std::string, int> dict;
    dict["apple"] = 5;
    int val = dict["apple"];
    ```

    **Источник:** [Cppreference: Associative containers](https://en.cppreference.com/w/cpp/container#Associative_containers)

66. Чем `vector` отличается от `list`?

    **Ответ:** `vector` размещает элементы непрерывно в едином буфере памяти (произвольный доступ за $O(1)$, кэш-дружелюбен), а `list` — в разрозненных узлах (доступ за $O(n)$, вставка в произвольное место за $O(1)$ без перемещения остальных элементов).

    **Пример:**

    ```cpp
    #include <vector>
    #include <list>

    std::vector<int> v = {1, 2, 3};
    int x = v[2]; // O(1)

    std::list<int> l = {1, 2, 3};
    // l[2] недоступно, требуется O(N) проход итератором
    ```

    **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

67. Чем `vector` отличается от `deque`?

    **Ответ:** `vector` хранит данные в одном непрерывном блоке памяти и дешев при добавлении в конец, а `deque` хранит данные кусками (чанками) фиксированного размера, обеспечивая $O(1)$ добавление как в конец, так и в начало без копирования всего массива при расширении.

    **Пример:**

    ```cpp
    #include <deque>

    std::deque<int> d;
    d.push_front(1); // O(1) без реаллокации всех элементов
    ```

    **Источник:** [Cppreference: std::deque](https://en.cppreference.com/w/cpp/container/deque)

68. Когда `vector` обычно предпочтительнее `list`?

    **Ответ:** `vector` предпочтительнее практически всегда, когда нужен быстрый доступ по индексу, обход элементов в цикле или когда размер коллекции заранее известен или растет преимущественно добавлением в конец.

    **Пример:**

    ```cpp
    #include <vector>
    #include <numeric>

    std::vector<int> v(1000, 1);
    int sum = std::accumulate(v.begin(), v.end(), 0); // кэш L1/L2 используется максимально эффективно
    ```

    **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

69. Почему `vector` так часто используется по умолчанию?

    **Ответ:** За счет непрерывного размещения в памяти `vector` обладает минимальным оверхедом памяти на элемент и идеальной пространственной локальностью данных (spatial locality), что критично для работы кэша процессора.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2, 3, 4}; // все элементы лежат строго подряд в RAM
    ```

    **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

70. Что означает “элементы `vector` хранятся непрерывно”?

    **Ответ:** Это значит, что между соседними элементами нет промежутков в адресах: `&v[i] == &v[0] + i`, что позволяет передавать вектор в функции Си через `v.data()`.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {10, 20, 30};
    int* ptr = v.data();
    int second = *(ptr + 1); // 20
    ```

    **Источник:** [Cppreference: std::vector::data](https://en.cppreference.com/w/cpp/container/vector/data)

71. Чем непрерывное хранение полезно для производительности?

    **Ответ:** Процессор загружает данные строками кэша (cache lines по 64 байта) и использует аппаратный prefetcher, что исключает частые промахи кэша (cache misses) при последовательном обходе.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v(10000);
    for (auto& x : v) x += 1; // префетчер ЦП заранее подгружает последующие данные
    ```

    **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

72. Что такое capacity у `std::vector`?

    **Ответ:** `capacity` — это общее количество элементов, под которое выделена память в текущем внутреннем буфере без необходимости выполнять новую аллокацию.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v;
    v.reserve(100);
    std::size_t cap = v.capacity(); // >= 100
    ```

    **Источник:** [Cppreference: std::vector::capacity](https://en.cppreference.com/w/cpp/container/vector/capacity)

73. Чем `size()` отличается от `capacity()`?

    **Ответ:** `size()` — это фактическое количество реально существующих элементов в контейнере, а `capacity()` — максимальное количество элементов, которое поместится в выделенный буфер без реаллокации.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2, 3};
    // v.size() == 3
    // v.capacity() >= 3
    ```

    **Источник:** [Cppreference: std::vector::size](https://en.cppreference.com/w/cpp/container/vector/size)

74. Что делает `reserve()` у `vector`?

    **Ответ:** `reserve(n)` заранее выделяет непрерывную память минимум под `n` элементов, увеличивая `capacity`, но не создает сами объекты и не изменяет `size()`.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v;
    v.reserve(50); // size() по-прежнему 0, capacity() >= 50
    ```

    **Источник:** [Cppreference: std::vector::reserve](https://en.cppreference.com/w/cpp/container/vector/reserve)

75. Что делает `resize()` у `vector`?

    **Ответ:** `resize(n)` меняет фактическое число элементов (`size()`): при увеличении создаются новые элементы со значением по умолчанию, при уменьшении лишние элементы уничтожаются.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2};
    v.resize(4); // v содержит: 1, 2, 0, 0
    ```

    **Источник:** [Cppreference: std::vector::resize](https://en.cppreference.com/w/cpp/container/vector/resize)

76. Чем `push_back()` отличается от `emplace_back()`?

    **Ответ:** `push_back()` принимает уже сконструированный объект (или перемещает его), а `emplace_back()` принимает аргументы конструктора и создает объект непосредственно в памяти вектора (in-place).

    **Пример:**

    ```cpp
    #include <vector>
    #include <string>

    std::vector<std::string> v;
    v.push_back(std::string(5, 'a')); // создается временный объект
    v.emplace_back(5, 'a');           // конструируется сразу в буфере
    ```

    **Источник:** [Cppreference: std::vector::emplace_back](https://en.cppreference.com/w/cpp/container/vector/emplace_back)

77. Что делает `pop_back()`?

    **Ответ:** `pop_back()` уничтожает последний элемент контейнера и уменьшает его размер на единицу, не возвращая никакого значения.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2};
    v.pop_back(); // остался {1}
    ```

    **Источник:** [Cppreference: std::vector::pop_back](https://en.cppreference.com/w/cpp/container/vector/pop_back)

78. Что делает `clear()`?

    **Ответ:** `clear()` вызывает деструкторы для всех элементов контейнера и устанавливает `size()` в ноль.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2, 3};
    v.clear();
    bool empty = v.empty(); // true
    ```

    **Источник:** [Cppreference: std::vector::clear](https://en.cppreference.com/w/cpp/container/vector/clear)

79. Удаляет ли `clear()` память capacity у `vector`?

    **Ответ:** Нет, стандарт гарантирует, что `clear()` не освобождает выделенную память; `capacity()` остается неизменным для повторного использования буфера.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2, 3};
    auto cap_before = v.capacity();
    v.clear();
    bool same_cap = (v.capacity() == cap_before); // true
    ```

    **Источник:** [Cppreference: std::vector::clear](https://en.cppreference.com/w/cpp/container/vector/clear)

80. Что делает `shrink_to_fit()`?

    **Ответ:** `shrink_to_fit()` отправляет запрос на освобождение неиспользуемой памяти, уменьшая `capacity()` до текущего размера `size()` (запрос не является строго обязательным к исполнению, но современные компиляторы его выполняют).

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v(1000);
    v.resize(10);
    v.shrink_to_fit(); // capacity сокращается до ~10
    ```

    **Источник:** [Cppreference: std::vector::shrink_to_fit](https://en.cppreference.com/w/cpp/container/vector/shrink_to_fit)

81. Что такое `front()` и `back()`?

    **Ответ:** Методы `front()` и `back()` возвращают ссылки на первый и последний элементы непустого контейнера соответственно.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {10, 20, 30};
    int first = v.front(); // 10
    int last = v.back();   // 30
    ```

    **Источник:** [Cppreference: std::vector::front](https://en.cppreference.com/w/cpp/container/vector/front)

82. Чем `operator[]` отличается от `at()`?

    **Ответ:** `operator[]` не проверяет выход индекса за пределы диапазона ради максимальной скорости, тогда как метод `at()` выполняет проверку и при выходе за границы выбрасывает исключение `std::out_of_range`.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2};
    int a = v[0];    // быстро, без проверок
    int b = v.at(0); // с проверкой границ
    ```

    **Источник:** [Cppreference: std::vector::at](https://en.cppreference.com/w/cpp/container/vector/at)

83. Почему `at()` безопаснее `operator[]`?

    **Ответ:** `at()` исключает неявное чтение или порчу чужой памяти (Undefined Behavior), сообщая об ошибке через штатный механизм исключений C++.

    **Пример:**

    ```cpp
    #include <vector>
    #include <stdexcept>

    std::vector<int> v = {1};
    try {
        v.at(5) = 10;
    } catch (const std::out_of_range& e) {
        // перехвачено и безопасно обработано
    }
    ```

    **Источник:** [Cppreference: std::vector::at](https://en.cppreference.com/w/cpp/container/vector/at)

84. Что такое выброс исключения `std::out_of_range`?

    **Ответ:** Это стандартное исключение, сигнализирующее о попытке доступа к элементу за допустимыми пределами индексации коллекции.

    **Пример:**

    ```cpp
    #include <vector>
    #include <stdexcept>

    std::vector<int> v;
    // v.at(0); // бросает std::out_of_range
    ```

    **Источник:** [Cppreference: std::out_of_range](https://en.cppreference.com/w/cpp/error/out_of_range)

85. Как вставить элемент в `vector` в конец?

    **Ответ:** С помощью методов `push_back(val)` или `emplace_back(args...)`.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v;
    v.push_back(100);
    ```

    **Источник:** [Cppreference: std::vector::push_back](https://en.cppreference.com/w/cpp/container/vector/push_back)

86. Как вставить элемент в середину `vector`?

    **Ответ:** С помощью метода `insert(it, val)` или `emplace(it, args...)`, передав итератор на позицию вставки.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 3};
    v.insert(v.begin() + 1, 2); // {1, 2, 3}
    ```

    **Источник:** [Cppreference: std::vector::insert](https://en.cppreference.com/w/cpp/container/vector/insert)

87. Чем операция вставки в середину `vector` может быть дорогой?

    **Ответ:** Все элементы, находящиеся правее точки вставки, должны быть сдвинуты вправо на одну позицию, что требует $O(N)$ операций копирования или перемещения.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v(1000000, 1);
    v.insert(v.begin(), 0); // сдвинет 1 млн элементов
    ```

    **Источник:** [Cppreference: std::vector::insert](https://en.cppreference.com/w/cpp/container/vector/insert)

88. Что делает `erase()`?

    **Ответ:** Метод `erase()` удаляет один элемент по переданному итератору или диапазон элементов $[first, last)$ и возвращает итератор на следующий элемент.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {1, 2, 3};
    v.erase(v.begin() + 1); // v = {1, 3}
    ```

    **Источник:** [Cppreference: std::vector::erase](https://en.cppreference.com/w/cpp/container/vector/erase)

89. Почему удаление из середины `vector` требует сдвига элементов?

    **Ответ:** Контейнер `vector` обязан соблюдать инвариант непрерывного расположения элементов в памяти, поэтому образовавшуюся брешь необходимо заполнить сдвигом всех последующих элементов влево.

    **Пример:**

    ```cpp
    #include <vector>

    std::vector<int> v = {10, 20, 30, 40};
    v.erase(v.begin() + 1); // 30 и 40 сдвигаются влево
    ```

    **Источник:** [Cppreference: std::vector::erase](https://en.cppreference.com/w/cpp/container/vector/erase)

90. Как работает `std::list` с точки зрения памяти?

    **Ответ:** Каждый элемент создается в куче отдельно в виде отдельного узла, содержащего хранимое значение и два указателя (`next` и `prev`).

    **Пример:**

    ```cpp
    #include <list>

    std::list<int> l;
    l.push_back(1); // выделяется отдельный узел Node { int data; Node* next; Node* prev; }
    ```

    **Источник:** [Cppreference: std::list](https://en.cppreference.com/w/cpp/container/list)

91. Почему `list` не хранит элементы непрерывно?

    **Ответ:** Потому что каждый узел аллоцируется динамически независимо в произвольных адресах свободной памяти для обеспечения вставки и удаления за $O(1)$ без перемещения других узлов.

    **Пример:**

    ```cpp
    #include <list>

    std::list<int> l = {1, 2};
    const int* p1 = &l.front();
    const int* p2 = &l.back();
    // (p2 - p1) не обязательно равен 1 или sizeof(int)
    ```

    **Источник:** [Cppreference: std::list](https://en.cppreference.com/w/cpp/container/list)

92. Чем полезна двусвязность `std::list`?

    **Ответ:** Двусвязность позволяет одинаково эффективно перемещаться по списку как вперед, так и назад (`BidirectionalIterator`), а также удалять и вставлять элементы перед заданным узлом за $O(1)$.

    **Пример:**

    ```cpp
    #include <list>

    std::list<int> l = {1, 2, 3};
    auto it = l.end();
    --it; // переход назад за O(1)
    ```

    **Источник:** [Cppreference: std::list](https://en.cppreference.com/w/cpp/container/list)

93. Почему `list` плохо подходит для случайного доступа по индексу?

    **Ответ:** Для доступа к $k$-му элементу требуется последовательно пройти $k$ связей по указателям, что имеет сложность $O(k)$ и вызывает многократные промахи кэша.

    **Пример:**

    ```cpp
    #include <list>
    #include <iterator>

    std::list<int> l = {10, 20, 30, 40};
    auto it = l.begin();
    std::advance(it, 3); // O(N) шагов
    ```

    **Источник:** [Cppreference: std::list](https://en.cppreference.com/w/cpp/container/list)

94. Что значит, что у `list` нет `operator[]`?

    **Ответ:** Разработчики STL сознательно не перегружали `operator[]` для `std::list`, чтобы интерфейс класса не скрывал катастрофическую неэффективность операции случайного доступа ($O(N)$ вместо ожидаемого пользователем $O(1)$).

    **Пример:**

    ```cpp
    #include <list>

    std::list<int> l = {1, 2};
    // l[0]; // Ошибка компиляции
    ```

    **Источник:** [Cppreference: std::list](https://en.cppreference.com/w/cpp/container/list)

95. Чем `deque` полезен по сравнению с `vector`?

    **Ответ:** `deque` обеспечивает эффективную вставку и удаление в начало контейнера за $O(1)$ без необходимости сдвига существующих элементов и без инвалидации указателей на нетронутые элементы.

    **Пример:**

    ```cpp
    #include <deque>

    std::deque<int> d = {2, 3};
    d.push_front(1); // O(1)
    ```

    **Источник:** [Cppreference: std::deque](https://en.cppreference.com/w/cpp/container/deque)

96. Когда `deque` удобнее `vector`?

    **Ответ:** Когда требуется очередь с двусторонним концом (частые добавления/удаления с обоих концов), либо когда размер данных очень велик и нежелательно иметь один гигантский монолитный кусок непрерывной памяти.

    **Пример:**

    ```cpp
    #include <deque>

    std::deque<int> task_queue;
    task_queue.push_back(10);
    task_queue.push_front(5);
    ```

    **Источник:** [Cppreference: std::deque](https://en.cppreference.com/w/cpp/container/deque)

97. Что такое ключ в `map`?

    **Ответ:** Ключ — это уникальное значение, используемое для идентификации, поиска и поддержания порядка элементов в контейнере `std::map`.

    **Пример:**

    ```cpp
    #include <map>
    #include <string>

    std::map<std::string, int> m; // std::string — это тип ключа
    m["Alice"] = 100;
    ```

    **Источник:** [Cppreference: std::map](https://en.cppreference.com/w/cpp/container/map)

98. Что такое значение в `map`?

    **Ответ:** Значение — это полезная нагрузка (mapped value), сопоставленная конкретному ключу.

    **Пример:**

    ```cpp
    #include <map>

    std::map<int, double> m;
    m[1] = 3.14; // 3.14 — это значение (mapped_type)
    ```

    **Источник:** [Cppreference: std::map](https://en.cppreference.com/w/cpp/container/map)

99. Что хранит элемент `std::map<K, V>`?

    **Ответ:** Элемент `std::map<K, V>` представляет собой пару `std::pair<const K, V>`, где ключ константен для защиты от нарушения порядка в дереве.

    **Пример:**

    ```cpp
    #include <map>

    std::map<int, int> m = {{1, 10}};
    std::pair<const int, int>& ref = *m.begin();
    ```

    **Источник:** [Cppreference: std::map](https://en.cppreference.com/w/cpp/container/map)

100. Почему `map` хранит пары `key-value`?

     **Ответ:** Чтобы реализовать семантику ассоциативного массива (словаря), связывающего уникальный поисковый ключ с ассоциированными данными.

     **Пример:**

     ```cpp
     #include <map>
     #include <string>

     std::map<int, std::string> students;
     students.insert({101, "Ivan"});
     ```

     **Источник:** [Cppreference: std::map](https://en.cppreference.com/w/cpp/container/map)

101. Что такое уникальность ключа в `map`?

     **Ответ:** В `std::map` не может находиться двух элементов с эквивалентными ключами; при попытке вставки дубликата новая пара игнорируется (через `insert`).

     **Пример:**

     ```cpp
     #include <map>

     std::map<int, int> m;
     m.insert({1, 100});
     auto [it, inserted] = m.insert({1, 200});
     // inserted == false, значение осталось 100
     ```

     **Источник:** [Cppreference: std::map::insert](https://en.cppreference.com/w/cpp/container/map/insert)

102. Чем `map` отличается от `multimap`?

     **Ответ:** `std::map` содержит только уникальные ключи, тогда как `std::multimap` позволяет хранить несколько элементов с одинаковыми ключами.

     **Пример:**

     ```cpp
     #include <map>

     std::multimap<int, int> mm;
     mm.insert({1, 10});
     mm.insert({1, 20}); // оба элемента сохранены
     ```

     **Источник:** [Cppreference: std::multimap](https://en.cppreference.com/w/cpp/container/multimap)

103. Чем `set` отличается от `multiset`?

     **Ответ:** `std::set` хранит только уникальные элементы, а `std::multiset` поддерживает хранение дубликатов.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s = {1, 1};      // s.size() == 1
     std::multiset<int> ms = {1, 1}; // ms.size() == 2
     ```

     **Источник:** [Cppreference: std::set](https://en.cppreference.com/w/cpp/container/set)

104. Что такое автоматическая сортировка ключей в `map` и `set`?

     **Ответ:** При любой вставке узел дерева размещается в строгом соответствии с отношением порядка компаратора, благодаря чему обход контейнера через итераторы всегда дает отсортированную последовательность.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s;
     s.insert(50);
     s.insert(10);
     // *s.begin() вернет 10
     ```

     **Источник:** [Cppreference: std::set](https://en.cppreference.com/w/cpp/container/set)

105. По какому критерию по умолчанию сортируются ключи?

     **Ответ:** По умолчанию используется стандартный функциональный объект `std::less<Key>`, вызывающий оператор `<` для ключей.

     **Пример:**

     ```cpp
     #include <set>
     #include <functional>

     std::set<int, std::less<int>> s; // эквивалентно std::set<int>
     ```

     **Источник:** [Cppreference: std::less](https://en.cppreference.com/w/cpp/utility/functional/less)

106. Что делает `insert()` для `set`?

     **Ответ:** `insert()` пытается вставить элемент в множество и возвращает пару `std::pair<iterator, bool>`, где `bool` указывает, произошла ли фактическая вставка.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s;
     auto res = s.insert(10);
     bool ok = res.second; // true
     ```

     **Источник:** [Cppreference: std::set::insert](https://en.cppreference.com/w/cpp/container/set/insert)

107. Что вернёт вставка уже существующего ключа в `set`?

     **Ответ:** Метод `insert()` вернет пару, состоящую из итератора на уже существующий в множестве элемент и флага `false`.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s = {42};
     auto [it, inserted] = s.insert(42);
     // inserted == false, *it == 42
     ```

     **Источник:** [Cppreference: std::set::insert](https://en.cppreference.com/w/cpp/container/set/insert)

108. Почему `unordered_map` не гарантирует порядок элементов?

     **Ответ:** Элементы распределяются по корзинам (buckets) в зависимости от хеш-кода их ключей; при добавлении новых элементов и рехешировании порядок обхода может произвольно меняться.

     **Пример:**

     ```cpp
     #include <unordered_map>

     std::unordered_map<int, int> um = {{1, 10}, {2, 20}, {3, 30}};
     // порядок итерации не гарантированно возрастающий
     ```

     **Источник:** [Cppreference: std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map)

109. Что такое хеш-функция на базовом уровне?

     **Ответ:** Хеш-функция — это детерминированная функция, преобразующая ключ произвольного типа в целочисленное значение фиксированного размера (`size_t`), используемое для выбора индекса корзины.

     **Пример:**

     ```cpp
     #include <string>
     #include <functional>

     std::hash<std::string> hasher;
     std::size_t h = hasher("test");
     ```

     **Источник:** [Cppreference: std::hash](https://en.cppreference.com/w/cpp/utility/hash)

110. Почему `unordered_map` обычно ищет элементы иначе, чем `map`?

     **Ответ:** `map` совершает логарифмический спуск по узлам дерева через сравнение элементов (`<`), а `unordered_map` сразу вычисляет индекс корзины по хеш-коду ($O(1)$) и ищет элемент в коротком списке совпадений корзины через оператор `==`.

     **Пример:**

     ```cpp
     #include <unordered_map>

     std::unordered_map<int, int> um = {{1, 10}};
     auto it = um.find(1); // Прямой доступ к корзине за O(1)
     ```

     **Источник:** [Cppreference: std::unordered_map::find](https://en.cppreference.com/w/cpp/container/unordered_map/find)

---

## Средний уровень

111. Какие основные категории итераторов существуют в STL?

     **Ответ:** До C++20 выделяли 5 категорий: Input, Output, Forward, Bidirectional, Random Access. Начиная с C++20 добавлена категория Contiguous Iterator.

     **Пример:**

     ```cpp
     #include <iterator>
     #include <vector>

     using Cat = std::iterator_traits<std::vector<int>::iterator>::iterator_category;
     // Cat является std::random_access_iterator_tag (или contiguous_iterator_tag в C++20)
     ```

     **Источник:** [Cppreference: Iterator library](https://en.cppreference.com/w/cpp/iterator)

112. Что такое input iterator?

     **Ответ:** Итератор ввода, поддерживающий чтение значений (только один раз при прямом проходе), инкремент `++` и проверку на равенство (`std::istream_iterator`).

     **Пример:**

     ```cpp
     #include <iostream>
     #include <iterator>
     #include <sstream>

     std::istringstream stream("1 2 3");
     std::istream_iterator<int> it(stream);
     int first = *it;
     ```

     **Источник:** [Cppreference: LegacyInputIterator](https://en.cppreference.com/w/cpp/named_req/InputIterator)

113. Что такое output iterator?

     **Ответ:** Итератор вывода, поддерживающий однократную запись значений при прямом проходе через разыменование и инкремент (`*it = val; ++it;`).

     **Пример:**

     ```cpp
     #include <iostream>
     #include <iterator>

     std::ostream_iterator<int> out(std::cout, " ");
     *out = 42; // выводит 42 в поток
     ```

     **Источник:** [Cppreference: LegacyOutputIterator](https://en.cppreference.com/w/cpp/named_req/OutputIterator)

114. Что такое forward iterator?

     **Ответ:** Итератор прямого доступа, объединяющий возможности Input и Output и позволяющий многократно читать и записывать данные в рамках нескольких прямых проходов (`std::forward_list`).

     **Пример:**

     ```cpp
     #include <forward_list>

     std::forward_list<int> fl = {1, 2};
     auto it = fl.begin();
     int val1 = *it;
     int val2 = *it; // многократное чтение валидно
     ```

     **Источник:** [Cppreference: LegacyForwardIterator](https://en.cppreference.com/w/cpp/named_req/ForwardIterator)

115. Что такое bidirectional iterator?

     **Ответ:** Двунаправленный итератор, поддерживающий все свойства Forward-итератора, а также операцию декремента (`--it`) для движения назад (`std::list`, `std::set`).

     **Пример:**

     ```cpp
     #include <list>

     std::list<int> l = {1, 2};
     auto it = l.end();
     --it; // разрешено
     ```

     **Источник:** [Cppreference: LegacyBidirectionalIterator](https://en.cppreference.com/w/cpp/named_req/BidirectionalIterator)

116. Что такое random access iterator?

     **Ответ:** Итератор произвольного доступа, позволяющий перемещаться на произвольное смещение за $O(1)$ (`it += n`, `it[n]`, `it2 - it1`, сравнения `<, >`).

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {10, 20, 30, 40};
     auto it = v.begin() + 2; // O(1)
     ```

     **Источник:** [Cppreference: LegacyRandomAccessIterator](https://en.cppreference.com/w/cpp/named_req/RandomAccessIterator)

117. Что такое contiguous iterator в современном C++?

     **Ответ:** Итератор, гарантирующий, что логически следующие друг за другом элементы физически непрерывно расположены в оперативной памяти (`*(it + n)` эквивалентно `*(&*it + n)`).

     **Пример:**

     ```cpp
     #include <vector>
     #include <iterator>

     std::vector<int> v = {1, 2, 3};
     // v.begin() удовлетворяет std::contiguous_iterator в C++20
     ```

     **Источник:** [Cppreference: contiguous_iterator](https://en.cppreference.com/w/cpp/iterator/contiguous_iterator)

118. Почему не любой алгоритм работает с любым контейнером?

     **Ответ:** Алгоритмы предъявляют формальные требования к категории итераторов; если контейнер не предоставляет итератор нужной категории, код не скомпилируется.

     **Пример:**

     ```cpp
     #include <list>
     #include <algorithm>

     std::list<int> l = {3, 1, 2};
     // std::sort(l.begin(), l.end()); // Ошибка компиляции: нужен RandomAccessIterator
     ```

     **Источник:** [Cppreference: Iterator library](https://en.cppreference.com/w/cpp/iterator)

119. Почему `std::sort` требует более сильной категории итератора, чем `std::find`?

     **Ответ:** `std::find` совершает простой последовательный проход ($O(N)$), требуя лишь `InputIterator`, а алгоритм `std::sort` (Introsort) делит диапазоны, вычисляет медианы и делает произвольные прыжки по индексам, что требует `RandomAccessIterator`.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 2, 3};
     auto f = std::find(v.begin(), v.end(), 2); // InputIterator достаточен
     std::sort(v.begin(), v.end());             // RandomAccessIterator обязателен
     ```

     **Источник:** [Cppreference: std::sort](https://en.cppreference.com/w/cpp/algorithm/sort)

120. Почему `std::sort` нельзя применять к `std::list`?

     **Ответ:** Итераторы `std::list` являются `BidirectionalIterator` и не поддерживают арифметику указателей (`it + n`) и произвольный доступ за $O(1)$.

     **Пример:**

     ```cpp
     #include <list>
     #include <algorithm>

     std::list<int> l = {2, 1};
     // std::sort(l.begin(), l.end()); // Не скомпилируется
     ```

     **Источник:** [Cppreference: std::list::sort](https://en.cppreference.com/w/cpp/container/list/sort)

121. Какой алгоритм сортировки есть специально у `std::list`?

     **Ответ:** У `std::list` есть встроенный метод-член `list::sort()`, который эффективно реализует сортировку слиянием (Merge Sort) перелинковкой указателей узлов без копирования данных.

     **Пример:**

     ```cpp
     #include <list>

     std::list<int> l = {4, 2, 1, 3};
     l.sort();
     ```

     **Источник:** [Cppreference: std::list::sort](https://en.cppreference.com/w/cpp/container/list/sort)

122. Что такое `const_iterator`?

     **Ответ:** Это итератор, предоставляющий доступ к элементам только по константной ссылке (`const T&`), запрещая их модификацию через разыменование.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {1, 2};
     std::vector<int>::const_iterator cit = v.cbegin();
     // *cit = 10; // Ошибка компиляции
     ```

     **Источник:** [Cppreference: std::vector::cbegin](https://en.cppreference.com/w/cpp/container/vector/begin)

123. Чем `iterator` отличается от `const_iterator`?

     **Ответ:** `iterator` позволяет как читать, так и изменять указываемый элемент (`T&`), а `const_iterator` гарантирует неизменность указываемого объекта (`const T&`).

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {1, 2};
     *v.begin() = 10;   // Валидно
     // *v.cbegin() = 10; // Невалидно
     ```

     **Источник:** [Cppreference: std::vector::begin](https://en.cppreference.com/w/cpp/container/vector/begin)

124. Что такое обратный итератор?

     **Ответ:** Это адаптер `std::reverse_iterator`, который инвертирует направление обхода диапазона: операция `++it` на самом деле сдвигает итератор к предыдущему элементу базовой последовательности.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {1, 2, 3};
     auto rit = v.rbegin();
     int first_from_end = *rit; // 3
     ```

     **Источник:** [Cppreference: std::reverse_iterator](https://en.cppreference.com/w/cpp/iterator/reverse_iterator)

125. Для чего нужны `rbegin()` и `rend()`?

     **Ответ:** Они возвращают обратные итераторы: `rbegin()` указывает на последний элемент контейнера, а `rend()` — на теоретическую позицию перед первым элементом.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {1, 2, 3};
     for (auto it = v.rbegin(); it != v.rend(); ++it) {
         // печатает 3, 2, 1
     }
     ```

     **Источник:** [Cppreference: std::vector::rbegin](https://en.cppreference.com/w/cpp/container/vector/rbegin)

126. Как пройти контейнер в обратном порядке?

     **Ответ:** Использовать цикл с обратными итераторами от `rbegin()` до `rend()` либо использовать `std::views::reverse` (C++20).

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2, 3};
     for (int x : std::views::reverse(v)) {
         // обход: 3, 2, 1
     }
     ```

     **Источник:** [Cppreference: std::ranges::reverse_view](https://en.cppreference.com/w/cpp/ranges/reverse_view)

127. Что такое инвалидирование итераторов?

     **Ответ:** Это состояние, при котором ранее полученный итератор, указатель или ссылка становятся недействительными (указывают на освобожденную память или нарушенную внутреннюю структуру), а их разыменование ведет к UB.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {1, 2};
     auto it = v.begin();
     v.push_back(3); // может произойти реаллокация буфера
     // int val = *it; // UB, если буфер перевыделен
     ```

     **Источник:** [Cppreference: Iterator invalidation](https://en.cppreference.com/w/cpp/container#Iterator_invalidation)

128. Почему операции над контейнером могут инвалидировать итераторы?

     **Ответ:** Из-за изменения внутренней структуры: перемещения всего массива в новый блок памяти (реаллокация вектора), сдвига соседних элементов (`erase`/`insert`) или уничтожения целевых узлов.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {10, 20, 30};
     auto it = v.begin() + 2;
     v.erase(v.begin()); // сдвиг влево инвалидирует итераторы на позиции за точкой удаления
     ```

     **Источник:** [Cppreference: Iterator invalidation](https://en.cppreference.com/w/cpp/container#Iterator_invalidation)

129. Когда `push_back()` у `vector` может инвалидировать итераторы?

     **Ответ:** Всегда, когда новый размер превышает текущий `capacity()` вектора, провоцируя реаллокацию буфера (если `size() < capacity()`, инвалидируется только `end()`).

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v;
     v.reserve(2);
     auto it = v.begin();
     v.push_back(1); // it валиден
     v.push_back(2); // it валиден
     v.push_back(3); // реаллокация: ВСЕ итераторы инвалидированы!
     ```

     **Источник:** [Cppreference: std::vector::push_back](https://en.cppreference.com/w/cpp/container/vector/push_back)

130. Почему реаллокация `vector` делает старые указатели и итераторы недействительными?

     **Ответ:** Старый непрерывный блок памяти освобождается (через аллокатор/деаллокатор), а элементы переносятся в совершенно другую область кучи. Старые адреса становятся висячими указателями (dangling pointers).

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {1};
     const int* ptr = &v[0];
     v.resize(1000); // память перевыделена
     // *ptr - Use-After-Free
     ```

     **Источник:** [Cppreference: std::vector::reserve](https://en.cppreference.com/w/cpp/container/vector/reserve)

131. Когда вставка в `list` обычно не инвалидирует итераторы на другие элементы?

     **Ответ:** Вставка в `std::list` никогда не инвалидирует итераторы и ссылки на существующие элементы, так как новый узел создается в отдельном участке памяти, а у старых узлов меняются лишь указатели `next`/`prev`.

     **Пример:**

     ```cpp
     #include <list>

     std::list<int> l = {1, 3};
     auto it = l.begin();
     l.insert(std::next(it), 2);
     int val = *it; // абсолютно безопасно, it по-прежнему валиден
     ```

     **Источник:** [Cppreference: std::list::insert](https://en.cppreference.com/w/cpp/container/list/insert)

132. Почему правила инвалидирования важно знать наизусть для разных контейнеров?

     **Ответ:** Ошибки инвалидации приводят к трудноуловимым багам повреждения памяти (Undefined Behavior, Use-After-Free), которые могут не проявляться на тестах, но приводить к сбоям и уязвимостям в продакшене.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {1, 2, 3, 4};
     // Ошибка: инвалидация it прямо внутри цикла
     // for (auto it = v.begin(); it != v.end(); ++it) if (*it == 2) v.erase(it);
     ```

     **Источник:** [Cppreference: Iterator invalidation](https://en.cppreference.com/w/cpp/container#Iterator_invalidation)

133. Что делает `std::begin()` и `std::end()` как свободные функции?

     **Ответ:** Они возвращают итераторы начала и конца переданного диапазона, единообразно работая как со стандартными контейнерами (вызывая `c.begin()`), так и со встроенными массивами `T[N]`.

     **Пример:**

     ```cpp
     #include <iterator>

     int arr[] = {1, 2, 3};
     auto it_b = std::begin(arr); // возвращает int*
     auto it_e = std::end(arr);   // возвращает arr + 3
     ```

     **Источник:** [Cppreference: std::begin](https://en.cppreference.com/w/cpp/iterator/begin)

134. Чем они удобны по сравнению с прямым вызовом методов контейнера?

     **Ответ:** Они позволяют писать обобщенный шаблонный код, одинаково применимый к классам-контейнерам и обычным Си-массивам.

     **Пример:**

     ```cpp
     #include <iterator>
     #include <algorithm>

     template <typename Container>
     void print_first(const Container& c) {
         auto it = std::begin(c);
         // работает и для std::vector, и для int[10]
     }
     ```

     **Источник:** [Cppreference: std::begin](https://en.cppreference.com/w/cpp/iterator/begin)

135. Что такое `std::cbegin()` и `std::cend()`?

     **Ответ:** Это свободные функции, гарантированно возвращающие константные итераторы (`const_iterator`), предотвращая непреднамеренное изменение элементов.

     **Пример:**

     ```cpp
     #include <vector>
     #include <iterator>

     std::vector<int> v = {1, 2};
     auto it = std::cbegin(v);
     // *it = 5; // Ошибка компиляции
     ```

     **Источник:** [Cppreference: std::cbegin](https://en.cppreference.com/w/cpp/iterator/begin)

136. Что такое адаптеры итераторов?

     **Ответ:** Это специальные классы-обёртки над итераторами, меняющие поведение стандартных операций (например, превращающие операцию записи в вызовы методов вставки в контейнер или потоковый вывод).

     **Пример:**

     ```cpp
     #include <vector>
     #include <iterator>

     std::vector<int> v;
     std::back_insert_iterator<std::vector<int>> inserter(v);
     *inserter = 10; // превращается в v.push_back(10)
     ```

     **Источник:** [Cppreference: Iterator library](https://en.cppreference.com/w/cpp/iterator)

137. Что делает `std::back_inserter`?

     **Ответ:** Создает `std::back_insert_iterator`, который при разыменовании и присваивании вызывает у целевого контейнера метод `push_back()`.

     **Пример:**

     ```cpp
     #include <vector>
     #include <iterator>

     std::vector<int> v;
     auto bi = std::back_inserter(v);
     *bi = 42; // v содержит {42}
     ```

     **Источник:** [Cppreference: std::back_inserter](https://en.cppreference.com/w/cpp/iterator/back_inserter)

138. Почему `std::copy` с `back_inserter` удобен для `vector`?

     **Ответ:** Он избавляет от необходимости предварительно вручную выделять память под точный размер приемника через `resize()`, динамически расширяя вектор по мере копирования.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>
     #include <iterator>

     std::vector<int> src = {1, 2, 3};
     std::vector<int> dst; // пустой
     std::copy(src.begin(), src.end(), std::back_inserter(dst));
     ```

     **Источник:** [Cppreference: std::back_inserter](https://en.cppreference.com/w/cpp/iterator/back_inserter)

139. Что делает `std::inserter`?

     **Ответ:** Создает `std::insert_iterator`, который при присваивании вызывает метод `insert()` контейнера по указанной позиции и обновляет внутренний итератор для сохранения порядка последующих вставок.

     **Пример:**

     ```cpp
     #include <set>
     #include <vector>
     #include <iterator>
     #include <algorithm>

     std::vector<int> v = {1, 2, 3};
     std::set<int> s;
     std::copy(v.begin(), v.end(), std::inserter(s, s.begin()));
     ```

     **Источник:** [Cppreference: std::inserter](https://en.cppreference.com/w/cpp/iterator/inserter)

140. Что делает `std::front_inserter`?

     **Ответ:** Создает итератор вставки `std::front_insert_iterator`, который вызывает метод `push_front()` контейнера для каждого записываемого элемента.

     **Пример:**

     ```cpp
     #include <deque>
     #include <iterator>

     std::deque<int> d;
     auto fi = std::front_inserter(d);
     *fi = 1;
     *fi = 2; // d содержит {2, 1}
     ```

     **Источник:** [Cppreference: std::front_inserter](https://en.cppreference.com/w/cpp/iterator/front_inserter)

141. Для каких контейнеров `front_inserter` имеет смысл?

     **Ответ:** Только для тех контейнеров, которые поддерживают метод `push_front()` за $O(1)$: `std::deque`, `std::list` и `std::forward_list` (для `vector` он недоступен).

     **Пример:**

     ```cpp
     #include <list>
     #include <iterator>

     std::list<int> l;
     auto fi = std::front_inserter(l); // корректно
     ```

     **Источник:** [Cppreference: std::front_inserter](https://en.cppreference.com/w/cpp/iterator/front_inserter)

142. Что такое stream iterators?

     **Ответ:** Это адаптеры (`std::istream_iterator`, `std::ostream_iterator`), представляющие потоки ввода/вывода (`std::cin`, `std::cout`, файлы) в виде последовательностей STL.

     **Пример:**

     ```cpp
     #include <iostream>
     #include <iterator>

     std::ostream_iterator<int> out(std::cout, ", ");
     *out = 1;
     *out = 2;
     ```

     **Источник:** [Cppreference: std::ostream_iterator](https://en.cppreference.com/w/cpp/iterator/ostream_iterator)

143. Как связаны потоки ввода-вывода и итераторы?

     **Ответ:** Итераторы потоков инкапсулируют операторы `>>` и `<<`, позволяя применять стандартные алгоритмы (`copy`, `transform`, `accumulate`) напрямую к потокам данных без промежуточных контейнеров.

     **Пример:**

     ```cpp
     #include <iostream>
     #include <vector>
     #include <algorithm>
     #include <iterator>

     std::vector<int> v = {1, 2, 3};
     std::copy(v.begin(), v.end(), std::ostream_iterator<int>(std::cout, " "));
     ```

     **Источник:** [Cppreference: std::ostream_iterator](https://en.cppreference.com/w/cpp/iterator/ostream_iterator)

144. Что делает `std::istream_iterator`?

     **Ответ:** Читает форматированные объекты типа `T` из потока ввода `std::basic_istream` с помощью оператора `>>` при каждом инкременте.

     **Пример:**

     ```cpp
     #include <iostream>
     #include <sstream>
     #include <iterator>

     std::istringstream input("10 20");
     std::istream_iterator<int> it(input), end;
     int a = *it++; // 10
     int b = *it;   // 20
     ```

     **Источник:** [Cppreference: std::istream_iterator](https://en.cppreference.com/w/cpp/iterator/istream_iterator)

145. Что делает `std::ostream_iterator`?

     **Ответ:** Записывает элементы типа `T` в поток `std::basic_ostream` с использованием оператора `<<`, опционально добавляя указанный разделитель после каждого элемента.

     **Пример:**

     ```cpp
     #include <iostream>
     #include <iterator>

     std::ostream_iterator<std::string> out(std::cout, "\n");
     *out = "Line 1";
     ```

     **Источник:** [Cppreference: std::ostream_iterator](https://en.cppreference.com/w/cpp/iterator/ostream_iterator)

146. Что такое unary predicate?

     **Ответ:** Это вызываемый объект (лямбда, функция, функтор), принимающий ровно один аргумент и возвращающий значение, приводимое к типу `bool`.

     **Пример:**

     ```cpp
     auto is_even = [](int x) { return x % 2 == 0; };
     ```

     **Источник:** [Cppreference: Predicate](https://en.cppreference.com/w/cpp/concepts/predicate)

147. Что такое binary predicate?

     **Ответ:** Это вызываемый объект, принимающий два аргумента и возвращающий `bool`, часто используемый для проверки отношений эквивалентности или порядка.

     **Пример:**

     ```cpp
     auto is_greater = [](int a, int b) { return a > b; };
     ```

     **Источник:** [Cppreference: BinaryPredicate](https://en.cppreference.com/w/cpp/named_req/BinaryPredicate)

148. Почему алгоритмы часто принимают предикаты?

     **Ответ:** Это позволяет параметризовать логику принятия решений (условие фильтрации, поиска или сортировки) без изменения самого алгоритма.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, -2, 3};
     auto it = std::find_if(v.begin(), v.end(), [](int x) { return x < 0; });
     ```

     **Источник:** [Cppreference: std::find_if](https://en.cppreference.com/w/cpp/algorithm/find)

149. Что такое компаратор в STL?

     **Ответ:** Компаратор — это бинарный предикат, определяющий отношение строгого слабого порядка (Strict Weak Ordering) между двумя значениями (по умолчанию `std::less`).

     **Пример:**

     ```cpp
     struct CustomLess {
         bool operator()(int a, int b) const { return a > b; } // обратный порядок
     };
     ```

     **Источник:** [Cppreference: Compare](https://en.cppreference.com/w/cpp/named_req/Compare)

150. Где используют пользовательский компаратор?

     **Ответ:** В алгоритмах сортировки (`std::sort`), алгоритмах бинарного поиска (`std::lower_bound`), а также в параметрах шаблонов ассоциативных контейнеров (`std::map`, `std::set`, `std::priority_queue`).

     **Пример:**

     ```cpp
     #include <set>
     #include <functional>

     std::set<int, std::greater<int>> descending_set = {1, 5, 2};
     ```

     **Источник:** [Cppreference: std::set](https://en.cppreference.com/w/cpp/container/set)

151. Почему корректность компаратора критична для `sort`, `set`, `map`?

     **Ответ:** Некорректный компаратор нарушает аксиомы порядка, что в алгоритмах сортировки приводит к бесконечным циклам, выходу за границы массивов и UB, а в контейнерах — к разбалансировке деревьев и потере данных.

     **Пример:**

     ```cpp
     // ОШИБКА: operator<= нарушает иррефлексивность (comp(x, x) должно быть false)!
     auto bad_comp = [](int a, int b) { return a <= b; };
     ```

     **Источник:** [Cppreference: Compare](https://en.cppreference.com/w/cpp/named_req/Compare)

152. Что такое strict weak ordering?

     **Ответ:** Это математическое отношение порядка, требующее выполнения 4 свойств: иррефлексивность ($comp(x, x) = false$), асимметричность, транзитивность и транзитивность несравнимости (эквивалентности).

     **Пример:**

     ```cpp
     // Корректный компаратор strictly weak:
     auto good_comp = [](int a, int b) { return a < b; };
     ```

     **Источник:** [Cppreference: StrictWeakOrdering](https://en.cppreference.com/w/cpp/concepts/strict_weak_order)

153. Почему некорректный компаратор может ломать контейнеры и алгоритмы?

     **Ответ:** Контейнеры на деревьях проверяют эквивалентность как `!comp(a, b) && !comp(b, a)`. Если компаратор вернет `true` для равных элементов (например при `<=`): дерево посчитает, что `a < b` и `b < a` одновременно, разрушив структуру дерева.

     **Пример:**

     ```cpp
     #include <set>

     struct BrokenLess {
         bool operator()(int, int) const { return true; } // Нарушает иррефлексивность!
     };
     // std::set<int, BrokenLess> s; // Приведет к UB при вставке
     ```

     **Источник:** [Cppreference: Compare](https://en.cppreference.com/w/cpp/named_req/Compare)

154. Что делает `std::find_if`?

     **Ответ:** Линейно ищет в диапазоне первый элемент, для которого переданный унарный предикат возвращает `true`.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 3, 4, 5};
     auto it = std::find_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }); // указывает на 4
     ```

     **Источник:** [Cppreference: std::find_if](https://en.cppreference.com/w/cpp/algorithm/find)

155. Что делает `std::count_if`?

     **Ответ:** Подсчитывает количество элементов в диапазоне, удовлетворяющих заданному унарному предикату.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, -2, 3, -4};
     auto negs = std::count_if(v.begin(), v.end(), [](int x) { return x < 0; }); // 2
     ```

     **Источник:** [Cppreference: std::count_if](https://en.cppreference.com/w/cpp/algorithm/count)

156. Что делает `std::all_of`?

     **Ответ:** Проверяет, возвращает ли унарный предикат `true` для **всех** элементов диапазона (для пустого диапазона возвращает `true`).

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {2, 4, 6};
     bool ok = std::all_of(v.begin(), v.end(), [](int x) { return x % 2 == 0; }); // true
     ```

     **Источник:** [Cppreference: std::all_of](https://en.cppreference.com/w/cpp/algorithm/all_any_none_of)

157. Что делает `std::any_of`?

     **Ответ:** Проверяет, возвращает ли унарный предикат `true` хотя бы для **одного** элемента диапазона.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 3, 6};
     bool has_even = std::any_of(v.begin(), v.end(), [](int x) { return x % 2 == 0; }); // true
     ```

     **Источник:** [Cppreference: std::any_of](https://en.cppreference.com/w/cpp/algorithm/all_any_none_of)

158. Что делает `std::none_of`?

     **Ответ:** Проверяет, что унарный предикат **не выполняется ни для одного** элемента заданного диапазона.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 3, 5};
     bool no_even = std::none_of(v.begin(), v.end(), [](int x) { return x % 2 == 0; }); // true
     ```

     **Источник:** [Cppreference: std::none_of](https://en.cppreference.com/w/cpp/algorithm/all_any_none_of)

159. Что делает `std::transform`?

     **Ответ:** Применяет заданную операцию к каждому элементу входного диапазона (или паре элементов двух диапазонов) и записывает результаты в целевой диапазон.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> src = {1, 2, 3};
     std::vector<int> dst(3);
     std::transform(src.begin(), src.end(), dst.begin(), [](int x) { return x * 10; });
     ```

     **Источник:** [Cppreference: std::transform](https://en.cppreference.com/w/cpp/algorithm/transform)

160. Чем `transform` отличается от `for_each`?

     **Ответ:** `std::transform` предназначен для генерации выходных значений и записи их по выходному итератору (функциональный `map`), тогда как `std::for_each` предназначен для выполнения действий с побочными эффектами над исходными элементами.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 2};
     std::for_each(v.begin(), v.end(), [](int& x) { ++x; }); // модификация на месте
     ```

     **Источник:** [Cppreference: std::transform](https://en.cppreference.com/w/cpp/algorithm/transform)

161. Что делает `std::remove`?

     **Ответ:** Перемещает все элементы, не равные удаляемому значению, в начало диапазона, сохраняя их относительный порядок, и возвращает итератор на новый логический конец; физический размер контейнера не меняется.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 2, 3, 2, 4};
     auto new_end = std::remove(v.begin(), v.end(), 2);
     // v содержит {1, 3, 4, ?, ?}, new_end указывает на 4-й элемент
     ```

     **Источник:** [Cppreference: std::remove](https://en.cppreference.com/w/cpp/algorithm/remove)

162. Почему `std::remove` сам по себе не уменьшает размер контейнера?

     **Ответ:** Алгоритмы STL работают исключительно через итераторы и ничего не знают о самом контейнере и механизме его аллокации, поэтому они не имеют технической возможности вызвать деструкторы и перераспределить память.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 2, 2, 3};
     std::remove(v.begin(), v.end(), 2);
     // v.size() все еще равен 4!
     ```

     **Источник:** [Cppreference: std::remove](https://en.cppreference.com/w/cpp/algorithm/remove)

163. Что такое idiom erase-remove?

     **Ответ:** Это классическая идиома STL для реального удаления элементов: сначала `std::remove` сдвигает нужные элементы в начало, а затем метод `container.erase()` физически удаляет "хвост" ненужных элементов.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 99, 2, 99, 3};
     v.erase(std::remove(v.begin(), v.end(), 99), v.end()); // размер уменьшился до 3
     ```

     **Источник:** [Cppreference: std::remove](https://en.cppreference.com/w/cpp/algorithm/remove)

164. Почему erase-remove часто используют с `vector` и `string`?

     **Ответ:** Потому что удаление элементов по одному из середины вектора требует $O(N)$ сдвигов на каждый элемент ($O(N^2)$ суммарно), а erase-remove выполняет линейный проход за один шаг ($O(N)$).

     **Пример:**

     ```cpp
     #include <string>
     #include <algorithm>

     std::string s = "a b c d";
     s.erase(std::remove(s.begin(), s.end(), ' '), s.end()); // "abcd" за O(N)
     ```

     **Источник:** [Cppreference: std::remove](https://en.cppreference.com/w/cpp/algorithm/remove)

165. Что делает `std::unique`?

     **Ответ:** Устраняет соседние дубликаты в диапазоне, сдвигая уникальные элементы в начало, и возвращает итератор на новый логический конец (для полного удаления дубликатов коллекция должна быть предварительно отсортирована).

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 1, 2, 2, 3};
     auto it = std::unique(v.begin(), v.end()); // {1, 2, 3, ?, ?}
     ```

     **Источник:** [Cppreference: std::unique](https://en.cppreference.com/w/cpp/algorithm/unique)

166. Удаляет ли `std::unique` физически элементы из контейнера?

     **Ответ:** Нет, как и `std::remove`, он только перезаписывает значения и возвращает итератор на границу диапазона без изменения `size()`.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 1, 2};
     std::unique(v.begin(), v.end());
     // v.size() равен 3
     ```

     **Источник:** [Cppreference: std::unique](https://en.cppreference.com/w/cpp/algorithm/unique)

167. Когда после `unique` тоже нужен `erase()`?

     **Ответ:** Всегда, когда необходимо физически удалить лишние элементы с конца контейнера и уменьшить его размер (`size()`).

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 1, 2, 3, 3};
     v.erase(std::unique(v.begin(), v.end()), v.end());
     ```

     **Источник:** [Cppreference: std::unique](https://en.cppreference.com/w/cpp/algorithm/unique)

168. Что делает `std::accumulate`?

     **Ответ:** Вычисляет свертку (аккумуляцию) диапазона элементов, начиная с начального значения, последовательно применяя операцию сложения (по умолчанию) или заданный бинарный функтор.

     **Пример:**

     ```cpp
     #include <numeric>
     #include <vector>

     std::vector<int> v = {1, 2, 3, 4};
     int sum = std::accumulate(v.begin(), v.end(), 0); // 10
     ```

     **Источник:** [Cppreference: std::accumulate](https://en.cppreference.com/w/cpp/algorithm/accumulate)

169. В каком заголовке находится `accumulate`?

     **Ответ:** Алгоритм `std::accumulate` находится в заголовочном файле `<numeric>`, а не в `<algorithm>`.

     **Пример:**

     ```cpp
     #include <numeric>

     int arr[] = {1, 2};
     int sum = std::accumulate(arr, arr + 2, 0);
     ```

     **Источник:** [Cppreference: Header `<numeric>`](https://en.cppreference.com/w/cpp/header/numeric)

170. Почему `accumulate` часто связывают с функциональным стилем?

     **Ответ:** Потому что он представляет классическую функцию высшего порядка `foldl` (левая свёртка / reduce), позволяя выражать подсчеты, агрегации и конкатенации декларативно без явных циклов.

     **Пример:**

     ```cpp
     #include <numeric>
     #include <vector>
     #include <string>

     std::vector<std::string> words = {"Hello", " ", "World"};
     std::string sentence = std::accumulate(words.begin(), words.end(), std::string{});
     ```

     **Источник:** [Cppreference: std::accumulate](https://en.cppreference.com/w/cpp/algorithm/accumulate)

---

## Выше среднего уровня

171. Какие операции у `vector` обычно имеют амортизированную сложность O(1) в конце?

     **Ответ:** Добавление элемента (`push_back`, `emplace_back`) имеет амортизированную сложность $O(1)$ (а `pop_back` имеет строгую сложность $O(1)$).

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v;
     v.push_back(10); // амортизированное O(1)
     ```

     **Источник:** [Cppreference: std::vector::push_back](https://en.cppreference.com/w/cpp/container/vector/push_back)

172. Что такое амортизированная сложность в контексте `push_back`?

     **Ответ:** Большинство вставок выполняются за истинное $O(1)$, а редкие дорогостоящие операции реаллокации ($O(N)$ с копированием/перемещением) происходят экспоненциально реже благодаря геометрическому росту буфера (фактор 1.5 или 2), распределяя общие затраты равномерно.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v;
     for (int i = 0; i < 1000; ++i) {
         v.push_back(i); // общая сумма операций на N элементов пропорциональна O(N)
     }
     ```

     **Источник:** [Cppreference: std::vector::push_back](https://en.cppreference.com/w/cpp/container/vector/push_back)

173. Почему поиск по ключу в `map` обычно O(log n)?

     **Ответ:** `std::map` реализован в виде сбалансированного двоичного дерева поиска (обычно Red-Black Tree), высота которого жестко ограничена значением $c \log_2 n$, что гарантирует не более $O(\log n)$ сравнений ключей.

     **Пример:**

     ```cpp
     #include <map>

     std::map<int, int> m;
     auto it = m.find(42); // логарифмическое время поиска
     ```

     **Источник:** [Cppreference: std::map::find](https://en.cppreference.com/w/cpp/container/map/find)

174. Почему поиск по ключу в `unordered_map` обычно считается O(1) в среднем?

     **Ответ:** Хеш-функция вычисляет индекс корзины напрямую за $O(1)$, и при хорошем равномерном распределении хешей и низком коэффициенте заполнения в корзине находится всего 1–2 элемента.

     **Пример:**

     ```cpp
     #include <unordered_map>

     std::unordered_map<int, int> um;
     auto it = um.find(42); // среднее O(1)
     ```

     **Источник:** [Cppreference: std::unordered_map::find](https://en.cppreference.com/w/cpp/container/unordered_map/find)

175. Почему у `unordered_map` в худшем случае поиск может деградировать?

     **Ответ:** В случае коллизий (когда разные ключи дают одинаковый хеш-код или попадают в одну корзину) элементы выстраиваются в один связный список, превращая поиск в линейный $O(N)$.

     **Пример:**

     ```cpp
     // Если хеш-функция возвращает константу для всех ключей:
     struct BadHash {
         std::size_t operator()(int) const { return 0; }
     };
     // поиск по такому unordered_map займет O(N)
     ```

     **Источник:** [Cppreference: std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map)

176. Что такое bucket в `unordered_map`?

     **Ответ:** Bucket (корзина) — это внутренний слот или связный список в хеш-таблице, в который помещаются все элементы, хеши ключей которых дают одинаковый остаток от деления на количество корзин.

     **Пример:**

     ```cpp
     #include <unordered_map>

     std::unordered_map<int, int> um = {{1, 10}, {2, 20}};
     std::size_t b_idx = um.bucket(1); // индекс корзины для ключа 1
     ```

     **Источник:** [Cppreference: std::unordered_map::bucket](https://en.cppreference.com/w/cpp/container/unordered_map/bucket)

177. Что такое load factor?

     **Ответ:** Load factor (коэффициент загрузки) — это среднее число элементов на одну корзину: `load_factor() = size() / bucket_count()`.

     **Пример:**

     ```cpp
     #include <unordered_map>

     std::unordered_map<int, int> um = {{1, 10}};
     float lf = um.load_factor();
     ```

     **Источник:** [Cppreference: std::unordered_map::load_factor](https://en.cppreference.com/w/cpp/container/unordered_map/load_factor)

178. Что делает `rehash()`?

     **Ответ:** `rehash(n)` устанавливает количество корзин минимум в `n`, пересчитывает позиции всех существующих элементов и перераспределяет их по новым корзинам.

     **Пример:**

     ```cpp
     #include <unordered_map>

     std::unordered_map<int, int> um;
     um.rehash(128); // выделяет не менее 128 корзин
     ```

     **Источник:** [Cppreference: std::unordered_map::rehash](https://en.cppreference.com/w/cpp/container/unordered_map/rehash)

179. Что делает `max_load_factor()`?

     **Ответ:** Возвращает или устанавливает пороговое значение коэффициента загрузки, при превышении которого контейнер автоматически инициирует `rehash` и увеличивает число корзин (по умолчанию 1.0).

     **Пример:**

     ```cpp
     #include <unordered_map>

     std::unordered_map<int, int> um;
     um.max_load_factor(0.7f); // поддерживать не более 0.7 элементов на корзину
     ```

     **Источник:** [Cppreference: std::unordered_map::max_load_factor](https://en.cppreference.com/w/cpp/container/unordered_map/max_load_factor)

180. Почему плохая хеш-функция ухудшает работу `unordered_map`?

     **Ответ:** Плохая хеш-функция создает неравномерное распределение и кластеризацию: множество ключей попадают в одни и те же корзины, снижая скорость поиска и вставки до $O(N)$ и нивелируя преимущества хеш-таблицы.

     **Пример:**

     ```cpp
     #include <unordered_set>

     // Хеш, возвращающий только четные числа, оставляет половину корзин пустыми
     struct PoorHash {
         std::size_t operator()(int x) const { return (x * 2); }
     };
     ```

     **Источник:** [Cppreference: std::hash](https://en.cppreference.com/w/cpp/utility/hash)

181. Когда `map` может быть предпочтительнее `unordered_map`, несмотря на O(log n)?

     **Ответ:** Когда требуется поддержание элементов в отсортированном порядке, поиск диапазонов (`lower_bound`/`upper_bound`), предсказуемое худшее время отклика без просадок на рехеширование или когда для ключа сложно написать надежную хеш-функцию.

     **Пример:**

     ```cpp
     #include <map>

     std::map<int, int> m;
     // Нужен диапазон ключей [10, 50]: unordered_map не справится за логарифм
     auto it_from = m.lower_bound(10);
     ```

     **Источник:** [Cppreference: std::map](https://en.cppreference.com/w/cpp/container/map)

182. Почему упорядоченность элементов иногда важнее средней скорости поиска?

     **Ответ:** Упорядоченность позволяет легко извлекать минимальный/максимальный элемент, обходить элементы по возрастанию/убыванию и выполнять интервальные запросы без полной пересортировки данных.

     **Пример:**

     ```cpp
     #include <map>
     #include <string>

     std::map<std::string, int> dict;
     // вывод в алфавитном порядке гарантирован
     for (const auto& [word, count] : dict) { /* ... */ }
     ```

     **Источник:** [Cppreference: std::map](https://en.cppreference.com/w/cpp/container/map)

183. Что такое node-based контейнер?

     **Ответ:** Это контейнер, который размещает каждый свой элемент в отдельном динамически выделенном узле (ноде), связывая их через указатели (`std::list`, `std::forward_list`, `std::set`, `std::map`).

     **Пример:**

     ```cpp
     #include <list>

     std::list<int> l; // каждый вызов push_back аллоцирует отдельный узел
     ```

     **Источник:** [Cppreference: Containers library](https://en.cppreference.com/w/cpp/container)

184. Какие контейнеры STL обычно относятся к node-based?

     **Ответ:** `std::list`, `std::forward_list`, `std::set`, `std::multiset`, `std::map`, `std::multimap`, а также стандартные реализации `std::unordered_*` (на базе корзин со связными списками узлов).

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> tree_nodes;
     ```

     **Источник:** [Cppreference: Containers library](https://en.cppreference.com/w/cpp/container)

185. Чем node-based контейнеры отличаются от contiguous контейнеров?

     **Ответ:** Node-based контейнеры распределяют память фрагментированно в куче отдельными узлами со стабильными адресами, а contiguous контейнеры (`vector`, `array`) хранят элементы монолитно единым блоком с прямой адресацией.

     **Пример:**

     ```cpp
     #include <vector>
     #include <list>

     std::vector<int> c; // contiguous: &c[1] == &c[0] + 1
     std::list<int> n;   // node-based: память разрознена
     ```

     **Источник:** [Cppreference: Containers library](https://en.cppreference.com/w/cpp/container)

186. Почему node-based контейнеры хуже используют кэш процессора?

     **Ответ:** Размещение узлов в произвольных адресах памяти приводит к промахам кэша (cache misses) при переходе по каждому указателю (`pointer chasing`), не давая аппаратному префетчеру предсказать шаблон чтения.

     **Пример:**

     ```cpp
     #include <list>

     std::list<int> l(100000);
     for (int x : l) { /* частые промахи L1/L2 кэша */ }
     ```

     **Источник:** [Cppreference: std::list](https://en.cppreference.com/w/cpp/container/list)

187. Почему `vector` часто быстрее на практике, даже когда теоретически некоторые операции у `list` дешевле?

     **Ответ:** Эффект кэш-локальности и конвейеризации процессора в `vector` многократно перевешивает теоретическую асимптотику вставки: сдвинуть непрерывный кусок памяти через SIMD/`memmove` оказывается быстрее поиска указателей и аллокации узлов в `list`.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 2, 4};
     v.insert(v.begin() + 2, 3); // на практике до тысяч элементов быстрее, чем list::insert
     ```

     **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

188. Что такое `emplace`-семейство методов?

     **Ответ:** Это методы (`emplace`, `emplace_back`, `emplace_front`, `try_emplace`), использующие вариативные шаблоны и `std::forward` для идеальной передачи аргументов непосредственно в конструктор элемента по месту его размещения.

     **Пример:**

     ```cpp
     #include <vector>
     #include <utility>

     struct Item {
         Item(int, double) {}
     };
     std::vector<Item> v;
     v.emplace_back(1, 2.0); // конструирует Item на месте без вызова copy/move
     ```

     **Источник:** [Cppreference: std::vector::emplace_back](https://en.cppreference.com/w/cpp/container/vector/emplace_back)

189. Чем `emplace` отличается от `insert`?

     **Ответ:** `insert` принимает уже готовый экземпляр объекта (или `initializer_list`), требуя вызова конструктора перемещения или копирования, а `emplace` принимает аргументы конструктора и строит объект прямо в памяти контейнера.

     **Пример:**

     ```cpp
     #include <set>
     #include <string>

     std::set<std::pair<int, std::string>> s;
     s.insert(std::make_pair(1, "test")); // временная пара
     s.emplace(1, "test");                 // без временных объектов
     ```

     **Источник:** [Cppreference: std::set::emplace](https://en.cppreference.com/w/cpp/container/set/emplace)

190. Чем `emplace_back` отличается от `push_back` для сложных типов?

     **Ответ:** Для типов без дешевого перемещения `emplace_back` позволяет полностью избежать создания и последующего уничтожения временного объекта, экономя время на аллокациях и копировании.

     **Пример:**

     ```cpp
     #include <vector>
     #include <string>

     struct Record {
         std::string name;
         std::vector<int> data;
         Record(std::string n, std::vector<int> d) : name(n), data(d) {}
     };

     std::vector<Record> vr;
     vr.emplace_back("Alice", std::vector<int>{1, 2, 3});
     ```

     **Источник:** [Cppreference: std::vector::emplace_back](https://en.cppreference.com/w/cpp/container/vector/emplace_back)

191. Когда `emplace_back` реально даёт выигрыш, а когда почти нет?

     **Ответ:** Реальный выигрыш достигается при передаче нескольких аргументов конструктора "тяжелого" типа. Если объект уже существует или тип является тривиальным (например, `int`), разницы в скорости по сравнению с `push_back` нет.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v;
     v.push_back(10);    // разницы нет
     v.emplace_back(10); // ассемблерный код абсолютно идентичен
     ```

     **Источник:** [Cppreference: std::vector::emplace_back](https://en.cppreference.com/w/cpp/container/vector/emplace_back)

192. Что делает `try_emplace` в `map` и `unordered_map`?

     **Ответ:** `try_emplace` (C++17) вставляет элемент только если ключа еще нет в контейнере, при этом гарантируя, что если ключ уже существует, аргументы конструктора значения не будут перемещены или использованы для конструирования.

     **Пример:**

     ```cpp
     #include <map>
     #include <string>
     #include <memory>

     std::map<std::string, std::unique_ptr<int>> m;
     auto ptr = std::make_unique<int>(10);
     m.try_emplace("key", std::move(ptr)); 
     // если "key" уже существовал, ptr останется целым и не обнулится!
     ```

     **Источник:** [Cppreference: std::map::try_emplace](https://en.cppreference.com/w/cpp/container/map/try_emplace)

193. Чем `insert_or_assign` отличается от `operator[]` у `map`?

     **Ответ:** `insert_or_assign` возвращает расширенную информацию (итератор и флаг `bool`, указывающий произошла ли вставка или перезапись), а также не требует, чтобы тип значения имел конструктор по умолчанию.

     **Пример:**

     ```cpp
     #include <map>

     std::map<int, int> m;
     auto [it, inserted] = m.insert_or_assign(1, 100);
     // inserted == true (вставлен)
     ```

     **Источник:** [Cppreference: std::map::insert_or_assign](https://en.cppreference.com/w/cpp/container/map/insert_or_assign)

194. Почему `operator[]` у `map` может не только читать, но и вставлять элемент?

     **Ответ:** По спецификации, если запрошенный ключ отсутствует в контейнере, `operator[]` автоматически конструирует по умолчанию новый элемент с этим ключом (`mapped_type{}`) и возвращает ссылку на него.

     **Пример:**

     ```cpp
     #include <map>
     #include <string>

     std::map<std::string, int> m;
     int val = m["new_key"]; // ключ автоматически создается со значением 0!
     ```

     **Источник:** [Cppreference: std::map::operator[]](https://en.cppreference.com/w/cpp/container/map/operator_at)

195. Почему это иногда приводит к неожиданным ошибкам?

     **Ответ:** Попытка просто "проверить" наличие ключа через `operator[]` непреднамеренно раздувает ассоциативный массив фантомными записями с дефолтными значениями и не работает для константных контейнеров.

     **Пример:**

     ```cpp
     #include <map>

     void check(const std::map<int, int>& m) {
         // int x = m[1]; // Ошибка компиляции: operator[] не const!
     }
     ```

     **Источник:** [Cppreference: std::map::operator[]](https://en.cppreference.com/w/cpp/container/map/operator_at)

196. Когда для чтения из `map` удобнее `find()` или `contains()` вместо `operator[]`?

     **Ответ:** Всегда, когда нужно безопасно проверить присутствие ключа без изменения контейнера, а также при работе с константными ссылками на `std::map`.

     **Пример:**

     ```cpp
     #include <map>

     std::map<int, int> m;
     if (m.contains(42)) { // C++20: безопасно, не изменяет map
         // ...
     }
     ```

     **Источник:** [Cppreference: std::map::contains](https://en.cppreference.com/w/cpp/container/map/contains)

197. Что делает `contains()` в ассоциативных контейнерах?

     **Ответ:** Метод `contains()` (начиная с C++20) возвращает `true`, если элемент с заданным ключом присутствует в контейнере, заменяя громоздкую конструкцию `find(k) != end()`.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s = {1, 2, 3};
     bool found = s.contains(2); // true
     ```

     **Источник:** [Cppreference: std::set::contains](https://en.cppreference.com/w/cpp/container/set/contains)

198. Чем `find()` отличается от `contains()`?

     **Ответ:** `contains()` возвращает только булев флаг наличия (`bool`), а `find()` возвращает итератор на найденный элемент, позволяя прочитать или модифицировать ассоциированное значение.

     **Пример:**

     ```cpp
     #include <map>

     std::map<int, int> m = {{1, 100}};
     if (auto it = m.find(1); it != m.end()) {
         it->second = 200; // доступ к значению
     }
     ```

     **Источник:** [Cppreference: std::map::find](https://en.cppreference.com/w/cpp/container/map/find)

199. Что возвращает `find()`, если элемент не найден?

     **Ответ:** Метод `find()` возвращает итератор на конец контейнера — `end()`.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s = {1, 2};
     auto it = s.find(99);
     bool not_found = (it == s.end()); // true
     ```

     **Источник:** [Cppreference: std::set::find](https://en.cppreference.com/w/cpp/container/set/find)

200. Почему сравнение с `end()` — стандартный способ проверки поиска?

     **Ответ:** Поскольку `end()` указывает на фиктивный элемент за пределами валидных данных, он служит уникальным признаком неудачи поиска для всех стандартных контейнеров и алгоритмов.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1};
     if (std::find(v.begin(), v.end(), 5) == v.end()) {
         // элемент отсутствует
     }
     ```

     **Источник:** [Cppreference: std::find](https://en.cppreference.com/w/cpp/algorithm/find)

201. Что такое диапазон равных ключей в `multimap` или `multiset`?

     **Ответ:** Это непрерывный поддиапазон итераторов $[first, last)$, содержащий все элементы с одинаковым заданным ключом.

     **Пример:**

     ```cpp
     #include <set>

     std::multiset<int> ms = {1, 2, 2, 2, 3};
     // элементы со значением 2 формируют диапазон из 3 элементов
     ```

     **Источник:** [Cppreference: std::multiset::equal_range](https://en.cppreference.com/w/cpp/container/multiset/equal_range)

202. Что делает `equal_range()`?

     **Ответ:** Метод `equal_range(k)` возвращает пару итераторов `std::pair<iterator, iterator>`, соответствующую результатам одновременного вызова `lower_bound(k)` и `upper_bound(k)`.

     **Пример:**

     ```cpp
     #include <map>

     std::multimap<int, char> mm = {{1, 'a'}, {1, 'b'}};
     auto [first, last] = mm.equal_range(1);
     ```

     **Источник:** [Cppreference: std::multimap::equal_range](https://en.cppreference.com/w/cpp/container/multimap/equal_range)

203. Что делают `lower_bound()` и `upper_bound()`?

     **Ответ:** `lower_bound(k)` возвращает итератор на первый элемент, который **не меньше** `k` (т.е. $\ge k$); `upper_bound(k)` возвращает итератор на первый элемент, который **строго больше** `k` (т.е. $> k$).

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s = {10, 20, 30};
     auto lb = s.lower_bound(20); // указывает на 20
     auto ub = s.upper_bound(20); // указывает на 30
     ```

     **Источник:** [Cppreference: std::set::lower_bound](https://en.cppreference.com/w/cpp/container/set/lower_bound)

204. В каких контейнерах эти операции особенно естественны?

     **Ответ:** В отсортированных ассоциативных контейнерах: `std::set`, `std::multiset`, `std::map`, `std::multimap`, где они реализованы как методы с логарифмической сложностью.

     **Пример:**

     ```cpp
     #include <map>

     std::map<int, int> m;
     auto it = m.lower_bound(100); // O(log N)
     ```

     **Источник:** [Cppreference: std::map::lower_bound](https://en.cppreference.com/w/cpp/container/map/lower_bound)

205. Почему `lower_bound` на отсортированных данных полезен не только в `map`, но и для `vector`?

     **Ответ:** В отсортированном `std::vector` свободная функция `std::lower_bound` выполняет бинарный поиск за $O(\log N)$ с непревзойденной скоростью благодаря компактности массива в кэше ЦП.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {10, 20, 30, 40};
     auto it = std::lower_bound(v.begin(), v.end(), 25); // указывает на 30
     ```

     **Источник:** [Cppreference: std::lower_bound](https://en.cppreference.com/w/cpp/algorithm/lower_bound)

206. Что делает алгоритм `std::binary_search`?

     **Ответ:** Возвращает `bool` (`true`/`false`), указывающий, содержится ли заданное значение в предварительно отсортированном диапазоне.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 2, 5, 8, 9};
     bool exists = std::binary_search(v.begin(), v.end(), 5); // true
     ```

     **Источник:** [Cppreference: std::binary_search](https://en.cppreference.com/w/cpp/algorithm/binary_search)

207. Какое условие нужно для корректной работы `binary_search`?

     **Ответ:** Входной диапазон элементов должен быть предварительно частично или полностью упорядочен (отсортирован) относительно того же компаратора, с которым вызывается поиск.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {5, 1, 3};
     std::sort(v.begin(), v.end()); // сортировка обязательна перед binary_search
     bool ok = std::binary_search(v.begin(), v.end(), 3);
     ```

     **Источник:** [Cppreference: std::binary_search](https://en.cppreference.com/w/cpp/algorithm/binary_search)

208. Что делает `std::lower_bound` из `<algorithm>`?

     **Ответ:** Выполняет двоичный поиск в отсортированном диапазоне и возвращает итератор на первый элемент, значение которого не меньше переданного ключа.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 3, 5, 7};
     auto it = std::lower_bound(v.begin(), v.end(), 4); // указывает на 5
     ```

     **Источник:** [Cppreference: std::lower_bound](https://en.cppreference.com/w/cpp/algorithm/lower_bound)

209. Почему бинарный поиск по отсортированному `vector` иногда очень эффективен?

     **Ответ:** Данные лежат непрерывно в памяти, что снижает оверхед по указателям до нуля и оптимизирует работу кэш-линий, исключая аллокации узлов дерева.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> sorted_vec = {1, 4, 10, 50, 100};
     auto it = std::lower_bound(sorted_vec.begin(), sorted_vec.end(), 10);
     ```

     **Источник:** [Cppreference: std::lower_bound](https://en.cppreference.com/w/cpp/algorithm/lower_bound)

210. Когда “отсортированный vector + binary_search” может быть лучше, чем `set`?

     **Ответ:** Когда фаза модификации и фаза поиска разделены: данные один раз загружаются, сортируются и затем интенсивно читаются без частых случайных вставок. Он занимает в разы меньше памяти и ищет быстрее `std::set`.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {9, 1, 4, 7};
     std::sort(v.begin(), v.end());
     // Быстрый поиск в read-only фазе:
     auto it = std::lower_bound(v.begin(), v.end(), 4);
     ```

     **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

---

## Сложный уровень

211. Что такое allocator в STL?

     **Ответ:** Аллокатор — это шаблонный класс, инкапсулирующий стратегию выделения, освобождения памяти и управления жизненным циклом объектов, отделяя алгоритмы контейнера от конкретной модели памяти.

     **Пример:**

     ```cpp
     #include <memory>

     std::allocator<int> alloc;
     int* ptr = alloc.allocate(1);
     alloc.deallocate(ptr, 1);
     ```

     **Источник:** [Cppreference: Allocators](https://en.cppreference.com/w/cpp/named_req/Allocator)

212. Зачем контейнерам STL нужен аллокатор?

     **Ответ:** Чтобы предоставить пользователю контроль над физическим размещением данных: использование пулов памяти, разделяемой памяти (shared memory), стековых буферов (PMR) или специализированных GPU/NUMA-аллокаторов без изменения логики контейнера.

     **Пример:**

     ```cpp
     #include <vector>
     #include <memory_resource>

     std::pmr::monotonic_buffer_resource pool;
     std::pmr::vector<int> v(&pool); // быстрое выделение из пула
     ```

     **Источник:** [Cppreference: std::pmr::polymorphic_allocator](https://en.cppreference.com/w/cpp/memory/polymorphic_allocator)

213. Чем управление памятью контейнера отличается от управления lifetime объектов?

     **Ответ:** Аллокация памяти выделяет "сырые" байты без вызова конструкторов, а управление lifetime отвечает за непосредственное создание объектов по заданному адресу (placement new) и вызов деструкторов без немедленного возврата памяти ОС.

     **Пример:**

     ```cpp
     #include <memory>

     std::allocator<std::string> alloc;
     std::string* p = alloc.allocate(1); // 1. Выделение памяти (raw memory)
     std::construct_at(p, "hello");       // 2. Старт lifetime (вызов конструктора)
     std::destroy_at(p);                 // 3. Конец lifetime (вызов деструктора)
     alloc.deallocate(p, 1);             // 4. Освобождение памяти
     ```

     **Источник:** [Cppreference: std::construct_at](https://en.cppreference.com/w/cpp/memory/construct_at)

214. Что такое `std::allocator_traits`?

     **Ответ:** Это стандартный трейт-интерфейс, предоставляющий унифицированный способ обращения к методам аллокатора и подставляющий значения по умолчанию для опциональных типов и операций.

     **Пример:**

     ```cpp
     #include <memory>

     std::allocator<int> alloc;
     using Traits = std::allocator_traits<decltype(alloc)>;
     int* p = Traits::allocate(alloc, 5);
     Traits::deallocate(alloc, p, 5);
     ```

     **Источник:** [Cppreference: std::allocator_traits](https://en.cppreference.com/w/cpp/memory/allocator_traits)

215. Почему аллокаторы важны для generic-дизайна контейнеров?

     **Ответ:** Они гарантируют ортогональность архитектуры STL: контейнер абстрагирован от системных вызовов ОС вроде `malloc`/`free`, обеспечивая переносимость и кастомизацию инфраструктуры памяти.

     **Пример:**

     ```cpp
     template <typename T, typename Alloc = std::allocator<T>>
     class CustomVector {
         Alloc alloc_;
         // управление через std::allocator_traits<Alloc>
     };
     ```

     **Источник:** [Cppreference: Allocators](https://en.cppreference.com/w/cpp/named_req/Allocator)

216. Что такое exception safety у контейнеров STL?

     **Ответ:** Это набор гарантий корректного поведения контейнера и отсутствия утечек ресурсов при возникновении исключений во время выполнения операций модификации данных.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v;
     // если push_back бросает bad_alloc, вектор возвращается в исходное состояние (строгая гарантия)
     ```

     **Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

217. Какие гарантии исключительной безопасности обычно обсуждают для операций контейнеров?

     **Ответ:** Выделяют 4 уровня: базовая гарантия (нет утечек ресурсов, инварианты контейнера сохранены), строгая гарантия (транзакционность: при ошибке состояние контейнера откатывается к исходному), гарантия отсутствия исключений (`nothrow`/`noexcept`) и отсутствие гарантий (UB).

     **Пример:**

     ```cpp
     // vector::push_back предоставляет строгую гарантию (strong exception safety)
     ```

     **Источник:** [Cppreference: Exception safety](https://en.cppreference.com/w/cpp/language/exceptions)

218. Почему `noexcept` move-конструктор типа важен для `vector`?

     **Ответ:** Чтобы обеспечить строгую гарантию безопасности при реаллокации буфера: если move-конструктор помечен как `noexcept`, `vector` эффективно перемещает элементы; если нет — вынужден глубоко копировать их, опасаясь исключений.

     **Пример:**

     ```cpp
     struct Safe {
         Safe(Safe&&) noexcept {} // вектор будет перемещать объекты
     };
     ```

     **Источник:** [Cppreference: std::move_if_noexcept](https://en.cppreference.com/w/cpp/utility/move_if_noexcept)

219. Как `vector` выбирает между копированием и перемещением при реаллокации?

     **Ответ:** Через утилиту `std::move_if_noexcept`: если тип элемента имеет конструктор перемещения, помеченный `noexcept` (или не имеет конструктора копирования), используется перемещение; иначе происходит безопасное копирование.

     **Пример:**

     ```cpp
     #include <utility>

     struct Type {
         Type(Type&&) noexcept; // вектор выберет std::move
     };
     ```

     **Источник:** [Cppreference: std::move_if_noexcept](https://en.cppreference.com/w/cpp/utility/move_if_noexcept)

220. Почему тип элемента влияет на производительность контейнера?

     **Ответ:** Наличие `noexcept` конструктора перемещения, тривиальная копируемость (возможность использовать `std::memcpy` внутри вектора) и размер структуры напрямую определяют скорость массовых операций.

     **Пример:**

     ```cpp
     #include <type_traits>

     static_assert(std::is_trivially_copyable_v<int>); // вектор int оптимизируется через memmove
     ```

     **Источник:** [Cppreference: std::is_trivially_copyable](https://en.cppreference.com/w/cpp/types/is_trivially_copyable)

221. Что такое value semantics контейнера?

     **Ответ:** Контейнер хранит не ссылки или указатели на внешние сущности, а сами значения (копии или перемещенные объекты), управляя их физическим жизненным циклом от создания до уничтожения.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> a = {1, 2};
     std::vector<int> b = a; // глубокая копия значений
     b[0] = 99;              // a[0] остался 1
     ```

     **Источник:** [Cppreference: Containers library](https://en.cppreference.com/w/cpp/container)

222. Почему контейнеры STL обычно владеют своими элементами?

     **Ответ:** Принцип владения (RAII) гарантирует автоматическое освобождение памяти и вызов деструкторов при выходе контейнера из области видимости, исключая утечки ресурсов.

     **Пример:**

     ```cpp
     #include <vector>
     #include <string>

     void foo() {
         std::vector<std::string> v = {"res1", "res2"};
     } // вектор выходит из области видимости и уничтожает строки вместе с их буферами
     ```

     **Источник:** [Cppreference: RAII](https://en.cppreference.com/w/cpp/language/raii)

223. Что означает, что итератор — это абстракция обхода, а не владелец данных?

     **Ответ:** Итератор не отвечает за выделение памяти и не продлевает время жизни коллекции, а лишь временно ссылается на элементы в процессе навигации.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int>::iterator it;
     {
         std::vector<int> temp = {1, 2};
         it = temp.begin();
     }
     // it стал висячим: владение закончилось вместе со смертью temp
     ```

     **Источник:** [Cppreference: Iterator library](https://en.cppreference.com/w/cpp/iterator)

224. Почему ссылки и указатели на элементы контейнера имеют ограниченный lifetime?

     **Ответ:** Их время жизни жестко ограничено операциями модификации контейнера (реаллокации, удаления, очистка) и общим временем жизни самого контейнера-владельца.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v = {1};
     int& ref = v[0];
     v.clear();
     // ref инвалидирована, доступ к ней — UB
     ```

     **Источник:** [Cppreference: Reference initialization](https://en.cppreference.com/w/cpp/language/reference_initialization)

225. Что такое `std::span`?

     **Ответ:** `std::span` (C++20) — это невладеющее легковесное представление (view) непрерывной последовательности объектов в памяти, состоящее из указателя и размера.

     **Пример:**

     ```cpp
     #include <span>
     #include <vector>

     void print(std::span<const int> s);

     std::vector<int> v = {1, 2, 3};
     print(v); // передается без копирования вектора
     ```

     **Источник:** [Cppreference: std::span](https://en.cppreference.com/w/cpp/container/span)

226. Чем `span` отличается от контейнера?

     **Ответ:** `span` не владеет данными, не выделяет память в куче, имеет дешевое копирование ($O(1)$) и не управляет уничтожением элементов, на которые ссылается.

     **Пример:**

     ```cpp
     #include <span>

     int arr[] = {1, 2, 3};
     std::span<int> sp(arr); // размер объекта span — это sizeof(ptr) + sizeof(size_t)
     ```

     **Источник:** [Cppreference: std::span](https://en.cppreference.com/w/cpp/container/span)

227. Почему `span` считается невладеющим представлением диапазона?

     **Ответ:** Потому что он является всего лишь окном просмотра (proxy) поверх чужой памяти, принадлежащей другому объекту (`vector`, Си-массиву, буферу стека).

     **Пример:**

     ```cpp
     #include <span>
     #include <vector>

     std::vector<int> v = {10, 20};
     std::span<int> sp = v;
     sp[0] = 99; // изменяет данные напрямую в векторе v
     ```

     **Источник:** [Cppreference: std::span](https://en.cppreference.com/w/cpp/container/span)

228. Какие риски lifetime связаны с `span`?

     **Ответ:** Риск обращения к памяти после освобождения (Dangling pointer / Use-After-Free), если исходный контейнер был уничтожен или перевыделил свой буфер раньше, чем закончилась работа с `span`.

     **Пример:**

     ```cpp
     #include <span>
     #include <vector>

     std::span<int> sp;
     {
         std::vector<int> v = {1, 2};
         sp = v;
     }
     // int x = sp[0]; // UB: v уже уничтожен
     ```

     **Источник:** [Cppreference: std::span](https://en.cppreference.com/w/cpp/container/span)

229. Что такое `std::string_view`?

     **Ответ:** `std::string_view` (C++17) — это невладеющая константная ссылка на непрерывную последовательность символов, инкапсулирующая указатель на начало строки и её длину.

     **Пример:**

     ```cpp
     #include <string_view>

     void log(std::string_view sv);
     log("Literal string"); // без аллокации памяти!
     ```

     **Источник:** [Cppreference: std::basic_string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

230. Чем `string_view` отличается от `std::string`?

     **Ответ:** `std::string` владеет буфером в памяти и выполняет динамическое выделение, а `string_view` лишь ссылается на существующие символы без аллокаций и без гарантии завершающего нулевого символа (`\0`).

     **Пример:**

     ```cpp
     #include <string>
     #include <string_view>

     std::string str = "long long string...";
     std::string_view sv = str; // O(1), копирование указателя и длины
     ```

     **Источник:** [Cppreference: std::basic_string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

231. Почему `string_view` удобен для интерфейсов функций?

     **Ответ:** Он унифицирует прием строковых аргументов: функция может принимать `const char*`, `std::string` или строковые литералы без создания промежуточных копий и лишних аллокаций.

     **Пример:**

     ```cpp
     #include <string_view>

     bool starts_with_a(std::string_view sv) {
         return !sv.empty() && sv.front() == 'a';
     }
     ```

     **Источник:** [Cppreference: std::basic_string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

232. Какие ошибки lifetime возможны со `string_view`?

     **Ответ:** Образование висячих ссылок при связывании `string_view` с временным объектом `std::string`, который уничтожается в конце полного выражения.

     **Пример:**

     ```cpp
     #include <string>
     #include <string_view>

     std::string get_name() { return "temp"; }
     std::string_view sv = get_name(); // ОШИБКА: временный объект уничтожен, sv невалиден
     ```

     **Источник:** [Cppreference: std::basic_string_view](https://en.cppreference.com/w/cpp/string/basic_string_view)

233. Что такое `std::ranges`?

     **Ответ:** `std::ranges` (C++20) — это современное переосмысление алгоритмов и итераторов STL, оперирующее диапазонами как цельными сущностями, поддерживающее концепты, проекции и ленивые конвейеры.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {3, 1, 2};
     std::ranges::sort(v); // вместо std::sort(v.begin(), v.end())
     ```

     **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

234. Чем ranges отличаются от классического STL-подхода с парами итераторов?

     **Ответ:** Они позволяют передавать контейнер напрямую без явной пары `(begin, end)`, поддерживают разные типы для начала и конца (sentinel), проверяют ограничения типов через концепты и поддерживают композицию представлений.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {5, 2};
     std::ranges::fill(v, 0); // лаконично и типобезопасно
     ```

     **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

235. Что такое view в `ranges`?

     **Ответ:** View — это диапазон, который не владеет своими элементами (или владеет легковесно), имеет сложность копирования, перемещения и уничтожения за $O(1)$ и обычно вычисляется лениво при обходе.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2, 3, 4};
     auto evens = v | std::views::filter([](int x) { return x % 2 == 0; });
     ```

     **Источник:** [Cppreference: std::ranges::view](https://en.cppreference.com/w/cpp/ranges/view)

236. Чем view отличается от контейнера?

     **Ответ:** Контейнер владеет памятью и физическими объектами, а view — это легкая невладеющая обертка над существующим диапазоном, конструируемая за $O(1)$.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v(1000); // контейнер: аллокация памяти
     auto v_view = std::views::all(v); // view: O(1), указатели на v
     ```

     **Источник:** [Cppreference: std::ranges::view](https://en.cppreference.com/w/cpp/ranges/view)

237. Почему view часто реализует ленивые вычисления?

     **Ответ:** Преобразования или фильтрация применяются к элементам "на лету" только в момент разыменования итератора во время прохода, избегая выделения промежуточных буферов в памяти.

     **Пример:**

     ```cpp
     #include <ranges>

     // Вычисляет квадраты только тогда, когда запрашивается элемент
     auto squares = std::views::iota(1, 100) | std::views::transform([](int x) { return x * x; });
     ```

     **Источник:** [Cppreference: std::ranges::view](https://en.cppreference.com/w/cpp/ranges/view)

238. Что такое `std::views::filter`?

     **Ответ:** Это адаптер диапазона (range adaptor), который лениво отфильтровывает элементы, пропуская только те, которые удовлетворяют заданному предикату.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2, 3, 4, 5};
     auto odds = v | std::views::filter([](int n) { return n % 2 != 0; });
     ```

     **Источник:** [Cppreference: std::ranges::filter_view](https://en.cppreference.com/w/cpp/ranges/filter_view)

239. Что делает `std::views::transform`?

     **Ответ:** Это адаптер диапазона, который лениво применяет функцию трансформации к каждому элементу при обращении к нему.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2, 3};
     auto doubled = v | std::views::transform([](int x) { return x * 2; });
     ```

     **Источник:** [Cppreference: std::ranges::transform_view](https://en.cppreference.com/w/cpp/ranges/transform_view)

240. Что делает `std::views::take`?

     **Ответ:** Создает view, содержащий не более первых $N$ элементов исходного диапазона.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {10, 20, 30, 40, 50};
     auto first_three = v | std::views::take(3); // 10, 20, 30
     ```

     **Источник:** [Cppreference: std::ranges::take_view](https://en.cppreference.com/w/cpp/ranges/take_view)

241. Что такое композиция views через `|`?

     **Ответ:** Это синтаксис конвейера (pipeline), позволяющий последовательно связывать несколько адаптеров диапазонов в цепочку обработки данных без создания промежуточных коллекций.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2, 3, 4, 5, 6};
     auto pipeline = v 
         | std::views::filter([](int x) { return x % 2 == 0; })
         | std::views::transform([](int x) { return x * x; })
         | std::views::take(2);
     ```

     **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

242. Почему ranges делают код более декларативным?

     **Ответ:** Код описывает *что* нужно сделать с потоком данных (отфильтровать, трансформировать, взять $N$) в едином пайплайне, скрывая низкоуровневые детали циклов, временных переменных и счетчиков.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2, 3};
     auto res = v | std::views::reverse | std::views::take(1);
     ```

     **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

243. Что такое projection в ranges-алгоритмах?

     **Ответ:** Projection (проекция) — это вызываемый объект, применяемый к каждому элементу перед его передачей в предикат или компаратор алгоритма (позволяет сортировать/искать по полям структур без написания громоздких лямбд).

     **Пример:**

     ```cpp
     #include <vector>
     #include <string>
     #include <algorithm>

     struct User { int id; std::string name; };
     std::vector<User> users = {{2, "B"}, {1, "A"}};

     // Сортировка по полю id с помощью проекции:
     std::ranges::sort(users, {}, &User::id);
     ```

     **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

244. Чем `ranges::sort` отличается по интерфейсу от старого `std::sort`?

     **Ответ:** Он может принимать диапазон как единый аргумент, поддерживает проекции третьим параметром и требует выполнения концепта `random_access_range`.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {3, 1, 2};
     std::ranges::sort(v); // старый: std::sort(v.begin(), v.end())
     ```

     **Источник:** [Cppreference: std::ranges::sort](https://en.cppreference.com/w/cpp/algorithm/ranges/sort)

245. Почему concepts важны для ranges?

     **Ответ:** Концепты строго специфицируют требования алгоритмов к типам на этапе компиляции, выдавая чистые и понятные сообщения об ошибках вместо страниц внутренних шаблонов STL.

     **Пример:**

     ```cpp
     #include <ranges>
     #include <concepts>

     template <std::ranges::input_range R>
     void process(R&& r);
     ```

     **Источник:** [Cppreference: Constraints and concepts](https://en.cppreference.com/w/cpp/concepts)

246. Что такое range concept?

     **Ответ:** Это концепт `std::ranges::range`, требующий, чтобы от объекта можно было получить итератор начала через `std::ranges::begin()` и часового/итератор конца через `std::ranges::end()`.

     **Пример:**

     ```cpp
     #include <ranges>
     #include <vector>

     static_assert(std::ranges::range<std::vector<int>>);
     ```

     **Источник:** [Cppreference: std::ranges::range](https://en.cppreference.com/w/cpp/ranges/range)

247. Что такое input_range?

     **Ответ:** Концепт диапазона, элементы которого можно обойти хотя бы один раз для чтения с помощью `input_iterator`.

     **Пример:**

     ```cpp
     #include <ranges>
     #include <vector>

     static_assert(std::ranges::input_range<std::vector<int>>);
     ```

     **Источник:** [Cppreference: std::ranges::input_range](https://en.cppreference.com/w/cpp/ranges/input_range)

248. Что такое random_access_range?

     **Ответ:** Концепт диапазона, поддерживающий доступ к элементам по индексу за $O(1)$ и вычисление разности между итераторами.

     **Пример:**

     ```cpp
     #include <ranges>
     #include <vector>

     static_assert(std::ranges::random_access_range<std::vector<int>>);
     ```

     **Источник:** [Cppreference: std::ranges::random_access_range](https://en.cppreference.com/w/cpp/ranges/random_access_range)

249. Что такое borrowed_range?

     **Ответ:** Концепт диапазона, итераторы которого остаются валидными даже после уничтожения самого объекта диапазона (например, ссылки на контейнеры или `std::span`).

     **Пример:**

     ```cpp
     #include <ranges>
     #include <span>

     static_assert(std::ranges::borrowed_range<std::span<int>>);
     ```

     **Источник:** [Cppreference: std::ranges::borrowed_range](https://en.cppreference.com/w/cpp/ranges/borrowed_range)

250. Почему borrowed_range связан с lifetime и безопасностью?

     **Ответ:** Алгоритмы `ranges` предотвращают образование висячих итераторов (возвращая `std::dangling`), если им передается временный объект (`rvalue`), который не является `borrowed_range`.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> get_data();
     auto it = std::ranges::find(get_data(), 42); 
     // it имеет тип std::ranges::dangling, разыменовать его невозможно (ошибка компиляции)
     ```

     **Источник:** [Cppreference: std::ranges::dangling](https://en.cppreference.com/w/cpp/ranges/dangling)

251. Что такое iterator-sentinel модель в ranges?

     **Ответ:** Это подход, при котором конец диапазона обозначается не тем же типом итератора, что и начало, а специальным объектом-"часовым" (sentinel), с которым итератор можно сравнивать на равенство (`it == sentinel`).

     **Пример:**

     ```cpp
     #include <ranges>

     struct NullTerminatedSentinel {
         bool operator==(const char* p) const { return *p == '\0'; }
     };
     ```

     **Источник:** [Cppreference: std::sentinel_for](https://en.cppreference.com/w/cpp/iterator/sentinel_for)

252. Чем sentinel отличается от классического итератора-конца?

     **Ответ:** Sentinel может иметь совершенно другой тип, не поддерживать инкремент и не требовать предварительного вычисления длины (например, для C-строк или бесконечных потоков конец определяется по условию).

     **Пример:**

     ```cpp
     // Диапазон до символа '\0' без предварительного вычисления strlen
     const char* str = "Hello";
     // begin — const char*, end — NullTerminatedSentinel
     ```

     **Источник:** [Cppreference: std::sentinel_for](https://en.cppreference.com/w/cpp/iterator/sentinel_for)

253. Почему ranges не сводятся только к “новому синтаксису”?

     **Ответ:** Они принципиально меняют семантику: вводят sentinel-модель для бесконечных потоков, защиту от dangling references, компонуемые ленивые вычисления и проекции на уровне компилятора.

     **Пример:**

     ```cpp
     #include <ranges>

     // Бесконечный диапазон целых чисел
     auto infinite = std::views::iota(0);
     ```

     **Источник:** [Cppreference: Ranges library](https://en.cppreference.com/w/cpp/ranges)

254. Что такое `std::views::iota`?

     **Ответ:** Генератор диапазона, создающий последовательность возрастающих значений, начиная с заданного числа (конечную или бесконечную).

     **Пример:**

     ```cpp
     #include <ranges>

     for (int i : std::views::iota(1, 5)) {
         // печатает 1, 2, 3, 4
     }
     ```

     **Источник:** [Cppreference: std::ranges::iota_view](https://en.cppreference.com/w/cpp/ranges/iota_view)

255. Что такое `std::ranges::begin` и `std::ranges::end`?

     **Ответ:** Это точки кастомизации (Customization Point Objects — CPO), безопасно возвращающие итератор начала и часового конца с защитой от ADL-спуфинга и проверкой валидности времени жизни.

     **Пример:**

     ```cpp
     #include <vector>
     #include <ranges>

     std::vector<int> v = {1, 2};
     auto b = std::ranges::begin(v);
     auto e = std::ranges::end(v);
     ```

     **Источник:** [Cppreference: std::ranges::begin](https://en.cppreference.com/w/cpp/ranges/begin)

256. Почему customization points важны в современном STL?

     **Ответ:** CPO гарантируют вызов правильной перегрузки функции без конфликтов пространств имен (ADL issues) и блокируют некорректное использование временных объектов (rvalues).

     **Пример:**

     ```cpp
     #include <ranges>

     // std::ranges::begin защищен от случайного захвата перегрузок из глобальной области
     ```

     **Источник:** [Cppreference: Customization point object](https://en.cppreference.com/w/cpp/ranges/cpo)

257. Что такое `std::invoke` и где он связан с алгоритмами?

     **Ответ:** `std::invoke` — это служебная функция для единообразного вызова любого Callable-объекта (указателя на функцию, лямбды, указателя на функцию-член или указателя на поле класса). Именно через нее вызываются компараторы и проекции в алгоритмах STL.

     **Пример:**

     ```cpp
     #include <functional>

     struct S { int val = 42; };
     S obj;
     int x = std::invoke(&S::val, obj); // извлечение поля класса
     ```

     **Источник:** [Cppreference: std::invoke](https://en.cppreference.com/w/cpp/utility/functional/invoke)

258. Почему callable-объекты играют ключевую роль в STL?

     **Ответ:** Они позволяют кастомизировать предикаты, трансформации, генераторы и компараторы, передавая в generic-алгоритмы как объекты с состоянием (stateful functors), так и легковесные лямбды.

     **Пример:**

     ```cpp
     #include <algorithm>
     #include <vector>

     int threshold = 5;
     std::vector<int> v = {1, 6, 2};
     // лямбда захватывает контекст
     auto it = std::find_if(v.begin(), v.end(), [threshold](int x) { return x > threshold; });
     ```

     **Источник:** [Cppreference: Callable](https://en.cppreference.com/w/cpp/named_req/Callable)

259. Что такое функциональный объект `std::less<>`?

     **Ответ:** Это "прозрачный" (transparent) функтор сравнения (C++14), перегруженный шаблонным `operator()`, позволяющий сравнивать аргументы разных типов без их предварительного приведения к одному общему типу.

     **Пример:**

     ```cpp
     #include <functional>
     #include <string>

     std::less<> cmp;
     bool b = cmp(std::string("abc"), "abc"); // без создания временного std::string
     ```

     **Источник:** [Cppreference: std::less](https://en.cppreference.com/w/cpp/utility/functional/less)

260. Зачем нужны стандартные функторы вроде `std::less`, `std::greater`, `std::hash`?

     **Ответ:** Они предоставляют стандартизированные параметры по умолчанию для контейнеров и алгоритмов, инкапсулируя операции отношения порядка и хеширования в виде полноценных типов.

     **Пример:**

     ```cpp
     #include <queue>
     #include <vector>
     #include <functional>

     // priority_queue min-heap:
     std::priority_queue<int, std::vector<int>, std::greater<int>> min_heap;
     ```

     **Источник:** [Cppreference: Functional library](https://en.cppreference.com/w/cpp/utility/functional)

---

## Очень сложный уровень / дизайн и практика

261. Почему STL-код часто выигрывает не только в краткости, но и в корректности?

     **Ответ:** Стандартные алгоритмы протестированы миллионами разработчиков, свободны от краевых ошибок индексации (off-by-one), учитывают переполнения и обеспечивают специфицированные гарантии безопасности исключений.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 2, 3};
     // Корректно при пустом v, не допускает выхода за границы
     auto it = std::max_element(v.begin(), v.end());
     ```

     **Источник:** [Cppreference: std::max_element](https://en.cppreference.com/w/cpp/algorithm/max_element)

262. Почему “сначала контейнер по умолчанию — `vector`” считается хорошим практическим правилом?

     **Ответ:** Аппаратная архитектура современных CPU оптимизирована под последовательный доступ к кэш-линиям. `vector` имеет нулевой оверхед на указатели узлов и максимальную производительность в 95% типичных задач.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> data; // контейнер первого выбора
     ```

     **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

263. Когда `list` используется реже, чем ожидают новички?

     **Ответ:** Новички выбирают `list` из-за обещания вставки за $O(1)$, забывая, что поиск места вставки занимает $O(N)$ с промахами кэша, а аллокация каждого узла через `new` значительно медленнее сдвига байтов в векторе.

     **Пример:**

     ```cpp
     #include <list>

     std::list<int> l;
     // Вставка в середину требует медленного линейного обхода указателей узлов
     ```

     **Источник:** [Cppreference: std::list](https://en.cppreference.com/w/cpp/container/list)

264. Почему оценка сложности операции без учёта locality of reference может вводить в заблуждение?

     **Ответ:** Асимптотическое "О-большое" скрывает константу $C$. Чтение непрерывного массива из L1-кэша занимает $\approx 1$ нс, а чтение из RAM при промахе кэша в node-based контейнере — $\approx 50-100$ нс, что нивелирует многие алгоритмические преимущества на реальном железе.

     **Пример:**

     ```cpp
     // Линейный поиск по vector часто опережает логарифмический поиск в std::set до сотен элементов
     ```

     **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

265. Как кэш-поведение влияет на реальную эффективность контейнеров STL?

     **Ответ:** Контейнеры с непрерывным размещением данных в памяти (`vector`, `array`, `string`) загружаются в кэш процессора строками по 64 байта целиком, минимизируя простои конвейера (CPU stalls) по сравнению со списочными структурами.

     **Пример:**

     ```cpp
     #include <vector>

     std::vector<int> v(1000);
     for (auto& x : v) x++; // максимальная утилизация bandwidth кэша ЦП
     ```

     **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

266. Что такое small buffer optimization и связано ли это напрямую с STL-контейнерами?

     **Ответ:** SBO (Small Buffer / String Optimization) — оптимизация, при которой объекты малого размера хранятся во внутреннем статическом массиве самого объекта без обращения к динамической куче (широко применяется в `std::string`, `std::function`, `std::any`).

     **Пример:**

     ```cpp
     #include <string>

     std::string s = "small"; // аллокация в куче НЕ происходит (SBO обычно до 15-22 символов)
     ```

     **Источник:** [Cppreference: std::basic_string](https://en.cppreference.com/w/cpp/string/basic_string)

267. Почему `std::string` иногда ведёт себя как особый случай контейнера?

     **Ответ:** `std::string` ориентирован на хранение текста: гарантирует наличие нулевого терминатора `\0` (`c_str()`), оптимизирован с помощью SBO и предоставляет специфические методы конкатенации, поиска подстрок и числового парсинга.

     **Пример:**

     ```cpp
     #include <string>

     std::string s = "hello";
     const char* c_str = s.c_str(); // гарантированный \0 на конце
     ```

     **Источник:** [Cppreference: std::basic_string](https://en.cppreference.com/w/cpp/string/basic_string)

268. Является ли `std::string` полноценным контейнером по духу STL?

     **Ответ:** Да, он полностью удовлетворяет концептам `SequenceContainer`, `ContiguousContainer` и `ReversibleContainer`, предоставляя итераторы и совместимость со всеми алгоритмами STL.

     **Пример:**

     ```cpp
     #include <string>
     #include <algorithm>

     std::string s = "badc";
     std::sort(s.begin(), s.end()); // "abcd"
     ```

     **Источник:** [Cppreference: std::basic_string](https://en.cppreference.com/w/cpp/string/basic_string)

269. Чем `std::array` полезен как value-type по сравнению с сырым массивом?

     **Ответ:** `std::array` является первоклассным типом данных (first-class citizen): его можно копировать оператором присваивания, передавать по значению, возвращать из функций и использовать в `std::tuple_size` / структурированном связывании.

     **Пример:**

     ```cpp
     #include <array>

     std::array<int, 3> create() {
         return {1, 2, 3}; // возврат массива по значению
     }
     ```

     **Источник:** [Cppreference: std::array](https://en.cppreference.com/w/cpp/container/array)

270. Почему `std::array` лучше передаётся и возвращается из функций, чем `T[N]`?

     **Ответ:** Сырой массив `T[N]` неявно преобразуется (decay) в указатель `T*` с потерей информации о размере, тогда как `std::array<T, N>` сохраняет точный тип и размер в сигнатуре функции.

     **Пример:**

     ```cpp
     #include <array>

     void process(std::array<int, 4> a); // точный размер проверяется при компиляции
     ```

     **Источник:** [Cppreference: std::array](https://en.cppreference.com/w/cpp/container/array)

271. Что такое node handle в ассоциативных контейнерах современного C++?

     **Ответ:** Node handle (C++17) — это перемещаемый объект-обёртка, владеющий извлеченным узлом ассоциативного контейнера (`set`, `map`), дающий доступ к его ключу и значению без деаллокации памяти.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s = {1, 2, 3};
     auto nh = s.extract(2); // узел извлечен из дерева без деаллокации
     nh.value() = 20;        // изменение значения
     s.insert(std::move(nh)); // вставка обратно
     ```

     **Источник:** [Cppreference: Node handle](https://en.cppreference.com/w/cpp/container/node_handle)

272. Для чего нужны `extract()` и `merge()`?

     **Ответ:** `extract()` извлекает узел из контейнера без уничтожения объекта, а `merge()` переносит все узлы из одного контейнера в другой без лишних аллокаций и копирования данных.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> s1 = {1, 2};
     std::set<int> s2 = {3, 4};
     s1.merge(s2); // s2 опустошается, узлы переходят в s1 через смену указателей
     ```

     **Источник:** [Cppreference: std::set::merge](https://en.cppreference.com/w/cpp/container/set/merge)

273. Как `merge()` работает у `set` и `map`?

     **Ответ:** Он обходит исходный контейнер и перелинковывает указатели внутренних узлов в дерево целевого контейнера; элементы с конфликтующими (дублирующимися) ключами остаются в исходном контейнере.

     **Пример:**

     ```cpp
     #include <set>

     std::set<int> a = {1, 2};
     std::set<int> b = {2, 3};
     a.merge(b); // в 'a' теперь {1, 2, 3}, в 'b' остался дубликат {2}
     ```

     **Источник:** [Cppreference: std::set::merge](https://en.cppreference.com/w/cpp/container/set/merge)

274. Почему node handle даёт способ перемещать элементы между контейнерами без лишнего копирования?

     **Ответ:** Физический блок памяти узла в куче не освобождается и не выделяется заново; меняются только указатели на соседние вершины дерева в новом контейнере.

     **Пример:**

     ```cpp
     #include <map>

     std::map<int, int> m1 = {{1, 10}};
     std::map<int, int> m2;
     m2.insert(m1.extract(1)); // нулевые затраты на копирование
     ```

     **Источник:** [Cppreference: Node handle](https://en.cppreference.com/w/cpp/container/node_handle)

275. Что такое heterogeneous lookup?

     **Ответ:** Это гетерогенный поиск (C++14), позволяющий искать в ассоциативных контейнерах по объектам других типов, не конструируя временный объект ключа (например, поиск по `std::string_view` в `std::map<std::string, T>`).

     **Пример:**

     ```cpp
     #include <map>
     #include <string>
     #include <string_view>

     std::map<std::string, int, std::less<>> m; // std::less<> включает гетерогенный поиск
     auto it = m.find(std::string_view("test")); // без создания std::string
     ```

     **Источник:** [Cppreference: std::map::find](https://en.cppreference.com/w/cpp/container/map/find)

276. Почему прозрачный компаратор вроде `std::less<>` полезен для поиска без создания временного объекта ключа?

     **Ответ:** Он объявляет внутренний тип `is_transparent`, что активирует шаблонные перегрузки методов `find`, `lower_bound`, `contains`, принимающие любой тип, сравнимый с ключом.

     **Пример:**

     ```cpp
     #include <set>
     #include <string>

     std::set<std::string, std::less<>> s = {"apple", "banana"};
     bool found = s.contains("apple"); // поиск без вызова конструктора std::string
     ```

     **Источник:** [Cppreference: std::less](https://en.cppreference.com/w/cpp/utility/functional/less)

277. В каких случаях heterogeneous lookup особенно полезен для `std::map<std::string, ...>`?

     **Ответ:** В высоконагруженных сценариях при интенсивном поиске по строковым литералам (`const char*`) или срезам (`string_view`), предотвращая миллионы дорогостоящих аллокаций динамической памяти под временные строки `std::string`.

     **Пример:**

     ```cpp
     #include <map>
     #include <string>

     std::map<std::string, int, std::less<>> cache;
     void lookup(const char* key) {
         auto it = cache.find(key); // 0 аллокаций
     }
     ```

     **Источник:** [Cppreference: std::map::find](https://en.cppreference.com/w/cpp/container/map/find)

278. Что такое прозрачный хеш и прозрачное сравнение для unordered-контейнеров?

     **Ответ:** Это поддержка гетерогенного поиска в хеш-таблицах (начиная с C++20), требующая наличия тега `is_transparent` как в компараторе эквивалентности (`equal_to<>`), так и в хеш-функторе.

     **Пример:**

     ```cpp
     #include <unordered_set>
     #include <string>
     #include <string_view>

     struct StringHash {
         using is_transparent = void;
         std::size_t operator()(std::string_view sv) const { return std::hash<std::string_view>{}(sv); }
     };
     std::unordered_set<std::string, StringHash, std::equal_to<>> us;
     ```

     **Источник:** [Cppreference: std::unordered_set::find](https://en.cppreference.com/w/cpp/container/unordered_set/find)

279. Чем stable-алгоритмы отличаются от нестабильных?

     **Ответ:** Стабильные алгоритмы (`std::stable_sort`, `std::stable_partition`) гарантируют сохранение исходного взаимного порядка следования эквивалентных элементов.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     struct Task { int priority; int id; };
     std::vector<Task> t = {{1, 10}, {1, 20}};
     std::stable_sort(t.begin(), t.end(), [](auto& a, auto& b){ return a.priority < b.priority; });
     // id: 10 гарантированно останется перед id: 20
     ```

     **Источник:** [Cppreference: std::stable_sort](https://en.cppreference.com/w/cpp/algorithm/stable_sort)

280. Что такое `std::stable_sort`?

     **Ответ:** Это алгоритм стабильной сортировки (на основе сортировки слиянием), сохраняющий порядок равных элементов со сложностью $O(N \log N)$ при наличии доступной дополнительной памяти.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {4, 2, 3, 2};
     std::stable_sort(v.begin(), v.end());
     ```

     **Источник:** [Cppreference: std::stable_sort](https://en.cppreference.com/w/cpp/algorithm/stable_sort)

281. Когда стабильность сортировки действительно важна?

     **Ответ:** Когда объекты сортируются последовательно по нескольким полям (например, сначала по имени, а затем по возрасту) или когда порядок добавления эквивалентных событий имеет смысловое значение.

     **Пример:**

     ```cpp
     // Многоуровневая сортировка: вторичные критерии сохраняются только при стабильной сортировке
     ```

     **Источник:** [Cppreference: std::stable_sort](https://en.cppreference.com/w/cpp/algorithm/stable_sort)

282. Что делает `std::partition`?

     **Ответ:** Переупорядочивает элементы диапазона так, чтобы все элементы, удовлетворяющие унарному предикату, предшествовали элементам, не удовлетворяющим ему, за $O(N)$ шагов (не сохраняя взаимный порядок).

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 2, 3, 4, 5};
     auto bound = std::partition(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
     // Четные окажутся в начале диапазона
     ```

     **Источник:** [Cppreference: std::partition](https://en.cppreference.com/w/cpp/algorithm/partition)

283. Что делает `std::stable_partition`?

     **Ответ:** Выполняет разделение элементов по предикату за $O(N)$, гарантируя сохранение относительного исходного порядка элементов в обеих сформированных группах.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 4, 3, 2, 5};
     std::stable_partition(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
     // Четные: 4, 2 (порядок сохранен); Нечетные: 1, 3, 5 (порядок сохранен)
     ```

     **Источник:** [Cppreference: std::stable_partition](https://en.cppreference.com/w/cpp/algorithm/stable_partition)

284. Что делает `std::nth_element`?

     **Ответ:** Частично сортирует диапазон за линейное время $O(N)$ так, что на позиции `nth` оказывается ровно тот элемент, который стоял бы там при полной сортировке, при этом слева находятся элементы $\le$, а справа $\ge$.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {5, 1, 9, 2, 4};
     std::nth_element(v.begin(), v.begin() + 2, v.end());
     int median = *(v.begin() + 2); // точная медиана
     ```

     **Источник:** [Cppreference: std::nth_element](https://en.cppreference.com/w/cpp/algorithm/nth_element)

285. В каких задачах `nth_element` полезнее полной сортировки?

     **Ответ:** При вычислении медианы, нахождении $k$-й порядковой статистики или выборке 10 лучших результатов (топ-$K$), экономя время ($O(N)$ вместо $O(N \log N)$).

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<double> scores(1000000);
     // Быстрый поиск 95-го процентиля:
     auto p95_it = scores.begin() + 950000;
     std::nth_element(scores.begin(), p95_it, scores.end());
     ```

     **Источник:** [Cppreference: std::nth_element](https://en.cppreference.com/w/cpp/algorithm/nth_element)

286. Что делает `std::partial_sort`?

     **Ответ:** Сортирует только часть диапазона от `first` до `middle`, помещая в нее наименьшие элементы диапазона в строго отсортированном порядке со сложностью $O(N \log K)$.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {9, 1, 8, 2, 7, 3};
     std::partial_sort(v.begin(), v.begin() + 3, v.end());
     // первые 3 элемента гарантированно: {1, 2, 3}
     ```

     **Источник:** [Cppreference: std::partial_sort](https://en.cppreference.com/w/cpp/algorithm/partial_sort)

287. Когда `partial_sort` эффективнее `sort`?

     **Ответ:** Когда из большого набора данных (размера $N$) нужно извлечь и упорядочить лишь небольшое число лучших результатов $K$ ($K \ll N$), избегая полной сортировки оставшегося массива.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v(1000000);
     // Найти и отсортировать только топ-5:
     std::partial_sort(v.begin(), v.begin() + 5, v.end());
     ```

     **Источник:** [Cppreference: std::partial_sort](https://en.cppreference.com/w/cpp/algorithm/partial_sort)

288. Что делает `std::merge`?

     **Ответ:** Объединяет два предварительно отсортированных диапазона в один общий отсортированный выходной диапазон за линейное время $O(N_1 + N_2)$.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> a = {1, 3, 5};
     std::vector<int> b = {2, 4, 6};
     std::vector<int> dst(6);
     std::merge(a.begin(), a.end(), b.begin(), b.end(), dst.begin());
     ```

     **Источник:** [Cppreference: std::merge](https://en.cppreference.com/w/cpp/algorithm/merge)

289. Какой предварительный инвариант нужен для `merge`?

     **Ответ:** Оба исходных входных диапазона должны быть заранее отсортированы по тому же отношению порядка (компаратору).

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> a = {1, 2}; // отсортирован
     std::vector<int> b = {3, 4}; // отсортирован
     ```

     **Источник:** [Cppreference: std::merge](https://en.cppreference.com/w/cpp/algorithm/merge)

290. Что делает `std::set_union`?

     **Ответ:** Вычисляет математическое объединение двух отсортированных диапазонов за линейное время, записывая элементы, присутствующие хотя бы в одном из них.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>
     #include <iterator>

     std::vector<int> v1 = {1, 2, 3};
     std::vector<int> v2 = {2, 3, 4};
     std::vector<int> out;
     std::set_union(v1.begin(), v1.end(), v2.begin(), v2.end(), std::back_inserter(out));
     // out: {1, 2, 3, 4}
     ```

     **Источник:** [Cppreference: std::set_union](https://en.cppreference.com/w/cpp/algorithm/set_union)

291. Что делает `std::set_intersection`?

     **Ответ:** Находит элементы, присутствующие одновременно в обоих предварительно отсортированных диапазонах (пересечение множеств).

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>
     #include <iterator>

     std::vector<int> v1 = {1, 2, 3};
     std::vector<int> v2 = {2, 3, 4};
     std::vector<int> out;
     std::set_intersection(v1.begin(), v1.end(), v2.begin(), v2.end(), std::back_inserter(out));
     // out: {2, 3}
     ```

     **Источник:** [Cppreference: std::set_intersection](https://en.cppreference.com/w/cpp/algorithm/set_intersection)

292. Почему set-алгоритмы требуют отсортированных диапазонов?

     **Ответ:** Это позволяет применять метод двух указателей (two pointers) для синхронного обхода обоих диапазонов за один проход ($O(N + M)$) без квадратичных вложенных циклов.

     **Пример:**

     ```cpp
     #include <algorithm>

     // Без сортировки определение пересечения заняло бы O(N * M)
     ```

     **Источник:** [Cppreference: std::set_intersection](https://en.cppreference.com/w/cpp/algorithm/set_intersection)

293. Что делает `std::heap`-семейство алгоритмов?

     **Ответ:** Предоставляет низкоуровневые операции для превращения обычного диапазона произвольного доступа (`RandomAccessIterator`) в двоичную кучу (max-heap по умолчанию) и манипулирования ею на месте.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {3, 1, 4, 1, 5};
     std::make_heap(v.begin(), v.end());
     ```

     **Источник:** [Cppreference: std::make_heap](https://en.cppreference.com/w/cpp/algorithm/make_heap)

294. Что делают `make_heap`, `push_heap`, `pop_heap`, `sort_heap`?

     **Ответ:** `make_heap` строит кучу из диапазона за $O(N)$; `push_heap` просеивает вверх новый элемент, добавленный в конец; `pop_heap` перемещает корень кучи (максимум) в конец диапазона; `sort_heap` превращает кучу в отсортированный массив за $O(N \log N)$.

     **Пример:**

     ```cpp
     #include <vector>
     #include <algorithm>

     std::vector<int> v = {1, 5, 2};
     std::make_heap(v.begin(), v.end());
     v.push_back(10);
     std::push_heap(v.begin(), v.end()); // 10 поднялся в корень кучи
     ```

     **Источник:** [Cppreference: std::make_heap](https://en.cppreference.com/w/cpp/algorithm/make_heap)

295. Как `priority_queue` связан с heap-алгоритмами?

     **Ответ:** Класс `std::priority_queue` является лишь объектной обёрткой над базовым контейнером (обычно `std::vector`), транслирующей свои методы `push()` и `pop()` в вызовы `std::push_heap` и `std::pop_heap`.

     **Пример:**

     ```cpp
     #include <queue>

     std::priority_queue<int> pq; // внутри вызывает make_heap, push_heap, pop_heap
     ```

     **Источник:** [Cppreference: std::priority_queue](https://en.cppreference.com/w/cpp/container/priority_queue)

296. Почему понимание heap полезно для работы с `priority_queue`?

     **Ответ:** Это дает понимание сложности операций ($O(\log N)$ вставка/удаление, $O(1)$ просмотр максимума) и позволяет при необходимости реализовать кастомные операции (например, изменение приоритета на месте) через работу с сырым вектором.

     **Пример:**

     ```cpp
     // Изменение приоритета в сыром векторе + std::make_heap восстанавливает кучу за O(N)
     ```

     **Источник:** [Cppreference: std::priority_queue](https://en.cppreference.com/w/cpp/container/priority_queue)

297. Что такое iterator invalidation policy как часть дизайна контейнера?

     **Ответ:** Это специфицированный стандартом контракт, определяющий, какие именно методы контейнера и при каких обстоятельствах сохраняют или делают недействительными ссылки, указатели и итераторы на элементы.

     **Пример:**

     ```cpp
     // Контракт std::list: итераторы не инвалидируются никогда, кроме удаления самого элемента
     // Контракт std::vector: итераторы инвалидируются при любой реаллокации
     ```

     **Источник:** [Cppreference: Iterator invalidation](https://en.cppreference.com/w/cpp/container#Iterator_invalidation)

298. Почему один и тот же интерфейс STL скрывает очень разную внутреннюю реализацию контейнеров?

     **Ответ:** Это основа обобщенного программирования: единая итераторная модель позволяет писать универсальные алгоритмы, давая программисту возможность подменять структуру данных под требования производительности без изменения бизнес-логики.

     **Пример:**

     ```cpp
     #include <vector>
     #include <list>
     #include <algorithm>

     // Шаблон функции не зависит от конкретной внутренней структуры контейнера
     template <typename Container>
     bool has_zero(const Container& c) {
         return std::find(c.begin(), c.end(), 0) != c.end();
     }
     ```

     **Источник:** [Cppreference: Containers library](https://en.cppreference.com/w/cpp/container)

299. В чём сила общей итераторной модели для повторного использования алгоритмов?

     **Ответ:** Алгоритм пишется единожды для категории итератора (например, `ForwardIterator`) и автоматически начинает работать с любыми существующими и будущими контейнерами, файловыми потоками и генераторами, удовлетворяющими этому интерфейсу.

     **Пример:**

     ```cpp
     #include <algorithm>
     // std::find работает с массивами T[], std::vector, std::list, std::deque и пользовательскими типами
     ```

     **Источник:** [Cppreference: Iterator library](https://en.cppreference.com/w/cpp/iterator)

300. Какие основные принципы выбора контейнера, алгоритма и итераторной модели ты бы сформулировал для современного C++?

     **Ответ:** 
     1. **Контейнеры:** использовать `std::vector` по умолчанию; при фиксированном размере — `std::array`; для работы со строками — `std::string` и `std::string_view`; для очередей с обоих концов — `std::deque`; хеш-таблицы (`unordered_*`) предпочитать упорядоченным деревьям (`map`/`set`), если не нужен порядок.
     2. **Алгоритмы:** предпочитать стандартные алгоритмы (`<algorithm>`, `<numeric>`) или `std::ranges` ручным циклам ради выразительности и безопасности; использовать правильные уровни алгоритмов (`find` вместо `sort`, `nth_element` вместо полной сортировки).
     3. **Итераторы и представления:** в современных интерфейсах функций принимать невладеющие диапазоны (`std::span`, `std::string_view`) или `std::ranges::view` вместо ссылок на конкретные контейнеры, минимизируя аллокации и связность кода.

     **Пример:**

     ```cpp
     #include <span>
     #include <ranges>
     #include <algorithm>

     // Современный C++ API: span вместо const std::vector&
     void process_data(std::span<const int> data) {
         auto evens = data | std::views::filter([](int x) { return x % 2 == 0; });
         // чистый декларативный пайплайн
     }
     ```

     **Источник:** [Cppreference: Containers library](https://en.cppreference.com/w/cpp/container)



[<- Prev](./07_templates.md)    [Next ->](./09_modern_cpp.md)
