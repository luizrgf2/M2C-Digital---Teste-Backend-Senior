import { ErrorBase } from "src/core/shared/errorBase";

export class CompanyNameAlreadyExistsError extends ErrorBase {
    constructor() {
        super("O nome da empresa já existe!", 409)
    }
}