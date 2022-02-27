import path from 'path';
import logger from '../utils/logger.js';
import { PageService } from '../services/PageService.js';
import { PageCacheService } from '../services/PageCacheService.js';

export class PageOutputController {
   name = 'PageOutputController';
   #pageService = new PageService();
   #pageCacheService = new PageCacheService();

   PAGE_404 = path.resolve('public', '404.html');
   PAGE_500 = path.resolve('public', '500.html');

   /**
    * Render profile page
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    */
   async renderPageByUsername(req, res) {
      const { username } = req.params;
      const { cache = 1 } = req.query;
      let readStream;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'max-age=86400');

      switch(Number(cache)) {
         case 0: {
            PageCacheService.removeByUsername(username);
            break;
         }
      }

      try {
         if (PageCacheService.exists(username)) {
            readStream = this.#pageCacheService.read(username);
         } 
         else {
            const data = await this.#pageService.getTemplateDataByUsername(username);
            let source;

            if (!data) {
               return res.status(404).sendFile(this.PAGE_404);
            }

            source = await this.#pageService.compileTemplate(
               data.page?.templateName, 
               data
            );

            readStream = await this.#pageCacheService.write(username, source);
         }
      } 
      catch (error) {
         logger.info(
            `${this.name}:renderPageByUsername`,
            "Couldn't get page",
            error
         );

         return res.status(500).sendFile(this.PAGE_500);
      }

      return readStream.pipe(res);
   }
}
