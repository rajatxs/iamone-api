import { GridFSBucket } from 'mongodb';
import { createReadStream } from 'fs';
import { mongo } from '../utils/mongo.js';
import { toDocId } from '../utils/common.js';

export class AppStorage {
   /** @type {import('mongodb').GridFSBucket} */
   bucket = null;

   /**
    * @param {string} bucketName
    * @param {any} [writeConcern]
    */
   constructor(bucketName, writeConcern) {
      const db = mongo();

      this.bucketName = bucketName;

      this.bucket = new GridFSBucket(db, {
         bucketName,
         writeConcern,
      });
   }

   /** Get files from bucket
    * @param {import('mongodb').Filter<import('mongodb').GridFSFile>} [filter]
    * @param {import('mongodb').FindOptions<import('mongodb').Document>} [options]
    */
   find(filter, options) {
      return this.bucket.find(filter, options).toArray();
   }

   /**
    * Check whether files exists or not
    * @param {string | DocId} _id
    */
   async exists(_id) {
      let files;
      _id = toDocId(_id);

      files = await this.bucket.find({ _id }, { limit: 1 }).toArray();

      return files.length > 0;
   }

   /**
    * Write file to GridFS Bucket
    * @param {string} filepath
    * @param {string} filename
    * @param {import('mongodb').GridFSBucketWriteStreamOptions} [options]
    */
   upload(filepath, filename, options) {
      return new Promise((resolve, reject) => {
         const read = createReadStream(filepath);
         const write = this.bucket.openUploadStream(filename, options);

         read.pipe(write);
         read.on('error', reject);

         write.on('error', reject);
         write.on('finish', resolve);
      });
   }

   /**
    * Open download stream
    * @param {string|DocId} id
    * @param {import('mongodb').GridFSBucketReadStreamOptionsWithRevision} [options]
    */
   download(id, options) {
      id = toDocId(id);
      return this.bucket.openDownloadStream(id, options);
   }

   /**
    * Get writable stream
    * @param {string} filename
    * @param {import('mongodb').GridFSBucketWriteStreamOptions} [options]
    */
   writable(filename, options) {
      return this.bucket.openUploadStream(filename, options);
   }

   /**
    * Remove file from bucket
    * @param {string | DocId} id
    */
   remove(id) {
      id = toDocId(id);

      return this.bucket.delete(id);
   }
}
