import axios from 'axios';
import mime from 'mime';
import FormData from "form-data";
import logger from '../utils/logger.js';
import { 
   INFURA_IPFS_PROJECT_ID, 
   INFURA_IPFS_PROJECT_SECRET, 
   INFURA_IPFS_ENDPOINT 
} from '../utils/env.js';

export class IPFSService {

   /** @type {import('axios').AxiosInstance} */
   #IPFSHttp = null;

   constructor() {
      this.#IPFSHttp = axios.create({
         baseURL: INFURA_IPFS_ENDPOINT,
         auth: {
            username: INFURA_IPFS_PROJECT_ID,
            password: INFURA_IPFS_PROJECT_SECRET
         }
      });
   }

   /**
    * Add new file to ipfs
    * @param {Buffer} file
    * @param {string} filename
    */
   async addFile(file, filename) {
      return new Promise(async (resolve, reject) => {
         const formData = new FormData();
         let headers, contentType;

         contentType = mime.getType(filename);

         formData.append("file", file, {
            filename,
            contentType
         });

         headers = formData.getHeaders();

         this.#IPFSHttp.post("/api/v0/add?pin=true", formData, { headers })
            .then((response) => {
               const result = response.data;

               logger.info(
                  "IPFSService:addFile",
                  // @ts-ignore
                  `Hash: ${result.Hash}, Size: ${result.Size}`
               );
               resolve(result);
            })
            .catch((error) => {
               logger.error("IPFSService:addFile", error);
               reject(error);
            });
      });
   }

   /**
    * Get file from ipfs
    * @param {string} hash
    */
   async getFile(hash) {
      const response = await this.#IPFSHttp.get("/api/v0/cat?arg=" + hash);
      return response.data;
   }

   /**
    * Pin specified file on IPFS
    * @param {string} hash
    */
   async pinFile(hash) {
      const pinnedFile = await this.#IPFSHttp.post("/api/v0/pin/add?arg=" + hash, {});
      return pinnedFile.data;
   }

   /**
    * Unpin specified file on IPFS
    * @param {string} hash
    */
   async unpinFile(hash) {
      const unpinnedFile = await this.#IPFSHttp.post(
         "/api/v0/pin/rm?arg=" + hash,
         {}
      );
      logger.info(
         "IPFSService:unpinFile",
         `Hash: ${hash}`
      );
      return unpinnedFile.data;
   }
}
