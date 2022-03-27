import { randomUUID } from 'crypto';
import { UtilityService } from '../services/UtilityService.js';
import logger from '../utils/logger.js';

export class UtilityController {
   name = 'UtilityController';
   #utilityService = new UtilityService();
   
   /**
    * Get ImageKit Authentication signature
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   getImageKitAuthenticationSignature(req, res, next) {
      const token = req.query.token || randomUUID();
      const expire = req.query.expire || Math.floor(Date.now() / 1000) + 2400;
      let result;

      try {
         result = this.#utilityService.generateImageKitSignature(token.toString(), Number(expire));
      } catch (error) {
         logger.error(`${this.name}:getImageKitAuthenticationSignature`, "Couldn't get ImageKit signature", error);
         return next("Couldn't get signature");
      }

      res
         .status(200)
         .send({ result });
   }
}
