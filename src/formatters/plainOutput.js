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
  const iter = (list, acc2) => {
    const { type, key, children } = list;
    if (type === 'ast') {
      return makePlainOutput(children, [...acc2, key]);
    }
    const pathToKey = [...acc2, key].join('.');
    return makeStr(list, type, pathToKey);
  };

  const result = _.flattenDeep(ast.map((item) => iter(item, acc)));
  return result.filter((item) => item).join('\n');
};

export default makePlainOutput;
