import { Router } from 'express';
import { UserAuthorization } from '../middlewares/auth.js';
import { PageController } from '../controllers/PageController.js';

const router = Router();
const pageController = new PageController();

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
   '/themes/:collectionId',
   pageController.getThemesByCollectionId.bind(pageController)
);

router.get(
   '/themes/:collectionId/:themeKey',
   pageController.getThemesByThemeKey.bind(pageController)
);

export default router;
