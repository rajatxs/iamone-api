import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './user.entity'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
   public constructor(@InjectModel('users') private readonly userService: Model<User>) { }

   public async create(data: any) {
      if (typeof data.password_hash === 'string' && data.password_hash.length > 0) {
         const salt = await bcrypt.genSalt(10)
         data.password_hash = await bcrypt.hash(data.password_hash, salt)
      }
      return {}
   }

   public findAll() {
      return this.userService.find()
   }

   public hasEmail(email: string) {
      return false
   }

   public hasUsername(username: string) {
      return false
   }
}
