# ⚡ 9. Производительность и оптимизация

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

## 🔹 Query planning

1. (L1 [T]) Что такое query planning?

2. (L1 [T]) Зачем СУБД строит план выполнения запроса?

3. (L1 [T]) Чем logical plan отличается от physical plan?

4. (L1 [T]) Почему один и тот же SQL можно выполнить несколькими способами?

5. (L1 [T]) Что такое access path?

6. (L1 [T]) Почему planner выбирает между full scan и index scan?

7. (L1 [T]) Что такое filter, projection, join, aggregation в плане?

8. (L1 [T]) Что такое plan node / operator?

9. (L1 [T]) Почему порядок операций влияет на производительность?

10. (L1 [T]) Почему “правильный SQL” не гарантирует “быстрый SQL”?

11. (L1 [P]) Реализовать AST для простого SELECT ... WHERE

12. (L1 [P]) Реализовать logical plan для фильтра и проекции

13. (L1 [P]) Реализовать physical plan: seq scan vs index lookup

14. (L1 [P]) Реализовать tree printer для execution plan

15. (L1 [P]) Реализовать simple planner для single-table queries

16. (L2 [T]) Что такое predicate pushdown на уровне planner?

17. (L2 [T]) Почему join order — одна из самых дорогих частей planning?

18. (L2 [T]) Что такое cardinality estimation?

19. (L2 [T]) Почему planner должен учитывать доступные индексы?

20. (L2 [T]) Что такое plan enumeration?

21. (L2 [T]) Почему planning time itself может быть non-trivial?

22. (L2 [T]) Что такое parameterized plan?

23. (L2 [T]) Почему prepared statements могут менять качество плана?

24. (L2 [T]) Что такое covering plan / index-only plan?

25. (L2 [T]) Почему planner важен даже в KV/Document системах, а не только в SQL БД?

26. (L2 [P]) Реализовать выбор seq scan vs index scan по селективности

27. (L2 [P]) Реализовать pushdown фильтра в scan node

28. (L2 [P]) Реализовать reordering простых conjunctive predicates

29. (L2 [P]) Реализовать simple join planner для двух таблиц

30. (L2 [P]) Реализовать estimation-based plan selector

31. (L2 [D]) Почему planner выбрал full scan вместо очевидного индекса?

32. (L2 [D]) Почему после добавления WHERE запрос стал медленнее?

33. (L2 [D]) Почему prepared statement даёт худший план, чем ad-hoc query?

34. (L2 [D]) Почему planning time внезапно стал заметным на коротких запросах?

35. (L2 [D]) Почему один и тот же запрос иногда получает разные планы?

36. (L3 [T]) Как planner связывает parser, catalog, statistics и optimizer?

37. (L3 [T]) Как устроен search space для join ordering?

38. (L3 [T]) Почему bushy plans дороже оптимизировать, но иногда полезнее?

39. (L3 [T]) Что такое top-down vs bottom-up planning?

40. (L3 [T]) Как planner учитывает physical properties: order, partitioning, distribution?

41. (L3 [T]) Как planner должен учитывать CPU vs I/O vs memory trade-offs?

42. (L3 [T]) Как parameter sniffing влияет на quality плана?

43. (L3 [T]) Почему статистики и planner связаны жёстче, чем кажется?

44. (L3 [T]) Как planner должен учитывать MVCC visibility cost?

45. (L3 [T]) Почему planner — это не просто rule engine, а часть performance-critical architecture?

46. (L3 [P]) Реализовать dynamic programming join enumerator

47. (L3 [P]) Реализовать propagation physical properties в plan tree

48. (L3 [P]) Реализовать parameter-sensitive plan selection

49. (L3 [P]) Реализовать planner trace/debug output

50. (L3 [P]) Реализовать benchmark planning time vs execution time

51. (L3 [D]) Как доказать, что проблема в planner, а не в execution engine?

52. (L3 [D]) Почему при одинаковом SQL разные literals радикально меняют план?

53. (L3 [D]) Как расследовать planner regression после обновления статистик?

54. (L3 [D]) Почему оптимизация join order взорвала CPU на planning phase?

55. (L3 [D]) Как найти, что bottleneck — это misestimated cardinality, а не плохой алгоритм join?

56. (L4 [S]) Когда planner можно держать простым rule-based, а когда нужен полноценный optimizer?

57. (L4 [S]) Как проектировать planner для своей C/C++ БД без взрывной сложности?

58. (L4 [S]) Как балансировать planning time и plan quality?

59. (L4 [S]) Как строить observability для planner/optimizer с первого дня?

60. (L4 [S]) Как объяснять продуктовой команде, что “быстрый SQL” зависит от planner semantics, а не только от железа?

---

## 🔹 Cost-based optimizer

61. (L1 [T]) Что такое cost-based optimizer (CBO)?

62. (L1 [T]) Чем CBO отличается от rule-based optimizer?

63. (L1 [T]) Что такое cost model?

64. (L1 [T]) Почему optimizer оценивает несколько альтернативных планов?

65. (L1 [T]) Какие ресурсы обычно входят в cost: CPU, I/O, memory?

66. (L1 [T]) Почему селективность предиката важна для CBO?

67. (L1 [T]) Что такое statistics?

68. (L1 [T]) Почему плохие statistics ведут к плохим планам?

69. (L1 [T]) Что такое cardinality estimate?

70. (L1 [T]) Почему CBO никогда не знает будущий runtime точно?

71. (L1 [P]) Реализовать простую cost model: seq scan cost vs index scan cost

72. (L1 [P]) Реализовать выбор cheapest plan из двух альтернатив

73. (L1 [P]) Реализовать selectivity estimate для equality predicate

74. (L1 [P]) Реализовать histogram-based estimate (упрощённо)

75. (L1 [P]) Реализовать join cost estimate для nested loop и hash join

76. (L2 [T]) Что такое histogram и зачем он нужен optimizer-у?

77. (L2 [T]) Что такое NDV (number of distinct values)?

78. (L2 [T]) Почему предположение independence between predicates часто ошибочно?

79. (L2 [T]) Почему skew ломает cost model?

80. (L2 [T]) Как optimizer оценивает cost join order?

81. (L2 [T]) Почему memory budget влияет на выбор плана?

82. (L2 [T]) Что такое spill risk в cost model?

83. (L2 [T]) Почему optimizer должен учитывать cost сортировки?

84. (L2 [T]) Что такое startup cost vs total cost?

85. (L2 [T]) Почему cheaper estimated plan может быть медленнее в реальности?

86. (L2 [P]) Реализовать multi-column selectivity estimate (упрощённо)

87. (L2 [P]) Реализовать cost для sort + merge join

88. (L2 [P]) Реализовать memory-aware выбор hash join vs sort-merge join

89. (L2 [P]) Реализовать startup-vs-total cost chooser

90. (L2 [P]) Реализовать statistics catalog для optimizer-а

91. (L2 [D]) Почему optimizer выбрал hash join, а nested loop оказался быстрее?

92. (L2 [D]) Почему после ANALYZE план ухудшился?

93. (L2 [D]) Почему skew по одному значению ломает оценку cost?

94. (L2 [D]) Почему optimizer недооценил размер intermediate result?

95. (L2 [D]) Почему spill to disk случился, хотя cost model ожидала fit in memory?

96. (L3 [T]) Как устроены реальные cost models в PostgreSQL/коммерческих СУБД?

97. (L3 [T]) Почему cost model завязана на hardware assumptions?

98. (L3 [T]) Как CPU cache, branch prediction и vectorization влияют на современный CBO?

99. (L3 [T]) Почему one-size-fits-all cost constants редко работают?

100. (L3 [T]) Как adaptive / runtime re-optimization соотносится с классическим CBO?

101. (L3 [T]) Как optimizer учитывает partition pruning и data locality?

102. (L3 [T]) Как CBO учитывает parallelism?

103. (L3 [T]) Почему misestimated cardinality часто доминирует над ошибками в cost constants?

104. (L3 [T]) Как optimizer должен учитывать buffer pool/page cache effects?

105. (L3 [T]) Почему CBO — это одновременно статистика, алгоритмы и engineering compromise?

106. (L3 [P]) Реализовать calibration benchmark для cost constants

107. (L3 [P]) Реализовать skew-aware histogram

108. (L3 [P]) Реализовать cost model с учётом cache hit ratio

109. (L3 [P]) Реализовать optimizer trace: chosen cost vs actual runtime

110. (L3 [P]) Реализовать re-optimization trigger при large cardinality misprediction

111. (L3 [D]) Как доказать, что корень проблемы в cardinality estimation, а не в executor?

112. (L3 [D]) Почему cost model работает на тестах и ломается на production workload?

113. (L3 [D]) Как расследовать parameter-sensitive regression?

114. (L3 [D]) Почему оптимизатор систематически недооценивает joins на correlated columns?

115. (L3 [D]) Как понять, что пора менять cost model, а не “тюнить запросы вручную”?

116. (L4 [S]) Когда для своей БД оправдан полноценный CBO?

117. (L4 [S]) Как эволюционировать optimizer от rule-based к cost-based?

118. (L4 [S]) Как строить cost model, не привязанную намертво к одной машине?

119. (L4 [S]) Как проектировать feedback loop actual runtime → optimizer stats?

120. (L4 [S]) Как объяснять команде, что optimizer не может быть “всегда прав” по определению?

---

## 🔹 Execution plans

121. (L1 [T]) Что такое execution plan?

122. (L1 [T]) Чем execution plan отличается от исходного SQL?

123. (L1 [T]) Что обычно видно в execution plan: scan, filter, join, sort, aggregate?

124. (L1 [T]) Почему execution plan полезен при performance debugging?

125. (L1 [T]) Что такое estimated plan и actual plan?

126. (L1 [T]) Почему row estimate и actual rows — критично важные поля?

127. (L1 [T]) Что означает seq scan в плане?

128. (L1 [T]) Что означает index scan в плане?

129. (L1 [T]) Что означает hash join / nested loop / merge join?

130. (L1 [T]) Почему plan tree читается снизу вверх?

131. (L1 [P]) Реализовать pretty-printer execution plan tree

132. (L1 [P]) Реализовать instrumentation: actual rows/time per node

133. (L1 [P]) Реализовать explain output для своего mini-engine

134. (L1 [P]) Реализовать estimated vs actual counters

135. (L1 [P]) Реализовать tree walker для анализа plan nodes

136. (L2 [T]) Почему actual plan важнее estimated plan при расследовании?

137. (L2 [T]) Что такое startup time и total time node-а?

138. (L2 [T]) Почему loops count важен в nested loop-heavy plans?

139. (L2 [T]) Как plan показывает, где происходят sorts и materialization?

140. (L2 [T]) Почему plan node может быть cheap, но multiplier effect делает его дорогим?

141. (L2 [T]) Что такое plan instability?

142. (L2 [T]) Почему два похожих запроса могут иметь radically different plans?

143. (L2 [T]) Что такое plan cache?

144. (L2 [T]) Почему cached plan может стать неактуальным?

145. (L2 [T]) Почему execution plan — это interface между optimizer и executor?

146. (L2 [P]) Реализовать collection actual timing per operator

147. (L2 [P]) Реализовать loops-aware plan instrumentation

148. (L2 [P]) Реализовать detect large estimate error in explain output

149. (L2 [P]) Реализовать plan diff tool для двух execution plans

150. (L2 [P]) Реализовать simple plan cache с invalidation по statistics change

151. (L2 [D]) Почему plan выглядит “нормально”, а запрос медленный?

152. (L2 [D]) Почему actual rows на два порядка больше estimate?

153. (L2 [D]) Почему nested loop неожиданно вызвал миллионы index lookups?

154. (L2 [D]) Почему sort node spill-ится на диск?

155. (L2 [D]) Почему planner cache держит устаревший плохой plan?

156. (L3 [T]) Как устроено instrumentation plan nodes с минимальным overhead?

157. (L3 [T]) Как actual execution plans помогают тюнить optimizer?

158. (L3 [T]) Как parallel execution отражается в execution plan?

159. (L3 [T]) Как visibility checks, rechecks и heap fetches отражаются в плане?

160. (L3 [T]) Почему explain/analyze сам может менять timing behavior?

161. (L3 [T]) Как flamegraphs/perf traces соотносятся с plan nodes?

162. (L3 [T]) Как materialization и buffering влияют на shape плана?

163. (L3 [T]) Как executor pipeline breakers отражаются в плане?

164. (L3 [T]) Почему production-safe observability execution plans сложна?

165. (L3 [T]) Как строить mapping “SQL fragment → plan node → CPU/IO cost”?

166. (L3 [P]) Реализовать lightweight sampling profiler по plan nodes

167. (L3 [P]) Реализовать actual vs estimated cardinality heatmap

168. (L3 [P]) Реализовать trace executor events с привязкой к plan tree

169. (L3 [P]) Реализовать spill diagnostics для sort/hash nodes

170. (L3 [P]) Реализовать plan regression detector по сохранённым explain snapshots

171. (L3 [D]) Как доказать, что плохой runtime идёт из-за executor bottleneck внутри “правильного” плана?

172. (L3 [D]) Почему explain analyze показывает одно, а production профилирование другое?

173. (L3 [D]) Как расследовать plan regression, проявляющуюся только на одном tenant-е?

174. (L3 [D]) Почему actual loops count explodes на correlated subquery?

175. (L3 [D]) Как найти один node, который формально cheap, но ломает p99 из-за cache miss/spill?

176. (L4 [S]) Как строить explain/trace tooling для собственной СУБД?

177. (L4 [S]) Какие execution metrics нужно собирать с первого дня?

178. (L4 [S]) Как балансировать информативность explain output и overhead instrumentation?

179. (L4 [S]) Как включить plan analysis в регулярный perf review команды?

180. (L4 [S]) Как объяснять разработчикам, что execution plan — это главный источник правды о запросе, а не догадки по SQL?

---

## 🔹 Index selection

181. (L1 [T]) Что такое index selection в контексте optimizer-а?

182. (L1 [T]) Почему наличие индекса ещё не означает, что он будет использован?

183. (L1 [T]) Что такое selectivity индекса?

184. (L1 [T]) Почему low-selectivity index часто бесполезен?

185. (L1 [T]) Что такое composite index?

186. (L1 [T]) Почему порядок колонок в composite index важен?

187. (L1 [T]) Что такое covering index?

188. (L1 [T]) Почему index lookup может быть дороже seq scan?

189. (L1 [T]) Что такое index-only scan?

190. (L1 [T]) Почему secondary index может требовать table/heap lookup?

191. (L1 [P]) Реализовать выбор между seq scan и single-column index

192. (L1 [P]) Реализовать поддержку composite index selection

193. (L1 [P]) Реализовать простую оценку selectivity

194. (L1 [P]) Реализовать covering-index fast path

195. (L1 [P]) Реализовать heuristic “не использовать индекс при высокой selectivity”

196. (L2 [T]) Почему optimizer должен учитывать clustering factor / locality?

197. (L2 [T]) Почему range predicate лучше подходит B-Tree, чем hash index?

198. (L2 [T]) Почему composite index `(a, b)` не всегда помогает по `WHERE b = ?`?

199. (L2 [T]) Что такое prefix matching в composite index?

200. (L2 [T]) Почему фильтр, сортировка и join могут конкурировать за “лучший” индекс?

201. (L2 [T]) Что такое skip scan / bitmap scan и зачем они нужны?

202. (L2 [T]) Почему optimizer иногда выбирает несколько индексов, а не один?

203. (L2 [T]) Как MVCC visibility влияет на реальную стоимость index-only scan?

204. (L2 [T]) Почему stale statistics ломают index selection?

205. (L2 [T]) Почему over-indexing ухудшает writes и иногда даже reads?

206. (L2 [P]) Реализовать composite-index prefix rules

207. (L2 [P]) Реализовать bitmap index merge (упрощённо)

208. (L2 [P]) Реализовать cost model для covering vs non-covering index

209. (L2 [P]) Реализовать выбор индекса под filter + order by

210. (L2 [P]) Реализовать advisor, предлагающий индекс по observed queries

211. (L2 [D]) Почему optimizer не использует “очевидный” индекс?

212. (L2 [D]) Почему после создания индекса запрос стал медленнее?

213. (L2 [D]) Почему composite index почти не помог?

214. (L2 [D]) Почему index-only scan всё равно ходит в heap/table?

215. (L2 [D]) Почему low-cardinality predicate создаёт плохой index plan?

216. (L3 [T]) Как optimizer выбирает между multiple usable indexes?

217. (L3 [T]) Как column correlation влияет на index usefulness?

218. (L3 [T]) Как cache residency индекса должна учитываться в выборе?

219. (L3 [T]) Как partial indexes и filtered indexes меняют index selection?

220. (L3 [T]) Как planner учитывает maintenance cost индекса косвенно через workload mix?

221. (L3 [T]) Как индекс может одновременно помогать WHERE, ORDER BY и JOIN?

222. (L3 [T]) Как partitioned tables усложняют index selection?

223. (L3 [T]) Как global vs local indexes влияют на distributed cost?

224. (L3 [T]) Почему index advisor без workload-awareness почти бесполезен?

225. (L3 [T]) Как строить explainability для решений optimizer-а по выбору индекса?

226. (L3 [P]) Реализовать multi-index candidate scoring

227. (L3 [P]) Реализовать partial-index eligibility check

228. (L3 [P]) Реализовать cache-aware index cost estimation

229. (L3 [P]) Реализовать index usage telemetry и unused-index detector

230. (L3 [P]) Реализовать what-if optimizer для виртуальных индексов

231. (L3 [D]) Как доказать, что причина плохого плана — correlation/skew, а не отсутствие индекса?

232. (L3 [D]) Почему index advisor рекомендует индекс, который на деле вреден?

233. (L3 [D]) Почему один tenant постоянно получает другой index plan?

234. (L3 [D]) Как расследовать случай, когда индекс ускоряет p50, но ухудшает p99?

235. (L3 [D]) Почему cache residency индекса изменила поведение optimizer-а после рестарта?

236. (L4 [S]) Как проектировать indexing strategy для нового продукта, а не для одного запроса?

237. (L4 [S]) Когда лучше добавить индекс, а когда переписать access pattern?

238. (L4 [S]) Как балансировать read gains и write amplification от индексов?

239. (L4 [S]) Как строить индексную политику для multi-tenant системы?

240. (L4 [S]) Как объяснять команде, что индекс — это trade-off, а не бесплатное ускорение?

---

## 🔹 Caching (buffer pool)

241. (L1 [T]) Что такое buffer pool?

242. (L1 [T]) Чем buffer pool БД отличается от page cache ОС?

243. (L1 [T]) Зачем БД держит собственный cache страниц?

244. (L1 [T]) Что такое page hit и page miss?

245. (L1 [T]) Почему buffer pool влияет и на reads, и на writes?

246. (L1 [T]) Что такое dirty page в buffer pool?

247. (L1 [T]) Почему eviction policy важна?

248. (L1 [T]) Что такое LRU и почему её любят в теории?

249. (L1 [T]) Почему чистый LRU не всегда хорош для БД?

250. (L1 [T]) Почему большой buffer pool не гарантирует хорошую производительность?

251. (L1 [P]) Реализовать buffer pool для fixed-size pages

252. (L1 [P]) Реализовать page table: page_id → frame

253. (L1 [P]) Реализовать LRU eviction

254. (L1 [P]) Реализовать dirty flag и flush dirty pages

255. (L1 [P]) Реализовать hit/miss counters

256. (L2 [T]) Почему scans могут вытеснять hot pages?

257. (L2 [T]) Что такое buffer pool thrashing?

258. (L2 [T]) Почему CLOCK/2Q/LRU-K часто лучше простого LRU?

259. (L2 [T]) Что такое pin/unpin page?

260. (L2 [T]) Почему buffer pool должен быть concurrency-safe?

261. (L2 [T]) Как background flusher помогает write path?

262. (L2 [T]) Почему checkpoint pressure влияет на buffer pool behavior?

263. (L2 [T]) Что такое free list?

264. (L2 [T]) Почему buffer pool sizing связан с workload, а не только с объёмом RAM?

265. (L2 [T]) Почему double caching с ОС может быть болезненной?

266. (L2 [P]) Реализовать CLOCK eviction

267. (L2 [P]) Реализовать scan-resistant policy

268. (L2 [P]) Реализовать pin count и запрет eviction pinned pages

269. (L2 [P]) Реализовать background flush thread

270. (L2 [P]) Реализовать buffer pool benchmark: hot set + scan workload

271. (L2 [D]) Почему после большого scan OLTP latency выросла?

272. (L2 [D]) Почему hit rate хороший, а запросы всё равно медленные?

273. (L2 [D]) Почему buffer pool постоянно грязный и flush не успевает?

274. (L2 [D]) Почему mutex/locks внутри buffer pool стали bottleneck?

275. (L2 [D]) Почему после увеличения cache size performance почти не изменилась?

276. (L3 [T]) Как проектировать sharded/partitioned buffer pool под many-core CPU?

277. (L3 [T]) Как replacement policy должна учитывать scans vs point lookups?

278. (L3 [T]) Как NUMA влияет на buffer pool design?

279. (L3 [T]) Как buffer pool взаимодействует с WAL, checkpoint и recovery?

280. (L3 [T]) Почему page latch, pin count и eviction policy надо рассматривать вместе?

281. (L3 [T]) Как page temperature / frequency statistics улучшают caching decisions?

282. (L3 [T]) Как huge pages, alignment и allocator choices влияют на buffer pool?

283. (L3 [T]) Почему compressed pages в cache — отдельный trade-off?

284. (L3 [T]) Как измерять не только hit ratio, но и useful hit ratio / eviction pain?

285. (L3 [T]) Почему buffer pool — это не просто cache, а центр всей storage concurrency?

286. (L3 [P]) Реализовать sharded buffer pool

287. (L3 [P]) Реализовать LRU-K или 2Q

288. (L3 [P]) Реализовать per-page access frequency tracking

289. (L3 [P]) Реализовать flush scheduler с write coalescing

290. (L3 [P]) Реализовать observability: hit ratio, dirty ratio, eviction rate, flush lag, latch contention

291. (L3 [D]) Как доказать, что bottleneck в buffer pool contention, а не в диске?

292. (L3 [D]) Почему после смены eviction policy p50 улучшился, а p99 ухудшился?

293. (L3 [D]) Как расследовать write stall, вызванный нехваткой clean pages?

294. (L3 [D]) Почему хороший hit ratio скрывает плохую locality и высокие latch costs?

295. (L3 [D]) Как отличить page cache issue ОС от собственного buffer pool issue БД?

296. (L4 [S]) Когда БД стоит полагаться на OS page cache, а когда нужен мощный buffer pool?

297. (L4 [S]) Как выбирать memory budget между buffer pool, execution memory и OS cache?

298. (L4 [S]) Как проектировать buffer pool для mixed OLTP + analytical workload?

299. (L4 [S]) Как строить roadmap cache optimizations без переусложнения архитектуры?

300. (L4 [S]) Как объяснять команде, что высокий hit ratio сам по себе не равен хорошей производительности?

---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Как query planning, CBO и execution plans связаны между собой?

302. (L2 [T]) Почему плохой cardinality estimate часто ведёт и к плохому index selection, и к плохому execution plan?

303. (L2 [T]) Как buffer pool/page cache меняют реальную стоимость plan operators?

304. (L2 [T]) Почему optimizer не может идеально предсказывать performance без runtime feedback?

305. (L2 [T]) Как MVCC visibility cost и heap fetches искажают “теоретически хороший” index plan?

306. (L2 [T]) Почему performance debugging всегда требует связки: SQL + plan + stats + cache + I/O?

307. (L2 [T]) Как Linux page cache, buffer pool и storage latency вместе формируют observed query time?

308. (L2 [T]) Почему high CPU query может быть следствием planner mistake, а не “медленного железа”?

309. (L2 [T]) Почему оптимизация одного запроса может ухудшить общий workload mix?

310. (L2 [T]) Почему production performance issues редко решаются “добавить индекс” в один шаг?

311. (L2 [P]) Реализовать mini-engine: planner + CBO + executor + buffer pool

312. (L2 [P]) Реализовать dashboard: planning time, execution time, actual rows, buffer hits, spills

313. (L2 [P]) Реализовать plan regression test suite на synthetic workloads

314. (L2 [P]) Реализовать what-if experiments: add index / change stats / shrink cache

315. (L2 [P]) Реализовать perf harness: hot cache vs cold cache vs mixed workload

316. (L3 [D]) Почему после добавления индекса p50 улучшился, а cluster-wide throughput упал?

317. (L3 [D]) Почему planner стал чаще выбирать full scan после роста таблицы?

318. (L3 [D]) Как доказать, что bottleneck в optimizer stats, а не в buffer pool size?

319. (L3 [D]) Почему explain plan хороший, но запрос всё равно unstable по latency?

320. (L3 [D]) Как расследовать инцидент “SQL тот же, схема та же, железо то же, а производительность внезапно хуже”?

321. (L4 [S]) Как строить performance engineering process для своей БД, а не тушить запросы по одному?

322. (L4 [S]) Какие метрики optimizer/planner/cache нужно собирать с первого дня?

323. (L4 [S]) Как балансировать complexity optimizer-а и предсказуемость системы?

324. (L4 [S]) Как проектировать observability, чтобы junior/middle инженеры тоже могли читать execution plans осмысленно?

325. (L4 [S]) Как объяснить команде, что производительность БД — это результат взаимодействия planner, executor, indexes, cache и I/O, а не “одной магической настройки”?

---

