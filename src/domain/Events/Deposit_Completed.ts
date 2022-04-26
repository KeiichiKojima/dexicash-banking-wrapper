import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Deposit } from '../DexiCash/Deposit';

export class Deposit_Completed implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public OrderId: string;
    public Id: UniqueEntityID;

    constructor (deposit: Deposit) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`deposit.deposit_created`];
        this.dateTimeOccurred = new Date();
        this.OrderId = deposit.OrderId;
        this.Id = deposit.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
