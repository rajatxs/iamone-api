import { ObjectId } from 'mongodb'

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

   console.log(current.toTimeString(), target.toTimeString())

   return current.getTime() < target.getTime()
}
