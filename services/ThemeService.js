import handlebars from 'handlebars';
import { join } from 'path';
import { readFileContent } from '../utils/common.js';

export class ThemeService {
   #hbs = null;

   #DEFAULT_STYLE_TEMPLATE = join(
      __dirname,
      '..',
      '..',
      'templates',
      'default.style.hbs'
   );

   constructor() {
      this.#hbs = handlebars.create();
      this.#hbs.registerPartial('useProperty', (context, options) => {
         const prop = context.name;
         const root = options.data.root;

         return prop in root ? root[prop] : context.default;
      });
   }

   /**
    * Compile stylesheet
    * @param {string} [themeName]
    * @param {object} [customStyleObject]
    * @returns {Promise<string>}
    */
   async compile(themeName, customStyleObject = {}) {
      let themeConfig = {},
         themeObject = {},
         styleCode,
         delegation;

      if (themeName) {
         themeConfig = await import('../../themes/' + themeName + '.json');
      }

      themeObject = { ...themeConfig, ...customStyleObject };

      styleCode = await readFileContent(this.#DEFAULT_STYLE_TEMPLATE, 'utf8');
      delegation = this.#hbs.compile(styleCode, { data: true });

      return delegation(themeObject);
   }
}
