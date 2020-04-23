import YAML from 'js-yaml';
import ini from 'ini';

const dataTypes = {
  json: JSON.parse,
  yaml: YAML.safeLoad,
  ini: ini.parse,
};

const parse = (data, type) => dataTypes[type](data);

export default parse;
