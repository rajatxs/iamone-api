"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteMetaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
const url_1 = require("url");
let SiteMetaService = class SiteMetaService {
    isAbsolute(url) {
        return url.indexOf('://') > 0 || url.indexOf('//') === 0;
    }
    toURL(url, baseUrl) {
        let newUrl;
        if (!this.isAbsolute(url)) {
            newUrl = new url_1.URL(url, baseUrl).href;
        }
        else {
            newUrl = url;
        }
        return newUrl;
    }
    extract(url, content) {
        const $ = cheerio_1.default.load(content);
        let title, description, thumb, favicon;
        title = $('title').text() || $("meta[name='apple-mobile-web-app-title']").attr('content');
        description = $("meta[name='description']").attr('content');
        thumb = $("meta[property='og:image']").attr('content');
        favicon = $("link[rel='shortcut icon'], link[rel='icon shortcut'], link[rel='icon']").attr('href');
        thumb = (thumb) ? this.toURL(thumb, url) : '';
        favicon = (favicon) ? this.toURL(favicon, url) : '';
        description = description || '';
        return {
            title,
            description,
            thumb,
            favicon
        };
    }
    async fetch(url) {
        let status, content;
        const response = await axios_1.default.get(url, {
            headers: {
                'Accept': 'text/html',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Dest': 'document'
            },
            responseType: 'text'
        });
        status = response.status;
        if (status >= 400 && status < 600) {
            throw new Error();
        }
        content = response.data;
        return content;
    }
};
SiteMetaService = __decorate([
    (0, common_1.Injectable)()
], SiteMetaService);
exports.SiteMetaService = SiteMetaService;
