# Ресурсы по Testing & Quality

## 📚 Resources

## Документация для практики

| Задача | Первичные источники |
| --- | --- |
| Терминология, анализ рисков и тест-дизайн | [ISTQB CTFL syllabus](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/), [ISTQB Glossary](https://glossary.istqb.org/) |
| C++ unit tests и doubles | [GoogleTest Primer](https://google.github.io/googletest/primer.html), [GoogleMock Cookbook](https://google.github.io/googletest/gmock_cook_book.html), [Catch2](https://catch2-temp.readthedocs.io/en/latest/), [doctest](https://github.com/doctest/doctest) |
| Регистрация и запуск тестов | [CMake GoogleTest module](https://cmake.org/cmake/help/latest/module/GoogleTest.html), [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html) |
| Integration и contracts | [Testcontainers](https://testcontainers.com/), [Pact](https://docs.pact.io/), [Protocol Buffers compatibility](https://protobuf.dev/programming-guides/proto3/#updating) |
| API и schemas | [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110), [OpenAPI](https://spec.openapis.org/oas/latest.html), [JSON Schema](https://json-schema.org/understanding-json-schema/), [GraphQL specification](https://spec.graphql.org/), [grpcurl](https://github.com/fullstorydev/grpcurl) |
| E2E | [Playwright](https://playwright.dev/docs/best-practices), [Cypress](https://docs.cypress.io/), [Selenium](https://www.selenium.dev/documentation/) |
| Нагрузочные сценарии | [k6](https://grafana.com/docs/k6/latest/), [JMeter](https://jmeter.apache.org/usermanual/), [Locust](https://docs.locust.io/), [Google Benchmark](https://github.com/google/benchmark/blob/main/docs/user_guide.md) |
| Security и C++ memory/concurrency defects | [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/), [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/), [ASan](https://clang.llvm.org/docs/AddressSanitizer.html), [TSan](https://clang.llvm.org/docs/ThreadSanitizer.html), [LibFuzzer](https://llvm.org/docs/LibFuzzer.html) |
| Review и анализ | [Google Code Review Practices](https://google.github.io/eng-practices/review/), [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/), [ClangFormat](https://clang.llvm.org/docs/ClangFormat.html) |
| Quality в delivery | [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html), [GitHub Actions](https://docs.github.com/en/actions), [GitLab CI](https://docs.gitlab.com/ci/), [Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/) |
| Runtime evidence и reliability | [OpenTelemetry C++](https://opentelemetry.io/docs/languages/cpp/), [Prometheus](https://prometheus.io/docs/introduction/overview/), [Google SRE](https://sre.google/sre-book/table-of-contents/) |
| AI-assisted testing и model evaluation risks | [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework), [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) |

Ссылки ведут на поддерживаемую документацию проектов; для воспроизводимого упражнения фиксируют конкретные versions/commits. Старые статьи и книги полезно сопоставлять с текущими APIs, не переносить команды без проверки.

## Практический маршрут

- Выберите небольшую C++ библиотеку с явным контрактом: добавьте unit boundaries, RAII failure paths и один intentional defect, который тест должен обнаружить.
- Добавьте реальный storage/API integration test с isolated данными и проверкой timeout/retry/idempotency.
- Подключите CTest и отдельные sanitizer configurations; сохраните artifact identity и понятный failure report.
- Для сервиса задайте измеримый SLO и representative load, соберите correlated metrics/traces и объясните найденный bottleneck.
- Если используете AI, сравните предложенные assertions с независимым oracle и negative control; не считайте рост числа тестов достаточной оценкой.


### 📖 Книги

- **Testing & QA**
    - *Clean Code* — Robert C. Martin
    - *The Pragmatic Programmer* — Andrew Hunt, David Thomas
    - *Software Testing* — Ron Patton
    - *Foundations of Software Testing* — Dorothy Graham
    - *Agile Testing* — Lisa Crispin, Janet Gregory

- **Test Automation**
    - *Test Automation in the Real World* — Greg Paskal
    - *xUnit Test Patterns* — Gerard Meszaros

- **Architecture & Quality**
    - *Clean Architecture* — Robert C. Martin
    - *Building Microservices* — Sam Newman

- **C++ (важно для testing контекста)**
    - *Effective C++* — Scott Meyers
    - *Clean C++* — Stephan Roth
    - *Large-Scale C++ Software Design* — John Lakos

---

### 🎓 Курсы

- **Общие**
    - Coursera / edX — Software Testing & QA курсы
    - Udemy — практические курсы по automation (Selenium, API testing)

- **Специализированные**
    - Test Automation University (бесплатно)
    - Google Testing Blog & материалы

- **C++ / Systems**
    - C++ Nanodegree (Udacity)
    - Advanced C++ (Pluralsight)

---

### 🔧 Документация и инструменты

- **Testing frameworks**
    - GoogleTest / GoogleMock
    - Catch2
    - doctest

- **API testing**
    - Postman
    - REST Assured
    - curl / grpcurl

- **Performance**
    - k6
    - JMeter
    - wrk

- **Static analysis**
    - clang-tidy
    - cppcheck
    - SonarQube

- **CI/CD**
    - GitHub Actions
    - GitLab CI
    - Jenkins

---

### 🌐 Полезные ресурсы

- Блоги:
    - Martin Fowler
    - Google Testing Blog
    - Netflix Tech Blog

- Сообщества:
    - Stack Overflow
    - Reddit (r/softwaretesting, r/cpp)

- Практика:
    - Open-source проекты на GitHub
    - Code review в реальных проектах

---

### 🧠 Рекомендации по обучению

- Комбинировать теорию + практику (писать тесты сразу)
- Читать код open-source проектов
- Делать учебные проекты с проверкой критичных рисков, meaningful assertions и известными ограничениями coverage
- Регулярно проходить code review
- Изучать реальные инциденты (postmortems)
