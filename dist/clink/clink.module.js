"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinkModule = void 0;
const common_1 = require("@nestjs/common");
const clink_service_1 = require("./clink.service");
const clink_controller_1 = require("./clink.controller");
const site_meta_service_1 = require("./site-meta.service");
const user_module_1 = require("../user/user.module");
let ClinkModule = class ClinkModule {
};
ClinkModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => user_module_1.UserModule)],
        providers: [clink_service_1.ClinkService, site_meta_service_1.SiteMetaService],
        controllers: [clink_controller_1.ClinkController],
        exports: [clink_service_1.ClinkService, site_meta_service_1.SiteMetaService]
    })
], ClinkModule);
exports.ClinkModule = ClinkModule;
