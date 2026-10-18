"use strict";
const root = document.querySelector('#app');
const KEY = 'interview-practice-v1';
const catalog = window.QUESTION_CATALOG;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const all = new Map();
const topics = new Map();
let state = {selected: [], mode: 'ordered', onlyAnswers: false, onlyReview: false, marks: {}, queue: [], position: 0, revealed: [], view: 'setup'};
let settingsExpanded = false;
let learningExpanded = false;
const libraryState = {query: '', open: null, scroll: 0};
let focusOnQuestion = false;
let actionBarObserver = null;
let desktopLayout = null;
function restore(saved) {
  if (!saved || !['queue', 'selected', 'revealed'].every(key =>
    Array.isArray(saved[key]) && saved[key].every(id => typeof id === 'string')) ||
    !Number.isInteger(saved.position) || saved.position < 0 ||
    !['ordered', 'random'].includes(saved.mode) ||
    !['setup', 'study', 'done'].includes(saved.view)) throw new Error('Invalid progress');
  const queue = [...new Set(saved.queue)].filter(id => all.has(id));
  const marks = {};
  if (saved.marks !== undefined && (!saved.marks || typeof saved.marks !== 'object' || Array.isArray(saved.marks))) throw new Error('Invalid marks');
  for (const [id, mark] of Object.entries(saved.marks || {})) {
    if (!['known', 'review'].includes(mark)) throw new Error('Invalid mark');
    if (all.has(id)) marks[id] = mark;
  }
  // Keep earlier sessions available through Resume while letting users build
  // a full selection instead of automatically reopening a capped session.
  const legacyLimitedSession = Number.isSafeInteger(saved.limit) && saved.limit > 0;
  return {
    selected: [...new Set(saved.selected)].filter(id => topics.has(id)),
    mode: saved.mode, onlyAnswers: saved.onlyAnswers === true,
    onlyReview: saved.onlyReview === true, marks, queue,
    position: Math.max(0, queue.indexOf(saved.queue[saved.position])),
    revealed: [...new Set(saved.revealed)].filter(id => all.has(id)),
    view: queue.length ? (legacyLimitedSession && saved.view === 'study' ? 'setup' : saved.view) : 'setup',
  };
}
if (!catalog) {
  root.innerHTML = '<h1>Не удалось загрузить вопросы</h1><p>Файл данных недоступен. Попробуйте обновить страницу.</p>';
} else {
  for (const section of catalog.sections) for (const topic of section.topics) {
    for (const question of topic.questions) {
      if (!question.id.startsWith(`${topic.id}:`)) question.id = `${topic.id}:${question.id}`;
    }
    topics.set(topic.id, topic);
    for (const question of topic.questions) all.set(question.id, {...question, topic: topic.title, section: section.title});
  }
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) state = restore(saved);
  } catch (_) { /* A missing or invalid save starts a new session. */ }
  const url = new URL(location.href);
  const topic = topics.get(url.searchParams.get('topic'));
  const track = catalog.tracks?.find(t => t.id === url.searchParams.get('track'));
  if (topic) {
    Object.assign(state, {
      selected: [topic.id], view: 'setup', onlyAnswers: false, onlyReview: false,
    });
    libraryState.open = catalog.sections.filter(s => s.topics.some(t => t.id === topic.id)).map(s => s.id);
    save();
  } else if (track) {
    selectTrack(track); state.view = 'setup'; save();
  }
  if (topic || track) {
    url.searchParams.delete('topic');
    url.searchParams.delete('track');
    history.replaceState(null, '', url.href);
  }
  desktopLayout = window.matchMedia('(min-width: 901px)');
  desktopLayout.addEventListener('change', positionProgressTools);
  render();
  if (topic) {
    const input = [...document.querySelectorAll('[data-topic]')].find(el => el.dataset.topic === topic.id);
    input.closest('.topic').scrollIntoView({block: 'center'});
    input.focus({preventScroll: true});
  }
}
function selectTrack(track) {
  state.selected = catalog.sections.flatMap(s => s.topics
    .filter(t => track.sections?.includes(s.id) || track.topics?.includes(t.id)).map(t => t.id));
  state.onlyAnswers = true;
  state.onlyReview = false;
  save();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (_) { document.querySelector('#storage-warning').hidden = false; }
}
function pool() {
  return [...topics.values()].filter(t => state.selected.includes(t.id)).flatMap(t => t.questions)
    .filter(q => (!state.onlyAnswers || q.answer) && (!state.onlyReview || state.marks[q.id] === 'review')).map(q => q.id);
}
function countText(list) { return `${list.length.toLocaleString('ru')} вопросов · ${list.filter(q => q.answer).length.toLocaleString('ru')} с ответами`; }
function questionWord(count) {
  if (count % 100 >= 11 && count % 100 <= 14) return 'вопросов';
  if (count % 10 === 1) return 'вопрос';
  return count % 10 >= 2 && count % 10 <= 4 ? 'вопроса' : 'вопросов';
}
function renderMath(container) {
  if (typeof window.renderMathInElement !== 'function') return;
  window.renderMathInElement(container, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '\\[', right: '\\]', display: true},
      {left: '$', right: '$', display: false},
      {left: '\\(', right: '\\)', display: false},
    ],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    throwOnError: false,
  });
}
function highlightCode(container) {
  if (!window.hljs) return;
  container.querySelectorAll('pre code').forEach(block => window.hljs.highlightElement(block));
}
function addCodeCopyButtons(container) {
  container.querySelectorAll('.answer pre, .question-title pre').forEach(pre => {
    if (pre.parentElement.classList.contains('code-example')) return;
    const code = pre.querySelector('code') || pre;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-example';
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const status = document.createElement('span');
    status.setAttribute('role', 'status');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code';
    button.textContent = 'Копировать';
    button.setAttribute('aria-label', 'Копировать код примера');
    button.onclick = async () => {
      button.disabled = true;
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(code.textContent);
        status.textContent = 'Скопировано';
      } catch (_) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'Скопируйте выделенный код вручную';
      } finally {
        button.disabled = false;
      }
    };
    pre.before(wrapper);
    toolbar.append(status, button);
    wrapper.append(toolbar, pre);
  });
}
function render() {
  document.body.dataset.view = state.view;
  document.querySelector('#footer-source').hidden = state.view !== 'setup';
  document.querySelector('#learning-help').hidden = state.view !== 'setup';
  if (state.view === 'setup') setup();
  else if (state.view === 'done') complete();
  else { study(); return; }
  observeActionBar();
}
function observeActionBar() {
  actionBarObserver?.disconnect();
  const bar = root.querySelector('.setup-actions, .question-nav');
  if (!bar) { document.documentElement.style.removeProperty('--action-bar-height'); return; }
  const update = () => document.documentElement.style.setProperty('--action-bar-height', `${Math.ceil(bar.getBoundingClientRect().height)}px`);
  update();
  if (window.ResizeObserver) {
    actionBarObserver = new ResizeObserver(update);
    actionBarObserver.observe(bar);
  }
}
function setup() {
  root.innerHTML = `<div class="page-heading"><h1 class="library-heading" tabindex="-1"><span class="desktop-heading">Библиотека тем</span><span class="mobile-heading">Выберите темы</span></h1><span class="total"><strong>${all.size.toLocaleString('ru')}</strong><span>вопросов</span></span>
    ${state.queue.length ? `<div class="resume"><span>Сохранённая тренировка · ${state.position + 1} из ${state.queue.length}</span><button id="resume" aria-label="Продолжить сохранённую подборку" title="Продолжить сохранённую подборку"><span class="resume-label">Продолжить</span><span aria-hidden="true">→</span></button></div>` : ''}</div>
    <p class="library-intro">Отметьте интересующие темы и начните короткую тренировку.</p>
    <section id="learning-panel" class="learning-start" ${learningExpanded ? '' : 'hidden'} aria-label="Маршруты обучения"><h2>Что хотите освоить?</h2><p>Выберите маршрут или настройте подборку из библиотеки ниже.</p><div class="track-grid">${(catalog.tracks || []).map(t => `<button class="track-card" data-track="${escapeHtml(t.id)}"><strong>${escapeHtml(t.title)}</strong><span>${escapeHtml(t.description)}</span></button>`).join('')}</div><a href="roadmap.html">Что читать, что сделать и как проверить знания →</a></section>
    <div class="setup-layout"><section class="library" aria-label="Темы">${catalog.sections.map((s, index) => {
      const qs = s.topics.flatMap(t => t.questions);
      return `<details data-library-section="${s.id}" ${(libraryState.open === null ? index === 0 : libraryState.open.includes(s.id)) ? 'open' : ''}><summary><span class="section-number">${String(index + 1).padStart(2, '0')}</span><span class="section-name">${escapeHtml(s.title)}<small>${qs.length ? countText(qs) : 'План обучения'}</small><small class="section-selected" data-selected-section="${s.id}" hidden></small></span><span class="expand" aria-hidden="true">+</span></summary>
        ${s.plan ? `<a class="plan-link" href="${escapeHtml(s.plan)}">План обучения и материалы →</a>` : ''}${s.topics.length ? `<div class="topic-list"><label class="select-all"><input type="checkbox" data-section="${s.id}"> Весь раздел</label>${s.topics.map(t => `<label class="topic"><input type="checkbox" data-topic="${t.id}" ${state.selected.includes(t.id) ? 'checked' : ''}><span>${escapeHtml(t.title)}<small>${countText(t.questions)}</small></span></label>`).join('')}</div>` : '<p class="empty-section">Вопросы ещё не добавлены. Начните с плана обучения.</p>'}</details>`;
    }).join('')}</section>
    <aside class="settings"><p class="eyebrow">ВАША ПОДБОРКА</p><h2>Настроить тренировку</h2><fieldset><legend>Порядок вопросов</legend><div class="segmented"><label><input type="radio" name="mode" value="ordered" ${state.mode === 'ordered' ? 'checked' : ''}><span>По порядку</span></label><label><input type="radio" name="mode" value="random" ${state.mode === 'random' ? 'checked' : ''}><span>Случайно</span></label></div></fieldset><label class="answer-filter"><input id="only-answers" type="checkbox" ${state.onlyAnswers ? 'checked' : ''}> Только с ответами</label><div class="setup-actions"><div class="selection-count" role="status" aria-live="polite" aria-atomic="true"><div class="selection-total"><strong id="selected-count"></strong><span id="selected-count-label">вопросов</span></div><p id="empty-hint" class="muted"></p></div><button class="primary" id="start"><span class="desktop-label">Начать тренировку →</span><span class="mobile-label">Начать →</span></button></div></aside></div>`;
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
  document.querySelectorAll('[name=mode]').forEach(input => input.onchange = () => { state.mode = input.value; updateSelection(); save(); });
  document.querySelector('#only-answers').onchange = event => { state.onlyAnswers = event.target.checked; updateSelection(); save(); };
  document.querySelectorAll('[data-track]').forEach(button => button.onclick = () => {
    selectTrack(catalog.tracks.find(t => t.id === button.dataset.track)); learningExpanded = false;
    libraryState.query = '';
    libraryState.open = catalog.sections.filter(s => s.topics.some(t => state.selected.includes(t.id))).map(s => s.id);
    libraryState.scroll = 0;
    render();
    window.scrollTo(0, 0);
    document.querySelector('#start').focus({preventScroll: true});
  });
  const help = document.querySelector('#learning-help');
  help.setAttribute('aria-expanded', String(learningExpanded));
  help.onclick = () => {
    learningExpanded = !learningExpanded;
    document.querySelector('#learning-panel').hidden = !learningExpanded;
    help.setAttribute('aria-expanded', String(learningExpanded));
  };
  document.querySelector('#start').onclick = start;
  addPracticeTools();
  addSettingsToggle();
  const resume = document.querySelector('#resume');
  if (resume) resume.onclick = () => { libraryState.scroll = window.scrollY; state.view = 'study'; save(); showQuestion(); };
  updateSelection();
}
function addSettingsToggle() {
  const settings = document.querySelector('.settings');
  const options = document.createElement('div');
  options.id = 'training-options';
  options.className = 'training-options';
  options.append(...settings.querySelectorAll('fieldset, .answer-filter, .progress-tools'));
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'settings-toggle';
  toggle.setAttribute('aria-controls', options.id);
  const update = () => {
    toggle.setAttribute('aria-expanded', String(settingsExpanded));
    toggle.innerHTML = '<span><strong>Настройки тренировки</strong><span id="settings-summary" class="settings-summary"></span></span><span class="settings-chevron" aria-hidden="true">⌄</span>';
    settings.classList.toggle('settings-expanded', settingsExpanded);
    updateSettingsSummary();
  };
  toggle.onclick = () => { settingsExpanded = !settingsExpanded; update(); };
  update();
  settings.querySelector('h2').after(toggle, options);
  positionProgressTools();
}
function positionProgressTools() {
  const settings = root.querySelector('.settings');
  if (!settings) return;
  const progress = settings.querySelector('.progress-tools');
  const active = document.activeElement;
  const hadFocus = progress.contains(active);
  const container = desktopLayout.matches ? settings : settings.querySelector('.training-options');
  container.append(progress);
  if (hadFocus) {
    const target = !desktopLayout.matches && !settingsExpanded ? settings.querySelector('.settings-toggle') : active;
    target.focus({preventScroll: true});
  }
}
function updateSettingsSummary() {
  const summary = document.querySelector('#settings-summary');
  if (!summary) return;
  summary.textContent = [state.mode === 'random' ? 'Случайный порядок' : 'По порядку', state.onlyAnswers ? 'с ответами' : '', state.onlyReview ? 'на повторение' : ''].filter(Boolean).join(' · ');
}
function updateSelection() {
  const count = pool().length;
  document.querySelector('#selected-count').textContent = count.toLocaleString('ru');
  document.querySelector('#selected-count-label').textContent = questionWord(count);
  document.querySelector('#start').disabled = !count;
  document.querySelector('#empty-hint').textContent = !state.selected.length ? 'Выберите темы' : !count ? 'Нет вопросов по фильтрам' : `Выбрано тем: ${state.selected.length}`;
  document.querySelector('#clear-selection').hidden = !state.selected.length;
  document.querySelectorAll('[data-topic]').forEach(input => input.closest('.topic').classList.toggle('is-selected', input.checked));
  document.querySelectorAll('[data-section]').forEach(input => {
    const ids = catalog.sections.find(s => s.id === input.dataset.section).topics.map(t => t.id);
    const selected = ids.filter(id => state.selected.includes(id)).length;
    input.checked = selected === ids.length; input.indeterminate = selected > 0 && selected < ids.length;
  });
  document.querySelectorAll('[data-selected-section]').forEach(label => {
    const section = catalog.sections.find(s => s.id === label.dataset.selectedSection);
    const selected = section.topics.filter(t => state.selected.includes(t.id)).length;
    label.hidden = !selected;
    label.textContent = `Выбрано тем: ${selected}`;
  });
  updateSettingsSummary();
}
function start() {
  let queue = pool();
  if (!queue.length) return;
  if (state.mode === 'random') for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  libraryState.scroll = window.scrollY;
  Object.assign(state, {queue, position: 0, revealed: [], view: 'study'}); save(); showQuestion();
}
function showQuestion() {
  focusOnQuestion = true;
  render();
  window.scrollTo(0, 0);
}
function backToTopics() {
  state.view = 'setup'; save(); render();
  window.scrollTo(0, libraryState.scroll);
  document.querySelector('.library-heading').focus({preventScroll: true});
}
function refreshQuestion(selector) {
  const scroll = window.scrollY;
  study();
  document.querySelector(selector)?.focus({preventScroll: true});
  window.scrollTo(0, scroll);
}
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const finish = error => {
      clearTimeout(timer);
      script.onload = script.onerror = null;
      if (error) { script.remove(); reject(error); }
      else resolve();
    };
    const timer = setTimeout(() => finish(new Error('Loading timed out')), 15000);
    script.src = url;
    script.onload = () => finish();
    script.onerror = () => finish(new Error('Loading failed'));
    document.head.append(script);
  });
}
async function loadTopic(topic) {
  if (!topic.loading) topic.loading = loadScript(topic.file).then(() => {
    const questions = window.QUESTION_TOPICS?.[topic.id];
    const byId = new Map(Array.isArray(questions) ? questions.map(q => [q.id, q]) : []);
    if (!topic.questions.every(q => typeof byId.get(q.id)?.question === 'string')) {
      throw new Error('Incomplete topic data');
    }
    for (const {id} of topic.questions) {
      const question = byId.get(id);
      Object.assign(all.get(question.id), question);
    }
    delete window.QUESTION_TOPICS[topic.id];
  }).catch(error => { topic.loading = null; throw error; });
  return topic.loading;
}
function loadRenderResources() {
  if (loadRenderResources.started) return;
  loadRenderResources.started = true;
  const resources = document.querySelector('#render-resources').content;
  resources.querySelectorAll('link').forEach(link => document.head.append(link.cloneNode(true)));
  // KaTeX auto-render depends on KaTeX; highlighting loads independently.
  const scripts = [...resources.querySelectorAll('script')];
  loadScript(scripts[0].src).then(() => loadScript(scripts[1].src))
    .then(() => renderMath(root)).catch(() => {});
  loadScript(scripts[2].src).then(() => highlightCode(root)).catch(() => {});
}
function study() {
  const q = all.get(state.queue[state.position]);
  if (!q) { state.view = 'setup'; save(); render(); return; }
  if (q.question === undefined) {
    root.innerHTML = '<p role="status">Загрузка вопросов…</p><button id="back-loading">К темам</button>';
    observeActionBar();
    document.querySelector('#back-loading').onclick = backToTopics;
    const stillCurrent = () => state.view === 'study' && state.queue[state.position] === q.id;
    loadTopic(topics.get(q.id.split(':')[0])).then(() => {
      if (stillCurrent()) study();
    }).catch(() => {
      if (!stillCurrent()) return;
      root.innerHTML = '<p role="status">Не удалось загрузить вопросы. Проверьте соединение.</p><button id="retry">Повторить</button><button id="back-loading">К темам</button>';
      observeActionBar();
      document.querySelector('#retry').onclick = study;
      document.querySelector('#back-loading').onclick = backToTopics;
    });
    return;
  }
  loadRenderResources();
  const revealed = state.revealed.includes(q.id);
  // Keep the fixed navigation in place while question content and scroll position change.
  if (!root.querySelector('.question')) {
    root.innerHTML = '<div class="study-top"><button class="text-button" id="back-setup">← К темам</button><span></span></div><progress aria-label="Прогресс"></progress><article class="question"></article><nav class="question-nav" aria-label="Навигация по вопросам"><button id="prev">← Назад</button><button class="primary" id="next"></button></nav>';
  }
  root.querySelector('.study-top span').textContent = `${state.position + 1} / ${state.queue.length}`;
  const progress = root.querySelector('progress');
  progress.max = state.queue.length;
  progress.value = state.position + 1;
  document.querySelector('#prev').disabled = state.position === 0;
  document.querySelector('#next').textContent = state.position === state.queue.length - 1 ? 'Завершить' : 'Следующий →';
  root.querySelector('.question').innerHTML = `<p class="eyebrow">${escapeHtml(q.section)} / ${escapeHtml(q.topic)}</p><p class="group">${escapeHtml(q.group)}</p><div class="question-title" role="heading" aria-level="1" tabindex="-1">${q.question}</div>${q.answer ? `<button class="reveal" id="reveal" aria-controls="question-answer" aria-expanded="${revealed}">${revealed ? 'Скрыть ответ' : 'Показать ответ'}</button><div id="question-answer" class="answer" ${revealed ? '' : 'hidden'}>${revealed ? q.answer : ''}</div>` : '<p class="no-answer">Ответ пока не добавлен</p>'}<a class="source-link" href="../${q.id.split(':')[0]}" target="_blank" rel="noopener">Исходный материал ↗</a>`;
  renderMath(root);
  highlightCode(root);
  addCodeCopyButtons(root);
  if (revealed || !q.answer) {
    const mark = state.marks[q.id];
    document.querySelector('.source-link').insertAdjacentHTML('beforebegin', `<fieldset class="question-rating"><legend>Ваша оценка</legend><button data-mark="known" aria-pressed="${mark === 'known'}">Знаю</button><button data-mark="review" aria-pressed="${mark === 'review'}">Повторить</button></fieldset>`);
    document.querySelectorAll('[data-mark]').forEach(button => button.onclick = () => {
      if (state.marks[q.id] === button.dataset.mark) delete state.marks[q.id];
      else state.marks[q.id] = button.dataset.mark;
      save(); refreshQuestion(`[data-mark="${button.dataset.mark}"]`);
    });
  }
  document.querySelector('#back-setup').onclick = backToTopics;
  document.querySelector('#prev').onclick = () => { if (state.position) state.position--; save(); showQuestion(); };
  document.querySelector('#next').onclick = () => { if (state.position + 1 < state.queue.length) state.position++; else state.view = 'done'; save(); showQuestion(); };
  const reveal = document.querySelector('#reveal');
  if (reveal) reveal.onclick = () => { state.revealed = revealed ? state.revealed.filter(id => id !== q.id) : [...state.revealed, q.id]; save(); refreshQuestion('#reveal'); };
  if (focusOnQuestion) {
    document.querySelector('.question-title').focus({preventScroll: true});
    focusOnQuestion = false;
  }
  observeActionBar();
}
function complete() {
  root.innerHTML = `<section class="completion"><p class="eyebrow">ПОДБОРКА ЗАВЕРШЕНА</p><h1 tabindex="-1">Хорошая работа.</h1><p>Вы дошли до конца подборки из ${state.queue.length} вопросов.</p><div><button class="primary" id="choose">Выбрать темы</button><button id="repeat">Повторить подборку</button></div></section>`;
  document.querySelector('#choose').onclick = backToTopics;
  document.querySelector('#repeat').onclick = () => { state.position = 0; state.revealed = []; state.view = 'study'; save(); showQuestion(); };
  const review = state.queue.filter(id => state.marks[id] === 'review');
  if (review.length) {
    document.querySelector('.completion>div').insertAdjacentHTML('beforeend', `<button id="review-session">Повторить сложные (${review.length})</button>`);
    document.querySelector('#review-session').onclick = () => {
      state.queue = review; state.position = 0; state.revealed = []; state.view = 'study'; save(); showQuestion();
    };
  }
  if (focusOnQuestion) {
    document.querySelector('.completion h1').focus({preventScroll: true});
    focusOnQuestion = false;
  }
}

function addPracticeTools() {
  const reviewCount = Object.values(state.marks).filter(mark => mark === 'review').length;
  document.querySelector('#only-answers').closest('label').insertAdjacentHTML('afterend', `<label class="answer-filter"><input id="only-review" type="checkbox" ${state.onlyReview ? 'checked' : ''}> Только «Повторить» (${reviewCount})</label>`);
  document.querySelector('#only-review').onchange = event => { state.onlyReview = event.target.checked; updateSelection(); save(); };
  document.querySelector('.library').insertAdjacentHTML('afterbegin', '<div class="topic-search"><div class="search-heading"><label for="topic-search">Поиск по темам</label><button class="text-button" id="clear-selection" type="button" hidden>Сбросить выбор</button></div><div class="search-field"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input id="topic-search" type="search" placeholder="Например, STL или Linux" autocomplete="off" enterkeyhint="search"><button id="clear-search" type="button" aria-label="Очистить поиск" hidden>×</button></div><p id="search-empty" class="muted" role="status" hidden>Ничего не найдено. Попробуйте другое название.</p></div>');
  const sections = [...document.querySelectorAll('.library details')];
  if (libraryState.open === null) libraryState.open = sections.filter(section => section.open).map(section => section.dataset.librarySection);
  sections.forEach(section => section.ontoggle = () => {
    if (!libraryState.query.trim()) libraryState.open = sections.filter(element => element.open).map(element => element.dataset.librarySection);
  });
  const search = document.querySelector('#topic-search');
  const applySearch = () => {
    if (!libraryState.query.trim() && search.value.trim()) libraryState.open = sections.filter(section => section.open).map(section => section.dataset.librarySection);
    libraryState.query = search.value;
    const query = search.value.trim().toLocaleLowerCase('ru');
    document.querySelector('#clear-search').hidden = !search.value;
    sections.forEach((element, index) => {
      const section = catalog.sections[index];
      const sectionMatch = section.title.toLocaleLowerCase('ru').includes(query);
      let visible = 0;
      element.querySelectorAll('.topic').forEach(label => {
        const topic = topics.get(label.querySelector('input').dataset.topic);
        label.hidden = Boolean(query) && !sectionMatch && !topic.title.toLocaleLowerCase('ru').includes(query);
        if (!label.hidden) visible++;
      });
      element.hidden = Boolean(query) && !sectionMatch && !visible;
      element.open = query ? !element.hidden : libraryState.open.includes(section.id);
      const selectAll = element.querySelector('.select-all');
      if (selectAll) selectAll.hidden = Boolean(query) && !sectionMatch;
    });
    document.querySelector('#search-empty').hidden = sections.some(section => !section.hidden);
  };
  search.value = libraryState.query;
  search.oninput = applySearch;
  search.onkeydown = event => { if (event.key === 'Enter') search.blur(); };
  document.querySelector('#clear-search').onclick = () => { search.value = ''; applySearch(); search.focus({preventScroll: true}); };
  document.querySelector('#clear-selection').onclick = () => {
    state.selected = [];
    document.querySelectorAll('[data-topic]').forEach(input => input.checked = false);
    updateSelection(); save();
    document.querySelector('.library-heading').focus({preventScroll: true});
  };
  applySearch();
  document.querySelector('.settings').insertAdjacentHTML('beforeend', '<div class="progress-tools"><h3>Прогресс</h3><button id="export-progress">Экспорт</button><button id="import-progress">Импорт</button><input id="progress-file" type="file" accept="application/json,.json" hidden><p id="import-status" role="status" class="muted"></p></div>');
  document.querySelector('#export-progress').onclick = () => {
    const blob = new Blob([JSON.stringify({app: KEY, version: 1, state}, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'interview-progress.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const fileInput = document.querySelector('#progress-file');
  document.querySelector('#import-progress').onclick = () => fileInput.click();
  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error('File too large');
      const imported = JSON.parse(await file.text());
      if (imported.app !== KEY || imported.version !== 1) throw new Error('Unknown format');
      const restored = restore(imported.state);
      if (!window.confirm('Заменить текущий прогресс данными из файла?')) return;
      state = restored; save(); render();
      const status = document.querySelector('#import-status');
      if (status) status.textContent = 'Прогресс импортирован';
    } catch (_) {
      document.querySelector('#import-status').textContent = 'Не удалось импортировать файл. Выберите JSON, созданный через экспорт прогресса.';
    } finally { fileInput.value = ''; }
  };
}
