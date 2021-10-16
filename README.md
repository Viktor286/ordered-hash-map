# OrderedHashMap

is data structure where both controllable order and linear lookup are important.
Regular array-like order works here while elements have hash ids for linear lookup.
Why not just "new Map()"?

1. No prepend or insert at place, only append.
2. Can't change the order of elements, e.g. swap #2 with #0
3. No easy access by array index (Array.from(map.keys())[0])
4. No easy sorting *

Some other alternatives:
https://github.com/pluma/ordered-hashmap/blob/master/index.js
https://github.com/gaozhanyong/sorted-array-map/blob/master/index.js
https://github.com/montagejs/collections/blob/master/sorted-array-map.js

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
