"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeController = void 0;
const common_1 = require("@nestjs/common");
const theme_service_1 = require("./theme.service");
const page_config_service_1 = require("../page-config/page-config.service");
const role_enum_1 = require("../auth/role.enum");
const role_decorator_1 = require("../auth/role.decorator");
let ThemeController = class ThemeController {
    constructor(themeService, pageConfigService) {
        this.themeService = themeService;
        this.pageConfigService = pageConfigService;
    }
    async getThemeSource(configId) {
        let code = '';
        try {
            const { theme, styles } = await this.pageConfigService.get(configId);
            code = await this.themeService.compile(theme, styles);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to get theme");
        }
        return code;
    }
};
__decorate([
    (0, common_1.Get)(':configId'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Anonymous),
    (0, common_1.Header)('Content-Type', 'text/css'),
    __param(0, (0, common_1.Param)('configId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeController.prototype, "getThemeSource", null);
ThemeController = __decorate([
    (0, common_1.Controller)('theme'),
    __metadata("design:paramtypes", [theme_service_1.ThemeService,
        page_config_service_1.PageConfigService])
], ThemeController);
exports.ThemeController = ThemeController;
