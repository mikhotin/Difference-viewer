import YAML from 'js-yaml';

const filenameExtensions = {
  json: (extension) => JSON.parse(extension),
  yaml: (extension) => YAML.safeLoad(extension),
};

const parse = (file, extension) => filenameExtensions[extension](file);

export default parse;
