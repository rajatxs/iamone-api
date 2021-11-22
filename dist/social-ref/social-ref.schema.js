"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.createSchema = void 0;
const Joi = require("joi");
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
    .max(120)
    .default(1);
const socialServiceKey = Joi
    .string()
    .min(2)
    .max(12)
    .alphanum()
    .trim();
exports.createSchema = Joi.object({
    label: label.optional(),
    slug: slug.required(),
    index,
    socialServiceKey: socialServiceKey.required()
});
exports.updateSchema = Joi.object({
    label: label.optional(),
    slug: slug.optional(),
    index,
    socialServiceKey: socialServiceKey.optional()
});
