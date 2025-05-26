#!/usr/bin/env node
const { createProject } = require('./create');

const [,, command] = process.argv;

if (command === 'create') {
  createProject();
} else {
  console.log(`Comando não reconhecido: ${command}`);
  console.log(`Use: kaelum create`);
}
