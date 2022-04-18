import mongoose from 'mongoose';
import { IRepository } from './interfaces/IRepository';

export abstract class BaseRepository<T> implements IRepository<T> {
    public readonly _model: mongoose.Model<T>;

    constructor(model: mongoose.Model<T>) {
        this._model = model;
    }

    async create(item: T): Promise<boolean> {
        const result = await this._model.create(item);

        return !!result;
    }

    async findOne(filter: Partial<T>): Promise<T> {
        const result = await this._model.findOne(filter);

        return result;
    }

    async find(filter: Partial<T>): Promise<T[]> {
        const results = await this._model.find(filter);

        return results;
    }

    async update(id: string, item: T): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}