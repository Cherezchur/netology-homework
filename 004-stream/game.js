#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });
const NUMBERS = {
  min: 0,
  max: 1
}
const CLIENT_TEXT = {
  logFileName: 'Назовите вашу партию, куда будут записывать результаты игры: ',
  rules: 'Введите число 1 или 0, где 1 - это орел, а 0 это решка: ',
  lose: 'Нет',
  win: 'Да',
}

let logFileName = path.join(__dirname, 'results');
let writeStr;
let readStr;

rl.on('SIGINT', () => {
  console.log('Получен SIGINT. Завершаем работу...');
  rl.close();
  process.exit(0);
});

function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

function createWhiteStream() {
  writeStr = fs.createWriteStream(logFileName);
}

function createReadStream() {
  readStr = fs.createReadStream(logFileName)
}

function getLogFileContent() {
  let data = '';
  readStr
  .setEncoding('UTF8')
  .on('data', (chank) => {
    if (chank) {
      data += chank
    }
  })
  return data;
}

async function main() {
  let randomNumber;

  const checkNumber = (number) => isNaN(number) || number !== NUMBERS.min && number !== NUMBERS.max

  while (true) {
    const input = await askQuestion(CLIENT_TEXT.logFileName);
    
    if (input) {
      logFileName = `${logFileName}\\${input}.txt`
      createWhiteStream();
      createReadStream();
    } else {
      continue;
    }
    
    break;
  }

  while (true) {
    const input = await askQuestion(CLIENT_TEXT.rules);
    const number = Number(input);
    randomNumber = Math.round(Math.random());
    
    if (checkNumber(number)) {
      continue;
    } else  if (number == randomNumber) {
      console.log(CLIENT_TEXT.win, getLogFileContent());
      const content = getLogFileContent() + '+';
      writeStr.write(content, 'UTF8');
      continue;
    } else  if (number != randomNumber) {
      console.log(CLIENT_TEXT.lose, getLogFileContent());
      const content = getLogFileContent() + '-';
      writeStr.write(content, 'UTF8');
      continue;
    }
  }
}

main();