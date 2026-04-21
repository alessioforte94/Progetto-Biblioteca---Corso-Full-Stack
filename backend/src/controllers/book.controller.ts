import { Request, Response } from 'express';

import { changeAvCopies, changeTotCopies, deleteBook, insertBook, showAllBooks } from '../models/book.model';

export const showAllBooksController = async (req: Request, res: Response) => {
  try {
    const allBooks = await showAllBooks();
    res.json(allBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json('failed to fetch');
  }
};

export const insertBookController = async (req: Request, res: Response) => {
  const newBook = req.body;
  if (!newBook.title || !newBook.author || !newBook.tot_copies || !newBook.av_copies) {
    res.status(400).json({ error: 'Campi Mancanti' });
    return;
  }
  try {
    const result = await insertBook(newBook);
    res.json({ message: result });
  } catch (error) {
    console.error('Errore inserimento libro: ', error);
    res.status(500).json({ message: 'Errore in fase di inserimento', error: error });
  }
};

export const changeAvCopiesController = async (req: Request, res: Response) => {
  const { av_copies } = req.body;
  if (Number.isNaN(Number(av_copies))) {
    res.status(400).json({ error: 'Inserisci un valore numerico' });
    return;
  }
  try {
    const id = Number(req.params.id);
    const result = await changeAvCopies({ av_copies, id });
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la modifica', error: error });
  }
};

export const changeTotCopiesController = async (req: Request, res: Response) => {
  const { tot_copies, av_copies } = req.body;
  if (Number.isNaN(Number(tot_copies))) {
    res.status(400).json({ error: 'Inserisci un valore numerico' });
    return;
  }

  if (Number(tot_copies) < Number(av_copies)) {
    res.status(400).json({ error: 'Le copie totali non possono essere meno di quelle disponibili' });
    return;
  }

  try {
    const id = Number(req.params.id);
    const result = await changeTotCopies({ tot_copies, id });
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la modifica', error: error });
  }
};

export const deleteBookController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteBook({ id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Errore in fase di eliminazione', error: error });
  }
};
