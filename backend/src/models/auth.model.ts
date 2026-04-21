import z from 'zod';
import bcrypt from 'bcrypt';
import { Role, type User } from '@prisma/client';

import { dbClient } from '../db/prisma.connection';

export const AuthInfoSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  password: z.string().min(6)
});

export const CredentialsSchema = z.object({
  email: z.string(),
  password: z.string().min(6)
});

export type AuthInfo = z.infer<typeof AuthInfoSchema>;
export type Credentials = z.infer<typeof CredentialsSchema>;

export const RegisterUser = async (authInfo: AuthInfo, role: Role): Promise<User> => {
  const existingUser = await dbClient.user.findUnique({
    where: { email: authInfo.email }
  });

  if (existingUser) {
    throw new Error("L'indirizzo email è già registrato.");
  }

  const passwordHash = await bcrypt.hash(authInfo.password, 12);

  const newUser = await dbClient.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: authInfo.name,
        surname: authInfo.surname,
        email: authInfo.email,
        passwordHash: passwordHash,
        role
      }
    });

    await tx.fidelity.create({
      data: {
        userId: user.id,
        point: 0,
        class: 'BRONZE'
      }
    });

    return user;
  });

  return newUser;
};

export const authUser = async (credentials: Credentials): Promise<User | null> => {
  const user = await dbClient.user.findUnique({
    where: {
      email: credentials.email
    }
  });

  if (!user) {
    return null;
  }

  const check = await bcrypt.compare(credentials.password, user.passwordHash);
  if (check) {
    return user;
  } else {
    return null;
  }
};
