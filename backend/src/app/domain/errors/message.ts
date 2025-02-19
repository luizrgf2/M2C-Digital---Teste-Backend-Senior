import { ErrorBase } from "src/app/shared/errorBase";

export class MessageInvalidPhoneNumberError extends ErrorBase {
    constructor() {
        super("O número de telefone deve conter DDD e ter 8 ou 9 dígitos.", 400);
    }
}

export class MessageInvalidContentLengthError extends ErrorBase {
    constructor(minLength: number = 10, maxLength: number = 400) {
        super(`A mensagem deve ter entre ${minLength} e ${maxLength} caracteres.`, 400);
    }
}
