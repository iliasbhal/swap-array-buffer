import * as _ from 'lodash';
import { SwapArray } from '../src';
import { SerializableArray } from '../src/lib/SerializableArray';

describe('SwapArray', () => {
  it('should be an Array', () => {
    const arr = new SwapArray();
    expect(arr).toBeTruthy();
  });

  it('should have .push', () => {
    const arr = new SwapArray();

    for (const id of _.range(0, 101_000)) {
      arr.push(`test-${id}`);
    }

    for (const id of _.range(0, 101_000)) {
      expect(arr.get(id)).toEqual(`test-${id}`);
    }
  });

  it('should have .length should be uptodate when', () => {
    const arr = new SwapArray();
    let lengthIsSynced = true;

    for (const expectedLength of _.range(0, 101_000)) {
      if (arr.length !== expectedLength) {
        lengthIsSynced = false;
      }

      arr.set(expectedLength, 'test');
    }

    expect(lengthIsSynced).toEqual(true);
  });

  it('should have .length in sync when using .push', () => {
    const arr = new SwapArray();
    let lengthIsSynced = true;

    for (const expectedLength of _.range(0, 101_000)) {
      if (arr.length !== expectedLength) {
        lengthIsSynced = false;
      }
      arr.push('test');
    }

    expect(lengthIsSynced).toEqual(true);
  });

  describe('Internal', () => {
    it('getSectionIndexOfIndex should return correct index of section', () => {
      const arr = new SwapArray();

      {
        const sectionIdx = arr.getSectionIdx(0);
        expect(sectionIdx).toEqual(0);
      }

      {
        const sectionIdx = arr.getSectionIdx(99_000);
        expect(sectionIdx).toEqual(0);
      }

      {
        const sectionIdx = arr.getSectionIdx(100_000);
        expect(sectionIdx).toEqual(1);
      }

      {
        const sectionIdx = arr.getSectionIdx(500_000);
        expect(sectionIdx).toEqual(5);
      }
    });

    it('getElementIdx should return correct index', () => {
      const arr = new SwapArray();
      {
        const sectionIdx = arr.getSectionIdx(50);
        const indexInSection = arr.getElementIdx(sectionIdx, 50);
        expect(indexInSection).toEqual(50);
      }

      {
        const sectionIdx = arr.getSectionIdx(100);
        const indexInSection = arr.getElementIdx(sectionIdx, 100);
        expect(indexInSection).toEqual(100);
      }

      {
        const sectionIdx = arr.getSectionIdx(100_000);
        const indexInSection = arr.getElementIdx(sectionIdx, 100_000);
        expect(indexInSection).toEqual(0);
      }

      {
        const sectionIdx = arr.getSectionIdx(500_000);
        const indexInSection = arr.getElementIdx(sectionIdx, 500_000);
        expect(indexInSection).toEqual(0);
      }
    });

    it('.loadSection should maintain the number of deserialized sections', () => {
      const arr = new SwapArray();

      const loadedSections: SerializableArray[] = [];
      _.range(0, 1000).forEach((_, i) => {
        const section = arr.loadSection(i);
        loadedSections.push(section);

        // @ts-ignore
        const hash = arr.buffer.buffer.map(section => section.id).join(',');
        const expectedHash = loadedSections
          .slice(-3)
          .map(section => section.id)
          .join(',');
        expect(hash).toEqual(expectedHash);

        // @ts-ignore
        expect(arr.buffer.buffer.length).toBeGreaterThan(0);
        // @ts-ignore
        expect(arr.buffer.buffer.length).toBeLessThanOrEqual(3);
      });
    });
  });
});
