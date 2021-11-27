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

   /** Generate user email verification code */
   async saveEmailVerificationCode(userId: DocId, code: string) {
      const type = VerificationType.EMAIL_VERIFICATION
      const duration = String(generateIncrementedTimeByMinutes(10))
      let result: InsertOneResult | UpdateResult
      let hasRecord: boolean

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

   /** Verify email verification code */
   async verifyEmailVerificationCode(userId: DocId | string, code: string | number): Promise<boolean> {
      let record: PartialVerification
   
      userId = this.$docId(userId)
      code = String(code)

      record = await this.model.findOne<Verification>({ userId, code })

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
