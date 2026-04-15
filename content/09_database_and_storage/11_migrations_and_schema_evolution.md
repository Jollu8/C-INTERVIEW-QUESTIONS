# 🔄 11. Миграции и эволюция схемы

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

## 🔹 Schema migration

1. (L1 [T]) Что такое schema migration?

2. (L1 [T]) Зачем вообще нужны миграции схемы в БД?

3. (L1 [T]) Чем migration отличается от ad-hoc ручного ALTER TABLE?

4. (L1 [T]) Почему изменение схемы — это не только DDL, но и изменение поведения приложения?

5. (L1 [T]) Что такое versioned schema?

6. (L1 [T]) Почему schema changes опасны для production?

7. (L1 [T]) Что такое destructive migration?

8. (L1 [T]) Что такое additive migration?

9. (L1 [T]) Почему additive changes обычно безопаснее?

10. (L1 [T]) Почему schema migration должна быть repeatable и observable?

11. (L1 [P]) Реализовать таблицу `schema_migrations` с version tracking

12. (L1 [P]) Реализовать migration runner на C++/C с up/down шагами

13. (L1 [P]) Реализовать idempotent migration step

14. (L1 [P]) Реализовать dry-run режим для миграций

15. (L1 [P]) Реализовать логирование applied/pending/failed migrations

16. (L2 [T]) Почему изменение типа колонки может быть expensive rewrite?

17. (L2 [T]) Почему `ADD COLUMN NULL` и `ADD COLUMN NOT NULL DEFAULT ...` имеют разную стоимость?

18. (L2 [T]) Что такое metadata-only migration?

19. (L2 [T]) Почему некоторые ALTER-операции требуют table rebuild?

20. (L2 [T]) Почему миграции должны учитывать locking semantics конкретной СУБД?

21. (L2 [T]) Почему large table migration может вызвать disk/network/cache pressure?

22. (L2 [T]) Что такое migration ordering dependency?

23. (L2 [T]) Почему rollback migration сложнее, чем кажется?

24. (L2 [T]) Почему application rollout и schema rollout должны быть связаны?

25. (L2 [T]) Что такое expand/contract migration pattern?

26. (L2 [P]) Реализовать expand/contract workflow для rename column

27. (L2 [P]) Реализовать lock timeout / retry policy для DDL migration

28. (L2 [P]) Реализовать migration dependency graph

29. (L2 [P]) Реализовать checksum/validation после миграции

30. (L2 [P]) Реализовать benchmark миграции на таблице с десятками миллионов строк

31. (L2 [D]) Почему seemingly simple ALTER TABLE заблокировал writes?

32. (L2 [D]) Почему migration на staging быстрая, а в production идёт часами?

33. (L2 [D]) Почему после миграции выросла latency у unrelated queries?

34. (L2 [D]) Почему rollback не вернул систему в прежнее состояние?

35. (L2 [D]) Почему часть сервисов работает после миграции, а часть падает?

36. (L3 [T]) Как проектировать migration framework для many-service environment?

37. (L3 [T]) Почему schema registry / schema catalog важен в крупных системах?

38. (L3 [T]) Как migration взаимодействует с replication, failover и backups?

39. (L3 [T]) Почему long-running transactions и schema changes конфликтуют?

40. (L3 [T]) Как DDL locks/metadata locks влияют на runtime traffic?

41. (L3 [T]) Почему изменение индексов часто опаснее изменения колонок?

42. (L3 [T]) Как проектировать migrations для multi-tenant DB?

43. (L3 [T]) Почему migration tooling должно поддерживать pause/resume/cancel?

44. (L3 [T]) Как строить safety checks перед destructive schema change?

45. (L3 [T]) Почему schema evolution — это часть distributed systems engineering, а не только DB admin task?

46. (L3 [P]) Реализовать migration orchestrator с phased rollout

47. (L3 [P]) Реализовать metadata lock watcher и abort guard

48. (L3 [P]) Реализовать preflight checks: free disk, replication lag, long transactions

49. (L3 [P]) Реализовать pause/resume for long-running migration job

50. (L3 [P]) Реализовать observability: progress %, rows touched, lock wait, lag impact

51. (L3 [D]) Как доказать, что bottleneck миграции — metadata lock, а не data copy?

52. (L3 [D]) Почему после DDL вырос replication lag?

53. (L3 [D]) Как расследовать migration, которая застревает только на одном shard-е?

54. (L3 [D]) Почему migration прошла, но optimizer/plans внезапно ухудшились?

55. (L3 [D]) Как найти hidden dependency сервисов на старую схему?

56. (L4 [S]) Как строить schema migration policy для большой инженерной организации?

57. (L4 [S]) Когда schema changes должны проходить только через expand/contract?

58. (L4 [S]) Как проектировать DB platform так, чтобы risky migrations были редкими?

59. (L4 [S]) Как формулировать SLO/SLA для schema migration operations?

60. (L4 [S]) Как объяснять командам, что “простая миграция” в production — это всегда hypothesis with blast radius?

---

## 🔹 Backward / forward compatibility

61. (L1 [T]) Что такое backward compatibility схемы?

62. (L1 [T]) Что такое forward compatibility схемы?

63. (L1 [T]) Почему совместимость важна при независимом деплое сервисов?

64. (L1 [T]) Почему удаление поля почти всегда опаснее добавления поля?

65. (L1 [T]) Почему nullable/additive columns обычно безопаснее?

66. (L1 [T]) Что значит “новый код работает со старой схемой”?

67. (L1 [T]) Что значит “старый код работает с новой схемой”?

68. (L1 [T]) Почему compatibility — это свойство всей системы, а не только БД?

69. (L1 [T]) Почему сериализация и schema evolution связаны?

70. (L1 [T]) Почему rename column часто не backward-compatible change?

71. (L1 [P]) Реализовать compatibility test matrix: old app ↔ new schema

72. (L1 [P]) Реализовать compatibility test: new app ↔ old schema

73. (L1 [P]) Реализовать additive column rollout

74. (L1 [P]) Реализовать safe deprecation flag для старого поля

75. (L1 [P]) Реализовать integration tests на mixed-version environment

76. (L2 [T]) Почему `NOT NULL` constraint часто требует phased rollout?

77. (L2 [T]) Почему enum expansion и enum narrowing имеют разные риски?

78. (L2 [T]) Почему изменение семантики поля опаснее изменения типа?

79. (L2 [T]) Что такое wire compatibility vs storage compatibility?

80. (L2 [T]) Почему default values могут скрыть compatibility bugs?

81. (L2 [T]) Почему readers and writers evolve differently?

82. (L2 [T]) Почему compatibility должна проверяться на уровне API/ORM/SQL и data semantics?

83. (L2 [T]) Что такое tolerant reader pattern?

84. (L2 [T]) Почему generated code/ORM migrations могут ломать compatibility silently?

85. (L2 [T]) Почему backward-compatible storage change не обязательно backward-compatible для analytics/jobs?

86. (L2 [P]) Реализовать tolerant reader для optional fields

87. (L2 [P]) Реализовать phased `NOT NULL` migration: add nullable → backfill → enforce

88. (L2 [P]) Реализовать mixed-version canary test harness

89. (L2 [P]) Реализовать schema diff checker с compatibility rules

90. (L2 [P]) Реализовать automated contract tests для old/new readers/writers

91. (L2 [D]) Почему новый сервис пишет данные, которые старый не может прочитать?

92. (L2 [D]) Почему migration была “additive”, но старый код всё равно упал?

93. (L2 [D]) Почему default value скрыла частичный rollout bug?

94. (L2 [D]) Почему совместимость ломается только на старых бэкфилленных строках?

95. (L2 [D]) Почему часть клиентов работает, а часть видит null/unknown field errors?

96. (L3 [T]) Как формализовать compatibility policy для data contracts?

97. (L3 [T]) Почему backward/forward compatibility должна учитывать не только schema shape, но и invariants?

98. (L3 [T]) Как строить compatibility gates в CI/CD?

99. (L3 [T]) Как schema compatibility связана с event sourcing / CDC / replication pipelines?

100. (L3 [T]) Почему data consumers, которых “не видно”, особенно опасны для schema evolution?

101. (L3 [T]) Как multi-region/multi-version deployments усложняют compatibility reasoning?

102. (L3 [T]) Почему compatibility tests должны включать production-like old data?

103. (L3 [T]) Как version skew между services, jobs и DB clients создаёт hidden breakage?

104. (L3 [T]) Почему compatibility budget — это продуктовая и организационная политика, а не только техдизайн?

105. (L3 [T]) Как schema registry или contract ownership уменьшают migration risk?

106. (L3 [P]) Реализовать compatibility linter для migration PRs

107. (L3 [P]) Реализовать version-skew test environment

108. (L3 [P]) Реализовать semantic compatibility checks on sampled production rows

109. (L3 [P]) Реализовать consumer inventory / dependency graph for schema users

110. (L3 [P]) Реализовать rollout gate: block destructive change if old readers still active

111. (L3 [D]) Как доказать, что инцидент вызван compatibility break, а не corrupted data?

112. (L3 [D]) Почему mixed-version fleet ломается только после partial deploy?

113. (L3 [D]) Как расследовать невидимого consumer-а, который зависит от старого поля?

114. (L3 [D]) Почему compatibility tests зелёные, а production ломается на edge-case rows?

115. (L3 [D]) Как найти semantic incompatibility, когда типы формально совместимы?

116. (L4 [S]) Как строить organizational compatibility policy для схем и data contracts?

117. (L4 [S]) Когда allowed only additive changes, а когда возможны controlled breaking changes?

118. (L4 [S]) Как проектировать платформу, чтобы teams не ломали друг другу schema evolution?

119. (L4 [S]) Как объяснять, что backward/forward compatibility — это про rollout safety, а не про “красивую схему”?

120. (L4 [S]) Как балансировать скорость разработки и строгие compatibility guarantees?

---

## 🔹 Online migrations

121. (L1 [T]) Что такое online migration?

122. (L1 [T]) Чем online migration отличается от offline migration?

123. (L1 [T]) Почему online migration важна для high-availability systems?

124. (L1 [T]) Почему online migration почти всегда сложнее?

125. (L1 [T]) Что значит “без долгого stop-the-world”?

126. (L1 [T]) Почему online migration обычно делается поэтапно?

127. (L1 [T]) Что такое chunked migration?

128. (L1 [T]) Почему throttling важен для online migration?

129. (L1 [T]) Почему online migration должна быть resumable?

130. (L1 [T]) Почему verification после online migration обязательна?

131. (L1 [P]) Реализовать chunked backfill job для таблицы

132. (L1 [P]) Реализовать migration progress table с checkpoint-ами

133. (L1 [P]) Реализовать throttled row copier

134. (L1 [P]) Реализовать resumable online migration workflow

135. (L1 [P]) Реализовать compare old/new table row counts during migration

136. (L2 [T]) Почему chunk size влияет и на throughput, и на p99 latency?

137. (L2 [T]) Почему online migration должна учитывать replication lag?

138. (L2 [T]) Почему full table scan во время migration может убить OLTP?

139. (L2 [T]) Что такое shadow table / ghost table?

140. (L2 [T]) Почему triggers/binlog/CDC часто используются для online migration?

141. (L2 [T]) Что такое cutover в online migration?

142. (L2 [T]) Почему final cutover — самый рискованный шаг?

143. (L2 [T]) Почему online index build — отдельный special case online migration?

144. (L2 [T]) Почему long-running writes осложняют consistent cutover?

145. (L2 [T]) Почему online migration должна уметь деградировать gracefully или останавливаться?

146. (L2 [P]) Реализовать shadow table migration

147. (L2 [P]) Реализовать change-capture stream для догонки изменений

148. (L2 [P]) Реализовать chunk scheduler с adaptive throttling

149. (L2 [P]) Реализовать cutover flag switch

150. (L2 [P]) Реализовать verify-by-checksum for migrated chunks

151. (L2 [D]) Почему online migration не блокирует writes, но всё равно ломает latency?

152. (L2 [D]) Почему replication lag взлетел во время migration?

153. (L2 [D]) Почему cutover прошёл, но часть reads ушла в старую таблицу?

154. (L2 [D]) Почему migration идёт бесконечно, хотя бэкфилл почти закончен?

155. (L2 [D]) Почему chunked migration даёт sawtooth CPU/IO pattern?

156. (L3 [T]) Как проектировать online migration protocol: snapshot → catch-up → verify → cutover?

157. (L3 [T]) Почему exactly-once semantics редко достижима “бесплатно” в migration pipelines?

158. (L3 [T]) Как dual reads/verification снижают риск silent divergence?

159. (L3 [T]) Как проектировать chunk boundaries, чтобы избежать hotspot ranges?

160. (L3 [T]) Как online migrations сочетаются с partitioned/sharded systems?

161. (L3 [T]) Почему online migration tooling должно быть topology-aware?

162. (L3 [T]) Как observability должна разделять copy lag, change-catch-up lag и cutover readiness?

163. (L3 [T]) Почему page cache/buffer pool pollution от migration может быть главным production effect?

164. (L3 [T]) Как metadata locks и final rename/swap влияют на blast radius?

165. (L3 [T]) Почему successful online migration — это orchestration problem, а не только SQL trick?

166. (L3 [P]) Реализовать migration state machine: init/copy/catchup/verify/cutover/done

167. (L3 [P]) Реализовать lag-aware throttling by observed p99 latency

168. (L3 [P]) Реализовать per-chunk checksums + retry

169. (L3 [P]) Реализовать dual-read verifier on sampled traffic

170. (L3 [P]) Реализовать automated cutover readiness checklist

171. (L3 [D]) Как доказать, что degradation caused by online migration comes from cache pollution, not locks?

172. (L3 [D]) Почему change-catch-up не догоняет high-write workload?

173. (L3 [D]) Как расследовать cutover, где logical switch завершился, а часть app-нodes осталась на старом path?

174. (L3 [D]) Почему verification зелёная по row counts, но данные всё равно расходятся?

175. (L3 [D]) Как найти unsafe assumption в online migration script, которая проявляется только на одном shard-е?

176. (L4 [S]) Когда online migration обязательна, а когда честнее сделать maintenance window?

177. (L4 [S]) Как строить migration platform, usable не только staff-инженерами?

178. (L4 [S]) Как выбирать between shadow table, in-place DDL, dual-write, CDC-based copy?

179. (L4 [S]) Как формулировать risk budget и rollback strategy для online migration?

180. (L4 [S]) Как объяснять командам, что “online” не значит “free” по latency/cost/complexity?

---

## 🔹 Dual writes

181. (L1 [T]) Что такое dual writes?

182. (L1 [T]) Зачем dual writes используются в миграциях?

183. (L1 [T]) Почему dual writes помогают переходу между старой и новой схемой/таблицей?

184. (L1 [T]) Почему dual writes опасны?

185. (L1 [T]) Что значит писать одновременно в old path и new path?

186. (L1 [T]) Почему partial failure делает dual writes tricky?

187. (L1 [T]) Почему порядок записи old/new path важен?

188. (L1 [T]) Что такое dual read как companion к dual write?

189. (L1 [T]) Почему idempotency важна при dual writes?

190. (L1 [T]) Почему dual writes — это не то же самое, что replication?

191. (L1 [P]) Реализовать write path: write old table + new table

192. (L1 [P]) Реализовать flag-controlled dual writes

193. (L1 [P]) Реализовать compare old/new payload after write

194. (L1 [P]) Реализовать idempotent retry для dual-write operation

195. (L1 [P]) Реализовать failure injection: second write fails after first succeeds

196. (L2 [T]) Почему dual writes создают риск divergence?

197. (L2 [T]) Что такое write ordering bug в dual-write workflow?

198. (L2 [T]) Почему exactly-once почти недостижима без дополнительного механизма?

199. (L2 [T]) Что такое outbox/event-based alternative to direct dual writes?

200. (L2 [T]) Почему retries без deduplication могут ухудшить divergence?

201. (L2 [T]) Почему dual writes особенно опасны across two different datastores?

202. (L2 [T]) Как dual writes влияют на latency и tail risk?

203. (L2 [T]) Почему read-after-write semantics усложняются при partial cutover?

204. (L2 [T]) Почему transactional DB + non-transactional sink — классическая ловушка?

205. (L2 [T]) Почему verification and reconciliation обязательны рядом с dual writes?

206. (L2 [P]) Реализовать outbox table как safer alternative

207. (L2 [P]) Реализовать dedup key для dual-write retries

208. (L2 [P]) Реализовать dual-read compare on sampled requests

209. (L2 [P]) Реализовать reconciliation job для divergent rows

210. (L2 [P]) Реализовать metrics: old_write_ok, new_write_ok, mismatch_rate, retry_rate

211. (L2 [D]) Почему old path и new path расходятся при редких таймаутах?

212. (L2 [D]) Почему dual writes зелёные по логам, но данные в новой таблице неполные?

213. (L2 [D]) Почему retries создали дубликаты в новом хранилище?

214. (L2 [D]) Почему dual-write rollout резко ухудшил p99 latency?

215. (L2 [D]) Почему divergence видна только на update/delete, но не на insert?

216. (L3 [T]) Как проектировать dual writes с bounded inconsistency window?

217. (L3 [T]) Как outbox/CDC pattern снижает риск compared to direct dual writes?

218. (L3 [T]) Почему sequencing and idempotency keys критичны?

219. (L3 [T]) Как dual writes взаимодействуют с replication lag и failover?

220. (L3 [T]) Почему cross-service ownership делает dual writes ещё опаснее?

221. (L3 [T]) Как verification sampling и full reconciliation дополняют друг друга?

222. (L3 [T]) Как строить write fencing / version checks during migration?

223. (L3 [T]) Почему dual writes иногда лучше заменить “single writer + derived copy”?

224. (L3 [T]) Как observability должна показывать divergence as first-class signal?

225. (L3 [T]) Почему dual writes — это distributed transaction problem в disguise?

226. (L3 [P]) Реализовать outbox + async applier pipeline

227. (L3 [P]) Реализовать versioned writes with compare-and-set

228. (L3 [P]) Реализовать reconciliation state machine: detect/fix/reverify

229. (L3 [P]) Реализовать dual-read shadow validation on live traffic

230. (L3 [P]) Реализовать simulator partial failures and retries for dual-write path

231. (L3 [D]) Как доказать, что divergence caused by retry ordering, not data corruption?

232. (L3 [D]) Почему mismatch rate низкий в среднем, но catastrophic for one tenant?

233. (L3 [D]) Как расследовать divergence после region failover during dual-write rollout?

234. (L3 [D]) Почему direct dual writes кажутся простыми в code review, но ломаются под network jitter?

235. (L3 [D]) Как найти safe cutover point при длительном периоде dual writes?

236. (L4 [S]) Когда dual writes оправданы, а когда их надо запрещать policy-level?

237. (L4 [S]) Как выбрать between direct dual writes, outbox, CDC, shadow copy?

238. (L4 [S]) Как строить platform primitives, чтобы команды не писали unsafe dual writes вручную?

239. (L4 [S]) Как объяснять продуктовым командам цену длительного периода dual writes?

240. (L4 [S]) Как формулировать exit criteria из dual-write phase?

---

## 🔹 Data backfill

241. (L1 [T]) Что такое data backfill?

242. (L1 [T]) Зачем backfill нужен при schema evolution?

243. (L1 [T]) Чем backfill отличается от migration DDL?

244. (L1 [T]) Почему backfill часто делается асинхронно?

245. (L1 [T]) Почему backfill может занимать часы или дни?

246. (L1 [T]) Что такое chunked backfill?

247. (L1 [T]) Почему backfill должен быть restartable?

248. (L1 [T]) Почему verification после backfill обязательна?

249. (L1 [T]) Почему backfill может влиять на reads, writes и caches?

250. (L1 [T]) Почему исторические данные часто содержат edge cases для backfill?

251. (L1 [P]) Реализовать chunked backfill job по primary key ranges

252. (L1 [P]) Реализовать cursor/checkpoint для resume

253. (L1 [P]) Реализовать per-chunk progress metrics

254. (L1 [P]) Реализовать validate-after-write for backfilled rows

255. (L1 [P]) Реализовать throttled backfill worker

256. (L2 [T]) Почему backfill по primary key range лучше, чем OFFSET/LIMIT scan?

257. (L2 [T]) Почему order of backfill matters for caches/hot ranges?

258. (L2 [T]) Почему high-write tables требуют catch-up logic после initial backfill?

259. (L2 [T]) Что такое idempotent backfill transform?

260. (L2 [T]) Почему backfill часто создаёт replication lag?

261. (L2 [T]) Почему backfill может конфликтовать с compaction/vacuum/checkpoints?

262. (L2 [T]) Как backfill влияет на buffer pool/page cache pollution?

263. (L2 [T]) Почему backfill correctness нельзя проверять только row count?

264. (L2 [T]) Почему backfill на hot table и cold archive table — fundamentally different problems?

265. (L2 [T]) Почему backfill needs kill-switch?

266. (L2 [P]) Реализовать PK-range scheduler for backfill

267. (L2 [P]) Реализовать checksum-based chunk verification

268. (L2 [P]) Реализовать lag-aware throttling on replica/app latency

269. (L2 [P]) Реализовать catch-up pass for rows changed during backfill

270. (L2 [P]) Реализовать dashboard: rows done, rows/sec, retry count, mismatch count

271. (L2 [D]) Почему backfill почти закончен, но never reaches zero delta?

272. (L2 [D]) Почему backfill reads saturate disk, хотя writes небольшие?

273. (L2 [D]) Почему latency приложения растёт только на одном диапазоне ключей?

274. (L2 [D]) Почему после backfill row counts совпадают, но запросы дают разные результаты?

275. (L2 [D]) Почему backfill job безопасна днём на staging и опасна ночью в production?

276. (L3 [T]) Как проектировать backfill for live mutable dataset?

277. (L3 [T]) Почему snapshot + catch-up + verify — стандартный pattern?

278. (L3 [T]) Как backfill сочетается с dual writes and online cutover?

279. (L3 [T]) Как строить chunking strategy, учитывающую skew и hotspot tenants?

280. (L3 [T]) Почему sampled verification и full verification обе нужны в разных фазах?

281. (L3 [T]) Как observability должна разделять scan cost, transform cost, write cost and verification lag?

282. (L3 [T]) Почему backfill tooling должно быть tenant-aware/shard-aware?

283. (L3 [T]) Как backfill interacts with MVCC, vacuum, tombstones, compaction?

284. (L3 [T]) Почему historical bad data and null semantics often break transforms late in the process?

285. (L3 [T]) Почему backfill — это data pipeline with correctness requirements, а не просто long SQL UPDATE?

286. (L3 [P]) Реализовать snapshot-based backfill with change capture catch-up

287. (L3 [P]) Реализовать per-tenant quota and throttling

288. (L3 [P]) Реализовать verifier: semantic equality old vs new derived fields

289. (L3 [P]) Реализовать backfill planner with adaptive chunk sizing

290. (L3 [P]) Реализовать simulation of mutable workload during long backfill

291. (L3 [D]) Как доказать, что bottleneck backfill — verification or transform CPU, not scan IO?

292. (L3 [D]) Почему replication lag остался высоким даже после slowdown backfill?

293. (L3 [D]) Как расследовать one-off bad rows that poison the whole backfill?

294. (L3 [D]) Почему after pause/resume часть чанков обработана дважды и данные разошлись?

295. (L3 [D]) Как найти правильный cutover point, если backfill never fully “quiets down”?

296. (L4 [S]) Когда backfill делать inline, а когда отдельным pipeline/job framework?

297. (L4 [S]) Как проектировать reusable backfill platform for many teams?

298. (L4 [S]) Как выбирать safety vs speed vs cost for large backfills?

299. (L4 [S]) Как строить policy: no cutover without verified backfill completeness?

300. (L4 [S]) Как объяснять командам, что backfill — это migration risk multiplier, а не “просто догрузка старых данных”?

---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Почему schema migration, compatibility, online migration, dual writes и backfill нужно проектировать как одну программу изменений, а не отдельные шаги?

302. (L2 [T]) Почему additive schema change может всё равно требовать сложный backfill и dual writes?

303. (L2 [T]) Как replication lag, locks и page cache pollution делают migrations production-risky?

304. (L2 [T]) Почему optimizer/planner/indexes могут неожиданно измениться после schema evolution?

305. (L2 [T]) Как MVCC/long transactions влияют на online DDL and backfill?

306. (L2 [T]) Почему retries, idempotency и observability обязательны для migration tooling?

307. (L2 [T]) Почему “row counts match” — очень слабый сигнал correctness после migration?

308. (L2 [T]) Как sharding/partitioning усложняют rollout, backfill и cutover coordination?

309. (L2 [T]) Почему migration incidents почти всегда связаны с hidden consumers and mixed versions?

310. (L2 [T]) Почему эволюция схемы — это вопрос не только storage, но и distributed system semantics?

311. (L2 [P]) Реализовать end-to-end migration harness: expand schema → dual write → backfill → verify → cutover → contract

312. (L2 [P]) Реализовать dashboard: migration progress, replication lag, lock waits, mismatch rate, rollback readiness

313. (L2 [P]) Реализовать chaos tests: fail mid-backfill, fail during cutover, stale app node after schema switch

314. (L2 [P]) Реализовать canary rollout for one tenant/shard before global migration

315. (L2 [P]) Реализовать automated post-cutover verification suite

316. (L3 [D]) Почему schema migration технически успешна, но бизнес-данные логически сломаны?

317. (L3 [D]) Почему migration проходит на большинстве shard-ов, но один shard умирает по p99/lag?

318. (L3 [D]) Как доказать, что проблема caused by hidden old readers, not by DB corruption?

319. (L3 [D]) Почему dual writes + backfill + partial deploy создали divergence storm?

320. (L3 [D]) Как расследовать инцидент “схема новая, данные почти все на месте, но система ведёт себя нестабильно”?

321. (L4 [S]) Как строить platform-level migration strategy для быстрорастущей компании?

322. (L4 [S]) Какие migration patterns стоит стандартизировать, а какие запретить?

323. (L4 [S]) Как выбирать between safety, speed, cost and operational complexity in schema evolution?

324. (L4 [S]) Как встроить migration reviews, compatibility checks и invariant verification в SDLC?

325. (L4 [S]) Как объяснить инженерной организации, что schema evolution — это один из самых недооценённых источников production incidents?

