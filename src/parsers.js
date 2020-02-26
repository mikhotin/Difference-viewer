import YAML from 'js-yaml';
import ini from 'ini';

const filenameExtensions = {
  json: (extension) => JSON.parse(extension),
  yaml: (extension) => YAML.safeLoad(extension),
  ini: (extension) => ini.parse(extension),
};

const parse = (file, extension) => filenameExtensions[extension](file);

export default parse;
