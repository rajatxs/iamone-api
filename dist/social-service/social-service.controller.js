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
exports.SocialServiceController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../auth/role.enum");
const role_decorator_1 = require("../auth/role.decorator");
const social_service_service_1 = require("./social-service.service");
let SocialServiceController = class SocialServiceController {
    constructor(socialService) {
        this.socialService = socialService;
        this.logger = new common_1.Logger;
    }
    getAllSocialServices() {
        let result;
        try {
            result = this.socialService.list;
        }
        catch (error) {
            this.logger.error("Error while getting social services", error);
            throw new common_1.InternalServerErrorException("Failed to get social services");
        }
        return {
            statusCode: 200,
            message: "List of social servies",
            result
        };
    }
    getSocialService(key) {
        let result;
        try {
            result = this.socialService.get(key);
        }
        catch (error) {
            this.logger.error("Error while getting social service data", error);
            throw new common_1.InternalServerErrorException("Failed to get social service data");
        }
        if (!result) {
            throw new common_1.NotFoundException("Social service not");
        }
        return {
            statusCode: 200,
            message: "Data of Social service",
            result
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], SocialServiceController.prototype, "getAllSocialServices", null);
__decorate([
    (0, common_1.Get)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], SocialServiceController.prototype, "getSocialService", null);
SocialServiceController = __decorate([
    (0, common_1.Controller)('social-service'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Anonymous),
    __metadata("design:paramtypes", [social_service_service_1.SocialServiceProvider])
], SocialServiceController);
exports.SocialServiceController = SocialServiceController;
