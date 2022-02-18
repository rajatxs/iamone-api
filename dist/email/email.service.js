"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mail_1 = require("../@utils/mail");
const email_config_1 = require("./email.config");
let EmailService = class EmailService {
    sendWelcomeEmail(name, email) {
        return mail_1.mail.send({
            from: email_config_1.senders.milestoneEmailSender,
            to: { name, email },
            templateId: email_config_1.templateIds.WELCOME_EMAIL_TEMPLATE_ID,
            dynamicTemplateData: { name, email }
        });
    }
    sendEmailVerificationCode(name, email, code) {
        return mail_1.mail.send({
            from: email_config_1.senders.milestoneEmailSender,
            to: { name, email },
            templateId: email_config_1.templateIds.EMAIL_VERIFICATION_CODE_TEMPLATE_ID,
            dynamicTemplateData: {
                name,
                email,
                code
            }
        });
    }
    sendPasswordResetCode(name, email, code) {
        return mail_1.mail.send({
            from: email_config_1.senders.milestoneEmailSender,
            to: { name, email },
            templateId: email_config_1.templateIds.PASSWORD_RESET_CODE_TEMPLATE_ID,
            dynamicTemplateData: {
                name,
                email,
                code
            }
        });
    }
};
EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
exports.EmailService = EmailService;
