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

**Источник:** [Introduction to Algorithms (CLRS), Chapter 3: Growth of Functions](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [Cppreference: std::vector::push_back](https://en.cppreference.com/w/cpp/container/vector/push_back?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS), Chapter 3](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [Algorithms (Robert Sedgewick, Kevin Wayne)](https://algs4.cs.princeton.edu/home/?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS), Chapter 22: Elementary Graph Algorithms](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS), Chapter 4: Divide-and-Conquer](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [LLVM libc++: std::sort implementation details](https://github.com/llvm/llvm-project/blob/main/libcxx/include/__algorithm/sort.h?utm_source=gemini)

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

**Источник:** [Bjarne Stroustrup: Why you should avoid Linked Lists](https://isocpp.org/?utm_source=gemini)

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

**Источник:** [Cppreference: std::sort](https://en.cppreference.com/w/cpp/algorithm/sort?utm_source=gemini)

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

**Источник:** [Cppreference: std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS), Chapter 16: Greedy Algorithms](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS), Chapter 2: Getting Started](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [Algorithms (Sanjoy Dasgupta, Christos Papadimitriou, Umesh Vazirani)](https://epubs.siam.org/?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS), Chapter 3: Asymptotic Notation](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [C++ Core Guidelines: F.16: For "in" parameters, pass cheaply-copied types by value and others by reference to const](https://www.google.com/search?q=https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines%2523Rf-in&utm_source=gemini)



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

**Источник:** [Algorithms (Robert Sedgewick, Kevin Wayne)](https://algs4.cs.princeton.edu/home/?utm_source=gemini)

17. Что такое prefix sum и когда он лучше Fenwick tree?

**Ответ:** Префиксные суммы — это статическая структура данных, вычисляющая сумму на диапазоне за строгое время $O(1)$ без накладных расходов. Массив префиксных сумм предпочтительнее дерева Фенвика (Binary Indexed Tree), когда массив неизменяем (static array), запросов на точечное или интервальное обновление нет, требуется минимальный константный множитель и тривиальная реализация.

**Пример:**

```cpp
// Prefix sum: O(1) query, O(n) update
// Fenwick tree: O(log n) query, O(log n) update

```

**Источник:** [CP-Algorithms: Prefix Sum Array](https://cp-algorithms.com/?utm_source=gemini)

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

**Источник:** [Programming Pearls (Jon Bentley)](https://www.google.com/search?q=https://en.wikipedia.org/wiki/Maximum_subarray_problem%2523Kadane%2527s_algorithm&utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [LeetCode Problem 41: First Missing Positive](https://en.wikipedia.org/wiki/Cycle_sort?utm_source=gemini)

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

**Источник:** [Programming Pearls (Jon Bentley)](https://en.wikipedia.org/wiki/Programming_Pearls?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS), Chapter 2](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [Boyer-Moore Majority Vote Algorithm](https://www.cs.utexas.edu/~moore/best-ideas/mjrty/?utm_source=gemini)

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

**Источник:** [Algorithms (Sedgewick & Wayne)](https://algs4.cs.princeton.edu/home/?utm_source=gemini)

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

**Источник:** [Floyd's Cycle-Finding Algorithm](https://www.google.com/search?q=https://en.wikipedia.org/wiki/Cycle_detection%2523Floyd%2527s_tortoise_and_hare&utm_source=gemini)

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

**Источник:** [CP-Algorithms: Difference Array](https://cp-algorithms.com/?utm_source=gemini)

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

**Источник:** [Algorithms (Sedgewick & Wayne)](https://algs4.cs.princeton.edu/home/?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [Programming Pearls](https://en.wikipedia.org/wiki/Programming_Pearls?utm_source=gemini)

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

**Источник:** [Algorithms (Sedgewick & Wayne)](https://algs4.cs.princeton.edu/home/?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS), Chapter 32: String Matching](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [CP-Algorithms: Prefix function. Knuth-Morris-Pratt algorithm](https://www.google.com/search?q=https://cp-algorithms.com/string/prefix-func.html&utm_source=gemini)

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

**Источник:** [CP-Algorithms: Z-function](https://cp-algorithms.com/string/z-function.html?utm_source=gemini)

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

**Источник:** [Cppreference: std::isalnum](https://en.cppreference.com/w/cpp/string/byte/isalnum?utm_source=gemini)

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

**Источник:** [CP-Algorithms: Manacher's Algorithm](https://cp-algorithms.com/string/manacher.html?utm_source=gemini)

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

**Источник:** [Programming Pearls](https://en.wikipedia.org/wiki/Programming_Pearls?utm_source=gemini)

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

**Источник:** [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/?utm_source=gemini)

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

**Источник:** [Wikipedia: Run-length encoding](https://en.wikipedia.org/wiki/Run-length_encoding?utm_source=gemini)

42. Как посчитать количество различных подстрок? Какие структуры данных для этого нужны?

**Ответ:** Количество различных подстрок эффективно вычисляется за $O(n)$ или $O(n \log n)$ с помощью суффиксных структур данных:

- **Суффиксный автомат (Suffix Automaton):** число различных подстрок равно сумме $\sum (\text{len}[v] - \text{len}[\text{link}[v]])$ по всем вершинам автомата за время $O(n)$.
- **Суффиксный массив (Suffix Array) + LCP:** сумма длин всех суффиксов за вычетом суммы значений массива наибольших общих префиксов: $\frac{n(n + 1)}{2} - \sum_{i=1}^{n-1} \text{LCP}[i]$ за время $O(n \log n)$.

**Пример:**

```cpp
// Количество подстрок через Suffix Array и LCP:
// Total = n * (n + 1) / 2 - std::accumulate(lcp.begin(), lcp.end(), 0LL);

```

**Источник:** [CP-Algorithms: Number of different substrings](https://www.google.com/search?q=https://cp-algorithms.com/string/string-automaton.html%2523number-of-different-substrings&utm_source=gemini)

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

**Источник:** [CP-Algorithms: String Hashing](https://cp-algorithms.com/string/string-hashing.html?utm_source=gemini)

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

**Источник:** [Algorithms (Sedgewick & Wayne), Chapter 5.3: Substring Search](https://algs4.cs.princeton.edu/53substring/?utm_source=gemini)

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

**Источник:** [Cppreference: std::basic_string::reserve](https://en.cppreference.com/w/cpp/string/basic_string/reserve?utm_source=gemini)

## 4. Связные списки

46. Как развернуть односвязный список итеративно и рекурсивно?
47. Как найти середину списка за один проход?
48. Как определить наличие цикла в списке? Объясни алгоритм Floyd.
49. Как найти точку входа в цикл в односвязном списке?
50. Как слить два отсортированных списка?
51. Как удалить `n`-й узел с конца списка за один проход?
52. Как проверить, является ли список палиндромом за `O(n)` времени и `O(1)` памяти?
53. Как развернуть список по `k` элементов?
54. Как скопировать список со случайными указателями (`random pointer`)?
55. Как отсортировать связный список за `O(n log n)`?
56. Почему quicksort плохо подходит для linked list, а mergesort подходит хорошо?
57. Как удалить все дубликаты из отсортированного списка?
58. Как пересечь два списка и найти первый общий узел?
59. Какие ошибки владения памятью типичны при ручной реализации списка на C++?
60. Когда лучше выбрать `std::list`, а когда `std::vector`?

## 5. Stack / Queue / Deque

61. Как реализовать стек с поддержкой `getMin()` за `O(1)`?
62. Как проверить корректность скобочной последовательности?
63. Как вычислить значение выражения в обратной польской записи?
64. Как по стеку вычислить next greater element для каждого массива?
65. Как найти площадь максимального прямоугольника в гистограмме?
66. Как по стеку решить задачу trapping rain water?
67. Как реализовать очередь на двух стеках?
68. Как реализовать стек на двух очередях?
69. Что такое monotonic queue и где она применяется?
70. Как найти максимум в каждом окне размера `k` за `O(n)`?
71. Чем deque отличается от queue и vector по асимптотике и памяти?
72. Как смоделировать LRU cache, комбинируя hash map и двусвязный список?
73. Как проверить, может ли последовательность быть результатом pop-операций стека?
74. Как найти ближайший меньший элемент слева для каждого индекса?
75. Что такое monotonic stack и как доказать его линейную сложность?

## 6. Хеш-таблицы и множества

76. Как работает hash table в среднем случае и в худшем?
77. Чем `std::map` отличается от `std::unordered_map`?
78. Почему важно писать корректный hash для пользовательского типа в C++?
79. Как найти длину самой длинной последовательности consecutive numbers за `O(n)`?
80. Как найти все пары чисел, дающие заданную сумму?
81. Как определить, содержат ли два массива общий элемент за линейное время?
82. Как найти число подмассивов с одинаковым количеством нулей и единиц?
83. Когда стоит использовать `reserve()` у `unordered_map` и `vector`?
84. Что такое rehash и как он влияет на производительность?
85. Как найти дубликаты в потоке данных, если память ограничена?
86. Как решить Two Sum и чем различаются online/offline варианты?
87. Какие атаки возможны на хеш-таблицы с точки зрения худшего случая?
88. Как хранить частоты объектов, если ключ — это сложная структура?
89. Почему порядок обхода `unordered_map` нельзя считать стабильным?
90. В каких задачах bitset лучше hash set?

## 7. Двоичный поиск и поиск по ответу

91. Как реализовать обычный бинарный поиск без off-by-one ошибок?
92. Чем отличаются `lower_bound` и `upper_bound` в C++?
93. Как найти первое и последнее вхождение элемента в отсортированном массиве?
94. Как найти минимум в циклически сдвинутом отсортированном массиве?
95. Как искать элемент в rotated sorted array?
96. Что такое binary search on answer? Приведи задачу.
97. Как найти минимальную скорость, чтобы выполнить работу за `h` часов, через поиск по ответу?
98. Как проверить монотонность предиката для binary search on answer?
99. Почему бинарный поиск применим не только к массивам?
100.  Как найти медиану двух отсортированных массивов за `O(log(min(n,m)))`?
101.  Как найти `k`-й по величине элемент без полной сортировки?
102.  Когда лучше взять `nth_element`, а когда heap?
103.  Как по бинарному поиску найти корень вещественной функции?
104.  Как корректно вычислять `mid`, чтобы избежать переполнения?
105.  Какой инвариант надо поддерживать в бинарном поиске по полуинтервалу `[l, r)`?

## 8. Сортировки

106. Как работает bubble sort и почему она почти никогда не нужна на практике?
107. Почему insertion sort хороша на почти отсортированных данных?
108. Как работает selection sort и в чём её слабое место?
109. Как устроен merge sort? Почему он стабилен?
110. Как устроен quicksort и почему возможен `O(n^2)`?
111. Как выбирать pivot в quicksort, чтобы уменьшить риск худшего случая?
112. Что такое stable sort и где это важно?
113. Как работает heap sort? Почему он не стабилен?
114. Чем `std::sort` обычно реализован в C++ и почему это важно знать?
115. Когда counting sort работает за линейное время?
116. Когда radix sort выигрывает у comparison sort?
117. Как отсортировать массив, состоящий только из 0, 1 и 2?
118. Как проверить, можно ли отсортировать массив одной операцией reverse подотрезка?
119. Как слить `k` отсортированных списков или массивов?
120. Как выбрать между sort, partial_sort, nth_element и priority_queue?

## 9. Деревья: основы

121. Что такое height, depth, leaf, subtree, ancestor?
122. Чем полный бинарный дерево отличается от совершенного и сбалансированного?
123. Как обойти дерево в preorder, inorder, postorder и level-order?
124. Как восстановить дерево по preorder и inorder?
125. Почему inorder BST даёт отсортированную последовательность?
126. Как проверить, является ли дерево BST?
127. Как найти высоту дерева и его диаметр?
128. Как проверить, сбалансировано ли дерево по высоте?
129. Как найти LCA в обычном бинарном дереве?
130. Как найти LCA в BST быстрее, чем в обычном дереве?
131. Как посчитать количество путей с заданной суммой в бинарном дереве?
132. Как развернуть бинарное дерево зеркально?
133. Как сериализовать и десериализовать бинарное дерево?
134. Как пройти дерево без рекурсии, используя стек?
135. Как вычислить правый вид бинарного дерева?

## 10. BST / Heap / Priority Queue

136. Как вставить, удалить и найти элемент в BST? Какова сложность в среднем и в худшем случае?
137. Почему несбалансированное BST может выродиться в список?
138. Чем AVL дерево отличается от Red-Black Tree на концептуальном уровне?
139. Как работает min-heap и max-heap?
140. Как построить heap за `O(n)`, а не за `O(n log n)`?
141. Как найти `k` наибольших элементов через min-heap?
142. Как объединить несколько отсортированных потоков с помощью heap?
143. Когда `priority_queue` в C++ лучше, чем `multiset`?
144. Как найти медиану потока чисел с помощью двух куч?
145. Как удалить произвольный элемент из heap и почему это неудобно в стандартной `priority_queue`?
146. Как работает heapify вниз и вверх?
147. Как найти top K frequent elements?
148. Когда BST подходит лучше hash table?
149. Как реализовать custom comparator для `priority_queue` в C++?
150. Как проверить, является ли массив представлением корректной кучи?

## 11. Графы: базовые обходы

151. Что такое список смежности и матрица смежности? Когда что лучше?
152. Каковы сложности BFS и DFS?
153. Как с помощью BFS найти кратчайший путь в невзвешенном графе?
154. Как восстановить сам путь после BFS?
155. Как найти количество компонент связности в неориентированном графе?
156. Как проверить, двудольный ли граф?
157. Как найти цикл в неориентированном графе?
158. Как найти цикл в ориентированном графе?
159. Что такое цвета состояний в DFS и зачем они нужны?
160. Как сделать topological sort? Назови два способа.
161. Как проверить, существует ли топологический порядок?
162. Как найти все вершины, достижимые из набора стартовых?
163. Как найти shortest path в лабиринте с препятствиями?
164. Как работает multi-source BFS?
165. Как обработать граф с вершинами-строками в C++?

## 12. Графы: кратчайшие пути и MST

166. Когда использовать Dijkstra, а когда BFS?
167. Почему Dijkstra не работает с отрицательными рёбрами?
168. Как реализовать Dijkstra через `priority_queue` в C++?
169. Почему в реализации Dijkstra часто допускают устаревшие вершины в куче?
170. Как работает Bellman–Ford и что он умеет дополнительно?
171. Как обнаружить отрицательный цикл?
172. Как работает Floyd–Warshall и какова его сложность?
173. Когда all-pairs shortest paths выгоднее считать не Floyd–Warshall, а серией запусков Dijkstra?
174. Что такое MST и чем Kruskal отличается от Prim?
175. Как работает DSU в алгоритме Краскала?
176. Как отсортировать рёбра и избежать лишнего копирования в C++?
177. Как найти второе минимальное остовное дерево?
178. Как проверить, уникально ли минимальное остовное дерево?
179. Как найти мосты в графе?
180. Как найти точки сочленения?

## 13. DSU / Union-Find

181. Как реализовать DSU с path compression и union by size/rank?
182. Почему амортизированная сложность операций DSU почти константна?
183. Как по DSU определять количество компонент после каждой операции union?
184. Как решать dynamic connectivity offline с помощью DSU?
185. Как проверить наличие цикла в неориентированном графе через DSU?
186. Как по DSU объединять аккаунты с общими email?
187. Что такое rollback DSU и где он нужен?
188. Как использовать DSU на сетке для задач про острова?
189. Как посчитать число островов при постепенном добавлении клеток?
190. Почему DSU плохо подходит для поиска кратчайшего пути?
191. Как объединять дополнительную информацию в DSU, например размер, сумму, минимум?
192. Как реализовать DSU на строковых ключах?
193. Чем `union by rank` отличается от `union by size` на практике?
194. Как решать equations satisfiability (`a==b`, `a!=b`) через DSU?
195. Какие ошибки чаще всего допускают при реализации `find()`?

## 14. Рекурсия, backtracking, brute force

196. Чем отличаются brute force, backtracking и branch and bound?
197. Как сгенерировать все подмножества множества?
198. Как сгенерировать все перестановки массива?
199. Как решить N-Queens через backtracking?
200. Как найти все комбинации, сумма которых равна target?
201. Как генерировать скобочные последовательности длины `2n`?
202. Как решить Sudoku backtracking'ом?
203. Когда стоит отсекать ветви по pruning?
204. Как избежать лишних копирований при рекурсии на C++?
205. Какие риски у глубокой рекурсии в C++?
206. Как переписать рекурсию в итеративный вариант со стеком?
207. Как проверить, можно ли разбить строку на слова из словаря?
208. Как найти все пути из источника в сток в DAG?
209. Как решать задачу partition to k equal sum subsets?
210. Как анализировать сложность backtracking-решений?

## 15. Dynamic Programming: базовый уровень

211. Как распознать, что задача решается DP?
212. Чем top-down memoization отличается от bottom-up tabulation?
213. Как решить Fibonacci через DP и почему это учебный, но слабый пример?
214. Как найти число способов подняться по лестнице?
215. Как решить 0/1 Knapsack?
216. Чем bounded, unbounded и 0/1 knapsack отличаются по переходам?
217. Как найти LCS двух строк?
218. Как найти edit distance?
219. Как найти longest increasing subsequence за `O(n^2)` и за `O(n log n)`?
220. Как найти минимальную сумму пути в сетке?
221. Как посчитать количество уникальных путей в сетке с препятствиями?
222. Как решить coin change на минимум монет?
223. Как решить house robber и house robber II?
224. Как найти maximum product subarray?
225. Как уменьшить память DP с `O(nm)` до `O(min(n,m))`?

## 16. Dynamic Programming: продвинутый уровень

226. Что такое DP по профилю и где оно применяется?
227. Как устроено DP по подотрезкам на примере matrix chain multiplication?
228. Как решать задачи типа interval DP на скобки, палиндромы, разрезание?
229. Что такое tree DP? Приведи пример на maximum independent set на дереве.
230. Как устроено bitmask DP на задаче TSP?
231. Что такое digit DP?
232. Как решать задачи на DP с оптимизацией монотонной очередью?
233. Что такое divide and conquer optimization в DP?
234. Что такое Knuth optimization и какие у неё условия применимости?
235. Как решать DP на DAG в топологическом порядке?
236. Что такое rerooting DP на деревьях?
237. Как комбинировать prefix sums и DP для ускорения переходов?
238. Как восстановить ответ из DP, а не только значение?
239. Как доказывать корректность DP-переходов?
240. Какие типичные ошибки бывают в инициализации `INF`, базовых случаях и переполнении?

## 17. Greedy

241. Как понять, что жадный алгоритм вообще может быть корректным?
242. Почему для interval scheduling жадный выбор по правой границе оптимален?
243. Как покрыть отрезками максимальное число непересекающихся интервалов?
244. Как проверять корректность greedy через exchange argument?
245. Как работает Huffman coding и почему он greedy?
246. Как зажадно разменивать монеты и когда это ломается?
247. Как минимизировать число платформ/переговорных комнат для интервалов?
248. Как выбрать минимальное число точек, покрывающих все отрезки?
249. Как строить лексикографически минимальную строку под ограничениями?
250. Как проверить, можно ли доплыть до конца массива в Jump Game?
251. Как найти минимальное число прыжков в Jump Game II?
252. Почему greedy работает в задаче о газовых станциях на минимальное число остановок?
253. Чем greedy отличается от local search?
254. Как доказать, что сортировка по ключу и линейный проход дают оптимум?
255. Когда greedy надо комбинировать с heap или DSU?

## 18. Bit manipulation

256. Как проверить, является ли число степенью двойки?
257. Как посчитать количество установленных битов?
258. Что делает выражение `x & (x - 1)`?
259. Как выделить младший установленный бит?
260. Как поменять местами два числа через XOR и почему это обычно не нужно?
261. Как с помощью битов представить множество из элементов от 0 до 63?
262. Как перебрать все подмаски маски?
263. Как найти единственный элемент, если все остальные встречаются дважды?
264. Как найти элемент, если все остальные встречаются трижды?
265. Как решить subset sum на маленьком `n` через meet-in-the-middle?
266. Когда `std::bitset` эффективнее `vector<bool>` и `vector<char>`?
267. Как использовать биты для DP по подмножествам?
268. Что такое битовая компрессия состояний?
269. Почему побитовые операции часто ускоряют код в задачах на маски?
270. Какие ошибки возникают при сдвигах signed-типов в C++?

## 19. Интервалы, sweep line, события

271. Как слить пересекающиеся интервалы?
272. Как вставить новый интервал в уже слитый список интервалов?
273. Как найти число одновременно активных интервалов?
274. Как вычислить суммарную длину объединения отрезков?
275. Как по sweep line найти точки пересечения событий по времени?
276. Как решить meeting rooms через сортировку начал и концов?
277. Как найти skyline problem?
278. Как применять difference map для интервалов на больших координатах?
279. Что такое coordinate compression и зачем она нужна?
280. Как обрабатывать запросы на отрезках offline после сортировки событий?
281. Как найти количество вложенных интервалов?
282. Как решать задачи про пересечение прямоугольников через line sweep?
283. Как хранить активные интервалы во время sweep line?
284. Когда достаточно сортировки событий, а когда нужен сегментник?
285. Какие ошибки возможны при обработке одинаковых координат событий?

## 20. Fenwick / Segment Tree / Sparse Table

286. Когда префиксных сумм уже недостаточно и нужен Fenwick tree?
287. Как Fenwick tree поддерживает point update и prefix query за `O(log n)`?
288. Как получить сумму на диапазоне через Fenwick tree?
289. Как Fenwick tree расширяется до поиска `k`-й позиции по префиксным суммам?
290. Когда нужен segment tree вместо Fenwick tree?
291. Как устроен segment tree для range sum?
292. Что такое lazy propagation и зачем она нужна?
293. Как поддерживать range add + range max в сегментном дереве?
294. Как найти минимум на отрезке с обновлениями?
295. Что такое sparse table и когда он лучше segment tree?
296. Почему sparse table подходит для idempotent-операций вроде min/gcd?
297. Как реализовать iterative segment tree в C++?
298. Каков компромисс между памятью и скоростью у segment tree?
299. Как решать задачи order statistics с Fenwick или segment tree?
300. Когда лучше использовать policy-based data structures вместо самописного дерева?

## 21. Trie / String DS

301. Как устроен trie и какова его сложность по длине строки?
302. Как найти максимальный XOR пары чисел через бинарный trie?
303. Как удалять слово из trie?
304. Как хранить количество слов с данным префиксом?
305. Когда trie лучше hash table, а когда хуже?
306. Как реализовать поиск с wildcard-символом через trie?
307. Что такое Aho–Corasick и когда он нужен?
308. Как искать множество шаблонов в одном тексте?
309. Как устроен suffix array и для чего он нужен?
310. Как по suffix array искать подстроку?
311. Что такое suffix automaton и какие запросы он умеет?
312. Как посчитать количество различных подстрок через suffix automaton?
313. Как сравнить trie, suffix array и hash-based поиск по памяти и скорости?
314. Какие аллокационные оптимизации полезны для trie в C++?
315. Что выбрать для словаря: `unordered_map<string, ...>` или trie?

## 22. Математика и теория чисел

316. Как найти gcd и lcm двух чисел?
317. Как работает алгоритм Евклида и какова его сложность?
318. Что такое быстрый `pow_mod` и зачем он нужен?
319. Как проверить простоту числа быстрее, чем делением до `n`?
320. Как работает решето Эратосфена?
321. Как находить простые множители числа для многих запросов?
322. Что такое расширенный алгоритм Евклида?
323. Как находить модульную обратную величину?
324. Когда существует обратный элемент по модулю?
325. Как считать биномиальные коэффициенты по модулю простого числа?
326. Что такое принцип включений-исключений и где он применяется?
327. Как решать задачи на префиксный XOR и чётность?
328. Что такое матричное быстрое возведение в степень?
329. Как применить числа Фибоначчи через матрицы?
330. Где в алгоритмах встречается китайская теорема об остатках?

## 23. Геометрия и вычислительная геометрия

331. Как посчитать ориентацию тройки точек через векторное произведение?
332. Как проверить пересечение двух отрезков?
333. Как вычислить площадь многоугольника?
334. Как найти выпуклую оболочку? Назови хотя бы один алгоритм.
335. Как найти ближайшую пару точек быстрее, чем `O(n^2)`?
336. Что такое line sweep в геометрии?
337. Как проверить, лежит ли точка внутри многоугольника?
338. Как найти расстояние от точки до прямой или отрезка?
339. Почему в геометрии опасно использовать `double` без эпсилона?
340. Когда лучше работать в целых координатах?
341. Как сортировать точки по полярному углу?
342. Что такое bounding box и зачем он полезен?
343. Как найти пересечение прямоугольников на плоскости?
344. Какие типичные ошибки связаны с переполнением в геометрических формулах?
345. Как реализовать `Point`-структуру и операторы для неё на C++?

## 24. C++ STL и практические аспекты

346. Какие операции у `vector` имеют амортизированную `O(1)`?
347. Чем `vector`, `deque`, `list` и `forward_list` отличаются practically?
348. Когда `emplace_back` полезнее `push_back`?
349. Что делают `reserve`, `resize` и `shrink_to_fit`?
350. Чем `set` отличается от `unordered_set`, а `map` — от `unordered_map`?
351. Как написать custom comparator для `sort`, `set` и `priority_queue`?
352. Когда стоит использовать `array`, а когда `vector`?
353. Как безопасно удалять элементы из контейнера во время итерации?
354. Что делает idiom erase-remove?
355. Когда полезен `std::lower_bound` на векторе вместо `set`?
356. Как избежать лишних копирований через `const&`, move semantics и `emplace`?
357. Что важно помнить о валидности итераторов после вставки и удаления?
358. Почему `vector<bool>` — особенный контейнер и чем он неудобен?
359. Какие переполнения бывают при использовании `int`, `long long`, `size_t`?
360. Как профилировать узкие места решения на C++?
