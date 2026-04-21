import { Express, Router } from 'express';

import {
  changeAvCopiesController,
  changeTotCopiesController,
  deleteBookController,
  insertBookController,
  showAllBooksController
} from '../controllers/book.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';

export const bookRoutes = (app: Express) => {
  const bookRouter = Router();

  //routes per User
  bookRouter.get('/all', showAllBooksController);

  //routes per Admin
  bookRouter.put('/update/availabe/:id', [isAuthenticated, isAdmin], changeAvCopiesController);
  bookRouter.put('/update/total/:id', [isAuthenticated, isAdmin], changeTotCopiesController);
  bookRouter.delete('/delete/:id', [isAuthenticated, isAdmin], deleteBookController);
  bookRouter.post('/add', [isAuthenticated, isAdmin], insertBookController);

  app.use('/book', bookRouter);
};
