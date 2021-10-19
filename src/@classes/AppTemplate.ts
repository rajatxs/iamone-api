import * as handlebars from 'handlebars'
import { join } from 'path'
import { readFile } from 'fs'

export interface AppTemplateInitOptions {
   rootPath: string,
   layout?: string,
}

export abstract class AppTemplate<T> {
   protected instance: typeof handlebars
   protected readonly TEMPLATE_FILE_EXTENSION = 'hbs'
   protected readonly DEFAULT_LAYOUT = 'main.layout'

   public constructor(public options: AppTemplateInitOptions) {
      this.instance = handlebars.create()

      if (!this.options.layout) {
         this.options.layout = this.DEFAULT_LAYOUT
      }
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

   /** Register new helper */
   protected $helper(name: string, fun: handlebars.HelperDelegate) {
      this.instance.registerHelper(name, fun)
   }

   /** Read layout code from selected layout */
   private getLayoutCode(): Promise<string> {
      return this.getCode(this.layoutPath)
   }

   /** Inject template body into selected layout */
   private async injectIntoLayout(body: string) {
      const layout = this.instance.compile(await this.getLayoutCode())

      return layout({ body })
   }

   /** Compiled specified template file */
   public async $compile(templateName: string, data: T, options?: handlebars.RuntimeOptions): Promise<string> {
      const template = this.instance.compile(await this.getTemplateCode(templateName))
      const body = template(data, options)

      return this.injectIntoLayout(body)
   }

   /** Selected layout name */
   protected get layoutFile(): string {
      return this.options.layout + '.' + this.TEMPLATE_FILE_EXTENSION
   }

   /** Resolve template path */
   protected resolveTemplatePath(templateName: string) {
      return join(this.options.rootPath, templateName + '.' + this.TEMPLATE_FILE_EXTENSION)
   }

   /** Layout path */
   protected get layoutPath() {
      return join(
         this.options.rootPath,
         'layouts',
         this.layoutFile
      )
   }
}
