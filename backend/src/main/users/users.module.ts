import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { PasswordEncryptorService } from 'src/infra/services/passwordEncryptor.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordEncryptorService],
})
export class UsersModule {}
