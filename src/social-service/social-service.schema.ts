import * as Joi from 'joi'
import { website, plainText } from '@validations/common'
import { alphaNumeric } from '@utils/random'

const name = Joi
   .string()
   .min(2)
   .max(80)
   .trim()

const icon = Joi
   .string()
   .min(3)
   .max(80)
   .trim()

const key = Joi
   .string()
   .min(2)
   .max(12)
   .alphanum()
   .trim()

const about = plainText.max(180)

const templateUrl = Joi
   .string()
   .max(2000)
   .trim()

export const createSchema = Joi.object({
   key: key.default(alphaNumeric),
   name: name.required(),
   icon: icon.required(),
   about: about.optional(),
   website: website.optional(),
   templateUrl: templateUrl.required()
})

export const updateSchema = Joi.object({
   key: key.optional(),
   name: name.optional(),
   icon: icon.optional(),
   about: about.optional(),
   website: website.optional(),
   templateUrl: templateUrl.optional()
})
