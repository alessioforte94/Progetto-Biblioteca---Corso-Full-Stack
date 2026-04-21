import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const API_BASE_URL_RENT = `${BASE_URL}/api/rents`;
const API_BASE_URL_FIDELITY = `${BASE_URL}/fidelity`;
const API_BASE_URL_BOOK = `${BASE_URL}/book`;
const API_BASE_URL_AUTH = `${BASE_URL}/auth`;

// withCredentials: true è obbligatorio per inviare/ricevere i cookie
// di sessione tra frontend (Vite) e backend (Express) su origini diverse

export const apiClientRent = axios.create({
  baseURL: API_BASE_URL_RENT,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const apiClientFidelity = axios.create({
  baseURL: API_BASE_URL_FIDELITY,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const apiClientBook = axios.create({
  baseURL: API_BASE_URL_BOOK,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const apiClientAuth = axios.create({
  baseURL: API_BASE_URL_AUTH,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});