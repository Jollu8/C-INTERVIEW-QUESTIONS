"use strict";
const root = document.querySelector('#app');
const KEY = 'interview-practice-v1';
const catalog = window.QUESTION_CATALOG;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const all = new Map();
const topics = new Map();
let state = {selected: [], mode: 'ordered', onlyAnswers: false, onlyReview: false, limit: 20, marks: {}, queue: [], position: 0, revealed: [], view: 'setup'};
let settingsExpanded = false;
let learningExpanded = false;
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
  return {
    selected: [...new Set(saved.selected)].filter(id => topics.has(id)),
    limit: [10, 20, 30, 0].includes(saved.limit) ? saved.limit : 20,
    mode: saved.mode, onlyAnswers: saved.onlyAnswers === true,
    onlyReview: saved.onlyReview === true, marks, queue,
    position: Math.max(0, queue.indexOf(saved.queue[saved.position])),
    revealed: [...new Set(saved.revealed)].filter(id => all.has(id)),
    view: queue.length ? saved.view : 'setup',
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
      selected: [topic.id], queue: topic.questions.map(q => q.id),
      position: 0, revealed: [], view: 'study', onlyAnswers: false, onlyReview: false,
    });
    save();
  } else if (track) {
    selectTrack(track); state.view = 'setup'; save();
  }
  if (topic || track) {
    url.searchParams.delete('topic');
    url.searchParams.delete('track');
    history.replaceState(null, '', url.href);
  }
  render();
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
  document.querySelector('#footer-source').hidden = state.view !== 'setup';
  document.querySelector('#learning-help').hidden = state.view !== 'setup';
  if (state.view === 'setup') setup();
  else if (state.view === 'done') complete();
  else study();
}
function setup() {
  root.innerHTML = `<div class="page-heading"><h1 class="library-heading">Библиотека / ${catalog.sections.length}<span class="section-count-label"> разделов</span></h1><span class="total"><strong>${all.size.toLocaleString('ru')}</strong><span>вопросов</span></span>
    ${state.queue.length ? '<div class="resume"><span>Есть сохранённая подборка</span><button id="resume" aria-label="Продолжить сохранённую подборку" title="Продолжить сохранённую подборку"><span class="resume-label">Продолжить</span><span aria-hidden="true">→</span></button></div>' : ''}</div>
    <section id="learning-panel" class="learning-start" ${learningExpanded ? '' : 'hidden'} aria-label="Маршруты обучения"><h2>Что хотите освоить?</h2><p>Выберите маршрут или настройте подборку из библиотеки ниже.</p><div class="track-grid">${(catalog.tracks || []).map(t => `<button class="track-card" data-track="${escapeHtml(t.id)}"><strong>${escapeHtml(t.title)}</strong><span>${escapeHtml(t.description)}</span></button>`).join('')}</div><a href="roadmap.html">Что читать, что сделать и как проверить знания →</a></section>
    <div class="setup-layout"><section class="library" aria-label="Темы">${catalog.sections.map((s, index) => {
      const qs = s.topics.flatMap(t => t.questions);
      return `<details ${index === 0 ? 'open' : ''}><summary><span class="section-number">${String(index + 1).padStart(2, '0')}</span><span class="section-name">${escapeHtml(s.title)}<small>${qs.length ? countText(qs) : 'План обучения'}</small></span><span class="expand">+</span></summary>
        ${s.plan ? `<a class="plan-link" href="${escapeHtml(s.plan)}">План обучения и материалы →</a>` : ''}${s.topics.length ? `<div class="topic-list"><label class="select-all"><input type="checkbox" data-section="${s.id}"> Весь раздел</label>${s.topics.map(t => `<label class="topic"><input type="checkbox" data-topic="${t.id}" ${state.selected.includes(t.id) ? 'checked' : ''}><span>${escapeHtml(t.title)}<small>${countText(t.questions)}</small></span></label>`).join('')}</div>` : '<p class="empty-section">Вопросы ещё не добавлены. Начните с плана обучения.</p>'}</details>`;
    }).join('')}</section>
    <aside class="settings"><p class="eyebrow">ВАША ПОДБОРКА</p><h2>Настроить тренировку</h2><fieldset><legend>Порядок вопросов</legend><div class="segmented"><label><input type="radio" name="mode" value="ordered" ${state.mode === 'ordered' ? 'checked' : ''}><span>По порядку</span></label><label><input type="radio" name="mode" value="random" ${state.mode === 'random' ? 'checked' : ''}><span>Случайно</span></label></div></fieldset><label class="session-size" for="session-size">Вопросов в тренировке<select id="session-size">${[10, 20, 30, 0].map(n => `<option value="${n}" ${state.limit === n ? 'selected' : ''}>${n || 'Все выбранные'}</option>`).join('')}</select></label><label class="answer-filter"><input id="only-answers" type="checkbox" ${state.onlyAnswers ? 'checked' : ''}> Только с ответами</label><div class="selection-count"><strong id="selected-count"></strong><span>вопросов выбрано</span></div><button class="primary" id="start">Начать тренировку →</button><p id="empty-hint" class="muted"></p></aside></div>`;
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
  document.querySelectorAll('[data-track]').forEach(button => button.onclick = () => {
    selectTrack(catalog.tracks.find(t => t.id === button.dataset.track)); learningExpanded = false; render();
    document.querySelector('.settings').scrollIntoView({block: 'center', behavior: 'smooth'});
  });
  const help = document.querySelector('#learning-help');
  help.setAttribute('aria-expanded', String(learningExpanded));
  help.onclick = () => {
    learningExpanded = !learningExpanded;
    document.querySelector('#learning-panel').hidden = !learningExpanded;
    help.setAttribute('aria-expanded', String(learningExpanded));
  };
  document.querySelector('#session-size').onchange = event => { state.limit = Number(event.target.value); updateSelection(); save(); };
  document.querySelector('#start').onclick = start;
  addPracticeTools();
  addSettingsToggle();
  const resume = document.querySelector('#resume');
  if (resume) resume.onclick = () => { state.view = 'study'; save(); render(); };
  updateSelection();
}
function addSettingsToggle() {
  const settings = document.querySelector('.settings');
  const options = document.createElement('div');
  options.id = 'training-options';
  options.className = 'training-options';
  options.append(...settings.querySelectorAll('fieldset, .answer-filter, .session-size, .progress-tools'));
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'settings-toggle';
  toggle.setAttribute('aria-controls', options.id);
  const update = () => {
    toggle.setAttribute('aria-expanded', String(settingsExpanded));
    toggle.textContent = settingsExpanded ? 'Скрыть настройки −' : 'Настройки тренировки +';
    settings.classList.toggle('settings-expanded', settingsExpanded);
  };
  toggle.onclick = () => { settingsExpanded = !settingsExpanded; update(); };
  update();
  settings.querySelector('h2').after(toggle, options);
}
function updateSelection() {
  const count = pool().length;
  document.querySelector('#selected-count').textContent = (state.limit ? Math.min(state.limit, count) : count).toLocaleString('ru');
  document.querySelector('#start').disabled = !count;
  document.querySelector('#empty-hint').textContent = !state.selected.length ? 'Выберите темы' : !count ? 'Нет вопросов, соответствующих фильтрам' : '';
  document.querySelectorAll('[data-section]').forEach(input => {
    const ids = catalog.sections.find(s => s.id === input.dataset.section).topics.map(t => t.id);
    const selected = ids.filter(id => state.selected.includes(id)).length;
    input.checked = selected === ids.length; input.indeterminate = selected > 0 && selected < ids.length;
  });
}
function start() {
  let queue = pool();
  if (!queue.length) return;
  if (state.mode === 'random') for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  if (state.limit) queue = queue.slice(0, state.limit);
  Object.assign(state, {queue, position: 0, revealed: [], view: 'study'}); save(); render(); window.scrollTo(0, 0);
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
    document.querySelector('#back-loading').onclick = () => { state.view = 'setup'; save(); render(); };
    const stillCurrent = () => state.view === 'study' && state.queue[state.position] === q.id;
    loadTopic(topics.get(q.id.split(':')[0])).then(() => {
      if (stillCurrent()) study();
    }).catch(() => {
      if (!stillCurrent()) return;
      root.innerHTML = '<p role="status">Не удалось загрузить вопросы. Проверьте соединение.</p><button id="retry">Повторить</button><button id="back-loading">К темам</button>';
      document.querySelector('#retry').onclick = study;
      document.querySelector('#back-loading').onclick = () => { state.view = 'setup'; save(); render(); };
    });
    return;
  }
  loadRenderResources();
  const revealed = state.revealed.includes(q.id);
  root.innerHTML = `<div class="study-top"><button class="text-button" id="back-setup">← К темам</button><span>${state.position + 1} / ${state.queue.length}</span></div><progress value="${state.position + 1}" max="${state.queue.length}" aria-label="Прогресс"></progress><article class="question"><p class="eyebrow">${escapeHtml(q.section)} / ${escapeHtml(q.topic)}</p><p class="group">${escapeHtml(q.group)}</p><div class="question-title">${q.question}</div>${q.answer ? `<button class="reveal" id="reveal" aria-expanded="${revealed}">${revealed ? 'Скрыть ответ' : 'Показать ответ'}</button><div class="answer" ${revealed ? '' : 'hidden'}>${revealed ? q.answer : ''}</div>` : '<p class="no-answer">Ответ пока не добавлен</p>'}<a class="source-link" href="../${q.id.split(':')[0]}" target="_blank" rel="noopener">Исходный материал ↗</a></article><nav class="question-nav" aria-label="Навигация по вопросам"><button id="prev" ${state.position === 0 ? 'disabled' : ''}>← Назад</button><button class="primary" id="next">${state.position === state.queue.length - 1 ? 'Завершить' : 'Следующий →'}</button></nav>`;
  renderMath(root);
  highlightCode(root);
  addCodeCopyButtons(root);
  if (revealed || !q.answer) {
    const mark = state.marks[q.id];
    document.querySelector('.source-link').insertAdjacentHTML('beforebegin', `<fieldset class="question-rating"><legend>Ваша оценка</legend><button data-mark="known" aria-pressed="${mark === 'known'}">Знаю</button><button data-mark="review" aria-pressed="${mark === 'review'}">Повторить</button></fieldset>`);
    document.querySelectorAll('[data-mark]').forEach(button => button.onclick = () => {
      if (state.marks[q.id] === button.dataset.mark) delete state.marks[q.id];
      else state.marks[q.id] = button.dataset.mark;
      save(); study();
    });
  }
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
  const review = state.queue.filter(id => state.marks[id] === 'review');
  if (review.length) {
    document.querySelector('.completion>div').insertAdjacentHTML('beforeend', `<button id="review-session">Повторить сложные (${review.length})</button>`);
    document.querySelector('#review-session').onclick = () => {
      state.queue = review; state.position = 0; state.revealed = []; state.view = 'study'; save(); render();
    };
  }
}

function addPracticeTools() {
  const reviewCount = Object.values(state.marks).filter(mark => mark === 'review').length;
  document.querySelector('.selection-count').insertAdjacentHTML('beforebegin', `<label class="answer-filter"><input id="only-review" type="checkbox" ${state.onlyReview ? 'checked' : ''}> Только «Повторить» (${reviewCount})</label>`);
  document.querySelector('#only-review').onchange = event => { state.onlyReview = event.target.checked; updateSelection(); save(); };
  document.querySelector('.library').insertAdjacentHTML('afterbegin', '<div class="topic-search"><label for="topic-search">Поиск по темам</label><input id="topic-search" type="search" placeholder="Например, STL или Linux"><p id="search-empty" class="muted" hidden>Темы не найдены</p></div>');
  const sections = [...document.querySelectorAll('.library details')];
  const expanded = sections.map(section => section.open);
  document.querySelector('#topic-search').oninput = event => {
    const query = event.target.value.trim().toLocaleLowerCase('ru');
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
      element.open = query ? !element.hidden : expanded[index];
      const selectAll = element.querySelector('.select-all');
      if (selectAll) selectAll.hidden = Boolean(query) && !sectionMatch;
    });
    document.querySelector('#search-empty').hidden = sections.some(section => !section.hidden);
  };
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
