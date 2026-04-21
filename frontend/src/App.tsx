import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import { Home } from './pages/home';
import { Login } from './pages/login';
import { Registrazione } from './pages/registrazione';
import { Catalogo } from './pages/catalogo';
import { MyRent } from './pages/myRent';
import { AdminDashboard } from './pages/adminDashboard';
import { AdminBooks } from './pages/adminBooks';
import { AdminRents } from './pages/adminRents';
import { Pagina404 } from './pages/pagina404';
import { useMemo, useState } from 'react';
import { ThemeContext } from './context/themeContext';

function App() {

  // Stato per gestire il tema: parte da "light"
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Funzione che inverte il tema: light -> dark, dark -> light
  function toggleTheme() {
    setTheme(t => (t === "light" ? "dark" : "light"));
  }

  // Stili dell'app che cambiano in base al tema
  const appStyle: React.CSSProperties = {
    backgroundColor: theme === "light" ? "#ffffff" : "#222222", // sfondo chiaro o scuro
    color: theme === "light" ? "#000000" : "#ffffff",         // testo nero o bianco
    minHeight: "100vh",                                         // altezza a tutta pagina
    padding: "20px",                                            // margine interno
    transition: "all 0.3s ease"                                 // animazione morbida
  };

  // Tema MUI che si adatta al dark mode per tutti i componenti (Paper, TextField, Card, ecc.)
  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: theme,
      ...(theme === 'dark' && {
        background: {
          default: '#222222',
          paper: '#333333',
        },
      }),
    },
  }), [theme]);

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <div style={appStyle}>
            <AuthProvider>
              <Routes>
                <Route element={<Layout />}>
                  {/* Rotte pubbliche */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registrazione" element={<Registrazione />} />
                  <Route path="/catalogo" element={<Catalogo />} />
                  <Route path="*" element={<Pagina404 />} />

                  {/* Rotte protette (utente autenticato) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/i-miei-noleggi" element={<MyRent />} />
                  </Route>

                  {/* Rotte admin */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/libri" element={<AdminBooks />} />
                    <Route path="/admin/noleggi" element={<AdminRents />} />
                  </Route>
                </Route>
              </Routes>
            </AuthProvider>
          </div>
        </ThemeProvider>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
