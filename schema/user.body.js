import Joi from 'joi';
import {
   fullName,
   bio,
   location,
   username,
   email,
   password,
   code,
} from '../utils/regex.js';

export const createSchema = Joi.object({
   fullname: fullName.optional(),
   bio: bio.optional(),
   location: location.default(''),
   username: username.required(),
   email: email.required(),
   password: password.required(),
});

export const updateSchema = Joi.object({
   fullname: fullName.allow('').optional(),
   bio: bio.allow('').optional(),
   location: location.allow('').optional(),
});

export const usernameUpdateSchema = Joi.object({
   username: username.required(),
});

export const emailUpdateSchema = Joi.object({
   email: email.required(),
});

export const passwordUpdateSchema = Joi.object({
   currentPassword: password.required(),
   newPassword: password.required(),
});

export const emailVerificationSchema = Joi.object({
   code: Joi.string().min(4).max(10).required(),
});

export const passwordResetRequestSchema = Joi.object({
   email: email.required(),
});

export const passwordResetSchema = Joi.object({
   email: email.required(),
   password: password.required(),
   code: code.required(),
});

export const verifySchema = Joi.object({
   username: username.optional(),
   email: email.optional(),
   password: password.optional(),
});
