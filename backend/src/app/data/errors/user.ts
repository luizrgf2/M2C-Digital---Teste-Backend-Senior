import { ErrorBase } from "src/app/shared/errorBase";

export class UserEmailAlreadyExistsError extends ErrorBase {
    constructor() {
        super("O email de usuário já existe!", 409)
    }
}