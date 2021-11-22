"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchema = exports.passwordUpdateSchema = exports.emailUpdateSchema = exports.usernameUpdateSchema = exports.updateSchema = exports.createSchema = void 0;
const Joi = require("joi");
const common_1 = require("../@validations/common");
exports.createSchema = Joi.object({
    fullname: common_1.fullName.optional(),
    bio: common_1.bio.optional(),
    company: common_1.companyName.optional(),
    username: common_1.username.required(),
    email: common_1.email.required(),
    password: common_1.password.required()
});
exports.updateSchema = Joi.object({
    fullname: common_1.fullName.optional(),
    bio: common_1.bio.optional(),
    company: common_1.companyName.optional()
});
exports.usernameUpdateSchema = Joi.object({
    username: common_1.username.required()
});
exports.emailUpdateSchema = Joi.object({
    email: common_1.email.required()
});
exports.passwordUpdateSchema = Joi.object({
    currentPassword: common_1.password.required(),
    newPassword: common_1.password.required()
});
exports.verifySchema = Joi.object({
    username: common_1.username.optional(),
    email: common_1.email.optional(),
    password: common_1.password.optional()
});
