import { CorsOptions } from 'cors'

export const CorsConfig: CorsOptions = {
   origin: '*',
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   allowedHeaders: [
      'Accept',
      'Accept-Language',
      'Accept-Encoding',
      'Host',
      'Origin',
      'Cache-Control',
      'Content-Length',
      'Content-Type',
      'Authorization',
      'X-Auth-Token',
      'User-Agent'
   ]
}
