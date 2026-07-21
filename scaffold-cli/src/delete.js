const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

async function deleteProject(projectName) {
  const targetDir = path.join(process.cwd(), projectName);

  if (!fs.existsSync(targetDir)) {
    console.log(chalk.red(`\n❌ Project "${projectName}" not found!\n`));
    process.exit(1);
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.red(`Delete project "${projectName}"? This cannot be undone!`),
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\n⚠️  Cancelled.\n'));
    return;
  }

  await fs.remove(targetDir);
  console.log(chalk.green(`\n✅ Project "${projectName}" has been deleted!\n`));
}

module.exports = { deleteProject };
