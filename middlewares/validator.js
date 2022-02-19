/**
 * Validates request body
 * @param {import('joi').Schema} schema
 */
 export function RequestBodyValidator(schema) {

   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    */
   return function(req, res, next) {
      const body = req.body;
      const { value, error } = schema.validate(body, {
         convert: true,
         allowUnknown: false,
         skipFunctions: true
      });

      if (error) {
         return res.status(400).send({
            message: error.message
         });
      }

      req.body = value;
      next(null);
   }
}
