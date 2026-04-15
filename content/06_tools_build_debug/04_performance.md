# C/C++ Performance & Profiling Question Bank (Linux)

## Legend

* **L1** — базовый

* **L2** — middle

* **L3** — senior

* **L4** — staff

* **[T]** — теория

* **[P]** — практика

* **[D]** — debugging / investigation

* **[S]** — system design / performance engineering

---

# 4. Performance & Profiling

---

## 4.1 CPU Profiling

## L1

1. (L1, T) Что такое profiling и чем он отличается от benchmarking?
2. (L1, T) Зачем нужен CPU profiling?
3. (L1, T) Что такое hotspot?
4. (L1, T) Почему “самая медленная функция” не всегда корень проблемы?
5. (L1, T) Что такое sampling profiler?
6. (L1, T) Что такое instrumentation profiler?
7. (L1, T) Что такое wall-clock time и CPU time?
8. (L1, T) Что такое user time и system time?
9. (L1, P) Как измерить общее время выполнения программы в Linux?
10. (L1, T) Почему без измерений оптимизация — это угадывание?

## L2

11. (L2, T) Что такое `perf` и для чего он используется?
12. (L2, P) Как запустить `perf stat` для программы?
13. (L2, P) Как запустить `perf record` и посмотреть отчет?
14. (L2, T) Что такое sampling frequency?
15. (L2, T) Что такое call graph profiling?
16. (L2, P) Как понять, какая функция потребляет CPU?
17. (L2, D) Почему top/htop недостаточно для анализа производительности?
18. (L2, T) Что такое `gprof`?
19. (L2, P) Как собрать программу для `gprof`?
20. (L2, T) В чем ограничения `gprof` по сравнению с `perf`?

## L3

21. (L3, T) Как `perf` получает samples на Linux?
22. (L3, T) Что такое PMU (Performance Monitoring Unit)?
23. (L3, T) Разница hardware counters vs software events?
24. (L3, P) Как использовать `perf top` для live-анализа?
25. (L3, P) Как собрать flamegraph из `perf` данных?
26. (L3, T) Что такое inclusive time и exclusive/self time?
27. (L3, D) Почему горячая функция может быть “жертвой”, а не причиной проблемы?
28. (L3, T) Что показывает flamegraph?
29. (L3, D) Как читать flamegraph правильно?
30. (L3, D) Почему “широкий фрейм” на flamegraph не всегда значит, что код надо оптимизировать именно там?

## L4

31. (L4, T) Как sampling bias влияет на выводы из профилирования?
32. (L4, D) Как диагностировать performance cliff, который проявляется только на production-нагрузке?
33. (L4, S) Как встроить CPU profiling в инженерный workflow команды?
34. (L4, D) Как отличить CPU-bound проблему от lock contention, IO wait или scheduler issue?
35. (L4, S) Как строить reproducible CPU profiling pipeline для large-scale C++ сервиса?

### perf

## L1

36. (L1, T) Что показывает `perf stat`?
37. (L1, P) Как посмотреть instructions, cycles, branches?
38. (L1, T) Что такое IPC?
39. (L1, T) Почему высокий CPU usage не всегда означает плохую производительность?
40. (L1, P) Как профилировать конкретный PID через `perf`?

## L2

41. (L2, T) Что такое `perf record` и `perf report`?
42. (L2, P) Как включить call graph в `perf record`?
43. (L2, D) Почему `perf` может не показывать symbols?
44. (L2, D) Почему без frame pointers/call graph качество профиля хуже?
45. (L2, P) Как использовать `perf annotate`?
46. (L2, T) Что такое CPU migrations и context switches?
47. (L2, P) Как измерить cache-misses через `perf stat`?
48. (L2, D) Как понять по `perf`, что проблема в branch misprediction?
49. (L2, T) Что такое stalled cycles?
50. (L2, D) Как по counters понять, что код упирается не в ALU, а в память?

## L3

51. (L3, T) Что такое multiplexing counters в `perf`?
52. (L3, T) Почему counters иногда неточны?
53. (L3, P) Как профилировать только user-space или kernel-space?
54. (L3, P) Как сравнивать два `perf` профиля до/после оптимизации?
55. (L3, D) Как интерпретировать высокий LLC miss rate?
56. (L3, D) Как понять, что bottleneck в instruction cache?
57. (L3, T) Что такое off-CPU analysis и чем он отличается от обычного CPU profiling?
58. (L3, D) Как `perf` помогает найти lock contention?
59. (L3, P) Как анализировать perf data для многопоточного приложения?
60. (L3, D) Как профилировать короткоживущую программу, которая заканчивается слишком быстро?

## L4

61. (L4, S) Как стандартизировать perf-based performance investigations?
62. (L4, D) Как расследовать нестабильные результаты `perf` между прогонами?
63. (L4, S) Как сочетать `perf`, tracing и benchmarks для одного performance incident?
64. (L4, D) Как анализировать CPU profile в контейнерах / ограниченных окружениях?
65. (L4, S) Как автоматизировать regression detection по hardware counters?

### gprof

## L1

66. (L1, T) Как работает `gprof` на базовом уровне?
67. (L1, P) Какие флаги нужны для сборки под `gprof`?
68. (L1, P) Как получить `gmon.out`?
69. (L1, P) Как прочитать отчет `gprof`?
70. (L1, T) Чем flat profile отличается от call graph в `gprof`?

## L2

71. (L2, T) В чем ограничения `gprof` для современных C/C++ приложений?
72. (L2, D) Почему `gprof` плохо подходит для многопоточного кода?
73. (L2, D) Почему `gprof` может искажать производительность?
74. (L2, T) Когда `gprof` все еще может быть полезен?
75. (L2, D) Почему `gprof` показывает странные результаты на optimized code?

## L3

76. (L3, D) Как отличить артефакты `gprof` от реальных bottleneck'ов?
77. (L3, S) Почему в современной Linux-практике чаще выбирают `perf`, а не `gprof`?
78. (L3, D) Какие типы профилей `gprof` принципиально не может дать?
79. (L3, T) Почему instrumentation-based profiling меняет runtime behavior?
80. (L3, D) Как объяснить расхождение между `gprof` и `perf`?

### Flamegraphs

## L1

81. (L1, T) Что такое flamegraph?
82. (L1, T) Что означает ширина блока на flamegraph?
83. (L1, T) Что означает высота flamegraph?
84. (L1, P) Как на базовом уровне использовать flamegraph для поиска hotspot'ов?
85. (L1, D) Почему flamegraph не показывает временную последовательность событий?

## L2

86. (L2, D) Как отличить self time от вложенных вызовов на flamegraph?
87. (L2, D) Как понять, что у функции “дорогие дети”, а не она сама?
88. (L2, P) Как сравнивать two flamegraphs до/после изменений?
89. (L2, D) Какие типичные ошибки допускают при чтении flamegraph?
90. (L2, T) Почему flamegraph удобен для больших call stacks?

## L3

91. (L3, D) Как flamegraph помогает обнаружить accidental complexity?
92. (L3, D) Как по flamegraph заметить чрезмерную аллокацию или dispatch overhead?
93. (L3, D) Как увидеть на flamegraph, что время уходит в STL/allocator/runtime, а не в business logic?
94. (L3, P) Как строить differential flamegraph?
95. (L3, D) Как не сделать ложных выводов по flamegraph без дополнительных метрик?

## L4

96. (L4, S) Как встроить flamegraphs в performance review pipeline?
97. (L4, D) Как использовать flamegraphs для обучения команды performance thinking?
98. (L4, S) Как автоматизировать генерацию flamegraphs для regression analysis?
99. (L4, D) Когда flamegraph лучше таблицы hot functions, а когда хуже?
100. (L4, S) Как объединять flamegraphs с counters и benchmark-результатами в единую картину?

---

## 4.2 Memory Profiling

## L1

101. (L1, T) Что такое memory profiling?
102. (L1, T) Чем memory leak отличается от high memory usage?
103. (L1, T) Что такое heap profiling?
104. (L1, T) Что такое stack memory vs heap memory?
105. (L1, T) Почему большое число аллокаций может быть проблемой даже без leak?
106. (L1, T) Что такое fragmentation?
107. (L1, T) Что такое cache locality?
108. (L1, T) Почему locality влияет на производительность?
109. (L1, P) Какие признаки memory problem можно заметить без профайлера?
110. (L1, D) Почему рост RSS не всегда означает leak?

## L2

111. (L2, T) Что показывает heap profiler?
112. (L2, D) Как понять, какие участки кода чаще всего аллоцируют память?
113. (L2, D) Почему allocator может удерживать память после free?
114. (L2, T) В чем разница virtual memory, RSS и working set?
115. (L2, D) Как fragmentation ухудшает memory footprint?
116. (L2, D) Как fragmentation влияет на latency?
117. (L2, T) Что такое temporal locality?
118. (L2, T) Что такое spatial locality?
119. (L2, D) Почему linked list часто хуже vector с точки зрения locality?
120. (L2, P) Какие практические способы улучшить cache locality ты знаешь?

## L3

121. (L3, T) Как heap profiler собирает данные об аллокациях?
122. (L3, D) Как различить leak, churn и allocator retention?
123. (L3, D) Почему большое число мелких аллокаций опасно для производительности?
124. (L3, D) Как profiling помогает найти ненужные копирования и временные объекты?
125. (L3, D) Как понять, что bottleneck связан с allocator contention?
126. (L3, T) Что такое NUMA и почему это важно для memory profiling?
127. (L3, D) Как плохая locality проявляется в CPU profile?
128. (L3, D) Как layout данных влияет на cache misses?
129. (L3, D) Почему AoS vs SoA может радикально менять производительность?
130. (L3, P) Как профилировать memory-heavy код в long-running service?

## L4

131. (L4, S) Как проектировать data structures с учетом locality?
132. (L4, S) Когда стоит внедрять custom allocator/pool allocator?
133. (L4, D) Как расследовать memory bloat в production без полного доступа к процессу?
134. (L4, S) Как встроить memory profiling в CI/performance lab?
135. (L4, S) Как отличать архитектурную memory problem от локального implementation bug?

### Heap Profiling

## L1

136. (L1, T) Что такое heap snapshot?
137. (L1, T) Что означает allocation hotspot?
138. (L1, P) Что полезно смотреть в heap profile в первую очередь?
139. (L1, D) Почему один и тот же код может давать разные heap profile на разных входных данных?
140. (L1, T) Почему количество аллокаций и объем аллокаций — разные метрики?

## L2

141. (L2, D) Как выявить функцию, которая делает лишние аллокации?
142. (L2, D) Почему `std::string`/`std::vector` могут неожиданно аллоцировать часто?
143. (L2, P) Как проверить гипотезу, что reserve/reuse уменьшит churn?
144. (L2, D) Как heap profiling помогает в оптимизации latency-sensitive кода?
145. (L2, T) Почему allocator behavior зависит от паттернов освобождения памяти?

## L3

146. (L3, D) Как находить allocation hot path через combined CPU + memory profile?
147. (L3, D) Как отличить полезные аллокации от accidental allocations?
148. (L3, S) Какие аллокации допустимы в hot path, а какие нет?
149. (L3, D) Как профилировать аллокации в многопоточной программе?
150. (L3, D) Почему heap profile без контекста workload может ввести в заблуждение?

### Fragmentation

## L1

151. (L1, T) Что такое external fragmentation?
152. (L1, T) Что такое internal fragmentation?
153. (L1, D) Почему fragmentation может приводить к росту памяти без leak?
154. (L1, T) Как размеры объектов влияют на fragmentation?
155. (L1, D) Почему долгоживущие и короткоживущие объекты вместе — риск для fragmentation?

## L2

156. (L2, D) Как заподозрить fragmentation по симптомам?
157. (L2, D) Почему fragmentation опасна для сервисов с длительным uptime?
158. (L2, T) Как allocator design влияет на fragmentation?
159. (L2, D) Как object pooling может помочь?
160. (L2, D) Когда pooling ухудшает ситуацию?

## L3

161. (L3, D) Как отличить fragmentation от allocator caching?
162. (L3, D) Как fragmentation влияет на page faults и locality?
163. (L3, S) Какие архитектурные решения уменьшают fragmentation?
164. (L3, D) Как mixed-size allocations влияют на long-term footprint?
165. (L3, D) Как profiling подтвердит, что проблема именно во fragmentation?

### Cache Locality

## L1

166. (L1, T) Что такое CPU cache?
167. (L1, T) Какие уровни кэша обычно есть?
168. (L1, T) Что такое cache line?
169. (L1, T) Почему последовательный доступ обычно быстрее случайного?
170. (L1, D) Почему pointer chasing часто медленный?

## L2

171. (L2, D) Как locality влияет на throughput?
172. (L2, D) Как locality влияет на latency?
173. (L2, P) Какие структуры данных обычно лучше с точки зрения locality?
174. (L2, D) Почему `std::vector` часто быстрее `std::list`?
175. (L2, D) Как data layout влияет на performance больше, чем микрооптимизации кода?

## L3

176. (L3, T) Что такое cache-friendly algorithm?
177. (L3, D) Как профилировать cache misses?
178. (L3, D) Как false locality assumptions приводят к неправильным выводам?
179. (L3, D) Как branchy code и poor locality взаимно усиливают slowdown?
180. (L3, S) Когда нужно redesign data layout ради locality?

## L4

181. (L4, S) Как обучать команду думать категориями data-oriented performance?
182. (L4, D) Как доказать, что bottleneck именно в locality, а не в “медленном CPU”?
183. (L4, S) Как встроить locality review в code review/perf review процесс?
184. (L4, D) Как локально воспроизвести production locality problem?
185. (L4, S) Как принимать trade-off между readability/abstraction и locality?

---

## 4.3 Benchmarking

## L1

186. (L1, T) Что такое benchmark?
187. (L1, T) Чем microbenchmark отличается от macrobenchmark?
188. (L1, T) Когда microbenchmark полезен?
189. (L1, T) Когда microbenchmark вводит в заблуждение?
190. (L1, T) Что важно фиксировать при измерении benchmark?
191. (L1, P) Почему нужно делать несколько прогонов?
192. (L1, T) Что такое warm-up?
193. (L1, D) Почему “один запуск” нельзя считать доказательством?
194. (L1, T) Что такое variance в измерениях?
195. (L1, D) Почему benchmark на ноутбуке может быть нестабилен?

## L2

196. (L2, T) Как оптимизации компилятора влияют на benchmark?
197. (L2, D) Почему компилятор может “выкинуть” код из microbenchmark?
198. (L2, P) Как предотвратить dead-code elimination в benchmark?
199. (L2, T) Почему `-O0` почти бесполезен для performance benchmark?
200. (L2, D) Почему benchmark должен соответствовать реальному workload?
201. (L2, T) Что важнее: latency, throughput или tail latency?
202. (L2, P) Какие факторы окружения нужно стабилизировать перед benchmark?
203. (L2, D) Как CPU frequency scaling ломает чистоту измерений?
204. (L2, D) Как IO и page cache могут испортить benchmark?
205. (L2, P) Чем полезны percentile-метрики вместо одного среднего значения?

## L3

206. (L3, T) Как проектировать representative macrobenchmark?
207. (L3, D) Почему ускорение microbenchmark не гарантирует ускорение системы?
208. (L3, D) Как benchmark может поощрять “оптимизацию не того”?
209. (L3, T) Что такое benchmark harness?
210. (L3, P) Как сравнивать две версии алгоритма корректно?
211. (L3, D) Как отличить signal от noise в benchmark results?
212. (L3, D) Как понять, что разница 3% реальна, а не статистический шум?
213. (L3, T) Как работать с regression benchmark suite?
214. (L3, S) Как автоматизировать performance regression testing?
215. (L3, D) Как связывать benchmark-результаты с профилировщиком, а не гадать по цифрам?

## L4

216. (L4, S) Как строить benchmarking culture в C/C++ команде?
217. (L4, S) Как выбрать KPI для performance regression gates?
218. (L4, D) Как расследовать “benchmark improved, production worsened”?
219. (L4, S) Как проектировать lab environment для достоверных benchmark'ов?
220. (L4, S) Как совмещать synthetic benchmarks и production traces?

### Влияние оптимизаций компилятора

## L1

221. (L1, T) Почему один и тот же код на `-O0` и `-O3` ведет себя по-разному по скорости?
222. (L1, T) Что оптимизатор обычно делает с простыми циклами?
223. (L1, D) Почему benchmark без оптимизаций почти бесполезен?
224. (L1, T) Как inline влияет на benchmark?
225. (L1, D) Почему small function call overhead может исчезнуть после оптимизации?

## L2

226. (L2, T) Что такое vectorization и как она влияет на benchmark?
227. (L2, D) Почему `-march=native` может резко изменить результаты?
228. (L2, D) Как UB может сделать benchmark “быстрым, но бессмысленным”?
229. (L2, P) Как проверить, что оптимизатор не упростил benchmark до константы?
230. (L2, D) Почему release benchmark нужно сопровождать inspection generated code?

## L3

231. (L3, D) Как интерпретировать benchmark, если разные компиляторы дают разный результат?
232. (L3, D) Почему PGO/LTO могут улучшить одни benchmark'и и ухудшить другие?
233. (L3, S) Как выбирать стандартный набор compile flags для perf lab?
234. (L3, D) Как доказывать, что улучшение связано с кодом, а не с изменением flags/toolchain?
235. (L3, D) Когда необходимо смотреть asm, а не только benchmark numbers?

### False Sharing

## L1

236. (L1, T) Что такое false sharing?
237. (L1, T) Как false sharing связан с cache line?
238. (L1, D) Почему независимые переменные в разных потоках могут мешать друг другу?
239. (L1, T) Почему false sharing особенно важен в многопоточном C++ коде?
240. (L1, P) Какие симптомы могут указывать на false sharing?

## L2

241. (L2, D) Как false sharing проявляется в benchmark'ах?
242. (L2, D) Почему throughput может резко падать при росте числа потоков?
243. (L2, P) Как padding помогает бороться с false sharing?
244. (L2, T) Почему array of counters — типичный источник false sharing?
245. (L2, D) Как отличить false sharing от lock contention?

## L3

246. (L3, D) Как подтвердить false sharing через perf counters и benchmark?
247. (L3, S) Как проектировать per-thread data structures, чтобы избежать false sharing?
248. (L3, D) Почему false sharing может появиться после “безобидного” рефакторинга?
249. (L3, D) Как NUMA и false sharing вместе ухудшают performance?
250. (L3, S) Когда padding оправдан, а когда это лишний расход памяти?

## L4

251. (L4, S) Как встроить проверку false sharing risks в performance review?
252. (L4, D) Как расследовать production slowdown, вызванный cache-line contention?
253. (L4, S) Какие шаблоны многопоточного дизайна минимизируют false sharing?
254. (L4, D) Как сочетать benchmarking, profiling и code inspection для доказательства false sharing?
255. (L4, S) Как обучать команду видеть false sharing на уровне структуры данных, а не только профиля?

---

# 10. Practical / Real-world Scenarios

## L2

256. (L2, D) CPU usage высокий, но throughput низкий: какие основные гипотезы проверишь?
257. (L2, D) После оптимизации алгоритма benchmark улучшился, а система — нет. Почему?
258. (L2, D) `perf` показывает hotspot в allocator/STL: как двигаться дальше?
259. (L2, D) Программа делает много мелких аллокаций: как проверить, что это bottleneck?
260. (L2, D) С ростом потоков производительность перестала масштабироваться: как расследовать?

## L3

261. (L3, D) Flamegraph показывает глубокий стек абстракций, но ни одна функция не выглядит “очевидно плохой”: что это значит?
262. (L3, D) После перехода на новый компилятор benchmark изменился на 7%: как проверить, реальна ли разница?
263. (L3, D) Есть подозрение на плохую locality данных: какой минимальный план расследования?
264. (L3, D) Производительность плавает между прогонами без изменений кода: какие источники нестабильности проверишь?
265. (L3, D) `perf stat` показывает много cache-misses и stalled cycles: какие инженерные выводы можно делать, а какие пока нельзя?

## L4

266. (L4, S) Как построить performance engineering process для C/C++ сервиса под Linux?
267. (L4, S) Какие артефакты должны прикладываться к performance regression issue?
268. (L4, S) Как стандартизировать benchmark-практику между командами?
269. (L4, S) Как уменьшить число ложных performance regression alarms?
270. (L4, S) Как формализовать правило: “сначала измерь, потом оптимизируй, потом докажи эффект”?

---
