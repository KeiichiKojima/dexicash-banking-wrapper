import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { Order_Created } from '../Events/Order_Created';
import { DomainEvents } from '../../core/domain/events/DomainEvents';
import { Order_Payment_Cancelled, Order_Payment_Completed } from '../Events/Order_Payment';
import { logger } from '../../services/logger';
import { Redemption_Created } from '@domain/Events/Redemption_Created';


export enum Redemption_Status {
    Created,
    Cancelled,
    Completed
}

export interface IDexiCash_Redemption {
    RedemptionId: string;
    Status?: Redemption_Status;
    StatusReason?:string;
}

export class Redemption extends AggregateRoot<IDexiCash_Redemption> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get RedemptionId(): string {
        return this.props.RedemptionId;
    }

    get Status(): Redemption_Status {
        return this.props.Status;
    }
    get StatusReason(): string {
        return this.props.StatusReason;
    }

    complete() {
        this.props.Status = Redemption_Status.Completed;
        logger.debug("************ order completed *************")
        //this.addDomainEvent(new Order_Payment_Completed(this));
    }

    cancelled(reason : string) {
        this.props.Status = Redemption_Status.Cancelled;
        this.props.StatusReason = reason;
        logger.debug("************ order cancelled *************")
        //this.addDomainEvent(new Order_Payment_Cancelled(this));
    }

    private constructor(props: IDexiCash_Redemption, id?: UniqueEntityID) {
        super(props, id);
    }

    public static Create(props: IDexiCash_Redemption, id?: UniqueEntityID): Redemption {
        props.Status = props.Status ||  Redemption_Status.Created
        const redemption = new Redemption({
            ...props,
        }, id);

        // If the id wasn't provided, it means that we're creating a new
        // account, so we should create a UserCreatedEvent.

        const idWasProvided = !!id;

        if (!idWasProvided) {
            // Method from the AggregateRoot parent class. We'll look
            // closer at this.
            redemption.addDomainEvent(new Redemption_Created(redemption));
        }

        return redemption;
    }

}
