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
exports.TemplateMiddleware = void 0;
const common_1 = require("@nestjs/common");
const template_service_1 = require("./template.service");
const path = require("path");
let TemplateMiddleware = class TemplateMiddleware {
    constructor(templateService) {
        this.templateService = templateService;
        this.logger = new common_1.Logger;
        this.publicResources = [
            'favicon.ico'
        ];
    }
    async use(req, res, next) {
        const { username } = req.params;
        let templateData;
        let code;
        if (username === '_' || this.publicResources.includes(username)) {
            return next();
        }
        res.setHeader('Content-Type', 'text/html');
        try {
            templateData = await this.templateService.findDataByUsername(username);
            if (templateData) {
                code = await this.templateService.compileTemplate(templateData);
            }
            else {
                return res.sendFile(path.join(__dirname, '../../public/404.html'));
            }
        }
        catch (error) {
            this.logger.error("Error while getting template data", error);
        }
        return res.status(200).send(code);
    }
};
TemplateMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [template_service_1.TemplateService])
], TemplateMiddleware);
exports.TemplateMiddleware = TemplateMiddleware;
