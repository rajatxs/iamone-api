import { User } from '../user/user.interface'
import { PartialPageConfig } from '../page-config/page-config.interface'
import { PartialSocialRef } from '../social-ref/social-ref.interface'

export interface TemplateSocialRefDataObject extends PartialSocialRef {
   link?: string
}

export interface TemplateDataObject {
   user: User,
   social: TemplateSocialRefDataObject[],
   links: any[],
   page: PartialPageConfig,
   options?: any
}
