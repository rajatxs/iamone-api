import { genSalt, hash } from 'bcryptjs'

/** Generate password hash */
export async function setPasswordHash<T>(val: T): Promise<T> {
   const salt = await genSalt(10)

   val['passwordHash'] = await hash(val['password'], salt)
   delete val['password']

   return val
}
