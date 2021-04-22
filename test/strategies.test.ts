import fs from 'fs-extra';
import * as _ from 'lodash';
import { Serializable } from '../src/lib/Serializable';
import { Strategies } from '../src';

describe('Serialisation Strategies', () => {
  describe('Strategy: None', () => {
    it('should serialize/deserialize', () => {
      const testData = { testProp: true };

      const serializable = new Serializable(
        _.cloneDeep(testData),
        Strategies.NONE
      );
      serializable.serialize();
      serializable.deserialize();

      expect(serializable.value).toMatchObject(testData);
    });
  });

  describe('Strategy: MSGPACK', () => {
    it('should serialize/deserialize', () => {
      const testData = { testProp: true };

      const serializable = new Serializable(
        _.cloneDeep(testData),
        Strategies.MSGPACK
      );
      serializable.serialize();
      serializable.deserialize();

      expect(serializable.value).toMatchObject(testData);
    });
  });

  describe('Strategy: DISK', () => {
    it('should serialize/deserialize', () => {
      const testData = { testProp: true };
      const serializable = new Serializable(
        _.cloneDeep(testData),
        Strategies.DISK
      );

      serializable.serialize();
      expect(serializable.value).toEqual(undefined);

      serializable.deserialize();

      expect(serializable.value).toMatchObject(testData);
    });

    it('should create and add files to the tmp folder', () => {
      const testData = { testProp: true };
      const serializable = new Serializable(
        _.cloneDeep(testData),
        Strategies.DISK
      );

      const { folderPath } = serializable.strategy.config;
      expect(fs.pathExistsSync(folderPath)).toEqual(true);
      expect(fs.statSync(folderPath).isDirectory()).toEqual(true);

      serializable.serialize();
      expect(serializable.value).toEqual(undefined);

      const hasOnlyJSONFiles = fs
        .readdirSync(folderPath)
        .every((fileName: string) => {
          return (
            fileName.endsWith('.json') &&
            fs.statSync(`${folderPath}/${fileName}`).isFile()
          );
        });
      expect(hasOnlyJSONFiles).toEqual(true);
    });

    it('should delete the tmp folder when the process exits', async () => {
      const testData = { testProp: true };
      jest.resetModules();

      let onExitCallback: any = undefined;
      const processOn = jest
        .spyOn(process, 'on')
        .mockImplementation((_: any, callback: any): any => {
          onExitCallback = callback;
        });

      const { DISK } = await import('../src/strategies');
      expect(processOn).toHaveBeenCalledTimes(1);
      expect(processOn).toHaveBeenCalledWith('exit', onExitCallback);

      const serializable = new Serializable(_.cloneDeep(testData), DISK);
      serializable.serialize();

      onExitCallback();
      expect(fs.existsSync(serializable.strategy.config.folderPath)).toEqual(
        false
      );
    });
  });
});
