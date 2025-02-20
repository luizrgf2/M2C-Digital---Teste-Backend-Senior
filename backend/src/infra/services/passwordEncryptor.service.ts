import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordEncryptorService } from 'src/core/data/interfaces/services/passwordEncryptor';

@Injectable()
export class PasswordEncryptorService implements IPasswordEncryptorService {
    private readonly saltRounds = 10;

    async encrypt(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, passwordEncrypted: string): Promise<boolean> {
        return bcrypt.compare(password, passwordEncrypted);
    }
}
