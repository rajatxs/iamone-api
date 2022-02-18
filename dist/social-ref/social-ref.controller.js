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
exports.SocialRefController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../auth/role.enum");
const role_decorator_1 = require("../auth/role.decorator");
const validation_1 = require("../@pipes/validation");
const mongodb_1 = require("mongodb");
const social_service_service_1 = require("../social-service/social-service.service");
const social_ref_service_1 = require("./social-ref.service");
const social_ref_schema_1 = require("./social-ref.schema");
let SocialRefController = class SocialRefController {
    constructor(socialRefService, socialServiceProvider) {
        this.socialRefService = socialRefService;
        this.socialServiceProvider = socialServiceProvider;
        this.ALLOWED_MAX_REFS = 16;
        this.logger = new common_1.Logger();
    }
    async getAllSocialRefs(req) {
        const { userId } = req.locals;
        let result;
        try {
            result = await this.socialRefService.findAll({ userId });
        }
        catch (error) {
            this.logger.error('Error while getting social links', error);
            throw new common_1.InternalServerErrorException('Failed to get your social links');
        }
        return {
            statusCode: 200,
            message: 'Social links',
            result,
        };
    }
    async getSocialRef(req, id) {
        const { userId } = req.locals;
        let result;
        try {
            result = await this.socialRefService.findOne({
                _id: new mongodb_1.ObjectId(id),
                userId,
            });
        }
        catch (error) {
            this.logger.error('Error while getting social link', error);
            throw new common_1.InternalServerErrorException('Failed to get social link data');
        }
        if (!result) {
            throw new common_1.NotFoundException('Social link not found');
        }
        return {
            statusCode: 200,
            message: 'Social link',
            result,
        };
    }
    async addNewSocialRef(req, data) {
        const { userId } = req.locals;
        let result, insertedId, totalRefs;
        data.userId = userId;
        totalRefs = await this.socialRefService.count({ userId });
        if (totalRefs >= this.ALLOWED_MAX_REFS) {
            throw new common_1.BadRequestException('You added maximum number of links');
        }
        if (!(this.socialServiceProvider.has(data.socialServiceKey))) {
            throw new common_1.BadRequestException('Invalid service key');
        }
        if (await this.socialRefService.isDuplicate(data)) {
            throw new common_1.ConflictException('Link is already exists with same slug value');
        }
        try {
            result = await this.socialRefService.insert(data);
            insertedId = result.insertedId;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to add new social link');
        }
        return {
            statusCode: 201,
            message: 'Link added',
            result: { insertedId },
        };
    }
    async updateSocialRef(req, id, data) {
        const { userId } = req.locals;
        if (data['socialServiceKey']) {
            const keyExists = this.socialServiceProvider.has(data.socialServiceKey);
            if (!keyExists) {
                throw new common_1.BadRequestException('Invalid service key');
            }
        }
        try {
            await this.socialRefService.update({ _id: new mongodb_1.ObjectId(id), userId }, data);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update link');
        }
        return {
            statusCode: 201,
            message: 'Link has been updated',
        };
    }
    async deleteSocialRef(req, id) {
        const { userId } = req.locals;
        let result;
        try {
            result = await this.socialRefService.remove({
                _id: new mongodb_1.ObjectId(id),
                userId,
            });
        }
        catch (error) {
            this.logger.error('Error while delete social ref', error);
            throw new common_1.InternalServerErrorException('Failed to remove your social link');
        }
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Unaccaptable social link id');
        }
        return {
            statusCode: 200,
            message: 'Social link has been removed',
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialRefController.prototype, "getAllSocialRefs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialRefController.prototype, "getSocialRef", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(social_ref_schema_1.createSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialRefController.prototype, "addNewSocialRef", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(social_ref_schema_1.updateSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SocialRefController.prototype, "updateSocialRef", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialRefController.prototype, "deleteSocialRef", null);
SocialRefController = __decorate([
    (0, common_1.Controller)('social-ref'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    __metadata("design:paramtypes", [social_ref_service_1.SocialRefService,
        social_service_service_1.SocialServiceProvider])
], SocialRefController);
exports.SocialRefController = SocialRefController;
