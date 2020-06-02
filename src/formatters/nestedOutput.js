import _ from 'lodash';

const makeIndent = (depth, indentType) => {
  switch (indentType) {
    case 'notModified':
    case 'indentForBrace':
      return ' '.repeat(depth * 4);
    case 'modified':
      return ' '.repeat((depth * 4) - 2);
    default:
      throw new Error(`Unknown indentType: ${indentType}!`);
  }
};

const stringify = (val, depth) => {
  if (!_.isObject(val)) {
    return val;
  }
  const key = _.keys(val);
  return `{\n${makeIndent(depth + 1, 'notModified')}${key}: ${val[key]}\n${makeIndent(depth, 'indentForBrace')}}`;
};

const makeNestedOutput = (ast, depth = 0) => {
  const iter = (element, currentDepth) => {
    const {
      type, key, value, valueBefore, valueAfter, children,
    } = element;

    switch (type) {
      case 'ast':
        return `${makeIndent(currentDepth, 'notModified')}${key}: ${makeNestedOutput(children, currentDepth)}`;
      case 'unchanged':
        return `${makeIndent(currentDepth, 'notModified')}${key}: ${(stringify(value, currentDepth))}`;
      case 'changed':
        return [`${makeIndent(currentDepth, 'modified')}+ ${key}: ${stringify(valueAfter, currentDepth)}`,
          `${makeIndent(currentDepth, 'modified')}- ${key}: ${stringify(valueBefore, currentDepth)}`].join('\n');
      case 'added':
        return `${makeIndent(currentDepth, 'modified')}+ ${key}: ${stringify(value, currentDepth)}`;
      case 'deleted':
        return `${makeIndent(currentDepth, 'modified')}- ${key}: ${stringify(value, currentDepth)}`;
      default:
        throw new Error(`Unknown type: ${type}!`);
    }
  };
  const result = ast.map((item) => iter(item, depth + 1)).join('\n');
  return `{\n${result}\n${makeIndent(depth, 'indentForBrace')}}`;
};

export default makeNestedOutput;
