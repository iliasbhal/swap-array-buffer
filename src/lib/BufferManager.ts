import { Serializable } from './Serializable';

export class BufferManager<T extends Serializable<any>> {
  private serializableById = new Map<any, T>();
  private buffer: T[] = [];
  private concurrency: number;

  constructor(props: { concurrency: number }) {
    this.concurrency = props.concurrency;
  }

  get size() {
    return this.serializableById.size;
  }

  isLoaded(section: T): boolean {
    return this.buffer.includes(section);
  }

  register(id: any, section: T) {
    this.serializableById.set(id, section);
    if (!section.isSerialized) {
      section.serialize();
    }
  }

  has(id: any) {
    return this.serializableById.has(id);
  }

  load(id: any) {
    const serializable = this.serializableById.get(id);
    if (!serializable) {
      return;
    }

    serializable.deserialize();

    if (!this.isLoaded(serializable)) {
      this.buffer.push(serializable);
      if (this.buffer.length > this.concurrency) {
        this.buffer.shift()!.serialize();
      }
    }

    return serializable;
  }
}
