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
exports.PageConfigService = void 0;
const common_1 = require("@nestjs/common");
const AppModel_1 = require("../@classes/AppModel");
let PageConfigService = class PageConfigService extends AppModel_1.AppModel {
    get findOptions() {
        return {
            projection: {
                userId: false
            }
        };
    }
    constructor() {
        super('pageConfig');
    }
    create(data) {
        return this.$insert(data);
    }
    get(id) {
        return this.$findById(id);
    }
    findByUserId(userId) {
        userId = this.$docId(userId);
        return this.model.findOne({ userId }, this.findOptions);
    }
    isDuplicate(data) {
        const { userId } = data;
        return this.$exists({ $and: [{ userId }] });
    }
    update(filter, newData) {
        return this.model.updateOne(filter, { $set: newData });
    }
    remove(filter) {
        return this.model.deleteOne(filter);
    }
};
PageConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PageConfigService);
exports.PageConfigService = PageConfigService;
