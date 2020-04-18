import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import parse from './parsers/parsers';
import format from './formatters';

const getFullPath = (filename) => path.resolve(process.cwd(), filename);
const readFile = (filepath) => fs.readFileSync(getFullPath(filepath), 'utf-8');
const hasKeyBoth = (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key);
const hasEqualsValue = (obj1, obj2, key) => obj1[key] === obj2[key];
const isValueObject = (obj1, obj2, key) => _.isObject(obj1[key]) && _.isObject(obj2[key]);
const createAst = (obj1, obj2) => {
  const uniqKeys = _.uniq([..._.keys(obj1), ..._.keys(obj2)]).sort();
  const ast = uniqKeys.reduce((acc, key) => {
    if (hasKeyBoth(obj1, obj2, key)) {
      if (isValueObject(obj1, obj2, key)) {
        acc.push({ type: 'unchanged', key, children: createAst(obj1[key], obj2[key]) });
      } else if (hasEqualsValue(obj1, obj2, key)) {
        acc.push({ type: 'unchanged', key, value: obj1[key] });
      } else {
        acc.push({
          type: 'changed', key, value: obj2[key], beforeValue: obj1[key],
        });
      }
    } else {
      if ((_.has(obj1, key) && !_.has(obj2, key))) {
        acc.push({ type: 'deleted', key, value: obj1[key] });
      }
      if ((!_.has(obj1, key) && _.has(obj2, key))) {
        acc.push({ type: 'added', key, value: obj2[key] });
      }
    }
    return acc;
  }, []);

  return ast;
};

const genDiff = (filepath1, filepath2, outType = 'nested') => {
  const firstFiile = readFile(getFullPath(filepath1));
  const secondFile = readFile(getFullPath(filepath2));
  const extensionFirstFile = path.extname(getFullPath(filepath1)).slice(1);
  const extensionSecondFile = path.extname(getFullPath(filepath2)).slice(1);

  const data1 = parse(firstFiile, extensionFirstFile);
  const data2 = parse(secondFile, extensionSecondFile);
  const data = createAst(data1, data2);

  return format(data, outType);
};

export default genDiff;
