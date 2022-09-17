import { BooksService } from './books.service';
import { PrismaService } from './../prisma.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Books } from '@prisma/client';
import { JwtGuard } from 'src/auth/auth.guard';

class CreateBookDto {
  title: string;
  release_date: Date;
  author_id: string;
}

class UpdateBookDto {
  title?: string;
  release_date?: Date;
  author_id?: string;
}

type ReturnedBooks = Pick<Books, 'title'>;
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('')
  @UseGuards(JwtGuard)
  async findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param() params: { id: string },
  ): Promise<ReturnedBooks | null> {
    const { id } = params;

    return await this.booksService.findOne(id);
  }

  @Post('')
  async create(@Body() createBookDto: CreateBookDto) {
    const { title, release_date, author_id } = createBookDto;

    return this.booksService.create(title, release_date, author_id);
  }
  @Patch(':id')
  async update(
    @Param() params: { id: string },
    @Body()
    updateBookDto: UpdateBookDto,
  ) {
    const { id } = params;
    const { title } = updateBookDto;

    return this.booksService.update(id, title);
  }

  @Delete('')
  async delete(@Body() body: { id: string }) {
    const { id } = body;

    return this.booksService.delete(id);
  }
}
