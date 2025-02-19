export interface IPasswordEncryptorService {
    encrypt(password: string) : Promise<string>
    compare(password: string, passwordEncrypted: string) : Promise<boolean>
}