import { Serializable } from './Serializable';

type SerializationFunction<T> = (section: Serializable<T>, data: unknown) => T;

interface StrategyObject<T> {
  serialize: SerializationFunction<T>;
  deserialize: SerializationFunction<T>;
  config?: Record<string, unknown>;
}

export class SerializationStrategy<T> {
  serialize: SerializationFunction<T>;
  deserialize: SerializationFunction<T>;
  config: any = {};

  constructor(props: StrategyObject<T>) {
    this.serialize = props.serialize;
    this.deserialize = props.deserialize;
    this.config = props.config;
  }

  static createStrategy<T>(
    callback: () => StrategyObject<T>
  ): SerializationStrategy<T> {
    const strategyCallbacks = callback();

    const strategy = new SerializationStrategy(strategyCallbacks);
    return strategy;
  }
}
