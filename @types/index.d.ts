
declare interface ApiResponse {
   statusCode: number,
   message: string,
   result?: any
}

interface AppRequestLocals {
   urlPath?: string,
   requestId?: DocId,
   userId?: DocId,
   adminId?: DocId
}

declare namespace Express {
   interface Request {
      locals?: AppRequestLocals
   }
}

declare type DocId = import('mongodb').ObjectId
declare type NodeEnv = 'production' | 'development' | 'stagging'

declare interface Doc {
   _id?: import('mongodb').ObjectId
}
declare interface DocTimestamps {
   createdAt?: string,
   updatedAt?: string
}
declare interface MutableDoc extends Doc, DocTimestamps {}
declare interface ImmutableDoc extends Doc, Omit<DocTimestamps, 'updatedAt'> {}
