import path from 'path';
import CRC32 from 'crc/crc32';
import { tmpdir } from 'os';
import { existsSync, mkdirSync, createReadStream, createWriteStream, unlinkSync } from 'fs';
import logger from '../utils/logger.js';

export class PageCacheService {
   name = 'PageCacheService';

   static get CACHE_FILE_EXTENSION() {
      return 'page';
   }

   /** Page cache root dir */
   static dir() {
      return path.join(tmpdir(), 'iamone-page-cache');
   }

   /**
    * Generates cache storage key
    * @param {string} username 
    */
   static key(username) {
      return CRC32(username).toString(16);
   }

   /** Setup for page cache */
   static setup() {
      const dir = PageCacheService.dir();

      if (existsSync(dir)) {
         return;
      }

      mkdirSync(dir);
      logger.info('PageCacheService:setup', "Dir created", dir);
   }

   /**
    * Check whether specified file exists or not
    * @param {string} username 
    */
   static exists(username) {
      return existsSync(
         path.join(
            PageCacheService.dir(), 
            PageCacheService.key(username) + '.' + PageCacheService.CACHE_FILE_EXTENSION
         )
      );
   }

   /**
    * Resolves cache store file path
    * @param {string} key 
    */
   resolvePath(key) {
      return path.join(PageCacheService.dir(), key + '.' + PageCacheService.CACHE_FILE_EXTENSION);
   }

   /**
    * Returns content from cache storage followed by `username`
    * @param {string} username 
    */
   read(username) {
      const key = PageCacheService.key(username);
      const readFile = this.resolvePath(key);

      if (!existsSync(readFile)) {
         return null;
      }

      return createReadStream(readFile);
   }

   /**
    * Writes `source` into cache storage file
    * @param {string} username 
    * @param {string} source 
    * @returns {Promise<import('fs').ReadStream>}
    */
   write(username, source) {      
      return new Promise((resolve, reject) => {
         const key = PageCacheService.key(username);
         const writeFile = this.resolvePath(key);
         const write = createWriteStream(writeFile);

         write.on('finish', () => {
            logger.info(`${this.name}:renderPageByUsername`, `Written page cache username: ${username}`);
         });

         write.on('close', () => {
            resolve(createReadStream(writeFile));
         })

         write.on('error', (error) => {
            logger.error(`${this.name}:renderPageByUsername`, "Couldn't write page", error);
            reject(error);
         });

         write.end(source);
      });
   }

   /**
    * Removes storage file followed by `username`
    * @param {string} username 
    */
   remove(username) {
      const key = PageCacheService.key(username);
      const removeFile = this.resolvePath(key);

      unlinkSync(removeFile);
      logger.info(`${this.name}:remove`, `username: ${username}`);
   }

   /**
    * Remove storage file by `username`
    * @param {string} username 
    */
   static removeByUsername(username) {
      const removeFile = path.join(
         PageCacheService.dir(), 
         PageCacheService.key(username) + '.' + PageCacheService.CACHE_FILE_EXTENSION
      );

      unlinkSync(removeFile);
      logger.info(`${this.name}:remove`, `username: ${username}`);
   }
}
