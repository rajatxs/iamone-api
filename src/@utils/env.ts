
const env = {

   /** Resolve env String as Array */
   _resolveArray(varname: string): string[] {
      const val = process.env[varname];
      let list = [];

      if (typeof val !== 'string') {
         return [];
      }

      list = val
         .split(',')
         .map(item => item.trim())
         .filter(item => typeof item === 'string' && item.length > 0);

      return list;
   },

   /** Server runtime environment */
   get nodeEnv(): NodeEnv {
      return process.env.NODE_ENV as NodeEnv || 'development'
   },

   /** Server port */
   get port() {
      return Number(process.env.PORT)
   },

   /** Database Hostname */
   get dbHostname() {
      return process.env.DB_HOSTNAME
   },

   /** Database Username */
   get dbUsername() {
      return process.env.DB_USERNAME
   },

   /** Database Server Port */
   get dbPort() {
      return Number(process.env.DB_PORT)
   },

   /** Database Password */
   get dbPassword() {
      return process.env.DB_PASSWORD
   },

   /** Database Name */
   get dbName() {
      return process.env.DB_NAME
   },

   /** Database socket path */
   get dbSocketPath() {
      return process.env.DB_SOCKET_PATH
   },

   /** Database connection name */
   get dbConnectionName() {
      return process.env.DB_CONNECTION_NAME
   },

   /** JWT Private key */
   get jwtPrivateKey() {
      return process.env.JWT_PRIVATE_KEY
   }
}

export default env
