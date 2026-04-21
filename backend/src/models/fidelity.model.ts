import type { Fidelity, User } from '@prisma/client';

import { dbClient } from '../db/prisma.connection';

export const showFidelity = async (selectedUser: Partial<User>) => {
  return await dbClient.fidelity.findUnique({
    where: {
      userId: selectedUser.id
    }
  });
};

export const changeFidelityScore = async (fidelity: Partial<Fidelity>, operation: 'add' | 'subtract') => {
  await dbClient.fidelity.update({
    data: {
      point: operation === 'add' ? { increment: fidelity.point } : { decrement: fidelity.point }
    },
    where: {
      userId: fidelity.id
    }
  });
};
