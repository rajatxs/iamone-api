
export interface SocialService extends MutableDoc {
   name: string,
   icon: string,
   about?: string,
   website?: string,
   templateUrl: string
}

export type PartialSocialService = Partial<SocialService>
