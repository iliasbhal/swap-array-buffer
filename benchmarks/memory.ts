import SwapArrayBuffer from '../src';

const arr2 = new SwapArrayBuffer();
createBenchmark('array of 10 items (write)', () => {
  return () => {
    arr2.push(
      ["prop2","prop2","prop2","prop2","prop2","prop2","prop2","prop2","prop2","prop2"],
    );
  }
});

createBenchmark('array of 10 items (read)', () => {
  return (i: number) => {
    arr2.get(i);
  }
});

function createBenchmark(name: string, setup: any) {
  console.log(`\n\nBenchmark: ${name}`);

  const onEachLoop = setup();

  const LOOP = 20_000_000;
  const LOG_EACH = 1_000_000;
  let i = 0;
  while (i < LOOP) {
    onEachLoop(i);

    i++
    
    if (i % LOG_EACH === 0 ) {
      const memory = process.memoryUsage();
      console.log(`looped: ${i}, memory ${memory.heapUsed}`);
    }
  }

  const memory = process.memoryUsage();
  console.log(`--------\looped: ${i}, memory ${memory.heapUsed}`);
}