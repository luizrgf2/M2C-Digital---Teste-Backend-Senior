import { ErrorBase } from "src/app/shared/errorBase";

export class UserInvalidEmailError extends ErrorBase {
    constructor() {
        super("O email não é válido", 400)
    }
}

export class UserInvalidPasswordLengthError extends ErrorBase {
    constructor(minLength: number = 8, maxLength: number = 30) {
        super(`A senha deve ter de ${minLength} ate ${maxLength} caracteres`, 400)
    }
}

export class UserInvalidUpperCaseLetterError extends ErrorBase {
    constructor() {
        super("Deve ter pelo menos uma letra maiúscula", 400)
    }
}