import fs from "fs-extra";
import path from "path";

export async function copyTemplate(sourceDir, targetDir) {
  try {
    await fs.copy(sourceDir, targetDir);
  } catch (err) {
    console.error("Erro ao copiar o template:", err);
  }
}
