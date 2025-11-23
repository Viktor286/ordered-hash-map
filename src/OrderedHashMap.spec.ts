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

  describe('Deletion and Access', () => {
    it('correctly gets element by index', () => {
      const m = new OrderedHashMap();
      m.appendElement('key1', 'value1');
      expect(m.getElementByIndex(0)).toBe('value1');
      expect(m.getElementByIndex(1)).toBeUndefined();
    });

    it('correctly deletes element by key and updates indices', () => {
      const m = new OrderedHashMap();
      m.appendElement('k1', 'v1'); // index 0
      m.appendElement('k2', 'v2'); // index 1
      m.appendElement('k3', 'v3'); // index 2

      // Delete first element (index 0 bug check)
      expect(m.deleteElementByKey('k1')).toBe(true);

      // Check structure
      expect(m.array.length).toBe(2);
      expect(m.hashKeyToIndexMap.size).toBe(2);

      // Check indices updated
      expect(m.getIndexByKey('k2')).toBe(0); // Was 1
      expect(m.getIndexByKey('k3')).toBe(1); // Was 2

      // Check values
      expect(m.getElementByKey('k2')).toBe('v2');
      expect(m.getElementByKey('k3')).toBe('v3');
    });

    it('correctly inserts element at index', () => {
      const m = new OrderedHashMap();
      m.appendElement('k1', 'v1'); // 0
      m.appendElement('k3', 'v3'); // 1

      m.insertElementAtIndex(1, 'v2', 'k2');

      expect(m.array[0]).toBe('v1');
      expect(m.array[1]).toBe('v2');
      expect(m.array[2]).toBe('v3');

      expect(m.getIndexByKey('k1')).toBe(0);
      expect(m.getIndexByKey('k2')).toBe(1);
      expect(m.getIndexByKey('k3')).toBe(2); // Shifted
    });

    it('getElementByKey works for index 0', () => {
      const m = new OrderedHashMap();
      m.appendElement('k1', 'v1');
      expect(m.getElementByKey('k1')).toBe('v1');
    });
  });
});
