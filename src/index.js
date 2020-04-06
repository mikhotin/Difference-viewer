import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import parse from './parsers';
import render from './render';

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
        acc.push({
          type: 'unchanged', subtype: 'node', key, children: createAst(obj1[key], obj2[key]),
        });
      } else if (hasEqualsValue(obj1, obj2, key)) {
        acc.push({
          type: 'unchanged', key, value: obj1[key],
        });
      } else {
        acc.push({
          type: 'changed-after', key, value: obj2[key],
        });
        acc.push({
          type: 'changed-before', key, value: obj1[key],
        });
      }
    } else {
      if ((_.has(obj1, key) && !_.has(obj2, key))) {
        acc.push({
          type: 'deleted', key, value: obj1[key],
        });
      }
      if ((!_.has(obj1, key) && _.has(obj2, key))) {
        acc.push({
          type: 'added', key, value: obj2[key],
        });
      }
    }
    return acc;
  }, []);

  return ast;
};

const genDiff = (filepath1, filepath2) => {
  const fullPath1 = getFullPath(filepath1);
  const data1 = readFile(fullPath1);
  const getExtension1 = path.extname(fullPath1).slice(1);

  const fullPath2 = getFullPath(filepath2);
  const data2 = readFile(fullPath2);
  const getExtension2 = path.extname(fullPath2).slice(1);

  const file1 = parse(data1, getExtension1);
  const file2 = parse(data2, getExtension2);
  const data = createAst(file1, file2);

  return render(data, 1);
};

export default genDiff;
