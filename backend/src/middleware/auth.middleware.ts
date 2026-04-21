import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

// 1. Controllo utente loggato
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  // Se la sessione non contiene un'email, l'utente non ha fatto il login
  if (!req.session || !req.session.email) {
    res.status(401).json({ error: 'Accesso negato. Effettua il login per continuare.' });
    return;
  }

  // Se l'utente è loggato, passiamo il controllo al prossimo middleware o controller
  next();
};

// 2. Controllo ruolo amministratore
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // Prima ci assicuriamo che l'utente sia loggato
  if (!req.session || !req.session.email) {
    res.status(401).json({ error: 'Accesso negato. Effettua il login per continuare.' });
    return;
  }

  // Poi verifichiamo il ruolo
  if (req.session.role !== Role.ADMIN) {
    res.status(403).json({ error: 'Accesso negato. Sono richiesti i privilegi di Amministratore.' });
    return;
  }

  next();
};
