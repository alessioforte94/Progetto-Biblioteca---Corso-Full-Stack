import dayjs from 'dayjs';
import { FidelityClass, RentState, type Book, type Rent, type User } from '@prisma/client';

import { dbClient } from '../db/prisma.connection';

// Visualizzazione per specifico Utente (Storico e Attivi)
export const getRentsByUser = async (userId: User['id']): Promise<Rent[]> => {
  return await dbClient.rent.findMany({
    where: { userId: userId },
    include: { book: true }, // Include info del libro per le card nel frontend
    orderBy: { rent_date: 'desc' }
  });
};

// Visualizzazione totale (Pannello Admin) con filtro opzionale
export const getAllRentsAdmin = async (state?: RentState): Promise<Rent[]> => {
  return await dbClient.rent.findMany({
    where: state ? { state } : {},
    include: {
      book: { select: { title: true, author: true } },
      user: { select: { email: true, name: true, surname: true } }
    },
    orderBy: { rent_date: 'desc' }
  });
};

export const createRent = async (userId: User['id'], bookId: Book['id']): Promise<Rent> => {
  return await dbClient.$transaction(async (tx) => {
    // 1. Controllo disponibilità
    const book = await tx.book.findUnique({ where: { id: bookId } });

    if (!book || book.av_copies <= 0) {
      throw new Error('Libro non disponibile: copie esaurite.');
    }

    // 2. Creazione Noleggio (usiamo dayjs per le date)
    const newRent = await tx.rent.create({
      data: {
        userId: userId,
        bookId: bookId,
        rent_date: dayjs().toDate(),
        exp_date: dayjs().add(14, 'day').toDate(),
        state: RentState.ACTIVE
      }
    });

    // 3. Aggiornamento automatico av_copies
    await tx.book.update({
      where: { id: bookId },
      data: { av_copies: { decrement: 1 } }
    });

    return newRent;
  });
};

const getFidelityClass = (points: number): FidelityClass => {
  if (points >= 600) return FidelityClass.PLATINUM;
  if (points >= 300) return FidelityClass.GOLD;
  if (points >= 100) return FidelityClass.SILVER;
  return FidelityClass.BRONZE;
};

export const returnBook = async (rentId: Rent['id']): Promise<any> => {
  return await dbClient.$transaction(async (tx) => {
    // 1. Recupero noleggio e controllo stato
    const rent = await tx.rent.findUnique({
      where: { id: rentId },
      include: { user: { include: { card: true } } }
    });

    if (!rent || rent.state !== 'ACTIVE') throw new Error('Noleggio non valido');

    // 2. Chiusura noleggio e ripristino copia (come prima)
    await tx.rent.update({
      where: { id: rentId },
      data: { ret_date: new Date(), state: 'RETURNED' }
    });

    await tx.book.update({
      where: { id: rent.bookId },
      data: { av_copies: { increment: 1 } }
    });

    // 3. Gestione Punti e Cambio Classe
    // Recuperiamo i punti attuali o partiamo da 0
    const currentPoints = (rent.user.card?.point || 0) + 10;
    const newClass = getFidelityClass(currentPoints);

    await tx.fidelity.upsert({
      where: { userId: rent.userId },
      update: {
        point: currentPoints,
        class: newClass // Aggiornamento automatico della classe
      },
      create: {
        userId: rent.userId,
        point: 10,
        class: FidelityClass.BRONZE
      }
    });

    return { message: 'Libro restituito', points: currentPoints, class: newClass };
  });
};
