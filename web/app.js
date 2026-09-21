"use strict";
const root = document.querySelector('#app');
const KEY = 'interview-practice-v1';
const catalog = window.QUESTION_CATALOG;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const all = new Map();
const topics = new Map();
let state = {selected: [], mode: 'ordered', onlyAnswers: false, queue: [], position: 0, revealed: [], view: 'setup'};
if (!catalog) {
  root.innerHTML = '<h1>Не удалось загрузить вопросы</h1><p>Файл данных недоступен. Попробуйте обновить страницу.</p>';
} else {
  for (const section of catalog.sections) for (const topic of section.topics) {
    topics.set(topic.id, topic);
    for (const question of topic.questions) all.set(question.id, {...question, topic: topic.title, section: section.title});
  }
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Array.isArray(saved.queue) && Array.isArray(saved.selected) && Array.isArray(saved.revealed)) {
      const current = saved.queue[saved.position];
      state = {...state, ...saved};
      state.selected = state.selected.filter(id => topics.has(id));
      state.queue = [...new Set(state.queue)].filter(id => all.has(id));
      state.position = Math.max(0, state.queue.indexOf(current));
      state.mode = state.mode === 'random' ? 'random' : 'ordered';
      if (!['setup', 'study', 'done'].includes(state.view) || !state.queue.length) state.view = 'setup';
    }
  } catch (_) { /* A missing or invalid save starts a new session. */ }
  render();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (_) { document.querySelector('#storage-warning').hidden = false; }
}
function pool() {
  return [...topics.values()].filter(t => state.selected.includes(t.id)).flatMap(t => t.questions)
    .filter(q => !state.onlyAnswers || q.answer).map(q => q.id);
}
function countText(list) { return `${list.length.toLocaleString('ru')} вопросов · ${list.filter(q => q.answer).length.toLocaleString('ru')} с ответами`; }
function render() {
  if (state.view === 'setup') setup();
  else if (state.view === 'done') complete();
  else study();
}
function setup() {
  root.innerHTML = `<div class="page-heading"><div><p class="eyebrow">БИБЛИОТЕКА / 10 РАЗДЕЛОВ</p><h1>Что повторим сегодня?</h1></div><span class="total">${all.size.toLocaleString('ru')} вопросов</span></div>
    ${state.queue.length ? '<div class="resume"><span>Есть сохранённая подборка</span><button id="resume">Продолжить →</button></div>' : ''}
    <div class="setup-layout"><section class="library" aria-label="Темы">${catalog.sections.map((s, index) => {
      const qs = s.topics.flatMap(t => t.questions);
      return `<details ${index === 0 ? 'open' : ''}><summary><span class="section-number">${String(index + 1).padStart(2, '0')}</span><span class="section-name">${escapeHtml(s.title)}<small>${qs.length ? countText(qs) : 'Пока только план тем'}</small></span><span class="expand">+</span></summary>
        ${s.topics.length ? `<div class="topic-list"><label class="select-all"><input type="checkbox" data-section="${s.id}"> Весь раздел</label>${s.topics.map(t => `<label class="topic"><input type="checkbox" data-topic="${t.id}" ${state.selected.includes(t.id) ? 'checked' : ''}><span>${escapeHtml(t.title)}<small>${countText(t.questions)}</small></span></label>`).join('')}</div>` : '<p class="empty-section">Вопросы ещё не добавлены.</p>'}</details>`;
    }).join('')}</section>
    <aside class="settings"><p class="eyebrow">ВАША ПОДБОРКА</p><h2>Настроить тренировку</h2><fieldset><legend>Порядок вопросов</legend><div class="segmented"><label><input type="radio" name="mode" value="ordered" ${state.mode === 'ordered' ? 'checked' : ''}><span>По порядку</span></label><label><input type="radio" name="mode" value="random" ${state.mode === 'random' ? 'checked' : ''}><span>Случайно</span></label></div></fieldset><label class="answer-filter"><input id="only-answers" type="checkbox" ${state.onlyAnswers ? 'checked' : ''}> Только с ответами</label><div class="selection-count"><strong id="selected-count"></strong><span>вопросов выбрано</span></div><button class="primary" id="start">Начать тренировку →</button><p id="empty-hint" class="muted"></p></aside></div>`;
  document.querySelectorAll('[data-topic]').forEach(input => input.onchange = () => {
    state.selected = [...document.querySelectorAll('[data-topic]:checked')].map(el => el.dataset.topic); updateSelection(); save();
  });
  document.querySelectorAll('[data-section]').forEach(input => input.onchange = () => {
    const section = catalog.sections.find(s => s.id === input.dataset.section);
    const ids = section.topics.map(t => t.id);
    state.selected = state.selected.filter(id => !ids.includes(id));
    if (input.checked) state.selected.push(...ids);
    document.querySelectorAll('[data-topic]').forEach(el => el.checked = state.selected.includes(el.dataset.topic));
    updateSelection(); save();
  });
  document.querySelectorAll('[name=mode]').forEach(input => input.onchange = () => { state.mode = input.value; save(); });
  document.querySelector('#only-answers').onchange = event => { state.onlyAnswers = event.target.checked; updateSelection(); save(); };
  document.querySelector('#start').onclick = start;
  const resume = document.querySelector('#resume');
  if (resume) resume.onclick = () => { state.view = 'study'; save(); render(); };
  updateSelection();
}
function updateSelection() {
  const count = pool().length;
  document.querySelector('#selected-count').textContent = count.toLocaleString('ru');
  document.querySelector('#start').disabled = !count;
  document.querySelector('#empty-hint').textContent = !state.selected.length ? 'Выберите темы' : !count ? 'В выбранных темах пока нет ответов' : '';
  document.querySelectorAll('[data-section]').forEach(input => {
    const ids = catalog.sections.find(s => s.id === input.dataset.section).topics.map(t => t.id);
    const selected = ids.filter(id => state.selected.includes(id)).length;
    input.checked = selected === ids.length; input.indeterminate = selected > 0 && selected < ids.length;
  });
}
function start() {
  const queue = pool();
  if (!queue.length) return;
  if (state.mode === 'random') for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  Object.assign(state, {queue, position: 0, revealed: [], view: 'study'}); save(); render(); window.scrollTo(0, 0);
}
function study() {
  const q = all.get(state.queue[state.position]);
  if (!q) { state.view = 'setup'; save(); render(); return; }
  const revealed = state.revealed.includes(q.id);
  root.innerHTML = `<div class="study-top"><button class="text-button" id="back-setup">← К темам</button><span>${state.position + 1} / ${state.queue.length}</span></div><progress value="${state.position + 1}" max="${state.queue.length}" aria-label="Прогресс"></progress><article class="question"><p class="eyebrow">${escapeHtml(q.section)} / ${escapeHtml(q.topic)}</p><p class="group">${escapeHtml(q.group)}</p><div class="question-title">${q.question}</div>${q.answer ? `<button class="reveal" id="reveal" aria-expanded="${revealed}">${revealed ? 'Скрыть ответ' : 'Показать ответ'}</button><div class="answer" ${revealed ? '' : 'hidden'}>${q.answer}</div>` : '<p class="no-answer">Ответ пока не добавлен</p>'}<a class="source-link" href="../${q.id.split(':')[0]}" target="_blank" rel="noopener">Исходный материал ↗</a></article><nav class="question-nav" aria-label="Навигация по вопросам"><button id="prev" ${state.position === 0 ? 'disabled' : ''}>← Назад</button><button class="primary" id="next">${state.position === state.queue.length - 1 ? 'Завершить' : 'Следующий →'}</button></nav>`;
  document.querySelector('#back-setup').onclick = () => { state.view = 'setup'; save(); render(); };
  document.querySelector('#prev').onclick = () => { if (state.position) state.position--; save(); render(); window.scrollTo(0, 0); };
  document.querySelector('#next').onclick = () => { if (state.position + 1 < state.queue.length) state.position++; else state.view = 'done'; save(); render(); window.scrollTo(0, 0); };
  const reveal = document.querySelector('#reveal');
  if (reveal) reveal.onclick = () => { state.revealed = revealed ? state.revealed.filter(id => id !== q.id) : [...state.revealed, q.id]; save(); study(); };
}
function complete() {
  root.innerHTML = `<section class="completion"><p class="eyebrow">ПОДБОРКА ЗАВЕРШЕНА</p><h1>Хорошая работа.</h1><p>Вы дошли до конца подборки из ${state.queue.length} вопросов.</p><div><button class="primary" id="choose">Выбрать темы</button><button id="repeat">Повторить подборку</button></div></section>`;
  document.querySelector('#choose').onclick = () => { state.view = 'setup'; save(); render(); };
  document.querySelector('#repeat').onclick = () => { state.position = 0; state.revealed = []; state.view = 'study'; save(); render(); };
}
