#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import path from "path"
import fs from "fs"
import { render } from './utils/template.mjs';
import shelljs from "shelljs"

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sleep } from './utils/sleep.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const questions = [
  {
    name: "name",
    type: "input",
    message: "Enter your project name:"
  }
]

const templatePath = path.join(__dirname, "create-zachmcm-app")

const currentPath = process.cwd()

inquirer.prompt(questions).then((answers) => {
  const projectName = answers.name
  const tartgetPath = path.join(currentPath, projectName);

  if (!createProject(tartgetPath)) {
    return
  }
  createDirectoryContents(templatePath, projectName)
  if (postProcess(tartgetPath)) {
    console.log(chalk.greenBright("\nProject created successfully!"))
    runDevServer(tartgetPath)
  }

})

function createProject(projectPath) {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.redBright(`Folder ${projectPath} exists. Delete or use another name.`) + "\n\n\n")
    return false
  }

  fs.mkdirSync(projectPath)

  return true
}

function createDirectoryContents(templatePath, projectName) {
  const filesToCreate = fs.readdirSync(templatePath)

  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file)
    const stats = fs.statSync(origFilePath)

    if (file == "node_modules") return

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, "utf-8")
      contents = render(contents, { projectName })

      const writePath = path.join(currentPath, projectName, file)
      fs.writeFileSync(writePath, contents, "utf-8")
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(currentPath, projectName, file))

      createDirectoryContents(path.join(templatePath, file), path.join(projectName, file))
    }
  })
}


function postProcess(tartgetPath) {
  shelljs.cd(tartgetPath)

  const result = shelljs.exec("npm ci && git init")

  if (result.code !== 0) {
    return false
  }

  return true
}

function runDevServer(tartgetPath) {
  sleep(3000)

  console.log("\n" + chalk.yellowBright("Starting development server..."))

  shelljs.cd(tartgetPath)

  const res = shelljs.exec("npm run dev")

  if (res.code !== 0) {
    return false
  }

  return true
}