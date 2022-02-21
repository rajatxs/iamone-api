import Joi from 'joi'

const title = Joi
   .string()
   .max(96)
   .trim()
   .allow('');

const description = Joi
   .string()
   .min(1)
   .max(1000)
   .allow('');

const tags = Joi
   .array()
   .max(12);

const templateName = Joi
   .string()
   .max(120)
   .trim();

const theme = Joi
   .string()
   .max(120)
   .trim();

const themeMode = Joi
   .string()
   .valid('LIGHT', 'DARK', 'AUTO');

const styles = Joi.object();

export const updateSchema = Joi.object({
   title: title.optional(),
   description: description.optional(),
   tags: tags.optional(),
   watermark: Joi.bool().optional(),
   theme: theme.optional(),
   templateName: templateName.optional(),
   themeMode: themeMode.optional(),
   styles: styles.optional()
});
