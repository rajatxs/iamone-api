import { Injectable } from '@nestjs/common'
import { Filter } from 'mongodb'
import { AppModel, timestampType } from '@classes/AppModel'
import { User } from './user.interface'

@Injectable()
export class UserService extends AppModel {
   public constructor() { super('users', { timestamps: timestampType.ALL }) }

   /** Create new user account */
   public async create(data: User) {
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

   /** Check existance of user by id */
   public has(id: string | DocId) {
      return this.$existsId(id)
   }

   /** Find user by _id */
   public get(id: string | DocId) {
      return this.$findById<User>(id)
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
