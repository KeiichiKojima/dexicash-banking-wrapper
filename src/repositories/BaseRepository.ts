import { IRepository } from './interfaces/IRepository';
import { isMatch } from 'lodash';
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';

export abstract class BaseRepository<Q extends Object, T extends AggregateRoot<Q>> implements IRepository<T> {
    private documents: Record<string, string>;

    constructor() {
        this.documents = {};
    }

    async create(item: T): Promise<boolean> {
        if (!this.documents[item.id.toString()]) {
            this.documents[item.id.toString()] = JSON.stringify(item);

            return true;
        }

        return false;
    }

    async _findOne(filter: Partial<T>): Promise<T | null> {
        for (let id in this.documents) {
            const obj = JSON.parse(this.documents[id]) as T;

            if (isMatch(obj.props, filter)) {
                return obj;
            }
        }

        return null;
    }

    async _find(filter: Partial<T>): Promise<T[]> {
        const docs: T[] = [];

        for (let id in this.documents) {
            const obj = JSON.parse(this.documents[id]);

            if (isMatch(obj.props, filter)) {
                docs.push(obj);
            }
        }

        return docs;
    }

    async update(id: UniqueEntityID, item: T): Promise<boolean> {
        try {
            this.documents[id.toString()] = JSON.stringify(item);

            return true;
        } catch {
            return false;
        }
    }

    async save(item: T): Promise<boolean> {
        return this.update(item.id, item);
    }

    async delete(id: UniqueEntityID): Promise<boolean> {
        try {
            delete this.documents[id.toString()];

            return true;
        } catch {
            return false;
        }
    }
}
