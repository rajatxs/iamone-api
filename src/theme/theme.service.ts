import { Injectable } from '@nestjs/common'
import * as handlebars from 'handlebars'
import { join } from 'path'
import { readFileContent } from '@utils/common'

@Injectable()
export class ThemeService {
   protected hbs: typeof handlebars
   private DEFAULT_STYLE_TEMPLATE = join(
      __dirname, '..', '..', 'templates', 'default.style.hbs'
   )

   public constructor() {
      this.hbs = handlebars.create()
      this.hbs.registerPartial('useProperty', (context, options) => {
         const prop = context.name;
         const root = options.data.root;

         return (prop in root)? root[prop]: context.default
      })
   }

   public async compile(themeName?: string, customStyleObject = {}): Promise<string> {
      let themeConfig = {}, themeObject = {}, styleCode: string, delegation: any

      if (themeName) {
         themeConfig = await import("../../themes/" + themeName + '.json')
      }

      themeObject = { ...themeConfig, ...customStyleObject }

      styleCode = await readFileContent(this.DEFAULT_STYLE_TEMPLATE, 'utf8') as string
      delegation = this.hbs.compile(styleCode, { data: true })

      return delegation(themeObject)
   }
}
