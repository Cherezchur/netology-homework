#!/usr/bin/env node

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

async function main() {
    let lowNumber;
    let hideNumber;
    let customNumber;

    while (true) {
        const num = await askQuestion('Введине нижнюю границу диапазона (число): ');
        lowNumber = Number(num);
        if (!isNaN(lowNumber)) {
            console.log(`Спасибо! Вы ввели число: ${lowNumber}`);
            break;
        } else {
            console.log('Некорректный ввод, введите число');
        }
    }

    while (true) {
        const num = await askQuestion('Введине верхнюю границу диапазона (число): ');
        hideNumber = Number(num);
        if (isNaN(hideNumber)) {
            console.log('Некорректный ввод, введите число');
        } else if (hideNumber < lowNumber) {
            console.log('Некорректный ввод, верхняя граница должна быть больше');
        } else {
            console.log(`Спасибо! Вы ввели число: ${hideNumber}`);
            break;
        }
    }

    const min = Math.ceil(lowNumber);
    const max = Math.floor(hideNumber);
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    while (true) {
        const num = await askQuestion(`Загадано число в диапазоне от ${min} до ${max}: `);
        customNumber = Number(num);
        if (isNaN(num)) {
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