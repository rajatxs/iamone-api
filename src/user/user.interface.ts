import { Document } from 'mongodb'

export interface User extends Document, MutableDoc {
   username: string
   fullname?: string
   bio?: string
   company?: string
   email: string
   emailVerified?: boolean
   passwordHash: string
}

export type UserCredentials = Pick<User, 'username' | 'email' | 'password'>

export type PartialUser = Partial<User>

export type MutableUserFields = Pick<User, 'fullname' | 'bio' | 'company'>
