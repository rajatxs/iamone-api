import multer from 'multer';

export const profileImageUpload = multer({
   storage: multer.memoryStorage(),
   limits: {
      fileSize: 5000000,
      files: 1,
   }
});
