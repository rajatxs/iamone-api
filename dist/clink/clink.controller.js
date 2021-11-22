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
exports.ClinkController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../auth/role.enum");
const role_decorator_1 = require("../auth/role.decorator");
const clink_service_1 = require("./clink.service");
const validation_1 = require("../@pipes/validation");
const clink_schema_1 = require("./clink.schema");
let ClinkController = class ClinkController {
    constructor(clinkService) {
        this.clinkService = clinkService;
        this.ALLOWED_MAX_LINKS = 36;
        this.logger = new common_1.Logger;
    }
    async getAllCLinkList(req) {
        const { userId } = req.locals;
        let result;
        try {
            result = await this.clinkService.findAll({ userId });
        }
        catch (error) {
            this.logger.error("Error while getting clinks", error);
            throw new common_1.InternalServerErrorException("Failed to get links");
        }
        return {
            statusCode: 200,
            message: "List of custom links",
            result
        };
    }
    async addNewCLink(req, data) {
        const { userId } = req.locals;
        let result, insertedId, totalLinks;
        data.userId = userId;
        totalLinks = await this.clinkService.count({ userId });
        if (totalLinks >= this.ALLOWED_MAX_LINKS) {
            throw new common_1.BadRequestException('You added maximum number of links');
        }
        if (await this.clinkService.isDuplicate(data)) {
            throw new common_1.BadRequestException("Given link is already added");
        }
        try {
            result = await this.clinkService.add(data);
            insertedId = result.insertedId;
        }
        catch (error) {
            this.logger.error("Error while adding new link", error);
            throw new common_1.InternalServerErrorException("Failed to add new custom link");
        }
        return {
            statusCode: 201,
            message: "Link added",
            result: { insertedId }
        };
    }
    async getSiteMetadata(url) {
        let meta;
        try {
            meta = await this.clinkService.fetchSiteMetadata(url);
        }
        catch (error) {
            this.logger.error("Error while getting site metadata", error);
            throw new common_1.InternalServerErrorException("Failed to get site metadata");
        }
        return {
            statusCode: 200,
            message: "Metadata fetched successfully",
            result: meta
        };
    }
    async updateCLink(req, linkId, body) {
        if (!(await this.clinkService.has(linkId))) {
            throw new common_1.NotFoundException("Link not found");
        }
        try {
            await this.clinkService.update(linkId, body);
        }
        catch (error) {
            this.logger.error("Error while updating clink", error);
            throw new common_1.InternalServerErrorException("Failed to update link");
        }
        return {
            statusCode: 200,
            message: "Link updated"
        };
    }
    async removeCLink(linkId) {
        try {
            await this.clinkService.remove(linkId);
        }
        catch (error) {
            this.logger.error("Error while removing clink", error);
            throw new common_1.InternalServerErrorException("Failed to remove link");
        }
        return {
            statusCode: 200,
            message: "Link removed"
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinkController.prototype, "getAllCLinkList", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(clink_schema_1.createSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClinkController.prototype, "addNewCLink", null);
__decorate([
    (0, common_1.Post)('metadata'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinkController.prototype, "getSiteMetadata", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(clink_schema_1.updateSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ClinkController.prototype, "updateCLink", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinkController.prototype, "removeCLink", null);
ClinkController = __decorate([
    (0, common_1.Controller)('clink'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    __metadata("design:paramtypes", [clink_service_1.ClinkService])
], ClinkController);
exports.ClinkController = ClinkController;
