import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest<
      { headers: Record<string, string | string[]> } & {
        user?: Record<string, unknown>;
      }
    >(context); // you could use FastifyRequest here too
    try {
      if (!request.headers) {
        throw new Error();
      }
      const token = this.getToken(request);
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (e) {
      // return false or throw a specific error if desired
      return false;
    }
  }

  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = authorization.split(' ');
    return token;
  }
}
