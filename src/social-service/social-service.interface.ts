export interface SocialService {
   key: string
   name: string
   about?: string
   website?: string
   templateUrl: string
}

export type PartialSocialService = Partial<SocialService>
