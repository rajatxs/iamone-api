import { ObjectId } from 'mongodb';
import { verifyUserAccessToken } from '../utils/jwt.js';
import { UserCacheService, UserService } from '../services/UserService.js';
import { PageCacheService } from '../services/PageCacheService.js';
import { ADMIN_KEY_INTEGRITY } from '../utils/env.js';
import { comparePassword } from '../utils/password.js';
import logger from '../utils/logger.js';

/**
 * User authorization middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function UserAuthorization(req, res, next) {
   let authHeader, accessToken, payload, userId;

   authHeader = req.header('Authorization');
   if (!authHeader) {
      return res.send401('Require authorization token');
   }

   accessToken = authHeader.split(' ')[1];
   if (!accessToken) {
      return res.send401('Missing authorization token');
   }

   try {
      payload = verifyUserAccessToken(accessToken);
   } catch (error) {
      return res.send401("Invalid authorization token");
   }

   userId = payload['id'].toString();
   payload['id'] = new ObjectId(payload['id']);
   req.locals.userId = payload['id'];

   switch(req.method.toUpperCase()) {
      case 'POST':
      case 'PUT':
      case 'PATCH':
      case 'DELETE': {
         if (UserCacheService.containsUsername(userId)) {
            let username = UserCacheService.getUsername(userId);

            if (PageCacheService.exists(username)) {
               PageCacheService.removeByUsername(username);
            }
         } 
         else {
            const userService = new UserService();
            const user = await userService.get(userId);

            if (!user) {
               return next("Something went wrong");
            }

            UserCacheService.setUsername(userId, user.username);
            PageCacheService.removeByUsername(user.username);
         }
         break;
      }
   }

   next(null);
}

/**
 * Admin authorization middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function AdminAuthorization(req, res, next) {
   let keyPhrase;

   keyPhrase = req.header('X-Admin-Key-Phrase');

   if (!keyPhrase) {
      return res.send401("Access denied");
   }
   
   console.log("HASH", ADMIN_KEY_INTEGRITY);

   try {
      if (!(await comparePassword(keyPhrase, ADMIN_KEY_INTEGRITY))) {
         return res.send400("Invalid Key Phrase");
      }
   } catch (error) {
      logger.error('auth:AdminAuthorization', "Couldn't verify key phrase", error);
      return next("Couldn't verify key phrase");
   }

   next(null);
}
