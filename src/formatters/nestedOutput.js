import _ from 'lodash';

const makeWhitespaces = (depth, spaceCount) => {
  if (spaceCount === undefined) {
    switch (depth) {
      case 1:
        return ' '.repeat(2);
      case 2:
        return ' '.repeat(6);
      case 3:
        return ' '.repeat(10);
      default:
        throw new Error(`Unknown depth: ${depth}!`);
    }
  }
  return ' '.repeat(depth * spaceCount);
};

const stringify = (val, depth) => {
  if (_.isObject(val)) {
    const whiteSpace = makeWhitespaces(depth, 4);
    const key = _.keys(val);
    return `{\n${whiteSpace}${key}: ${val[key]}\n${whiteSpace.slice(0, -4)}}`;
  }
  return val;
};

const makeNestedOutput = (ast, depth = 0) => {
  const iter = (element, currentDepth) => {
    const {
      type, key, value, beforeValue, children,
    } = element;
    const whiteSpace = (type === 'ast' || type === 'unchanged') ? makeWhitespaces(currentDepth, 4) : makeWhitespaces(currentDepth);
    switch (type) {
      case 'ast':
        return `${whiteSpace}${key}: ${makeNestedOutput(children, currentDepth)}`;
      case 'unchanged':
        return `${whiteSpace}${key}: ${(stringify(value, currentDepth + 1))}`;
      case 'changed':
        return [`${whiteSpace}+ ${key}: ${stringify(value, currentDepth + 1)}`,
          `${whiteSpace}- ${key}: ${stringify(beforeValue, currentDepth + 1)}`].join('\n');
      case 'added':
        return `${whiteSpace}+ ${key}: ${stringify(value, currentDepth + 1)}`;
      case 'deleted':
        return `${whiteSpace}- ${key}: ${stringify(value, currentDepth + 1)}`;
      default:
        throw new Error(`Unknown type: ${type}!`);
    }
  };
  const result = ast.map((item) => iter(item, depth + 1)).join('\n');
  return `{\n${result}\n${makeWhitespaces(depth, 4)}}`;
};

export default makeNestedOutput;
