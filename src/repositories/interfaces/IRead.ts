export interface IRead<T> {
    find(filter: Partial<T>): Promise<T[]>;
    findOne(filter: Partial<T>): Promise<T>;
}
