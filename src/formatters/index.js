import makePlainOutput from './makePlainOutput';
import makeNestedOutput from './makeNestedOutput';

const formatters = {
  plain: makePlainOutput,
  nested: makeNestedOutput,
  json: JSON.stringify,
};

const format = (data, type) => formatters[type](data);

export default format;
