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
exports.ThemeService = void 0;
const common_1 = require("@nestjs/common");
const handlebars = require("handlebars");
const path_1 = require("path");
const common_2 = require("../@utils/common");
let ThemeService = class ThemeService {
    constructor() {
        this.DEFAULT_STYLE_TEMPLATE = (0, path_1.join)(__dirname, '..', '..', 'templates', 'default.style.hbs');
        this.hbs = handlebars.create();
        this.hbs.registerPartial('useProperty', (context, options) => {
            const prop = context.name;
            const root = options.data.root;
            return (prop in root) ? root[prop] : context.default;
        });
    }
    async compile(themeName, customStyleObject = {}) {
        let themeConfig = {}, themeObject = {}, styleCode, delegation;
        if (themeName) {
            themeConfig = await Promise.resolve().then(() => require("../../themes/" + themeName + '.json'));
        }
        themeObject = Object.assign(Object.assign({}, themeConfig), customStyleObject);
        styleCode = await (0, common_2.readFileContent)(this.DEFAULT_STYLE_TEMPLATE, 'utf8');
        delegation = this.hbs.compile(styleCode, { data: true });
        return delegation(themeObject);
    }
};
ThemeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ThemeService);
exports.ThemeService = ThemeService;
