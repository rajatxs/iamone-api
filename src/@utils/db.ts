import { Db, MongoClient } from 'mongodb'
import env from './env'

var db: Db = null

/** Connect mongo client */
export function connect(): Promise<MongoClient> {
   return new Promise(function (resolve, reject) {
      MongoClient.connect(
         env.mongoConnectionUrl,
         function (error, client) {
            if (error) {
               return reject(error)
            }

            db = client.db()
            return resolve(client)
         }
      )
   })
}

/** Mongo database */
export function mongo() {
   return db
}
