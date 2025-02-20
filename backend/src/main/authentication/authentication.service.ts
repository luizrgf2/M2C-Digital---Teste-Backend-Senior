import { HttpException, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { UserRepository } from 'src/infra/database/userRepositoryPrisma.service';
import { PasswordEncryptorService } from 'src/infra/services/passwordEncryptor.service';
import { GetUserUseCase } from 'src/core/data/usecases/user/getUser';
import { JWTService } from 'src/infra/services/jwt.service';
import { SignInUseCase } from 'src/core/data/usecases/auth/signIn';
import { ErrorBase } from 'src/core/shared/errorBase';

@Injectable()
export class AuthenticationService {

  constructor(private userRepository: UserRepository, private passwordEncryptor: PasswordEncryptorService, private jwtService: JWTService) {}
  
  private errorHandling(error?: ErrorBase) {
    if(error)
      throw new HttpException(error.message, error.statusCode)
  }

  async signIn(signIn: SignInDto): Promise<any> {
      const createUserUseCase = new SignInUseCase(this.userRepository, this.passwordEncryptor, this.jwtService)
      const res = await createUserUseCase.exec(signIn)
      this.errorHandling(res.left)
      return res.right;
  }

}
