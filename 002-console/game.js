#!/usr/bin/env node

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

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

async function main() {
  let customNumber;
  const MIN = 0;
  const MAX = 100;
  const randomNumber = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  const UNCORRECT_OUTPUT = `Введите число от ${MIN} до ${MAX}`;

  const checkNumber = (input) => isNaN(Number(input)) || customNumber < MIN || customNumber > MAX

  while (true) {
    const input = await askQuestion(`Загадано число в диапазоне от ${MIN} до ${MAX}: `);
    if (isNaN(Number(input))) {
        console.log(UNCORRECT_OUTPUT);
    } else {
        customNumber = Number(input);
        break;
    }
  }

  while (true) {
    if (customNumber < randomNumber) {
      const input = await askQuestion('Больше: ');
      if (checkNumber(input)) {
        console.log(UNCORRECT_OUTPUT);
        continue;
      }
      customNumber = Number(input);
    } else if (customNumber > randomNumber) {
      const input = await askQuestion('Меньше: ');
      if (checkNumber(input)) {
        console.log(UNCORRECT_OUTPUT);
        continue;
      }
      customNumber = Number(input);
    } else if (customNumber == randomNumber) {
        console.log(`Отгадано число ${customNumber}`);
        break;
    }
  }

  rl.close();
}

main();