import { Either, Left, Right } from "src/app/shared/either";
import { UserInvalidEmailError, UserInvalidPasswordLengthError, UserInvalidUpperCaseLetterError } from "../errors/user";

export interface IUser {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UserEntity {
    private user: IUser;

    constructor(user: IUser) {
        this.user = user;
    }

    get id(): string {
        return this.user.id;
    }

    set id(id: string) {
        this.user.id = id;
    }

    get email(): string {
        return this.user.email;
    }

    set email(email: string) {
        this.user.email = email;
    }

    get password(): string {
        return this.user.password;
    }

    set password(password: string) {
        this.user.password = password;
    }

    get createdAt(): Date {
        return this.user.createdAt;
    }

    set createdAt(createdAt: Date) {
        this.user.createdAt = createdAt;
    }

    get updatedAt(): Date {
        return this.user.updatedAt;
    }

    set updatedAt(updatedAt: Date) {
        this.user.updatedAt = updatedAt;
    }

    isValidEmail(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.user.email);
    }

    isValidPasswordLength(minLength: number = 8, maxLength: number = 30): boolean {
        return this.user.password.length >= minLength && this.user.password.length <= maxLength;
    }

    isValidPasswordUpperCaseLetter(): boolean {
        return /[A-Z]/.test(this.user.password);
    }

    validate(): Either<Error, void> {
        const validateEmail = this.isValidEmail()
        const validatePasswordLen = this.isValidPasswordLength()
        const validatePasswordUpperCaseLetter = this.isValidPasswordUpperCaseLetter()

        if(!validateEmail) return Left.create(new UserInvalidEmailError())
        if(!validatePasswordLen) return Left.create(new UserInvalidPasswordLengthError())
        if(!validatePasswordUpperCaseLetter) return Left.create(new UserInvalidUpperCaseLetterError())
        
        return Right.create(undefined)
    }

    static create(user: IUser) : Either<Error, UserEntity> {
        const userEntity = new UserEntity(user)
        const validOrError = userEntity.validate()
        if(validOrError.left) return Left.create(validOrError.left)
        
        return Right.create(userEntity)
    }

    static createWithoutId(user: Omit<IUser, "id">) : Either<Error, UserEntity> {
        const userEntity = new UserEntity({...user, id: ""})
        const validOrError = userEntity.validate()
        if(validOrError.left) return Left.create(validOrError.left)
        
        return Right.create(userEntity)
    }
}
