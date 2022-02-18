"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTokenRequestAdminSchema = exports.createAdminSchema = void 0;
const Joi = require("joi");
const common_1 = require("../@validations/common");
exports.createAdminSchema = Joi.object({
    fullname: common_1.fullName.required(),
    email: common_1.email.required(),
    bio: common_1.bio.optional(),
    password: common_1.password.required()
});
exports.authTokenRequestAdminSchema = Joi.object({
    email: common_1.email.required(),
    password: common_1.password.required()
});
