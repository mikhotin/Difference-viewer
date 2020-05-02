import path from 'path';
import fs from 'fs';
import genDiff from '../src/index';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
const fileFormats = ['json', 'yaml', 'ini'];
let outputFormat;
let result;

describe('nested output', () => {
  outputFormat = 'nested';
  result = readFile('nestedOutput.txt');
  test.each(fileFormats)(
    '%s',
    (format) => expect(genDiff(getFixturePath(`before.${format}`), getFixturePath(`after.${format}`), outputFormat)).toEqual(result),
  );
});

describe('plain output', () => {
  outputFormat = 'plain';
  result = readFile('plainOutput.txt');
  test.each(fileFormats)(
    '%s',
    (format) => expect(genDiff(getFixturePath(`before.${format}`), getFixturePath(`after.${format}`), outputFormat)).toEqual(result),
  );
});

describe('json output', () => {
  outputFormat = 'json';
  result = readFile('jsonOutput.txt');
  test.each(fileFormats)(
    '%s',
    (format) => expect(genDiff(getFixturePath(`before.${format}`), getFixturePath(`after.${format}`), outputFormat)).toEqual(result),
  );
});
