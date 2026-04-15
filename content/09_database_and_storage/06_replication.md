# 🔁 6. Репликация

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

## 🔹 Leader-follower

1. (L1 [T]) Что такое leader-follower replication?

2. (L1 [T]) Какие роли у leader и follower?

3. (L1 [T]) Почему writes обычно идут только в leader?

4. (L1 [T]) Почему reads иногда можно направлять на follower?

5. (L1 [T]) Что такое replication log?

6. (L1 [T]) Чем physical replication отличается от logical replication?

7. (L1 [T]) Почему follower должен применять изменения в правильном порядке?

8. (L1 [T]) Что такое failover в leader-follower архитектуре?

9. (L1 [T]) Что такое promotion follower to leader?

10. (L1 [T]) Какие базовые преимущества и недостатки leader-follower схемы?

11. (L1 [P]) Реализовать простой leader, отправляющий append-only log на follower

12. (L1 [P]) Реализовать follower apply loop

13. (L1 [P]) Реализовать sequence number / LSN для replicated log

14. (L1 [P]) Реализовать catch-up follower после временного отставания

15. (L1 [P]) Реализовать read path: leader-only и follower-read

16. (L2 [T]) Что такое replication slot / checkpoint / offset?

17. (L2 [T]) Как leader понимает, насколько follower отстал?

18. (L2 [T]) Почему сетевой reorder сам по себе не должен ломать репликацию?

19. (L2 [T]) Почему follower apply может быть bottleneck даже при быстрой сети?

20. (L2 [T]) Как leader-follower влияет на read-your-writes consistency?

21. (L2 [T]) Почему stale reads — типичная проблема follower reads?

22. (L2 [T]) Что такое semi-sync replication?

23. (L2 [T]) Что такое failover gap и lost commits?

24. (L2 [T]) Почему replication тесно связана с WAL/binlog?

25. (L2 [T]) Что такое log shipping vs streaming replication?

26. (L2 [P]) Реализовать ack от follower на последний применённый LSN

27. (L2 [P]) Реализовать streaming replication поверх TCP

28. (L2 [P]) Реализовать snapshot + log catch-up для нового follower

29. (L2 [P]) Реализовать heartbeat между leader и follower

30. (L2 [P]) Реализовать lag metrics: bytes lag, time lag, apply lag

31. (L2 [D]) Почему follower сильно отстаёт, хотя сеть не загружена?

32. (L2 [D]) Почему reads с follower иногда возвращают старые данные?

33. (L2 [D]) Почему failover привёл к потере последних записей?

34. (L2 [D]) Почему leader CPU низкий, но lag растёт?

35. (L2 [D]) Почему один follower тормозит, а остальные нет?

36. (L3 [T]) Как проектировать replication pipeline: log generation → ship → receive → fsync → apply?

37. (L3 [T]) Как WAL format влияет на репликацию?

38. (L3 [T]) Чем logical replication сложнее physical?

39. (L3 [T]) Как реализовать ordered apply в многопоточной системе?

40. (L3 [T]) Что такое parallel replication apply?

41. (L3 [T]) Как replication взаимодействует с MVCC snapshots?

42. (L3 [T]) Как строится failover-safe commit acknowledgment?

43. (L3 [T]) Почему page cache Linux может искажать perceived replication durability?

44. (L3 [T]) Как network backpressure влияет на replication throughput?

45. (L3 [T]) Почему leader-follower просто выглядит только на диаграмме, но не в production?

46. (L3 [P]) Реализовать replication sender/receiver с bounded queues

47. (L3 [P]) Реализовать parallel apply worker pool с сохранением commit order

48. (L3 [P]) Реализовать flow control между leader и follower

49. (L3 [P]) Реализовать incremental snapshot transfer

50. (L3 [P]) Реализовать observability: send lag, receive lag, fsync lag, apply lag

51. (L3 [D]) Как доказать, что lag вызван disk flush на follower, а не сетью?

52. (L3 [D]) Почему parallel apply увеличил throughput, но сломал commit ordering?

53. (L3 [D]) Почему после switch traffic на follower p99 резко вырос?

54. (L3 [D]) Как расследовать split-brain после неудачного failover?

55. (L3 [D]) Почему snapshot transfer убивает foreground latency?

56. (L4 [S]) Когда leader-follower — правильный default?

57. (L4 [S]) Как проектировать failover без лишней потери данных?

58. (L4 [S]) Как решать, можно ли давать reads с followers?

59. (L4 [S]) Как балансировать durability, latency и failover complexity?

60. (L4 [S]) Как проектировать replication layer для собственной C++ БД?

---

## 🔹 Multi-leader

61. (L1 [T]) Что такое multi-leader replication?

62. (L1 [T]) Чем multi-leader отличается от leader-follower?

63. (L1 [T]) Почему multi-leader удобен для geo-distributed writes?

64. (L1 [T]) Почему conflicts здесь неизбежны?

65. (L1 [T]) Что такое conflict resolution?

66. (L1 [T]) Почему multi-leader сложнее operationally?

67. (L1 [T]) Что такое write-write conflict?

68. (L1 [T]) Что такое last-write-wins?

69. (L1 [T]) Почему clocks влияют на conflict resolution?

70. (L1 [T]) В каких сценариях multi-leader особенно полезен?

71. (L1 [P]) Реализовать два leader-а, обменивающихся update log

72. (L1 [P]) Реализовать conflict detector по key/version

73. (L1 [P]) Реализовать last-write-wins resolution

74. (L1 [P]) Реализовать timestamp-based versioning

75. (L1 [P]) Реализовать логирование конфликтов для postmortem

76. (L2 [T]) Почему LWW может терять данные?

77. (L2 [T]) Что такое causal ordering?

78. (L2 [T]) Почему wall clock — плохой источник истины?

79. (L2 [T]) Что такое vector clocks?

80. (L2 [T]) Чем business conflict отличается от storage-level conflict?

81. (L2 [T]) Почему network partition делает multi-leader особенно tricky?

82. (L2 [T]) Как replication topology влияет на convergence?

83. (L2 [T]) Почему loops в replication graph опасны?

84. (L2 [T]) Что такое idempotent apply в multi-leader?

85. (L2 [T]) Почему schema changes в multi-leader сложнее?

86. (L2 [P]) Реализовать vector clock для объекта

87. (L2 [P]) Реализовать conflict queue для ручного разбора

88. (L2 [P]) Реализовать idempotent replay replicated updates

89. (L2 [P]) Реализовать anti-entropy sync между узлами

90. (L2 [P]) Реализовать detection циклической репликации

91. (L2 [D]) Почему данные “сходятся”, но пользователь видит потерянные обновления?

92. (L2 [D]) Почему конфликтов резко стало больше после открытия нового региона?

93. (L2 [D]) Почему одна и та же запись переписывается по кругу?

94. (L2 [D]) Почему clocks drift привёл к странным LWW результатам?

95. (L2 [D]) Почему один DC постоянно “проигрывает” в conflict resolution?

96. (L3 [T]) Как проектировать multi-leader replication без бесконечных loops?

97. (L3 [T]) Как CRDT-подход соотносится с multi-leader storage?

98. (L3 [T]) Как строить causality tracking с приемлемым overhead?

99. (L3 [T]) Как multi-leader влияет на secondary indexes и uniqueness constraints?

100. (L3 [T]) Почему uniqueness в multi-leader особенно трудна?

101. (L3 [T]) Как topology-aware replication снижает latency и conflict cost?

102. (L3 [T]) Как проектировать convergence guarantees?

103. (L3 [T]) Как строить audit trail для конфликтов?

104. (L3 [T]) Как работает async reconciliation в multi-leader системе?

105. (L3 [T]) Когда multi-leader лучше заменить архитектурой “single-writer per shard”?

106. (L3 [P]) Реализовать anti-entropy gossip sync

107. (L3 [P]) Реализовать conflict resolver plug-in API

108. (L3 [P]) Реализовать per-key ownership policy для снижения конфликтов

109. (L3 [P]) Реализовать metrics: conflict rate, convergence lag, replay lag

110. (L3 [P]) Реализовать симулятор partitions и conflict storms

111. (L3 [D]) Как доказать, что проблема в topology loops, а не в apply bug?

112. (L3 [D]) Почему after reconciliation данные формально консистентны, но бизнес-логика сломана?

113. (L3 [D]) Почему conflict resolver стал bottleneck CPU?

114. (L3 [D]) Почему anti-entropy traffic неожиданно съел весь межрегиональный bandwidth?

115. (L3 [D]) Как расследовать редкий conflict, зависящий от порядка доставки событий?

116. (L4 [S]) Когда multi-leader оправдан, а когда это trap?

117. (L4 [S]) Как минимизировать conflict surface на уровне продуктовой модели данных?

118. (L4 [S]) Когда выбрать async conflict resolution, а когда синхронный отказ записи?

119. (L4 [S]) Как объяснить командам ограничения multi-leader до запуска в production?

120. (L4 [S]) Как проектировать geo-write систему так, чтобы не утонуть в reconciliation?

---

## 🔹 Leaderless (Dynamo-style)

121. (L1 [T]) Что такое leaderless replication?

122. (L1 [T]) Чем leaderless отличается от leader-follower и multi-leader?

123. (L1 [T]) Что такое coordinator node?

124. (L1 [T]) Что такое replication factor N?

125. (L1 [T]) Что такое quorum read и quorum write?

126. (L1 [T]) Что означают параметры N, R, W?

127. (L1 [T]) Почему при `R + W > N` ожидается лучшая согласованность?

128. (L1 [T]) Что такое sloppy quorum?

129. (L1 [T]) Что такое hinted handoff?

130. (L1 [T]) Что такое read repair?

131. (L1 [P]) Реализовать coordinator, рассылающий write на N реплик

132. (L1 [P]) Реализовать quorum write с ожиданием W ACK

133. (L1 [P]) Реализовать quorum read с чтением R реплик

134. (L1 [P]) Реализовать read repair

135. (L1 [P]) Реализовать hinted handoff queue

136. (L2 [T]) Почему `R + W > N` не гарантирует строгую консистентность в реальном мире?

137. (L2 [T]) Что такое version vector в leaderless системе?

138. (L2 [T]) Почему concurrent writes могут порождать siblings?

139. (L2 [T]) Что такое anti-entropy repair?

140. (L2 [T]) Почему sloppy quorum помогает availability, но усложняет consistency?

141. (L2 [T]) Что такое coordinator failure during write?

142. (L2 [T]) Как leaderless replication ведёт себя при network partition?

143. (L2 [T]) Почему tombstones особенно важны в leaderless KV store?

144. (L2 [T]) Как read repair влияет на tail latency?

145. (L2 [T]) Почему hot keys особенно болезненны для quorum systems?

146. (L2 [P]) Реализовать version vectors

147. (L2 [P]) Реализовать sibling detection и merge

148. (L2 [P]) Реализовать anti-entropy background repair

149. (L2 [P]) Реализовать sloppy quorum fallback

150. (L2 [P]) Реализовать per-replica freshness tracking

151. (L2 [D]) Почему quorum read иногда возвращает старую версию?

152. (L2 [D]) Почему hinted handoff queue бесконечно растёт?

153. (L2 [D]) Почему read repair улучшил correctness, но ухудшил p99 latency?

154. (L2 [D]) Почему часть keys стала иметь множество siblings?

155. (L2 [D]) Почему coordinator стал bottleneck при горячих ключах?

156. (L3 [T]) Как проектировать coordinator path без лишних копий и сериализации?

157. (L3 [T]) Как vector clocks масштабируются на большое число writers?

158. (L3 [T]) Как Merkle trees помогают anti-entropy?

159. (L3 [T]) Как leaderless replication сочетается с consistent hashing?

160. (L3 [T]) Как replication factor и topology влияют на failure tolerance?

161. (L3 [T]) Почему “eventual consistency” — это не одна конкретная гарантия?

162. (L3 [T]) Как проектировать bounded staleness поверх leaderless core?

163. (L3 [T]) Как строить observability для quorum failures и repair debt?

164. (L3 [T]) Почему coordinator locality сильно влияет на latency?

165. (L3 [T]) Когда Dynamo-style схема лучше, чем consensus-based replication?

166. (L3 [P]) Реализовать Merkle tree diff для anti-entropy

167. (L3 [P]) Реализовать dynamic quorum tuning

168. (L3 [P]) Реализовать background repair scheduler

169. (L3 [P]) Реализовать quorum trace logging по ключу

170. (L3 [P]) Реализовать симулятор partitions, sloppy quorum и handoff recovery

171. (L3 [D]) Как доказать, что проблема в repair debt, а не в hash ring placement?

172. (L3 [D]) Почему после recovery ноды stale data держится дольше ожидаемого?

173. (L3 [D]) Почему quorum формально достигнут, но клиент всё равно видит старое значение?

174. (L3 [D]) Как расследовать write loss при coordinator crash?

175. (L3 [D]) Почему anti-entropy трафик неожиданно saturate-ит диски и сеть?

176. (L4 [S]) Когда leaderless replication оправдана?

177. (L4 [S]) Как выбирать N/R/W под разные SLA?

178. (L4 [S]) Когда eventual consistency подходит продукту, а когда нет?

179. (L4 [S]) Как минимизировать conflict/repair complexity в Dynamo-style системе?

180. (L4 [S]) Как объяснять командам реальные guarantees quorum-based replication?

---

## 🔹 Sync vs async replication

181. (L1 [T]) Что такое synchronous replication?

182. (L1 [T]) Что такое asynchronous replication?

183. (L1 [T]) Чем они отличаются с точки зрения commit path?

184. (L1 [T]) Почему sync replication обычно увеличивает write latency?

185. (L1 [T]) Почему async replication допускает replication lag?

186. (L1 [T]) Что такое semi-sync replication?

187. (L1 [T]) Почему async replication может привести к потере последних записей при failover?

188. (L1 [T]) Почему sync replication может снижать availability?

189. (L1 [T]) Как выбор sync/async зависит от расстояния между DC?

190. (L1 [T]) Почему не существует бесплатной strong durability across regions?

191. (L1 [P]) Реализовать commit, который ждёт ACK от replica

192. (L1 [P]) Реализовать async replication queue

193. (L1 [P]) Реализовать configurable mode: sync / async / semi-sync

194. (L1 [P]) Реализовать таймаут ожидания replica ACK

195. (L1 [P]) Реализовать метрики commit latency по режимам

196. (L2 [T]) Что именно должен подтвердить follower при sync replication: receive, fsync или apply?

197. (L2 [T]) Почему receive ACK и durable ACK — не одно и то же?

198. (L2 [T]) Что такое commit quorum?

199. (L2 [T]) Как sync replication влияет на throughput?

200. (L2 [T]) Почему p99 latency в sync mode зависит от самой медленной replica?

201. (L2 [T]) Как semi-sync уменьшает риск loss без полного sync penalty?

202. (L2 [T]) Почему async queue может стать скрытым memory bomb?

203. (L2 [T]) Как backpressure строится для async replication?

204. (L2 [T]) Почему batching полезен и в sync, и в async режимах?

205. (L2 [T]) Как sync/async влияет на failover semantics?

206. (L2 [P]) Реализовать sync ACK после durable flush

207. (L2 [P]) Реализовать batching для replicated commits

208. (L2 [P]) Реализовать bounded async queue с backpressure

209. (L2 [P]) Реализовать semi-sync policy “wait for 1 durable replica”

210. (L2 [P]) Реализовать admission control при росте replication lag

211. (L2 [D]) Почему переключение на sync replication убило throughput?

212. (L2 [D]) Почему async mode периодически теряет bursts записей при аварии?

213. (L2 [D]) Почему commit latency “зубчатая” в semi-sync?

214. (L2 [D]) Почему очередь async replication растёт быстрее, чем успевает опустошаться?

215. (L2 [D]) Почему одна медленная replica деградирует весь cluster commit path?

216. (L3 [T]) Как проектировать durable ACK protocol?

217. (L3 [T]) Как Linux fsync, page cache и storage write cache влияют на perceived sync replication?

218. (L3 [T]) Как flow control связывает foreground writes и background replication?

219. (L3 [T]) Как групповые коммиты работают при sync replication?

220. (L3 [T]) Как строить graceful degradation между sync и async режимами?

221. (L3 [T]) Как управлять tail latency в geo-sync репликации?

222. (L3 [T]) Как проектировать safe failover для async system?

223. (L3 [T]) Как observability должна разделять send lag, durable lag и apply lag?

224. (L3 [T]) Почему async replication часто выглядит “быстрой”, пока не случится failover?

225. (L3 [T]) Как выбирать sync level для разных таблиц/тенантов/классов данных?

226. (L3 [P]) Реализовать commit quorum с разными типами ACK

227. (L3 [P]) Реализовать adaptive batching под network RTT

228. (L3 [P]) Реализовать failover gate, запрещающий promotion слишком stale replica

229. (L3 [P]) Реализовать lag-aware routing и write admission

230. (L3 [P]) Реализовать симулятор sync/async trade-offs на разных RTT и disk latency

231. (L3 [D]) Как доказать, что problem root cause — slow durable ACK, а не CPU?

232. (L3 [D]) Почему semi-sync иногда ведёт себя почти как async?

233. (L3 [D]) Почему после failover “успешно подтверждённые” записи пропали?

234. (L3 [D]) Как расследовать ложное ощущение durability из-за storage cache?

235. (L3 [D]) Почему adaptive mode oscillates между sync и async?

236. (L4 [S]) Как выбирать sync vs async по умолчанию для продукта?

237. (L4 [S]) Когда стоит давать пользователям разные durability tiers?

238. (L4 [S]) Как проектировать multi-region replication без разрушения latency SLA?

239. (L4 [S]) Как документировать реальные guarantees commit acknowledgment?

240. (L4 [S]) Как объяснить бизнесу цену “не терять ни одной записи”?

---

## 🔹 Replication lag

241. (L1 [T]) Что такое replication lag?

242. (L1 [T]) В каких единицах его можно измерять?

243. (L1 [T]) Чем send lag отличается от apply lag?

244. (L1 [T]) Почему lag важен для correctness, а не только для performance?

245. (L1 [T]) Почему follower может отставать даже при низком network RTT?

246. (L1 [T]) Почему large transactions часто создают lag spikes?

247. (L1 [T]) Как lag влияет на stale reads?

248. (L1 [T]) Почему lag опасен для failover?

249. (L1 [T]) Что такое replica freshness?

250. (L1 [T]) Почему one-number lag metric почти всегда недостаточна?

251. (L1 [P]) Реализовать измерение lag в байтах логов

252. (L1 [P]) Реализовать измерение lag по времени коммита

253. (L1 [P]) Реализовать отдельные метрики receive/apply lag

254. (L1 [P]) Реализовать health-check replica freshness

255. (L1 [P]) Реализовать alert на превышение lag threshold

256. (L2 [T]) Какие основные причины replication lag: network, disk, CPU, lock contention, apply serialization?

257. (L2 [T]) Почему large batch write может создать хвост lag на минуты?

258. (L2 [T]) Почему DDL/maintenance операции часто ломают lag?

259. (L2 [T]) Как single-threaded apply ограничивает throughput?

260. (L2 [T]) Почему lag не всегда монотонно убывает после всплеска?

261. (L2 [T]) Как lag влияет на read routing policy?

262. (L2 [T]) Почему “реплика жива” и “реплика безопасна для чтения” — разные состояния?

263. (L2 [T]) Что такое delayed replica и зачем она нужна?

264. (L2 [T]) Почему clock skew мешает time-based lag measurement?

265. (L2 [T]) Как lag взаимодействует с checkpoint/vacuum/compaction на replica?

266. (L2 [P]) Реализовать lag-aware read router

267. (L2 [P]) Реализовать throttle writes при росте lag

268. (L2 [P]) Реализовать apply worker backlog queue

269. (L2 [P]) Реализовать replica admission policy: safe/unsafe for reads

270. (L2 [P]) Реализовать benchmark lag under bursty workload

271. (L2 [D]) Почему lag растёт только ночью?

272. (L2 [D]) Почему replica догоняет днём, но не ночью?

273. (L2 [D]) Почему после large transaction lag не падает часами?

274. (L2 [D]) Почему reads с replicas иногда внезапно “старее”, чем обычно?

275. (L2 [D]) Почему lag вырос после включения compression/encryption?

276. (L3 [T]) Как строить detailed lag pipeline observability?

277. (L3 [T]) Как распараллелить apply, не нарушая ordering semantics?

278. (L3 [T]) Как lag связан с Linux I/O scheduler, page cache и fsync latency?

279. (L3 [T]) Как network buffering и TCP window влияют на perceived lag?

280. (L3 [T]) Как проектировать bounded-staleness reads?

281. (L3 [T]) Как оценивать failover safety по lag metrics?

282. (L3 [T]) Почему lag должен быть per-shard/per-table/per-tenant, а не только per-node?

283. (L3 [T]) Как отличать receive backlog от apply contention?

284. (L3 [T]) Как hot keys и lock conflicts на replica увеличивают lag?

285. (L3 [T]) Почему lag — это often symptom, not root cause?

286. (L3 [P]) Реализовать pipeline tracing: generate → send → receive → durable → apply

287. (L3 [P]) Реализовать replay scheduler для parallel apply

288. (L3 [P]) Реализовать lag heatmap по shards/tenants

289. (L3 [P]) Реализовать bounded-staleness read API

290. (L3 [P]) Реализовать симулятор lag under disk/network/CPU bottlenecks

291. (L3 [D]) Как доказать, что lag вызван contention на apply lock, а не сетью?

292. (L3 [D]) Почему replica metrics выглядят нормальными, но failover unsafe?

293. (L3 [D]) Как расследовать lag spike каждые 5 минут?

294. (L3 [D]) Почему после оптимизации network lag уменьшился, а stale reads нет?

295. (L3 [D]) Почему одна shard стабильно отстаёт при одинаковом объёме данных?

296. (L4 [S]) Какие lag SLO реально полезны, а какие вводят в заблуждение?

297. (L4 [S]) Как строить read-from-replica стратегию без скрытых correctness багов?

298. (L4 [S]) Как проектировать replication так, чтобы lag был предсказуемым?

299. (L4 [S]) Как решать, когда отставшую replica надо исключать из serving path?

300. (L4 [S]) Как объяснять продуктовым командам, что low average lag не равен strong consistency?

---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Чем replication отличается от sharding в терминах целей и trade-offs?

302. (L2 [T]) Как replication взаимодействует с WAL, checkpoints и recovery?

303. (L2 [T]) Почему MVCC и replication вместе создают дополнительные сложности для vacuum/GC?

304. (L2 [T]) Как leader election связан с failover replication topology?

305. (L2 [T]) Почему reads from replica ломают read-your-writes и monotonic reads?

306. (L2 [T]) Как replication влияет на secondary indexes?

307. (L2 [T]) Почему unique constraints особенно сложны в multi-leader и leaderless системах?

308. (L2 [T]) Как Linux network stack, socket buffers и TCP backpressure влияют на replication?

309. (L2 [T]) Как allocator, memcpy и serialization overhead становятся bottleneck в replication sender/receiver?

310. (L2 [T]) Почему observability по replication pipeline обязательна для senior/staff уровня?

311. (L2 [P]) Реализовать end-to-end benchmark: leader write → replicate → follower read

312. (L2 [P]) Реализовать dashboard: commit rate, lag, ACK latency, failover safety margin

313. (L2 [P]) Реализовать chaos test: packet loss, delayed ACK, follower disk stall

314. (L2 [P]) Реализовать verification tool: compare leader and replica state by checksum

315. (L2 [P]) Реализовать tenant-aware replication throttling

316. (L3 [D]) Почему после включения репликации p50 почти не изменился, а p99 резко вырос?

317. (L3 [D]) Почему cluster выдерживает обычный трафик, но ломается на failover drill?

318. (L3 [D]) Как найти, теряются ли записи из-за async failover или из-за client retry bugs?

319. (L3 [D]) Почему network bandwidth свободен, но replication throughput упёрся?

320. (L3 [D]) Как расследовать инцидент “данные не потерялись, но часть клиентов видела старое состояние”?

321. (L4 [S]) Как выбрать replication model под новый продукт: leader-follower, multi-leader или leaderless?

322. (L4 [S]) Как сочетать replication, partitioning и geo-placement без взрывной сложности?

323. (L4 [S]) Какие anti-patterns в replication architecture чаще всего приводят к painful production incidents?

324. (L4 [S]) Как проектировать degradation modes при lag, partition и partial DC outage?

325. (L4 [S]) Как формулировать пользователям и внутренним командам точные consistency/durability guarantees?

---

