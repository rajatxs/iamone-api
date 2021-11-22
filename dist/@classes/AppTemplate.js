"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppTemplate = void 0;
const handlebars = require("handlebars");
const path_1 = require("path");
const fs_1 = require("fs");
class AppTemplate {
    constructor(options) {
        this.options = options;
        this.TEMPLATE_FILE_EXTENSION = 'hbs';
        this.DEFAULT_LAYOUT = 'main.layout';
        this.instance = handlebars.create();
        if (!this.options.layout) {
            this.options.layout = this.DEFAULT_LAYOUT;
        }
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
    async injectIntoLayout(body) {
        const layout = this.instance.compile(await this.getLayoutCode());
        return layout({ body });
    }
    async $compile(templateName, data, options) {
        const template = this.instance.compile(await this.getTemplateCode(templateName));
        const body = template(data, options);
        return this.injectIntoLayout(body);
    }
    get layoutFile() {
        return this.options.layout + '.' + this.TEMPLATE_FILE_EXTENSION;
    }
    resolveTemplatePath(templateName) {
        return (0, path_1.join)(this.options.rootPath, templateName + '.' + this.TEMPLATE_FILE_EXTENSION);
    }
    get layoutPath() {
        return (0, path_1.join)(this.options.rootPath, 'layouts', this.layoutFile);
    }
}
exports.AppTemplate = AppTemplate;
