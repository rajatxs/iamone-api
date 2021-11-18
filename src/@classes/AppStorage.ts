import { 
   GridFSBucket, 
   WriteConcernSettings, 
   WriteConcern, 
   GridFSBucketWriteStreamOptions,
   GridFSBucketReadStreamOptionsWithRevision,
   Filter,
   GridFSFile,
   FindOptions,
   Document
} from 'mongodb'
import { createReadStream } from 'fs'
import { mongo } from '@utils/db'
import { toDocId } from '@utils/common'

export class AppStorage {
   protected bucket: GridFSBucket

   public constructor(public bucketName: string, writeConcern?: WriteConcernSettings | WriteConcern) {
      const db = mongo()

      this.bucket = new GridFSBucket(db, {
         bucketName,
         writeConcern
      })
   }

   /** Get files from bucket */
   public find(filter?: Filter<GridFSFile>, options?: FindOptions<Document>) {
      return this.bucket.find(filter, options).toArray()
   }

   /** Check whether files exists or not */
   public async exists(_id: string | DocId) {
      let files: GridFSFile[]
      _id = toDocId(_id)

      files = await this.bucket.find({ _id }, { limit: 1 }).toArray()

      return (files.length > 0)
   }

   /** Write file to GridFS Bucket */
   public upload(filepath: string, filename: string, options?: GridFSBucketWriteStreamOptions) {
      return new Promise((resolve, reject) => {
         const read = createReadStream(filepath)
         const write = this.bucket.openUploadStream(filename, options)
         
         read.pipe(write)
         read.on('error', reject)

         write.on('error', reject)
         write.on('finish', resolve)
      })
   }

   /** Open download stream */
   public download(id: string | DocId, options?: GridFSBucketReadStreamOptionsWithRevision) {
      id = toDocId(id)
      return this.bucket.openDownloadStream(id, options)
   }

   /** Get writable stream */
   public writable(filename: string, options?: GridFSBucketWriteStreamOptions) {
      return this.bucket.openUploadStream(filename, options)
   }

   /** Remove file from bucket */
   public remove(id: string | DocId) {
      id = toDocId(id)

      return this.bucket.delete(id)
   }
}
