# 🧵 10. Конкурентность

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

## 🔹 Locks vs MVCC

1. (L1 [T]) Что такое pessimistic locking?

2. (L1 [T]) Что такое MVCC?

3. (L1 [T]) В чём базовая разница между lock-based concurrency control и MVCC?

4. (L1 [T]) Почему MVCC обычно лучше для read-heavy workload?

5. (L1 [T]) Почему locks проще объяснить, но сложнее масштабировать?

6. (L1 [T]) Почему readers и writers конфликтуют в lock-based схеме?

7. (L1 [T]) Почему readers в MVCC часто не блокируют writers?

8. (L1 [T]) Что такое shared lock и exclusive lock?

9. (L1 [T]) Почему MVCC не отменяет необходимость блокировок полностью?

10. (L1 [T]) Что такое snapshot read?

11. (L1 [P]) Реализовать row-level shared/exclusive lock manager

12. (L1 [P]) Реализовать простейшую MVCC-модель с versioned rows

13. (L1 [P]) Реализовать snapshot read для одной таблицы

14. (L1 [P]) Реализовать update через append новой версии строки

15. (L1 [P]) Реализовать тест: reader-writer contention в lock-based и MVCC вариантах

16. (L2 [T]) Почему MVCC обычно требует garbage collection/vacuum?

17. (L2 [T]) Почему lock-based схема может страдать от convoying?

18. (L2 [T]) Почему MVCC может страдать от version chain traversal?

19. (L2 [T]) Что такое optimistic vs pessimistic concurrency?

20. (L2 [T]) Почему hot rows остаются проблемой и для MVCC, и для locking?

21. (L2 [T]) Что такое lock escalation и почему MVCC не имеет прямого аналога?

22. (L2 [T]) Как MVCC влияет на usage памяти и диска?

23. (L2 [T]) Почему long-running transactions особенно болезненны для MVCC?

24. (L2 [T]) Почему locks могут давать более предсказуемую semantics, чем snapshot-based reads?

25. (L2 [T]) Почему MVCC и locks часто комбинируются в одной СУБД?

26. (L2 [P]) Реализовать hybrid scheme: MVCC for reads + X-lock for writes

27. (L2 [P]) Реализовать active transaction table для MVCC

28. (L2 [P]) Реализовать vacuum старых версий

29. (L2 [P]) Реализовать lock wait queue

30. (L2 [P]) Реализовать benchmark read-heavy vs write-heavy under locks and MVCC

31. (L2 [D]) Почему MVCC engine использует много памяти даже при малом объёме живых данных?

32. (L2 [D]) Почему lock-based engine резко деградирует при росте числа потоков?

33. (L2 [D]) Почему latency на MVCC сильно растёт после длинной транзакции?

34. (L2 [D]) Почему lock waits почти нет, но throughput всё равно плохой?

35. (L2 [D]) Почему “переключение на MVCC” не решило проблему hot keys?

36. (L3 [T]) Как MVCC и locks сочетаются на уровне storage engine?

37. (L3 [T]) Почему page latches и logical locks — разные сущности?

38. (L3 [T]) Как MVCC влияет на secondary indexes?

39. (L3 [T]) Почему lock manager и version manager оба могут быть bottleneck?

40. (L3 [T]) Как epoch-based reclamation связана с MVCC cleanup?

41. (L3 [T]) Почему strict 2PL проще формально, но хуже по concurrency profile?

42. (L3 [T]) Как cache locality влияет на performance lock table vs version chains?

43. (L3 [T]) Как NUMA усиливает contention в глобальном lock manager?

44. (L3 [T]) Почему MVCC cleanup может разрушить p99 latency?

45. (L3 [T]) Почему readers-writer locks редко оказываются идеальным ответом для DB concurrency?

46. (L3 [P]) Реализовать sharded lock manager

47. (L3 [P]) Реализовать MVCC visibility cache

48. (L3 [P]) Реализовать hybrid lock+MVCC engine для hot updates

49. (L3 [P]) Реализовать per-key contention counters

50. (L3 [P]) Реализовать trace: lock wait / version traversal / retry reasons

51. (L3 [D]) Как доказать, что bottleneck в lock manager, а не в I/O?

52. (L3 [D]) Почему MVCC engine CPU-bound при низком disk util?

53. (L3 [D]) Почему visibility checks стали дороже после роста concurrency?

54. (L3 [D]) Как расследовать race между vacuum и readers?

55. (L3 [D]) Почему contention на transaction ID allocator ломает throughput?

56. (L4 [S]) Когда стоит предпочесть locks, а когда MVCC?

57. (L4 [S]) Как проектировать concurrency control для in-memory DB?

58. (L4 [S]) Как сочетать MVCC, short latches и optimistic techniques?

59. (L4 [S]) Как строить observability для lock waits, aborts и version churn?

60. (L4 [S]) Как объяснять команде, что MVCC — это не “бесплатная конкурентность”, а другой набор trade-offs?

---

## 🔹 Isolation anomalies

61. (L1 [T]) Что такое isolation anomaly?

62. (L1 [T]) Что такое dirty read?

63. (L1 [T]) Что такое non-repeatable read?

64. (L1 [T]) Что такое lost update?

65. (L1 [T]) Почему аномалии возникают только при конкуренции транзакций?

66. (L1 [T]) Что такое interleaving транзакций?

67. (L1 [T]) Почему read committed допускает часть аномалий?

68. (L1 [T]) Почему repeatable read сильнее read committed?

69. (L1 [T]) Почему serializable — самый сильный практический уровень?

70. (L1 [T]) Почему бизнес-неконсистентность и DB-level anomaly — не одно и то же?

71. (L1 [P]) Смоделировать dirty read на двух потоках

72. (L1 [P]) Смоделировать lost update

73. (L1 [P]) Смоделировать non-repeatable read

74. (L1 [P]) Реализовать history logger для read/write events

75. (L1 [P]) Реализовать validator на dirty read/lost update scenarios

76. (L2 [T]) Почему snapshot isolation убирает часть аномалий, но не все?

77. (L2 [T]) Почему repeatable read не всегда достаточно для correctness?

78. (L2 [T]) Что такое write-write conflict?

79. (L2 [T]) Что такое read-write dependency?

80. (L2 [T]) Почему anomaly часто воспроизводится только под нагрузкой?

81. (L2 [T]) Почему “всё работает в тестах” не доказывает отсутствие isolation bugs?

82. (L2 [T]) Почему retry после serialization failure — часть correctness модели?

83. (L2 [T]) Что такое serialization graph?

84. (L2 [T]) Почему application-level read-modify-write особенно опасен?

85. (L2 [T]) Почему long transactions увеличивают вероятность аномалий?

86. (L2 [P]) Реализовать precedence/conflict graph builder

87. (L2 [P]) Реализовать generator interleavings для двух транзакций

88. (L2 [P]) Реализовать conflict detector для lost update

89. (L2 [P]) Реализовать optimistic validation at commit

90. (L2 [P]) Реализовать test harness для repeatable anomalies under load

91. (L2 [D]) Почему приложение видит “странные данные”, хотя явных ошибок нет?

92. (L2 [D]) Почему race condition проявляется только на production dataset?

93. (L2 [D]) Почему read committed иногда даёт логически неконсистентные результаты?

94. (L2 [D]) Почему после перехода на serializable выросло число retry/abort?

95. (L2 [D]) Почему anomaly исчезает под debugger или single-threaded replay?

96. (L3 [T]) Как формально описываются anomalies через histories и conflict graphs?

97. (L3 [T]) Чем conflict serializability отличается от view serializability?

98. (L3 [T]) Как Serializable Snapshot Isolation (SSI) ловит dangerous structures?

99. (L3 [T]) Почему predicate dependencies труднее ловить, чем row conflicts?

100. (L3 [T]) Как optimizer/planner косвенно влияет на вероятность аномалий через access path?

101. (L3 [T]) Почему covering index может менять конфликтный профиль workload?

102. (L3 [T]) Как read-only transactions участвуют в serialization graph?

103. (L3 [T]) Почему anomaly detection сама может иметь overhead и false positives?

104. (L3 [T]) Как distributed replication усложняет reasoning о local isolation anomalies?

105. (L3 [T]) Почему correctness under concurrency требует не только DB guarantees, но и transaction design discipline?

106. (L3 [P]) Реализовать cycle detection в serialization graph

107. (L3 [P]) Реализовать SSI-style rw-conflict tracking

108. (L3 [P]) Реализовать trace capture для later anomaly replay

109. (L3 [P]) Реализовать property-based testing для concurrency anomalies

110. (L3 [P]) Реализовать deterministic scheduler для воспроизведения race conditions

111. (L3 [D]) Как доказать, что observed bug — это isolation anomaly, а не баг бизнес-логики?

112. (L3 [D]) Почему serialization failures выросли после добавления индекса?

113. (L3 [D]) Как расследовать редкую anomaly, происходящую раз в несколько дней?

114. (L3 [D]) Почему retry loop сам стал источником деградации?

115. (L3 [D]) Как собрать минимальный воспроизводимый schedule для production race?

116. (L4 [S]) Какой isolation level выбирать по умолчанию для OLTP-системы?

117. (L4 [S]) Когда достаточно read committed, а когда нужен serializable?

118. (L4 [S]) Как проектировать API и transaction boundaries, чтобы минимизировать anomalies?

119. (L4 [S]) Как обучать команды мыслить schedule-ами, а не только SQL-запросами?

120. (L4 [S]) Как строить testing strategy, ловящую concurrency anomalies до production?

---

## 🔹 Phantom reads

121. (L1 [T]) Что такое phantom read?

122. (L1 [T]) Чем phantom read отличается от non-repeatable read?

123. (L1 [T]) Почему phantom связан с предикатом, а не только с конкретной строкой?

124. (L1 [T]) Как insert новой строки может вызвать phantom?

125. (L1 [T]) Почему повторный `SELECT WHERE condition` может вернуть другой набор строк?

126. (L1 [T]) Почему row locks не всегда защищают от phantom?

127. (L1 [T]) Что такое range/predicate lock?

128. (L1 [T]) Почему serializable должен учитывать phantoms?

129. (L1 [T]) Почему phantom важен для aggregate queries (`COUNT`, `SUM`)?

130. (L1 [T]) Почему phantom может ломать бизнес-инварианты без явных ошибок?

131. (L1 [P]) Смоделировать phantom read через concurrent INSERT

132. (L1 [P]) Реализовать range predicate test: `WHERE x BETWEEN A AND B`

133. (L1 [P]) Реализовать repeatable query harness для выявления phantom

134. (L1 [P]) Реализовать упрощённый key-range lock

135. (L1 [P]) Реализовать snapshot read, устраняющий phantom в рамках одной snapshot

136. (L2 [T]) Почему MVCC snapshot часто скрывает phantom для reader-а, но не решает все predicate conflicts?

137. (L2 [T]) Чем key-range locking отличается от row locking?

138. (L2 [T]) Что такое next-key locks?

139. (L2 [T]) Почему phantom особенно важен при uniqueness/business constraints “по условию”?

140. (L2 [T]) Почему индекс влияет на возможность и стоимость predicate locking?

141. (L2 [T]) Почему full table scan усложняет борьбу с phantom?

142. (L2 [T]) Почему `SELECT ... FOR UPDATE` не всегда защищает от phantom?

143. (L2 [T]) Как phantom проявляется в `COUNT(*)`, `EXISTS`, `NOT EXISTS` запросах?

144. (L2 [T]) Почему snapshot isolation допускает некоторые predicate anomalies?

145. (L2 [T]) Почему phantom — одна из причин, почему “repeatable read” не всегда равен “serializable”?

146. (L2 [P]) Реализовать key-range lock поверх отсортированного индекса

147. (L2 [P]) Реализовать phantom detector для predicate-based histories

148. (L2 [P]) Реализовать test для `COUNT WHERE ...` under concurrent inserts

149. (L2 [P]) Реализовать next-key locking (упрощённо)

150. (L2 [P]) Реализовать benchmark predicate lock overhead vs row lock overhead

151. (L2 [D]) Почему повторный COUNT даёт разный результат внутри одной бизнес-операции?

152. (L2 [D]) Почему после перехода на MVCC phantom “исчез”, но логическая ошибка осталась?

153. (L2 [D]) Почему range query неожиданно стала источником contention?

154. (L2 [D]) Почему serializable workload начал часто abort-иться на insert-heavy диапазонах?

155. (L2 [D]) Почему phantom воспроизводится только на определённых диапазонах ключей?

156. (L3 [T]) Как B-Tree structure используется для реализации key-range locking?

157. (L3 [T]) Почему predicate locking без индекса может быть слишком грубым?

158. (L3 [T]) Как SSI ловит phantom-like dangerous structures без полного predicate locking?

159. (L3 [T]) Почему phantom — это конфликт между набором строк, а не отдельной версией?

160. (L3 [T]) Как optimizer access path влияет на phantom protection semantics?

161. (L3 [T]) Почему concurrent inserts into hot range создают avalanche aborts?

162. (L3 [T]) Как partitioning/sharding влияет на predicate conflicts и phantoms?

163. (L3 [T]) Почему phantoms сложнее диагностировать, чем row-level lost updates?

164. (L3 [T]) Как index gaps и page splits влияют на lock ranges?

165. (L3 [T]) Почему phantom prevention часто дороже, чем кажется по учебнику?

166. (L3 [P]) Реализовать B-Tree backed key-range lock manager

167. (L3 [P]) Реализовать SSI-like rw-dependency tracker для predicate reads

168. (L3 [P]) Реализовать trace gaps/ranges touched by each transaction

169. (L3 [P]) Реализовать synthetic hotspot benchmark on insert-into-range workload

170. (L3 [P]) Реализовать visualization predicate conflicts over time

171. (L3 [D]) Как доказать, что проблема именно phantom, а не обычный non-repeatable read?

172. (L3 [D]) Почему key-range locks взорвали contention на горячем диапазоне?

173. (L3 [D]) Как расследовать phantom anomaly, зависящую от выбора индекса planner-ом?

174. (L3 [D]) Почему inserts в “соседние” ключи начали конфликтовать после изменения схемы индекса?

175. (L3 [D]) Как минимально воспроизвести predicate anomaly на production-like workload?

176. (L4 [S]) Когда оправдан key-range locking, а когда лучше SSI/optimistic schemes?

177. (L4 [S]) Как проектировать schema/indexes, уменьшающие risk predicate conflicts?

178. (L4 [S]) Как объяснять разработчикам, что row locks не защищают от phantom semantics?

179. (L4 [S]) Как выбирать isolation semantics для запросов с агрегатами и диапазонами?

180. (L4 [S]) Как строить observability и tooling для phantom/predicate conflict analysis?

---

## 🔹 Write skew

181. (L1 [T]) Что такое write skew?

182. (L1 [T]) Почему write skew отличается от lost update?

183. (L1 [T]) Почему write skew часто возникает при snapshot isolation?

184. (L1 [T]) Почему две транзакции могут читать одни и те же данные и писать в разные строки, но всё равно сломать инвариант?

185. (L1 [T]) Почему write skew — это логическая, а не только физическая аномалия?

186. (L1 [T]) Как выглядит классический пример write skew с “дежурными врачами”/“минимум один on-call”?

187. (L1 [T]) Почему отсутствие write-write конфликта не означает отсутствие проблемы?

188. (L1 [T]) Почему row-level locks не всегда предотвращают write skew?

189. (L1 [T]) Почему write skew важен для уникальности “по условию” и quota-like invariants?

190. (L1 [T]) Почему serializable обычно нужен именно для таких инвариантов?

191. (L1 [P]) Смоделировать классический write skew на двух строках

192. (L1 [P]) Реализовать snapshot isolation test harness

193. (L1 [P]) Реализовать invariant checker after concurrent commits

194. (L1 [P]) Реализовать пример “оба читали count>0, затем оба выключили свой флаг”

195. (L1 [P]) Реализовать forced interleaving для reproducible write skew

196. (L2 [T]) Чем write skew отличается от phantom и lost update?

197. (L2 [T]) Почему snapshot isolation предотвращает lost update, но не write skew?

198. (L2 [T]) Почему конфликт идёт через read set, а не через write set?

199. (L2 [T]) Как materialized aggregate/check row может превратить write skew в обычный write conflict?

200. (L2 [T]) Почему `SELECT ... FOR UPDATE` иногда помогает, а иногда нет?

201. (L2 [T]) Как предикатные инварианты порождают write skew?

202. (L2 [T]) Почему denormalized counters/summary rows иногда используются как защита от write skew?

203. (L2 [T]) Почему write skew часто не виден на unit-тестах?

204. (L2 [T]) Почему retry на snapshot isolation сам по себе не исправляет write skew?

205. (L2 [T]) Почему serializable abort полезен именно как сигнал скрытой аномалии?

206. (L2 [P]) Реализовать conflict detector по read set + predicate set

207. (L2 [P]) Реализовать summary-row technique для предотвращения write skew

208. (L2 [P]) Реализовать `SELECT FOR UPDATE` workaround benchmark

209. (L2 [P]) Реализовать serialization-graph detection for skew pattern

210. (L2 [P]) Реализовать test cases на business invariants under snapshot isolation

211. (L2 [D]) Почему логика “каждый обновляет свою строку” всё равно ломает инвариант?

212. (L2 [D]) Почему write skew проявляется только при одновременных коммитах?

213. (L2 [D]) Почему после перехода на snapshot isolation исчезли deadlocks, но появились логические баги?

214. (L2 [D]) Почему retry после conflict не помогает для skew anomaly?

215. (L2 [D]) Почему два UPDATE по разным строкам внезапно требуют serializable semantics?

216. (L3 [T]) Как SSI детектирует dangerous structure, ведущую к write skew?

217. (L3 [T]) Почему write skew формально проявляется как цикл rw-dependencies?

218. (L3 [T]) Как materialized constraints переводят invisible logical conflicts в visible physical conflicts?

219. (L3 [T]) Почему sharding/partitioning может скрыть или усилить skew patterns?

220. (L3 [T]) Как secondary indexes and predicate reads участвуют в skew anomalies?

221. (L3 [T]) Почему write skew особенно важен для booking/quota/scheduling систем?

222. (L3 [T]) Почему “каждая транзакция корректна по отдельности” — опасная мысль under concurrency?

223. (L3 [T]) Как строить static analysis/business invariant review against skew-prone workflows?

224. (L3 [T]) Почему low-level DB guarantees нужно переводить на язык product invariants?

225. (L3 [T]) Как observability по serialization failures помогает находить скрытый write skew?

226. (L3 [P]) Реализовать SSI-style dangerous structure tracker

227. (L3 [P]) Реализовать automatic invariant checker over committed histories

228. (L3 [P]) Реализовать benchmark quota-like workload under SI vs serializable

229. (L3 [P]) Реализовать graph visualization rw-dependencies causing skew

230. (L3 [P]) Реализовать pattern detector for skew-prone read-modify-write flows

231. (L3 [D]) Как доказать, что баг — это именно write skew, а не bad application logic without concurrency?

232. (L3 [D]) Почему skew anomaly появилась после оптимизации и сокращения lock duration?

233. (L3 [D]) Как расследовать редкий skew в scheduling/booking системе?

234. (L3 [D]) Почему summary-row workaround улучшил correctness, но ухудшил contention?

235. (L3 [D]) Как минимально воспроизвести skew anomaly на production-like dataset?

236. (L4 [S]) Когда инварианты требуют serializable, а когда можно безопасно жить на SI/RC?

237. (L4 [S]) Как проектировать schema/API так, чтобы write skew было трудно выразить?

238. (L4 [S]) Когда стоит материализовать constraint row/counter, а когда лучше поднять isolation level?

239. (L4 [S]) Как обучать команды отличать lost update, phantom и write skew?

240. (L4 [S]) Как включать concurrency invariant review в дизайн новых фич?

---

## 🔹 Contention

241. (L1 [T]) Что такое contention в контексте СУБД?

242. (L1 [T]) Чем lock contention отличается от CPU contention?

243. (L1 [T]) Почему hot row или hot key может убить throughput?

244. (L1 [T]) Почему больше потоков не всегда означает больше производительности?

245. (L1 [T]) Что такое contention hotspot?

246. (L1 [T]) Почему tail latency часто страдает от contention сильнее, чем average latency?

247. (L1 [T]) Что такое lock wait?

248. (L1 [T]) Что такое spin vs sleep waiting?

249. (L1 [T]) Почему contention бывает и в lock-based, и в MVCC systems?

250. (L1 [T]) Почему contention может возникать не только на данных, но и на metadata/global counters?

251. (L1 [P]) Реализовать benchmark hot key vs uniform key distribution

252. (L1 [P]) Реализовать latency/throughput measurement under growing thread count

253. (L1 [P]) Реализовать per-key contention counters

254. (L1 [P]) Реализовать hot row update workload

255. (L1 [P]) Реализовать mutex vs spinlock benchmark для коротких критических секций

256. (L2 [T]) Почему lock convoying ухудшает throughput?

257. (L2 [T]) Почему false sharing может выглядеть как “непонятный contention”?

258. (L2 [T]) Почему global transaction ID allocator может стать bottleneck?

259. (L2 [T]) Почему contention усиливается на NUMA?

260. (L2 [T]) Что такое latch contention внутри B-Tree/buffer pool?

261. (L2 [T]) Почему optimistic retries могут при высоком конфликте ухудшить ситуацию?

262. (L2 [T]) Почему hot partitions и hot keys — разные, но родственные проблемы?

263. (L2 [T]) Почему fairness и throughput часто конфликтуют в lock scheduling?

264. (L2 [T]) Почему contention может расти при низкой загрузке диска и сети?

265. (L2 [T]) Почему аборты/retries — тоже форма hidden contention cost?

266. (L2 [P]) Реализовать lock striping для снижения contention

267. (L2 [P]) Реализовать sharded counter вместо global counter

268. (L2 [P]) Реализовать backoff strategy для retry loops

269. (L2 [P]) Реализовать benchmark false sharing на adjacent cache lines

270. (L2 [P]) Реализовать trace lock wait histogram и contention heatmap

271. (L2 [D]) Почему CPU 100%, а throughput падает?

272. (L2 [D]) Почему одна строка/partition становится bottleneck всей системы?

273. (L2 [D]) Почему после перехода на lock-free структуру latency не улучшилась?

274. (L2 [D]) Почему retry storm положил сервис сильнее, чем исходный конфликт?

275. (L2 [D]) Почему p50 хороший, а p99 ужасный при горячих ключах?

276. (L3 [T]) Как perf/futex traces помогают видеть contention inside DB engine?

277. (L3 [T]) Почему latch contention в buffer pool/index может доминировать над logical locks?

278. (L3 [T]) Как cache line bouncing разрушает scalability на many-core CPU?

279. (L3 [T]) Почему adaptive spinning полезен на 8 cores и вреден на 128?

280. (L3 [T]) Как contention profiles differ for OLTP, analytics, mixed workloads?

281. (L3 [T]) Почему contention на allocator/free lists может выглядеть как “DB slowdown”?

282. (L3 [T]) Как queueing theory помогает reasoning about contention and tail latency?

283. (L3 [T]) Почему batching может одновременно уменьшать contention и увеличивать per-op latency?

284. (L3 [T]) Как partitioning/sharding данных и metadata уменьшает contention?

285. (L3 [T]) Почему contention observability должна быть per-lock/per-key/per-code-path, а не только global CPU?

286. (L3 [P]) Реализовать sharded lock table

287. (L3 [P]) Реализовать lock-free or wait-free counter for hot path

288. (L3 [P]) Реализовать contention profiler with stack traces

289. (L3 [P]) Реализовать synthetic hotspot workload generator with Zipfian distribution

290. (L3 [P]) Реализовать experiment: mutex/spin/rwlock/optimistic retry under mixed contention

291. (L3 [D]) Как доказать, что bottleneck — false sharing, а не логический lock conflict?

292. (L3 [D]) Почему после роста числа ядер throughput перестал расти?

293. (L3 [D]) Как расследовать contention, который проявляется только на двухсокетной NUMA-машине?

294. (L3 [D]) Почему hot key mitigation помогла p99, но ухудшила average latency?

295. (L3 [D]) Как отличить contention на данных от contention на metadata/global structures?

296. (L4 [S]) Как проектировать engine/schema/API так, чтобы минимизировать contention с первого дня?

297. (L4 [S]) Когда стоит бороться с contention через sharding, а когда через изменение semantics?

298. (L4 [S]) Как строить observability и alerting для contention до реального инцидента?

299. (L4 [S]) Как объяснять продуктовым командам, что “горячий объект” — архитектурная проблема, а не просто вопрос железа?

300. (L4 [S]) Как выбирать между fairness, throughput, tail latency и complexity в concurrency control design?

---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Почему locks vs MVCC — это не бинарный выбор, а спектр дизайнов?

302. (L2 [T]) Как isolation anomalies связаны с конкретными механизмами concurrency control?

303. (L2 [T]) Почему phantom reads и write skew важнее для бизнес-инвариантов, чем dirty reads?

304. (L2 [T]) Как contention влияет и на throughput, и на correctness через retries/aborts?

305. (L2 [T]) Почему planner/index choice может менять concurrency profile workload?

306. (L2 [T]) Как buffer pool, B-Tree latches и logical locks вместе формируют observed latency?

307. (L2 [T]) Почему long transactions одновременно вредят MVCC cleanup, lock hold time и contention?

308. (L2 [T]) Как replication/retry/failover усиливают concurrency bugs на уровне приложения?

309. (L2 [T]) Почему concurrency issues редко ловятся обычными unit tests?

310. (L2 [T]) Почему observability для concurrency должна связывать locks, aborts, retries, versions и hot keys?

311. (L2 [P]) Реализовать mini-engine: locks + MVCC + anomaly tests + contention metrics

312. (L2 [P]) Реализовать dashboard: lock waits, abort rate, retry rate, oldest snapshot, hot keys

313. (L2 [P]) Реализовать chaos harness: kill/restart + concurrent workload + invariant checking

314. (L2 [P]) Реализовать deterministic interleaving tester для tricky anomalies

315. (L2 [P]) Реализовать benchmark: uniform vs Zipfian vs range-hotspot workloads

316. (L3 [D]) Почему после повышения isolation correctness улучшилась, но SLA сломался?

317. (L3 [D]) Почему после оптимизации locks появилось больше write skew anomalies?

318. (L3 [D]) Как доказать, что корень проблемы — плохие transaction boundaries, а не сама СУБД?

319. (L3 [D]) Почему p50 стабильный, а p99 и abort rate резко прыгают под нагрузкой?

320. (L3 [D]) Как расследовать инцидент “данные не потерялись, но concurrent поведение было неконсистентным”?

321. (L4 [S]) Как выбирать concurrency model для новой БД или storage engine?

322. (L4 [S]) Как встроить concurrency testing и invariant review в обычный процесс разработки?

323. (L4 [S]) Какие anti-patterns в transaction design чаще всего приводят к painful concurrency bugs?

324. (L4 [S]) Как строить internal guidelines по isolation levels, retries и lock usage для инженерных команд?

325. (L4 [S]) Как объяснять команде, что конкурентность — это не “деталь реализации”, а ядро correctness и performance одновременно?

