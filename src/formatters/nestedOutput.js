import _ from 'lodash';

const makeWhitespaces = (type, deep) => {
  if (type === 'unchanged') {
    return ' '.repeat(deep * 4);
  }

  const whiteSpacesCount = {
    1: 2,
    2: 6,
    3: 10,
  };

  return ' '.repeat(whiteSpacesCount[deep]);
};

const stringify = (val, deep) => {
  if (_.isObject(val)) {
    const whiteSpace = makeWhitespaces('unchanged', deep);
    const key = _.keys(val);
    return `{\n${whiteSpace}${key}: ${val[key]}\n${whiteSpace.slice(0, -4)}}`;
  }
  return val;
};

const makeNestedOutput = (ast) => {
  const iter = (element, deep = 1) => {
    const {
      type, key, value, beforeValue, children,
    } = element;
    const whiteSpace = makeWhitespaces(type, deep);
    if (_.has(element, 'children')) {
      const val = children.map((item) => iter(item, deep + 1)).join('\n');
      return `${whiteSpace}${key}: {\n${val}\n${whiteSpace}}`;
    }
    switch (type) {
      case 'unchanged':
        return `${whiteSpace}${key}: ${(stringify(value, deep + 1))}`;
      case 'changed':
        return [`${whiteSpace}+ ${key}: ${stringify(value, deep + 1)}`,
          `${whiteSpace}- ${key}: ${stringify(beforeValue, deep + 1)}`].join('\n');
      case 'added':
        return `${whiteSpace}+ ${key}: ${stringify(value, deep + 1)}`;
      case 'deleted':
        return `${whiteSpace}- ${key}: ${stringify(value, deep + 1)}`;
      default:
        throw new Error(`Unknown type: ${type}!`);
    }
  };
  const result = ast.map((item) => iter(item)).join('\n');
  return `{\n${result}\n}`;
};

export default makeNestedOutput;
