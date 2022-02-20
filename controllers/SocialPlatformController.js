import { SocialPlatformService } from '../services/SocialPlatformService.js';
import logger from '../utils/logger.js';

export class SocialPlatformController {
   name = 'SocialPlatformController';
   #socialPlatformService = new SocialPlatformService();

   /**
    * Get all social platforms
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   getAllSocialPlatforms(req, res, next) {
      let result;

      try {
         result = this.#socialPlatformService.list;
      } catch (error) {
         logger.error(`${this.name}:getAllSocialPlatforms`, "Couldn't get social platforms", error);
         return next("Couldn't get social platforms");
      }

      res.send({ result });
   }

   /**
    * Get specific social platform by key
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   getServicePlatformByKey(req, res, next) {
      const key = req.params.key;
      let result;

      try {
         result = this.#socialPlatformService.get(key);
      } catch (error) {
         logger.error(`${this.name}:getServicePlatformByKey`, "Couldn't get social platform", error);
         return next("Couldn't get social platform");
      }

      if (!result) {
         return res.send404("Item not found");
      }

      res.send({ result });
   }
}
