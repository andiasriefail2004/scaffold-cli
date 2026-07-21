#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { createProject } = require('./create');
const { addFile } = require('./add');
const { runDoctor } = require('./doctor');
const { showInfo } = require('./info');
const { deleteProject } = require('./delete');
const { downloadFromGithub } = require('./github');

const CONFIG_PATH = path.join(process.env.HOME, '.scaffoldrc');
const TEMPLATES = ['vanilla', 'express', 'react'];

program
  .name('scaffold')
  .description('CLI tool to generate project structures automatically')
  .version('1.0.0');

// CREATE
program
  .command('create [projectName]')
  .description('Create a new project')
  .option('-t, --template <template>', 'Choose a template directly')
  .option('--from <repo>', 'Download from GitHub (format: username/repo)')
  .option('--no-git', 'Skip git init')
  .action(async (projectName, options) => {

    if (options.from) {
      const name = projectName || path.basename(options.from);
      return await downloadFromGithub(name, options.from);
    }

    let config = {};
    if (fs.existsSync(CONFIG_PATH)) {
      config = await fs.readJson(CONFIG_PATH);
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        when: !projectName,
        validate: v => v.trim() ? true : 'Project name cannot be empty!'
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose a template:',
        choices: TEMPLATES,
        default: config.defaultTemplate || 'vanilla',
        when: !options.template
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Initialize git automatically?',
        default: config.autoGit !== undefined ? config.autoGit : true,
        when: options.git !== false
      }
    ]);

    const finalName = projectName || answers.projectName;
    const finalTemplate = options.template || answers.template;
    const finalGit = options.git === false ? false : (answers.git !== undefined ? answers.git : true);

    await createProject(finalName, finalTemplate, { git: finalGit });
  });

// ADD
program
  .command('add <type> <name>')
  .description('Add a file to existing project (component/page/api)')
  .action(async (type, name) => {
    await addFile(type, name);
  });

// LIST
program
  .command('list')
  .description('Show available templates')
  .action(() => {
    console.log(chalk.blue('\n📦 Available templates:\n'));
    TEMPLATES.forEach(t => {
      console.log(chalk.cyan(`   ✔ ${t}`));
    });
    console.log();
  });

// CONFIG
program
  .command('config')
  .description('Set default configuration')
  .action(async () => {
    let existing = {};
    if (fs.existsSync(CONFIG_PATH)) {
      existing = await fs.readJson(CONFIG_PATH);
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: existing.author || ''
      },
      {
        type: 'list',
        name: 'defaultTemplate',
        message: 'Default template:',
        choices: TEMPLATES,
        default: existing.defaultTemplate || 'vanilla'
      },
      {
        type: 'confirm',
        name: 'autoGit',
        message: 'Auto git init by default?',
        default: existing.autoGit !== undefined ? existing.autoGit : true
      }
    ]);

    await fs.writeJson(CONFIG_PATH, answers, { spaces: 2 });
    console.log(chalk.green('\n✅ Configuration saved!\n'));
    console.log(chalk.gray(JSON.stringify(answers, null, 2)));
    console.log();
  });

// DOCTOR
program
  .command('doctor')
  .description('Check environment & dependencies')
  .action(async () => {
    await runDoctor();
  });

// INFO
program
  .command('info <projectName>')
  .description('Show project information')
  .action(async (projectName) => {
    await showInfo(projectName);
  });

// DELETE
program
  .command('delete <projectName>')
  .description('Delete a project')
  .action(async (projectName) => {
    await deleteProject(projectName);
  });

program.parse();
