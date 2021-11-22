"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.createSchema = void 0;
const Joi = require("joi");
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
const uri = Joi
    .string()
    .uri({
    allowRelative: false
})
    .min(3)
    .max(1200)
    .trim();
const thumb = uri.allow('');
const favicon = uri.allow('');
const href = uri;
const style = Joi
    .allow('simple', 'thumb', 'background', 'card', 'grid', 'slider')
    .only();
exports.createSchema = Joi.object({
    title: title.required(),
    description: description.optional(),
    thumb: thumb.optional(),
    href: href.required(),
    style: style.default('simple'),
    favicon: favicon.optional(),
});
exports.updateSchema = Joi.object({
    title: title.optional(),
    description: description.optional(),
    thumb: thumb.optional(),
    href: href.optional(),
    style: style.optional(),
    favicon: favicon.optional()
});
