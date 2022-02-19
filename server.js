import express from 'express';

(async function() {

   /** @type {import('express').Application} */
   let app;

   /** @type {import('http').Server} */
   let server;

   if (process.env.NODE_ENV !== 'production') {
      const { config } = await import('dotenv');
      config();
   }

   const { NODE_ENV, PORT } = await import('./utils/env.js');
   const { default: logger } = await import('./utils/logger.js');
   const { default: routes } = await import('./routes/routes.js');
   const { default: cors } = await import('./config/cors.js');
   const { HTTPRequestLogger } = await import('./middlewares/common.js');
   const { connect: connectMongo, disconnect: disconnectMongo } = await import('./utils/mongo.js');

   app = express();

   await connectMongo();

   app.use(cors);
   app.use(express.json({ limit: '8mb', type: "application/json" }));
   app.use(HTTPRequestLogger);
   app.use(routes);

   server = app.listen(PORT, () => {
      if (NODE_ENV === 'development') {
         logger.info('App', `Server running on port ${PORT}`);         
      }
   });

   /** Handle 404 response */
   app.use((req, res, next) => {
      res.status(404).send({
         message: "Invalid route"
      });
   });

   /** Handle 500 response */
   app.use((error, req, res, next) => {
      res.status(500).send({
         message: error || "Something went wrong",
      });
   });

   process.on('SIGINT', async () => {
      let code = 0;

      await disconnectMongo();

      if (server.listening) {
         server.close((error) => {
            if (error) {
               code = 1;
               logger.error("APP", "Server is closing abnormally", error);
            }
            logger.info("App", "Server closed");
            process.exit(code);
         })
      }
   });
}())
