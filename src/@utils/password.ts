import * as bcrypt from 'bcryptjs'

/** Generate password hash */
export async function generatePasswordHash(password: string) {
   const salt = await bcrypt.genSalt(10)
   return await bcrypt.hash(password, salt)
}

/** Generate password hash and assign to provided object */
export async function setPasswordHash<T>(val: T): Promise<T> {
   val['passwordHash'] = await generatePasswordHash(val['password'])
   delete val['password']

   return val
}

/** Compare password with hash */
export function comparePassword(password: string, passwordHash: string) {
   return bcrypt.compare(password, passwordHash)
}
