# C/C++ Build Systems Question Bank (Linux)

## Legend

* **L1** — базовый уровень (junior)

* **L2** — уверенный (middle)

* **L3** — продвинутый (senior)

* **L4** — эксперт (staff/principal)

* **[T]** — теория

* **[P]** — практика

* **[D]** — debugging

* **[S]** — system design

---

# 1. Compilation Pipeline

## L1

1. (L1, T) Какие стадии включает compilation pipeline?
2. (L1, T) Что делает препроцессор?
3. (L1, T) В чем разница между `.c` и `.o` файлами?
4. (L1, T) Что делает компилятор?
5. (L1, T) Что делает линкер?
6. (L1, T) Что такое `#include`?
7. (L1, T) Разница между `<...>` и `"..."`?
8. (L1, T) Что такое header file?
9. (L1, T) Что такое object file?
10. (L1, P) Как скомпилировать файл вручную через `gcc`?

## L2

11. (L2, T) Что такое translation unit?
12. (L2, T) Что такое symbol table?
13. (L2, T) Что такое relocation?
14. (L2, T) Что такое ODR?
15. (L2, P) Как посмотреть результат препроцессинга?
16. (L2, P) Как собрать `.o`, а затем бинарь вручную?
17. (L2, D) Почему возникает `undefined reference`?
18. (L2, D) Почему возникает `multiple definition`?
19. (L2, T) Как компилятор обрабатывает inline?
20. (L2, T) Что такое debug symbols?

## L3

21. (L3, T) Как устроен ELF object file?
22. (L3, T) Что такое sections (.text, .data, .bss)?
23. (L3, T) Что такое GOT/PLT?
24. (L3, T) Как работает dynamic linker?
25. (L3, P) Как посмотреть symbols через `nm`?
26. (L3, P) Как анализировать бинарь через `readelf`?
27. (L3, D) Почему бинарь падает при запуске, хотя линковка успешна?
28. (L3, T) Что такое weak symbols?
29. (L3, T) Как работает symbol resolution?
30. (L3, D) Почему порядок линковки `.a` важен?

## L4

31. (L4, T) Как реализована lazy binding?
32. (L4, T) Как работает relocation на runtime?
33. (L4, S) Как минимизировать symbol conflicts в large-scale системе?
34. (L4, T) Как реализован dynamic loader в Linux?
35. (L4, D) Как диагностировать subtle ABI mismatch?

---

# 2. Static vs Dynamic Linking

## L1

36. (L1, T) Что такое static library?
37. (L1, T) Что такое shared library?
38. (L1, T) Разница `.a` vs `.so`?
39. (L1, P) Как собрать static library?
40. (L1, P) Как собрать shared library?

## L2

41. (L2, T) Когда использовать static linking?
42. (L2, T) Когда использовать dynamic linking?
43. (L2, T) Что такое SONAME?
44. (L2, P) Как посмотреть зависимости бинаря (`ldd`)?
45. (L2, D) Почему не находится `.so` при запуске?
46. (L2, T) Что такое LD_LIBRARY_PATH?
47. (L2, T) Что такое rpath?

## L3

48. (L3, T) Разница RPATH vs RUNPATH?
49. (L3, T) Что такое symbol interposition?
50. (L3, D) Почему бинарь использует не ту версию библиотеки?
51. (L3, P) Как задать rpath при линковке?
52. (L3, T) Как shared libs влияют на startup time?

## L4

53. (L4, T) Как реализовать plugin system через `.so`?
54. (L4, D) Как диагностировать ABI break между версиями `.so`?
55. (L4, S) Когда static linking — единственный вариант?

---

# 3. ABI

## L1

56. (L1, T) Что такое ABI?
57. (L1, T) Разница ABI vs API?

## L2

58. (L2, T) Что входит в ABI?
59. (L2, T) Что такое name mangling?
60. (L2, T) Как влияет layout struct на ABI?
61. (L2, D) Почему бинарь ломается после обновления библиотеки?

## L3

62. (L3, T) Что ломает ABI?
63. (L3, T) Как vtable влияет на ABI?
64. (L3, T) Почему inline функции опасны для ABI?
65. (L3, D) Как обнаружить ABI mismatch?

## L4

66. (L4, S) Как проектировать стабильный ABI?
67. (L4, S) Как поддерживать backward compatibility?

---

# 4. Make

## L1

68. (L1, T) Что такое Makefile?
69. (L1, T) Что такое target?
70. (L1, T) Что такое dependency?
71. (L1, P) Написать простой Makefile

## L2

72. (L2, T) Как Make решает, что пересобирать?
73. (L2, T) Что такое `.PHONY`?
74. (L2, P) Использование `$@`, `$<`, `$^`
75. (L2, P) Pattern rules
76. (L2, D) Почему пересобирается всё?

## L3

77. (L3, T) Как работают dependency files (.d)?
78. (L3, P) Генерация зависимостей через `-MMD`
79. (L3, D) Как избежать stale headers?
80. (L3, T) Почему recursive make плох?

## L4

81. (L4, S) Как масштабировать Make на большой проект?
82. (L4, D) Почему build не детерминирован с `-j`?

---

# 5. CMake

## L1

83. (L1, T) Что такое CMake?
84. (L1, T) Что такое out-of-source build?
85. (L1, P) Минимальный CMakeLists.txt

## L2

86. (L2, T) Что такое target?
87. (L2, T) PUBLIC vs PRIVATE vs INTERFACE
88. (L2, P) add_executable / add_library
89. (L2, P) target_link_libraries

## L3

90. (L3, T) Как работает find_package?
91. (L3, T) Module vs Config mode
92. (L3, P) Использование toolchain file
93. (L3, D) Почему не находится библиотека?

## L4

94. (L4, S) Как проектировать CMake для large-scale проекта?
95. (L4, T) Как реализовать reusable modules?
96. (L4, D) Debugging сложного dependency graph

---

# 6. Ninja / Bazel / Meson

## L2

97. (L2, T) Почему Ninja быстрее Make?
98. (L2, T) Что такое minimal build system?

## L3

99. (L3, T) Что такое hermetic build (Bazel)?
100. (L3, T) Что такое sandboxing?
101. (L3, T) Что такое reproducible build?

## L4

102. (L4, S) Когда стоит мигрировать на Bazel?
103. (L4, S) Trade-offs Meson vs CMake

---

# 7. Dependency Management

## L1

104. (L1, T) Что такое dependency?
105. (L1, T) Что такое system package?

## L2

106. (L2, T) Что такое vendoring?
107. (L2, T) Что такое version pinning?
108. (L2, D) Почему разные версии ломают билд?

## L3

109. (L3, T) Что такое dependency hell?
110. (L3, T) Как работает pkg-config?
111. (L3, P) Использование pkg-config

## L4

112. (L4, S) Как обеспечить reproducible dependencies?
113. (L4, S) Как управлять ABI compatibility?

---

# 8. Practical / Real-world Scenarios

## L2

114. (L2, D) Билд работает локально, но падает в CI — причины?
115. (L2, D) Почему не линкуется библиотека?

## L3

116. (L3, D) Почему бинарь падает только на другой машине?
117. (L3, D) Почему изменение header пересобирает весь проект?
118. (L3, D) Почему увеличилось время сборки?

## L4

119. (L4, S) Как уменьшить build time в 10x?
120. (L4, S) Как сделать build reproducible?
121. (L4, S) Как проектировать build system для монорепозитория?

---
