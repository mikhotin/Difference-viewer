import path from 'path';
import fs from 'fs';
import genDiff from '../src/index';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
const fileFormats = ['json', 'yaml', 'ini'];
const outputTypes = ['nested', 'plain', 'json'];

describe.each(outputTypes)('%s output', (typeOutput) => {
  test.each(fileFormats)(
    '%s format',
    (format) => {
      const filepath1 = getFixturePath(`before.${format}`);
      const filepath2 = getFixturePath(`after.${format}`);
      const expected = readFile(`${typeOutput}Output.txt`);
      expect(genDiff(filepath1, filepath2, `${typeOutput}`)).toEqual(expected);
    },
  );
});
