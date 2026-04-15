# ⚙️ 7. Storage engine internals


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

## 🔹 WAL (write-ahead log)

1. (L1 [T]) Что такое WAL (write-ahead log)?

2. (L1 [T]) Зачем storage engine нужен WAL?

3. (L1 [T]) Почему запись в WAL должна происходить до изменения data pages?

4. (L1 [T]) Чем WAL отличается от data file?

5. (L1 [T]) Что такое commit record в WAL?

6. (L1 [T]) Что такое redo log?

7. (L1 [T]) Что такое undo log и чем он отличается от WAL?

8. (L1 [T]) Почему append-only лог обычно быстрее random write?

9. (L1 [T]) Что такое crash recovery в контексте WAL?

10. (L1 [T]) Почему fsync важен для durability WAL?

11. (L1 [P]) Реализовать append-only WAL файл на C

12. (L1 [P]) Реализовать запись log record с type/LSN/payload

13. (L1 [P]) Реализовать commit marker

14. (L1 [P]) Реализовать recovery, читающий WAL после падения

15. (L1 [P]) Реализовать checksum для log record

16. (L2 [T]) Что такое LSN и зачем он нужен?

17. (L2 [T]) Почему pageLSN нужен для recovery?

18. (L2 [T]) Что такое group commit?

19. (L2 [T]) Почему WAL часто становится bottleneck на write-heavy workload?

20. (L2 [T]) Что такое WAL buffer?

21. (L2 [T]) Почему batching записей в WAL улучшает throughput?

22. (L2 [T]) Что такое force vs no-force policy?

23. (L2 [T]) Что такое steal vs no-steal policy?

24. (L2 [T]) Почему torn write опасен для WAL?

25. (L2 [T]) Почему page cache ОС не равен durability?

26. (L2 [P]) Реализовать in-memory WAL buffer с flush thread

27. (L2 [P]) Реализовать LSN allocator

28. (L2 [P]) Реализовать group commit для нескольких потоков

29. (L2 [P]) Реализовать pageLSN update при модификации страницы

30. (L2 [P]) Реализовать failpoint-тесты: crash до/после fsync

31. (L2 [D]) Почему committed transaction пропала после crash?

32. (L2 [D]) Почему WAL file растёт слишком быстро?

33. (L2 [D]) Почему fsync latency даёт пилообразный график?

34. (L2 [D]) Почему commit throughput проседает при росте concurrency?

35. (L2 [D]) Почему recovery после падения занимает слишком долго?

36. (L3 [T]) Как устроен WAL pipeline: generate → buffer → write → flush → durable ack?

37. (L3 [T]) Как ARIES использует WAL?

38. (L3 [T]) Что такое physiological logging?

39. (L3 [T]) Как WAL взаимодействует с buffer pool?

40. (L3 [T]) Почему commit order и flush order не всегда одно и то же?

41. (L3 [T]) Как WAL организуется по сегментам/файлам?

42. (L3 [T]) Как log recycling влияет на производительность?

43. (L3 [T]) Почему SSD/NVMe меняют дизайн WAL, но не отменяют fsync semantics?

44. (L3 [T]) Как Linux page cache, writeback и storage cache влияют на perceived durability?

45. (L3 [T]) Как проектировать WAL format для backward compatibility и recovery robustness?

46. (L3 [P]) Реализовать сегментированный WAL с rotation

47. (L3 [P]) Реализовать background flush scheduler

48. (L3 [P]) Реализовать recovery phases: analysis / redo / undo (упрощённо)

49. (L3 [P]) Реализовать WAL archiving / recycling

50. (L3 [P]) Реализовать метрики: write lag, flush lag, durable lag, bytes/sec

51. (L3 [D]) Как доказать, что bottleneck именно в WAL fsync, а не в data file flush?

52. (L3 [D]) Почему group commit улучшил throughput, но ухудшил p99?

53. (L3 [D]) Почему page cache скрывает реальные проблемы durability на тестах?

54. (L3 [D]) Почему после смены filesystem поведение WAL изменилось?

55. (L3 [D]) Как расследовать повреждение WAL после power loss?

56. (L4 [S]) Как выбирать durability guarantees для разных классов данных?

57. (L4 [S]) Когда допустим semi-durable WAL mode?

58. (L4 [S]) Как проектировать WAL для embedded C/C++ storage engine?

59. (L4 [S]) Как минимизировать commit latency без подрыва correctness?

60. (L4 [S]) Как строить observability для WAL path на production?

---

## 🔹 SSTables

61. (L1 [T]) Что такое SSTable?

62. (L1 [T]) Почему SSTable immutable?

63. (L1 [T]) Какую роль SSTable играет в LSM-based engine?

64. (L1 [T]) Что обычно хранится внутри SSTable?

65. (L1 [T]) Почему записи в SSTable отсортированы по ключу?

66. (L1 [T]) Что такое data blocks в SSTable?

67. (L1 [T]) Что такое index block?

68. (L1 [T]) Что такое footer / metadata block?

69. (L1 [T]) Почему SSTable удобна для sequential IO?

70. (L1 [T]) Почему delete в SSTable обычно представляется tombstone-записью?

71. (L1 [P]) Реализовать простейший SSTable writer

72. (L1 [P]) Реализовать сортировку memtable и flush в SSTable

73. (L1 [P]) Реализовать бинарный поиск по index block

74. (L1 [P]) Реализовать reader для SSTable

75. (L1 [P]) Реализовать metadata/footer с offsets блоков

76. (L2 [T]) Что такое sparse index внутри SSTable?

77. (L2 [T]) Что такое block-based format?

78. (L2 [T]) Зачем нужен bloom filter для SSTables?

79. (L2 [T]) Почему lookup может требовать проверки нескольких SSTables?

80. (L2 [T]) Что такое block cache?

81. (L2 [T]) Почему compression часто делается по блокам?

82. (L2 [T]) Что такое prefix compression ключей в SSTable?

83. (L2 [T]) Почему range scans по SSTables обычно эффективны?

84. (L2 [T]) Как tombstones влияют на read path?

85. (L2 [T]) Почему большое количество SSTables ухудшает reads?

86. (L2 [P]) Реализовать sparse index

87. (L2 [P]) Реализовать bloom filter для SSTable

88. (L2 [P]) Реализовать block cache

89. (L2 [P]) Реализовать block-level compression

90. (L2 [P]) Реализовать merge iterator по нескольким SSTables

91. (L2 [D]) Почему point lookup деградировал со временем?

92. (L2 [D]) Почему bloom filter не даёт ожидаемого выигрыша?

93. (L2 [D]) Почему range scan начал читать слишком много блоков?

94. (L2 [D]) Почему disk usage растёт быстрее объёма живых данных?

95. (L2 [D]) Почему чтения стали CPU-bound, а не IO-bound?

96. (L3 [T]) Как устроены SSTable formats в RocksDB/LevelDB-подобных системах?

97. (L3 [T]) Как выбирается block size и index granularity?

98. (L3 [T]) Как partitioned index/filter улучшают locality?

99. (L3 [T]) Как SSTables взаимодействуют с block cache и OS page cache?

100. (L3 [T]) Почему mmap и pread/read ведут себя по-разному для SSTable reads?

101. (L3 [T]) Как устроены restart points для prefix-compressed keys?

102. (L3 [T]) Как проектировать format evolution без ломания старых файлов?

103. (L3 [T]) Как checksum и corruption detection встроены в SSTable?

104. (L3 [T]) Как SSTable design зависит от SSD vs HDD?

105. (L3 [T]) Как строить efficient iterators для scan across levels?

106. (L3 [P]) Реализовать restart-point based prefix compression

107. (L3 [P]) Реализовать partitioned bloom / partitioned index

108. (L3 [P]) Реализовать corruption checker для SSTable blocks

109. (L3 [P]) Реализовать zero-copy block read (где уместно)

110. (L3 [P]) Реализовать benchmark для разных block sizes

111. (L3 [D]) Как доказать, что bottleneck в block cache misses, а не в compaction?

112. (L3 [D]) Почему после изменения block size ухудшился throughput?

113. (L3 [D]) Почему page faults выросли после перехода на mmap?

114. (L3 [D]) Как расследовать corruption в одном SSTable среди тысяч?

115. (L3 [D]) Почему iterator allocation/memcpy стал bottleneck в scan-heavy workload?

116. (L4 [S]) Как выбирать SSTable format под конкретный workload?

117. (L4 [S]) Когда стоит делать более крупные blocks, а когда более мелкие?

118. (L4 [S]) Как балансировать compression ratio и CPU cost?

119. (L4 [S]) Как проектировать SSTable layout под cold/hot data?

120. (L4 [S]) Как эволюционировать SSTable format без painful migrations?

---

## 🔹 Compaction

121. (L1 [T]) Что такое compaction в LSM engine?

122. (L1 [T]) Зачем нужна compaction?

123. (L1 [T]) Как compaction уменьшает количество SSTables?

124. (L1 [T]) Как compaction удаляет obsolete versions и tombstones?

125. (L1 [T]) Почему compaction — это не просто merge файлов?

126. (L1 [T]) Что такое minor compaction / flush?

127. (L1 [T]) Что такое major compaction?

128. (L1 [T]) Почему compaction создаёт дополнительную нагрузку на диск?

129. (L1 [T]) Почему compaction может увеличивать latency foreground запросов?

130. (L1 [T]) Что такое compaction debt?

131. (L1 [P]) Реализовать merge двух SSTables

132. (L1 [P]) Реализовать удаление obsolete versions при merge

133. (L1 [P]) Реализовать обработку tombstones в compaction

134. (L1 [P]) Реализовать background compaction worker

135. (L1 [P]) Реализовать простейший scheduler compaction jobs

136. (L2 [T]) Чем leveled compaction отличается от tiered/size-tiered?

137. (L2 [T]) Почему разные compaction strategies дают разный trade-off read/write amplification?

138. (L2 [T]) Что такое overlap между SSTables и почему он важен?

139. (L2 [T]) Почему compaction может вызывать write stalls?

140. (L2 [T]) Как compaction влияет на block cache efficiency?

141. (L2 [T]) Почему tombstone cleanup нельзя делать слишком агрессивно?

142. (L2 [T]) Что такое compaction priority?

143. (L2 [T]) Как size ratio уровней влияет на compaction cost?

144. (L2 [T]) Почему compaction scheduler должен учитывать IO bandwidth?

145. (L2 [T]) Что такое subcompactions / parallel compaction?

146. (L2 [P]) Реализовать leveled compaction policy

147. (L2 [P]) Реализовать size-tiered compaction policy

148. (L2 [P]) Реализовать scoring function для выбора compaction candidates

149. (L2 [P]) Реализовать rate limiting compaction

150. (L2 [P]) Реализовать compaction backlog metrics

151. (L2 [D]) Почему disk usage внезапно вырос во время compaction?

152. (L2 [D]) Почему compaction идёт постоянно и не догоняет workload?

153. (L2 [D]) Почему foreground writes начинают stall-иться?

154. (L2 [D]) Почему после compaction cache hit rate падает?

155. (L2 [D]) Почему p99 latency скачет каждые несколько минут?

156. (L3 [T]) Как проектировать compaction scheduler для SSD/NVMe?

157. (L3 [T]) Как compaction сочетается с snapshots и long-running readers?

158. (L3 [T]) Как compaction влияет на space amplification?

159. (L3 [T]) Почему trivial move compaction иногда возможна, а иногда нет?

160. (L3 [T]) Как устроен parallel compaction без нарушения sorted order?

161. (L3 [T]) Как compaction взаимодействует с checksums, bloom filters и index rebuild?

162. (L3 [T]) Как проектировать backpressure между writes и compaction?

163. (L3 [T]) Почему compaction может saturate memory bandwidth, а не только disk?

164. (L3 [T]) Как observability должна разделять compaction debt, stall time и amp factors?

165. (L3 [T]) Как проектировать manual compaction и background compaction policies?

166. (L3 [P]) Реализовать parallel compaction по key ranges

167. (L3 [P]) Реализовать compaction planner с учётом overlap и score

168. (L3 [P]) Реализовать write stall control на основе backlog

169. (L3 [P]) Реализовать compaction traces для postmortem

170. (L3 [P]) Реализовать симулятор compaction strategies на synthetic workloads

171. (L3 [D]) Как доказать, что lag или stalls вызваны compaction debt, а не WAL?

172. (L3 [D]) Почему compaction CPU высокий даже на NVMe?

173. (L3 [D]) Как расследовать starvation: одни ranges compact-ятся, другие нет?

174. (L3 [D]) Почему после tuning compaction throughput вырос, а read latency ухудшилась?

175. (L3 [D]) Как диагностировать, что bottleneck — metadata/manifest locking, а не IO?

176. (L4 [S]) Как выбрать compaction strategy под write-heavy vs read-heavy workload?

177. (L4 [S]) Когда стоит предпочесть tiered compaction, а когда leveled?

178. (L4 [S]) Как проектировать engine так, чтобы compaction не разрушала p99?

179. (L4 [S]) Как строить SLA вокруг неизбежной background maintenance?

180. (L4 [S]) Как объяснять продуктовым командам цену tombstones, snapshots и retention на LSM engine?

---

## 🔹 Write amplification

181. (L1 [T]) Что такое write amplification?

182. (L1 [T]) Почему write amplification важна для storage engines?

183. (L1 [T]) Почему LSM engines склонны к write amplification?

184. (L1 [T]) Чем logical write отличается от physical bytes written?

185. (L1 [T]) Почему rewrite данных во время compaction увеличивает WA?

186. (L1 [T]) Почему WAL тоже вносит вклад в write amplification?

187. (L1 [T]) Как tombstones влияют на WA?

188. (L1 [T]) Почему маленькие update-ы могут приводить к большим physical write?

189. (L1 [T]) Как write amplification влияет на SSD lifetime?

190. (L1 [T]) Почему WA — это метрика и correctness, и стоимости?

191. (L1 [P]) Реализовать счётчик logical bytes written

192. (L1 [P]) Реализовать счётчик physical bytes written

193. (L1 [P]) Реализовать метрику WA = physical / logical

194. (L1 [P]) Реализовать отчёт по WA для WAL + compaction + flush

195. (L1 [P]) Реализовать synthetic workload для измерения WA

196. (L2 [T]) Какие компоненты дают write amplification в B-Tree engine?

197. (L2 [T]) Какие компоненты дают WA в LSM engine?

198. (L2 [T]) Как размер memtable влияет на WA?

199. (L2 [T]) Как compaction policy влияет на WA?

200. (L2 [T]) Почему small random writes особенно дороги?

201. (L2 [T]) Как compression влияет на measured WA?

202. (L2 [T]) Почему overwrite и append-only workloads дают разный WA?

203. (L2 [T]) Что такое device-level WA и почему он отличается от DB-level WA?

204. (L2 [T]) Как page size/block size влияют на WA?

205. (L2 [T]) Почему high update churn по hot keys создаёт disproportionate WA?

206. (L2 [P]) Реализовать breakdown WA по источникам

207. (L2 [P]) Реализовать benchmark WA для overwrite vs append workloads

208. (L2 [P]) Реализовать сравнение leveled vs tiered compaction по WA

209. (L2 [P]) Реализовать per-level WA metrics

210. (L2 [P]) Реализовать alert на аномальный рост WA

211. (L2 [D]) Почему SSD writes в системе намного выше клиентского ingress?

212. (L2 [D]) Почему после изменения compaction policy вырос WA?

213. (L2 [D]) Почему tombstone-heavy workload уничтожает диск?

214. (L2 [D]) Почему WAL recycle не уменьшил write volume?

215. (L2 [D]) Почему after compression WA по байтам снизился, а latency нет?

216. (L3 [T]) Как проектировать storage engine с низким WA без разрушения reads?

217. (L3 [T]) Как write amplification связана с read amplification и space amplification?

218. (L3 [T]) Как SSD FTL добавляет hidden device-level WA?

219. (L3 [T]) Как выравнивание IO по erase block/zone влияет на WA?

220. (L3 [T]) Как snapshots/retention/TTL policies влияют на WA?

221. (L3 [T]) Как hot/cold data separation может снизить WA?

222. (L3 [T]) Как batching, coalescing и larger memtables уменьшают WA?

223. (L3 [T]) Как Linux buffered IO vs direct IO влияет на наблюдаемую write path efficiency?

224. (L3 [T]) Как измерять WA корректно в production, а не на synthetic benchmark?

225. (L3 [T]) Почему нельзя минимизировать WA изолированно от остальных метрик?

226. (L3 [P]) Реализовать per-key / per-range churn analysis для WA

227. (L3 [P]) Реализовать hot/cold partitioning симулятор

228. (L3 [P]) Реализовать device-aware IO alignment benchmark

229. (L3 [P]) Реализовать WA heatmap по уровням / tenants / tables

230. (L3 [P]) Реализовать what-if model для tuning memtable / compaction parameters

231. (L3 [D]) Как доказать, что write amplification вызвана churn, а не просто высоким ingress?

232. (L3 [D]) Почему after bigger memtables WA снизилась, но recovery time вырос?

233. (L3 [D]) Как расследовать расхождение между DB-level WA и SSD-level telemetry?

234. (L3 [D]) Почему per-tenant WA сильно различается при одинаковом объёме данных?

235. (L3 [D]) Как диагностировать, что write path saturate-ится memory copies, а не диском?

236. (L4 [S]) Как выбирать acceptable WA budget для продукта?

237. (L4 [S]) Когда стоит жертвовать WA ради лучшего read latency?

238. (L4 [S]) Как проектировать storage tiers под workloads с разным churn?

239. (L4 [S]) Как объяснять бизнесу связь WA, стоимости SSD и latency?

240. (L4 [S]) Как строить roadmap оптимизаций write path, не ломая recovery/correctness?

---

## 🔹 Read amplification

241. (L1 [T]) Что такое read amplification?

242. (L1 [T]) Почему read amplification важна для storage engines?

243. (L1 [T]) Почему LSM engine может иметь высокую read amplification?

244. (L1 [T]) Чем point lookup и range scan отличаются по read amplification?

245. (L1 [T]) Почему множество SSTables увеличивает read amplification?

246. (L1 [T]) Как bloom filters помогают снижать read amplification?

247. (L1 [T]) Почему secondary indexes тоже могут увеличивать RA?

248. (L1 [T]) Почему cache misses усиливают read amplification?

249. (L1 [T]) Как stale versions и tombstones увеличивают стоимость чтения?

250. (L1 [T]) Почему read amplification — это не только IO, но и CPU work?

251. (L1 [P]) Реализовать счётчик logical reads vs physical block reads

252. (L1 [P]) Реализовать метрику RA для point lookups

253. (L1 [P]) Реализовать метрику RA для range scans

254. (L1 [P]) Реализовать tracing read path через memtable + SSTables + cache

255. (L1 [P]) Реализовать benchmark для lookup across N SSTables

256. (L2 [T]) Почему leveled compaction уменьшает RA по сравнению с tiered?

257. (L2 [T]) Как block size влияет на RA?

258. (L2 [T]) Почему маленький block cache приводит к большому RA?

259. (L2 [T]) Как read amplification проявляется в B-Tree engines?

260. (L2 [T]) Почему index lookup + table lookup — форма read amplification?

261. (L2 [T]) Как covering index уменьшает RA?

262. (L2 [T]) Почему scans на HDD и SSD по-разному чувствительны к RA?

263. (L2 [T]) Как prefetch влияет на perceived RA?

264. (L2 [T]) Почему сжатие может уменьшить IO RA, но увеличить CPU RA?

265. (L2 [T]) Как tombstones и snapshots ухудшают lookup path?

266. (L2 [P]) Реализовать bloom-assisted lookup path

267. (L2 [P]) Реализовать block cache simulator

268. (L2 [P]) Реализовать covering index prototype

269. (L2 [P]) Реализовать prefetch для range scan

270. (L2 [P]) Реализовать сравнение RA для leveled vs tiered layouts

271. (L2 [D]) Почему reads деградируют, хотя write throughput нормальный?

272. (L2 [D]) Почему cache hit rate упал после compaction?

273. (L2 [D]) Почему point lookup внезапно стал читать десятки файлов?

274. (L2 [D]) Почему range scans стали медленнее после включения compression?

275. (L2 [D]) Почему CPU usage высокий на reads даже при малом disk IO?

276. (L3 [T]) Как проектировать read path для минимального RA без взрыва WA?

277. (L3 [T]) Как блоковая компрессия, bloom filters и partitioned indexes вместе уменьшают RA?

278. (L3 [T]) Как Linux page cache и block cache движка взаимодействуют при RA?

279. (L3 [T]) Как readahead может помогать и вредить?

280. (L3 [T]) Как NUMA, TLB misses и cache locality влияют на CPU-side RA?

281. (L3 [T]) Как planner/optimizer должен учитывать RA при выборе access path?

282. (L3 [T]) Как измерять RA по tenants/tables/queries, а не только глобально?

283. (L3 [T]) Почему read amplification часто растёт постепенно и незаметно?

284. (L3 [T]) Как hot/cold data separation помогает снижать RA?

285. (L3 [T]) Почему RA — одна из главных причин непредсказуемого p99 на storage engine?

286. (L3 [P]) Реализовать per-query RA profiler

287. (L3 [P]) Реализовать cache-aware iterator

288. (L3 [P]) Реализовать adaptive prefetch policy

289. (L3 [P]) Реализовать heatmap block accesses / cache misses / SSTable probes

290. (L3 [P]) Реализовать симулятор trade-off между RA и WA для разных compaction policies

291. (L3 [D]) Как доказать, что bottleneck в read amplification, а не в network/service layer?

292. (L3 [D]) Почему уменьшение числа SSTables не улучшило reads?

293. (L3 [D]) Почему planner выбирает path с высоким RA?

294. (L3 [D]) Как расследовать сочетание high CPU, low IO и плохой read latency?

295. (L3 [D]) Почему p50 хороший, а p99 ужасный именно из-за read path complexity?

296. (L4 [S]) Как выбирать acceptable RA budget для OLTP vs analytics workload?

297. (L4 [S]) Как балансировать RA, WA и space amplification в storage engine?

298. (L4 [S]) Когда стоит инвестировать в block cache, а когда в другую compaction strategy?

299. (L4 [S]) Как строить roadmap оптимизаций read path, не ломая write path?

300. (L4 [S]) Как объяснять команде, что “быстрые записи” почти всегда кто-то потом оплачивает на чтении?

---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Как WAL, SSTables и compaction вместе образуют write path в LSM engine?

302. (L2 [T]) Почему оптимизация одного компонента storage engine часто ухудшает другой?

303. (L2 [T]) Как recovery зависит от того, где именно данные находятся: в WAL, memtable или SSTables?

304. (L2 [T]) Почему snapshots, TTL и deletes особенно важны для compaction semantics?

305. (L2 [T]) Как Linux page cache влияет и на WAL, и на SSTable reads?

306. (L2 [T]) Почему mmap vs pread/read — не только API choice, но и архитектурный trade-off?

307. (L2 [T]) Как allocator, memcpy и serialization overhead становятся bottleneck внутри storage engine?

308. (L2 [T]) Почему SSD/NVMe не отменяют проблем amplification, а только меняют их профиль?

309. (L2 [T]) Как observability должна связывать WAL lag, compaction debt, WA и RA в одну картину?

310. (L2 [T]) Почему большинство production storage incidents — это не один баг, а сочетание нескольких trade-offs?

311. (L2 [P]) Реализовать end-to-end mini LSM engine: WAL + memtable + SSTables + compaction

312. (L2 [P]) Реализовать dashboard: WAL flush latency, compaction debt, WA, RA, stall time

313. (L2 [P]) Реализовать chaos tests: crash during flush/compaction/recovery

314. (L2 [P]) Реализовать benchmark matrix: write-heavy / read-heavy / overwrite / tombstone-heavy

315. (L2 [P]) Реализовать tenant-aware storage metrics

316. (L3 [D]) Почему после tuning compaction write throughput вырос, но recovery time и read latency ухудшились?

317. (L3 [D]) Почему p50 нормальный, а p99 ломается каждые несколько минут?

318. (L3 [D]) Как доказать, что storage bottleneck в memory bandwidth, а не в SSD?

319. (L3 [D]) Почему system-wide disk util невысокий, но storage engine всё равно медленный?

320. (L3 [D]) Как расследовать инцидент “данные не потерялись, но storage cost и latency резко выросли”?

321. (L4 [S]) Как выбирать между B-Tree и LSM на уровне storage engine architecture?

322. (L4 [S]) Как проектировать storage engine под NVMe, сохраняя переносимость и correctness?

323. (L4 [S]) Какие anti-patterns в storage engine internals чаще всего взрываются на production?

324. (L4 [S]) Как строить roadmap observability для своей БД: что мерить с первого дня?

325. (L4 [S]) Как объяснить команде, что storage engine — это цепочка компромиссов, а не набор независимых оптимизаций?

---

