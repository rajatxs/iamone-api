import { Injectable } from '@nestjs/common'
import { AppModalService } from '@classes/app-modal'
import { User } from './user.interface'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService extends AppModalService {
   public constructor() { super('users') }

   public async create(data: User) {
      if (typeof data.password_hash === 'string' && data.password_hash.length > 0) {
         const salt = await bcrypt.genSalt(10)
         data.password_hash = await bcrypt.hash(data.password_hash, salt)
      }
      return this.$insertOne(data)
   }

   public hasEmail(email: string) {
      return this.$existsOneRow('email', email)
   }

   public hasUsername(username: string) {
      return this.$existsOneRow('username', username)
   }
}
