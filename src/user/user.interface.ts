
export interface User extends MutableRow {
   username: string,
   email: string,
   email_verified?: boolean,
   password_hash: string
}

export type PartialUser = Partial<User>
