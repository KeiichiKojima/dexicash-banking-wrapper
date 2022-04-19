import { IRepository } from './interfaces/IRepository';
import lodash from 'lodash';

export abstract class BaseRepository<T> implements IRepository<T> {
    private documents: T[];

    constructor() {
        this.documents = [];
    }

    async create(item: T): Promise<boolean> {
        this.documents.push(item);

        return true;
    }

    async findOne(filter: Partial<T>): Promise<T> {
        const doc = lodash.find(this.documents, filter) as T;

        return doc;
    }

    async find(filter: Partial<T>): Promise<T[]> {
        const docs = lodash.filter(this.documents, filter) as T[];

        return docs;
    }

    async update(id: string, item: T): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}