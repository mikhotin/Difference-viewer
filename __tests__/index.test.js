import path from 'path';
import genDiff from '../src/index';
import data from '../__fixtures__/data';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('diff json', () => {
  expect(genDiff(getFixturePath('before.json'), getFixturePath('after.json'))).toEqual(data);
});

test('diff yaml', () => {
  expect(genDiff(getFixturePath('before.yaml'), getFixturePath('after.yaml'))).toEqual(data);
});

test('diff ini', () => {
  expect(genDiff(getFixturePath('before.ini'), getFixturePath('after.ini'))).toEqual(data);
});
