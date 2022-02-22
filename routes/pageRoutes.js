import path from 'path';
import express from 'express';
import { UserAuthorization } from '../middlewares/auth.js';
import { PageController } from '../controllers/PageController.js';

const router = express.Router();
const pageController = new PageController();

router.use('/templates', express.static('templates', { 
   cacheControl: true,
   index: 'default.hbs',
   extensions: ['hbs']
}));

router.get(
   '/data',
   UserAuthorization,
   pageController.getPageData.bind(pageController)
);

router.get(
   '/themes',
   pageController.getAllThemes.bind(pageController)
);

router.get(
   '/themes/source/:configId',
   pageController.getThemeSource.bind(pageController)
);

router.get(
   '/themes/:collectionId',
   pageController.getThemesByCollectionId.bind(pageController)
);

router.get(
   '/themes/:collectionId/:themeKey',
   pageController.getThemesByThemeKey.bind(pageController)
);

export default router;
