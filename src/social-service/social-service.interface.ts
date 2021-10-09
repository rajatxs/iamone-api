export interface SocialService extends Doc {
   key: string
   name: string
   icon: string
   about?: string
   website?: string
   templateUrl: string
}

export type PartialSocialService = Partial<SocialService>
