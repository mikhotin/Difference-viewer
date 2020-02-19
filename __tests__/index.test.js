import path from 'path';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const data = `{
  host: hexlet.io
+ timeout: 20
- timeout: 50
- proxy: 123.234.53.22
- follow: false
+ verbose: true
}`;

test('diff', () => {
  expect(genDiff(getFixturePath('before.json'), getFixturePath('after.json'))).toEqual(data);
  expect(genDiff(getFixturePath('after.json'), getFixturePath('before.json'))).not.toEqual(data);
});
