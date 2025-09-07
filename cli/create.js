const inquirer = require("inquirer");
const inq = inquirer.default || inquirer;
const path = require("path");
const fs = require("fs-extra");
const { copyTemplate } = require("./utils");

const templatesDir = path.resolve(__dirname, "templates");

/**
 * createProject - create project from template
 * @param {Object} defaults - optional { projectName, template }
 */
async function createProject(defaults = {}) {
  console.log("🚀 Bem-vindo ao Kaelum CLI!");

  try {
    // ensure templates dir exists
    const templatesExists = await fs.pathExists(templatesDir);
    if (!templatesExists) {
      console.error("❌ Diretório de templates não encontrado no CLI.");
      return;
    }

    // gather answers (use defaults when present)
    const answers = await inq.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Qual será o nome do seu projeto?",
        default: defaults.projectName || "",
        validate: (input) => (input ? true : "O nome não pode ser vazio."),
      },
      {
        type: "list",
        name: "template",
        message: "Qual template você deseja usar?",
        choices: async () => {
          // list available template folders
          try {
            const items = await fs.readdir(templatesDir, {
              withFileTypes: true,
            });
            return items.filter((i) => i.isDirectory()).map((i) => i.name);
          } catch (e) {
            return ["web", "api"];
          }
        },
        default: defaults.template || "web",
      },
    ]);

    const { projectName, template } = answers;
    const targetDir = path.resolve(process.cwd(), projectName);
    const templateDir = path.join(templatesDir, template);

    // template existence check
    const templateExists = await fs.pathExists(templateDir);
    if (!templateExists) {
      console.error(`\n❌ Template "${template}" não encontrado.`);
      return;
    }

    if (await fs.pathExists(targetDir)) {
      console.error(
        `\n❌ A pasta "${projectName}" já existe. Escolha outro nome ou apague a pasta existente.`
      );
      return;
    }

    // copy + update package.json
    const result = await copyTemplate(templateDir, targetDir, projectName);
    if (!result.ok) {
      console.error(`\n❌ Erro ao copiar o template: ${result.error}`);
      return;
    }

    console.log(`\n✅ Projeto "${projectName}" criado com sucesso!`);
    console.log(`➡️  Acesse a pasta: cd ${projectName}`);
    console.log(`➡️  Inicie o projeto com: npm install && npm start\n`);
  } catch (err) {
    console.error("❌ Erro inesperado:", err.message || err);
  }
}

module.exports = { createProject };