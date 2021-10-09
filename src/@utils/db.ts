import { Db, MongoClient } from 'mongodb'

var db: Db = null

/** Connect mongo client */
export function connect(): Promise<MongoClient> {
   return new Promise(function (resolve, reject) {
      MongoClient.connect(
         'mongodb://127.0.0.1:27017/im1',
         {

         },
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
