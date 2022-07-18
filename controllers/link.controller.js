import { ObjectId } from 'mongodb';
import { LinkService } from '../services/link.service.js';
import logger from '../utils/logger.js';

export class LinkController {
   name = 'LinkController';
   ALLOWED_MAX_LINKS = 36;

   #linkService = new LinkService();

   /**
    * Get all links
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async getAllLinks(req, res, next) {
      const { userId } = req.locals;
      let result;

      try {
         result = await this.#linkService.findAll({ userId })
      } catch (error) {
         logger.error(
            `${this.name}:getAllLinks`,
            "Couldn't get links",
            error
         );
         return next("Couldn't get links");
      }

      res.send({ result });
   }

   /**
    * Get specific link by id
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async getLink(req, res, next) {
      const { userId } = req.locals;
      const linkId = req.params.id;
      let result;

      try {
         result = await this.#linkService.findOne({
            _id: new ObjectId(linkId),
            userId,
         });
      } catch (error) {
         logger.error(
            `${this.name}:getLink`,
            "Couldn't get link",
            error
         );
         return next("Couldn't get link");
      }

      if (!result) {
         return res.send404('Link not found');
      }

      res.send({ result });
   }

   /**
    * Adds new link
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async addNewLink(req, res, next) {
      const { userId } = req.locals;
      const data = req.body;
      let result, insertedId, totalLinks;

      totalLinks = await this.#linkService.count({ userId });
      data.userId = userId;
      data.index = totalLinks + 1;

      // limit number of links
      if (totalLinks >= this.ALLOWED_MAX_LINKS) {
         return res.send400('You added maximum number of links');
      }

      // prevent duplication
      if (await this.#linkService.isDuplicate(data)) {
         return res.send409("Link already added");
      }

      try {
         result = await this.#linkService.add(data);
         insertedId = result.insertedId;
      } catch (error) {
         logger.error(
            `${this.name}:addNewLink`,
            "Couldn't add link",
            error
         );
         return next("Couldn't add link");
      }

      res.status(201).send({
         message: 'Link added',
         result: { insertedId },
      });
   }

   /**
    * Updates link
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async updateLink(req, res, next) {
      const { userId } = req.locals;
      const linkId = req.params.id;
      const data = req.body;

      try {
         await this.#linkService.update(
            { _id: new ObjectId(linkId), userId },
            data
         );
      } catch (error) {
         logger.error(
            `${this.name}:updateLink`,
            "Couldn't update link",
            error
         );
         return next("Couldn't update link");
      }

      res.send({ message: 'Link updated' });
   }
   
   /**
    * Removes link
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   async removeLink(req, res, next) {
      const { userId } = req.locals;
      const linkId = req.params.id;
      let result;

      try {
         result = await this.#linkService.remove({
            _id: new ObjectId(linkId),
            userId,
         })
      } catch (error) {
         logger.error(
            `${this.name}:removeLink`,
            "Couldn't remove link",
            error
         );
         return next("Couldn't remove link");
      }

      res.send({ message: 'Link removed' });
   }
}
