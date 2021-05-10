import { Serializable } from './Serializable';

export class SerializableArray extends Serializable<unknown[]> {
  constructor() {
    super([]);
  }

  get(index: number) {
    return this.value![index];
  }

  set(index: number, value: any) {
    this.value![index] = value;
  }

  push(value: any) {
    this.value!.push(value);
  }

  get length() {
    return this.value!.length;
  }
}
