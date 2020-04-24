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
  const strTypes = {
    changed: `Property '${pathToKey}' was ${type} from ${formatValue(beforeValue)} to ${formatValue(value)}`,
    deleted: `Property '${pathToKey}' was ${type}`,
    added: `Property '${pathToKey}' was ${type} with value: ${formatValue(value)}`,
  };
  return strTypes[type];
};

const makePlainOutput = (ast) => {
  const iter = (list, acc) => {
    const { type, key, children } = list;
    if (_.has(list, 'children')) {
      return children.map((item) => iter(item, [...acc, key]));
    }
    const pathToKey = [...acc, key].join('.');
    return makeStr(list, type, pathToKey);
  };

  const result = _.flattenDeep(ast.map((item) => iter(item, [])));
  const filteredList = result.filter((item) => item);

  return filteredList.join('\n');
};

export default makePlainOutput;
