import type { Rent } from '../types/db.type';
import { apiClientRent } from './axios.Api';

// Crea un nuovo noleggio (utente autenticato)
export const rentBook = async (
  userId: number,
  bookId: number
): Promise<Rent> => {
  const response = await apiClientRent.post('/rent', { userId, bookId });
  return response.data;
};

// Restituzione libro tramite ID del noleggio (utente autenticato)
export const returnBook = async (
  rentId: number
): Promise<{ message: string; points: number; class: string }> => {
  const response = await apiClientRent.put(`/${rentId}/return`);
  return response.data;
};

// Storico noleggi di un utente specifico (utente autenticato)
export const getUserRents = async (userId: number): Promise<Rent[]> => {
  const response = await apiClientRent.get(`/user/${userId}`);
  return response.data;
};

// Tutti i noleggi con filtro opzionale per stato (solo Admin)
// state: 'ACTIVE' | 'RETURNED' | 'EXPIRED' | undefined (= tutti)
export const getAllRentsAdmin = async (
  state?: 'ACTIVE' | 'RETURNED' | 'EXPIRED'
): Promise<Rent[]> => {
  const response = await apiClientRent.get('/admin/all', {
    params: state ? { state } : {}
  });
  return response.data;
};
