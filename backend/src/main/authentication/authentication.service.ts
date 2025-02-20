import { Injectable } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/createAuthentication.dto';
import { UpdateAuthenticationDto } from './dto/updateAuthentication.dto';
import { UserRepository } from 'src/infra/database/userRepositoryPrisma.service';
import { PasswordEncryptorService } from 'src/infra/services/passwordEncryptor.service';
import { GetUserUseCase } from 'src/core/data/usecases/user/getUser';

@Injectable()
export class AuthenticationService {

  constructor(private userRepository: UserRepository, private passwordEncryptor: PasswordEncryptorService) {}
  

  async signIn(email: string, pass: string): Promise<any> {

      const createUserUseCase = new GetUserUseCase(this.userRepository)
      const res = await createUserUseCase.exec({id: email})

    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result;
  }
  findAll() {
    return `This action returns all authentication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  update(id: number, updateAuthenticationDto: UpdateAuthenticationDto) {
    return `This action updates a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }
}
