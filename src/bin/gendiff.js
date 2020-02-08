#!/usr/bin/env node
import program from '..';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f --format [type]', 'output format');

program
  .action(() => {});

program.parse(process.argv);
