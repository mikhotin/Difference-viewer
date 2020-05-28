import _ from 'lodash';

const makeStr = (obj, type, pathToKey) => {
  const formatValue = (val) => {
    if (_.isObject(val)) {
      return '[complex value]';
    }
    return _.isString(val) ? `'${val}'` : val;
  };
  const { value, valueBefore, valueAfter } = obj;
  const strTypes = {
    changed: `Property '${pathToKey}' was changed from ${formatValue(valueBefore)} to ${formatValue(valueAfter)}`,
    deleted: `Property '${pathToKey}' was deleted`,
    added: `Property '${pathToKey}' was added with value: ${formatValue(value)}`,
  };
  return strTypes[type];
};

const makePlainOutput = (ast, acc = []) => {
  const iter = (list) => {
    const { type, key, children } = list;
    const pathToKey = [...acc, key].join('.');
    switch (type) {
      case 'ast':
        return makePlainOutput(children, [...acc, key]);
      case 'changed':
      case 'deleted':
      case 'added':
        return makeStr(list, type, pathToKey);
      case 'unchanged':
        return 'unchanged';
      default:
        throw new Error(`Unknown type: ${type}!`);
    }
  };

  const result = _.flattenDeep(ast.map((item) => iter(item)));
  return result.filter((item) => item !== 'unchanged').join('\n');
};

export default makePlainOutput;
