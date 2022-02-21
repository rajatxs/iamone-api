import logger from '../utils/logger.js';
import path from 'path';
import { PageService } from '../services/PageService.js';

export class PageOutputController {
   name = 'PageOutputController';
   #pageService = new PageService();

   /**
    * Render profile page
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async renderPageByUsername(req, res, next) {
      const { username } = req.params;
      let templateData, code;

      try {
         templateData = await this.#pageService.getTemplateDataByUsername(username);

         if (!templateData) {
            return res.sendFile(path.resolve('public', '404.html'));
         }

         code = await this.#pageService.compileTemplate(
            templateData.page?.templateName, 
            templateData
         );
      } catch (error) {
         logger.info(
            `${this.name}:renderPageByUsername`,
            "Couldn't get page",
            error
         );
         return res.sendFile(path.resolve('public', '500.html'));
      }

      res.setHeader('Content-Type', 'text/html');
      res.send(code);
   }
}
