# Алгоритмы и структуры данных


## Темы


- асимптотике
- массивам и строкам
- спискам, стекам, очередям
- hash/map/set
- binary search, sorting
- деревьям, heap, BST
- графам, DSU
- backtracking, greedy, DP
- битовым операциям
- Fenwick / segment tree / sparse table
- trie, string DS
- математике, геометрии
- STL и практическому C++

---

## О сборнике


Формат каждого пункта:

- вопрос сформулирован в стиле интервью или задачи;
- почти везде есть намёк на ожидаемую идею, структуру данных или асимптотику;
- акцент сделан на мышление, оценку сложности и реализацию на C++.

Как использовать:

1. Сначала отвечай устно на вопрос.

2. Затем набрасывай решение на C++.

3. После этого обязательно проговаривай временную и пространственную сложность.

4. Для задач на корректность — формулируй инвариант, greedy-choice или DP state.

   ---

## 1. Базовая асимптотика и анализ


1. Что такое O(1), O(log n), O(n), O(n log n), O(n^2)? Приведи по одному примеру алгоритма на C++ для каждого класса.

      **Ответ:** Это классы асимптотической сложности по времени ($O$-нотация), описывающие верхнюю границу масштабирования числа элементарных операций алгоритма при стремлении размера входа $n$ к бесконечности:
      - $O(1)$ — константное время: доступ по индексу в массиве.
      - $O(\log n)$ — логарифмическое время: бинарный поиск в отсортированном диапазоне.
      - $O(n)$ — линейное время: линейный поиск элемента или подсчет суммы.
      - $O(n \log n)$ — квазилинейное время: эффективная сортировка сравнениями (Merge Sort, IntroSort).
      - $O(n^2)$ — квадратичное время: наивные сортировки (Bubble/Insertion Sort), обход всех пар элементов.

      **Пример:**

      ```cpp
      #include <vector>
      #include <algorithm>

      void complexity_examples(std::vector<int>& v, int target) {
          // O(1)
          int first = v[0];

          // O(log n)
          bool found = std::binary_search(v.begin(), v.end(), target);

          // O(n)
          auto it = std::find(v.begin(), v.end(), target);

          // O(n log n)
          std::sort(v.begin(), v.end());

          // O(n^2)
          int pairs = 0;
          for (std::size_t i = 0; i < v.size(); ++i) {
              for (std::size_t j = 0; j < v.size(); ++j) {
                  if (v[i] == v[j]) ++pairs;
              }
          }
      }
      ```

   **Источник:** [Introduction to Algorithms (CLRS), Chapter 3: Growth of Functions](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

2. Чем отличаются худший, средний и амортизированный случаи? Объясни на примере `std::vector::push_back`.

      **Ответ:**

   - **Худший случай (Worst-case):** максимальное время работы на наименее благоприятных входных данных размера $n$.
   - **Средний случай (Average-case):** математическое ожидание времени работы при предположении о вероятностном распределении входных данных.
   - **Амортизированный случай (Amortized):** среднее время выполнения одной операции в наихудшей непрерывной последовательности из $M$ операций ($\frac{\text{Total Time}}{M}$).

   В `std::vector::push_back`:

   - Худший случай — $O(n)$, когда текущий `capacity` исчерпан, происходит аллокация нового буфера большего размера и перемещение всех $n$ элементов.
   - Амортизированный случай — $O(1)$, так как геометрическое увеличение емкости (в $1.5$ или $2$ раза) гарантирует, что дорогая реаллокация $O(n)$ случается достаточно редко, распределяя стоимость между предшествующими дешевыми операциями $O(1)$.

   **Пример:**

   ```cpp
   #include <vector>

   std::vector<int> v;
   // Большинство вставок выполняются за O(1) без реаллокации
   for (int i = 0; i < 1'000'000; ++i) {
       v.push_back(i); // Амортизированное O(1), в моменты роста буфера — худшее O(n)
   }

   ```

   **Источник:** [Cppreference: std::vector::push_back](https://en.cppreference.com/w/cpp/container/vector/push_back)

3. Почему выражение `for (int i = 1; i < n; i *= 2)` даёт `O(log n)`?

   **Ответ:** Значение переменной $i$ на каждом $k$-м шаге цикла равно $2^k$. Цикл завершает работу, когда $2^k \ge n$. Логарифмируя обе части неравенства по основанию $2$, получаем количество итераций $k = \lceil\log_2 n\rceil$, что по определению дает асимптотику $O(\log n)$.
   **Пример:**

   ```cpp
   int iterations = 0;
   int n = 1024;
   for (int i = 1; i < n; i *= 2) {
       ++iterations; // Выполнится ровно log2(1024) = 10 раз
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS), Chapter 3](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

4. Оцени сложность двойного цикла, где внутренний указатель только увеличивается и не сбрасывается. Почему это может быть `O(n)`, а не `O(n^2)`?

   **Ответ:** Сложность составляет $O(n)$. Хотя циклы синтаксически вложены друг в друга, внутренний указатель монотонно увеличивается от $0$ до $n$ за все время выполнения внешнего цикла без повторных возвратов назад. Общее суммарное число инкрементов внутреннего указателя ограничено величиной $n$, поэтому суммарное число операций внешнего и внутреннего циклов равно $n + n = 2n$, что дает $O(n)$.
   **Пример:**

   ```cpp
   #include <vector>

   // Паттерн Sliding Window / Two Pointers
   int max_subarray_sum(const std::vector<int>& v, int max_val) {
       int n = static_cast<int>(v.size());
       int r = 0, current = 0, best = 0;
       for (int l = 0; l < n; ++l) {
           while (r < n && current + v[r] <= max_val) {
               current += v[r];
               ++r; // r инкрементируется максимум n раз суммарно за всю работу функции
           }
           best = std::max(best, current);
           current -= v[l];
       }
       return best; // Итоговая сложность: O(n)
   }

   ```

   **Источник:** [Algorithms (Robert Sedgewick, Kevin Wayne)](https://algs4.cs.princeton.edu/home/)

5. Что означает пространственная сложность? Сравни iterative DFS и recursive DFS по памяти.

   **Ответ:** Пространственная сложность (Space Complexity) — это объем дополнительной оперативной памяти, требуемый алгоритму для работы в зависимости от размера входа $n$ (исключая сам вход).

   - **Recursive DFS:** использует стек системных вызовов; в худшем случае вырожденного графа/дерева (цепочка из $V$ вершин) глубина стека равна $O(V)$, где каждый стековый фрейм аллоцирует адрес возврата, сохраненные регистры и локальные переменные (высокий оверхед на вершину, риск stack overflow).
   - **Iterative DFS:** использует явный стек в куче (`std::vector` или `std::stack`), потребляя асимптотически те же $O(V)$ памяти, но без риска переполнения системного стека потока и с существенно меньшим объемом байт на каждую сохраняемую вершину (хранится только индекс или указатель).

   **Пример:**

   ```cpp
   #include <vector>
   #include <stack>

   // Рекурсивный DFS: неявный системный стек O(V)
   void dfs_rec(int u, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
       visited[u] = true;
       for (int v : adj[u]) {
           if (!visited[v]) dfs_rec(v, adj, visited);
       }
   }

   // Итеративный DFS: контролируемый буфер в куче O(V)
   void dfs_iter(int start, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
       std::stack<int> s;
       s.push(start);
       while (!s.empty()) {
           int u = s.top();
           s.pop();
           if (visited[u]) continue;
           visited[u] = true;
           for (int v : adj[u]) {
               if (!visited[v]) s.push(v);
           }
       }
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS), Chapter 22: Elementary Graph Algorithms](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

6. Как анализировать рекуррентное соотношение вида `T(n)=2T(n/2)+O(n)`? Какой это класс сложности?

   **Ответ:** Такое соотношение анализируется с помощью **основной теоремы о рекуррентных соотношениях (Master Theorem)** для вида $T(n) = a T(n/b) + f(n)$:

   - Здесь $a = 2$, $b = 2$, $f(n) = O(n)$.
   - Вычисляем критический показатель: $\log_b a = \log_2 2 = 1$, то есть $n^{\log_b a} = n^1 = n$.
   - Поскольку $f(n) = \Theta(n^{\log_b a}) = \Theta(n)$, применим второй случай теоремы.
   - Итоговый класс сложности: $T(n) = \Theta(n \log n)$ (классический пример — алгоритм Merge Sort).

   **Пример:**

   ```cpp
   // Рекуррентная схема Merge Sort
   void merge_sort(int* arr, int l, int r) {
       if (l >= r) return;
       int m = l + (r - l) / 2;
       merge_sort(arr, l, m);     // T(n / 2)
       merge_sort(arr, m + 1, r); // T(n / 2)
       // merge() выполняет O(n) операций объединения двух половин
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS), Chapter 4: Divide-and-Conquer](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

7. Когда `O(n log n)` на практике проигрывает `O(n^2)`?

   **Ответ:** На малых размерах входного массива $n$ (обычно $n \le 16..64$), а также на почти отсортированных данных. Алгоритмы класса $O(n^2)$ (например, Insertion Sort) обладают минимальным константным множителем, отсутствием накладных расходов на рекурсию/вызовы функций и превосходной локальностью данных в кэше CPU L1, в то время как рекурсивный оверхед Merge Sort или разбор стэка вызовов Quick Sort перевешивают выигрыш логарифма при малых $n$.
   **Пример:**

   ```cpp
   // Стандартная гибридная сортировка std::sort переключается на Insertion Sort при малых размерах:
   template <typename Iter>
   void hybrid_sort(Iter first, Iter last) {
       if (last - first < 16) {
           insertion_sort(first, last); // O(n^2), но быстрее O(n log n) на n < 16
       } else {
           // Quick Sort / Merge Sort ветка
       }
   }

   ```

   **Источник:** [LLVM libc++: std::sort implementation details](https://github.com/llvm/llvm-project/blob/main/libcxx/include/__algorithm/sort.h)

8. Что такое константные множители и почему они важны в C++?

   **Ответ:** Константный множитель $c$ — это независящий от $n$ коэффициент в формуле реального времени работы $T(n) \approx c \cdot g(n)$, скрываемый $O$-нотацией. В C++ константные множители имеют решающее значение: доступ к памяти через cache-friendly последовательный буфер (L1 кэш) в 100–200 раз быстрее случайного разыменования указателей в DRAM, а векторизация (SIMD) и предсказание переходов компилятора могут ускорить алгоритм одной и той же асимптотики на порядок.
   **Пример:**

   ```cpp
   #include <vector>
   #include <list>

   // Асимптотика последовательного обхода у обоих O(n), но std::vector
   // на практике обгоняет std::list в 5-20 раз из-за константного множителя попаданий в L1 Cache Line
   int sum_vec(const std::vector<int>& v) {
       int s = 0;
       for (int x : v) s += x; // Линейная локальность памяти
       return s;
   }

   ```

   **Источник:** [Bjarne Stroustrup: Why you should avoid Linked Lists](https://isocpp.org/)

9. Как оценить сложность кода с `std::sort`, бинарным поиском и копированием вектора?

   **Ответ:** Необходимо сложить временные затраты каждого последовательного этапа и выделить доминирующий член в худшем случае:

1. Копирование вектора размера $n$: $O(n)$ по времени и $O(n)$ дополнительной памяти.

2. Сортировка вектора `std::sort`: $O(n \log n)$ по времени.

3. Выполнение $k$ бинарных поисков: $k \cdot O(\log n) = O(k \log n)$.

   Итоговая суммарная сложность: $O(n + n \log n + k \log n) = O((n + k) \log n)$.
   **Пример:**

   ```cpp
   #include <vector>
   #include <algorithm>

   bool process(const std::vector<int>& input, const std::vector<int>& queries) {
       std::vector<int> copy = input;              // 1. Копирование: O(n)
       std::sort(copy.begin(), copy.end());         // 2. Сортировка: O(n log n)

       bool all_found = true;
       for (int q : queries) {                      // 3. k запросов: O(k log n)
           if (!std::binary_search(copy.begin(), copy.end(), q)) {
               all_found = false;
               break;
           }
       }
       return all_found;                            // Итого: O((n + k) log n)
   }

   ```

   **Источник:** [Cppreference: std::sort](https://en.cppreference.com/w/cpp/algorithm/sort)

10. Почему `unordered_map` не гарантирует `O(1)` в худшем случае?

   **Ответ:** `std::unordered_map` реализован на основе хеш-таблицы с цепочками коллизий (separate chaining). В случае неудачной хеш-функции, совпадения хешей или целенаправленной коллизионной атаки (HashDoS) все $n$ элементов попадают в одну корзину (bucket), вырождая поиск, вставку и удаление в поиск по односвязному списку со сложностью $O(n)$.
   **Пример:**

   ```cpp
   #include <unordered_map>

   struct BadHash {
       std::size_t operator()(int) const noexcept {
           return 42; // Все элементы попадают в один bucket
       }
   };

   std::unordered_map<int, int, BadHash> bad_map;
   // Вставка n элементов деградирует до O(n^2) суммарно, а поиск элемента — до O(n)

   ```

   **Источник:** [Cppreference: std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map)

11. В чём разница между online- и offline-алгоритмами?

   **Ответ:**

   - **Offline-алгоритм** требует получения всех входных данных задачи целиком до начала обработки (может предварительно отсортировать запросы, построить static index, применить алгоритм Мо).
   - **Online-алгоритм** обрабатывает поток данных последовательно порциями по мере поступления, выдавая ответ на текущий запрос немедленно без знания будущих элементов (например, потоковые алгоритмы, LRU-кэш, алгоритм Кадане).

   **Пример:**

   ```cpp
   #include <vector>
   #include <algorithm>

   // Online: вычисление скользящего максимума на лету
   struct OnlineTracker {
       int max_val = -1e9;
       void feed(int x) { max_val = std::max(max_val, x); }
       int query() const { return max_val; }
   };

   // Offline: требует наличия всего массива сразу для предподсчета/сортировки
   void offline_process(std::vector<int>& all_data) {
       std::sort(all_data.begin(), all_data.end());
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS), Chapter 16: Greedy Algorithms](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

12. Что такое инвариант цикла? Покажи на примере вставки в отсортированный массив.

   **Ответ:** Инвариант цикла — это логическое утверждение о состоянии данных программы, которое истинно перед началом первой итерации цикла, сохраняет свою истинность после каждой итерации и после завершения цикла помогает доказать математическую корректность алгоритма.
   В Insertion Sort инвариант: в начале каждой итерации внешнего цикла по индексу $i$ подмассив $A[0 \dots i-1]$ состоит из тех же исходных элементов, но уже находится в отсортированном порядке.
   **Пример:**

   ```cpp
   #include <vector>

   void insertion_sort(std::vector<int>& a) {
       int n = static_cast<int>(a.size());
       for (int i = 1; i < n; ++i) {
           // Инвариант: a[0 ... i - 1] гарантированно отсортирован
           int key = a[i];
           int j = i - 1;
           while (j >= 0 && a[j] > key) {
               a[j + 1] = a[j];
               --j;
           }
           a[j + 1] = key;
           // Инвариант сохранен: a[0 ... i] теперь также гарантированно отсортирован
       }
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS), Chapter 2: Getting Started](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

13. Как доказать корректность двухуказательного алгоритма?

   **Ответ:** Доказательство строится через инвариант отсечения пространства поиска методом математической индукции: доказывается, что на каждом шаге смещение левого или правого указателя гарантированно отбрасывает только те пары или диапазоны, которые заведомо не могут содержать искомый ответ, не исключая потенциальное оптимальное решение.
   **Пример:**

   ```cpp
   #include <vector>

   // Задача Two Sum на отсортированном массиве
   bool two_sum_sorted(const std::vector<int>& v, int target) {
       int l = 0, r = static_cast<int>(v.size()) - 1;
       while (l < r) {
           int sum = v[l] + v[r];
           if (sum == target) return true;
           if (sum < target) {
               // v[l] + v[k] < target для любого k <= r, так как массив отсортирован.
               // Следовательно, вершина l не может быть частью ответа ни с каким элементом: сдвиг l безопасен.
               ++l;
           } else {
               // v[k] + v[r] > target для любого k >= l.
               // Элемент r не может быть частью ответа: декремент r безопасен.
               --r;
           }
       }
       return false;
   }

   ```

   **Источник:** [Algorithms (Sanjoy Dasgupta, Christos Papadimitriou, Umesh Vazirani)](https://epubs.siam.org/)

14. Чем отличается строгая оценка сверху от tight bound?

   **Ответ:**

   - **Верхняя граница (Upper Bound, $O$):** функция $f(n) = O(g(n))$ означает, что $f(n)$ растет не быстрее $g(n)$ с точностью до константы ($f(n) \le c \cdot g(n)$). Оценка может быть неточной: например, алгоритм со временем $O(n)$ формально корректно назвать и $O(n^2)$, и $O(2^n)$.
   - **Точная асимптотическая оценка (Tight Bound, $\Theta$):** $f(n) = \Theta(g(n))$ означает, что $g(n)$ является одновременно оценкой и сверху ($O$), и снизу ($\Omega$), зажимая функцию в асимптотическую «вилку» ($c_1 g(n) \le f(n) \le c_2 g(n)$).

   **Пример:**

   ```cpp
   // Линейный поиск:
   // Худшее время: O(n) — это tight bound: Theta(n).
   // Утверждение "худшее время линейного поиска равно O(n^3)" математически верно,
   // но НЕ является tight bound.

   ```

   **Источник:** [Introduction to Algorithms (CLRS), Chapter 3: Asymptotic Notation](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

15. Почему важно учитывать стоимость выделения памяти и копирования объектов в C++?

   **Ответ:** Системные вызовы ядра ОС (`mmap`, `brk`) и поиск свободного блока в куче аллокатором (`malloc`/`operator new`) на порядки медленнее вычислительных инструкций процессора. Кроме того, глубокое неявное копирование тяжелых объектов внутри алгоритмов (копирование буферов строк, контейнеров) способно незаметно превратить ожидаемый алгоритм сложности $O(n)$ в $O(n^2)$ по времени и вызвать исчерпание памяти.

   **Пример:**

   ```cpp
   #include <vector>
   #include <string>

   // АНТИПАТТЕРН: неявное копирование std::string в сигнатуре превращает O(n) в O(n * L)
   void process_bad(std::vector<std::string> list) { // Копирование всего вектора при входе: O(total_bytes)
       for (auto str : list) {                       // Копирование строки на каждом шаге!
           // ...
       }
   }

   // ОПТИМАЛЬНО: передача по константной ссылке без скрытых аллокаций
   void process_good(const std::vector<std::string>& list) {
       for (const auto& str : list) {                // Нулевой оверхед на аллокации/копии
           // ...
       }
   }

   ```

   **Источник:** [C++ Core Guidelines: F.16: For "in" parameters, pass cheaply-copied types by value and others by reference to const](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rf-in)

## 2. Массивы и префиксные техники


16. Как найти сумму на подотрезке за `O(1)` после `O(n)` preprocessing?

       **Ответ:** Для этого строится массив префиксных сумм $P$, где $P[i] = \sum_{j=0}^{i-1} A[j]$ при $P[0] = 0$. Сумма на полуинтервале $[L, R)$ вычисляется за $O(1)$ по формуле $P[R] - P[L]$ (или для отрезка $[L, R]$ как $P[R + 1] - P[L]$).

       **Пример:**

   ```cpp
   #include <vector>

   class RangeSum {
       std::vector<long long> prefix;
   public:
       explicit RangeSum(const std::vector<int>& nums) : prefix(nums.size() + 1, 0) {
           for (std::size_t i = 0; i < nums.size(); ++i) {
               prefix[i + 1] = prefix[i] + nums[i];
           }
       }
       long long query(int l, int r) const { // [l, r]
           return prefix[r + 1] - prefix[l];
       }
   };
   ```

   **Источник:** [Algorithms (Robert Sedgewick, Kevin Wayne)](https://algs4.cs.princeton.edu/home/)

17. Что такое prefix sum и когда он лучше Fenwick tree?

   **Ответ:** Префиксные суммы — это статическая структура данных, вычисляющая сумму на диапазоне за строгое время $O(1)$ без накладных расходов. Массив префиксных сумм предпочтительнее дерева Фенвика (Binary Indexed Tree), когда массив неизменяем (static array), запросов на точечное или интервальное обновление нет, требуется минимальный константный множитель и тривиальная реализация.

   **Пример:**

   ```cpp
   // Prefix sum: O(1) query, O(n) update
   // Fenwick tree: O(log n) query, O(log n) update

   ```

   **Источник:** [CP-Algorithms: Prefix Sum Array](https://cp-algorithms.com/)

18. Как найти максимум суммы подмассива? Объясни алгоритм Кадане.

   **Ответ:** Алгоритм Кадане (Kadane's algorithm) находит максимальную сумму непрерывного подмассива за время $O(n)$ и $O(1)$ памяти. Идея динамического программирования: для каждого элемента $i$ локальный максимум `current_max` равен либо самому элементу $A[i]$, либо сумме $A[i] + \text{current\_max}$ (продление предыдущего подмассива). Глобальный максимум обновляется на каждом шаге.

   **Пример:**

   ```cpp
   #include <vector>
   #include <algorithm>

   int max_subarray_sum(const std::vector<int>& nums) {
       int current_max = nums[0];
       int global_max = nums[0];
       for (std::size_t i = 1; i < nums.size(); ++i) {
           current_max = std::max(nums[i], current_max + nums[i]);
           global_max = std::max(global_max, current_max);
       }
       return global_max;
   }

   ```

   **Источник:** [Programming Pearls (Jon Bentley)](https://en.wikipedia.org/wiki/Maximum_subarray_problem#Kadane's_algorithm)

19. Как найти подмассив с заданной суммой в массиве неотрицательных чисел за `O(n)`?

   **Ответ:** Используется метод скользящего окна (Sliding Window / Two Pointers). Правый указатель расширяет окно, накапливая сумму; если текущая сумма превышает целевую, левый указатель сдвигается вправо, уменьшая сумму. Поскольку все числа неотрицательны, сумма окна монотонна относительно движения указателей.

   **Пример:**

   ```cpp
   #include <vector>
   #include <utility>

   std::pair<int, int> find_subarray_sum(const std::vector<int>& arr, int target) {
       int l = 0, current = 0;
       for (int r = 0; r < static_cast<int>(arr.size()); ++r) {
           current += arr[r];
           while (current > target && l <= r) {
               current -= arr[l++];
           }
           if (current == target) return {l, r};
       }
       return {-1, -1};
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

20. Почему sliding window ломается, если в массиве есть отрицательные числа?

   **Ответ:** Метод скользящего окна опирается на монотонность: увеличение окна добавлением элемента увеличивает сумму, а сужение слева — уменьшает. При наличии отрицательных чисел монотонность нарушается: добавление элемента может уменьшить сумму, а удаление — увеличить, из-за чего жадное смещение указателей пропускает корректные интервалы (в этом случае задачу решают через префиксные суммы и `std::unordered_map`).

   **Пример:**

   ```cpp
   // При target = 5 и массиве [1, 2, -10, 5, 7] сумма ведет себя немонотонно

   ```

   **Источник:** [Competitive Programmer's Handbook (Antti Laaksonen)](https://cses.fi/book/book.pdf)

21. Как найти первый пропущенный положительный элемент за `O(n)` и `O(1)` extra space?

   **Ответ:** Используется алгоритм циклической перестановки (Cycle Sort / In-place Hash). Так как ответ лежит в диапазоне $[1, n + 1]$, массив можно использовать как собственную хеш-таблицу: переставляем каждый элемент $x \in [1, n]$ на его целевую позицию $x - 1$. После этого первый индекс $i$, где $A[i] \ne i + 1$, дает ответ $i + 1$.

   **Пример:**

   ```cpp
   #include <vector>
   #include <algorithm>

   int first_missing_positive(std::vector<int>& nums) {
       int n = static_cast<int>(nums.size());
       for (int i = 0; i < n; ++i) {
           while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
               std::swap(nums[i], nums[nums[i] - 1]);
           }
       }
       for (int i = 0; i < n; ++i) {
           if (nums[i] != i + 1) return i + 1;
       }
       return n + 1;
   }

   ```

   **Источник:** [LeetCode Problem 41: First Missing Positive](https://en.wikipedia.org/wiki/Cycle_sort)

22. Как повернуть массив вправо на `k` без дополнительной памяти?

   **Ответ:** С помощью алгоритма тройного разворота (Reverse Algorithm) за $O(n)$ времени и $O(1)$ памяти:

1. Нормализуем $k = k \pmod n$.

2. Разворачиваем весь массив: `reverse(0, n - 1)`.

3. Разворачиваем первые $k$ элементов: `reverse(0, k - 1)`.

4. Разворачиваем оставшиеся элементы: `reverse(k, n - 1)`.

   **Пример:**

   ```cpp
   #include <vector>
   #include <algorithm>

   void rotate_right(std::vector<int>& nums, int k) {
       int n = static_cast<int>(nums.size());
       k %= n;
       std::reverse(nums.begin(), nums.end());
       std::reverse(nums.begin(), nums.begin() + k);
       std::reverse(nums.begin() + k, nums.end());
   }

   ```

   **Источник:** [Programming Pearls (Jon Bentley)](https://en.wikipedia.org/wiki/Programming_Pearls)

23. Как объединить два отсортированных массива in-place, если второй массив размещён в хвосте первого?

   **Ответ:** Слияние выполняется с конца (с максимальных элементов) с помощью трех указателей: указатель на конец валидных элементов первого массива $p_1$, указатель на конец второго массива $p_2$, и указатель записи $w = m + n - 1$. Запись с конца гарантирует, что еще не обработанные элементы первого массива не будут перезаписаны.

   **Пример:**

   ```cpp
   #include <vector>

   void merge_in_place(std::vector<int>& nums1, int m, const std::vector<int>& nums2, int n) {
       int p1 = m - 1, p2 = n - 1, w = m + n - 1;
       while (p2 >= 0) {
           if (p1 >= 0 && nums1[p1] > nums2[p2]) {
               nums1[w--] = nums1[p1--];
           } else {
               nums1[w--] = nums2[p2--];
           }
       }
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS), Chapter 2](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

24. Как найти majority element? Сформулируй идею Boyer–Moore.

   **Ответ:** Алгоритм большинства Бойера — Мура (Boyer–Moore Majority Vote) находит элемент, встречающийся более $\lfloor n / 2 \rfloor$ раз, за $O(n)$ времени и $O(1)$ памяти. Идея: взаимное уничтожение различных элементов. Поддерживается кандидат и счетчик; если счетчик равен 0, текущий элемент становится кандидатом. При совпадении с кандидатом счетчик увеличивается, при несовпадении — уменьшается.

   **Пример:**

   ```cpp
   #include <vector>

   int majority_element(const std::vector<int>& nums) {
       int candidate = 0, count = 0;
       for (int x : nums) {
           if (count == 0) candidate = x;
           count += (x == candidate) ? 1 : -1;
       }
       return candidate;
   }

   ```

   **Источник:** [Boyer-Moore Majority Vote Algorithm](https://www.cs.utexas.edu/~moore/best-ideas/mjrty/)

25. Как за `O(n)` найти количество подмассивов с суммой `k`?

   **Ответ:** Используется комбинация префиксных сумм и хеш-таблицы счетчиков. Условие суммы подмассива $A[i \dots j] = k$ эквивалентно $P[j + 1] - P[i] = k$, то есть $P[i] = P[j + 1] - k$. При проходе массива поддерживается текущая префиксная сумма и к ответу прибавляется количество ранее встреченных префиксных сумм, равных $\text{current\_sum} - k$.

   **Пример:**

   ```cpp
   #include <vector>
   #include <unordered_map>

   int subarray_sum_count(const std::vector<int>& nums, int k) {
       std::unordered_map<int, int> prefix_counts;
       prefix_counts[0] = 1;
       int current_sum = 0, total = 0;
       for (int x : nums) {
           current_sum += x;
           if (auto it = prefix_counts.find(current_sum - k); it != prefix_counts.end()) {
               total += it->second;
           }
           ++prefix_counts[current_sum];
       }
       return total;
   }

   ```

   **Источник:** [Algorithms (Sedgewick & Wayne)](https://algs4.cs.princeton.edu/home/)

26. Как искать повторяющееся число в массиве чисел от `1` до `n`, не меняя массив и используя `O(1)` памяти?

   **Ответ:** Массив интерпретируется как функциональный граф связного списка с переходом $i \to A[i]$. Поскольку есть дубликат, у одной из вершин будет две входящие дуги, что порождает цикл. Задача решается алгоритмом Флойда поиска цикла (черепаха и заяц / Floyd's Tortoise and Hare) за $O(n)$ по времени и $O(1)$ памяти.

   **Пример:**

   ```cpp
   #include <vector>

   int find_duplicate(const std::vector<int>& nums) {
       int slow = nums[0], fast = nums[0];
       do {
           slow = nums[slow];
           fast = nums[nums[fast]];
       } while (slow != fast);

       slow = nums[0];
       while (slow != fast) {
           slow = nums[slow];
           fast = nums[fast];
       }
       return slow;
   }

   ```

   **Источник:** [Floyd's Cycle-Finding Algorithm](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare)

27. Как найти все дубликаты в массиве чисел от `1` до `n` за `O(n)`?

   **Ответ:** Если массив разрешено модифицировать in-place, используется знаковая маркировка ячеек. Для каждого значения $x = \vert{}A[i]\vert{}$ проверяется знак по индексу $x - 1$: если $A[x - 1] < 0$, значит число $x$ уже встречалось (добавляем в ответ); иначе инвертируем знак $A[x - 1] = -A[x - 1]$. Сложность $O(n)$ по времени и $O(1)$ дополнительной памяти.

   **Пример:**

   ```cpp
   #include <vector>
   #include <cmath>

   std::vector<int> find_duplicates(std::vector<int>& nums) {
       std::vector<int> duplicates;
       for (std::size_t i = 0; i < nums.size(); ++i) {
           int val = std::abs(nums[i]);
           if (nums[val - 1] < 0) {
               duplicates.push_back(val);
           } else {
               nums[val - 1] = -nums[val - 1];
           }
       }
       return duplicates;
   }

   ```

   **Источник:** [Competitive Programmer's Handbook](https://cses.fi/book/book.pdf)

28. Как работает difference array для range update?

   **Ответ:** Массив разностей $D$ определяется как $D[i] = A[i] - A[i - 1]$ при $D[0] = A[0]$. Чтобы прибавить значение $V$ ко всем элементам диапазона $[L, R]$, достаточно выполнить две точечные операции: $D[L] \mathrel{+}= V$ и $D[R + 1] \mathrel{-}= V$ за $O(1)$. Итоговый массив $A$ восстанавливается за один проход вычислением префиксных сумм массива $D$ за $O(n)$.

   **Пример:**

   ```cpp
   #include <vector>

   class DifferenceArray {
       std::vector<int> diff;
   public:
       explicit DifferenceArray(int n) : diff(n + 1, 0) {}
       void update(int l, int r, int val) { // [l, r]
           diff[l] += val;
           diff[r + 1] -= val;
       }
       std::vector<int> build(int n) {
           std::vector<int> res(n);
           int running = 0;
           for (int i = 0; i < n; ++i) {
               running += diff[i];
               res[i] = running;
           }
           return res;
       }
   };

   ```

   **Источник:** [CP-Algorithms: Difference Array](https://cp-algorithms.com/)

29. Как найти минимальную длину подмассива, сумма которого не меньше `S`?

   **Ответ:** Для массива положительных чисел применяется двух-указательное окно (Sliding Window): правый указатель увеличивает окно, пока $\sum \ge S$. Как только сумма достигла $S$, фиксируется текущая длина окна, и левый указатель сдвигается вправо с вычитанием $A[L]$, пытаясь минимизировать размер диапазона. Сложность: $O(n)$ времени и $O(1)$ памяти.

   **Пример:**

   ```cpp
   #include <vector>
   #include <algorithm>

   int min_sub_array_len(int s, const std::vector<int>& nums) {
       int l = 0, current = 0, min_len = 1e9;
       for (int r = 0; r < static_cast<int>(nums.size()); ++r) {
           current += nums[r];
           while (current >= s) {
               min_len = std::min(min_len, r - l + 1);
               current -= nums[l++];
           }
       }
       return (min_len == 1e9) ? 0 : min_len;
   }

   ```

   **Источник:** [Algorithms (Sedgewick & Wayne)](https://algs4.cs.princeton.edu/home/)

30. Как проверить, можно ли разбить массив на `k` подмассивов с ограничением на максимальную сумму?

   **Ответ:** Проверка выполняется за $O(n)$ жадным алгоритмом: элементы последовательно суммируются в текущий подмассив; если добавление очередного элемента превышает лимит $M$, счетчик частей увеличивается и начинается новый подмассив. Если число частей $\le k$ и каждый элемент $\le M$, разбиение возможно. Это позволяет найти минимальную допустимую максимальную сумму через бинарный поиск по ответу в диапазоне $[\max(A), \sum A]$ за $O(n \log(\sum A))$.

   **Пример:**

   ```cpp
   #include <vector>

   bool can_split(const std::vector<int>& nums, int k, long long max_sum) {
       int segments = 1;
       long long current = 0;
       for (int x : nums) {
           if (x > max_sum) return false;
           if (current + x > max_sum) {
               ++segments;
               current = x;
           } else {
               current += x;
           }
       }
       return segments <= k;
   }

   ```

   **Источник:** [Competitive Programmer's Handbook: Binary Search](https://cses.fi/book/book.pdf)

   ---

## 3. Строки


31. Как проверить, являются ли две строки анаграммами?

   **Ответ:** Для строк из ограниченного алфавита (например, ASCII) заводится массив частот символов размером 256 (или 26 для латиницы). Первый проход инкрементирует счетчики по символам первой строки, второй проход декрементирует их по символам второй строки. Если в конце все счетчики равны 0 (и длины строк равны), строки являются анаграммами. Сложность: $O(n)$ времени и $O(1)$ дополнительной памяти (алфавит фиксирован).

   **Пример:**

   ```cpp
   #include <string>
   #include <array>

   bool is_anagram(const std::string& s, const std::string& t) {
       if (s.size() != t.size()) return false;
       std::array<int, 256> freq{};
       for (char c : s) ++freq[static_cast<unsigned char>(c)];
       for (char c : t) {
           if (--freq[static_cast<unsigned char>(c)] < 0) return false;
       }
       return true;
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

32. Как найти первый неповторяющийся символ в строке?

   **Ответ:** Алгоритм выполняется в два прохода: на первом шаге строится частотный словарь символов (массив `freq[256]` за $O(n)$). На втором шаге исходная строка читается слева направо, и первый символ с `freq[c] == 1` возвращается как результат. Итоговая сложность: $O(n)$ времени и $O(1)$ дополнительной памяти.

   **Пример:**

   ```cpp
   #include <string>
   #include <array>

   int first_unique_char(const std::string& s) {
       std::array<int, 256> count{};
       for (char c : s) ++count[static_cast<unsigned char>(c)];
       for (std::size_t i = 0; i < s.size(); ++i) {
           if (count[static_cast<unsigned char>(s[i])] == 1) return static_cast<int>(i);
       }
       return -1;
   }

   ```

   **Источник:** [Programming Pearls](https://en.wikipedia.org/wiki/Programming_Pearls)

33. Как найти длину наибольшей подстроки без повторяющихся символов?

   **Ответ:** Задача решается техникой скользящего окна (Sliding Window): поддерживается массив последних увиденных позиций каждого символа `last_pos[256]`, инициализированный $-1$. При смещении правого указателя $r$, если символ встречался на позиции $\ge l$, левый указатель переносится на $\text{last\_pos}[s[r]] + 1$. Максимальная длина вычисляется как $\max(\text{len}, r - l + 1)$. Сложность: $O(n)$ по времени и $O(1)$ по памяти.

   **Пример:**

   ```cpp
   #include <string>
   #include <vector>
   #include <algorithm>

   int length_of_longest_substring(const std::string& s) {
       std::vector<int> last_pos(256, -1);
       int max_len = 0, l = 0;
       for (int r = 0; r < static_cast<int>(s.size()); ++r) {
           unsigned char c = s[r];
           if (last_pos[c] >= l) {
               l = last_pos[c] + 1;
           }
           last_pos[c] = r;
           max_len = std::max(max_len, r - l + 1);
       }
       return max_len;
   }

   ```

   **Источник:** [Algorithms (Sedgewick & Wayne)](https://algs4.cs.princeton.edu/home/)

34. Как найти все вхождения шаблона в текст наивно и какова сложность?

   **Ответ:** Наивный алгоритм проверяет каждую возможную начальную позицию $i$ в тексте $T$ длины $N$, сравнивая подстроку $T[i \dots i + M - 1]$ с шаблоном $P$ длины $M$ посимвольно. Временная сложность в худшем случае составляет $O((N - M + 1) \cdot M) = O(N \cdot M)$ (например, при поиске шаблона `aaab` в строке `aaaa...aa`), дополнительная память $O(1)$.

   **Пример:**

   ```cpp
   #include <string>
   #include <vector>

   std::vector<int> naive_search(const std::string& text, const std::string& pattern) {
       std::vector<int> matches;
       int n = text.size(), m = pattern.size();
       for (int i = 0; i <= n - m; ++i) {
           int j = 0;
           while (j < m && text[i + j] == pattern[j]) ++j;
           if (j == m) matches.push_back(i);
       }
       return matches;
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS), Chapter 32: String Matching](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

35. Что такое prefix-function в КМП и как она строится?

   **Ответ:** Префикс-функция строки $S$ длины $n$ — это массив $\pi$, где $\pi[i]$ равен длине наибольшего собственного префикса подстроки $S[0 \dots i]$, который одновременно является её суффиксом. Строится за $O(n)$ через динамическое программирование с откатами по ранее вычисленным значениям префикс-функции без повторных сравнений.

   **Пример:**

   ```cpp
   #include <string>
   #include <vector>

   std::vector<int> compute_prefix_function(const std::string& s) {
       int n = s.size();
       std::vector<int> pi(n, 0);
       for (int i = 1; i < n; ++i) {
           int j = pi[i - 1];
           while (j > 0 && s[i] != s[j]) j = pi[j - 1];
           if (s[i] == s[j]) ++j;
           pi[i] = j;
       }
       return pi;
   }

   ```

   **Источник:** [CP-Algorithms: Prefix function. Knuth-Morris-Pratt algorithm](https://cp-algorithms.com/string/prefix-func.html)

36. Чем Z-function отличается от prefix-function и где удобнее каждую применять?

   **Ответ:**

   - **Z-функция:** $Z[i]$ — длина наибольшего общего префикса всей строки $S$ и её суффикса, начинающегося с индекса $i$. Удобнее в задачах сопоставления с образцом, поиска периода строки и подсчета уникальных подстрок благодаря прямой семантике отрезков совпадения.
   - **Prefix-функция ($\pi$):** $\pi[i]$ — длина наибольшего префикса, совпадающего с суффиксом на подстроке $S[0 \dots i]$. Незаменима при потоковой обработке текста (автомат Кнута — Морриса — Пратта) в online-режиме, так как переход осуществляется за $O(1)$ по предвычисленной таблице.

   **Пример:**

   ```cpp
   #include <string>
   #include <vector>

   // Вычисление Z-функции за O(n)
   std::vector<int> z_function(const std::string& s) {
       int n = s.size();
       std::vector<int> z(n, 0);
       int l = 0, r = 0;
       for (int i = 1; i < n; ++i) {
           if (i <= r) z[i] = std::min(r - i + 1, z[i - l]);
           while (i + z[i] < n && s[z[i]] == s[i + z[i]]) ++z[i];
           if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
       }
       return z;
   }

   ```

   **Источник:** [CP-Algorithms: Z-function](https://cp-algorithms.com/string/z-function.html)

37. Как проверить, являются ли строка палиндромом, игнорируя регистр и неалфавитные символы?

   **Ответ:** Используются два указателя, двигающиеся навстречу друг другу: левый с начала, правый с конца. Пробелы, знаки препинания и спецсимволы пропускаются (`!std::isalnum`), а алфавитные символы сравниваются после приведения к нижнему регистру (`std::tolower`). Сложность: $O(n)$ времени и $O(1)$ памяти.

   **Пример:**

   ```cpp
   #include <string>
   #include <cctype>

   bool is_palindrome(const std::string& s) {
       int l = 0, r = static_cast<int>(s.size()) - 1;
       while (l < r) {
           while (l < r && !std::isalnum(static_cast<unsigned char>(s[l]))) ++l;
           while (l < r && !std::isalnum(static_cast<unsigned char>(s[r]))) --r;
           if (std::tolower(static_cast<unsigned char>(s[l])) !=
               std::tolower(static_cast<unsigned char>(s[r]))) {
               return false;
           }
           ++l; --r;
       }
       return true;
   }

   ```

   **Источник:** [Cppreference: std::isalnum](https://en.cppreference.com/w/cpp/string/byte/isalnum)

38. Как найти самую длинную палиндромную подстроку? Назови хотя бы два подхода.

   **Ответ:**

1. **Expand Around Center:** перебор всех $2n - 1$ возможных центров палиндрома (одиночные символы и промежутки между ними) с расширением влево и вправо; время $O(n^2)$, память $O(1)$.

2. **Алгоритм Манакера (Manacher's Algorithm):** модификация строки фиктивными разделителями (`#`) и использование свойств симметрии ранее найденных палиндромов аналогично Z-блокам; время строго $O(n)$, память $O(n)$.

   **Пример:**

   ```cpp
   #include <string>
   #include <string_view>

   // Подход 1: Expand Around Center O(n^2)
   std::string_view longest_palindrome_center(std::string_view s) {
       if (s.empty()) return "";
       int start = 0, max_len = 0;
       auto expand = [&](int l, int r) {
           while (l >= 0 && r < static_cast<int>(s.size()) && s[l] == s[r]) {
               --l; ++r;
           }
           if (r - l - 1 > max_len) {
               start = l + 1;
               max_len = r - l - 1;
           }
       };
       for (int i = 0; i < static_cast<int>(s.size()); ++i) {
           expand(i, i);     // Нечетная длина
           expand(i, i + 1); // Четная длина
       }
       return s.substr(start, max_len);
   }

   ```

   **Источник:** [CP-Algorithms: Manacher's Algorithm](https://cp-algorithms.com/string/manacher.html)

39. Как сгруппировать список строк по анаграммам в C++?

   **Ответ:** Для каждой строки строится канонический ключ: либо отсортированная копия строки, либо строковый хэш частот символов (count-tuple). Строки складываются в хеш-таблицу `std::unordered_map<std::string, std::vector<std::string>>`. Сложность: $O(N \cdot L \log L)$ при сортировке ключа или $O(N \cdot L)$ при использовании подсчета частот, где $N$ — число строк, $L$ — их максимальная длина.

   **Пример:**

   ```cpp
   #include <vector>
   #include <string>
   #include <unordered_map>
   #include <algorithm>

   std::vector<std::vector<std::string>> group_anagrams(const std::vector<std::string>& strs) {
       std::unordered_map<std::string, std::vector<std::string>> map;
       for (const auto& s : strs) {
           std::string key = s;
           std::sort(key.begin(), key.end());
           map[key].push_back(s);
       }
       std::vector<std::vector<std::string>> result;
       for (auto& [_, group] : map) {
           result.push_back(std::move(group));
       }
       return result;
   }

   ```

   **Источник:** [Programming Pearls](https://en.wikipedia.org/wiki/Programming_Pearls)

40. Как найти минимальное окно в строке, содержащее все символы другой строки?

   **Ответ:** Используется алгоритм Minimum Window Substring со скользящим окном: строится частотная таблица требуемых символов. Правый указатель расширяет окно; когда все уникальные символы покрыты (счетчик `formed == required`), левый указатель сдвигается вправо, сжимая окно до минимально возможного размера с сохранением покрытия. Сложность: $O(\vert{}S\vert{} + \vert{}T\vert{})$ времени и $O(\Sigma)$ памяти.

   **Пример:**

   ```cpp
   #include <string>
   #include <array>
   #include <string_view>

   std::string_view min_window(std::string_view s, std::string_view t) {
       std::array<int, 128> target_cnt{}, window_cnt{};
       for (char c : t) ++target_cnt[static_cast<unsigned char>(c)];
       int required = 0;
       for (int c : target_cnt) if (c > 0) ++required;

       int l = 0, formed = 0, min_len = 1e9, start_idx = 0;
       for (int r = 0; r < static_cast<int>(s.size()); ++r) {
           unsigned char rc = s[r];
           if (++window_cnt[rc] == target_cnt[rc]) ++formed;
           while (l <= r && formed == required) {
               if (r - l + 1 < min_len) {
                   min_len = r - l + 1;
                   start_idx = l;
               }
               unsigned char lc = s[l++];
               if (window_cnt[lc]-- == target_cnt[lc]) --formed;
           }
       }
       return (min_len == 1e9) ? "" : s.substr(start_idx, min_len);
   }

   ```

   **Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

41. Как восстановить строку после run-length encoding?

   **Ответ:** Декодирование RLE (Run-Length Decoding) парсит последовательность пар `(символ, счетчик)` или формат `count + char` и последовательно аппендит в результирующую строку указанный символ заданное число раз, используя `std::string::append(count, char)` с предварительным `reserve` для исключения реаллокаций памяти.

   **Пример:**

   ```cpp
   #include <string>
   #include <cctype>

   std::string decode_rle(const std::string& encoded) {
       std::string result;
       std::size_t i = 0;
       while (i < encoded.size()) {
           int count = 0;
           while (i < encoded.size() && std::isdigit(encoded[i])) {
               count = count * 10 + (encoded[i++] - '0');
           }
           char c = encoded[i++];
           result.append(count, c);
       }
       return result;
   }

   ```

   **Источник:** [Wikipedia: Run-length encoding](https://en.wikipedia.org/wiki/Run-length_encoding)

42. Как посчитать количество различных подстрок? Какие структуры данных для этого нужны?

   **Ответ:** Количество различных подстрок эффективно вычисляется за $O(n)$ или $O(n \log n)$ с помощью суффиксных структур данных:

   - **Суффиксный автомат (Suffix Automaton):** число различных подстрок равно сумме $\sum (\text{len}[v] - \text{len}[\text{link}[v]])$ по всем вершинам автомата за время $O(n)$.
   - **Суффиксный массив (Suffix Array) + LCP:** сумма длин всех суффиксов за вычетом суммы значений массива наибольших общих префиксов: $\frac{n(n + 1)}{2} - \sum_{i=1}^{n-1} \text{LCP}[i]$ за время $O(n \log n)$.

   **Пример:**

   ```cpp
   // Количество подстрок через Suffix Array и LCP:
   // Total = n * (n + 1) / 2 - std::accumulate(lcp.begin(), lcp.end(), 0LL);

   ```

   **Источник:** [CP-Algorithms: Number of different substrings](https://cp-algorithms.com/string/string-automaton.html#number-of-different-substrings)

43. Как работает rolling hash и какие у него риски?

   **Ответ:** Rolling hash (полиномиальное кольцевое хеширование) вычисляет хеш подстроки как полином $H(S) = \sum S[i] \cdot p^{n - 1 - i} \pmod M$. При сдвиге окна на 1 символ новый хеш пересчитывается за $O(1)$: $H_{\text{new}} = ((H_{\text{old}} - S_{\text{old}} \cdot p^{m - 1}) \cdot p + S_{\text{new}}) \pmod M$. Риски: коллизии из-за принципа Дирихле и уязвимость перед целенаправленными анти-хеш тестами (HashDoS); для надежности применяют двойной хеш по разным модулям ($M_1, M_2$) и рандомизированное основание $p$.

   **Пример:**

   ```cpp
   #include <string>

   struct SimpleRollingHash {
       long long hash = 0, p = 31, mod = 1e9 + 7, power = 1;
       void init(const std::string& s, int m) {
           for (int i = 0; i < m - 1; ++i) power = (power * p) % mod;
           for (int i = 0; i < m; ++i) hash = (hash * p + s[i]) % mod;
       }
       void roll(char out_char, char in_char) {
           hash = (hash - out_char * power) % mod;
           if (hash < 0) hash += mod;
           hash = (hash * p + in_char) % mod;
       }
   };

   ```

   **Источник:** [CP-Algorithms: String Hashing](https://cp-algorithms.com/string/string-hashing.html)

44. Как искать подстроку в потоке символов online?

   **Ответ:** Online-поиск шаблона в потоке символов реализуется конечным детерминированным автоматом Кнута — Морриса — Пратта (KMP DFA) или бором с суффиксными ссылками Ахо — Корасик (Aho — Corasick) при поиске нескольких шаблонов. Каждый поступающий символ меняет текущее состояние автомата за $O(1)$ амортизированно, без необходимости хранить и возвращаться назад по прочитанному потоку.

   **Пример:**

   ```cpp
   #include <vector>
   #include <string>

   class StreamKMPMatcher {
       std::string pattern;
       std::vector<int> pi;
       int state = 0;
   public:
       explicit StreamKMPMatcher(std::string p) : pattern(std::move(p)), pi(pattern.size(), 0) {
           for (std::size_t i = 1; i < pattern.size(); ++i) {
               int j = pi[i - 1];
               while (j > 0 && pattern[i] != pattern[j]) j = pi[j - 1];
               if (pattern[i] == pattern[j]) ++j;
               pi[i] = j;
           }
       }
       bool consume(char c) {
           while (state > 0 && c != pattern[state]) state = pi[state - 1];
           if (c == pattern[state]) ++state;
           if (state == static_cast<int>(pattern.size())) {
               state = pi[state - 1];
               return true; // Найден шаблон
           }
           return false;
       }
   };

   ```

   **Источник:** [Algorithms (Sedgewick & Wayne), Chapter 5.3: Substring Search](https://algs4.cs.princeton.edu/53substring/)

45. Как в C++ эффективно конкатенировать много строк без квадратичного времени?

   **Ответ:** Наивная конкатенация `res += s` в цикле без предварительного выделения памяти может приводить к постоянным перевыделениям буфера и копированию накопленного префикса, порождая сложность $O(N^2)$. Для эффективного объединения за линейное время $O(\text{Total Length})$:

1. Заранее подсчитывают суммарную длину всех строк и вызывают `res.reserve(total_len)`.

2. Используют `std::string::append` для последовательной записи.

3. Для разнородных типов данных применяют `std::ostringstream` или `std::format` (C++20).

   **Пример:**

   ```cpp
   #include <string>
   #include <vector>
   #include <numeric>

   std::string concat_strings(const std::vector<std::string>& list) {
       std::size_t total_size = std::accumulate(list.begin(), list.end(), std::size_t{0},
           [](std::size_t sum, const std::string& s) { return sum + s.size(); });

       std::string result;
       result.reserve(total_size); // O(Total Length), ноль лишних реаллокаций кучи
       for (const auto& s : list) {
           result.append(s);
       }
       return result;
   }

   ```

   **Источник:** [Cppreference: std::basic_string::reserve](https://en.cppreference.com/w/cpp/string/basic_string/reserve)

## 4. Связные списки


46. Как развернуть односвязный список итеративно и рекурсивно?

   **Ответ:** Итеративно список разворачивается перенаправлением указателей `next` на предыдущий узел (`prev`) в цикле за время $O(n)$ и память $O(1)$. Рекурсивно — спуском до конца списка и последующим разворотом связей при выходе из стека вызовов за время $O(n)$ и память $O(n)$ из-за стека.
   **Пример:**
   ```cpp
   struct ListNode {
       int val;
       ListNode* next;
   };

   // Итеративный подход:
   ListNode* reverse_iterative(ListNode* head) {
       ListNode* prev = nullptr;
       ListNode* curr = head;
       while (curr) {
           ListNode* next_temp = curr->next;
           curr->next = prev;
           prev = curr;
           curr = next_temp;
       }
       return prev;
   }

   ```


   **Типичная ошибка:** Потеря указателя на следующий элемент (`curr->next`) до того, как связь перенаправлена на `prev`, что приводит к утечке остальной части списка.
   **Источник:** [LeetCode: Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)

47. Как найти середину списка за один проход?

   **Ответ:** Используется метод двух указателей («черепаха и заяц»): медленный указатель (`slow`) делает один шаг, а быстрый (`fast`) — два шага за итерацию. Когда быстрый доходит до конца, медленный оказывается ровно в середине.
   **Пример:**
   ```cpp
   ListNode* find_middle(ListNode* head) {
       ListNode* slow = head;
       ListNode* fast = head;
       while (fast && fast->next) {
           slow = slow->next;
           fast = fast->next->next;
       }
       return slow;
   }

   ```


   **Типичная ошибка:** Пропуск проверки `fast->next != nullptr` перед вызовом `fast->next->next`, что приводит к разыменованию `nullptr` на списках четной длины.
   **Источник:** [LeetCode: Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)

48. Как определить наличие цикла в списке с помощью алгоритма Флойда?

   **Ответ:** Алгоритм Флойда («черепаха и заяц») перемещает указатель `slow` на 1 узел, а `fast` на 2. Если цикла нет, `fast` упирается в `nullptr`; если цикл есть, `fast` обязательно догонит `slow` внутри цикла за $O(n)$ времени и $O(1)$ дополнительной памяти.
   **Пример:**
   ```cpp
   bool has_cycle(ListNode* head) {
       ListNode* slow = head;
       ListNode* fast = head;
       while (fast && fast->next) {
           slow = slow->next;
           fast = fast->next->next;
           if (slow == fast) return true;
       }
       return false;
   }

   ```


   **Типичная ошибка:** Сравнение значений узлов (`slow->val == fast->val`) вместо сравнения самих указателей на память (`slow == fast`).
   **Источник:** [Cppreference: std::forward_list](https://en.cppreference.com/w/cpp/container/forward_list)

49. Как найти точку входа в цикл в односвязном списке?

   **Ответ:** После обнаружения встречи медленного и быстрого указателей по алгоритму Флойда, один указатель сбрасывается в `head`. Далее оба указателя двигаются с одинаковой скоростью (по 1 шагу); точка их следующей встречи математически совпадает с началом цикла.
   **Пример:**
   ```cpp
   ListNode* detect_cycle_entry(ListNode* head) {
       ListNode* slow = head;
       ListNode* fast = head;
       while (fast && fast->next) {
           slow = slow->next;
           fast = fast->next->next;
           if (slow == fast) {
               ListNode* ptr = head;
               while (ptr != slow) {
                   ptr = ptr->next;
                   slow = slow->next;
               }
               return ptr; // Точка входа
           }
       }
       return nullptr;
   }

   ```


   **Типичная ошибка:** Попытка посчитать точную длину списка до нахождения точки встречи, что приводит к зацикливанию.
   **Источник:** [Floyd's Cycle-Finding Algorithm (Wikipedia)](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_Tortoise_and_Hare)

50. Как слить два предварительно отсортированных списка в один?

   **Ответ:** Используется фиктивный головной узел (*dummy node*). Указатель текущей позиции привязывается к меньшему из элементов двух списков, продвигая соответствующий указатель вперед, пока один из списков не закончится, после чего остаток второго списка присоединяется в конец за $O(1)$.
   **Пример:**
   ```cpp
   ListNode* merge_two_lists(ListNode* l1, ListNode* l2) {
       ListNode dummy{0, nullptr};
       ListNode* tail = &dummy;
       while (l1 && l2) {
           if (l1->val < l2->val) {
               tail->next = l1;
               l1 = l1->next;
           } else {
               tail->next = l2;
               l2 = l2->next;
           }
           tail = tail->next;
       }
       tail->next = l1 ? l1 : l2;
       return dummy.next;
   }

   ```


   **Типичная ошибка:** Попытка копировать узлы и их данные вместо простой перелинковки существующих указателей `next`.
   **Источник:** [LeetCode: Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)

51. Как удалить `n`-й узел с конца списка за один проход?

   **Ответ:** Запускаются два указателя с фиктивного узла. Первый (`fast`) сдвигается вперед на $n + 1$ шагов. Затем оба указателя двигаются синхронно, пока `fast` не дойдет до конца; в этот момент `slow` останавливается строго перед удаляемым элементом.
   **Пример:**
   ```cpp
   ListNode* remove_nth_from_end(ListNode* head, int n) {
       ListNode dummy{0, head};
       ListNode* fast = &dummy;
       ListNode* slow = &dummy;
       for (int i = 0; i <= n; ++i) fast = fast->next;
       while (fast) {
           fast = fast->next;
           slow = slow->next;
       }
       ListNode* to_delete = slow->next;
       slow->next = slow->next->next;
       delete to_delete;
       return dummy.next;
   }

   ```


   **Типичная ошибка:** Отсутствие фиктивного узла (*dummy node*), из-за чего удаление первого элемента списка (`head`) требует отдельной ветки кода.
   **Источник:** [LeetCode: Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

52. Как проверить, является ли список палиндромом, за время $O(n)$ и с дополнительной памятью $O(1)$?

   **Ответ:** 1) Найти середину списка быстрым и медленным указателями; 2) Развернуть вторую половину списка на месте; 3) Поэлементно сравнить значения первой и развернутой второй половин; 4) (Опционально) восстановить список обратно.
   **Пример:**
   ```cpp
   bool is_palindrome(ListNode* head) {
       if (!head || !head->next) return true;
       // Находим середину
       ListNode* slow = head;
       ListNode* fast = head;
       while (fast->next && fast->next->next) {
           slow = slow->next;
           fast = fast->next->next;
       }
       // Разворачиваем вторую половину
       ListNode* prev = nullptr;
       ListNode* curr = slow->next;
       while (curr) {
           ListNode* nxt = curr->next;
           curr->next = prev;
           prev = curr;
           curr = nxt;
       }
       // Сравниваем половины
       ListNode* p1 = head;
       ListNode* p2 = prev;
       while (p2) {
           if (p1->val != p2->val) return false;
           p1 = p1->next;
           p2 = p2->next;
       }
       return true;
   }

   ```


   **Типичная ошибка:** Выделение вектора или стека для сохранения всех значений, что увеличивает затраты по памяти до $O(n)$.
   **Источник:** [LeetCode: Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)

53. Как развернуть узлы списка группами по `k` элементов?

   **Ответ:** Перед разворотом проверяется наличие хотя бы $k$ оставшихся узлов. Если они есть, группа из $k$ элементов разворачивается стандартным итеративным способом, а указатели граничных узлов связываются с результатом обработки следующей группы.
   **Пример:**
   ```cpp
   ListNode* reverse_k_group(ListNode* head, int k) {
       ListNode* curr = head;
       int count = 0;
       while (curr && count < k) {
           curr = curr->next;
           count++;
       }
       if (count == k) {
           ListNode* reversed_head = reverse_k_group(curr, k);
           while (count > 0) {
               ListNode* next_node = head->next;
               head->next = reversed_head;
               reversed_head = head;
               head = next_node;
               count--;
           }
           head = reversed_head;
       }
       return head;
   }

   ```


   **Типичная ошибка:** Разворот неполной группы в конце списка вопреки условию задачи (хвост менее $k$ элементов должен оставаться в исходном порядке).
   **Источник:** [LeetCode: Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/)

54. Как выполнить глубокое копирование списка со случайными указателями (`random pointer`) за $O(1)$ вспомогательной памяти?

   **Ответ:** 1) Вставить копию каждого узла непосредственно за оригиналом: `A -> A' -> B -> B'`; 2) Проставить `random`-указатели копий: `curr->next->random = curr->random ? curr->random->next : nullptr`; 3) Расцепить оригинальный и скопированный списки.
   **Пример:**
   ```cpp
   struct Node {
       int val;
       Node* next;
       Node* random;
   };

   Node* copy_random_list(Node* head) {
       if (!head) return nullptr;
       // 1. Дублирование
       for (Node* curr = head; curr;) {
           Node* copy = new Node{curr->val, curr->next, nullptr};
           curr->next = copy;
           curr = copy->next;
       }
       // 2. Связывание random
       for (Node* curr = head; curr; curr = curr->next->next) {
           if (curr->random) curr->next->random = curr->random->next;
       }
       // 3. Расцепление
       Node* dummy = new Node{0, nullptr, nullptr};
       Node* copy_curr = dummy;
       for (Node* curr = head; curr; curr = curr->next) {
           copy_curr->next = curr->next;
           copy_curr = copy_curr->next;
           curr->next = curr->next->next;
       }
       Node* res = dummy->next;
       delete dummy;
       return res;
   }

   ```


   **Типичная ошибка:** Использование хэш-таблицы `std::unordered_map<Node*, Node*>`, что требует $O(n)$ дополнительной памяти вместо $O(1)$.
   **Источник:** [LeetCode: Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/)

55. Как отсортировать связный список за время $O(n \log n)$ и с константной памятью?

   **Ответ:** Используется восходящая сортировка слиянием (*bottom-up merge sort*). Список итеративно разбивается на подмассивы длины $1, 2, 4, 8, \dots$, которые попарно сливаются. Это исключает накладные расходы стека рекурсии, сохраняя память на уровне $O(1)$.
   **Пример:** Для нисходящего подхода (с $O(\log n)$ памятью на стек) список делится пополам двумя указателями, сортируется рекурсивно и объединяется стандартным слиянием двух отсортированных списков.
   **Типичная ошибка:** Применение сортировок выбором или вставками, работающих за худшее время $O(n^2)$.
   **Источник:** [LeetCode: Sort List](https://leetcode.com/problems/sort-list/)

56. Почему быстрая сортировка (quicksort) плохо подходит для связных списков, а сортировка слиянием (mergesort) — отлично?

   **Ответ:** Quicksort требует эффективного случайного доступа по индексам для выбора медианного опорного элемента и двунаправленного перемещения указателей при разбиении. Mergesort выполняет строго последовательный доступ и сливает подсписки за $O(1)$ дополнительной памяти простой перестановкой указателей (в отличие от массивов, где слияние требует $O(n)$ буфера).
   **Пример:** `std::list::sort` в стандартной библиотеке C++ всегда реализуется на базе сортировки слиянием.
   **Типичная ошибка:** Попытка обращения к $k$-му элементу списка по индексу в цикле разбиения quicksort, ухудшающая асимптотику до $O(n^2)$.
   **Источник:** [Cppreference: std::list::sort](https://en.cppreference.com/w/cpp/container/list/sort)

57. Как удалить все дубликаты из отсортированного связного списка?

   **Ответ:** Список обходится одним указателем: если значение текущего узла совпадает со следующим (`curr->val == curr->next->val`), узел `curr->next` извлекается, удаляется из памяти через `delete`, а связь перенаправляется в обход.
   **Пример:**
   ```cpp
   ListNode* delete_duplicates(ListNode* head) {
       ListNode* curr = head;
       while (curr && curr->next) {
           if (curr->val == curr->next->val) {
               ListNode* dup = curr->next;
               curr->next = curr->next->next;
               delete dup;
           } else {
               curr = curr->next;
           }
       }
       return head;
   }

   ```


   **Типичная ошибка:** Сдвиг указателя `curr = curr->next` на каждой итерации, что пропускает третий и последующие дубликаты цепочки (например, `1 -> 1 -> 1`).
   **Источник:** [LeetCode: Remove Duplicates from Sorted List](https://leetcode.com/problems/remove-duplicates-from-sorted-list/)

58. Как найти первый общий узел при пересечении двух списков без выделения памяти?

   **Ответ:** Два указателя стартуют из начал обоих списков. Когда указатель доходит до конца своего списка, он переставляется в начало другого списка. Они проходят суммарно равное расстояние $A + B$ и встречаются ровно в узле пересечения (либо одновременно упираются в `nullptr`).
   **Пример:**
   ```cpp
   ListNode* get_intersection_node(ListNode* headA, ListNode* headB) {
       ListNode* pA = headA;
       ListNode* pB = headB;
       while (pA != pB) {
           pA = pA ? pA->next : headB;
           pB = pB ? pB->next : headA;
       }
       return pA;
   }

   ```


   **Типичная ошибка:** Сохранение адресов первого списка в `std::unordered_set<ListNode*>`, что требует $O(n)$ дополнительной памяти.
   **Источник:** [LeetCode: Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/)

59. Какие ошибки владения памятью наиболее типичны при ручной реализации связного списка на C++?

   **Ответ:** 1) Утечка памяти при перезаписи указателя `head` без предварительного удаления узлов; 2) Разыменование висячего указателя (*use-after-free*) при удалении узла до чтения `node->next`; 3) Переполнение стека (*stack overflow*) при рекурсивном удалении длинных цепочек в деструкторе; 4) Утечка или *double free* из-за отсутствия конструктора копирования (нарушение Rule of Three/Five).
   **Пример:**
   ```cpp
   // Опасный деструктор с риском переполнения стека:
   // ~Node() { delete next; } // Рекурсия на 1 000 000 узлов вызовет Stack Overflow!

   ```


   **Типичная ошибка:** Реализация деструктора списка через рекурсивный вызов `delete head->next;` вместо плоского итеративного цикла.
   **Источник:** [C++ Core Guidelines: R.11](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r11-avoid-calling-new-and-delete-explicitly)

60. В каких случаях следует предпочесть `std::list`, а когда `std::vector`?

   **Ответ:** `std::vector` предпочтителен практически всегда благодаря кэш-локальности и отсутствию фрагментации памяти. `std::list` оправдан только тогда, когда критически важна абсолютная стабильность итераторов и ссылок при любых модификациях, либо при необходимости перемещать узлы между списками за $O(1)$ методом `.splice()`.
   **Пример:** `std::list` используется в реализации LRU-кэша для перемещения элементов в начало списка без инвалидации указателей из хэш-таблицы.
   **Типичная ошибка:** Выбор `std::list` в расчете на «быструю вставку в середину», забывая, что поиск места вставки по списку требует времени $O(n)$ и вызывает постоянные промахи процессорного кэша.
   **Источник:** [Bjarne Stroustrup: Why you should avoid Linked Lists](https://www.youtube.com/watch?v=YQs6IC-vgmo)

   ---

## 5. Stack / Queue / Deque


61. Как реализовать стек с поддержкой операции `getMin()` за время $O(1)$?

   **Ответ:** С помощью вспомогательного стека минимумов (или сохранения пар `(значение, текущий минимум)` в основном стеке). При добавлении нового элемента во вспомогательный стек кладется значение $\min(\text{val}, \text{min\_stack.top()})$.
   **Пример:**
   ```cpp
   class MinStack {
       std::stack<int> main_st_;
       std::stack<int> min_st_;
   public:
       void push(int val) {
           main_st_.push(val);
           if (min_st_.empty() || val <= min_st_.top()) {
               min_st_.push(val);
           }
       }
       void pop() {
           if (main_st_.top() == min_st_.top()) min_st_.pop();
           main_st_.pop();
       }
       int top() const { return main_st_.top(); }
       int getMin() const { return min_st_.top(); }
   };

   ```


   **Типичная ошибка:** Линейный поиск минимума перебором всех элементов стека за $O(n)$ при каждом вызове `getMin()`.
   **Источник:** [LeetCode: Min Stack](https://leetcode.com/problems/min-stack/)

62. Как проверить корректность скобочной последовательности?

   **Ответ:** При встрече открывающей скобки она кладется в стек. При встрече закрывающей — проверяется, что стек не пуст и вершина стека содержит соответствующую открывающую пару; в конце проверки стек обязан остаться пустым.
   **Пример:**
   ```cpp
   bool is_valid_brackets(std::string_view s) {
       std::stack<char> st;
       for (char c : s) {
           if (c == '(' || c == '{' || c == '[') {
               st.push(c);
           } else {
               if (st.empty()) return false;
               char top = st.top();
               st.pop();
               if ((c == ')' && top != '(') ||
                   (c == '}' && top != '{') ||
                   (c == ']' && top != '[')) return false;
           }
       }
       return st.empty();
   }

   ```


   **Типичная ошибка:** Вызов `st.top()` на пустом стеке при чтении первой же закрывающей скобки, приводящий к сбою программы (*UB*).
   **Источник:** [LeetCode: Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)

63. Как вычислить значение выражения в обратной польской записи (RPN)?

   **Ответ:** Токены обходятся слева направо. Если токен — число, оно кладется в стек. Если оператор — из стека извлекаются два верхних операнда, над ними выполняется операция (с соблюдением порядка: `второй_извлеченный [op] первый_извлеченный`), а результат кладется обратно в стек.
   **Пример:**
   ```cpp
   int eval_rpn(const std::vector<std::string>& tokens) {
       std::stack<int> st;
       for (const auto& t : tokens) {
           if (t == "+" || t == "-" || t == "*" || t == "/") {
               int b = st.top(); st.pop();
               int a = st.top(); st.pop();
               if (t == "+") st.push(a + b);
               else if (t == "-") st.push(a - b);
               else if (t == "*") st.push(a * b);
               else if (t == "/") st.push(a / b);
           } else {
               st.push(std::stoi(t));
           }
       }
       return st.top();
   }

   ```


   **Типичная ошибка:** Нарушение порядка аргументов для некоммутативных операций (вычисление `b - a` или `b / a` вместо `a - b` и `a / b`).
   **Источник:** [LeetCode: Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)

64. Как с помощью стека найти следующий больший элемент (*Next Greater Element*) для каждого элемента массива?

   **Ответ:** Используется монотонный убывающий стек, хранящий индексы. При обходе массива слева направо, пока текущий элемент строго больше элемента по индексу на вершине стека, этот индекс извлекается, а текущее число записывается ответом для него.
   **Пример:**
   ```cpp
   std::vector<int> next_greater_elements(const std::vector<int>& nums) {
       std::vector<int> res(nums.size(), -1);
       std::stack<int> st; // Хранит индексы
       for (int i = 0; i < nums.size(); ++i) {
           while (!st.empty() && nums[i] > nums[st.top()]) {
               res[st.top()] = nums[i];
               st.pop();
           }
           st.push(i);
       }
       return res;
   }

   ```


   **Типичная ошибка:** Хранение в стеке самих значений вместо индексов, что делает невозможным заполнение массива ответов при наличии одинаковых чисел.
   **Источник:** [LeetCode: Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)

65. Как найти площадь максимального прямоугольника в гистограмме?

   **Ответ:** С помощью монотонно возрастающего стека индексов. Когда текущий столбец оказывается ниже столбца на вершине стека, вершина извлекается как высота прямоугольника, а ширина вычисляется как расстояние между текущим индексом и новым элементом вершины стека.
   **Пример:**
   ```cpp
   int largest_rectangle_area(std::vector<int>& heights) {
       heights.push_back(0); // Ограничитель для выталкивания всех элементов
       std::stack<int> st;
       int max_area = 0;
       for (int i = 0; i < heights.size(); ++i) {
           while (!st.empty() && heights[i] < heights[st.top()]) {
               int h = heights[st.top()];
               st.pop();
               int width = st.empty() ? i : (i - st.top() - 1);
               max_area = std::max(max_area, h * width);
           }
           st.push(i);
       }
       return max_area;
   }

   ```


   **Типичная ошибка:** Неверный расчет ширины основания: использование `i - st.top()` вместо формулы `i - st.top() - 1` после извлечения текущей высоты.
   **Источник:** [LeetCode: Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

66. Как с помощью стека решить задачу об удержании дождевой воды (*Trapping Rain Water*)?

   **Ответ:** Стек хранит индексы столбцов с убывающей высотой. Когда встречается столбец выше вершины, формируется «впадина»: извлекается дно впадины, а накопленный слой воды определяется разностью высот левой границы (новая вершина стека) и правой границы (текущий индекс), умноженной на расстояние между ними.
   **Пример:**
   ```cpp
   int trap(const std::vector<int>& height) {
       std::stack<int> st;
       int water = 0;
       for (int i = 0; i < height.size(); ++i) {
           while (!st.empty() && height[i] > height[st.top()]) {
               int mid = st.top();
               st.pop();
               if (st.empty()) break;
               int left = st.top();
               int distance = i - left - 1;
               int bounded_h = std::min(height[left], height[i]) - height[mid];
               water += distance * bounded_h;
           }
           st.push(i);
       }
       return water;
   }

   ```


   **Типичная ошибка:** Забытая проверка `if (st.empty()) break;` после извлечения середины: если левой границы нет, вода удерживаться не может.
   **Источник:** [LeetCode: Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)

67. Как реализовать очередь с помощью двух стеков?

   **Ответ:** Используются стек добавления (`in_stack`) и стек извлечения (`out_stack`). Операция `push` всегда кладет элемент в `in_stack`. Операции `pop`/`front` читают из `out_stack`; если он пуст, все элементы из `in_stack` последовательно перекладываются в `out_stack`, разворачивая порядок элементов за амортизированное время $O(1)$.
   **Пример:**
   ```cpp
   class MyQueue {
       std::stack<int> in_, out_;
       void transfer() {
           if (out_.empty()) {
               while (!in_.empty()) {
                   out_.push(in_.top());
                   in_.pop();
               }
           }
       }
   public:
       void push(int x) { in_.push(x); }
       int pop() {
           transfer();
           int val = out_.top();
           out_.pop();
           return val;
       }
       int peek() { transfer(); return out_.top(); }
       bool empty() { return in_.empty() && out_.empty(); }
   };

   ```


   **Типичная ошибка:** Перекладывание элементов обратно из `out_` в `in_` после каждого вызова `pop`, что разрушает амортизированную сложность $O(1)$ до квадратичной $O(n)$.
   **Источник:** [LeetCode: Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)

68. Как реализовать стек с помощью двух очередей?

   **Ответ:** При добавлении нового элемента в пустую вспомогательную очередь `q2`, все элементы из основной очереди `q1` последовательно перекладываются следом за ним. Затем очереди меняются местами (`std::swap(q1, q2)`), благодаря чему вершина стека всегда находится в голове `q1`.
   **Пример:**
   ```cpp
   class MyStack {
       std::queue<int> q1_, q2_;
   public:
       void push(int x) {
           q2_.push(x);
           while (!q1_.empty()) {
               q2_.push(q1_.front());
               q1_.pop();
           }
           std::swap(q1_, q2_);
       }
       int pop() {
           int val = q1_.front();
           q1_.pop();
           return val;
       }
       int top() const { return q1_.front(); }
       bool empty() const { return q1_.empty(); }
   };

   ```


   **Типичная ошибка:** Попытка использовать `std::queue` с извлечением из конца очереди, что невозможно без полного обхода контейнера.
   **Источник:** [LeetCode: Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/)

69. Что такое монотонная очередь (monotonic queue) и где она применяется?

   **Ответ:** Это двухсторонняя очередь (*deque*), элементы которой поддерживаются строго упорядоченными (по возрастанию или убыванию). Она применяется в задачах скользящего окна (*sliding window*) и оптимизации динамического программирования для мгновенного нахождения экстремума на отрезке за амортизированное время $O(1)$.
   **Пример:** Нахождение минимума/максимума в потоке котировок в пределах последних $N$ секунд.
   **Типичная ошибка:** Хранение в монотонной очереди значений без индексов, что делает невозможной проверку выхода старых элементов за пределы окна.
   **Источник:** [CP-Algorithms: Minimum stack / Minimum queue](https://cp-algorithms.com/data_structures/stack_queue_modification.html)

70. Как найти максимум в каждом скользящем окне размера `k` за линейное время $O(n)$?

   **Ответ:** С помощью двухсторонней очереди `std::deque`, хранящей индексы. На каждом шаге: 1) Удаляются индексы, вышедшие за левую границу окна; 2) С хвоста деки выталкиваются все индексы, элементы которых меньше текущего; 3) Текущий индекс добавляется в хвост; 4) В голове деки всегда находится индекс текущего максимума.
   **Пример:**
   ```cpp
   std::vector<int> max_sliding_window(const std::vector<int>& nums, int k) {
       std::deque<int> dq;
       std::vector<int> res;
       for (int i = 0; i < nums.size(); ++i) {
           if (!dq.empty() && dq.front() == i - k) dq.pop_front();
           while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
           dq.push_back(i);
           if (i >= k - 1) res.push_back(nums[dq.front()]);
       }
       return res;
   }

   ```


   **Типичная ошибка:** Использование `std::multiset` или `std::priority_queue`, что дает асимптотику $O(n \log k)$ вместо гарантированного линейного времени $O(n)$.
   **Источник:** [LeetCode: Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

71. Чем `std::deque` отличается от `std::queue` и `std::vector` по асимптотике и структуре памяти?

   **Ответ:** `std::vector` хранит данные в одном непрерывном буфере; `std::deque` — это массив указателей на фиксированные фрагменты памяти (*chunks*), обеспечивающий вставку и удаление за $O(1)$ с обоих концов без переаллокации всей емкости; `std::queue` — не контейнер, а адаптер интерфейса над `std::deque` по умолчанию.
   **Пример:**
   ```cpp
   std::deque<int> d;
   d.push_front(1); // O(1) без перемещения остальных элементов
   d.push_back(2);  // O(1)

   ```


   **Типичная ошибка:** Ожидание, что данные в `std::deque` лежат в непрерывном массиве (нельзя безопасно передать `&d[0]` в C-API функцию, ожидающую сырой массив).
   **Источник:** [Cppreference: std::deque](https://en.cppreference.com/w/cpp/container/deque)

72. Как смоделировать LRU-кэш, комбинируя хэш-таблицу и связный список?

   **Ответ:** Двусвязный список `std::list` хранит пары `(ключ, значение)` в порядке свежести использования (голова — самые свежие). Хэш-таблица `std::unordered_map` сопоставляет ключ с итератором соответствующего узла списка, что позволяет находить, удалять и перемещать узлы в голову за время $O(1)$.
   **Пример:**
   ```cpp
   class LRUCache {
       int cap_;
       std::list<std::pair<int, int>> items_;
       std::unordered_map<int, std::list<std::pair<int, int>>::iterator> map_;
   public:
       LRUCache(int capacity) : cap_(capacity) {}
       int get(int key) {
           auto it = map_.find(key);
           if (it == map_.end()) return -1;
           items_.splice(items_.begin(), items_, it->second); // Перемещаем узел в начало
           return it->second->second;
       }
   };

   ```


   **Типичная ошибка:** Попытка удалять элементы из середины вектора за $O(n)$ вместо использования итераторов двусвязного списка со связыванием через `.splice()`.
   **Источник:** [LeetCode: LRU Cache](https://leetcode.com/problems/lru-cache/)

73. Как проверить, может ли последовательность быть результатом pop-операций стека при заданной последовательности push?

   **Ответ:** Симулируется процесс работы стека: элементы входного массива последовательно добавляются в стек, и после каждого добавления выполняется цикл извлечения, пока вершина стека совпадает с текущим элементом последовательности извлечения.
   **Пример:**
   ```cpp
   bool validate_stack_sequences(const std::vector<int>& pushed, const std::vector<int>& popped) {
       std::stack<int> st;
       int j = 0;
       for (int x : pushed) {
           st.push(x);
           while (!st.empty() && j < popped.size() && st.top() == popped[j]) {
               st.pop();
               j++;
           }
       }
       return j == popped.size();
   }

   ```


   **Типичная ошибка:** Выход за границы массива `popped` при проверке условия совпадения с вершиной стека.
   **Источник:** [LeetCode: Validate Stack Sequences](https://leetcode.com/problems/validate-stack-sequences/)

74. Как найти ближайший меньший элемент слева для каждого индекса массива?

   **Ответ:** Используется монотонно возрастающий стек. Для текущего элемента из стека выталкиваются все элементы, большие или равные ему. Если стек остался не пуст, его вершина — ближайший меньший элемент слева; затем текущий элемент помещается в стек.
   **Пример:**
   ```cpp
   std::vector<int> prev_smaller_element(const std::vector<int>& arr) {
       std::vector<int> res(arr.size(), -1);
       std::stack<int> st;
       for (int i = 0; i < arr.size(); ++i) {
           while (!st.empty() && st.top() >= arr[i]) {
               st.pop();
           }
           if (!st.empty()) res[i] = st.top();
           st.push(arr[i]);
       }
       return res;
   }

   ```


   **Типичная ошибка:** Использование строгого условия `<` вместо `<=` при очистке стека, что приводит к некорректным результатам при наличии дублирующихся значений.
   **Источник:** [GeeksforGeeks: Find the nearest smaller numbers on left side in an array](https://www.geeksforgeeks.org/find-the-nearest-smaller-numbers-on-left-side-in-an-array/)

75. Что такое монотонный стек (monotonic stack) и как доказать его строго линейную сложность $O(n)$?

   **Ответ:** Монотонный стек — структура данных, поддерживающая инвариант строгой монотонности (возрастания или убывания) значений. Линейная сложность доказывается амортизационным анализом: каждый элемент массива добавляется в стек ровно 1 раз и выталкивается из него не более 1 раза за все время работы алгоритма (суммарно максимум $2n$ операций).
   **Пример:**
   ```cpp
   // Любой цикл вида:
   for (int i = 0; i < n; ++i) {
       while (!st.empty() && st.top() > arr[i]) st.pop(); // Суммарно выполнится не более n раз!
       st.push(arr[i]);                                   // Ровно n раз
   }

   ```


   **Типичная ошибка:** Ошибочная оценка сложности алгоритма как $O(n^2)$ из-за наличия вложенного цикла `while` внутри цикла `for`.
   **Источник:** [CP-Algorithms: Monotonic stack](https://cp-algorithms.com/)

## 6. Хеш-таблицы и множества


76. Как работает хеш-таблица в среднем и худшем случаях?

   **Ответ:** Ключ преобразуется хеш-функцией в целочисленный индекс корзины (*bucket*). В среднем случае при хорошем распределении и низком коэффициенте заполнения (*load factor*) поиск, вставка и удаление выполняются за $O(1)$. В худшем случае (коллизии собирают все ключи в одну корзину) сложность деградирует до $O(n)$.
   **Пример:**
   ```cpp
   std::unordered_map<std::string, int> scores;
   scores["Alice"] = 100; // В среднем O(1)

   ```


   **Типичная ошибка:** Полагаться на гарантированное время $O(1)$ в системах жесткого реального времени без защиты от коллизий.
   **Источник:** [Cppreference: std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map)

77. Чем `std::map` отличается от `std::unordered_map`?

   **Ответ:** `std::map` реализован на базе красно-черного дерева поиска, элементы хранятся в отсортированном порядке, а поиск, вставка и удаление занимают строго $O(\log n)$. `std::unordered_map` использует хеш-таблицу, элементы не упорядочены, а операции выполняются в среднем за $O(1)$, но в худшем случае за $O(n)$.
   **Пример:**
   ```cpp
   std::map<int, std::string> ordered;          // Нужен operator<
   std::unordered_map<int, std::string> hashed; // Нужны std::hash и operator==

   ```


   **Типичная ошибка:** Использование `std::unordered_map` для диапазонов или последовательного обхода в отсортированном порядке.
   **Источник:** [Cppreference: std::map](https://en.cppreference.com/w/cpp/container/map)

78. Почему важно реализовывать корректную хеш-функцию для пользовательского типа в C++?

   **Ответ:** Некачественная хеш-функция (например, возвращающая константу или зависящая только от части полей) сводит все ключи в один bucket, превращая операции $O(1)$ в линейный перебор $O(n)$ и вызывая деградацию всей системы.
   **Пример:**
   ```cpp
   struct Point { int x, y; };

   template <>
   struct std::hash<Point> {
       size_t operator()(const Point& p) const noexcept {
           // Комбинирование хешей вместо x ^ y
           return std::hash<int>{}(p.x) ^ (std::hash<int>{}(p.y) + 0x9e3779b9 + (std::hash<int>{}(p.x) << 6) + (std::hash<int>{}(p.x) >> 2));
       }
   };

   ```


   **Типичная ошибка:** Использование простого `xor` (`hash(a) ^ hash(b)`), из-за чего для точек `(x, y)` и `(y, x)` получается одинаковый хеш.
   **Источник:** [Cppreference: std::hash](https://en.cppreference.com/w/cpp/utility/hash)

79. Как найти длину самой длинной последовательности последовательных чисел (*longest consecutive sequence*) за $O(n)$?

   **Ответ:** Все числа помещаются в `std::unordered_set`. При итерации по множеству число проверяется на начало последовательности: если `num - 1` отсутствует в сете, запускается внутренний цикл поиска `num + 1`, `num + 2` и т.д. Каждое число посещается не более двух раз.
   **Пример:**
   ```cpp
   int longest_consecutive(const std::vector<int>& nums) {
       std::unordered_set<int> s(nums.begin(), nums.end());
       int max_len = 0;
       for (int num : s) {
           if (!s.contains(num - 1)) { // Начало цепочки
               int curr = num;
               int len = 1;
               while (s.contains(curr + 1)) {
                   curr++;
                   len++;
               }
               max_len = std::max(max_len, len);
           }
       }
       return max_len;
   }

   ```


   **Типичная ошибка:** Запуск поиска цепочки для каждого числа без проверки `!s.contains(num - 1)`, что ухудшает сложность до $O(n^2)$.
   **Источник:** [LeetCode: Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)

80. Как найти все пары чисел, дающие заданную целевую сумму `target`?

   **Ответ:** Массив обходится один раз, для текущего числа `x` проверяется наличие дополнения `target - x` в хеш-таблице/множестве. Чтобы исключить дубликаты, найденные пары нормализуются или массив предварительно сортируется с пропуском повторов.
   **Пример:**
   ```cpp
   std::vector<std::pair<int, int>> find_pairs(const std::vector<int>& nums, int target) {
       std::unordered_set<int> seen;
       std::unordered_set<int> used;
       std::vector<std::pair<int, int>> result;
       for (int x : nums) {
           int complement = target - x;
           if (seen.contains(complement) && !used.contains(x)) {
               result.emplace_back(std::min(x, complement), std::max(x, complement));
               used.insert(x);
               used.insert(complement);
           }
           seen.insert(x);
       }
       return result;
   }

   ```


   **Типичная ошибка:** Вложенный двойной цикл $O(n^2)$ или повторное добавление одной и той же пары в разных порядках.
   **Источник:** [LeetCode: Two Sum](https://leetcode.com/problems/two-sum/)

81. Как определить, содержат ли два массива общий элемент, за линейное время?

   **Ответ:** Элементы первого массива вставляются в `std::unordered_set` за $O(n)$. Затем второй массив обходится с проверкой наличия каждого элемента в сете за $O(m)$. Общая сложность составляет $O(n + m)$ по времени и $O(\min(n, m))$ по памяти.
   **Пример:**
   ```cpp
   bool has_common_element(const std::vector<int>& a, const std::vector<int>& b) {
       const auto& [smaller, larger] = (a.size() < b.size()) ? std::tie(a, b) : std::tie(b, a);
       std::unordered_set<int> s(smaller.begin(), smaller.end());
       for (int x : larger) {
           if (s.contains(x)) return true;
       }
       return false;
   }

   ```


   **Типичная ошибка:** Создание двух сетов вместо одного, что удваивает расход динамической памяти.
   **Источник:** [LeetCode: Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/)

82. Как найти количество подмассивов с одинаковым количеством нулей и единиц?

   **Ответ:** Заменяем нули на `-1`. Задача сводится к поиску числа подмассивов с нулевой суммой: вычисляется префиксная сумма, и в хеш-таблице поддерживается количество раз, которое каждая префиксная сумма уже встречалась.
   **Пример:**
   ```cpp
   int find_max_sub_array_count(const std::vector<int>& nums) {
       std::unordered_map<int, int> prefix_counts;
       prefix_counts[0] = 1; // Пустой префикс
       int prefix_sum = 0;
       int total = 0;
       for (int x : nums) {
           prefix_sum += (x == 1) ? 1 : -1;
           if (prefix_counts.contains(prefix_sum)) {
               total += prefix_counts[prefix_sum];
           }
           prefix_counts[prefix_sum]++;
       }
       return total;
   }

   ```


   **Типичная ошибка:** Забытая инициализация `prefix_counts[0] = 1`, из-за чего подмассивы, начинающиеся с нулевого индекса, не учитываются.
   **Источник:** [LeetCode: Contiguous Array](https://leetcode.com/problems/contiguous-array/)

83. Когда и зачем стоит использовать метод `reserve()` у `std::unordered_map` и `std::vector`?

   **Ответ:** Для `std::vector` метод `reserve()` заранее выделяет непрерывный буфер, предотвращая множественные переаллокации и копирования при вставках. Для `std::unordered_map` метод `reserve()` настраивает число корзин, предотвращая дорогостоящий `rehash` при заполнении.
   **Пример:**
   ```cpp
   std::unordered_map<int, int> map;
   map.reserve(100'000); // 0 перехеширований при вставке 100k элементов

   ```


   **Типичная ошибка:** Путаница между `reserve()` (выделение емкости) и `resize()` (фактическое создание элементов с вызовом конструкторов).
   **Источник:** [Cppreference: std::unordered_map::reserve](https://en.cppreference.com/w/cpp/container/unordered_map/reserve)

84. Что такое rehash и как он влияет на производительность?

   **Ответ:** Rehash — это процесс перевыделения таблицы корзин большего размера и повторного распределения всех существующих элементов по новым индексам корзин при превышении `max_load_factor()`. Это операция $O(n)$, вызывающая кратковременные задержки (*latency spikes*).
   **Пример:** При непрерывных вставках без резерва таблица многократно перестраивается: на 8, 16, 32 корзины и так далее.
   **Типичная ошибка:** Выполнение вставок в хеш-таблицу на критических путях с жесткими требованиями к SLA задержек без предварительного вызова `reserve()`.
   **Источник:** [Cppreference: std::unordered_map::rehash](https://en.cppreference.com/w/cpp/container/unordered_map/rehash)

85. Как находить дубликаты в потоке данных в условиях жестко ограниченной памяти?

   **Ответ:** Используются вероятностные структуры данных, в частности фильтр Блума (*Bloom Filter*) или *Counting Bloom Filter*. Они гарантируют отсутствие ложноотрицательных срабатываний (*no false negatives*), занимая фиксированный битовый массив вне зависимости от числа элементов.
   **Пример:** Проверка хешей объекта по битовой маске: если хотя бы один бит равен 0, элемент гарантированно уникален.
   **Типичная ошибка:** Попытка хранить весь поток в `std::unordered_set`, приводящая к исчерпанию оперативной памяти (OOM).
   **Источник:** [Bloom filter (Wikipedia)](https://en.wikipedia.org/wiki/Bloom_filter)

86. Как решается задача Two Sum и чем различаются online- и offline-подходы?

   **Ответ:** В online-варианте элементы поступают потоком: для каждого нового `x` выполняется поиск `target - x` в текущей таблице, а затем `x` добавляется в нее за $O(1)$. В offline-варианте весь массив известен заранее: данные можно отсортировать и применить метод двух указателей с $O(1)$ дополнительной памяти за $O(n \log n)$.
   **Пример:**
   ```cpp
   // Online-вариант:
   std::vector<int> two_sum(const std::vector<int>& nums, int target) {
       std::unordered_map<int, int> map;
       for (int i = 0; i < nums.size(); ++i) {
           int comp = target - nums[i];
           if (map.contains(comp)) return {map[comp], i};
           map[nums[i]] = i;
       }
       return {};
   }

   ```


   **Типичная ошибка:** Попытка сортировать входящий бесконечный поток данных для решения online-задачи.
   **Источник:** [LeetCode: Two Sum](https://leetcode.com/problems/two-sum/)

87. Какие атаки возможны на хеш-таблицы с точки зрения деградации до худшего случая?

   **Ответ:** Атака алгоритмической сложности (*Hash-DoS*). Злоумышленник генерирует набор ключей, дающих одинаковое значение хеша для дефолтной хеш-функции. Вставка таких ключей вырождает все корзины в один список, замедляя работу сервера с $O(1)$ до $O(n)$ на операцию (суммарно $O(n^2)$).
   **Пример:** Передача специально подобранных строк в HTTP-заголовках веб-сервера.
   **Типичная ошибка:** Использование стандартного `std::hash` на открытых сетевых интерфейсах без добавления случайной соли (*random seed*).
   **Источник:** [C++ Core Guidelines: SL.con.3](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#slcon3-choose-containers-based-on-performance-needs)

88. Как хранить частоты объектов, если ключом является сложная пользовательская структура?

   **Ответ:** Для структуры перегружается `operator==` и специализируется `std::hash`, либо передается кастомный компаратор для `std::map`. В C++20 для полей структуры достаточно объявить оператор `= default` для `<=>` и `==`.
   **Пример:**
   ```cpp
   struct Transaction {
       std::string sender;
       int id;
       bool operator==(const Transaction&) const = default;
   };

   struct TxHash {
       size_t operator()(const Transaction& t) const noexcept {
           return std::hash<std::string>{}(t.sender) ^ (std::hash<int>{}(t.id) << 1);
       }
   };

   std::unordered_map<Transaction, int, TxHash> freq;

   ```


   **Типичная ошибка:** Определение `std::hash` без одновременной перегрузки оператора равенства `operator==`.
   **Источник:** [Cppreference: std::hash](https://en.cppreference.com/w/cpp/utility/hash)

89. Почему порядок обхода `std::unordered_map` нельзя считать стабильным?

   **Ответ:** Порядок обхода зависит от распределения хешей по корзинам (*buckets*), реализации стандартной библиотеки, текущего размера таблицы и количества рехеширований. Любая вставка может спровоцировать `rehash` и полностью изменить последовательность элементов.
   **Пример:** Итерация по `unordered_map` на GCC и Clang может выдавать совершенно разный порядок одной и той же последовательности ключей.
   **Типичная ошибка:** Написание тестов, проверяющих жесткий строковый вывод контейнера `unordered_map`.
   **Источник:** [Cppreference: std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map)

90. В каких задачах `std::bitset` предпочтительнее `std::unordered_set`?

   **Ответ:** Когда универсум ключей — это неотрицательные целые числа в фиксированном небольшом диапазоне (например, до $10^6$). `std::bitset` тратит ровно 1 бит на элемент, размещается на стеке без динамических аллокаций и поддерживает параллельные битовые операции над словами процессора ($O(1)$ для 64 элементов за такт).
   **Пример:**
   ```cpp
   std::bitset<1000> visited;
   visited.set(42);
   if (visited.test(42)) { /* ... */ }

   ```


   **Типичная ошибка:** Использование `std::unordered_set<int>` для проверки посещенности вершин графа с номерами от 0 до $N$, что увеличивает расход памяти в десятки раз из-за накладных расходов нод.
   **Источник:** [Cppreference: std::bitset](https://en.cppreference.com/w/cpp/utility/bitset)

   ---

## 7. Двоичный поиск и поиск по ответу


91. Как реализовать классический бинарный поиск без ошибок смещения на единицу (*off-by-one errors*)?

   **Ответ:** Необходимо строго зафиксировать инвариант интервала поиска. Для закрытого отрезка `[low, high]` условием цикла является `low <= high`, а границы сдвигаются строго за пределы проверенной середины: `low = mid + 1` и `high = mid - 1`.
   **Пример:**
   ```cpp
   int binary_search(const std::vector<int>& arr, int target) {
       int low = 0;
       int high = static_cast<int>(arr.size()) - 1;
       while (low <= high) {
           int mid = low + (high - low) / 2;
           if (arr[mid] == target) return mid;
           if (arr[mid] < target) low = mid + 1;
           else high = mid - 1;
       }
       return -1;
   }

   ```


   **Типичная ошибка:** Условие `while (low < high)` вместе с `high = mid - 1`, из-за чего последний оставшийся элемент при `low == high` не проверяется.
   **Источник:** [Cppreference: std::binary_search](https://en.cppreference.com/w/cpp/algorithm/binary_search)

92. Чем отличаются алгоритмы `std::lower_bound` и `std::upper_bound` в C++?

   **Ответ:** `std::lower_bound` возвращает итератор на первый элемент, который **не меньше** заданного (`>= target`). `std::upper_bound` возвращает итератор на первый элемент, который **строго больше** заданного (`> target`).
   **Пример:**
   ```cpp
   std::vector<int> v = {1, 2, 4, 4, 4, 6};
   auto lb = std::lower_bound(v.begin(), v.end(), 4); // Итератор на индекс 2 (первая 4)
   auto ub = std::upper_bound(v.begin(), v.end(), 4); // Итератор на индекс 5 (число 6)

   ```


   **Типичная ошибка:** Попытка найти `target` через `upper_bound` и последующее разыменование без декремента итератора.
   **Источник:** [Cppreference: std::lower_bound](https://en.cppreference.com/w/cpp/algorithm/lower_bound)

93. Как найти первое и последнее вхождение заданного элемента в отсортированном массиве?

   **Ответ:** Через пару `std::lower_bound` и `std::upper_bound`. Первое вхождение дает `lower_bound` (при совпадении значения), а последнее — элемент перед `upper_bound`.
   **Пример:**
   ```cpp
   std::pair<int, int> find_range(const std::vector<int>& nums, int target) {
       auto lb = std::lower_bound(nums.begin(), nums.end(), target);
       if (lb == nums.end() || *lb != target) return {-1, -1};
       auto ub = std::upper_bound(nums.begin(), nums.end(), target);
       return {static_cast<int>(std::distance(nums.begin(), lb)),
               static_cast<int>(std::distance(nums.begin(), ub)) - 1};
   }

   ```


   **Типичная ошибка:** Линейное сканирование от `lower_bound` до конца дубликатов, что деградирует худшее время до $O(n)$.
   **Источник:** [LeetCode: Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

94. Как найти минимум в отсортированном массиве, подвергнутом циклическому сдвигу?

   **Ответ:** Сравнивается середина с правым концом: если `nums[mid] > nums[high]`, точка перегиба и минимум лежат строго правее (`low = mid + 1`). Иначе минимум находится в левой части, включая саму середину (`high = mid`).
   **Пример:**
   ```cpp
   int find_min(const std::vector<int>& nums) {
       int low = 0, high = static_cast<int>(nums.size()) - 1;
       while (low < high) {
           int mid = low + (high - low) / 2;
           if (nums[mid] > nums[high]) low = mid + 1;
           else high = mid;
       }
       return nums[low];
   }

   ```


   **Типичная ошибка:** Сравнение с `nums[low]` вместо `nums[high]`, что не позволяет однозначно определить отсортированную половину.
   **Источник:** [LeetCode: Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)

95. Как искать элемент в циклически сдвинутом отсортированном массиве (*Rotated Sorted Array*)?

   **Ответ:** На каждом шаге хотя бы одна из двух половин `[low, mid]` или `[mid, high]` гарантированно отсортирована. Сначала определяется, какая половина монотонна, затем проверяется попадание `target` в ее границы, и поиск сужается.
   **Пример:**
   ```cpp
   int search_rotated(const std::vector<int>& nums, int target) {
       int low = 0, high = static_cast<int>(nums.size()) - 1;
       while (low <= high) {
           int mid = low + (high - low) / 2;
           if (nums[mid] == target) return mid;
           if (nums[low] <= nums[mid]) { // Левая половина отсортирована
               if (nums[low] <= target && target < nums[mid]) high = mid - 1;
               else low = mid + 1;
           } else { // Правая половина отсортирована
               if (nums[mid] < target && target <= nums[high]) low = mid + 1;
               else high = mid - 1;
           }
       }
       return -1;
   }

   ```


   **Типичная ошибка:** Использование строгого `<` вместо `<=` в проверке `nums[low] <= nums[mid]`, что дает сбой при массивах длины 2.
   **Источник:** [LeetCode: Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)

96. Что представляет собой техника бинарного поиска по ответу (*binary search on answer*)?

   **Ответ:** Поиск значения в монотонном пространстве потенциальных ответов `[min_ans, max_ans]` с проверкой функции-предиката `check(x)` за полиномиальное время. Если предикат монотонен, оптимальный ответ находится за $O(\text{Cost}(\text{check}) \cdot \log(\text{Range}))$.
   **Пример:** Задача упаковки грузов в $D$ дней: предикат проверяет, можно ли перевезти все товары грузовиками вместимости `capacity`.
   **Типичная ошибка:** Применение бинарного поиска по ответу к предикатам, не обладающим свойством монотонности.
   **Источник:** [CP-Algorithms: Binary Search](https://cp-algorithms.com/)

97. Как найти минимальную скорость работы для завершения задачи за `h` часов через поиск по ответу?

   **Ответ:** Пространство скоростей лежит в диапазоне `[1, max_speed]`. Предикат вычисляет суммарное время $\sum \lceil \text{task}_i / \text{speed} \rceil$. Так как время монотонно убывает с ростом скорости, применяется стандартный поиск левой границы.
   **Пример:**
   ```cpp
   int min_eating_speed(const std::vector<int>& piles, int h) {
       int low = 1;
       int high = *std::max_element(piles.begin(), piles.end());
       while (low < high) {
           int mid = low + (high - low) / 2;
           long long hours = 0;
           for (int p : piles) hours += (p + mid - 1) / mid; // Деление с округлением вверх
           if (hours <= h) high = mid;
           else low = mid + 1;
       }
       return low;
   }

   ```


   **Типичная ошибка:** Переполнение 32-битного знакового `int` при накоплении суммарного времени `hours`.
   **Источник:** [LeetCode: Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)

98. Как доказать монотонность предиката для бинарного поиска по ответу?

   **Ответ:** Необходимо математически показать, что если утверждение $P(x)$ истинно, то для всех $y > x$ (или $y < x$) утверждение $P(y)$ также гарантированно истинно (функция перехода монотонна: $000\dots111$).
   **Пример:** С увеличением грузоподъемности машины число требуемых рейсов может только уменьшиться или остаться прежним, но никогда не возрастет.
   **Типичная ошибка:** Попытка применить бинарный поиск к жадным эвристикам с локальными экстремумами без строгого доказательства монотонности.
   **Источник:** [Codeforces EDU: Binary Search](https://codeforces.com/edu/course/2)

99. Почему бинарный поиск применим не только к массивам в оперативной памяти?

   **Ответ:** Для бинарного поиска не требуется физический массив структур; достаточно любого абстрактного монотонного отображения или неявной функции, где по значению аргумента можно вычислить результат и отсечь ровно половину пространства поиска.
   **Пример:** Поиск коммита, внесшего регрессионный баг, через утилиту `git bisect`.
   **Типичная ошибка:** Представление, что бинарный поиск ограничен только структурами со случайным доступом по индексу (`std::vector`).
   **Источник:** [Git documentation: git-bisect](https://git-scm.com/docs/git-bisect)

100. Как найти медиану двух отсортированных массивов за время $O(\log(\min(n, m)))$?

   **Ответ:** Выполняется бинарный поиск по размеру разбиения меньшего массива. Оба массива делятся на левую и правую части так, чтобы суммарное число элементов слева равнялось половине, а максимальные элементы левых частей были меньше или равны минимальным элементам правых частей.
   **Пример:**
   ```cpp
   double find_median_sorted_arrays(const std::vector<int>& A, const std::vector<int>& B) {
       if (A.size() > B.size()) return find_median_sorted_arrays(B, A);
       int m = A.size(), n = B.size();
       int low = 0, high = m;
       while (low <= high) {
           int i = (low + high) / 2;
           int j = (m + n + 1) / 2 - i;
           int max_left_A = (i == 0) ? INT_MIN : A[i - 1];
           int min_right_A = (i == m) ? INT_MAX : A[i];
           int max_left_B = (j == 0) ? INT_MIN : B[j - 1];
           int min_right_B = (j == n) ? INT_MAX : B[j];

           if (max_left_A <= min_right_B && max_left_B <= min_right_A) {
               if ((m + n) % 2 == 1) return std::max(max_left_A, max_left_B);
               return (std::max(max_left_A, max_left_B) + std::min(min_right_A, min_right_B)) / 2.0;
           }
           if (max_left_A > min_right_B) high = i - 1;
           else low = i + 1;
       }
       return 0.0;
   }

   ```


   **Типичная ошибка:** Слияние массивов в один общий буфер за время $O(n + m)$ и память $O(n + m)$.
   **Источник:** [LeetCode: Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)

101. Как найти $k$-й по величине элемент массива без полной сортировки?

   **Ответ:** С помощью алгоритма *Quickselect* (на базе разбиения Хоара) или стандартной функции `std::nth_element`. Алгоритм упорядочивает массив так, что на $k$-й позиции оказывается целевой элемент, за среднее линейное время $O(n)$.
   **Пример:**
   ```cpp
   int find_kth_largest(std::vector<int>& nums, int k) {
       auto target_it = nums.begin() + (nums.size() - k);
       std::nth_element(nums.begin(), target_it, nums.end());
       return *target_it;
   }

   ```


   **Типичная ошибка:** Полная сортировка массива вызовом `std::sort` за $O(n \log n)$.
   **Источник:** [Cppreference: std::nth_element](https://en.cppreference.com/w/cpp/algorithm/nth_element)

102. В каких случаях предпочтительнее использовать `std::nth_element`, а когда кучу (`std::priority_queue`)?

   **Ответ:** Если все данные уже находятся в памяти и допускается их мутация на месте, `std::nth_element` работает быстрее и требует $O(1)$ вспомогательной памяти. Если данные поступают потоком (*streaming*) или исходный массив нельзя модифицировать, эффективнее использовать min-кучу размера $k$ за $O(n \log k)$.
   **Пример:** Поиск топ-10 элементов в потоке сетевых пакетов через `std::priority_queue`.
   **Типичная ошибка:** Создание полной копии массива размером в несколько гигабайт только ради вызова `std::nth_element`.
   **Источник:** [C++ Core Guidelines: Per.7](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#per7-design-to-enable-optimization)

103. Как с помощью бинарного поиска найти корень непрерывной вещественной функции?

   **Ответ:** Методом деления отрезка пополам (бисекции). Выбираются границы $[a, b]$, на которых функция имеет разные знаки ($f(a) \cdot f(b) \le 0$). На каждом шаге отрезок делится пополам, пока длина интервала не станет меньше заданной погрешности $\varepsilon$, либо выполняется фиксированное число итераций (например, 60–100).
   **Пример:**
   ```cpp
   double find_root(auto f, double low, double high, double eps = 1e-7) {
       for (int iter = 0; iter < 100; ++iter) { // Защита от бесконечного цикла
           double mid = low + (high - low) / 2.0;
           if (f(mid) * f(low) <= 0) high = mid;
           else low = mid;
           if (high - low < eps) break;
       }
       return low;
   }

   ```


   **Типичная ошибка:** Условие остановки вида `while (f(mid) != 0.0)`, приводящее к зацикливанию из-за погрешностей округления чисел с плавающей запятой (`double`).
   **Источник:** [Bisection method (Wikipedia)](https://en.wikipedia.org/wiki/Bisection_method)

104. Как корректно вычислять середину `mid` во избежание переполнения целочисленных типов?

   **Ответ:** Вместо формулы `(low + high) / 2`, где сложение двух больших положительных чисел может превысить лимит типа (`INT_MAX`) и привести к UB, следует использовать безопасную формулу `low + (high - low) / 2` или стандартную функцию `std::midpoint` (начиная с C++20).
   **Пример:**
   ```cpp
   int mid1 = low + (high - low) / 2;
   int mid2 = std::midpoint(low, high); // C++20

   ```


   **Типичная ошибка:** Использование `(low + high) / 2`, вызывающее знаковое переполнение и переход в отрицательные значения при `low + high > 2'147'483'647`.
   **Источник:** [Cppreference: std::midpoint](https://en.cppreference.com/w/cpp/numeric/midpoint)

105. Какой инвариант необходимо поддерживать при реализации бинарного поиска по полуинтервалу `[l, r)`?

   **Ответ:** Инвариант полуинтервала: искомый элемент всегда лежит в полуоткрытом диапазоне `[l, r)`, где левая граница включена, а правая строго исключена. Цикл продолжается пока `l < r`, при сдвиге левой границы берется `l = mid + 1`, а при сдвиге правой границы — `r = mid`.
   **Пример:**
   ```cpp
   // Идиоматичный поиск по полуинтервалу (как в std::lower_bound):
   int lower_bound_half_open(const std::vector<int>& arr, int target) {
       int l = 0;
       int r = static_cast<int>(arr.size());
       while (l < r) {
           int mid = l + (r - l) / 2;
           if (arr[mid] < target) l = mid + 1;
           else r = mid;
       }
       return l; // l == r
   }

   ```


   **Типичная ошибка:** Установка `r = mid - 1` для полуинтервала, что исключает из дальнейшего рассмотрения потенциально валидный элемент `mid - 1`.
   **Источник:** [Elements of Programming (Alexander Stepanov)](http://elementsofprogramming.com/)

## 8. Сортировки


106. Как работает bubble sort (пузырьковая сортировка) и почему она практически не применяется на практике?

   **Ответ:** Алгоритм многократно проходит по массиву, сравнивая соседние элементы и меняя их местами, если они расположены в неправильном порядке, выталкивая наибольший элемент в конец за проход. На практике она не используется из-за квадратичной сложности $O(n^2)$ в среднем и худшем случаях, а также огромного количества лишних операций записи в память.

   **Пример:**

   ```cpp
   void bubble_sort(std::vector<int>& arr) {
       bool swapped = false;
       for (size_t i = 0; i < arr.size(); ++i) {
           swapped = false;
           for (size_t j = 0; j + 1 < arr.size() - i; ++j) {
               if (arr[j] > arr[j + 1]) {
                   std::swap(arr[j], arr[j + 1]);
                   swapped = true;
               }
           }
           if (!swapped) break;
       }
   }
   ```

   **Типичная ошибка:** Отсутствие флага раннего выхода `swapped`, из-за чего алгоритм делает $O(n^2)$ итераций даже на изначально отсортированном массиве.

   **Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

107. Почему insertion sort (сортировка вставками) эффективна на почти отсортированных массивах?

   **Ответ:** Вставка элемента выполняется сдвигом влево до первой меньшей величины. Если массив почти отсортирован (каждый элемент находится недалеко от своей финальной позиции), внутренний цикл завершается за $O(1)$ шагов, давая общую временную сложность, близкую к линейной $O(n)$.

   **Пример:**

   ```cpp
   void insertion_sort(std::vector<int>& arr) {
       for (size_t i = 1; i < arr.size(); ++i) {
           int key = arr[i];
           int j = static_cast<int>(i) - 1;
           while (j >= 0 && arr[j] > key) {
               arr[j + 1] = arr[j];
               --j;
           }
           arr[j + 1] = key;
       }
   }
   ```

   **Типичная ошибка:** Использование бинарного поиска для нахождения позиции вставки без учета того, что сдвиг элементов в массиве всё равно требует $O(n)$ времени.

   **Источник:** [Algorithms, 4th Edition (Sedgewick, Wayne)](https://algs4.cs.princeton.edu/21elementary/)

108. Как работает selection sort (сортировка выбором) и в чём заключается её главное слабое место?

   **Ответ:** На каждом шаге алгоритм ищет минимальный элемент в неотсортированной части массива и меняет его местами с первым неотсортированным элементом. Главное слабое место — фиксированная сложность $\Theta(n^2)$ во всех случаях (даже на полностью отсортированных данных), так как поиск минимума всегда сканирует весь оставшийся диапазон.

   **Пример:**

   ```cpp
   void selection_sort(std::vector<int>& arr) {
       for (size_t i = 0; i < arr.size(); ++i) {
           size_t min_idx = i;
           for (size_t j = i + 1; j < arr.size(); ++j) {
               if (arr[j] < arr[min_idx]) min_idx = j;
           }
           std::swap(arr[i], arr[min_idx]);
       }
   }
   ```

   **Типичная ошибка:** Попытка оптимизировать алгоритм досрочным прерыванием: в selection sort невозможно определить корректность порядка без полного просмотра остатка.

   **Источник:** [GeeksforGeeks: Selection Sort](https://www.geeksforgeeks.org/selection-sort-algorithm-2/)

109. Как устроен merge sort (сортировка слиянием) и почему она гарантирует стабильность?

   **Ответ:** Массив рекурсивно делится пополам до единичных элементов, после чего отсортированные половины сливаются в один буфер за время $O(n)$. Стабильность обеспечивается правилом слияния: при равенстве элементов первым всегда берется элемент из левой половины.

   **Пример:**

   ```cpp
   void merge(std::vector<int>& arr, int l, int m, int r, std::vector<int>& buf) {
       int i = l, j = m + 1, k = l;
       while (i <= m && j <= r) {
           if (arr[i] <= arr[j]) buf[k++] = arr[i++]; // <= гарантирует стабильность
           else buf[k++] = arr[j++];
       }
       while (i <= m) buf[k++] = arr[i++];
       while (j <= r) buf[k++] = arr[j++];
       for (i = l; i <= r; ++i) arr[i] = buf[i];
   }
   ```

   **Типичная ошибка:** Использование строгого неравенства `arr[i] < arr[j]` при слиянии, что приводит к взятию правого дубликата раньше левого и нарушению стабильности.

   **Источник:** [Cppreference: std::stable_sort](https://en.cppreference.com/w/cpp/algorithm/stable_sort)

110. Как устроен quicksort (быстрая сортировка) и при каких условиях возникает деградация до $O(n^2)$?

   **Ответ:** Выбирается опорный элемент (*pivot*), массив разбивается на две части (меньше и больше pivot), которые затем сортируются рекурсивно. Деградация до $O(n^2)$ возникает, если pivot на каждом шаге делит массив крайне неравномерно (например, выбор первого или последнего элемента на уже отсортированном массиве или массиве из одинаковых чисел при неудачной схеме разбиения).

   **Пример:** Схема Хоара с выбором середины как защита от базовых отсортированных массивов:

   ```cpp
   int partition(std::vector<int>& a, int low, int high) {
       int pivot = a[low + (high - low) / 2];
       int i = low - 1, j = high + 1;
       while (true) {
           do { i++; } while (a[i] < pivot);
           do { j--; } while (a[j] > pivot);
           if (i >= j) return j;
           std::swap(a[i], a[j]);
       }
   }
   ```

   **Типичная ошибка:** Использование наивной схемы Ломуто с крайним элементом без рандомизации на практических данных.

   **Источник:** [Introduction to Algorithms (CLRS: Chapter 7 Quicksort)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

111. Как выбирать pivot в quicksort, чтобы минимизировать риск худшего случая?

   **Ответ:** 1) Псевдослучайный выбор индекса (*randomized pivot*); 2) Медиана трех элементов: $\text{median}(\text{first}, \text{mid}, \text{last})$; 3) Для больших массивов — медиана медиан девяти равноудаленных элементов (схема Нинедианы Тьюки / *Tukey’s ninther*).

   **Пример:**

   ```cpp
   int pick_pivot_index(const std::vector<int>& a, int l, int r) {
       int mid = l + (r - l) / 2;
       // Медиана трех
       if ((a[l] <= a[mid] && a[mid] <= a[r]) || (a[r] <= a[mid] && a[mid] <= a[l])) return mid;
       if ((a[mid] <= a[l] && a[l] <= a[r]) || (a[r] <= a[l] && a[l] <= a[mid])) return l;
       return r;
   }
   ```

   **Типичная ошибка:** Фиксированный выбор первого элемента `a[0]`, уязвимый к тривиальным тестам и атакам сложности (*algorithmic complexity attacks*).

   **Источник:** [Engineering a Sort Function (Bentley, McIlroy)](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=10.1.1.14.8162)

112. Что такое стабильная сортировка (*stable sort*) и в каких задачах она критически важна?

   **Ответ:** Стабильной называется сортировка, сохраняющая исходный относительный порядок элементов с одинаковыми ключами. Это критично при многоуровневой сортировке (например, сначала по имени, затем по дате) и при сортировке составных структур, где важен предшествующий порядок.

   **Пример:**

   ```cpp
   struct Item { std::string category; int priority; };
   // Сортировка только по priority без нарушения относительного порядка category:
   std::stable_sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
       return a.priority < b.priority;
   });
   ```

   **Типичная ошибка:** Применение нестабильной `std::sort` для таблицы в UI, когда пользователь кликает по заголовкам колонок последовательно.

   **Источник:** [Cppreference: std::stable_sort](https://en.cppreference.com/w/cpp/algorithm/stable_sort)

113. Как работает heap sort (пирамидальная сортировка) и почему она нестабильна?

   **Ответ:** 1) Из массива за $O(n)$ строится двоичная max-куча (*heapify*); 2) Корень (максимум) циклически меняется с последним элементом и просеивается вниз (*sift-down*) за $O(\log n)$. Алгоритм нестабилен, так как перемещения элементов в неявном дереве через индексы $2i + 1$ и $2i + 2$ произвольно меняют взаимное расположение одинаковых значений.

   **Пример:**

   ```cpp
   // Идиоматично через стандартные функции STL:
   void heap_sort(std::vector<int>& arr) {
       std::make_heap(arr.begin(), arr.end());
       std::sort_heap(arr.begin(), arr.end());
   }
   ```

   **Типичная ошибка:** Попытка делать вставки элементов по одному через `push_heap` за $O(n \log n)$ вместо линейного построения кучи на месте через `std::make_heap` за $O(n)$.

   **Источник:** [Cppreference: std::sort_heap](https://en.cppreference.com/w/cpp/algorithm/sort_heap)

114. На основе какого алгоритма обычно реализована `std::sort` в C++ и почему это важно знать?

   **Ответ:** `std::sort` обычно реализуется как **Introsort** (гибрид Quicksort, Heapsort и Insertion sort). Он начинает с быстрой сортировки, переключается на Heapsort при превышении глубины рекурсии $2 \log n$ (защита от худшего $O(n^2)$) и досортировывает мелкие подмассивы ($< 16$–$32$ элементов) через Insertion sort. Знание этого объясняет гарантию худшего времени $O(n \log n)$ и нестабильность `std::sort`.

   **Пример:**

   ```cpp
   std::vector<int> data = {5, 2, 9, 1, 5, 6};
   std::sort(data.begin(), data.end()); // Гарантированное O(n log n), не стабильна
   ```

   **Типичная ошибка:** Ожидание стабильности от `std::sort` вместо явного вызова `std::stable_sort`.

   **Источник:** [Introspective Sorting and Selection Algorithms (David R. Musser)](https://www.cs.rpi.edu/~musser/gp/introsort.ps)

115. При каких условиях counting sort (сортировка подсчетом) выполняется за строго линейное время?

   **Ответ:** Когда ключи являются целыми числами из известного диапазона $K = \max - \min + 1$, и этот диапазон асимптотически не превосходит размер массива ($K = O(n)$). Временная сложность составляет $\Theta(n + K)$, память — $\Theta(K)$.

   **Пример:**

   ```cpp
   void counting_sort(std::vector<int>& arr, int max_val) {
       std::vector<int> count(max_val + 1, 0);
       for (int x : arr) count[x]++;
       int idx = 0;
       for (int val = 0; val <= max_val; ++val) {
           while (count[val]-- > 0) arr[idx++] = val;
       }
   }
   ```

   **Типичная ошибка:** Применение сортировки подсчетом на массиве из 10 элементов, где одно из чисел равно $10^9$ (приводит к переполнению памяти при выделении вектора счетчиков).

   **Источник:** [Introduction to Algorithms (CLRS: Counting Sort)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

116. В каких ситуациях radix sort (поразрядная сортировка) превосходит comparison-based сортировки?

   **Ответ:** При сортировке больших объемов данных фиксированной короткой длины (32- или 64-битные целые числа, UUID, хеши фиксированного размера), где алгоритм работает за $O(d \cdot (n + b))$ без ветвлений сравнения, обходя нижнюю границу $\Omega(n \log n)$ для сортировок сравнением.

   **Пример:** Сортировка миллиарда 32-битных IP-адресов с основанием $b = 256$ (4 прохода counting sort).

   **Типичная ошибка:** Применение поразрядной сортировки к коротким строкам переменной длины или разреженным данным без учета накладных расходов на создание проходов.

   **Источник:** [Algorithms, 4th Edition: Radix Sorts](https://algs4.cs.princeton.edu/51radix/)

117. Как отсортировать массив, состоящий только из 0, 1 и 2, за один проход и с $O(1)$ памяти?

   **Ответ:** Алгоритмом Dutch National Flag (трехпутевое разбиение Дейкстры). Поддерживаются три указателя: `low` (граница нулей), `mid` (текущий элемент), `high` (граница двоек). Элементы распределяются по зонам за один проход по массиву.

   **Пример:**

   ```cpp
   void sort_colors(std::vector<int>& nums) {
       int low = 0, mid = 0, high = static_cast<int>(nums.size()) - 1;
       while (mid <= high) {
           if (nums[mid] == 0) {
               std::swap(nums[low++], nums[mid++]);
           } else if (nums[mid] == 1) {
               mid++;
           } else { // nums[mid] == 2
               std::swap(nums[mid], nums[high--]);
           }
       }
   }
   ```

   **Типичная ошибка:** Увеличение `mid++` при обмене с `nums[high]` (в `mid` попадает еще не проверенный элемент из конца, который может оказаться 0 или 2).

   **Источник:** [LeetCode: Sort Colors](https://leetcode.com/problems/sort-colors/)

118. Как за линейное время проверить, можно ли отсортировать массив ровно одним разворотом (*reverse*) одного подмассива?

   **Ответ:** 1) Найти первый индекс $L$, где нарушается порядок $A[i] > A[i+1]$; 2) Найти последний индекс $R$, где нарушается порядок $A[j] < A[j-1]$; 3) Развернуть подмассив от $L$ до $R$; 4) Проверить, стал ли массив отсортированным за $O(n)$.

   **Пример:**

   ```cpp
   bool can_sort_by_reversing(std::vector<int> a) {
       int n = static_cast<int>(a.size());
       int l = -1, r = -1;
       for (int i = 0; i < n - 1; ++i) {
           if (a[i] > a[i + 1]) { l = i; break; }
       }
       if (l == -1) return true; // Уже отсортирован
       for (int i = n - 1; i > 0; --i) {
           if (a[i] < a[i - 1]) { r = i; break; }
       }
       std::reverse(a.begin() + l, a.begin() + r + 1);
       return std::is_sorted(a.begin(), a.end());
   }
   ```

   **Типичная ошибка:** Пропуск проверки стыков развернутого подотрезка с внешними частями ($a[l-1] \le a[r]$ и $a[l] \le a[r+1]$).

   **Источник:** [GeeksforGeeks: Check if reversing a sub array make the array sorted](https://www.geeksforgeeks.org/check-reversing-sub-array-make-array-sorted/)

119. Как эффективно слить $k$ отсортированных списков или массивов общего размера $N$?

   **Ответ:** Используется min-куча (`std::priority_queue` с `std::greater`), содержащая первые элементы каждого из $k$ списков. На каждом шаге минимальный элемент извлекается в результат, а следующий элемент из того же списка добавляется в кучу. Временная сложность: $O(N \log k)$, память: $O(k)$.

   **Пример:**

   ```cpp
   struct Element {
       int val, list_idx, elem_idx;
       bool operator>(const Element& o) const { return val > o.val; }
   };

   std::vector<int> merge_k_arrays(const std::vector<std::vector<int>>& arrays) {
       std::priority_queue<Element, std::vector<Element>, std::greater<Element>> pq;
       for (int i = 0; i < arrays.size(); ++i) {
           if (!arrays[i].empty()) pq.push({arrays[i][0], i, 0});
       }
       std::vector<int> res;
       while (!pq.empty()) {
           auto [val, li, ei] = pq.top();
           pq.pop();
           res.push_back(val);
           if (ei + 1 < arrays[li].size()) {
               pq.push({arrays[li][ei + 1], li, ei + 1});
           }
       }
       return res;
   }
   ```

   **Типичная ошибка:** Попарное последовательное слияние списков, дающее худшую асимптотику $O(k \cdot N)$.

   **Источник:** [LeetCode: Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

120. Как выбрать между `std::sort`, `std::partial_sort`, `std::nth_element` и `std::priority_queue`?

   **Ответ:**
   - `std::sort`: нужен полный порядок всех $N$ элементов ($O(N \log N)$);
   - `std::partial_sort`: нужны только первые $K$ отсортированных элементов на месте ($O(N \log K)$);
   - `std::nth_element`: нужно только разделить массив на элементы меньше и больше $K$-го без порядка внутри половин ($O(N)$ в среднем);
   - `std::priority_queue`: данные поступают в непрерывном потоке (онлайн) и массив недоступен целиком в памяти ($O(N \log K)$).

   **Пример:**

   ```cpp
   // Найти топ-5 лучших в векторе без полной сортировки:
   std::partial_sort(v.begin(), v.begin() + 5, v.end());
   ```

   **Типичная ошибка:** Вызов полной `std::sort` для нахождения медианы массива вместо вызова `std::nth_element`.

   **Источник:** [Effective STL: Item 31 (Scott Meyers)](https://www.oreilly.com/library/view/effective-stl-50/0201749629/)


   ---

## 9. Деревья: основы


121. Что означают термины height, depth, leaf, subtree и ancestor в теории деревьев?

   **Ответ:**
   - **Depth (глубина узла):** число ребер от корня дерева до данного узла (у корня глубина 0);
   - **Height (высота дерева/узла):** максимальное число ребер на пути от узла до самого глубокого листа (у листа высота 0);
   - **Leaf (лист):** узел, не имеющий дочерних элементов;
   - **Subtree (поддерево):** дерево, состоящее из некоторого узла и всех его потомков;
   - **Ancestor (предок):** любой узел на пути от корня к данному узлу, включая родителей, дедушек и сам корень.

   **Пример:** В дереве из корня и двух детей глубина детей равна 1, а высота корня равна 1.

   **Типичная ошибка:** Путаница между высотой узла (считается вниз к листьям) и глубиной узла (считается вверх к корню).

   **Источник:** [Introduction to Algorithms (CLRS: Trees)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

122. Чем полное (full), совершенное (perfect), законченное (complete) и сбалансированное бинарные деревья отличаются друг от друга?

   **Ответ:**
   - **Full (строгое):** каждый узел имеет ровно 0 или 2 детей;
   - **Perfect (идеальное):** все внутренние узлы имеют по 2 ребенка, а все листья находятся строго на одном уровне (содержит ровно $2^{h+1} - 1$ узлов);
   - **Complete (почти полное):** все уровни полностью заполнены, кроме, возможно, последнего, который заполняется строго слева направо (структура двоичной кучи);
   - **Balanced (сбалансированное по высоте):** для любого узла разница высот его левого и правого поддеревьев не превышает 1 (например, AVL-дерево).

   **Пример:** `std::priority_queue` на базе массива моделирует форму **complete binary tree**.

   **Типичная ошибка:** Смешение терминов full binary tree и complete binary tree при описании структур данных кучи.

   **Источник:** [GeeksforGeeks: Binary Tree Data Structure](https://www.geeksforgeeks.org/binary-tree-data-structure/)

123. Как обойти бинарное дерево в порядках preorder, inorder, postorder и level-order?

   **Ответ:**
   - **Preorder (N-L-R):** корень $\to$ левое $\to$ правое (для копирования и сериализации структуры);
   - **Inorder (L-N-R):** левое $\to$ корень $\to$ правое (в BST дает отсортированный порядок);
   - **Postorder (L-R-N):** левое $\to$ правое $\to$ корень (для удаления дерева снизу вверх);
   - **Level-order (BFS):** по уровням сверху вниз, слева направо (через очередь `std::queue`).

   **Пример:**

   ```cpp
   struct TreeNode { int val; TreeNode *left, *right; };

   void inorder(TreeNode* root) {
       if (!root) return;
       inorder(root->left);
       std::cout << root->val << ' ';
       inorder(root->right);
   }
   ```

   **Типичная ошибка:** Попытка удалить узлы дерева в обходе preorder, что приводит к разыменованию висячих указателей при обращении к потомкам удаленного корня.

   **Источник:** [Cppreference: Tree Traversal](https://en.wikipedia.org/wiki/Tree_traversal)

124. Как однозначно восстановить бинарное дерево по его preorder и inorder обходам?

   **Ответ:** Первый элемент preorder — это корень. Его значение ищется в массиве inorder: все элементы слева от найденного формируют левое поддерево, все элементы справа — правое. Зная размеры поддеревьев, preorder делится на соответствующие диапазоны, и процесс повторяется рекурсивно за $O(n)$ при использовании хеш-таблицы индексов.

   **Пример:**

   ```cpp
   TreeNode* build(const std::vector<int>& pre, int& pre_idx, int in_l, int in_r,
                   const std::unordered_map<int, int>& in_map) {
       if (in_l > in_r) return nullptr;
       int val = pre[pre_idx++];
       auto* root = new TreeNode{val, nullptr, nullptr};
       int mid = in_map.at(val);
       root->left = build(pre, pre_idx, in_l, mid - 1, in_map);
       root->right = build(pre, pre_idx, mid + 1, in_r, in_map);
       return root;
   }
   ```

   **Типичная ошибка:** Линейный поиск индекса корня в inorder на каждом шаге рекурсии, что ухудшает сложность до $O(n^2)$.

   **Источник:** [LeetCode: Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

125. Почему симметричный обход (inorder) дерева поиска (BST) дает строго отсортированную последовательность?

   **Ответ:** По определению BST для любого узла все значения в левом поддереве строго меньше значения узла, а в правом — строго больше. Симметричный обход посещает вершины в порядке: `(все меньшие) -> (текущий узел) -> (все большие)`, что по индукции формирует монотонно возрастающую последовательность.

   **Пример:** Для узла 5 с левым сыном 3 и правым 7 inorder выведет `3, 5, 7`.

   **Типичная ошибка:** Предположение, что только непосредственные дочерние узлы удовлетворяют свойству BST, игнорируя то, что инвариант должен выполняться для всего поддерева.

   **Источник:** [Introduction to Algorithms (CLRS: BST)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

126. Как корректно проверить, является ли бинарное дерево корректным BST?

   **Ответ:** Недостаточно проверить, что `left->val < root->val < right->val`. Необходимо передавать вниз допустимый диапазон допустимых значений `[min_val, max_val]`, сужая границы при переходе влево и вправо. Либо выполнить inorder-обход и проверить строгую монотонность последовательности.

   **Пример:**

   ```cpp
   bool is_valid_bst(TreeNode* root, std::optional<int> min_val = std::nullopt,
                                     std::optional<int> max_val = std::nullopt) {
       if (!root) return true;
       if (min_val && root->val <= *min_val) return false;
       if (max_val && root->val >= *max_val) return false;
       return is_valid_bst(root->left, min_val, root->val) &&
              is_valid_bst(root->right, root->val, max_val);
   }
   ```

   **Типичная ошибка:** Локальная проверка только прямых потомков узла (из-за чего дерево вида `5 -> right: 10 -> left: 2` ошибочно признается валидным).

   **Источник:** [LeetCode: Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

127. Как вычислить высоту дерева и его диаметр (наибольшее расстояние между любыми двумя узлами)?

   **Ответ:** За один постфиксный обход (DFS) снизу вверх: функция возвращает высоту текущего поддерева, а диаметр обновляется как максимум суммы высот левого и правого поддеревьев $\max(\text{diameter}, h_{\text{left}} + h_{\text{right}})$. Сложность: $O(n)$ по времени, $O(h)$ по памяти.

   **Пример:**

   ```cpp
   int height_and_diameter(TreeNode* root, int& diameter) {
       if (!root) return 0;
       int lh = height_and_diameter(root->left, diameter);
       int rh = height_and_diameter(root->right, diameter);
       diameter = std::max(diameter, lh + rh);
       return 1 + std::max(lh, rh);
   }
   ```

   **Типичная ошибка:** Отдельный рекурсивный вызов функции `height()` внутри расчета диаметра для каждого узла, что деградирует сложность до $O(n^2)$.

   **Источник:** [LeetCode: Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)

128. Как проверить, сбалансировано ли бинарное дерево по высоте (AVL-сбалансированность), за линейное время?

   **Ответ:** Рекурсивная функция вычисляет высоту каждого поддерева. Если разница между высотой левого и правого потомков превышает 1, или если одно из поддеревьев уже несбалансировано, функция возвращает маркер ошибки (например, `-1`), прерывая дальнейшие вычисления.

   **Пример:**

   ```cpp
   int check_balance(TreeNode* root) {
       if (!root) return 0;
       int lh = check_balance(root->left);
       if (lh == -1) return -1;
       int rh = check_balance(root->right);
       if (rh == -1) return -1;
       if (std::abs(lh - rh) > 1) return -1;
       return 1 + std::max(lh, rh);
   }

   bool is_balanced(TreeNode* root) {
       return check_balance(root) != -1;
   }
   ```

   **Типичная ошибка:** Вызов наивного `abs(height(left) - height(right)) <= 1` с повторным обходом поддеревьев на каждом уровне ($O(n^2)$).

   **Источник:** [LeetCode: Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/)

129. Как найти наименьшего общего предка (LCA) в обычном бинарном дереве?

   **Ответ:** Используется рекурсивный постфиксный спуск: если текущий узел равен `p`, `q` или `nullptr`, возвращается текущий узел. Затем рекурсивно опрашиваются левое и правое поддеревья. Если оба вызова вернули ненулевые указатели, то текущий узел — искомый LCA. Если ненулевой только один, он пробрасывается наверх.

   **Пример:**

   ```cpp
   TreeNode* lowest_common_ancestor(TreeNode* root, TreeNode* p, TreeNode* q) {
       if (!root || root == p || root == q) return root;
       TreeNode* left = lowest_common_ancestor(root->left, p, q);
       TreeNode* right = lowest_common_ancestor(root->right, p, q);
       if (left && right) return root;
       return left ? left : right;
   }
   ```

   **Типичная ошибка:** Попытка сохранять пути от корня к `p` и `q` в отдельные динамические массивы с последующим линейным поиском, что требует лишней памяти и проходов.

   **Источник:** [LeetCode: Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

130. Как найти LCA в дереве поиска (BST) быстрее, чем в обычном дереве?

   **Ответ:** Используются свойства BST: если значения обоих узлов `p` и `q` строго меньше `root->val`, LCA лежит в левом поддереве. Если оба строго больше — в правом поддереве. Первая вершина, где пути разветвляются (или где текущий узел равен `p` или `q`), и является LCA. Сложность: $O(h)$ без обхода всего дерева.

   **Пример:**

   ```cpp
   TreeNode* lca_bst(TreeNode* root, TreeNode* p, TreeNode* q) {
       while (root) {
           if (p->val < root->val && q->val < root->val) root = root->left;
           else if (p->val > root->val && q->val > root->val) root = root->right;
           else return root; // Точка ветвления
       }
       return nullptr;
   }
   ```

   **Типичная ошибка:** Применение общего алгоритма LCA для произвольных деревьев без использования свойства упорядоченности BST.

   **Источник:** [LeetCode: Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

131. Как посчитать количество путей в бинарном дереве, сумма значений которых равна `targetSum`?

   **Ответ:** Комбинацией DFS и префиксных сумм с хеш-таблицей (аналог алгоритма для массивов). Накапливается текущая префиксная сумма пути от корня. Количество путей, заканчивающихся в текущем узле, равно числу вхождений `current_sum - targetSum` в хеш-таблицу частот. При выходе из рекурсии текущая сумма удаляется из таблицы (backtracking).

   **Пример:**

   ```cpp
   int dfs(TreeNode* node, long long curr_sum, int target, std::unordered_map<long long, int>& prefix) {
       if (!node) return 0;
       curr_sum += node->val;
       int count = prefix[curr_sum - target];
       prefix[curr_sum]++;
       count += dfs(node->left, curr_sum, target, prefix);
       count += dfs(node->right, curr_sum, target, prefix);
       prefix[curr_sum]--; // Backtrack
       return count;
   }
   ```

   **Типичная ошибка:** Забытый декремент счетчика суммы `prefix[curr_sum]--` при выходе из узла, из-за чего префиксные суммы из соседних поддеревьев влияют друг на друга.

   **Источник:** [LeetCode: Path Sum III](https://leetcode.com/problems/path-sum-iii/)

132. Как развернуть бинарное дерево зеркально (*invert/flip binary tree*)?

   **Ответ:** Для каждого узла рекурсивно или итеративно меняются местами указатели на левое и правое поддеревья, после чего операция повторяется для обоих потомков.

   **Пример:**

   ```cpp
   TreeNode* invert_tree(TreeNode* root) {
       if (!root) return nullptr;
       std::swap(root->left, root->right);
       invert_tree(root->left);
       invert_tree(root->right);
       return root;
   }
   ```

   **Типичная ошибка:** Обмен указателей после рекурсивного спуска без сохранения адресов, приводящий к повторному обходу одной и той же ветки.

   **Источник:** [LeetCode: Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)

133. Как выполнить сериализацию и десериализацию бинарного дерева?

   **Ответ:** В обходе preorder сохраняются значения узлов через разделитель, а пустые указатели кодируются маркером (например, `#` или `null`). При десериализации поток токенов разбирается последовательно: маркер `#` возвращает `nullptr`, а число конструирует узел с рекурсивным созданием детей.

   **Пример:**

   ```cpp
   void serialize(TreeNode* root, std::ostringstream& out) {
       if (!root) { out << "# "; return; }
       out << root->val << ' ';
       serialize(root->left, out);
       serialize(root->right, out);
   }

   TreeNode* deserialize(std::istringstream& in) {
       std::string val;
       if (!(in >> val) || val == "#") return nullptr;
       auto* root = new TreeNode{std::stoi(val), nullptr, nullptr};
       root->left = deserialize(in);
       root->right = deserialize(in);
       return root;
   }
   ```

   **Типичная ошибка:** Попытка сериализовать структуру дерева без явного сохранения терминальных маркеров нулевых указателей `nullptr`.

   **Источник:** [LeetCode: Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

134. Как реализовать симметричный обход (inorder) без использования рекурсии с помощью стека?

   **Ответ:** Указатель спускается влево до упора, складывая все пройденные узлы в стек. Когда спуск влево невозможен, узел извлекается из стека, обрабатывается его значение, а указатель переходит к правому поддереву узла.

   **Пример:**

   ```cpp
   std::vector<int> inorder_traversal(TreeNode* root) {
       std::vector<int> res;
       std::stack<TreeNode*> st;
       TreeNode* curr = root;
       while (curr || !st.empty()) {
           while (curr) {
               st.push(curr);
               curr = curr->left;
           }
           curr = st.top();
           st.pop();
           res.push_back(curr->val);
           curr = curr->right;
       }
       return res;
   }
   ```

   **Типичная ошибка:** Условие цикла `while (!st.empty())` без проверки `curr`, из-за чего алгоритм останавливается до обработки правого поддерева корня.

   **Источник:** [LeetCode: Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)

135. Как вычислить правый вид (*Right Side View*) бинарного дерева?

   **Ответ:** С помощью обхода в ширину (BFS / level-order). На каждом уровне дерева берется последний элемент уровня в очереди и сохраняется в ответ. Альтернативно — через DFS с приоритетом обхода «корень $\to$ правое $\to$ левое», добавляя узел в ответ, если текущая глубина равна текущему размеру массива результатов.

   **Пример:**

   ```cpp
   std::vector<int> right_side_view(TreeNode* root) {
       if (!root) return {};
       std::vector<int> view;
       std::queue<TreeNode*> q;
       q.push(root);
       while (!q.empty()) {
           size_t level_size = q.size();
           for (size_t i = 0; i < level_size; ++i) {
               TreeNode* node = q.front();
               q.pop();
               if (i == level_size - 1) view.push_back(node->val); // Последний элемент уровня
               if (node->left) q.push(node->left);
               if (node->right) q.push(node->right);
           }
       }
       return view;
   }
   ```

   **Типичная ошибка:** Спуск только по правым веткам `curr = curr->right`: если левое поддерево глубже правого, его выступающие нижние листья ошибочно пропускаются.

   **Источник:** [LeetCode: Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)

## 10. BST / Heap / Priority Queue


136. Как устроены операции вставки, удаления и поиска в BST и какова их сложность в среднем и худшем случаях?

   **Ответ:** Поиск и вставка спускаются влево или вправо в зависимости от сравнения с текущим ключом. Удаление рассматривает 3 случая: узел без детей (просто удаляется), с одним ребенком (заменяется им) и с двумя детьми (заменяется наименьшим узлом из правого поддерева, *in-order successor*). В среднем операции выполняются за $O(\log n)$, в худшем — за $O(n)$ при вырождении дерева в цепочку.

   **Пример:**

   ```cpp
   TreeNode* delete_node(TreeNode* root, int key) {
       if (!root) return nullptr;
       if (key < root->val) root->left = delete_node(root->left, key);
       else if (key > root->val) root->right = delete_node(root->right, key);
       else {
           if (!root->left) { auto* r = root->right; delete root; return r; }
           if (!root->right) { auto* l = root->left; delete root; return l; }
           TreeNode* succ = root->right;
           while (succ->left) succ = succ->left;
           root->val = succ->val;
           root->right = delete_node(root->right, succ->val);
       }
       return root;
   }
   ```

   **Типичная ошибка:** Забыть перелинковать родительский указатель при замене удаляемого узла его преемником.

   **Источник:** [Introduction to Algorithms (CLRS: Binary Search Trees)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

137. Почему несбалансированное BST может выродиться в связный список?

   **Ответ:** Если ключи поступают в монотонно возрастающем или убывающем порядке, каждый новый элемент всегда добавляется только в одну ветку (исключительно как правый или только как левый ребенок), превращая структуру дерева в односвязный список с высотой $h = n$.

   **Пример:**

   ```text
   Вставка 1, 2, 3, 4:
   1 -> right: 2 -> right: 3 -> right: 4 (глубина n вместо log n)
   ```

   **Типичная ошибка:** Использование наивного BST для хранения уже отсортированных данных без предварительного перемешивания или балансировки.

   **Источник:** [Algorithms, 4th Edition (Sedgewick, Wayne)](https://algs4.cs.princeton.edu/32bst/)

138. Чем AVL-дерево отличается от красно-черного дерева (Red-Black Tree) на концептуальном уровне?

   **Ответ:** AVL-дерево сбалансировано более строго: разница высот поддеревьев не превышает 1 (максимальная высота $\approx 1.44 \log_2 n$). Красно-черное дерево допускает двукратную разницу высот ветвей (высота $\le 2 \log_2 (n+1)$). Из-за этого AVL быстрее ищет (меньше глубина), но делает больше вращений при вставках и удалениях; красно-черное дерево быстрее модифицируется.

   **Пример:** `std::map` и `std::set` в STL обычно реализованы на красно-черных деревьях из-за меньшего числа ребалансировок при частых вставках и удалениях.

   **Типичная ошибка:** Попытка использовать AVL-дерево в сценариях с преобладанием вставок/удалений над операциями чтения.

   **Источник:** [Introduction to Algorithms (CLRS: Red-Black Trees)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

139. Как устроены min-heap и max-heap?

   **Ответ:** Это почти полные бинарные деревья (*complete binary trees*), упакованные в массив, где для каждого узла с индексом $i$ дети находятся на $2i + 1$ и $2i + 2$. В min-heap выполняется инвариант `parent <= child` (минимум всегда в корне `A[0]`), в max-heap — `parent >= child` (максимум в корне).

   **Пример:**

   ```cpp
   std::vector<int> max_heap = {9, 7, 6, 5, 2, 1}; // 9 - корень
   ```

   **Типичная ошибка:** Ожидание, что внутри массива кучи элементы полностью отсортированы слева направо.

   **Источник:** [Cppreference: std::make_heap](https://en.cppreference.com/w/cpp/algorithm/make_heap)

140. Как построить двоичную кучу за время $O(n)$, а не за $O(n \log n)$?

   **Ответ:** Алгоритмом Флойда: просеивание вниз (*sift-down*) применяется ко всем внутренним вершинам массива, начиная с индекса $\lfloor n/2 \rfloor - 1$ назад к корню. Сумма высот всех узлов сходится к $n \sum_{h=1}^{\infty} \frac{h}{2^h} = 2n = O(n)$.

   **Пример:**

   ```cpp
   std::vector<int> data = {4, 10, 3, 5, 1};
   std::make_heap(data.begin(), data.end()); // Линейное время O(n)
   ```

   **Типичная ошибка:** Построение кучи через последовательные вызовы `push` в пустой массив, что дает $O(n \log n)$.

   **Источник:** [Introduction to Algorithms (CLRS: Building a Heap)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

141. Как найти $k$ наибольших элементов массива через min-heap?

   **Ответ:** Поддерживается min-heap строго фиксированного размера $k$. Каждый элемент массива сравнивается с корнем кучи: если он больше минимума, корень удаляется, а новый элемент добавляется. В куче остаются ровно $k$ наибольших значений. Сложность: $O(n \log k)$ по времени, $O(k)$ по памяти.

   **Пример:**

   ```cpp
   std::vector<int> top_k_largest(const std::vector<int>& nums, int k) {
       std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;
       for (int x : nums) {
           min_pq.push(x);
           if (min_pq.size() > k) min_pq.pop();
       }
       std::vector<int> res;
       while (!min_pq.empty()) { res.push_back(min_pq.top()); min_pq.pop(); }
       return res;
   }
   ```

   **Типичная ошибка:** Использование max-heap со всеми $n$ элементами, требующее $O(n)$ дополнительной памяти вместо $O(k)$.

   **Источник:** [LeetCode: Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

142. Как объединить несколько отсортированных потоков данных с помощью кучи?

   **Ответ:** В min-кучу помещаются текущие головные элементы каждого потока вместе с идентификатором потока. На каждом шаге минимальный элемент извлекается в выходной поток, а следующий элемент из того же потока помещается в кучу. Сложность: $O(N \log K)$, где $K$ — число потоков, $N$ — общее число чисел.

   **Пример:**

   ```cpp
   struct StreamNode {
       int val, stream_id;
       bool operator>(const StreamNode& o) const { return val > o.val; }
   };
   std::priority_queue<StreamNode, std::vector<StreamNode>, std::greater<StreamNode>> pq;
   ```

   **Типичная ошибка:** Загрузка всех элементов всех потоков в память одновременно перед сортировкой.

   **Источник:** [Introduction to Algorithms (CLRS: Priority Queues)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

143. В каких сценариях `std::priority_queue` в C++ предпочтительнее `std::multiset`?

   **Ответ:** `std::priority_queue` хранит элементы в непрерывном векторе, не требует динамических аллокаций памяти под каждый отдельный узел и на порядки более кэш-дружелюбна. `std::multiset` нужен только тогда, когда требуется произвольный доступ, удаление элементов из середины или обход по диапазону.

   **Пример:** Алгоритм Дейкстры с `std::priority_queue` работает в 2–5 раз быстрее по тактам, чем на `std::set`, несмотря на одинаковую асимптотику.

   **Типичная ошибка:** Использование `std::multiset` в роли обычной очереди с приоритетами.

   **Источник:** [Cppreference: std::priority_queue](https://en.cppreference.com/w/cpp/container/priority_queue)

144. Как вычислить медиану непрерывного потока чисел с помощью двух куч?

   **Ответ:** Данные разделяются на две половины: max-куча `low` хранит меньшую половину, min-куча `high` — большую. Размеры куч поддерживаются равными или с перевесом `low` ровно на 1. Медиана — это либо вершина `low`, либо среднее арифметическое вершин обеих куч за $O(1)$.

   **Пример:**

   ```cpp
   class MedianFinder {
       std::priority_queue<int> max_h;                              // меньшая половина
       std::priority_queue<int, std::vector<int>, std::greater<int>> min_h; // большая половина
   public:
       void addNum(int num) {
           max_h.push(num);
           min_h.push(max_h.top());
           max_h.pop();
           if (max_h.size() < min_h.size()) {
               max_h.push(min_h.top());
               min_h.pop();
           }
       }
       double findMedian() const {
           if (max_h.size() > min_h.size()) return max_h.top();
           return (max_h.top() + min_h.top()) / 2.0;
       }
   };
   ```

   **Типичная ошибка:** Вставка числа в любую из куч без последующей проверки сохранения инварианта `max_h.top() <= min_h.top()`.

   **Источник:** [LeetCode: Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)

145. Как удалить произвольный элемент из кучи и почему стандартная `std::priority_queue` для этого неудобна?

   **Ответ:** Для удаления произвольного элемента нужно найти его индекс в массиве за $O(n)$, заменить последним элементом и вызвать `sift-up` или `sift-down` за $O(\log n)$. `std::priority_queue` не предоставляет доступ к базовому контейнеру и индексам элементов, поэтому на практике применяют «ленивое удаление» (пометку в хеш-таблице и отложенный `pop`).

   **Пример:**

   ```cpp
   // Ленивое удаление:
   std::unordered_map<int, int> deleted;
   void clean() {
       while (!pq.empty() && deleted[pq.top()] > 0) {
           deleted[pq.top()]--;
           pq.pop();
       }
   }
   ```

   **Типичная ошибка:** Попытка применить `const_cast` к `pq.top()` для ручной мутации ключа, что разрушает инвариант кучи.

   **Источник:** [C++ Core Guidelines: SL.con.1](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#slcon1-prefer-using-stl-vector-by-default)

146. Как работают процедуры просеивания вниз (sift-down) и вверх (sift-up)?

   **Ответ:**
   - **Sift-up:** при добавлении в конец узел сравнивается с родителем $\lfloor (i-1)/2 \rfloor$ и поднимается вверх обменами, пока нарушается свойство кучи;
   - **Sift-down:** при удалении корня последний элемент ставится в корень, сравнивается с наибольшим (в max-heap) из своих детей и спускается вниз обменами, пока не восстановит инвариант.

   **Пример:**

   ```cpp
   void sift_down(std::vector<int>& h, int i, int n) {
       while (2 * i + 1 < n) {
           int left = 2 * i + 1, right = 2 * i + 2, largest = i;
           if (h[left] > h[largest]) largest = left;
           if (right < n && h[right] > h[largest]) largest = right;
           if (largest == i) break;
           std::swap(h[i], h[largest]);
           i = largest;
       }
   }
   ```

   **Типичная ошибка:** Пропуск проверки существования правого ребенка `right < n` при поиске большего потомка.

   **Источник:** [Introduction to Algorithms (CLRS: Maintaining the Heap Property)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

147. Как найти $k$ самых частых элементов массива (Top K Frequent Elements)?

   **Ответ:** 1) Подсчитать частоты через `std::unordered_map<int, int>` за $O(n)$; 2) Использовать min-кучу пар `(частота, элемент)` размера $k$ за $O(n \log k)$, либо применить бакетную сортировку по частотам (*bucket sort*) за линейное время $O(n)$.

   **Пример:**

   ```cpp
   std::vector<int> top_k_frequent(const std::vector<int>& nums, int k) {
       std::unordered_map<int, int> counts;
       for (int x : nums) counts[x]++;
       using Pair = std::pair<int, int>; // (count, val)
       std::priority_queue<Pair, std::vector<Pair>, std::greater<Pair>> pq;
       for (const auto& [val, count] : counts) {
           pq.push({count, val});
           if (pq.size() > k) pq.pop();
       }
       std::vector<int> res;
       while (!pq.empty()) { res.push_back(pq.top().second); pq.pop(); }
       return res;
   }
   ```

   **Типичная ошибка:** Полная сортировка вектора пар всех уникальных элементов за $O(U \log U)$ вместо удержания $k$ элементов.

   **Источник:** [LeetCode: Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

148. В каких случаях дерево поиска (BST) подходит лучше, чем хеш-таблица?

   **Ответ:** Когда требуются: диапазонные запросы (*range queries*, нахождение всех ключей в отрезке $[A, B]$), нахождение ближайших соседей (`lower_bound` / `upper_bound`), обход данных в отсортированном порядке без дополнительной памяти, а также гарантированное отсутствие скачков времени на `rehash`.

   **Пример:** Поиск предыдущего и следующего значения таймстемпа в биржевом стакане.

   **Типичная ошибка:** Использование хеш-таблицы для задач поиска минимального элемента, превышающего заданный порог.

   **Источник:** [Cppreference: std::set](https://en.cppreference.com/w/cpp/container/set)

149. Как реализовать пользовательский компаратор для `std::priority_queue` в C++?

   **Ответ:** Передать структуру-функтор с `bool operator()`, лямбда-выражение (с передачей типа через `decltype`) или свободную функцию. Компаратор должен реализовывать строгий слабый порядок (*Strict Weak Ordering*). По умолчанию оператор `<` строит max-heap, поэтому для min-heap используют отношение `>`.

   **Пример:**

   ```cpp
   struct Compare {
       bool operator()(const Task& a, const Task& b) const {
           return a.priority > b.priority; // Min-heap: меньший приоритет на вершине
       }
   };
   std::priority_queue<Task, std::vector<Task>, Compare> pq;
   ```

   **Типичная ошибка:** Использование нестрогого неравенства `>=` или `<=`, что нарушает Strict Weak Ordering и приводит к неопределенному поведению.

   **Источник:** [Cppreference: std::priority_queue](https://en.cppreference.com/w/cpp/container/priority_queue)

150. Как за линейное время проверить, является ли произвольный массив представлением корректной кучи?

   **Ответ:** Достаточно проверить инвариант кучи для всех узлов, имеющих хотя бы одного ребенка (индексы от $0$ до $\lfloor (n - 2) / 2 \rfloor$). В стандартной библиотеке C++ для этого предусмотрена функция `std::is_heap`.

   **Пример:**

   ```cpp
   bool is_max_heap(const std::vector<int>& a) {
       int n = static_cast<int>(a.size());
       for (int i = 0; i <= (n - 2) / 2; ++i) {
           if (2 * i + 1 < n && a[i] < a[2 * i + 1]) return false;
           if (2 * i + 2 < n && a[i] < a[2 * i + 2]) return false;
       }
       return true;
       // или просто: return std::is_heap(a.begin(), a.end());
   }
   ```

   **Типичная ошибка:** Проход циклом до самого конца массива $n-1$, вызывающий выход за пределы вектора при вычислении $2i + 1$.

   **Источник:** [Cppreference: std::is_heap](https://en.cppreference.com/w/cpp/algorithm/is_heap)


   ---

## 11. Графы: базовые обходы


151. Что такое список смежности и матрица смежности и когда следует выбирать каждый из них?

   **Ответ:** Список смежности (`std::vector<std::vector<int>>`) хранит соседей каждой вершины; требует $O(V + E)$ памяти и оптимален для разреженных графов ($E \ll V^2$). Матрица смежности (`vector<vector<bool>>` размера $V \times V$) требует $O(V^2)$ памяти, позволяет проверять наличие ребра за $O(1)$ и удобна для плотных графов ($E \approx V^2$) или алгоритма Флойда-Уоршелла.

   **Пример:**

   ```cpp
   std::vector<std::vector<int>> adj_list(V); // Разреженный граф
   adj_list[u].push_back(v);
   ```

   **Типичная ошибка:** Выделение матрицы смежности $10^5 \times 10^5$, приводящее к аварийному исчерпанию памяти (OOM).

   **Источник:** [Introduction to Algorithms (CLRS: Representations of graphs)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

152. Каковы временная и пространственная сложности алгоритмов BFS и DFS?

   **Ответ:**
   - **Время:** $O(V + E)$ при представлении списком смежности (каждая вершина и каждое ребро просматриваются константное число раз); $O(V^2)$ при матрице смежности.
   - **Память:** $O(V)$ для хранения массива посещенности и очереди (BFS) или стека вызовов (DFS).

   **Пример:** Обход графа из миллиона вершин и двух миллионов ребер занимает линейное время $O(V + E)$ за доли секунды.

   **Типичная ошибка:** Оценка сложности как $O(E)$ без учета изолированных вершин $V$.

   **Источник:** [Algorithms, 4th Edition: Undirected Graphs](https://algs4.cs.princeton.edu/41graph/)

153. Как с помощью BFS найти кратчайший путь в невзвешенном графе?

   **Ответ:** BFS обходит вершины строго по слоям увеличения расстояния от стартовой (волна). Первое достижение любой вершины $U$ из старта гарантированно происходит по пути с минимальным числом ребер.

   **Пример:**

   ```cpp
   std::vector<int> bfs_dist(int start, const std::vector<std::vector<int>>& adj) {
       std::vector<int> dist(adj.size(), -1);
       std::queue<int> q;
       dist[start] = 0;
       q.push(start);
       while (!q.empty()) {
           int u = q.front(); q.pop();
           for (int v : adj[u]) {
               if (dist[v] == -1) {
                   dist[v] = dist[u] + 1;
                   q.push(v);
               }
           }
       }
       return dist;
   }
   ```

   **Типичная ошибка:** Попытка искать кратчайший путь в невзвешенном графе с помощью алгоритма Дейкстры (создает лишние накладные расходы на логарифм кучи).

   **Источник:** [CP-Algorithms: Breadth-first search](https://cp-algorithms.com/graph/breadth-first-search.html)

154. Как восстановить сам кратчайший путь после выполнения BFS?

   **Ответ:** Поддерживается массив предков `parent`, где `parent[v] = u` фиксируется в момент добавления вершины `v` в очередь. После завершения BFS путь восстанавливается разворотом цепочки переходов от целевой вершины к стартовой по указателям предков.

   **Пример:**

   ```cpp
   std::vector<int> restore_path(int target, const std::vector<int>& parent) {
       std::vector<int> path;
       for (int v = target; v != -1; v = parent[v]) path.push_back(v);
       std::reverse(path.begin(), path.end());
       return path;
   }
   ```

   **Типичная ошибка:** Добавление полного пути в очередь вместе с каждой вершиной, что увеличивает затраты памяти до $O(V^2)$.

   **Источник:** [CP-Algorithms: BFS Path Restoration](https://cp-algorithms.com/graph/breadth-first-search.html)

155. Как найти количество компонент связности в неориентированном графе?

   **Ответ:** Массив посещенности `visited` инициализируется ложью. Внешний цикл обходит все вершины от $0$ до $V-1$: если вершина не посещена, инкрементируется счетчик компонент и запускается обход (DFS или BFS), помечающий всю ее компоненту связности.

   **Пример:**

   ```cpp
   int count_components(int n, const std::vector<std::vector<int>>& adj) {
       std::vector<bool> visited(n, false);
       int count = 0;
       auto dfs = [&](auto self, int u) -> void {
           visited[u] = true;
           for (int v : adj[u]) if (!visited[v]) self(self, v);
       };
       for (int i = 0; i < n; ++i) {
           if (!visited[i]) { count++; dfs(dfs, i); }
       }
       return count;
   }
   ```

   **Типичная ошибка:** Перезапуск обхода из каждой вершины без проверки флага `visited[i]`.

   **Источник:** [LeetCode: Number of Provinces](https://leetcode.com/problems/number-of-provinces/)

156. Как проверить, является ли граф двудольным (bipartite)?

   **Ответ:** Вершины раскрашиваются в 2 цвета (например, 0 и 1) с помощью BFS или DFS. Стартовая вершина красится в 0, все ее соседи — в противоположный цвет $(1 - \text{color})$. Если при обходе обнаруживается ребро между вершинами одинакового цвета, граф содержит нечетный цикл и не является двудольным.

   **Пример:**

   ```cpp
   bool is_bipartite(const std::vector<std::vector<int>>& adj) {
       std::vector<int> color(adj.size(), -1);
       for (int i = 0; i < adj.size(); ++i) {
           if (color[i] != -1) continue;
           std::queue<int> q;
           q.push(i); color[i] = 0;
           while (!q.empty()) {
               int u = q.front(); q.pop();
               for (int v : adj[u]) {
                   if (color[v] == -1) {
                       color[v] = 1 - color[u];
                       q.push(v);
                   } else if (color[v] == color[u]) return false;
               }
           }
       }
       return true;
   }
   ```

   **Типичная ошибка:** Проверка только одной компоненты связности вместо обхода всех компонент графа.

   **Источник:** [LeetCode: Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/)

157. Как обнаружить цикл в неориентированном графе с помощью DFS?

   **Ответ:** В DFS передаются текущая вершина `u` и ее предок `parent`. Если в процессе обхода встречается уже посещенная вершина `v`, и она не является непосредственным предком (`v != parent`), в графе найден цикл.

   **Пример:**

   ```cpp
   bool has_cycle_undirected(int u, int p, const std::vector<std::vector<int>>& adj, std::vector<bool>& vis) {
       vis[u] = true;
       for (int v : adj[u]) {
           if (!vis[v]) {
               if (has_cycle_undirected(v, u, adj, vis)) return true;
           } else if (v != p) return true;
       }
       return false;
   }
   ```

   **Типичная ошибка:** Считать обратным ребром переход назад в непосредственного предка `parent` в неориентированном ребре.

   **Источник:** [Introduction to Algorithms (CLRS: Depth-First Search)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

158. Как обнаружить цикл в ориентированном графе?

   **Ответ:** С помощью трех цветов (состояний вершин в DFS). Цикл существует тогда и только тогда, когда алгоритм находит обратное ребро (*back edge*) — переход в вершину, которая в данный момент находится в стеке рекурсии (серый цвет).

   **Пример:**

   ```cpp
   enum Color { White, Gray, Black };
   bool has_cycle_directed(int u, const std::vector<std::vector<int>>& adj, std::vector<Color>& color) {
       color[u] = Gray;
       for (int v : adj[u]) {
           if (color[v] == Gray) return true; // Найдено обратное ребро -> цикл
           if (color[v] == White && has_cycle_directed(v, adj, color)) return true;
       }
       color[u] = Black;
       return false;
   }
   ```

   **Типичная ошибка:** Использование простого бинарного флага `visited`: переход в уже завершенную (черную) вершину в ориентированном графе не свидетельствует о наличии цикла.

   **Источник:** [LeetCode: Course Schedule](https://leetcode.com/problems/course-schedule/)

159. Что означают три цвета состояний в DFS и какую задачу они решают?

   **Ответ:**
   - **Белый (White):** вершина еще не исследована;
   - **Серый (Gray):** вершина взята в обработку, ее потомки прямо сейчас исследуются (находится в стеке вызовов DFS);
   - **Черный (Black):** все потомки вершины полностью обработаны, поддерево завершено.
   Они позволяют строго классифицировать ребра (древесные, обратные, прямые, перекрестные) и находить циклы в ориентированных графах.

   **Пример:** Серый цвет идентифицирует незамкнутый активный путь в ориентированном графе.

   **Типичная ошибка:** Смешение серых и черных вершин при попытке топологической сортировки.

   **Источник:** [Introduction to Algorithms (CLRS: Depth-First Search)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

160. Как реализовать топологическую сортировку ориентированного ациклического графа (DAG)? Назови два основных способа.

   **Ответ:**

1. **Алгоритм Кана (BFS):** вычисляются входящие степени (`in-degree`) всех вершин. Вершины с нулевой степенью помещаются в очередь. При извлечении вершины у ее соседей декрементируется `in-degree`; когда степень соседа становится 0, он кладется в очередь.

2. **DFS (постфиксный порядок):** запускается DFS; при выходе из черной вершины она добавляется в стек/список. Итоговый топологический порядок получается разворотом этого списка.

   **Пример (Алгоритм Кана):**

   ```cpp
   std::vector<int> topo_sort_kahn(int n, const std::vector<std::vector<int>>& adj) {
       std::vector<int> in_deg(n, 0), order;
       for (int u = 0; u < n; ++u) for (int v : adj[u]) in_deg[v]++;
       std::queue<int> q;
       for (int i = 0; i < n; ++i) if (in_deg[i] == 0) q.push(i);
       while (!q.empty()) {
           int u = q.front(); q.pop();
           order.push_back(u);
           for (int v : adj[u]) if (--in_deg[v] == 0) q.push(v);
       }
       return order.size() == n ? order : std::vector<int>{};
   }
   ```

   **Типичная ошибка:** Добавление вершины в топологический порядок при входе в DFS вместо момента завершения обработки узла (выхода).

   **Источник:** [LeetCode: Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

161. Как проверить, существует ли топологический порядок для заданного графа?

   **Ответ:** Топологический порядок существует тогда и только тогда, когда ориентированный граф не содержит циклов (является DAG). Это проверяется либо обнаружением серой вершины в DFS, либо тем, что размер итогового порядка в алгоритме Кана строго равен общему числу вершин $V$.

   **Пример:** Если `order.size() < V`, граф содержит цикл, и топологический порядок построить невозможно.

   **Типичная ошибка:** Применение топологической сортировки к графам с циклами без валидации результата.

   **Источник:** [CP-Algorithms: Topological Sorting](https://cp-algorithms.com/graph/topological_sort.html)

162. Как найти все вершины графа, достижимые из заданного набора стартовых вершин?

   **Ответ:** Все стартовые вершины одновременно помещаются в очередь BFS (или массив посещенности) со статусом `visited = true`. Запускается единый обход графа (Multi-source BFS/DFS). Все посещенные вершины формируют множество достижимых узлов за суммарное время $O(V + E)$.

   **Пример:**

   ```cpp
   std::vector<bool> find_reachable(int n, const std::vector<int>& sources,
                                    const std::vector<std::vector<int>>& adj) {
       std::vector<bool> vis(n, false);
       std::queue<int> q;
       for (int s : sources) { vis[s] = true; q.push(s); }
       while (!q.empty()) {
           int u = q.front(); q.pop();
           for (int v : adj[u]) {
               if (!vis[v]) { vis[v] = true; q.push(v); }
           }
       }
       return vis;
   }
   ```

   **Типичная ошибка:** Перезапуск отдельного обхода из каждого источника $S$, что увеличивает сложность до $O(S \cdot (V + E))$.

   **Источник:** [Introduction to Algorithms (CLRS: BFS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

163. Как найти кратчайший путь в двумерном лабиринте с препятствиями?

   **Ответ:** Лабиринт рассматривается как неявный граф, где клетки — это вершины, а переходы в 4 стороны (вверх, вниз, влево, вправо) на свободные клетки — ненаправленные ребра единичного веса. Используется BFS с очередью координат `(row, col)`.

   **Пример:**

   ```cpp
   int shortest_path_maze(const std::vector<std::vector<int>>& grid, std::pair<int,int> start, std::pair<int,int> end) {
       int R = grid.size(), C = grid[0].size();
       std::vector<std::vector<int>> dist(R, std::vector<int>(C, -1));
       std::queue<std::pair<int, int>> q;
       q.push(start); dist[start.first][start.second] = 0;
       int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
       while (!q.empty()) {
           auto [r, c] = q.front(); q.pop();
           if (r == end.first && c == end.second) return dist[r][c];
           for (int i = 0; i < 4; ++i) {
               int nr = r + dr[i], nc = c + dc[i];
               if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 0 && dist[nr][nc] == -1) {
                   dist[nr][nc] = dist[r][c] + 1;
                   q.push({nr, nc});
               }
           }
       }
       return -1;
   }
   ```

   **Типичная ошибка:** Использование алгоритма DFS для поиска кратчайшего пути в матрице (DFS находит произвольный, а не кратчайший путь).

   **Источник:** [LeetCode: Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

164. Что такое Multi-source BFS и как он работает?

   **Ответ:** Это модификация BFS, в которой на шаге 0 в очередь помещаются не одна, а сразу все начальные вершины (источники) с нулевым расстоянием. Волны распространяются от всех источников параллельно, вычисляя кратчайшее расстояние от любой клетки до ближайшего к ней источника за общий один проход $O(V + E)$.

   **Пример:** Задача распространения огня или вычисление расстояния от каждой клетки матрицы до ближайшего нуля.

   **Типичная ошибка:** Запуск обычного BFS от каждого источника по очереди с пересчетом матрицы расстояний за $O(K \cdot V)$.

   **Источник:** [LeetCode: 01 Matrix](https://leetcode.com/problems/01-matrix/)

165. Как эффективно представить граф со строковыми именами вершин в C++?

   **Ответ:** Каждой уникальной строке сопоставляется целочисленный идентификатор $0, 1, \dots, V-1$ с помощью хеш-таблицы `std::unordered_map<std::string, int>`, а для обратной связи используется массив `std::vector<std::string>`. Сам граф строится на базе быстрых целочисленных списков смежности `std::vector<std::vector<int>>`.

   **Пример:**

   ```cpp
   class StringGraph {
       std::unordered_map<std::string, int> name_to_id;
       std::vector<std::string> id_to_name;
       std::vector<std::vector<int>> adj;
   public:
       int get_or_create_id(const std::string& name) {
           if (!name_to_id.contains(name)) {
               name_to_id[name] = id_to_name.size();
               id_to_name.push_back(name);
               adj.emplace_back();
           }
           return name_to_id[name];
       }
       void add_edge(const std::string& u, const std::string& v) {
           adj[get_or_create_id(u)].push_back(get_or_create_id(v));
       }
   };
   ```

   **Типичная ошибка:** Хранение графа напрямую в виде `std::unordered_map<std::string, std::vector<std::string>>`, что многократно замедляет обходы из-за непрерывных аллокаций строк и вычислений хешей на каждом ребре.

   **Источник:** [CP-Algorithms: String Hashing and Graph Indexing](https://cp-algorithms.com/)

## 12. Графы: кратчайшие пути и MST


166. Когда следует использовать алгоритм Дейкстры, а когда обычный BFS?

   **Ответ:** BFS применяется исключительно для невзвешенных графов (или графов, где все ребра имеют одинаковый положительный вес), находя кратчайший путь за линейное время $O(V + E)$. Алгоритм Дейкстры применяется для взвешенных графов с неотрицательными весами ребер, обеспечивая сложность $O((V + E) \log V)$ с использованием очереди с приоритетами.

   **Пример:**

   ```cpp
   // Ребра единичной длины: BFS за O(V + E)
   // Ребра с весами w >= 0: std::priority_queue (Dijkstra) за O(E log V)
   ```

   **Типичная ошибка:** Использование алгоритма Дейкстры в невзвешенных сетях или сетках лабиринтов, что вводит лишний логарифмический множитель и замедляет работу программы.

   **Источник:** [Introduction to Algorithms (CLRS: Single-Source Shortest Paths)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

167. Почему алгоритм Дейкстры не работает на графах с отрицательными весами ребер?

   **Ответ:** Алгоритм Дейкстры опирается на «жадный» выбор: извлеченное из кучи минимальное расстояние до вершины $u$ считается окончательным и более не пересчитывается. Наличие отрицательных ребер нарушает это свойство: путь через вершину с изначально большим расстоянием может стать суммарно короче после прохождения отрицательного ребра.

   **Пример:** Ребра $A \to B$ (вес 5), $A \to C$ (вес 2), $C \to B$ (вес -10). Дейкстра зафиксирует расстояние до $B$ равным 5, хотя реальный кратчайший путь равен $2 + (-10) = -8$.

   **Типичная ошибка:** Попытка прибавить ко всем ребрам графа большую положительную константу $C$, забывая, что пути с разным числом ребер получают неравномерную прибавку ($k \cdot C$).

   **Источник:** [CP-Algorithms: Dijkstra's Algorithm](https://cp-algorithms.com/graph/dijkstra.html)

168. Как реализовать алгоритм Дейкстры с использованием `std::priority_queue` в C++?

   **Ответ:** Используется min-куча пар `(расстояние, вершина)` с компаратором `std::greater`. При извлечении вершины проверяется условие устаревания (`d > dist[u]`), после чего выполняется релаксация всех исходящих ребер с добавлением новых пар в очередь.

   **Пример:**

   ```cpp
   using Pair = std::pair<int, int>; // (dist, u)
   std::vector<int> dijkstra(int start, const std::vector<std::vector<Pair>>& adj) {
       std::vector<int> dist(adj.size(), std::numeric_limits<int>::max());
       std::priority_queue<Pair, std::vector<Pair>, std::greater<Pair>> pq;
       dist[start] = 0;
       pq.push({0, start});
       while (!pq.empty()) {
           auto [d, u] = pq.top();
           pq.pop();
           if (d > dist[u]) continue; // Пропуск устаревшей записи
           for (auto [v, w] : adj[u]) {
               if (dist[u] + w < dist[v]) {
                   dist[v] = dist[u] + w;
                   pq.push({dist[v], v});
               }
           }
       }
       return dist;
   }
   ```

   **Типичная ошибка:** Забытая проверка `if (d > dist[u]) continue;`, из-за чего алгоритм обрабатывает одну и ту же вершину множество раз, ухудшая время до $O(V \cdot E)$.

   **Источник:** [Cppreference: std::priority_queue](https://en.cppreference.com/w/cpp/container/priority_queue)

169. Почему в стандартной реализации Дейкстры на C++ допускают наличие устаревших вершин в куче?

   **Ответ:** Стандартный контейнер `std::priority_queue` не поддерживает операцию `decrease-key` (изменение приоритета существующего элемента за $O(\log n)$). Вместо этого используется ленивый подход: новое меньшее расстояние просто добавляется в кучу новой записью, а старые неактуальные копии отсекаются условием `d > dist[u]` при извлечении.

   **Пример:** Размер кучи может временно достигать $O(E)$ вместо $O(V)$, но это сохраняет общую сложность $O(E \log E) = O(E \log V)$.

   **Типичная ошибка:** Попытка эмулировать `decrease-key` через удаление и повторную вставку в `std::set`, что на практике часто работает медленнее из-за постоянных аллокаций узлов дерева.

   **Источник:** [Competitive Programmer's Handbook (Antti Laaksonen: Chapter 13)](https://cses.fi/book/book.pdf)

170. Как устроен алгоритм Беллмана–Форда и какие задачи он решает в отличие от алгоритма Дейкстры?

   **Ответ:** Алгоритм совершает $V - 1$ фаз релаксации всех ребер графа. В отличие от Дейкстры, он корректно работает на графах с произвольными (включая отрицательные) весами ребер и позволяет гарантированно обнаруживать наличие циклов отрицательного веса за время $O(V \cdot E)$.

   **Пример:**

   ```cpp
   struct Edge { int u, v, w; };
   std::vector<int> bellman_ford(int n, int start, const std::vector<Edge>& edges) {
       std::vector<int> dist(n, 1e9);
       dist[start] = 0;
       for (int i = 0; i < n - 1; ++i) {
           for (const auto& [u, v, w] : edges) {
               if (dist[u] < 1e9 && dist[u] + w < dist[v]) {
                   dist[v] = dist[u] + w;
               }
           }
       }
       return dist;
   }
   ```

   **Типичная ошибка:** Релаксация ребер от вершин, до которых путь еще не найден (`dist[u] == INF`), что при наличии отрицательных ребер может порождать фантомные расстояния.

   **Источник:** [CP-Algorithms: Bellman-Ford](https://cp-algorithms.com/graph/bellman_ford.html)

171. Как обнаружить наличие цикла отрицательного веса с помощью алгоритма Беллмана–Форда?

   **Ответ:** После выполнения основных $V - 1$ итераций релаксации запускается $V$-я фаза: если хотя бы одно ребро удается отрелаксировать (`dist[u] + w < dist[v]`), значит, это ребро лежит на цикле отрицательного веса или достижимо из него.

   **Пример:**

   ```cpp
   bool has_negative_cycle(int n, const std::vector<Edge>& edges, std::vector<int>& dist) {
       for (const auto& [u, v, w] : edges) {
           if (dist[u] < 1e9 && dist[u] + w < dist[v]) return true;
       }
       return false;
   }
   ```

   **Типичная ошибка:** Поиск отрицательного цикла только из одной стартовой вершины, если в графе есть несвязные компоненты с отрицательными циклами (требуется инициализировать `dist[i] = 0` для всех вершин).

   **Источник:** [Introduction to Algorithms (CLRS: Negative-weight cycles)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

172. Как работает алгоритм Флойда–Уоршелла и какова его сложность?

   **Ответ:** Алгоритм основан на динамическом программировании и находит кратчайшие расстояния между всеми парами вершин за время $\Theta(V^3)$ и память $O(V^2)$. На шаге $k$ проверяется, улучшится ли путь между $i$ и $j$, если пройти через промежуточную вершину $k$: $D[i][j] = \min(D[i][j], D[i][k] + D[k][j])$.

   **Пример:**

   ```cpp
   void floyd_warshall(std::vector<std::vector<int>>& d, int n) {
       for (int k = 0; k < n; ++k)
           for (int i = 0; i < n; ++i)
               for (int j = 0; j < n; ++j)
                   if (d[i][k] < 1e9 && d[k][j] < 1e9)
                       d[i][j] = std::min(d[i][j], d[i][k] + d[k][j]);
   }
   ```

   **Типичная ошибка:** Помещение внешнего цикла по $k$ внутрь циклов по $i$ и $j$, что полностью разрушает инвариант динамического программирования.

   **Источник:** [CP-Algorithms: Floyd-Warshall Algorithm](https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html)

173. Когда задачу All-Pairs Shortest Paths выгоднее решать серией запусков Дейкстры вместо алгоритма Флойда–Уоршелла?

   **Ответ:** На разреженных графах ($E \ll V^2$) с неотрицательными весами. Запуск алгоритма Дейкстры из каждой вершины $V$ раз дает сложность $O(V \cdot E \log V)$, что при $E \approx V$ составляет $O(V^2 \log V)$, что существенно быстрее $\Theta(V^3)$ алгоритма Флойда–Уоршелла.

   **Пример:** Для дорожной сети из $10^4$ перекрестков и $3 \cdot 10^4$ дорог Флойд требует $10^{12}$ операций (нереализуемо), а $V$ запусков Дейкстры — около $4 \cdot 10^9$ тактов.

   **Типичная ошибка:** Запуск Дейкстры на графах с отрицательными ребрами (в таких случаях для всех пар применяют алгоритм Джонсона).

   **Источник:** [Introduction to Algorithms (CLRS: Johnson's algorithm)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

174. Что такое MST (минимальное остовное дерево) и чем алгоритм Краскала концептуально отличается от алгоритма Прима?

   **Ответ:** MST — подграф связного взвешенного неориентированного графа, являющийся деревом, соединяющий все вершины и имеющий минимальный суммарный вес ребер. Алгоритм Краскала жадно собирает ребра по всему графу с помощью DSU в порядке возрастания веса; алгоритм Прима жадно наращивает одно связное дерево из стартовой вершины с помощью кучи.

   **Пример:** Краскал оптимален для разреженных графов ($O(E \log E)$), Прим на матрице смежности — для плотных ($O(V^2)$).

   **Типичная ошибка:** Попытка построить MST для ориентированного графа алгоритмами Краскала или Прима (для орграфов требуется алгоритм Чу-Лю / Эдмондса).

   **Источник:** [Cppreference: Minimum spanning tree](https://en.wikipedia.org/wiki/Minimum_spanning_tree)

175. Какую роль играет DSU (система непересекающихся множеств) в алгоритме Краскала?

   **Ответ:** DSU используется для проверки того, принадлежат ли концы текущего ребра $(u, v)$ одной компоненте связности, и их объединения за почти константное время $O(\alpha(V))$. Это исключает образование циклов при добавлении ребра в остов.

   **Пример:**

   ```cpp
   // Внутри Краскала:
   if (dsu.find(u) != dsu.find(v)) {
       mst_weight += w;
       dsu.unite(u, v);
   }
   ```

   **Типичная ошибка:** Проверка связности через DFS/BFS на каждом шаге алгоритма Краскала, что замедляет его работу до квадратичного времени $O(E \cdot V)$.

   **Источник:** [CP-Algorithms: Kruskal with DSU](https://cp-algorithms.com/graph/mst_kruskal.html)

176. Как эффективно отсортировать ребра графа в C++, избегая лишнего копирования?

   **Ответ:** Использовать плоскую структуру данных с компактным представлением полей (`int u, v; int weight;`) и передавать ее в `std::sort` по константной ссылке внутри лямбды, либо сортировать массив индексов ребер.

   **Пример:**

   ```cpp
   struct Edge { int u, v, w; };
   std::vector<Edge> edges;
   // Сортировка на месте без копирования объектов:
   std::sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {
       return a.w < b.w;
   });
   ```

   **Типичная ошибка:** Создание `std::vector<std::pair<int, std::pair<int, int>>>`, вызывающее синтаксический шум и падение производительности при распаковке кортежей.

   **Источник:** [C++ Core Guidelines: F.16](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f16-for-in-parameters-pass-cheaply-copied-types-by-value-and-others-by-reference-to-const)

177. Как найти второе минимальное остовное дерево (*Second-Best MST*)?

   **Ответ:** 1) Построить исходное MST; 2) Для каждого ребра $(u, v)$ не из MST найти максимальное по весу ребро на пути между $u$ и $v$ в самом дереве MST (через двоичные подъемы / Binary Lifting); 3) Вычислить минимальную разницу $\text{weight}(u, v) - \text{max\_edge}(u, v)$ и прибавить ее к весу базового MST. Общая сложность: $O(E \log V)$.

   **Пример:** Добавление ребра не из дерева образует ровно один цикл, разрыв которого по самому тяжелому ребру дерева дает новый остов.

   **Типичная ошибка:** Полный пересчет алгоритма Краскала с поочередным удалением каждого из $V - 1$ ребер MST за время $O(E \cdot V \log E)$ на больших графах.

   **Источник:** [CP-Algorithms: Second Best Minimum Spanning Tree](https://cp-algorithms.com/graph/second_best_mst.html)

178. Как проверить, является ли найденное минимальное остовное дерево единственным?

   **Ответ:** Дерево уникально, если вес второго минимального остова строго больше веса первого MST. Альтернативно: если в процессе работы алгоритма Краскала среди ребер одинакового веса существует выбор, позволяющий объединить одни и те же компоненты альтернативным ребром, MST не единственно.

   **Пример:** Если граф содержит несколько ребер равного веса, соединяющих одни и те же компоненты, MST может быть неединственным.

   **Типичная ошибка:** Предположение, что уникальность всех весов ребер в графе необязательна для уникальности MST (если все веса уникальны, MST гарантированно единственно).

   **Источник:** [GeeksforGeeks: Check if a given Spanning Tree is Unique](https://www.geeksforgeeks.org/check-if-a-given-spanning-tree-is-unique-or-not/)

179. Как найти все мосты (критические ребра) в неориентированном графе за время $O(V + E)$?

   **Ответ:** Используется алгоритм Тарьяна на базе DFS с подсчетом времени входа `tin[u]` и минимального времени достижимости предков `low[u]`. Ребро $(u, v)$ является мостом тогда и только тогда, когда $low[v] > tin[u]$ (из поддерева вершины $v$ нет пути в предков $u$).

   **Пример:**

   ```cpp
   void dfs_bridges(int u, int p, int& timer, const auto& adj, auto& tin, auto& low, auto& bridges) {
       tin[u] = low[u] = ++timer;
       for (int v : adj[u]) {
           if (v == p) continue;
           if (tin[v]) {
               low[u] = std::min(low[u], tin[v]);
           } else {
               dfs_bridges(v, u, timer, adj, tin, low, bridges);
               low[u] = std::min(low[u], low[v]);
               if (low[v] > tin[u]) bridges.push_back({u, v});
           }
       }
   }
   ```

   **Типичная ошибка:** Обновление `low[u] = std::min(low[u], low[v])` для обратного ребра вместо `low[u] = std::min(low[u], tin[v])`.

   **Источник:** [CP-Algorithms: Finding Bridges in $O(V+E)$](https://cp-algorithms.com/graph/bridge-searching.html)

180. Как найти точки сочленения (шарниры) в графе?

   **Ответ:** Также с помощью DFS и величин `tin[u]` и `low[u]`. Вершина $u$ является точкой сочленения, если: 1) Она корень дерева DFS и имеет $\ge 2$ дочерних ветвей; 2) Она не корень, и у нее есть ребенок $v$, для которого $low[v] \ge tin[u]$ (из поддерева $v$ нельзя подняться выше $u$).

   **Пример:**

   ```cpp
   if (p != -1 && low[v] >= tin[u]) is_cutpoint[u] = true;
   if (p == -1 && children > 1) is_cutpoint[u] = true;
   ```

   **Типичная ошибка:** Забытая особая обработка корневой вершины DFS (у корня условие $low[v] \ge tin[u]$ выполняется всегда, но шарниром он является только при наличии двух и более независимых ветвей).

   **Источник:** [CP-Algorithms: Finding Articulation Points](https://cp-algorithms.com/graph/cutpoints.html)


   ---

## 13. DSU / Union-Find


181. Как реализовать DSU со сжатием путей (*path compression*) и эвристикой по размеру (*union by size*)?

   **Ответ:** Вектор `parent` хранит предков (или $-1$, если корень), а вектор `size` — размеры деревьев. При вызове `find(u)` предок рекурсивно перепривязывается напрямую к корню, а в `unite(u, v)` меньшее дерево подвешивается к корню большего.

   **Пример:**

   ```cpp
   class DSU {
       std::vector<int> parent, sz;
   public:
       explicit DSU(int n) : parent(n), sz(n, 1) {
           std::iota(parent.begin(), parent.end(), 0);
       }
       int find(int u) {
           if (u == parent[u]) return u;
           return parent[u] = find(parent[u]); // Path compression
       }
       bool unite(int u, int v) {
           int root_u = find(u), root_v = find(v);
           if (root_u == root_v) return false;
           if (sz[root_u] < sz[root_v]) std::swap(root_u, root_v);
           parent[root_v] = root_u; // Union by size
           sz[root_u] += sz[root_v];
           return true;
       }
   };
   ```

   **Типичная ошибка:** Присваивание `parent[u] = v` напрямую без предварительного нахождения корней обоих элементов через `find()`.

   **Источник:** [CP-Algorithms: Disjoint Set Union](https://cp-algorithms.com/data_structures/disjoint_set_union.html)

182. Почему амортизированная сложность операций DSU считается практически константной?

   **Ответ:** Комбинация сжатия путей и ранговой эвристики обеспечивает амортизированную сложность одной операции $O(\alpha(n))$, где $\alpha(n)$ — обратная функция Аккермана. Для любых физически мыслимых размеров данных ($n < 10^{600}$) значение $\alpha(n) \le 4$, что на практике неотличимо от строгого $O(1)$.

   **Пример:** Выполнение миллиона операций `find` и `unite` требует не более нескольких миллисекунд.

   **Типичная ошибка:** Отказ от обеих оптимизаций: без них глубина дерева может вырасти до $O(n)$, деградируя цепочку вызовов до $O(n^2)$.

   **Источник:** [Introduction to Algorithms (CLRS: Analysis of union by rank with path compression)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

183. Как с помощью DSU поддерживать количество компонент связности после каждой операции `union`?

   **Ответ:** Счетчик компонент инициализируется числом вершин $N$. При каждом вызове метода `unite(u, v)`, если корни элементов не совпали и объединение фактически состоялось, счетчик уменьшается на единицу за время $O(\alpha(n))$.

   **Пример:**

   ```cpp
   int components_count = n;
   if (dsu.unite(u, v)) {
       components_count--; // Число компонент уменьшилось
   }
   ```

   **Типичная ошибка:** Попытка полного подсчета уникальных корней циклом по всем вершинам после каждого запроса, что увеличивает сложность до $O(V \cdot Q)$.

   **Источник:** [LeetCode: Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)

184. Как решать задачу динамической связности в offline-постановке с помощью DSU?

   **Ответ:** Запросы разворота ребер и изменений во времени моделируются деревом отрезков по временной шкале запросов. Ребра добавляются на свои отрезки жизни, дерево обходится алгоритмом DFS с добавлением ребер в DSU с поддержкой отката (*Rollback DSU*) и последующим откатом изменений при выходе из узла дерева за $O(Q \log Q \log V)$.

   **Пример:** Добавление и удаление ребер по времени сводится к обходу дерева отрезков без фактического удаления ребер из классического DSU.

   **Типичная ошибка:** Попытка использовать классический DSU с path compression для прямого удаления ребер (path compression уничтожает топологию дерева и препятствует откату).

   **Источник:** [CP-Algorithms: Offline Dynamic Connectivity](https://cp-algorithms.com/data_structures/deleting_in_log_n.html)

185. Как проверить наличие цикла в неориентированном графе с помощью DSU?

   **Ответ:** Ребра графа перебираются последовательно: для каждого ребра $(u, v)$ проверяются корни через `find(u)` и `find(v)`. Если корни равны, добавление ребра замкнет цикл. Если различны — ребро добавляется через `unite(u, v)`.

   **Пример:**

   ```cpp
   bool has_cycle = false;
   for (const auto& [u, v] : edges) {
       if (!dsu.unite(u, v)) {
           has_cycle = true;
           break;
       }
   }
   ```

   **Типичная ошибка:** Применение DSU для поиска циклов в ориентированном графе (для орграфов DSU неприменим без специальной редукции).

   **Источник:** [LeetCode: Redundant Connection](https://leetcode.com/problems/redundant-connection/)

186. Как с помощью DSU объединять профили пользователей с общими email-адресами (Accounts Merge)?

   **Ответ:** Каждому email сопоставляется ID первого встретившегося владельца (или уникальный ID строки). Если у аккаунта несколько почт, все последующие объединяются через `dsu.unite` с первой почтой аккаунта. В конце адреса группируются по `dsu.find(email)`.

   **Пример:**

   ```cpp
   std::unordered_map<std::string, int> email_to_id;
   for (int i = 0; i < accounts.size(); ++i) {
       for (size_t j = 1; j < accounts[i].size(); ++j) {
           const std::string& email = accounts[i][j];
           if (!email_to_id.contains(email)) email_to_id[email] = i;
           else dsu.unite(i, email_to_id[email]);
       }
   }
   ```

   **Типичная ошибка:** Объединение аккаунтов только по совпадению имени пользователя вместо объединения транзитивных цепочек через адреса почты.

   **Источник:** [LeetCode: Accounts Merge](https://leetcode.com/problems/accounts-merge/)

187. Что такое Rollback DSU (DSU с откатом) и для каких задач он необходим?

   **Ответ:** Это вариант DSU, позволяющий отменять последние операции объединения в порядке LIFO с помощью стека истории изменений. В нем **запрещено** сжатие путей (*path compression*), а используется только *union by rank/size*, что дает гарантированную глубину $O(\log n)$ и возможность отката за $O(1)$.

   **Пример:**

   ```cpp
   struct Operation { int u, v, old_sz_u; };
   std::stack<Operation> history;
   void rollback() {
       auto [u, v, sz_u] = history.top(); history.pop();
       sz[u] = sz_u;
       parent[v] = v;
   }
   ```

   **Типичная ошибка:** Использование `parent[u] = find(parent[u])` в Rollback DSU, что делает невозможным восстановление прежней структуры родителей.

   **Источник:** [Codeforces: DSU with Rollback Tutorial](https://codeforces.com/blog/entry/75608)

188. Как использовать DSU на двумерной сетке в задачах о связных областях (островах)?

   **Ответ:** Каждая клетка $(r, c)$ матрицы размеров $R \times C$ преобразуется в одномерный плоский индекс `id = r * C + c`. При посещении клетки вызывается `unite` с четырьмя соседними валидными клетками суши.

   **Пример:**

   ```cpp
   int flat_id(int r, int c, int C) { return r * C + c; }
   // Объединение с соседом:
   dsu.unite(flat_id(r, c, C), flat_id(nr, nc, C));
   ```

   **Типичная ошибка:** Создание вложенных структур DSU вместо формулы плоского проецирования координат.

   **Источник:** [LeetCode: Number of Islands](https://leetcode.com/problems/number-of-islands/)

189. Как эффективно поддерживать число островов при постепенном динамическом добавлении клеток суши?

   **Ответ:** Изначально DSU содержит только воду. При добавлении новой клетки суши число островов увеличивается на 1. Затем проверяются 4 соседа: если сосед — суша, и он еще не в компоненте новой клетки, вызывается `dsu.unite`, и счетчик островов уменьшается на 1 за время $O(\alpha(N \cdot M))$.

   **Пример:**

   ```cpp
   void add_land(int r, int c, int R, int C, auto& dsu, auto& grid, int& islands) {
       int id = r * C + c;
       grid[r][c] = 1;
       islands++;
       int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
       for (int i = 0; i < 4; ++i) {
           int nr = r + dr[i], nc = c + dc[i];
           if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 1) {
               if (dsu.unite(id, nr * C + nc)) islands--;
           }
       }
   }
   ```

   **Типичная ошибка:** Пересчет всех островов полным обходом BFS/DFS матрицы после добавления каждой новой клетки ($O(K \cdot R \cdot C)$).

   **Источник:** [LeetCode: Number of Islands II](https://leetcode.com/problems/number-of-islands-ii/)

190. Почему DSU не подходит для вычисления кратчайших путей между вершинами?

   **Ответ:** DSU сжимает пути в деревьях произвольным образом и хранит только информацию о факте принадлежности множеству (отношение эквивалентности), полностью стирая исходную геометрию ребер, их последовательность и веса.

   **Пример:** В DSU после `find()` ребро ведет прямо в корень, минуя промежуточные вершины графа.

   **Типичная ошибка:** Попытка найти кратчайший путь через сумму длин связей в массиве `parent` DSU.

   **Источник:** [Algorithms, 4th Edition (Sedgewick, Wayne: Union-Find)](https://algs4.cs.princeton.edu/15uf/)

191. Как поддерживать дополнительную информацию о компоненте (размер, сумму элементов, минимум) в DSU?

   **Ответ:** Дополнительные данные хранятся в массивах по индексу корня. В методе `unite(u, v)` после определения корней `root_u` и `root_v` агрегированные значения обновляются в новом корне до или сразу после перепривязки указателя.

   **Пример:**

   ```cpp
   // Поддержка минимума и суммы в компоненте:
   min_val[root_u] = std::min(min_val[root_u], min_val[root_v]);
   sum_val[root_u] += sum_val[root_v];
   parent[root_v] = root_u;
   ```

   **Типичная ошибка:** Обновление атрибутов по индексам `u` и `v` вместо их канонических корней `root_u` и `root_v`.

   **Источник:** [CP-Algorithms: DSU with additional data](https://cp-algorithms.com/data_structures/disjoint_set_union.html)

192. Как реализовать DSU для работы с произвольными строковыми ключами?

   **Ответ:** Строки отображаются в целые числа $0, 1, \dots$ на лету с помощью `std::unordered_map<std::string, int>`, а вся логика объединения и сжатия путей выполняется над целочисленными идентификаторами в плоских векторах.

   **Пример:**

   ```cpp
   std::unordered_map<std::string, int> str_to_id;
   int get_id(const std::string& s, DSU& dsu) {
       if (!str_to_id.contains(s)) {
           str_to_id[s] = str_to_id.size();
       }
       return str_to_id[s];
   }
   ```

   **Типичная ошибка:** Хранение указателей на строки напрямую в хэш-таблице `std::unordered_map<std::string, std::string> parent`, что на порядки замедляет работу из-за постоянных аллокаций памяти при каждом `find`.

   **Источник:** [CP-Algorithms: String DSU](https://cp-algorithms.com/data_structures/disjoint_set_union.html)

193. Чем эвристика `union by rank` отличается от `union by size` на практике?

   **Ответ:** `Union by size` объединяет деревья по общему количеству узлов и автоматически поддерживает размер каждой компоненты связности. `Union by rank` объединяет по оценке верхней границы высоты дерева, увеличивая ранг только при равенстве рангов. На практике обе дают эквивалентную асимптотику, но `size` удобнее, если размер компоненты нужен в бизнес-логике.

   **Пример:** При `union by size` размер суммируется: `sz[root_a] += sz[root_b]`. При `rank` высота растет только при `rank[a] == rank[b]`: `rank[root_a]++`.

   **Типичная ошибка:** Попытка обновлять `rank` при сжатии путей в `find()` (ранг не является точной высотой после сжатия путей).

   **Источник:** [Introduction to Algorithms (CLRS: Heuristics in Disjoint Sets)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

194. Как решить задачу разрешимости равенств и неравенств (*Satisfiability of Equality Equations*) через DSU?

   **Ответ:** 1) На первом проходе обрабатываются все равенства вида `a == b`, объединяя переменные через `dsu.unite(a, b)`; 2) На втором проходе проверяются все неравенства вида `a != b`: если `dsu.find(a) == dsu.find(b)`, то система уравнений противоречива.

   **Пример:**

   ```cpp
   bool equations_possible(const std::vector<std::string>& equations) {
       DSU dsu(26);
       for (const auto& eq : equations) {
           if (eq[1] == '=') dsu.unite(eq[0] - 'a', eq[3] - 'a');
       }
       for (const auto& eq : equations) {
           if (eq[1] == '!') {
               if (dsu.find(eq[0] - 'a') == dsu.find(eq[3] - 'a')) return false;
           }
       }
       return true;
   }
   ```

   **Типичная ошибка:** Обработка уравнений и неравенств в порядке их следования во входном массиве вместо приоритетного объединения всех равенств.

   **Источник:** [LeetCode: Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/)

195. Какие ошибки наиболее распространены при реализации метода `find()` в DSU?

   **Ответ:**

1) Отсутствие сохранения результата рекурсии в `parent[u]` (сжатие путей не происходит, алгоритм деградирует до $O(n)$);

2) Неверное базовое условие остановки: проверка `u == 0` вместо `u == parent[u]`;

3) Переполнение стека (*Stack Overflow*) на глубоких цепочках без ранговой эвристики при отсутствии сжатия путей.

   **Пример:**

   ```cpp
   // Ошибка: возврат без сохранения — сжатия путей нет!
   // int find(int u) { return u == parent[u] ? u : find(parent[u]); }
   // Корректно:
   int find(int u) { return u == parent[u] ? u : parent[u] = find(parent[u]); }
   ```

   **Типичная ошибка:** Написание итеративного `find()` без сохранения промежуточных вершин для перепривязки к корню.

   **Источник:** [CP-Algorithms: DSU Implementation Pitfalls](https://cp-algorithms.com/data_structures/disjoint_set_union.html)

## 14. Рекурсия, backtracking, brute force


196. Чем отличаются brute force, backtracking и branch and bound?

   **Ответ:**
   - **Brute force (полный перебор):** генерирует абсолютно все возможные конфигурации пространства поиска без анализа их промежуточной корректности;
   - **Backtracking (поиск с возвратом):** строит решение инкрементально и немедленно прекращает спуск по ветке (*отсечение/pruning*), как только нарушается хотя бы одно ограничение задачи;
   - **Branch and bound (метод ветвей и границ):** применяется в задачах оптимизации, оценивая верхнюю/нижнюю границу целевой функции для текущего поддерева и отсекая ветви, которые заведомо не смогут превзойти уже найденный оптимум.

   **Пример:** Перебор всех перестановок чисел для задачи коммивояжера — brute force; отсечение пути, где два города посещены подряд недопустимым ребром — backtracking; отсечение пути, чья текущая длина уже превышает лучший найденный полный маршрут — branch and bound.

   **Типичная ошибка:** Считать backtracking и полный перебор синонимами, игнорируя этап валидации промежуточного состояния.

   **Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

197. Как сгенерировать все подмножества множества?

   **Ответ:** Либо через битовые маски от $0$ до $2^n - 1$ (если $n \le 60$), проверяя бит `(mask & (1 << i))`, либо рекурсивным backtracking-вызовом с двумя ветвями для каждого элемента: «включить текущий элемент в подмножество» и «не включать».

   **Пример:**

   ```cpp
   void generate_subsets(int idx, const std::vector<int>& nums, std::vector<int>& current,
                         std::vector<std::vector<int>>& result) {
       if (idx == nums.size()) {
           result.push_back(current);
           return;
       }
       // Включаем элемент
       current.push_back(nums[idx]);
       generate_subsets(idx + 1, nums, current, result);
       current.pop_back(); // Backtrack
       // Не включаем элемент
       generate_subsets(idx + 1, nums, current, result);
   }
   ```

   **Типичная ошибка:** Передача массива `current` по значению на каждом шаге рекурсии, что создает $O(n \cdot 2^n)$ лишних аллокаций памяти вместо $O(n)$ при передаче по ссылке с `pop_back()`.

   **Источник:** [LeetCode: Subsets](https://leetcode.com/problems/subsets/)

198. Как сгенерировать все перестановки массива?

   **Ответ:** Рекурсивно перебирая возможные элементы для текущей позиции и меняя их местами через `std::swap`, либо используя стандартную функцию `std::next_permutation` на предварительно отсортированном массиве.

   **Пример:**

   ```cpp
   void permute(int l, std::vector<int>& nums, std::vector<std::vector<int>>& res) {
       if (l == nums.size()) {
           res.push_back(nums);
           return;
       }
       for (int i = l; i < nums.size(); ++i) {
           std::swap(nums[l], nums[i]);
           permute(l + 1, nums, res);
           std::swap(nums[l], nums[i]); // Backtrack
       }
   }
   ```

   **Типичная ошибка:** Попытка использовать `std::next_permutation` без предварительной сортировки массива, из-за чего часть перестановок пропускается.

   **Источник:** [Cppreference: std::next_permutation](https://en.cppreference.com/w/cpp/algorithm/next_permutation)

199. Как решить задачу о $N$ ферзях (N-Queens) через backtracking?

   **Ответ:** Ферзи размещаются построчно (по одному в каждой строке). Для столбцов и двух типов диагоналей поддерживаются булевы массивы (или битовые маски). Столбец `c`, диагональ `r - c + n` и побочная диагональ `r + c` помечаются занятыми. Если для строки нет доступных позиций, происходит откат назад.

   **Пример:**

   ```cpp
   void solve_n_queens(int r, int n, std::vector<int>& cols, std::vector<bool>& col_used,
                       std::vector<bool>& diag1, std::vector<bool>& diag2, int& count) {
       if (r == n) { count++; return; }
       for (int c = 0; c < n; ++c) {
           if (!col_used[c] && !diag1[r - c + n] && !diag2[r + c]) {
               col_used[c] = diag1[r - c + n] = diag2[r + c] = true;
               solve_n_queens(r + 1, n, cols, col_used, diag1, diag2, count);
               col_used[c] = diag1[r - c + n] = diag2[r + c] = false; // Backtrack
           }
       }
   }
   ```

   **Типичная ошибка:** Сканирование всей доски $N \times N$ в цикле на каждом шаге вместо проверки занятости за $O(1)$ через вспомогательные массивы диагоналей.

   **Источник:** [LeetCode: N-Queens](https://leetcode.com/problems/n-queens/)

200. Как найти все уникальные комбинации чисел, дающие заданную сумму `target` (Combination Sum)?

   **Ответ:** Массив предварительно сортируется. На каждом шаге перебираются элементы, начиная с текущего индекса (чтобы избежать дубликатов перестановок). Если текущий элемент превышает остаток `target`, цикл досрочно прерывается благодаря сортировке (*pruning*).

   **Пример:**

   ```cpp
   void backtrack(int start, int target, const std::vector<int>& candidates,
                  std::vector<int>& current, std::vector<std::vector<int>>& result) {
       if (target == 0) {
           result.push_back(current);
           return;
       }
       for (int i = start; i < candidates.size(); ++i) {
           if (candidates[i] > target) break; // Pruning
           current.push_back(candidates[i]);
           backtrack(i, target - candidates[i], candidates, current, result);
           current.pop_back();
       }
   }
   ```

   **Типичная ошибка:** Запуск цикла всегда с индекса `0`, что приводит к генерации одних и тех же комбинаций в разном порядке (например, `[2, 3]` и `[3, 2]`).

   **Источник:** [LeetCode: Combination Sum](https://leetcode.com/problems/combination-sum/)

201. Как генерировать только правильные скобочные последовательности длины `2n`?

   **Ответ:** Рекурсивно отслеживается число открывающих (`open`) и закрывающих (`close`) скобок. Открывающую скобку можно добавить, если `open < n`; закрывающую скобку можно добавить только тогда, когда `close < open`. Это гарантирует генерацию исключительно валидных последовательностей без необходимости пост-проверки.

   **Пример:**

   ```cpp
   void generate_parentheses(int open, int close, int n, std::string& current,
                             std::vector<std::string>& result) {
       if (current.length() == 2 * n) {
           result.push_back(current);
           return;
       }
       if (open < n) {
           current.push_back('(');
           generate_parentheses(open + 1, close, n, current, result);
           current.pop_back();
       }
       if (close < open) {
           current.push_back(')');
           generate_parentheses(open, close + 1, n, current, result);
           current.pop_back();
       }
   }
   ```

   **Типичная ошибка:** Генерация всех $2^{2n}$ строк с последующей валидацией стеком, что увеличивает сложность с числа Каталана $C_n$ до экспоненты $2^{2n}$.

   **Источник:** [LeetCode: Generate Parentheses](https://leetcode.com/problems/generate-parentheses/)

202. Как решить судоку с помощью поиска с возвратом?

   **Ответ:** Находится первая пустая клетка. Для нее перебираются цифры от 1 до 9. Для каждой цифры за $O(1)$ проверяется допустимость по строке, столбцу и малому квадрату $3 \times 3$. При успешной проверке цифра ставится на поле и запускается рекурсия; если решения нет, клетка снова обнуляется (`0`).

   **Пример:**

   ```cpp
   bool solve_sudoku(std::vector<std::vector<char>>& board) {
       for (int r = 0; r < 9; ++r) {
           for (int c = 0; c < 9; ++c) {
               if (board[r][c] == '.') {
                   for (char d = '1'; d <= '9'; ++d) {
                       if (is_valid(board, r, c, d)) {
                           board[r][c] = d;
                           if (solve_sudoku(board)) return true;
                           board[r][c] = '.'; // Backtrack
                       }
                   }
                   return false;
               }
           }
       }
       return true;
   }
   ```

   **Типичная ошибка:** Продолжение поиска после того, как решение уже найдено (метод должен возвращать `bool` для немедленного выхода из рекурсивного стека).

   **Источник:** [LeetCode: Sudoku Solver](https://leetcode.com/problems/sudoku-solver/)

203. В каких ситуациях критически важно выполнять отсечение ветвей (pruning)?

   **Ответ:** Отсечение необходимо всегда, когда текущее состояние заведомо не приведет к корректному результату или оптимуму: превышение лимита суммы, нарушение инварианта задачи, дублирование уже рассмотренных состояний или когда оставшихся элементов физически недостаточно для достижения цели.

   **Пример:** При генерации подмножеств с уникальными элементами из массива с повторами: пропуск одинаковых соседних элементов `if (i > start && nums[i] == nums[i-1]) continue;`.

   **Типичная ошибка:** Спуск в рекурсию до базового случая и выполнение валидации только на листьях дерева поиска.

   **Источник:** [Competitive Programmer's Handbook (Antti Laaksonen: Chapter 5)](https://cses.fi/book/book.pdf)

204. Как исключить избыточные копирования данных при реализации рекурсивных алгоритмов на C++?

   **Ответ:**

1. Передавать неизменяемые входные данные по константной ссылке (`const T&`);

2. Передавать текущее накапливаемое состояние (`path`, `current`) по неконстантной ссылке с обязательным откатом изменений (`push_back` $\to$ рекурсия $\to$ `pop_back`);

3. Использовать `std::move` при сохранении готового ответа в результирующий контейнер.

   **Пример:**

   ```cpp
   void dfs(const Graph& g, int u, std::vector<int>& path, std::vector<std::vector<int>>& all_paths) {
       path.push_back(u);
       if (is_target(u)) all_paths.push_back(path); // Копирование только в момент фиксации ответа
       for (int v : g[u]) dfs(g, v, path, all_paths);
       path.pop_back(); // Возврат состояния
   }
   ```

   **Типичная ошибка:** Передача вектора состояния по значению `void dfs(std::vector<int> path)`, что вызывает глубокое копирование на каждом шаге рекурсии.

   **Источник:** [C++ Core Guidelines: F.16](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f16-for-in-parameters-pass-cheaply-copied-types-by-value-and-others-by-reference-to-const)

205. Какие технические риски сопряжены с использованием глубокой рекурсии в C++?

   **Ответ:** Риск переполнения стека вызовов (*Stack Overflow*), так как размер стека потока ограничен (обычно 1–8 МБ в зависимости от ОС и настроек линковщика). Кадр вызова сохраняет регистры, локальные переменные и адрес возврата, из-за чего глубина в $10^5$–$10^6$ вызовов гарантированно приводит к аварийному завершению процесса (SIGSEGV).

   **Пример:** Запуск наивного DFS на графе в виде длинного бамбука из $2 \cdot 10^5$ вершин завершится падением по переполнению стека.

   **Типичная ошибка:** Создание тяжелых локальных массивов внутри рекурсивной функции прямо на стеке (`int buffer[10000];`).

   **Источник:** [SEI CERT C++: MEM52-CPP](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)

206. Как преобразовать произвольный рекурсивный алгоритм в итеративный с помощью явного стека?

   **Ответ:** Выделяется структура, моделирующая кадр активации (состояние, аргументы, локальные переменные). Вместо рекурсивных вызовов состояния помещаются в `std::stack`, размещенный в куче, а выполнение переводится в цикл `while (!st.empty())`.

   **Пример:**

   ```cpp
   struct Frame { int node; int state; };
   std::stack<Frame> st;
   st.push({root, 0});
   while (!st.empty()) {
       auto& [u, state] = st.top();
       // Моделирование логики шагов
   }
   ```

   **Типичная ошибка:** Попытка эмулировать несколько точек рекурсивного возврата без сохранения локального счетчика прогресса выполнения узла.

   **Источник:** [Introduction to Algorithms (CLRS: Simulating Recursion)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

207. Как проверить, можно ли разбить строку на последовательность слов из словаря (Word Break)?

   **Ответ:** Задача решается с помощью динамического программирования или поиска с мемоизацией за $O(n^2)$. Булев массив `dp[i]` показывает, можно ли составить префикс длины `i`. Для каждого `i` проверяются все подстроки `s[j...i-1]`: если `dp[j] == true` и подстрока есть в словаре, то `dp[i] = true`.

   **Пример:**

   ```cpp
   bool word_break(std::string_view s, const std::unordered_set<std::string>& dict) {
       int n = s.size();
       std::vector<bool> dp(n + 1, false);
       dp[0] = true;
       for (int i = 1; i <= n; ++i) {
           for (int j = 0; j < i; ++j) {
               if (dp[j] && dict.contains(std::string(s.substr(j, i - j)))) {
                   dp[i] = true;
                   break;
               }
           }
       }
       return dp[n];
   }
   ```

   **Типичная ошибка:** Наивный backtracking без мемоизации, приводящий к экспоненциальному взрыву $O(2^n)$ на строках вида `"aaaaab"` со словарем `["a", "aa", "aaa"]`.

   **Источник:** [LeetCode: Word Break](https://leetcode.com/problems/word-break/)

208. Как найти все возможные пути от источника к стоку в ориентированном ациклическом графе (DAG)?

   **Ответ:** Стандартным обходом DFS с поиском с возвратом. Так как граф ацикличен, посещенные вершины не требуют глобальной блокировки: вершина добавляется в текущий путь, рекурсивно исследуются ее соседи, а при возврате узел извлекается из пути (`pop_back()`).

   **Пример:**

   ```cpp
   void find_paths(int u, int target, const std::vector<std::vector<int>>& graph,
                   std::vector<int>& path, std::vector<std::vector<int>>& res) {
       path.push_back(u);
       if (u == target) {
           res.push_back(path);
       } else {
           for (int v : graph[u]) find_paths(v, target, graph, path, res);
       }
       path.pop_back(); // Backtrack
   }
   ```

   **Типичная ошибка:** Использование общего глобального массива `visited`, препятствующего прохождению через одну и ту же вершину в составе разных путей.

   **Источник:** [LeetCode: All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target/)

209. Как эффективно решить задачу разбиения массива на $k$ подмножеств с равной суммой (Partition to K Equal Sum Subsets)?

   **Ответ:** 1) Проверить, делится ли сумма массива на $k$ (целевая сумма `target = sum / k`); 2) Отсортировать массив по убыванию (чтобы быстрее отсекать тупиковые ветки); 3) Использовать backtracking с заполнением каждого из $k$ подмножеств до `target` или с битовой маской посещенных элементов и мемоизацией.

   **Пример:**

   ```cpp
   bool can_partition(int idx, int k, int curr_sum, int target,
                      const std::vector<int>& nums, std::vector<bool>& used) {
       if (k == 1) return true;
       if (curr_sum == target) return can_partition(0, k - 1, 0, target, nums, used);
       for (int i = idx; i < nums.size(); ++i) {
           if (used[i] || curr_sum + nums[i] > target) continue;
           used[i] = true;
           if (can_partition(i + 1, k, curr_sum + nums[i], target, nums, used)) return true;
           used[i] = false;
           if (curr_sum == 0) break; // Pruning: если первый элемент не подошел, ветка не имеет решения
       }
       return false;
   }
   ```

   **Типичная ошибка:** Отсутствие сортировки по убыванию, из-за чего тяжелые элементы рассматриваются в самом конце, резко увеличивая количество бесполезных ветвлений.

   **Источник:** [LeetCode: Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)

210. Как корректно оценивать асимптотическую сложность алгоритмов с поиском с возвратом?

   **Ответ:** Сложность оценивается по дереву пространства состояний как произведение: $\text{Общее число узлов дерева поиска} \times \text{Время обработки одного узла}$. Верхняя граница оценивается через факториал $O(n!)$ (для перестановок) или экспоненту $O(k^n)$ (для $k$ вариантов выбора). Практическая сложность значительно ниже теоретической за счет отсечений (*pruning*).

   **Пример:** Для N-Queens верхняя граница равна $O(N!)$, так как на каждой следующей строке число доступных колонок уменьшается как минимум на 1.

   **Типичная ошибка:** Попытка оценить backtracking только по глубине рекурсии $O(N)$, забывая про коэффициент ветвления дерева поиска.

   **Источник:** [Algorithms, 4th Edition (Sedgewick, Wayne)](https://algs4.cs.princeton.edu/)


   ---

## 15. Dynamic Programming: базовый уровень


211. По каким ключевым признакам можно определить, что задача решается методом динамического программирования?

   **Ответ:** Задача должна обладать двумя свойствами:

1. **Оптимальная подструктура (Optimal Substructure):** оптимальное решение всей задачи выражается через оптимальные решения ее меньших подзадач;

2. **Перекрывающиеся подзадачи (Overlapping Subproblems):** один и тот же набор меньших подзадач многократно вычисляется в разных ветвях наивного рекурсивного перебора.

   **Пример:** Поиск кратчайшего пути в DAG: кратчайший путь до вершины $V$ зависит от кратчайших путей до ее непосредственных предков, и эти предки многократно перекрываются.

   **Типичная ошибка:** Попытка применить DP к задачам, где подзадачи независимы (для них эффективнее подход «Разделяй и властвуй», как в Merge Sort).

   **Источник:** [Introduction to Algorithms (CLRS: Dynamic Programming)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

212. В чём фундаментальные отличия подходов Top-Down (мемоизация) и Bottom-Up (табуляция)?

   **Ответ:**
   - **Top-Down (мемоизация):** пишется естественная рекурсия от исходной задачи к базовым случаям, а промежуточные результаты кэшируются в массиве/хеш-таблице. Вычисляются только те состояния, которые реально необходимы, но есть накладные расходы на стек вызовов;
   - **Bottom-Up (табуляция):** состояния заполняются итеративно в циклах от простейших базовых случаев к целевому. Нет накладных расходов на стек, порядок обхода предсказуем, что упрощает оптимизацию памяти.

   **Пример:**

   ```cpp
   // Bottom-Up:
   dp[0] = 0; dp[1] = 1;
   for (int i = 2; i <= n; ++i) dp[i] = dp[i-1] + dp[i-2];
   ```

   **Типичная ошибка:** Использование Top-Down при жестких лимитах на глубину рекурсивного стека.

   **Источник:** [CP-Algorithms: Dynamic Programming](https://cp-algorithms.com/)

213. Как вычисляются числа Фибоначчи через DP и почему этот пример считается хрестоматийным, но плохим для иллюстрации мощи метода?

   **Ответ:** Задача тривиально решается табуляцией $F(n) = F(n-1) + F(n-2)$ за $O(n)$ времени и $O(1)$ памяти. Пример слаб, так как не демонстрирует выбор оптимального решения среди нескольких альтернатив ($\min / \max$), а также решается быстрее матричным возведением в степень за $O(\log n)$ или формулой Бине.

   **Пример:**

   ```cpp
   int fib(int n) {
       if (n <= 1) return n;
       int a = 0, b = 1;
       for (int i = 2; i <= n; ++i) {
           int c = a + b;
           a = b;
           b = c;
       }
       return b;
   }
   ```

   **Типичная ошибка:** Выделение массива `std::vector<int> dp(n + 1)` там, где достаточно двух переменных.

   **Источник:** [Introduction to Algorithms (CLRS: Fibonacci numbers)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

214. Как найти число способов подняться по лестнице из $n$ ступеней, если за шаг можно преодолеть 1 или 2 ступени (Climbing Stairs)?

   **Ответ:** Состояние $dp[i]$ — число способов добраться до ступени $i$. Чтобы попасть на ступень $i$, необходимо сделать шаг в 1 ступень с $i-1$, либо шаг в 2 ступени с $i-2$. Переход: $dp[i] = dp[i-1] + dp[i-2]$ с базой $dp[1] = 1, dp[2] = 2$ (сводится к числам Фибоначчи).

   **Пример:**

   ```cpp
   int climb_stairs(int n) {
       if (n <= 2) return n;
       int prev2 = 1, prev1 = 2;
       for (int i = 3; i <= n; ++i) {
           int curr = prev1 + prev2;
           prev2 = prev1;
           prev1 = curr;
       }
       return prev1;
   }
   ```

   **Типичная ошибка:** Попытка комбинаторного подсчета через факториалы $\sum \binom{n-k}{k}$, ведущая к переполнению целых чисел.

   **Источник:** [LeetCode: Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)

215. Как решается классическая задача о рюкзаке 0/1 (0/1 Knapsack Problem)?

   **Ответ:** Состояние $dp[w]$ — максимальная ценность при вместимости $w$. Предметы перебираются во внешнем цикле, а внутренний цикл по весу идет **в обратном порядке** от $W$ до $w_i$, гарантируя, что каждый предмет будет взят не более одного раза: $dp[w] = \max(dp[w], dp[w - w_i] + v_i)$.

   **Пример:**

   ```cpp
   int knapsack_01(int W, const std::vector<int>& weights, const std::vector<int>& values) {
       std::vector<int> dp(W + 1, 0);
       for (size_t i = 0; i < weights.size(); ++i) {
           for (int w = W; w >= weights[i]; --w) { // Обратный порядок!
               dp[w] = std::max(dp[w], dp[w - weights[i]] + values[i]);
           }
       }
       return dp[W];
   }
   ```

   **Типичная ошибка:** Прямой порядок внутреннего цикла `for (int w = weights[i]; w <= W; ++w)`, который превращает задачу в неограниченный рюкзак (предмет берется многократно).

   **Источник:** [Introduction to Algorithms (CLRS: Knapsack Problem)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

216. Чем принципиально отличаются переходы состояний в 0/1, unbounded и bounded knapsack?

   **Ответ:**
   - **0/1 Knapsack:** каждый предмет доступен в единственном экземпляре; в одномерном DP внутренний цикл по весу идет назад ($W \to w_i$);
   - **Unbounded Knapsack:** каждый предмет доступен в бесконечном количестве; внутренний цикл по весу идет вперед ($w_i \to W$), позволяя переиспользовать предмет в том же слое;
   - **Bounded Knapsack:** предмет доступен в количестве $c_i$ штук; оптимизируется двоичным разложением количества ($1, 2, 4, \dots, c_i - 2^k + 1$) на независимые предметы для сведения к 0/1 рюкзаку за $O(W \sum \log c_i)$.

   **Пример:** Разложение 13 копий предмета веса $w$ на 4 фиктивных предмета с весами $1w, 2w, 4w, 6w$.

   **Типичная ошибка:** Моделирование $c_i$ копий как $c_i$ отдельных одинаковых предметов без двоичной упаковки, что деградирует сложность до псевдополиномиальной $O(W \sum c_i)$.

   **Источник:** [CP-Algorithms: Knapsack Variations](https://cp-algorithms.com/)

217. Как найти наибольшую общую подпоследовательность (LCS) двух строк?

   **Ответ:** Таблица $dp[i][j]$ хранит длину LCS для префиксов строк длины $i$ и $j$. Если $s_1[i-1] == s_2[j-1]$, то $dp[i][j] = dp[i-1][j-1] + 1$. Иначе $dp[i][j] = \max(dp[i-1][j], dp[i][j-1])$. Сложность: $O(n \cdot m)$ по времени и $O(\min(n, m))$ по памяти при сжатии слоев.

   **Пример:**

   ```cpp
   int longest_common_subsequence(std::string_view s1, std::string_view s2) {
       int n = s1.size(), m = s2.size();
       std::vector<std::vector<int>> dp(n + 1, std::vector<int>(m + 1, 0));
       for (int i = 1; i <= n; ++i) {
           for (int j = 1; j <= m; ++j) {
               if (s1[i - 1] == s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
               else dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
           }
       }
       return dp[n][m];
   }
   ```

   **Типичная ошибка:** Путаница между подпоследовательностью (*subsequence*, элементы не обязаны идти подряд) и подстрокой (*substring*, элементы обязаны идти подряд).

   **Источник:** [LeetCode: Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)

218. Как вычисляется редакционное расстояние (Edit Distance / расстояние Левенштейна)?

   **Ответ:** Состояние $dp[i][j]$ — минимальное число операций для превращения $s_1[0...i-1]$ в $s_2[0...j-1]$. Если символы равны, стоимость перехода 0: $dp[i][j] = dp[i-1][j-1]$. Иначе берется $1 + \min$ из трех операций: вставка ($dp[i][j-1]$), удаление ($dp[i-1][j]$) и замена ($dp[i-1][j-1]$).

   **Пример:**

   ```cpp
   int min_distance(std::string_view s1, std::string_view s2) {
       int n = s1.size(), m = s2.size();
       std::vector<std::vector<int>> dp(n + 1, std::vector<int>(m + 1));
       for (int i = 0; i <= n; ++i) dp[i][0] = i;
       for (int j = 0; j <= m; ++j) dp[0][j] = j;
       for (int i = 1; i <= n; ++i) {
           for (int j = 1; j <= m; ++j) {
               if (s1[i - 1] == s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
               else dp[i][j] = 1 + std::min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
           }
       }
       return dp[n][m];
   }
   ```

   **Типичная ошибка:** Забытая инициализация базовых строк и колонок ($dp[i][0] = i$ и $dp[0][j] = j$), означающих удаление/вставку всех символов в пустую строку.

   **Источник:** [LeetCode: Edit Distance](https://leetcode.com/problems/edit-distance/)

219. Как найти наибольшую возрастающую подпоследовательность (LIS) за $O(n^2)$ и за $O(n \log n)$?

   **Ответ:**
   - За $O(n^2)$: $dp[i]$ — длина LIS, заканчивающейся в $i$. Два вложенных цикла проверяют все $j < i$, где $nums[j] < nums[i]$;
   - За $O(n \log n)$: массив `tails`, где `tails[len]` — минимальный хвост возрастающей подпоследовательности длины `len`. Для каждого числа его позиция в `tails` находится бинарным поиском (`std::lower_bound`) за $O(\log n)$.

   **Пример ($O(n \log n)$):**

   ```cpp
   int length_of_lis(const std::vector<int>& nums) {
       std::vector<int> tails;
       for (int x : nums) {
           auto it = std::lower_bound(tails.begin(), tails.end(), x);
           if (it == tails.end()) tails.push_back(x);
           else *it = x;
       }
       return tails.size();
   }
   ```

   **Типичная ошибка:** Предположение, что итоговый массив `tails` сам по себе является искомой подпоследовательностью LIS (он хранит только минимальные граничные элементы для каждой длины).

   **Источник:** [LeetCode: Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

220. Как найти путь с минимальной суммой в двумерной сетке (Minimum Path Sum)?

   **Ответ:** Движение разрешено только вправо и вниз. Значение клетки $dp[r][c]$ равно стоимости текущей клетки плюс минимум из прихода сверху и слева: $dp[r][c] = \text{grid}[r][c] + \min(dp[r-1][c], dp[r][c-1])$. Память сжимается до одного одномерного вектора размера $C$.

   **Пример:**

   ```cpp
   int min_path_sum(const std::vector<std::vector<int>>& grid) {
       int R = grid.size(), C = grid[0].size();
       std::vector<int> dp(C, std::numeric_limits<int>::max());
       dp[0] = 0;
       for (int r = 0; r < R; ++r) {
           dp[0] += grid[r][0];
           for (int c = 1; c < C; ++c) {
               dp[c] = grid[r][c] + std::min(dp[c], dp[c - 1]);
           }
       }
       return dp[C - 1];
   }
   ```

   **Типичная ошибка:** Попытка применить жадный выбор (идти всегда в меньшую соседнюю клетку), что не гарантирует глобального минимума пути.

   **Источник:** [LeetCode: Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)

221. Как посчитать количество уникальных путей в сетке с препятствиями (Unique Paths II)?

   **Ответ:** Если клетка содержит препятствие (`grid[r][c] == 1`), то число путей в нее обнуляется: $dp[r][c] = 0$. Для свободной клетки число путей равно сумме путей сверху и слева: $dp[r][c] = dp[r-1][c] + dp[r][c-1]$.

   **Пример:**

   ```cpp
   int unique_paths_with_obstacles(const std::vector<std::vector<int>>& grid) {
       int R = grid.size(), C = grid[0].size();
       std::vector<long long> dp(C, 0);
       dp[0] = (grid[0][0] == 0);
       for (int r = 0; r < R; ++r) {
           for (int c = 0; c < C; ++c) {
               if (grid[r][c] == 1) dp[c] = 0;
               else if (c > 0) dp[c] += dp[c - 1];
           }
       }
       return dp[C - 1];
   }
   ```

   **Типичная ошибка:** Использование 32-битного знакового `int` без проверки на переполнение промежуточных комбинаторных сумм на сетках без препятствий.

   **Источник:** [LeetCode: Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)

222. Как решить задачу о размене монет (Coin Change) на нахождение минимального числа монет?

   **Ответ:** Состояние $dp[i]$ — минимальное число монет для суммы $i$. Инициализируется бесконечностью, $dp[0] = 0$. Переход: $dp[i] = \min_{c} (dp[i - c] + 1)$ для всех монет $c \le i$. Сложность: $O(\text{amount} \cdot \text{coins.size()})$.

   **Пример:**

   ```cpp
   int coin_change(const std::vector<int>& coins, int amount) {
       std::vector<int> dp(amount + 1, amount + 1);
       dp[0] = 0;
       for (int i = 1; i <= amount; ++i) {
           for (int c : coins) {
               if (i >= c) dp[i] = std::min(dp[i], dp[i - c] + 1);
           }
       }
       return dp[amount] > amount ? -1 : dp[amount];
   }
   ```

   **Типичная ошибка:** Инициализация значением `INT_MAX`, приводящая к арифметическому переполнению при операции `dp[i - c] + 1`.

   **Источник:** [LeetCode: Coin Change](https://leetcode.com/problems/coin-change/)

223. Как решаются задачи House Robber и House Robber II (с круговым расположением домов)?

   **Ответ:**
   - **House Robber:** нельзя грабить два соседних дома: $dp[i] = \max(dp[i-1], dp[i-2] + nums[i])$;
   - **House Robber II:** первый и последний дома закольцованы и соседствуют друг с другом. Задача разбивается на два независимых запуска базового алгоритма: первый для диапазона без последнего дома $[0, n-2]$, второй — без первого дома $[1, n-1]$. Итоговый ответ: $\max(\text{rob}(0, n-2), \text{rob}(1, n-1))$.

   **Пример:**

   ```cpp
   int rob_linear(std::span<const int> nums) {
       int prev1 = 0, prev2 = 0;
       for (int x : nums) {
           int curr = std::max(prev1, prev2 + x);
           prev2 = prev1;
           prev1 = curr;
       }
       return prev1;
   }
   int rob_circle(const std::vector<int>& nums) {
       if (nums.size() == 1) return nums[0];
       return std::max(rob_linear(std::span(nums).subspan(0, nums.size() - 1)),
                       rob_linear(std::span(nums).subspan(1)));
   }
   ```

   **Типичная ошибка:** Попытка отслеживать флаг взятия первого дома в едином цикле вместо его разделения на два изолированных прохода.

   **Источник:** [LeetCode: House Robber II](https://leetcode.com/problems/house-robber-ii/)

224. Как найти непрерывный подмассив с максимальным произведением (Maximum Product Subarray)?

   **Ответ:** Из-за умножения на отрицательные числа минимум может стать максимумом. Поддерживаются одновременно текущий максимум и текущий минимум произведения на префиксе. При встрече отрицательного числа текущие максимум и минимум меняются местами перед пересчетом.

   **Пример:**

   ```cpp
   int max_product(const std::vector<int>& nums) {
       int max_prod = nums[0], min_prod = nums[0], global_max = nums[0];
       for (size_t i = 1; i < nums.size(); ++i) {
           if (nums[i] < 0) std::swap(max_prod, min_prod);
           max_prod = std::max(nums[i], max_prod * nums[i]);
           min_prod = std::min(nums[i], min_prod * nums[i]);
           global_max = std::max(global_max, max_prod);
       }
       return global_max;
   }
   ```

   **Типичная ошибка:** Использование классического алгоритма Кадане для суммы, игнорирующее смену знаков при четном количестве отрицательных чисел.

   **Источник:** [LeetCode: Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)

225. Каким образом оптимизировать расход памяти в задачах двумерного DP с $O(n \cdot m)$ до $O(\min(n, m))$?

   **Ответ:** Если состояние на шаге $i$ зависит только от значений на текущем и непосредственно предыдущем шаге $i-1$ (как в LCS, Edit Distance, Knapsack), нет необходимости хранить всю матрицу. Достаточно поддерживать два одномерных массива (`prev_row` и `curr_row`), либо один вектор, ориентируя внешний цикл по большей размерности, а внутренний — по меньшей.

   **Пример:**

   ```cpp
   // Сжатие матрицы R x C до одного вектора размера min(R, C):
   std::vector<int> dp(min_dim + 1, 0);
   // Внутренний цикл перезаписывает значения на месте
   ```

   **Типичная ошибка:** Перезапись значений в единственном векторе слева направо в тех случаях, когда формула перехода требует старого неперезаписанного значения $dp[i-1][j-1]$ (требуется промежуточное сохранение в переменную `prev`).

   **Источник:** [Introduction to Algorithms (CLRS: Memory-Efficient DP)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

## 16. Dynamic Programming: продвинутый уровень


226. Что такое динамическое программирование по профилю (DP on broken profile) и где оно применяется?

   **Ответ:** Это разновидность DP с битовыми масками, где состояние описывает границу («ломаный профиль») между уже заполненной и еще не заполненной частью сетки при поэлементном (поклеточном) обходе. Применяется в задачах замощения сетки домино/полимино, подсчета числа остовных деревьев или циклов в узких сетках ($N \times M$ при $\min(N, M) \le 20$).

   **Пример:**

   ```cpp
   // Переход от клетки (r, c) к (r, c+1):
   // Состояние profile кодирует занятость последних N смежных клеток границы
   dp[r][c + 1][next_mask] += dp[r][c][curr_mask];

   ```

   **Типичная ошибка:** Заполнение сетки целыми строками сразу ($O(M \cdot 2^{2N})$) вместо поклеточного сдвига профиля за $O(N \cdot M \cdot 2^N)$.

   **Источник:** [CP-Algorithms: Dynamic Programming on Broken Profile](https://cp-algorithms.com/dynamic_programming/profile-dynamics.html)

227. Как устроено динамическое программирование по подотрезкам на примере задачи о перемножении цепочки матриц (Matrix Chain Multiplication)?

   **Ответ:** Состояние $dp[i][j]$ вычисляет оптимум на подотрезке от $i$ до $j$. Вычисление идет по возрастанию длины отрезка $len = j - i + 1$. Переход перебирает точку последнего разбиения $k$ ($i \le k < j$): $dp[i][j] = \min_k (dp[i][k] + dp[k+1][j] + \text{cost}(i, k, j))$. Сложность: $O(n^3)$ по времени и $O(n^2)$ по памяти.

   **Пример:**

   ```cpp
   for (int len = 2; len <= n; ++len) {
       for (int i = 0; i <= n - len; ++i) {
           int j = i + len - 1;
           dp[i][j] = 1e9;
           for (int k = i; k < j; ++k) {
               dp[i][j] = std::min(dp[i][j], dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1]);
           }
       }
   }

   ```

   **Типичная ошибка:** Обход циклами по индексам `i` и `j` без фиксации длины отрезка, из-за чего значения $dp[i][k]$ и $dp[k+1][j]$ используются до их фактического вычисления.

   **Источник:** [Introduction to Algorithms (CLRS: Matrix-chain multiplication)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

228. Как решать задачи интервального DP (Interval DP) на расстановку скобок, палиндромы и разрезания?

   **Ответ:** Состояние задается границами $[i, j]$. Если крайние символы соответствуют условию (например, $s[i] == s[j]$ для палиндрома), подзадача редуцируется к внутреннему отрезку $dp[i+1][j-1]$. Если задача допускает произвольное деление (удаление подстрок, скобки), выполняется перебор точки склейки $k \in [i, j-1]$ с объединением решений $dp[i][k]$ и $dp[k+1][j]$.

   **Пример:**

   ```cpp
   // Наибольшая палиндромная подпоследовательность:
   if (s[i] == s[j]) dp[i][j] = dp[i + 1][j - 1] + 2;
   else dp[i][j] = std::max(dp[i + 1][j], dp[i][j - 1]);

   ```

   **Типичная ошибка:** Неправильная обработка базы индукции для отрезков длины 1 ($i == j$) и длины 2 ($j == i + 1$).

   **Источник:** [LeetCode: Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

229. Что такое Tree DP (DP на деревьях) и как на его основе найти максимальное независимое множество вершин?

   **Ответ:** Это вычисление динамики снизу вверх от листьев к корню через обход в глубину (post-order DFS). Для Maximum Independent Set состояние узла $u$ разделяется на две величины: $dp[u][0]$ (вершина $u$ не взята, дети могут быть как взяты, так и нет) и $dp[u][1]$ (вершина $u$ взята, ни один ее ребенок взят быть не может).

   **Пример:**

   ```cpp
   void dfs(int u, int p, const auto& adj, auto& dp) {
       dp[u][0] = 0;
       dp[u][1] = 1;
       for (int v : adj[u]) {
           if (v == p) continue;
           dfs(v, u, adj, dp);
           dp[u][0] += std::max(dp[v][0], dp[v][1]);
           dp[u][1] += dp[v][0];
       }
   }

   ```

   **Типичная ошибка:** Вычисление повторных обходов поддеревьев без кэширования значений в таблице DP, что превращает алгоритм в экспоненциальный.

   **Источник:** [CP-Algorithms: Dynamic Programming on Trees](https://cp-algorithms.com/)

230. Как устроено Bitmask DP в задаче коммивояжера (TSP / алгоритм Хелда–Карпа)?

   **Ответ:** Состояние кодируется парой $(mask, u)$, где $mask$ — битовая маска уже посещенных вершин, а $u$ — текущая вершина, в которой мы находимся. Переход перебирает следующую непосещенную вершину $v$: $dp[mask \mid (1 \ll v)][v] = \min(dp[mask \mid (1 \ll v)][v], dp[mask][u] + \text{cost}(u, v))$. Сложность снижается с $O(n!)$ до $O(n^2 \cdot 2^n)$.

   **Пример:**

   ```cpp
   for (int mask = 1; mask < (1 << n); ++mask) {
       for (int u = 0; u < n; ++u) {
           if (!(mask & (1 << u)) || dp[mask][u] == 1e9) continue;
           for (int v = 0; v < n; ++v) {
               if (!(mask & (1 << v))) {
                   int next_mask = mask | (1 << v);
                   dp[next_mask][v] = std::min(dp[next_mask][v], dp[mask][u] + dist[u][v]);
               }
           }
       }
   }

   ```

   **Типичная ошибка:** Применение битовых сдвигов `1 << v` для $v \ge 31$ без явного суффикса `1ULL`.

   **Источник:** [Introduction to Algorithms (CLRS: Held-Karp algorithm)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

231. Что такое Digit DP (динамическое программирование по цифрам)?

   **Ответ:** Это метод подсчета количества чисел на отрезке $[A, B]$, удовлетворяющих заданному свойству. Число представляется в виде массива цифр, а рекурсивная функция строит число от старших разрядов к младшим. Состояние обычно включает: `(индекс цифры, флаг tight (достигли ли верхней границы), флаг leading_zeros, накопленный признак/сумма)`.

   **Пример:**

   ```cpp
   int solve(int idx, bool tight, bool leading, int sum, const std::string& num, auto& memo) {
       if (idx == num.size()) return sum == target;
       if (!tight && !leading && memo[idx][sum] != -1) return memo[idx][sum];
       int limit = tight ? (num[idx] - '0') : 9;
       int ans = 0;
       for (int d = 0; d <= limit; ++d) {
           ans += solve(idx + 1, tight && (d == limit), leading && (d == 0), sum + d, num, memo);
       }
       if (!tight && !leading) memo[idx][sum] = ans;
       return ans;
   }

   ```

   **Типичная ошибка:** Мемоизация состояний при активном флаге `tight == true`: значение при ограничении префиксом уникально и не может переиспользоваться для свободных веток.

   **Источник:** [Codeforces: Digit DP Tutorial](https://codeforces.com/blog/entry/53960)

232. Как оптимизировать переходы в динамическом программировании с помощью монотонной очереди (Monotonic Queue Optimization)?

   **Ответ:** Если формула перехода имеет вид $dp[i] = \min_{i - k \le j < i} (dp[j] + \text{cost}(j)) + f(i)$, где оптимизируемое выражение внутри скобок зависит только от $j$, а отрезок поиска скользит вдоль массива, то минимум на окне длины $k$ находится монотонной двусторонней очередью `std::deque` за амортизированное время $O(1)$, снижая сложность с $O(n \cdot k)$ до $O(n)$.

   **Пример:**

   ```cpp
   std::deque<int> dq;
   for (int i = 0; i < n; ++i) {
       while (!dq.empty() && dq.front() < i - k) dq.pop_front();
       dp[i] = (dq.empty() ? 0 : dp[dq.front()]) + cost[i];
       while (!dq.empty() && dp[dq.back()] >= dp[i]) dq.pop_back();
       dq.push_back(i);
   }

   ```

   **Типичная ошибка:** Попытка применить монотонную очередь в уравнениях, где под знаком оптимума присутствуют произведения зависимостей от $i$ и от $j$ (для таких случаев требуется Convex Hull Trick).

   **Источник:** [CP-Algorithms: Monotonic queue optimization](https://cp-algorithms.com/)

233. В чём суть оптимизации «Разделяй и властвуй» (Divide and Conquer Optimization) в DP?

   **Ответ:** Оптимизация применима к переходам вида $dp[i][j] = \min_{k < j} (dp[i-1][k] + C(k, j))$, если точка оптимального перехода $opt(i, j)$ монотонна по аргументу $j$: $opt(i, j) \le opt(i, j+1)$. Вместо вычисления $j$ подряд, функция находит середину диапазона $mid = (L + R) / 2$, ищет для нее оптимум $k \in [opt_L, opt_R]$ линейно, а затем рекурсивно сужает диапазоны поиска для левой и правой половин. Снижает сложность с $O(K \cdot N^2)$ до $O(K \cdot N \log N)$.

   **Пример:**

   ```cpp
   void compute(int i, int l, int r, int opt_l, int opt_r) {
       if (l > r) return;
       int mid = l + (r - l) / 2, best_k = -1;
       long long best_val = 1e18;
       for (int k = opt_l; k <= std::min(mid - 1, opt_r); ++k) {
           long long cur = dp_prev[k] + cost(k, mid);
           if (cur < best_val) { best_val = cur; best_k = k; }
       }
       dp_cur[mid] = best_val;
       compute(i, l, mid - 1, opt_l, best_k);
       compute(i, mid + 1, r, best_k, opt_r);
   }

   ```

   **Типичная ошибка:** Применение метода к стоимостным функциям $C(k, j)$, не удовлетворяющим неравенству четырехугольника (*quadrangle inequality*).

   **Источник:** [CP-Algorithms: Divide and Conquer DP](https://cp-algorithms.com/dynamic_programming/divide-and-conquer-dp.html)

234. Что такое оптимизация Кнута (Knuth's Optimization) и каковы строгие условия её применимости?

   **Ответ:** Это оптимизация интервального DP ($dp[i][j] = \min_{i \le k < j} (dp[i][k] + dp[k+1][j]) + C(i, j)$), снижающая сложность с $O(n^3)$ до $O(n^2)$. Она применима, если: 1) Стоимость $C(i, j)$ монотонна по включению отрезков; 2) $C(i, j)$ удовлетворяет неравенству четырехугольника ($C(a, c) + C(b, d) \le C(a, d) + C(b, c)$ для $a \le b \le c \le d$). Из этого следует монотонность оптимальной точки: $opt[i][j-1] \le opt[i][j] \le opt[i+1][j]$.

   **Пример:**

   ```cpp
   // Перебор k ограничивается только вычисленными соседями:
   for (int k = opt[i][j - 1]; k <= opt[i + 1][j]; ++k) {
       // релаксация dp[i][j]
   }

   ```

   **Типичная ошибка:** Использование оптимизации без проверки выполнения неравенства четырехугольника для функции стоимости $C(i, j)$.

   **Источник:** [CP-Algorithms: Knuth's Optimization](https://cp-algorithms.com/dynamic_programming/knuth-optimization.html)

235. Как вычислять динамическое программирование на произвольном ориентированном ациклическом графе (DAG)?

   **Ответ:** Вершины сортируются топологически (через алгоритм Кана или DFS). Переходы DP вычисляются строго в порядке топологической последовательности (либо в обратном для путей в сток). Это гарантирует, что к моменту обработки вершины $u$ все ее зависимости уже полностью вычислены, исключая циклические взаимные ссылки.

   **Пример:**

   ```cpp
   for (int u : topo_order) {
       for (auto [v, weight] : adj[u]) {
           dp[v] = std::max(dp[v], dp[u] + weight);
       }
   }

   ```

   **Типичная ошибка:** Запуск вычисления DP по индексам $0, 1, \dots, V-1$ без предварительной топологической сортировки.

   **Источник:** [CP-Algorithms: Shortest Paths in DAG](https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html)

236. Что такое техника переподвешивания дерева (Rerooting DP) и как она работает?

   **Ответ:** Метод нахождения ответа для каждой вершины дерева в предположении, что именно она выбрана корнем, за общее линейное время $O(n)$ вместо $O(n^2)$. Выполняется в 2 прохода: 1) Первый DFS вычисляет DP для фиксированного корня (снизу вверх); 2) Второй DFS спускается от корня к детям, пересчитывая DP переносом корня (*reroot*) через исключение вклада текущего ребенка и добавление родительского остатка за $O(1)$.

   **Пример:**

   ```cpp
   // При переходе от родителя u к ребенку v:
   // Вычитаем влияние v из u, делаем u родителем для v, обновляем ответ для v
   void dfs2(int u, int p) {
       ans[u] = dp[u];
       for (int v : adj[u]) {
           if (v == p) continue;
           // Rollback / recalculate u -> v
           dfs2(v, u);
       }
   }

   ```

   **Типичная ошибка:** Полный пересчет поддерева с нуля при каждом спуске вместо вычитания/деления влияния ребенка за $O(1)$.

   **Источник:** [Codeforces: Tree Rerooting Technique](https://codeforces.com/blog/entry/68138)

237. Как префиксные суммы ускоряют переходы в динамическом программировании?

   **Ответ:** Если состояние вычисляется как сумма значений целого диапазона предыдущих состояний $dp[i][j] = \sum_{k=l}^r dp[i-1][k]$, прямой перебор требует времени $O(k)$. Построение массива префиксных сумм для слоя $i-1$ позволяет вычислять любую сумму подотрезка за $O(1)$, снижая общую сложность целого слоя DP на порядок.

   **Пример:**

   ```cpp
   // Вместо цикла по k:
   pref[0] = 0;
   for (int k = 0; k < m; ++k) pref[k + 1] = pref[k] + dp[i - 1][k];
   dp[i][j] = pref[r + 1] - pref[l]; // O(1) переход

   ```

   **Типичная ошибка:** Игнорирование взятия по модулю при вычитании префиксных сумм (`(pref[r] - pref[l] + MOD) % MOD`).

   **Источник:** [Competitive Programmer's Handbook (Antti Laaksonen)](https://cses.fi/book/book.pdf)

238. Как восстановить сам оптимальный путь или конфигурацию ответа в DP, а не только его числовую величину?

   **Ответ:** 1) **Через массив переходов:** при обновлении оптимума $dp[i]$ запоминать индекс предыдущего состояния в массив $parent[i]$, после чего восстановить путь разворотом цепочки от целевого состояния; 2) **Без дополнительной памяти:** после вычисления полной таблицы пройти в обратном направлении от ответа, проверяя, из какого состояния по формуле перехода получился текущий оптимум ($dp[i] == dp[i - w] + cost$).

   **Пример:**

   ```cpp
   int curr = target;
   std::vector<int> path;
   while (curr > 0) {
       path.push_back(parent[curr]);
       curr = parent[curr];
   }

   ```

   **Типичная ошибка:** Хранение полных векторов путей внутри ячеек таблицы `dp`, что увеличивает расход памяти с $O(N)$ до $O(N^2)$ и замедляет переходы операциями копирования.

   **Источник:** [Introduction to Algorithms (CLRS: Constructing an Optimal Solution)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

239. Как строго доказывать корректность переходов в динамическом программировании?

   **Ответ:** Доказательство строится по математической индукции по размерности параметров подзадач (длине отрезка, топологическому порядку, номеру шага):

1. Доказывается база индукции (корректность тривиальных случаев);

2. Предполагается, что решения всех меньших подзадач строго оптимальны (индукционный переход);

3. Доказывается свойство оптимальной подструктуры: глобальный оптимум не может состоять из неоптимальных частей (доказательство от противного методом *Cut-and-Paste*).

   **Пример:** Если бы существовал более короткий путь $A \to B \to C$, содержащий путь $A \to B$ меньшей длины, чем найденный $dp[B]$, мы могли бы заменить этот отрезок, уменьшив общую длину, что противоречит минимальности.

   **Типичная ошибка:** Пропуск проверки циклических зависимостей между состояниями, из-за чего индукционный шаг теряет обоснование.

   **Источник:** [Introduction to Algorithms (CLRS: Elements of dynamic programming)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

240. Какие типичные ошибки допускаются при выборе значений бесконечности (`INF`), базовых случаев и предотвращении целочисленных переполнений?

   **Ответ:**

1. Использование `INT_MAX` в качестве `INF`: при операции сложения `dp[i] = dp[j] + cost` возникает знаковое переполнение (UB); следует использовать безопасную величину (например, `1e9` или `0x3f3f3f3f`);

2. Неполная инициализация базы индукции (например, пропуск $dp[0] = 0$ при инициализации остального массива бесконечностями);

3. Использование 32-битного типа там, где сумма состояний или перемножение вероятностей выходит за пределы $\approx 2 \cdot 10^9$ (требуется `long long` или `double`).

   **Пример:**

   ```cpp
   constexpr int INF = 1e9; // Безопасно для INF + cost при cost < 1e9
   // Вместо: int INF = INT_MAX; -> INT_MAX + 1 = UB / отрицательное число!

   ```

   **Типичная ошибка:** Вызов `memset(dp, 1, sizeof(dp))` в расчете инициализировать массив единицами (заполняет каждый байт значением `0x01`, давая число `16843009`).

   **Источник:** [SEI CERT C++: INT32-C](https://wiki.sei.cmu.edu/confluence/display/cplusplus/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)

   ---

## 17. Greedy


241. Как определить, что к задаче применим жадный алгоритм (Greedy Algorithm)?

   **Ответ:** Задача должна удовлетворять двум фундаментальным свойствам:

1. **Свойство жадного выбора (Greedy-choice property):** локально оптимальный выбор на текущем шаге гарантированно ведет к глобально оптимальному решению без необходимости пересмотра прошлых решений;

2. **Оптимальная подструктура:** после совершения жадного выбора оставшаяся подзадача сохраняет ту же структуру и оптимум.

   **Пример:** В задаче выбора заявок выбор самого раннего времени окончания гарантированно оставляет максимальный остаток времени для остальных непересекающихся отрезков.

   **Типичная ошибка:** Применение жадных стратегий на основе локальной привлекательности к задачам, где локальный выбор закрывает доступ к глобально лучшему пути (например, 0/1 Knapsack).

   **Источник:** [Introduction to Algorithms (CLRS: An activity-selection problem)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

242. Почему в задаче выбора процессов (Interval Scheduling) жадный выбор по правой границе гарантирует оптимальность?

   **Ответ:** Выбор интервала с минимальным временем окончания ($R_i = \min$) освобождает ресурс как можно раньше, оставляя максимально возможное свободное окно времени для размещения всех последующих задач. Любой другой выбор интервала может закончиться только позже или в то же время, то есть предоставит не больше возможностей для оставшихся отрезков.

   **Пример:**

   ```cpp
   std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
       return a.end < b.end; // Сортировка по правой границе
   });
   ```

   **Типичная ошибка:** Сортировка интервалов по их длине ($R - L$) или по началу ($L$), что легко опровергается контрпримерами.

   **Источник:** [Algorithms (Kleinberg, Tardos: Interval Scheduling)](https://www.pearson.com/en-us/subject-catalog/p/algorithm-design/P200000003507)

243. Как найти максимальное количество попарно непересекающихся интервалов?

   **Ответ:** 1) Отсортировать все интервалы по возрастанию их правых границ; 2) Взять первый интервал и запомнить его правый конец `last_end`; 3) Итерироваться по отсортированному массиву: если начало очередного интервала $\ge last\_end$, инкрементировать счетчик и обновить $last\_end = interval.end$.

   **Пример:**

   ```cpp
   int max_non_overlapping(std::vector<std::pair<int, int>> intervals) {
       std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
           return a.second < b.second;
       });
       int count = 0, last_end = std::numeric_limits<int>::min();
       for (const auto& [start, end] : intervals) {
           if (start >= last_end) {
               count++;
               last_end = end;
           }
       }
       return count;
   }
   ```

   **Типичная ошибка:** Использование строгого неравенства `start > last_end` там, где касание концами допустимо по условию задачи.

   **Источник:** [LeetCode: Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

244. Как доказать корректность жадного алгоритма методом подмены (Exchange Argument)?

   **Ответ:**

1. Пусть существует гипотетическое оптимальное решение $OPT$, отличное от нашего жадного решения $GREEDY$;

2. Находим первую точку расхождения между ними;

3. Доказываем, что замена выбора из $OPT$ на элемент из $GREEDY$ не ухудшает значение целевой функции и не нарушает ограничений;

4. Шаг за шагом преобразуем решение $OPT$ в решение $GREEDY$ без потери оптимальности, доказывая, что жадное решение столь же оптимально.

   **Пример:** Замена первого интервала в $OPT$ на интервал с минимальным концом из $GREEDY$ оставляет для остальных задач не меньший интервал времени, чем в $OPT$.

   **Типичная ошибка:** Попытка доказать жадный алгоритм перебором 2–3 удачных примеров вместо формального доказательства через Exchange Argument.

   **Источник:** [Algorithm Design (Kleinberg, Tardos: Greedy Exchange Arguments)](https://www.pearson.com/en-us/subject-catalog/p/algorithm-design/P200000003507)

245. Как работает алгоритм Хаффмана (Huffman Coding) и почему он является жадным?

   **Ответ:** Алгоритм строит префиксный код оптимальной длины для сжатия данных. В min-кучу помещаются частоты всех символов. На каждом шаге жадно извлекаются два узла с наименьшими частотами, объединяются в новый родительский узел с суммарной частотой и возвращаются в кучу, пока не останется один корень. Жадный выбор двух наименьших частот гарантирует их размещение на максимальной глубине кодового дерева.

   **Пример:**

   ```cpp
   std::priority_queue<Node*, std::vector<Node*>, GreaterFreq> min_heap;
   while (min_heap.size() > 1) {
       Node* left = min_heap.top(); min_heap.pop();
       Node* right = min_heap.top(); min_heap.pop();
       auto* parent = new Node{'\0', left->freq + right->freq, left, right};
       min_heap.push(parent);
   }
   ```

   **Типичная ошибка:** Попытка применить жадное разделение частот сверху вниз вместо объединения наименьших снизу вверх.

   **Источник:** [Introduction to Algorithms (CLRS: Huffman codes)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

246. При каких условиях работает жадный алгоритм размена монет и когда он дает сбой?

   **Ответ:** Жадный алгоритм (брать всегда наибольшую доступную монету) дает строгий оптимум для канонических валютных систем (включая евро, доллары, рубли), где номиналы образуют матроидную структуру. Он терпит сбой для произвольных номиналов: например, для монет $\{1, 3, 4\}$ и суммы 6 жадный алгоритм выдаст $4 + 1 + 1$ (3 монеты), тогда как оптимально $3 + 3$ (2 монеты).

   **Пример:** Для произвольного набора номиналов необходимо использовать динамическое программирование за $O(S \cdot N)$.

   **Типичная ошибка:** Использование жадного размена монет в продакшене без математической проверки на каноничность набора номиналов (проверяется алгоритмом Пирсона за полиномиальное время).

   **Источник:** [Kozen, D.: On the optimality of the greedy coin-changing algorithm](https://ecommons.cornell.edu/handle/1813/6219)

247. Как минимизировать количество платформ или переговорных комнат для заданного расписания интервалов?

   **Ответ:** Все моменты начал ($+1$) и окончаний ($-1$) событий собираются в единый массив точек и сортируются по времени (при равенстве времени окончание обрабатывается раньше начала). Задача сводится к поиску максимальной высоты перекрытия отрезков (максимальной префиксной суммы событий).

   **Пример:**

   ```cpp
   int min_meeting_rooms(const std::vector<std::pair<int, int>>& intervals) {
       std::vector<std::pair<int, int>> events;
       for (const auto& [s, e] : intervals) {
           events.push_back({s, 1});  // Прибытие / начало
           events.push_back({e, -1}); // Отправление / конец
       }
       std::sort(events.begin(), events.end());
       int rooms = 0, max_rooms = 0;
       for (const auto& [time, type] : events) {
           rooms += type;
           max_rooms = std::max(max_rooms, rooms);
       }
       return max_rooms;
   }
   ```

   **Типичная ошибка:** Неправильный порядок обработки при совпадении времен: если освобождение комнаты обрабатывается позже занятия, алгоритм насчитает лишнюю комнату.

   **Источник:** [LeetCode: Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

248. Как выбрать минимальное число точек, чтобы покрыть все заданные отрезки (Interval Covering)?

   **Ответ:** 1) Отрезки сортируются по возрастанию правых концов; 2) Первая точка ставится в правый конец первого отрезка ($point = interval[0].end$); 3) Для каждого следующего отрезка: если его левый конец больше текущей точки ($start > point$), ставится новая точка в правый конец этого отрезка: $point = end$.

   **Пример:**

   ```cpp
   int find_min_arrow_shots(std::vector<std::vector<int>>& points) {
       std::sort(points.begin(), points.end(), [](const auto& a, const auto& b) {
           return a[1] < b[1];
       });
       int arrows = 1, last_pos = points[0][1];
       for (size_t i = 1; i < points.size(); ++i) {
           if (points[i][0] > last_pos) {
               arrows++;
               last_pos = points[i][1];
           }
       }
       return arrows;
   }
   ```

   **Типичная ошибка:** Помещение точки в середину или левый конец отрезка, что оставляет меньше шансов покрыть последующие отрезки.

   **Источник:** [LeetCode: Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)

249. Как строить лексикографически минимальную строку при сохранении уникальности символов и порядка (Remove Duplicate Letters)?

   **Ответ:** Используется жадный монотонный стек с подсчетом оставшихся частот символов. Символ жадно добавляется в стек; если вершина стека лексикографически больше текущего символа и этот символ из вершины встретится в строке дальше, он выталкивается из стека для уменьшения лексикографического ранга.

   **Пример:**

   ```cpp
   std::string remove_duplicate_letters(std::string s) {
       std::vector<int> count(26, 0);
       std::vector<bool> in_stack(26, false);
       for (char c : s) count[c - 'a']++;
       std::string res;
       for (char c : s) {
           count[c - 'a']--;
           if (in_stack[c - 'a']) continue;
           while (!res.empty() && res.back() > c && count[res.back() - 'a'] > 0) {
               in_stack[res.back() - 'a'] = false;
               res.pop_back();
           }
           res.push_back(c);
           in_stack[c - 'a'] = true;
       }
       return res;
   }
   ```

   **Типичная ошибка:** Выталкивание символа, который больше не появится в суффиксе строки (`count == 0`), что приводит к его полной потере в итоговом ответе.

   **Источник:** [LeetCode: Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/)

250. Как за один линейный проход проверить, достижим ли конец массива в игре Jump Game?

   **Ответ:** Поддерживается переменная максимальной достижимой дистанции `max_reach`. В цикле от 0 до $N-1$: если текущий индекс $i > max\_reach$, то достичь текущей клетки невозможно (возврат `false`). Иначе обновляется $max\_reach = \max(max\_reach, i + nums[i])$. Если $max\_reach \ge N - 1$, возврат `true`.

   **Пример:**

   ```cpp
   bool can_jump(const std::vector<int>& nums) {
       int max_reach = 0;
       for (int i = 0; i < nums.size(); ++i) {
           if (i > max_reach) return false;
           max_reach = std::max(max_reach, i + nums[i]);
           if (max_reach >= nums.size() - 1) return true;
       }
       return true;
   }
   ```

   **Типичная ошибка:** Применение рекурсивного поиска с возвратом (backtracking) или $O(n^2)$ DP там, где задача решается за $O(n)$ времени и $O(1)$ памяти.

   **Источник:** [LeetCode: Jump Game](https://leetcode.com/problems/jump-game/)

251. Как найти минимальное число прыжков для достижения конца массива в Jump Game II?

   **Ответ:** Жадная стратегия эмулирует уровни BFS без создания очереди: поддерживаются `cur_end` (граница текущего прыжка) и `farthest` (максимальная дистанция, достижимая со всех точек текущего прыжка). При достижении `cur_end` совершается прыжок ($jumps++$), и граница передвигается: $cur\_end = farthest$. Сложность: строго $O(n)$.

   **Пример:**

   ```cpp
   int jump(const std::vector<int>& nums) {
       int jumps = 0, cur_end = 0, farthest = 0;
       for (int i = 0; i < static_cast<int>(nums.size()) - 1; ++i) {
           farthest = std::max(farthest, i + nums[i]);
           if (i == cur_end) {
               jumps++;
               cur_end = farthest;
               if (cur_end >= nums.size() - 1) break;
           }
       }
       return jumps;
   }
   ```

   **Типичная ошибка:** Итерация до индекса $N-1$ включительно: это вызывает лишнее увеличение счетчика `jumps`, если мы уже стоим на последней позиции.

   **Источник:** [LeetCode: Jump Game II](https://leetcode.com/problems/jump-game-ii/)

252. Почему жадный алгоритм оптимален в задаче о кольцевом движении между заправочными станциями (Gas Station)?

   **Ответ:** Если суммарный объем топлива во всех станциях меньше суммарных затрат ($\sum gas < \sum cost$), решение невозможно в принципе. Иначе уникальное решение всегда существует. Если начав со станции $A$, запаса бензина не хватило доехать до станции $B$, то ни одна промежуточная станция между ними также не может быть стартовой (в них мы приходили бы с неотрицательным остатком и всё равно застряли). Следовательно, следующий кандидат на старт — станция $B + 1$.

   **Пример:**

   ```cpp
   int can_complete_circuit(const std::vector<int>& gas, const std::vector<int>& cost) {
       int total_tank = 0, curr_tank = 0, start_node = 0;
       for (int i = 0; i < gas.size(); ++i) {
           total_tank += gas[i] - cost[i];
           curr_tank += gas[i] - cost[i];
           if (curr_tank < 0) {
               start_node = i + 1; // Жадный перенос старта
               curr_tank = 0;
           }
       }
       return total_tank >= 0 ? start_node : -1;
   }
   ```

   **Типичная ошибка:** Моделирование полного проезда по кругу для каждой стартовой позиции за $O(n^2)$.

   **Источник:** [LeetCode: Gas Station](https://leetcode.com/problems/gas-station/)

253. В чём концептуальная разница между жадным алгоритмом (Greedy) и локальным поиском (Local Search)?

   **Ответ:** Жадный алгоритм строит решение конструктивно шаг за шагом, делая бесповоротный выбор на каждом шаге без последующего пересмотра, и гарантирует нахождение точного глобального оптимума (при выполнении матроидных свойств). Локальный поиск стартует с готового полного решения и итеративно улучшает его переходом в соседние конфигурации (*hill climbing, simulated annealing*), часто застревая в локальных экстремумах.

   **Пример:** Алгоритм Краскала строит MST за один жадный проход; алгоритм 2-opt для TSP производит локальный поиск перестановкой пар ребер готового тура.

   **Типичная ошибка:** Смешение жадного выбора с метаэвристиками локального поиска.

   **Источник:** [Artificial Intelligence: A Modern Approach (Russell, Norvig)](https://aima.cs.berkeley.edu/)

254. Как доказать, что предварительная сортировка по ключу и один линейный проход дают глобальный оптимум?

   **Ответ:** Доказывается через инверсии и метод транспозиций (*adjacent exchange*). Предполагается, что в оптимальном решении соседние элементы $i$ и $i+1$ расположены вопреки правилу сортировки. Показывается, что обмен этих элементов местами строго не ухудшает (или улучшает) целевую функцию. Следовательно, любая перестановка может быть сведена к отсортированной пузырьковыми обменами без потери качества.

   **Пример:** Сортировка задач в планировщике с минимизацией штрафов: задача с весом $w_i$ и длительностью $t_i$ упорядочивается по убыванию отношения $w_i / t_i$.

   **Типичная ошибка:** Попытка доказать оптимальность сортировки без рассмотрения взаимного влияния двух смежных инвертированных элементов.

   **Источник:** [Algorithm Design (Kleinberg, Tardos: Scheduling to Minimize Lateness)](https://www.pearson.com/en-us/subject-catalog/p/algorithm-design/P200000003507)

255. В каких случаях жадный алгоритм требует обязательного комбинирования с кучей (`std::priority_queue`) или DSU?

   **Ответ:**
   - **С кучей:** когда на каждом жадном шаге множество кандидатов динамически пополняется или изменяется (алгоритм Дейкстры, коды Хаффмана, слияние $K$ потоков, планирование задач с дедлайнами);
   - **С DSU:** когда жадный выбор требует проверки принадлежности глобальным компонентам эквивалентности или связности за почти константное время без пересчета графа (алгоритм Краскала).

   **Пример:** Выбор максимальной прибыли от задач с дедлайнами: сортировка задач по дедлайну, вставка в min-heap и удаление наименее прибыльных задач при переполнении лимита времени.

   **Типичная ошибка:** Использование линейного поиска минимума/максимума в массиве за $O(n)$ на каждом жадном шаге вместо поддержания кучи за $O(\log n)$.

   **Источник:** [Competitive Programmer's Handbook (Antti Laaksonen: Chapter 6)](https://cses.fi/book/book.pdf)

## 18. Bit manipulation


256. Как проверить, является ли положительное целое число степенью двойки?

   **Ответ:** Выражением `(x > 0) && ((x & (x - 1)) == 0)`. У степени двойки установлен ровно один бит. Вычитание единицы обращает этот бит в ноль, а все младшие биты делает единицами, поэтому их побитовое «И» дает строго `0`. В C++20 для этого есть стандартная функция `std::has_single_bit`.

   **Пример:**

   ```cpp
   #include <bit>

   bool is_power_of_two(unsigned int x) {
       return std::has_single_bit(x); // C++20
       // Или в C++17: return x > 0 && (x & (x - 1)) == 0;
   }
   ```

   **Типичная ошибка:** Забыть проверку `x > 0`. Для `x = 0` выражение `0 & -1` равно `0`, из-за чего ноль ошибочно признается степенью двойки.

   **Источник:** [Cppreference: std::has_single_bit](https://en.cppreference.com/w/cpp/numeric/has_single_bit)

257. Как подсчитать количество установленных битов (единиц) в числе?

   **Ответ:**

1. Использовать `std::popcount` (C++20), компилирующийся в аппаратную инструкцию процессора (`POPCNT`) за 1 такт;

2. Алгоритмом Брайана Кернигана в цикле `while (x) { x &= (x - 1); ++count; }` за время, пропорциональное числу единиц;

3. Компиляторными интринсиками `__builtin_popcount` (GCC/Clang) или `__popcnt` (MSVC).

   **Пример:**

   ```cpp
   #include <bit>

   int count_set_bits(uint32_t mask) {
       return std::popcount(mask); // O(1) аппаратная операция
   }
   ```

   **Типичная ошибка:** Побитовый сдвиг на 32 шага в цикле `for (int i = 0; i < 32; ++i)`, что работает медленнее в десятки раз по сравнению с инструкцией процессора.

   **Источник:** [Cppreference: std::popcount](https://en.cppreference.com/w/cpp/numeric/popcount)

258. Что делает выражение `x & (x - 1)`?

   **Ответ:** Сбрасывает в ноль самый младший установленный бит (rightmost set bit) числа, оставляя все старшие биты без изменений.

   **Пример:**

   ```text
   x     = 12 (двоичное: 00001100)
   x - 1 = 11 (двоичное: 00001011)
   -------------------------------
   x & (x - 1) = 8 (двоичное: 00001000) -> младший бит сброшен
   ```

   **Типичная ошибка:** Предполагать, что выражение удаляет старший бит или сбрасывает все единицы за раз.

   **Источник:** [Hacker's Delight (Henry S. Warren, Jr.)](https://en.wikipedia.org/wiki/Hacker%27s_Delight)

259. Как изолировать (выделить) младший установленный бит числа?

   **Ответ:** Выражением `x & (-x)`. В представлении с дополнительным кодом (two's complement) отрицание `-x` инвертирует биты и прибавляет единицу (`~x + 1`), из-за чего младший установленный бит сохраняется, а все биты левее него инвертируются.

   **Пример:**

   ```cpp
   uint32_t lowest_set_bit(uint32_t x) {
       return x & (-x); // Оставляет только один младший бит в виде маски
   }
   ```

   **Типичная ошибка:** Применение `x & (-x)` к знаковому `int` со значением `INT_MIN`: вычисление `-INT_MIN` приводит к знаковому переполнению и неопределенному поведению (UB). Следует использовать беззнаковые типы (`uint32_t`, `uint64_t`).

   **Источник:** [CP-Algorithms: Bit manipulations](https://cp-algorithms.com/)

260. Как поменять местами два числа через XOR и почему этот прием признан вредным в современном коде?

   **Ответ:** Тремя операциями: `a ^= b; b ^= a; a ^= b;`. В современном коде этот прием не используется, так как: 1) Он приводит к UB или обнулению переменной, если `a` и `b` ссылаются на один и тот же адрес в памяти (`&a == &b`); 2) Ломает конвейер процессора из-за жестких зависимостей по данным (data dependency); 3) `std::swap` оптимизируется компилятором напрямую через регистры или инструкцию `XCHG` быстрее и понятнее.

   **Пример:**

   ```cpp
   // Использовать только std::swap:
   std::swap(a, b);
   ```

   **Типичная ошибка:** Применение XOR-swap в коде сортировок при `a[i]` и `a[j]`, когда `i == j`, что мгновенно превращает элемент в 0.

   **Источник:** [C++ Core Guidelines: P.2](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#p2-write-in-iso-standard-c)

261. Как представить множество элементов из диапазона от 0 до 63 с помощью побитовых операций?

   **Ответ:** Числом типа `uint64_t`. $i$-й бит равен 1, если элемент $i$ присутствует в множестве, и 0, если отсутствует.
   - Добавить элемент: `mask |= (1ULL << i)`;
   - Удалить элемент: `mask &= ~(1ULL << i)`;
   - Проверить наличие: `(mask >> i) & 1ULL`;
   - Пересечение: `mask_a & mask_b`;
   - Объединение: `mask_a | mask_b`.

   **Пример:**

   ```cpp
   uint64_t set = 0;
   set |= (1ULL << 5);  // Добавили 5
   bool has_5 = (set & (1ULL << 5)) != 0;
   ```

   **Типичная ошибка:** Запись `1 << i` вместо `1ULL << i`. Литерал `1` имеет 32-битный знаковый тип `int`, и сдвиг на $i \ge 31$ приводит к UB.

   **Источник:** [Cppreference: Bitwise operators](https://en.cppreference.com/w/cpp/language/operator_arithmetic)

262. Как эффективно перебрать все подмаски заданной битовой маски `mask`?

   **Ответ:** Идиоматичным циклом `for (int sub = mask; sub > 0; sub = (sub - 1) & mask)`. Операция `sub - 1` меняет младший единичный бит на 0 и заполняет нули справа единицами, а побитовое `& mask` отсекает биты, не входящие в исходную маску. Сложность перебора всех подмасок для всех масок размера $N$ составляет $\sum_{k=0}^n \binom{n}{k} 2^k = 3^n$, а не $4^n$.

   **Пример:**

   ```cpp
   void iterate_submasks(int mask) {
       for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
           // Обработка непустой подмаски sub
       }
       // Отдельно обработать пустую подмаску sub = 0
   }
   ```

   **Типичная ошибка:** Условие `sub >= 0` в заголовке цикла. Так как `(0 - 1) & mask` снова дает `mask`, цикл превращается в бесконечный.

   **Источник:** [CP-Algorithms: Submask Enumeration](https://cp-algorithms.com/algebra/all-submasks.html)

263. Как найти единственный уникальный элемент в массиве, где все остальные элементы встречаются ровно дважды?

   **Ответ:** Побитовым применением операции XOR ко всем элементам массива. Свойства XOR: $x \oplus x = 0$ и $x \oplus 0 = x$. Парные дубликаты взаимно аннулируются, в результате чего остается только уникальное число за $O(n)$ времени и $O(1)$ памяти.

   **Пример:**

   ```cpp
   int single_number(const std::vector<int>& nums) {
       int result = 0;
       for (int x : nums) result ^= x;
       return result;
   }
   ```

   **Типичная ошибка:** Выделение `std::unordered_map` или `std::unordered_set`, требующее $O(n)$ дополнительной памяти в куче.

   **Источник:** [LeetCode: Single Number](https://leetcode.com/problems/single-number/)

264. Как найти уникальный элемент в массиве, где все остальные элементы встречаются ровно по 3 раза?

   **Ответ:** Подсчитать количество единиц в каждом из 32 битовых разрядов для всех чисел. Так как дубликаты встречаются трижды, сумма битов на каждой позиции кратна трем: $\text{count}[i] \pmod 3$. Оставшийся ненулевой остаток формирует биты искомого уникального числа.

   **Пример:**

   ```cpp
   int single_number_ii(const std::vector<int>& nums) {
       int result = 0;
       for (int bit = 0; bit < 32; ++bit) {
           int sum = 0;
           for (int x : nums) {
               if ((x >> bit) & 1) sum++;
           }
           if (sum % 3 != 0) {
               result |= (1U << bit);
           }
       }
       return result;
   }
   ```

   **Типичная ошибка:** Арифметический сдвиг `1 << 31` со знаковым типом `int` (приводит к знаковому переполнению, требуется `1U << bit`).

   **Источник:** [LeetCode: Single Number II](https://leetcode.com/problems/single-number-ii/)

265. Как решить задачу Subset Sum для $N \le 40$ методом Meet-in-the-middle?

   **Ответ:** 1) Разбить массив пополам на две части по $N/2$ элементов; 2) Сгенерировать битовыми масками все $2^{N/2}$ сумм подмножеств для левой и правой половин; 3) Отсортировать суммы правой половины; 4) Для каждой суммы левой половины найти бинарным поиском дополнение до целевой суммы за общее время $O(2^{N/2} \cdot N)$ вместо нереализуемого $O(2^N)$.

   **Пример:** Для $N = 40$ полный перебор требует $2^{40} \approx 10^{12}$ операций (таймаут), а Meet-in-the-middle — всего $2 \cdot 2^{20} \approx 2 \cdot 10^6$ шагов.

   **Типичная ошибка:** Попытка применить классическое DP по весу, если веса чисел достигают $10^9$ (псевдополиномиальное DP падает по памяти).

   **Источник:** [CP-Algorithms: Meet-in-the-middle](https://cp-algorithms.com/)

266. В каких ситуациях `std::bitset` эффективнее `std::vector<bool>` и `std::vector<char>`?

   **Ответ:** `std::bitset<N>` выделяет память на стеке без динамических аллокаций, его размер известен во время компиляции, и он поддерживает аппаратно ускоренные параллельные побитовые операции над 64-битными машинными словами (`&`, `|`, `^`, `count`, `shift`). `std::vector<bool>` динамический, но не предоставляет битовых операций над всем контейнером сразу; `std::vector<char>` тратит в 8 раз больше памяти (1 байт на бит).

   **Пример:** Рюкзак или транзитивное замыкание (алгоритм Флойда) на `std::bitset` ускоряется ровно в 64 раза за счет строчки `dp |= (dp << w)`.

   **Типичная ошибка:** Передача тяжелого `std::bitset<1000000>` по значению, что вызывает глубокое копирование мегабайта данных на стек.

   **Источник:** [Cppreference: std::bitset](https://en.cppreference.com/w/cpp/utility/bitset)

267. Как использовать битовые операции в задачах динамического программирования по подмножествам (Submask / Subset DP)?

   **Ответ:** Подмножества кодируются числами от $0$ до $2^n - 1$. Переход между состояниями выполняется манипуляцией отдельными битами: добавление элемента в множество — `mask | (1 << i)`, удаление — `mask ^ (1 << i)`. Состояния обходятся по возрастанию численного значения маски, гарантируя, что подмножества вычисляются раньше надмножеств.

   **Пример:**

   ```cpp
   for (int mask = 0; mask < (1 << n); ++mask) {
       for (int i = 0; i < n; ++i) {
           if (!(mask & (1 << i))) {
               dp[mask | (1 << i)] = std::min(dp[mask | (1 << i)], dp[mask] + cost[i]);
           }
       }
   }
   ```

   **Типичная ошибка:** Нарушение порядка вычисления: попытка перебирать маски произвольно без учета топологического порядка по числу включенных битов.

   **Источник:** [CSES: Dynamic Programming with Bitmasks](https://cses.fi/book/book.pdf)

268. Что представляет собой битовая компрессия состояний (State Compression)?

   **Ответ:** Это упаковка многомерного логического или дискретного состояния задачи (например, положения нескольких фишек, признаков посещенности, флагов) в одно компактное целое число фиксированной разрядности. Это позволяет использовать число напрямую как индекс в массиве DP и проверять равенство конфигураций за один такт процессора.

   **Пример:** Вместо хранения вектора булевых флагов `std::vector<bool> visited(16)` хранится одно число `uint16_t mask`.

   **Типичная ошибка:** Использование строковых представлений `"10101"` вместо машинного целого числа в качестве ключа хеш-таблицы.

   **Источник:** [Introduction to Algorithms (CLRS: Bitwise representation)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

269. Почему побитовые операции кратно ускоряют выполнение алгоритмов на практике?

   **Ответ:** Они работают на уровне элементарных инструкций регистров АЛУ процессора за 1 машинный такт. Битовые маски позволяют выполнять параллельную обработку данных (*SIMD inside a register* / SWAR): одна инструкция `bitset_a & bitset_b` одновременно выполняет 64 логические операции над 64 булевыми состояниями без условных ветвлений и промахов кэша.

   **Пример:** Проверка пересечения двух множеств из 64 элементов выполняется одной инструкцией `if (a & b)` вместо цикла на 64 итерации.

   **Типичная ошибка:** Замена прямой битовой маски контейнером `std::unordered_set<int>` в узких циклах.

   **Источник:** [Agner Fog: Optimizing subroutines in assembly language](https://www.agner.org/optimize/)

270. Какие опасные ошибки и неопределенное поведение возникают при битовых сдвигах знаковых типов (`signed int`) в C++?

   **Ответ:**

1. Сдвиг на число бит, большее или равное разрядности типа (`x << 32` для 32-битного числа), является **Undefined Behavior (UB)**;

2. Сдвиг на отрицательное число бит — UB;

3. Знаковый сдвиг влево `x << k`, приводящий к переполнению знакового бита, до стандарта C++20 являлся UB;

4. Правый сдвиг отрицательного знакового числа (`x >> k`) является реализационно-зависимым (implementation-defined), обычно выполняя арифметический сдвиг (размножение единичного знакового бита) вместо логического заполнения нулями.

   **Пример:**

   ```cpp
   // Безопасно: всегда использовать unsigned типы для побитовой логики
   uint32_t u = 1U << 31; // Корректно
   // Опасно:
   // int x = 1 << 31; // UB до C++20!
   ```

   **Типичная ошибка:** Применение правого сдвига `>>` к отрицательному числу в расчете получить логическое деление на степень двойки с обнулением старших разрядов.

   **Источник:** [Cppreference: Shift operators](https://en.cppreference.com/w/cpp/language/operator_arithmetic#Bitwise_shift_operators)


   ---

## 19. Интервалы, sweep line, события


271. Как объединить все перекрывающиеся интервалы (Merge Intervals)?

   **Ответ:** 1) Отсортировать интервалы по времени начала `start`; 2) Добавить первый интервал в ответ; 3) Итерироваться по оставшимся: если текущий интервал пересекается с последним в ответе (`current.start <= last.end`), расширить границу: `last.end = max(last.end, current.end)`. Если не пересекается — добавить как новый интервал. Сложность: $O(n \log n)$.

   **Пример:**

   ```cpp
   std::vector<std::vector<int>> merge_intervals(std::vector<std::vector<int>>& intervals) {
       if (intervals.empty()) return {};
       std::sort(intervals.begin(), intervals.end());
       std::vector<std::vector<int>> merged;
       merged.push_back(intervals[0]);
       for (size_t i = 1; i < intervals.size(); ++i) {
           if (intervals[i][0] <= merged.back()[1]) {
               merged.back()[1] = std::max(merged.back()[1], intervals[i][1]);
           } else {
               merged.push_back(intervals[i]);
           }
       }
       return merged;
   }
   ```

   **Типичная ошибка:** Сортировка по правой границе `end` вместо `start`, что нарушает возможность однопроходного объединения.

   **Источник:** [LeetCode: Merge Intervals](https://leetcode.com/problems/merge-intervals/)

272. Как вставить новый интервал в уже отсортированный и непересекающийся список интервалов за $O(n)$?

   **Ответ:** Проходом за три этапа:

1. Добавить в результат все интервалы, заканчивающиеся строго до начала нового (`interval.end < new.start`);

2. Объединить все пересекающиеся с новым интервалом, расширяя его границы: `new.start = min(...)`, `new.end = max(...)`; добавить объединенный интервал;

3. Добавить все оставшиеся интервалы, начинающиеся строго после конца нового.

   **Пример:**

   ```cpp
   std::vector<std::vector<int>> insert_interval(const std::vector<std::vector<int>>& intervals, std::vector<int> new_int) {
       std::vector<std::vector<int>> res;
       size_t i = 0, n = intervals.size();
       while (i < n && intervals[i][1] < new_int[0]) res.push_back(intervals[i++]);
       while (i < n && intervals[i][0] <= new_int[1]) {
           new_int[0] = std::min(new_int[0], intervals[i][0]);
           new_int[1] = std::max(new_int[1], intervals[i][1]);
           i++;
       }
       res.push_back(new_int);
       while (i < n) res.push_back(intervals[i++]);
       return res;
   }
   ```

   **Типичная ошибка:** Добавление интервала в конец вектора и повторная сортировка за $O(n \log n)$ вместо линейного слияния за $O(n)$.

   **Источник:** [LeetCode: Insert Interval](https://leetcode.com/problems/insert-interval/)

273. Как найти максимальное число одновременно перекрывающихся интервалов в любой момент времени?

   **Ответ:** Разбить каждый интервал $[L, R]$ на два точечных события: начало $(L, +1)$ и конец $(R, -1)$. Отсортировать события по координате (при совпадении координат конец события $-1$ идет раньше начала $+1$, если касание не считается перекрытием). Пройти по событиям, поддерживая текущую сумму: глобальный максимум этой суммы и есть ответ.

   **Пример:**

   ```cpp
   int max_overlapping(const std::vector<std::pair<int, int>>& intervals) {
       std::vector<std::pair<int, int>> events;
       for (auto [s, e] : intervals) {
           events.emplace_back(s, 1);
           events.emplace_back(e, -1);
       }
       std::sort(events.begin(), events.end());
       int cur = 0, ans = 0;
       for (auto [time, type] : events) {
           cur += type;
           ans = std::max(ans, cur);
       }
       return ans;
   }
   ```

   **Типичная ошибка:** Попытка использовать матрицу счетчиков или дискретную временную шкалу, если координаты достигают $10^9$.

   **Источник:** [CP-Algorithms: Sweep-line algorithm](https://cp-algorithms.com/)

274. Как вычислить суммарную длину объединения множества отрезков на прямой?

   **Ответ:** Отрезки объединяются (через алгоритм Merge Intervals), после чего суммируются длины полученных непересекающихся фрагментов: $\sum (end_i - start_i)$ за $O(n \log n)$.

   **Пример:**

   ```cpp
   long long total_covered_length(std::vector<std::pair<int, int>> intervals) {
       if (intervals.empty()) return 0;
       std::sort(intervals.begin(), intervals.end());
       long long total = 0;
       int cur_l = intervals[0].first, cur_r = intervals[0].second;
       for (size_t i = 1; i < intervals.size(); ++i) {
           if (intervals[i].first <= cur_r) {
               cur_r = std::max(cur_r, intervals[i].second);
           } else {
               total += cur_r - cur_l;
               cur_l = intervals[i].first;
               cur_r = intervals[i].second;
           }
       }
       total += cur_r - cur_l;
       return total;
   }
   ```

   **Типичная ошибка:** Наивное сложение длин исходных интервалов $(R_i - L_i)$ без вычитания их взаимных пересечений.

   **Источник:** [Competitive Programmer's Handbook (Antti Laaksonen: Chapter 27)](https://cses.fi/book/book.pdf)

275. Как сканирующая прямая (Sweep Line) находит точки пересечения геометрических объектов во времени?

   **Ответ:** Пространственная координата $X$ (или ось времени $T$) интерпретируется как направление движения воображаемой линии. На ней фиксируются дискретные события (появление объекта, удаление, контрольный запрос). Алгоритм обрабатывает точки событий строго слева направо, поддерживая в структуре данных (сбалансированное дерево/куча) только те объекты, которые линия пересекает в текущий момент.

   **Пример:** Алгоритм Бентли–Оттманна находит все точки пересечения $N$ отрезков за $O((N + K) \log N)$.

   **Типичная ошибка:** Попарная проверка всех отрезков за квадратичное время $O(N^2)$.

   **Источник:** [Introduction to Algorithms (CLRS: Line-segment properties)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

276. Как решить задачу Meeting Rooms II с помощью раздельной сортировки массивов начал и концов?

   **Ответ:** Моменты начал `starts` и окончания `ends` встреч выписываются в два отдельных массива и независимо сортируются по возрастанию. Два указателя бегут по массивам: если `starts[i] < ends[j]`, требуется новая комната ($rooms++$, $i++$). Иначе освобождается ранее выделенная комната ($j++$, $i++$).

   **Пример:**

   ```cpp
   int min_meeting_rooms(const std::vector<std::vector<int>>& intervals) {
       std::vector<int> starts, ends;
       for (const auto& it : intervals) {
           starts.push_back(it[0]);
           ends.push_back(it[1]);
       }
       std::sort(starts.begin(), starts.end());
       std::sort(ends.begin(), ends.end());
       int rooms = 0, end_ptr = 0;
       for (size_t i = 0; i < starts.size(); ++i) {
           if (starts[i] < ends[end_ptr]) rooms++;
           else end_ptr++;
       }
       return rooms;
   }
   ```

   **Типичная ошибка:** Создание тяжелых структур с аллокациями вместо двух простых плоских векторов целых чисел.

   **Источник:** [LeetCode: Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

277. Как решается задача о контуре зданий (The Skyline Problem)?

   **Ответ:** Методом Sweep Line. Каждое здание порождает два события: левый край с высотой $-H$ и правый край с высотой $+H$. События сортируются по координате $X$. В мультисет `std::multiset<int>` (или кучу с ленивым удалением) помещаются высоты активных зданий (с базовым $0$). Изменение текущей максимальной высоты в сете генерирует ключевую точку контура.

   **Пример:**

   ```cpp
   std::vector<std::vector<int>> get_skyline(const std::vector<std::vector<int>>& buildings) {
       std::vector<std::pair<int, int>> events;
       for (const auto& b : buildings) {
           events.emplace_back(b[0], -b[2]); // Старт: отрицательная высота
           events.emplace_back(b[1], b[2]);  // Конец: положительная высота
       }
       std::sort(events.begin(), events.end());
       std::multiset<int> heights = {0};
       std::vector<std::vector<int>> result;
       int prev_max = 0;
       for (auto [x, h] : events) {
           if (h < 0) heights.insert(-h);
           else heights.erase(heights.find(h));
           int cur_max = *heights.rbegin();
           if (cur_max != prev_max) {
               result.push_back({x, cur_max});
               prev_max = cur_max;
           }
       }
       return result;
   }
   ```

   **Типичная ошибка:** Использование `heights.erase(h)` вместо `heights.erase(heights.find(h))` для `std::multiset`, что ошибочно удаляет сразу **все** здания одинаковой высоты.

   **Источник:** [LeetCode: The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/)

278. Как применять разностный массив на ассоциативном контейнере (Difference Map) для интервалов с координатами до $10^9$?

   **Ответ:** Когда диапазон координат слишком велик для обычного вектора, массив разностей эмулируется деревом `std::map<int, int>`. Для каждого отрезка $[L, R)$ выполняется `diff[L] += val` и `diff[R] -= val`. Префиксная сумма вычисляется итерацией по упорядоченным ключам карты за $O(N \log N)$.

   **Пример:**

   ```cpp
   std::map<int, int> diff;
   for (const auto& [l, r, val] : queries) {
       diff[l] += val;
       diff[r] -= val;
   }
   int cur = 0;
   for (const auto& [coord, delta] : diff) {
       cur += delta;
       // cur - актуальное значение функции в точке coord
   }
   ```

   **Типичная ошибка:** Попытка выделить вектор `std::vector<int> diff(1e9)`, вызывающая исключение `std::bad_alloc`.

   **Источник:** [Codeforces: Difference Array Technique](https://codeforces.com/blog/entry/78762)

279. Что такое сжатие координат (Coordinate Compression) и для чего оно применяется?

   **Ответ:** Это отображение больших или разреженных значений координат (например, до $10^9$) в компактный диапазон индексов $[0, K-1]$ с сохранением их относительного порядка. Применяется для того, чтобы разреженные задачи можно было решать с помощью массивов, дерева Фенвика или дерева отрезков размера $O(N)$ вместо $O(\text{Range})$.

   **Пример:**

   ```cpp
   std::vector<int> coords = {1000, 5, 20000, 5};
   std::sort(coords.begin(), coords.end());
   coords.erase(std::unique(coords.begin(), coords.end()), coords.end());
   // Индекс сжатой координаты за O(log N):
   int compressed_id = std::lower_bound(coords.begin(), coords.end(), 1000) - coords.begin();
   ```

   **Типичная ошибка:** Забыть вызвать `std::unique` после сортировки вектора координат, что приводит к появлению одинаковых значений на разных индексах.

   **Источник:** [CP-Algorithms: Coordinate Compression](https://cp-algorithms.com/)

280. Как эффективно обрабатывать запросы на отрезках в режиме offline после сортировки событий?

   **Ответ:** Запросы объединяются со статическими данными задачи в единый хронологический поток событий и сортируются по координате $R$ (или $L$). Перемещаясь сканирующей прямой, алгоритм обновляет вспомогательную структуру (например, дерево Фенвика) и отвечает на запрос прямо в момент пересечения его границы, сохраняя ответы в исходных позициях запросов за $O((N + Q) \log N)$.

   **Пример:** Задача о количестве различных чисел на отрезках массива (D-query на SPOJ).

   **Типичная ошибка:** Попытка сортировать сами исходные запросы без сохранения их оригинальных входных индексов для вывода.

   **Источник:** [Codeforces: Offline Queries and Fenwick Tree](https://codeforces.com/blog/entry/15729)

281. Как найти количество пар вложенных интервалов (один интервал строго внутри другого)?

   **Ответ:** 1) Интервалы сортируются по началу `start` по возрастанию, а при равенстве — по концу `end` по убыванию; 2) Сжатые координаты правых концов заносятся в дерево Фенвика (BIT); 3) Проходя по отсортированным отрезкам, число охватывающих интервалов вычисляется через префиксную сумму дерева Фенвика по координатам правых концов за $O(n \log n)$.

   **Пример:** Благодаря сортировке, любой ранее рассмотренный отрезок гарантированно начинается не позже текущего, и для вложенности достаточно проверить условие на правые концы.

   **Типичная ошибка:** Неправильный вторичный порядок сортировки при равных началах (если сортировать по возрастанию правых концов, одинаковые отрезки посчитаются неверно).

   **Источник:** [CSES: Nested Ranges Count](https://cses.fi/problemset/task/2169)

282. Как решать задачи о площади объединения прямоугольников с помощью сканирующей прямой (Klee's Measure Problem)?

   **Ответ:** Вертикальные стороны прямоугольников преобразуются в события открытия и закрытия, отсортированные по координате $X$. Вертикальная прямая смещается по оси $X$, а на оси $Y$ активные отрезки поддерживаются деревом отрезков (*Segment Tree*) с операцией добавления на отрезке. Площадь накапливается как $\Delta X \times (\text{активная длина на оси } Y)$ за $O(N \log N)$.

   **Пример:**

   ```cpp
   // На каждом шаге:
   area += (events[i].x - events[i - 1].x) * seg_tree.query_covered_length();
   seg_tree.update(events[i].y1, events[i].y2, events[i].type);
   ```

   **Типичная ошибка:** Растеризация прямоугольников на двумерной сетке, что требует нереализуемой памяти $O(W \cdot H)$ при координатах до $10^9$.

   **Источник:** [CP-Algorithms: Klee's Measure Problem](https://cp-algorithms.com/geometry/intersecting_segments.html)

283. Какие структуры данных применяются для хранения активных интервалов во время движения Sweep Line?

   **Ответ:**
   - `std::multiset` / `std::set`: когда требуется быстрое добавление, удаление и поиск экстремумов или соседей за $O(\log N)$;
   - Дерево отрезков (*Segment Tree*) или дерево Фенвика: когда требуется динамический подсчет суммарной покрытой длины, числа точек или ранговых статистик на непрерывных отрезках;
   - `std::priority_queue` с ленивым удалением: когда интервалы нужно извлекать строго по времени их истечения.

   **Пример:** `std::set` с кастомным компаратором в алгоритме Бентли–Оттманна для отслеживания соседних отрезков по вертикали.

   **Типичная ошибка:** Использование `std::vector` с операцией линейного поиска и удаления `erase` за $O(N)$, что ухудшает алгоритм до квадратичной сложности $O(N^2)$.

   **Источник:** [Introduction to Algorithms (CLRS: Geometric Algorithms)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

284. Когда для решения задачи со сканирующей прямой достаточно обычной сортировки событий, а когда обязательно требуется дерево отрезков?

   **Ответ:** Обычной сортировки событий и префиксного счетчика достаточно для одномерных задач перекрытия точек и одномерных отрезков. Дерево отрезков (или Fenwick tree) необходимо, когда задача становится двумерной (площадь объединения прямоугольников, подсчет точек в 2D-диапазонах, динамические проверки отрезков по высоте).

   **Пример:** Подсчет числа комнат для встреч — одномерная задача (достаточно сортировки); нахождение суммарной площади проекций зданий или окон — двумерная (требуется дерево отрезков).

   **Типичная ошибка:** Усложнение кода написанием дерева отрезков для тривиальных одномерных задач поиска максимального пересечения.

   **Источник:** [Competitive Programming 4 (Steven Halim)](https://cpbook.net/)

285. Какие критические ошибки возникают при совпадении координат начала и конца событий в Sweep Line?

   **Ответ:** Если точка завершения одного интервала и точка старта другого имеют одинаковую координату $X$, неправильный порядок сортировки событий ломает корректность:

1. Если касание отрезков границами считается пересечением, то событие старта ($+1$) должно обрабатываться **раньше** события конца ($-1$);

2. Если касание не является пересечением, то событие завершения ($-1$) должно обязательно обрабатываться **раньше** старта ($+1$).

   Нарушение этого порядка дает ложные пики или провалы счетчика активных сущностей.

   **Пример:**

   ```cpp
   // Правильный компаратор с явным приоритетом типов событий при равенстве X:
   struct Event {
       int x;
       int type; // -1 для конца, +1 для старта
       bool operator<(const Event& o) const {
           if (x != o.x) return x < o.x;
           return type < o.type; // -1 обработается раньше +1
       }
   };
   ```

   **Типичная ошибка:** Сортировка структуры событий по умолчанию без детерминированного порядка для поля типа события `type` при равных координатах `x`.

   **Источник:** [CP-Algorithms: Sweep Line pitfalls](https://cp-algorithms.com/)

## 20. Fenwick / Segment Tree / Sparse Table


286. Когда обычных префиксных сумм уже недостаточно и требуется дерево Фенвика (Fenwick Tree / Binary Indexed Tree)?

   **Ответ:** Префиксные суммы идеальны для статических массивов ($O(1)$ на запрос суммы), но любая точечная модификация элемента требует $O(n)$ на пересчет массива. Дерево Фенвика необходимо в динамических сценариях, когда чередуются запросы изменения элементов и вычисления суммы на префиксе, выполняя обе операции за $O(\log n)$.

   **Пример:**

   ```cpp
   // Статический массив: build O(n), query O(1), update O(n)
   // Дерево Фенвика: build O(n), query O(log n), update O(log n)
   ```

   **Типичная ошибка:** Использование дерева Фенвика на массиве, который никогда не модифицируется после построения (для статических данных обычные префиксные суммы быстрее и проще).

   **Источник:** [CP-Algorithms: Fenwick Tree](https://cp-algorithms.com/data_structures/fenwick.html)

287. Как дерево Фенвика обеспечивает `point update` и `prefix query` за $O(\log n)$?

   **Ответ:** За счет разбиения индексов на степени двойки с помощью младшего установленного бита (`i & -i` / `lowbit`). Узел $i$ хранит сумму на полуинтервале $(i - (i \ \& \ -i), i]$. При запросе суммы индекс уменьшается: `i -= (i & -i)`; при обновлении значения ко всем предкам прибавляется дельта: `i += (i & -i)`. Число шагов ограничено количеством бит $O(\log n)$.

   **Пример:**

   ```cpp
   struct Fenwick {
       int n;
       std::vector<long long> tree;
       explicit Fenwick(int n) : n(n), tree(n + 1, 0) {}

       void add(int i, long long delta) {
           for (; i <= n; i += (i & -i)) tree[i] += delta;
       }

       long long query(int i) const {
           long long sum = 0;
           for (; i > 0; i -= (i & -i)) sum += tree[i];
           return sum;
       }
   };
   ```

   **Типичная ошибка:** Попытка использовать нулевой индекс (`i = 0`): выражение `0 & -0` равно нулю, из-за чего циклы `for` зависают в бесконечной итерации (в дереве Фенвика традиционно используется 1-индексация).

   **Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

288. Как вычислить сумму на произвольном отрезке $[l, r]$ с помощью дерева Фенвика?

   **Ответ:** По свойству аддитивности префиксных сумм: сумма на подотрезке $[l, r]$ равна разности префикса $r$ и префикса $l-1$: $\text{sum}(l, r) = \text{query}(r) - \text{query}(l - 1)$.

   **Пример:**

   ```cpp
   long long range_sum(const Fenwick& bit, int l, int r) {
       return bit.query(r) - bit.query(l - 1);
   }
   ```

   **Типичная ошибка:** Вычитание `bit.query(l)` вместо `bit.query(l - 1)`, из-за чего значение элемента $l$ исключается из суммы.

   **Источник:** [CP-Algorithms: Fenwick Tree](https://cp-algorithms.com/data_structures/fenwick.html)

289. Как адаптировать дерево Фенвика для поиска $k$-го порядкового элемента по префиксным суммам за $O(\log n)$?

   **Ответ:** С помощью метода двоичного подъема (Binary Lifting) прямо по массиву дерева Фенвика без внешнего бинарного поиска (который дал бы $O(\log^2 n)$). Степени двойки $2^{\lfloor \log_2 n \rfloor} \dots 1$ перебираются от старших к младшим: если накопленная сумма в текущем блоке меньше $k$, индекс сдвигается вправо, а из $k$ вычитается покрытая сумма.

   **Пример:**

   ```cpp
   int find_kth(const Fenwick& bit, long long k) {
       int idx = 0;
       for (int step = 1 << std::__lg(bit.n); step > 0; step >>= 1) {
           if (idx + step <= bit.n && bit.tree[idx + step] < k) {
               idx += step;
               k -= bit.tree[idx];
           }
       }
       return idx + 1; // 1-based index искомого k-го элемента
   }
   ```

   **Типичная ошибка:** Использование внешнего `std::lower_bound` поверх вызовов `bit.query(mid)`, ухудшающее сложность до $O(\log^2 n)$.

   **Источник:** [Topcoder: Binary Indexed Trees (Binary Lifting technique)](https://www.topcoder.com/community/competitive-programming/tutorials/binary-indexed-trees/)

290. В каких ситуациях дерево отрезков (Segment Tree) обязательно, а дерева Фенвика уже недостаточно?

   **Ответ:** Когда операция не является обратимой (нельзя выразить подотрезок через вычитание префиксов: $\min, \max, \gcd$), когда требуются массовые обновления на отрезках (*range updates* со сложными комбинированными операциями вроде «прибавить на отрезке и найти максимум»), либо когда требуется динамическое изменение структуры (динамическое/персистентное дерево отрезков).

   **Пример:** Поиск минимума на отрезке с обновлениями точек: в Fenwick Tree минимум не обратим (нельзя вычесть минимум префикса), поэтому требуется Segment Tree.

   **Типичная ошибка:** Попытка реализовать диапазонный минимум в Fenwick Tree через костыли с пересчетом соседних корзин, что увеличивает время обновления до $O(\log^2 n)$ или требует перестройки структуры.

   **Источник:** [CP-Algorithms: Segment Tree](https://cp-algorithms.com/data_structures/segment_tree.html)

291. Как устроен классический Segment Tree для суммы на отрезке?

   **Ответ:** Это полное двоичное дерево, где корень представляет весь массив $[0, n-1]$, а каждый узел $[l, r]$ делится пополам на детей $[l, mid]$ и $[mid+1, r]$. Узел хранит сумму элементов своего диапазона. Дерево упаковывается в плоский массив размера $4n$, где дети узла $v$ имеют индексы $2v$ и $2v+1$. Запросы суммы и точечные обновления выполняются рекурсивным спуском за $O(\log n)$.

   **Пример:**

   ```cpp
   void update(int v, int tl, int tr, int pos, int new_val, std::vector<int>& t) {
       if (tl == tr) { t[v] = new_val; return; }
       int tm = tl + (tr - tl) / 2;
       if (pos <= tm) update(2 * v, tl, tm, pos, new_val, t);
       else update(2 * v + 1, tm + 1, tr, pos, new_val, t);
       t[v] = t[2 * v] + t[2 * v + 1];
   }
   ```

   **Типичная ошибка:** Выделение массива дерева размера $2n$ вместо $4n$ для рекурсивной реализации, что приводит к выходу за пределы буфера на несбалансированных деревьях.

   **Источник:** [CP-Algorithms: Segment Tree](https://cp-algorithms.com/data_structures/segment_tree.html)

292. Что такое отложенная модификация (Lazy Propagation) и какую проблему она решает?

   **Ответ:** Это техника, позволяющая выполнять операции модификации на отрезке $[l, r]$ (например, прибавить $X$ ко всем элементам диапазона) за $O(\log n)$ вместо наивного $O(n)$. Обновление применяется к корневому узлу диапазона целиком, помечается во вспомогательном массиве `lazy`, а фактическое проталкивание (*push*) изменений дочерним узлам откладывается до момента, когда к ним поступит реальный запрос.

   **Пример:** Добавление константы ко всем элементам диапазона $[l, r]$ обновляет сумму узла на $(r - l + 1) \cdot X$ и сохраняет $X$ в `lazy`, не спускаясь глубже.

   **Типичная ошибка:** Вызов рекурсивного спуска к детям без предварительного вызова функции `push(v)` для сброса накопленного отложенного значения.

   **Источник:** [Introduction to Algorithms (CLRS: Range Trees and Lazy Propagation)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

293. Как поддерживать одновременные операции «прибавить на отрезке» и «найти максимум на отрезке» в Segment Tree?

   **Ответ:** Узел хранит `tree[v]` (максимум) и `lazy[v]` (накопленную прибавку). При прибавлении дельты к диапазону значение `tree[v] += delta`, а `lazy[v] += delta`. Вспомогательная функция `push(v)` перед любым спуском прибавляет `lazy[v]` к обоим детям (`tree[2v] += lazy[v]`, `lazy[2v] += lazy[v]`), после чего обнуляет `lazy[v] = 0`.

   **Пример:**

   ```cpp
   void push(int v) {
       if (lazy[v] != 0) {
           tree[2 * v] += lazy[v];     lazy[2 * v] += lazy[v];
           tree[2 * v + 1] += lazy[v]; lazy[2 * v + 1] += lazy[v];
           lazy[v] = 0;
       }
   }
   ```

   **Типичная ошибка:** Умножение дельты на длину отрезка при расчете максимума (в отличие от суммы, прибавка $X$ ко всем числам отрезка увеличивает его максимум ровно на $X$, а не на $(len) \cdot X$).

   **Источник:** [CP-Algorithms: Segment Tree with Lazy Propagation](https://cp-algorithms.com/data_structures/segment_tree.html)

294. Как найти минимум на отрезке в массиве с поддержкой обновлений?

   **Ответ:** С помощью стандартного дерева отрезков на минимум (Range Minimum Query / RMQ). Листья хранят значения массива, внутренние узлы — $\min(\text{left\_child}, \text{right\_child})$. Точечное обновление перезаписывает лист и пересчитывает путь до корня за $O(\log n)$. Диапазонный запрос объединяет результаты $O(\log n)$ покрывающих подотрезков.

   **Пример:**

   ```cpp
   int query_min(int v, int tl, int tr, int l, int r, const std::vector<int>& t) {
       if (l > r) return std::numeric_limits<int>::max();
       if (l == tl && r == tr) return t[v];
       int tm = tl + (tr - tl) / 2;
       return std::min(query_min(2 * v, tl, tm, l, std::min(r, tm), t),
                       query_min(2 * v + 1, tm + 1, tr, std::max(l, tm + 1), r, t));
   }
   ```

   **Типичная ошибка:** Возврат 0 вместо бесконечности (`INT_MAX`) при невалидном пересечении отрезков `l > r`.

   **Источник:** [LeetCode: Range Sum Query - Mutable (вариация на RMQ)](https://leetcode.com/problems/range-sum-query-mutable/)

295. Что такое Sparse Table (разреженная таблица) и когда она превосходит Segment Tree?

   **Ответ:** Это статическая двумерная таблица $ST[k][i]$, хранящая результат операции на отрезке длины $2^k$, начинающемся в индексе $i$. Построение занимает $O(n \log n)$ времени и памяти. Для идемпотентных операций ($\min, \max, \gcd$) запрос на произвольном отрезке $[L, R]$ выполняется за **строгое** $O(1)$ без рекурсии: $\min(ST[k][L], ST[k][R - 2^k + 1])$, где $k = \lfloor \log_2(R - L + 1) \rfloor$. Она быстрее Segment Tree по времени ответа, но не поддерживает модификацию данных.

   **Пример:**

   ```cpp
   int k = std::__lg(r - l + 1);
   int ans = std::min(st[k][l], st[k][r - (1 << k) + 1]); // O(1)
   ```

   **Типичная ошибка:** Попытка использовать Sparse Table в задачах с динамическими изменениями элементов (любое обновление требует полного пересчета за $O(n \log n)$).

   **Источник:** [CP-Algorithms: Sparse Table](https://cp-algorithms.com/data_structures/sparse-table.html)

296. Почему Sparse Table выполняет запросы за $O(1)$ только для идемпотентных операций?

   **Ответ:** Идемпотентность означает, что повторное применение операции к тем же данным не меняет результат ($x \circ x = x$: для минимума $\min(x, x) = x$). Отрезок $[L, R]$ покрывается двумя перекрывающимися блоками длины $2^k$. Для минимума/максимума дублирование элементов на стыке не влияет на ответ. Для суммы ($x + x \neq x$) перекрытие учитывает элементы дважды, поэтому сумму на Sparse Table можно считать только разбиением на непересекающиеся блоки за $O(\log n)$.

   **Пример:** $\min([2, 5, 3]) = \min(\min(2, 5), \min(5, 3)) = 2$ (корректно), но сумма $(2 + 5) + (5 + 3) = 15 \ne 10$ (ошибка из-за дублирования пятерки).

   **Типичная ошибка:** Попытка вычислить сумму на отрезке по формуле $ST[k][L] + ST[k][R - 2^k + 1]$ за $O(1)$.

   **Источник:** [CP-Algorithms: Sparse Table](https://cp-algorithms.com/data_structures/sparse-table.html)

297. Как реализовать итеративное дерево отрезков (Iterative Segment Tree) в C++?

   **Ответ:** Листья размещаются на позициях от $n$ до $2n - 1$, а корень дерева находится на индексе 1. Родитель узла $i$ вычисляется как $i / 2$, дети — $2i$ и $2i + 1$. Алгоритм не использует рекурсию: обновление поднимается от листа к корню циклом `for (i += n; i > 1; i >>= 1)`, а запрос сжимает границы $[l, r)$ снизу вверх за компактный цикл.

   **Пример:**

   ```cpp
   struct IterativeSegTree {
       int n;
       std::vector<int> t;
       explicit IterativeSegTree(int n) : n(n), t(2 * n, 0) {}

       void update(int p, int value) {
           for (t[p += n] = value; p > 1; p >>= 1) t[p >> 1] = t[p] + t[p ^ 1];
       }

       int query(int l, int r) const { // [l, r)
           int res = 0;
           for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
               if (l & 1) res += t[l++];
               if (r & 1) res += t[--r];
           }
           return res;
       }
   };
   ```

   **Типичная ошибка:** Использование закрытого интервала $[l, r]$ вместо полуоткрытого $[l, r)$ в итеративной схеме, приводящее к пропуску правого элемента.

   **Источник:** [Codeforces: Efficient and easy segment trees (Al.Cash)](https://codeforces.com/blog/entry/18051)

298. Каков баланс между потреблением памяти и скоростью работы у Segment Tree?

   **Ответ:** Классическое рекурсивное дерево требует массив размера $4n$, итеративное — ровно $2n$ памяти и работает в 2–4 раза быстрее за счет линейной кэш-локальности и отсутствия рекурсивного стека. Динамическое дерево отрезков (с указателями на детей) выделяет вершины по требованию ($O(q \log C)$ памяти при диапазоне $C \le 10^9$), но существенно проигрывает по скорости из-за работы аллокатора и промахов кэша.

   **Пример:** Массив на $10^6$ элементов: рекурсивное дерево требует $16$ МБ, итеративное — $8$ МБ памяти.

   **Типичная ошибка:** Создание динамического дерева с указателями `new Node()` там, где размер массива известен заранее и помещается в статический буфер.

   **Источник:** [C++ Core Guidelines: Per.7](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#per7-design-to-enable-optimization)

299. Как решать задачи порядковых статистик (Order Statistics) с помощью дерева Фенвика или Segment Tree?

   **Ответ:** Структура используется как дерево частот: на позиции $X$ хранится количество элементов, равных числу $X$ (при необходимости координаты сжимаются). Запрос «найти $k$-й наименьший элемент» сводится к нахождению минимального индекса, префиксная сумма на котором достигает $k$ (через двоичный подъем в Fenwick Tree или спуск влево/вправо в Segment Tree) за $O(\log n)$.

   **Пример:** Добавление числа $X$ — `add(X, 1)`; удаление — `add(X, -1)`. Поиск $k$-го — спуск по дереву за $O(\log n)$.

   **Типичная ошибка:** Линейный поиск по массиву частот за $O(N)$ вместо логарифмического спуска по битовым шагам.

   **Источник:** [CP-Algorithms: Fenwick Tree as Frequency Array](https://cp-algorithms.com/data_structures/fenwick.html)

300. Когда использование Policy-Based Data Structures (`pb_ds`) предпочтительнее самописного дерева отрезков?

   **Ответ:** Когда в коде на GCC/Clang требуется функционал сбалансированного дерева поиска с быстрым нахождением $k$-го элемента по порядку (`find_by_order`) и числа элементов, строго меньших заданного (`order_of_key`) за $O(\log n)$, не требующий диапазонных сумм или модификаций отрезков. `pb_ds::tree` пишется в две строчки через шаблоны, исключая ошибки реализации собственного AVL/Red-Black/Segment дерева.

   **Пример:**

   ```cpp
   #include <ext/pb_ds/assoc_container.hpp>
   #include <ext/pb_ds/tree_policy.hpp>

   template <typename T>
   using ordered_set = __gnu_pbds::tree<T, __gnu_pbds::null_type, std::less<T>,
                       __gnu_pbds::rb_tree_tag, __gnu_pbds::tree_order_statistics_node_update>;

   ordered_set<int> os;
   os.insert(10); os.insert(20);
   int idx = os.order_of_key(15); // Вернет 1 (одно число меньше 15)
   ```

   **Типичная ошибка:** Попытка использовать `pb_ds` в переносимом коде под MSVC (библиотека является специфичным расширением GNU C++).

   **Источник:** [GCC Online Docs: Policy-Based Data Structures](https://gcc.gnu.org/onlinedocs/libstdc++/manual/policy_data_structures.html)


   ---

## 21. Trie / String DS


301. Как устроено префиксное дерево (Trie) и какова сложность операций по длине строки?

   **Ответ:** Это корневое дерево, где каждое ребро помечается символом алфавита, а путь от корня к узлу задает префикс строки. Узлы содержат массив указателей на детей размера алфавита $\Sigma$ и булев флаг конца слова `is_terminal`. Операции вставки, поиска и проверки префикса выполняются за строго линейное время от длины строки $O(L)$ и не зависят от общего количества уже сохраненных слов $N$.

   **Пример:**

   ```cpp
   struct TrieNode {
       std::array<TrieNode*, 26> next{};
       bool is_terminal = false;
   };
   ```

   **Типичная ошибка:** Оценка сложности поиска в Trie как $O(N \cdot L)$ (сложность поиска зависит только от длины запроса $L$ и равна $O(L)$).

   **Источник:** [Introduction to Algorithms (CLRS: Tries)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

302. Как найти пару чисел с максимальным побитовым XOR в массиве с помощью бинарного Trie?

   **Ответ:** Все числа представляются в виде 32-битных двоичных цепочек и вставляются в 0/1-Trie. Для каждого числа $X$ выполняется жадный спуск от старшего 31-го бита к младшим: на каждом шаге алгоритм пытается пойти в противоположный бит (`1 - current_bit`). Если ветка с противоположным битом существует, в текущий разряд ответа записывается единица; иначе приходится идти в бит `current_bit`. Сложность: $O(32 \cdot n) = O(n)$.

   **Пример:**

   ```cpp
   int find_max_xor(int num, TrieNode* root) {
       TrieNode* curr = root;
       int max_xor = 0;
       for (int i = 31; i >= 0; --i) {
           int bit = (num >> i) & 1;
           int desired = 1 - bit;
           if (curr->next[desired]) {
               max_xor |= (1 << i);
               curr = curr->next[desired];
           } else {
               curr = curr->next[bit];
           }
       }
       return max_xor;
   }
   ```

   **Типичная ошибка:** Попарное вычисление XOR всех элементов двойным циклом за $O(n^2)$.

   **Источник:** [LeetCode: Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)

303. Как корректно удалить слово из Trie без утечек памяти и поломки общих префиксов?

   **Ответ:** С помощью рекурсивного спуска (backtracking): в целевом узле сбрасывается флаг `is_terminal = false`. Возвращаясь вверх по стеку вызовов, узел физически удаляется (`delete`) тогда и только тогда, когда он больше не является терминальным и у него нет ни одного живого ребенка (`next[i] == nullptr` для всех $i$).

   **Пример:**

   ```cpp
   bool remove(TrieNode* curr, std::string_view word, size_t depth) {
       if (!curr) return false;
       if (depth == word.size()) {
           if (!curr->is_terminal) return false;
           curr->is_terminal = false;
           return has_no_children(curr);
       }
       int idx = word[depth] - 'a';
       if (remove(curr->next[idx], word, depth + 1)) {
           delete curr->next[idx];
           curr->next[idx] = nullptr;
           return !curr->is_terminal && has_no_children(curr);
       }
       return false;
   }
   ```

   **Типичная ошибка:** Простое удаление узла конца слова через `delete`, что ломает слова, для которых удаляемая строка являлась собственным префиксом.

   **Источник:** [GeeksforGeeks: Trie Delete Operation](https://www.geeksforgeeks.org/trie-delete/)

304. Как поддерживать количество слов с заданным префиксом за время $O(L)$?

   **Ответ:** В каждый узел Trie добавляется целочисленный счетчик `prefix_count`. При вставке нового слова алгоритм инкрементирует `prefix_count++` в каждом посещенном узле пути. Запрос количества слов по префиксу спускается до конца префикса и возвращает значение поля `curr->prefix_count` за $O(L)$ без полного обхода поддерева.

   **Пример:**

   ```cpp
   struct TrieNode {
       std::array<TrieNode*, 26> next{};
       int prefix_count = 0;
   };
   // При вставке: node->prefix_count++;
   // При запросе: дойти до узла префикса и вернуть node->prefix_count;
   ```

   **Типичная ошибка:** Запуск рекурсивного обхода (DFS) от узла префикса для пересчета всех терминальных листьев поддерева при каждом запросе ($O(\text{TreeSize})$).

   **Источник:** [LeetCode: Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)

305. В каких случаях Trie эффективнее хеш-таблицы, а в каких уступает ей?

   **Ответ:** Trie эффективнее при автодополнении, поиске по общему префиксу, лексикографической сортировке слов, поиске наибольшего общего префикса и отсутствии скачков задержек на `rehash`. Уступает хеш-таблице по расходу оперативной памяти (Trie хранит множество пустых указателей и узлов) и по абсолютной скорости поиска одиночных точных ключей (Trie делает цепочку переходов по указателям с промахами кэша L1/L2, тогда как хеш-таблица находит корзину за одно чтение).

   **Пример:** Поиск всех слов, начинающихся на `"app"`, в Trie занимает $O(L + K)$, а в хеш-таблице требует перебора всех миллионов ключей словаря за $O(N)$.

   **Типичная ошибка:** Использование Trie исключительно для проверки равенства строк вместо `std::unordered_set<std::string>`.

   **Источник:** [Introduction to Algorithms (CLRS: Tries versus Hashing)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

306. Как реализовать поиск слов с подстановочным символом `.` (wildcard) через Trie?

   **Ответ:** Рекурсивным обходом (DFS): для обычного символа алгоритм переходит в ветку `next[c - 'a']`. При встрече подстановочного символа `.` алгоритм разветвляется и рекурсивно проверяет **всех** существующих ненулевых детей текущего узла. Если хотя бы одна ветка вернула успех, поиск завершается успешно.

   **Пример:**

   ```cpp
   bool search_in_node(std::string_view word, size_t idx, TrieNode* curr) {
       if (!curr) return false;
       if (idx == word.size()) return curr->is_terminal;
       char c = word[idx];
       if (c != '.') return search_in_node(word, idx + 1, curr->next[c - 'a']);
       for (int i = 0; i < 26; ++i) {
           if (curr->next[i] && search_in_node(word, idx + 1, curr->next[i])) return true;
       }
       return false;
   }
   ```

   **Типичная ошибка:** Возврат результата первого проверенного ребенка без проверки остальных веток при получении `false`.

   **Источник:** [LeetCode: Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

307. Что представляет собой алгоритм Ахо–Корасик (Aho–Corasick) и когда он необходим?

   **Ответ:** Это расширение структуры Trie до конечного автомата за счет добавления суффиксных ссылок (*suffix links*), аналогичных $\pi$-функции в алгоритме Кнута–Морриса–Пратта (KMP). Он необходим для одновременного поиска множества словарных шаблонов в потоковом тексте за время $O(\text{TextLength} + \text{MatchesCount})$ за один проход без возвратов назад по тексту.

   **Пример:** Поиск вхождений $10^5$ запрещенных спам-слов в статье из миллиона символов за один линейный проход.

   **Типичная ошибка:** Запуск алгоритма КМП независимо для каждого из $K$ шаблонов, что увеличивает время до $O(K \cdot N)$.

   **Источник:** [CP-Algorithms: Aho-Corasick Algorithm](https://cp-algorithms.com/string/aho_corasick.html)

308. Как эффективно найти все вхождения множества различных паттернов в один большой текст?

   **Ответ:** 1) Построить префиксное дерево (Trie) по всем искомым паттернам; 2) С помощью BFS вычислить суффиксные ссылки (*suffix links*) и ссылки выхода (*exit links / dictionary links*), превратив дерево в автомат Ахо–Корасик; 3) Пройти по тексту одним указателем автомата, фиксируя найденные паттерны по цепочкам ссылок выхода.

   **Пример:** Сложность построения: $O(\sum \vert{}pattern_i\vert{} \cdot \Sigma)$, сложность поиска по тексту $T$: $O(\vert{}T\vert{} + \text{matches})$.

   **Типичная ошибка:** Попытка использовать наивный Trie без суффиксных ссылок, требующая перезапуска поиска от каждого символа текста за $O(\vert{}T\vert{} \cdot \max \vert{}pattern\vert{})$.

   **Источник:** [Algorithms on Strings (Crochemore, Rytter)](https://www.cambridge.org/core/books/jewels-of-stringology/79C1B20A102AA19B61EAC4AEF1B3E034)

309. Как устроен суффиксный массив (Suffix Array) и для каких задач он применяется?

   **Ответ:** Это массив целых чисел, представляющий собой лексикографически отсортированный список начальных индексов всех суффиксов строки. Вместе с массивом наибольших общих префиксов соседних суффиксов (LCP Array) он позволяет находить подстроки, считать число уникальных подстрок, искать наидлиннейший общий префикс и находить наибольшую повторяющуюся подстроку за $O(n \log n)$ или $O(n)$ памяти.

   **Пример:** Для строки `"banana"` суффиксы сортируются: `"a" (5)`, `"ana" (3)`, `"anana" (1)`, `"banana" (0)`, `"na" (4)`, `"nana" (2)`. Суффиксный массив: `[5, 3, 1, 0, 4, 2]`.

   **Типичная ошибка:** Сортировка суффиксов как объектов `std::string` через `std::sort`, занимающая $O(n^2 \log n)$ времени и вызывающая переполнение памяти, вместо использования алгоритма скользящего удвоения за $O(n \log n)$.

   **Источник:** [CP-Algorithms: Suffix Array](https://cp-algorithms.com/string/suffix-array.html)

310. Как найти вхождение образца в текст с помощью суффиксного массива?

   **Ответ:** Так как суффиксный массив упорядочен лексикографически, любой префикс суффикса также упорядочен. Вхождение образца $P$ длины $m$ ищется двумя стандартными бинарными поисками (`std::lower_bound` и `std::upper_bound`) по суффиксному массиву за время $O(m \log n)$.

   **Пример:**

   ```cpp
   // Сравнение подстроки с паттерном:
   int l = 0, r = n - 1;
   while (l <= r) {
       int mid = l + (r - l) / 2;
       int cmp = s.compare(sa[mid], m, pattern);
       if (cmp == 0) return true; // Найдено
       if (cmp < 0) l = mid + 1;
       else r = mid - 1;
   }
   ```

   **Типичная ошибка:** Линейный перебор элементов суффиксного массива вместо применения бинарного поиска.

   **Источник:** [Introduction to Algorithms (CLRS: Suffix Arrays)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

311. Что такое суффиксный автомат (Suffix Automaton / SAM) и какие запросы он решает?

   **Ответ:** Это минимальный детерминированный ориентированный ациклический конечный автомат (DAG), принимающий все суффиксы заданной строки. Автомат строится онлайн за строго линейное время $O(n)$ и занимает $O(n)$ памяти. Он умеет за линейное время: проверять вхождение подстроки, считать число вхождений, находить число различных подстрок, искать наименьший циклический сдвиг и наибольшую общую подстроку нескольких строк.

   **Пример:** Содержит не более $2n - 1$ состояний и не более $3n - 4$ переходов для строки длины $n$.

   **Типичная ошибка:** Попытка построить полный суффиксный бор (Trie) всех суффиксов, который требует квадратичной памяти $O(n^2)$, вместо суффиксного автомата за $O(n)$.

   **Источник:** [CP-Algorithms: Suffix Automaton](https://cp-algorithms.com/string/suffix-automaton.html)

312. Как вычислить количество различных подстрок строки с помощью суффиксного автомата за $O(n)$?

   **Ответ:** Каждое состояние $u$ суффиксного автомата представляет эквивалентный класс подстрок, заканчивающихся в одинаковом наборе позиций. Количество подстрок, уникально представленных состоянием $u$, равно разности между максимальной и минимальной длиной строки класса: $\text{len}(u) - \text{len}(\text{link}(u))$. Общее число уникальных подстрок равно сумме этих разностей по всем состояниям автомата за один проход по массиву состояний.

   **Пример:**

   ```cpp
   long long total_unique_substrings(const std::vector<State>& st) {
       long long total = 0;
       for (size_t i = 1; i < st.size(); ++i) { // 0 - корень
           total += st[i].len - st[st[i].link].len;
       }
       return total;
   }
   ```

   **Типичная ошибка:** Занесение всех подстрок в `std::unordered_set<std::string>`, что занимает $O(n^2)$ времени и $O(n^2)$ памяти и падает по лимитам при $n > 5000$.

   **Источник:** [CP-Algorithms: Number of different substrings via SAM](https://cp-algorithms.com/string/suffix-automaton.html)

313. Каковы сравнительные характеристики Trie, Suffix Array и хеширования строк по расходу памяти и скорости?

   **Ответ:**
   - **Полиномиальное хеширование:** $O(n)$ память, поиск подстроки за $O(1)$, но вероятностно (риск коллизий);
   - **Trie:** память $O(N \cdot L \cdot \Sigma)$, оптимален для словарей с общими префиксами, поиск за $O(L)$, но неэффективен для произвольных подстрок одного текста;
   - **Suffix Array:** компактная память $O(n)$ (всего 1 вектор индексов `int`), поиск подстроки за детерминированное $O(m \log n)$;
   - **Suffix Automaton:** память $\approx 2n \times \Sigma$ указателей, поиск за строгое $O(m)$ без логарифма.

   **Пример:** Для анализа генома из $10^7$ символов Suffix Array требует $\approx 40$ МБ RAM, а суффиксный Trie не поместится ни в какую оперативную память.

   **Типичная ошибка:** Применение хеширования без использования двойного модуля на платформах олимпиадного программирования, что делает решение уязвимым к тестам с коллизиями.

   **Источник:** [Jewels of Stringology (Crochemore, Rytter)](https://www.worldscientific.com/worldscibooks/10.1142/4838#t=aboutBook)

314. Какие аллокационные оптимизации критически важны для реализации Trie в высокопроизводительном C++?

   **Ответ:**

1. Использование плоского пула памяти (арена-аллокатор / `std::vector<Node>` с индексами вместо указателей) для исключения сотен тысяч вызовов оператора `new`;

2. Замена разреженного массива `std::array<int, 256>` компактным вектором пар `(char, int)` или сжатыми масками при большом алфавите;

3. Выравнивание структур узлов под границы кэш-линий процессора (64 байта) для исключения ложного разделения и промахов кэша памяти.

   **Пример:**

   ```cpp
   struct FlatTrie {
       struct Node {
           int next[26];
           bool is_terminal = false;
       };
       std::vector<Node> nodes;
       FlatTrie() { nodes.emplace_back(); } // Корень на индексе 0
       int add_node() {
           nodes.emplace_back();
           return static_cast<int>(nodes.size()) - 1;
       }
   };
   ```

   **Типичная ошибка:** Создание каждого узла через `new TrieNode()` с полями `std::map<char, TrieNode*>`, что приводит к фрагментации кучи и замедлению в 10–20 раз.

   **Источник:** [C++ Core Guidelines: Per.7](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#per7-design-to-enable-optimization)

315. Что выбрать для хранения словаря: `std::unordered_map<std::string, T>` или Trie?

   **Ответ:** Выбирайте `std::unordered_map`, если требуются только операции точного поиска по ключу ($O(1)$ в среднем) и нет ограничений по памяти на хранение дублирующихся префиксов. Выбирайте Trie, если критически важны: поиск по префиксу (автодополнение, T9), нахождение наибольшего общего префикса, обход ключей в лексикографическом порядке, гарантированное отсутствие всплесков задержки на рехеширование (*zero-latency spikes*) или работа с бинарными масками.

   **Пример:** В роутере сетевых пакетов для выбора маршрута по маске подсети (Longest Prefix Match) подходит исключительно Trie (Radix Tree).

   **Типичная ошибка:** Попытка реализовать функцию автодополнения (поиск всех слов с префиксом) на базе `std::unordered_map`.

   **Источник:** [C++ Core Guidelines: SL.con.3](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#slcon3-choose-containers-based-on-performance-needs)

## 22. Математика и теория чисел


316. Как найти GCD (наибольший общий делитель) и LCM (наименьшее общее кратное) двух чисел?

   **Ответ:** Через алгоритм Евклида с делением по остатку. Наименьшее общее кратное вычисляется по формуле: $\text{lcm}(a, b) = \frac{|a \cdot b|}{\gcd(a, b)}$. Во избежание переполнения сначала выполняют деление: $(a / \gcd(a, b)) \cdot b$. В C++17 обе функции включены в стандартную библиотеку: `std::gcd` и `std::lcm` в заголовке `<numeric>`.

   **Пример:**

   ```cpp
   #include <numeric>

   long long g = std::gcd(a, b);
   long long l = std::lcm(a, b);

   ```

   **Типичная ошибка:** Вычисление `(a * b) / std::gcd(a, b)`: перемножение двух 32-битных чисел может превысить лимит `int` до выполнения деления.

   **Источник:** [Cppreference: std::gcd](https://en.cppreference.com/w/cpp/numeric/gcd)

317. Как работает алгоритм Евклида и какова его асимптотическая сложность?

   **Ответ:** Алгоритм опирается на инвариант $\gcd(a, b) = \gcd(b, a \bmod b)$ при $b \neq 0$. На каждом шаге пара $(a, b)$ заменяется на $(b, a \bmod b)$, пока младшее число не станет нулем. По теореме Ламе худший случай достигается на соседних числах Фибоначчи, требуя $O(\log(\min(a, b)))$ шагов.

   **Пример:**

   ```cpp
   long long gcd_custom(long long a, long long b) {
       while (b != 0) {
           a %= b;
           std::swap(a, b);
       }
       return a;
   }

   ```

   **Типичная ошибка:** Использование вычитания вместо остатка от деления (`a -= b`), что ухудшает сложность до псевдолинейной $O(\max(a, b))$ при $b = 1$.

   **Источник:** [CP-Algorithms: Euclidean algorithm for computing the greatest common divisor](https://cp-algorithms.com/algebra/euclid-algorithm.html)

318. Что такое быстрое возведение в степень по модулю (`pow_mod`) и зачем оно нужно?

   **Ответ:** Это алгоритм вычисления $(base^{exp}) \bmod m$ за время $O(\log(exp))$ методом двоичного разложения показателя степени. Он необходим в криптографии (RSA, Diffie–Hellman) и комбинаторике, где степени достигают $10^9$–$10^{18}$, а прямое умножение привело бы к переполнению и таймауту.

   **Пример:**

   ```cpp
   long long binpow(long long base, long long exp, long long mod) {
       long long res = 1;
       base %= mod;
       while (exp > 0) {
           if (exp & 1) res = (__int128)res * base % mod;
           base = (__int128)base * base % mod;
           exp >>= 1;
       }
       return res;
   }

   ```

   **Типичная ошибка:** Вызов `std::pow(base, exp)` с последующим `% mod`: вычисление в числах с плавающей запятой (`double`) теряет точность для 64-битных целых чисел.

   **Источник:** [CP-Algorithms: Binary Exponentiation](https://cp-algorithms.com/algebra/binary-exp.html)

319. Как проверить простоту числа быстрее, чем перебором делителей до $n$?

   **Ответ:**

1. **Детерминированно за $O(\sqrt{n})$:** перебор делителей $d \in [2, \lfloor\sqrt{n}\rfloor]$ с проверкой только чисел вида $6k \pm 1$;

2. **Вероятностно за $O(k \log^3 n)$:** тест простоты Миллера–Рабина. С детерминированным набором базисов $\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37\}$ он безошибочно проверяет любое число до $2^{64}$.

   **Пример:**

   ```cpp
   bool is_prime_sqrt(long long n) {
       if (n <= 1) return false;
       if (n <= 3) return true;
       if (n % 2 == 0 || n % 3 == 0) return false;
       for (long long i = 5; i * i <= n; i += 6) {
           if (n % i == 0 || n % (i + 2) == 0) return false;
       }
       return true;
   }

   ```

   **Типичная ошибка:** Условие цикла `i < sqrt(n)`, где функция `std::sqrt` многократно вычисляется в вещественных числах и может страдать от погрешности округления (безопаснее: `i * i <= n`).

   **Источник:** [CP-Algorithms: Primality tests](https://cp-algorithms.com/algebra/primality_tests.html)

320. Как устроено решето Эратосфена и какова его сложность?

   **Ответ:** Алгоритм находит все простые числа до $N$. Булев массив размера $N + 1$ инициализируется истиной. Для каждого простого $p$ все числа $p^2, p^2 + p, p^2 + 2p, \dots \le N$ помечаются как составные. Временная сложность: $O(N \log \log N)$, память: $O(N)$ (или $N/8$ байт с `std::vector<bool>`).

   **Пример:**

   ```cpp
   std::vector<bool> sieve(int n) {
       std::vector<bool> is_prime(n + 1, true);
       is_prime[0] = is_prime[1] = false;
       for (int p = 2; 1LL * p * p <= n; ++p) {
           if (is_prime[p]) {
               for (long long i = 1LL * p * p; i <= n; i += p) {
                   is_prime[i] = false;
               }
           }
       }
       return is_prime;
   }

   ```

   **Типичная ошибка:** Запуск внутреннего цикла с `2 * p` вместо `p * p`: все составные числа меньшего порядка уже гарантированно вычеркнуты меньшими простыми множителями.

   **Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

321. Как факторизовать числа на простые множители за $O(\log n)$ для множества онлайн-запросов?

   **Ответ:** Линейным решетом Эратосфена строится массив минимальных простых делителей `min_prime[x]` (*Lowest Prime Factor / LPF*) до $M = \max(x)$ за $O(M)$. Факторизация любого числа $x \le M$ выполняется последовательным делением `x /= min_prime[x]` ровно за количество его простых делителей ($O(\log x)$).

   **Пример:**

   ```cpp
   std::vector<int> factorize(int x, const std::vector<int>& min_prime) {
       std::vector<int> factors;
       while (x > 1) {
           factors.push_back(min_prime[x]);
           x /= min_prime[x];
       }
       return factors;
   }

   ```

   **Типичная ошибка:** Повторный запуск факторизации перебором делителей за $O(\sqrt{x})$ для каждого из $10^5$ запросов, что дает таймаут $O(Q \sqrt{x})$.

   **Источник:** [CP-Algorithms: Linear Sieve](https://cp-algorithms.com/algebra/prime-sieve-linear.html)

322. Что такое расширенный алгоритм Евклида (Extended Euclidean Algorithm)?

   **Ответ:** Алгоритм находит не только $\gcd(a, b)$, но и целые коэффициенты Безу $x$ и $y$, удовлетворяющие диофантову уравнению: $a \cdot x + b \cdot y = \gcd(a, b)$. Применяется для нахождения обратного элемента в кольце вычетов и решения линейных диофантовых уравнений.

   **Пример:**

   ```cpp
   long long extgcd(long long a, long long b, long long& x, long long& y) {
       if (b == 0) { x = 1; y = 0; return a; }
       long long x1, y1;
       long long d = extgcd(b, a % b, x1, y1);
       x = y1;
       y = x1 - y1 * (a / b);
       return d;
   }

   ```

   **Типичная ошибка:** Забыть нормализовать полученный коэффициент $x$ в диапазон $[0, m-1]$ при нахождении вычета по модулю $m$.

   **Источник:** [CP-Algorithms: Extended Euclidean Algorithm](https://cp-algorithms.com/algebra/extended-euclid-algorithm.html)

323. Как находить мультипликативную модульную обратную величину ($a^{-1} \bmod m$)?

   **Ответ:**

1. **Если $m$ — простое число:** по малой теореме Ферма $a^{-1} \equiv a^{m - 2} \pmod m$ через быстрое возведение в степень за $O(\log m)$;

2. **Если $m$ составное, но $\gcd(a, m) = 1$:** через расширенный алгоритм Евклида ($a \cdot x + m \cdot y = 1 \implies a^{-1} \equiv x \pmod m$).

   **Пример:**

   ```cpp
   long long modInverse(long long a, long long m) {
       return binpow(a, m - 2, m); // Для простого m
   }

   ```

   **Типичная ошибка:** Применение малой теоремы Ферма с показателем $m - 2$ к составному модулю $m$ (по теореме Эйлера требуется показатель $\phi(m) - 1$).

   **Источник:** [CP-Algorithms: Modular Inverse](https://cp-algorithms.com/algebra/module-inverse.html)

324. При каких условиях существует обратный элемент по модулю?

   **Ответ:** Обратный элемент для $a$ по модулю $m$ существует тогда и только тогда, когда числа $a$ и $m$ взаимно просты: $\gcd(a, m) = 1$. Если $\gcd(a, m) = d > 1$, то для любого целого $x$ число $(a \cdot x) \bmod m$ кратно $d$ и никогда не может быть равным 1.

   **Пример:** Для $a = 4$ и $m = 6$ обратного не существует, так как $\gcd(4, 6) = 2 \neq 1$.

   **Типичная ошибка:** Попытка деления по модулю в комбинаторных задачах без проверки взаимной простоты делителя и модуля.

   **Источник:** [Introduction to Algorithms (CLRS: Modular arithmetic)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

325. Как вычислять биномиальные коэффициенты $\binom{n}{k} \pmod p$ для большого простого $p$?

   **Ответ:** По формуле $\binom{n}{k} = \frac{n!}{k!(n-k)!} \equiv n! \cdot (k!)^{-1} \cdot ((n-k)!)^{-1} \pmod p$. Факториалы и их модульные обратные предподсчитываются за $O(n)$ в массивы `fact` и `invFact`, после чего любой запрос $\binom{n}{k}$ вычисляется за $O(1)$.

   **Пример:**

   ```cpp
   long long nCr(int n, int k, const auto& fact, const auto& invFact, long long mod) {
       if (k < 0 || k > n) return 0;
       return fact[n] * invFact[k] % mod * invFact[n - k] % mod;
   }

   ```

   **Типичная ошибка:** Вычисление модульного обратного через `binpow` за $O(\log p)$ на каждый запрос вместо предподсчета суффиксного массива обратных факториалов за линейное время $O(n)$.

   **Источник:** [CP-Algorithms: Binomial Coefficients](https://cp-algorithms.com/combinatorics/binomial-coefficients.html)

326. В чём суть принципа включений-исключений (Inclusion-Exclusion Principle) и где он применяется?

   **Ответ:** Размер объединения $n$ множеств вычисляется чередованием знаков сумм мощностей их пересечений: прибавляются мощности одиночных множеств, вычитаются попарные пересечения, прибавляются тройные и так далее:


   $$|\bigcup_{i=1}^n A_i| = \sum |A_i| - \sum |A_i \cap A_j| + \sum |A_i \cap A_j \cap A_k| - \dots$$


   Применяется для подсчета количества взаимно простых чисел на отрезке, подсчета беспорядков (деранжментов) и в задачах на графы.

   **Пример:** Количество чисел $\le N$, делящихся на 2, 3 или 5, равно: $(N/2 + N/3 + N/5) - (N/6 + N/10 + N/15) + (N/30)$.

   **Типичная ошибка:** Ошибка в знаке $(-1)^{k-1}$ при переборе подмножеств мощности $k$.

   **Источник:** [CP-Algorithms: Principle of Inclusion-Exclusion](https://cp-algorithms.com/combinatorics/inclusion-exclusion.html)

327. Как решать задачи на префиксный XOR и проверку четности вхождения элементов?

   **Ответ:** Свойство $x \oplus x = 0$ означает, что четное число вхождений любого числа обнуляется, а нечетное дает само число. Префиксный массив $pref\_xor[i] = pref\_xor[i-1] \oplus a[i]$ позволяет найти XOR на любом подотрезке $[l, r]$ за $O(1)$: $XOR(l, r) = pref\_xor[r] \oplus pref\_xor[l-1]$.

   **Пример:** Проверка, можно ли составить палиндром из подстроки: буквы кодируются битовыми масками $(1 \ll (c - 'a'))$. Подстрока может быть палиндромом, если ее суммарный $XOR$ содержит не более одного установленного бита (`std::has_single_bit(mask) || mask == 0`).

   **Типичная ошибка:** Попытка хранить частоты 26 символов в таблицах вместо одной 32-битной маски префиксного XOR.

   **Источник:** [LeetCode: Pseudo-Palindromic Paths in a Binary Tree](https://leetcode.com/problems/pseudo-palindromic-paths-in-a-binary-tree/)

328. Что такое быстрое матричное возведение в степень и какова его сложность?

   **Ответ:** Это применение алгоритма бинарного возведения в степень к квадратной матрице размера $K \times K$. Выполняется за время $O(K^3 \log N)$. Позволяет находить $N$-й член любой линейной рекуррентной последовательности за логарифмическое от $N$ время.

   **Пример:**

   ```cpp
   using Matrix = std::vector<std::vector<long long>>;
   Matrix multiply(const Matrix& A, const Matrix& B, long long mod); // O(K^3)
   Matrix mat_pow(Matrix A, long long p, long long mod) {
       Matrix res = identity_matrix(A.size());
       while (p > 0) {
           if (p & 1) res = multiply(res, A, mod);
           A = multiply(A, A, mod);
           p >>= 1;
       }
       return res;
   }

   ```

   **Типичная ошибка:** Применение метода при большом размере матрицы $K > 500$: множитель $K^3$ нивелирует логарифмическое преимущество по $N$.

   **Источник:** [CP-Algorithms: Matrix exponentiation](https://cp-algorithms.com/algebra/binary-exp.html)

329. Как вычислить $N$-е число Фибоначчи через умножение матриц за $O(\log N)$?

   **Ответ:** Рекуррентное соотношение $F_{n} = F_{n-1} + F_{n-2}$ представляется в матричной форме перехода вектора состояния:


   $$\begin{pmatrix} F_{n+1} \\ F_{n} \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} F_{n} \\ F_{n-1} \end{pmatrix} \implies \begin{pmatrix} F_{n+1} \\ F_{n} \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n \begin{pmatrix} F_1 \\ F_0 \end{pmatrix}$$


   Матрица размера $2 \times 2$ возводится в степень $n$ за $O(\log n)$ умножений.

   **Пример:**

   ```cpp
   long long fib_matrix(long long n, long long mod) {
       if (n == 0) return 0;
       Matrix T = {{1, 1}, {1, 0}};
       T = mat_pow(T, n - 1, mod);
       return T[0][0]; // F_n
   }

   ```

   **Типичная ошибка:** Попытка вычисления чисел Фибоначчи для $N = 10^{18}$ циклом за $O(N)$ (вызывает таймаут).

   **Источник:** [Introduction to Algorithms (CLRS: Fibonacci numbers)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

330. В каких алгоритмических задачах применяется Китайская теорема об остатках (CRT)?

   **Ответ:** CRT применяется для восстановления числа $X$ по его остаткам от деления на систему попарно взаимно простых модулей $m_1, m_2, \dots, m_k$. Используется: 1) В алгоритме Гарнера для длинной арифметики; 2) Для вычислений по составному модулю $M = \prod p_i^{a_i}$ (алгоритм Люка–Гранди); 3) В быстром преобразовании Фурье (NTT) для объединения результатов по нескольким модулям без переполнения 64-битных целых чисел.

   **Пример:** Если известны ответы задачи по модулям $998244353$ и $1000000007$, CRT восстанавливает точный ответ по модулю их произведения $\approx 10^{18}$.

   **Типичная ошибка:** Применение классической формулы CRT к модулям, которые не являются взаимно простыми (требуется предварительная редукция через расширенный алгоритм Евклида).

   **Источник:** [CP-Algorithms: Chinese Remainder Theorem](https://cp-algorithms.com/algebra/chinese-remainder-theorem.html)

   ---

## 23. Геометрия и вычислительная геометрия


331. Как вычислить ориентацию тройки точек на плоскости через векторное (косое) произведение?

   **Ответ:** Через знак z-компоненты 2D векторного (косого/псевдоскалярного) произведения векторов $\vec{AB}$ и $\vec{BC}$:


   $$\text{cross\_product}(A, B, C) = (B.x - A.x)(C.y - A.y) - (B.y - A.y)(C.x - A.x)$$

   * Значение $> 0$: поворот против часовой стрелки (левый поворот, CCW);
   * Значение $< 0$: поворот по часовой стрелке (правый поворот, CW);
   * Значение $= 0$: точки коллинеарны (лежат на одной прямой).

   **Пример:**

   ```cpp
   long long cross_product(Point a, Point b, Point c) {
       return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
   }

   ```

   **Типичная ошибка:** Использование углов и тригонометрии `std::atan2` для проверки направления поворота: тригонометрия работает медленнее и подвержена ошибкам округления `double`.

   **Источник:** [Introduction to Algorithms (CLRS: Computational Geometry)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

332. Как строго проверить факт пересечения двух отрезков $AB$ и $CD$?

   **Ответ:** Отрезки пересекаются, если концы каждого отрезка лежат по разные стороны от прямой, содержащей другой отрезок (знаки ориентированных площадей противоположны), либо если имеет место вырожденный случай коллинеарности с перекрытием их проекций (bounding box check):


   $$(\text{cross}(A, B, C) \cdot \text{cross}(A, B, D) \le 0) \land (\text{cross}(C, D, A) \cdot \text{cross}(C, D, B) \le 0)$$

   **Пример:**

   ```cpp
   bool intersect(Point a, Point b, Point c, Point d) {
       auto cp1 = cross_product(a, b, c), cp2 = cross_product(a, b, d);
       auto cp3 = cross_product(c, d, a), cp4 = cross_product(c, d, b);
       if (((cp1 > 0 && cp2 < 0) || (cp1 < 0 && cp2 > 0)) &&
           ((cp3 > 0 && cp4 < 0) || (cp3 < 0 && cp4 > 0))) return true;
       // Проверка коллинеарности и попадания на отрезок:
       if (cp1 == 0 && on_segment(c, a, b)) return true;
       if (cp2 == 0 && on_segment(d, a, b)) return true;
       if (cp3 == 0 && on_segment(a, c, d)) return true;
       if (cp4 == 0 && on_segment(b, c, d)) return true;
       return false;
   }

   ```

   **Типичная ошибка:** Забыть проверку коллинеарного случая, когда один отрезок частично накладывается на другой.

   **Источник:** [CP-Algorithms: Intersection of two segments](https://cp-algorithms.com/geometry/check-segments-intersection.html)

333. Как вычислить площадь произвольного многоугольника без самопересечений (формула шнурования Гаусса)?

   **Ответ:** По формуле площади Гаусса (Shoelace formula) через сумму ориентированных площадей трапеций или треугольников от начала координат:


   $$2S = |\sum_{i=0}^{n-1} (x_i \cdot y_{i+1} - x_{i+1} \cdot y_i)|, \quad \text{где } (x_n, y_n) = (x_0, y_0)$$


   Если вершины упорядочены против часовой стрелки, сумма положительна.

   **Пример:**

   ```cpp
   double polygon_area(const std::vector<Point>& p) {
       long long double_area = 0;
       int n = p.size();
       for (int i = 0; i < n; ++i) {
           int j = (i + 1) % n;
           double_area += p[i].x * p[j].y - p[j].x * p[i].y;
       }
       return std::abs(double_area) / 2.0;
   }

   ```

   **Типичная ошибка:** Деление на `2` до суммирования всех слагаемых: для целочисленных координат деление должно происходить строго один раз в самом конце.

   **Источник:** [CP-Algorithms: Oriented area of a polygon](https://cp-algorithms.com/geometry/oriented-triangle-area.html)

334. Как построить выпуклую оболочку множества точек? Опиши алгоритм Эндрю (Monotone Chain).

   **Ответ:** Алгоритм Эндрю сортирует точки лексикографически по $(X, Y)$. Затем строятся две цепочки: нижняя и верхняя. Точки добавляются по одной: пока последняя добавленная точка образует не левый поворот (проверяется через `cross_product <= 0`), вершина удаляется из текущей оболочки. Время: $O(n \log n)$ на сортировку и $O(n)$ на построение.

   **Пример:**

   ```cpp
   std::vector<Point> convex_hull(std::vector<Point> pts) {
       std::sort(pts.begin(), pts.end());
       std::vector<Point> h;
       for (int step = 0; step < 2; ++step) {
           auto start = h.size();
           for (const auto& p : pts) {
               while (h.size() >= start + 2 && cross_product(h[h.size() - 2], h.back(), p) <= 0) {
                   h.pop_back();
               }
               h.push_back(p);
           }
           h.pop_back();
           std::reverse(pts.begin(), pts.end());
       }
       return h;
   }

   ```

   **Типичная ошибка:** Неудаление дубликатов исходных точек перед запуском построения, что может приводить к вырождению цепочек.

   **Источник:** [CP-Algorithms: Convex Hull construction (Monotone Chain)](https://cp-algorithms.com/geometry/convex-hull.html)

335. Как найти пару ближайших точек на плоскости быстрее, чем за $O(n^2)$?

   **Ответ:** Методом «Разделяй и властвуй» (Divide and Conquer) за $O(n \log n)$:

1. Точки сортируются по оси $X$ и делятся вертикальной прямой на две половины;

2. Рекурсивно находятся минимальные расстояния в левой ($d_1$) и правой ($d_2$) половинах: $d = \min(d_1, d_2)$;

3. Выбираются точки в полосе шириной $2d$ вокруг разделяющей прямой, сортируются по оси $Y$;

4. Для каждой точки в полосе достаточно проверить не более 7–8 следующих соседей по оси $Y$.

   **Пример:**

   ```cpp
   // В полосе шириной d проверяются только точки с |y_i - y_j| < d
   for (size_t i = 0; i < strip.size(); ++i) {
       for (size_t j = i + 1; j < strip.size() && (strip[j].y - strip[i].y) < d; ++j) {
           d = std::min(d, dist(strip[i], strip[j]));
       }
   }

   ```

   **Типичная ошибка:** Полная сортировка точек по оси $Y$ внутри каждого шага рекурсии вместо слияния (как в merge sort), что ухудшает время до $O(n \log^2 n)$.

   **Источник:** [Introduction to Algorithms (CLRS: Finding the closest pair of points)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

336. Что представляет собой метод сканирующей прямой (Line Sweep) в геометрии?

   **Ответ:** Это алгоритмическая парадигма, сводящая двумерную статическую задачу к динамической одномерной. Воображаемая прямая (вертикальная или горизонтальная) непрерывно движется по плоскости, останавливаясь только в дискретных точках событий (вершины, концы отрезков). Состояние пересекаемых прямой геометрических объектов поддерживается в сбалансированном дереве поиска или дереве отрезков.

   **Пример:** Алгоритм Бентли–Оттманна находит все точки пересечения отрезков за $O((N + K) \log N)$.

   **Типичная ошибка:** Добавление всех непрерывных координат в структуру событий вместо фиксации только дискретных точек смены состояний.

   **Источник:** [Computational Geometry: Algorithms and Applications (de Berg et al.)](https://www.springer.com/gp/book/9783540779735)

337. Как проверить, лежит ли точка внутри произвольного многоугольника?

   **Ответ:** Методом трассировки луча (Ray Casting / Even-Odd Rule): из проверяемой точки выпускается горизонтальный луч в бесконечность $(x \to +\infty)$ и считается число пересечений со сторонами многоугольника. Если число пересечений нечетно — точка внутри; если четно — снаружи. Особо проверяется принадлежность точки границам сторон.

   **Пример:**

   ```cpp
   bool point_in_polygon(Point pt, const std::vector<Point>& poly) {
       bool inside = false;
       int n = poly.size();
       for (int i = 0, j = n - 1; i < n; j = i++) {
           if (on_segment(pt, poly[i], poly[j])) return true; // На границе
           if ((poly[i].y > pt.y) != (poly[j].y > pt.y) &&
               (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (double)(poly[j].y - poly[i].y) + poly[i].x)) {
               inside = !inside;
           }
       }
       return inside;
   }

   ```

   **Типичная ошибка:** Луч проходит строго через вершину многоугольника, из-за чего одно ребро засчитывает пересечение, а второе — нет (необходимо строгое неравенство `>` для одного конца и `>=` для другого).

   **Источник:** [CP-Algorithms: Point in polygon](https://cp-algorithms.com/geometry/point-in-convex-polygon.html)

338. Как найти кратчайшее расстояние от точки $P$ до отрезка $AB$?

   **Ответ:** Проверяется проекция точки $P$ на прямую $AB$ через скалярное произведение. Если скалярное произведение $\vec{AB} \cdot \vec{AP} \le 0$, проекция падает за точку $A$, и расстояние равно $\vert{}\vec{AP}\vert{}$. Если $\vec{BA} \cdot \vec{BP} \le 0$, проекция падает за $B$, и расстояние равно $\vert{}\vec{BP}\vert{}$. Иначе расстояние равно высоте перпендикуляра: $\frac{\vert{}\vec{AB} \times \vec{AP}\vert{}}{\vert{}\vec{AB}\vert{}}$.

   **Пример:**

   ```cpp
   double dist_to_segment(Point p, Point a, Point b) {
       long long dot_a = (b.x - a.x) * (p.x - a.x) + (b.y - a.y) * (p.y - a.y);
       if (dot_a <= 0) return std::hypot(p.x - a.x, p.y - a.y);
       long long dot_b = (a.x - b.x) * (p.x - b.x) + (a.y - b.y) * (p.y - b.y);
       if (dot_b <= 0) return std::hypot(p.x - b.x, p.y - b.y);
       return std::abs(cross_product(a, b, p)) / std::hypot(b.x - a.x, b.y - a.y);
   }

   ```

   **Типичная ошибка:** Поиск расстояния до бесконечной прямой вместо отрезка без проверки выпадения проекции за границы концов $A$ и $B$.

   **Источник:** [CP-Algorithms: Minimum distance between point and segment](https://cp-algorithms.com/geometry/point-line-intersection.html)

339. Почему в вычислительной геометрии опасно прямое сравнение чисел с плавающей запятой (`double`) без эпсилона?

   **Ответ:** Из-за ограниченной точности стандарта IEEE 754 тригонометрические операции и деление дают погрешности в младших битах (например, $0.1 + 0.2 \neq 0.3$). Прямое сравнение `a == b` возвращает `false`, а знаки определителей около нуля произвольно меняются, приводя к зацикливанию алгоритмов. Сравнения обязаны выполняться с допуском: $\vert{}a - b\vert{} < \varepsilon$ (где $\varepsilon \approx 10^{-7}$–$10^{-9}$).

   **Пример:**

   ```cpp
   constexpr double EPS = 1e-9;
   bool are_equal(double a, double b) { return std::abs(a - b) < EPS; }
   bool is_less(double a, double b)   { return a < b - EPS; }

   ```

   **Типичная ошибка:** Использование фиксированного эпсилона $10^{-9}$ для величин порядка $10^{12}$, где шаг между соседними представимыми числами `double` превышает этот эпсилон.

   **Источник:** [What Every Computer Scientist Should Know About Floating-Point Arithmetic (David Goldberg)](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html)

340. Когда в геометрических алгоритмах следует категорически отдавать предпочтение целочисленным координатам?

   **Ответ:** Всегда, когда входные данные являются целыми числами, а алгоритм опирается только на сравнения, векторные и скалярные произведения (проверка ориентации, выпуклая оболочка, проверка пересечений, площадь многоугольника). Целочисленная арифметика на `long long` дает строго абсолютную математическую точность без погрешностей и риска сбоев предикатов.

   **Пример:** Предикат поворота `cross_product(a, b, c) > 0` в целых числах не дает сбоев, в отличие от углов в `double`.

   **Типичная ошибка:** Перевод целочисленных координат в `double` перед расчетом векторного произведения.

   **Источник:** [Competitive Programmer's Handbook (Antti Laaksonen: Chapter 29)](https://cses.fi/book/book.pdf)

341. Как отсортировать точки по полярному углу без использования тригонометрии?

   **Ответ:** Через деление плоскости на две полуплоскости (верхнюю и нижнюю) и сравнение через векторное произведение:

1. Точки с $y > 0$ или $(y == 0 \land x \ge 0)$ относятся к верхней полуплоскости;

2. Точка из верхней полуплоскости всегда меньше точки из нижней;

3. Если точки в одной полуплоскости, их относительный угол задается знаком векторного произведения: $\text{cross}(A, B) > 0$.

   **Пример:**

   ```cpp
   auto half = [](const Point& p) { return p.y > 0 || (p.y == 0 && p.x >= 0); };
   std::sort(pts.begin(), pts.end(), [&](const Point& a, const Point& b) {
       if (half(a) != half(b)) return half(a) > half(b);
       return (a.x * b.y - a.y * b.x) > 0;
   });

   ```

   **Типичная ошибка:** Сортировка вызовом `std::atan2(p.y, p.x)`, которая выполняет сотни тысяч медленных вызовов функций с плавающей запятой.

   **Источник:** [CP-Algorithms: Polar sort](https://cp-algorithms.com/)

342. Что такое Bounding Box (ограничивающий прямоугольник) и какую практическую пользу он приносит?

   **Ответ:** Это минимальный выровненный по осям прямоугольник (AABB), целиком содержащий геометрический объект: $[X_{\min}, X_{\max}] \times [Y_{\min}, Y_{\max}]$. Применяется как быстрый фильтр отсечения ($O(1)$) в вычислительно тяжелых проверках: если bounding box двух сложных многоугольников или отрезков не пересекаются, они гарантированно не пересекаются геометрически.

   **Пример:** Отсечение непересекающихся отрезков до запуска вычисления векторных произведений.

   **Типичная ошибка:** Запуск сложного геометрического теста без предварительной проверки пересечения AABB.

   **Источник:** [Real-Time Collision Detection (Christer Ericson)](https://www.routledge.com/Real-Time-Collision-Detection/Ericson/p/book/9781558607323)

343. Как найти прямоугольник пересечения двух выровненных по осям прямоугольников (AABB)?

   **Ответ:** Координаты пересечения вычисляются как пересечение двух независимых проекций на оси $X$ и $Y$:


   $$X_1 = \max(A.x_1, B.x_1), \quad Y_1 = \max(A.y_1, B.y_1)$$

   $$X_2 = \min(A.x_2, B.x_2), \quad Y_2 = \min(A.y_2, B.y_2)$$


   Пересечение непусто тогда и только тогда, когда $X_1 \le X_2$ и $Y_1 \le Y_2$.

   **Пример:**

   ```cpp
   struct Rect { int x1, y1, x2, y2; };
   std::optional<Rect> intersect(const Rect& a, const Rect& b) {
       int x1 = std::max(a.x1, b.x1), y1 = std::max(a.y1, b.y1);
       int x2 = std::min(a.x2, b.x2), y2 = std::min(a.y2, b.y2);
       if (x1 <= x2 && y1 <= y2) return Rect{x1, y1, x2, y2};
       return std::nullopt;
   }

   ```

   **Типичная ошибка:** Попытка рассматривать десятки взаимных вариантов расположения вместо независимого взятия $\min$ и $\max$ по каждой из осей.

   **Источник:** [LeetCode: Rectangle Overlap](https://leetcode.com/problems/rectangle-overlap/)

344. Какие ошибки переполнения наиболее типичны при расчетах по геометрическим формулам?

   **Ответ:**

1. **Векторное произведение:** координаты точек до $10^9$ при вычислении $x_1 y_2 - x_2 y_1$ дают величины порядка $10^{18}$, что мгновенно переполняет 32-битный `int` (требуется `long long` или `__int128`);

2. **Скалярный квадрат расстояния:** $(x_2 - x_1)^2 + (y_2 - y_1)^2$ при координатах $10^9$ дает до $4 \cdot 10^{18}$, вплотную приближаясь к границе `LLONG_MAX`.

   **Пример:**

   ```cpp
   // Переполнение:
   // int cp = a.x * b.y - a.y * b.x;
   // Безопасно:
   long long cp = 1LL * a.x * b.y - 1LL * a.y * b.x;

   ```

   **Типичная ошибка:** Хранение полей точки как `int` и отсутствие явного приведения типов перед операцией умножения.

   **Источник:** [SEI CERT C++: INT32-C](https://wiki.sei.cmu.edu/confluence/display/cplusplus/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)

345. Как идиоматично реализовать базовую структуру `Point` с векторными операторами в C++?

   **Ответ:** Структура должна содержать поля координат, операторы векторного сложения, вычитания, умножения на скаляр, скалярного и векторного произведения, а также оператор `<`, поддерживающий лексикографический порядок.

   **Пример:**

   ```cpp
   struct Point {
       long long x{0}, y{0};

       Point operator+(Point p) const { return {x + p.x, y + p.y}; }
       Point operator-(Point p) const { return {x - p.x, y - p.y}; }
       Point operator*(long long d) const { return {x * d, y * d}; }

       long long dot(Point p) const { return x * p.x + y * p.y; }
       long long cross(Point p) const { return x * p.y - y * p.x; }

       bool operator<(Point p) const {
           return x < p.x || (x == p.x && y < p.y);
       }
       bool operator==(Point p) const = default;
   };

   ```

   **Типичная ошибка:** Реализация операторов в виде методов, мутирующих текущую точку на месте (`+=`), там, где вызывающий код ожидает получение нового вектора без побочных эффектов.

   **Источник:** [C++ Core Guidelines: C.1](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#c1-organize-related-data-into-structures-structs-or-classes)

   ---

## 24. C++ STL и практические аспекты


346. Какие операции у контейнера `std::vector` обладают амортизированной сложностью $O(1)$?

   **Ответ:**

   * Добавление элемента в конец: `push_back` и `emplace_back`;
   * Удаление последнего элемента: `pop_back`;
   * Доступ по произвольному индексу: `operator[]` и метод `.at()`;
   * Получение размера и проверка на пустоту: `.size()`, `.empty()`;
   * Получение указателя на непрерывный буфер памяти: `.data()`.

   **Пример:** При заполнении вектора с $N$ элементов суммарное число копирований при геометрическом расширении емкости (множитель $1.5$–$2.0$) составляет не более $2N$, давая в среднем $O(1)$ на одну операцию добавления.

   **Типичная ошибка:** Считать, что вставка в начало `v.insert(v.begin(), x)` работает за $O(1)$ (для вектора это строгая операция $O(n)$ из-за сдвига всех элементов вправо).

   **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector)

347. В чём заключаются практические различия между `std::vector`, `std::deque`, `std::list` и `std::forward_list`?

   **Ответ:**

   * **`std::vector`:** непрерывный буфер памяти, максимальная кэш-локальность, $O(1)$ произвольный доступ;
   * **`std::deque`:** массив фиксированных страниц (чанков), вставка и удаление с обоих концов за $O(1)$ без перемещения всей структуры, но память фрагментирована блоками;
   * **`std::list`:** двусвязный список, узлы разбросаны по куче, ссылки стабильны при любых изменениях, вставка в известное место за $O(1)$, но огромные накладные расходы по памяти и постоянные промахи кэша;
   * **`std::forward_list`:** односвязный список, хранит только 1 указатель на узел, отсутствует накладной расход на поле `size()`.

   **Пример:** Линейный обход `std::vector` на современных процессорах в десятки раз быстрее обхода `std::list` аналогичного размера из-за аппаратного предвыборщика строк кэша (hardware prefetcher).

   **Типичная ошибка:** Выбор `std::list` в расчете на «быстрые вставки», когда в реальности поиск места вставки занимает медленные $O(n)$ переходов по указателям.

   **Источник:** [Bjarne Stroustrup: Why you should avoid Linked Lists](https://www.youtube.com/watch?v=YQs6IC-vgmo)

348. Когда метод `emplace_back` предпочтительнее метода `push_back`?

   **Ответ:** Когда объект конструируется непосредственно из аргументов его конструктора прямо в неинициализированной памяти вектора (in-place construction), исключая создание временного безымянного объекта и его последующий move/copy-перенос.

   **Пример:**

   ```cpp
   std::vector<std::pair<int, std::string>> v;
   v.emplace_back(1, "Alice"); // Конструирование на месте без временной пары
   // Вместо: v.push_back(std::make_pair(1, "Alice"));

   ```

   **Типичная ошибка:** Слепая замена `push_back` на `emplace_back` при передаче уже готового созданного объекта `v.emplace_back(existing_obj)`: в этом случае вызовы абсолютно эквивалентны по производительности.

   **Источник:** [C++ Core Guidelines: SL.con.1](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#slcon1-prefer-using-stl-vector-by-default)

349. Что именно делают методы `reserve()`, `resize()` и `shrink_to_fit()` у `std::vector`?

   **Ответ:**

   * **`reserve(n)`:** выделяет сырую память в куче под как минимум $n$ элементов, изменяя только `capacity()`. Размер `size()` остается прежним, конструкторы элементов не вызываются;
   * **`resize(n)`:** изменяет фактический размер вектора `size()`. Если $n > size$, создаются новые элементы со значением по умолчанию; если $n < size$, лишние элементы разрушаются;
   * **`shrink_to_fit()`:** непереплетный запрос к аллокатору освободить избыточную незадействованную емкость, уменьшив `capacity()` до текущего `size()`.

   **Пример:**

   ```cpp
   std::vector<int> v;
   v.reserve(100); // size=0, capacity=100
   v.resize(10);   // size=10, capacity=100 (создано 10 нулей)

   ```

   **Типичная ошибка:** Обращение по индексу `v[5] = 42` сразу после вызова `reserve(10)`, что является записью в неинициализированную память и прямым UB (разрешено только после `resize` или через `push_back`).

   **Источник:** [Cppreference: std::vector::reserve](https://en.cppreference.com/w/cpp/container/vector/reserve)

350. Чем `std::set` отличается от `std::unordered_set`, а `std::map` — от `std::unordered_map`?

   **Ответ:**

   * **`set / map`:** построены на сбалансированных деревьях поиска (Red-Black Tree), ключи всегда отсортированы, поддерживают поиск по диапазонам и итераторы `lower_bound`/`upper_bound`, сложность операций строго гарантированная $O(\log n)$, требуют оператор `<`;
   * **`unordered_set / unordered_map`:** построены на хеш-таблицах, элементы не упорядочены, сложность операций в среднем $O(1)$, но в худшем случае $O(n)$, требуют специализацию `std::hash` и оператор `==`.

   **Пример:**

   ```cpp
   std::set<int> ordered;         // Итерация от меньшего к большему
   std::unordered_set<int> fast;  // Быстрый поиск в среднем O(1)

   ```

   **Типичная ошибка:** Использование `std::map` там, где упорядоченность ключей не требуется, что замедляет поиск в несколько раз по сравнению с хеш-таблицей.

   **Источник:** [Cppreference: Associative containers](https://en.cppreference.com/w/cpp/container#Associative_containers)

351. Как корректно написать пользовательский компаратор для `std::sort`, `std::set` и `std::priority_queue`?

   **Ответ:** Компаратор обязан строго удовлетворять математической аксиоме строгого слабого порядка (*Strict Weak Ordering*): для эквивалентных элементов `comp(a, a)` обязано возвращать `false`.

   * Для `std::sort`: передается функтор, лямбда или свободная функция;
   * Для `std::set`: тип компаратора указывается вторым шаблонным параметром `std::set<T, Comp>`;
   * Для `std::priority_queue`: тип компаратора указывается третьим параметром `std::priority_queue<T, std::vector<T>, Comp>`. При этом для min-heap используется отношение строго больше `>`.

   **Пример:**

   ```cpp
   struct CustomLess {
       bool operator()(const Task& a, const Task& b) const {
           return a.priority < b.priority; // Строгий <
       }
   };
   std::set<Task, CustomLess> s;

   ```

   **Типичная ошибка:** Использование нестрогого оператора `<=` или `>=` в компараторе, что приводит к разрыву инвариантов дерева/сортировки и падению с Segmentation Fault.

   **Источник:** [Cppreference: StrictWeakOrdering](https://en.cppreference.com/w/cpp/concepts/strict_weak_order)

352. Когда следует предпочесть `std::array`, а когда `std::vector`?

   **Ответ:** Выбирайте `std::array`, когда размер контейнера фиксирован и известен во время компиляции, а размер данных невелик: он размещается прямо на стеке (или внутри содержащего класса) без накладных расходов на динамическую кучу и сохраняет размерность в типах. Выбирайте `std::vector`, когда размер последовательности определяется во время исполнения программы или объем данных велик (более нескольких килобайт), чтобы не переполнить ограниченный стек потока.

   **Пример:**

   ```cpp
   std::array<int, 4> coords = {0, 1, 2, 3}; // 16 байт на стеке, 0 аллокаций
   std::vector<int> dynamic_data(n);          // Данные в куче

   ```

   **Типичная ошибка:** Выделение `std::array<int, 10'000'000>` в качестве локальной переменной функции, вызывающее мгновенное переполнение стека (Stack Overflow).

   **Источник:** [C++ Core Guidelines: SL.con.2](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#slcon2-prefer-using-stdarray-or-stdvector-instead-of-a-c-array)

353. Как безопасно удалять элементы из стандартных контейнеров прямо во время итерации по ним?

   **Ответ:**

1. В C++20: использовать свободные стандартные функции `std::erase` или `std::erase_if`;

2. Для ассоциативных контейнеров (`set`, `map`): метод `.erase()` возвращает итератор на следующий валидный элемент: `it = c.erase(it)`;

3. Для `std::vector` до C++20: классическая идиома *erase-remove*.

   **Пример:**

   ```cpp
   // C++20 универсально для всех контейнеров:
   std::erase_if(vec, [](int x) { return x % 2 == 0; });

   // В цикле для std::map:
   for (auto it = m.begin(); it != m.end(); ) {
       if (it->second == 0) it = m.erase(it);
       else ++it;
   }

   ```

   **Типичная ошибка:** Написание `c.erase(it); ++it;`: вызов `erase` инвалидирует текущий итератор, после чего операция инкремента `++it` приводит к обращению по повисшей памяти (UB).

   **Источник:** [Cppreference: std::erase_if](https://en.cppreference.com/w/cpp/container/vector/erase2)

354. Что делает классическая идиома Erase-Remove (`vec.erase(std::remove(...), vec.end())`)?

   **Ответ:** Алгоритм `std::remove` не удаляет элементы физически (он не имеет доступа к размеру контейнера), а лишь сдвигает элементы, не удовлетворяющие условию, в начало диапазона, возвращая итератор на логический новый конец последовательности. Метод вектора `.erase()` фактически отсекает остаток массива, вызывая деструкторы лишних элементов и уменьшая `size()`.

   **Пример:**

   ```cpp
   // До C++20:
   vec.erase(std::remove(vec.begin(), vec.end(), 42), vec.end());

   ```

   **Типичная ошибка:** Вызов `std::remove(vec.begin(), vec.end(), val)` без последующего вызова `.erase()`, из-за чего размер вектора не меняется, а в хвосте остаются старые значения.

   **Источник:** [Cppreference: std::remove](https://en.cppreference.com/w/cpp/algorithm/remove)

355. В каких случаях применение `std::lower_bound` к отсортированному вектору эффективнее использования `std::set`?

   **Ответ:** Когда данные формируются пакетно (один раз при старте или редко обновляются), а затем к ним выполняется множество поисковых запросов. Отсортированный вектор занимает в 3–4 раза меньше памяти (нет указателей узлов дерева и заголовков аллокатора), а бинарный поиск по непрерывному массиву дает на порядки меньше промахов кэша процессора, чем переходы по ссылкам красно-черного дерева в `std::set`.

   **Пример:**

   ```cpp
   std::sort(vec.begin(), vec.end());
   auto it = std::lower_bound(vec.begin(), vec.end(), target);

   ```

   **Типичная ошибка:** Попытка вызывать `std::lower_bound(s.begin(), s.end(), val)` для `std::set` вместо метода `s.lower_bound(val)`: свободная функция на итераторах множества работает за медленные $O(n)$ вместо $O(\log n)$.

   **Источник:** [C++ Core Guidelines: SL.con.1](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#slcon1-prefer-using-stl-vector-by-default)

356. Как исключить лишние скрытые копирования в кодовой базе C++?

   **Ответ:**

1. Передавать тяжелые параметры на чтение по константной ссылке `const T&` или `std::string_view` / `std::span`;

2. Принимать значения по значению с последующим `std::move` в конструкторах-инициализаторах полей;

3. Использовать `auto&` или `const auto&` в range-based циклах `for (const auto& item : vec)`;

4. Использовать фабрики конструирования на месте `emplace_back` и `try_emplace`.

   **Пример:**

   ```cpp
   // Ошибка: for (auto s : strings) - неявная аллокация и копия каждой строки!
   // Корректно:
   for (const auto& s : strings) { /* только чтение */ }

   ```

   **Типичная ошибка:** Использование `std::move` для локальной переменной в инструкции возврата `return std::move(local_obj);`: это подавляет обязательную компиляторную оптимизацию Return Value Optimization (RVO / Copy Elision).

   **Источник:** [C++ Core Guidelines: F.15](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f15-prefer-simple-and-conventional-ways-of-passing-information)

357. Что необходимо учитывать в отношении инвалидации ссылок и итераторов при вставках и удалениях?

   **Ответ:**

   * **`std::vector`:** при вставке, если `size() > capacity()`, происходит реаллокация, и абсолютно **все** итераторы, указатели и ссылки на элементы становятся невалидными. При удалении инвалидируются итераторы от точки удаления до конца вектора;
   * **`std::deque`:** вставка в середину инвалидирует все итераторы; вставка в концы сохраняет ссылки на элементы, но инвалидирует итераторы;
   * **`std::set / std::map / std::list`:** итераторы и ссылки на неизмененные элементы остаются валидными всегда; инвалидируется строго удаляемый узел.

   **Пример:**

   ```cpp
   int& ref = vec[0];
   vec.push_back(10); // Опасно! Возможна реаллокация буфера в другое место кучи
   // ref теперь висячая ссылка (dangling reference)!

   ```

   **Типичная ошибка:** Сохранение указателя на элемент вектора перед выполнением серии вызовов `push_back` без предварительного `reserve()`.

   **Источник:** [Cppreference: Iterator invalidation](https://en.cppreference.com/w/cpp/container#Iterator_invalidation)

358. Почему `std::vector<bool>` является специфической специализацией и чем он неудобен на практике?

   **Ответ:** Стандарт C++ специализирует `std::vector<bool>` как битовую упаковку (1 бит на значение ради экономии памяти). Из-за этого:

1. Его элементы не имеют адреса в памяти: оператор `operator[]` возвращает не `bool&`, а временный прокси-объект `std::vector<bool>::reference`;

2. К его элементам нельзя применить взятие адреса `&v[i]`;

3. Код вида `auto& x = v[0];` не компилируется;

4. Многопоточная модификация разных индексов одного вектора не потокобезопасна (они делят одно машинное слово).

   **Пример:** Если требуется стандартное поведение вектора без прокси-объектов, используют `std::vector<char>` или `std::vector<uint8_t>`.

   **Типичная ошибка:** Написание шаблонного кода в расчете на то, что ссылка на элемент любого вектора имеет тип `T&`.

   **Источник:** [Cppreference: std::vector](https://en.cppreference.com/w/cpp/container/vector_bool)

359. Какие типы арифметических переполнений наиболее часто встречаются при использовании `int`, `long long` и `size_t`?

   **Ответ:**

1. **Знаковое переполнение (`int`, `long long`):** превышение границ диапазона (например, $2 \cdot 10^9$ для 32-битного знакового `int`) является строгим **Undefined Behavior (UB)**;

2. **Беззнаковое обратное переполнение (`size_t`):** вычитание из нуля дает максимальное значение типа: `size_t i = 0; --i; // i = 18446744073709551615`;

3. **Ошибки в циклах со сдвигом вниз:** цикл `for (size_t i = vec.size() - 1; i >= 0; --i)` становится бесконечным, так как беззнаковый `size_t` всегда $\ge 0$.

   **Пример:**

   ```cpp
   // Опасный бесконечный цикл:
   // for (size_t i = n - 1; i >= 0; --i)
   // Безопасный эквивалент:
   for (size_t i = n; i-- > 0; ) { /* i принимает значения n-1 ... 0 */ }

   ```

   **Типичная ошибка:** Вычисление `v.size() - 1` для пустого контейнера: возвращается $2^{64} - 1$, что приводит к аварийному падению по выходу за границы памяти.

   **Источник:** [SEI CERT C++: INT30-C](https://wiki.sei.cmu.edu/confluence/display/cplusplus/INT30-C.+Ensure+that+unsigned+integer+operations+do+not+wrap)

360. Как правильно профилировать и выявлять узкие места по производительности в решениях на C++?

   **Ответ:**

1. Не заниматься оптимизацией «вслепую» — использовать статистические семплирующие профилировщики (`perf`, Linux `perf record -g`, Intel VTune, Instruments);

2. Собирать код с флагами оптимизации и отладочными символами: `-O3 -g -fno-omit-frame-pointer`;

3. Анализировать аппаратные счетчики процессора: процент промахов кэша (L1/LLC cache-misses), ошибки предсказания переходов (branch-misses) и инструкции на такт (IPC);

4. Для микрозамеров фрагментов кода использовать фреймворки с защитой от оптимизаций компилятора (Google Benchmark с макросом `benchmark::DoNotOptimize`).

   **Пример:**

   ```bash
   perf record -g ./my_solution
   perf report

   ```

   **Типичная ошибка:** Попытка замерять производительность в Debug-сборке (`-O0`) или замер времени через `std::chrono` вокруг строк, которые компилятор полностью выбросил как мертвый код (*dead code elimination*).

   **Источник:** [Brendan Gregg: Systems Performance and Linux perf](https://www.brendangregg.com/perf.html)
