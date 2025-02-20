import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidCredentialsError } from 'src/core/data/errors/general';
import { IJWTService } from 'src/core/data/interfaces/services/jwt';
import { Either, Left, Right } from 'src/core/shared/either';
import { ErrorBase } from 'src/core/shared/errorBase';

@Injectable()
export class JWTService implements IJWTService {
    constructor(private readonly jwtService: JwtService) {}

    generateToken(payload: object, expiresIn?: string): string {
        return this.jwtService.sign(payload, { expiresIn });
    }

    verifyToken<T = object>(token: string): Either<ErrorBase, T> {
        try {
            return Right.create(this.jwtService.verify(token) as T);
        } catch (error) {
            return Left.create(new InvalidCredentialsError());
        }
    }
}
