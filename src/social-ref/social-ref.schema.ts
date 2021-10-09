import * as Joi from 'joi'

const label = Joi 
   .string()
   .min(1)
   .max(18)
   .trim()

const slug = Joi
   .string()
   .min(1)
   .max(120)

const index = Joi
   .number()
   .min(1)
   .max(120)
   .default(1)

const socialServiceKey = Joi
   .string()
   .min(2)
   .max(12)
   .alphanum()
   .trim()

export const createSchema = Joi.object({
   label: label.optional(),
   slug: slug.required(),
   index,
   socialServiceKey: socialServiceKey.required()
})

export const updateSchema = Joi.object({
   label: label.optional(),
   slug: slug.optional(),
   index,
   socialServiceKey: socialServiceKey.optional()
})
