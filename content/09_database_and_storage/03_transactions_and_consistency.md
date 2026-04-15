# 🧮 3. Транзакции и консистентность — Вопросы

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

---

## 🔹 ACID

---

### L1

**[T]**

1. Что такое транзакция и зачем она нужна?
2. Что означает Atomicity?
3. Что означает Consistency в ACID?
4. Что означает Isolation?
5. Что означает Durability?
6. Чем транзакция отличается от набора независимых операций?
7. Почему ACID важен для OLTP систем?
8. Какие свойства ACID чаще всего конфликтуют с производительностью?
9. Что происходит, если система падает между двумя операциями одной транзакции?
10. Почему durability почти всегда требует участия диска или устойчивого журнала?

**[P]**
11. Реализовать простую транзакцию “begin/commit/rollback” для in-memory KV store
12. Реализовать журнал undo для отката операций
13. Реализовать журнал redo для восстановления после падения
14. Сделать атомарный перевод денег между двумя аккаунтами
15. Смоделировать сбой процесса между update и commit
16. Реализовать commit marker в WAL
17. Реализовать idempotent recovery после crash
18. Реализовать транзакционный batch update на C++
19. Реализовать минимальный transaction manager
20. Смоделировать partial failure и восстановление из журнала

---

### L2

**[T]**
21. В чем разница между undo logging и redo logging?
22. Почему WAL должен быть записан до dirty page?
23. Что такое force vs no-force policy?
24. Что такое steal vs no-steal policy?
25. Как связаны buffer pool и durability?
26. Что означает commit в терминах storage engine?
27. Почему fsync может быть дорогим?
28. Что такое group commit?
29. Какие trade-offs между latency и durability?
30. Что значит “consistency” в ACID и чем она отличается от application invariants?

**[P]**
31. Реализовать WAL с LSN
32. Реализовать group commit
33. Реализовать crash recovery по redo log
34. Реализовать dirty page table
35. Реализовать checkpoint
36. Реализовать transaction table
37. Написать небольшой recovery manager
38. Реализовать commit batching через отдельный flush thread
39. Реализовать защиту от torn writes
40. Добавить configurable durability mode: always fsync / periodic fsync

**[D]**
41. Почему после перезапуска часть committed данных пропала?
42. Почему rollback оставил систему в неконсистентном состоянии?
43. Почему fsync latency резко вырос?
44. Почему throughput падает при росте числа commit?
45. Почему recovery занимает слишком много времени?
46. Почему checkpoint не уменьшает recovery time?
47. Почему WAL стал больше ожидаемого?
48. Почему при высокой нагрузке commit latency становится “пилообразным”?
49. Почему данные на реплике есть, а после crash на primary их нет?
50. Почему transaction log стал главным bottleneck?

---

### L3

**[T]**
51. Как устроен ARIES на высоком уровне?
52. Что такое physiological logging?
53. Что такое log sequence number и как он связан со страницами?
54. Почему pageLSN нужен для recovery?
55. Как работают analysis / redo / undo phases?
56. Как реализуется atomic commit при конкуренции потоков?
57. Как сочетаются WAL, buffer pool и background flushers?
58. Что такое fuzzy checkpoint?
59. Как устроен group commit в production СУБД?
60. Как обеспечить durability на SSD/NVMe с учётом reorder/write cache?

**[P]**
61. Реализовать упрощённый ARIES-style recovery
62. Реализовать pageLSN и проверку при recovery
63. Реализовать background page flusher
64. Реализовать durable commit queue
65. Реализовать recovery с undo chain
66. Реализовать rollback to savepoint
67. Реализовать nested transaction abstraction
68. Написать crash-consistency тесты с kill -9
69. Реализовать fault injection для transaction manager
70. Реализовать persist barrier abstraction под Linux

**[D]**
71. Как диагностировать, что lost commit вызван не БД, а файловой системой/диском?
72. Как отличить логическую неконсистентность от нарушения recovery protocol?
73. Почему page cache Linux может маскировать проблемы durability?
74. Почему ext4/xfs mount options могут менять поведение durability?
75. Как проверить, что WAL flush действительно завершён до ack клиенту?
76. Почему sync_file_range не заменяет fsync для durability?
77. Почему на виртуализованной среде durability хуже ожидаемой?
78. Как расследовать повреждение WAL после abrupt power loss?
79. Почему group commit может ухудшить p99 latency?
80. Как доказать корректность recovery algorithm на crash-инъекциях?

---

### L4

**[S]**
81. Как выбирать durability guarantees для разных классов данных?
82. Когда допустимо ослаблять durability ради latency?
83. Как проектировать transaction subsystem для embedded DB на C++?
84. Как строить crash-safe storage engine поверх Linux filesystem?
85. Когда нужен свой WAL format, а когда достаточно append-only log?
86. Как проектировать recovery так, чтобы startup не занимал десятки минут?
87. Как разделить fast path commit и background maintenance?
88. Как строить transaction layer для distributed database?
89. Как выбрать между synchronous replication и local durability?
90. Как формулировать SLA для consistency/durability на уровне продукта?

---

## 🔹 Isolation Levels

---

### L1

**[T]**
91. Что такое уровень изоляции?
92. Что такое dirty read?
93. Что такое non-repeatable read?
94. Что такое phantom read?
95. Что такое lost update?
96. Чем read committed отличается от repeatable read?
97. Чем repeatable read отличается от serializable?
98. Почему более сильная изоляция обычно дороже?
99. Почему read uncommitted почти не используется в серьёзных OLTP системах?
100. Что именно гарантирует serializable?

**[P]**
101. Смоделировать dirty read на двух потоках
102. Смоделировать non-repeatable read
103. Смоделировать phantom read
104. Смоделировать lost update
105. Реализовать простейший scheduler для двух транзакций
106. Реализовать read committed через блокировки
107. Реализовать repeatable read через удержание read locks
108. Реализовать serializable через строгий 2PL
109. Написать multi-threaded test на аномалии изоляции
110. Построить маленький history checker для read/write операций

---

### L2

**[T]**
111. Какие аномалии разрешены на read committed?
112. Почему repeatable read не всегда эквивалентен serializable?
113. Что такое write skew?
114. Почему phantom read часто связан не со строками, а с предикатами?
115. Как индексы влияют на реализацию уровней изоляции?
116. Что такое predicate locking?
117. Что такое strict 2PL?
118. Что такое snapshot isolation?
119. Почему snapshot isolation допускает некоторые аномалии?
120. Как read-only транзакции могут влиять на систему?

**[P]**
121. Реализовать strict 2PL
122. Реализовать range lock для предикатов
123. Реализовать snapshot isolation поверх versioned rows
124. Реализовать conflict detector для lost update
125. Реализовать serial schedule checker
126. Написать генератор interleaving сценариев
127. Реализовать lock upgrade
128. Реализовать intent locks
129. Реализовать serializable validation phase
130. Построить тесты для write skew

**[D]**
131. Почему приложение жалуется на “странные” данные при read committed?
132. Почему under repeatable read всё ещё возможна бизнес-неконсистентность?
133. Почему serializable резко просаживает throughput?
134. Почему read-only аналитический запрос ломает latency OLTP?
135. Почему long transaction удерживает старые версии слишком долго?
136. Как диагностировать phantom-и на production workload?
137. Почему аномалия воспроизводится только под нагрузкой?
138. Почему lock escalation неожиданно меняет поведение?
139. Почему SELECT ... FOR UPDATE не решил lost update?
140. Как доказать, что проблема именно в уровне изоляции, а не в баге приложения?

---

### L3

**[T]**
141. Как формально описываются аномалии через histories/conflict graphs?
142. Что такое serializability graph testing?
143. Что такое optimistic concurrency control в контексте isolation?
144. Чем certifier-based serializability отличается от locking-based?
145. Как реализуется SSI (Serializable Snapshot Isolation)?
146. Чем snapshot isolation отличается от repeatable read в популярных СУБД?
147. Что такое predicate conflict и почему его сложно ловить?
148. Как реализуются range locks в B-Tree?
149. Как long-running readers влияют на concurrency control?
150. Как isolation связан с replication consistency?

**[P]**
151. Реализовать precedence graph builder
152. Реализовать cycle detection для histories
153. Реализовать optimistic validation на commit
154. Реализовать SSI-style rw-conflict tracking
155. Реализовать key-range locking в индексе
156. Реализовать lock compatibility matrix
157. Реализовать starvation-free lock scheduler
158. Написать fuzzing для concurrency anomalies
159. Реализовать deterministic transaction scheduler
160. Реализовать trace logger interleavings для расследования race conditions

**[D]**
161. Как расследовать редкую аномалию write skew в production?
162. Почему serializable abort rate резко вырос после изменения workload?
163. Почему key-range locks взорвали contention?
164. Как найти точный interleaving, приводящий к неконсистентности?
165. Почему одна и та же логика работает в PostgreSQL и ломается в MySQL/InnoDB?
166. Как отделить проблему snapshot staleness от настоящей аномалии serializability?
167. Почему горячие диапазоны индекса приводят к лавине abort/retry?
168. Почему retry loop на serializable сам стал причиной деградации?
169. Как собирать минимальный воспроизводимый сценарий аномалии?
170. Как проверить реализацию уровня изоляции property-based тестированием?

---

### L4

**[S]**
171. Какой уровень изоляции выбирать по умолчанию для OLTP продукта?
172. Когда оправдан serializable, а когда достаточно read committed?
173. Как проектировать API так, чтобы разработчики не делали опасных read-modify-write?
174. Как балансировать correctness и throughput?
175. Как проектировать mixed workload с короткими и длинными транзакциями?
176. Как закладывать retry semantics в клиентский SDK?
177. Как документировать isolation guarantees для внутренних платформ?
178. Когда переходить от pessimistic locking к optimistic schemes?
179. Как проектировать serializable layer в распределённой системе?
180. Как обучать команды отличать DB consistency от business consistency?

---

## 🔹 MVCC

---

### L1

**[T]**
181. Что такое MVCC?
182. Зачем нужна многоверсионность?
183. Как MVCC помогает читателям не блокировать писателей?
184. Что такое snapshot в MVCC?
185. Что такое version chain?
186. Почему MVCC не отменяет необходимость cleanup/garbage collection?
187. Что хранится в версии записи?
188. Как reader выбирает видимую версию?
189. Почему MVCC полезен для read-heavy workload?
190. Чем MVCC отличается от locking-only подхода?

**[P]**
191. Реализовать versioned row
192. Реализовать begin timestamp / commit timestamp
193. Реализовать snapshot read
194. Реализовать append новой версии при update
195. Реализовать delete как tombstone version
196. Реализовать traversal version chain
197. Реализовать in-memory MVCC KV store
198. Реализовать visibility check
199. Реализовать rollback незакоммиченной версии
200. Реализовать простой vacuum старых версий

---

### L2

**[T]**
201. Что такое xmin/xmax-подобные поля?
202. Как MVCC связан с undo log?
203. Как MVCC связан с append-only storage?
204. Что такое vacuum / garbage collection версий?
205. Почему long-running transactions мешают cleanup?
206. Что такое snapshot too old?
207. Как MVCC влияет на usage памяти и диска?
208. Почему point lookup может замедляться из-за длинной version chain?
209. Как secondary indexes работают с MVCC?
210. Почему MVCC не решает все write conflicts?

**[P]**
211. Реализовать global transaction ID allocator
212. Реализовать active transaction table
213. Реализовать vacuum, учитывающий oldest active snapshot
214. Реализовать secondary index с указателем на version chain head
215. Реализовать undo-based MVCC
216. Реализовать append-only MVCC
217. Реализовать snapshot pinning
218. Реализовать visibility map
219. Реализовать pruning коротких version chains
220. Написать benchmark на read/write mix

**[D]**
221. Почему размер таблицы растёт без роста “живых” данных?
222. Почему SELECT стал медленнее после серии update?
223. Почему vacuum не успевает?
224. Почему disk bloat растёт из-за long-lived transaction?
225. Почему старые snapshot-читатели тормозят всю систему?
226. Почему secondary index указывает на “мертвые” версии?
227. Почему p99 latency скачет при cleanup?
228. Почему after-delete место не освобождается сразу?
229. Как найти запрос, который держит oldest snapshot?
230. Почему chain traversal стал CPU bottleneck?

---

### L3

**[T]**
231. Какие есть варианты реализации MVCC: undo-based, append-only, tuple-versioned?
232. Как MVCC сочетается с B-Tree/LSM?
233. Как реализуется visibility check без слишком большого overhead?
234. Как проектировать commit timestamps в многопоточной системе?
235. Что такое epoch-based reclamation в контексте MVCC?
236. Как MVCC влияет на replication и recovery?
237. Почему vacuum — это не просто delete old rows?
238. Как работает HOT update-подобная оптимизация?
239. Как оптимизировать версионность под cache locality?
240. Как snapshot isolation строится поверх MVCC?

**[P]**
241. Реализовать epoch-based GC для версий
242. Реализовать background vacuum worker
243. Реализовать per-page pruning
244. Реализовать optimization для update без изменения indexed columns
245. Реализовать immutable snapshot descriptor
246. Реализовать fast-path visibility cache
247. Реализовать version chain compaction
248. Реализовать hybrid MVCC + locking
249. Реализовать recovery для MVCC storage
250. Реализовать тесты на корректность видимости при concurrency

**[D]**
251. Как расследовать memory blow-up из-за MVCC?
252. Почему freeze/vacuum фаза приводит к latency spikes?
253. Почему version cleanup создаёт write amplification?
254. Как доказать, что bottleneck в visibility checks, а не в I/O?
255. Почему NUMA ухудшает производительность MVCC engine?
256. Почему горячие строки деградируют сильнее, чем холодные?
257. Как отладить race condition между vacuum и reader?
258. Почему snapshot creation стала дорогой операцией?
259. Как диагностировать contention на global transaction ID?
260. Почему cache line bouncing разрушает throughput version manager?

---

### L4

**[S]**
261. Когда MVCC — правильный выбор, а когда нет?
262. Какой вариант MVCC выбрать для in-memory DB?
263. Как проектировать cleanup так, чтобы он не убивал p99?
264. Как балансировать storage bloat и read concurrency?
265. Как сочетать MVCC с distributed transactions?
266. Как выбирать GC/vacuum стратегию под разные workload?
267. Как проектировать MVCC для time-travel queries?
268. Как строить observability для version churn?
269. Как объяснять ограничения MVCC продуктовым командам?
270. Когда стоит перейти с MVCC на другой concurrency model?

---

## 🔹 Locks (row/table, intent, range)

---

### L1

**[T]**
271. Что такое lock в СУБД?
272. Зачем нужны shared и exclusive locks?
273. Чем row lock отличается от table lock?
274. Почему coarse-grained lock проще, но хуже по concurrency?
275. Что такое lock compatibility?
276. Что такое lock wait?
277. Что такое lock timeout?
278. Что такое intent lock?
279. Что такое lock escalation?
280. Почему блокировки сами по себе не гарантируют хорошую производительность?

**[P]**
281. Реализовать mutex-based row lock manager
282. Реализовать shared/exclusive lock
283. Реализовать очередь ожидания lock request
284. Реализовать table lock manager
285. Реализовать intent locks
286. Реализовать upgrade S→X
287. Реализовать timeout на ожидание блокировки
288. Реализовать try_lock для транзакций
289. Реализовать release всех locks при commit/rollback
290. Написать stress test на lock contention

---

### L2

**[T]**
291. Как работает strict 2PL?
292. Почему lock upgrade опасен?
293. Когда возникает convoying?
294. Что такое latch и чем он отличается от lock?
295. Почему page latches нужны даже при MVCC?
296. Что такое key-range lock?
297. Что такое next-key lock?
298. Чем logical locks отличаются от physical latches?
299. Как работает lock hierarchy?
300. Какие trade-offs между row, page и table locking?

**[P]**
301. Реализовать strict 2PL scheduler
302. Реализовать lock compatibility matrix
303. Реализовать page latch для B-Tree
304. Реализовать lock escalation threshold
305. Реализовать key-range locking
306. Реализовать deadlock-safe lock upgrade
307. Реализовать partitioned lock table
308. Реализовать intent hierarchy: table/page/row
309. Реализовать fair lock scheduler
310. Реализовать lock statistics counters

**[D]**
311. Почему throughput падает при росте числа потоков?
312. Почему возникает lock convoy?
313. Почему table lock появился “неожиданно”?
314. Почему hot row убивает всю систему?
315. Почему lock table потребляет слишком много памяти?
316. Почему latch contention выше lock contention?
317. Почему B-Tree split приводит к всплеску блокировок?
318. Почему upgrade lock приводит к зависаниям?
319. Как найти самый конфликтный объект в системе?
320. Как понять, что проблема в lock granularity?

---

### L3

**[T]**
321. Как устроен lock manager внутри СУБД?
322. Как проектировать lock table под миллионы lock entries?
323. Как хеширование объектов влияет на contention в lock manager?
324. Что такое lock partitioning/sharding?
325. Как избежать глобального mutex в lock subsystem?
326. Как сочетаются latches, locks и MVCC?
327. Что такое optimistic locking на уровне строк?
328. Как range locks реализуются поверх индекса?
329. Почему readers-writer lock не всегда хорош для БД?
330. Как starvation и fairness влияют на latency profile?

**[P]**
331. Реализовать sharded lock manager
332. Реализовать lock-free wait queue metadata
333. Реализовать intrusive lock request list
334. Реализовать B-Tree latch coupling
335. Реализовать optimistic read + validation
336. Реализовать partition-local lock statistics
337. Реализовать wait-for graph hooks в lock manager
338. Реализовать adaptive spinning before sleep
339. Реализовать NUMA-aware lock table
340. Реализовать lock instrumentation для perf tracing

**[D]**
341. Как расследовать contention в lock manager через perf/futex traces?
342. Почему spinlock лучше на 4 ядрах и хуже на 64?
343. Почему false sharing внутри lock table убивает throughput?
344. Как доказать, что bottleneck в lock hash bucket?
345. Почему futex wake storms портят p99?
346. Как отличить проблему logical lock от latch contention в индексе?
347. Почему fair scheduling снизил throughput?
348. Как диагностировать starvation на горячих ключах?
349. Почему memory allocator стал bottleneck для lock requests?
350. Как отладить race при release/wakeup в lock manager?

---

### L4

**[S]**
351. Как выбирать granularity блокировок для нового storage engine?
352. Когда стоит предпочесть MVCC + short latches вместо long locks?
353. Как проектировать lock subsystem для highly contended workload?
354. Когда оправдан optimistic concurrency control?
355. Как строить observability для lock wait и contention?
356. Как выбирать между fairness и throughput?
357. Как спроектировать locking strategy для B-Tree/LSM engine?
358. Как бороться с hot keys на архитектурном уровне?
359. Когда полезна partitioning/sharding lock table?
360. Как документировать lock semantics для application engineers?

---

## 🔹 Deadlocks

---

### L1

**[T]**
361. Что такое deadlock?
362. Чем deadlock отличается от обычного lock wait?
363. Какие 4 условия делают deadlock возможным?
364. Как выглядит классический deadlock между двумя транзакциями?
365. Почему deadlock нельзя “починить” только timeout-ами?
366. Что такое victim transaction?
367. Что происходит после обнаружения deadlock?
368. Почему rollback одной транзакции обычно снимает deadlock?
369. Что такое livelock и чем он отличается от deadlock?
370. Почему deterministic order locking уменьшает риск deadlock?

**[P]**
371. Смоделировать deadlock на двух mutex/rows
372. Реализовать wait-for graph
373. Реализовать cycle detection
374. Реализовать выбор victim transaction
375. Реализовать abort и повторный запуск транзакции
376. Смоделировать deadlock при lock upgrade
377. Реализовать timeout-based detection
378. Написать unit test на deadlock reproduction
379. Реализовать логирование цепочки ожидания
380. Реализовать deadlock detector thread

---

### L2

**[T]**
381. Какие стратегии есть: detection, prevention, avoidance?
382. Что такое wait-die?
383. Что такое wound-wait?
384. Как timestamps помогают предотвращать deadlock?
385. Почему deadlock detection имеет overhead?
386. Как часто нужно запускать detector?
387. Что такое distributed deadlock?
388. Почему range locks увеличивают вероятность deadlock?
389. Почему lock upgrade особенно опасен?
390. Как retry логика после deadlock влияет на нагрузку?

**[P]**
391. Реализовать wait-die
392. Реализовать wound-wait
393. Реализовать timestamp ordering для lock requests
394. Реализовать distributed-style edge export для wait-for graph
395. Реализовать backoff после deadlock retry
396. Реализовать adaptive detector interval
397. Реализовать deadlock-safe lock ordering helper API
398. Реализовать detector с инкрементальным обновлением графа
399. Написать workload generator для разных типов deadlock
400. Реализовать статистику deadlock frequency по объектам

**[D]**
401. Почему deadlock rate вырос после релиза?
402. Почему приложение стало бесконечно ретраить транзакции?
403. Почему timeout-ы маскируют настоящую проблему?
404. Как понять, что это deadlock, а не starvation?
405. Почему deadlock возникает только на production данных?
406. Как найти SQL/операции, образующие цикл?
407. Почему добавление индекса изменило deadlock pattern?
408. Почему batch updates резко увеличили число deadlock?
409. Как расследовать deadlock в mixed OLTP/maintenance workload?
410. Почему victim selection ухудшает throughput?

---

### L3

**[T]**
411. Как проектируется deadlock detector в high-throughput СУБД?
412. Как минимизировать overhead от wait-for graph?
413. Как строить edges без глобального lock?
414. Как deadlock detector взаимодействует с lock manager?
415. Чем distributed deadlock detection сложнее локального?
416. Почему false positives/negatives опасны?
417. Как связаны deadlock, lock escalation и range locking?
418. Как проектировать abort-safe cleanup?
419. Как rollback cost влияет на victim selection?
420. Как observability помогает расследовать deadlocks?

**[P]**
421. Реализовать инкрементальный wait-for graph с шардированием
422. Реализовать victim selection по cost heuristic
423. Реализовать detector без полного сканирования графа
424. Реализовать deadlock event trace для postmortem
425. Реализовать per-transaction dependency tracking
426. Реализовать rollback-aware victim policy
427. Реализовать graph snapshot для отладки
428. Реализовать integration tests с forced interleavings
429. Реализовать fault injection для deadlock windows
430. Реализовать дедупликацию repeated deadlock reports

**[D]**
431. Как расследовать редкий deadlock, который случается раз в неделю?
432. Почему detector сам стал bottleneck?
433. Как отличить локальный deadlock от распределённого?
434. Почему deadlock исчезает под debugger/trace?
435. Как восстановить цикл ожидания из логов и tracepoints?
436. Почему изменение порядка обхода индекса изменило deadlock rate?
437. Как доказать, что причина в lock upgrade path?
438. Почему retry storm после deadlock положил сервис?
439. Как оценить, выгоднее prevention или detection на данном workload?
440. Как построить tooling для автоматического анализа deadlock dumps?

---

### L4

**[S]**
441. Какую стратегию борьбы с deadlock выбрать для новой СУБД?
442. Когда лучше prevention, а когда detection?
443. Как проектировать application API, уменьшающий вероятность deadlock?
444. Как стандартизировать порядок доступа к ресурсам в большой кодовой базе?
445. Как проектировать retry policy после deadlock без retry storm?
446. Как экспонировать deadlock метрики и алерты?
447. Как обучать команды писать transaction-safe бизнес-логику?
448. Как менять схему/индексы, не ухудшая deadlock profile?
449. Как строить resilience для workloads с высоким конфликтом?
450. Как включать deadlock analysis в регулярный performance review storage engine?

---

## 🔹 Смешанные cross-topic вопросы

### L2–L3

**[T]**
451. Чем MVCC + read committed отличается от strict 2PL + read committed по свойствам и perf?
452. Почему serializable на MVCC и serializable на 2PL дают разный runtime profile?
453. Как WAL, locks и buffer pool взаимодействуют в commit path?
454. Почему long transaction одновременно портит и MVCC cleanup, и lock contention?
455. Как replication влияет на perceived consistency у клиентов?
456. Чем логическая консистентность приложения отличается от serializability СУБД?
457. Почему idempotency важна при retry после deadlock или serialization failure?
458. Как checkpoint влияет на transaction throughput?
459. Почему hot key вызывает и lock contention, и version churn?
460. Почему isolation bugs трудно ловятся обычными unit-тестами?

**[P]**
461. Реализовать mini-DB: WAL + locks + MVCC + recovery
462. Реализовать serialization failure и retry policy в клиенте
463. Реализовать метрики: lock_wait_ms, deadlocks, oldest_snapshot_age
464. Реализовать chaos-тесты: crash во время commit, rollback, flush
465. Реализовать deterministic scheduler для воспроизведения race conditions
466. Написать benchmark: read-heavy / write-heavy / contended hot rows
467. Реализовать trace timeline транзакций для postmortem
468. Реализовать property-based тесты на отсутствие dirty read/lost update
469. Реализовать мониторинг vacuum lag
470. Реализовать fault injection в lock manager и WAL flush path

**[D]**
471. Почему после включения serializable correctness выросла, а SLA сломался?
472. Почему после оптимизации WAL неожиданно вырос deadlock rate?
473. Почему после добавления индекса выросло число serialization failures?
474. Как расследовать периодические latency spikes каждые N секунд?
475. Почему p50 хороший, а p99 ужасный на конкурентной нагрузке?
476. Как понять, bottleneck в I/O, lock manager, vacuum или scheduler Linux?
477. Почему retry механизм клиента усугубил деградацию БД?
478. Как найти одну “плохую” транзакцию среди миллионов?
479. Почему maintenance job ломает OLTP consistency/latency profile?
480. Как строить postmortem по инциденту “данные не потерялись, но поведение было неконсистентным”?

---
