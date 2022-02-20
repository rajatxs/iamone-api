
interface AppRequestLocals {
   urlPath: string,
   requestId: DocId,
   userId: DocId,
   adminId: DocId
}

declare namespace Express {
   interface Request {
      locals: Partial<AppRequestLocals>
   }
   interface Response {
      send400(message: string): void
      send401(message: string): void
      send404(message: string): void
      send409(message: string): void
      send500(message: string): void
   }
}

declare type DocId = import('mongodb').ObjectId

declare interface Doc {
   _id?: import('mongodb').ObjectId
}
declare interface DocTimestamps {
   createdAt?: string,
   updatedAt?: string
}

declare interface MutableDoc extends Doc, DocTimestamps {}
declare interface ImmutableDoc extends Doc, Omit<DocTimestamps, 'updatedAt'> {}

declare enum ModelTimestampType {
   ALL = 1,
   CREATED_AT = 2,
   UPDATED_AT = 3,
}

declare interface ModelInitOptions {
   timestamps?: ModelTimestampType
}
