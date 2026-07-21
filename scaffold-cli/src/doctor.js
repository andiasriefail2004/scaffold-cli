const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

function checkCommand(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function runDoctor() {
  console.log(chalk.blue('\n🔍 Checking environment...\n'));

  const checks = [
    { label: 'Node.js', ok: checkCommand('node') },
    { label: 'npm', ok: checkCommand('npm') },
    { label: 'git', ok: checkCommand('git') },
  ];

  const templateDir = path.join(__dirname, '..', 'templates');
  const templates = ['vanilla', 'express', 'react'];
  templates.forEach(t => {
    const exists = fs.existsSync(path.join(templateDir, t));
    checks.push({ label: `Template: ${t}`, ok: exists });
  });

  checks.forEach(({ label, ok }) => {
    if (ok) {
      console.log(chalk.green(`   ✅ ${label}`));
    } else {
      console.log(chalk.red(`   ❌ ${label} not found`));
    }
  });

  const allOk = checks.every(c => c.ok);
  if (allOk) {
    console.log(chalk.green('\n✨ All checks passed! CLI is ready to use.\n'));
  } else {
    console.log(chalk.yellow('\n⚠️  Some issues were found. Please fix them before continuing.\n'));
  }
}

module.exports = { runDoctor };
