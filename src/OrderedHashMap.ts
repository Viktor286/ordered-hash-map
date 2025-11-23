/** OrderedHashMap
 * is data structure where both controllable order and linear lookup are important.
 * Regular array-like order works here while elements have hash ids for linear lookup.
 * Why not just "new Map()"?
 * 1. No prepend or insert at particular place, only append.
 * 2. Can't change the order of elements, e.g. swap #2 with #0
 * 3. No direct access by array index (although, it possible Array.from(map.keys())[0])
 * 4. No easy sorting *
 *
 * Where OrderedHashMap might be needed?
 * It could be used as main data structure for the inner state of application.
 * That kind of model can be useful in multi-client synchronization where
 * both atomic and entire state updates required.
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
 * insertElementAtIndex ( alt "pushApart" )

 Roadmap methods:
 forEach
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
 length
 toString
 removeAtIndex
 swap
 move
 contains
 clear
 export
 import
 compare?
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

  generateHash(): string {
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
    return index !== undefined ? this.array[index] : undefined;
  }

  getIndexByKey(hashKey: string): number | undefined {
    return this.hashKeyToIndexMap.get(hashKey);
  }

  deleteElementByKey(hashKey: string): boolean {
    const elementIdx = this.getIndexByKey(hashKey);
    if (elementIdx !== undefined) {
      this.array.splice(elementIdx, 1);
      this.hashKeyToIndexMap.delete(hashKey);

      this.hashKeyToIndexMap.forEach((idx, key) => {
        if (idx > elementIdx) {
          this.hashKeyToIndexMap.set(key, idx - 1);
        }
      });

      return true;
    }
    return false;
  }

  // work ByIndex
  getElementByIndex(index: number): IOrderedHashMapElement | undefined {
    return this.array[index];
  }

  insertElementAtIndex(index: number, element: IOrderedHashMapElement, hashKey?: string): IHashKeyToIndexMap {
    if (index < 0 || index > this.array.length) {
      throw new Error('Index out of bounds');
    }
    if (!hashKey) hashKey = this.generateHash();

    // Shift indexes
    this.hashKeyToIndexMap.forEach((idx, key) => {
      if (idx >= index) {
        this.hashKeyToIndexMap.set(key, idx + 1);
      }
    });

    this.hashKeyToIndexMap.set(hashKey, index);
    this.array.splice(index, 0, element);

    return { hashKey, hashIndex: index };
  }
}
