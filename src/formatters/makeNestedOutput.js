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

const stringify = (param, deep) => {
  if (_.isObject(param)) {
    const result = [];
    const keys = _.keys(param);
    result.push('{');
    keys.map((key) => result.push(`${makeWhitespaces('unchanged', deep)}${key}: ${param[key]}`));
    const whiteSpace = makeWhitespaces('', deep).slice(0, -2);
    result.push(`${whiteSpace}}`);
    return result.join('\n');
  }
  return param;
};

const makeNestedOutput = (ast, deep = 1) => {
  const result = [];
  result.push('{');
  ast.map((list) => {
    const {
      type, key, value, children, beforeValue,
    } = list;
    const newValue = _.has(list, 'children') ? makeNestedOutput(children, deep + 1) : value;
    switch (type) {
      case 'unchanged':
        result.push(`${makeWhitespaces(type, deep)}${key}: ${newValue}`);
        break;
      case 'changed':
        result.push(`${makeWhitespaces(type, deep)}+ ${key}: ${stringify(value, deep + 1)}`);
        result.push(`${makeWhitespaces(type, deep)}- ${key}: ${stringify(beforeValue, deep + 1)}`);
        break;
      case 'deleted':
        result.push(`${makeWhitespaces(type, deep)}- ${key}: ${stringify(value, deep + 1)}`);
        break;
      case 'added':
        result.push(`${makeWhitespaces(type, deep)}+ ${key}: ${stringify(value, deep + 1)}`);
        break;
      default:
        throw new Error(`Unknown type: ${type}!`);
    }
    return true;
  });

  const whiteSpace = makeWhitespaces('', deep).slice(0, -2);
  result.push(`${whiteSpace}}`);
  return result.join('\n');
};

export default makeNestedOutput;
