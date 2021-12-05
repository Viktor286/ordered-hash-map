import { OrderedHashMap, IOrderedHashMapElement } from './OrderedHashMap';

const arrayElementObjectsSamples = [
  { name: 'Alpha' },
  { name: 'Beta' },
  { name: 'Gamma' },
  { name: 'Delta' },
  { name: 'Epsilon' },
  { name: 'Zeta' },
  { name: 'Eta' },
];

const arrayElementPrimitivesSamples = [
  true,
  false,
  -1,
  0,
  1,
  2,
  '-1',
  '0',
  '1',
  '2',
  'one',
  'two',
  'three',
  Infinity,
  -Infinity,
  undefined,
  null,
  10n,
  Symbol('id1'),
  Symbol('id2'),
  console,
];

const arrayElementSamples = [...arrayElementObjectsSamples, ...arrayElementPrimitivesSamples];

function validateEntryByKey(m: OrderedHashMap, hashKey: string) {
  // hashKey -> hashIndex
  const hashIndex = m.hashKeyToIndexMap.get(hashKey);
  // hashIndex -> arrayElement
  const arrayElement = m.array[hashIndex];
  // arrayElement -> arrayIndex (via search through array)
  const arrayIndex = m.array.findIndex(e => e === arrayElement);
  // validate that hashIndex points to the same arrayIndex for one arrayElement
  return arrayIndex === hashIndex;
}

function validateEntryByIndex(m: OrderedHashMap, arrayIndex: number) {
  // arrayIndex -> arrayElement
  const arrayElement = m.array[arrayIndex];
  // arrayElement -> hashKey
  // search arrayElement's match in hashKey-to-arrayIndex map
  let hashKey = undefined;
  m.hashKeyToIndexMap.forEach((v, k) => {
    if (arrayElement === m.array[v]) hashKey = k;
  });
  // validate that arrayElement hashKey exist for particular arrayElement
  return !!hashKey;
}

function validateEntryByObject(m: OrderedHashMap, arrayElement: IOrderedHashMapElement) {
  // arrayElement -> arrayIndex
  const arrayIndex = m.array.findIndex(e => e === arrayElement);
  // arrayIndex -> hashKey
  let hashKey = undefined;
  m.hashKeyToIndexMap.forEach((v, k) => {
    if (v === arrayIndex) hashKey = k;
  });
  // validate that hashKey exist for particular arrayIndex
  return !!hashKey;
}

function validateStoreSize(m: OrderedHashMap) {
  return m.array.length === m.hashKeyToIndexMap.size;
}

function validateEntry(m: OrderedHashMap, hashKey: string, arrayIndex: number, arrayElement: IOrderedHashMapElement) {
  return validateStoreSize(m) &&
    validateEntryByKey(m, hashKey) &&
    validateEntryByIndex(m, arrayIndex) &&
    validateEntryByObject(m, arrayElement);
}

describe('OrderedHashMap', () => {
  describe('Elements addition with key or with random key when undefined', () => {
    // Todo: Functional(behavioural) testing
    describe('Structural testing', () => {
      it('appends element to data structure', () => {
        const m = new OrderedHashMap();
        for (let i = 0; i < arrayElementSamples.length; i++) {
          const arrayElement = arrayElementSamples[i];
          const { hashKey, hashIndex } = m.appendElement(i % 2 === 0 ? undefined : `id${i}`, arrayElement);

          expect(m.array[hashIndex] === arrayElement).toBe(true);
          expect(m.hashKeyToIndexMap.get(hashKey) === hashIndex).toBe(true);
          expect(validateEntry(m, hashKey, hashIndex, arrayElement)).toBe(true);
        }
      });

      it('prepends element to data structure', () => {
        const m = new OrderedHashMap();
        for (let i = 0; i < arrayElementSamples.length; i++) {
          const arrayElement = arrayElementSamples[i];
          const { hashKey, hashIndex } = m.prependElement(i % 2 === 0 ? undefined : `id${i}`, arrayElement);

          expect(m.array[hashIndex] === arrayElement).toBe(true);
          expect(m.hashKeyToIndexMap.get(hashKey) === hashIndex).toBe(true);
          expect(validateEntry(m, hashKey, hashIndex, arrayElement)).toBe(true);
        }
      });

      it('prepend and append prepend elements to data structure', () => {
        const m = new OrderedHashMap();
        for (let i = 0; i < arrayElementSamples.length; i++) {
          const arrayElement = arrayElementSamples[i];

          const methodName = i % 2 === 0 ? 'prependElement' : 'appendElement';
          const { hashKey, hashIndex } = m[methodName](i % 2 === 0 ? undefined : `id${i}`, arrayElement);

          expect(m.array[hashIndex] === arrayElement).toBe(true);
          expect(m.hashKeyToIndexMap.get(hashKey) === hashIndex).toBe(true);
          expect(validateEntry(m, hashKey, hashIndex, arrayElement)).toBe(true);
        }
      });
    });
  });
});
