# :package: :sparkles: swap-array-buffer

Array-like data structure that utilizes memory swapping as a strategy to mitigate memory limitations in NodeJS processes.

## 📋  How to Install

```sh
npm i --save swap-array-buffer
#or
yarn add swap-array-buffer
```

## 📖 How to use

API available:
- [x] `.push`
- [x] `.get`
- [ ] .shift/unshift/pop (coming soon)
- [ ] `[Symbol.iterator]` (coming soon)

```tsx
import { SwapArrayBuffer } from 'swap-array-buffer';

const array = new SwapArrayBuffer();

for (let i = 0; i < 100_000_000; i++) {
  array.push({
    value: i
  });
}

const valueAt0 = array.get(0);
const valueAt5million = array.get(5_000_00);
const valueAt99million = array.get(99_000_00);
```

## ⚠️ How it works and limitations
From time to time, pieces of memory are swapped on disk. This is what makes the array able to grow so big. Usually memory swapping is controlled by the OS and we can't control it. In order to bypass this limitation, we are manually swapping portions of the array to the file system.

But it has some limitations, so if your workload can support the follwing limitations, then you're good to go :tada: :

- Elements added to the array should be JSON serializable.
- Don't hold strong references to the objects in the array, while mutation the array. From time to time, pieces of memory are swapped on disk and if you hold a reference to that object while adding elements in the array, a representation of your object could be serialised on disk. If at that moment you mutate your object other parts of your software may get an "out of sync" object back when the object is deserialised back into memory.
- The process will be slower because of the serialisation and io. (I'm currently working on some workaround to mitigate that issue).

## 📄 License

The MIT License (MIT)

Copyright 2020 Ilias Bhallil <ilias.bhal@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.