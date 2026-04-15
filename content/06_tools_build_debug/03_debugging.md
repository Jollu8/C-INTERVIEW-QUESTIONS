# C/C++ Debugging Question Bank (Linux)

## Legend

* **L1** — базовый

* **L2** — middle

* **L3** — senior

* **L4** — staff

* **[T]** — теория

* **[P]** — практика

* **[D]** — debugging

* **[S]** — system design / production engineering

---

# 3. Debugging

---

## 3.1 Основы отладки

## L1

1. (L1, T) Что такое debugging symbols?
2. (L1, T) Что делает флаг `-g`?
3. (L1, T) Чем debug build отличается от release build с точки зрения отладки?
4. (L1, T) Что такое stack trace?
5. (L1, T) Что такое stack frame?
6. (L1, T) Как вызовы функций формируют call stack?
7. (L1, T) Что такое core dump?
8. (L1, P) Как включить генерацию core dump через `ulimit`?
9. (L1, P) Как проверить, что core dump действительно создается?
10. (L1, T) Почему без `-g` отладка сильно ограничена?

## L2

11. (L2, T) Какие данные попадают в debug symbols?
12. (L2, T) Почему оптимизации ухудшают качество stack trace?
13. (L2, T) Как frame pointer связан с backtrace?
14. (L2, T) Что делает `-fno-omit-frame-pointer`?
15. (L2, P) Как получить stack trace из упавшего процесса?
16. (L2, P) Как посмотреть системные настройки core dump в Linux?
17. (L2, D) Почему core dump не появился после падения программы?
18. (L2, D) Почему stack trace неполный или “сломанный”?
19. (L2, T) Что такое signal и какие сигналы обычно приводят к crash?
20. (L2, T) Чем `SIGSEGV` отличается от `SIGABRT`?

## L3

21. (L3, T) Как DWARF связан с debug symbols?
22. (L3, T) Как устроено unwind stack trace на Linux?
23. (L3, T) Почему tail-call optimization мешает отладке?
24. (L3, D) Почему адреса в stack trace есть, а имен функций нет?
25. (L3, P) Как использовать `addr2line` для расшифровки адресов?
26. (L3, D) Почему crash воспроизводится только в release-сборке?
27. (L3, D) Как дебажить optimized-out variables?
28. (L3, T) Что такое separate debug symbols?
29. (L3, P) Как отделить символы от бинаря и использовать их отдельно?
30. (L3, D) Как понять, соответствует ли core dump именно этому бинарю?

## L4

31. (L4, T) Как устроена инфраструктура symbol server / debug package в Linux?
32. (L4, S) Как организовать хранение debug symbols для production?
33. (L4, D) Как расследовать crash при частично поврежденном stack?
34. (L4, S) Как проектировать build/debug pipeline, чтобы post-mortem был надежным?
35. (L4, D) Как восстанавливать контекст падения при отсутствии полного core dump?

---

## 3.2 GDB

## L1

36. (L1, T) Что такое GDB?
37. (L1, P) Как запустить программу под GDB?
38. (L1, P) Как поставить обычный breakpoint?
39. (L1, P) В чем разница между `run` и `start`?
40. (L1, P) Что делают команды `step`, `next`, `finish`?
41. (L1, P) Как посмотреть backtrace?
42. (L1, P) Как вывести значение переменной?
43. (L1, P) Как продолжить выполнение после остановки?
44. (L1, P) Как выйти из GDB?
45. (L1, T) В чем разница между source-level и instruction-level debugging?

## L2

46. (L2, P) Как поставить conditional breakpoint?
47. (L2, P) Как поставить breakpoint по имени функции?
48. (L2, P) Как поставить breakpoint по файлу и строке?
49. (L2, P) Что такое watchpoint?
50. (L2, P) Как смотреть память по адресу?
51. (L2, P) Как напечатать register'ы?
52. (L2, P) Как attach'иться к уже запущенному процессу?
53. (L2, D) Когда attach полезнее, чем запуск под GDB?
54. (L2, P) Как переключаться между потоками в GDB?
55. (L2, D) Как найти поток, который завис или держит mutex?

## L3

56. (L3, T) В чем разница hardware watchpoint vs software watchpoint?
57. (L3, D) Почему breakpoint “не срабатывает”?
58. (L3, D) Почему GDB показывает `<optimized out>`?
59. (L3, P) Как дебажить core dump через GDB?
60. (L3, P) Как загрузить отдельные debug symbols в GDB?
61. (L3, P) Как дизассемблировать текущую функцию?
62. (L3, P) Как смотреть аргументы функции и локальные переменные на каждом frame?
63. (L3, D) Как искать corruption памяти через watchpoint?
64. (L3, D) Как дебажить multithreaded deadlock в GDB?
65. (L3, P) Как использовать `thread apply all bt`?

## L4

66. (L4, T) Как GDB работает с DWARF и unwind info?
67. (L4, D) Как дебажить race condition, которая редко воспроизводится?
68. (L4, S) Как встроить GDB-based post-mortem анализ в production pipeline?
69. (L4, D) Как расследовать crash внутри libc / libstdc++ / чужой `.so`?
70. (L4, D) Как использовать Python scripting в GDB для автоматизации расследований?

---

## 3.3 Memory Debugging

### Valgrind

## L1

71. (L1, T) Что такое Valgrind?
72. (L1, T) Что делает Memcheck?
73. (L1, T) Что такое memory leak?
74. (L1, T) Что такое use-after-free?
75. (L1, T) Что такое invalid read / invalid write?
76. (L1, P) Как запустить программу под Valgrind?
77. (L1, P) Как включить leak detection?
78. (L1, D) Как интерпретировать “definitely lost”?
79. (L1, D) Как интерпретировать “indirectly lost”?
80. (L1, D) Чем leak отличается от still reachable?

## L2

81. (L2, D) Как по отчету Valgrind найти место утечки?
82. (L2, P) Как использовать suppression files?
83. (L2, T) Почему Valgrind сильно замедляет программу?
84. (L2, D) Какие классы ошибок хорошо ловит Valgrind?
85. (L2, D) Какие ошибки Valgrind ловит плохо или не ловит?
86. (L2, T) Почему Valgrind хуже подходит для heavily optimized кода?
87. (L2, D) Что означает “conditional jump depends on uninitialised value”?
88. (L2, P) Как анализировать uninitialized memory через Valgrind?
89. (L2, D) Как найти double free через Valgrind?
90. (L2, D) Как найти heap corruption через Valgrind?

## L3

91. (L3, T) Как Valgrind инструментирует код?
92. (L3, D) Почему под Valgrind баг исчезает?
93. (L3, D) Почему Valgrind показывает много шума от сторонних библиотек?
94. (L3, P) Как сочетать Valgrind и debug symbols для качественного анализа?
95. (L3, D) Как анализировать leaks в long-running daemon?
96. (L3, D) Как отличить реальную утечку от кешей/allocator pools?
97. (L3, S) Когда Valgrind лучше ASan, а когда хуже?
98. (L3, D) Как дебажить corruption, если stack trace указывает на allocator, а не на место ошибки?
99. (L3, P) Как использовать Massif и когда это полезно?
100. (L3, T) Что такое origin tracking в Valgrind?

## L4

101. (L4, S) Как встроить Valgrind checks в CI без чрезмерного slowdown?
102. (L4, D) Как расследовать memory corruption, который воспроизводится только на production-нагрузке?
103. (L4, S) Как выбрать memory-debugging strategy для большого C/C++ проекта?
104. (L4, D) Как приоритизировать сотни Valgrind-репортов в legacy-коде?
105. (L4, S) Как комбинировать Valgrind, ASan и post-mortem анализ?

### AddressSanitizer / UBSan

## L1

106. (L1, T) Что такое AddressSanitizer?
107. (L1, T) Что такое UndefinedBehaviorSanitizer?
108. (L1, P) Как собрать программу с ASan?
109. (L1, P) Как собрать программу с UBSan?
110. (L1, T) Какие ошибки ловит ASan?
111. (L1, T) Какие ошибки ловит UBSan?
112. (L1, D) Чем ASan отличается от Valgrind?
113. (L1, D) Что такое heap-buffer-overflow?
114. (L1, D) Что такое stack-buffer-overflow?
115. (L1, D) Что такое use-after-free?

## L2

116. (L2, T) Как ASan инструментирует код?
117. (L2, T) Что такое red zones?
118. (L2, D) Почему ASan может падать раньше, чем исходная программа без него?
119. (L2, P) Как читать ASan stack trace?
120. (L2, D) Как найти источник UB по отчету UBSan?
121. (L2, T) Какие типы UB особенно важны в C/C++?
122. (L2, D) Почему signed integer overflow считается UB?
123. (L2, P) Можно ли запускать ASan в тестах/CI?
124. (L2, D) Почему sanitizer-сборка иногда требует отключить часть оптимизаций?
125. (L2, D) Что делать, если sanitizer нашел баг в third-party code?

## L3

126. (L3, T) Ограничения ASan по сравнению с Valgrind?
127. (L3, T) Что такое ODR violation detection у sanitizer'ов?
128. (L3, D) Почему sanitizer-сборка не воспроизводит production crash?
129. (L3, D) Как расследовать intermittent use-after-free с ASan?
130. (L3, D) Как интерпретировать shadow memory report?
131. (L3, T) Что такое leak sanitizer и как он связан с ASan?
132. (L3, P) Как комбинировать ASan и UBSan в одной сборке?
133. (L3, D) Почему sanitizer увеличивает memory footprint?
134. (L3, D) Как анализировать false positive / false negative sanitizer'ов?
135. (L3, S) Как внедрить sanitizer pipeline в команду?

## L4

136. (L4, S) Как выбрать набор sanitizer'ов для разных стадий CI/CD?
137. (L4, D) Как расследовать баг, который проявляется только без sanitizer'ов?
138. (L4, S) Как минимизировать стоимость sanitizer builds в большом монорепо?
139. (L4, D) Как использовать sanitizer-репорты для поиска архитектурных проблем?
140. (L4, S) Как построить policy: какие sanitizer'ы обязательны для merge?

---

## 3.4 Post-mortem анализ

## L1

141. (L1, T) Что такое post-mortem debugging?
142. (L1, T) Зачем нужен core dump после crash?
143. (L1, P) Как открыть core dump в GDB?
144. (L1, T) Почему stripped binary затрудняет анализ?
145. (L1, T) Что значит “бинарь соотносится с core dump”?

## L2

146. (L2, D) Как понять причину падения по core dump?
147. (L2, P) Как получить backtrace всех потоков из core dump?
148. (L2, D) Как понять, какой поток упал первым?
149. (L2, D) Что делать, если бинарь stripped, но debug package есть?
150. (L2, D) Почему адреса в core dump не совпадают с исходниками?
151. (L2, T) Как ASLR влияет на post-mortem анализ?
152. (L2, P) Как использовать `info sharedlibrary` в GDB?
153. (L2, D) Как понять, какая версия библиотеки была загружена во время crash?
154. (L2, D) Как расследовать crash в фоне, когда нет возможности воспроизвести локально?
155. (L2, T) Чем post-mortem отличается от live-debugging?

## L3

156. (L3, D) Как анализировать production crash без исходников всех зависимостей?
157. (L3, D) Как расследовать crash внутри allocator'а?
158. (L3, D) Как понять, что первичная ошибка произошла задолго до падения?
159. (L3, T) Что такое split debug info и build-id?
160. (L3, P) Как использовать build-id для поиска символов?
161. (L3, D) Как расследовать crash в multithreaded сервисе по core dump?
162. (L3, D) Как отличить memory corruption от логической ошибки по core dump?
163. (L3, D) Как извлекать полезный контекст: аргументы, глобальные объекты, состояние очередей?
164. (L3, D) Что делать, если core dump слишком большой или обрезанный?
165. (L3, S) Как организовать автоматический сбор и разбор core dump'ов?

## L4

166. (L4, S) Как строить production crash triage pipeline?
167. (L4, D) Как кластеризовать одинаковые crash'и по stack trace / signature?
168. (L4, S) Как обеспечить соответствие: бинарь, symbols, config, core?
169. (L4, D) Как анализировать crash после hotfix, если символы потеряны?
170. (L4, S) Как сделать post-mortem анализ стандартной инженерной практикой в команде?

---

## 3.5 Logging

## L1

171. (L1, T) Зачем нужен logging?
172. (L1, T) Какие бывают уровни логирования?
173. (L1, T) Чем `INFO` отличается от `DEBUG`?
174. (L1, T) Когда использовать `ERROR` и `FATAL`?
175. (L1, P) Какие поля полезно включать в лог?
176. (L1, T) Что такое structured logging?
177. (L1, T) Почему plain text логов может быть недостаточно?
178. (L1, P) Что важно логировать при ошибке?
179. (L1, D) Почему “слишком мало логов” мешает расследованию?
180. (L1, D) Почему “слишком много логов” тоже проблема?

## L2

181. (L2, T) Что такое correlation ID / request ID?
182. (L2, T) Как логирование помогает в distributed/system-level debugging?
183. (L2, D) Как понять по логам порядок событий в многопоточном приложении?
184. (L2, T) Что такое synchronous vs asynchronous logging?
185. (L2, T) Как логи влияют на latency?
186. (L2, D) Почему verbose logging может скрыть race condition?
187. (L2, P) Как выбирать log level для production?
188. (L2, T) Как логировать исключения и errno-коды?
189. (L2, P) Какие события обязательно логировать в daemon/service?
190. (L2, D) Как коррелировать логи с stack trace и crash timestamp?

## L3

191. (L3, T) Как structured logging упрощает автоматический анализ?
192. (L3, T) Как формировать schema логов?
193. (L3, D) Почему логирование может менять timing и маскировать баг?
194. (L3, D) Как расследовать инцидент, если есть только логи и нет core dump?
195. (L3, S) Как балансировать observability и overhead?
196. (L3, T) Как логировать безопасно с точки зрения sensitive data?
197. (L3, D) Почему логи из нескольких потоков трудно интерпретировать?
198. (L3, P) Какие метаданные полезны для production crash investigation?
199. (L3, T) Как sampling логов влияет на debugging?
200. (L3, S) Как стандартизировать logging policy в команде?

## L4

201. (L4, S) Как строить logging strategy для high-load C++ сервиса?
202. (L4, S) Когда логирование нужно дополнять metrics/tracing, а не расширять?
203. (L4, D) Как расследовать rare production bug при минимальном допустимом логировании?
204. (L4, S) Как проектировать логирование так, чтобы оно помогало post-mortem анализу?
205. (L4, S) Как формализовать требования к диагностической информации в production?

---

# 10. Practical / Real-world Scenarios

## L2

206. (L2, D) Программа падает с `SIGSEGV`: какие первые 5 шагов расследования?
207. (L2, D) Есть core dump, но нет символов: что делать?
208. (L2, D) Программа зависла, а не упала: как дебажить?
209. (L2, D) Утечка памяти растет медленно неделями: какой план анализа?
210. (L2, D) После включения `-O2` баг появился, а под GDB исчезает: почему так бывает?

## L3

211. (L3, D) Падение происходит только под нагрузкой и только ночью: как строить расследование?
212. (L3, D) Crash внутри `std::string`/`malloc`: как понять, что корень проблемы раньше?
213. (L3, D) Есть только логи и адрес падения из syslog: как двигаться дальше?
214. (L3, D) Один поток “висит”, остальные ждут: как искать deadlock?
215. (L3, D) Sanitizer находит баг, но стек указывает в allocator/runtime: как локализовать исходный код?

## L4

216. (L4, S) Как построить единую стратегию debugging для legacy C/C++ продукта?
217. (L4, S) Как сократить MTTR для production crash'ей в 2–3 раза?
218. (L4, S) Какие артефакты должны автоматически сохраняться при падении сервиса?
219. (L4, S) Как стандартизировать требования к symbol retention, logging и sanitizer builds?
220. (L4, S) Как внедрить культуру доказательного расследования инцидентов, а не “угадывания по логу”?

---

