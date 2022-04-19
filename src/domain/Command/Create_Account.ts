import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Order } from '../DexiCash/Order';
import { Account } from '../DexiCash/Account';

export class Create_Account implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public UserId: string;
    public Id: UniqueEntityID;

    constructor (account: Account) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`orders.command.create_order`];
        this.dateTimeOccurred = new Date();
        this.UserId = account.UserId;
        this.Id = account.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
