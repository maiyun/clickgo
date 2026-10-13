import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as current from '../tool.js';

const baseline = process.argv[2] ? await import(pathToFileURL(resolve(process.argv[2])).href) : null;
const flat = Object.fromEntries(Array.from({ length: 1000 }, (_, index) => [`field${index}`, index]));
const records = { rows: Array.from({ length: 256 }, (_, id) => ({ id, name: `item${id}`, tags: ['one', 'two'], active: true })) };
function inheritance(levels, methods) {
    let parent = class {};
    for (let level = 0; level < levels; ++level) {
        const child = class extends parent {};
        for (let index = 0; index < methods; ++index) {
            Object.defineProperty(child.prototype, `method${level}_${index}`, { value() {} });
        }
        parent = child;
    }
    return new parent();
}
const ordinaryClass = inheritance(3, 20);
const wideClass = inheritance(12, 128);
const expression = `[${Array.from({ length: 500 }, (_, index) => `{name: "item,${index}", values: [1,2], fn: f(1,2)}`).join(',')}]`;
const smallBefore = [0, 1, 2, 3, 4, 5, 6, 7];
const smallAfter = [4, 5, 6, 7, 8, 9, 10, 11];
const largeBefore = Array.from({ length: 10000 }, (_, index) => index);
const largeAfter = Array.from({ length: 10000 }, (_, index) => index + 5000);
const profiles = [
    { name: 'JSON scalar', iterations: 200000, run: module => module.isJson('value') },
    { name: 'JSON 1000 fields', iterations: 100, run: module => module.isJson(flat) },
    { name: 'JSON 256 records', iterations: 30, run: module => module.isJson(records) },
    { name: 'compar 8 / 8', iterations: 10000, run: module => module.compar(smallBefore, smallAfter) },
    { name: 'compar 10000 / 10000', iterations: 3, run: module => module.compar(largeBefore, largeAfter) },
    { name: 'compar 10000 / 8', iterations: 40, run: module => module.compar(largeBefore, smallAfter) },
    { name: 'prototype 3 x 20', iterations: 500, run: module => module.getClassPrototype(ordinaryClass) },
    { name: 'prototype 12 x 128', iterations: 30, run: module => module.getClassPrototype(wideClass) },
    { name: 'parse 500 expressions', iterations: 150, run: module => module.parseArrayString(expression) },
];
let sink;
const median = values => values.sort((left, right) => left - right)[Math.floor(values.length / 2)];
function measure(profile, module) {
    const start = performance.now();
    for (let index = 0; index < profile.iterations; ++index) sink = profile.run(module);
    return performance.now() - start;
}
const results = [];
for (const profile of profiles) {
    measure(profile, current);
    if (baseline) measure(profile, baseline);
    const oldTimes = [];
    const newTimes = [];
    for (let sample = 0; sample < 9; ++sample) {
        if (baseline && sample % 2) oldTimes.push(measure(profile, baseline));
        newTimes.push(measure(profile, current));
        if (baseline && !(sample % 2)) oldTimes.push(measure(profile, baseline));
    }
    const currentMs = median(newTimes);
    const baselineMs = baseline ? median(oldTimes) : null;
    results.push({ name: profile.name, iterations: profile.iterations, currentMs, baselineMs,
        speedup: baselineMs === null ? null : baselineMs / currentMs });
}
console.log(JSON.stringify({ runtime: process.version, samples: 9, statistic: 'median batch time in ms', results }, null, 2));
if (sink === undefined) throw Error('Benchmark did not execute');
