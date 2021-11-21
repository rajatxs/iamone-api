import { ObjectId } from 'mongodb'

/** Convert to Doc Id */
export function toDocId(id: string | DocId): DocId {
   return (id instanceof ObjectId)? id : new ObjectId(id)
}
