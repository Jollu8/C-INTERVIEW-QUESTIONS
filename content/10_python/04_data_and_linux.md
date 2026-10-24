# Файлы, бинарные данные, процессы и Linux

Этап 4 основного маршрута Python для системного разработчика.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Чем текстовый режим файла отличается от бинарного и где происходит кодирование или декодирование?

   **Ответ:** Text I/O декодирует/кодирует bytes выбранным encoding и обрабатывает newlines; binary I/O читает/пишет bytes без текстового декодирования. Encoding лучше задавать явно.

   **Источник:** [Python 3.14: library/io.html](https://docs.python.org/3.14/library/io.html)

2. Как отличаются `str`, `bytes` и `bytearray` по назначению и изменяемости?

   **Ответ:** str — Unicode text, bytes — immutable последовательность octets, bytearray — mutable buffer. Преобразование text↔bytes требует encoding; число символов не обязательно равно длине encoded bytes.

   **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html); [Python 3.14: library/io.html](https://docs.python.org/3.14/library/io.html)

3. Что предоставляет `pathlib.Path` и почему относительный путь зависит от рабочего каталога?

   **Ответ:** Path выражает пути и filesystem operations. Относительный путь разрешается относительно текущего cwd в момент операции, а не исходного Python-файла; абсолютность не гарантирует безопасность symlinks.

   **Источник:** [Python 3.14: library/pathlib.html](https://docs.python.org/3.14/library/pathlib.html)

4. Чем JSON отличается от произвольного Python-объекта и какие типы требуют явного преобразования?

   **Ответ:** JSON описывает ограниченный набор values, не произвольные class instances/bytes/sets/datetime. Нужны schema/explicit conversions и ограничения размера; даже JSON не проверяет бизнес-валидность автоматически.

   **Источник:** [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html)

5. Зачем CSV читать специализированным parser, а не разделять строки по запятой?

   **Ответ:** CSV допускает quoted separators/newlines/escaped quotes, поэтому split(',') неверен. Использовать csv.reader с заданным dialect/encoding и `newline=''` при открытии text file.

   **Источник:** [Python 3.14: library/csv.html](https://docs.python.org/3.14/library/csv.html)

6. Что задаёт формат `struct` и зачем явно указывать порядок байтов?

   **Ответ:** Формат задаёт типы, размеры, endian и alignment. Для wire format применять стандартный `<`, `>` или `!`, а native `@` зависит от платформы/ABI.

   **Источник:** [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html)

7. Чем stdout отличается от stderr и где доступен код завершения дочернего процесса?

   **Ответ:** Stdout обычно несёт result, stderr — диагностику; child returncode доступен у CompletedProcess/Popen. Их порядок друг относительно друга не является единым временным журналом.

   **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

8. Почему одно чтение TCP-сокета не обязано соответствовать одному сообщению прикладного протокола?

   **Ответ:** TCP — поток bytes без границ сообщений: recv может вернуть часть, несколько сообщений либо EOF. Framing/буферизация и максимальная длина — обязанность приложения.

   **Источник:** [Python 3.14: howto/sockets.html](https://docs.python.org/3.14/howto/sockets.html)

## Средний уровень — применение

9. Как прочитать большой файл потоково и ограничить размер одной обрабатываемой записи?

   **Ответ:** Читать bounded chunks либо `readline(limit+1)` с проверкой limit и корректным discarding/error policy. Обычная iteration по lines не ограничивает размер одной строки.

   **Источник:** [Python 3.14: library/io.html](https://docs.python.org/3.14/library/io.html)

10. Как `memoryview` позволяет работать с буфером и чем это отличается от создания нового `bytes`?

    **Ответ:** Memoryview ссылается на exporter buffer без обязательной копии, отражает его changes и несёт format/shape/strides. `bytes(view)` создаёт bytes copy; при активном view resize bytearray обычно запрещён.

    **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html); [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html)

11. Чем native alignment в `struct` отличается от формата с явно заданным стандартным layout?

    **Ответ:** Native `@` использует platform sizes/alignment/padding, стандартные prefixes задают стабильные sizes и без native padding. Endianness/layout должны совпадать с документированным format, а не локальной C struct случайно.

    **Источник:** [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html)

12. Как проверять длину и смещения до распаковки бинарной записи с заголовком и payload?

    **Ответ:** Сначала проверить minimum header, распаковать bounded length, проверить offset/count/remaining bytes и max payload до slice/allocation. `unpack_from` не заменяет проверку semantic limits.

    **Источник:** [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html); [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

13. Как явно выбрать политику обработки ошибок декодирования и почему `errors="ignore"` может скрывать повреждение данных?

    **Ответ:** Strict сообщает ошибку, replace меняет input marker, ignore теряет bytes молча. Выбрать policy по формату и логировать безопасные offset/error details; corruption нельзя скрывать, если важна точность.

    **Источник:** [Python 3.14: library/io.html](https://docs.python.org/3.14/library/io.html)

14. Как безопасно формировать аргументы `subprocess.run` без `shell=True`?

    **Ответ:** Передавать list argv с shell=False, executable/опции контролировать, user values давать в позиции operands и `--` где поддерживается. Это устраняет shell interpretation, но не option injection в target program.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

15. Как обработать timeout, ненулевой exit code и ошибку запуска процесса как разные случаи?

    **Ответ:** TimeoutExpired, CalledProcessError при check=True и OSError/FileNotFoundError различают deadline, child failure и невозможность start. Сохранять returncode/output/status, не превращать их в нормальный zero result.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

16. Почему чтение stdout и stderr дочернего процесса по очереди может приводить к зависанию?

    **Ответ:** Пока родитель читает один pipe, ребёнок может заполнить другой и ждать его drain. Использовать run/communicate для bounded output либо concurrent streaming обоих pipes с лимитами.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

17. Какие особенности доставки сигналов Python нужно учитывать в многопоточном Unix-приложении?

    **Ответ:** Python handlers выполняются в main thread main interpreter, не произвольном worker; установка handlers также ограничена main thread. Долгая native operation может задержать handler; shutdown координировать Event/очередью.

    **Источник:** [Python 3.14: library/signal.html](https://docs.python.org/3.14/library/signal.html)

18. Как реализовать framing поверх TCP и обработать частичный заголовок, частичный payload и закрытие соединения?

    **Ответ:** Read-exact loop собирает header/payload, различает EOF до сообщения и truncation внутри, проверяет max length до allocation. Для nonblocking поддерживать parser state и bounded buffer на connection.

    **Источник:** [Python 3.14: howto/sockets.html](https://docs.python.org/3.14/howto/sockets.html); [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html)

## Сложный уровень — ограничения и проектирование

19. Как выбрать между `read`, `readinto`, `mmap` и потоковым parsing, учитывая размер данных и lifetime буферов?

    **Ответ:** Read проще, readinto переиспользует writable buffer, mmap даёт view с page faults/lifetime constraints, streaming ограничивает memory. Выбирать по access pattern/working set и ownership; view не должен пережить exporter.

    **Источник:** [Python 3.14: library/io.html](https://docs.python.org/3.14/library/io.html); [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html)

20. Почему последовательность «проверить существование файла → открыть» может содержать гонку и как изменить логику?

    **Ответ:** Между exists и open другой процесс меняет файл/ссылку. Выполнять нужное open атомарно и обрабатывать исключение; для создания `x`/O_EXCL, для security нужна descriptor-relative/no-follow политика.

    **Источник:** [Python 3.14: library/os.html](https://docs.python.org/3.14/library/os.html); [Python 3.14: library/pathlib.html](https://docs.python.org/3.14/library/pathlib.html)

21. Какие гарантии атомарной замены файла отличаются от гарантий сохранения данных после сбоя питания?

    **Ответ:** Replace/rename на подходящей FS атомарно переключает имя, но не обязательно сохраняется после power loss. Для durable report sync temp, replace на той же FS и sync directory по OS/FS контракту.

    **Типичная ошибка:** Приравнивать atomic rename к сохранности после потери питания.

    **Источник:** [Python 3.14: library/os.html](https://docs.python.org/3.14/library/os.html)

22. Как остановить дочерний процесс и его потомков по timeout в Linux и какие гонки нужно учесть?

    **Ответ:** На Linux запустить отдельную session/process group, послать TERM, подождать grace, затем KILL и reap. Группа не является непреодолимой containment boundary: потомок может уйти; учитывать ProcessLookupError и наследуемые pipes.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html); [Python 3.14: library/signal.html](https://docs.python.org/3.14/library/signal.html)

23. Как ограничивать память и время parser при недоверенных длинах, вложенности и количестве записей?

    **Ответ:** Ограничить bytes на input/record/output, depth, count, decompression и deadline; проверять до allocation/recursion. Для hostile workloads применять отдельный процесс/cgroup/resource budget, а не только Python arithmetic.

    **Источник:** [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [Python 3.14: library/io.html](https://docs.python.org/3.14/library/io.html)

24. Как проектировать неблокирующий ввод-вывод с ограничениями очередей и частичной записью в сокет?

    **Ответ:** State machine хранит incomplete read/write buffers, partial send offset и bounded queue. Readiness не гарантирует полный send, EOF/error закрывает state; backpressure прекращает приём/отклоняет работу при budget exhaustion.

    **Источник:** [Python 3.14: howto/sockets.html](https://docs.python.org/3.14/howto/sockets.html)

25. Как обеспечить переносимость кода между Linux и другими ОС, если используются сигналы, дескрипторы и особенности файловой системы?

    **Ответ:** Вынести OS-specific adapters, проверять наличие capabilities и документировать fallback/ошибку. Тестировать на supported platforms; Windows process termination, signals и rename/open semantics не тождественны Linux.

    **Источник:** [Python 3.14: library/os.html](https://docs.python.org/3.14/library/os.html); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

## Разбор кода

26. Почему разбиение не соответствует CSV и как проверить корректное чтение кавычек и разделителя?

   **Условие:**

   ```python
   line = '42,"north,west",ok'
   print(line.split(","))
   ```

    **Ответ:** split разбивает и запятую внутри quotes: четыре кусочка вместо трёх полей. `next(csv.reader([line]))` даст `['42','north,west','ok']`; тесты включают escaped quotes и embedded newline.

    **Источник:** [Python 3.14: library/csv.html](https://docs.python.org/3.14/library/csv.html)

27. Какая проверка отсутствует и почему порядок байтов нельзя оставлять неявным для сетевого пакета?

   **Условие:**

   ```python
   import struct

   def parse(data):
       return struct.unpack("I", data[:4])[0]
   ```

    **Ответ:** Для короткого input возникнет struct.error; native I имеет platform layout/endian. Проверить `len(data)>=4` и читать network header через `struct.unpack_from('!I', data, 0)`.

    **Источник:** [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html)

28. Как пользовательское значение меняет смысл команды и как передать его только как аргумент?

   **Условие:**

   ```python
   import subprocess

   def search(pattern):
       return subprocess.run(f"grep {pattern} input.txt", shell=True)
   ```

    **Ответ:** User pattern участвует в shell syntax, например разделителях/подстановках. Передать `['grep', '--', pattern, 'input.txt']` с shell=False; явно решить, нужен regex либо fixed-string -F.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

29. Почему два вызова чтения не гарантируют полный заголовок и payload и что должно происходить при EOF?

   **Условие:**

   ```python
   import struct

   def receive(sock):
       size = struct.unpack("!I", sock.recv(4))[0]
       return sock.recv(size)
   ```

    **Ответ:** recv(4) может вернуть 1 byte, recv(size) — только часть payload; пустые bytes означают EOF. Read-exact с timeout/limit либо stateful parser должен вернуть полное сообщение или явную truncation/закрытие.

    **Источник:** [Python 3.14: howto/sockets.html](https://docs.python.org/3.14/howto/sockets.html); [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html)

30. Как изменение буфера отражается в представлении и что потребуется проверить перед изменением размера буфера?

   **Условие:**

   ```python
   data = bytearray(b"abcd")
   view = memoryview(data)[1:3]
   data[1] = ord("X")
   print(bytes(view))
   data.extend(b"ef")
   ```

    **Ответ:** View читает изменённый buffer: `b'Xc'`. Resize data с активным exported view вызывает BufferError; release/delete всех views перед resize, без обещания немедленного освобождения по случайному lifetime.

    **Источник:** [Python 3.14: library/stdtypes.html](https://docs.python.org/3.14/library/stdtypes.html); [Python 3.14: c-api/buffer.html](https://docs.python.org/3.14/c-api/buffer.html)

## Практические задачи

31. Как реализовать parser пакетов с 4-байтовой длиной в network byte order, пределом 1 МиБ и тестами усечённых данных?

    **Ответ:** Читать ровно 4 bytes, распаковать !I, отвергнуть size>1<<20 до allocation, затем собрать payload. Тестировать 0/max/max+1, все split points, header/payload EOF и несколько frames в одном chunk.

    **Пример:**

    ```python
    import struct

    MAX_PAYLOAD = 1 << 20

    def read_exact(sock, size, *, allow_clean_eof=False):
        data = bytearray()
        while len(data) < size:
            chunk = sock.recv(size - len(data))
            if not chunk:
                if not data and allow_clean_eof:
                    return None
                raise EOFError("truncated frame")
            data.extend(chunk)
        return bytes(data)

    def receive_frame(sock):
        # Timeout/deadline задаёт владелец socket.
        header = read_exact(sock, 4, allow_clean_eof=True)
        if header is None:
            return None
        size = struct.unpack("!I", header)[0]
        if size > MAX_PAYLOAD:
            raise ValueError("frame too large")
        return read_exact(sock, size)
    ```

    **Типичная ошибка:** Выделять payload по недоверенной длине до проверки max size.

    **Источник:** [Python 3.14: howto/sockets.html](https://docs.python.org/3.14/howto/sockets.html); [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html)

32. Как написать оболочку запуска benchmark с timeout, проверкой exit code и раздельным сбором stdout/stderr?

    **Ответ:** `subprocess.run(argv, timeout=t, check=True, capture_output=True)` подходит bounded output. Различать start/exit/timeout, сохранять bytes/encoding и metadata; большой output собирать streaming с quota либо в bounded artifact files.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

33. Как реализовать потоковый JSON Lines → CSV конвертер с ограничением размера записи и отчётом об ошибочных строках?

    **Ответ:** Потоково читать bounded lines, json.loads+schema validation и csv.DictWriter с фиксированными fields/encoding. Error policy задаёт line number/skip-or-stop, malformed rows не маскируются success; тестировать delimiters и oversized input.

    **Источник:** [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html); [Python 3.14: library/csv.html](https://docs.python.org/3.14/library/csv.html)

34. Как реализовать безопасную запись отчёта через временный файл и замену, явно указав требования к атомарности и durability?

    **Ответ:** Temporary file в том же directory, сериализация/flush, при требуемой durability os.fsync, os.replace и directory sync на Linux. Cleanup temp в finally, проверить crashes/errors и права; atomic name replacement и durability документировать отдельно.

    **Источник:** [Python 3.14: library/tempfile.html](https://docs.python.org/3.14/library/tempfile.html); [Python 3.14: library/os.html](https://docs.python.org/3.14/library/os.html)

35. Как построить TCP-клиент для сообщений с длиной, протестировав дробление передачи, EOF посередине пакета и недопустимый размер?

    **Ответ:** Read-exact framing client с общий deadline и max size, sendall либо partial-send state. Fake/chunked socket tests дробят каждый boundary, обрывают header/payload и посылают oversized length; integration test проверяет настоящий loopback transport.

    **Источник:** [Python 3.14: howto/sockets.html](https://docs.python.org/3.14/howto/sockets.html); [Python 3.14: library/struct.html](https://docs.python.org/3.14/library/struct.html)

## Что прочитать

- [Python: struct](https://docs.python.org/3.14/library/struct.html)
- [Python: subprocess](https://docs.python.org/3.14/library/subprocess.html)
- [Python: socket HOWTO](https://docs.python.org/3.14/howto/sockets.html)
- [Python: pathlib](https://docs.python.org/3.14/library/pathlib.html)

[← Предыдущая тема](./03_projects_and_packaging.md) · [План раздела](./README.md) · [Следующая тема →](./05_quality_typing_testing.md)
