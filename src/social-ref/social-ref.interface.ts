
export interface SocialRef extends MutableDoc {
   label?: string,
   slug: string,
   index?: number,
   socialServiceKey: string,
   userId: DocId
}

export type PartialSocialRef = Partial<SocialRef>
