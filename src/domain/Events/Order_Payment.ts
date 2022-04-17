import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Order } from '../DexiCash/Order';

export class Order_Payment_Completed implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public OrderId: string;
    public Id: UniqueEntityID;

    constructor (order: Order) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`orders.order_payment_completed`];
        this.dateTimeOccurred = new Date();
        this.OrderId = order.OrderId;
        this.Id = order.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}


export class Order_Payment_Cancelled implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public OrderId: string;
    public Reason: string;
    public Id: UniqueEntityID;

    constructor (order: Order) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`orders.order_payment_cancelled`];
        this.dateTimeOccurred = new Date();
        this.OrderId = order.OrderId;
        this.Reason = order.StatusReason;
        this.Id = order.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
