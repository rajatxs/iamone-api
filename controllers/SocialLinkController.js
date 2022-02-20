import { ObjectId } from 'mongodb';
import { SocialLinkService } from '../services/SocialLinkService.js';
import { SocialPlatformService } from '../services/SocialPlatformService.js';
import logger from '../utils/logger.js';

export class SocialLinkController {
   name = 'SocialLinkController';
   ALLOWED_MAX_LINKS = 16;

   #socialLinkService = new SocialLinkService();
   #socialPlatformService = new SocialPlatformService();

   /**
    * Get all social links
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async getAllSocialLinks(req, res, next) {
      const { userId } = req.locals;
      let result;

      try {
         result = await this.#socialLinkService.findAll({ userId });
      } catch (error) {
         logger.error(
            `${this.name}:getAllSocialLinks`,
            "Couldn't get social links",
            error
         );
         return next("Couldn't get social links");
      }

      res.send({ result });
   }

   /**
    * Get specific social link by id
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async getSocialLink(req, res, next) {
      const { userId } = req.locals;
      const linkId = req.params.id;
      let result;

      try {
         result = await this.#socialLinkService.findOne({
            _id: new ObjectId(linkId),
            userId,
         });
      } catch (error) {
         logger.error(
            `${this.name}:getSocialLink`,
            "Couldn't get social link",
            error
         );
         return next("Couldn't get social link");
      }

      if (!result) {
         return res.send404('Link not found');
      }

      res.send({ result });
   }

   /**
    * Adds new social link
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async addNewSocialLink(req, res, next) {
      const { userId } = req.locals;
      const data = req.body;
      let result, insertedId, totalLinks;

      totalLinks = await this.#socialLinkService.count({ userId });
      data.userId = userId;
      data.index = totalLinks + 1;

      // limit number of links
      if (totalLinks >= this.ALLOWED_MAX_LINKS) {
         return res.send400('You added maximum number of links');
      }

      // check social platform availability
      if (!this.#socialPlatformService.has(data.platformKey)) {
         return res.send400('Invalid platform key');
      }

      // prevent duplication
      if (await this.#socialLinkService.isDuplicate(data)) {
         return res.send409("Link already added");
      }

      try {
         result = await this.#socialLinkService.insert(data);
         insertedId = result.insertedId;
      } catch (error) {
         logger.error(
            `${this.name}:addNewSocialLink`,
            "Couldn't add social link",
            error
         );
         return next("Couldn't add social link");
      }

      res.status(201).send({
         message: 'Link added',
         result: { insertedId },
      });
   }

   /**
    * Updates social link
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async updateSocialLink(req, res, next) {
      const { userId } = req.locals;
      const linkId = req.params.id;
      const data = req.body;

      // check social service availability
      if (data['platformKey']) {
         const keyExists = this.#socialPlatformService.has(data.platformKey);
         if (!keyExists) {
            return res.send400('Invalid platform key');
         }
      }

      try {
         await this.#socialLinkService.update(
            { _id: new ObjectId(linkId), userId },
            data
         );
      } catch (error) {
         logger.error(
            `${this.name}:updateSocialLink`,
            "Couldn't update social link",
            error
         );
         return next("Couldn't update social link");
      }

      res.send({ message: 'Link updated' });
   }
   
   /**
    * Removes social link
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async removeSocialLink(req, res, next) {
      const { userId } = req.locals;
      const linkId = req.params.id;
      let result;

      try {
         result = await this.#socialLinkService.remove({
            _id: new ObjectId(linkId),
            userId,
         })
      } catch (error) {
         logger.error(
            `${this.name}:removeSocialLink`,
            "Couldn't remove social link",
            error
         );
         return next("Couldn't remove social link");
      }

      res.send({ message: 'Link removed' });
   }
}
