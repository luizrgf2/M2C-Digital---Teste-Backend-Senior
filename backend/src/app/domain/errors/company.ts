import { ErrorBase } from "src/app/shared/errorBase";

export class CompanyInvalidDocumentError extends ErrorBase {
    constructor(minLength: number = 4, maxLength: number = 400) {
        super(`O documento deve ter de ${minLength} ate ${maxLength} caracteres`, 400)
    }
}

export class CompanyInvalidNameError extends ErrorBase {
    constructor(minLength: number = 4, maxLength: number = 100) {
        super(`O nome da company deve ter de ${minLength} ate ${maxLength} caracteres`, 400)
    }
}