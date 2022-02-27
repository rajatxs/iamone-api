import logger from '../utils/logger.js';
import { PageService } from '../services/PageService.js';
import { PageConfigService } from '../services/PageConfigService.js';
import { ThemeService } from '../services/ThemeService.js';
import { UserCacheService } from '../services/UserService.js';
import { PageCacheService } from '../services/PageCacheService.js';

export class PageController {
   name = 'PageController';
   #pageService = new PageService();
   #themeService = new ThemeService();
   #pageConfigService = new PageConfigService();

   /**
    * Get page data
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async getPageData(req, res, next) {
      const { userId } = req.locals;
      let result;

      try {
         result = await this.#pageService.getTemplateDataByUserId(userId);
      } catch (error) {
         logger.info(
            `${this.name}:getPageData`,
            "Couldn't get page data"
         );
         return next("Couldn't get page data");
      }

      res.send({ result });
   }

   /**
    * Get all themes
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   getAllThemes(req, res, next) {
      let result;

      try {
         result = this.#themeService.findAll();
      } catch (error) {
         logger.info(
            `${this.name}:getAllThemes`,
            "Couldn't get themes"
         );
         return next("Couldn't get themes");
      }

      res.send({ result });
   }
   
   /**
    * Get themes by collection id
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   getThemesByCollectionId(req, res, next) {
      const collectionId = req.params.collectionId;
      let result;

      try {
         result = this.#themeService.findByCollectionId(collectionId);
      } catch (error) {
         logger.info(
            `${this.name}:getThemesByCollectionId`,
            "Couldn't get themes"
         );
         return next("Couldn't get themes");
      }

      if (!result) {
         return res.send404("Collection not found");
      }

      res.send({ result });
   }
   
   /**
    * Get themes by themeKey
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   getThemesByThemeKey(req, res, next) {
      const collectionId = req.params.collectionId;
      const themeKey = req.params.themeKey;
      let result;

      try {
         result = this.#themeService.findOne(collectionId, themeKey);
      } catch (error) {
         logger.info(
            `${this.name}:getThemesByThemeId`,
            "Couldn't get theme",
            error
         );
         return next("Couldn't get theme");
      }

      if (Array.isArray(result) && result.length === 0) {
         return res.send404("Theme not found");
      }

      res.send({ result });
   }

   /**
    * Get themes source `configId`
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async getThemeSource(req, res, next) {
      const configId = req.params.configId;
      let code = '';

      try {
         const { theme, styles } = await this.#pageConfigService.get(configId);
         code = await this.#themeService.compile(theme, styles);
      } catch (error) {
         logger.info(
            `${this.name}:getThemeSource`,
            "Couldn't get theme source",
            error
         );
         return next("Couldn't get theme source");
      }

      res.setHeader('Content-Type', 'text/css');
      res.send(code);
   }

   /**
    * Clear page cache
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    */
   async clearPageCache(req, res) {
      const userId = req.locals.userId.toString();

      if (UserCacheService.containsUsername(userId)) {
         let username = UserCacheService.getUsername(userId);

         if (PageCacheService.exists(username)) {
            PageCacheService.removeByUsername(username);
         }
      } 

      res.send({ message: "Cache cleared" });
   }

   /**
    * Clear all pages from cache storage
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async clearAllPageCache(req, res, next) {
      let result;

      try {
         result = await PageCacheService.removeAll();
      } catch (error) {
         logger.info(
            `${this.name}:clearAllPageCache`,
            "Couldn't clear page cache",
            error
         );
         return next("Couldn't clear page cache");
      }

      res.send({ result });
   }
}
