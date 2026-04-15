## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 13. CI/CD и качество

1. (L1 [T]) Что такое CI/CD и какие задачи он решает?
2. (L1 [T]) Что такое pipeline и из каких этапов он состоит?
3. (L1 [T]) Какую роль играют тесты в CI/CD?
4. (L1 [T]) Что такое quality gates?
5. (L1 [T]) Что такое continuous testing?

6. (L2 [P]) Как организовать pipeline для проекта с C++ backend?
7. (L2 [P]) Какие типы тестов должны запускаться на разных этапах CI/CD?
8. (L2 [P]) Как настроить автоматический запуск тестов на commit / pull request / merge?
9. (L2 [P]) Как внедрить quality gates (coverage, lint, tests, security checks)?
10. (L2 [P]) Как управлять зависимостями и сборкой (CMake, Conan, vcpkg) в CI?
11. (L2 [P]) Как оптимизировать время выполнения pipeline?
12. (L2 [P]) Как организовать параллельный запуск тестов?
13. (L2 [P]) Как работать с артефактами (build artifacts, test reports, logs)?
14. (L2 [T]) Какие риски возникают при плохо настроенном CI/CD?
15. (L2 [P]) Как интегрировать static analysis и security checks в pipeline?

16. (L3 [D]) Почему CI/CD pipeline становится медленным и как найти узкие места?
17. (L3 [D]) Как диагностировать нестабильные (flaky) тесты в CI?
18. (L3 [P]) Как разделять pipeline на быстрые (pre-merge) и полные (post-merge) проверки?
19. (L3 [P]) Как балансировать между скоростью pipeline и качеством проверок?
20. (L3 [D]) Как расследовать падения pipeline: проблема инфраструктуры или кода?
21. (L3 [P]) Как внедрять incremental builds и caching для C++?
22. (L3 [P]) Как управлять environment drift между CI и production?
23. (L3 [D]) Как интерпретировать метрики CI/CD (build time, failure rate)?
24. (L3 [P]) Как внедрять rollback и safe deployment практики?
25. (L3 [P]) Как обеспечивать reproducible builds?

26. (L4 [S]) Как выстроить стратегию CI/CD для крупной инженерной организации?
27. (L4 [S]) Как внедрить continuous testing как часть engineering культуры?
28. (L4 [S]) Как определить оптимальный набор quality gates?
29. (L4 [S]) Как масштабировать CI/CD для множества сервисов и команд?
30. (L4 [S]) Как интегрировать observability в CI/CD pipeline?
31. (L4 [S]) Как связать CI/CD метрики с бизнес-метриками и качеством продукта?
