import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import expressSession from 'express-session';
import { Role } from '@prisma/client';

import { authRoutes } from './routes/auth.routes';
import { bookRoutes } from './routes/book.routes';
import { fidelityRoutes } from './routes/fidelity.routes';
import { rentRoutes } from './routes/rent.routes';

dotenv.config();

declare module 'express-session' {
  interface SessionData {
    userId: number;
    email: string;
    role: Role;
  }
}

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin:
      'http://localhost:5173' /* Inserire l'URL del client che effettua le chiamate api (predefinito il server di Vite) */,
    credentials: true
  })
);
app.use(
  expressSession({
    secret: process.env.AUTH_SECRET ?? '',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: undefined,
      expires: undefined
    }
  })
);

authRoutes(app);
bookRoutes(app);
fidelityRoutes(app);
rentRoutes(app);

app.listen(PORT, () => {
  console.log(`Il server è in ascolto sulla porta ${PORT}`);
});
