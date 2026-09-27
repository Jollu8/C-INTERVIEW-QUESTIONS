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
