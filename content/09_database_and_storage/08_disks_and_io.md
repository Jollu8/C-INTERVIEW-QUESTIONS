# 💾 8. Диски и I/O

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

## 🔹 HDD vs SSD

1. (L1 [T]) В чём фундаментальная разница между HDD и SSD?

2. (L1 [T]) Почему HDD чувствителен к seek time?

3. (L1 [T]) Почему SSD обычно быстрее на random read?

4. (L1 [T]) Что такое latency и throughput в контексте дисков?

5. (L1 [T]) Почему HDD лучше проявляет себя на sequential I/O, чем на random I/O?

6. (L1 [T]) Почему у SSD нет механической головки, но всё равно есть неравномерность latency?

7. (L1 [T]) Что такое IOPS?

8. (L1 [T]) Почему сравнивать диски только по IOPS — недостаточно?

9. (L1 [T]) Что такое erase block у SSD?

10. (L1 [T]) Почему SSD и HDD по-разному влияют на дизайн storage engine?

11. (L1 [P]) Написать benchmark sequential read для файла на Linux

12. (L1 [P]) Написать benchmark random read для файла на Linux

13. (L1 [P]) Сравнить latency HDD и SSD на 4KB reads

14. (L1 [P]) Реализовать простой fio-подобный microbenchmark на C/C++

15. (L1 [P]) Измерить throughput при разных размерах блока: 4KB, 64KB, 1MB

16. (L2 [T]) Почему SSD имеет высокую производительность, но не “бесплатную”?

17. (L2 [T]) Что такое SSD controller и FTL?

18. (L2 [T]) Почему write amplification важна именно для SSD?

19. (L2 [T]) Почему TRIM/discard влияет на долгосрочную производительность SSD?

20. (L2 [T]) Почему HDD может показывать стабильный throughput, но ужасный p99 latency?

21. (L2 [T]) Как queue depth влияет на SSD throughput?

22. (L2 [T]) Почему NVMe отличается от SATA SSD не только пропускной способностью?

23. (L2 [T]) Почему SSD хуже предсказуем по latency под mixed workload?

24. (L2 [T]) Почему device cache и контроллер влияют на durability semantics?

25. (L2 [T]) Как выбор диска влияет на B-Tree vs LSM engine?

26. (L2 [P]) Написать benchmark с configurable queue depth

27. (L2 [P]) Реализовать mixed workload: 70% read / 30% write

28. (L2 [P]) Измерить p50/p95/p99 latency для HDD и SSD

29. (L2 [P]) Сравнить buffered I/O и O_DIRECT на SSD

30. (L2 [P]) Построить profile зависимости throughput от block size и queue depth

31. (L2 [D]) Почему SSD не даёт ожидаемого прироста после миграции с HDD?

32. (L2 [D]) Почему disk util низкий, а latency высокая?

33. (L2 [D]) Почему random write на SSD деградирует со временем?

34. (L2 [D]) Почему sequential benchmark быстрый, а реальная БД всё равно медленная?

35. (L2 [D]) Почему одна и та же нагрузка на HDD “тормозит” сильнее ночью?

36. (L3 [T]) Как SSD FTL скрывает реальное физическое размещение данных?

37. (L3 [T]) Почему device-level garbage collection влияет на latency spikes?

38. (L3 [T]) Как write cache и flush/fua влияют на correctness?

39. (L3 [T]) Почему queue depth может улучшать throughput и ухудшать tail latency одновременно?

40. (L3 [T]) Как NUMA и PCIe topology влияют на NVMe performance?

41. (L3 [T]) Почему storage engine не должен считать SSD “просто быстрым HDD”?

42. (L3 [T]) Как zoned devices меняют дизайн log-structured storage?

43. (L3 [T]) Почему benchmarking storage без контроля page cache и readahead даёт ложные выводы?

44. (L3 [T]) Как filesystem и scheduler Linux искажают “чистую” картину устройства?

45. (L3 [T]) Почему устройство может быть bottleneck по latency, а не по bandwidth?

46. (L3 [P]) Реализовать latency histogram для device I/O

47. (L3 [P]) Реализовать benchmark с pinning thread → CPU → NUMA node

48. (L3 [P]) Реализовать тест влияния fsync/fdatasync/FUA на latency

49. (L3 [P]) Реализовать synthetic WAL-like append benchmark

50. (L3 [P]) Реализовать synthetic LSM compaction benchmark для HDD vs SSD

51. (L3 [D]) Как доказать, что latency spikes приходят из SSD GC, а не из filesystem?

52. (L3 [D]) Почему NVMe показывает высокий bandwidth, но poor small-write latency?

53. (L3 [D]) Почему migration на более быстрый диск не помогла p99?

54. (L3 [D]) Как расследовать влияние NUMA/PCIe placement на NVMe throughput?

55. (L3 [D]) Почему синтетический benchmark и production workload дают противоположные выводы?

56. (L4 [S]) Когда HDD всё ещё оправдан для storage systems?

57. (L4 [S]) Как проектировать storage engine отдельно под HDD и под SSD?

58. (L4 [S]) Когда стоит инвестировать в NVMe, а когда bottleneck не в диске?

59. (L4 [S]) Как выбирать block sizes, queue depth и flush policy под конкретный класс устройств?

60. (L4 [S]) Как объяснять команде, что “быстрый диск” не отменяет плохую архитектуру I/O path?

---

## 🔹 Sequential vs random I/O

61. (L1 [T]) Что такое sequential I/O?

62. (L1 [T]) Что такое random I/O?

63. (L1 [T]) Почему sequential I/O обычно быстрее random I/O?

64. (L1 [T]) Почему HDD особенно плохо переносит random I/O?

65. (L1 [T]) Почему SSD тоже имеет разницу между sequential и random workload?

66. (L1 [T]) Что такое access pattern?

67. (L1 [T]) Почему append-only log использует преимущества sequential I/O?

68. (L1 [T]) Почему B-Tree и LSM создают разный I/O pattern?

69. (L1 [T]) Почему размер блока влияет на observed throughput?

70. (L1 [T]) Почему prefetch/readahead чаще полезен именно для sequential reads?

71. (L1 [P]) Реализовать sequential file scanner на C++

72. (L1 [P]) Реализовать random block reader

73. (L1 [P]) Сравнить throughput sequential vs random reads

74. (L1 [P]) Сравнить latency random 4KB vs sequential 1MB reads

75. (L1 [P]) Реализовать benchmark для append-only writes

76. (L2 [T]) Почему fragmented file превращает “почти sequential” workload в random-like?

77. (L2 [T]) Как block allocator filesystem влияет на locality?

78. (L2 [T]) Почему large sequential I/O может быть неэффективным при чрезмерном buffering?

79. (L2 [T]) Почему mixed workload ломает предположения о sequential locality?

80. (L2 [T]) Как readahead помогает и когда вредит?

81. (L2 [T]) Что такое locality of reference?

82. (L2 [T]) Почему range scan в индексе может выродиться в random I/O?

83. (L2 [T]) Как compaction в LSM превращает writes в большие sequential streams?

84. (L2 [T]) Почему B-Tree page splits создают более random write pattern?

85. (L2 [T]) Как размер working set влияет на реальный I/O pattern?

86. (L2 [P]) Реализовать benchmark fragment-aware sequential access

87. (L2 [P]) Реализовать random-vs-sequential scan по mmap и по pread

88. (L2 [P]) Измерить эффект readahead на range scan

89. (L2 [P]) Реализовать synthetic B-Tree-like page access pattern

90. (L2 [P]) Реализовать synthetic LSM compaction write stream

91. (L2 [D]) Почему sequential scan не достигает паспортного bandwidth?

92. (L2 [D]) Почему supposedly sequential workload внезапно стал random-like?

93. (L2 [D]) Почему random reads на SSD всё равно дают большой p99?

94. (L2 [D]) Почему range query деградировала после роста таблицы?

95. (L2 [D]) Почему prefetching не дал ожидаемого эффекта?

96. (L3 [T]) Как Linux readahead algorithm взаимодействует с access patterns?

97. (L3 [T]) Как page cache сглаживает разницу между sequential и random reads?

98. (L3 [T]) Почему CPU cache/TLB/cache lines тоже важны для “I/O” pattern?

99. (L3 [T]) Как параллельные потоки могут разрушать sequential locality?

100. (L3 [T]) Почему queue merging и I/O scheduler особенно важны для HDD?

101. (L3 [T]) Как filesystem fragmentation влияет на long-term performance?

102. (L3 [T]) Почему log-structured design старается превратить random writes в sequential?

103. (L3 [T]) Как direct I/O меняет поведение sequential vs random patterns?

104. (L3 [T]) Почему “random” workload часто имеет скрытую spatial/temporal locality?

105. (L3 [T]) Как проектировать benchmark так, чтобы он действительно измерял pattern, а не page cache?

106. (L3 [P]) Реализовать per-offset trace access pattern analyzer

107. (L3 [P]) Реализовать benchmark с переключением readahead on/off

108. (L3 [P]) Реализовать multi-thread mixed random/sequential workload generator

109. (L3 [P]) Реализовать access heatmap по файлу/страницам

110. (L3 [P]) Реализовать scan benchmark с pinning и controlled cache eviction

111. (L3 [D]) Как доказать, что проблема именно в fragmentation/randomization access pattern?

112. (L3 [D]) Почему sequential throughput хороший, а запросы БД всё равно медленные?

113. (L3 [D]) Как расследовать readahead thrashing?

114. (L3 [D]) Почему смешанный workload убил throughput на HDD, хотя каждый по отдельности был нормальным?

115. (L3 [D]) Как отличить CPU-bound iterator problem от настоящего storage random I/O bottleneck?

116. (L4 [S]) Как проектировать storage layout так, чтобы максимизировать sequential locality?

117. (L4 [S]) Когда выгодно специально менять layout данных ради scan-heavy workload?

118. (L4 [S]) Как выбирать между B-Tree-like и log-structured write path с точки зрения access patterns?

119. (L4 [S]) Как строить observability для random/sequential mix в production?

120. (L4 [S]) Как объяснять разработчикам, что “логически простой range query” не означает “физически sequential I/O”?

---

## 🔹 fsync

121. (L1 [T]) Что делает fsync?

122. (L1 [T]) Чем fsync отличается от write?

123. (L1 [T]) Почему успешный write не означает durability?

124. (L1 [T]) Чем fsync отличается от fdatasync?

125. (L1 [T]) Почему fsync важен для WAL и transactional systems?

126. (L1 [T]) Почему fsync может быть очень дорогим?

127. (L1 [T]) Что такое dirty pages в контексте page cache?

128. (L1 [T]) Почему kernel может откладывать запись на устройство?

129. (L1 [T]) Что значит “данные записаны в page cache, но не на диск”?

130. (L1 [T]) Почему fsync влияет на commit latency?

131. (L1 [P]) Написать программу, сравнивающую write-only и write+fsync

132. (L1 [P]) Измерить latency fsync на разных размерах payload

133. (L1 [P]) Реализовать append+fsync loop для WAL-like workload

134. (L1 [P]) Сравнить fsync и fdatasync

135. (L1 [P]) Реализовать benchmark group commit с одним fsync на batch

136. (L2 [T]) Почему fsync может flush-ить больше, чем ожидает приложение?

137. (L2 [T]) Почему fsync одного файла может зависеть от состояния filesystem journal?

138. (L2 [T]) Что такое group commit и почему он уменьшает цену fsync на транзакцию?

139. (L2 [T]) Почему разные filesystem ведут себя по-разному относительно fsync?

140. (L2 [T]) Почему fsync latency может быть “зубчатой”?

141. (L2 [T]) Почему mount options могут менять реальную durability semantics?

142. (L2 [T]) Почему write cache на устройстве усложняет интерпретацию fsync?

143. (L2 [T]) Почему fsync на виртуалках/облаке может вести себя особенно нестабильно?

144. (L2 [T]) Что такое sync_file_range и почему это не замена fsync?

145. (L2 [T]) Почему frequent fsync разрушает throughput write-heavy системы?

146. (L2 [P]) Реализовать batched group commit через отдельный flush thread

147. (L2 [P]) Реализовать configurable commit policy: every txn / every N ms / every N records

148. (L2 [P]) Реализовать latency histogram для fsync

149. (L2 [P]) Реализовать crash-injection тесты вокруг fsync boundaries

150. (L2 [P]) Реализовать benchmark влияния concurrent writers на fsync cost

151. (L2 [D]) Почему fsync latency резко вырос после релиза?

152. (L2 [D]) Почему после падения часть подтверждённых транзакций потерялась?

153. (L2 [D]) Почему fdatasync не дал существенного выигрыша?

154. (L2 [D]) Почему один slow fsync ломает p99 всей БД?

155. (L2 [D]) Почему на тестовой машине всё durable, а в production бывают потери?

156. (L3 [T]) Как fsync взаимодействует с journaled filesystems?

157. (L3 [T]) Как storage cache, barriers и flush commands влияют на guarantees fsync?

158. (L3 [T]) Почему verifying durability требует crash testing, а не только code review?

159. (L3 [T]) Как проектировать WAL path, чтобы минимизировать число fsync?

160. (L3 [T]) Почему commit order, write order и durability order могут расходиться?

161. (L3 [T]) Как io_uring и async interfaces соотносятся с fsync semantics?

162. (L3 [T]) Почему page cache writeback daemon влияет на observed fsync latency?

163. (L3 [T]) Как measuring fsync без контроля соседней нагрузки даёт ложные выводы?

164. (L3 [T]) Почему bursty fsync pattern может создавать sawtooth latency в системе?

165. (L3 [T]) Как проектировать durable pipeline с учётом filesystem + device + virtualization stack?

166. (L3 [P]) Реализовать flush coordinator для group commit

167. (L3 [P]) Реализовать trace pipeline: write time → fsync enqueue → fsync done → client ack

168. (L3 [P]) Реализовать kill -9 / crash harness для WAL durability test

169. (L3 [P]) Реализовать adaptive batching по observed fsync latency

170. (L3 [P]) Реализовать benchmark для ext4/xfs/tmpfs-подобных режимов с одинаковым workload

171. (L3 [D]) Как доказать, что bottleneck в fsync, а не в mutex вокруг WAL?

172. (L3 [D]) Почему group commit улучшил throughput, но ухудшил fairness между клиентами?

173. (L3 [D]) Как расследовать ложное чувство durability в облачной среде?

174. (L3 [D]) Почему latency spike совпадает с background writeback, а не с foreground writes?

175. (L3 [D]) Как отличить filesystem-induced fsync stalls от device-level stalls?

176. (L4 [S]) Когда допустимо ослабить fsync policy ради latency?

177. (L4 [S]) Как выбирать commit durability tiers для разных классов данных?

178. (L4 [S]) Как проектировать storage engine так, чтобы fsync не был единственной глобальной точкой боли?

179. (L4 [S]) Как объяснять продуктовым командам цену “синхронной durability”?

180. (L4 [S]) Как строить rollout/validation стратегии для изменений в flush policy?

---

## 🔹 Page cache

181. (L1 [T]) Что такое page cache в Linux?

182. (L1 [T]) Зачем операционная система кэширует файловые страницы?

183. (L1 [T]) Как page cache ускоряет reads?

184. (L1 [T]) Как page cache влияет на writes?

185. (L1 [T]) Почему page cache не равен buffer pool БД?

186. (L1 [T]) Что такое cache hit и cache miss?

187. (L1 [T]) Почему page cache может маскировать настоящую стоимость I/O?

188. (L1 [T]) Что такое dirty page в page cache?

189. (L1 [T]) Почему после reboot/page cache drop benchmark меняется радикально?

190. (L1 [T]) Почему большая RAM может скрыть проблемы storage layout?

191. (L1 [P]) Измерить “cold cache” и “warm cache” чтение одного и того же файла

192. (L1 [P]) Реализовать benchmark page cache hit/miss

193. (L1 [P]) Сравнить buffered read и повторный buffered read

194. (L1 [P]) Реализовать scan большого файла и измерить page cache effect

195. (L1 [P]) Реализовать тест write→read через page cache без fsync

196. (L2 [T]) Как page cache взаимодействует с readahead?

197. (L2 [T]) Почему double caching (page cache + DB buffer pool) может быть дорогим?

198. (L2 [T]) Почему mmap обычно использует page cache?

199. (L2 [T]) Как eviction policy page cache влияет на workload БД?

200. (L2 [T]) Почему large scans могут вытеснить hot working set?

201. (L2 [T]) Что такое page cache thrashing?

202. (L2 [T]) Почему page cache writeback может создавать latency spikes?

203. (L2 [T]) Как memory pressure влияет на storage latency через page cache?

204. (L2 [T]) Почему page cache complicates benchmarking?

205. (L2 [T]) Когда page cache помогает БД, а когда мешает?

206. (L2 [P]) Реализовать benchmark влияния sequential scan на hot random reads

207. (L2 [P]) Сравнить mmap и pread на warm cache

208. (L2 [P]) Реализовать synthetic double-caching workload

209. (L2 [P]) Реализовать measurement hot-set vs cold-set in cache

210. (L2 [P]) Реализовать trace cache hit ratio before/after large scan

211. (L2 [D]) Почему после большого аналитического запроса OLTP latency выросла?

212. (L2 [D]) Почему тесты на dev-машине “быстрые”, а в cold production — медленные?

213. (L2 [D]) Почему reads почти не идут на диск, но p99 всё равно плохой?

214. (L2 [D]) Почему после роста RAM performance почти не изменилась?

215. (L2 [D]) Почему page cache помогает одному workload и ломает другой?

216. (L3 [T]) Как Linux page cache и DB buffer pool конкурируют за память?

217. (L3 [T]) Почему page cache может скрывать fragmentation/random I/O проблемы?

218. (L3 [T]) Как madvise/fadvise/readahead hints влияют на page cache behavior?

219. (L3 [T]) Почему mmap page faults — это часть I/O path, а не просто memory access?

220. (L3 [T]) Как writeback threads и dirty_ratio/dirty_background_ratio влияют на latency?

221. (L3 [T]) Почему page cache complicates durability reasoning?

222. (L3 [T]) Как NUMA affects page cache access cost?

223. (L3 [T]) Почему measuring disk throughput без отделения cache effects бесполезно?

224. (L3 [T]) Как page cache взаимодействует с direct I/O and O_DIRECT workloads?

225. (L3 [T]) Когда storage engine должен consciously bypass page cache?

226. (L3 [P]) Реализовать benchmark с controlled cold/warm cache phases

227. (L3 [P]) Реализовать cache pollution test: scan vs point lookups

228. (L3 [P]) Реализовать trace page faults + latency correlation

229. (L3 [P]) Реализовать experiment: mmap + madvise vs pread

230. (L3 [P]) Реализовать working-set estimator для buffer pool vs page cache competition

231. (L3 [D]) Как доказать, что проблема в page cache thrashing, а не в SSD?

232. (L3 [D]) Почему after switching to mmap memory usage and latency became unpredictable?

233. (L3 [D]) Как расследовать spikes из-за background writeback?

234. (L3 [D]) Почему buffer pool tuning не помог, потому что bottleneck был в page cache?

235. (L3 [D]) Как отличить cache hit CPU overhead от настоящего device I/O latency?

236. (L4 [S]) Когда БД должна полагаться на page cache, а когда строить свой buffer pool?

237. (L4 [S]) Как проектировать memory budget между cache layers?

238. (L4 [S]) Когда стоит использовать mmap-heavy design, а когда explicit IO path?

239. (L4 [S]) Как строить benchmarking methodology, не обманываемую page cache?

240. (L4 [S]) Как объяснять команде, что “всё в памяти” не означает “проблем с I/O больше нет”?

---

## 🔹 Direct I/O

241. (L1 [T]) Что такое Direct I/O?

242. (L1 [T]) Чем O_DIRECT отличается от обычного buffered I/O?

243. (L1 [T]) Почему Direct I/O часто используют БД?

244. (L1 [T]) Что значит “обход page cache”?

245. (L1 [T]) Почему alignment важен для Direct I/O?

246. (L1 [T]) Почему Direct I/O не означает автоматически более высокую производительность?

247. (L1 [T]) Почему Direct I/O часто сложнее в реализации?

248. (L1 [T]) Что происходит с caching, если приложение использует Direct I/O?

249. (L1 [T]) Почему Direct I/O полезен для собственного buffer pool?

250. (L1 [T]) Какие типичные ограничения у O_DIRECT на Linux?

251. (L1 [P]) Открыть файл с O_DIRECT и выполнить aligned read

252. (L1 [P]) Выделить aligned buffer через posix_memalign

253. (L1 [P]) Сравнить buffered vs direct read latency

254. (L1 [P]) Сравнить buffered vs direct write throughput

255. (L1 [P]) Реализовать простой page reader с O_DIRECT

256. (L2 [T]) Почему small unaligned I/O особенно плох для Direct I/O?

257. (L2 [T]) Когда buffered I/O выигрывает у Direct I/O?

258. (L2 [T]) Почему Direct I/O убирает double caching, но не убирает все bottlenecks?

259. (L2 [T]) Как Direct I/O влияет на readahead/prefetch semantics?

260. (L2 [T]) Почему Direct I/O требует своего scheduling и buffering в userspace?

261. (L2 [T]) Почему WAL и data files могут использовать разные I/O modes?

262. (L2 [T]) Как Direct I/O взаимодействует с fsync/fdatasync?

263. (L2 [T]) Почему Direct I/O может улучшить predictability p99?

264. (L2 [T]) Почему throughput с O_DIRECT может быть ниже на маленьких блоках?

265. (L2 [T]) Что такое async direct I/O и зачем он нужен?

266. (L2 [P]) Реализовать aligned page cache-less reader

267. (L2 [P]) Реализовать simple user-space readahead для O_DIRECT

268. (L2 [P]) Реализовать write batching поверх Direct I/O

269. (L2 [P]) Сравнить O_DIRECT и mmap/pread на point lookups

270. (L2 [P]) Реализовать benchmark влияния alignment и block size

271. (L2 [D]) Почему переход на O_DIRECT не ускорил БД?

272. (L2 [D]) Почему p99 стал лучше, а average throughput хуже?

273. (L2 [D]) Почему часть reads внезапно начала падать с EINVAL?

274. (L2 [D]) Почему after O_DIRECT CPU usage вырос?

275. (L2 [D]) Почему Direct I/O ломает прежние предположения о warm cache?

276. (L3 [T]) Как проектировать собственный buffer pool при Direct I/O?

277. (L3 [T]) Как alignment, huge pages и page size ОС влияют на Direct I/O path?

278. (L3 [T]) Как io_uring сочетается с O_DIRECT?

279. (L3 [T]) Почему O_DIRECT уменьшает cache pollution, но требует больше userspace complexity?

280. (L3 [T]) Как Direct I/O влияет на observability и benchmarking?

281. (L3 [T]) Почему mixed buffered + direct access к одним и тем же файлам опасен?

282. (L3 [T]) Как проектировать prefetch, eviction и batching без помощи page cache?

283. (L3 [T]) Как Direct I/O взаимодействует с filesystem journaling и metadata updates?

284. (L3 [T]) Когда Direct I/O особенно полезен для LSM compaction или large scans?

285. (L3 [T]) Почему Direct I/O не отменяет необходимости продуманного memory allocator и IO scheduler в приложении?

286. (L3 [P]) Реализовать mini buffer pool поверх O_DIRECT

287. (L3 [P]) Реализовать async O_DIRECT read queue

288. (L3 [P]) Реализовать benchmark для buffered vs direct на mixed workload

289. (L3 [P]) Реализовать adaptive prefetcher для O_DIRECT scans

290. (L3 [P]) Реализовать tracing: submit → complete → copy/parse latency per request

291. (L3 [D]) Как доказать, что bottleneck после O_DIRECT — userspace buffering, а не диск?

292. (L3 [D]) Почему direct path улучшил OLTP, но ухудшил analytics scans?

293. (L3 [D]) Как расследовать interaction bugs between O_DIRECT and fallback buffered path?

294. (L3 [D]) Почему after enabling O_DIRECT memory pressure decreased, but latency remained high?

295. (L3 [D]) Как отличить device bottleneck от alignment-induced inefficiency?

296. (L4 [S]) Когда имеет смысл переходить на Direct I/O?

297. (L4 [S]) Как выбирать между buffered I/O, mmap и O_DIRECT для разных компонентов БД?

298. (L4 [S]) Как проектировать storage engine, который может переключаться между I/O modes?

299. (L4 [S]) Как объяснять команде, что O_DIRECT — это архитектурное решение, а не тюнинг-флажок?

300. (L4 [S]) Как строить rollout и validation strategy для перехода на Direct I/O в production?

---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Как HDD vs SSD влияет на выбор между buffered I/O и Direct I/O?

302. (L2 [T]) Почему fsync, page cache и Direct I/O нельзя обсуждать по отдельности?

303. (L2 [T]) Как sequential/random access patterns влияют на storage engine design?

304. (L2 [T]) Почему page cache может скрыть проблемы random I/O на тестах?

305. (L2 [T]) Как WAL path и data read path могут требовать разных I/O стратегий?

306. (L2 [T]) Почему tail latency storage subsystem часто определяется не bandwidth, а flush/cache/writeback behavior?

307. (L2 [T]) Как allocator, memcpy, checksum и compression внезапно становятся “I/O bottleneck”, хотя диск свободен?

308. (L2 [T]) Почему benchmarking storage без контроля cache, alignment и concurrency почти бесполезен?

309. (L2 [T]) Как NUMA, CPU pinning и PCIe topology влияют на seemingly pure disk benchmarks?

310. (L2 [T]) Почему most real production incidents — это комбинация page cache + fsync + background IO + access pattern?

311. (L2 [P]) Реализовать end-to-end benchmark: WAL append + fsync + random reads + scan

312. (L2 [P]) Реализовать dashboard: IOPS, bandwidth, avg/p99 latency, dirty pages, cache hit ratio

313. (L2 [P]) Реализовать chaos test: memory pressure + background writeback + foreground reads

314. (L2 [P]) Реализовать synthetic DB-like workload: B-Tree random IO vs LSM sequential flush/compaction

315. (L2 [P]) Реализовать trace pipeline: app submit → syscall → page cache/direct path → device complete

316. (L3 [D]) Почему после перехода на SSD p50 улучшился, а p99 почти не изменился?

317. (L3 [D]) Почему disk util низкий, но БД медленная?

318. (L3 [D]) Как доказать, что bottleneck в page cache/writeback, а не в устройстве?

319. (L3 [D]) Почему одна и та же система стабильна на synthetic benchmark и нестабильна в production?

320. (L3 [D]) Как расследовать инцидент “данные не потерялись, но storage latency стала непредсказуемой”?

321. (L4 [S]) Как выбирать I/O strategy для новой БД: buffered, mmap, O_DIRECT, hybrid?

322. (L4 [S]) Какие anti-patterns в disk/I/O layer чаще всего приводят к painful production incidents?

323. (L4 [S]) Как строить observability storage path с первого дня?

324. (L4 [S]) Как проектировать storage subsystem под SSD/NVMe, не забывая про portability и correctness?

325. (L4 [S]) Как объяснить команде, что “диски и I/O” — это не про syscalls, а про end-to-end latency model?

---
