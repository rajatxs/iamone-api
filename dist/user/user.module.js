"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const http_request_middleware_1 = require("../http-request/http-request.middleware");
const social_ref_module_1 = require("../social-ref/social-ref.module");
const social_ref_service_1 = require("../social-ref/social-ref.service");
const auth_module_1 = require("../auth/auth.module");
const clink_module_1 = require("../clink/clink.module");
const clink_service_1 = require("../clink/clink.service");
const site_meta_service_1 = require("../clink/site-meta.service");
let UserModule = class UserModule {
    configure(consumer) {
        consumer
            .apply(http_request_middleware_1.HttpRequestMiddleware)
            .forRoutes('/user');
    }
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            social_ref_module_1.SocialRefModule,
            clink_module_1.ClinkModule,
        ],
        providers: [
            user_service_1.UserService,
            social_ref_service_1.SocialRefService,
            clink_service_1.ClinkService,
            site_meta_service_1.SiteMetaService
        ],
        controllers: [user_controller_1.UserController],
        exports: [social_ref_service_1.SocialRefService, user_service_1.UserService, clink_service_1.ClinkService]
    })
], UserModule);
exports.UserModule = UserModule;
