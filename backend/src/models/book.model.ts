import { dbClient } from '../db/prisma.connection';

export type Book = {
  id: number;
  title: string;
  author: string;
  cathegory?: string;
  description?: string;
  tot_copies: number;
  av_copies: number;
};

export const insertBook = async (book: Partial<Book>) => {
  await dbClient.book.create({
    data: {
      title: book.title ?? '',
      author: book.author ?? '',
      cathegory: book?.cathegory,
      description: book?.description,
      tot_copies: book.tot_copies ?? 0,
      av_copies: book.av_copies ?? 0
    }
  });

  return 'Nuovo Libro Creato';
};

export const showAllBooks = async () => {
  const books = await dbClient.book.findMany();
  return books as Book[];
};

export const changeAvCopies = async (book: Partial<Book>) => {
  await dbClient.book.update({
    data: {
      av_copies: book.av_copies
    },
    where: {
      id: book.id
    }
  });
};

export const changeTotCopies = async (book: Partial<Book>) => {
  await dbClient.book.update({
    data: {
      tot_copies: book.tot_copies
    },
    where: {
      id: book.id
    }
  });
};

export const deleteBook = async (book: Partial<Book>) => {
  const { id } = book;
  await dbClient.book.delete({
    where: {
      id: id
    }
  });
  return 'Libro eliminato';
};
