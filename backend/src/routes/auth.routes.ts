import { Express, Router } from 'express';

import { checkController, loginController, logoutController, registerController } from '../controllers/auth.controller';

export const authRoutes = (app: Express) => {
  const authRouter = Router();

  authRouter.post('/register', registerController);
  authRouter.post('/login', loginController);
  authRouter.get('/check', checkController);
  authRouter.post('/logout', logoutController);

  app.use('/auth', authRouter);
};
