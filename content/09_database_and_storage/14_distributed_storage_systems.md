# 🌍 14. Distributed storage systems

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

## 🔹 Distributed databases

1. (L1 [T]) Что такое distributed database?

2. (L1 [T]) Чем distributed DB отличается от single-node DB?

3. (L1 [T]) Почему distributed storage нужен при росте данных и нагрузки?

4. (L1 [T]) Что такое shard/node/replica в распределённой БД?

5. (L1 [T]) Почему distributed DB усложняет consistency?

6. (L1 [T]) Почему сеть становится частью storage engine?

7. (L1 [T]) Что такое coordinator node?

8. (L1 [T]) Почему distributed DB почти всегда сочетает sharding и replication?

9. (L1 [T]) Почему latency между узлами критична для дизайна системы?

10. (L1 [T]) Почему distributed database — это не просто “много серверов с одной БД”?

11. (L1 [P]) Реализовать простой distributed KV store на 2–3 узла

12. (L1 [P]) Реализовать coordinator, маршрутизирующий запрос на нужный shard

13. (L1 [P]) Реализовать replication of writes to follower nodes

14. (L1 [P]) Реализовать basic health checks between nodes

15. (L1 [P]) Реализовать mapping key → shard → replicas

16. (L2 [T]) Почему distributed transactions дороже локальных?

17. (L2 [T]) Что такое cross-shard query?

18. (L2 [T]) Почему distributed joins обычно дорогие?

19. (L2 [T]) Что такое control plane и data plane в distributed DB?

20. (L2 [T]) Почему membership and metadata services критичны?

21. (L2 [T]) Что такое rebalance в distributed database?

22. (L2 [T]) Почему failover в distributed DB может привести к stale routing?

23. (L2 [T]) Почему global secondary indexes особенно сложны?

24. (L2 [T]) Что такое distributed commit path?

25. (L2 [T]) Почему “горячий shard” остаётся проблемой даже в большом кластере?

26. (L2 [P]) Реализовать routing table with versioned metadata

27. (L2 [P]) Реализовать shard move with temporary forwarding

28. (L2 [P]) Реализовать node membership gossip/heartbeat

29. (L2 [P]) Реализовать per-shard leader mapping

30. (L2 [P]) Реализовать distributed request tracing across router → shard → replica

31. (L2 [D]) Почему один shard перегружен, хотя кластер в среднем загружен слабо?

32. (L2 [D]) Почему client-side routing даёт stale errors после failover?

33. (L2 [D]) Почему cross-shard query внезапно стала главной причиной p99?

34. (L2 [D]) Почему cluster CPU низкий, но latency высокая?

35. (L2 [D]) Почему distributed DB unstable only during topology changes?

36. (L3 [T]) Как проектировать metadata subsystem для distributed storage?

37. (L3 [T]) Почему distributed DB должна учитывать clock skew, network partitions и node churn?

38. (L3 [T]) Как placement strategy влияет на latency, fault tolerance и cost?

39. (L3 [T]) Как routing caches on clients balance freshness and control-plane load?

40. (L3 [T]) Почему distributed DB performance часто определяется slowest shard/replica path?

41. (L3 [T]) Как transaction layer сочетается с consensus and replication layer?

42. (L3 [T]) Почему observability for distributed storage must be shard-aware and topology-aware?

43. (L3 [T]) Как membership changes interact with load balancing and recovery?

44. (L3 [T]) Почему anti-entropy, rebalancing и compaction together can destabilize cluster?

45. (L3 [T]) Почему distributed DB design — это компромисс между locality, consistency, availability и operability?

46. (L3 [P]) Реализовать metadata service with epoch/version control

47. (L3 [P]) Реализовать stale-route retry with metadata refresh

48. (L3 [P]) Реализовать placement simulator for shards/replicas across racks/AZs

49. (L3 [P]) Реализовать per-shard SLO metrics and topology dashboard

50. (L3 [P]) Реализовать fault injection: node loss, slow link, stale metadata

51. (L3 [D]) Как доказать, что bottleneck в control plane, а не в storage engine?

52. (L3 [D]) Почему topology change triggered cluster-wide latency spike?

53. (L3 [D]) Как расследовать request amplification from coordinator retries?

54. (L3 [D]) Почему shard migration fixed capacity but worsened tail latency?

55. (L3 [D]) Как найти hidden hotspot tenant in distributed database?

56. (L4 [S]) Когда distributed database действительно нужна, а когда single-node + replicas достаточно?

57. (L4 [S]) Как выбирать between shared-nothing DB, managed distributed SQL and custom storage layer?

58. (L4 [S]) Как проектировать organization-wide guardrails against cross-shard antipatterns?

59. (L4 [S]) Как строить control plane, который сам не станет SPOF или bottleneck?

60. (L4 [S]) Как объяснять команде, что distributed DB complexity comes from coordination, not from networking alone?

---

## 🔹 Consensus (Raft, Paxos)

61. (L1 [T]) Что такое consensus в distributed systems?

62. (L1 [T]) Зачем distributed storage нужен consensus?

63. (L1 [T]) Что такое replicated log?

64. (L1 [T]) Что такое leader в Raft-like системах?

65. (L1 [T]) Что такое follower?

66. (L1 [T]) Что такое term в Raft?

67. (L1 [T]) Что такое election timeout?

68. (L1 [T]) Почему consensus нужен для leader election и log agreement?

69. (L1 [T]) Чем Paxos концептуально отличается от Raft?

70. (L1 [T]) Почему consensus сложнее обычной репликации?

71. (L1 [P]) Реализовать упрощённый Raft election among 3 nodes

72. (L1 [P]) Реализовать AppendEntries heartbeat

73. (L1 [P]) Реализовать majority vote for leader election

74. (L1 [P]) Реализовать log append with monotonically increasing index

75. (L1 [P]) Реализовать simple commit when majority acknowledged entry

76. (L2 [T]) Почему majority quorum обеспечивает safety under node failures?

77. (L2 [T]) Что такое committed entry в Raft?

78. (L2 [T]) Почему leader completeness важна?

79. (L2 [T]) Что такое log matching property?

80. (L2 [T]) Почему split vote happens and how Raft mitigates it?

81. (L2 [T]) Почему network partitions complicate election?

82. (L2 [T]) Почему leader lease/read optimization tricky?

83. (L2 [T]) Что такое log compaction / snapshotting in consensus?

84. (L2 [T]) Почему recovery of lagging follower important for consensus cluster health?

85. (L2 [T]) Почему Paxos reputation as “hard to understand” partly about decomposition, not only math?

86. (L2 [P]) Реализовать randomized election timeout

87. (L2 [P]) Реализовать follower catch-up from missing log index

88. (L2 [P]) Реализовать commit index propagation

89. (L2 [P]) Реализовать snapshot install for lagging follower

90. (L2 [P]) Реализовать fault injection: delayed heartbeats and split votes

91. (L2 [D]) Почему cluster frequently re-elects leaders under moderate packet loss?

92. (L2 [D]) Почему follower never catches up after partition heals?

93. (L2 [D]) Почему writes stall despite majority of nodes healthy?

94. (L2 [D]) Почему leadership flaps only in one AZ/region?

95. (L2 [D]) Почему read optimization returned stale data after leader transition?

96. (L3 [T]) Как устроен Raft state machine: leader election, log replication, safety?

97. (L3 [T]) Как проектировать durable log for consensus node?

98. (L3 [T]) Почему fsync latency directly affects consensus write latency?

99. (L3 [T]) Как joint consensus / membership change works?

100. (L3 [T]) Почему reconfiguration is one of the hardest parts of consensus systems?

101. (L3 [T]) Как batching affects throughput and tail latency in Raft?

102. (L3 [T]) Почему clock assumptions in consensus must stay weak?

103. (L3 [T]) Как Raft snapshots interact with application state machine snapshots?

104. (L3 [T]) Почему multi-Raft per shard/tablet is common in distributed databases?

105. (L3 [T]) Почему consensus solves agreement, but not all higher-level DB semantics?

106. (L3 [P]) Реализовать joint-consensus-like reconfiguration (упрощённо)

107. (L3 [P]) Реализовать batched AppendEntries pipeline

108. (L3 [P]) Реализовать per-peer replication state: nextIndex/matchIndex

109. (L3 [P]) Реализовать metrics: election count, leader changes, commit lag, append RTT

110. (L3 [P]) Реализовать simulator for partitions, restarts, fsync stalls and slow followers

111. (L3 [D]) Как доказать, что latency caused by durable log flush, not network RTT?

112. (L3 [D]) Почему cluster remains unavailable after one-node restart because elections keep oscillating?

113. (L3 [D]) Как расследовать inconsistent reads from follower-read optimization in consensus-backed DB?

114. (L3 [D]) Почему membership change caused long unavailability window?

115. (L3 [D]) Как найти unsafe assumption in homegrown Raft implementation?

116. (L4 [S]) Когда использовать consensus-backed replication, а когда достаточно async/semi-sync?

117. (L4 [S]) Как проектировать multi-Raft architecture without drowning in metadata and hot leaders?

118. (L4 [S]) Как выбирать cluster size and placement for consensus groups?

119. (L4 [S]) Как объяснять команде, что consensus gives safety guarantees, but costs latency and operability?

120. (L4 [S]) Как строить testing/drill strategy for consensus subsystems before production incidents do it for you?

---

## 🔹 Quorum reads / writes

121. (L1 [T]) Что такое quorum read?

122. (L1 [T]) Что такое quorum write?

123. (L1 [T]) Что означают параметры N, R, W?

124. (L1 [T]) Почему при `R + W > N` часто ожидают лучшую согласованность?

125. (L1 [T]) Почему quorum systems используются в distributed storage?

126. (L1 [T]) Что такое majority quorum?

127. (L1 [T]) Почему read quorum и write quorum влияют на latency differently?

128. (L1 [T]) Почему quorum read может всё равно вернуть stale value?

129. (L1 [T]) Что такое sloppy quorum?

130. (L1 [T]) Почему quorum не равен строгой linearizability автоматически?

131. (L1 [P]) Реализовать quorum write to N replicas waiting for W ACKs

132. (L1 [P]) Реализовать quorum read from R replicas

133. (L1 [P]) Реализовать latest-version choose among R responses

134. (L1 [P]) Реализовать tunable consistency parameters per request

135. (L1 [P]) Реализовать read repair after detecting stale replica

136. (L2 [T]) Почему intersecting quorums still fail under timing/version anomalies?

137. (L2 [T]) Почему coordinator correctness critical in quorum protocol?

138. (L2 [T]) Что такое hinted handoff in quorum-based systems?

139. (L2 [T]) Почему write acknowledgments may mean receive, durable write or apply — and these differ?

140. (L2 [T]) Почему latency of quorum operation depends on tail replicas, not average replicas?

141. (L2 [T]) Как read repair and anti-entropy complement quorum reads/writes?

142. (L2 [T]) Почему vector clocks/version stamps важны for resolving concurrent writes?

143. (L2 [T]) Почему “quorum achieved” and “client sees latest data” are different statements?

144. (L2 [T]) Как topology-aware quorum placement affects availability and latency?

145. (L2 [T]) Почему hot keys disproportionately hurt quorum systems?

146. (L2 [P]) Реализовать per-replica version stamps

147. (L2 [P]) Реализовать hinted handoff queue

148. (L2 [P]) Реализовать stale replica detection and repair

149. (L2 [P]) Реализовать latency-aware coordinator choosing fastest replicas

150. (L2 [P]) Реализовать benchmark for N/R/W trade-offs under failures

151. (L2 [D]) Почему quorum read occasionally returns old value after recent successful write?

152. (L2 [D]) Почему write latency exploded after one replica became slow but not dead?

153. (L2 [D]) Почему hinted handoff queue grew forever?

154. (L2 [D]) Почему coordinator became hotspot for one hot partition?

155. (L2 [D]) Почему changing from `W=1` to `W=2` broke SLA unexpectedly?

156. (L3 [T]) Как проектировать versioning for quorum-based storage: timestamps, vector clocks, epochs?

157. (L3 [T]) Почему bounded staleness over quorum systems is subtle?

158. (L3 [T]) Как partial failures and retries create duplicate or reordered writes in quorum systems?

159. (L3 [T]) Как quorum interacts with leaderless replication and consistent hashing placement?

160. (L3 [T]) Почему local quorum vs global quorum matters in geo-distributed clusters?

161. (L3 [T]) Как observability должна разделять quorum failure, stale read, repair debt and coordinator overload?

162. (L3 [T]) Почему tunable consistency complicates application correctness reasoning?

163. (L3 [T]) Как anti-entropy and quorum protocols together define eventual convergence speed?

164. (L3 [T]) Почему different object sizes and request types distort quorum latency model?

165. (L3 [T]) Почему quorum reads/writes are storage semantics, not complete application semantics?

166. (L3 [P]) Реализовать local-vs-global quorum simulator across regions

167. (L3 [P]) Реализовать consistency checker comparing observed staleness vs configured R/W/N

168. (L3 [P]) Реализовать per-key coordinator trace with version conflict logging

169. (L3 [P]) Реализовать background anti-entropy queue with rate limiting

170. (L3 [P]) Реализовать observability: stale-read rate, read repair rate, hinted handoff debt, coordinator retries

171. (L3 [D]) Как доказать, что stale reads caused by version resolution bug, not by slow network?

172. (L3 [D]) Почему quorum math looks fine on paper, but production still shows anomalies?

173. (L3 [D]) Как расследовать write loss after coordinator crash during partial quorum?

174. (L3 [D]) Почему local quorum improved latency but worsened cross-region read correctness complaints?

175. (L3 [D]) Как найти mismatch between “ACK semantics” and operator expectations in quorum deployment?

176. (L4 [S]) Когда quorum-based storage оправдан, а когда consensus-based leader model проще and safer?

177. (L4 [S]) Как выбирать N/R/W for different classes of data and SLAs?

178. (L4 [S]) Как объяснять командам реальные guarantees tunable consistency without overselling them?

179. (L4 [S]) Как строить guardrails so product teams do not accidentally choose unsafe consistency levels?

180. (L4 [S]) Как балансировать latency, repair cost, topology and correctness in quorum system design?

---

## 🔹 Partition tolerance

181. (L1 [T]) Что такое network partition в distributed system?

182. (L1 [T]) Что значит partition tolerance?

183. (L1 [T]) Почему distributed storage must assume partitions will happen?

184. (L1 [T]) Чем partition отличается от simple node failure?

185. (L1 [T]) Почему two halves of cluster may both think they are healthy?

186. (L1 [T]) Что такое split brain?

187. (L1 [T]) Почему partitions affect both reads and writes?

188. (L1 [T]) Почему latency spikes and packet loss often precede full partition-like symptoms?

189. (L1 [T]) Почему partition tolerance is not a feature switch you “turn on”?

190. (L1 [T]) Почему CAP discussions often become misleading in practical DB design?

191. (L1 [P]) Реализовать fault injector: simulate dropped network link between nodes

192. (L1 [P]) Реализовать leader election reaction to partition

193. (L1 [P]) Реализовать client retry logic under temporary partition

194. (L1 [P]) Реализовать degraded mode when minority partition loses write ability

195. (L1 [P]) Реализовать split-brain detector using epoch/leader-id metadata

196. (L2 [T]) Почему majority-based systems sacrifice availability in minority partition?

197. (L2 [T]) Почему async replicated systems may stay writable through partition but risk divergence?

198. (L2 [T]) Как partition affects quorum reads/writes?

199. (L2 [T]) Почему network partition often manifests as partial and asymmetric, not total?

200. (L2 [T]) Почему client timeouts and retries can amplify partition damage?

201. (L2 [T]) Что такое fencing token and why useful after partitions?

202. (L2 [T]) Почему leases become dangerous under long partitions and clock skew?

203. (L2 [T]) Как placement across racks/AZs changes partition failure modes?

204. (L2 [T]) Почему stale metadata after partition heal can be as dangerous as the partition itself?

205. (L2 [T]) Почему operator actions during partition often worsen blast radius?

206. (L2 [P]) Реализовать majority-only write admission

207. (L2 [P]) Реализовать fencing token for leaders/coordinators

208. (L2 [P]) Реализовать asymmetric partition simulator

209. (L2 [P]) Реализовать client backoff and idempotent retry under partition

210. (L2 [P]) Реализовать heal phase: rejoin, catch-up, stale leader demotion

211. (L2 [D]) Почему both sides accepted writes during partition?

212. (L2 [D]) Почему cluster unavailable though only one link was flaky?

213. (L2 [D]) Почему retries from clients caused cascading overload after network recovered?

214. (L2 [D]) Почему healed cluster still served stale data?

215. (L2 [D]) Почему partition symptoms appeared only in one region or one rack?

216. (L3 [T]) Как partition tolerance interacts with consensus, quorum systems and replication mode?

217. (L3 [T]) Почему “partition tolerant” usually means well-defined degraded behavior, not seamless operation?

218. (L3 [T]) Как design for read-only degradation, write shedding or local buffering during partitions?

219. (L3 [T]) Как split-brain prevention interacts with failover speed?

220. (L3 [T]) Почему client-side routing/caching complicates recovery after partition heals?

221. (L3 [T]) Как observability should distinguish packet loss, high RTT, asymmetric reachability and full partition?

222. (L3 [T]) Почему data re-convergence after heal is as important as surviving the partition itself?

223. (L3 [T]) Как partition drills should include operator runbooks and application behavior, not only DB nodes?

224. (L3 [T]) Почему storage systems need to reason about partial partitions in metadata/control plane separately from data plane?

225. (L3 [T]) Почему “availability during partitions” must be stated with exact semantics of possible staleness/divergence?

226. (L3 [P]) Реализовать rejoin protocol with stale term/epoch rejection

227. (L3 [P]) Реализовать observability: reachability matrix, quorum availability, stale-route counters

228. (L3 [P]) Реализовать partition drill harness with asymmetric loss, latency and packet reordering

229. (L3 [P]) Реализовать application-visible degraded modes: reject writes, serve stale reads, queue locally

230. (L3 [P]) Реализовать post-heal divergence checker and reconciliation pipeline

231. (L3 [D]) Как доказать, что incident was asymmetric partition, not node crash or GC pause?

232. (L3 [D]) Почему cluster experienced split brain despite using leases?

233. (L3 [D]) Как расследовать incorrect failover caused by stale health checks during partition?

234. (L3 [D]) Почему partition heal triggered replay storm and p99 collapse?

235. (L3 [D]) Как найти hidden assumption in app/client code that turned partition into data inconsistency incident?

236. (L4 [S]) Как выбирать degraded semantics under partition for different products?

237. (L4 [S]) Когда лучше reject writes than risk divergence?

238. (L4 [S]) Как проектировать operator playbooks for partition events before the first real incident?

239. (L4 [S]) Как объяснять CAP/partition tolerance without oversimplifying into slogans?

240. (L4 [S]) Как build culture where partition drills are routine, not heroic one-offs?

---

## 🔹 Data locality

241. (L1 [T]) Что такое data locality в distributed storage?

242. (L1 [T]) Почему data locality влияет на latency?

243. (L1 [T]) Почему locality важна для both storage and compute?

244. (L1 [T]) Что такое local read vs remote read?

245. (L1 [T]) Почему cross-region access much slower than same-rack access?

246. (L1 [T]) Почему data placement determines cost as well as performance?

247. (L1 [T]) Что такое affinity between workload and data?

248. (L1 [T]) Почему “равномерно размазать всё везде” usually conflicts with locality?

249. (L1 [T]) Почему locality matters even if bandwidth seems abundant?

250. (L1 [T]) Почему geo-distributed systems care about both user locality and replica locality?

251. (L1 [P]) Реализовать routing policy preferring local replica

252. (L1 [P]) Реализовать simple placement map: rack/AZ/region for each shard replica

253. (L1 [P]) Реализовать latency-aware read selection

254. (L1 [P]) Реализовать synthetic benchmark local-vs-remote read latency

255. (L1 [P]) Реализовать basic tenant-to-region placement policy

256. (L2 [T]) Почему data locality often conflicts with load balancing?

257. (L2 [T]) Почему cross-shard joins destroy locality?

258. (L2 [T]) Как leader placement affects write locality in consensus-based systems?

259. (L2 [T]) Почему follower reads can improve locality but complicate consistency?

260. (L2 [T]) Что такое rack-aware and zone-aware placement?

261. (L2 [T]) Почему compute-locality in warehouses/analytics differs from request-locality in OLTP?

262. (L2 [T]) Как caches interact with locality?

263. (L2 [T]) Почему moving data to improve locality may worsen rebalance cost?

264. (L2 [T]) Что такое hotspot due to locality preference?

265. (L2 [T]) Почему one-size-fits-all placement policy rarely works?

266. (L2 [P]) Реализовать rack-aware replica placement

267. (L2 [P]) Реализовать leader rebalancing toward write-locality goals

268. (L2 [P]) Реализовать locality score for placement decisions

269. (L2 [P]) Реализовать benchmark locality-sensitive workload vs random placement

270. (L2 [P]) Реализовать observability: local-read rate, cross-zone traffic, remote-write penalty

271. (L2 [D]) Почему users in one region suddenly see much higher latency?

272. (L2 [D]) Почему local-read policy causes stale results complaints?

273. (L2 [D]) Почему after rebalance cross-AZ traffic exploded?

274. (L2 [D]) Почему compute nodes spend more time fetching remote blocks than processing them?

275. (L2 [D]) Почему a “balanced” placement still performs badly for one large tenant?

276. (L3 [T]) Как locality-aware placement interacts with consensus quorum placement?

277. (L3 [T]) Почему moving leaders can improve writes but degrade reads or failover behavior?

278. (L3 [T]) Как model cost of locality: RTT, bandwidth, egress cost, cache warmth, failure domains?

279. (L3 [T]) Как design for multi-tenant locality without sacrificing isolation and fairness?

280. (L3 [T]) Почему object storage + local SSD cache is partly a locality optimization story?

281. (L3 [T]) Как data locality affects compaction, repair, backup and restore workflows?

282. (L3 [T]) Почему query planners in distributed systems must reason about locality and shipping cost?

283. (L3 [T]) Как observability should show locality misses, remote amplification and cross-region dependencies?

284. (L3 [T]) Почему locality problems often masquerade as generic network or CPU issues?

285. (L3 [T]) Почему good locality architecture starts at schema/shard key design, not only at routing layer?

286. (L3 [P]) Реализовать placement simulator optimizing for latency + fault domains + balance

287. (L3 [P]) Реализовать query planner prototype that penalizes remote data shipping

288. (L3 [P]) Реализовать leader placement rebalance with tenant affinity constraints

289. (L3 [P]) Реализовать cache layer measuring local-hit vs remote-fetch savings

290. (L3 [P]) Реализовать heatmap of cross-rack/AZ/region traffic per shard/tenant

291. (L3 [D]) Как доказать, что bottleneck is poor locality rather than insufficient CPU or disk?

292. (L3 [D]) Почему after making leader local for one tenant, another tenant’s SLA degraded?

293. (L3 [D]) Как расследовать locality regression after schema/shard-key change?

294. (L3 [D]) Почему planner chooses remote-heavy plan despite local replica availability?

295. (L3 [D]) Как identify hidden cross-region dependency causing bimodal latency?

296. (L4 [S]) Как выбирать locality strategy for OLTP, analytics and geo-distributed products?

297. (L4 [S]) Когда стоит платить higher replication/storage cost ради better locality?

298. (L4 [S]) Как design shard keys and placement policies together, not separately?

299. (L4 [S]) Как explain to teams that locality is a first-class design axis, not an optimization after launch?

300. (L4 [S]) Как build platform primitives so product teams get locality benefits without hand-tuning every service?

---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Как distributed databases, consensus and quorums together define storage semantics under failure?

302. (L2 [T]) Почему partition tolerance and data locality often pull design in opposite directions?

303. (L2 [T]) Почему consensus solves leader agreement, but not cross-shard transaction semantics automatically?

304. (L2 [T]) Как quorum reads/writes and leader-based consensus represent two different coordination models?

305. (L2 [T]) Почему distributed storage performance usually limited by coordination and placement, not raw disk speed alone?

306. (L2 [T]) Как routing metadata, leader placement and shard locality interact in every request?

307. (L2 [T]) Почему network partitions, stale metadata and retries together often create bigger incidents than one hardware failure?

308. (L2 [T]) Как control plane reliability becomes as important as data plane reliability in distributed storage?

309. (L2 [T]) Почему observability must be per-shard, per-region, per-consensus-group, not only cluster-wide?

310. (L2 [T]) Почему most production incidents in distributed storage are coordination failures with storage symptoms?

311. (L2 [P]) Реализовать mini distributed store: sharding + replication + Raft-like leader + locality-aware reads

312. (L2 [P]) Реализовать dashboard: leader changes, quorum failures, stale reads, cross-region traffic, partition events

313. (L2 [P]) Реализовать chaos harness: network partition, slow disk on leader, stale metadata, reconfiguration

314. (L2 [P]) Реализовать simulator comparing quorum-based leaderless vs consensus-based leadered design

315. (L2 [P]) Реализовать end-to-end trace: client → router → shard leader → replicas → commit ACK

316. (L3 [D]) Почему p50 latency acceptable, but p99 collapses only during leader changes and topology events?

317. (L3 [D]) Почему cluster appears healthy globally, yet one region sees repeated stale reads and timeouts?

318. (L3 [D]) Как доказать, что root cause is poor placement/locality rather than insufficient hardware?

319. (L3 [D]) Почему after improving availability via local quorums product correctness complaints increased?

320. (L3 [D]) Как расследовать incident “данные не потерялись, но distributed behavior became unpredictable”?

321. (L4 [S]) Как выбирать between distributed SQL, leaderless KV, multi-Raft storage and simpler replicated single-writer systems?

322. (L4 [S]) Какие platform guardrails нужны, чтобы команды не ломали locality, quorum safety or partition behavior accidentally?

323. (L4 [S]) Как строить engineering process for distributed storage design reviews before scale exposes weak assumptions?

324. (L4 [S]) Какие anti-patterns чаще всего приводят к painful distributed storage incidents a year later?

325. (L4 [S]) Как объяснять организации, что distributed storage systems — это прежде всего discipline of coordination, placement and failure semantics, а не просто “база данных на нескольких машинах”?

