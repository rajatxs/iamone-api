import * as Joi from 'joi'
import { username, email, password } from '@validations/common' 

export const createSchema = Joi.object({
   username: username.required(),
   email: email.required(),
   password: password.required()
})
