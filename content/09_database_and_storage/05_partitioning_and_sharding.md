# 🧩 5. Партиционирование и шардинг

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

## 🔹 Range partitioning

1. (L1 [T]) Что такое range partitioning?

2. (L1 [T]) По какому принципу данные распределяются между range partitions?

3. (L1 [T]) Чем range partitioning отличается от hash partitioning?

4. (L1 [T]) Какие типы ключей особенно хорошо подходят для range partitioning?

5. (L1 [T]) Почему временные ряды часто партиционируют по диапазонам времени?

6. (L1 [T]) Что такое partition key в range-based схеме?

7. (L1 [T]) Что происходит, если ключ не попадает ни в один диапазон?

8. (L1 [T]) Почему range partitioning удобно для range scan запросов?

9. (L1 [T]) Что такое partition pruning?

10. (L1 [T]) Какие базовые риски у range partitioning?

11. (L1 [P]) Реализовать router, который направляет key в нужный range partition

12. (L1 [P]) Реализовать хранение таблицы диапазонов в памяти на C++

13. (L1 [P]) Реализовать бинарный поиск по ranges

14. (L1 [P]) Реализовать insert/check для новой range partition

15. (L1 [P]) Реализовать simple partition pruning по предикату `WHERE key BETWEEN A AND B`

16. (L2 [T]) Почему range partitioning может приводить к hot partition?

17. (L2 [T]) Как skew в данных влияет на размер range partitions?

18. (L2 [T]) Что такое static vs dynamic partition boundaries?

19. (L2 [T]) Почему monotonically increasing keys опасны для range sharding?

20. (L2 [T]) Как range partitioning влияет на балансировку write workload?

21. (L2 [T]) Как range partitioning влияет на locality данных?

22. (L2 [T]) Почему range partitioning полезен для архивирования и retention?

23. (L2 [T]) Как planner использует partition metadata?

24. (L2 [T]) Чем logical partitioning отличается от physical placement?

25. (L2 [T]) Когда range partitioning плохо подходит для point lookup-heavy workload?

26. (L2 [P]) Реализовать split диапазона на два новых range partitions

27. (L2 [P]) Реализовать merge соседних partitions

28. (L2 [P]) Реализовать partition pruning для нескольких диапазонов

29. (L2 [P]) Реализовать migration данных при split

30. (L2 [P]) Реализовать metadata table для range partitions

31. (L2 [D]) Почему одна partition постоянно перегружена?

32. (L2 [D]) Почему запрос с range filter читает все partitions?

33. (L2 [D]) Почему после добавления новых ranges routing стал медленным?

34. (L2 [D]) Почему insert latency выросла только для “последнего” диапазона?

35. (L2 [D]) Почему range scan даёт непредсказуемую latency?

36. (L3 [T]) Как проектировать range partitioning для multi-tenant системы?

37. (L3 [T]) Как выбирать boundaries при неизвестном распределении данных?

38. (L3 [T]) Как работает auto-splitting range partitions?

39. (L3 [T]) Как сочетаются range partitions и secondary indexes?

40. (L3 [T]) Как range partitioning влияет на compaction/vacuum/rebalance?

41. (L3 [T]) Как реализуется глобальный каталог диапазонов?

42. (L3 [T]) Как маршрутизация по диапазонам кэшируется на клиентах?

43. (L3 [T]) Как обновлять range metadata без stop-the-world?

44. (L3 [T]) Как range partitioning влияет на distributed transactions?

45. (L3 [T]) Почему hotspot в “right-most partition” — классическая production проблема?

46. (L3 [P]) Реализовать concurrent range map с lock-free read path

47. (L3 [P]) Реализовать epoch/version-based обновление partition metadata

48. (L3 [P]) Реализовать background splitter hot partitions

49. (L3 [P]) Реализовать routing cache на стороне клиента

50. (L3 [P]) Реализовать наблюдаемость: counters по partition size, QPS, skew

51. (L3 [D]) Как диагностировать hotspot по последнему диапазону?

52. (L3 [D]) Почему rebalance не успевает за ростом writes?

53. (L3 [D]) Почему stale metadata на клиентах приводит к ошибкам маршрутизации?

54. (L3 [D]) Почему split partition временно ухудшает p99 latency?

55. (L3 [D]) Как найти неправильный выбор partition key в уже работающей системе?

56. (L4 [S]) Когда range partitioning лучше hash partitioning?

57. (L4 [S]) Как проектировать range boundaries под быстрый рост данных?

58. (L4 [S]) Как уменьшать hot partitions без полной миграции схемы?

59. (L4 [S]) Как сочетать range partitioning с tiered storage?

60. (L4 [S]) Как проектировать range-sharded систему под mixed OLTP + analytical workload?

---

## 🔹 Hash partitioning

61. (L1 [T]) Что такое hash partitioning?

62. (L1 [T]) Как key преобразуется в partition id?

63. (L1 [T]) Почему hash partitioning обычно даёт лучший баланс нагрузки?

64. (L1 [T]) Чем hash partitioning отличается от range partitioning?

65. (L1 [T]) Почему hash partitioning плохо подходит для range queries?

66. (L1 [T]) Что такое modulo-based partitioning?

67. (L1 [T]) Почему важно качество hash function?

68. (L1 [T]) Что такое partition skew даже при hash-based схеме?

69. (L1 [T]) Почему число partitions важно для routing?

70. (L1 [T]) Какие данные особенно удобно распределять через hash partitioning?

71. (L1 [P]) Реализовать `partition = hash(key) % N`

72. (L1 [P]) Реализовать hash router на C

73. (L1 [P]) Реализовать hash function для string keys

74. (L1 [P]) Реализовать тест равномерности распределения

75. (L1 [P]) Реализовать метрики по количеству ключей на partition

76. (L2 [T]) Почему modulo-based partitioning плохо переносит изменение числа shards?

77. (L2 [T]) Что такое skewed key distribution?

78. (L2 [T]) Почему “равномерный hash” не всегда означает равномерный workload?

79. (L2 [T]) Как hot keys влияют на hash-sharded систему?

80. (L2 [T]) Что такое virtual partitions / logical buckets?

81. (L2 [T]) Почему часто разделяют logical partitions и physical shards?

82. (L2 [T]) Как hash partitioning влияет на join/locality?

83. (L2 [T]) Почему scatter-gather часто неизбежен?

84. (L2 [T]) Как hash partitioning влияет на cross-shard transactions?

85. (L2 [T]) Когда hash partitioning хуже range даже для OLTP?

86. (L2 [P]) Реализовать слой virtual buckets поверх physical shards

87. (L2 [P]) Реализовать remapping buckets → shards

88. (L2 [P]) Реализовать hot-key detector

89. (L2 [P]) Реализовать rebalance отдельных buckets

90. (L2 [P]) Реализовать benchmark равномерности по key-space и по request distribution

91. (L2 [D]) Почему shards формально равны по размеру, но не равны по CPU?

92. (L2 [D]) Почему одна shard перегружена при “хорошем” hash?

93. (L2 [D]) Почему scatter-gather резко увеличил latency?

94. (L2 [D]) Почему после увеличения числа shards пришлось мигрировать почти все данные?

95. (L2 [D]) Почему hash routing стал bottleneck на клиенте?

96. (L3 [T]) Как проектировать hash partitioning для миллиардов keys?

97. (L3 [T]) Как выбирать число virtual buckets?

98. (L3 [T]) Как hash partitioning сочетается с replication?

99. (L3 [T]) Как поддерживать metadata о bucket placement?

100. (L3 [T]) Что такое rendezvous hashing и как оно связано с shard placement?

101. (L3 [T]) Как hash partitioning влияет на cache locality?

102. (L3 [T]) Как выбирать hash function с учётом CPU/cache/DoS risks?

103. (L3 [T]) Как работает client-side routing в hash-sharded системе?

104. (L3 [T]) Как бороться с hot buckets?

105. (L3 [T]) Почему слишком мелкие buckets тоже создают overhead?

106. (L3 [P]) Реализовать bucket map с versioned metadata

107. (L3 [P]) Реализовать incremental rebalance на уровне buckets

108. (L3 [P]) Реализовать cache-friendly hash routing table

109. (L3 [P]) Реализовать hot-bucket split/migrate

110. (L3 [P]) Реализовать simulation для bucket sizing и rebalance cost

111. (L3 [D]) Как доказать, что проблема в workload skew, а не в hash quality?

112. (L3 [D]) Почему при NUMA один routing thread тормозит сильнее остальных?

113. (L3 [D]) Почему rebalance buckets не улучшил p99 latency?

114. (L3 [D]) Почему distributed cache стала неэффективной из-за hash partitioning?

115. (L3 [D]) Как расследовать hash collision attack или pathological distribution?

116. (L4 [S]) Когда hash partitioning — лучший дефолт?

117. (L4 [S]) Как выбрать число buckets и shards для роста на 2–3 года?

118. (L4 [S]) Как проектировать hash-based routing без central coordinator в hot path?

119. (L4 [S]) Как сочетать hash partitioning и locality requirements?

120. (L4 [S]) Как мигрировать с modulo sharding на более гибкую схему?

---

## 🔹 Geo partitioning

121. (L1 [T]) Что такое geo partitioning?

122. (L1 [T]) Зачем данные распределять по регионам/странам/continent-based zones?

123. (L1 [T]) Чем geo partitioning отличается от обычного logical sharding?

124. (L1 [T]) Какие типы workload выигрывают от geo partitioning?

125. (L1 [T]) Что такое data sovereignty / data residency?

126. (L1 [T]) Почему geo partitioning может уменьшать latency?

127. (L1 [T]) Почему geo partitioning усложняет консистентность?

128. (L1 [T]) Что такое home region для данных?

129. (L1 [T]) Как geo partitioning связан с multi-region deployment?

130. (L1 [T]) Почему глобальные secondary indexes становятся сложнее?

131. (L1 [P]) Реализовать routing по региону пользователя

132. (L1 [P]) Реализовать таблицу соответствия region → shard group

133. (L1 [P]) Реализовать fallback routing для неизвестного региона

134. (L1 [P]) Реализовать placement policy для “EU only” данных

135. (L1 [P]) Реализовать простую модель latency-aware выбора региона

136. (L2 [T]) Как выбирать geo partition key?

137. (L2 [T]) Что делать с глобальными пользователями, которые перемещаются между регионами?

138. (L2 [T]) Как сочетать geo partitioning с replication?

139. (L2 [T]) Что такое follower read / local read в multi-region системе?

140. (L2 [T]) Почему cross-region transaction особенно дороги?

141. (L2 [T]) Как geo partitioning влияет на failover?

142. (L2 [T]) Что такое regional quorum?

143. (L2 [T]) Как regulatory требования влияют на placement данных?

144. (L2 [T]) Почему geo partitioning может ухудшить operational complexity?

145. (L2 [T]) Что такое nearest-region routing и когда он опасен?

146. (L2 [P]) Реализовать policy engine для region-aware placement

147. (L2 [P]) Реализовать primary region + replica regions mapping

148. (L2 [P]) Реализовать workload simulation для regional latency

149. (L2 [P]) Реализовать миграцию tenant-а между регионами

150. (L2 [P]) Реализовать geo-aware request router

151. (L2 [D]) Почему latency низкая локально, но глобально система нестабильна?

152. (L2 [D]) Почему часть запросов внезапно пошла в другой регион?

153. (L2 [D]) Почему failover нарушил data residency policy?

154. (L2 [D]) Почему cross-region трафик неожиданно вырос?

155. (L2 [D]) Почему multi-region writes резко просадили throughput?

156. (L3 [T]) Как проектировать geo partitioning для multi-tenant SaaS?

157. (L3 [T]) Как балансировать latency, residency и consistency?

158. (L3 [T]) Как работает lease/leader placement в geo-distributed system?

159. (L3 [T]) Как глобальный каталог данных хранит region placement metadata?

160. (L3 [T]) Как строить geo-aware query planning?

161. (L3 [T]) Как geo partitioning влияет на backup/restore?

162. (L3 [T]) Как проектировать global control plane и local data plane?

163. (L3 [T]) Что делать с глобальными таблицами, которые нужны во всех регионах?

164. (L3 [T]) Как строить observability по region skew и cross-region dependencies?

165. (L3 [T]) Почему geo partitioning часто требует компромисса на уровне продукта, а не только БД?

166. (L3 [P]) Реализовать metadata service для geo placement с versioning

167. (L3 [P]) Реализовать tenant relocation workflow без long downtime

168. (L3 [P]) Реализовать region-local read policy и global write policy

169. (L3 [P]) Реализовать geo-aware cache invalidation

170. (L3 [P]) Реализовать симулятор partition placement с учётом latency и compliance

171. (L3 [D]) Как доказать, что проблема в неверном placement policy, а не в сети?

172. (L3 [D]) Почему при переезде tenant-а деградировали локальные индексы и cache hit rate?

173. (L3 [D]) Почему локальный failover создал глобальную перегрузку control plane?

174. (L3 [D]) Как расследовать нарушение residency constraints после rebalance?

175. (L3 [D]) Почему часть данных стала “логически локальной”, но физически удалённой?

176. (L4 [S]) Когда geo partitioning оправдан, а когда достаточно обычной репликации?

177. (L4 [S]) Как проектировать продукт с region-aware data ownership?

178. (L4 [S]) Как избежать избыточной сложности в multi-region архитектуре?

179. (L4 [S]) Как сочетать compliance, latency и disaster recovery?

180. (L4 [S]) Как формулировать для команд чёткие правила region placement?

---

## 🔹 Consistent hashing

181. (L1 [T]) Что такое consistent hashing?

182. (L1 [T]) Какую проблему он решает по сравнению с `hash(key) % N`?

183. (L1 [T]) Что такое hash ring?

184. (L1 [T]) Как key отображается в точку на кольце?

185. (L1 [T]) Как выбирается узел для ключа?

186. (L1 [T]) Почему при добавлении нового узла перемещается только часть ключей?

187. (L1 [T]) Что такое virtual nodes?

188. (L1 [T]) Зачем нужны virtual nodes?

189. (L1 [T]) Чем consistent hashing полезен для distributed caches и KV stores?

190. (L1 [T]) Какие у него базовые недостатки?

191. (L1 [P]) Реализовать hash ring на C++

192. (L1 [P]) Реализовать поиск узла по ключу на кольце

193. (L1 [P]) Реализовать добавление узла

194. (L1 [P]) Реализовать удаление узла

195. (L1 [P]) Реализовать virtual nodes

196. (L2 [T]) Почему без virtual nodes кольцо может быть плохо сбалансировано?

197. (L2 [T]) Как выбирать число virtual nodes?

198. (L2 [T]) Как consistent hashing влияет на rebalance cost?

199. (L2 [T]) Что такое preference list / replication set на кольце?

200. (L2 [T]) Как consistent hashing сочетается с replication factor?

201. (L2 [T]) Почему locality-aware placement не всегда естественно ложится на ring?

202. (L2 [T]) Как сравнить consistent hashing и rendezvous hashing?

203. (L2 [T]) Почему membership changes требуют согласованного metadata distribution?

204. (L2 [T]) Что происходит при node churn?

205. (L2 [T]) Почему consistent hashing не решает проблему hot keys?

206. (L2 [P]) Реализовать replication set поверх hash ring

207. (L2 [P]) Реализовать weighted nodes

208. (L2 [P]) Реализовать rebalance estimator при изменении membership

209. (L2 [P]) Реализовать membership versioning

210. (L2 [P]) Реализовать мониторинг uneven ring distribution

211. (L2 [D]) Почему при добавлении одного узла moved data unexpectedly huge?

212. (L2 [D]) Почему распределение ключей по кольцу неравномерное?

213. (L2 [D]) Почему после node failure часть клиентов пишет в разные узлы?

214. (L2 [D]) Почему stale ring metadata вызывает split-brain-like routing?

215. (L2 [D]) Почему ring lookup стал CPU bottleneck?

216. (L3 [T]) Как проектировать ring metadata dissemination в distributed system?

217. (L3 [T]) Как consistent hashing влияет на cache hit rate при churn?

218. (L3 [T]) Как выбирать between ring, rendezvous hashing и bucket-based schemes?

219. (L3 [T]) Как работает incremental movement of ranges при ring update?

220. (L3 [T]) Как учитывать heterogeneous node capacity?

221. (L3 [T]) Как consistent hashing взаимодействует с failure domains?

222. (L3 [T]) Как делать placement-aware replication across racks/AZ/regions?

223. (L3 [T]) Почему множество virtual nodes может ухудшать control-plane overhead?

224. (L3 [T]) Как строить observability для ring imbalance и movement cost?

225. (L3 [T]) Как consistent hashing реализуется в real systems вроде caches/object stores?

226. (L3 [P]) Реализовать weighted consistent hashing с учётом capacity

227. (L3 [P]) Реализовать ring update protocol с atomic version switch

228. (L3 [P]) Реализовать cache for ring lookups

229. (L3 [P]) Реализовать failure-domain-aware placement поверх ring

230. (L3 [P]) Реализовать симулятор churn и key movement cost

231. (L3 [D]) Как доказать, что деградация cache hit rate вызвана churn в ring?

232. (L3 [D]) Почему weighted nodes создали неожиданный skew?

233. (L3 [D]) Почему control plane перегружен частыми membership updates?

234. (L3 [D]) Как расследовать inconsistent ring state между клиентами?

235. (L3 [D]) Почему vnodes помогли с балансом, но ухудшили recovery time?

236. (L4 [S]) Когда consistent hashing — правильный выбор, а когда нет?

237. (L4 [S]) Как выбрать между ring-based и bucket-based placement?

238. (L4 [S]) Как проектировать hashing layer для масштабирования на сотни узлов?

239. (L4 [S]) Как минимизировать movement cost без сложного control plane?

240. (L4 [S]) Как объяснить команде ограничения consistent hashing до запуска в production?

---

## 🔹 Rebalancing

241. (L1 [T]) Что такое rebalancing в sharded системе?

242. (L1 [T]) Зачем нужен rebalance?

243. (L1 [T]) Какие события обычно триггерят rebalance?

244. (L1 [T]) Чем rebalance отличается от replication?

245. (L1 [T]) Почему rebalance может быть дорогим?

246. (L1 [T]) Что такое data movement cost?

247. (L1 [T]) Почему во время rebalance возможна деградация latency?

248. (L1 [T]) Что значит online rebalance?

249. (L1 [T]) Что такое source shard и destination shard?

250. (L1 [T]) Почему rebalance должен сохранять correctness routing?

251. (L1 [P]) Реализовать простую миграцию partition между двумя shards

252. (L1 [P]) Реализовать state machine для migration job

253. (L1 [P]) Реализовать переключение routing после копирования данных

254. (L1 [P]) Реализовать copy-then-cutover workflow

255. (L1 [P]) Реализовать progress tracking для rebalance task

256. (L2 [T]) Какие есть стратегии: full rebalance, incremental rebalance, hotspot rebalance?

257. (L2 [T]) Что такое split-brain risk во время миграции?

258. (L2 [T]) Что такое dual write / dual read during migration?

259. (L2 [T]) Как обеспечить consistency при live migration?

260. (L2 [T]) Что такое cutover?

261. (L2 [T]) Почему rebalance должен учитывать CPU, memory, disk и network одновременно?

262. (L2 [T]) Почему “равный размер данных” не означает “равную нагрузку”?

263. (L2 [T]) Как backpressure используется во время rebalance?

264. (L2 [T]) Почему важно rate-limit migration traffic?

265. (L2 [T]) Как rebalance влияет на cache warmup?

266. (L2 [P]) Реализовать throttled migration worker

267. (L2 [P]) Реализовать dual-read verification при migration

268. (L2 [P]) Реализовать background consistency checker

269. (L2 [P]) Реализовать cutover с versioned metadata

270. (L2 [P]) Реализовать rollback migration при ошибке

271. (L2 [D]) Почему после rebalance система стала медленнее, хотя shards выровнялись?

272. (L2 [D]) Почему миграция идёт бесконечно долго?

273. (L2 [D]) Почему p99 latency выросла только у части tenants?

274. (L2 [D]) Почему после cutover часть запросов идёт в старый shard?

275. (L2 [D]) Почему cache miss storm случается сразу после migration?

276. (L3 [T]) Как строить online rebalance без потери данных и без долгого write freeze?

277. (L3 [T]) Как обеспечивать exactly-once/at-least-once semantics для migration steps?

278. (L3 [T]) Как проектировать migration journal/checkpoints?

279. (L3 [T]) Как rebalance сочетается с replication и failover?

280. (L3 [T]) Как обрабатывать concurrent writes в moving partition?

281. (L3 [T]) Как проверять data completeness после миграции?

282. (L3 [T]) Как выбирать, что переносить первым: hot partitions или cold partitions?

283. (L3 [T]) Как проектировать automated rebalance без oscillation?

284. (L3 [T]) Как моделировать cost rebalance на этапе capacity planning?

285. (L3 [T]) Почему rebalance — это отдельная distributed system inside the system?

286. (L3 [P]) Реализовать migration protocol: snapshot + catch-up + cutover

287. (L3 [P]) Реализовать change log replay для догонки writes

288. (L3 [P]) Реализовать validator checksum/source-destination

289. (L3 [P]) Реализовать rate-limited chunk transfer

290. (L3 [P]) Реализовать автоматический planner для выбора partitions к переносу

291. (L3 [D]) Как расследовать потерю записи во время миграции partition?

292. (L3 [D]) Почему rebalance вызывает network saturation и ломает foreground traffic?

293. (L3 [D]) Почему metadata switch завершился, а клиенты ещё долго пишут по старому маршруту?

294. (L3 [D]) Как доказать, что bottleneck rebalance — disk read, а не network?

295. (L3 [D]) Почему auto-rebalance попал в oscillation loop?

296. (L4 [S]) Когда rebalance должен быть автоматическим, а когда ручным?

297. (L4 [S]) Как проектировать систему так, чтобы rebalance был редким и дешёвым?

298. (L4 [S]) Как формулировать SLO для rebalancing operations?

299. (L4 [S]) Как балансировать скорость миграции и влияние на production latency?

300. (L4 [S]) Как строить архитектуру shard placement, устойчивую к росту, skew и hardware heterogeneity?

---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Чем partitioning отличается от sharding в практическом смысле?

302. (L2 [T]) Почему выбор partition key часто важнее выбора самой схемы partitioning?

303. (L2 [T]) Как secondary indexes усложняют shard placement?

304. (L2 [T]) Почему cross-shard joins почти всегда дорогие?

305. (L2 [T]) Как партиционирование влияет на транзакции и изоляцию?

306. (L2 [T]) Почему hot tenant и hot key — разные проблемы?

307. (L2 [T]) Как Linux network stack и TCP backpressure начинают влиять на shard migration?

308. (L2 [T]) Почему NUMA и allocator overhead могут быть видны даже на routing layer?

309. (L2 [T]) Как page cache и disk IO влияют на rebalance throughput?

310. (L2 [T]) Почему observability по shards/buckets/regions обязательна, а не optional?

311. (L2 [P]) Реализовать shard-aware benchmark: point lookup / range scan / hotspot workload

312. (L2 [P]) Реализовать dashboard метрик: shard size, QPS, rebalance lag, skew ratio

313. (L2 [P]) Реализовать trace request path через router → shard → replica

314. (L2 [P]) Реализовать chaos test: shard loss during migration

315. (L2 [P]) Реализовать synthetic hotspot generator

316. (L3 [D]) Почему после введения шардинга p50 улучшился, а p99 ухудшился?

317. (L3 [D]) Почему system-wide CPU низкий, но одна shard перегружена?

318. (L3 [D]) Как найти неправильный shard key до того, как система вырастет в 10 раз?

319. (L3 [D]) Почему cross-region rebalance сломал локальные SLO?

320. (L3 [D]) Как расследовать инцидент “данные на месте, но routing периодически неверный”?

321. (L4 [S]) Как выбирать shard key для нового продукта, если точный workload ещё неизвестен?

322. (L4 [S]) Когда выгоднее resharding, а когда — вертикально усилить hot shards?

323. (L4 [S]) Как проектировать control plane для shard metadata?

324. (L4 [S]) Как сочетать partitioning, replication и failover без взрывной сложности?

325. (L4 [S]) Какие anti-patterns в sharding architecture чаще всего приводят к painful resharding через год?

---
