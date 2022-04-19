import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
export interface IWrite<T> {
    create(item: T): Promise<boolean>;
    update(id: UniqueEntityID, item: T): Promise<boolean>;
    save(item: T): Promise<boolean>;
    delete(id: UniqueEntityID): Promise<boolean>;
}
