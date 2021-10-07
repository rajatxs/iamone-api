import * as Joi from 'joi'
import { } from '@validations/common'

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

const about = Joi
   .string()
   .min(5)
   .max(250)
   .trim()

const website = Joi
   .string()
   .uri({ 
      allowQuerySquareBrackets: false, 
      allowRelative: false 
   })
   .max(253)
   .trim()

const templateUrl = Joi
   .string()
   .max(2000)
   .trim()

export const createSchema = Joi.object({
   name: name.required(),
   icon: icon.required(),
   about: about.optional(),
   website: website.optional(),
   templateUrl: templateUrl.required()
})

export const updateSchema = Joi.object({
   name: name.optional(),
   icon: icon.optional(),
   about: about.optional(),
   website: website.optional(),
   templateUrl: templateUrl.optional()
})
