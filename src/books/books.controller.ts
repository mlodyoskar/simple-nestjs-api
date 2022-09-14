import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('books')
export class BooksController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  findOne(@Param() params: { id: string }): string {
    return `Here is ${params.id} id of your book`;
  }

  @Post('second')
  @HttpCode(210)
  postHello(@Body() body: Body): string {
    console.log(body);
    return 'Here are your books';
  }
}
