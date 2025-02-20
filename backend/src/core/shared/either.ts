export class Left<T> {
    left: T
    right = undefined

    constructor(value: T) {
        this.left = value
    }

    static create<T>(value: T) {
        return new Left(value)
    }
}

export class Right<T> {
    left = undefined
    right:T
    
    constructor(value: T) {
        this.right = value
    }

    static create<T>(value: T) {
        return new Right(value)
    }
}

export type Either<L,R> = Left<L> | Right<R>