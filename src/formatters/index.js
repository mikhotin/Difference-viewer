import makePlainOutput from './makePlainOutput';
import render from './render';

const formatters = {
  plain: (data) => makePlainOutput(data),
  nested: (data) => render(data, 1),
  json: (data) => JSON.stringify(data),
};

const format = (data, type) => formatters[type](data);

export default format;
