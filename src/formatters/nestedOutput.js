import _ from 'lodash';

const makeWhitespaces = (depth, spaceCount) => {
  if (spaceCount === undefined) {
    return ' '.repeat(depth);
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

const whiteSpacesCount = {
  1: 2,
  2: 6,
  3: 10,
};

const makeNestedOutput = (ast, depth = 0) => {
  const iter = (element, currentDepth) => {
    const {
      type, key, value, beforeValue, children,
    } = element;
    const whiteSpace = (type === 'ast' || type === 'unchanged') ? makeWhitespaces(currentDepth, 4) : makeWhitespaces(whiteSpacesCount[currentDepth]);
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
