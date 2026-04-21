import { Request, Response } from 'express';
import { RentState } from '@prisma/client';

import { createRent, returnBook, getRentsByUser, getAllRentsAdmin } from '../models/rent.model';

// 1. Noleggio Libro
export const rentBookController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.body;
    const userId = req.session.userId;

    // Validazione base degli input
    if (!userId || !bookId) {
      res.status(400).json({ error: "I parametri 'userId' e 'bookId' sono obbligatori." });
      return;
    }

    // Assicuriamoci che siano numeri interi come richiesto dal DB
    const newRent = await createRent(Number(userId), Number(bookId));

    // 201 Created è lo status code corretto per la creazione di una risorsa
    res.status(201).json(newRent);
  } catch (error: any) {
    // Gestione degli errori (es. libro non disponibile)
    res.status(400).json({ error: error.message || 'Errore durante la creazione del noleggio.' });
  }
};

// 2. Restituzione Libro
export const returnBookController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rentId } = req.params;

    if (!rentId) {
      res.status(400).json({ error: "L'ID del noleggio è obbligatorio." });
      return;
    }

    const result = await returnBook(Number(rentId));

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Errore durante la restituzione del libro.' });
  }
};

// 3. Storico Noleggi per Singolo Utente
export const getUserRentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "L'ID dell'utente è obbligatorio." });
      return;
    }

    const rents = await getRentsByUser(Number(userId));

    res.status(200).json(rents);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Errore interno del server nel recupero dei noleggi dell'utente." });
  }
};

// 4. Storico Totale per Admin (con filtro opzionale)
export const getAllRentsAdminController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Il filtro arriva dalla query string, es: /admin/rents?state=ACTIVE
    const { state } = req.query;

    // Validazione opzionale dello stato tramite l'enum di Prisma
    let filterState: RentState | undefined;
    if (state && Object.values(RentState).includes(state as RentState)) {
      filterState = state as RentState;
    }

    const rents = await getAllRentsAdmin(filterState);

    res.status(200).json(rents);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: 'Errore interno del server nel recupero dello storico totale.' });
  }
};
