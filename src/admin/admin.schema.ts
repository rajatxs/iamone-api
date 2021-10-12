import * as Joi from 'joi'
import { fullName, email, bio, password } from '@validations/common'

export const createAdminSchema = Joi.object({
   fullname: fullName.required(),
   email: email.required(),
   bio: bio.optional(),
   password: password.required()
})

export const authTokenRequestAdminSchema = Joi.object({
   email: email.required(),
   password: password.required()
})
