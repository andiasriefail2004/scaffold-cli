const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const simpleGit = require('simple-git');

async function createProject(projectName, template, options = {}) {
  const targetDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, '..', 'templates', template);

  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`\n❌ Folder "${projectName}" already exists!`));
    process.exit(1);
  }

  if (!fs.existsSync(templateDir)) {
    console.log(chalk.red(`\n❌ Template "${template}" not found!`));
    console.log(chalk.yellow(`   Run: scaffold list`));
    process.exit(1);
  }

  console.log(chalk.blue(`\n🚀 Creating project: ${chalk.bold(projectName)}`));
  console.log(chalk.gray(`   Template : ${template}`));
  console.log(chalk.gray(`   Git init : ${options.git ? 'yes' : 'no'}\n`));

  const spinnerCopy = ora('Copying template files...').start();
  await fs.copy(templateDir, targetDir);
  spinnerCopy.succeed(chalk.green('Template files copied'));

  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const spinnerPkg = ora('Updating package.json...').start();
    const pkg = await fs.readJson(pkgPath);

    const configPath = path.join(process.env.HOME, '.scaffoldrc');
    if (fs.existsSync(configPath)) {
      const config = await fs.readJson(configPath);
      if (config.author) pkg.author = config.author;
    }

    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    spinnerPkg.succeed(chalk.green('package.json updated'));
  }

  if (options.git) {
    const spinnerGit = ora('Initializing git repository...').start();
    try {
      const git = simpleGit(targetDir);
      await git.init();
      await git.add('.');
      await git.commit('initial commit');
      spinnerGit.succeed(chalk.green('Git initialized & first commit created'));
    } catch (e) {
      spinnerGit.warn(chalk.yellow('Git failed (make sure git is installed and configured)'));
    }
  }

  console.log(chalk.green(`\n✅ Project "${projectName}" is ready!\n`));
  console.log(chalk.white('📁 Next steps:'));
  console.log(chalk.cyan(`   cd ${projectName}`));
  console.log(chalk.cyan(`   npm install`));
  console.log(chalk.cyan(`   npm start\n`));
}

module.exports = { createProject };
