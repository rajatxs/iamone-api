import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class User extends Document {
   @Prop()
   username: string

   @Prop()
   age: number
}

export const UserSchema = SchemaFactory.createForClass(User)
