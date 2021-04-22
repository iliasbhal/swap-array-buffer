import * as _ from 'lodash';
import { SwapArray, Strategies } from '../src';

const swapConfig = {
  concurrency: 3,
  swapSize: 200_000,
  swapStrategy: Strategies.DISK,
};

const arr = new SwapArray(swapConfig);

const LOOPS = 1_000_000;
const benchmark = createBenchmarkLoop(LOOPS);

benchmark(`${LOOPS}x .get (undefined)`, runIndex => {
  arr.get(runIndex);
});

benchmark(`${LOOPS}x .push`, () => {
  arr.push('test');
});

benchmark(`${LOOPS}x .set (adding)`, runIndex => {
  arr.set(LOOPS + runIndex, 'test');
});

benchmark(`${LOOPS}x .set (updating)`, runIndex => {
  arr.set(runIndex, 'updated');
});

benchmark(`${LOOPS}x .get (defined)`, runIndex => {
  arr.get(runIndex);
});

function createBenchmarkLoop(loops: number) {
  return (
    name: string,
    callback: (index: number) => void
  ) => {
    const now = performance.now();

    for (const index of _.range(0, loops)) {
      callback(index);
    }

    const then = performance.now();
    const timespentMS = Math.floor(then - now);
    console.log(`benchmark (${name}) took: ${timespentMS}`);
  };
}
