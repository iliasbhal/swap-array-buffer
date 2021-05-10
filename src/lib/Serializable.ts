import * as uuid from 'uuid';
import { SerializationStrategy } from './SerializationStrategy';
import { DISK } from '../strategies';
export class Serializable<T> {
  id = uuid.v4();
  strategy: SerializationStrategy<T>;
  tmp: unknown;
  value: T | undefined;

  constructor(initalValue: T, strategy: SerializationStrategy<T> = DISK) {
    this.strategy = strategy;
    this.value = initalValue;
  }

  isSerialized = false;
  serialize() {
    this.tmp = this.strategy.serialize(this, this.value);
    this.isSerialized = true;
    this.value = undefined;
  }

  deserialize() {
    if (!this.isSerialized) {
      return;
    }

    this.isSerialized = false;
    this.value = this.strategy.deserialize(this, this.tmp);
  }
}
