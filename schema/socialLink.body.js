import Joi from 'joi'

const label = Joi 
   .string()
   .max(18)
   .trim()
   .allow('');

const slug = Joi
   .string()
   .min(1)
   .max(120);

const index = Joi
   .number()
   .min(1)
   .max(120);

const platformKey = Joi
   .string()
   .min(2)
   .max(12)
   .alphanum()
   .trim();

export const createSchema = Joi.object({
   label: label.optional(),
   slug: slug.required(),
   index: index.default(1),
   platformKey: platformKey.required()
});

export const updateSchema = Joi.object({
   label: label.optional(),
   slug: slug.optional(),
   index,
   platformKey: platformKey.optional()
});
