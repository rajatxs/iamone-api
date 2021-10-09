import { Document } from 'mongodb'

export interface User extends Document, ImmutableDoc {
   username: string,
   fullname?: string,
   bio?: string,
   company?: string,
   email: string,
   emailVerified?: boolean,
   passwordHash: string
}

export type UserCredentials = Pick<User, 'username' | 'email' | 'password'>

export type PartialUser = Partial<User>
