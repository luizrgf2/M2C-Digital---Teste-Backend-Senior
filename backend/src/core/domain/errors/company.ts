import { ErrorBase } from "src/core/shared/errorBase";

export class CompanyInvalidDocumentError extends ErrorBase {
    constructor(minLength: number = 4, maxLength: number = 400) {
        super(`O documento deve ter entre ${minLength} e ${maxLength} caracteres.`, 400);
    }
}

export class CompanyInvalidNameError extends ErrorBase {
    constructor(minLength: number = 4, maxLength: number = 100) {
        super(`O nome da empresa deve ter entre ${minLength} e ${maxLength} caracteres.`, 400);
    }
}
