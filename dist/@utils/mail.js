"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mail = exports.setEmailApiKey = void 0;
const sgMail = require("@sendgrid/mail");
const env_1 = require("./env");
function setEmailApiKey() {
    sgMail.setApiKey(env_1.default.sendgridApiKey);
}
exports.setEmailApiKey = setEmailApiKey;
exports.mail = sgMail;
