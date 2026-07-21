# scaffold-cli

A fast and interactive CLI tool to generate project structures automatically. Stop setting up projects manually — scaffold them in seconds.

---

## Features

- **Interactive prompts** — select templates using arrow keys
- **Multiple templates** — vanilla, express, react
- **Git auto-init** — initialize a git repo and create the first commit automatically
- **Add files** — generate components, pages, and API routes into existing projects
- **Project info** — view details about any scaffolded project
- **Delete project** — safely remove a project with confirmation prompt
- **Download from GitHub** — use any public GitHub repo as a template
- **Doctor** — check your environment for missing dependencies
- **Config** — set your personal defaults (author, template, git preference)

---

## Requirements

- Node.js >= 14
- npm >= 6
- git (optional, for git auto-init)

---

## Installation

```bash
# Clone the repo
git clone https://github.com/andiasriefail2004/scaffold-cli.git
cd scaffold-cli

# Install dependencies
npm install

# Install globally
npm install -g .
```

---

## Usage

### Create a new project (interactive)

```bash
scaffold create
```

You will be prompted to enter:
- Project name
- Template (vanilla / express / react)
- Whether to initialize git automatically

### Create with arguments

```bash
scaffold create my-project --template express
scaffold create my-app --template react --no-git
```

### Download template from GitHub

```bash
scaffold create my-project --from username/repo-name
```

---

## Commands

| Command | Description |
|---|---|
| `scaffold create [name]` | Create a new project interactively |
| `scaffold list` | Show all available templates |
| `scaffold add <type> <name>` | Add a file to an existing project |
| `scaffold info <projectName>` | Show project information |
| `scaffold delete <projectName>` | Delete a project (with confirmation) |
| `scaffold doctor` | Check environment & dependencies |
| `scaffold config` | Set your default preferences |
| `scaffold --help` | Show all commands |

---

## scaffold add

Generate files inside an existing project:

```bash
# Inside your project folder
cd my-project

scaffold add component Button
# Creates: src/components/Button.jsx

scaffold add page About
# Creates: src/pages/About.jsx

scaffold add api users
# Creates: src/routes/users.js
```

---

## scaffold config

Set your personal defaults so you don't have to answer prompts every time:

```bash
scaffold config
```

This saves your preferences to `~/.scaffoldrc`:

```json
{
  "author": "Your Name",
  "defaultTemplate": "express",
  "autoGit": true
}
```

---

## scaffold doctor

Check if your environment is ready:

```bash
scaffold doctor
```

```
🔍 Checking environment...

   ✅ Node.js
   ✅ npm
   ✅ git
   ✅ Template: vanilla
   ✅ Template: express
   ✅ Template: react

✨ All checks passed! CLI is ready to use.
```

---

## Available Templates

### vanilla
Basic HTML, CSS, and JavaScript project.

```
my-project/
├── index.html
├── style.css
├── app.js
└── package.json
```

### express
Node.js REST API with Express.

```
my-project/
├── index.js
└── package.json
```

### react
React app using Create React App setup.

```
my-project/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   └── components/
└── package.json
```

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| chalk | ^4.1.2 | Terminal colors |
| commander | ^11.1.0 | CLI argument parsing |
| inquirer | ^8.2.6 | Interactive prompts |
| ora | ^5.4.1 | Spinner animations |
| fs-extra | ^11.2.0 | File system utilities |
| simple-git | ^3.21.0 | Git operations |
| axios | ^1.6.0 | HTTP requests |
| adm-zip | ^0.5.10 | ZIP extraction |
| update-notifier | ^5.1.0 | Update notifications |

> **Note:** chalk v4, inquirer v8, and ora v5 are used intentionally because newer versions use ESM which is incompatible with CommonJS require().

---

## License

MIT
