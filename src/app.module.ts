import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksController } from './books/books.controller';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { BooksService } from './books/books.service';
import { BooksModule } from './books/books.module';

@Module({
  imports: [AuthModule, BooksModule],
  controllers: [AppController, BooksController],
  providers: [AppService, PrismaService, BooksService],
})
export class AppModule {}
