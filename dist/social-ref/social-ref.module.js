"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialRefModule = void 0;
const common_1 = require("@nestjs/common");
const social_service_module_1 = require("../social-service/social-service.module");
const social_ref_service_1 = require("./social-ref.service");
const social_ref_controller_1 = require("./social-ref.controller");
let SocialRefModule = class SocialRefModule {
};
SocialRefModule = __decorate([
    (0, common_1.Module)({
        imports: [social_service_module_1.SocialServiceModule],
        providers: [social_ref_service_1.SocialRefService],
        controllers: [social_ref_controller_1.SocialRefController],
        exports: [social_ref_service_1.SocialRefService]
    })
], SocialRefModule);
exports.SocialRefModule = SocialRefModule;
