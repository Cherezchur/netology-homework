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
    const MIN = 1;
    const MAX = 100;
    const randomNumber = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    let customNumber;

    while (true) {
        const num = await askQuestion(`Загадано число в диапазоне от ${MIN} до ${MAX}: `);
        customNumber = Number(num);
        if (isNaN(customNumber)) {
            console.log('Некорректный ввод, введите число');
        } else {
            break;
        }
    }

    while (true) {
        if (customNumber < randomNumber) {
            customNumber = await askQuestion('Больше: ');
        } else if (customNumber > randomNumber) {
            customNumber = await askQuestion('Меньше: ');
        } else {
            console.log(`Отгадано число ${customNumber}`);
            break;
        }
    }

    rl.close();
}

main();