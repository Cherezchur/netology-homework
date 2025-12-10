#!/usr/bin/env node

// function getRandomInt() {

// }

// console.log('get play!');

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { log } = require('node:console');
const { number } = require('yargs');

const rl = readline.createInterface({ input, output });

function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

async function main() {
    // const lowAnswer = await askQuestion('Введине нижнюю границу диапазона (число): ');
    let lowNumber;
    let hideNumber;

    while (true) {
        lowNumber = await askQuestion('Введине нижнюю границу диапазона (число): ');
        const num = Number(lowNumber);
        if (!isNaN(num)) {
            console.log(`Спасибо! Вы ввели число: ${num}`);
            break;
        } else {
            console.log('Некорректный ввод, попробуйте ещё раз.');
        }
    }

    while (true) {
        hideNumber = await askQuestion('Введине верхнюю границу диапазона (число): ');
        const num = Number(hideNumber);
        if (isNaN(num)) {
            console.log('Некорректный ввод, введите число');
        } else if (hideNumber < lowNumber) {
            console.log('Некорректный ввод, верхняя граница должна быть больше');
        } else {
            console.log(`Спасибо! Вы ввели число: ${num}`);
            break;
        }
    }

    console.log(lowNumber, hideNumber);
    

    rl.close();
}

main();

// rl.question('Введите нижнюю границу диапазона', (number) => {
  
//     rl.on('line', (input) => {
//         console.log(`Нижняя граница ${number}`);
//     }); 

//     rl.close();
// });