# 🔐 10. Безопасность

Часто задают ближе к концу интервью.

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

**Подтемы:**

* Authentication / Authorization
* OAuth, JWT
* Rate limiting
* DDoS protection

---

1. (L1 [T]) Что такое аутентификация (authentication)?
2. (L1 [T]) Что такое авторизация (authorization)?
3. (L1 [T]) В чём разница между authentication и authorization?
4. (L1 [T]) Что такое токен?
5. (L1 [T]) Что такое сессия?
6. (L1 [T]) Что такое парольное хэширование?
7. (L1 [T]) Что такое JWT?
8. (L1 [T]) Что такое OAuth?
9. (L1 [T]) Что такое rate limiting?
10. (L1 [T]) Что такое DDoS-атака?

---

11. (L2 [T]) Как работает JWT (header, payload, signature)?
12. (L2 [P]) Как реализовать аутентификацию через JWT?
13. (L2 [T]) В чём плюсы и минусы JWT?
14. (L2 [T]) Как работает OAuth 2.0 (authorization code flow)?
15. (L2 [P]) Когда использовать OAuth?
16. (L2 [T]) Что такое refresh token?
17. (L2 [P]) Как реализовать logout с JWT?
18. (L2 [T]) Что такое RBAC (role-based access control)?
19. (L2 [T]) Что такое ABAC?
20. (L2 [P]) Как реализовать authorization?
21. (L2 [T]) Какие алгоритмы rate limiting существуют?
22. (L2 [T]) Что такое token bucket?
23. (L2 [T]) Что такое leaky bucket?
24. (L2 [P]) Как реализовать rate limiter?
25. (L2 [T]) Где лучше ставить rate limiting (gateway, сервис)?
26. (L2 [T]) Какие типы DDoS атак бывают?

---

27. (L3 [D]) Почему токен можно подделать?
28. (L3 [D]) Как диагностировать утечку токенов?
29. (L3 [D]) Почему rate limiter не защищает систему?
30. (L3 [P]) Как защититься от brute-force атак?
31. (L3 [T]) Что такое replay attack?
32. (L3 [P]) Как предотвратить replay attack?
33. (L3 [D]) Почему OAuth интеграция небезопасна?
34. (L3 [P]) Как безопасно хранить секреты?
35. (L3 [T]) Что такое CSRF?
36. (L3 [P]) Как защититься от CSRF?
37. (L3 [T]) Что такое XSS?
38. (L3 [P]) Как защититься от XSS?
39. (L3 [D]) Как обнаружить DDoS атаку?
40. (L3 [P]) Как смягчить DDoS на уровне приложения?

---

41. (L4 [S]) Как проектировать secure authentication систему?
42. (L4 [S]) Когда использовать JWT vs session-based auth?
43. (L4 [S]) Как проектировать authorization для микросервисов?
44. (L4 [S]) Как строить multi-layer защиту (defense in depth)?
45. (L4 [S]) Как проектировать rate limiting для глобальной системы?
46. (L4 [S]) Как защитить API от abuse?
47. (L4 [S]) Как проектировать систему устойчивую к DDoS?
48. (L4 [S]) Как балансировать security vs usability?
49. (L4 [S]) Как управлять секретами в distributed системе?
