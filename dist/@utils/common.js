"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDocId = void 0;
const mongodb_1 = require("mongodb");
function toDocId(id) {
    return (id instanceof mongodb_1.ObjectId) ? id : new mongodb_1.ObjectId(id);
}
exports.toDocId = toDocId;
