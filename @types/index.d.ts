
declare interface ApiResponse {
   statusCode: number,
   message: string,
   result?: any
}

interface AppRequestLocals {
   urlPath?: string,
   requestId?: RowId
}

declare namespace Express {
   interface Request {
      locals?: AppRequestLocals
   }
}

declare type RowId = number
declare type NodeEnv = 'production' | 'development' | 'stagging'

declare interface Row {
   id?: RowId
}
declare interface RowTimestamps {
   created_at?: string,
   updated_at?: string
}
declare interface MutableRow extends Row, RowTimestamps {}
declare interface ImmutableRow extends Row, Omit<RowTimestamps, 'updated_at'> {}
