import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { UserAuthorization } from '../middlewares/auth.js';
import { RequestBodyValidator } from '../middlewares/validator.js';
import { profileImageUpload } from '../middlewares/multer.js';
import { 
   createSchema, 
   verifySchema, 
   updateSchema,
   usernameUpdateSchema,
   emailUpdateSchema,
   emailVerificationSchema,
   passwordUpdateSchema,
   passwordResetSchema,
   passwordResetRequestSchema
} from '../schema/user.body.js';

const router = Router();
const userController = new UserController();

router.post(
   '/register',
   RequestBodyValidator(createSchema),
   userController.registerNewUser.bind(userController)
);

router.post(
   '/token',
   RequestBodyValidator(verifySchema),
   userController.generateAuthToken.bind(userController)
);

router.get(
   '/profile',
   UserAuthorization,
   userController.getAccountDetail.bind(userController)
);

router.get(
   '/profile/data',
   UserAuthorization,
   userController.getProfileData.bind(userController)
);

router.put(
   '/image',
   UserAuthorization,
   userController.updateProfilePicture.bind(userController)
);

router.delete(
   '/image',
   UserAuthorization,
   userController.removeProfileImage.bind(userController)
);

router.put(
   '/profile',
   UserAuthorization,
   RequestBodyValidator(updateSchema),
   userController.updateProfile.bind(userController)
);

router.get(
   '/email/verification',
   UserAuthorization,
   userController.sendEmailVerificationCode.bind(userController)
);

router.put(
   '/username',
   UserAuthorization,
   RequestBodyValidator(usernameUpdateSchema),
   userController.changeUsername.bind(userController)
);

router.put(
   '/email',
   UserAuthorization,
   RequestBodyValidator(emailUpdateSchema),
   userController.changeEmail.bind(userController)
);

router.post(
   '/email/verify',
   UserAuthorization,
   RequestBodyValidator(emailVerificationSchema),
   userController.verifyEmailFromVerificationCode.bind(userController)
);

router.put(
   '/password',
   UserAuthorization,
   RequestBodyValidator(passwordUpdateSchema),
   userController.changePassword.bind(userController)
);

router.post(
   '/password/request-reset',
   RequestBodyValidator(passwordResetRequestSchema),
   userController.sendPasswordResetCode.bind(userController)
);

router.put(
   '/password/reset',
   RequestBodyValidator(passwordResetSchema),
   userController.resetPassword.bind(userController)
);

router.delete(
   '/account',
   UserAuthorization,
   userController.deleteUserAccount.bind(userController)
);

export default router;
