import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.books.findMany({});
  }

  async findOne(id: string) {
    return await this.prisma.books.findUnique({
      where: { id },
    });
  }

  async create(title: string, realeaseDate: Date, authorId: string) {
    const createdBook = await this.prisma.books.create({
      data: {
        title,
        released_date: realeaseDate,
        authorId,
      },
    });

    return createdBook;
  }

  async update(id: string, title?: string) {
    const updatedBook = await this.prisma.books.update({
      where: {
        id,
      },
      data: { title },
    });

    return updatedBook;
  }

  async delete(id: string) {
    const deletedBook = await this.prisma.books.delete({
      where: {
        id,
      },
    });

    return deletedBook.id;
  }
}
