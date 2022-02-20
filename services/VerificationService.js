import { AppModel } from '../classes/AppModel.js';
import {
   generateIncrementedTimeByMinutes,
   compareTimeDurationBelow,
} from '../utils/common.js';

/**
 * @typedef Verification
 * @property {VerificationType} type
 * @property {string} code
 * @property {string} [duration]
 * @property {DocId} [userId]
 */

export const VerificationType = {
   EMAIL_VERIFICATION: '1',
   PASSWORD_RESET: '2',
};

export class VerificationService extends AppModel {
   constructor() {
      super('verificationCodes');
   }

   /**
    * Save given verification code to collection
    * @param {VerificationType} type
    * @param {DocId} userId
    * @param {string} code
    * @param {string|number} duration
    */
   async saveVerificationCode(type, userId, code, duration = 5) {
      let result, hasRecord;

      duration = String(generateIncrementedTimeByMinutes(Number(duration)));
      hasRecord = await this.$exists({ userId, type });

      if (hasRecord) {
         result = await this.model.updateOne(
            { userId, type },
            { $set: { code, duration } }
         );
      } else {
         result = await this.$insert({
            type,
            code,
            duration,
            userId,
         });
      }

      return result.acknowledged;
   }

   /**
    * Verify code by specified userId
    * @param {VerificationType} type
    * @param {DocId} userId
    * @param {string} code
    */
   async verifyCode(type, userId, code) {
      let record;

      userId = this.$docId(userId);
      code = String(code);

      record = await this.model.findOne({ userId, type, code });

      if (!record) {
         return false;
      }

      // check code expiration
      if (!compareTimeDurationBelow(Number(record.duration))) {
         return false;
      }

      await this.$deleteById(record._id);

      return true;
   }
}
