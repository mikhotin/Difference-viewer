import _ from 'lodash';

const makeStr = (obj, type, pathToKey) => {
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
  const str = {
    changed: `Property '${pathToKey}' was ${type} from ${formatValue(beforeValue)} to ${formatValue(value)}`,
    deleted: `Property '${pathToKey}' was ${type}`,
    added: `Property '${pathToKey}' was ${type} with value: ${formatValue(value)}`,
  };
  return str[type];
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
