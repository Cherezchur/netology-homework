#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

function showPastOrfutureDate(argv, newDate, isPast = false) {
    if (argv.year) {
        if (typeof(argv.year) !== 'number') {
            console.error('Аргумент должен быть числом');
            return;
        }

        const futureDate = isPast
            ? newDate.setFullYear(newDate.getFullYear() - argv.year)
            : newDate.setFullYear(newDate.getFullYear() + argv.year)

        console.log(new Date(futureDate));
    } else if (argv.month) {
        if (typeof(argv.month) !== 'number') {
            console.error('Аргумент должен быть числом');
            return;
        }

        const futureDate = isPast
            ? newDate.setMonth(newDate.getMonth() - argv.month)
            : newDate.setMonth(newDate.getMonth() + argv.month)

        console.log(new Date(futureDate));
    } else if (argv.date) {
        if (typeof(argv.date) !== 'number') {
            console.error('Аргумент должен быть числом');
            return;
        }

        const futureDate = isPast
            ? newDate.setDate(newDate.getDate() - argv.date)
            : newDate.setDate(newDate.getDate() + argv.date)

        console.log(new Date(futureDate));
    } else {
        console.error('Необходимо ввести флаг и число');
    }
}

yargs(hideBin(process.argv))
    .option('year',{
        alias: 'y',
        description: 'show the current year for "current" command or date in the past or future (an argument is needed)',
    })
    .option('month', {
        alias: 'm',
        description: 'show the current month for "current" command or date in the past or future (an argument is needed)',
    })
    .option('date', {
        alias: 'd',
        description: 'show the current  date for "current" command or date in the past or future (an argument is needed)',
    })
    .command(
        'current',
        'shows current date',
        (yargs) => {
            const argv = yargs.argv;
            if (argv.year) {
                console.log(new Date().getFullYear());
            } else if (argv.month) {
                console.log(new Date().getMonth() + 1);
            } else if (argv.date) {
                console.log(new Date().getDate());
            } else {
                console.log(new Date().toISOString())
            }
        }
    )
    .command(
        'add',
        'shows date in the future',
        (yargs) => {
            const argv = yargs.argv;
            const now = new Date();
            const newDate = new Date(now);

            showPastOrfutureDate(argv, newDate);
        }
    )
    .command(
        'sub',
        'shows date in the past',
        (yargs) => {
            const argv = yargs.argv;
            const now = new Date();
            const newDate = new Date(now);

            showPastOrfutureDate(argv, newDate, true);
        }
    )
    .help()
    .argv;
