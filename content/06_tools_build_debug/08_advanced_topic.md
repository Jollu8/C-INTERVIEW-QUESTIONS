# C/C++ Advanced Topics Question Bank (Linux)

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

# 8. Advanced Topics

---

## 8.1 LTO (Link Time Optimization)

## L1

1. (L1, T) Что такое LTO?
2. (L1, T) Чем LTO отличается от обычной оптимизации компилятора?
3. (L1, T) Почему LTO выполняется на этапе линковки?
4. (L1, T) Какие задачи решает LTO?
5. (L1, T) Какие риски у LTO?
6. (L1, P) Как включить LTO при сборке?
7. (L1, D) Почему сборка с LTO дольше?
8. (L1, T) Почему LTO может улучшить performance?
9. (L1, T) Почему LTO может увеличить размер бинаря?
10. (L1, D) Почему LTO может “сломать” билд?

## L2

11. (L2, T) Что такое interprocedural optimization (IPO)?
12. (L2, T) Какие оптимизации возможны только с LTO?
13. (L2, D) Почему LTO может выявить ошибки линковки, которые раньше не проявлялись?
14. (L2, T) Как LTO влияет на inline?
15. (L2, P) Как комбинировать LTO с static/shared libraries?
16. (L2, D) Почему разные компиляторы по-разному реализуют LTO?
17. (L2, T) Что такое thin LTO?
18. (L2, D) Почему LTO требует согласованного toolchain?
19. (L2, P) Как измерить эффект LTO?
20. (L2, D) Почему LTO ухудшает debugability?

## L3

21. (L3, T) Как LTO влияет на symbol visibility и ABI?
22. (L3, D) Почему LTO может менять layout кода и ломать профили?
23. (L3, D) Почему LTO может приводить к нестабильным performance результатам?
24. (L3, T) Как LTO взаимодействует с PGO?
25. (L3, D) Почему LTO может ломать incremental builds?
26. (L3, D) Как диагностировать miscompilation из-за LTO?
27. (L3, P) Как selectively отключать LTO для отдельных модулей?
28. (L3, D) Почему LTO может конфликтовать с sanitizer'ами?
29. (L3, S) Когда LTO оправдан в production?
30. (L3, S) Когда LTO — лишняя сложность?

## L4

31. (L4, S) Как внедрять LTO в большой кодовой базе безопасно?
32. (L4, S) Как строить pipeline: LTO only for release?
33. (L4, D) Как расследовать rare bugs, вызванные LTO?
34. (L4, S) Как оценивать ROI от LTO?
35. (L4, S) Как формализовать policy использования LTO в команде?

---

## 8.2 PGO (Profile Guided Optimization)

## L1

36. (L1, T) Что такое PGO?
37. (L1, T) Как PGO отличается от LTO?
38. (L1, T) Какие данные использует PGO?
39. (L1, P) Какие этапы у PGO?
40. (L1, T) Почему PGO может сильно ускорить код?
41. (L1, D) Почему PGO может ухудшить производительность?
42. (L1, T) Какие типы оптимизаций делает PGO?
43. (L1, P) Как собрать профилированную сборку?
44. (L1, T) Почему важен representative workload?
45. (L1, D) Почему PGO чувствителен к input данным?

## L2

46. (L2, T) Какие ошибки возможны при неправильном PGO?
47. (L2, D) Почему “плохой профиль” хуже, чем отсутствие PGO?
48. (L2, T) Как PGO влияет на branch prediction?
49. (L2, T) Как PGO влияет на inlining?
50. (L2, P) Как автоматизировать сбор профилей?
51. (L2, D) Почему profile data устаревает?
52. (L2, T) Как PGO взаимодействует с cache locality?
53. (L2, D) Почему PGO может ухудшить cold paths?
54. (L2, P) Как проверить корректность профиля?
55. (L2, D) Почему PGO усложняет debugging?

## L3

56. (L3, D) Как диагностировать regression после включения PGO?
57. (L3, T) Как PGO влияет на layout функций?
58. (L3, D) Почему PGO может “переобучиться” на workload?
59. (L3, T) Как PGO взаимодействует с LTO?
60. (L3, P) Как сравнивать performance с/без PGO?
61. (L3, D) Почему PGO нестабилен между релизами?
62. (L3, S) Когда PGO оправдан?
63. (L3, D) Как понять, что PGO не дает пользы?
64. (L3, D) Почему PGO может увеличивать binary size?
65. (L3, S) Как интегрировать PGO в CI/CD?

## L4

66. (L4, S) Как строить PGO pipeline для production сервиса?
67. (L4, S) Как автоматизировать сбор профилей с production трафика?
68. (L4, D) Как расследовать деградации из-за PGO drift?
69. (L4, S) Как балансировать стабильность и performance при PGO?
70. (L4, S) Как формализовать policy: где PGO обязателен, а где нет?

---

## 8.3 Cross-compilation

## L1

71. (L1, T) Что такое cross-compilation?
72. (L1, T) Что такое host vs target?
73. (L1, T) Что такое toolchain?
74. (L1, T) Что такое sysroot?
75. (L1, P) Как собрать программу под другую архитектуру?

## L2

76. (L2, T) Почему cross-compilation сложнее обычной сборки?
77. (L2, D) Почему бинарь не запускается на target?
78. (L2, T) Что такое ABI target платформы?
79. (L2, P) Как использовать toolchain file в CMake?
80. (L2, D) Почему зависимости не находятся при cross-build?
81. (L2, T) Что такое emulator (qemu) в контексте cross-build?
82. (L2, P) Как тестировать cross-compiled бинарь?
83. (L2, D) Почему compile проходит, а runtime падает?
84. (L2, T) Что такое endianness?
85. (L2, D) Как архитектура влияет на поведение программы?

## L3

86. (L3, D) Как диагностировать ABI mismatch между host и target?
87. (L3, D) Почему alignment/layout может ломать код?
88. (L3, T) Что такое cross-toolchain consistency?
89. (L3, P) Как организовать reproducible cross-build environment?
90. (L3, D) Почему floating-point поведение отличается на разных архитектурах?
91. (L3, S) Когда использовать cross-compilation, а когда native build?
92. (L3, D) Как расследовать баг, который есть только на ARM?
93. (L3, D) Почему sanitizer'ы сложнее использовать при cross-compilation?
94. (L3, S) Как проектировать build system с поддержкой нескольких архитектур?
95. (L3, D) Почему system headers могут ломать portability?

## L4

96. (L4, S) Как строить multi-platform build strategy?
97. (L4, S) Как тестировать cross-platform поведение reliably?
98. (L4, D) Как расследовать platform-specific bugs без прямого доступа к железу?
99. (L4, S) Как управлять toolchain версиями для разных target'ов?
100. (L4, S) Как минимизировать platform-specific divergence?

---

## 8.4 Reproducible Builds

## L1

101. (L1, T) Что такое reproducible build?
102. (L1, T) Почему это важно?
103. (L1, T) Что может ломать reproducibility?
104. (L1, T) Как timestamps влияют на сборку?
105. (L1, T) Что такое deterministic build?

## L2

106. (L2, T) Какие источники nondeterminism в C/C++ сборке?
107. (L2, D) Почему два билда дают разные бинарники?
108. (L2, T) Как environment влияет на build?
109. (L2, P) Как фиксировать версии toolchain?
110. (L2, D) Почему порядок файлов влияет на бинарь?
111. (L2, T) Что такое build path leakage?
112. (L2, D) Почему debug symbols ломают reproducibility?
113. (L2, P) Как сравнивать бинарники?
114. (L2, D) Почему containerization помогает?
115. (L2, T) Что такое hermetic build?

## L3

116. (L3, D) Как диагностировать источник nondeterminism?
117. (L3, T) Как reproducibility связана с security?
118. (L3, D) Почему incremental build может нарушать reproducibility?
119. (L3, P) Как построить reproducible CI pipeline?
120. (L3, D) Почему build cache может ломать reproducibility?
121. (L3, T) Как reproducibility помогает debugging?
122. (L3, D) Почему разные linker'ы дают разные бинарники?
123. (L3, S) Когда reproducibility критична?
124. (L3, D) Как убедиться, что билд действительно deterministic?
125. (L3, S) Как внедрять reproducibility в legacy проект?

## L4

126. (L4, S) Как построить полностью reproducible build system?
127. (L4, S) Как формализовать reproducibility requirements?
128. (L4, D) Как расследовать security incident через reproducible builds?
129. (L4, S) Как балансировать reproducibility и build performance?
130. (L4, S) Как обучать команду reproducible engineering?

---

## 8.5 Sanitizers в CI

## L1

131. (L1, T) Что такое sanitizer?
132. (L1, T) Какие основные sanitizer'ы используются в C/C++?
133. (L1, P) Как включить sanitizer в сборке?
134. (L1, T) Какие баги ловит ASan?
135. (L1, T) Какие баги ловит UBSan?

## L2

136. (L2, P) Как запускать sanitizer в CI pipeline?
137. (L2, D) Почему sanitizer замедляет выполнение?
138. (L2, D) Почему sanitizer меняет поведение программы?
139. (L2, T) Почему sanitizer builds нельзя использовать в production?
140. (L2, D) Почему sanitizer может ловить баг, который трудно воспроизвести иначе?
141. (L2, P) Как анализировать sanitizer report?
142. (L2, D) Что делать с багами в third-party code?
143. (L2, T) Какие ограничения у sanitizer'ов?
144. (L2, D) Почему sanitizer может пропустить баг?
145. (L2, S) Когда sanitizer должен быть обязательным?

## L3

146. (L3, S) Как встроить sanitizer pipeline в CI/CD?
147. (L3, D) Почему sanitizer builds могут быть нестабильны?
148. (L3, D) Как triage'ить sanitizer findings?
149. (L3, P) Как разделять fast CI и deep sanitizer checks?
150. (L3, D) Почему sanitizer требует отдельной конфигурации build?
151. (L3, S) Как комбинировать разные sanitizer'ы?
152. (L3, D) Как избежать false positives?
153. (L3, S) Как измерять эффективность sanitizer'ов?
154. (L3, D) Почему sanitizer не заменяет testing?
155. (L3, S) Когда отключать sanitizer оправдано?

## L4

156. (L4, S) Как строить policy использования sanitizer'ов в организации?
157. (L4, S) Как интегрировать sanitizer results в engineering workflow?
158. (L4, D) Как расследовать flaky sanitizer failures?
159. (L4, S) Как балансировать cost vs value sanitizer pipeline?
160. (L4, S) Как сделать sanitizer частью культуры разработки, а не “разовой проверкой”?

---
