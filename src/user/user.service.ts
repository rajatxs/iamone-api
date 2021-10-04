import { Injectable } from '@nestjs/common'
import { User } from './user.interface'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
   public async create(data: User) {
      if (typeof data.password_hash === 'string' && data.password_hash.length > 0) {
         const salt = await bcrypt.genSalt(10)
         data.password_hash = await bcrypt.hash(data.password_hash, salt)
      }
      return {}
   }

   public hasEmail(email: string) {
      return false
   }

   public hasUsername(username: string) {
      return false
   }
}
