import { ObjectId } from 'mongodb';

/**
 * Convert to Doc Id
 * @param {string | DocId} id
 * @returns {DocId}
 */
export function toDocId(id) {
   return id instanceof ObjectId ? id : new ObjectId(id);
}

/**
 * Generate time duration above given minutes
 * @param {number} minutes
 * @returns {number}
 */
export function generateIncrementedTimeByMinutes(minutes) {
   const current = new Date();
   const target = new Date();

   target.setMinutes(current.getMinutes() + minutes);

   return target.getTime();
}

/**
 * Compare time duration below given time
 * @param {number} time
 */
export function compareTimeDurationBelow(time) {
   const current = new Date();
   const target = new Date(time);

   return current.getTime() < target.getTime();
}
