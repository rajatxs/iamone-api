import logger from './logger.js';
import { Db, MongoClient } from 'mongodb';
import { MONGO_CONNECTION_URL } from './env.js';

/** @type {MongoClient} */
var client;

/** @type {Db} */
var db;

/**
 * Connect mongo client
 * @returns {Promise<MongoClient>}
 */
export function connect() {
   client = new MongoClient(MONGO_CONNECTION_URL);
   db = client.db();

   client.on('open', () => logger.info('MongoDB', "Connected"));
   client.on('serverClosed', () => logger.info("MongoDB", "Disconnected"));

   return client.connect();
}

/**
 * Mongo database
 * @returns {Db}
 */
export function mongo() {
   return db;
}

/** Close MongoDB Connection */
export function disconnect() {
   return client.close();
}
