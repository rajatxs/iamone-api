"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppTemplate = void 0;
const handlebars = require("handlebars");
const path_1 = require("path");
const fs_1 = require("fs");
class AppTemplate {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.TEMPLATE_FILE_EXTENSION = 'hbs';
        this.THEME_FILE_EXTENSION = 'css';
        this.DEFAULT_LAYOUT = 'default.layout';
        this.instance = handlebars.create();
    }
    getCode(path) {
        return new Promise((resolve, reject) => {
            (0, fs_1.readFile)(path, 'utf8', (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        });
    }
    getTemplateCode(templateName) {
        return this.getCode(this.resolveTemplatePath(templateName));
    }
    $helper(name, fun) {
        this.instance.registerHelper(name, fun);
    }
    getLayoutCode() {
        return this.getCode(this.layoutPath);
    }
    async $compile(templateName, data, options) {
        const template = this.instance.compile(await this.getTemplateCode(templateName));
        const layout = this.instance.compile(await this.getLayoutCode());
        const body = template(data, options);
        return layout(Object.assign(data, { body }));
    }
    resolveTemplatePath(templateName) {
        return (0, path_1.join)(this.rootDir, templateName + '.' + this.TEMPLATE_FILE_EXTENSION);
    }
    get layoutPath() {
        return (0, path_1.join)(this.rootDir, this.DEFAULT_LAYOUT + '.' + this.TEMPLATE_FILE_EXTENSION);
    }
}
exports.AppTemplate = AppTemplate;
