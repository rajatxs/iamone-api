"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = {
    _resolveArray(varname) {
        const val = process.env[varname];
        let list = [];
        if (typeof val !== 'string') {
            return [];
        }
        list = val
            .split(',')
            .map(item => item.trim())
            .filter(item => typeof item === 'string' && item.length > 0);
        return list;
    },
    get hostUrl() {
        return process.env.HOST_URL;
    },
    get nodeEnv() {
        return process.env.NODE_ENV || 'development';
    },
    get port() {
        return Number(process.env.PORT);
    },
    get mongoConnectionUrl() {
        return process.env.MONGO_CONNECTION_URL;
    },
    get jwtPrivateKey() {
        return process.env.JWT_PRIVATE_KEY;
    },
    get jwtAdminPrivateKey() {
        return process.env.JWT_ADMIN_PRIVATE_KEY;
    },
    get sendgridApiKey() {
        return process.env.SENDGRID_API_KEY;
    }
};
exports.default = env;
