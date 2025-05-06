import inquirer from "inquirer";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { copyTemplate } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.resolve(__dirname, "templates");

export async function createProject() {
  console.log("🚀 Bem-vindo ao Kaelum CLI!");

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Qual será o nome do seu projeto?",
      validate: (input) => (input ? true : "O nome não pode ser vazio."),
    },
    {
      type: "list",
      name: "template",
      message: "Qual template você deseja usar?",
      choices: ["web", "api"],
    },
  ]);

  const { projectName, template } = answers;
  const targetDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.join(templatesDir, template);

  if (template === "api") {
    console.log(
      '\n📦 O template API ainda está em desenvolvimento. Por favor, escolha o template "web".'
    );
    return;
  }

  if (fs.existsSync(targetDir)) {
    console.error(
      `\n❌ A pasta "${projectName}" já existe. Escolha outro nome ou apague a pasta existente.`
    );
    return;
  }

  await copyTemplate(templateDir, targetDir);

  console.log(`\n✅ Projeto "${projectName}" criado com sucesso!`);
  console.log(`➡️  Acesse a pasta: cd ${projectName}`);
  console.log(`➡️  Inicie o projeto com: npm install && npm start\n`);
}
