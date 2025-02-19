import { ErrorBase } from "src/app/shared/errorBase";

export class UserEmailAlreadyExistsError extends ErrorBase {
    constructor() {
        super("O email de usuário já existe!", 409)
    }
}

export class UserUpdateAllFieldsIsEmptyError extends ErrorBase {
    constructor() {
        super("O campo de email ou o campo de id devem existir!", 400)
    }
}