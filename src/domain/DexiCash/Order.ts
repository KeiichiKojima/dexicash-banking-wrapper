import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Order_Created } from '../Events/Order_Created';
import { DomainEvents } from '../../core/domain/events/DomainEvents';


export enum Order_Status  {
    Created,
    Cancelled,
    Completed
}

interface IDexiCash_Order {
    OrderId: string;
    Status : Order_Status;
}

export class Order extends AggregateRoot<IDexiCash_Order> {
        get id(): UniqueEntityID {
            return this._id;
        }

    get OrderId (): string {
        return this.props.OrderId;
    }

    get Status (): Order_Status {
        return this.props.Status;
    }

    private constructor (props: IDexiCash_Order, id?: UniqueEntityID) {
        super(props, id);
    }

    public static Create (props: IDexiCash_Order, id?: UniqueEntityID): Order {
        const order = new Order({
            ...props,
        }, id);

        // If the id wasn't provided, it means that we're creating a new
        // user, so we should create a UserCreatedEvent.

        const idWasProvided = !!id;

        if (!idWasProvided) {
            // Method from the AggregateRoot parent class. We'll look
            // closer at this.
            order.addDomainEvent(new Order_Created(order));
        }

        return order;
    }

}
