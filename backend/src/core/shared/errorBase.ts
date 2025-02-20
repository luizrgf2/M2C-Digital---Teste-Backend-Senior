export class ErrorBase extends Error {
    private status: number

    constructor(error: string, statusCode: number) {
        super(error)
        this.status = statusCode
    }

    get statusCode() {
        return this.status
    }
}