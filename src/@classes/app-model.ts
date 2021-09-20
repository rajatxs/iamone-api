import {
   Pool,
   createPool,
   ConnectionConfig,
   OkPacket
} from 'mysql'
import env from '@utils/env'

export class AppModalService {

   private $pool: Pool

   /**
    * Create model service instance
    * @param modelName - Model name
    * @param $data - Mixins
    */
   public constructor(protected modelName: string, protected $data: object = {}) {
      const conn = this.getConnectionObject()
      this.$pool = createPool(conn)
   }

   /**
    * Execute SQL Query
    * @param sql - SQL Query
    * @param params - Query params
    * @param toArray - Resolve as array
    */
   protected $query<T>(sql: string, params: any[] = [], toArray: boolean = false): Promise<T> {
      return new Promise((resolve, reject) => {
         this.$pool.getConnection((connError, conn) => {
            let rows: any, fields: any[], result: any | any[]

            if (connError) {
               return reject(connError)
            }

            conn.query(sql, params, (err, fetchedRows, fetchedFields) => {
               if (err) {
                  return reject(err)
               }

               rows = fetchedRows
               fields = fetchedFields
               result = toArray ? [rows, fields] : rows

               resolve(result)
               conn.release()
            })
         })
      })
   }

   /** Insert one row to specified table */
   protected $insertOne(data: object) {

      // assign mixins
      data = Object.assign(this.$data, data)

      return this.$query<OkPacket>("INSERT INTO ?? SET ?;", [this.modelName, data])
   }

   /** Update row data by id */
   protected $updateById(id: RowId, newData: object) {

      // assign mixins
      const data = Object.assign(this.$data, newData)

      return this.$query<OkPacket>(
         "UPDATE ?? SET ? WHERE id=?;", 
         [this.modelName, data, id]
      )
   }

   /**
    * Find one row from specified table
    * @param colName - Column name
    * @param value - Column value
    */
   protected async $findOne<T>(colName: string, value: unknown): Promise<T | null> {
      let row: T | null = null
      const res = await this.$query(
         "SELECT * FROM ?? WHERE ??=? LIMIT 1",
         [this.modelName, colName, value]
      )

      if (Array.isArray(res) && res.length > 0) {
         row = res[0]
      }
      return row
   }

   /**
    * Check for existance of specific row
    * @param colName - Column name
    * @param value - Column value
    */
   protected async $existsOneRow(colName: string, value: unknown): Promise<boolean> {
      let row: any
      const res = await this.$query(
         "SELECT EXISTS(SELECT 1 FROM ?? WHERE ??=?) AS INCLUDED;",
         [this.modelName, colName, value]
      )

      if (Array.isArray(res)) {
         row = res[0]
      }

      return Boolean(row.INCLUDED)
   }

   /**
    * Delete one row
    * @param colName - Column name
    * @param value - Column value
    */
   protected $deleteOneRow(colName: string, value: unknown) {
      return this.$query<OkPacket>(
         "DELETE FROM ?? WHERE ??=? LIMIT 1;",
         [this.modelName, colName, value]
      )
   }

   /**
    * Delete many rows
    * @param colName - Column name
    * @param value - Column value
    */
   protected $deleteManyRows(colName: string, value: unknown) {
      return this.$query<OkPacket>(
         "DELETE FROM ?? WHERE ??=?;",
         [this.modelName, colName, value]
      )
   }

   /** Escape an untrusted string */
   protected $escape(...args: any[]) {
      return this.$pool.escape(args)
   }

   /** Close SQL connection */
   protected $end(): Promise<void> {
      return new Promise((resolve, reject) => {
         this.$pool.end((err) => {
            if (err) {
               return reject(err)
            }

            resolve()
         })
      })
   }

   /** Get database connection object */
   protected getConnectionObject(moreOpt: ConnectionConfig = {}) {
      let obj: ConnectionConfig = {
         user: env.dbUsername,
         password: env.dbPassword,
         database: env.dbName,
         socketPath: `${env.dbSocketPath}/${env.dbConnectionName}`
      }

      // config for local
      if (env.nodeEnv !== 'production') {
         obj.host = env.dbHostname
         obj.port = env.dbPort
         delete obj.socketPath
      }

      obj = Object.assign(obj, moreOpt)

      return obj
   }
}
