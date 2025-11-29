const inquirer = require("inquirer");
const inq = inquirer.default || inquirer;
const path = require("path");
const fs = require("fs-extra");
const { copyTemplate } = require("./utils");
const { spawn } = require("child_process");

const templatesDir = path.resolve(__dirname, "templates");

/**
 * runInstall - runs `npm ci` if package-lock exists, otherwise `npm install`
 * @param {string} cwd - target directory where install runs
 * @returns {Promise<void>}
 */
function runInstall(cwd) {
  return new Promise((resolve, reject) => {
    const lockExists = fs.existsSync(path.join(cwd, "package-lock.json"));
    const cmd = "npm";
    const args = lockExists ? ["ci"] : ["install"];

    // Spawn child process and inherit stdio so user sees progress
    const child = spawn(cmd, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32", // improves compatibility on Windows
    });

    child.on("error", (err) => {
      reject(err);
    });

    child.on("exit", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

/**
 * createProject - create project from template
 * @param {Object} defaults - optional { projectName, template, autoInstall }
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
      {
        type: "confirm",
        name: "autoInstall",
        message:
          "Deseja que eu execute 'npm install' agora (recomendado)?",
        default:
          typeof defaults.autoInstall === "boolean"
            ? defaults.autoInstall
            : true,
      },
    ]);

    const { projectName, template, autoInstall } = answers;
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

    if (autoInstall) {
      console.log("⬇️  Instalando dependências (npm)... (isso pode levar alguns minutos)");
      try {
        await runInstall(targetDir);
        console.log("\n✅ Dependências instaladas com sucesso!");
        console.log("➡️  Para iniciar o projeto, execute: npm start\n");
      } catch (installErr) {
        console.error(
          "\n❌ Falha ao instalar dependências automaticamente:",
          installErr.message || installErr
        );
        console.log(`➡️  Tente manualmente: cd ${projectName} && npm install`);
      }
    } else {
      console.log(`➡️  Inicie o projeto com: cd ${projectName} && npm install && npm start\n`);
    }
  } catch (err) {
    console.error("❌ Erro inesperado:", err.message || err);
  }
}

module.exports = { createProject };
