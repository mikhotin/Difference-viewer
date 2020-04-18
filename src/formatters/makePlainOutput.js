import _ from 'lodash';

const makeStr = (obj, type, path) => {
  const formatValue = (val) => {
    if (_.isObject(val)) {
      return '[complex value]';
    }
    if (_.isString(val)) {
      return `'${val}'`;
    }
    return val;
  };
  const { value, beforeValue } = obj;
  let str;
  switch (type) {
    case 'unchanged':
      break;
    case 'changed':
      str = `Property '${path}' was ${type} from ${formatValue(beforeValue)} to ${formatValue(value)}`;
      break;
    case 'deleted':
      str = `Property '${path}' was ${type}`;
      break;
    case 'added':
      str = `Property '${path}' was ${type} with value: ${formatValue(value)}`;
      break;
    default:
      throw new Error(`Unknown type: ${type}!`);
  }
  return str;
};

const makePlainOutput = (ast) => {
  const result = [];
  const makeOutput = (tree) => {
    const iter = (list, acc) => {
      const { type, key, children } = list;
      if (_.has(list, 'children')) {
        children.map((item) => iter(item, [...acc, key]));
      }
      if (type !== 'unchanged') {
        const pathToKey = [...acc, key].join('.');
        const str = makeStr(list, type, pathToKey);
        result.push(str);
      }
    };
    return iter(tree, []);
  };

  ast.map((item) => makeOutput(item));

  return result.join('\n');
};

export default makePlainOutput;
