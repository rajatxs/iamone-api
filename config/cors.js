import cors from 'cors';

/** @type {import('cors').CorsOptions} */
const options = {
   origin: '*',
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   allowedHeaders: ['Authorization', 'Accept', 'Content-Type', 'X-Client-Id']
};

export default cors(options);
