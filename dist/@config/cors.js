"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorsConfig = void 0;
exports.CorsConfig = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Accept',
        'Accept-Language',
        'Accept-Encoding',
        'Host',
        'Origin',
        'Cache-Control',
        'Content-Length',
        'Content-Type',
        'Authorization',
        'X-Auth-Token',
        'User-Agent'
    ]
};
