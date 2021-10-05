import { Injectable } from '@nestjs/common'
import { Filter } from 'mongodb'
import { AppModel, timestampType } from '@classes/AppModel'
import { User } from './user.interface'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService extends AppModel {
   public constructor() { super('users', { timestamps: timestampType.ALL }) }

   /** Create new user account */
   public async create(data: User) {

      // generate password hash
      if (typeof data.passwordHash === 'string' && data.passwordHash.length > 0) {
         const salt = await bcrypt.genSalt(10)
         data.passwordHash = await bcrypt.hash(data.passwordHash, salt)
      }

      // should be unverified for new user
      data.emailVerified = false

      return this.$insert<User>(data)
   }

   /** Check uniqueness of email */
   public hasEmail(email: string) {
      return this.$exists({ email })
   }

   /** Check uniqueness of username */
   public hasUsername(username: string) {
      return this.$exists({ username })
   }

   /** Find single user document */
   public findOne(filter: Filter<User>) {
      return this.model.findOne<User>(filter)
   }

   /** Find user by username of email */
   public findByUsernameOrEmail(username?: string, email?: string) {
      return this.model.findOne<User>({ $or: [{ username }, { email }] })
   }
}
