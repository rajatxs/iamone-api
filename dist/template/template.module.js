"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateModule = void 0;
const common_1 = require("@nestjs/common");
const template_service_1 = require("./template.service");
const clink_module_1 = require("../clink/clink.module");
const clink_service_1 = require("../clink/clink.service");
const social_service_service_1 = require("../social-service/social-service.service");
const social_ref_module_1 = require("../social-ref/social-ref.module");
const social_ref_service_1 = require("../social-ref/social-ref.service");
const social_service_module_1 = require("../social-service/social-service.module");
const user_module_1 = require("../user/user.module");
const user_service_1 = require("../user/user.service");
const template_middleware_1 = require("./template.middleware");
const page_config_service_1 = require("../page-config/page-config.service");
const template_controller_1 = require("./template.controller");
const theme_service_1 = require("../theme/theme.service");
let TemplateModule = class TemplateModule {
    configure(consumer) {
        consumer
            .apply(template_middleware_1.TemplateMiddleware)
            .forRoutes(':username');
    }
};
TemplateModule = __decorate([
    (0, common_1.Module)({
        imports: [
            social_ref_module_1.SocialRefModule,
            social_service_module_1.SocialServiceModule,
            clink_module_1.ClinkModule,
            user_module_1.UserModule
        ],
        providers: [
            template_service_1.TemplateService,
            social_ref_service_1.SocialRefService,
            social_service_service_1.SocialServiceProvider,
            clink_service_1.ClinkService,
            user_service_1.UserService,
            page_config_service_1.PageConfigService,
            theme_service_1.ThemeService
        ],
        controllers: [template_controller_1.TemplateController],
    })
], TemplateModule);
exports.TemplateModule = TemplateModule;
