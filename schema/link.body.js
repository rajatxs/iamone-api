import Joi from 'joi'

const title = Joi
   .string()
   .min(1)
   .max(180)
   .trim()
   .truncate(true);

const description = Joi
   .string()
   .max(250)
   .truncate(true)
   .allow('');

const index = Joi
   .number()
   .min(1)
   .max(120);

const uri = Joi
   .string()
   .uri({
      allowRelative: false
   })
   .min(3)
   .max(1200)
   .trim();

const thumb = Joi.string().min(3).max(1200).trim().allow('');

const favicon = Joi.string().min(3).max(1200).trim().allow('');

const href = uri;

const style = Joi
   .allow(
      'simple', 
      'thumb',
      'background',
      'card',
      'grid',
      'slider'
   )
   .only();

export const createSchema = Joi.object({
   title: title.required(),
   description: description.optional(),
   index: index.default(1),
   thumb: thumb.optional(),
   href: href.required(),
   style: style.default('simple'),
   favicon: favicon.optional(),
});

export const updateSchema = Joi.object({
   title: title.optional(),
   description: description.optional(),
   index,
   thumb: thumb.optional(),
   href: href.optional(),
   style: style.optional(),
   favicon: favicon.optional()
});
