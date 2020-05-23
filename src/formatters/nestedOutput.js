import _ from 'lodash';

const makeIndent = (depth, indentType) => {
  switch (indentType) {
    case 2:
      return `${'    '.repeat(depth - 1)}${' '.repeat(indentType)}`;
    case 4:
      return ' '.repeat(depth * indentType);
    default:
      throw new Error(`Unknown indentType: ${indentType}!`);
  }
};

const stringify = (val, depth) => {
  if (!_.isObject(val)) {
    return val;
  }
  const key = _.keys(val);
  return `{\n${makeIndent(depth + 1, 4)}${key}: ${val[key]}\n${makeIndent(depth, 4)}}`;
};

const makeNestedOutput = (ast, depth = 0) => {
  const iter = (element, currentDepth) => {
    const {
      type, key, value, valueBefore, valueAfter, children,
    } = element;

    switch (type) {
      case 'ast':
        return `${makeIndent(currentDepth, 4)}${key}: ${makeNestedOutput(children, currentDepth)}`;
      case 'unchanged':
        return `${makeIndent(currentDepth, 4)}${key}: ${(stringify(value, currentDepth))}`;
      case 'changed':
        return [`${makeIndent(currentDepth, 2)}+ ${key}: ${stringify(valueAfter, currentDepth)}`,
          `${makeIndent(currentDepth, 2)}- ${key}: ${stringify(valueBefore, currentDepth)}`].join('\n');
      case 'added':
        return `${makeIndent(currentDepth, 2)}+ ${key}: ${stringify(value, currentDepth)}`;
      case 'deleted':
        return `${makeIndent(currentDepth, 2)}- ${key}: ${stringify(value, currentDepth)}`;
      default:
        throw new Error(`Unknown type: ${type}!`);
    }
  };
  const result = ast.map((item) => iter(item, depth + 1)).join('\n');
  return `{\n${result}\n${makeIndent(depth, 4)}}`;
};

export default makeNestedOutput;
