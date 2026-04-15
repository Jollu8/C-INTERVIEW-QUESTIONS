# Вопросы: Network Security (с уклоном в C/C++, Linux, сетевую инженерию и практику)

## 1. Общие основы сетевой безопасности

### Базовый уровень
1. Что такое network security?
2. Почему сетевую безопасность нельзя сводить только к шифрованию?
3. Какие основные цели обычно выделяют в информационной безопасности?
4. Что такое confidentiality?
5. Что такое integrity?
6. Что такое availability?
7. Что такое authentication?
8. Что такое authorization?
9. Что такое non-repudiation на базовом уровне?
10. Почему сетевые протоколы изначально часто не проектировались как безопасные?
11. Почему “работает” не означает “безопасно”?
12. Что такое trust boundary?
13. Почему важно понимать, где заканчивается доверенная зона?
14. Что такое attack surface?
15. Почему чем сложнее система, тем шире attack surface?
16. Что такое threat model?
17. Почему без threat model трудно говорить о “достаточной” защите?
18. Что такое defense in depth?
19. Почему нельзя полагаться на один защитный механизм?
20. Что такое secure by default?
21. Что такое least privilege?
22. Почему принцип least privilege важен для сетевых сервисов?
23. Что такое segmentation на базовом уровне?
24. Почему segmentation снижает blast radius?
25. Что такое zero trust на концептуальном уровне?

### Средний уровень
26. Как CIA triad проявляется в сетевых системах practically?
27. Почему доступность так же важна, как конфиденциальность?
28. Почему integrity может быть важнее secrecy для некоторых систем?
29. Как threat model зависит от типа сервиса: internal, public, mobile, industrial?
30. Какие угрозы типичны для client-server приложений?
31. Какие угрозы типичны для публичных API?
32. Какие угрозы типичны для distributed systems?
33. Почему encrypted traffic всё равно может оставаться уязвимым к ряду атак?
34. Что такое metadata leakage?
35. Почему даже защищённый канал может раскрывать чувствительную информацию через метаданные?
36. Что такое security control?
37. Чем preventive controls отличаются от detective controls?
38. Чем detective controls отличаются от corrective controls?
39. Как observability помогает security, а не только troubleshooting?
40. Почему логирование — важная часть защиты?
41. Почему избыточное логирование тоже может быть риском?
42. Как secrets handling связан с network security?
43. Почему hardcoded credentials — плохая практика?
44. Что такое trust on first use и где это встречается?
45. Почему network security требует одновременно protocol thinking и systems thinking?
46. Как безопасность связана с правильной конфигурацией, а не только с кодом?
47. Почему security misconfiguration — одна из самых частых причин инцидентов?
48. Как network security связана с patching and dependency management?
49. Как software supply chain влияет на безопасность сетевых приложений?
50. Что должен понимать C/C++ разработчик об основах сетевой безопасности до изучения TLS/VPN/атак?

### Продвинутый уровень
51. Как строить threat model для сетевого сервиса?
52. Как выделять assets, attackers, entry points и trust boundaries?
53. Почему “внутренняя сеть доверенная” — опасное допущение?
54. Как микросервисная архитектура меняет attack surface?
55. Почему east-west traffic требует не меньшего внимания, чем north-south traffic?
56. Как secure defaults должны отражаться в API и конфигурации?
57. Какие security invariants полезно формулировать для сетевой системы?
58. Как threat modeling помогает выбирать between TLS termination, mTLS, VPN, ACLs and segmentation?
59. Как оценивать компромиссы между security, performance и operability?
60. Как строить security observability без чрезмерной утечки чувствительных данных?
61. Какие данные можно логировать безопасно, а какие нет?
62. Почему correlation IDs полезны и для security расследований?
63. Как incident response зависит от качества network telemetry?
64. Какие ошибки мышления чаще всего встречаются у инженеров в network security?
65. Какие interview вопросы по security foundations показывают зрелое мышление, а не заученные термины?

### Инженерные вопросы
66. Почему network security — это не отдельный модуль, а свойство всей системы?
67. Какие принципы security наиболее универсальны для network/software engineer?
68. Что особенно важно знать C/C++ инженеру о security foundations?
69. Как объяснить свой security mindset на интервью?
70. Какие темы основ безопасности нужно знать глубоко перед TLS, VPN и attack analysis?

---

## 2. TLS/SSL: базовые концепции

### Базовый уровень
71. Что такое SSL?
72. Что такое TLS?
73. Почему SSL считается устаревшим?
74. Чем TLS концептуально отличается от SSL?
75. Зачем нужен TLS?
76. Какие задачи решает TLS?
77. Как TLS связан с confidentiality?
78. Как TLS связан с integrity?
79. Как TLS связан с authentication?
80. Почему TLS не решает все security проблемы приложения?
81. Где в сетевом стеке обычно рассматривают TLS?
82. Почему TLS часто считают надстройкой над TCP?
83. Можно ли использовать TLS поверх UDP?
84. Что такое DTLS на базовом уровне?
85. Что такое TLS handshake?
86. Почему TLS требует handshake?
87. Что происходит в handshake на высоком уровне?
88. Что такое certificate?
89. Что такое public key?
90. Что такое private key?
91. Что такое CA?
92. Зачем нужны certificate authorities?
93. Что такое certificate chain?
94. Что такое server authentication?
95. Что такое mutual TLS на базовом уровне?

### Средний уровень
96. Почему TLS обычно строится на сочетании asymmetric и symmetric cryptography?
97. Почему asymmetric crypto не используют для шифрования всего трафика напрямую?
98. Что такое session keys?
99. Как handshake приводит к созданию симметричных ключей?
100. Что такое cipher suite?
101. Что входит в выбор cipher suite?
102. Что такое key exchange?
103. Что такое forward secrecy?
104. Почему forward secrecy важна?
105. Что такое ECDHE на концептуальном уровне?
106. Чем TLS 1.3 отличается от TLS 1.2 на высоком уровне?
107. Почему TLS 1.3 считается более безопасным и более простым?
108. Почему сокращение числа раундов handshake уменьшает latency?
109. Что такое session resumption?
110. Зачем нужна session resumption?
111. Что такое 0-RTT в TLS 1.3 на базовом уровне?
112. Какие риски есть у 0-RTT?
113. Что такое certificate validation?
114. Почему нельзя “просто шифровать” без проверки сертификата?
115. Что такое hostname verification?
116. Почему hostname verification критична для безопасности?
117. Что такое self-signed certificate?
118. Когда self-signed certificates допустимы, а когда опасны?
119. Что такое trust store?
120. Что такое revocation на концептуальном уровне?
121. Что такое OCSP и CRL на базовом уровне?
122. Почему certificate expiry — реальная operational проблема?
123. Какие типовые ошибки допускают с TLS конфигурацией?
124. Почему отключение проверки сертификата — крайне плохая практика?
125. Что должен понимать инженер про practical TLS basics?

### Продвинутый уровень
126. Как TLS handshake выглядит по шагам на high level?
127. Как client hello и server hello участвуют в согласовании параметров?
128. Как certificate chain передаётся и проверяется?
129. Как derive symmetric keys conceptually?
130. Как transcript integrity помогает безопасности handshake?
131. Почему downgrade attacks historically были важны для TLS evolution?
132. Какие слабые алгоритмы и практики считаются опасными legacy today?
133. Как TLS termination влияет на security boundaries?
134. Что такое end-to-end encryption vs TLS termination at proxy?
135. Как load balancers and reverse proxies complicate TLS architecture?
136. Как mTLS меняет operational complexity?
137. Как certificate rotation должна быть автоматизирована?
138. Какие observability ограничения появляются после включения TLS everywhere?
139. Как packet captures становятся менее полезны без decryption keys?
140. Как security debugging TLS differs from plain TCP debugging?
141. Как C/C++ libraries обычно реализуют TLS abstractions?
142. Какие ошибки использования OpenSSL/BoringSSL/wolfSSL типичны?
143. Почему memory safety особенно важна в TLS-related C/C++ code?
144. Какие interview вопросы по TLS хорошо выявляют реальное инженерное понимание?
145. Что особенно важно знать о TLS C/C++ инженеру, даже если он не пишет криптографию сам?

### Инженерные вопросы
146. Почему TLS — один из фундаментальных building blocks современной сети?
147. Какие компромиссы TLS создаёт между security, latency и operability?
148. Когда TLS защищает хорошо, а когда даёт ложное чувство безопасности?
149. Как объяснить TLS на интервью через handshake, certificates и trust?
150. Какие TLS темы нужно знать глубоко network/software engineer?

---

## 3. TLS/SSL: практическая эксплуатация и отладка

### Базовый уровень
151. Как понять, что проблема именно в TLS, а не в TCP connectivity?
152. Что означает TLS handshake failure?
153. Почему `connection refused` и `TLS handshake failed` — разные классы проблем?
154. Что означает certificate expired?
155. Что означает hostname mismatch?
156. Почему client может не доверять сертификату сервера?
157. Что такое unsupported protocol version в TLS?
158. Что такое unsupported cipher?
159. Что означает alert в TLS на базовом уровне?
160. Почему TLS errors часто выглядят для пользователей как “сайт не открывается”?

### Средний уровень
161. Как инструменты вроде `openssl s_client` помогают в troubleshooting?
162. Как проверить certificate chain вручную?
163. Как проверить срок действия сертификата?
164. Как проверить SAN/CN в сертификате?
165. Как понять, что проблема в intermediate certificate?
166. Почему missing intermediate certificate часто ломает только часть клиентов?
167. Как debug-ить handshake mismatch между client и server?
168. Почему старые клиенты могут не поддерживать современные TLS settings?
169. Как TLS interception/proxy влияет на диагностику?
170. Как mTLS failures отличаются symptomatically от обычного server-auth TLS?
171. Как packet capture помогает при TLS debugging, даже без расшифровки?
172. Какие фазы TLS можно увидеть по длинам пакетов и alerts?
173. Почему SNI важно practically?
174. Как отсутствие/ошибка SNI ломает virtual hosting over TLS?
175. Что такое ALPN на базовом уровне?
176. Почему ALPN важно для HTTP/2 и HTTP/3 ecosystem?
177. Как TLS handshake latency измерять practically?
178. Как session resumption влияет на latency и load?
179. Какие security misconfigurations TLS наиболее часты в production?
180. Что должен понимать software engineer про TLS troubleshooting workflow?

### Продвинутый уровень
181. Как distinguish trust-store issue, hostname-verification issue and protocol mismatch?
182. Как trace TLS failure across proxy, backend and client?
183. Какие метрики полезны для TLS observability: handshake latency, alert types, cert expiry windows, resume rate?
184. Как certificate rotation can fail operationally?
185. Почему distributed systems with many internal certs require strong automation?
186. Как decryption with session keys can help lab debugging and why it’s risky in production?
187. Какие pitfalls у TLS offload architecture?
188. Как C/C++ application should surface TLS errors usefully instead of opaque failure?
189. Какие errno and library-level errors важно различать при TLS over TCP?
190. Как test TLS configurations in CI/CD?
191. Какие interview вопросы по TLS operations показывают production experience?
192. Какие anti-patterns чаще всего вредят TLS reliability and security?
193. Как design safe certificate rollout and rollback?
194. Как combine TLS logging with privacy requirements?
195. Что особенно важно знать senior engineer про TLS failure analysis?

### Инженерные вопросы
196. Почему хороший TLS deployment требует не только криптографии, но и хорошей эксплуатации?
197. Какие TLS operational mistakes самые дорогие в реальной жизни?
198. Что стоит логировать для TLS-инцидентов в production?
199. Как объяснить TLS troubleshooting на интервью?
200. Какие практические темы TLS обязательны для сильного network/C++ engineer?

---

## 4. HTTPS

### Базовый уровень
201. Что такое HTTPS?
202. Чем HTTPS отличается от HTTP?
203. Почему HTTPS = HTTP поверх TLS?
204. Какие проблемы HTTPS решает по сравнению с plain HTTP?
205. Защищает ли HTTPS содержимое запроса и ответа?
206. Что именно HTTPS не скрывает полностью?
207. Почему URL path/query historically могли утекать в разных местах, несмотря на HTTPS?
208. Что такое secure transport for web?
209. Почему сегодня HTTPS считается default, а не optional feature?
210. Что такое mixed content?
211. Почему mixed content опасен?
212. Что такое HSTS?
213. Зачем нужен HSTS?
214. Почему редирект с HTTP на HTTPS сам по себе не идеален без HSTS?
215. Что такое secure cookie?
216. Что означает флаг HttpOnly?
217. Что означает SameSite на базовом уровне?
218. Почему cookie security тесно связана с HTTPS?
219. Что такое TLS termination у reverse proxy?
220. Почему HTTPS важен не только для браузеров, но и для API?

### Средний уровень
221. Как HTTPS помогает против MITM?
222. Почему HTTPS без корректной валидации сертификата не даёт достаточной защиты?
223. Почему HTTPS не защищает от уязвимостей приложения типа XSS/SQL injection?
224. Как HTTPS влияет на caching, proxies и observability?
225. Что такое HTTPS interception в enterprise environments?
226. Какие риски и плюсы у TLS termination на edge proxy?
227. Как end-to-end HTTPS through proxy differs from terminated-and-reencrypted traffic?
228. Почему secure headers важны вместе с HTTPS?
229. Что такое certificate pinning на концептуальном уровне?
230. Какие проблемы у pinning operationally?
231. Почему browser padlock не означает “сайт безопасен во всех смыслах”?
232. Как HTTPS влияет на authentication flows?
233. Почему bearer tokens обязательно должны ходить только через HTTPS?
234. Как HTTPS protects REST/gRPC APIs?
235. Почему internal services тоже часто требуют HTTPS or mTLS?
236. Как redirect loops and misconfigured TLS break HTTPS deployments?
237. Что такое SNI and virtual hosting practically in HTTPS?
238. Как CDN/proxy/load balancer architecture влияет на HTTPS design?
239. Какие security headers полезны вместе с HTTPS?
240. Что должен понимать инженер про HTTPS beyond “включить сертификат”?

### Продвинутый уровень
241. Как HTTPS affects web security posture end to end?
242. Какие attack surfaces остаются even with perfect HTTPS?
243. Как HSTS preload helps and what are operational risks?
244. Как secure cookie configuration interacts with cross-site auth flows?
245. Как service mesh / ingress gateways change HTTPS boundaries?
246. Какие telemetry and logs useful for HTTPS incidents without violating privacy?
247. Как C/C++ HTTP clients/servers typically integrate TLS for HTTPS?
248. Какие pitfalls типичны у custom HTTP clients with TLS validation?
249. Как debug HTTPS failures through proxies and layered infrastructure?
250. Какие interview вопросы по HTTPS показывают зрелое понимание, а не только определение?

### Инженерные вопросы
251. Почему HTTPS — это необходимый минимум, а не полный security solution?
252. Какие темы HTTPS особенно важны для backend and network engineers?
253. Что должен знать C/C++ инженер о корректной работе HTTPS clients/servers?
254. Как объяснить HTTPS на интервью через threats and protections?
255. Какие HTTPS ошибки особенно опасны в production?

---

## 5. VPN: общая идея

### Базовый уровень
256. Что такое VPN?
257. Зачем нужен VPN?
258. Что означает virtual private network?
259. Какие задачи обычно решает VPN?
260. Чем VPN отличается от TLS for one application?
261. Почему VPN operating at network layer даёт другой scope защиты?
262. Какие use cases бывают у VPN: remote access, site-to-site, internal overlay?
263. Почему VPN не равен “анонимности” автоматически?
264. Что такое tunnel на базовом уровне?
265. Почему tunneling — ключевая идея VPN?
266. Что значит encapsulation в контексте VPN?
267. Что значит encrypted tunnel?
268. Что такое remote access VPN?
269. Что такое site-to-site VPN?
270. Что такое full tunnel?
271. Что такое split tunnel?
272. Почему split tunneling — это security trade-off?
273. Какие протоколы VPN ты знаешь?
274. Где обычно используют IPsec?
275. Где обычно используют WireGuard?

### Средний уровень
276. Как VPN affects routing on client or gateway?
277. Почему VPN требует управления ключами и identities?
278. Как VPN helps protect traffic on untrusted networks?
279. Почему VPN не решает endpoint compromise?
280. Как VPN interacts with NAT and firewalls?
281. Почему MTU/MSS часто становятся проблемой через VPN?
282. Как tunneling overhead affects performance?
283. Почему encrypted tunnels complicate observability?
284. Почему VPN deployment — это не только cryptography, но и routing design?
285. Какие ошибки конфигурации VPN самые частые?
286. Как distinguish VPN control-plane issue from tunneled traffic issue?
287. Как packet capture помогает при VPN troubleshooting?
288. Почему overlapping subnets complicate site-to-site VPN?
289. Как split tunnel affects security and usability?
290. Как DNS leaks связаны с VPN setups?
291. Почему key rotation важна и для VPN?
292. Какие KPI useful for VPN operations?
293. Какие симптомы типичны для VPN failure?
294. Что должен понимать software engineer про VPN as a system, not just a protocol?
295. Какие interview вопросы по VPN foundations показывают practical understanding?

### Продвинутый уровень
296. Как VPN changes trust boundaries in distributed systems?
297. Какие control-plane and dataplane parts есть у VPN solutions?
298. Как route propagation and policy interact with VPN?
299. Как troubleshoot intermittent VPN issues under NAT rebinding and path changes?
300. Как build observability for encrypted tunnels without payload visibility?
301. Как distinguish crypto/auth failure from routing/MTU failure?
302. Как full-tunnel VPN can create bottlenecks and single points of failure?
303. Как design safe and scalable VPN key/cert distribution?
304. Какие anti-patterns common in enterprise VPN design?
305. Что должен глубоко понимать senior engineer про VPN architecture?

### Инженерные вопросы
306. Почему VPN — это сочетание crypto, routing, identity и operations?
307. Какие VPN темы особенно важны для network/software engineer?
308. Как объяснить VPN на интервью через tunneling, trust and routing?
309. Что особенно важно знать C/C++ инженеру про VPN behavior?
310. Какие темы общей VPN практики нужно знать глубоко?

---

## 6. IPsec

### Базовый уровень
311. Что такое IPsec?
312. На каком уровне IPsec работает conceptually?
313. Какие задачи решает IPsec?
314. Что такое AH?
315. Что такое ESP?
316. Чем AH отличается от ESP?
317. Почему ESP используется чаще?
318. Что такое transport mode?
319. Что такое tunnel mode?
320. Чем transport mode отличается от tunnel mode?
321. Что такое IKE?
322. Зачем нужен IKE?
323. Почему key negotiation важна для IPsec?
324. Что такое security association (SA)?
325. Почему IPsec считается мощным, но сложным решением?

### Средний уровень
326. Как IPsec обеспечивает confidentiality?
327. Как IPsec обеспечивает integrity?
328. Как IPsec обеспечивает peer authentication?
329. Как IPsec integrates with site-to-site VPN scenarios?
330. Почему NAT historically complicated IPsec?
331. Что такое NAT-T на базовом уровне?
332. Почему ESP без NAT-T плохо сочетается с NAT?
333. Какие порты/протоколы вовлечены в IKE and NAT-T?
334. Как IPsec влияет на MTU?
335. Почему fragmentation issues common in IPsec tunnels?
336. Как SPD и SAD conceptually relate to packet processing?
337. Что такое policy-based IPsec?
338. Что такое route-based IPsec на концептуальном уровне?
339. Какие сложности в конфигурации IPsec наиболее часты?
340. Почему mismatched proposals и auth settings часто ломают IPsec?
341. Как packet captures помогают при IPsec debugging?
342. Почему encrypted IPsec traffic complicates observability?
343. Какие симптомы характерны для failed IKE negotiation?
344. Какие симптомы характерны для broken data plane after successful IKE?
345. Что должен понимать инженер про practical IPsec operation?

### Продвинутый уровень
346. Как IKE negotiation выглядит на high level?
347. Как peers negotiate crypto parameters and identities?
348. Как child SAs differ from IKE SA conceptually?
349. Как rekeying работает и почему важно operationally?
350. Как selector mismatch breaks only part of traffic in IPsec?
351. Как distinguish policy issue from crypto issue from routing issue?
352. Как asymmetric routing complicates IPsec tunnels?
353. Как overlapping networks and route leaks affect IPsec deployments?
354. Какие metrics useful for IPsec observability: SA counts, rekey rate, auth failures, tunnel latency, drops?
355. Как hardware acceleration impacts IPsec performance?
356. Какие bottlenecks типичны для high-throughput IPsec gateways?
357. Как C/C++ systems engineers interact with kernel IPsec or user-space datapaths conceptually?
358. Какие interview вопросы по IPsec показывают глубокое понимание beyond buzzwords?
359. Какие anti-patterns чаще всего встречаются при IPsec troubleshooting?
360. Что особенно важно знать senior engineer про IPsec deployments?

### Инженерные вопросы
361. Почему IPsec часто считают “enterprise-grade”, но operationally complex?
362. Когда IPsec особенно уместен?
363. Какие темы IPsec важны для network/software engineer даже без глубокого telecom/security background?
364. Как объяснить IPsec на интервью через ESP, IKE, tunnel mode и trade-offs?
365. Какие IPsec topics нужно знать глубоко?

---

## 7. WireGuard (обзор)

### Базовый уровень
366. Что такое WireGuard?
367. Почему WireGuard стал популярен?
368. Чем WireGuard концептуально отличается от более старых VPN решений?
369. Почему WireGuard считают более простым в конфигурации?
370. Какие базовые криптографические идеи использует WireGuard на высоком уровне?
371. Что такое peer в WireGuard?
372. Что такое public/private key pair в WireGuard?
373. Как WireGuard идентифицирует peers?
374. Что такое AllowedIPs?
375. Почему AllowedIPs одновременно связаны и с routing, и с policy?
376. Работает ли WireGuard поверх UDP?
377. Почему использование UDP помогает portability and NAT traversal?
378. Что такое persistent keepalive?
379. Зачем нужен keepalive в WireGuard?
380. Почему WireGuard часто удобен для site-to-site и remote access?

### Средний уровень
381. Какие преимущества даёт WireGuard simplicity?
382. Какие operational ограничения у WireGuard по сравнению с more feature-heavy VPN solutions?
383. Как WireGuard handles roaming/NAT rebinding conceptually?
384. Почему WireGuard configuration mistakes often manifest as routing issues?
385. Как AllowedIPs misconfiguration ломает только часть connectivity?
386. Почему WireGuard debugging часто упирается в routing and firewall rather than cryptography?
387. Как MTU issues проявляются через WireGuard tunnels?
388. Как WireGuard compares to IPsec in complexity and operational ergonomics?
389. Какие use cases особенно хорошо подходят для WireGuard?
390. Какие use cases требуют более сложных VPN control planes than WireGuard alone?
391. Как packet capture помогает в WireGuard troubleshooting?
392. Почему encrypted WireGuard traffic complicates payload-level analysis?
393. Какие counters/logs useful for WireGuard debugging?
394. Что должен понимать software engineer про WireGuard as practical VPN?
395. Какие interview вопросы по WireGuard показывают реальную практику?

### Продвинутый уровень
396. Как WireGuard’s minimal protocol design affects security and operability?
397. Как key distribution and rotation should be automated around WireGuard?
398. Как distinguish handshake issue from route issue from NAT/firewall issue?
399. Как WireGuard interacts with Linux routing tables and policy routing?
400. Почему AllowedIPs are powerful but dangerous if misunderstood?
401. Какие metrics should be collected for WireGuard in production?
402. Как build high-availability or multi-peer topologies around WireGuard?
403. Какие limitations WireGuard has for large-scale enterprise orchestration without extra control plane?
404. Как C/C++ engineers should think about WireGuard when building systems atop Linux networking?
405. Какие anti-patterns наиболее часты в WireGuard deployments?
406. Какие interview вопросы по WireGuard помогают отличить buzzword familiarity from operational competence?
407. Что особенно важно знать senior engineer о WireGuard в production?
408. Как compare WireGuard and IPsec fairly without reducing to “one is simpler”?
409. Как explain WireGuard on interview through keys, UDP, peers and routing?
410. Какие WireGuard темы нужно знать глубоко, а какие обзорно?

### Инженерные вопросы
411. Почему WireGuard стал значимым сдвигом в VPN usability?
412. Какие компромиссы simplicity vs ecosystem richness есть у WireGuard?
413. Что особенно полезно знать software/network engineer про WireGuard?
414. Когда WireGuard — отличный выбор, а когда требуется more complex architecture?
415. Какие темы WireGuard обязательно понимать practically?

---

## 8. MITM (Man-in-the-Middle)

### Базовый уровень
416. Что такое MITM атака?
417. Почему MITM опасна?
418. Какие цели преследует MITM attacker?
419. Может ли MITM только подслушивать, не изменяя трафик?
420. Может ли MITM менять данные на лету?
421. Почему plain-text protocols особенно уязвимы к MITM?
422. Как TLS помогает против MITM?
423. Почему TLS без проверки сертификата не защищает от MITM?
424. Что такое certificate validation в контексте MITM defense?
425. Как ARP spoofing может использоваться для MITM в локальной сети?
426. Как rogue Wi-Fi может использоваться для MITM?
427. Почему open Wi-Fi без защиты опасен?
428. Что такое proxy-based MITM на базовом уровне?
429. Как DNS spoofing может помогать MITM?
430. Почему users often can’t visually distinguish legitimate from intercepted traffic?

### Средний уровень
431. Какие условия нужны для успешного MITM?
432. Как attacker position on path affects feasibility of MITM?
433. Чем passive MITM отличается от active MITM?
434. Как MITM differs from simple eavesdropping?
435. Почему HSTS helps against some MITM downgrade scenarios?
436. Что такое SSL stripping на концептуальном уровне?
437. Почему mixed content может облегчать exploitation?
438. Как enterprise TLS interception differs from malicious MITM?
439. Почему trust store compromise опасен?
440. Как pinned trust or mTLS reduce MITM risk?
441. Какие признаки могут косвенно указывать на MITM?
442. Почему unexpected certificate changes should be investigated?
443. Как secure DNS can reduce some MITM vectors?
444. Почему MITM still matters even in mostly-HTTPS world?
445. Какие приложения особенно чувствительны к MITM?
446. Что должен понимать software engineer про MITM beyond “use TLS”?
447. Какие ошибки разработчиков часто открывают дорогу для MITM?
448. Как custom protocol without authentication invites MITM?
449. Какие interview вопросы по MITM показывают реальное понимание attack path and defense?
450. Какие basic mitigations against MITM must every engineer know?

### Продвинутый уровень
451. Как MITM manifests in packet captures and TLS logs?
452. Как distinguish server-side cert issue from interception issue?
453. Какие observability signals useful for detecting attempted MITM?
454. Как C/C++ clients commonly fail open in ways that enable MITM?
455. Почему insecure fallback logic especially dangerous in network clients?
456. Как build clients that surface trust errors clearly and safely?
457. Какие anti-patterns in proxy architectures increase MITM risk?
458. Как internal PKI misuse can unintentionally create MITM-like trust failures?
459. Какие layered defenses best reduce MITM risk in enterprise/internal systems?
460. Какие interview вопросы по MITM best reveal strong security instincts?

### Инженерные вопросы
461. Почему MITM — одна из фундаментальных угроз в networking?
462. Какие defenses against MITM особенно важны software/network engineer?
463. Как объяснить MITM на интервью через trust, identity and authenticated encryption?
464. Что должен глубоко понимать C/C++ engineer about certificate validation and fail-closed behavior?
465. Какие MITM-related themes обязательны для практики?

---

## 9. Spoofing

### Базовый уровень
466. Что такое spoofing?
467. Какие виды spoofing ты знаешь?
468. Что такое IP spoofing?
469. Что такое ARP spoofing?
470. Что такое DNS spoofing?
471. Что такое email spoofing на базовом уровне?
472. Почему spoofing работает там, где идентичность плохо проверяется?
473. Чем spoofing отличается от impersonation в широком смысле?
474. Почему L2/L3 protocols historically уязвимы к spoofing?
475. Почему ARP особенно уязвим к spoofing?
476. Почему DNS without validation historically vulnerable to spoofing?
477. Как spoofing может использоваться для MITM?
478. Как spoofing может использоваться для DDoS amplification?
479. Что такое source-address spoofing?
480. Почему source spoofing затрудняет attribution attacker’а?

### Средний уровень
481. Какие practical consequences у IP spoofing?
482. Почему TCP harder to spoof blindly than some UDP-based protocols?
483. Почему UDP services historically useful for spoofed reflection?
484. Как ingress/egress filtering reduces spoofing?
485. Что такое BCP38 на концептуальном уровне?
486. Почему anti-spoofing filters важны у операторов и датацентров?
487. Как ARP spoofing обнаруживается и предотвращается?
488. Как DHCP snooping and dynamic ARP inspection conceptually help?
489. Как DNSSEC conceptually helps against some DNS spoofing vectors?
490. Почему host authentication at upper layers more robust than trusting network addresses?
491. Какие symptoms suggest spoofing-related incident?
492. Почему spoofed traffic complicates logs and forensic analysis?
493. Как custom protocols often mistakenly trust IP as identity?
494. Что должен понимать software engineer про spoofing risks in protocol design?
495. Какие interview вопросы по spoofing показывают реальное понимание protocol weakness and mitigation?

### Продвинутый уровень
496. Как spoofing appears differently at L2, L3 and application layers?
497. Какие telemetry useful for detecting spoofing in production networks?
498. Как distinguish spoofing from asymmetric routing or NAT weirdness?
499. Как C/C++ network servers should avoid treating source IP as sufficient authentication?
500. Какие data validation and authentication layers reduce spoofing impact?
501. Как build anti-spoofing defenses in internal service meshes and multi-tenant networks?
502. Какие anti-patterns most often create spoofing opportunities?
503. Как packet capture and logs can help investigate suspected spoofing?
504. Какие interview questions on spoofing best reveal systems-level thinking?
505. Что особенно важно знать senior engineer about spoofing as root cause vs symptom?

### Инженерные вопросы
506. Почему spoofing — это следствие недостатка authenticated identity in protocols?
507. Какие spoofing defenses наиболее practical and universal?
508. Как объяснить spoofing на интервью через protocol trust assumptions?
509. Что должен понимать C/C++ engineer про identity vs address?
510. Какие темы spoofing нужно знать глубоко?

---

## 10. DDoS (обзор)

### Базовый уровень
511. Что такое DoS?
512. Что такое DDoS?
513. Чем DDoS отличается от DoS?
514. Какие цели преследует DDoS атака?
515. Почему availability — ключевая цель DDoS?
516. Какие high-level типы DDoS атак бывают?
517. Что такое volumetric attack?
518. Что такое protocol attack?
519. Что такое application-layer attack?
520. Почему DDoS не обязательно связан с взломом сервера?
521. Что такое amplification attack?
522. Что такое reflection attack?
523. Почему UDP-based protocols historically использовались для amplification?
524. Что такое SYN flood?
525. Почему SYN flood нацелен на ресурсы stateful server stack?
526. Что такое application-layer flood на базовом уровне?
527. Почему DDoS может исходить от множества “обычных” хостов?
528. Что такое botnet?
529. Почему распределённость атаки усложняет защиту?
530. Почему DDoS mitigation — это не только firewall rule?

### Средний уровень
531. Чем volumetric attack symptomatically отличается от app-layer attack?
532. Почему bandwidth saturation и CPU saturation — разные DDoS scenarios?
533. Как reflection/amplification rely on spoofing?
534. Какие протоколы historically abused for reflection?
535. Почему SYN cookies useful against some TCP floods?
536. Как rate limiting помогает и где его недостаточно?
537. Как load balancers, CDNs и scrubbing centers помогают против DDoS?
538. Почему upstream provider coordination critical in serious volumetric attacks?
539. Какие KPI and telemetry useful for DDoS detection?
540. Как distinguish flash crowd from DDoS?
541. Почему app-layer DDoS hardest to separate from legitimate traffic?
542. Как capacity planning helps against some forms of DDoS?
543. Почему anycast useful for resilience?
544. Какие counters важны для SYN flood analysis?
545. Какие counters важны для L7 flood analysis?
546. Почему observability and alerting critical for DDoS response?
547. Что должен понимать software engineer about DDoS-safe application design?
548. Какие mistakes разработчиков worsen DDoS impact?
549. Какие interview вопросы по DDoS показывают understanding of layers and mitigation?
550. Какие practical first steps useful during suspected DDoS incident?

### Продвинутый уровень
551. Как distinguish network saturation, state exhaustion and app-resource exhaustion?
552. Как build layered DDoS defense across network, proxy, app and infrastructure?
553. Как queue tuning, backlog, SYN cookies and connection limiting affect resilience?
554. Как C/C++ servers should fail gracefully under overload?
555. Какие patterns useful for overload protection: backpressure, admission control, shed load, bounded queues?
556. Почему unbounded memory allocation dangerous during attack?
557. Как rate limiting can be bypassed or harm legitimate clients?
558. Как bot behavior analysis differs from simple IP blacklisting?
559. Какие telemetry dimensions important: PPS, BPS, conn rate, handshake failure rate, CPU, queue depth, error mix?
560. Как design incident runbooks for DDoS events?
561. Как test DDoS resilience ethically and safely?
562. Как anti-spoofing at Internet scale reduces reflection DDoS?
563. Какие anti-patterns most often make services fragile under DDoS?
564. Какие interview вопросы по DDoS distinguish surface familiarity from deep engineering knowledge?
565. Что особенно важно знать senior engineer about DDoS mitigation limits and trade-offs?

### Инженерные вопросы
566. Почему DDoS — это проблема не только security, но и reliability engineering?
567. Какие mitigation layers самые важные для public Internet services?
568. Как объяснить DDoS на интервью через attack classes and defense layers?
569. Что должен понимать C/C++ engineer about overload-safe network service design?
570. Какие DDoS темы нужно знать глубоко даже без работы в anti-DDoS team?

---

## 11. Базовые принципы защиты

### Базовый уровень
571. Что такое principle of least privilege?
572. Почему default deny полезен в security?
573. Что такое segmentation and isolation?
574. Почему segmentation reduces blast radius?
575. Что такое authentication vs authorization?
576. Почему strong identity critical for secure networking?
577. Что такое patching and why is it security control?
578. Почему secret management важен?
579. Почему logging and monitoring — часть защиты?
580. Что такое secure configuration baseline?
581. Почему unnecessary services should be disabled?
582. Что такое hardening на базовом уровне?
583. Почему backups и disaster recovery связаны с security?
584. Почему asset inventory важен для защиты?
585. Что такое principle of minimal exposure?

### Средний уровень
586. Как least privilege applies to services, users, network paths and credentials?
587. Почему network segmentation не заменяет encryption?
588. Почему encryption не заменяет authorization?
589. Как firewall rules should align with actual service architecture?
590. Почему broad trust between internal services dangerous?
591. Что такое mTLS as identity and channel protection combined?
592. Почему secret rotation must be automated?
593. Как vulnerability management ties into network security?
594. Почему secure defaults in code more reliable than operator memory?
595. Как observability helps detect misuse, abuse and compromise?
596. Почему rate limiting и quotas тоже security controls?
597. Как input validation relates to network-facing services?
598. Почему bounded resource usage important for resilience and security?
599. Как dependency updates relate to exposed network software?
600. Что должен понимать software engineer about turning principles into engineering practice?

### Продвинутый уровень
601. Как translate security principles into concrete design requirements?
602. Как map threats to controls systematically?
603. Как avoid security theater and focus on high-value controls?
604. Какие controls universal for most network services: TLS, auth, logging, segmentation, patching, least privilege?
605. Как security principles differ for internal-only vs Internet-facing services?
606. Как build defense in depth without unmanageable complexity?
607. Какие trade-offs between usability, operability and security most common?
608. Как C/C++ services can embody secure defaults at API and config levels?
609. Какие interview вопросы по базовым принципам защиты показывают зрелость мышления?
610. Что особенно важно знать senior engineer about applying principles, not just reciting them?

### Инженерные вопросы
611. Почему базовые принципы защиты важнее экзотических механизмов?
612. Какие security principles should every network/software engineer internalize?
613. Как объяснить basic defense principles на интервью через реальные примеры?
614. Что особенно важно знать C/C++ инженеру про secure service design?
615. Какие темы защиты нужно знать глубоко перед углублением в конкретные атаки и протоколы?

---

## 12. Secure coding и C/C++ в сетевом контексте

### Базовый уровень
616. Почему C/C++ особенно чувствительны к security bugs?
617. Какие классы memory bugs особенно опасны в network-facing C/C++ code?
618. Что такое buffer overflow?
619. Что такое use-after-free?
620. Что такое integer overflow и почему он опасен при парсинге сетевых данных?
621. Почему untrusted input всегда нужно считать враждебным?
622. Почему network packet parsing — high-risk зона?
623. Почему length fields нельзя доверять без проверки?
624. Почему string handling в C/C++ опасен в сетевом коде?
625. Что такое fail-closed behavior?

### Средний уровень
626. Какие secure coding practices важны для socket/TLS/network protocol code?
627. Почему bounds checking критичен при разборе пакетов?
628. Почему state machines нужно проектировать defensively?
629. Как malformed input should be handled safely?
630. Почему timeouts и resource limits — часть безопасности?
631. Почему unbounded buffers/queues опасны?
632. Как structured logging помогает incident analysis?
633. Почему secrets нельзя логировать?
634. Почему certificate validation нельзя “временно отключить и забыть”?
635. Как правильно обрабатывать ошибки из TLS libraries?
636. Почему unsafe fallback logic dangerous?
637. Как concurrency bugs become security issues?
638. Почему fuzzing особенно полезен для network parsers?
639. Как ASan/UBSan/TSan помогают security posture?
640. Какие common mistakes делают в C/C++ network clients and servers?
641. Что должен понимать C/C++ engineer о secure coding before writing custom protocols?
642. Какие interview вопросы по secure C/C++ networking показывают практический опыт?
643. Как code review should focus on network/security hotspots?
644. Какие dangerous anti-patterns чаще всего встречаются в сетевом C/C++ коде?
645. Почему “работает на happy path” ничего не говорит о security?

### Продвинутый уровень
646. Как design parser boundaries, memory ownership and lifetime to reduce risk?
647. Как represent protocol state safely and explicitly?
648. Как choose fail-fast vs tolerate-invalid behavior in network-facing components?
649. Как integrate fuzzing, sanitizers and protocol corpus tests into CI?
650. Как build observability that supports security investigations without leaking secrets?
651. Как secure coding intersects with performance constraints in high-rate networking?
652. Как reason about side effects of partial reads/writes, retries and reconnect logic on security?
653. Как certificate and key handling should be isolated in C/C++ systems?
654. Какие architecture patterns reduce bug density in security-sensitive network services?
655. Какие interview вопросы по secure C/C++ networking distinguish senior engineers?
656. Какие anti-patterns most often lead to exploitable bugs in network daemons?
657. Что особенно важно знать senior C/C++ engineer about writing safe networked systems?
658. Как explain secure coding mindset on interview with practical examples?
659. Как test negative paths and malformed traffic systematically?
660. Что нужно знать глубже всего: parsing, memory safety, auth, TLS integration or resource control?

### Инженерные вопросы
661. Почему secure network programming на C/C++ требует дисциплины на каждом уровне?
662. Какие классы ошибок самые опасные для public-facing services?
663. Как объяснить secure coding in networking на интервью?
664. Какие темы secure C/C++ стоит обязательно включить в большой сборник вопросов?
665. Что особенно важно знать разработчику сетевого ПО про безопасность кода?

---

## 13. Практика, observability и troubleshooting в security

### Базовый уровень
666. Как понять, что проблема security-related, а не просто networking issue?
667. Какие симптомы характерны для TLS/certificate issue?
668. Какие симптомы характерны для MITM or trust issue?
669. Какие симптомы характерны для VPN misconfiguration?
670. Какие симптомы характерны для DDoS?
671. Почему security incidents часто выглядят как обычные connectivity problems?
672. Какие базовые инструменты useful in security troubleshooting?
673. Почему `tcpdump`, `openssl s_client`, `dig`, `ss`, logs useful together?
674. Что нужно собрать первым делом при suspected security incident?
675. Почему exact timestamps and correlation IDs важны?

### Средний уровень
676. Как build workflow for TLS/HTTPS/VPN incident diagnosis?
677. Как distinguish auth failure from reachability failure?
678. Как distinguish cert trust failure from hostname mismatch?
679. Как distinguish firewall block from app-level auth reject?
680. Как detect possible spoofing or MITM signs from logs and traces?
681. Как recognize DDoS vs legitimate traffic spike?
682. Какие counters and alerts useful for security observability?
683. Почему security telemetry should include both successes and failures?
684. Как rate of handshake failures can reveal attack or misconfig?
685. Как VPN state and route telemetry should be correlated?
686. Как logging too little and too much both hurt investigations?
687. Как preserve forensic usefulness without logging secrets?
688. Как C/C++ services should expose actionable security diagnostics?
689. Какие interview вопросы по security troubleshooting показывают production experience?
690. Какие common anti-patterns break security incident response?

### Продвинутый уровень
691. Как combine packet capture, TLS logs, auth logs and routing info in one RCA?
692. Как build security observability for encrypted traffic environments?
693. Как distinguish control-plane security problem from dataplane transport issue?
694. Как create safe runbooks for cert expiry, trust failures and VPN outages?
695. Как drill DDoS or MITM-like incident response safely?
696. Как use synthetic probes to detect certificate and TLS regressions early?
697. Как detect gradual security degradation before full outage?
698. Какие metrics must be retained historically for meaningful security RCA?
699. Как tie threat model to observability design?
700. Какие interview вопросы по security operations best reveal systems thinking?
701. Как avoid chasing false positives during incident analysis?
702. Как design dashboards that show security posture, not just raw counters?
703. Какие anti-patterns make encrypted production systems impossible to troubleshoot?
704. Что особенно важно знать senior engineer about operational security troubleshooting?
705. Как объяснить свой incident workflow на интервью?

### Инженерные вопросы
706. Почему security observability так же важна, как preventive controls?
707. Какие security troubleshooting навыки обязательны для network/software engineer?
708. Что стоит логировать в production network service с точки зрения security?
709. Как объяснить security RCA approach на интервью?
710. Какие темы security operations нужно знать глубоко?

---

## 14. Сквозные вопросы по Network Security

### Архитектура и принципы
711. Почему network security нельзя свести к “включить TLS”?
712. Как threat model влияет на выбор TLS, VPN, segmentation, mTLS и auth?
713. Почему identity и trust часто важнее простого шифрования?
714. Как defense in depth practically выглядит в сетевой системе?
715. Почему secure defaults важнее документации “не забудьте включить защиту”?
716. Почему encryption without validation dangerous?
717. Почему internal traffic deserves serious security controls too?
718. Как operational simplicity и security sometimes conflict?
719. Как choose between HTTPS, mTLS, IPsec and WireGuard for different trust boundaries?
720. Почему availability — часть security, а не только reliability?

### Практика и атаки
721. Как MITM, spoofing и DDoS differ in goals and mechanics?
722. Почему spoofing often enables other attacks?
723. Как DDoS differs from ordinary overload?
724. Как MITM defenses depend on correct trust validation?
725. Почему cert expiry — это security issue and reliability issue simultaneously?
726. Как split tunnel VPN creates trade-offs between convenience and risk?
727. Как encrypted traffic changes troubleshooting methods?
728. Какие attacks remain possible even with HTTPS everywhere?
729. Какие principles best reduce blast radius after compromise?
730. Какие signs most strongly suggest security misconfiguration rather than random network issue?

### C/C++ / systems / interviews
731. Что должен понимать C/C++ engineer, если он пишет network-facing services?
732. Какие security topics most important for socket/TLS client code?
733. Какие security topics most important for server-side network daemons?
734. Почему memory safety and protocol parsing central to network security in C/C++?
735. Какие interview вопросы по network security чаще всего показывают senior-level understanding?
736. Как за 2–3 минуты объяснить роль TLS, HTTPS, VPN и basic defenses на интервью?
737. Как за минуту объяснить difference between TLS and VPN?
738. Как за минуту объяснить difference between IPsec and WireGuard?
739. Как за минуту объяснить MITM and how to stop it?
740. Как за минуту объяснить DDoS through attack classes and defense layers?
741. Какие темы network security нужно знать глубоко networking/software engineer?
742. Какие темы достаточно понимать на уровне инженерной интуиции?
743. Какие вопросы лучше всего включать в interview kit для C/C++ networking role?
744. Какие темы security стоит изучать дальше после этого блока: PKI, mTLS, authn/authz, eBPF security, Linux hardening, Web security?
745. Какие части Network Security являются лучшим мостом между classic networking и secure systems engineering?