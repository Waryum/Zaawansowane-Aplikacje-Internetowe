// script for generating sample series

const { parseArgs } = require('node:util');
// read parameters given in function
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

// change given strings to numbers + apiKey is an env parameter if not given
const apiKey = values.key ?? process.env.SENSOR_API_KEY;
const count = Number(values.count);
const interval = Number(values.interval);
const min = Number(values.min);
const max = Number(values.max);
const mode = values.mode;
const api = values.api;
// errors if not correct parameters
if (values.api === undefined ){
    console.error('HTTPS address is required');
    process.exit(1);
}
if (!apiKey){
    console.error('Sensor API key is required');
    process.exit(1);
}
if (!Number.isInteger(count) || count < 1 ){
    console.error('Parameter "count" must be an integer of at least 1');
    process.exit(1);
}
if (!Number.isInteger(interval) || interval <= 0){
    console.error('Interval must be number greater than 0');
    process.exit(1);
}
if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max){
    console.error('Maximum value must a number greater than minimum value');
    process.exit(1);
}
if (!['random', 'sine'].includes(mode)){
    console.error('Mode must be either "random" or "sine"');
    process.exit(1);
}
// output accepted parameters
console.log(`Sensor API key is ${apiKey.slice(0, 8)}...`);
console.log(`Number of measurements is ${count}`);
console.log(`Interval is ${interval}`);
console.log(`Minimum value is ${min}`);
console.log(`Maximum value is ${max}`);
console.log(`Chosen mode is ${mode}`);
console.log(`Site URL is ${api}`);
if (values.live === true){
    console.log('Measurements are live');
}
else{
    console.log ('Measurements are generated backwards');
}
// function for generating values
function generateValue(index){
    let value;
    if (mode === 'random'){
        value = min + Math.random() * (max - min);
    }
    else{
        const middle = (min + max)/2;
        const amplitude = (max - min)/2;
        const angle = 2*Math.PI * index / 24;
        value = middle + amplitude * Math.sin(angle);
    }
    value = Math.round(value * 10)/10;
    return Math.min(max, Math.max(min, value));
}
// SITE URL for routes
const url = new URL('/api/measurements', values.api);
// async function that sends a value and informs if it arrived
async function sendMeasurement(value, timestamp){
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        },
        body: JSON.stringify({ value: true, timestamp: timestamp.toISOString() }),
    });
}

// main function
async function main() {
    const status = await sendMeasurement(generateValue(0), new Date());
    console.log('Status:', status);
}
// catch error and output it
main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
