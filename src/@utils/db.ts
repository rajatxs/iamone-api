import { Db, MongoClient } from 'mongodb'
import env from './env'

var client: MongoClient 
var db: Db = null

/** Connect mongo client */
export function connect(): Promise<MongoClient> {
   client = new MongoClient(env.mongoConnectionUrl)
   db = client.db()
   return client.connect()
}

/** Mongo database */
export function mongo(): Db {
   return db
}

/** Close MongoDB Connection */
export function disconnect() {
   return client.close()
}
