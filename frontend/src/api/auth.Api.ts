import type { AuthInfo, Credentials } from '../types/db.type';
import { apiClientAuth } from './axios.Api';

// Registrazione nuovo utente (crea anche la fidelity card automaticamente)
export const registerUser = async (user: AuthInfo) => {
  const response = await apiClientAuth.post('/register', user);
  return response.data;
};

// Login — avvia la sessione cookie sul server
export const loginUser = async (credentials: Credentials) => {
  const response = await apiClientAuth.post('/login', credentials);
  return response.data;
};

//Logout - cancella i cookie di sessione e la sessione stessa
export const logoutUser = async () => {
  const response = await apiClientAuth.post('/logout');
  return response.data
}

// Verifica sessione attiva — usato per proteggere le rotte frontend
// e recuperare email e ruolo dell'utente corrente
export const checkSession = async (): Promise<{ email: string; role: 'USER' | 'ADMIN' }> => {
  const response = await apiClientAuth.get('/check');
  return response.data;
};



