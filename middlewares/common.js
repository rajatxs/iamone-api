import chalk from 'chalk';
import logger from '../utils/logger.js';

/**
 * App init middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function AppInit(req, res, next) {
   res.send400 = (message) => res.status(400).send({ message });
   res.send401 = (message) => res.status(400).send({ message });
   res.send404 = (message) => res.status(404).send({ message });
   res.send500 = (message) => res.status(500).send({ message });

   req.locals = {};
   req.locals.urlPath = req.path;
   req.locals.requestId = null;
   req.locals.userId = null;

   res.setHeader('Server', 'iamone');
   res.setHeader('Vary', 'Accept, Origin, Accept-Language');
   res.removeHeader('X-Powered-By');

   next(null);
}

/**
 * HTTP Request logger middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function HTTPRequestLogger(req, res, next) {
   const method = chalk.bold(req.method.toUpperCase()), path = req.path;

   logger.info("HTTP", `${method} ${path}`);
   next();
}
