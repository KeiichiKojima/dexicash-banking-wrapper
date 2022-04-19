export interface IRead<T> {
    _find(filter: Partial<T>): Promise<T[]>;
    _findOne(filter: Partial<T>): Promise<T | null>;
}

export interface IReadObject<T> {
    find(filter: Partial<T>): Promise<T[]>;
    findOne(filter: Partial<T>): Promise<T | null>;
}
