export interface IRead<Q extends Object, T> {
    _find(filter: Partial<Q>): Promise<T[]>;
    _findOne(filter: Partial<Q>): Promise<T | null>;
}

export interface IReadObject<Q extends Object, T> {
    find(filter: Partial<Q>): Promise<T[]>;
    findOne(filter: Partial<Q>): Promise<T | null>;
}
