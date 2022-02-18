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
exports.TemplateService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const AppTemplate_1 = require("../@classes/AppTemplate");
const user_service_1 = require("../user/user.service");
const social_ref_service_1 = require("../social-ref/social-ref.service");
const clink_service_1 = require("../clink/clink.service");
const social_service_service_1 = require("../social-service/social-service.service");
const handlebars_1 = require("handlebars");
const page_config_service_1 = require("../page-config/page-config.service");
const theme_service_1 = require("../theme/theme.service");
const env_1 = require("../@utils/env");
let TemplateService = class TemplateService extends AppTemplate_1.AppTemplate {
    constructor(userService, socialRefService, socialServiceProvider, clinkService, pageConfigService, themeService) {
        super((0, path_1.join)(__dirname, '..', '..', 'templates'));
        this.userService = userService;
        this.socialRefService = socialRefService;
        this.socialServiceProvider = socialServiceProvider;
        this.clinkService = clinkService;
        this.pageConfigService = pageConfigService;
        this.themeService = themeService;
    }
    async resolveSocialRefLinks(refs) {
        let links;
        const services = this.socialServiceProvider.list;
        links = refs.map(ref => {
            const service = services.find(service => service.key === ref.socialServiceKey);
            let link;
            if (!service) {
                return null;
            }
            link = (0, handlebars_1.compile)(service.templateUrl);
            ref['link'] = link(ref);
            return ref;
        });
        return links;
    }
    compileTemplate(templateName, data) {
        return this.$compile(templateName, data);
    }
    async getPureDataByUserId(userId) {
        let user, socials, links, page;
        user = await this.userService.findOne({ _id: userId });
        socials = await this.socialRefService.findAll({ userId });
        links = await this.clinkService.findAll({ userId });
        page = await this.pageConfigService.findByUserId(userId);
        return {
            user,
            socials,
            links,
            page
        };
    }
    async findDataByUsername(username) {
        let user, socials, links, page;
        let css;
        user = await this.userService.findOne({ username });
        if (!user) {
            return null;
        }
        socials = await this.socialRefService.findAll({ userId: user._id });
        socials = await this.resolveSocialRefLinks(socials);
        links = await this.clinkService.findAll({ userId: user._id });
        page = await this.pageConfigService.findByUserId(user._id);
        css = await this.themeService.compile(page.theme, page.styles);
        return {
            user,
            social: socials,
            links,
            page,
            css,
            options: {
                host: env_1.default.hostUrl
            }
        };
    }
};
TemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        social_ref_service_1.SocialRefService,
        social_service_service_1.SocialServiceProvider,
        clink_service_1.ClinkService,
        page_config_service_1.PageConfigService,
        theme_service_1.ThemeService])
], TemplateService);
exports.TemplateService = TemplateService;
