# CI/CD и качество

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

   **Ответ:** CI проверяет частые интеграции, Continuous Delivery поддерживает готовность release, Continuous Deployment автоматически выпускает прошедшие проверки изменения.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

2. (L1 [T]) Что такое pipeline и из каких этапов он состоит?

   **Ответ:** Dependency graph jobs: setup/configure/build, tests/analysis, package и delivery; порядок определяется artifact dependencies, не только названиями stages.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

3. (L1 [T]) Какую роль играют тесты в CI/CD?

   **Ответ:** Дают воспроизводимый evidence о поведении candidate; результат должен относиться к exact commit/artifact и влиять на agreed gates.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

4. (L1 [T]) Что такое quality gates?

   **Ответ:** Заранее заданные условия допуска: обязательные checks, limits и known-risk policy. Зелёный gate отражает только то, что реально проверяется.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

5. (L1 [T]) Что такое continuous testing?

   **Ответ:** Проверки на протяжении lifecycle с короткой обратной связью: от requirements/contracts до deployment и production observations.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)


6. (L2 [P]) Как организовать pipeline для проекта с C++ backend?

   **Ответ:** Pinned toolchain/dependencies, CMake configure/build, CTest suites, separate sanitizer/static jobs и сохранение artifacts/symbols с build identity.

   **Пример:** Shell steps для проекта, который уже регистрирует свои tests в CTest:

   ```bash
   cmake -S . -B build-ci -DCMAKE_BUILD_TYPE=RelWithDebInfo
   cmake --build build-ci --parallel 2
   ctest --test-dir build-ci --output-on-failure --no-tests=error
   ```

   `--no-tests=error` требует CTest 3.26+. Single-config BUILD_TYPE не заменяет `--config` для multi-config generators.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

7. (L2 [P]) Какие типы тестов должны запускаться на разных этапах CI/CD?

   **Ответ:** PR — быстрые unit/contracts и ключевые integration, scheduled — full matrix/stress/fuzz, release — supported configs и exact deployment artifact.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

8. (L2 [P]) Как настроить автоматический запуск тестов на commit / pull request / merge?

   **Ответ:** Repository event triggers и branch/path conditions задают jobs; required checks должны завершаться понятным status, а не зависать из-за filter.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

9. (L2 [P]) Как внедрить quality gates (coverage, lint, tests, security checks)?

   **Ответ:** Выбрать high-signal checks по risks, закрепить versions/thresholds и no-new-defects baseline; не вводить общий coverage процент без контекста.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

10. (L2 [P]) Как управлять зависимостями и сборкой (CMake, Conan, vcpkg) в CI?

    **Ответ:** Versioned toolchain/presets и dependency locks, separate build trees/configs; package-manager cache не заменяет pinning и manifest.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

11. (L2 [P]) Как оптимизировать время выполнения pipeline?

    **Ответ:** Измерять queue/setup/compile/link/test critical path, устранять duplicates и parallelize independent work; сохранять periodic clean build.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

12. (L2 [P]) Как организовать параллельный запуск тестов?

    **Ответ:** Изолированные data/ports/resources, runner capacity и shard balancing; CTest parallelism допустим только для independent tests.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

13. (L2 [P]) Как работать с артефактами (build artifacts, test reports, logs)?

    **Ответ:** Immutable outputs с manifest/hash/commit, retention exact binaries/symbols и sanitized failure reports; downstream получает проверенный artifact, а не случайный rebuild.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

14. (L2 [T]) Какие риски возникают при плохо настроенном CI/CD?

    **Ответ:** False green, не те binaries, cache pollution, skipped tests и credentials leakage; policy и evidence проверяют отдельно от успешного UI job.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

15. (L2 [P]) Как интегрировать static analysis и security checks в pipeline?

    **Ответ:** Pinned analyzer configs и compile database, secret/dependency checks, reports и reviewed suppressions; costly fuzz/DAST выполнять на нужной среде.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)


16. (L3 [D]) Почему CI/CD pipeline становится медленным и как найти узкие места?

    **Ответ:** Разделить ожидание runner и execution, оценить setup/build/test stages, retries и duplicated work; оптимизировать measured bottleneck.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

17. (L3 [D]) Как диагностировать нестабильные (flaky) тесты в CI?

    **Ответ:** Сохранить first failure, seed, order, runner image и artifacts; проверить shared state/timeouts/UB, а не только увеличить reruns.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

18. (L3 [P]) Как разделять pipeline на быстрые (pre-merge) и полные (post-merge) проверки?

    **Ответ:** Разделить по risk/feedback latency и поддерживаемой matrix; post-merge failures обязаны иметь owner и процесс реакции.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

19. (L3 [P]) Как балансировать между скоростью pipeline и качеством проверок?

    **Ответ:** Убрать избыточное execution, но сохранять meaningful coverage; gate требует достоверного сигнала, а не максимального числа jobs.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

20. (L3 [D]) Как расследовать падения pipeline: проблема инфраструктуры или кода?

    **Ответ:** Сопоставить failure signature с environment changes и code diff, воспроизвести clean run; infra failure тоже должен быть наблюдаемым и owned.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

21. (L3 [P]) Как внедрять incremental builds и caching для C++?

    **Ответ:** Явный dependency graph и ccache/sccache с полным input identity; periodic clean builds выявляют missing dependencies и stale output reuse.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

22. (L3 [P]) Как управлять environment drift между CI и production?

    **Ответ:** Pinned images/digests, manifests и configuration contracts; production constraints тестируют явно, поскольку container image не фиксирует весь host environment.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

23. (L3 [D]) Как интерпретировать метрики CI/CD (build time, failure rate)?

    **Ответ:** Build time, queue time, flake rate и failure causes измеряют по сопоставимым projects/configs; raw red rate может расти при появлении полезных checks.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

24. (L3 [P]) Как внедрять rollback и safe deployment практики?

    **Ответ:** Canary/gradual rollout, health/SLO gates и заранее проверенный rollback; data migrations требуют отдельного forward/backward compatibility плана.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

25. (L3 [P]) Как обеспечивать reproducible builds?

    **Ответ:** Declared/pinned inputs, deterministic generators и controlled paths/time/environment; independent clean rebuild и сравнение выбранных output hashes.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)


26. (L4 [S]) Как выстроить стратегию CI/CD для крупной инженерной организации?

    **Ответ:** Общие versioned templates и artifact contracts, runner pools по trust/workload, product-owned gates и staged platform updates.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

27. (L4 [S]) Как внедрить continuous testing как часть engineering культуры?

    **Ответ:** Прозрачный local feedback, ответственность за failures и совместное улучшение requirements/testability; automation поддерживает engineering decisions, не заменяет их.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

28. (L4 [S]) Как определить оптимальный набор quality gates?

    **Ответ:** Выбирать controls по defect history, impact и signal/noise; регулярно пересматривать cost, исключения и uncovered risks.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

29. (L4 [S]) Как масштабировать CI/CD для множества сервисов и команд?

    **Ответ:** Автономные service pipelines с общими interfaces/reporting, isolated data и platform owners; dependency changes проверяются contracts и compatibility matrix.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

30. (L4 [S]) Как интегрировать observability в CI/CD pipeline?

    **Ответ:** Logs/metrics/traces jobs с run/commit identity, stage timings и deployment annotations; secrets и высококардинальные labels контролируются.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

31. (L4 [S]) Как связать CI/CD метрики с бизнес-метриками и качеством продукта?

    **Ответ:** Сопоставить feedback/rework/deployment reliability с user outcomes/cost; учитывать changes in exposure, а не приписывать весь эффект pass rate.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)
