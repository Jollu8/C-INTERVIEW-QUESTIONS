# Дополнительно: безопасность Python-приложений

Дополнительная ветка; проходите по задачам выбранной роли.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Как определить границу доверия для файлов, сетевых пакетов, конфигурации и параметров CLI?

   **Ответ:** Для каждого ingress указать источник/identity, возможный контроль атакующего и доступные process permissions. Определить schema/лимиты/validation до side effects, какие поля станут paths/argv/queries и куда может утечь output.

   **Источник:** [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

2. Почему `pickle` нельзя использовать для десериализации произвольных недоверенных данных?

   **Ответ:** Unpickling может выполнять произвольный код через reconstruction protocol. Использовать только доверенный authenticated payload соответствующего threat model; недоверенные данные передавать ограниченным format+schema, не «фильтровать опасные классы» наугад.

   **Источник:** [Python 3.14: library/pickle.html](https://docs.python.org/3.14/library/pickle.html)

3. Чем `eval` отличается от parser ограниченного формата и почему даже ограниченный parser требует ресурсных лимитов?

   **Ответ:** Eval исполняет Python expressions с доступными capabilities, parser лишь принимает заданную грамматику. Даже literal_eval/JSON parser могут исчерпать memory/CPU/depth, поэтому необходимы input/time/resource limits.

   **Источник:** [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html)

4. Почему передача аргументов без shell не исключает argument injection в самой запускаемой программе?

   **Ответ:** Shell=False запрещает shell interpretation, но `'-f...'`/другая option интерпретируется target executable. Контролировать executable/options и отделять operands через поддерживаемый `--` либо allowlisted interface.

   **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

5. Как path traversal отличается от гонки с symbolic links при доступе к файлам?

   **Ответ:** Traversal использует ../absolute paths для выхода из namespace; symlink race меняет разрешение пути между check/use. Resolve+relative check помогает policy, но не устраняет concurrent replacement без descriptor-based/no-follow access.

   **Источник:** [Python 3.14: library/os.html](https://docs.python.org/3.14/library/os.html); [Python 3.14: library/pathlib.html](https://docs.python.org/3.14/library/pathlib.html)

6. Какие лимиты нужны для распаковки архива и почему сжатый размер не ограничивает размер результата?

   **Ответ:** Ограничивать число/типы entries, total/uncompressed bytes, depth, compression ratio и time. Проверять links/paths/overwrite, Python 3.14 tar data filter полезен, но не полноценная sandbox/защита от resource exhaustion.

   **Рекомендация:** Проверять total extracted bytes/count/time независимо от применённого tar extraction filter.

   **Источник:** [Python 3.14: library/tarfile.html](https://docs.python.org/3.14/library/tarfile.html); [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

7. Как хранить и передавать secrets, не включая их в репозиторий, командную строку и диагностические логи?

   **Ответ:** Secret manager/protected file/workload identity с минимальными правами, коротким lifecycle и rotation. Не включать секреты в argv/log/репозиторий; environment тоже может раскрыться в debug/dumps и не является абсолютным safe vault.

   **Источник:** [OWASP: Secrets management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

8. Почему использование TLS требует проверки сертификата и имени сервера, а не только шифрования канала?

   **Ответ:** Без проверки цепочки/hostname можно шифровать канал атакующему посреднику. Использовать default verifying SSLContext с проверкой имени и trust policy; encryption-only/CERT_NONE не подтверждает endpoint identity.

   **Источник:** [Python 3.14: library/ssl.html](https://docs.python.org/3.14/library/ssl.html)

9. Как зависимости, build scripts и native extensions влияют на цепочку доверия пакета?

   **Ответ:** Build/install/native extension исполняют код с правами среды; пакетное имя и HTTPS не доказывают доверенность автора. Контролировать sources/resolution/hashes, build isolation и review/updates; build isolation не security sandbox.

   **Источник:** [pip: Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/); [PyPA: Packaging projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/)

10. Как ограничить полномочия процесса анализа недоверенных данных на Linux, не полагаясь только на проверки Python-кода?

    **Ответ:** Отдельный low-privilege process, ограниченные FD/filesystem/network, cgroups/resource/time budgets и policy namespaces/seccomp по среде. Python validation уменьшает attack surface, но interpreter не sandbox для произвольного кода.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html); [Python 3.14: library/os.html](https://docs.python.org/3.14/library/os.html); [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## Разбор кода

11. Почему внешний файл нельзя считать безопасным источником объектов и какой формат контракта нужен вместо этого?

   **Условие:**

   ```python
   import pickle

   with open("upload.bin", "rb") as stream:
       settings = pickle.load(stream)
   ```

    **Ответ:** Внешний upload контролируется отправителем, pickle.load способен вызвать код при чтении. Нужен ограниченный JSON/typed binary contract со schema/size/depth/version validation и process containment при hostile inputs.

    **Источник:** [Python 3.14: library/pickle.html](https://docs.python.org/3.14/library/pickle.html); [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html)

12. Почему обработка пути допускает выход за пределы каталога и каких проверок недостаточно при наличии symbolic links?

   **Условие:**

   ```python
   from pathlib import Path

   def read_upload(name):
       return (Path("uploads") / name).read_bytes()
   ```

    **Ответ:** Absolute name заменит uploads, ../ выйдет наружу, symlink перенаправит чтение. Проверка textual prefix неверна; для hostile concurrent directory нужны trusted dir FD и безопасный no-follow traversal/политика запрета links.

    **Источник:** [Python 3.14: library/pathlib.html](https://docs.python.org/3.14/library/pathlib.html); [Python 3.14: library/os.html](https://docs.python.org/3.14/library/os.html)

13. Почему отсутствие shell не делает пользовательскую строку безопасной опцией команды?

   **Условие:**

   ```python
   import subprocess

   def search(pattern):
       return subprocess.run(["grep", pattern, "input.txt"])
   ```

    **Ответ:** Pattern, начинающийся с '-', может стать grep option и изменить семантику/доступ к файлам. `['grep','--',pattern,'input.txt']` отделяет operand; если нужен literal поиск, добавить -F как контролируемую option.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

14. Какие категории секретов может раскрыть такой диагностический вывод и как сократить данные?

   **Условие:**

   ```python
   import logging
   import os

   logging.error("environment=%r", dict(os.environ))
   ```

    **Ответ:** Environment часто содержит credentials, tokens, proxy URLs и private paths/config. Логировать лишь allowlisted diagnostic keys с redaction, включая nested exception text; проверять captured logs на known secret markers.

    **Источник:** [Python 3.14: library/logging.html](https://docs.python.org/3.14/library/logging.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

15. Почему доверять длине из заголовка до проверки лимита опасно даже при корректной арифметике Python?

   **Условие:**

   ```python
   import struct

   def allocate(data):
       size = struct.unpack("!I", data[:4])[0]
       return bytearray(size)
   ```

    **Ответ:** Нет minimum-header/maximum-length проверки; uint32 может потребовать до нескольких GiB allocation и вызвать DoS. Проверять len≥4 и protocol max до bytearray, учитывать total concurrent memory budget/deadline.

    **Источник:** [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html); [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## Практические задачи

16. Как подготовить threat model загрузчика результатов эксперимента: входы, полномочия, лимиты, секреты и возможные отказы?

    **Ответ:** Нарисовать поток file/CLI/network→parser→storage/subprocess→report, отметить untrusted transformations и privileges. Для каждого threat задать control/limit, safe failure и проверяемый case: oversized, malicious path/option, corrupted format, leaked secret.

    **Источник:** [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

17. Как реализовать валидацию имени файла и процедуру безопасного создания файла с учётом принятой политики symbolic links?

    **Ответ:** Если нужен один файл, разрешать только допустимый basename без separators/absolute/. и ..; trusted directory открыть заранее. На Linux создавать через os.open с dir_fd и O_CREAT|O_EXCL|O_NOFOLLOW, заданными permissions, обрабатывать ошибки и не делать предварительный exists check.

    **Пример:**

    ```python
    import os
    import re

    def create_report(dir_fd, name):
        # Linux; dir_fd относится к заранее открытому доверенному каталогу.
        if re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,127}", name) is None:
            raise ValueError("invalid filename")
        flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW
        fd = os.open(name, flags, 0o600, dir_fd=dir_fd)
        try:
            return os.fdopen(fd, "wb")
        except BaseException:
            os.close(fd)
            raise
    ```

    **Типичная ошибка:** Считать resolve()+prefix check защитой от concurrent symlink replacement.

    **Источник:** [Python 3.14: library/os.html](https://docs.python.org/3.14/library/os.html); [Python 3.14: library/pathlib.html](https://docs.python.org/3.14/library/pathlib.html)

18. Как заменить сериализацию недоверенного pickle ограниченным форматом со схемой и ресурсными лимитами?

    **Ответ:** Версионированная JSON/ограниченная binary schema с explicit types/ranges/IDs и payload/collection/depth limits. Десериализация не создаёт произвольные classes; conversion в domain model после validation, unknown fields/error policy описаны.

    **Источник:** [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html); [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html); [Python 3.14: library/pickle.html](https://docs.python.org/3.14/library/pickle.html)

19. Как протестировать subprocess-wrapper на значения аргумента, начинающиеся с `-`, без запуска разрушительных команд?

    **Ответ:** Fake runner записывает argv, не исполняя команду. Parametrize '-', '--help', option-like names и spaces, проверить fixed executable/options, marker -- и сохранение user value одним operand; отдельный safe integration case проверяет поддерживаемую target semantics.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html); [Python 3.14: library/unittest.mock.html](https://docs.python.org/3.14/library/unittest.mock.html)

20. Как организовать logging с маскированием secrets и тестом того, что токены не попадают в сообщения об ошибках?

    **Ответ:** Prefer allowlist fields, затем redaction на logging boundary для known secret classes, включая exception/structured values. Caplog tests вводят unique token в config/exception и assert absence в output; formatting/sinks не обходят filter.

    **Источник:** [Python 3.14: library/logging.html](https://docs.python.org/3.14/library/logging.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Что прочитать

- [Python: pickle security](https://docs.python.org/3.14/library/pickle.html)
- [Python: subprocess security](https://docs.python.org/3.14/library/subprocess.html#security-considerations)
- [Python: security considerations](https://docs.python.org/3.14/library/security_warnings.html)

[← Предыдущая тема](./11_data_processing_optional.md) · [План раздела](./README.md) · [Следующая тема →](./13_runtime_internals_optional.md)
