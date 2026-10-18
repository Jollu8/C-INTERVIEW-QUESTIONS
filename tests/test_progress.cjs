const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {test} = require('node:test');
const vm = require('node:vm');
const path = require('node:path');

function context() {
  const sandbox = vm.createContext({window: {}, document: {querySelector: () => ({})}});
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
