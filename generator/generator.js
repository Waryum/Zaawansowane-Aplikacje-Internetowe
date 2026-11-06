// Sensor emulator (F13): generates measurements and sends them to the API
// with a sensor API key (POST /api/measurements, header X-API-Key).
//
// Example:
//   node generator/generator.js --api https://pogoda.jakubwor.hostilla.pl --key <API key>
//        --count=24 --interval=3600 --mode=sine --min=-2 --max=9
// Negative numbers must be written with "=", e.g. --min=-5.

const { parseArgs } = require('node:util');

// ---------- helpers ----------

// prints an error and stops the program (used only before any request is sent)
function fail(message) {
    console.error(`Error: ${message}`);
    process.exit(1);
}

// waits the given number of milliseconds
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- 1. parameters ----------

let values;
try {
    ({ values } = parseArgs({
        options: {
            api:      { type: 'string' },
            key:      { type: 'string' },
            count:    { type: 'string', default: '20' },
            interval: { type: 'string', default: '3600' },
            live:     { type: 'boolean', default: false },
            min:      { type: 'string', default: '0' },
            max:      { type: 'string', default: '25' },
            mode:     { type: 'string', default: 'random' },
        },
    }));
} catch (err) {
    // unknown option, missing value, "--min -5" instead of "--min=-5" etc.
    fail(err.message);
}

// API key: parameter first, environment variable as a fallback (never hard-coded, T11)
const apiKey = values.key ?? process.env.SENSOR_API_KEY;
const count = Number(values.count);
const interval = Number(values.interval);
const min = Number(values.min);
const max = Number(values.max);
const mode = values.mode;
const live = values.live;

if (!values.api) {
    fail('Parameter "--api" (application address) is required');
}

// full address of the endpoint; new URL() also validates the given address
let url;
try {
    url = new URL('/api/measurements', values.api);
} catch {
    fail(`"${values.api}" is not a valid URL`);
}

if (!apiKey) {
    fail('Sensor API key is required (--key or SENSOR_API_KEY)');
}
if (!Number.isInteger(count) || count < 1) {
    fail('Parameter "--count" must be an integer of at least 1');
}
if (!Number.isFinite(interval) || interval <= 0) {
    fail('Parameter "--interval" must be a number of seconds greater than 0');
}
if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
    fail('Parameters "--min" and "--max" must be numbers with min < max');
}
if (!['random', 'sine'].includes(mode)) {
    fail('Parameter "--mode" must be "random" or "sine"');
}

console.log('Sensor emulator configuration:');
console.log(`  endpoint: ${url.href}`);
console.log(`  API key:  ${apiKey.slice(0, 8)}...`);
console.log(`  values:   ${mode}, range [${min}, ${max}]`);
console.log(`  count:    ${count}, interval ${interval} s`);
console.log(`  timing:   ${live ? 'live (current time)' : 'past (timestamps backwards from now)'}`);

// ---------- 2. value generation ----------

function generateValue(index) {
    let value;
    if (mode === 'random') {
        value = min + Math.random() * (max - min);
    } else {
        const middle = (min + max) / 2;
        const amplitude = (max - min) / 2;
        const angle = 2 * Math.PI * index / 24;   // full cycle every 24 measurements
        value = middle + amplitude * Math.sin(angle);
    }
    value = Math.round(value * 10) / 10;           // one decimal place
    return Math.min(max, Math.max(min, value));    // rounding must not leave the range
}

// ---------- 3. sending one measurement ----------

// returns the HTTP status code, or 0 when the server could not be reached
async function sendMeasurement(value, timestamp) {
    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify({ value, timestamp: timestamp.toISOString() }),
        });
    } catch (err) {
        // no connection at all: wrong address, server down, no network
        console.error(`Connection error: ${err.cause?.code ?? err.message}`);
        return 0;
    }

    // the body is JSON (measurement or problem+json); an HTML error page is not
    let body = null;
    try {
        body = await response.json();
    } catch {
        body = null;
    }

    const time = timestamp.toISOString();
    if (response.status === 201) {
        console.log(`OK       201  id=${body?.id}  value=${value}  timestamp=${time}`);
    } else {
        // readable rejection message required by F4
        const reason = body?.detail ?? body?.title ?? 'no details';
        console.error(`REJECTED ${response.status}  value=${value}  timestamp=${time}  reason: ${reason}`);
    }
    return response.status;
}

// ---------- 4. past mode: a whole series with timestamps from the past ----------

async function runPast() {
    const now = Date.now();
    let accepted = 0;
    let rejected = 0;

    for (let i = 0; i < count; i++) {
        // oldest first; the last measurement gets the current time
        const timestamp = new Date(now - (count - 1 - i) * interval * 1000);
        const status = await sendMeasurement(generateValue(i), timestamp);

        if (status === 201) {
            accepted++;
        } else {
            rejected++;
        }
        if (status === 401 || status === 0) {
            console.error('Stopping: the API key is invalid or the server is unreachable.');
            break;
        }
    }
    return { accepted, rejected };
}

// ---------- 5. live mode: current measurements at a fixed interval ----------

async function runLive() {
    let accepted = 0;
    let rejected = 0;

    for (let i = 0; i < count; i++) {
        const status = await sendMeasurement(generateValue(i), new Date());

        if (status === 201) {
            accepted++;
        } else {
            rejected++;
        }
        if (status === 401) {
            console.error('Stopping: the API key is invalid (sensor deregistered?).');
            break;
        }
        // a temporary connection problem (status 0) does not stop a live sensor
        if (i < count - 1) {
            await sleep(interval * 1000);
        }
    }
    return { accepted, rejected };
}

// ---------- main ----------

async function main() {
    const { accepted, rejected } = live ? await runLive() : await runPast();
    console.log(`Done: ${accepted} accepted, ${rejected} rejected or failed.`);
    if (rejected > 0) {
        process.exitCode = 1;
    }
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});