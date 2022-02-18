"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const serve_static_1 = require("@nestjs/serve-static");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("./auth/auth.guard");
const app_controller_1 = require("./app.controller");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const social_ref_module_1 = require("./social-ref/social-ref.module");
const social_service_module_1 = require("./social-service/social-service.module");
const admin_module_1 = require("./admin/admin.module");
const template_module_1 = require("./template/template.module");
const clink_module_1 = require("./clink/clink.module");
const page_config_module_1 = require("./page-config/page-config.module");
const theme_module_1 = require("./theme/theme.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            serve_static_1.ServeStaticModule.forRoot({
                serveRoot: '/_/static',
                rootPath: (0, path_1.join)(__dirname, '..', 'public')
            }, {
                serveRoot: '/_/templates',
                rootPath: (0, path_1.join)(__dirname, '..', 'templates')
            }, {
                serveRoot: '/_/themes',
                rootPath: (0, path_1.join)(__dirname, '..', 'themes')
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            social_ref_module_1.SocialRefModule,
            social_service_module_1.SocialServiceModule,
            admin_module_1.AdminModule,
            clink_module_1.ClinkModule,
            page_config_module_1.PageConfigModule,
            core_1.RouterModule.register([
                {
                    path: '/_/api',
                    children: [
                        user_module_1.UserModule,
                        auth_module_1.AuthModule,
                        social_service_module_1.SocialServiceModule,
                        social_ref_module_1.SocialRefModule,
                        admin_module_1.AdminModule,
                        clink_module_1.ClinkModule,
                        page_config_module_1.PageConfigModule,
                        template_module_1.TemplateModule,
                        theme_module_1.ThemeModule
                    ]
                }
            ]),
            template_module_1.TemplateModule,
            theme_module_1.ThemeModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ]
    })
], AppModule);
exports.AppModule = AppModule;
