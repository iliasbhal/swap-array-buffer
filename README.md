# :package: :sparkles: swap-array-buffer

Array-like data structure that utilizes memory swapping as a strategy to mitigate memory limitations in NodeJS processes.

## 📋  How to Install

```sh
npm i --save swap-array-buffer
#or
yarn add swap-array-buffer
```

## 📖 How to use

Here is an example: 

```tsx
import { SwapArrayBuffer } from 'swap-array-buffer';

const array = new SwapArrayBuffer();

for (let i = 0; i < Infinity; i++) {
  array.push(i);
}

```
