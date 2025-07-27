const inquirer = require("inquirer");
const inq = inquirer.default || inquirer;
const path = require("path");
const fs = require("fs-extra");
const { copyTemplate } = require("./utils");

const templatesDir = path.resolve(__dirname, "templates");

async function createProject() {
  console.log("🚀 Bem-vindo ao Kaelum CLI!");

  const answers = await inq.prompt([
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

module.exports = { createProject };
