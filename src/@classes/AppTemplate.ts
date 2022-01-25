import * as handlebars from 'handlebars'
import { join } from 'path'
import { readFile } from 'fs'

export interface AppTemplateInitOptions {
   themeDir: string,
   templateDir: string
}

export abstract class AppTemplate<T> {
   protected instance: typeof handlebars
   protected readonly TEMPLATE_FILE_EXTENSION = 'hbs'
   protected readonly THEME_FILE_EXTENSION = 'css'
   protected readonly DEFAULT_LAYOUT = 'default.layout'

   public constructor(protected options: AppTemplateInitOptions) {
      this.instance = handlebars.create()
   }

   /** Read code from given file */
   private getCode(path: string): Promise<string> {
      return new Promise((resolve, reject) => {
         readFile(path, 'utf8', (error, data) => {
            if (error) {
               return reject(error)
            }

            resolve(data)
         })
      })
   }

   /** Read template code from given template file */
   private getTemplateCode(templateName: string): Promise<string> {
      return this.getCode(this.resolveTemplatePath(templateName))
   }

   private getThemeCode(themeName: string): Promise<string> {
      return this.getCode(this.resolveThemePath(themeName))
   }

   /** Register new helper */
   protected $helper(name: string, fun: handlebars.HelperDelegate) {
      this.instance.registerHelper(name, fun)
   }

   /** Read layout code from selected layout */
   private getLayoutCode(): Promise<string> {
      return this.getCode(this.layoutPath)
   }

   /** Compiled specified template file */
   public async $compile(templateName: string, themeName: string, data: T, options?: handlebars.RuntimeOptions): Promise<string> {
      const template = this.instance.compile(await this.getTemplateCode(templateName))
      const theme = this.instance.compile(await this.getThemeCode(themeName))
      const layout = this.instance.compile(await this.getLayoutCode())
      const body = template(data, options)

      return layout(Object.assign(data, { body, css: theme }))
   }

   /** Resolve template path */
   protected resolveTemplatePath(templateName: string) {
      return join(this.options.templateDir, templateName + '.' + this.TEMPLATE_FILE_EXTENSION)
   }

   protected resolveThemePath(themeName: string) {
      return join(this.options.themeDir, themeName + '.' + this.THEME_FILE_EXTENSION)
   }

   /** Layout path */
   protected get layoutPath() {
      return join(this.options.templateDir, this.DEFAULT_LAYOUT + '.' + this.TEMPLATE_FILE_EXTENSION)
   }
}
