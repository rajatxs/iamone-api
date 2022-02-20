import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './env.js';

/**
 * @typedef UserAuthTokenPayload
 * @property {string|DocId} id
 * @property {boolean} [email_verified]
 * @property {boolean} [admin]
 * @property {string} [name]
 * @property {string} [email]
 */

/**
 * @typedef RegisteredAuthTokenResponse
 * @property {string} accessToken
 * @property {string} refreshToken
 */

/**
 * Register new auth token for user
 * @param {UserAuthTokenPayload} payload
 * @param {string} subject
 * @returns {Promise<RegisteredAuthTokenResponse>}
 */
export function generateUserAuthToken(payload, subject) {
   const issuer = 'iamone.link', audience = payload.id;
   let accessToken, refreshToken;

   payload.admin = false;
   accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
      subject,
      issuer,
      expiresIn: '2d',
      audience,
   });

   refreshToken = jwt.sign({ id: payload.id }, JWT_REFRESH_TOKEN_SECRET, {
      subject,
      issuer,
      expiresIn: '1w',
      audience,
   });

   return { accessToken, refreshToken };
}

/**
 * Verify user auth token
 * @param {string} accessToken
 * @returns {Promise<UserAuthTokenPayload>}
 */
export function verifyUserAccessToken(accessToken) {
   return jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);
}
