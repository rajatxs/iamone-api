import * as Joi from 'joi'
import { ObjectId } from 'mongodb'

export const docId = Joi
   .string()
   .length(24)
   .custom((value: string) => new ObjectId(value))

export const username = Joi
   .string()
   .min(2)
   .max(30)
   .pattern(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)

export const fullName = Joi
   .string()
   .min(2)
   .max(60)
   .trim()

export const companyName = Joi
   .string()
   .min(2)
   .max(160)
   .trim()

export const bio = Joi
   .string()
   .max(180)
   .trim()

export const plainText = Joi
   .string()
   .min(1)
   .trim()

export const email = Joi
   .string()
   .email()
   .trim()

export const password = Joi
   .string()
   .min(6)
   .max(64)

export const website = Joi
   .string()
   .uri({ 
      allowQuerySquareBrackets: false, 
      allowRelative: false 
   })
   .max(253)
   .trim()

export const message = Joi
   .string()
   .trim()

export const mixedPhone = Joi
   .string()
   .pattern(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/)
   .error(new Error("Invalid phone"))

export const githubUsername = Joi
   .string()
   .pattern(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
   .error(new Error("Invalid GitHub username"))
