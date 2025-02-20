import { ErrorBase } from "src/core/shared/errorBase";

export class ServerError extends ErrorBase {
    constructor(message: string) {
        super(message, 500);
    }
}
