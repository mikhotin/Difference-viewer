import makePlainOutput from './plainOutput';
import makeNestedOutput from './nestedOutput';

const formatters = {
  plain: makePlainOutput,
  nested: makeNestedOutput,
  json: JSON.stringify,
};

const format = (data, type) => formatters[type](data);

export default format;
