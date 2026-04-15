# 🔐 13. Надёжность данных

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

## 🔹 Backup / restore

1. (L1 [T]) Что такое backup в контексте БД и storage systems?

2. (L1 [T]) Чем backup отличается от replication?

3. (L1 [T]) Почему реплика не заменяет полноценный backup?

4. (L1 [T]) Что такое restore?

5. (L1 [T]) Почему backup без регулярного restore test почти бесполезен?

6. (L1 [T]) Что такое full backup?

7. (L1 [T]) Что такое incremental backup?

8. (L1 [T]) Что такое differential backup?

9. (L1 [T]) Почему RPO и RTO важны для проектирования backup strategy?

10. (L1 [T]) Почему backup — это часть reliability, а не только ops housekeeping?

11. (L1 [P]) Реализовать full backup файловой БД на C/C++

12. (L1 [P]) Реализовать restore из полного backup-а

13. (L1 [P]) Реализовать manifest с метаданными backup-а

14. (L1 [P]) Реализовать проверку целостности backup-файлов

15. (L1 [P]) Реализовать retention policy для старых backup-ов

16. (L2 [T]) Почему hot backup сложнее cold backup?

17. (L2 [T]) Что такое crash-consistent backup?

18. (L2 [T]) Что такое application-consistent backup?

19. (L2 [T]) Почему full backup часто слишком дорогой для больших систем?

20. (L2 [T]) Почему incremental backup требует точного tracking changed pages/segments?

21. (L2 [T]) Как WAL/binlog помогают backup/restore?

22. (L2 [T]) Почему backup влияет на I/O, cache и production latency?

23. (L2 [T]) Почему backup windows становятся проблемой на больших БД?

24. (L2 [T]) Почему backup metadata так же важны, как и сами data files?

25. (L2 [T]) Почему restore time часто недооценивают сильнее, чем backup time?

26. (L2 [P]) Реализовать incremental backup на основе changed-page bitmap

27. (L2 [P]) Реализовать backup manifest: version, LSN, checksums, timestamps

28. (L2 [P]) Реализовать restore planner для full + incremental chain

29. (L2 [P]) Реализовать throttled backup reader, не убивающий foreground workload

30. (L2 [P]) Реализовать backup verification job после создания archive

31. (L2 [D]) Почему backup успешно создаётся, но restore из него не работает?

32. (L2 [D]) Почему backup window внезапно выросла с минут до часов?

33. (L2 [D]) Почему backup job вызывает рост p99 latency у БД?

34. (L2 [D]) Почему incremental chain стала слишком длинной и restore непрактичен?

35. (L2 [D]) Почему replica-based backup оказался логически неконсистентным?

36. (L3 [T]) Как проектировать backup pipeline для distributed/sharded DB?

37. (L3 [T]) Как backup взаимодействует с snapshots, WAL archiving и PITR?

38. (L3 [T]) Почему backup catalog/control plane — критическая часть системы?

39. (L3 [T]) Как проектировать consistent backup across multiple shards/partitions?

40. (L3 [T]) Почему object storage часто good durability layer for backups, но не решает restore speed?

41. (L3 [T]) Как backup влияет на page cache, buffer pool и SSD wear?

42. (L3 [T]) Почему encryption/compression backup-ов меняют trade-offs CPU vs storage vs restore time?

43. (L3 [T]) Как проектировать resumable backup job with fault tolerance?

44. (L3 [T]) Почему backup chain corruption — control-plane as much as data-plane problem?

45. (L3 [T]) Почему backup strategy должна включать drills, not just retention checkboxes?

46. (L3 [P]) Реализовать resumable backup with chunk manifests

47. (L3 [P]) Реализовать shard-aware backup coordinator

48. (L3 [P]) Реализовать background verification restore on sampled backups

49. (L3 [P]) Реализовать observability: backup lag, bytes/sec, throttling, restore readiness

50. (L3 [P]) Реализовать backup planner с выбором full vs incremental based on restore cost

51. (L3 [D]) Как доказать, что bottleneck backup — object storage upload, а не local reads?

52. (L3 [D]) Почему backup chain формально complete, но restore fails at one increment?

53. (L3 [D]) Как расследовать inconsistent multi-shard backup после failover во время job?

54. (L3 [D]) Почему backup cost резко вырос после включения compression/encryption?

55. (L3 [D]) Как найти hidden assumption, из-за которой backup good on staging but unsafe in production?

56. (L4 [S]) Как выбирать backup strategy по RPO/RTO, а не “по привычке”?

57. (L4 [S]) Когда backup стоит брать с primary, а когда с replica/snapshot layer?

58. (L4 [S]) Как строить backup platform для многих БД и many-tenant organization?

59. (L4 [S]) Как формулировать policy: backup success is not enough, restore proof required?

60. (L4 [S]) Как объяснять командам, что backup — это страховка только тогда, когда restore реально проверен?

---

## 🔹 Snapshots

61. (L1 [T]) Что такое snapshot в storage systems?

62. (L1 [T]) Чем snapshot отличается от backup?

63. (L1 [T]) Почему snapshot обычно быстрее full copy?

64. (L1 [T]) Что такое copy-on-write snapshot?

65. (L1 [T]) Что такое read-only point-in-time image данных?

66. (L1 [T]) Почему snapshot не всегда переносим как offsite backup?

67. (L1 [T]) Почему snapshot удобен для быстрых откатов и клонирования?

68. (L1 [T]) Почему snapshot сам по себе не гарантирует application consistency?

69. (L1 [T]) Что такое volume-level snapshot?

70. (L1 [T]) Что такое database-level logical snapshot?

71. (L1 [P]) Реализовать copy-on-write snapshot для простого page store

72. (L1 [P]) Реализовать read-only mount/clone snapshot-а

73. (L1 [P]) Реализовать metadata table snapshot chain

74. (L1 [P]) Реализовать snapshot create/list/delete API

75. (L1 [P]) Реализовать быстрый clone из snapshot-а для тестовой среды

76. (L2 [T]) Почему snapshot creation почти мгновенный, а storage cost растёт потом?

77. (L2 [T]) Почему COW snapshots увеличивают write amplification?

78. (L2 [T]) Почему long-lived snapshots мешают garbage collection/compaction?

79. (L2 [T]) Почему snapshot-ы влияют на performance writes?

80. (L2 [T]) Что такое crash-consistent snapshot?

81. (L2 [T]) Почему coordinated snapshot across multiple volumes/services сложен?

82. (L2 [T]) Чем filesystem snapshot отличается от storage-array/cloud-volume snapshot?

83. (L2 [T]) Почему snapshot useful for fast restore, but not necessarily enough for disaster recovery?

84. (L2 [T]) Почему snapshot retention policy важна для space consumption?

85. (L2 [T]) Почему snapshot metadata corruption особенно опасна?

86. (L2 [P]) Реализовать reference counting blocks/pages for snapshots

87. (L2 [P]) Реализовать snapshot retention and cleanup

88. (L2 [P]) Реализовать snapshot export into backup archive

89. (L2 [P]) Реализовать quiesce/unquiesce hooks around snapshot creation

90. (L2 [P]) Реализовать benchmark: write slowdown with N active snapshots

91. (L2 [D]) Почему snapshots создаются быстро, но restore from snapshot slow?

92. (L2 [D]) Почему после включения snapshots вырос write latency?

93. (L2 [D]) Почему storage usage растёт, хотя объём логических данных почти неизменен?

94. (L2 [D]) Почему deletion old snapshots вызывает massive IO spikes?

95. (L2 [D]) Почему snapshot is crash-consistent, but application state still invalid?

96. (L3 [T]) Как проектировать snapshot subsystem поверх WAL/MVCC/COW pages?

97. (L3 [T]) Как snapshot interplay with replication and failover?

98. (L3 [T]) Почему snapshot chains deepen restore/read complexity?

99. (L3 [T]) Как snapshots работают в LSM-based systems with immutable SSTables?

100. (L3 [T]) Почему snapshot management becomes metadata scalability problem?

101. (L3 [T]) Как coordinated snapshots across shards/services approximate consistency?

102. (L3 [T]) Почему snapshots и backups нужно проектировать вместе, а не как альтернативы?

103. (L3 [T]) Как snapshotting влияет на SSD wear and device-level write amplification?

104. (L3 [T]) Почему clone-from-snapshot environments often distort performance testing?

105. (L3 [T]) Как observability должна показывать snapshot depth, retained bytes and write penalty?

106. (L3 [P]) Реализовать snapshot manifest with parent links and checksums

107. (L3 [P]) Реализовать shard-consistent snapshot coordinator

108. (L3 [P]) Реализовать snapshot-aware garbage collector

109. (L3 [P]) Реализовать observability: active snapshots, retained blocks, write penalty, cleanup lag

110. (L3 [P]) Реализовать snapshot export/import pipeline

111. (L3 [D]) Как доказать, что write slowdown идёт от snapshot COW overhead, а не от WAL/fsync?

112. (L3 [D]) Почему snapshot cleanup stalls foreground traffic?

113. (L3 [D]) Как расследовать missing blocks after snapshot chain manipulation?

114. (L3 [D]) Почему multi-volume snapshot gave logically inconsistent restore?

115. (L3 [D]) Как найти snapshot policy, которая silently destroys restore economics?

116. (L4 [S]) Когда snapshots should be primary restore mechanism, а когда only convenience layer?

117. (L4 [S]) Как проектировать snapshot lifecycle in multi-tenant platform?

118. (L4 [S]) Как балансировать clone convenience, retention depth and write cost?

119. (L4 [S]) Как объяснять командам, что snapshot ≠ backup ≠ PITR, хотя пользователи часто смешивают их?

120. (L4 [S]) Как стандартизировать snapshot safety checks before teams rely on them operationally?

---

## 🔹 Point-in-time recovery (PITR)

121. (L1 [T]) Что такое point-in-time recovery?

122. (L1 [T]) Чем PITR отличается от обычного restore из backup-а?

123. (L1 [T]) Почему PITR нужен для recovery после user error, bad deploy или logical corruption?

124. (L1 [T]) Как WAL/binlog/transaction log используется в PITR?

125. (L1 [T]) Почему PITR требует базовый backup + continuous log archive?

126. (L1 [T]) Что значит “восстановить состояние на 12:03:17”?

127. (L1 [T]) Почему PITR важен при accidental DELETE/DROP/UPDATE?

128. (L1 [T]) Почему точность PITR зависит от log coverage и clock/LSN semantics?

129. (L1 [T]) Почему PITR не заменяет application-level audit/history completely?

130. (L1 [T]) Почему testing PITR сложнее, чем обычный restore?

131. (L1 [P]) Реализовать base backup + append-only log replay

132. (L1 [P]) Реализовать restore to target LSN

133. (L1 [P]) Реализовать restore to target timestamp (упрощённо)

134. (L1 [P]) Реализовать log archive rotation

135. (L1 [P]) Реализовать stop-replay-at-target recovery mode

136. (L2 [T]) Почему PITR требует непрерывной и完整ной цепочки archived logs?

137. (L2 [T]) Что такое recovery target: timestamp, LSN, transaction ID, named restore point?

138. (L2 [T]) Почему timestamp-based restore tricky under clock skew/timezone assumptions?

139. (L2 [T]) Почему logical corruption может уже присутствовать в base backup before replay?

140. (L2 [T]) Почему restore point markers полезны для deploy safety?

141. (L2 [T]) Почему partial log loss делает PITR impossible past certain point?

142. (L2 [T]) Почему PITR restore speed зависит от replay rate, not only backup size?

143. (L2 [T]) Почему long transactions complicate exact stop position?

144. (L2 [T]) Почему replication lag и log shipping design влияют на PITR readiness?

145. (L2 [T]) Почему PITR drills нужно делать against realistic incident scenarios?

146. (L2 [P]) Реализовать archived WAL catalog with gap detection

147. (L2 [P]) Реализовать named restore point markers

148. (L2 [P]) Реализовать replay progress tracker

149. (L2 [P]) Реализовать validator: no missing log segments for target interval

150. (L2 [P]) Реализовать incident simulation: mistaken DELETE then PITR to just before it

151. (L2 [D]) Почему PITR остановился раньше target time?

152. (L2 [D]) Почему restore succeeded, but desired rows still missing?

153. (L2 [D]) Почему archived logs contain gap and nobody noticed?

154. (L2 [D]) Почему PITR replay takes many hours even for modest DB size?

155. (L2 [D]) Почему restored DB consistent technically, but business state not what operators expected?

156. (L3 [T]) Как проектировать PITR for sharded/distributed DB with per-shard logs?

157. (L3 [T]) Как coordinated restore across services/shards approximates transactionally meaningful recovery?

158. (L3 [T]) Почему log archiving pipeline itself needs checksums, manifests and alerts?

159. (L3 [T]) Как design WAL format and restore markers for reliable PITR?

160. (L3 [T]) Почему PITR is both storage problem and incident-response workflow?

161. (L3 [T]) Как optimize replay: parallelism, page prefetch, incremental restore, changed-block restore?

162. (L3 [T]) Почему human operator UX matters: choosing exact target safely is hard?

163. (L3 [T]) Как PITR interacts with schema migrations and dual writes?

164. (L3 [T]) Почему compliance/legal retention affects PITR log retention economics?

165. (L3 [T]) Как observability должна показывать PITR horizon, archive freshness and replay throughput?

166. (L3 [P]) Реализовать PITR coordinator for multiple shards with target barrier

167. (L3 [P]) Реализовать archived-log integrity checker

168. (L3 [P]) Реализовать restore-time fast-forward with page prefetch

169. (L3 [P]) Реализовать operator tool: inspect restore timeline before commit

170. (L3 [P]) Реализовать observability: archive lag, gap alerts, replay MB/s, PITR horizon

171. (L3 [D]) Как доказать, что PITR failure caused by archive gap, not restore code bug?

172. (L3 [D]) Почему replay throughput low despite fast disks?

173. (L3 [D]) Как расследовать restore that crosses schema migration boundary incorrectly?

174. (L3 [D]) Почему target timestamp chosen by operators yields wrong business state?

175. (L3 [D]) Как найти earliest point where logical corruption entered the system?

176. (L4 [S]) Как выбирать PITR retention window from real business blast radius, not from round numbers?

177. (L4 [S]) Когда PITR обязательна, а когда достаточно snapshots/backups?

178. (L4 [S]) Как проектировать operator workflows, чтобы PITR under stress was safe and reversible?

179. (L4 [S]) Как объяснять, что PITR readiness measured by drills and archive integrity, not by config flags?

180. (L4 [S]) Как строить organization-wide policy around restore points before risky deploys or migrations?

---

## 🔹 Data corruption

181. (L1 [T]) Что такое data corruption?

182. (L1 [T]) Чем data corruption отличается от logical bug in application data?

183. (L1 [T]) Что такое physical corruption страницы/блока/файла?

184. (L1 [T]) Что такое silent corruption?

185. (L1 [T]) Почему corruption может появиться на диске, в памяти, в сети или в коде?

186. (L1 [T]) Почему replication может распространить corruption instead of saving you from it?

187. (L1 [T]) Почему backup может уже содержать corruption?

188. (L1 [T]) Почему corruption detection should be continuous, not only at restore time?

189. (L1 [T]) Почему corrupted metadata often worse than corrupted data page?

190. (L1 [T]) Почему early detection dramatically changes recovery options?

191. (L1 [P]) Реализовать checksum verification for stored pages

192. (L1 [P]) Реализовать simple page scrubber that scans files and verifies headers

193. (L1 [P]) Реализовать corruption injection for testing

194. (L1 [P]) Реализовать quarantine of corrupted segment/page

195. (L1 [P]) Реализовать error path: detect bad checksum and stop read/apply

196. (L2 [T]) Какие типы corruption typical for DB/storage: torn write, bit rot, partial write, lost write, memory scribble?

197. (L2 [T]) Почему power loss может привести к partial/torn page?

198. (L2 [T]) Почему ECC memory снижает, но не исключает corruption risk?

199. (L2 [T]) Почему network/storage firmware bugs тоже источник corruption?

200. (L2 [T]) Чем physical page corruption отличается от index logical inconsistency?

201. (L2 [T]) Почему end-to-end checksums важнее, чем trust in hardware?

202. (L2 [T]) Почему scrubbing/background verification нужны даже без видимых ошибок?

203. (L2 [T]) Почему corruption в archived backups/logs особенно опасна?

204. (L2 [T]) Как WAL/redo can help recover from some corruption classes?

205. (L2 [T]) Почему corruption blast radius зависит от replication/backup topology?

206. (L2 [P]) Реализовать page header with magic/version/checksum

207. (L2 [P]) Реализовать periodic scrub job over data files and backup archives

208. (L2 [P]) Реализовать distinguishable error codes for checksum mismatch vs format mismatch

209. (L2 [P]) Реализовать block-level corruption simulator

210. (L2 [P]) Реализовать index-vs-data consistency checker

211. (L2 [D]) Почему DB crashes only when reading one specific range/page?

212. (L2 [D]) Почему replication follower fails apply on one WAL segment?

213. (L2 [D]) Почему backups exist, but all recent ones share the same corrupted blocks?

214. (L2 [D]) Почему application reports “missing rows”, but issue is corrupted index not data?

215. (L2 [D]) Почему corruption detected weeks after original hardware event?

216. (L3 [T]) Как проектировать end-to-end corruption detection across memory, WAL, data pages, backups and network transfers?

217. (L3 [T]) Почему checksums alone do not solve semantic corruption?

218. (L3 [T]) Как scrubbing frequency balances IO cost and detection latency?

219. (L3 [T]) Почему self-healing from replicas requires trust boundaries and checksum comparison?

220. (L3 [T]) Как design manifests, Merkle trees or block hashes for large backup sets?

221. (L3 [T]) Почему corruption handling is incident-management problem, not only detection mechanism?

222. (L3 [T]) Как distinguish corruption from software bug causing deterministic bad writes?

223. (L3 [T]) Почему immutable storage formats often help containment of corruption?

224. (L3 [T]) Как page cache and memory corruption complicate reproduction and root cause analysis?

225. (L3 [T]) Почему corruption drills should include “can we identify exact first bad copy?” scenarios?

226. (L3 [P]) Реализовать end-to-end checksum propagation from write to backup archive

227. (L3 [P]) Реализовать background scrubber with rate limiting and reporting

228. (L3 [P]) Реализовать compare-and-repair from healthy replica for corrupted blocks

229. (L3 [P]) Реализовать Merkle-tree-like verifier for backup sets

230. (L3 [P]) Реализовать observability: corrupted pages, scrub lag, checksum failures by layer, repair attempts

231. (L3 [D]) Как доказать, что corruption originates below DB layer, not in serialization code?

232. (L3 [D]) Почему checksum mismatch happens only after restore, not during backup creation?

233. (L3 [D]) Как расследовать corruption replicated to all followers before detection?

234. (L3 [D]) Почему self-heal from replica reintroduces corruption because source not actually healthy?

235. (L3 [D]) Как найти earliest intact backup/log before corruption entered archives?

236. (L4 [S]) Как строить corruption-detection strategy for critical data systems?

237. (L4 [S]) Когда enough to detect and fail, а когда нужна automatic repair?

238. (L4 [S]) Как проектировать trust boundaries between DB, filesystem, device and backup layers?

239. (L4 [S]) Как объяснять организации, что replication and backups do not automatically imply corruption safety?

240. (L4 [S]) Как выбирать scrub frequency, archive verification depth and repair policy under cost constraints?

---

## 🔹 Checksums

241. (L1 [T]) Что такое checksum?

242. (L1 [T]) Зачем checksums нужны в storage systems?

243. (L1 [T]) Чем checksum отличается от cryptographic hash?

244. (L1 [T]) Почему checksum помогает обнаружить corruption, но не исправляет её?

245. (L1 [T]) Почему checksum нужно хранить отдельно от защищаемых данных или хотя бы в структурированном формате?

246. (L1 [T]) Где checksums обычно используют: pages, WAL records, SSTables, backups, network transfers?

247. (L1 [T]) Почему checksum page header полезен для быстрой детекции bad reads?

248. (L1 [T]) Почему checksum WAL record особенно важна для recovery?

249. (L1 [T]) Почему checksum mismatch — это reliability signal, а не просто I/O error?

250. (L1 [T]) Почему checksum verification should happen continuously, not occasionally?

251. (L1 [P]) Реализовать CRC32 checksum для page payload

252. (L1 [P]) Реализовать verify-on-read path

253. (L1 [P]) Реализовать checksum in WAL record header

254. (L1 [P]) Реализовать checksum verification during restore

255. (L1 [P]) Реализовать test, намеренно flipping bit in stored data

256. (L2 [T]) Почему checksum должен покрывать именно те байты, которые реально важны для integrity?

257. (L2 [T]) Почему checksum on compressed vs uncompressed data gives different trade-offs?

258. (L2 [T]) Почему checksums на разных уровнях нужны одновременно: page-level, file-level, manifest-level?

259. (L2 [T]) Почему torn writes могут оставлять формально корректный размер, но неверную checksum?

260. (L2 [T]) Почему checksum mismatch during WAL replay should usually stop recovery or trigger special handling?

261. (L2 [T]) Как checksum cost влияет на hot read/write path?

262. (L2 [T]) Почему hardware offload/CRC instructions matter at high throughput?

263. (L2 [T]) Чем end-to-end checksum отличается от local checksum at one layer?

264. (L2 [T]) Почему manifest checksum важна для archives and multipart backups?

265. (L2 [T]) Почему checksum cannot detect semantic bug writing wrong but internally consistent data?

266. (L2 [P]) Реализовать hierarchy: block checksum + file manifest checksum

267. (L2 [P]) Реализовать choose-once checksum algorithm in file format version

268. (L2 [P]) Реализовать benchmark checksum overhead on write/read path

269. (L2 [P]) Реализовать checksum sampling verifier for large archives

270. (L2 [P]) Реализовать compare compressed-payload checksum vs logical-record checksum

271. (L2 [D]) Почему checksum mismatch occurs only on one machine or one filesystem?

272. (L2 [D]) Почему WAL checksum failures rare but catastrophic?

273. (L2 [D]) Почему backup file checksum ok, but internal page checksums fail after restore?

274. (L2 [D]) Почему enabling checksums surfaced many old latent issues?

275. (L2 [D]) Почему checksum verification tanked throughput unexpectedly?

276. (L3 [T]) Как проектировать multi-layer checksum strategy without excessive overhead?

277. (L3 [T]) Как SIMD/CPU CRC instructions and batching reduce checksum cost?

278. (L3 [T]) Почему checksum coverage decisions are part of file format design, not post-hoc feature?

279. (L3 [T]) Как checksums interact with encryption, compression and deduplication?

280. (L3 [T]) Почему checksum validation policy matters: verify-on-read, verify-on-write, background scrub, restore-time verify?

281. (L3 [T]) Как distinguish transport corruption from at-rest corruption using checksum layering?

282. (L3 [T]) Почему recovery tooling should preserve and inspect checksum failure context?

283. (L3 [T]) Как choose between stronger checksum, faster checksum and cryptographic hash for different layers?

284. (L3 [T]) Почему checksum observability should include location, layer, recurrence and first-seen time?

285. (L3 [T]) Почему checksums are necessary but still insufficient for true data reliability?

286. (L3 [P]) Реализовать layered checksum strategy for WAL + pages + backup manifests

287. (L3 [P]) Реализовать vectorized/batched checksum computation

288. (L3 [P]) Реализовать background audit that revalidates sampled stored blocks

289. (L3 [P]) Реализовать telemetry: checksum failures by file/page/segment/layer

290. (L3 [P]) Реализовать fault injector to simulate transport vs storage corruption

291. (L3 [D]) Как доказать, что checksum failures caused by memory scribble, not disk corruption?

292. (L3 [D]) Почему page checksum failures spike after enabling compression or encryption?

293. (L3 [D]) Как расследовать mismatch between manifest checksum and inner-block checksums?

294. (L3 [D]) Почему stronger checksum algorithm fixed false negatives but introduced hot-path CPU bottleneck?

295. (L3 [D]) Как найти layer where corruption first appears when multiple checksum layers disagree?

296. (L4 [S]) Как проектировать checksum policy for entire data platform, not one engine?

297. (L4 [S]) Когда достаточно lightweight checksum, а когда нужен stronger hash/integrity scheme?

298. (L4 [S]) Как балансировать checksum coverage, CPU overhead and recovery confidence?

299. (L4 [S]) Как объяснять командам, что checksums detect corruption but do not replace backups, PITR or drills?

300. (L4 [S]) Как встроить checksum telemetry into routine reliability reviews instead of waiting for corruption incident?

---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Почему backup, snapshots и PITR решают разные классы инцидентов?

302. (L2 [T]) Почему replication не заменяет backup при corruption or operator error?

303. (L2 [T]) Как checksums, scrubbing и archive verification together improve confidence in restore?

304. (L2 [T]) Почему restore drills важнее “зелёных backup jobs”?

305. (L2 [T]) Как snapshots and PITR interact with schema migrations and dual writes?

306. (L2 [T]) Почему object storage durability не гарантирует application-level recoverability?

307. (L2 [T]) Как page cache, WAL, fsync and device caches complicate reliability reasoning?

308. (L2 [T]) Почему data corruption часто обнаруживается в одном месте, а зарождается в другом?

309. (L2 [T]) Почему metadata/control-plane reliability equally important as raw data blocks?

310. (L2 [T]) Почему true data reliability is a chain: write correctness → checksums → backups → restore proofs → incident workflow?

311. (L2 [P]) Реализовать end-to-end mini system: pages + checksums + snapshot + backup + PITR replay

312. (L2 [P]) Реализовать dashboard: backup freshness, restore success rate, PITR horizon, scrub lag, checksum failures

313. (L2 [P]) Реализовать chaos harness: power loss, torn page, lost WAL segment, corrupted backup chunk

314. (L2 [P]) Реализовать restore drill pipeline on sampled production snapshots/backups

315. (L2 [P]) Реализовать incident simulator: user DELETE, corruption, bad migration, then choose correct recovery mechanism

316. (L3 [D]) Почему все backup jobs зелёные, но restore readiness фактически нулевая?

317. (L3 [D]) Почему corruption discovered during restore spread through backups weeks earlier?

318. (L3 [D]) Как доказать, что missing data after restore caused by PITR archive gap, not by backup corruption?

319. (L3 [D]) Почему snapshot rollback worked technically but violated application invariants due to external systems?

320. (L3 [D]) Как расследовать инцидент “данные частично восстановлены, но confidence in correctness low”?

321. (L4 [S]) Как строить platform-wide data reliability program, а не набор разрозненных backup scripts?

322. (L4 [S]) Какие reliability drills should be mandatory for critical databases?

323. (L4 [S]) Как формулировать RPO/RTO/PITR/corruption-detection guarantees так, чтобы их понимали и инженеры, и бизнес?

324. (L4 [S]) Какие anti-patterns чаще всего создают ложное чувство data safety?

325. (L4 [S]) Как объяснять организации, что надёжность данных — это не feature одной БД, а дисциплина всей системы эксплуатации?
