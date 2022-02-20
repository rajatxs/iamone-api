import logger from '../utils/logger.js';
import { UserService } from '../services/UserService.js';
import { setPasswordHash, comparePassword, generatePasswordHash } from '../utils/password.js';
import { verificationCode } from '../utils/random.js';
import { EmailService } from '../services/EmailService.js';
import { VerificationService, VerificationType } from '../services/VerificationService.js';
import { PageConfigService } from '../services/PageConfigService.js';
import { createAvatar } from '@dicebear/avatars';
import { generateUserAuthToken } from '../utils/jwt.js';
import dicebearStyle from '@dicebear/avatars-initials-sprites';

export class UserController {
   name = 'UserController';

   #userService = new UserService();
   #emailService = new EmailService();
   #pageConfigService = new PageConfigService();
   #verificationService = new VerificationService();

   /**
    * Get account detail using auth token
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async getAccountDetail(req, res, next) {
      const { userId } = req.locals;
      let result;
   
      try {
         result = await this.#userService.get(userId);
      } catch (error) {
         logger.error(`${this.name}:getAccountDetail`, "Couldn't load account", error);
         return next("Couldn't load account");
      }

      res.send({ result });
   }

   /**
    * Register new user account
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async registerNewUser(req, res, next) {
      let newUser, result, insertedId, user, data;
      data = req.body;

      if (await this.#userService.hasUsername(data.username)) {
         return res.send400("Account is already registered with given username");
      }

      if (await this.#userService.hasEmail(data.email)) {
         return res.send400("Account is already registered with given email address");
      }

      try {
         data = await setPasswordHash(data);
         newUser = await this.#userService.create(data);
         insertedId = newUser.insertedId;

         logger.info(`${this.name}:registerNewUser`, `User created ${insertedId}`);

         await this.#pageConfigService.create({
            userId: insertedId,
            templateName: 'default',
            theme: 'light-one',
            themeMode: 'AUTO',
            styles: {},
         });

         user = await this.#userService.get(insertedId);

         result = generateUserAuthToken(
            {
               id: insertedId.toString(),
               name: user.fullname,
               email: user.email,
               email_verified: user.emailVerified,
            },
            user.username
         );
      } catch (error) {
         logger.error(`${this.name}:registerNewUser`, "Couldn't create your account", error);
         return next("Couldn't create your account");
      }

      try {
         this.#emailService.sendWelcomeEmail(user.fullname, user.email);
      } catch (error) { }

      res.send({ result });
   }

   /**
    * Generate auth token
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async generateAuthToken(req, res, next) {
      const { username, email, password } = req.body;
      let user, isPasswordCorrect = false, result;

      if (!username && !email) {
         return res.send400('Require username or email');
      }
      // get user object
      try {
         user = await this.#userService.findByUsernameOrEmail(username, email);
      } catch (error) {
         logger.log(`${this.name}:generateAuthToken`, "Couldn't create auth tokens", error);
         return next("Couldn't create auth tokens");
      }
      if (!user) {
         return res.send404('Account not registered with given username or email');
      }

      try {
         isPasswordCorrect = await comparePassword(password, user.passwordHash);
      } catch (error) {
         logger.error(`${this.name}:generateAuthToken`, "Couldn't decrypto your credentials", error);
         return next("Couldn't decrypto your credentials");
      }
      if (!isPasswordCorrect) {
         return res.send400('Incorrect password');
      }

      try {
         result = generateUserAuthToken(
            {
               id: user._id.toString(),
               name: user.fullname,
               email: user.email,
               email_verified: user.emailVerified,
            },
            user.username
         );
      } catch (error) {
         logger.error(`${this.name}:generateAuthToken`, "Couldn't initialize your login session", error);
         return next("Couldn't initialize your login session");
      }

      res.send({ result });
   }

   /**
    * Change username using auth token
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async changeUsername(req, res, next) {
      const { username } = req.body;
      const { userId } = req.locals;

      let exists = await this.#userService.hasUsername(username);

      if (exists) {
         return res.send400("Username has already been taken");
      }

      try {
         await this.#userService.setUsername(userId, username);
      } catch (error) {
         logger.error(`${this.name}:changeUsername`, "Couldn't change username", error);
         return next("Couldn't change username");
      }

      res.send({ message: "Username changed" });
   }

   /**
    * Change email using auth token
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async changeEmail(req,res, next) {
      const { email } = req.body;
      const { userId } = req.locals;

      let exists = await this.#userService.hasEmail(email);

      if (exists) {
         return res.send400("Email is already in use");
      }

      try {
         await this.#userService.setEmail(userId, email, false);
      } catch (error) {
         logger.error(`${this.name}:changeEmail`, "Couldn't change email", error);
         return next("Couldn't change email");
      }

      res.send({ message: "Email changed" });
   }

   /**
    * Send email verification code on user's email
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async sendEmailVerificationCode(req, res, next) {
      const { userId } = req.locals;
      let code, user, saved;
      let emailResponse;

      try {
         user = await this.#userService.get(userId);

         if (user.emailVerified) {
            return res.send({ message: "Your email is already verified" });
         }

         code = String(verificationCode());
         saved = await this.#verificationService.saveVerificationCode(
            VerificationType.EMAIL_VERIFICATION,
            userId,
            code,
            5
         );
         if (!saved) {
            throw new Error();
         }
         emailResponse = await this.#emailService.sendEmailVerificationCode(
            user.fullname,
            user.email,
            code
         );
         if (emailResponse[0].statusCode !== 202) {
            throw new Error();
         }
      } catch (error) {
         logger.error(`${this.name}:sendEmailVerificationCode`, "Couldn't send verification code", error);
         return next("Couldn't send verification code");
      }

      res.send({ message: "Verification code has been sent" });
   }

   /**
    * Verify email verification code
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async verifyEmailFromVerificationCode(req, res, next) {
      const { userId } = req.locals;
      const { code } = req.body;
      let verified;

      try {
         verified = await this.#verificationService.verifyCode(
            VerificationType.EMAIL_VERIFICATION,
            userId,
            code
         );
      } catch (error) {
         logger.error(`${this.name}:verifyEmailFromVerificationCode`, "Couldn't verify email", error);
         return next("Couldn't verify email");
      }

      if (!verified) {
         return res.send400('Invalid verification code');
      }

      await this.#userService.markAsVerified(userId);

      res.send({ message: "Email has been verified" });
   }

   /**
    * Change user's current password
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async changePassword(req, res, next) {
      const { currentPassword, newPassword } = req.body;
      const { userId } = req.locals;
      let user, hash;

      if (currentPassword === newPassword) {
         return res.send400("Use different passwords");
      }

      user = await this.#userService.get(userId);

      if (await comparePassword(currentPassword, user.passwordHash) === false) {
         return res.send400("Incorrect current password");
      }

      try {
         hash = await generatePasswordHash(newPassword);
         await this.#userService.setPasswordHash(userId, hash);
      } catch (error) {
         logger.error(`${this.name}:changePassword`, "Couldn't update password", error);
         return next("Couldn't update password");
      }

      res.send({ message: "Password changed" });
   }

   /**
    * Send password reset code on user's email
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async sendPasswordResetCode(req, res, next) {
      const { email } = req.body;
      let code, user, saved;
      let emailResponse;

      user = await this.#userService.findOne({ email });

      if (!user) {
         return res.send400("Invalid email address");
      }

      try {
         code = String(verificationCode());
         saved = await this.#verificationService.saveVerificationCode(
            VerificationType.PASSWORD_RESET,
            user._id,
            code,
            10
         );
         if (!saved) {
            throw new Error();
         }

         emailResponse = await this.#emailService.sendPasswordResetCode(
            user.fullname,
            user.email,
            code
         );
         if (emailResponse[0].statusCode !== 202) {
            throw new Error();
         }
      } catch (error) {
         logger.error(`${this.name}:sendPasswordResetCode`, "Couldn't send password reset code", error);
         return next("Couldn't send password reset code");
      }
      
      res.send({ message: "Password reset code has been sent" });
   }

   /**
    * Reset user's current password
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async resetPassword(req, res, next) {
      const { email, password, code } = req.body;
      let verified, hash, user, userId;

      user = await this.#userService.findOne({ email });

      if (!user) {
         return res.send400("Invalid email");
      }

      userId = user._id;
      try {
         verified = await this.#verificationService.verifyCode(
            VerificationType.PASSWORD_RESET,
            userId,
            code
         );
      } catch (error) {
         logger.error(`${this.name}:resetPassword`, "Couldn't reset password", error);
         return next("Couldn't reset password");
      }

      if (!verified) {
         return res.send400('Invalid verification code');
      }

      try {
         hash = await generatePasswordHash(password);
         await this.#userService.setPasswordHash(userId, hash);
      } catch (error) {
         return next("Couldn't change password");
      }

      res.send({ message: "Password changed" });
   }

   /**
    * Update user's profile details
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async updateProfile(req, res, next) {
      const { userId } = req.locals;
      let data = req.body;

      try {
         await this.#userService.update(userId, data);
      } catch (error) {
         logger.error(`${this.name}:updateProfileDetails`, "Couldn't update profile", error);
         return next("Couldn't update profile");
      }

      res.send({ message: "Profile updated" });
   }

   /**
    * Update user's profile picture
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async uploadProfilePicture(req, res, next) {
      let result, imageHash;

      try {
         result = await this.#userService.uploadImage(req.locals.userId, req.file);
      } catch (error) {
         logger.error(`${this.name}:uploadProfilePicture`, "Couldn't change profile image", error);
         return next("Couldn't change profile image");
      }

      imageHash = result.Hash;

      res.status(200).send({
         message: "Profile image changed",
         result: { imageHash }
      });
   }

   /**
    * Remove user's profile picture
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async removeProfileImage(req, res, next) {
      try {
         await this.#userService.removeImage(req.locals.userId);
      } catch (error) {
         logger.error(`${this.name}:deleteUserImage`, "Couldn't removing profile image", error);
         return next("Couldn't remove profile image");
      }

      res.send({ message: "Profile image removed" });
   }

   /**
    * Delete user's account
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    * @param {import('express').NextFunction} next 
    */
   async deleteUserAccount(req, res, next) {
      const { userId } = req.locals;
      let result;

      try {
         result = await this.#userService.deleteById(userId);
      } catch (error) {
         return next("Couldn't delete your account");
      }

      res.send({ message: "Accout deleted" });
   }
}
