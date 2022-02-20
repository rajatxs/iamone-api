import { ObjectId } from 'mongodb';
import { verifyUserAccessToken } from '../utils/jwt.js';

/**
 * User authorization middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function UserAuthorization(req, res, next) {
   let authHeader, accessToken, payload;

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

   payload.id = new ObjectId(payload.id);
   req.locals.userId = payload.id;

   next(null);
}
