#!/usr/bin/env node
import { createProject } from './create.js';

const [,, command] = process.argv;

if (command === 'create') {
  createProject();
} else {
  console.log(`Comando não reconhecido: ${command}`);
  console.log(`Use: kaelum create`);
}
