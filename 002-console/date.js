#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const ALIASES = {
    year: 'y',
    month: 'm',
    date: 'd'
}

function showPastOrfutureDate(argv, isPast = false) {
    const data = argv.argv;
    let changedDate = new Date();

    if (data[ALIASES.year] === undefined
        && data[ALIASES.month] === undefined
        && data[ALIASES.date] !== undefined
    ) {
        console.error('Необходимо ввести флаг(и) и аргумент(ы), попробуйте заново');
        return;
    };

    const checkArgvValue = (value) => {
        if (typeof(value) !== 'number') {
            console.error('Аргумент должен быть числом');
            return;
        }
        return true;
    }

    const setChangeDate = (alias) => {            
        const getTargetValue = (currentValue, argvValue) => isPast
            ? currentValue - argvValue
            : currentValue + argvValue;

        if (alias === ALIASES.year) {
            const targetValue = getTargetValue(changedDate.getFullYear(), data[alias]);
            changedDate.setFullYear(targetValue);
        } else if (alias === ALIASES.month) {
            const targetValue = getTargetValue(changedDate.getMonth(), data[alias]);
            changedDate.setMonth(targetValue);
        } else if (alias === ALIASES.date) {
            const targetValue = getTargetValue(changedDate.getDate(), data[alias]);
            changedDate.setDate(targetValue);
        }
    }
    
    if (data[ALIASES.year] && checkArgvValue(data[ALIASES.year])) {
        setChangeDate(ALIASES.year);
    }

    if (data[ALIASES.month] && checkArgvValue(data[ALIASES.month])) {
        setChangeDate(ALIASES.month);
    }

    if (data[ALIASES.date] && checkArgvValue(data[ALIASES.date])) {
        setChangeDate(ALIASES.date);
    }

    console.log(changedDate.toISOString());
}

yargs(hideBin(process.argv))
    .option('year',{
        alias: ALIASES.year,
        description: 'show the current year for "current" command or date in the past or future (an argument is needed)',
    })
    .option('month', {
        alias: ALIASES.month,
        description: 'show the current month for "current" command or date in the past or future (an argument is needed)',
    })
    .option('date', {
        alias: ALIASES.date,
        description: 'show the current  date for "current" command or date in the past or future (an argument is needed)',
    })
    .command(
        'current',
        'shows current date',
        (argv) => {
            const data = argv.argv;
            
            if (data[ALIASES.year]) {
                console.log(new Date().getFullYear());
            } else if (data[ALIASES.month]) {
                console.log(new Date().getMonth() + 1);
            } else if (data[ALIASES.date]) {
                console.log(new Date().getDate());
            } else {
                console.log(new Date().toISOString())
            }
        }
    )
    .command(
        'add',
        'shows date in the future',
        (argv) => {          
            showPastOrfutureDate(argv, false);
        }
    )
    .command(
        'sub',
        'shows date in the past',
        (argv) => {          
            showPastOrfutureDate(argv, true);
        }
    )
    .help()
    .argv;
