import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import test from 'node:test';

const targets = [
  'templates/hokkaido-7days.html',
  'templates/kyushu-8days.html',
  'templates/kansai-7days.html',
  'templates/okayama-travel.html',
  'templates/tokyo-8days.html',
  'SKILL-for-Web.md'
];

function loadMapScopeSpots(target) {
  const source = readFileSync(resolve(target), 'utf8');
  const signature = 'function mapScopeSpots(validSpots)';
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

function ids(spots) {
  return spots.map((spot) => spot.id);
}

for (const target of targets) {
  test(`${target} scopes a day map by flight connectivity, not latitude`, () => {
    const mapScopeSpots = loadMapScopeSpots(target);

    const arrivalDay = [
      { id: 'origin', type: 'flight', transit: { icon: 'plane' }, coords: [35.6762, 139.6503] },
      { id: 'arrival-airport', type: 'flight', transit: { icon: 'train' }, coords: [1.3644, 103.9915] },
      { id: 'hotel', type: 'hotel', transit: { icon: 'walk' }, coords: [1.2903, 103.8519] }
    ];
    assert.deepEqual(ids(mapScopeSpots(arrivalDay)), ['arrival-airport', 'hotel']);

    const departureDay = [
      { id: 'hotel', type: 'hotel', transit: null, coords: [1.2903, 103.8519] },
      { id: 'departure-airport', type: 'flight', transit: { icon: 'plane' }, coords: [1.3644, 103.9915] },
      { id: 'home', type: 'flight', transit: null, coords: [35.6762, 139.6503] }
    ];
    assert.deepEqual(ids(mapScopeSpots(departureDay)), ['hotel', 'departure-airport']);

    const flightOnlyDay = [
      { id: 'origin', type: 'flight', transit: { icon: 'plane' }, coords: [35.6762, 139.6503] },
      { id: 'destination', type: 'flight', transit: null, coords: [1.3644, 103.9915] }
    ];
    assert.strictEqual(mapScopeSpots(flightOnlyDay), flightOnlyDay);
  });
}
