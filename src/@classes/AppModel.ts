import { Logger } from '@nestjs/common'
import { Collection, Filter, ObjectId } from 'mongodb'
import { mongo } from '@utils/db'

export enum timestampType {
   ALL = 1,
   CREATED_AT = 2,
   UPDATED_AT = 3,
}

export interface ModelInitOptions {
   timestamps?: timestampType
}

export abstract class AppModel {
   protected model: Collection
   protected readonly logger = new Logger

   /**
    * @param modelName - Model name
    * @param options - Model initialize options
    */
   public constructor(protected readonly modelName: string, protected readonly options: ModelInitOptions = {}) {
      try {
         const db = mongo()
         this.model = db.collection(modelName)
      } catch (error) {
         this.logger.error(`Failed to instantiate <${this.modelName}> model`)
         throw new Error("Failed to serve your request")
      }
   }

   /** Current timestamp */
   private get timestamp(): Date {
      return new Date()
   }

   /** Convert to ObjectId */
   protected $docId(val: string | ObjectId): ObjectId {
      return (val instanceof ObjectId)? val: new ObjectId(val)
   }

   /** To regular document */
   protected $doc<T>(obj: any = {}): T & Doc & DocTimestamps {

      // to ObjectId
      if ('_id' in obj && typeof obj._id === 'string') {
         obj._id = new ObjectId(obj._id)
      } else {
         obj._id = new ObjectId()
      }

      // attach timestamps
      if(this.options.timestamps) {
         const ts = (<ObjectId>obj._id).getTimestamp()

         switch (this.options.timestamps) {
            case timestampType.ALL:
               obj.createdAt = obj.createdAt || ts
               obj.updatedAt = obj.updatedAt || ts
               break

            case timestampType.CREATED_AT:
               obj.createdAt = obj.createdAt || ts
               break

            case timestampType.UPDATED_AT:
               obj.updatedAt = obj.updatedAt || ts
               break
         }
      }

      return obj
   }

   /** Insert single document */
   protected $insert<T>(doc: Doc) {
      doc = this.$doc<T>(doc)
      return this.model.insertOne(doc)
   }

   /** Document existence */ 
   protected $exists<T>(query: Filter<T>): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
         let count: number, result = false

         try {
            count = await this.model.countDocuments(query, { readPreference: 'nearest' })
         } catch (error) {
            return reject(error)
         }

         if (count > 0) { result = true }

         resolve(result)
      })
   }

   /** Check document existance by id */
   protected $existsId<T>(id: string | DocId) {
      return this.$exists<T>({ _id: this.$docId(id) })
   }

   /** Find single document by id */
   protected $findById<T>(id: string | DocId) {
      return this.model.findOne<T>({ _id: this.$docId(id) })
   }

   /** Update single document by id */
   protected $updateById<T>(id: string | DocId, update: T) {
      delete update['_id']

      return this.model.updateOne({ _id: this.$docId(id) }, { $set: update })
   }

   /** Delete single document by id */
   protected $deleteById(id: string | DocId) {
      return this.model.deleteOne({ _id: this.$docId(id) })
   }
}
