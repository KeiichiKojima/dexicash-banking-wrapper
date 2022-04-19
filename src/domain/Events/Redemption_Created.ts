import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Order } from '../DexiCash/Order';
import { Redemption } from '@domain/DexiCash/Redemption';

export class Redemption_Created implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public RedemptionId: string;
    public Id: UniqueEntityID;

    constructor (redemption: Redemption) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`orders.order_created`];
        this.dateTimeOccurred = new Date();
        this.RedemptionId = redemption.RedemptionId;
        this.Id = redemption.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
