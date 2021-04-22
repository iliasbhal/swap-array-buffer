import msgpack from 'msgpack-lite';
import { SerializationStrategy } from '../lib/SerializationStrategy';

export const MSGPACK = SerializationStrategy.createStrategy(() => {
  return {
    serialize: (_, values) => {
      return msgpack.encode(values);
    },
    deserialize: (_, tmpData: any) => {
      return msgpack.decode(tmpData);
    },
  };
});
