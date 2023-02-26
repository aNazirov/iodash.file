import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const token = '';

    if (!token) {
      return true;
    }

    const user = this.jwtService.decode('', {});

    if (!user) {
      return true;
    }

    return true;
  }
}
