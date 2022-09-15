import { PrismaService } from './../prisma.service';
import { Prisma } from '@prisma/client';
import { SignupDto, LoginDto } from './auth.module';
import {
  ArgumentMetadata,
  BadRequestException,
  ConflictException,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class SignupPipe implements PipeTransform {
  transform(value: unknown, _metadata: ArgumentMetadata) {
    const errors: string[] = [];
    if (!this.valueHasPassAndConfPass(value)) {
      throw new BadRequestException('Invalid Request Body');
    }
    // you'll probably want to add in your own business rules here as well
    if (value.password.length < 12) {
      errors.push('password should be at least 12 characters long');
    }
    if (value.password !== value.confirmationPassword) {
      errors.push('password and confirmationPassword do not match');
    }
    if (errors.length) {
      throw new BadRequestException(errors.join('\n'));
    }

    return value;
  }

  private valueHasPassAndConfPass(val: unknown): val is SignupDto {
    return typeof val === 'object';
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(newUser: SignupDto): Promise<{ accessToken: string }> {
    const { username, password, firstName, lastName } = newUser;

    const lookedUpUser = await this.prisma.users.findUnique({
      where: { username },
    });

    if (lookedUpUser) {
      throw new ConflictException(
        `User with username ${newUser.username} already exists`,
      );
    }

    const user = {
      username,
      password: await argon2.hash(password),
      firstName,
      lastName,
    };

    await this.prisma.users.create({ data: user });

    return { accessToken: this.jwtService.sign({ sub: user.username }) };
  }

  async login(user: LoginDto): Promise<{ accessToken: string }> {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { username: user.username },
      });

      if (!user || !existingUser) {
        throw new Error();
      }

      const passwordMatch = await argon2.verify(
        existingUser.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new Error();
      }
      return { accessToken: this.jwtService.sign({ sub: user.username }) };
    } catch (e) {
      throw new UnauthorizedException(
        'Username or password may be incorrect. Please try again',
      );
    }
  }
}
