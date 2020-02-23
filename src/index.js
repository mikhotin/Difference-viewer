import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import parse from './parsers';

const getFullPath = (filename) => path.resolve(process.cwd(), filename);
const readFile = (filepath) => fs.readFileSync(getFullPath(filepath), 'utf-8');

const genDiff = (filepath1, filepath2) => {
  const fullPath1 = getFullPath(filepath1);
  const data1 = readFile(fullPath1);
  const getExtension1 = path.extname(fullPath1).slice(1);

  const fullPath2 = getFullPath(filepath2);
  const data2 = readFile(fullPath2);
  const getExtension2 = path.extname(fullPath2).slice(1);

  const file1 = parse(data1, getExtension1);
  const file2 = parse(data2, getExtension2);

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
