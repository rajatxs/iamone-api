import * as bcrypt from 'bcryptjs';

/**
 * Generate password hash
 * @param {string} password
 */
export async function generatePasswordHash(password) {
   const salt = await bcrypt.genSalt(10);
   return await bcrypt.hash(password, salt);
}

/**
 * Generate password hash and assign to provided object
 * @param {object} val
 * @returns {Promise<object>}
 */
export async function setPasswordHash(val) {
   val['passwordHash'] = await generatePasswordHash(val['password']);
   delete val['password'];

   return val;
}

/**
 * Compare password with hash
 * @param {string} password
 * @param {string} passwordHash
 */
export function comparePassword(password, passwordHash) {
   return bcrypt.compare(password, passwordHash);
}
