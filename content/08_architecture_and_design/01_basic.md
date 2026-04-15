# System Design & C/C++ & Linux Interview Questions

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

# 🧠 1. Базовые принципы распределённых систем

1. (L1 [T]) Что такое CAP theorem?
2. (L1 [T]) Что означает consistency в распределённых системах?
3. (L1 [T]) Что означает availability?
4. (L1 [T]) Что такое partition tolerance?
5. (L1 [T]) Что такое latency?
6. (L1 [T]) Что такое throughput?
7. (L1 [T]) Что такое idempotency?
   пример: повторный POST не должен создавать дубликат заказа
8. (L1 [T]) Что такое fault tolerance?
9. (L1 [T]) Что такое horizontal scaling?
10. (L1 [T]) Что такое vertical scaling?

11. (L2 [T]) В чём разница между strong consistency и eventual consistency?
12. (L2 [T]) Когда выбирают AP систему вместо CP?
13. (L2 [P]) Как реализовать idempotent API?
14. (L2 [T]) Что такое quorum?
15. (L2 [P]) Как уменьшить latency в распределённой системе?
16. (L2 [P]) Как увеличить throughput?
17. (L2 [T]) Что такое causal consistency?

18. (L3 [D]) Как диагностировать split-brain?
19. (L3 [T]) Как работают distributed locks?
20. (L3 [P]) Как реализовать retry с exponential backoff?
21. (L3 [T]) Как clock skew влияет на систему?
22. (L3 [D]) Почему система теряет consistency?

23. (L4 [S]) Как выбрать consistency model для банковской системы?
24. (L4 [S]) Как спроектировать geo-distributed систему?
25. (L4 [S]) Когда допустима eventual consistency?

---

# 🗄️ 2. Хранение данных

26. (L1 [T]) Что такое SQL?
27. (L1 [T]) Что такое NoSQL?
28. (L1 [T]) Что такое индекс?
29. (L1 [T]) Что такое primary key?
30. (L1 [T]) Что такое replication?
31. (L1 [T]) Что такое sharding?

32. (L2 [T]) В чём разница между B-Tree и LSM Tree?
33. (L2 [P]) Как выбрать тип базы данных?
34. (L2 [T]) Что такое leader-follower replication?
35. (L2 [P]) Как работает sharding?
36. (L2 [T]) Что такое ACID?
37. (L2 [T]) Что такое BASE?

38. (L3 [D]) Почему запрос внезапно стал медленным?
39. (L3 [T]) Как работает MVCC?
40. (L3 [P]) Как мигрировать данные без даунтайма?
41. (L3 [D]) Как обнаружить hot shard?
42. (L3 [P]) Как реализовать consistent hashing?

43. (L4 [S]) Как спроектировать storage для миллиарда пользователей?
44. (L4 [S]) Когда использовать multi-leader replication?
45. (L4 [S]) Как минимизировать cross-shard запросы?

---

# 🐧 3. Linux internals

46. (L1 [T]) Что такое процесс?
47. (L1 [T]) Что такое поток?
48. (L1 [T]) Что такое syscall?
49. (L1 [T]) Что такое file descriptor?
50. (L1 [T]) Что такое virtual memory?

51. (L2 [P]) Как работает fork()?
52. (L2 [T]) Что такое context switch?
53. (L2 [P]) Как работает mmap()?
54. (L2 [T]) Что такое page fault?
55. (L2 [T]) Что такое copy-on-write?

56. (L3 [D]) Почему процесс потребляет 100% CPU?
57. (L3 [D]) Как найти memory leak?
58. (L3 [P]) Как работает scheduler?
59. (L3 [T]) Что такое NUMA?
60. (L3 [D]) Как анализировать OOM killer?

61. (L4 [S]) Как тюнить Linux под high-load?
62. (L4 [S]) Как оптимизировать NUMA workload?
63. (L4 [S]) Когда использовать huge pages?

---

# 🌐 4. Networking

64. (L1 [T]) Что такое TCP?
65. (L1 [T]) Что такое UDP?
66. (L1 [T]) Что такое socket?
67. (L1 [T]) Что такое DNS?

68. (L2 [T]) Как работает TCP handshake?
69. (L2 [P]) Как написать TCP сервер?
70. (L2 [T]) Что такое epoll?
71. (L2 [T]) Что такое keep-alive?

72. (L3 [D]) Почему connection reset by peer?
73. (L3 [D]) Как диагностировать packet loss?
74. (L3 [P]) Как работает zero-copy (sendfile)?
75. (L3 [T]) Что такое congestion control?

76. (L4 [S]) Как оптимизировать сетевой стек?
77. (L4 [S]) Когда использовать UDP вместо TCP?
78. (L4 [S]) Как проектировать high-load network service?

---

# 🧵 5. C++

79. (L1 [T]) Что такое RAII?
80. (L1 [T]) Что такое указатель?
81. (L1 [T]) Что такое ссылка?
82. (L1 [T]) Что такое стек и куча?

83. (L2 [T]) Что такое move semantics?
84. (L2 [P]) Как работает std::unique_ptr?
85. (L2 [T]) Что такое std::shared_ptr?
86. (L2 [P]) Когда использовать std::move?

87. (L3 [D]) Что такое undefined behavior?
88. (L3 [P]) Как работает custom allocator?
89. (L3 [T]) Что такое memory alignment?
90. (L3 [D]) Как найти use-after-free?

91. (L4 [S]) Как проектировать low-latency C++ систему?
92. (L4 [S]) Как минимизировать аллокации?

---

# 🔀 6. Concurrency

93. (L1 [T]) Что такое mutex?
94. (L1 [T]) Что такое race condition?

95. (L2 [P]) Как использовать std::thread?
96. (L2 [T]) Что такое deadlock?
97. (L2 [T]) Что такое condition variable?

98. (L3 [D]) Как найти data race?
99. (L3 [P]) Что такое lock-free структура?
100. (L3 [T]) Что такое memory ordering?

101. (L4 [S]) Когда использовать actor model?
102. (L4 [S]) Как проектировать lock-free систему?

---

# 🔍 7. Debugging & Performance

103. (L1 [T]) Что такое profiling?

104. (L2 [P]) Как использовать gdb?
105. (L2 [P]) Как читать stack trace?

106. (L3 [D]) Как найти bottleneck?
107. (L3 [D]) Как анализировать core dump?
108. (L3 [P]) Как использовать perf?

109. (L4 [S]) Как построить observability систему?
110. (L4 [S]) Как внедрить distributed tracing?

---

# 🧩 8. System Design кейсы

111. (L2 [S]) Спроектировать URL shortener
112. (L2 [S]) Спроектировать чат

113. (L3 [S]) Спроектировать rate limiter
114. (L3 [S]) Спроектировать лог-систему

115. (L4 [S]) Спроектировать HFT систему
116. (L4 [S]) Спроектировать distributed filesystem

