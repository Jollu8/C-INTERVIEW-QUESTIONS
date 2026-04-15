# 📊 12. Специализированные хранилища

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

## 🔹 Time-series DB

1. (L1 [T]) Что такое time-series database?

2. (L1 [T]) Чем time-series workload отличается от обычной OLTP БД?

3. (L1 [T]) Почему timestamp — центральная часть модели данных в TSDB?

4. (L1 [T]) Почему TSDB обычно оптимизирована под append-heavy writes?

5. (L1 [T]) Что такое retention policy?

6. (L1 [T]) Что такое downsampling?

7. (L1 [T]) Почему time-series данные часто читаются диапазонами по времени?

8. (L1 [T]) Что такое tags и fields в time-series моделях?

9. (L1 [T]) Почему high-cardinality tags опасны для TSDB?

10. (L1 [T]) Почему компрессия особенно важна для time-series данных?

11. (L1 [P]) Реализовать append-only storage для точек `(timestamp, value)`

12. (L1 [P]) Реализовать time index по диапазонам timestamp

13. (L1 [P]) Реализовать retention cleanup по age-based policy

14. (L1 [P]) Реализовать простую агрегацию по time window

15. (L1 [P]) Реализовать downsampling: 1s → 1m buckets

16. (L2 [T]) Почему chunk-based storage хорошо подходит для TSDB?

17. (L2 [T]) Что такое delta encoding для timestamp-ов?

18. (L2 [T]) Почему Gorilla-like compression эффективна для time-series?

19. (L2 [T]) Почему out-of-order writes усложняют TSDB design?

20. (L2 [T]) Почему high-cardinality labels могут убить память и индекс?

21. (L2 [T]) Что такое inverted index по labels/tags?

22. (L2 [T]) Почему write path в TSDB часто отделён от query path?

23. (L2 [T]) Почему late-arriving data усложняет compaction и compression?

24. (L2 [T]) Что такое hot data vs cold data в TSDB?

25. (L2 [T]) Почему TSDB часто использует tiered storage?

26. (L2 [P]) Реализовать chunk storage по fixed time windows

27. (L2 [P]) Реализовать delta-of-delta compression для timestamps

28. (L2 [P]) Реализовать label index для series selection

29. (L2 [P]) Реализовать batched ingestion pipeline

30. (L2 [P]) Реализовать rollup job с materialized aggregates

31. (L2 [D]) Почему write throughput резко падает при росте cardinality?

32. (L2 [D]) Почему query latency взлетает на seemingly simple label filter?

33. (L2 [D]) Почему disk usage растёт быстрее числа точек?

34. (L2 [D]) Почему retention cleanup вызывает latency spikes?

35. (L2 [D]) Почему небольшое число noisy series ломает весь ingestion path?

36. (L3 [T]) Как устроен storage path в Prometheus/InfluxDB-подобных системах?

37. (L3 [T]) Как chunk compaction сочетается с immutable segment design?

38. (L3 [T]) Почему series cardinality — одна из главных production-проблем TSDB?

39. (L3 [T]) Как проектировать memory index для миллионов/миллиардов series?

40. (L3 [T]) Как out-of-order ingestion влияет на compression ratio и query semantics?

41. (L3 [T]) Как строить query engine для range scans + aggregations + label filters?

42. (L3 [T]) Почему remote write / remote read меняют границы системы хранения?

43. (L3 [T]) Как TSDB взаимодействует с page cache, compaction и WAL?

44. (L3 [T]) Почему retention, downsampling и cold storage надо проектировать вместе?

45. (L3 [T]) Почему TSDB — это одновременно storage engine и streaming aggregation system?

46. (L3 [P]) Реализовать series registry с memory accounting

47. (L3 [P]) Реализовать background chunk compactor

48. (L3 [P]) Реализовать adaptive chunk size policy

49. (L3 [P]) Реализовать cardinality analyzer per label/key

50. (L3 [P]) Реализовать observability: ingest lag, cardinality, chunk count, compression ratio

51. (L3 [D]) Как доказать, что bottleneck в label cardinality, а не в raw ingest rate?

52. (L3 [D]) Почему CPU высокий, а disk/network выглядят нормальными?

53. (L3 [D]) Почему query on recent data быстрая, а on older data очень медленная?

54. (L3 [D]) Как расследовать out-of-order writes, ломающие compression и correctness?

55. (L3 [D]) Почему after enabling downsampling storage cost fell, but query correctness complaints grew?

56. (L4 [S]) Когда выбирать TSDB вместо general-purpose DB?

57. (L4 [S]) Как проектировать TSDB под миллиарды points per second?

58. (L4 [S]) Как балансировать ingest speed, retention, query flexibility и cost?

59. (L4 [S]) Как строить product guardrails против uncontrolled cardinality growth?

60. (L4 [S]) Как объяснять команде, что TSDB schema design начинается с labels/cardinality, а не с таблиц?

---

## 🔹 Search engines

61. (L1 [T]) Что такое search engine в контексте хранения данных?

62. (L1 [T]) Чем search engine отличается от обычной реляционной БД?

63. (L1 [T]) Что такое inverted index?

64. (L1 [T]) Почему search engines оптимизированы под text retrieval?

65. (L1 [T]) Что такое tokenization?

66. (L1 [T]) Что такое stemming/lemmatization?

67. (L1 [T]) Что такое document в search engine?

68. (L1 [T]) Что такое term dictionary?

69. (L1 [T]) Что такое postings list?

70. (L1 [T]) Почему ranking/scoring — часть search engine, а не только storage?

71. (L1 [P]) Реализовать простейший inverted index `term -> docIDs`

72. (L1 [P]) Реализовать tokenization для plain text documents

73. (L1 [P]) Реализовать boolean AND/OR search

74. (L1 [P]) Реализовать postings list intersection

75. (L1 [P]) Реализовать простой TF-based scoring

76. (L2 [T]) Что такое BM25 и зачем нужен ranking model?

77. (L2 [T]) Почему search engine часто near-real-time, а не fully transactional?

78. (L2 [T]) Что такое segment-based index design?

79. (L2 [T]) Почему search engine часто immutable segments + merge?

80. (L2 [T]) Что такое analyzer chain?

81. (L2 [T]) Почему language-specific processing усложняет indexing?

82. (L2 [T]) Что такое faceting и aggregations в search systems?

83. (L2 [T]) Почему updates/deletes дороже, чем insert-only indexing?

84. (L2 [T]) Что такое doc values / columnar side storage?

85. (L2 [T]) Почему relevance и consistency — разные оси качества search system?

86. (L2 [P]) Реализовать positional postings для phrase queries

87. (L2 [P]) Реализовать BM25-like scoring

88. (L2 [P]) Реализовать segment merge

89. (L2 [P]) Реализовать delete tombstones and background merge cleanup

90. (L2 [P]) Реализовать facet counter over indexed docs

91. (L2 [D]) Почему search freshness отстаёт от write path?

92. (L2 [D]) Почему индекс растёт быстрее raw document corpus?

93. (L2 [D]) Почему merge job убивает query latency?

94. (L2 [D]) Почему phrase query медленная, хотя term query быстрая?

95. (L2 [D]) Почему ranking кажется “сломанным”, хотя данные есть?

96. (L3 [T]) Как устроен Lucene-like segment architecture?

97. (L3 [T]) Как FST/term dictionary layout влияет на memory and CPU?

98. (L3 [T]) Почему postings compression критична для search at scale?

99. (L3 [T]) Как index merging влияет на write amplification и cache locality?

100. (L3 [T]) Как query planner search engine-а выбирает term ordering and execution strategy?

101. (L3 [T]) Как search clusters шардируют index and route queries?

102. (L3 [T]) Почему aggregations/facets превращают search engine partly into analytical engine?

103. (L3 [T]) Как consistency/replication/failover проектируются для NRT search?

104. (L3 [T]) Почему analyzers and mappings are schema evolution problems too?

105. (L3 [T]) Почему search engine performance — это смесь CPU cache, compression, merge policy и query skew?

106. (L3 [P]) Реализовать compressed postings lists

107. (L3 [P]) Реализовать query execution for phrase + boolean + ranking

108. (L3 [P]) Реализовать shard-aware distributed search fan-out

109. (L3 [P]) Реализовать merge scheduler с IO throttling

110. (L3 [P]) Реализовать observability: freshness lag, segment count, query latency, merge debt

111. (L3 [D]) Как доказать, что bottleneck в segment merges, а не в query parser?

112. (L3 [D]) Почему одна shard search cluster деградирует сильнее остальных?

113. (L3 [D]) Как расследовать poor relevance после schema/analyzer change?

114. (L3 [D]) Почему high CPU search cluster caused by scoring, not by IO?

115. (L3 [D]) Почему after adding faceting p99 latency exploded?

116. (L4 [S]) Когда использовать search engine, а не SQL `LIKE`/GIN/FTS в обычной БД?

117. (L4 [S]) Как проектировать source-of-truth vs derived-search-index architecture?

118. (L4 [S]) Как балансировать freshness, relevance, indexing cost и operational complexity?

119. (L4 [S]) Как строить schema/mapping governance для search at scale?

120. (L4 [S]) Как объяснять команде, что search engine — это specialized derived system, а не general-purpose DB replacement?

---

## 🔹 Analytical warehouses

121. (L1 [T]) Что такое analytical warehouse?

122. (L1 [T]) Чем analytical warehouse отличается от OLTP БД?

123. (L1 [T]) Почему columnar storage хорошо подходит для аналитики?

124. (L1 [T]) Что такое large scan + aggregation workload?

125. (L1 [T]) Почему analytical engines оптимизируют throughput, а не single-row latency?

126. (L1 [T]) Что такое star schema?

127. (L1 [T]) Что такое fact table и dimension table?

128. (L1 [T]) Что такое partition pruning в warehouse?

129. (L1 [T]) Почему compression играет огромную роль в warehouses?

130. (L1 [T]) Почему ETL/ELT часто часть warehouse architecture?

131. (L1 [P]) Реализовать columnar storage for fixed schema table

132. (L1 [P]) Реализовать scan of selected columns only

133. (L1 [P]) Реализовать simple aggregate over billions-like synthetic rows

134. (L1 [P]) Реализовать dictionary encoding for one column

135. (L1 [P]) Реализовать partition pruning по дате

136. (L2 [T]) Что такое vectorized execution и почему оно полезно в analytics?

137. (L2 [T]) Что такое predicate pushdown?

138. (L2 [T]) Почему late materialization уменьшает memory traffic?

139. (L2 [T]) Что такое file formats Parquet/ORC/Iceberg-like tables?

140. (L2 [T]) Почему warehouses часто отделяют compute и storage?

141. (L2 [T]) Что такое micro-partitions / column chunks?

142. (L2 [T]) Почему sort/cluster keys важны для pruning?

143. (L2 [T]) Почему small files problem опасна для warehouses?

144. (L2 [T]) Что такое spill to disk в execution engines?

145. (L2 [T]) Почему analytical query может быть CPU-bound even on remote storage?

146. (L2 [P]) Реализовать vectorized filter over column batches

147. (L2 [P]) Реализовать predicate pushdown на chunk metadata

148. (L2 [P]) Реализовать late materialization for projected columns

149. (L2 [P]) Реализовать simple cost-based choice: scan compressed vs materialize early

150. (L2 [P]) Реализовать benchmark row-store vs column-store on aggregation queries

151. (L2 [D]) Почему warehouse scan читает почти всё, хотя WHERE выглядит selective?

152. (L2 [D]) Почему after partitioning performance not improved?

153. (L2 [D]) Почему many small files killed query planning and open latency?

154. (L2 [D]) Почему spill случается при seemingly moderate dataset?

155. (L2 [D]) Почему one dashboard query saturates cluster CPU?

156. (L3 [T]) Как устроены modern analytical warehouses: file metadata + optimizer + distributed execution?

157. (L3 [T]) Как data skipping statistics уменьшают scan cost?

158. (L3 [T]) Как warehouses используют remote object storage efficiently?

159. (L3 [T]) Почему compaction/clustering and file maintenance — центральная operational задача?

160. (L3 [T]) Как query optimizer учитывает remote IO, decompression, network shuffle and CPU?

161. (L3 [T]) Как distributed joins и aggregations проектируются в warehouse?

162. (L3 [T]) Почему multi-tenant warehouses требуют governance on query slots/resources?

163. (L3 [T]) Как materialized views/caching interplay with freshness and cost?

164. (L3 [T]) Почему schema evolution в warehouses зависит от formats/metadata tables?

165. (L3 [T]) Почему analytical warehouse — это сочетание storage layout, metadata plane и execution engine?

166. (L3 [P]) Реализовать distributed scan + partial aggregate + final reduce

167. (L3 [P]) Реализовать metadata-driven file pruning

168. (L3 [P]) Реализовать small-files compaction planner

169. (L3 [P]) Реализовать query resource governor

170. (L3 [P]) Реализовать observability: bytes scanned, files touched, spill bytes, shuffle bytes, CPU/vector efficiency

171. (L3 [D]) Как доказать, что bottleneck в file layout/pruning, а не в SQL syntax itself?

172. (L3 [D]) Почему after clustering cost dropped for one query type but rose for another?

173. (L3 [D]) Как расследовать runaway query, съедающую весь warehouse?

174. (L3 [D]) Почему compute scale-up didn’t help because remote storage open/list cost dominated?

175. (L3 [D]) Почему results correct, but freshness and performance complaints appear after compaction?

176. (L4 [S]) Когда строить warehouse отдельно от OLTP systems?

177. (L4 [S]) Как выбирать between self-managed warehouse stack and managed service?

178. (L4 [S]) Как проектировать file layout, partitioning, clustering and retention together?

179. (L4 [S]) Как балансировать cost, freshness and query flexibility in analytics platform?

180. (L4 [S]) Как объяснять команде, что warehouse performance начинается с data layout and ingestion discipline, а не только с “больше compute”?

---

## 🔹 Blob / object storage

181. (L1 [T]) Что такое blob storage?

182. (L1 [T]) Что такое object storage?

183. (L1 [T]) Чем object storage отличается от block storage и filesystem?

184. (L1 [T]) Почему object storage хорошо подходит для больших immutable objects?

185. (L1 [T]) Что такое bucket/container?

186. (L1 [T]) Что такое key/object name?

187. (L1 [T]) Почему object storage обычно не даёт POSIX semantics?

188. (L1 [T]) Почему object storage часто используется как cheap durable storage tier?

189. (L1 [T]) Почему latency object storage сильно выше локального диска?

190. (L1 [T]) Почему object storage отлично подходит для backups, media, data lakes?

191. (L1 [P]) Реализовать простое key->blob storage на файловой системе

192. (L1 [P]) Реализовать multipart upload для больших объектов

193. (L1 [P]) Реализовать metadata alongside blob

194. (L1 [P]) Реализовать range-read for large object

195. (L1 [P]) Реализовать content checksum verification

196. (L2 [T]) Почему object storage часто eventually consistent or API-specific consistent?

197. (L2 [T]) Что такое multipart upload и зачем он нужен?

198. (L2 [T]) Почему listing objects — отдельная expensive operation?

199. (L2 [T]) Что такое object versioning?

200. (L2 [T]) Почему small objects могут быть неэффективны в object storage?

201. (L2 [T]) Что такое lifecycle policy и tiering?

202. (L2 [T]) Почему delete semantics в object storage может быть tricky?

203. (L2 [T]) Почему object storage часто используют как backing store for warehouses and backups?

204. (L2 [T]) Что такое read-after-write consistency and why it matters here?

205. (L2 [T]) Почему rename в object storage обычно copy+delete, а не metadata op?

206. (L2 [P]) Реализовать object manifest + chunk parts model

207. (L2 [P]) Реализовать lifecycle expiration job

208. (L2 [P]) Реализовать parallel multipart uploader/downloader

209. (L2 [P]) Реализовать object listing cache

210. (L2 [P]) Реализовать simple deduplication by content hash

211. (L2 [D]) Почему throughput upload высок, а listing and small reads painfully slow?

212. (L2 [D]) Почему copy/rename workflow unexpectedly expensive?

213. (L2 [D]) Почему after enabling versioning storage bill exploded?

214. (L2 [D]) Почему backup restore is much slower than backup write?

215. (L2 [D]) Почему many tiny objects killed metadata/list performance?

216. (L3 [T]) Как устроены metadata plane и data plane в object storage systems?

217. (L3 [T]) Почему erasure coding/object placement влияют на latency and durability?

218. (L3 [T]) Как multipart upload interacts with consistency and failure recovery?

219. (L3 [T]) Почему object storage often better viewed as distributed system API, not “just remote disk”?

220. (L3 [T]) Как design for large scans over object storage differs from random small GET workload?

221. (L3 [T]) Почему caching, local SSD and manifest layers are often necessary on top of object storage?

222. (L3 [T]) Как warehouses/lakes build table semantics over object storage lacking transactions?

223. (L3 [T]) Почему read amplification in object storage often comes from metadata/list/open overhead?

224. (L3 [T]) Как lifecycle/tiering/versioning affect compliance, cost and operational risk?

225. (L3 [T]) Почему object storage is ideal for durability/cost, but terrible as low-latency primary DB storage?

226. (L3 [P]) Реализовать metadata cache with background refresh

227. (L3 [P]) Реализовать local SSD cache for remote objects

228. (L3 [P]) Реализовать manifest-based table over object blobs

229. (L3 [P]) Реализовать parallel range reader for large analytical objects

230. (L3 [P]) Реализовать observability: object count, list latency, GET p99, bytes/obj size distribution, multipart failures

231. (L3 [D]) Как доказать, что bottleneck in object workflow is metadata/list operations, not network bandwidth?

232. (L3 [D]) Почему object storage works well for backups but badly for interactive analytics unless cached?

233. (L3 [D]) Как расследовать partial multipart upload failures leaving orphaned parts/cost leaks?

234. (L3 [D]) Почему eventual/weak consistency assumptions broke cutover pipeline?

235. (L3 [D]) Почему after moving blobs to object storage application latency became bimodal?

236. (L4 [S]) Когда object storage — правильный primary durability layer, а когда нет?

237. (L4 [S]) Как проектировать systems that combine local SSD + object storage + metadata DB?

238. (L4 [S]) Как выбирать between filesystem, block storage and object storage for a new platform?

239. (L4 [S]) Как объяснять команде, что object storage is API-centric and metadata-heavy, not just “infinite cheap disk”?

240. (L4 [S]) Как строить guardrails around object count, object size distribution and lifecycle cost?

---

## 🔹 Cross-topic вопросы

241. (L2 [T]) Когда Time-series DB лучше обычной OLTP/warehouse системы?

242. (L2 [T]) Когда search engine должен быть derived index over source-of-truth DB, а не primary store?

243. (L2 [T]) Почему warehouses и object storage часто проектируются вместе?

244. (L2 [T]) Почему specialized storage almost always optimizes one workload by sacrificing another?

245. (L2 [T]) Как retention, compaction, compression and lifecycle differ between TSDB, search and warehouse?

246. (L2 [T]) Почему schema evolution and compatibility are still hard in specialized stores?

247. (L2 [T]) Как cache layers radically change observed performance in all these systems?

248. (L2 [T]) Почему replication/consistency guarantees vary widely across specialized stores?

249. (L2 [T]) Как metadata plane often dominates performance and correctness more than raw data path?

250. (L2 [T]) Почему product requirements must pick between latency, freshness, flexibility and cost before choosing the storage?

251. (L2 [P]) Реализовать benchmark suite: TSDB ingest, search query, columnar scan, blob upload/download

252. (L2 [P]) Реализовать dashboard comparing write amplification / read amplification / storage cost across store types

253. (L2 [P]) Реализовать hybrid architecture prototype: OLTP source DB + search index + warehouse lake + object storage backups

254. (L2 [P]) Реализовать metadata inventory service for specialized stores

255. (L2 [P]) Реализовать cost model comparing local disk vs remote object storage vs derived index layers

256. (L3 [D]) Почему команда выбрала “не тот” specialized storage, и это проявилось только на росте workload?

257. (L3 [D]) Почему storage cost низкий, но operational complexity exploded?

258. (L3 [D]) Как доказать, что bottleneck in specialized system comes from metadata/control plane, not raw data throughput?

259. (L3 [D]) Почему freshness/lag complaints arise even when durability and correctness are fine?

260. (L3 [D]) Как расследовать инцидент, где source-of-truth correct, but derived specialized storage stale/divergent?

261. (L4 [S]) Как выбирать specialized storage under uncertainty about future workload?

262. (L4 [S]) Когда строить polyglot persistence, а когда стандартизировать на fewer systems?

263. (L4 [S]) Как проектировать data platform, в которой TSDB, search, warehouse and object storage coexist sanely?

264. (L4 [S]) Какие anti-patterns чаще всего приводят к painful specialized-storage sprawl?

265. (L4 [S]) Как объяснять организации, что “лучшее хранилище” всегда зависит от dominant access pattern, consistency model and cost envelope?

