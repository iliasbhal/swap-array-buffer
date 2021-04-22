import { SerializationStrategy } from '../lib/SerializationStrategy';

export const NONE = SerializationStrategy.createStrategy(() => {
  return {
    serialize: (_, values) => {
      return values;
    },
    deserialize: (_, tmpData: any) => {
      return tmpData;
    },
  };
});
