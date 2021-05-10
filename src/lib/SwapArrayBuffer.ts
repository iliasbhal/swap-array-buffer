import { SerializableArray } from './SerializableArray';
import { BufferManager } from './BufferManager';

interface SwapArrayConfig {
  concurrency: number;
  swapSize: number;
}

const DEFAULT_CONFIG: SwapArrayConfig = {
  concurrency: 3,
  swapSize: 100_000,
};

export class SwapArrayBuffer {
  buffer: BufferManager<SerializableArray>;
  swapSize: number;

  constructor() {
    this.buffer = new BufferManager<SerializableArray>({
      concurrency: DEFAULT_CONFIG.concurrency,
    });

    this.swapSize = DEFAULT_CONFIG.swapSize;
  }

  getSectionIdx(elementIdx: number) {
    return Math.floor(elementIdx / this.swapSize);
  }

  getElementIdx(sectionIdx: number, elementIdx: number) {
    return elementIdx - sectionIdx * this.swapSize;
  }

  loadSection(id: number): SerializableArray {
    if (!this.buffer.has(id)) {
      this.createSection(id);
    }

    const section = this.buffer.load(id)!;
    return section;
  }

  loadLastSection() {
    const lastSectionIndex = this.buffer.size ? this.buffer.size - 1 : 0;
    const lastSection = this.loadSection(lastSectionIndex);
    return lastSection;
  }

  createSection(forcedSectionIdx?: number) {
    const sectionIdx = forcedSectionIdx || this.buffer.size;
    const section = new SerializableArray();
    this.buffer.register(sectionIdx, section);

    return section;
  }

  get(index: number) {
    const sectionIdx = this.getSectionIdx(index);
    const elementIdx = this.getElementIdx(sectionIdx, index);
    const sectionValues = this.loadSection(sectionIdx);

    return sectionValues.get(elementIdx);
  }

  set(index: number, value: any) {
    const sectionIdx = this.getSectionIdx(index);
    const elementIdx = this.getElementIdx(sectionIdx, index);
    const sectionValues = this.loadSection(sectionIdx);

    sectionValues.set(elementIdx, value);

    if (index >= this._length) {
      this._length += 1;
    }
  }

  push(el: any) {
    this._length += 1;

    const lastSection = this.loadLastSection();
    const isSectionFull = lastSection.length === this.swapSize;
    if (isSectionFull) {
      const nextId = this.buffer.size;
      this.createSection(nextId);
      const nextSection = this.loadSection(nextId);
      return nextSection.push(el);
    }

    return lastSection.push(el);
  }

  protected _length = 0;
  public get length() {
    return this._length;
  }
}
