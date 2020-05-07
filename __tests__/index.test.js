import path from 'path';
import fs from 'fs';
import genDiff from '../src/index';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
const fileFormats = ['json', 'yaml', 'ini'];
let nestedOutput;
let plainOutput;
let jsonOutput;

beforeEach(() => {
  nestedOutput = readFile('nestedOutput.txt');
  plainOutput = readFile('plainOutput.txt');
  jsonOutput = readFile('jsonOutput.txt');
});

describe('Nested Output', () => {
  test.each(fileFormats)(
    '%s',
    (format) => {
      const filepath1 = getFixturePath(`before.${format}`);
      const filepath2 = getFixturePath(`after.${format}`);
      expect(genDiff(filepath1, filepath2, 'nested')).toEqual(nestedOutput);
    },
  );
});

describe('Plain Output', () => {
  test.each(fileFormats)(
    '%s',
    (format) => {
      const filepath1 = getFixturePath(`before.${format}`);
      const filepath2 = getFixturePath(`after.${format}`);
      expect(genDiff(filepath1, filepath2, 'plain')).toEqual(plainOutput);
    },
  );
});

describe('Json Output', () => {
  test.each(fileFormats)(
    '%s',
    (format) => {
      const filepath1 = getFixturePath(`before.${format}`);
      const filepath2 = getFixturePath(`after.${format}`);
      expect(genDiff(filepath1, filepath2, 'json')).toEqual(jsonOutput);
    },
  );
});
