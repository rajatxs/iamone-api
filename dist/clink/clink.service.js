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
exports.ClinkService = void 0;
const common_1 = require("@nestjs/common");
const AppModel_1 = require("../@classes/AppModel");
const site_meta_service_1 = require("./site-meta.service");
let ClinkService = class ClinkService extends AppModel_1.AppModel {
    constructor(siteMetaService) {
        super('clinks', { timestamps: AppModel_1.timestampType.ALL });
        this.siteMetaService = siteMetaService;
    }
    get findOptions() {
        return {
            projection: {}
        };
    }
    findAll(filter) {
        return this.model.find(filter, this.findOptions).toArray();
    }
    get(id) {
        return this.$findById(id);
    }
    has(id) {
        return this.$existsId(id);
    }
    add(data) {
        return this.$insert(data);
    }
    count(filter) {
        return this.model.countDocuments(filter);
    }
    isDuplicate(data) {
        const { userId, href } = data;
        return this.$exists({
            $and: [{ userId }, { href }]
        });
    }
    update(id, data) {
        return this.$updateById(id, data);
    }
    remove(id) {
        return this.$deleteById(id);
    }
    removeManyByUserId(userId) {
        return this.model.deleteMany({ userId: this.$oid(userId) });
    }
    async fetchSiteMetadata(url) {
        const content = await this.siteMetaService.fetch(url);
        const data = this.siteMetaService.extract(url, content);
        return data;
    }
};
ClinkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [site_meta_service_1.SiteMetaService])
], ClinkService);
exports.ClinkService = ClinkService;
