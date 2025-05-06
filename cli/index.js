#!/usr/bin/env node

import { copy } from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

// Helper para __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Arguments: ['create', 'nome-do-projeto']
const [, , command, projectName] = process.argv;

if (command === "create" && projectName) {
  // Path to the template
  const templateDir = path.join(__dirname, "templates", "web");
  // Destination directory where the project will be created
  const targetDir = path.join(process.cwd(), projectName);

  copy(templateDir, targetDir)
    .then(() => {
      console.log(`✅ Projeto "${projectName}" criado com sucesso em ${targetDir}`);
      console.log(`> Para iniciar: cd ${projectName} && npm install`);
    })
    .catch((err) => {
      console.error("❌ Erro ao criar o projeto:", err);
    });
} else {
  console.log("Uso: kaelum create <nome-do-projeto>");
}
