import * as Joi from 'joi'

export const username = Joi
   .string()
   .min(2)
   .max(30)
   .pattern(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)
   .truncate(true)
   .label('Username')

export const fullName = Joi
   .string()
   .min(2)
   .max(60)
   .trim()
   .label("Full name")
   .truncate(true)

export const email = Joi
   .string()
   .email()
   .trim()
   .truncate(true)
   .label("Email")

export const password = Joi
   .string()
   .min(6)
   .max(64)
   .label('Password')

export const rowId = Joi
   .number()
   .min(1)
   .strict(true)

export const message = Joi
   .string()
   .label("Message")
   .trim()

export const mixedPhone = Joi
   .string()
   .pattern(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/)
   .error(new Error("Invalid phone"))
   .label("Phone")

export const githubUsername = Joi
   .string()
   .pattern(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
   .error(new Error("Invalid GitHub username"))
   .label("GitHub username")
