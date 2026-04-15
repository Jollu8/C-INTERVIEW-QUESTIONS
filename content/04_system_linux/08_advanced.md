## Advanced — Questions (C/C++ oriented)

### Kernel Modules
1. Что такое kernel module?
2. Зачем нужны loadable kernel modules (LKM)?
3. Чем module отличается от встроенного в ядро кода?
4. Какие преимущества у модулей?
5. Какие риски у kernel modules?
6. Что происходит при загрузке модуля?
7. Что делает insmod?
8. Чем insmod отличается от modprobe?
9. Что делает rmmod?
10. Как посмотреть загруженные модули?
11. Что показывает lsmod?
12. Где хранятся модули в системе?
13. Что такое /lib/modules?
14. Что такое dependency modules?
15. Как modprobe работает с зависимостями?
16. Что такое kernel symbol?
17. Что такое export symbol?
18. Что такое printk()?
19. Чем printk отличается от printf?
20. Где смотреть вывод printk?
21. Что такое dmesg?
22. Что такое module_init?
23. Что такое module_exit?
24. Как выглядит минимальный kernel module?
25. Почему нельзя использовать libc внутри kernel module?
26. Что такое kernel space memory allocation?
27. Чем kmalloc отличается от malloc?
28. Что такое GFP flags?
29. Что такое preemption в kernel?
30. Можно ли блокировать в kernel module?
31. Что такое interrupt handler?
32. Можно ли писать драйвер как kernel module?
33. Что такое character device driver?
34. Что такое block device driver?
35. Как module взаимодействует с /dev?
36. Что такое file_operations?
37. Как реализуется open/read/write в драйвере?
38. Что такое major/minor numbers?
39. Что такое udev?
40. Почему kernel panic возможен при ошибке в module?

---

### cgroups
41. Что такое cgroups?
42. Зачем нужны cgroups?
43. Какие ресурсы можно ограничивать через cgroups?
44. Что такое CPU cgroup?
45. Что такое memory cgroup?
46. Что такое IO cgroup?
47. Что такое pids cgroup?
48. Чем cgroups v1 отличается от v2?
49. Что такое hierarchy в cgroups?
50. Что такое controller?
51. Как процесс попадает в cgroup?
52. Как ограничить CPU для процесса?
53. Как ограничить память?
54. Что происходит при превышении memory limit?
55. Что такое OOM killer?
56. Как cgroups взаимодействует с scheduler?
57. Что такое cpu.shares?
58. Что такое cpu.quota?
59. Чем shares отличаются от quota?
60. Что такое memory.swap?
61. Что такое memory.limit_in_bytes?
62. Как посмотреть cgroup процесса?
63. Что такое /sys/fs/cgroup?
64. Как systemd использует cgroups?
65. Как Docker использует cgroups?
66. Можно ли использовать cgroups без контейнеров?
67. Что такое throttling CPU?
68. Что такое pressure stall information (PSI)?
69. Почему cgroups важны для multi-tenant систем?
70. Какие проблемы решает cgroups для backend сервисов?

---

### Namespaces
71. Что такое namespaces?
72. Зачем нужны namespaces?
73. Какие типы namespaces существуют?
74. Что такое PID namespace?
75. Что такое mount namespace?
76. Что такое network namespace?
77. Что такое user namespace?
78. Что такое IPC namespace?
79. Что такое UTS namespace?
80. Что такое cgroup namespace?
81. Как namespaces изолируют процессы?
82. Что такое container с точки зрения namespaces?
83. Как PID namespace влияет на PID внутри контейнера?
84. Почему PID 1 в контейнере особенный?
85. Что такое mount isolation?
86. Как network namespace изолирует сеть?
87. Что такое veth pair?
88. Как работает loopback внутри namespace?
89. Что такое user namespace?
90. Почему user namespace важен для безопасности?
91. Можно ли внутри user namespace получить root?
92. Что такое root внутри namespace vs реальный root?
93. Как посмотреть namespaces процесса?
94. Что такое /proc/<pid>/ns?
95. Что делает unshare()?
96. Что делает clone() с флагами namespace?
97. Как создать свой namespace вручную?
98. Как namespaces используются в Docker?
99. Как namespaces сочетаются с cgroups?
100. Почему namespaces — основа контейнеризации?

---

### strace / ltrace
101. Что делает strace?
102. Что такое system call tracing?
103. Как запустить программу через strace?
104. Как прицепиться к уже работающему процессу?
105. Что показывает strace?
106. Как увидеть open/read/write?
107. Что означает errno в strace?
108. Как увидеть время выполнения syscall?
109. Что делает -c в strace?
110. Как отфильтровать syscalls?
111. Что делает -e trace=?
112. Что такое EINTR в strace?
113. Как увидеть fork/exec через strace?
114. Что такое follow forks (-f)?
115. Как отладить “Permission denied” через strace?
116. Как понять, какой файл не найден?
117. Что такое ltrace?
118. Чем ltrace отличается от strace?
119. Что такое library call tracing?
120. Какие вызовы показывает ltrace?
121. Когда использовать ltrace вместо strace?
122. Можно ли использовать оба вместе?
123. Что такое LD_PRELOAD?
124. Как перехватывать функции через LD_PRELOAD?
125. Почему strace полезен для debugging продакшн-проблем?
126. Какие ограничения у strace?
127. Может ли strace замедлить процесс?
128. Что такое ptrace?
129. Как strace связан с ptrace?
130. Какие security ограничения у ptrace?
131. Почему не-root может не увидеть чужие процессы?
132. Как диагностировать сетевые проблемы через strace?
133. Как увидеть DNS-запросы через strace?
134. Как отладить file descriptor leak через strace?
135. Как strace помогает понять зависание программы?
136. Какие альтернативы strace существуют?
137. Что такое eBPF tracing на базовом уровне?
138. Почему tracing важен для системного программиста?
139. Как найти bottleneck через strace?
140. Какие типичные кейсы использования strace/ltrace?

---

### perf
141. Что такое perf?
142. Зачем нужен perf?
143. Что такое profiling?
144. Что такое sampling profiler?
145. Чем sampling отличается от instrumentation?
146. Что показывает perf top?
147. Что показывает perf stat?
148. Что показывает perf record?
149. Что делает perf report?
150. Что такое CPU cycles?
151. Что такое cache miss?
152. Что такое branch misprediction?
153. Как perf помогает найти hotspot?
154. Что такое flame graph?
155. Как построить flame graph?
156. Что такое call stack sampling?
157. Что такое DWARF unwind?
158. Что такое symbols в perf?
159. Почему нужны debug symbols?
160. Как профилировать C++ бинарник?
161. Как оптимизации компилятора влияют на perf?
162. Что такое inlining и как он влияет на профилирование?
163. Что такое perf events?
164. Что такое hardware counters?
165. Как измерить IPC (instructions per cycle)?
166. Как понять, что программа CPU-bound?
167. Как понять, что программа memory-bound?
168. Что такое NUMA effects?
169. Как perf помогает в оптимизации?
170. Какие ограничения у perf?
171. Чем perf отличается от gprof?
172. Можно ли профилировать kernel?
173. Что такое perf trace?
174. Как perf связан с eBPF?
175. Когда использовать perf вместо strace?
176. Как профилировать многопоточную программу?
177. Как анализировать lock contention?
178. Что такое off-CPU profiling?
179. Как perf помогает оптимизировать latency?
180. Почему perf важен для high-performance C/C++?

---

### System Programming (C)
181. Что такое системное программирование?
182. Чем системное программирование отличается от прикладного?
183. Что такое POSIX API?
184. Что такое file descriptor?
185. Что такое open/read/write/close?
186. Что такое blocking I/O?
187. Что такое non-blocking I/O?
188. Что такое select()?
189. Что такое poll()?
190. Что такое epoll()?
191. Чем epoll лучше select/poll?
192. Что такое edge-triggered vs level-triggered?
193. Что такое event loop?
194. Что такое reactor pattern?
195. Что такое proactor pattern?
196. Что такое mmap()?
197. Когда mmap лучше read/write?
198. Что такое shared memory?
199. Что такое pipes?
200. Что такое signals в системном программировании?
201. Что такое async-signal-safe?
202. Что такое fork/exec модель?
203. Как реализовать простой shell?
204. Что такое daemonization?
205. Как сделать daemon в Linux?
206. Что такое double fork?
207. Что такое chroot?
208. Что такое privilege dropping?
209. Что такое sockets API?
210. Как реализовать TCP сервер на C?
211. Как реализовать UDP сервер?
212. Что такое serialization?
213. Что такое endianess?
214. Что такое network byte order?
215. Что делает htons/ntohl?
216. Что такое alignment памяти?
217. Что такое cache line?
218. Что такое false sharing?
219. Что такое zero-copy?
220. Что такое sendfile()?
221. Что такое splice()?
222. Как уменьшить syscalls?
223. Что такое batching I/O?
224. Что такое thread vs event-driven модель?
225. Когда лучше использовать threads?
226. Когда лучше использовать epoll?
227. Что такое lock contention?
228. Как проектировать scalable сервер?
229. Какие типичные ошибки в системном C коде?
230. Почему важно понимать OS internals для C/C++?