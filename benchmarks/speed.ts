import { SwapArray, Strategies } from '../src';

const swapConfig = {
  concurrency: 3,
  swapSize: 400_000,
  swapStrategy: Strategies.DISK,
};

const arr2 = new SwapArray(swapConfig);
createBenchmark('array of 10 (write)', () => {
  return () => {
    arr2.push(
      ["prop2","prop2","prop2","prop2","prop2","prop2","prop2","prop2","prop2","prop2"],
    );
  }
});

createBenchmark('array of 10 (read)', () => {
  return (i: number) => {
    arr2.get(i);
  }
});

function createBenchmark(name: string, setup: any) {
  console.log(`\n\nBenchmark: ${name}`);

  const onEachLoop = setup();

  const LOOP = 5_000_000;
  const LOG_EACH = 1_000_000;
  let i = 0;
  let loopStart = Date.now();
  let totalStart = loopStart;

  while (i < LOOP) {
    onEachLoop(i);

    i++
    
    if (i % LOG_EACH === 0 ) {
      const checkpoint = Date.now();
      const timeS = Math.round((checkpoint - loopStart));
      const avgMS = (checkpoint - loopStart) / LOG_EACH
      console.log(`looped: ${i}, took ${timeS}ms (avg ${avgMS}ms)`);
      loopStart = checkpoint;
    }
  }

  const checkpoint = Date.now();
  const time = Math.round((checkpoint - totalStart));
  console.log(`--------\looped: ${i}, took ${time}ms (avg ${time / LOG_EACH}ms)`);
}


