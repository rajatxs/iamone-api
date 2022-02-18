"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileContent = exports.compareTimeDurationBelow = exports.generateIncrementedTimeByMinutes = exports.toDocId = void 0;
const mongodb_1 = require("mongodb");
const fs_1 = require("fs");
function toDocId(id) {
    return (id instanceof mongodb_1.ObjectId) ? id : new mongodb_1.ObjectId(id);
}
exports.toDocId = toDocId;
function generateIncrementedTimeByMinutes(minutes) {
    const current = new Date();
    const target = new Date();
    target.setMinutes(current.getMinutes() + minutes);
    return target.getTime();
}
exports.generateIncrementedTimeByMinutes = generateIncrementedTimeByMinutes;
function compareTimeDurationBelow(time) {
    const current = new Date();
    const target = new Date(time);
    return current.getTime() < target.getTime();
}
exports.compareTimeDurationBelow = compareTimeDurationBelow;
function readFileContent(path, encoding) {
    return new Promise((resolve, reject) => {
        (0, fs_1.readFile)(path, { encoding, flag: 'r' }, (error, data) => {
            if (error) {
                return reject(error);
            }
            resolve(data);
        });
    });
}
exports.readFileContent = readFileContent;
