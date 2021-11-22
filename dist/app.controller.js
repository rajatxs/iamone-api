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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("./auth/role.enum");
const role_decorator_1 = require("./auth/role.decorator");
let AppController = class AppController {
    getGreetingMessage() {
        return {
            statusCode: 200,
            message: "Happy Coding!"
        };
    }
};
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
