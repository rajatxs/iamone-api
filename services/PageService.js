import path from 'path';
import handlebars from 'handlebars';
import { UserService } from './UserService.js';
import { AppTemplate } from '../classes/AppTemplate.js';
import { SocialLinkService } from './SocialLinkService.js';
import { ThemeService } from './ThemeService.js';
import { LinkService } from './LinkService.js';
import { PageConfigService } from './PageConfigService.js';
import { SocialPlatformService } from './SocialPlatformService.js';

export class PageService extends AppTemplate {
   #userService = new UserService();
   #socialLinkService = new SocialLinkService();
   #linkService = new LinkService();
   #themeService = new ThemeService();
   #socialPlatformService = new SocialPlatformService();
   #pageConfigService = new PageConfigService();

   constructor() {
      super(path.resolve('templates'));
   }

   /**
    * Resolve social links
    * @param {any[]} links
    */
   resolveSocialLinks(links) {
      return links.map((link) => {
         const platform = this.#socialPlatformService.list.find(
            (platform) => platform.key === link.platformKey
         );

         if (!platform) {
            return null;
         }

         const delegate = handlebars.compile(platform.templateUrl);

         link['href'] = delegate(link);

         return link;
      });
   }

   /**
    * Compile template code
    * @param {string} templateName
    * @param {object} data
    */
   compileTemplate(templateName, data) {
      return this.$compile(templateName, data);
   }

   /**
    * Returns page template data
    * @param {DocId} userId
    */
   async getTemplateDataByUserId(userId) {
      return {
         user: await this.#userService.get(userId),
         social: await this.#socialLinkService.findAll({ userId }),
         links: await this.#linkService.findAll({ userId }),
         page: await this.#pageConfigService.findByUserId(userId),
      };
   }

   /**
    * Returns page template data by username
    * @param {string} username
    */
   async getTemplateDataByUsername(username) {
      const user = await this.#userService.findOne({ username });
      let userId, social, css, page;

      if (!user) {
         return;
      }

      userId = user['_id'];
      social = this.resolveSocialLinks(await this.#socialLinkService.findAll({ userId }));
      page = await this.#pageConfigService.findByUserId(userId);
      css = await this.#themeService.compile(page.theme, page.styles);

      return {
         user,
         social: social,
         links: await this.#linkService.findAll({ userId }),
         page,
         css
      };
   }
}
