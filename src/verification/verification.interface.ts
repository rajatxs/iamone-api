
export enum VerificationType {
   EMAIL_VERIFICATION = "1"
}

export interface Verification extends MutableDoc {
   type: VerificationType,
   code: string,
   duration?: string,
   userId: DocId
}

export type PartialVerification = Partial<Verification>
