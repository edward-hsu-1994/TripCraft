import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import test from 'node:test';

const defaultTargets = [
  'templates/hokkaido-7days.html',
  'templates/kyushu-8days.html',
  'templates/kansai-7days.html',
  'templates/okayama-travel.html',
  'templates/tokyo-8days.html',
  'SKILL-for-Web.md'
];

const targets = (() => {
  const override = (process.env.TEST_TARGETS || '')
    .split(',')
    .map((target) => target.trim())
    .filter(Boolean);
  return override.length ? override : defaultTargets;
})();
const hasTargetOverride = Boolean((process.env.TEST_TARGETS || '').trim());


function loadFunction(target, signature) {
  const source = readFileSync(resolve(target), 'utf8');
  const start = source.indexOf(signature);
  assert.notEqual(start, -1, `${target} must define ${signature}`);

  const bodyStart = source.indexOf('{', start);
  let depth = 0;
  let end = -1;

  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) {
      end = index + 1;
      break;
    }
  }

  assert.notEqual(end, -1, `${target} must close ${signature}`);
  return vm.runInNewContext(`(${source.slice(start, end)})`);
}

for (const target of targets) {
  test(`${target} derives one place-reference row per itinerary entity`, () => {
    const placeReferenceRows = loadFunction(target, 'function placeReferenceRows(itinerary)');
    const itinerary = {
      day1: [
        { referenceId: 'airport', name: 'Airport arrival', type: 'flight', coords: [1.3644, 103.9915] },
        { referenceId: 'hotel', name: 'Harbour hotel', type: 'hotel', coords: [1.2903, 103.8519] }
      ],
      day2: [
        { referenceId: 'hotel', name: 'Harbour hotel checkout', type: 'hotel', coords: [1.2903, 103.8519] },
        { referenceId: 'museum', name: 'Museum', type: 'sight', coords: [1.2966, 103.7764] }
      ]
    };

    assert.deepEqual(
      JSON.parse(JSON.stringify(placeReferenceRows(itinerary))),
      [
        { name: 'Airport arrival', coords: '1.3644, 103.9915', type: 'flight' },
        { name: 'Harbour hotel', coords: '1.2903, 103.8519', type: 'hotel' },
        { name: 'Museum', coords: '1.2966, 103.7764', type: 'sight' }
      ]
    );
  });

  test(`${target} has compliant derived references and actions`, () => {
    const source = readFileSync(resolve(target), 'utf8');
    if (target.startsWith('templates/')) {
      assert.doesNotMatch(source, /Placeholder|即將填入景點排程|stations:\s*\[/);
    }
    assert.match(source, /const referenceRows = computed\(\(\) => placeReferenceRows\(itinerary\)\);/);
    assert.match(source, /overview\.actions/);
    assert.match(source, /displayedNotices/);
  });
}

for (const target of targets.filter(target => target.startsWith('templates/'))) {
  test(`${target} localizes place-reference type values`, () => {
    const placeTypeLabel = loadFunction(target, 'function placeTypeLabel(type)');
    const source = readFileSync(resolve(target), 'utf8');

    assert.match(source, /\{\{ placeTypeLabel\(item\.type\) \}\}/);

    // Default runs pin the committed zh-Hant templates exactly; TEST_TARGETS
    // runs validate generated files in any output language.
    if (!hasTargetOverride) {
      assert.equal(placeTypeLabel('flight'), '航班／機場');
      assert.equal(placeTypeLabel('hotel'), '住宿');
      assert.equal(placeTypeLabel('sight'), '景點');
      assert.equal(placeTypeLabel('unrecognized'), '其他行程地點');
      return;
    }

    const labels = ['flight', 'hotel', 'sight'].map((type) => {
      const label = placeTypeLabel(type);
      assert.equal(typeof label, 'string', `${target} must define a label for type ${type}`);
      assert.ok(label.trim().length > 0, `${target} label for type ${type} must not be empty`);
      return label;
    });
    assert.equal(new Set(labels).size, labels.length, `${target} place-type labels must be distinct`);
    assert.equal(typeof placeTypeLabel('unrecognized'), 'string', `${target} must define a fallback label`);
    assert.ok(placeTypeLabel('unrecognized').trim().length > 0, `${target} fallback label must not be empty`);
  });
}

test('Tokyo renders sight timeline entries with the sightseeing icon', () => {
  const source = readFileSync(resolve('templates/tokyo-8days.html'), 'utf8');

  assert.match(source, /<template v-else-if="spot\.type === 'sight'">🎡<\/template>/);
});
