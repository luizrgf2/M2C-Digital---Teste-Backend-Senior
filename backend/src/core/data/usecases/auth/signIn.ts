import { ErrorBase } from "src/core/shared/errorBase";
import { InvalidCredentialsError } from "../../errors/general";
import { IUserRepository } from "../../interfaces/repositories/user";
import { IJWTService } from "../../interfaces/services/jwt";
import { IPasswordEncryptorService } from "../../interfaces/services/passwordEncryptor";
import { Either, Left, Right } from "src/core/shared/either";

export interface SignInUseCaseInput {
    email: string;
    password: string;
}

export interface SignInUseCaseOutput {
    id: string;
    email: string;
    token: string;
}

export class SignInUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordEncryptor: IPasswordEncryptorService,
        private readonly jwt: IJWTService
    ) {}

    async exec(input: SignInUseCaseInput): Promise<Either<ErrorBase, SignInUseCaseOutput>> {
        const userOrError = await this.userRepository.findByEmail(input.email);
        if (userOrError.left) return Left.create(new InvalidCredentialsError());

        const user = userOrError.right;
        const isPasswordValid = await this.passwordEncryptor.compare(input.password, user.password);
        
        if (!isPasswordValid) {
            return Left.create(new InvalidCredentialsError());
        }

        const token = this.jwt.generateToken({id: user.id});
        
        return Right.create({
            id: user.id,
            email: user.email,
            token,
        });
    }
}
