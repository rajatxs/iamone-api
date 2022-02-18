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
exports.TemplateController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../auth/role.enum");
const role_decorator_1 = require("../auth/role.decorator");
const template_service_1 = require("./template.service");
let TemplateController = class TemplateController {
    constructor(templateService) {
        this.templateService = templateService;
    }
    async getTemplateData(req) {
        const { userId } = req.locals;
        let result = null;
        try {
            result = await this.templateService.getPureDataByUserId(userId);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to get account data");
        }
        return {
            statusCode: 200,
            message: "Template data",
            result
        };
    }
    getTemplateList() {
        let result = [];
        try {
            result = require('../../data/themes.json');
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to design themes");
        }
        return {
            statusCode: 200,
            message: "List of themes",
            result
        };
    }
};
__decorate([
    (0, common_1.Get)('/data'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "getTemplateData", null);
__decorate([
    (0, common_1.Get)('/list'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Anonymous),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], TemplateController.prototype, "getTemplateList", null);
TemplateController = __decorate([
    (0, common_1.Controller)('template'),
    __metadata("design:paramtypes", [template_service_1.TemplateService])
], TemplateController);
exports.TemplateController = TemplateController;
