"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.setPasswordHash = exports.generatePasswordHash = void 0;
const bcrypt = require("bcryptjs");
async function generatePasswordHash(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
exports.generatePasswordHash = generatePasswordHash;
async function setPasswordHash(val) {
    val['passwordHash'] = await generatePasswordHash(val['password']);
    delete val['password'];
    return val;
}
exports.setPasswordHash = setPasswordHash;
function comparePassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}
exports.comparePassword = comparePassword;
