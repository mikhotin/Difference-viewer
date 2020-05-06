import _ from 'lodash';

const makeWhitespaces = (type, depth) => {
  if (type === 'unchanged') {
    return ' '.repeat(depth * 4);
  }

  const whiteSpacesCount = {
    1: 2,
    2: 6,
    3: 10,
  };

  return ' '.repeat(whiteSpacesCount[depth]);
};

const stringify = (val, depth) => {
  if (_.isObject(val)) {
    const whiteSpace = makeWhitespaces('unchanged', depth);
    const key = _.keys(val);
    return `{\n${whiteSpace}${key}: ${val[key]}\n${whiteSpace.slice(0, -4)}}`;
  }
  return val;
};

const makeNestedOutput = (ast) => {
  const iter = (element, depth = 1) => {
    const {
      type, key, value, beforeValue, children,
    } = element;
    const whiteSpace = makeWhitespaces(type, depth);
    if (_.has(element, 'children')) {
      const val = children.map((item) => iter(item, depth + 1)).join('\n');
      return `${whiteSpace}${key}: {\n${val}\n${whiteSpace}}`;
    }
    switch (type) {
      case 'unchanged':
        return `${whiteSpace}${key}: ${(stringify(value, depth + 1))}`;
      case 'changed':
        return [`${whiteSpace}+ ${key}: ${stringify(value, depth + 1)}`,
          `${whiteSpace}- ${key}: ${stringify(beforeValue, depth + 1)}`].join('\n');
      case 'added':
        return `${whiteSpace}+ ${key}: ${stringify(value, depth + 1)}`;
      case 'deleted':
        return `${whiteSpace}- ${key}: ${stringify(value, depth + 1)}`;
      default:
        throw new Error(`Unknown type: ${type}!`);
    }
  };
  const result = ast.map((item) => iter(item)).join('\n');
  return `{\n${result}\n}`;
};

export default makeNestedOutput;
