const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const TEMPLATES = {
  component: (name) => `import React from 'react';

function ${name}() {
  return (
    <div>
      <h1>${name}</h1>
    </div>
  );
}

export default ${name};
`,
  page: (name) => `import React from 'react';

function ${name}Page() {
  return (
    <div>
      <h1>${name} Page</h1>
    </div>
  );
}

export default ${name}Page;
`,
  api: (name) => `const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: '${name} endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: '${name} created' });
});

module.exports = router;
`
};

async function addFile(type, name) {
  const cwd = process.cwd();

  const dirMap = {
    component: 'src/components',
    page: 'src/pages',
    api: 'src/routes'
  };

  const extMap = {
    component: '.jsx',
    page: '.jsx',
    api: '.js'
  };

  if (!TEMPLATES[type]) {
    console.log(chalk.red(`\n❌ Unknown type: ${type}`));
    console.log(chalk.yellow('   Available types: component, page, api\n'));
    process.exit(1);
  }

  const dir = path.join(cwd, dirMap[type]);
  const filename = `${name}${extMap[type]}`;
  const filepath = path.join(dir, filename);

  await fs.ensureDir(dir);

  if (fs.existsSync(filepath)) {
    console.log(chalk.red(`\n❌ File "${filename}" already exists!\n`));
    process.exit(1);
  }

  await fs.writeFile(filepath, TEMPLATES[type](name));
  console.log(chalk.green(`\n✅ Successfully created ${type}: ${dirMap[type]}/${filename}\n`));
}

module.exports = { addFile };
