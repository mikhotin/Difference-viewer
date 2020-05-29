import _ from 'lodash';

const formatValue = (val) => {
  if (_.isObject(val)) {
    return '[complex value]';
  }
  return _.isString(val) ? `'${val}'` : val;
};

const makePlainOutput = (ast, acc = []) => {
  const iter = (list) => {
    const {
      type, key, children, value, valueBefore, valueAfter,
    } = list;
    const pathToKey = [...acc, key].join('.');

    switch (type) {
      case 'ast':
        return makePlainOutput(children, [...acc, key]);
      case 'unchanged':
        return 'unchanged';
      case 'changed':
        return `Property '${pathToKey}' was changed from ${formatValue(valueBefore)} to ${formatValue(valueAfter)}`;
      case 'added':
        return `Property '${pathToKey}' was added with value: ${formatValue(value)}`;
      case 'deleted':
        return `Property '${pathToKey}' was deleted`;
      default:
        throw new Error(`Unknown type: ${type}!`);
    }
  };

  const result = ast.map((item) => iter(item));
  return result.filter((item) => item !== 'unchanged').join('\n');
};

export default makePlainOutput;
