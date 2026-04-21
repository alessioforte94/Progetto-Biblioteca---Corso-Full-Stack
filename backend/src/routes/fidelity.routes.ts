import { Express, Router } from 'express';

import { changeFidelityScoreController, showFidelityController } from '../controllers/fidelity.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

export const fidelityRoutes = (app: Express) => {
  const fidelityRouter = Router();

  fidelityRouter.get('/:id', isAuthenticated, showFidelityController);
  fidelityRouter.put('/update/:id', isAuthenticated, changeFidelityScoreController);

  app.use('/fidelity', fidelityRouter);
};
