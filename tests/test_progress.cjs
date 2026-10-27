const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {test} = require('node:test');
const vm = require('node:vm');
const path = require('node:path');

function context(document = {querySelector: () => ({})}) {
  const sandbox = vm.createContext({window: {}, document});
  vm.runInContext(readFileSync(path.join(__dirname, '../web/app.js'), 'utf8'), sandbox);
  vm.runInContext(`
    all.set('q1', {id: 'q1', answer: 'Answer'});
    all.set('q2', {id: 'q2', answer: null});
    topics.set('topic', {id: 'topic', questions: [...all.values()]});
  `, sandbox);
  return sandbox;
}

function restore(sandbox, saved) {
  sandbox.saved = saved;
  return JSON.parse(vm.runInContext('JSON.stringify(restore(saved))', sandbox));
}

const original = {
  selected: ['topic'], queue: ['q1', 'q2'], revealed: ['q1'],
  position: 1, mode: 'random', view: 'study', onlyAnswers: false,
};

test('old progress retains position and receives empty ratings', () => {
  const restored = restore(context(), original);
  assert.equal(restored.position, 1);
  assert.deepEqual(restored.marks, {});
  assert.equal(restored.onlyReview, false);
  assert.equal(restored.view, 'study');
  assert.equal(Object.hasOwn(restored, 'limit'), false);
});

test('new sessions have no question-count limit', () => {
  const sandbox = context();
  assert.equal(vm.runInContext("Object.hasOwn(state, 'limit')", sandbox), false);
});

test('legacy capped sessions return to selection without losing progress', () => {
  const sandbox = context();
  const marks = {q1: 'known', q2: 'review'};
  for (const limit of [10, 20, 30, 1, 7, 45, 1000, Number.MAX_SAFE_INTEGER]) {
    const restored = restore(sandbox, {...original, marks, limit});
    assert.equal(Object.hasOwn(restored, 'limit'), false);
    assert.equal(restored.view, 'setup', `legacy count ${limit}`);
    assert.equal(restored.position, original.position);
    assert.deepEqual(restored.queue, original.queue);
    assert.deepEqual(restored.selected, original.selected);
    assert.deepEqual(restored.revealed, original.revealed);
    assert.deepEqual(restored.marks, marks);
  }
});

test('uncapped and invalid legacy limits preserve the saved view', () => {
  const sandbox = context();
  const ignoredLimits = [
    undefined, null, 0, -1, -10, 0.5, 7.5, NaN, Infinity, -Infinity,
    Number.MAX_SAFE_INTEGER + 1, '20', '', false, {}, [],
  ];
  for (const limit of ignoredLimits) {
    const restored = restore(sandbox, {...original, limit});
    assert.equal(Object.hasOwn(restored, 'limit'), false);
    assert.equal(restored.view, 'study', `ignored legacy limit ${String(limit)}`);
    assert.equal(restored.position, original.position);
    assert.deepEqual(restored.queue, original.queue);
  }
});

test('completed legacy sessions remain completed', () => {
  const restored = restore(context(), {...original, limit: 20, view: 'done'});
  assert.equal(restored.view, 'done');
  assert.deepEqual(restored.queue, original.queue);
  assert.equal(restored.position, original.position);
  assert.equal(Object.hasOwn(restored, 'limit'), false);
});

function startSession(mode, {onlyAnswers = false, onlyReview = false} = {}) {
  const sandbox = context();
  sandbox.window.scrollY = 120;
  sandbox.options = {mode, onlyAnswers, onlyReview};
  vm.runInContext(`
    all.clear(); topics.clear();
    const selectedQuestions = Array.from({length: 60}, (_, index) => ({
      id: 'selected-' + index,
      answer: index % 4 === 0 ? null : 'Answer',
    }));
    const excludedQuestions = [{id: 'unselected', answer: 'Answer'}];
    for (const question of [...selectedQuestions, ...excludedQuestions]) {
      all.set(question.id, question);
    }
    topics.set('selected', {id: 'selected', questions: selectedQuestions});
    topics.set('excluded', {id: 'excluded', questions: excludedQuestions});
    Object.assign(state, options, {
      selected: ['selected'], limit: 20,
      marks: Object.fromEntries(selectedQuestions.map((question, index) =>
        [question.id, index % 5 === 0 ? 'known' : 'review'])),
      queue: ['old-session'], position: 1, revealed: ['old-session'],
    });
    save = () => {};
    showQuestion = () => {};
    start();
  `, sandbox);
  return JSON.parse(vm.runInContext('JSON.stringify(state)', sandbox));
}

test('new training includes all questions in the selected topics despite legacy caps', () => {
  const expected = Array.from({length: 60}, (_, index) => 'selected-' + index);
  for (const mode of ['ordered', 'random']) {
    const started = startSession(mode);
    assert.equal(started.queue.length, 60);
    assert.equal(new Set(started.queue).size, 60);
    assert.deepEqual(new Set(started.queue), new Set(expected));
    if (mode === 'ordered') assert.deepEqual(started.queue, expected);
    assert.equal(started.position, 0);
    assert.deepEqual(started.revealed, []);
    assert.equal(started.view, 'study');
  }
});

test('full training honors answer and review filters in either question order', () => {
  for (const mode of ['ordered', 'random']) {
    for (const filters of [
      {onlyAnswers: true}, {onlyReview: true},
      {onlyAnswers: true, onlyReview: true},
    ]) {
      const expected = Array.from({length: 60}, (_, index) => index)
        .filter(index => (!filters.onlyAnswers || index % 4 !== 0)
          && (!filters.onlyReview || index % 5 !== 0))
        .map(index => 'selected-' + index);
      const started = startSession(mode, filters);
      assert.equal(started.queue.length, expected.length);
      assert.equal(new Set(started.queue).size, expected.length);
      assert.deepEqual(new Set(started.queue), new Set(expected));
      if (mode === 'ordered') assert.deepEqual(started.queue, expected);
    }
  }
});

test('unknown IDs are removed while current question and ratings survive', () => {
  const restored = restore(context(), {
    ...original, queue: ['removed', 'q2', 'q2'],
    marks: {removed: 'known', q2: 'review'},
  });
  assert.deepEqual(restored.queue, ['q2']);
  assert.equal(restored.position, 0);
  assert.deepEqual(restored.marks, {q2: 'review'});
});

test('invalid imports are rejected', () => {
  for (const change of [{queue: 'bad'}, {marks: []}, {marks: {q1: 'bad'}}, {position: -1}]) {
    assert.throws(() => restore(context(), {...original, ...change}));
  }
});

test('review filter respects selected topics and availability of answers', () => {
  const sandbox = context();
  vm.runInContext("state.selected = ['topic']; state.onlyReview = true; state.marks = {q2: 'review'}", sandbox);
  assert.equal(vm.runInContext('JSON.stringify(pool())', sandbox), '["q2"]');
  vm.runInContext('state.onlyAnswers = true', sandbox);
  assert.equal(vm.runInContext('JSON.stringify(pool())', sandbox), '[]');
});

function loadingContext() {
  const sandbox = context();
  const scripts = [];
  const timers = new Map();
  let nextTimer = 0;
  sandbox.setTimeout = callback => { timers.set(++nextTimer, callback); return nextTimer; };
  sandbox.clearTimeout = id => timers.delete(id);
  sandbox.document.createElement = () => ({remove() { this.removed = true; }});
  sandbox.document.head = {append(script) { scripts.push(script); }};
  return {sandbox, scripts, timers};
}

test('stalled topic loading times out and can be retried', async () => {
  const {sandbox, scripts, timers} = loadingContext();
  const first = vm.runInContext("loadTopic(topics.get('topic'))", sandbox);
  const failed = assert.rejects(first, /timed out/);
  [...timers.values()][0]();
  await failed;
  assert.equal(scripts[0].removed, true);
  assert.equal(timers.size, 0);
  const retry = vm.runInContext("loadTopic(topics.get('topic'))", sandbox);
  sandbox.window.QUESTION_TOPICS = {topic: [
    {id: 'q1', question: 'First?', answer: 'Answer'},
    {id: 'q2', question: 'Second?', answer: null},
  ]};
  scripts[1].onload();
  await retry;
  assert.equal(vm.runInContext("all.get('q1').question", sandbox), 'First?');
  assert.equal(timers.size, 0);
});

test('incomplete topic data is rejected instead of repeatedly rendering loading', async () => {
  const {sandbox, scripts} = loadingContext();
  sandbox.window.QUESTION_TOPICS = {topic: [{id: 'q1', question: 'First?'}]};
  const loading = vm.runInContext("loadTopic(topics.get('topic'))", sandbox);
  const failed = assert.rejects(loading, /Incomplete topic data/);
  scripts[0].onload();
  await failed;
  assert.equal(vm.runInContext("topics.get('topic').loading", sandbox), null);
  assert.equal(vm.runInContext("all.get('q1').question", sandbox), undefined);
});

test('network failures clear the timer and allow retry', async () => {
  const {sandbox, scripts, timers} = loadingContext();
  const loading = vm.runInContext("loadTopic(topics.get('topic'))", sandbox);
  const failed = assert.rejects(loading, /Loading failed/);
  scripts[0].onerror();
  await failed;
  assert.equal(timers.size, 0);
  assert.equal(vm.runInContext("topics.get('topic').loading", sandbox), null);
});

// A small DOM for exercising rendering and retained element identity in the VM.
// Replacing innerHTML creates new children, as it does in the browser.
function studyContext() {
  const document = {activeElement: null};
  class Element {
    constructor(tag, attributes = '') {
      this.tag = tag;
      this.children = [];
      this.attributes = Object.fromEntries([...attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g)]
        .map(([, name, value = '']) => [name, value]));
      this.dataset = Object.fromEntries(Object.entries(this.attributes)
        .filter(([name]) => name.startsWith('data-')).map(([name, value]) => [name.slice(5), value]));
      this.hidden = Object.hasOwn(this.attributes, 'hidden');
      this.disabled = Object.hasOwn(this.attributes, 'disabled');
    }
    set innerHTML(html) {
      for (const child of this.children) child.parent = null;
      this.children = [];
      const stack = [this];
      for (const token of html.match(/<[^>]+>|[^<]+/g) || []) {
        if (token.startsWith('</')) stack.pop();
        else if (token.startsWith('<')) {
          const [, tag, attributes] = token.match(/^<(\w+)([^>]*)>/);
          const child = new Element(tag, attributes);
          child.parent = stack.at(-1);
          child.parent.children.push(child);
          if (!['br', 'hr', 'input', 'link', 'meta'].includes(tag)) stack.push(child);
        } else {
          const child = new Element('#text');
          child.text = token;
          child.parent = stack.at(-1);
          child.parent.children.push(child);
        }
      }
    }
    set textContent(text) { this.innerHTML = ''; this.text = String(text); }
    get textContent() { return this.text || this.children.map(child => child.textContent).join(''); }
    matches(selector) {
      if (selector.startsWith('#')) return this.attributes.id === selector.slice(1);
      if (selector.startsWith('.')) return (this.attributes.class || '').split(' ').includes(selector.slice(1));
      if (selector.startsWith('[')) {
        const [, name, value] = selector.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);
        return Object.hasOwn(this.attributes, name) && (value === undefined || this.attributes[name] === value);
      }
      return this.tag === selector;
    }
    querySelectorAll(selector) {
      return selector.split(',').flatMap(part => {
        const tokens = part.trim().split(/\s*>\s*|\s+/);
        const descendants = this.children.flatMap(child => [child, ...child.querySelectorAll('*')]);
        if (part === '*') return descendants;
        return descendants.filter(node => {
          if (!node.matches(tokens.at(-1))) return false;
          let ancestor = node.parent;
          for (const token of tokens.slice(0, -1).reverse()) {
            while (ancestor && !ancestor.matches(token)) ancestor = ancestor.parent;
            if (!ancestor) return false;
            ancestor = ancestor.parent;
          }
          return true;
        });
      });
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    getAttribute(name) { return this.attributes[name] ?? null; }
    focus() { document.activeElement = this; }
    click() { if (!this.disabled) this.onclick?.(); }
    getBoundingClientRect() { return {height: 72}; }
    insertAdjacentHTML(position, html) {
      const fragment = new Element('fragment');
      fragment.innerHTML = html;
      const parent = position === 'beforebegin' ? this.parent : this;
      const index = position === 'beforebegin' ? parent.children.indexOf(this) : parent.children.length;
      for (const child of fragment.children) child.parent = parent;
      parent.children.splice(index, 0, ...fragment.children);
    }
  }
  document.body = new Element('body');
  document.body.dataset = {};
  document.body.innerHTML = '<main id="app"></main><footer id="footer-source"></footer><a class="roadmap-link" href="roadmap.html">Roadmap</a>';
  document.querySelector = selector => document.body.querySelector(selector);
  document.querySelectorAll = selector => document.body.querySelectorAll(selector);
  document.documentElement = {style: {setProperty() {}, removeProperty() {}}};
  const sandbox = context(document);
  sandbox.localStorage = {setItem() {}};
  sandbox.window.scrollY = 0;
  sandbox.window.scrollTo = (_, top) => { sandbox.window.scrollY = top; };
  vm.runInContext(`
    all.clear(); topics.clear();
    const questions = Array.from({length: 4}, (_, index) => ({
      id: 'topic:q' + index, question: '<p>Question ' + index + '</p>',
      answer: index === 2 ? null : '<p>Answer ' + index + '</p>',
      section: 'C/C++', topic: 'Основы', group: 'Basics',
    }));
    for (const question of questions) all.set(question.id, question);
    topics.set('topic', {id: 'topic', questions});
    Object.assign(state, {selected: ['topic'], queue: questions.map(q => q.id), view: 'study'});
    loadRenderResources = () => {};
    showQuestion();
  `, sandbox);
  const snapshot = () => JSON.parse(vm.runInContext('JSON.stringify(state)', sandbox));
  return {sandbox, document, snapshot};
}

test('revealing and rating a scrolled question retains its navigation controls', () => {
  const {sandbox, document, snapshot} = studyContext();
  const next = document.querySelector('#next');
  const prev = document.querySelector('#prev');
  const nav = document.querySelector('.question-nav');
  sandbox.window.scrollY = 740;
  document.querySelector('#reveal').click();
  assert.equal(document.querySelector('#next'), next);
  assert.equal(document.querySelector('#prev'), prev);
  assert.equal(document.querySelector('.question-nav'), nav);
  assert.equal(document.querySelector('#question-answer').hidden, false);
  assert.equal(sandbox.window.scrollY, 740);
  assert.deepEqual(snapshot().revealed, ['topic:q0']);

  document.querySelector('[data-mark="known"]').click();
  assert.equal(snapshot().marks['topic:q0'], 'known');
  assert.equal(document.activeElement, document.querySelector('[data-mark="known"]'));
  assert.equal(document.querySelector('#next'), next);
  assert.equal(document.querySelector('#prev'), prev);
  assert.equal(sandbox.window.scrollY, 740);

  document.querySelector('#reveal').click();
  assert.equal(document.querySelector('#question-answer').hidden, true);
  assert.deepEqual(snapshot().revealed, []);
  assert.equal(document.querySelector('#next'), next);
  next.click();
  assert.equal(snapshot().position, 1);
  assert.equal(sandbox.window.scrollY, 0);
});

test('repeated Next after scrolling advances hidden answers using the same buttons', () => {
  const {sandbox, document, snapshot} = studyContext();
  const next = document.querySelector('#next');
  const prev = document.querySelector('#prev');
  const progress = document.querySelector('progress');
  assert.equal(prev.disabled, true);
  document.querySelector('#reveal').click();
  for (let position = 1; position <= 3; position++) {
    sandbox.window.scrollY = 600 + position * 100;
    next.click();
    assert.equal(snapshot().position, position);
    assert.equal(document.querySelector('#next'), next);
    assert.equal(document.querySelector('#prev'), prev);
    assert.equal(document.querySelector('progress'), progress);
    assert.equal(document.querySelector('.study-top span').textContent, `${position + 1} / 4`);
    assert.equal(progress.value, position + 1);
    assert.equal(progress.max, 4);
    assert.equal(prev.disabled, false);
    assert.equal(sandbox.window.scrollY, 0);
    assert.equal(document.activeElement, document.querySelector('.question-title'));
    if (position !== 2) assert.equal(document.querySelector('#question-answer').hidden, true);
    else assert.equal(document.querySelector('#reveal'), null);
  }
  assert.equal(next.textContent, 'Завершить');
  sandbox.window.scrollY = 900;
  prev.click();
  assert.equal(snapshot().position, 2);
  assert.equal(document.querySelector('#next'), next);
  assert.equal(next.textContent, 'Следующий →');
  assert.equal(progress.value, 3);
  next.click();
  next.click();
  assert.equal(snapshot().view, 'done');
  assert.equal(document.body.dataset.view, 'done');
  assert.equal(document.querySelector('#next'), null);
  document.querySelector('#repeat').click();
  assert.equal(snapshot().view, 'study');
  assert.equal(snapshot().position, 0);
  assert.deepEqual(snapshot().revealed, []);
  assert.notEqual(document.querySelector('#next'), next);
  assert.equal(document.querySelector('#prev').disabled, true);
});
