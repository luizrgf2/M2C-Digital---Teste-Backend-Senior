export class Left<T> {
    value: T

    constructor(value: T) {
        this.value = value
    }

    isRight() {
        return false
    }

    isLeft() {
        return true
    }

    static create<T>(value: T) {
        return new Left(value)
    }
}

export class Right<T> {
    value: T

    constructor(value: T) {
        this.value = value
    }

    isRight() {
        return true
    }

    isLeft() {
        return false
    }

    static create<T>(value: T) {
        return new Right(value)
    }
}

export type Either<L,R> = Left<L> | Right<R>