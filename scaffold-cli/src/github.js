const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');
const ora = require('ora');

async function downloadFromGithub(projectName, repo) {
  const [username, repoName] = repo.split('/');

  if (!username || !repoName) {
    console.log(chalk.red('\n❌ Invalid format! Use: username/repo-name\n'));
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`\n❌ Folder "${projectName}" already exists!\n`));
    process.exit(1);
  }

  const url = `https://github.com/${username}/${repoName}/archive/refs/heads/main.zip`;
  const spinner = ora(`Downloading template from github.com/${username}/${repoName}...`).start();

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    spinner.succeed(chalk.green('Template downloaded successfully'));

    const extractSpinner = ora('Extracting files...').start();
    const zip = new AdmZip(Buffer.from(response.data));
    const tmpDir = path.join(process.cwd(), `_tmp_${projectName}`);

    zip.extractAllTo(tmpDir, true);

    const extracted = fs.readdirSync(tmpDir)[0];
    await fs.move(path.join(tmpDir, extracted), targetDir);
    await fs.remove(tmpDir);

    extractSpinner.succeed(chalk.green('Files extracted successfully'));

    console.log(chalk.green(`\n✅ Project "${projectName}" is ready!\n`));
    console.log(chalk.white('📁 Next steps:'));
    console.log(chalk.cyan(`   cd ${projectName}`));
    console.log(chalk.cyan(`   npm install`));
    console.log(chalk.cyan(`   npm start\n`));

  } catch (err) {
    spinner.fail(chalk.red('Failed to download template'));
    console.log(chalk.yellow(`   Make sure "${username}/${repoName}" exists and is public\n`));
    process.exit(1);
  }
}

module.exports = { downloadFromGithub };
