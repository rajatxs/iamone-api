
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

   /** Server host url */
   get hostUrl(): string {
      return process.env.HOST_URL
   },

   /** Server runtime environment */
   get nodeEnv(): NodeEnv {
      return process.env.NODE_ENV as NodeEnv || 'development'
   },

   /** Server port */
   get port() {
      return Number(process.env.PORT)
   },

   /** MongoDB Connection URL */
   get mongoConnectionUrl() {
      return process.env.MONGO_CONNECTION_URL
   },

   /** JWT Private key */
   get jwtPrivateKey() {
      return process.env.JWT_PRIVATE_KEY
   },

   /** JWT Admin Private key */
   get jwtAdminPrivateKey() {
      return process.env.JWT_ADMIN_PRIVATE_KEY
   },

   /** SendGrid API Key */
   get sendgridApiKey() {
      return process.env.SENDGRID_API_KEY
   }
}

export default env
