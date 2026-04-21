import { createContext } from "react";

// Definiamo il tipo del contesto: tema (light/dark) e funzione per cambiarlo
export type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void; // funzione senza parametri e senza ritorno mi serve solo per cambiare il tema ma inizialmente non fa nulla
};

// Creiamo il contesto con valore di default: "light"
// La funzione di default è vuota (non farà nulla)
export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});
