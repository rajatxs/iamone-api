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
exports.PageConfigController = void 0;
const common_1 = require("@nestjs/common");
const page_config_service_1 = require("./page-config.service");
const validation_1 = require("../@pipes/validation");
const page_config_schema_1 = require("./page-config.schema");
const role_enum_1 = require("../auth/role.enum");
const role_decorator_1 = require("../auth/role.decorator");
let PageConfigController = class PageConfigController {
    constructor(pageConfigService) {
        this.pageConfigService = pageConfigService;
        this.logger = new common_1.Logger();
    }
    async getPageConfig(req) {
        const { userId } = req.locals;
        let result;
        try {
            result = await this.pageConfigService.findByUserId(userId);
        }
        catch (error) {
            this.logger.error('Error while getting page config', error);
            throw new common_1.InternalServerErrorException('Failed to get page config');
        }
        return {
            statusCode: 200,
            message: 'Page config',
            result
        };
    }
    async updatePageConfig(req, data) {
        const { userId } = req.locals;
        try {
            await this.pageConfigService.update({ userId }, data);
        }
        catch (error) {
            this.logger.error('Error while updating page config', error);
            throw new common_1.InternalServerErrorException('Failed to update page config');
        }
        return {
            statusCode: 201,
            message: 'Config updated',
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PageConfigController.prototype, "getPageConfig", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(page_config_schema_1.updateSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PageConfigController.prototype, "updatePageConfig", null);
PageConfigController = __decorate([
    (0, common_1.Controller)('page-config'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    __metadata("design:paramtypes", [page_config_service_1.PageConfigService])
], PageConfigController);
exports.PageConfigController = PageConfigController;
