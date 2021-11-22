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
exports.UserService = void 0;
const sharp = require("sharp");
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const AppStorage_1 = require("../@classes/AppStorage");
const AppModel_1 = require("../@classes/AppModel");
const random_1 = require("../@utils/random");
const social_ref_service_1 = require("../social-ref/social-ref.service");
const clink_service_1 = require("../clink/clink.service");
let UserService = class UserService extends AppModel_1.AppModel {
    constructor(socialRefService, clinkService) {
        super('users', { timestamps: AppModel_1.timestampType.ALL });
        this.socialRefService = socialRefService;
        this.clinkService = clinkService;
        this.userImageStorage = new AppStorage_1.AppStorage('users');
    }
    get findOptions() {
        return {
            sort: { createdAt: -1 },
            limit: 10,
            skip: 0,
            projection: {
                passwordHash: 0,
                httpRequestId: 0
            }
        };
    }
    async create(data) {
        data.emailVerified = false;
        data.image = null;
        return this.$insert(data);
    }
    hasEmail(email) {
        return this.$exists({ email });
    }
    hasUsername(username) {
        return this.$exists({ username });
    }
    has(id) {
        return this.$existsId(id);
    }
    get(id) {
        return this.$findById(id);
    }
    findOne(filter) {
        return this.model.findOne(filter, this.findOptions);
    }
    findAll(filter) {
        return this.model
            .find(filter, this.findOptions)
            .toArray();
    }
    findByUsernameOrEmail(username, email) {
        return this.model.findOne({ $or: [{ username }, { email }] });
    }
    update(userId, data) {
        return this.$updateById(userId, data);
    }
    setUsername(userId, username) {
        return this.$updateById(userId, { username });
    }
    setPasswordHash(userId, passwordHash) {
        return this.$updateById(userId, { passwordHash });
    }
    setEmail(userId, email, isVerified = false) {
        return this.$updateById(userId, {
            email,
            emailVerified: isVerified
        });
    }
    getImage(id, options) {
        return new Promise(async (resolve, reject) => {
            try {
                const exists = await this.userImageStorage.exists(id);
                let stream;
                if (!exists) {
                    return resolve(null);
                }
                stream = this.userImageStorage.download(id, options);
                return resolve(stream);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async removeImage(userId) {
        const user = await this.$findById(userId);
        if ((user.image || {}) instanceof mongodb_1.ObjectId) {
            await this.userImageStorage.remove(user.image);
            await this.update(userId, { image: null });
        }
    }
    async uploadImage(userId, file) {
        return new Promise(async (resolve, reject) => {
            const write = this.userImageStorage.writable('user-' + (0, random_1.alphaNumeric)(12), {
                contentType: 'image/webp'
            });
            let image;
            let read;
            await this.removeImage(userId);
            read = sharp(file.buffer)
                .webp({ quality: 60 })
                .resize(512, 512);
            read.pipe(write);
            read.on('error', reject);
            write.on('error', reject);
            write.on('finish', () => {
                image = write.id;
                this.update(userId, { image });
                resolve(image);
            });
        });
    }
    async deleteById(userId) {
        userId = this.$oid(userId);
        await this.socialRefService.removeManyByUserId(userId);
        await this.clinkService.removeManyByUserId(userId);
        await this.removeImage(userId);
        await this.$deleteById(userId);
        return true;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [social_ref_service_1.SocialRefService,
        clink_service_1.ClinkService])
], UserService);
exports.UserService = UserService;
