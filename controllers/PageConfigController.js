import { PageConfigService } from '../services/PageConfigService.js';
import logger from '../utils/logger.js';

export class PageConfigController {
   name = 'PageConfigController';
   #pageConfigService = new PageConfigService();

   /**
    * Get page config
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async getPageConfig(req, res, next) {
      const { userId } = req.locals
      let result;

      try {
         result = await this.#pageConfigService.findByUserId(userId)
      } catch (error) {
         logger.error(`${this.name}:getPageConfig`, "Couldn't get page config", error);
         return next("Couldn't get page config");
      }

      res.send({ result });
   }

   /**
    * Update page config
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async updatePageConfig(req, res, next) {

   }
}


