const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

async function showInfo(projectName) {
  const targetDir = path.join(process.cwd(), projectName);

  if (!fs.existsSync(targetDir)) {
    console.log(chalk.red(`\n❌ Project "${projectName}" not found!\n`));
    process.exit(1);
  }

  const pkgPath = path.join(targetDir, 'package.json');
  const stats = fs.statSync(targetDir);

  const date = stats.birthtime.getFullYear() > 1970
    ? stats.birthtime
    : stats.mtime;

  console.log(chalk.blue(`\n📦 Project Info: ${chalk.bold(projectName)}\n`));

  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    console.log(chalk.white(`   Name     : ${pkg.name}`));
    console.log(chalk.white(`   Version  : ${pkg.version}`));
    if (pkg.author) console.log(chalk.white(`   Author   : ${pkg.author}`));
  }

  const files = fs.readdirSync(targetDir);
  console.log(chalk.white(`   Files    : ${files.length} items`));
  console.log(chalk.white(`   Created  : ${date.toLocaleDateString('en-US')}`));
  console.log(chalk.white(`   Path     : ${targetDir}\n`));
}

module.exports = { showInfo };
