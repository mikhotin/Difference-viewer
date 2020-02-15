import _ from 'lodash';
import path from 'path';
import fs from 'fs';

const parse = (file) => JSON.parse(file);

const genDiff = (filepath1, filepath2) => {
  const fullPath1 = path.resolve(process.cwd(), filepath1);
  const data1 = fs.readFileSync(fullPath1, 'utf-8');

  const fullPath2 = path.resolve(process.cwd(), filepath2);
  const data2 = fs.readFileSync(fullPath2, 'utf-8');

  const file1 = parse(data1);
  const file2 = parse(data2);

  const keys1 = Object.keys(file1);
  const keys2 = Object.keys(file2);
  const uniqColl = _.uniq([...keys1, ...keys2]);
  const diff = uniqColl.reduce((acc, key) => {
    if ((keys1.includes(key) && keys2.includes(key)) && (file1[key] === file2[key])) {
      acc.push(`${key}: ${file1[key]}`);
    }

    if ((keys1.includes(key) && keys2.includes(key)) && (file1[key] !== file2[key])) {
      acc.push(`+ ${key}: ${file2[key]}`);
      acc.push(`- ${key}: ${file1[key]}`);
    }

    if ((keys1.includes(key) && !keys2.includes(key))) {
      acc.push(`- ${key}: ${file1[key]}`);
    }

    if ((!keys1.includes(key) && keys2.includes(key))) {
      acc.push(`+ ${key}: ${file2[key]}`);
    }

    return acc;
  }, []);

  return `{
  ${diff.join('\n')}
}`;
};

export default genDiff;
