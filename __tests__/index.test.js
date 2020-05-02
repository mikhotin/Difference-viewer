import path from 'path';
import fs from 'fs';
import genDiff from '../src/index';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
const fileFormats = ['json', 'yaml', 'ini'];

describe.each`
 output        | expected
 ${'nested'}   | ${readFile('nestedOutput.txt')}
 ${'plain'}    | ${readFile('plainOutput.txt')}
 ${'json'}     | ${readFile('jsonOutput.txt')}
`('$output output', ({ output, expected }) => {
  test.each(fileFormats)(
    '%s',
    (format) => expect(genDiff(getFixturePath(`before.${format}`), getFixturePath(`after.${format}`), output)).toEqual(expected),
  );
});
