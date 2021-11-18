import { genSalt, hash } from 'bcryptjs'
import { ObjectId } from 'mongodb'

/** Generate password hash */
export async function setPasswordHash<T>(val: T): Promise<T> {
   const salt = await genSalt(10)

   val['passwordHash'] = await hash(val['password'], salt)
   delete val['password']

   return val
}

/** Convert to Doc Id */
export function toDocId(id: string | DocId): DocId {
   return (id instanceof ObjectId)? id : new ObjectId(id)
}
