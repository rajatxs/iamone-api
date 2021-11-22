"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alphaNumeric = void 0;
function alphaNumeric(length = 8) {
    const v = Array(length)
        .fill(0)
        .map(() => Math.random().toString(36).charAt(2))
        .join('');
    return v;
}
exports.alphaNumeric = alphaNumeric;
