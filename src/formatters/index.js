import makePlainOutput from './makePlainOutput';
import render from './render';

const formatters = {
  plain: makePlainOutput,
  nested: render,
  json: JSON.stringify,
};

const format = (data, type) => formatters[type](data);

export default format;
