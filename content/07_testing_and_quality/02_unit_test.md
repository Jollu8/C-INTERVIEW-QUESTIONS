# Unit Testing в C++

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 2. Unit Testing

1. (L1 [T]) Что такое unit-тесты и какую задачу они решают в C++-проекте?

   **Ответ:** Проверяют небольшой фрагмент поведения C++ code: функцию, класс или coherent component. Граница unit определяется контрактом и контролируемыми dependencies, не обязательно одним методом.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

2. (L1 [T]) Какими свойствами должен обладать хороший unit-тест?

   **Ответ:** Тест имеет понятное имя, контролируемые inputs, конкретный oracle, независимый setup/cleanup и диагностичную ошибку; выполняется достаточно быстро для частого запуска.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

3. (L1 [T]) Чем unit-тест отличается от integration-теста?

   **Ответ:** Integration намеренно включает реальный стык компонентов/систем; unit локализует правило и обычно подменяет медленные или недетерминированные dependencies.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

4. (L1 [T]) Почему unit-тесты должны быть быстрыми, изолированными и детерминированными?

   **Ответ:** Это позволяет часто запускать suite и доверять failure: изменение результата должно объясняться поведением системы, а не случайным состоянием среды.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

5. (L1 [T]) Какие риски возникают, если unit-тесты зависят от файловой системы, сети или БД?

   **Ответ:** Появляются timing failures, shared state, permissions и environment drift; если реальное I/O существенно для проверяемого контракта, классифицировать проверку как integration.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)


6. (L2 [T]) Какие фреймворки unit-тестирования наиболее популярны в C++ (GoogleTest, Catch2, doctest) и чем они отличаются?

   **Ответ:** GoogleTest предоставляет xUnit-style suites и интеграцию с GoogleMock; Catch2 использует TEST_CASE/sections и matchers; doctest — компактный framework с возможностью размещать tests рядом с code. Выбор зависит от требований сборки и команды.

   **Источник:** [GoogleTest](https://google.github.io/googletest/primer.html); [Catch2](https://catch2-temp.readthedocs.io/en/latest/); [doctest](https://github.com/doctest/doctest)

7. (L2 [P]) Как организовать структуру unit-тестов в C++-репозитории?

   **Ответ:** Отдельные test targets по модулям, общие минимальные helpers и CTest registration; не добавлять test-only dependencies в публичные production headers.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

8. (L2 [P]) Как писать тесты для функций, классов и шаблонного кода в C++?

   **Ответ:** Организовать arrange/act/assert, проверять observable outputs и invariants. Для templates выбирать representative types и compile-time assertions для constraints.

   **Пример:** GoogleTest, C++17. Contract приложения: capacity ограничивает число принимаемых элементов.

   ```cpp
   #include <gtest/gtest.h>
   #include <algorithm>
   #include <cstddef>
   #include <limits>

   std::size_t admitted(std::size_t requested, std::size_t capacity) {
       return std::min(requested, capacity);
   }

   TEST(AdmissionTest, HandlesBoundaries) {
       EXPECT_EQ(admitted(0, 10), 0u);
       EXPECT_EQ(admitted(8, 10), 8u);
       EXPECT_EQ(admitted(10, 10), 10u);
       EXPECT_EQ(admitted(11, 10), 10u);
       EXPECT_EQ(admitted(std::numeric_limits<std::size_t>::max(), 0), 0u);
   }
   ```

   Тест должен падать, если implementation перестанет ограничивать requested. Число cases не заменяет проверки полного контракта.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

9. (L2 [P]) Как использовать fixtures в GoogleTest или Catch2?

   **Ответ:** Fixture создаёт исходное состояние каждого теста и освобождает ресурсы через RAII/teardown; shared expensive state должно быть read-only или надёжно изолированным.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

10. (L2 [P]) Как тестировать исключения, граничные случаи и ошибки валидации?

    **Ответ:** Проверять invalid/empty/extreme inputs и точный exception/error contract; после failure — сохранность состояния и отсутствие утечек. Для unsigned/signed boundaries избегать UB в самом тесте.

    **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

11. (L2 [T]) Что такое mocks, stubs и fakes, и в чем между ними разница?

    **Ответ:** Stub выдаёт заранее заданные ответы; mock проверяет interactions; fake реализует упрощённый working substitute. Названия уточняют в команде, не смешивая fake с реальной внешней системой.

    **Источник:** [GoogleMock Cookbook](https://google.github.io/googletest/gmock_cook_book.html)

12. (L2 [P]) Как использовать GoogleMock для изоляции зависимостей?

    **Ответ:** Выделить dependency interface, внедрить Mock object, настроить ON_CALL/EXPECT_CALL только для существенного контракта; object должен жить до завершения SUT work.

    **Пример:** Фрагмент GoogleMock. Именно один вызов публикации важен для этого условного контракта; это не гарантия exactly-once delivery по сети.

    ```cpp
    #include <gmock/gmock.h>
    #include <gtest/gtest.h>
    #include <string_view>

    struct Publisher {
        virtual ~Publisher() = default;
        virtual bool publish(std::string_view message) = 0;
    };
    struct MockPublisher : Publisher {
        MOCK_METHOD(bool, publish, (std::string_view), (override));
    };
    bool submit(Publisher& publisher) { return publisher.publish("ready"); }

    TEST(SubmitTest, PropagatesPublishFailure) {
        MockPublisher publisher;
        EXPECT_CALL(publisher, publish(std::string_view("ready")))
            .Times(1).WillOnce(::testing::Return(false));
        EXPECT_FALSE(submit(publisher));
    }
    ```

    **Типичная ошибка:** Возвращать из mock успех и считать, что этим проверена реальная delivery semantics.

    **Источник:** [GoogleMock Cookbook](https://google.github.io/googletest/gmock_cook_book.html)

13. (L2 [P]) Когда мок уместен, а когда лучше использовать реальную или fake-реализацию?

    **Ответ:** Mock полезен для обязательного interaction вроде ровно одного commit; fake удобен для stateful сценария, реальная dependency — для проверки интеграционного контракта.

    **Источник:** [GoogleMock Cookbook](https://google.github.io/googletest/gmock_cook_book.html)

14. (L2 [T]) Что такое TDD и как выглядит цикл red-green-refactor в C++?

    **Ответ:** Сначала тест падает из-за отсутствующего поведения, затем минимальный code делает его зелёным, после чего implementation/test refactor сохраняет контракт.

    **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

15. (L2 [P]) В каких случаях TDD особенно полезен при разработке на C++?

    **Ответ:** Для parsers, state machines, business rules и воспроизводимых bug fixes; для exploratory UI/hardware work сначала может понадобиться прототип и уточнение oracle.

    **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)


16. (L3 [D]) Почему unit-тесты в C++ могут становиться flaky даже без внешних зависимостей?

    **Ответ:** UB, uninitialized memory, invalid lifetime, unordered iteration и races сохраняют недетерминизм даже без сети/БД.

    **Источник:** [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

17. (L3 [D]) Как диагностировать нестабильные тесты, связанные с неопределенным поведением, временем жизни объектов или гонками данных?

    **Ответ:** Зафиксировать seed/order, выполнить ASan/UBSan и отдельную TSan build, затем минимизировать failing case; report проверять по access/allocation/free stacks.

    **Источник:** [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

18. (L3 [P]) Как тестировать legacy C++-код с сильной связностью и отсутствием явных интерфейсов?

    **Ответ:** Создать characterization tests на существующей границе, выделить seams для времени/I/O и менять dependencies постепенно; не начинать с полной переписи ради mocking.

    **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

19. (L3 [P]) Как покрывать unit-тестами код с RAII, move semantics и smart pointers?

    **Ответ:** Проверить однократное освобождение, перенос ownership и поведение moved-from в рамках его documented contract; использовать tracked fake resource и не предполагать неизменный pointer address.

    **Пример:** Самостоятельный C++17 test executable, проверяющий lifetime при move `unique_ptr`.

    ```cpp
    #include <memory>
    #include <utility>

    struct Resource {
        int& destroyed;
        explicit Resource(int& count) : destroyed(count) {}
        ~Resource() { ++destroyed; }
    };

    int main() {
        int destroyed = 0;
        {
            auto owner = std::make_unique<Resource>(destroyed);
            auto next = std::move(owner);
            if (owner || !next || destroyed != 0) return 1;
            next.reset();
            if (destroyed != 1) return 2;
        }
        return destroyed == 1 ? 0 : 3;
    }
    ```

    Проверки не используют `assert`, поэтому не исчезают при `NDEBUG`. В рабочем проекте тот же invariant обычно выражают средствами test framework.

    **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

20. (L3 [P]) Как тестировать многопоточный код на уровне unit-тестов?

    **Ответ:** Синхронизировать тест barriers/latches вместо sleep, проверять invariants и завершение; TSan/stress дополняют такие тесты, но не доказывают все interleavings.

    **Типичная ошибка:** Добавлять `sleep(1)` и считать порядок потоков доказанным. Sleep меняет вероятность interleaving, но не создаёт happens-before.

    **Источник:** [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

21. (L3 [D]) Как выявлять ложноположительные unit-тесты, которые проходят, но не проверяют реальное поведение?

    **Ответ:** Изменить expected behavior через intentional mutation и проверить, что тест падает; искать отсутствующие assertions, ignored return values и mocks, обходящие проверяемую логику.

    **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

22. (L3 [T]) Какие ошибки проектирования чаще всего мешают тестируемости C++-кода?

    **Ответ:** Globals/singletons, hidden I/O/time, смешение policy и mechanism, неясное ownership и giant constructors усложняют setup и контроль состояния.

    **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

23. (L3 [P]) Как тестировать шаблоны, policy-based design и compile-time логику?

    **Ответ:** Для constexpr logic применять static_assert, для templates — parameterized/typed tests и negative compile tests; runtime correctness отдельно от успешной instantiation.

    **Пример:** C++17 compile-time проверка contract простой constexpr policy.

    ```cpp
    #include <cstddef>

    constexpr std::size_t bounded(std::size_t n, std::size_t capacity) {
        return n < capacity ? n : capacity;
    }
    static_assert(bounded(0, 0) == 0);
    static_assert(bounded(3, 5) == 3);
    static_assert(bounded(7, 5) == 5);
    ```

    Negative compile tests — отдельные ожидаемо некомпилируемые translation units; failure test harness должен отличать нужную diagnostic от ошибки окружения.

    **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

24. (L3 [D]) Как интерпретировать падения unit-тестов, связанные с UB, segmentation fault или memory corruption?

    **Ответ:** Сначала invalid operation и память/lifetime, затем вызывающий test; ASSERT failure, process crash и sanitizer diagnostic — разные механизмы failure.

    **Источник:** [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


25. (L4 [S]) Как выстроить стратегию unit-тестирования для большого C++-проекта с несколькими модулями и командами?

    **Ответ:** Согласовать component contracts, ownership и supported configurations; быстрые suites запускать локально/PR, broad matrix и sanitizers по рискам и бюджету.

    **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

26. (L4 [S]) Как определить границы unit-тестирования для low-level, platform-specific и performance-critical кода?

    **Ответ:** Тестировать чистую policy на unit уровне, а OS/hardware semantics — на integration/target стенде; performance expectations измерять отдельными representative benchmarks.

    **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

27. (L4 [S]) Как встроить unit-тесты C++ в CI/CD с учетом времени сборки и обратной связи для разработчиков?

    **Ответ:** Отдельные test targets, incremental compilation и CTest labels/parallelism; сохранить failure logs, seed и compiler/config identity.

    **Источник:** [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [CMake GoogleTest module](https://cmake.org/cmake/help/latest/module/GoogleTest.html)

28. (L4 [S]) Как сбалансировать unit-тесты, sanitizers, static analysis и integration-тесты в C++-экосистеме?

    **Ответ:** Unit проверяет examples/invariants, sanitizer — нарушения исполненного code, static analysis — modelled paths, integration — реальные стыки. Они дополняют, а не заменяют друг друга.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

29. (L4 [S]) Какие архитектурные решения повышают testability C++-системы в долгосрочной перспективе?

    **Ответ:** Explicit dependencies, coherent modules, RAII, чистая логика и управляемые clocks/executors делают тесты проще без изменения public API под каждую проверку.

    **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
