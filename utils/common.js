import { ObjectId } from 'mongodb';
import { readFile } from 'fs';

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

/**
 * Read file content
 * @param {string} path
 * @param {string|null} encoding
 */
export function readFileContent(path, encoding) {
   return new Promise((resolve, reject) => {
      // @ts-ignore
      readFile(path, { encoding, flag: 'r' }, (error, data) => {
         if (error) {
            return reject(error);
         }

         resolve(data);
      });
   });
}
