# Modern_C++

## Лёгкий уровень

1. Что обычно понимают под термином Modern C++?
2. Почему Modern C++ обычно связывают с C++11 и более новыми стандартами?
3. Чем современный стиль C++ отличается от “старого” C with Classes-подхода?
4. Почему в modern C++ стараются меньше использовать сырой `new` и `delete`?
5. Почему в modern C++ предпочитают RAII ручному управлению ресурсами?
6. Что такое RAII в современном C++?
7. Почему automatic storage duration часто предпочтительнее динамического выделения памяти?
8. Что такое `nullptr`?
9. Чем `nullptr` лучше `NULL` и `0`?
10. Что такое `auto`?
11. Когда `auto` улучшает читаемость кода?
12. Когда `auto` ухудшает читаемость кода?
13. Что такое range-based `for`?
14. Чем range-based `for` удобнее обычного цикла по индексам?
15. Что такое uniform initialization?
16. Что такое список инициализации в фигурных скобках `{}`?
17. Почему инициализация через `{}` считается важной частью modern C++?
18. Что такое `= delete`?
19. Что такое `= default`?
20. Зачем явно запрещать некоторые операции через `= delete`?
21. Что такое `override`?
22. Почему `override` полезен в современном C++?
23. Что такое `final`?
24. Когда имеет смысл помечать метод `final`?
25. Что такое `enum class`?
26. Чем `enum class` лучше обычного `enum`?
27. Что такое `using` для псевдонимов типов?
28. Чем `using` удобнее `typedef`?
29. Что такое `static_assert`?
30. Для чего нужен `static_assert`?
31. Что такое лямбда-выражение?
32. Почему лямбды считаются одной из ключевых возможностей modern C++?
33. Что такое smart pointer?
34. Какие основные smart pointers есть в стандартной библиотеке?
35. Что такое `std::unique_ptr`?
36. Что такое `std::shared_ptr`?
37. Что такое `std::weak_ptr`?
38. Что такое `std::make_unique`?
39. Что такое `std::make_shared`?
40. Почему `make_unique` и `make_shared` обычно предпочтительнее явного `new`?
41. Что такое move semantics?
42. Почему move semantics стали важны в C++11? ([C++ Reference][1])
43. Что такое rvalue reference?
44. Как объявить `T&&`?
45. Что делает `std::move`?
46. Почему `std::move` сам по себе ничего не перемещает?
47. Что такое `constexpr`?
48. Чем `constexpr` отличается от `const`?
49. Что такое `noexcept`?
50. Почему `noexcept` важен в современном C++?

## Ниже среднего уровня

51. Почему в modern C++ предпочитают инициализацию объекта сразу при создании?
52. Чем инициализация отличается от присваивания?
53. Что такое narrowing conversion?
54. Почему инициализация через `{}` помогает избегать narrowing conversions?
55. Чем `int x = 3.14;` отличается от `int x{3.14};`?
56. Что такое delegating constructors?
57. Что такое inherited constructors?
58. Для чего нужны делегирующие конструкторы?
59. Что такое member initializer list?
60. Почему поля класса лучше инициализировать в списке инициализации, а не присваивать в теле конструктора?
61. Что такое in-class member initializers?
62. Чем полезны значения полей по умолчанию прямо в объявлении класса?
63. Что такое `decltype`?
64. Чем `decltype` отличается от `auto`?
65. Что такое trailing return type?
66. Когда запись `auto f() -> T` удобнее обычной формы?
67. Что такое `decltype(auto)`?
68. Почему `decltype(auto)` требует аккуратности?
69. Что такое value category выражения?
70. Какие основные value categories есть в современном C++? ([C++ Reference][2])
71. Что такое lvalue?
72. Что такое prvalue?
73. Что такое xvalue?
74. Почему value categories важны для move semantics?
75. Что такое perfect forwarding?
76. Для чего нужен `std::forward`?
77. Чем `std::forward` отличается от `std::move`?
78. Что такое forwarding reference?
79. Чем forwarding reference отличается от обычной rvalue-ссылки?
80. Что такое reference collapsing?
81. Почему `const T&` по-прежнему часто используют в modern C++?
82. Когда лучше передавать объект по значению, а не по `const T&`?
83. Когда лучше возвращать объект по значению?
84. Почему современный C++ часто поощряет возврат по значению?
85. Что такое copy elision?
86. Что такое NRVO?
87. Почему copy elision важен для эффективности modern C++?
88. Что такое rule of three?
89. Что такое rule of five?
90. Что такое rule of zero?
91. Почему rule of zero считается предпочтительным подходом?
92. Что такое move constructor?
93. Что такое move assignment operator?
94. Чем копирование отличается от перемещения?
95. Почему moved-from объект должен оставаться валидным?
96. Что означает “валидный, но не определённый логически” объект после перемещения?
97. Что такое `std::swap` и почему он важен в современном коде?
98. Почему `noexcept` move-конструктор влияет на контейнеры STL?
99. Что такое `std::exchange`?
100. Когда `std::exchange` удобен при написании move-операций?

## Средний уровень

101. Что такое `std::optional`?
102. Когда `std::optional<T>` лучше, чем особое значение-сентинел?
103. Чем `std::optional` лучше пары вида `bool + T`?
104. Что такое `std::variant`?
105. Чем `std::variant` лучше `union` в современном C++?
106. Что такое `std::visit`?
107. Что такое `std::any`?
108. Когда `std::any` уместен, а когда слишком динамичен?
109. Что такое `std::string_view`?
110. Чем `std::string_view` отличается от `std::string`?
111. Какие риски lifetime связаны со `std::string_view`?
112. Что такое `std::span`?
113. Чем `std::span` отличается от контейнера?
114. Почему `span` удобен для параметров функций?
115. Какие ошибки lifetime возможны при использовании `std::span`?
116. Что такое structured bindings?
117. Для чего удобны structured bindings?
118. Когда structured bindings делают код чище?
119. Что такое `if` с инициализатором?
120. Что такое `switch` с инициализатором?
121. Почему `if (auto it = ...; it != ...)` полезен для ограничения области видимости?
122. Что такое inline variables?
123. Зачем понадобились inline variables в C++17?
124. Что такое `[[nodiscard]]`?
125. Почему `[[nodiscard]]` полезен для API?
126. Что такое `[[maybe_unused]]`?
127. Когда имеет смысл использовать `[[fallthrough]]`?
128. Что такое атрибуты в современном C++? ([C++ Reference][3])
129. Что такое `std::byte`?
130. Чем `std::byte` отличается от `unsigned char`?
131. Что такое `char8_t`?
132. Почему современные стандарты добавляют более явные средства для работы с текстом и кодировками? ([C++ Reference][4])
133. Что такое CTAD?
134. Как расшифровывается Class Template Argument Deduction?
135. Когда CTAD упрощает запись шаблонного кода?
136. Что такое deduction guides?
137. Что такое fold expressions?
138. Чем fold expression удобнее рекурсии по parameter pack?
139. Что такое variadic templates?
140. Для чего нужны variadic templates?
141. Что такое `if constexpr`?
142. Чем `if constexpr` отличается от обычного `if`?
143. Почему `if constexpr` упростил шаблонный код?
144. Что такое `constexpr if` в проектировании generic-кода?
145. Что такое `std::invoke`?
146. Какие callable-объекты может вызывать `std::invoke`?
147. Что такое `std::apply`?
148. Для чего нужен `std::apply` с `tuple`?
149. Что такое `std::as_const`?
150. Когда `std::as_const` полезен для читаемости и безопасности?

## Выше среднего уровня

151. Что такое concepts в C++20? ([C++ Reference][5])
152. Для чего были добавлены concepts?
153. Чем concepts лучше старого SFINAE по читаемости?
154. Что такое `requires`-clause?
155. Что такое `requires`-expression?
156. Как ограничить шаблон с помощью concept?
157. Что такое `std::integral`?
158. Что такое `std::same_as`?
159. Что такое constrained templates?
160. Почему concepts улучшают сообщения об ошибках компилятора? ([C++ Reference][6])
161. Что такое ranges в C++20? ([C++ Reference][5])
162. Чем ranges отличаются от классического подхода “пара итераторов”?
163. Что такое view в ranges?
164. Чем view отличается от контейнера?
165. Что такое ленивые вычисления в ranges?
166. Что делает `std::views::filter`?
167. Что делает `std::views::transform`?
168. Что делает `std::views::take`?
169. Почему композиция views через `|` делает код более декларативным?
170. Какие риски lifetime есть у views?
171. Что такое borrowed range?
172. Почему borrowed ranges важны для безопасности?
173. Что такое `std::ranges::sort`?
174. Чем `ranges::sort` отличается от старого `std::sort`?
175. Что такое projections в ranges-алгоритмах?
176. Что такое coroutines в C++20? ([C++ Reference][5])
177. Для каких задач корутины полезны?
178. Чем coroutine отличается от обычной функции?
179. Что такое `co_await`?
180. Что такое `co_yield`?
181. Что такое `co_return`?
182. Что такое generator-подход и как он связан с корутинами?
183. Что такое modules в C++20? ([C++ Reference][5])
184. Зачем были добавлены modules?
185. Чем modules отличаются от `#include`?
186. Какие проблемы заголовков пытаются решить modules?
187. Что такое interface unit у модуля?
188. Что такое `import`?
189. Почему modules не являются просто “красивой заменой include”?
190. Что такое feature-test macros?
191. Зачем нужны feature-test macros в portable modern C++? ([C++ Reference][7])
192. Что такое `__cpp_*`-макросы?
193. Почему modern C++-код часто требует проверки поддержки фич компилятором?
194. Что такое compile-time programming в современном C++?
195. Чем `constexpr`-подход отличается от классического template metaprogramming?
196. Когда `consteval` лучше, чем `constexpr`?
197. Что такое `constinit`?
198. Чем `constinit` отличается от `constexpr`?
199. Почему инициализация глобальных объектов остаётся важной темой даже в modern C++?
200. Что такое static initialization order fiasco?

## Сложный уровень

201. Почему “prefer composition over inheritance” особенно актуально в modern C++?
202. Почему value semantics считаются важной частью современного стиля?
203. Когда стоит проектировать тип как value type?
204. Когда нужен polymorphic interface, а когда шаблонный полиморфизм?
205. Чем static polymorphism отличается от dynamic polymorphism?
206. Когда CRTP уместен в modern C++?
207. Почему type erasure считают важной современной техникой?
208. Когда `std::function` удобнее шаблонного параметра callable?
209. В чём цена `std::function` по сравнению с шаблонным вызовом?
210. Что такое small object optimization и как она может влиять на `std::function`?
211. Почему чрезмерная динамическая аллокация считается плохим тоном в modern C++?
212. Почему невладеющие указатели и представления данных требуют особой дисциплины lifetime?
213. Что такое ownership semantics?
214. Почему ownership должен быть явно выражен в типе?
215. Когда поле типа `std::unique_ptr<T>` лучше отражает дизайн, чем сырой `T*`?
216. Когда `T&` лучше, чем `T*`, для невладеющей зависимости?
217. Почему `std::shared_ptr` не должен использоваться “по умолчанию”?
218. В чём опасность неразборчивого применения `shared_ptr`?
219. Что такое циклическое владение через `shared_ptr`?
220. Как `weak_ptr` помогает разрывать циклы?
221. Что такое pImpl-идиома и почему она до сих пор актуальна?
222. Как modern C++ влияет на реализацию pImpl?
223. Почему `unique_ptr` хорошо сочетается с pImpl?
224. Что такое ABI и почему он важен для библиотек C++?
225. Почему новые возможности языка не всегда автоматически подходят для публичного ABI?
226. Что такое hidden friends и когда они полезны?
227. Что такое customization point object?
228. Почему современная стандартная библиотека использует CPO-подход?
229. Чем generic programming в modern C++ отличается от старого подхода “максимум виртуальных классов”?
230. Почему concepts, ranges и type traits часто работают вместе? ([C++ Reference][8])
231. Что такое `std::filesystem` и почему его относят к modern C++-инструментам?
232. Какие задачи решает `std::filesystem`?
233. Что такое `std::chrono` в современном стиле проектирования?
234. Почему strongly typed time durations безопаснее голых целых чисел?
235. Что такое `std::jthread` и чем он отличается от `std::thread`?
236. Что такое `stop_token` и отмена работы в современном многопоточном коде?
237. Почему современный C++ поощряет типобезопасность сильнее, чем старые стили кода?
238. Почему `enum class`, `optional`, `variant` и strong typedef-подход улучшают модель данных?
239. Когда `std::expected` концептуально лучше исключений или `optional`?
240. В каких задачах `optional` недостаточен без информации об ошибке?
241. Почему современный API часто старается быть explicit в отношении ошибок, владения и времени жизни?
242. Что такое `explicit` у конструкторов и операторов преобразования?
243. Почему `explicit` особенно важен в generic-коде?
244. Когда неявные преобразования вредят modern C++-дизайну?
245. Что такое `[[nodiscard]]`-ориентированный API-дизайн?
246. Почему маленькие чистые функции хорошо сочетаются с современным стилем C++?
247. Почему modern C++ — это не только новые фичи, но и новый стиль проектирования?
248. Какие старые практики формально допустимы, но обычно считаются плохими в modern C++?
249. Почему “modern C++” не означает “использовать все новые возможности сразу”?
250. Какие основные принципы хорошего кода в modern C++ ты бы сформулировал?


[<- Prev](./08_stl.md)      [Next ->](./10_raii_move_semantics.md)




[1]: https://en.cppreference.com/w/cpp/11.html?utm_source=chatgpt.com "C++11"
[2]: https://en.cppreference.com/w/cpp/language/value_category.html?utm_source=chatgpt.com "Value categories - cppreference.com"
[3]: https://en.cppreference.com/w/cpp/language/attributes.html?utm_source=chatgpt.com "Attribute specifier sequence (since C++11)"
[4]: https://en.cppreference.com/w/cpp/23.html?utm_source=chatgpt.com "C++23 - cppreference.com"
[5]: https://en.cppreference.com/w/cpp/20.html?utm_source=chatgpt.com "C++20 - cppreference.com"
[6]: https://en.cppreference.com/w/cpp/concepts.html?utm_source=chatgpt.com "Concepts library (since C++20) - cppreference.com - C++ Reference"
[7]: https://en.cppreference.com/w/cpp/experimental/feature_test.html?utm_source=chatgpt.com "Feature testing (since C++20) - cppreference.com - C++ Reference"
[8]: https://en.cppreference.com/w/cpp/ranges.html?utm_source=chatgpt.com "Ranges library (since C++20) - cppreference.com"


