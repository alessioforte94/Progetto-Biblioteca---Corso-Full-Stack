import type { Book } from '../types/db.type';
import { apiClientBook } from './axios.Api';

// Catalogo libri (pubblico - visibile a tutti)
export const getAllBooks = async (): Promise<Book[]> => {
  const response = await apiClientBook.get('/all');
  return response.data;
};

// Aggiunta libro (solo Admin)
export const insertBook = async (
  book: Omit<Book, 'id' | 'rents'>
): Promise<{ message: string }> => {
  const response = await apiClientBook.post('/add', book);
  return response.data;
};

// Modifica copie disponibili (solo Admin)
export const updateAvailableCopies = async (
 book: Partial<Book>
): Promise<{ message: string }> => {
  const response = await apiClientBook.put(`/update/availabe/${book.id}`, { av_copies: book.av_copies });
  return response.data;
};

// Modifica copie totali (solo Admin)
export const updateTotalCopies = async (
  book: Partial<Book>
): Promise<{ message: string }> => {
  const response = await apiClientBook.put(`/update/total/${book.id}`, { tot_copies:book.tot_copies, av_copies: book.av_copies });
  return response.data;
};

// Eliminazione libro (solo Admin)
export const deleteBook = async (book: Partial<Book>): Promise<string> => {
  const response = await apiClientBook.delete(`/delete/${book.id}`);
  return response.data;
};
