import path from 'path';
import fs from 'fs-extra';
import * as uuid from 'uuid';
import { SerializationStrategy } from '../lib/SerializationStrategy';

export const DISK = SerializationStrategy.createStrategy(() => {
  const folderPath = path.resolve(process.cwd(), '.tmp', uuid.v4());
  fs.ensureDirSync(folderPath);

  process.on('exit', () => {
    fs.rmdirSync(folderPath, { recursive: true });
  });

  return {
    config: {
      folderPath,
    },
    serialize: (serialable, values) => {
      const filePath = path.resolve(folderPath, serialable.id + '.json');
      return fs.writeJSONSync(filePath, values);
    },
    deserialize: (serialable, _: any) => {
      const filePath = path.resolve(folderPath, serialable.id + '.json');
      return fs.readJSONSync(filePath);
    },
  };
});
