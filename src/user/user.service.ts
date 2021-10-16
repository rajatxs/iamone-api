import { Injectable } from '@nestjs/common'
import { Filter, FindOptions } from 'mongodb'
import { AppModel, timestampType } from '@classes/AppModel'
import { User } from './user.interface'
import { SocialRefService } from '../social-ref/social-ref.service'

@Injectable()
export class UserService extends AppModel {
   protected get findOptions() {
      return <FindOptions>{
         sort: { createdAt: -1 },
         limit: 10,
         skip: 0,
         projection: {
            passwordHash: 0,
            httpRequestId: 0
         }
      }
   }

   public constructor(
      private readonly socialRefService: SocialRefService
   ) { super('users', { timestamps: timestampType.ALL }) }

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
      return this.$findById<User>(id, this.findOptions)
   }

   /** Find single user document */
   public findOne(filter: Filter<User>) {
      return this.model.findOne<User>(filter, this.findOptions)
   }

   /** Find all users */
   public findAll(filter?: Filter<User>) {
      return this.model
         .find<User>(filter, this.findOptions)
         .toArray()
   }

   /** Find user by username of email */
   public findByUsernameOrEmail(username?: string, email?: string) {
      return this.model.findOne<User>({ $or: [{ username }, { email }] })
   }

   /** Delete user generated data */
   public async deleteById(userId: string | DocId) {
      userId = this.$oid(userId)

      // remove all social refs 
      await this.socialRefService.removeManyByUserId(userId)

      // remove user data
      await this.$deleteById(userId)

      return true
   }
}
