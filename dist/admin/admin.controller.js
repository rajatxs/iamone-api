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
exports.AdminController = void 0;
const bcrypt = require("bcryptjs");
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../auth/role.enum");
const role_decorator_1 = require("../auth/role.decorator");
const validation_1 = require("../@pipes/validation");
const password_1 = require("../@utils/password");
const admin_service_1 = require("./admin.service");
const auth_service_1 = require("../auth/auth.service");
const admin_schema_1 = require("./admin.schema");
let AdminController = class AdminController {
    constructor(adminService, authService) {
        this.adminService = adminService;
        this.authService = authService;
        this.logger = new common_1.Logger;
    }
    async createNewAdmin(data) {
        let newAdmin, insertedId, result, admin;
        console.log("CONTROLLER CALLED");
        if (await this.adminService.hasEmail(data.email)) {
            throw new common_1.BadRequestException("Given email address is already in use");
        }
        try {
            data = await (0, password_1.setPasswordHash)(data);
            newAdmin = await this.adminService.create(data);
            insertedId = newAdmin.insertedId;
            this.logger.log(`Admin created ${insertedId}`);
            admin = await this.adminService.get(insertedId);
            result = await this.authService.generateAdminUserAuthToken({
                id: insertedId.toString(),
                name: data.fullname,
                email: data.email
            }, data.email);
        }
        catch (error) {
            this.logger.error("Error while creating new admin", error);
            throw new common_1.InternalServerErrorException("Failed to create new admin");
        }
        return {
            statusCode: 201,
            message: "Admin created",
            result
        };
    }
    async generateAuthToken(data) {
        const { email, password } = data;
        let admin, isPasswordCorrect = false, result;
        try {
            admin = await this.adminService.findByEmail(email);
        }
        catch (error) {
            this.logger.error("Error while getting admin data", error);
            throw new common_1.InternalServerErrorException("Failed to get your account data");
        }
        if (!admin) {
            throw new common_1.NotFoundException("Admin account not registered with given email");
        }
        try {
            isPasswordCorrect = await bcrypt.compare(password, admin.passwordHash);
        }
        catch (error) {
            this.logger.error("Error while decode user password", error);
            throw new common_1.InternalServerErrorException("Failed to decrypt your credentials");
        }
        if (!isPasswordCorrect) {
            throw new common_1.BadRequestException("Incorrect password");
        }
        try {
            result = await this.authService.generateAdminUserAuthToken({
                id: admin._id.toString(),
                email: admin.email,
                name: admin.fullname
            }, admin.email);
        }
        catch (error) {
            this.logger.error("Error while generating auth token", error);
            throw new common_1.InternalServerErrorException("Failed to create your authentication key");
        }
        return {
            statusCode: 201,
            message: "Auth token successfully generated",
            result
        };
    }
    async deleteAdmin(adminId) {
        let result;
        try {
            result = await this.adminService.delete(adminId);
        }
        catch (error) {
            this.logger.error("Error while delete admin", error);
            throw new common_1.InternalServerErrorException("Failed to delete admin account");
        }
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Admin not found");
        }
        return {
            statusCode: 200,
            message: "Admin has been deleted"
        };
    }
};
__decorate([
    (0, common_1.Post)('register'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(admin_schema_1.createAdminSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createNewAdmin", null);
__decorate([
    (0, common_1.Post)('token'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Anonymous),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(admin_schema_1.authTokenRequestAdminSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "generateAuthToken", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAdmin", null);
AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        auth_service_1.AuthService])
], AdminController);
exports.AdminController = AdminController;
