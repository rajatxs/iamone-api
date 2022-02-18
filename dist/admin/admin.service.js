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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const AppModel_1 = require("../@classes/AppModel");
let AdminService = class AdminService extends AppModel_1.AppModel {
    constructor() {
        super('admins', { timestamps: AppModel_1.timestampType.ALL });
    }
    create(data) {
        return this.$insert(data);
    }
    has(id) {
        return this.$existsId(id);
    }
    hasEmail(email) {
        return this.$exists({ email });
    }
    get(id) {
        return this.$findById(id);
    }
    find(filter) {
        return this.model.findOne(filter);
    }
    findAll(filter) {
        return this.model.find(filter).toArray();
    }
    findByEmail(email) {
        return this.model.findOne({ email });
    }
    delete(id) {
        return this.$deleteById(id);
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AdminService);
exports.AdminService = AdminService;
