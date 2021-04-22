import type {Config} from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    watchPathIgnorePatterns: [
      "<rootDir>/.tmp/"
    ]
  };
};