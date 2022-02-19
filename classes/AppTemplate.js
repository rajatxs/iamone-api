import * as handlebars from 'handlebars';
import { join } from 'path';
import { readFile } from 'fs';

export class AppTemplate {
   /** @type {handlebars} */
   instance = null;

   TEMPLATE_FILE_EXTENSION = 'hbs';
   THEME_FILE_EXTENSION = 'css';
   DEFAULT_LAYOUT = 'default.layout';

   /**
    * @param {string} rootDir
    */
   constructor(rootDir) {
      this.rootDir = rootDir;
      this.instance = handlebars.create();
   }

   /**
    * Read code from given file
    * @param {string} path
    * @returns {Promise<string>}
    */
   getCode(path) {
      return new Promise((resolve, reject) => {
         readFile(path, 'utf8', (error, data) => {
            if (error) {
               return reject(error);
            }

            resolve(data);
         });
      });
   }

   /**
    * Read template code from given template file
    * @param {string} templateName
    * @returns {Promise<string>}
    */
   getTemplateCode(templateName) {
      return this.getCode(this.resolveTemplatePath(templateName));
   }

   /**
    * Register new helper
    * @param {string} name
    * @param {handlebars.HelperDelegate} fun
    */
   $helper(name, fun) {
      this.instance.registerHelper(name, fun);
   }

   /** 
    * Read layout code from selected layout
    * @returns {Promise<string>}
    */
   getLayoutCode() {
      return this.getCode(this.layoutPath);
   }

   /** 
    * Compiled specified template file
    * @param {string} templateName
    * @param {object} [data]
    * @param {handlebars.RuntimeOptions} [options]
    * @returns {Promise<string>}
    */
   async $compile(templateName, data, options) {
      const template = this.instance.compile(
         await this.getTemplateCode(templateName)
      );
      const layout = this.instance.compile(await this.getLayoutCode());
      const body = template(data, options);

      return layout(Object.assign(data, { body }));
   }

   /** 
    * Resolve template path
    * @param {string} templateName
    */
   resolveTemplatePath(templateName) {
      return join(
         this.rootDir,
         templateName + '.' + this.TEMPLATE_FILE_EXTENSION
      );
   }

   /** Layout path */
   get layoutPath() {
      return join(
         this.rootDir,
         this.DEFAULT_LAYOUT + '.' + this.TEMPLATE_FILE_EXTENSION
      );
   }
}
