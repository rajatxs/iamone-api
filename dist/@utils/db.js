"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.mongo = exports.connect = void 0;
const mongodb_1 = require("mongodb");
const env_1 = require("./env");
var client;
var db = null;
function connect() {
    client = new mongodb_1.MongoClient(env_1.default.mongoConnectionUrl);
    db = client.db();
    return client.connect();
}
exports.connect = connect;
function mongo() {
    return db;
}
exports.mongo = mongo;
function disconnect() {
    return client.close();
}
exports.disconnect = disconnect;
