import * as _ from 'lodash';
import { BufferManager } from '../src/lib/BufferManager';
import { Serializable } from '../src/lib/Serializable';
import { Strategies } from '../src';

describe('BufferManager', () => {
  it('should maintain buffer size', () => {
    const buffer = new BufferManager({ concurrency: 3 });
    const serializableArr: Serializable<any>[] = [];

    _.range(0, 25).forEach(i => {
      const serialable = new Serializable({}, Strategies.NONE);
      buffer.register(i, serialable);
      serializableArr.push(serialable);
    });

    _.range(0, 25).forEach(i => {
      buffer.load(i);

      const deserialised = serializableArr.filter(
        serialable => !serialable.isSerialized
      );
      expect(deserialised.length).toBeGreaterThan(0);
      expect(deserialised.length).toBeLessThanOrEqual(3);
    });
  });

  it('should return undefined when trying to load an id that doesnt exist', () => {
    const buffer = new BufferManager({ concurrency: 3 });
    const serializableArr: Serializable<any>[] = [];

    _.range(0, 25).forEach(i => {
      const serialable = new Serializable({}, Strategies.NONE);
      buffer.register(i, serialable);
      serializableArr.push(serialable);
    });

    const serialable = buffer.load(26);
    expect(serialable).toEqual(undefined);
  });
});
