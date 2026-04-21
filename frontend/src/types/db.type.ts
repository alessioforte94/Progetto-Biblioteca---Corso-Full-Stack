type Role = 'USER' | 'ADMIN'

type RentState = 'ACTIVE' | 'RETURNED' | 'EXPIRED'

type FidelityClass = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' 

export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  passwordHash: string;
  role: Role;

  card: Fidelity | null;
  rents: Rent[];
}
export type AuthInfo = {
    name: string;
    surname: string;
    email: string;
    password: string;
}
export type Credentials = {
    email: string;
    password: string;
}

export type Book = {
  id: number;
  title: string;
  author: string;
  cathegory: string | null;
  description?: string | null;
  tot_copies: number;
  av_copies: number;

  rents: Rent[];
}

export type Rent = {
  id: number;
  userId: number;
  bookId: number;
  rent_date: Date;
  exp_date: Date;
  ret_date?: Date | null;
  state: RentState;
};

export type Fidelity = {
  id: number;
  userId: number;
  point: number;
  class: FidelityClass;
};