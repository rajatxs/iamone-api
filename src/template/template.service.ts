import { Injectable } from '@nestjs/common'
import { join } from 'path'
import { AppTemplate } from '@classes/AppTemplate'
import { UserService } from '../user/user.service'
import { User } from '../user/user.interface'
import { PartialSocialRef } from '../social-ref/social-ref.interface'
import { SocialRefService } from '../social-ref/social-ref.service'
import { ClinkService } from '../clink/clink.service'
import { SocialServiceProvider } from '../social-service/social-service.service'
import { TemplateDataObject, TemplateSocialRefDataObject } from './template.interface'
import { compile } from 'handlebars'
import { CLink } from 'src/clink/clink.interface'

@Injectable()
export class TemplateService extends AppTemplate<any> {
   public constructor(
      private readonly userService: UserService,
      private readonly socialRefService: SocialRefService,
      private readonly socialServiceProvider: SocialServiceProvider,
      private readonly clinkService: ClinkService
   ) { 
      super({ rootPath: join(__dirname, '..', '..', 'templates') })
   }

   public async resolveSocialRefLinks(refs: PartialSocialRef[]): Promise<TemplateSocialRefDataObject[]> {
      let links: TemplateSocialRefDataObject[]
 
      // getting social services mathcing with 'key' from refs
      const services = this.socialServiceProvider.list

      // resolve individual links from slug
      links = refs.map<TemplateSocialRefDataObject>(ref => {
         const service = services.find(service => service.key === ref.socialServiceKey)
         let link: any

         if (!service) {
            return null
         }

         link = compile(service.templateUrl)

         ref['link'] = link(ref)

         return ref
      })

      return links
   }

   /** Compile template code */
   public compileTemplate(data: TemplateDataObject) {
      return this.$compile('primary', data)
   }

   /** Find data from user related collections */
   public async findDataByUsername(username: string): Promise<TemplateDataObject> {
      let user: User, socials: PartialSocialRef[], links: CLink []

      user = await this.userService.findOne({ username })

      if (!user) {
         return null
      }

      socials = await this.socialRefService.findAll({ userId: user._id })
      socials = await this.resolveSocialRefLinks(socials)

      links = await this.clinkService.findAll({ userId: user._id })

      return {
         user,
         social: socials,
         links
      }
   }
}
