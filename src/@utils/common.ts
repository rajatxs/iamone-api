import { ObjectId } from 'mongodb'
import { readFile } from "fs"

/** Convert to Doc Id */
export function toDocId(id: string | DocId): DocId {
   return (id instanceof ObjectId)? id : new ObjectId(id)
}

/** Generate time duration above given minutes */
export function generateIncrementedTimeByMinutes(minutes: number): number {
   const current = new Date()
   const target = new Date()

   target.setMinutes(current.getMinutes() + minutes)

   return target.getTime()
}

/** Compare time duration below given time */
export function compareTimeDurationBelow(time: number) {
   const current = new Date()
   const target = new Date(time)

   return current.getTime() < target.getTime()
}

export function readFileContent(path: string, encoding: string | null) {
   return new Promise((resolve, reject) => {
      // @ts-ignore
      readFile(path, { encoding, flag: 'r' }, (error, data) => {
         if (error) {
            return reject(error)
         }

         resolve(data)
      })
   })
}
