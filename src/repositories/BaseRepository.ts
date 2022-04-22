import { IRepository } from './interfaces/IRepository';
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';

export class BaseRepository<Q extends Object, T extends AggregateRoot<Q>> implements IRepository<Q, T> {
    protected context: IRepository<Q, T>;

    constructor(context: IRepository<Q, T>) {
        this.context = context;
    }

    async create(item: T): Promise<boolean> {
        return this.context.create(item);
    }

    async _findOne(filter: Partial<Q>): Promise<T | null> {
        return this.context._findOne(filter);
    }

    async _find(filter: Partial<Q>): Promise<T[]> {
        return this.context._find(filter);
    }

    async update(id: UniqueEntityID, item: T): Promise<boolean> {
        return this.context.update(id, item);
    }

    async save(item: T): Promise<boolean> {
        return this.update(item.id, item);
    }

    async delete(id: UniqueEntityID): Promise<boolean> {
        return this.context.delete(id);
    }
}
