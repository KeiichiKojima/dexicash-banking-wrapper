import { IRead } from './IRead';
import { IWrite } from './IWrite';
import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';

export interface IRepository<Q extends Object, T extends AggregateRoot<Q>> {
    _find(filter: Partial<Q>): Promise<T[]>;
    _findOne(filter: Partial<Q>): Promise<T | null>;
    create(item: T): Promise<boolean>;
    update(id: UniqueEntityID, item: T): Promise<boolean>;
    save(item: T): Promise<boolean>;
    delete(id: UniqueEntityID): Promise<boolean>;
}
