# Security Testing

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 7. Security Testing

1. (L1 [T]) Что такое security testing и какие задачи оно решает?

   **Ответ:** Проверяет защиту активов и trust boundaries: конфиденциальность, целостность, доступность и контроль доступа. Scope тестирования определяется угрозами, а не одним scanner.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

2. (L1 [T]) Какие основные категории уязвимостей существуют в ПО?

   **Ответ:** Broken access control, injection, authentication/configuration errors, vulnerable dependencies и memory/lifetime defects; конкретная taxonomy зависит от приложения и модели угроз.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

3. (L1 [T]) Что такое OWASP Top 10 и зачем он используется?

   **Ответ:** OWASP Top 10 — версионируемый обзор значимых рисков web applications, полезный для awareness и приоритизации. Полный план проверок строят по threat model и WSTG/ASVS, не только по списку десяти категорий.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

4. (L1 [T]) В чем разница между аутентификацией и авторизацией?

   **Ответ:** Authentication подтверждает identity, authorization решает, какие действия и объекты ей доступны. Валидный login не разрешает доступ к чужому tenant.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

5. (L1 [T]) Что такое шифрование и где оно применяется в системах?

   **Ответ:** Шифрование защищает данные в transit/at rest с использованием ключей; не заменяет authorization и не устраняет утечку после легитимного decrypt.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)


6. (L2 [T]) Что такое статический анализ (SAST) и динамический анализ (DAST)?

   **Ответ:** SAST исследует code/build artifacts без обычного запуска, DAST проверяет работающий interface. Они имеют разные coverage gaps и false positives.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

7. (L2 [T]) В чем разница между SAST, DAST и IAST?

   **Ответ:** IAST использует instrumentation работающего приложения для наблюдения исполнения во время тестов; coverage зависит от paths и поддерживаемого runtime. SAST/DAST не требуют той же модели instrumentation.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

8. (L2 [P]) Какие инструменты используются для статического анализа C++ (Clang-Tidy, cppcheck)?

   **Ответ:** Clang-Tidy/Static Analyzer и Cppcheck выявляют определённые defects; compiler warnings, SCA и sanitizers дополняют их. Findings требуют проверки достижимости и impact.

   **Источник:** [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/); [Clang Static Analyzer](https://clang.llvm.org/docs/ClangStaticAnalyzer.html)

9. (L2 [P]) Как выявлять уязвимости типа SQL injection, XSS, CSRF на уровне API?

   **Ответ:** Проверять parameterized DB queries, контекстное output encoding для будущих UI consumers и CSRF protection cookie-based sessions; отсутствие HTML в самом API не исключает downstream XSS.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

10. (L2 [P]) Как тестировать безопасность REST/gRPC API?

    **Ответ:** Проверить TLS, identity/permissions per object/tenant, schema/size limits, rate limits и ошибки без secrets; для gRPC учитывать metadata/status и streaming lifecycle.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

11. (L2 [P]) Как проверять корректность обработки пользовательского ввода?

    **Ответ:** Boundary/invalid encodings, oversized и deeply nested inputs, numeric limits и semantic constraints; malformed input не должен вызывать crash или partial unsafe state.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

12. (L2 [P]) Как тестировать механизмы аутентификации (JWT, OAuth)?

    **Ответ:** Проверить signature и allowed algorithms, issuer/audience/expiry и key rotation JWT; OAuth — authorization framework, identity обычно задаётся OIDC. Проверять redirects/state/PKCE для применимого flow.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

13. (L2 [P]) Как тестировать механизмы авторизации (roles, permissions)?

    **Ответ:** Построить role × action × object/tenant matrix с allow/deny; проверять server-side enforcement, direct-object access и privilege changes между запросами.

    **Пример:** Минимальная matrix для ресурса одного tenant:

    | Actor | Свой объект | Чужой tenant | Admin endpoint |
    | --- | --- | --- | --- |
    | User A | Разрешённое действие | Отказ | Отказ |
    | User B | По своему contract | Отказ | Отказ |
    | Tenant admin | Только свой scope | Отказ | Только явные полномочия |

    Отказ проверяют вместе с отсутствием side effects, не только по status code.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

14. (L2 [T]) Какие особенности безопасности характерны для C++ (memory safety, UB)?

    **Ответ:** Bounds, use-after-free, integer errors и UB могут превращать input parsing в memory corruption; RAII не заменяет validation и безопасный parser contract.

    **Источник:** [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

15. (L2 [P]) Как использовать fuzz testing для поиска уязвимостей?

    **Ответ:** Выделить parser/API harness, использовать corpus, coverage feedback и sanitizers; сохранять seed/minimized input и проверять crash, hang и invariants.

    **Пример:** Фрагмент harness для LibFuzzer с ограничением длины input. `parse_message` — реальный parser проекта, вызываемый через его согласованный контракт.

    ```cpp
    #include <cstddef>
    #include <cstdint>

    void parse_message(const std::uint8_t* data, std::size_t size);

    extern "C" int LLVMFuzzerTestOneInput(const std::uint8_t* data,
                                        std::size_t size) {
        if (size > 64 * 1024) return 0;
        parse_message(data, size);
        return 0;
    }
    ```

    Parser linking и flags `-fsanitize=fuzzer,address,undefined` требуют поддерживаемого Clang runtime. Expected parse errors обрабатывают согласно API, а unexpected crashes не скрывают blanket catch.

    **Источник:** [LLVM LibFuzzer](https://llvm.org/docs/LibFuzzer.html)


16. (L3 [D]) Как диагностировать уязвимости, связанные с memory corruption (buffer overflow, use-after-free)?

    **Ответ:** ASan/UBSan report, exact input и allocation/access/free stacks; ошибка проявления может находиться позже первого повреждения памяти.

    **Источник:** [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

17. (L3 [D]) Как выявлять проблемы race conditions и TOCTOU (time-of-check to time-of-use)?

    **Ответ:** Проверять атомарность resource validation/use и ownership; TSan видит часть in-process data races, но не все filesystem/distributed TOCTOU сценарии.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

18. (L3 [P]) Как тестировать безопасность многопоточных C++ приложений?

    **Ответ:** Stress с управляемыми interleavings, TSan и проверки permissions/lifetime под конкуренцией; логический authorization race возможен и с atomics.

    **Источник:** [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

19. (L3 [P]) Как использовать sanitizers (ASan, UBSan, TSan) для обнаружения проблем?

    **Ответ:** ASan+UBSan часто совместимы; TSan запускают отдельно в supported configuration. Они проверяют лишь исполненные paths и не подтверждают общую защищённость системы.

    **Источник:** [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

20. (L3 [D]) Как расследовать инциденты безопасности в production?

    **Ответ:** Сохранить evidence и timeline, ограничить scope воздействия, отозвать подтверждённо скомпрометированные credentials и восстановить service; затем проверить entry point и recurrence controls.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

21. (L3 [P]) Как тестировать secure communication (TLS, сертификаты, key rotation)?

    **Ответ:** Проверить hostname/chain/expiry, отсутствие trust bypass, взаимную auth где нужна, перекрытие old/new keys и revocation policy. Rotation тестируют при активных connections и rollout.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

22. (L3 [D]) Как выявлять утечки секретов и чувствительных данных?

    **Ответ:** Secret scanning source/history/artifacts и контролируемая проверка logs/errors/dumps; masking в UI не удаляет secret из storage или uploaded reports.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

23. (L3 [P]) Как проводить threat modeling для системы?

    **Ответ:** Описать assets, actors, data flows и trust boundaries, затем угрозы, controls и способы проверки; обновлять при изменении архитектуры.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

24. (L3 [D]) Как интерпретировать результаты security-сканеров и отличать false positive?

    **Ответ:** Проверить version/config, достижимый path, existing mitigations и reproducer; severity scanner не заменяет оценку реального business impact.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

25. (L3 [P]) Как тестировать устойчивость к DoS/DDoS атакам?

    **Ответ:** В изолированном согласованном стенде проверить quotas, bounded parsing/queues, overload rejection и recovery; контролировать ресурсный бюджет generator и targets.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)


26. (L4 [S]) Как выстроить secure SDLC (встроить безопасность на всех этапах разработки)?

    **Ответ:** Security requirements, design review, threat modeling, code/dependency checks, runtime tests и incident response входят в обычный delivery lifecycle.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

27. (L4 [S]) Как интегрировать security testing в CI/CD pipeline?

    **Ответ:** PR — быстрый secret/SAST/SCA gate, deeper DAST/fuzz по расписанию, release checks exact artifacts; exceptions имеют owner и срок пересмотра.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

28. (L4 [S]) Как внедрить практики security-by-design в архитектуру системы?

    **Ответ:** Least privilege, explicit trust boundaries, безопасные defaults, bounded resources и минимальный public attack surface; проверять controls negative tests.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

29. (L4 [S]) Как управлять уязвимостями и их приоритизацией в организации?

    **Ответ:** Triage по exploitability, exposure, impact и доступным mitigations; назначить owners, due dates и validation fix вместо одной сортировки CVSS.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

30. (L4 [S]) Как масштабировать процессы безопасности между командами разработки?

    **Ответ:** Общие guardrails/templates и security champions в командах, reusable checks и централизованная помощь по сложным threat models.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

31. (L4 [S]) Как обеспечить соответствие стандартам и требованиям (compliance, audit)?

    **Ответ:** Определить применимые требования и контрольные evidence, владельцев, scope и retention. Прохождение тестов само по себе не подтверждает compliance и не заменяет требуемый аудит.

    **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
