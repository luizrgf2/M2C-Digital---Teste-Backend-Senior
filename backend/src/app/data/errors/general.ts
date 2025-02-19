import { ErrorBase } from "src/app/shared/errorBase";

export class NotExistsError extends ErrorBase {
    constructor(){
        super("Não existe na nossa base de dados", 404)
    }
}

export class NameAlreadyExists extends ErrorBase {
    constructor(){
        super("Esse nome já existe!", 409)
    }
}