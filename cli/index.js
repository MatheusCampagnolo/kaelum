#!/usr/bin/env node
const { createProject } = require("./create");
const argv = process.argv.slice(2);

function printHelp() {
  console.log(`Kaelum CLI
Usage:
  kaelum create             # interactive
  kaelum create <name>      # create using interactive template choice
  kaelum create <name> --template web|api   # non-interactive (name provided, template preselected)
  kaelum help
`);
}

async function main() {
  const [command, maybeName, maybeFlag, maybeTemplate] = argv;

  if (
    !command ||
    command === "help" ||
    command === "--help" ||
    command === "-h"
  ) {
    printHelp();
    return;
  }

  if (command === "create") {
    // non-interactive shorthand: kaelum create my-app --template web
    if (maybeName && maybeFlag === "--template" && maybeTemplate) {
      await createProject({ projectName: maybeName, template: maybeTemplate });
      return;
    }

    // non-interactive shorthand: kaelum create my-app  (will still ask template)
    if (maybeName && !maybeFlag) {
      await createProject({ projectName: maybeName });
      return;
    }

    // otherwise interactive flow
    await createProject();
    return;
  }

  console.log(`Comando não reconhecido: ${command}`);
  printHelp();
}

main().catch((err) => {
  console.error("Error running Kaelum CLI:", err);
  process.exit(1);
});
