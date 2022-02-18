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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mongodb_1 = require("mongodb");
const role_enum_1 = require("./role.enum");
const role_decorator_1 = require("./role.decorator");
const auth_service_1 = require("./auth.service");
const admin_service_1 = require("../admin/admin.service");
const user_service_1 = require("../user/user.service");
let AuthGuard = class AuthGuard {
    constructor(reflector, adminService, userService, authService) {
        this.reflector = reflector;
        this.adminService = adminService;
        this.userService = userService;
        this.authService = authService;
    }
    extractAuthToken(request) {
        let authHeader, authToken;
        authHeader = request.header('Authorization');
        if (!authHeader) {
            throw new common_1.UnauthorizedException('Require authorization token');
        }
        authToken = authHeader.split(' ')[1];
        if (!authToken) {
            throw new common_1.UnauthorizedException('Missing authorization token');
        }
        return authToken;
    }
    sanitizePayload(payload) {
        payload.id = new mongodb_1.ObjectId(payload.id);
        return payload;
    }
    async verifyAuthToken(token) {
        let payload;
        try {
            payload = await this.authService.verifyUserAuthToken(token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid authorization token');
        }
        payload = this.sanitizePayload(payload);
        return payload;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const [role] = this.reflector.getAllAndOverride(role_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        let token, payload;
        if (role === role_enum_1.Role.Anonymous) {
            return true;
        }
        token = this.extractAuthToken(request);
        payload = await this.verifyAuthToken(token);
        switch (role) {
            case role_enum_1.Role.Admin: {
                if (!payload.admin) {
                    throw new common_1.ForbiddenException("You don't have access");
                }
                if (await this.adminService.has(payload.id) === false) {
                    throw new common_1.UnauthorizedException('Account not found');
                }
                request.locals.adminId = payload.id;
                break;
            }
            case role_enum_1.Role.User: {
                if (await this.userService.has(payload.id) === false) {
                    throw new common_1.UnauthorizedException('Account not found');
                }
                request.locals.userId = payload.id;
                break;
            }
            default:
                return false;
        }
        return true;
    }
};
AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        admin_service_1.AdminService,
        user_service_1.UserService,
        auth_service_1.AuthService])
], AuthGuard);
exports.AuthGuard = AuthGuard;
