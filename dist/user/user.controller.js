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
exports.UserController = void 0;
const path = require("path");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = require("fs");
const validation_1 = require("../@pipes/validation");
const user_service_1 = require("./user.service");
const password_1 = require("../@utils/password");
const user_setup_1 = require("./user.setup");
const user_schema_1 = require("./user.schema");
const role_enum_1 = require("../auth/role.enum");
const role_decorator_1 = require("../auth/role.decorator");
const auth_service_1 = require("../auth/auth.service");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
        this.logger = new common_1.Logger;
    }
    async getAllUsers() {
        let result;
        try {
            result = await this.userService.findAll();
        }
        catch (error) {
            this.logger.error("Error while getting users", error);
            throw new common_1.InternalServerErrorException("Failed to get users");
        }
        return {
            statusCode: 200,
            message: "List of users",
            result
        };
    }
    async getAccountDetail(req) {
        const { userId } = req.locals;
        let result;
        try {
            result = await this.userService.get(userId);
        }
        catch (error) {
            this.logger.error("Error while getting account data", error);
            throw new common_1.InternalServerErrorException("Failed to get yout account data");
        }
        return {
            statusCode: 200,
            message: "Account data",
            result
        };
    }
    async registerNewUser(req, data) {
        let newUser, result, insertedId, user;
        if (await this.userService.hasUsername(data.username)) {
            throw new common_1.BadRequestException("Account is already registered with given username");
        }
        if (await this.userService.hasEmail(data.email)) {
            throw new common_1.BadRequestException('Account is already registered with given email address');
        }
        try {
            data.httpRequestId = req.locals.requestId;
            data = await (0, password_1.setPasswordHash)(data);
            newUser = await this.userService.create(data);
            insertedId = newUser.insertedId;
            this.logger.log(`User created ${insertedId}`);
            user = await this.userService.get(insertedId);
            result = await this.authService.generateUserAuthToken({
                id: insertedId.toString(),
                name: user.fullname,
                email: user.email,
                email_verified: user.emailVerified
            }, user.username);
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException("Failed to create your account");
        }
        return {
            statusCode: 201,
            message: "Account created",
            result
        };
    }
    async generateAccessToken(data) {
        const { username, email, password } = data;
        let user, isPasswordCorrect = false, result;
        if (!username && !email) {
            throw new common_1.BadRequestException("Require username or email");
        }
        try {
            user = await this.userService.findByUsernameOrEmail(username, email);
        }
        catch (error) {
            this.logger.log("Failed to get user document", error);
            throw new common_1.InternalServerErrorException("Failed to get your account");
        }
        if (!user) {
            throw new common_1.NotFoundException("Account not registered with given username or email");
        }
        try {
            isPasswordCorrect = await (0, password_1.comparePassword)(password, user.passwordHash);
        }
        catch (error) {
            this.logger.error("Error while decode user password", error);
            throw new common_1.InternalServerErrorException("Failed to decrypt your credentials");
        }
        if (!isPasswordCorrect) {
            throw new common_1.BadRequestException("Incorrect password");
        }
        try {
            result = await this.authService.generateUserAuthToken({
                id: (user._id).toString(),
                name: user.fullname,
                email: user.email,
                email_verified: user.emailVerified
            }, user.username);
        }
        catch (error) {
            this.logger.error("Error while registering new user auth token", error);
            throw new common_1.InternalServerErrorException("Failed to initialize your login session");
        }
        return {
            statusCode: 201,
            message: "Auth token generated",
            result
        };
    }
    async changeUsername(req, data) {
        const { username } = data;
        const { userId } = req.locals;
        let exists;
        exists = await this.userService.hasUsername(username);
        if (exists) {
            throw new common_1.BadRequestException("Username has already been taken");
        }
        try {
            await this.userService.setUsername(userId, username);
        }
        catch (error) {
            this.logger.error("Error while updating username", error);
            throw new common_1.InternalServerErrorException("Failed to update username");
        }
        return {
            statusCode: 200,
            message: "Username changed"
        };
    }
    async changeEmail(req, data) {
        const { email } = data;
        const { userId } = req.locals;
        let exists;
        exists = await this.userService.hasEmail(email);
        if (exists) {
            throw new common_1.BadRequestException("Email is already in use");
        }
        try {
            await this.userService.setEmail(userId, email, false);
        }
        catch (error) {
            this.logger.error("Error while updating email", error);
            throw new common_1.InternalServerErrorException("Failed to update your email");
        }
        return {
            statusCode: 200,
            message: "Email changed"
        };
    }
    async changePassword(req, data) {
        const { currentPassword, newPassword } = data;
        const { userId } = req.locals;
        let user;
        let hash;
        if (currentPassword === newPassword) {
            throw new common_1.BadRequestException("Use different passwords");
        }
        user = await this.userService.get(userId);
        if (await (0, password_1.comparePassword)(currentPassword, user.passwordHash) === false) {
            throw new common_1.BadRequestException("Incorrect current password");
        }
        try {
            hash = await (0, password_1.generatePasswordHash)(newPassword);
            await this.userService.setPasswordHash(userId, hash);
        }
        catch (error) {
            this.logger.error("Error while updating your password", error);
            throw new common_1.InternalServerErrorException("Failed to update your password");
        }
        return {
            statusCode: 200,
            message: "Password changed"
        };
    }
    async updateProfileDetails(req, data) {
        const { userId } = req.locals;
        try {
            await this.userService.update(userId, data);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update yout profile');
        }
        return {
            statusCode: 201,
            message: "Profile has been updated"
        };
    }
    async uploadProfilePicture(req, file) {
        try {
            await this.userService.uploadImage(req.locals.userId, file);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to upload your profile image");
        }
        return {
            statusCode: 201,
            message: "Profile image uploaded successfully"
        };
    }
    async deleteUserImage(req) {
        try {
            await this.userService.removeImage(req.locals.userId);
        }
        catch (error) {
            this.logger.error("Error while removing profile image", error);
            throw new common_1.InternalServerErrorException("Failed to remove profile image");
        }
        return {
            statusCode: 200,
            message: "Profile image has been removed"
        };
    }
    async getUserImage(res, fileId) {
        let image;
        try {
            if (typeof fileId === 'string' && fileId.length === 24) {
                image = await this.userService.getImage(fileId);
            }
            else {
                const defaultAvatarImage = path.join(__dirname, '../../public/detault-user-avatar.webp');
                const read = (0, fs_1.createReadStream)(defaultAvatarImage);
                return read.pipe(res, { end: true });
            }
            if (!image) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Image not found'
                });
            }
            return image.pipe(res, { end: true });
        }
        catch (error) {
            this.logger.error("Error while getting profile image", error);
            return res.status(500).json({
                statusCode: 500,
                message: "Failed to get profile image"
            });
        }
    }
    async deleteUserAccount(req) {
        const { userId } = req.locals;
        let result;
        try {
            result = await this.userService.deleteById(userId);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to delete your account");
        }
        return {
            statusCode: 200,
            message: "Account has been deleted"
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('detail'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAccountDetail", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Anonymous),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(user_schema_1.createSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerNewUser", null);
__decorate([
    (0, common_1.Post)('token'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Anonymous),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(user_schema_1.verifySchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generateAccessToken", null);
__decorate([
    (0, common_1.Put)('/username'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(user_schema_1.usernameUpdateSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeUsername", null);
__decorate([
    (0, common_1.Put)('/email'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(user_schema_1.emailUpdateSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeEmail", null);
__decorate([
    (0, common_1.Put)('/password'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(user_schema_1.passwordUpdateSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Put)('detail'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    (0, common_1.UsePipes)(new validation_1.JoiValidationPipe(user_schema_1.updateSchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfileDetails", null);
__decorate([
    (0, common_1.Post)('image'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', user_setup_1.UserImageUploadOptions)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.Delete)('image'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUserImage", null);
__decorate([
    (0, common_1.Get)('image/:id?'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Anonymous),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserImage", null);
__decorate([
    (0, common_1.Delete)('account'),
    (0, role_decorator_1.Roles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUserAccount", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
exports.UserController = UserController;
