import { Injectable } from '@nestjs/common'
import { AppModel } from '@classes/AppModel'
import { generateIncrementedTimeByMinutes, compareTimeDurationBelow } from '@utils/common'
import { PartialVerification, Verification, VerificationType } from './verification.interface'
import { InsertOneResult, UpdateResult } from 'mongodb'

@Injectable()
export class VerificationService extends AppModel {
   public constructor() {
      super('verificationCodes')
   }

   /** Save given verification code to collection */
   async saveVerificationCode(type: VerificationType, userId: DocId, code: string, duration: string | number = 5) {
      let result: InsertOneResult | UpdateResult
      let hasRecord: boolean

      duration = String(generateIncrementedTimeByMinutes(Number(duration)))

      hasRecord = await this.$exists<PartialVerification>({ userId, type })

      if (hasRecord) {
         result = await this.model.updateOne({ userId, type }, { $set: { code, duration } })
      } else {
         result = await this.$insert<Verification>({
            type,
            code,
            duration,
            userId,
         })
      }

      return result.acknowledged
   }

   /** Verify code by specified userId */
   async verifyCode(type: VerificationType, userId: DocId, code: string) {
      let record: PartialVerification
      
      userId = this.$docId(userId)
      code = String(code)

      record = await this.model.findOne<PartialVerification>({ userId, type, code })

      if (!record) {
         return false
      }

      // check code expiration
      if (!compareTimeDurationBelow(Number(record.duration))) {
         return false
      }

      await this.$deleteById(record._id)

      return true
   }
}
