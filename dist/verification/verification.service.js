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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const AppModel_1 = require("../@classes/AppModel");
const common_2 = require("../@utils/common");
let VerificationService = class VerificationService extends AppModel_1.AppModel {
    constructor() {
        super('verificationCodes');
    }
    async saveVerificationCode(type, userId, code, duration = 5) {
        let result;
        let hasRecord;
        duration = String((0, common_2.generateIncrementedTimeByMinutes)(Number(duration)));
        hasRecord = await this.$exists({ userId, type });
        if (hasRecord) {
            result = await this.model.updateOne({ userId, type }, { $set: { code, duration } });
        }
        else {
            result = await this.$insert({
                type,
                code,
                duration,
                userId,
            });
        }
        return result.acknowledged;
    }
    async verifyCode(type, userId, code) {
        let record;
        userId = this.$docId(userId);
        code = String(code);
        record = await this.model.findOne({ userId, type, code });
        if (!record) {
            return false;
        }
        if (!(0, common_2.compareTimeDurationBelow)(Number(record.duration))) {
            return false;
        }
        await this.$deleteById(record._id);
        return true;
    }
};
VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VerificationService);
exports.VerificationService = VerificationService;
