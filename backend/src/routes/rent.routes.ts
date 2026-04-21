import { Express, Router } from 'express';

import {
  rentBookController,
  returnBookController,
  getUserRentsController,
  getAllRentsAdminController
} from '../controllers/rent.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';

export const rentRoutes = (app: Express) => {
  const rentRouter = Router();

  // routes per User
  rentRouter.post('/rent', isAuthenticated, rentBookController);
  rentRouter.put('/:rentId/return', isAuthenticated, returnBookController);
  rentRouter.get('/user/:userId', isAuthenticated, getUserRentsController);

  // routes per Admin
  rentRouter.get('/admin/all', [isAuthenticated, isAdmin], getAllRentsAdminController);

  app.use('/api/rents', rentRouter);
};
