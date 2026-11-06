// script for generating sample series

const { parseArgs } = require('node:util');

const { values } = parseArgs({
    options: {
        api: { type: 'string' },
        key: { type: 'string' },
        count: { type: 'string', default: '20' },
        interval: { type: 'string', default: '3600' },
        live: {type: 'boolean', default: false },
        min: { type: 'string', default: '0'},
        max: { type: 'string', default: '25'},
        mode: {type: 'string', default: 'random'},
    },
})

if (values.api === undefined ){
    console.error('HTTPS address is required');
    process.exit(1);
}

if (values.key === undefined ){
    console.error('Sensor API key is required');
    process.exit(1);
}

if (!Number.isInteger(values.count) || values.count < 0 ){
    console.error('Number of expected measurements is required');
    process.exit(1);
}

if (!Number.isInteger(values.interval) || values.interval <= 0){
    console.error('Interval must be number greater than 0');
    process.exit(1);
}

if ((!Number.isFinite(values.min) || !Number.isFinite(values.max)) && values.min > values.max){
    console.error('Maximum value must a number greater than minimum value');
    process.exit(1);
}

if (values.mode !== 'random' || values.mode !== 'sine'){
    console.error('Mode must be either "random" or "sine"');
    process.exit(1);
}