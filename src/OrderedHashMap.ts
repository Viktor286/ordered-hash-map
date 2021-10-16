/** OrderedHashMap
 * is data structure where both controllable order and linear lookup are important.
 * Regular array-like order works here while elements have hash ids for linear lookup.
 * Why not just "new Map()"?
 * 1. No prepend or insert at place, only append.
 * 2. Can't change the order of elements, e.g. swap #2 with #0
 * 3. No easy access by array index (Array.from(map.keys())[0])
 * 4. No easy sorting *
 *
 * Some other alternatives:
 * https://github.com/pluma/ordered-hashmap/blob/master/index.js
 * https://github.com/gaozhanyong/sorted-array-map/blob/master/index.js
 * https://github.com/montagejs/collections/blob/master/sorted-array-map.js

 Available methods:
 prependElement
 appendElement

 - Work with the key:
 getElementByKey
 getIndexByKey

 deleteElementByKey

 - Work with index
 getElementByIndex
 * insertElementAtIndex

 Roadmap methods:
 reduce
 filter
 map
 keys
 values
 items
 pop
 push
 shift
 unshift
 remove
 set
 insert
 keyAt
 count
 from
 toString
 removeAtIndex
 contains
 clear

 * */

// eslint-disable-next-line @typescript-eslint/ban-types
export type IOrderedHashMapElement = number | string | boolean | bigint | symbol | object;

export interface IHashKeyToIndexMap {
  hashKey: string,
  hashIndex: number
}

export class OrderedHashMap {
  array = new Array<IOrderedHashMapElement>();
  hashKeyToIndexMap = new Map<string, number>();

  generateHash() {
    return Math.random().toString(32).slice(2);
  }

  prependElement(hashKey: string | undefined, element: IOrderedHashMapElement): IHashKeyToIndexMap {
    if (!hashKey) hashKey = this.generateHash();

    // Rebuild indexes
    const newKeyToIndexMap = new Map<string, number>();
    newKeyToIndexMap.set(hashKey, 0);
    this.hashKeyToIndexMap.forEach((index, hash) => {
      newKeyToIndexMap.set(hash, index + 1);
    });
    this.hashKeyToIndexMap = newKeyToIndexMap;

    // Update array
    this.array = [element, ...this.array];
    return { hashKey, hashIndex: 0 };
  }

  appendElement(hashKey: string | undefined, element: IOrderedHashMapElement): IHashKeyToIndexMap {
    if (!hashKey) hashKey = this.generateHash();
    const nextIndex = this.hashKeyToIndexMap.size
    this.hashKeyToIndexMap.set(hashKey, nextIndex);
    this.array = [...this.array, element];
    return { hashKey, hashIndex: nextIndex };
  }

  // work ByKey
  getElementByKey(hashKey: string): IOrderedHashMapElement | undefined {
    const index = this.hashKeyToIndexMap.get(hashKey);
    return index ? this.array[index] : undefined;
  }

  getIndexByKey(hashKey: string): number | undefined {
    return this.hashKeyToIndexMap.get(hashKey);
  }

  deleteElementByKey(hashKey: string): boolean {
    const element = this.getElementByKey(hashKey);
    const elementIdx = this.getIndexByKey(hashKey);
    if (element && elementIdx) {
      this.array = [...this.array.slice(0, elementIdx), ...this.array.slice(elementIdx + 1)];
      this.hashKeyToIndexMap.delete(hashKey);
      return true;
    }
    return false;
  }

  // work ByIndex
}
