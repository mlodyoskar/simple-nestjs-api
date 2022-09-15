import { PrismaService } from './../prisma.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Books } from '@prisma/client';
import { JwtGuard } from 'src/auth/auth.guard';

class GetBooksDto {
  id: string;
  title: string;
  released_date: Date;
}

type ReturnedBooks = Pick<Books, 'title'>;
@Controller('books')
export class BooksController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('')
  @UseGuards(JwtGuard)
  async findAll(): Promise<GetBooksDto[] | null> {
    return await this.prisma.books.findMany();
  }

  @Get(':id')
  async findOne(
    @Param() params: { id: string },
  ): Promise<ReturnedBooks | null> {
    const { id } = params;

    return await this.prisma.books.findUnique({
      where: { id },
      select: { title: true },
    });
  }

  @Post('')
  async postHello(
    @Body() body: { title: string; release_date: Date },
  ): Promise<Books> {
    console.log(body.title, body.release_date);
    const newBook = await this.prisma.books.create({
      data: { title: body.title, released_date: body.release_date },
    });

    return newBook;
  }
}
