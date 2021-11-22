"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpRequestMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequestMiddleware = void 0;
const common_1 = require("@nestjs/common");
const http_request_service_1 = require("./http-request.service");
let HttpRequestMiddleware = HttpRequestMiddleware_1 = class HttpRequestMiddleware {
    constructor() {
        this.httpRequest = new http_request_service_1.HttpRequestService;
        this.logger = new common_1.Logger(HttpRequestMiddleware_1.name);
    }
    async use(req, res, next) {
        let payload = {};
        let result, requestId;
        payload.url_path = req.locals.urlPath;
        payload.ip = req.ip;
        payload.origin = req.header('origin') || req.header('host');
        payload.user_agent = req.header('user-agent');
        payload.lang = req.acceptsLanguages()[0];
        try {
            result = await this.httpRequest.save(payload);
            requestId = result.insertedId;
            this.logger.log(`Request received ${requestId}`);
        }
        catch (error) {
            this.logger.error("Failed to create HTTP request", error);
            return next(new common_1.InternalServerErrorException({
                statusCode: 500,
                message: "Something went wrong",
                code: 'x42121174'
            }));
        }
        req.locals.requestId = requestId;
        res.setHeader('X-Request-Id', requestId.toString());
        next();
    }
};
HttpRequestMiddleware = HttpRequestMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], HttpRequestMiddleware);
exports.HttpRequestMiddleware = HttpRequestMiddleware;
