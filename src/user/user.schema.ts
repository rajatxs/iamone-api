import * as Joi from 'joi'
import { 
   fullName, 
   bio, 
   companyName,
   username, 
   email, 
   password 
} from '@validations/common'

export const createSchema = Joi.object({
   fullname: fullName.optional(),
   bio: bio.optional(),
   company: companyName.optional(),
   username: username.required(),
   email: email.required(),
   password: password.required()
})

export const updateSchema = Joi.object({
   fullname: fullName.optional(),
   bio: bio.optional(),
   company: companyName.optional()
})

export const verifySchema = Joi.object({
   username: username.optional(),
   email: email.optional(),
   password: password.optional()
})
