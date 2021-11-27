import { Document } from 'mongodb'

export interface User extends Document, MutableDoc {
   username: string
   fullname?: string
   bio?: string
   company?: string
   email: string
   emailVerified?: boolean
   passwordHash: string,
   image?: DocId
}

export type UserCredentials = Pick<User, 'username' | 'email' | 'password'>

export type PartialUser = Partial<User>

export type MutableUserFields = Pick<User, 'fullname' | 'bio' | 'company' | 'image'>

export interface PasswordUpdateFields {
   currentPassword: string,
   newPassword: string
}

export interface PasswordResetFields {
   email: string,
   password: string,
   code: string
}
