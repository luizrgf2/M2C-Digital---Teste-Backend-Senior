import { Either } from "src/core/shared/either";
import { ErrorBase } from "src/core/shared/errorBase";

export interface IJWTService {
    generateToken(payload: object): string;
    verifyToken<T = object>(token: string): Either<ErrorBase, T>;
}
