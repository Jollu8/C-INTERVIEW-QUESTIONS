# C/C++ Runtime & System Level Question Bank (Linux)

## Legend

* **L1** — базовый

* **L2** — middle

* **L3** — senior

* **L4** — staff

* **[T]** — теория

* **[P]** — практика

* **[D]** — debugging / investigation

* **[S]** — system design / production engineering

---

# 5. Runtime & System Level

---

## 5.1 Процессы и потоки

### Процессы: fork / exec

## L1

1. (L1, T) Что такое процесс в Linux?
2. (L1, T) Что такое PID?
3. (L1, T) Чем процесс отличается от потока?
4. (L1, T) Что делает `fork()`?
5. (L1, T) Что делает `exec()`?
6. (L1, T) В чем разница между `fork()` и `exec()`?
7. (L1, T) Что получает дочерний процесс после `fork()`?
8. (L1, T) Что происходит с адресным пространством при `fork()`?
9. (L1, T) Что такое copy-on-write?
10. (L1, P) Какой return value у `fork()` в родителе и в дочернем процессе?

## L2

11. (L2, T) Почему часто используют связку `fork() + exec()`?
12. (L2, T) Что происходит с открытыми file descriptors при `fork()`?
13. (L2, T) Что происходит с file descriptors при `exec()`?
14. (L2, T) Что делает флаг `FD_CLOEXEC`?
15. (L2, P) Как дождаться завершения дочернего процесса?
16. (L2, P) Как узнать exit code дочернего процесса?
17. (L2, D) Почему после `fork()` код “выполняется дважды”?
18. (L2, D) Почему после `exec()` часть ожидаемой логики не выполняется?
19. (L2, T) Что происходит с памятью процесса после успешного `exec()`?
20. (L2, T) Чем `execl`, `execv`, `execvp`, `execve` отличаются друг от друга?

## L3

21. (L3, T) Почему `fork()` в многопоточном процессе опасен?
22. (L3, T) Какие ограничения есть после `fork()` до `exec()` в multithreaded программе?
23. (L3, T) Что такое async-signal-safe functions и почему это важно после `fork()`?
24. (L3, D) Почему процесс завис после `fork()` в приложении с mutex'ами?
25. (L3, T) Что такое zombie process?
26. (L3, T) Что такое orphan process?
27. (L3, D) Как найти и объяснить появление zombie processes?
28. (L3, P) Как перенаправить stdin/stdout/stderr дочернего процесса перед `exec()`?
29. (L3, P) Как реализовать запуск внешней команды с пайпом?
30. (L3, D) Почему child process наследует “лишние” дескрипторы?

## L4

31. (L4, S) Когда процессы лучше потоков для изоляции и надежности?
32. (L4, S) Как проектировать process supervision в Linux-сервисе?
33. (L4, D) Как расследовать редкие deadlock'и, связанные с `fork()` в большом C++ приложении?
34. (L4, S) Как проектировать безопасный launcher/worker runtime на базе `fork/exec`?
35. (L4, D) Как строить forensic-анализ проблем с process lifecycle в production?

### Потоки: pthreads

## L1

36. (L1, T) Что такое поток исполнения?
37. (L1, T) Что общее у потоков одного процесса?
38. (L1, T) Что у потоков раздельное?
39. (L1, T) Что такое `pthread`?
40. (L1, P) Как создать поток через pthread API?
41. (L1, P) Как дождаться завершения потока?
42. (L1, T) Что такое joinable и detached thread?
43. (L1, T) Что такое mutex?
44. (L1, T) Зачем нужны condition variables?
45. (L1, D) Почему многопоточный код сложнее однопоточного?

## L2

46. (L2, T) Что такое race condition?
47. (L2, T) Чем race condition отличается от data race?
48. (L2, T) Что такое critical section?
49. (L2, P) Как защитить shared data с помощью mutex?
50. (L2, P) Как использовать condition variable для ожидания события?
51. (L2, D) Почему “редко падающий” баг часто связан с потоками?
52. (L2, D) Как возникает deadlock?
53. (L2, D) Как возникает livelock?
54. (L2, T) Что такое starvation?
55. (L2, T) Что такое thread-safe code?

## L3

56. (L3, T) Что такое memory ordering на практическом уровне?
57. (L3, T) Почему “кажется, что работает” не доказывает корректность многопоточного кода?
58. (L3, D) Как расследовать race condition, которая плохо воспроизводится?
59. (L3, D) Как найти deadlock в pthread-based приложении?
60. (L3, P) Как использовать thread sanitizer для pthread-кода?
61. (L3, T) Почему неправильное владение mutex приводит к скрытым багам?
62. (L3, D) Как отличить contention от настоящего deadlock?
63. (L3, T) Что такое spurious wakeup и как правильно писать цикл ожидания?
64. (L3, D) Почему condition variable без predicate — опасна?
65. (L3, S) Когда использовать pthread API напрямую, а когда std::thread/std::mutex?

## L4

66. (L4, S) Как проектировать многопоточную архитектуру, уменьшающую число shared-state ошибок?
67. (L4, S) Как выбирать между thread-per-request, thread pool, actor/event-loop моделью?
68. (L4, D) Как расследовать latency spikes, вызванные lock contention?
69. (L4, S) Как формализовать policy по mutex ordering и concurrency review?
70. (L4, D) Как строить post-mortem анализ сложных concurrency incidents?

### Race Conditions

## L1

71. (L1, T) Что такое race condition простыми словами?
72. (L1, T) Почему race condition может не проявляться на тестовой машине?
73. (L1, T) Как shared mutable state создает риск race condition?
74. (L1, D) Какие типичные признаки race condition?
75. (L1, D) Почему добавление логов может “чинить” race temporarily?

## L2

76. (L2, D) Как воспроизводить race condition?
77. (L2, D) Почему scheduler влияет на вероятность воспроизведения race?
78. (L2, D) Какие классы race condition бывают в C/C++?
79. (L2, P) Какие минимальные шаги для локализации race bug?
80. (L2, D) Почему use-after-free часто имеет concurrency-корень?

## L3

81. (L3, D) Как доказывать наличие race condition, а не просто подозревать ее?
82. (L3, D) Как отличить race от memory corruption иной природы?
83. (L3, D) Как race condition проявляется через невалидные инварианты?
84. (L3, D) Почему lock-free/low-lock код повышает требования к инженерной дисциплине?
85. (L3, S) Какие design-подходы лучше всего снижают риск race condition?

## L4

86. (L4, S) Как внедрить systematic concurrency testing в команду?
87. (L4, D) Как расследовать race в distributed/IPC-heavy системе?
88. (L4, S) Как выбирать допустимый уровень concurrency complexity в продукте?
89. (L4, S) Как учить команду мыслить через invariants, а не только через mutex'ы?
90. (L4, D) Как документировать и triage'ить concurrency bugs на больших кодовых базах?

---

## 5.2 Работа с системой

### File Descriptors

## L1

91. (L1, T) Что такое file descriptor?
92. (L1, T) Какие стандартные file descriptors есть у процесса?
93. (L1, T) Что возвращает `open()`?
94. (L1, T) Чем file descriptor отличается от `FILE*`?
95. (L1, P) Как открыть файл через системный вызов?
96. (L1, P) Как читать и писать через file descriptor?
97. (L1, T) Что делает `close()`?
98. (L1, D) Что происходит, если забыть закрыть fd?
99. (L1, T) Что такое EOF на уровне `read()`?
100. (L1, D) Почему утечки file descriptors опасны для long-running процессов?

## L2

101. (L2, T) Что такое blocking vs non-blocking I/O?
102. (L2, T) Что делает `fcntl(..., O_NONBLOCK)`?
103. (L2, D) Почему `read()`/`write()` могут вернуть меньше байт, чем ожидалось?
104. (L2, T) Что такое `EINTR`?
105. (L2, D) Почему системный вызов может быть прерван сигналом?
106. (L2, P) Как дублировать fd через `dup`/`dup2`?
107. (L2, P) Как перенаправить stdout процесса в файл?
108. (L2, T) Что такое pipe?
109. (L2, P) Как устроен IPC через pipe на базовом уровне?
110. (L2, D) Как возникают “Too many open files”?

## L3

111. (L3, T) Что такое open file description и чем он отличается от fd?
112. (L3, T) Какие состояния разделяют duplicated descriptors?
113. (L3, D) Почему offset файла “неожиданно общий” между двумя fd?
114. (L3, D) Как расследовать fd leak в production?
115. (L3, P) Как смотреть открытые fd процесса через `/proc`?
116. (L3, D) Почему небезопасное наследование fd ломает дочерние процессы?
117. (L3, T) Что такое socket как file descriptor?
118. (L3, D) Почему non-blocking I/O требует иного стиля обработки ошибок?
119. (L3, P) Как анализировать readiness/event-driven код на fd?
120. (L3, S) Когда выбирать blocking модель, а когда event-driven?

## L4

121. (L4, S) Как проектировать fd lifecycle policy в большом сервисе?
122. (L4, D) Как расследовать деградацию сервиса из-за fd exhaustion?
123. (L4, S) Как формализовать ownership fd в C/C++ коде?
124. (L4, S) Как строить безопасные RAII-обертки над системными ресурсами?
125. (L4, D) Как находить subtle bugs, связанные с переиспользованием fd ядром?

### Signals

## L1

126. (L1, T) Что такое signal в Linux?
127. (L1, T) Какие сигналы чаще всего встречаются в практике C/C++?
128. (L1, T) Чем `SIGINT`, `SIGTERM`, `SIGKILL` отличаются?
129. (L1, T) Какие сигналы обычно означают crash?
130. (L1, P) Как установить signal handler?
131. (L1, D) Почему нельзя просто “делать всё что угодно” внутри signal handler?
132. (L1, T) Что значит asynchronous signal delivery?
133. (L1, D) Почему `SIGKILL` нельзя перехватить?
134. (L1, T) Что обычно делает `SIGCHLD`?
135. (L1, P) Как корректно завершать программу по `SIGTERM`?

## L2

136. (L2, T) Что такое async-signal-safe functions?
137. (L2, D) Почему `printf`, `malloc`, mutex'ы и большинство C++ API опасны в signal handler?
138. (L2, D) Как безопасно передавать факт получения сигнала в main loop?
139. (L2, T) Что такое signal mask?
140. (L2, P) Как блокировать/разблокировать сигналы в потоке?
141. (L2, T) Как сигналы взаимодействуют с многопоточностью?
142. (L2, D) Почему сигнал пришел “не в тот поток”?
143. (L2, T) Что такое `sigaction` и почему он лучше старого `signal()`?
144. (L2, D) Как сигналы влияют на системные вызовы и I/O?
145. (L2, P) Как построить graceful shutdown через signals?

## L3

146. (L3, D) Как расследовать нестабильные баги, вызванные сигналами?
147. (L3, T) Что такое self-pipe trick и зачем он нужен?
148. (L3, T) Как `signalfd` упрощает event-driven обработку сигналов?
149. (L3, D) Почему обработка сигналов и потоки вместе часто приводят к сложным ошибкам?
150. (L3, D) Как отличить crash по `SIGSEGV` из-за кода от crash из-за внешнего воздействия?
151. (L3, S) Когда лучше обрабатывать signals централизованно в одном потоке?
152. (L3, D) Почему fork/exec + signals требуют особой аккуратности?
153. (L3, P) Как интегрировать signals в epoll/event-loop архитектуру?
154. (L3, D) Как диагностировать lost/repeated signal handling bugs?
155. (L3, S) Как проектировать signal-safe shutdown path?

## L4

156. (L4, S) Как проектировать signal policy для production daemon/service?
157. (L4, D) Как расследовать аварийное завершение, где signals — только симптом?
158. (L4, S) Как обучать команду безопасной работе с signal handlers?
159. (L4, D) Как формализовать требования к shutdown/reload semantics через сигналы?
160. (L4, S) Как сочетать signals, supervision и observability в Linux runtime?

### epoll / select

## L1

161. (L1, T) Что такое multiplexed I/O?
162. (L1, T) Зачем нужен `select()`?
163. (L1, T) Какие ограничения у `select()`?
164. (L1, T) Что делает `epoll`?
165. (L1, T) Почему `epoll` часто предпочтительнее `select()` на Linux?
166. (L1, T) Что значит readiness-based I/O?
167. (L1, P) Как на базовом уровне ждать готовности fd к чтению?
168. (L1, D) Почему blocking I/O плохо масштабируется на множество соединений?
169. (L1, T) Чем polling отличается от event-driven подхода?
170. (L1, D) Почему event loop сложнее, но масштабируемее?

## L2

171. (L2, T) Что такое level-triggered и edge-triggered режимы в epoll?
172. (L2, D) Почему edge-triggered режим часто вызывает ошибки у новичков?
173. (L2, P) Как правильно читать из non-blocking socket в event loop?
174. (L2, D) Почему нельзя предполагать, что один event = все данные прочитаны?
175. (L2, D) Как `EAGAIN` связан с epoll/non-blocking I/O?
176. (L2, P) Как добавить, изменить и удалить fd из epoll interest list?
177. (L2, D) Почему event loop может “крутиться” и жечь CPU?
178. (L2, T) Что такое thundering herd problem?
179. (L2, D) Как ошибки lifecycle fd ломают epoll-based код?
180. (L2, S) Когда `select/poll/epoll` достаточно, а когда нужна более высокая абстракция?

## L3

181. (L3, D) Как расследовать lost wakeup / missed event в epoll-системе?
182. (L3, D) Почему readiness не равна progress в I/O?
183. (L3, T) Как epoll ведет себя при закрытии fd в другом потоке?
184. (L3, D) Почему fd reuse может приводить к трудноуловимым epoll bug'ам?
185. (L3, D) Как проектировать backpressure в event-driven сервере?
186. (L3, T) Что такое reactor pattern и как он связан с epoll?
187. (L3, D) Как отличить bottleneck event-loop'а от bottleneck бизнес-логики?
188. (L3, P) Как интегрировать timerfd/eventfd/signalfd в epoll loop?
189. (L3, D) Как расследовать latency spikes в epoll-based сервере?
190. (L3, S) Когда стоит делить I/O loop и worker pool?

## L4

191. (L4, S) Как проектировать high-load event-driven runtime на Linux?
192. (L4, S) Как выбирать между thread-per-connection, pool и epoll/reactor?
193. (L4, D) Как расследовать масштабируемость event-loop архитектуры на production?
194. (L4, S) Как обеспечить корректность fd/event lifecycle при сложной архитектуре?
195. (L4, S) Как строить performance/debugging playbook для epoll-based сервисов?

---

## 5.3 Dynamic Loading

### dlopen / dlsym

## L1

196. (L1, T) Что такое dynamic loading?
197. (L1, T) Что делает `dlopen()`?
198. (L1, T) Что делает `dlsym()`?
199. (L1, T) Что такое plugin на базовом уровне?
200. (L1, P) Как загрузить `.so` во время выполнения?

## L2

201. (L2, T) Что означают `RTLD_LAZY` и `RTLD_NOW`?
202. (L2, T) Что такое `RTLD_LOCAL` и `RTLD_GLOBAL`?
203. (L2, D) Почему `dlopen()` может не найти библиотеку?
204. (L2, D) Почему `dlsym()` возвращает `NULL`?
205. (L2, P) Как корректно объявлять API плагина для загрузки через `dlsym()`?
206. (L2, T) Почему `extern "C"` часто нужен для plugin entry points?
207. (L2, D) Как проверить `dlerror()` и почему это важно?
208. (L2, T) Что происходит с зависимостями загружаемой `.so`?
209. (L2, D) Почему plugin может загрузиться, но упасть при первом вызове функции?
210. (L2, P) Как выгрузить библиотеку через `dlclose()`?

## L3

211. (L3, T) Как symbol visibility влияет на dynamic loading?
212. (L3, D) Почему возникают конфликты символов между host и plugin?
213. (L3, D) Как ABI mismatch проявляется при dynamic loading?
214. (L3, T) Почему C++ классы через границу plugin ABI — рискованная идея?
215. (L3, S) Как проектировать stable C-compatible plugin ABI?
216. (L3, D) Почему `dlclose()` может быть опасен в многопоточном приложении?
217. (L3, D) Как расследовать crash в plugin после reload/unload?
218. (L3, P) Как анализировать экспортируемые символы plugin `.so`?
219. (L3, D) Как versioning plugin API помогает избежать runtime crash?
220. (L3, S) Когда dynamic loading оправдан архитектурно, а когда это overengineering?

## L4

221. (L4, S) Как проектировать plugin platform для большого C/C++ продукта?
222. (L4, S) Как организовать compatibility policy между host и plugins?
223. (L4, D) Как расследовать production incidents, вызванные сторонним plugin'ом?
224. (L4, S) Как безопасно реализовать plugin isolation и rollback?
225. (L4, S) Как сочетать dynamic loading, observability и crash forensics?

### Plugin Architectures

## L1

226. (L1, T) Что такое plugin architecture?
227. (L1, T) Какие преимущества дает plugin model?
228. (L1, T) Какие риски в plugin-based дизайне?
229. (L1, P) Как на базовом уровне host узнает, какие функции предоставляет plugin?
230. (L1, D) Почему plugin system усложняет поддержку?

## L2

231. (L2, T) Как versioning API/ABI влияет на plugin system?
232. (L2, D) Почему plugin, собранный другим компилятором, может сломаться?
233. (L2, T) Как отделить extension points от внутренней реализации host'а?
234. (L2, S) Как сделать plugin contract минимальным, но достаточным?
235. (L2, D) Почему shared ownership объектов между host и plugin опасен?

## L3

236. (L3, S) Как проектировать plugin lifecycle: load/init/run/stop/unload?
237. (L3, D) Как расследовать memory/resource leaks в plugin architecture?
238. (L3, S) Как обеспечить диагностируемость ошибок plugin'ов?
239. (L3, D) Как sandbox/isolation влияют на debugging plugin'ов?
240. (L3, S) Когда нужен отдельный process boundary вместо in-process plugins?

## L4

241. (L4, S) Как выбирать между in-process plugins, IPC modules и microservice-style extensions?
242. (L4, S) Как формализовать compatibility matrix для plugins?
243. (L4, D) Как triage'ить инциденты, когда host стабилен, а плагины разные и сторонние?
244. (L4, S) Как проектировать upgrade path для plugin ecosystem без массовых поломок?
245. (L4, S) Как удержать plugin architecture от деградации в “неуправляемую платформу”?

---

# 10. Practical / Real-world Scenarios

## L2

246. (L2, D) После `fork()` дочерний процесс неожиданно наследует сетевой сокет и не дает серверу корректно завершиться. Что проверять?
247. (L2, D) Многопоточное приложение иногда зависает на shutdown. Какие первые гипотезы?
248. (L2, D) Сервис перестает принимать новые соединения после нескольких дней работы. Какие system-level причины проверишь?
249. (L2, D) `epoll`-loop грузит CPU на 100%, но полезной работы почти нет. Какие типовые причины?
250. (L2, D) Plugin загружается успешно, но падает при первом вызове API. Какие вероятные корни проблемы?

## L3

251. (L3, D) После рефакторинга часть запросов “теряется” в event loop. Как строить расследование?
252. (L3, D) В логах есть `Too many open files`, но локально воспроизвести не удается. Как собирать доказательства?
253. (L3, D) Child process иногда зависает сразу после `fork()` и до `exec()`. Почему это особенно подозрительно в multithreaded приложении?
254. (L3, D) После hot reload plugin'а сервис нестабилен. Какие классы ошибок ищешь в первую очередь?
255. (L3, D) Производительность резко падает при увеличении числа потоков. Как отличить scheduler/lock contention/fd event issues?

## L4

256. (L4, S) Как спроектировать runtime architecture Linux-сервиса: процессы, потоки, сигналы, event loop, plugins?
257. (L4, S) Какие invariants и ownership rules обязательно документировать в system-level C/C++ коде?
258. (L4, S) Как уменьшить число production incidents, связанных с fd lifecycle, signals и concurrency?
259. (L4, S) Как стандартизировать подход к graceful shutdown, crash handling и resource cleanup?
260. (L4, S) Как выстроить инженерную культуру, где runtime/system-level ошибки расследуются доказательно, а не “по ощущениям”?

---
