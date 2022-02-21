import handlebars from 'handlebars';
import path from 'path';
import { readFileContent } from '../utils/common.js';
import themes from '../data/themes.js';

export class ThemeService {
   #hbs = handlebars.create();
   #DEFAULT_STYLE_TEMPLATE = path.resolve(
      'templates',
      'default.style.hbs'
   );

   constructor() {
      this.#hbs.registerPartial('useProperty', (context, options) => {
         const prop = context.name;
         let root;

         if (options) {
            root = options.data.root;
         }

         return prop in root ? root[prop] : context.default;
      });
   }

   /** Returns all themes */
   findAll() {
      return themes;
   }

   /**
    * Returns theme collection by `id`
    * @param {string} id 
    */
   findByCollectionId(id) {
      return themes.find(theme => theme.id === id);
   }

   /**
    * Returns theme by `themeKey`
    * @param {string} collectionId 
    * @param {string} themeKey 
    * @returns 
    */
   findOne(collectionId, themeKey) {
      return themes
         .find(coll => coll.id === collectionId)?.themes
         .filter(theme => theme.key === themeKey);
   }

   /**
    * Compile specified theme
    * @param {string} themeName 
    * @param {object} customStyleObject 
    */
   async compile(themeName, customStyleObject = {}) {
      let themeConfig = {}, themeObject = {}, styleCode, delegation;

      if (themeName) {
         const content = await readFileContent(path.resolve('themes', themeName + '.json'), 'utf8');
         themeConfig = JSON.parse(content);
      }

      themeObject = { ...themeConfig, ...customStyleObject };

      styleCode = await readFileContent(this.#DEFAULT_STYLE_TEMPLATE, 'utf8');
      delegation = this.#hbs.compile(styleCode, { data: true })

      return delegation(themeObject)
   }
}
