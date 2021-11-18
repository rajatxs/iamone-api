import { memoryStorage, Options } from 'multer'

export const UserImageUploadOptions: Options = {
   limits: {
      fields: 1,
      fieldSize: 5000000,
   },
   storage: memoryStorage()
}
