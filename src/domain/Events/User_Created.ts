import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Order } from '../DexiCash/Order';
import { User } from '../DexiCash/User';

export class User_Created implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public UserId: string;
    public BankId: string;
    public Id: UniqueEntityID;

    constructor (user: User) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`orders.order_created`];
        this.dateTimeOccurred = new Date();
        this.UserId = user.UserId;
        this.BankId = user.BankId;
        this.Id = user.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
