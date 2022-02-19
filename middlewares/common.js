import chalk from 'chalk';
import logger from '../utils/logger.js';

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
