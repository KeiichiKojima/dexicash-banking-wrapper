import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import mongoose from 'mongoose';
import { IDomainModel } from '@domain/interfaces/IDomainModel';
import { IRepository } from './interfaces/IRepository';

export class DBContext<Q extends Object, T extends AggregateRoot<Q>> implements IRepository<Q, T> {
    private model: mongoose.Model<IDomainModel>;

    constructor(_model: mongoose.Model<IDomainModel>) {
        this.model = _model;
    }

    async create(item: T): Promise<boolean> {
        const entityId = item.id.toString();

        try {
            await this.model.create({
                entityId,
                objectJson: item,
            });

            return true;
        } catch {
            return false;
        }
    }

    private getDbFilter(filter: Partial<Q>): Record<string, any> {
        const dbFilter: Record<string, any> = {};

        for (let key in filter) {
            dbFilter[`objectJson.props.${key}`] = filter[key];
        }

        return dbFilter;
    }

    async _findOne(filter: Partial<Q>): Promise<T | null> {
        const dbFilter = this.getDbFilter(filter);

        const res = await this.model.findOne(dbFilter);

        if (!res) {
            return null;
        }

        const result = { ...res.toObject().objectJson, id: new UniqueEntityID(res.entityId) };

        return result as T;
    }

    async _find(filter: Partial<Q>): Promise<T[]> {
        const dbFilter = this.getDbFilter(filter);

        const r = await this.model.find(dbFilter);

        return r.map((item) => ({ ...item.toObject().objectJson, id: new UniqueEntityID(item.entityId) } as T));
    }

    async update(id: UniqueEntityID, item: T): Promise<boolean> {
        const entityId = id.toString();

        try {
            await this.model.findOneAndUpdate({
                entityId
            }, {
                objectJson: item
            })

            return true;
        } catch {
            return false;
        }
    }

    async save(item: T): Promise<boolean> {
        return this.update(item.id, item);
    }

    async delete(id: UniqueEntityID): Promise<boolean> {
        const entityId = id.toString();

        try {
            await this.model.deleteOne({
                entityId
            });

            return true;
        } catch {
            return false;
        }
    }
}
