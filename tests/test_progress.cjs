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
