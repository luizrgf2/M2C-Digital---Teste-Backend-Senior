import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from 'src/infra/services/jwt.service';
import { PasswordEncryptorService } from 'src/infra/services/passwordEncryptor.service';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JWTService, PasswordEncryptorService],
})
export class AuthenticationModule {}
