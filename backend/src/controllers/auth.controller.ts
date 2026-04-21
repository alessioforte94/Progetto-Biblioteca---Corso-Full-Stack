import { Request, Response } from 'express';

import { AuthInfoSchema, authUser, CredentialsSchema, RegisterUser } from '../models/auth.model';

export const registerController = async (req: Request, res: Response) => {
  const body = AuthInfoSchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json(body.error.flatten());
    return;
  }

  try {
    const newUser = await RegisterUser(body.data, 'USER');
    res.status(200).json({
      ...newUser,
      passwordHash: undefined
    });
  } catch (error: any) {
    if (error.message === "L'indirizzo email è già registrato.") {
      res.status(409).json({ error: error.message });
    } else {
      console.error('Errore registrazione utente: ', error);
      res.status(500).json({ error: 'Errore durante la registrazione' });
    }
  }
};

export const loginController = async (req: Request, res: Response) => {
  const body = CredentialsSchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json(body.error.flatten());
    return;
  }

  const user = await authUser(body.data);
  if (user !== null) {
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role;

    res.status(200).send('Login effettuato con successo');
  } else {
    res.status(403).send('credenziali errate');
  }
};

export const checkController = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const email = req.session.email;
  const role = req.session.role;

  res.status(200).json({ message: 'Utente Loggato', userId, email, role });
};

export const logoutController = async (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout effettuato con successo' });
  });
};
