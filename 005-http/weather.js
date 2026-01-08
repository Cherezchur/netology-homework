import { CONFIG } from './config.js';

import http from 'http';
import readline from 'node:readline';
import { stdin, stdout } from 'node:process';

const rl = readline.createInterface({ input: stdin, output: stdout });

rl.on('SIGINT', () => {
  console.log('Получен SIGINT. Завершаем работу...');
  rl.close();
  process.exit(0);
});

const CLIENT_TEXT = {
  enterText: 'Введите название города на латинице: ',
  errorClientRequest: 'Данный город не найден',
  errorServerRequest: 'Ошибка на стороне сервиса погода, попробуйте позже...'
}

function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

function fetchData(url) {
    console.log('Загружаем данные...');

    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            const { statusCode } = res;
            let error = '';

            if (statusCode === 400) {
                error = CLIENT_TEXT.errorClientRequest;
            } else {
                error = CLIENT_TEXT.errorServerRequest;
            }

            res.setEncoding('utf8');
            let rowData = '';
            res.on('data', (chunk) => {
                rowData += chunk;
            });

            res.on('end', () => {
                try {
                    const parseData = JSON.parse(rowData);

                    if (parseData.current.temp_c) {
                        return resolve(parseData.current.temp_c);
                    }
                } catch {
                    return reject(error);
                }
            });
        });
    });
}

async function main() {
    while (true) {
        const input = await askQuestion(CLIENT_TEXT.enterText);
        
        if (input) {
            const path = `${CONFIG.url}current.json?key=${CONFIG.apiKey}&q=${input}&aqi=no`
            
            await fetchData(path)
                .then((data) => {
                    console.log(`Температура: ${data}`);
                })
                .catch((error) => {
                    console.error(error);
                })
            
            continue;
        }
    }
}

main();