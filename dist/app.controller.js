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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("./auth/role.enum");
const role_decorator_1 = require("./auth/role.decorator");
const path = require("path");
let AppController = class AppController {
    getHomePage(res) {
        return res.sendFile(path.join(__dirname, '../public/index.html'));
    }
    getHome2Page(res) {
        return res.sendFile(path.join(__dirname, '../public/index2.html'));
    }
    getGreetingMessage() {
        return {
            statusCode: 200,
            message: "Happy Coding!"
        };
    }
};
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHomePage", null);
__decorate([
    (0, common_1.Get)('/_/'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHome2Page", null);
__decorate([
    (0, common_1.Get)('/_/api/test'),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getGreetingMessage", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Anonymous)
], AppController);
exports.AppController = AppController;
