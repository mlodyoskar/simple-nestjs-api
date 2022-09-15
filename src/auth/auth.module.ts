import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

export class SignupDto {
  username: string;
  password: string;
  confirmationPassword: string;
  firstName: string;
  lastName: string;
}

export class LoginDto {
  username: string;
  password: string;
}

@Module({
  imports: [JwtModule.register({ secret: process.env.SECRET })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [JwtModule],
})
export class AuthModule {}
