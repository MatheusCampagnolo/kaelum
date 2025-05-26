const fs = require("fs-extra");
const path = require("path");

async function copyTemplate(sourceDir, targetDir) {
  try {
    await fs.copy(sourceDir, targetDir);
  } catch (err) {
    console.error("Erro ao copiar o template:", err);
  }
}

module.exports = { copyTemplate };
