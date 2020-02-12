import commander from 'commander';
import _ from 'lodash';

const genDiff = (file1, file2) => {
  const keys1 = Object.keys(file1);
  const keys2 = Object.keys(file2);
  const uniqColl = _.uniq([...keys1, ...keys2]);
  const diff = uniqColl.reduce((acc, key) => {
    if ((keys1.includes(key) && keys2.includes(key)) && (file1[key] === file2[key])) {
      acc.push(`${key}: ${file1[key]}`);
    }

    if ((keys1.includes(key) && keys2.includes(key)) && (file1[key] !== file2[key])) {
      acc.push(`+ ${key}: ${file2[key]}`);
      acc.push(`- ${key}: ${file1[key]}`);
    }

    if ((keys1.includes(key) && !keys2.includes(key))) {
      acc.push(`- ${key}: ${file1[key]}`);
    }

    if ((!keys1.includes(key) && keys2.includes(key))) {
      acc.push(`+ ${key}: ${file2[key]}`);
    }

    return acc;
  }, []);

  return `{
  ${diff.join('\n')}
}`;
};

const makeProgram = () => {
  const program = new commander.Command();
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .arguments('<firstConfig> <secondConfig>')
    .option('-f --format [type]', 'output format');

  program
    .action(() => {
      genDiff();
    });

  program.parse(process.argv);
};

export default makeProgram;
