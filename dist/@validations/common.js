"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.code = exports.githubUsername = exports.mixedPhone = exports.message = exports.website = exports.password = exports.email = exports.plainText = exports.bio = exports.companyName = exports.location = exports.fullName = exports.username = exports.docId = void 0;
const Joi = require("joi");
const mongodb_1 = require("mongodb");
exports.docId = Joi
    .string()
    .length(24)
    .custom((value) => new mongodb_1.ObjectId(value));
exports.username = Joi
    .string()
    .min(2)
    .max(30)
    .pattern(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)
    .lowercase();
exports.fullName = Joi
    .string()
    .min(2)
    .max(60)
    .trim();
exports.location = Joi
    .string()
    .max(80)
    .trim();
exports.companyName = Joi
    .string()
    .min(2)
    .max(160)
    .trim();
exports.bio = Joi
    .string()
    .max(180)
    .trim()
    .allow('');
exports.plainText = Joi
    .string()
    .min(1)
    .trim();
exports.email = Joi
    .string()
    .email()
    .trim();
exports.password = Joi
    .string()
    .min(6)
    .max(64);
exports.website = Joi
    .string()
    .uri({
    allowQuerySquareBrackets: false,
    allowRelative: false
})
    .max(253)
    .trim();
exports.message = Joi
    .string()
    .trim();
exports.mixedPhone = Joi
    .string()
    .pattern(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/)
    .error(new Error("Invalid phone"));
exports.githubUsername = Joi
    .string()
    .pattern(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
    .error(new Error("Invalid GitHub username"));
exports.code = Joi
    .string()
    .alphanum()
    .min(4)
    .max(10);
