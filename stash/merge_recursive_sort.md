Да, это отличная идея! Разделение кода и комментариев может сделать статью более читаемой. Вот как это может выглядеть:

---

# Рекурсивная сортировка слиянием

#### Введение:

В этой статье я попытаюсь объяснить вам алгоритм сортировки слиянием, известный как `merge_sort`, простым языком. Если
вы ранее не могли понять, как он работает, то эта статья для вас. Здесь не будет обсуждаться сложность асимптотики или
математическое доказательство, так как они усложняют все, и в интернете уже много написано и доказано на эту тему.

> Этот учебник - отрывок из моего объяснения сути алгоритма сортировки и как они работают.

#### Что от вас требуется:

1. Знать функциональное программирование и основы языка C++
2. Хотя бы раз в жизни слышать, что такое рекурсия и как она работает

#### Начало:

Есть много видов сортировки, такие как `quick_sort`, `bubble_sort`, `shell_sort` и многие другие.
Но самый простой из них - это `bubble_sort`, то есть вложенный цикл и обмен элементов. Но на практике он очень
медленный.
Поверьте, когда вы будете решать задачи, вам обязательно пригодится сортировка слиянием.

Конечно, вот как сортировка слиянием разделяет и собирает массив:

1. Исходный массив:

| 1 | 5 | 8 | 9 | 6 |
|---|---|---|---|---|

2. Разделение на подмассивы:

| 1 | 5 | 8 | 9 | 6 |
|---|---|---|---|---|
| 1 | 5 | 8 | - | - |
| 9 | 6 | - | - | - |
| 1 | 5 | - | - | - |
| 9 | - | - | - | - |
| 6 | - | - | - | - |
| 1 | - | - | - | - |
| 5 | - | - | - | - |

3. Слияние подмассивов:

| 1 | 5 | - | - | - |
|---|---|---|---|---|
| 5 | 1 | - | - | - |
| 9 | 6 | - | - | - |
| 6 | 9 | - | - | - |
| 1 | 5 | 6 | 9 | - |
| 1 | 5 | 6 | 8 | 9 |

4. Итоговый отсортированный массив:

| 1 | 5 | 6 | 8 | 9 |
|---|---|---|---|---|

```c++
std::vector<int> arr {1,5,8,9,6}; // массив будет в std векторе
```

```c++
void merge_sort(std::vector<int>& arr, int start, int end); 
```

Как вы видите, функция будет принимать сам массив (важно! массив нужно передать через ссылку)
и два типа `start` и `end`

```c++
int main() {
    std::vector<int> arr {1,5,8,9,6};
    merge_sort(arr, 0, arr.size()); // здесь 0 - это начало массива, то есть это start
    // arr.size() - это конец массива, то есть end == 5
    std::cout << "Вывод на косноль отсортированный массив\n";
    for(auto i : arr) std::cout << i " ";
}    
```

Как показано выше на схеме, массив должен разделиться на две части, а затем еще на две части, пока размер массива больше '1'

```c++
void merge_sort(std::vector<int>& arr, int start, int end) {  // дальше код не будет дублироваться, так что читайте внимательно :)
    if(end - start < 2) return; // вот это и есть условие рекурсии. Если не поставить эту строку, то скорее всего 
    // рекурсия будет выполняться до тех пор, пока не переполнится стек
```

Как выше было написано, ты должен разделить массив на две части. Но до этого надо найти центр массива.

```c++
const std::size_t mid = (start + end) / 2 // в первой рекурсии массив просто разделится на две части, вот и все
    
    // теперь надо разделить массив (на самом деле сам вектор не будет разделен, а только индексы будут разделены)
    
    merge_sort(arr, start, mid) // как видите, передал самой рекурсии часть диапазона массива 
    // то есть выше будут переданы индексы для (1,5,8) 
    merge_sort(arr, mid, end) // а вот здесь передается остальная часть 
    // вот выше будет разделено, пока вот это условие верно if(end - start < 2)
```

В этом участке кода будет выполнен после того, как массив раздроблен до мелочей. Теперь обратно надо собрать все, то
есть раскатать язык обратно (шутка). Но прежде всего нужен временный буфер.

```c++
std::vector<int> buff;
    buff.reserve(end - start); // будет лучше, если сразу зарезервировать память (если не знаете, читайте про std vector capacity)
    
    std::size_t left = start; // это типа arr[i], то есть arr[left]. Диапазон его всегда до mid, так как массив разделен на две части 
    // и у левой части последний индекс всегда до mid
    std::size_t right = mid; // а это точно такой же, как left, только у него диапазон с mid до end
```

Теперь надо заполнить временный вектор, ой, то есть буфер (buff).

```c++
while((left < mid) && (right < end)) { // обратите внимание здесь 
    // как видите, условие поставлено очень странно. Здесь условие говорит, что цикл будет выполняться до тех пор, пока start меньше, чем mid, а right меньше end
    
    if(arr[left] < arr[right]) { // здесь на самом деле можно ставить какой-нибудь предикат. Я решил специально не ставить его, так как он усложняет код 
      buff.push_back(arr[left]); // Если условие выполняется, добавляем элемент из левой части массива в буфер
      ++left; // условие сработало, значит, индекс надо увеличить на один, то есть i++ 
      } else {
      buff.push_back(arr[right]);
      ++right;
      } 
      } // выше в условии if говорится так: если левая часть удовлетворяет условию, то добавить в буфер элемент из левой части массива, а иначе - из правой части
```

Как выше в буфер добавились элементы, то скорее всего некоторые элементы останутся из левой или правой части. Здесь у
вас должен быть вопрос: а как может остаться элемент, если в начале массив разделен на две части? Это очень просто. Как
вы заметили, размер массива нечетный, а это 5%2 приводит к остатку, а это и есть наш оставшийся элемент.

```c++
while(left < mid) {
      buff.push_back(arr[left]);
      ++left; // как видите, здесь как в вышестоящем цикле
      }
      
      while(right < end) {
      buff.push_back(arr[right]);
      ++right;
      }
```

Ой, все, наконец-то написал почти все. Теперь самый последний штрих. Помните, выше я напомнил, чтобы массив обязательно
передали через ссылку. Вот это сейчас пригодится. Теперь просто в массив вставить данные из буфера и все. Не буду
выпендриваться, просто буду использовать std::copy.

```c++
std::copy(buff.begin(), buff.end(), arr.begin() + start);
      // обратите внимание на условие копирования
      // как видите, весь буфер копируется в массив, начиная с индекса start. Это сделано из-за т

}
```

Исходный код [здесь](https://github.com/Jollu8/Algorithms/blob/7725440e3f4508dc37afee12fb001d46ab1f2639/Sort/Merge.cpp#L10)

> Если ты понял все, попробуй реализовать merge_sort с функцией merge

> Если получилось все, попробуй merge_sort сделать для single_linked_list
