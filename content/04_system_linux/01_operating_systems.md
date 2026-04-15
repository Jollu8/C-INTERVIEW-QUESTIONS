## Operating Systems — Questions (C/C++ oriented)

### OS Architecture
1. Что такое монолитное ядро?
2. Чем микроядро отличается от монолитного?
3. Преимущества и недостатки микроядра?
4. Где выполняется драйвер в монолитной архитектуре?
5. Что такое kernel space и user space?
6. Как происходит переход между ними?
7. Что такое syscall interface?
8. Почему ядро изолировано от user space?
9. Что такое interrupt?
10. Разница между interrupt и exception?
11. Что такое context switch?
12. Какие данные сохраняются при context switch?
13. Что такое privilege levels?
14. Ring 0 vs Ring 3?
15. Как работает trap?
16. Что такое bootloader?
17. Как ОС загружается?
18. Что делает init/systemd?
19. Что такое kernel module?
20. Когда используют loadable modules?

---

### Processes vs Threads
21. Что такое процесс?
22. Что такое поток?
23. Основное отличие процесса от потока?
24. Что делится между потоками?
25. Что НЕ делится между потоками?
26. Что такое PCB (Process Control Block)?
27. Что такое TCB?
28. Что такое fork()?
29. Как fork() работает внутри?
30. Что копируется при fork()?
31. Что такое copy-on-write?
32. Что делает exec()?
33. Разница fork() vs exec()?
34. Что такое wait()?
35. Что такое zombie процесс?
36. Что такое orphan процесс?
37. Как избежать zombie?
38. Что такое pthread?
39. Как создать поток в C++ (std::thread)?
40. join vs detach?
41. Что будет если не join поток?
42. Что такое race condition?
43. Что такое thread-safe код?
44. Когда использовать процессы вместо потоков?
45. Что дешевле: thread или process?
46. Что такое thread pool?
47. Что такое TLS (thread-local storage)?
48. Как работает std::this_thread::sleep_for?
49. Что такое concurrency vs parallelism?
50. Какие проблемы многопоточности?

---

### Scheduling Algorithms
51. Что делает scheduler?
52. Что такое preemptive scheduling?
53. Что такое non-preemptive?
54. Round-robin алгоритм?
55. Что такое time slice?
56. Что такое priority scheduling?
57. starvation — что это?
58. Как избежать starvation?
59. Что такое fair scheduling?
60. Что такое load balancing?
61. Что такое CPU affinity?
62. Что такое real-time scheduling?
63. Разница SJF и FIFO?
64. Что такое throughput?
65. Что такое latency?
66. Что такое context switching overhead?
67. Как влияет количество потоков на производительность?
68. Что такое NUMA?
69. Как scheduler работает с многопроцессорными системами?
70. Что такое run queue?

---

### Synchronization
71. Что такое mutex?
72. Как работает mutex внутри?
73. Что такое semaphore?
74. Binary vs counting semaphore?
75. Что такое spinlock?
76. Когда использовать spinlock?
77. Что такое deadlock?
78. 4 условия deadlock?
79. Как предотвратить deadlock?
80. Что такое livelock?
81. Что такое starvation?
82. Что такое critical section?
83. Что такое atomic операции?
84. std::atomic — как работает?
85. memory order в C++?
86. acquire/release semantics?
87. seq_cst — что это?
88. Что такое lock-free?
89. Что такое wait-free?
90. condition_variable — зачем?
91. Как работает std::condition_variable?
92. spurious wakeup — что это?
93. Что такое barrier?
94. Что такое reader-writer lock?
95. Что такое false sharing?
96. Что такое cache coherence?
97. Что такое happens-before?
98. volatile в C++ — зачем?
99. Почему volatile не заменяет mutex?
100. Что такое ABA problem?

---

### IPC (Interprocess Communication)
101. Что такое IPC?
102. pipe — как работает?
103. unnamed vs named pipe?
104. FIFO в Linux?
105. Что такое shared memory?
106. Преимущества shared memory?
107. Недостатки shared memory?
108. Что такое mmap()?
109. Как использовать shm_open?
110. Что такое message queue?
111. POSIX message queues vs System V?
112. Что такое socket?
113. UNIX domain socket vs TCP?
114. Что такое loopback?
115. Что такое serialization?
116. Что такое RPC?
117. Что такое file descriptor?
118. Как передаются данные через pipe?
119. blocking vs non-blocking IPC?
120. select/poll/epoll — что это?
121. Что такое epoll edge-triggered?
122. Что такое backpressure?
123. Как синхронизировать shared memory?
124. Что быстрее: pipe или shared memory?
125. Когда использовать sockets локально?

---

### Virtual Memory
126. Что такое virtual memory?
127. Почему нужна виртуальная память?
128. Что такое paging?
129. Что такое page?
130. Что такое page table?
131. Что такое TLB?
132. Что такое page fault?
133. minor vs major page fault?
134. Что такое segmentation?
135. Paging vs segmentation?
136. Что такое swap?
137. Что такое demand paging?
138. Что такое copy-on-write?
139. Что такое memory mapping?
140. mmap vs malloc?
141. Что такое heap vs stack?
142. Как растёт стек?
143. Что такое stack overflow?
144. Что такое fragmentation?
145. internal vs external fragmentation?
146. Что такое huge pages?
147. Что такое NUMA memory?
148. Что такое protection bits?
149. Что такое address translation?
150. Что такое kernel memory allocator?

---

### System Calls
151. Что такое system call?
152. Как выполняется syscall?
153. user → kernel переход?
154. syscall vs function call?
155. Что такое syscall table?
156. Примеры syscalls?
157. read(), write() — как работают?
158. open(), close()?
159. Что возвращает errno?
160. Что такое blocking syscall?
161. non-blocking syscall?
162. Что такое async I/O?
163. select vs epoll?
164. Что такое file descriptor?
165. STDIN/STDOUT/STDERR?
166. dup(), dup2()?
167. fork() как syscall?
168. execve()?
169. waitpid()?
170. kill()?
171. Что такое signal handler?
172. reentrant функции — что это?
173. Что такое syscall overhead?
174. Как уменьшить количество syscalls?
175. Что такое zero-copy?
176. sendfile()?
177. splice()?
178. mmap как альтернатива read?
179. Как дебажить syscalls (strace)?
180. Что такое ABI?