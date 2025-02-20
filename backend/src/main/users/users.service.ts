import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserUseCase } from 'src/core/data/usecases/user/createUser';
import { UserRepository } from 'src/infra/database/userRepositoryPrisma.service';
import { PasswordEncryptorService } from 'src/infra/services/passwordEncryptor.service';
import { GetUserUseCase } from 'src/core/data/usecases/user/getUser';
import { ErrorBase } from 'src/core/shared/errorBase';
import { UpdateUserUseCase } from 'src/core/data/usecases/user/updateUser';
import { DeleteUserUseCase } from 'src/core/data/usecases/user/deleteUser';

@Injectable()
export class UsersService {

  constructor(private userRepository: UserRepository, private passwordEncryptor: PasswordEncryptorService) {}

  private errorHandling(error?: ErrorBase) {
    if(error)
      throw new HttpException(error.message, error.statusCode)
  }

  async create(createUserDto: CreateUserDto) {
    const createUserUseCase = new CreateUserUseCase(this.userRepository, this.passwordEncryptor)
    const res = await createUserUseCase.exec(createUserDto)
    this.errorHandling(res.left)
    return res.right;
  }

  findAll() {
    return 
  }

  async findOne(id: string) {
    const createUserUseCase = new GetUserUseCase(this.userRepository)
    const res = await createUserUseCase.exec({id: id})
    this.errorHandling(res.left)
    return res.right;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const createUserUseCase = new UpdateUserUseCase(this.userRepository, this.passwordEncryptor)
    const res = await createUserUseCase.exec({id: id})
    this.errorHandling(res.left)
    return res.right;
  }

  async remove(id: string) {
    const createUserUseCase = new DeleteUserUseCase(this.userRepository)
    const res = await createUserUseCase.exec({id: id})
    this.errorHandling(res.left)
    return res.right;
  }
}
