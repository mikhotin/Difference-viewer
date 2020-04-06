import path from 'path';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const data = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      + setting3: {
            key: value
        }
      - setting3: true
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            key: value
          + ops: vops
        }
    }
    group1: {
      + baz: bars
      - baz: bas
        foo: bar
      + nest: str
      - nest: {
            key: value
        }
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}`;

test('diff json', () => {
  expect(genDiff(getFixturePath('before.json'), getFixturePath('after.json'))).toEqual(data);
});

test('diff yaml', () => {
  expect(genDiff(getFixturePath('before.yaml'), getFixturePath('after.yaml'))).toEqual(data);
});

test('diff ini', () => {
  expect(genDiff(getFixturePath('before.ini'), getFixturePath('after.ini'))).toEqual(data);
});
