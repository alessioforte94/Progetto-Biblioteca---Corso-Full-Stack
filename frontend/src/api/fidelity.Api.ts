import type { Fidelity } from '../types/db.type';
import { apiClientFidelity } from './axios.Api';

// Visualizza la fidelity card di un utente tramite userId
export const getFidelityByUser = async (userId: number): Promise<Fidelity> => {
  const response = await apiClientFidelity.get(`/${userId}`);
  return response.data;
};

// Aggiorna manualmente il punteggio (solo Admin)
// operation: 'add' per aggiungere punti, 'subtract' per sottrarne
export const updateFidelityScore = async (
  fidelityId: number,
  point: number,
  operation: 'add' | 'subtract'
): Promise<{ message: string }> => {
  const response = await apiClientFidelity.put(`/update/${fidelityId}`, {
    point,
    operation
  });
  return response.data;
};
