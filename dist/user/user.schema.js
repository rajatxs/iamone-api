"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchema = exports.passwordResetSchema = exports.emailVerificationSchema = exports.passwordUpdateSchema = exports.emailUpdateSchema = exports.usernameUpdateSchema = exports.updateSchema = exports.createSchema = void 0;
const Joi = require("joi");
const common_1 = require("../@validations/common");
exports.createSchema = Joi.object({
    fullname: common_1.fullName.optional(),
    bio: common_1.bio.optional(),
    location: common_1.location.default(''),
    username: common_1.username.required(),
    email: common_1.email.required(),
    password: common_1.password.required()
});
exports.updateSchema = Joi.object({
    fullname: common_1.fullName.allow('').optional(),
    bio: common_1.bio.allow('').optional(),
    location: common_1.location.allow('').optional()
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
exports.emailVerificationSchema = Joi.object({
    code: Joi.string().min(4).max(10).required()
});
exports.passwordResetSchema = Joi.object({
    email: common_1.email.required(),
    password: common_1.password.required(),
    code: common_1.code.required()
});
exports.verifySchema = Joi.object({
    username: common_1.username.optional(),
    email: common_1.email.optional(),
    password: common_1.password.optional()
});
