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

export const usernameUpdateSchema = Joi.object({
   username: username.required()
})

export const emailUpdateSchema = Joi.object({
   email: email.required()
})

export const passwordUpdateSchema = Joi.object({
   currentPassword: password.required(),
   newPassword: password.required()
})

export const emailVerificationSchema = Joi.object({
   code: Joi.string().min(4).max(10).required()
})

export const verifySchema = Joi.object({
   username: username.optional(),
   email: email.optional(),
   password: password.optional()
})
