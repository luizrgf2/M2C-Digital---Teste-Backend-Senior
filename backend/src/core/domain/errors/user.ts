import { ErrorBase } from "src/core/shared/errorBase";

export class UserInvalidEmailError extends ErrorBase {
    constructor() {
        super("O e-mail informado não é válido.", 400);
    }
}

export class UserInvalidPasswordLengthError extends ErrorBase {
    constructor(minLength: number = 8, maxLength: number = 30) {
        super(`A senha deve ter entre ${minLength} e ${maxLength} caracteres.`, 400);
    }
}

export class UserInvalidUpperCaseLetterError extends ErrorBase {
    constructor() {
        super("A senha deve conter pelo menos uma letra maiúscula.", 400);
    }
}
