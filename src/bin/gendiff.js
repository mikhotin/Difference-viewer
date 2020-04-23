#!/usr/bin/env node
import commander from 'commander';
import genDiff from '..';

const program = new commander.Command();

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f --format [type]', 'output format')
  .action((firstConfig, secondConfig) => {
    const result = genDiff(firstConfig, secondConfig, program.format);
    console.log(result);
  });

program.parse(process.argv);
