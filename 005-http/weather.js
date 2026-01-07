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

// async function getWeatherData(city) {
//     const outputData = {
//         errorText: '',
//         cityTemperatur: '',
//     };
//     const path = `${CONFIG.url}current.json?key=${CONFIG.apiKey}&q=${city}&aqi=no`
    
//     http.get(path, (res) => {
//         const { statusCode } = res;
//         const contentType = res.headers['content-type'];

//         if (statusCode === 400) {
//             outputData.errorText = CLIENT_TEXT.errorValue;
//             return;
//         } else if (!/^application\/json/.test(contentType)) {
//             outputData.errorText = CLIENT_TEXT.errorServerRequest;
//             return;
//         }

//         res.setEncoding('utf8');
//         let rowData = '';
//         res.on('data', (chunk) => {
//             rowData += chunk;
//         })
//         res.on('end', () => {
//             try {
//                 const parseData = JSON.parse(rawData);

//                 if (parseData.current.temp_c) {
//                     outputData.cityTemperatur = parseData.current.temp_c;
//                     return;
//                 } else {
//                     outputData.errorText = CLIENT_TEXT.errorServerRequest;
//                     return;
//                 }
//             } catch {
//                 outputData.errorText = CLIENT_TEXT.errorServerRequest;
//                 return;
//             }
//         })
//     }).on('error', () => {
//         outputData.errorText = CLIENT_TEXT.errorServerRequest;
//         return;
//     });

//     return outputData;
// }

async function main() {
    while (true) {
        const outputData = {
            errorText: '',
            cityTemperatur: '',
        };
        const input = await askQuestion(CLIENT_TEXT.enterText);
        
        if (input) {
            console.log('Загружаем данные...');
            const path = `${CONFIG.url}current.json?key=${CONFIG.apiKey}&q=${input}&aqi=no`
            
            http.get(path, (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                if (statusCode === 400) {
                    outputData.errorText = CLIENT_TEXT.errorValue;
                    return;
                } else if (!/^application\/json/.test(contentType)) {
                    outputData.errorText = CLIENT_TEXT.errorServerRequest;
                    return;
                }

                res.setEncoding('utf8');
                let rowData = '';
                res.on('data', (chunk) => {
                    rowData += chunk;
                })
                res.on('end', () => {
                    console.log('Данные получены!');

                    try {
                        const parseData = JSON.parse(rowData);

                        if (parseData.current.temp_c) {
                            outputData.cityTemperatur = parseData.current.temp_c;
                            console.log(`Температура: ${outputData.cityTemperatur}`);
                        } else {
                            outputData.errorText = CLIENT_TEXT.errorServerRequest;
                            console.log('errorText', outputData.errorText);
                        }
                    } catch {
                        outputData.errorText = CLIENT_TEXT.errorServerRequest;
                        console.log('errorText', outputData.errorText);
                    }
                })
            }).on('error', () => {
                outputData.errorText = CLIENT_TEXT.errorServerRequest;
                return;
            });

            continue;
        }
    }
}

main();