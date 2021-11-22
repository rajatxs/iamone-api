"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppMiddleware = void 0;
function AppMiddleware(req, res, next) {
    req.locals = {};
    req.locals.urlPath = req.path;
    req.locals.requestId = null;
    req.locals.userId = null;
    res.setHeader('Server', 'Developar');
    res.setHeader('Vary', 'Accept, Origin, Accept-Language');
    res.removeHeader('X-Powered-By');
    next();
}
exports.AppMiddleware = AppMiddleware;
