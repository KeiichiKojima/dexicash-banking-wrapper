import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Deposit_Created } from '../Events/Deposit_Created';
import { logger } from '../../services/logger';


export enum Deposit_Status {
    Created,
    Cancelled,
    Completed
}

interface IDexiCash_Deposit {
    OrderId: string;
    Status?: Deposit_Status;
    StatusReason?: string;
}

export class Deposit extends AggregateRoot<IDexiCash_Deposit> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get OrderId(): string {
        return this.props.OrderId;
    }

    get Status(): Deposit_Status {
        return this.props.Status;
    }

    get StatusReason(): string {
        return this.props.StatusReason;
    }

    complete() {
        this.props.Status = Deposit_Status.Completed;
        logger.debug('************ order completed *************');
    }

    cancelled(reason: string) {
        this.props.Status = Deposit_Status.Cancelled;
        this.props.StatusReason = reason;
        logger.debug('************ order cancelled *************');
    }


    private constructor(props: IDexiCash_Deposit, id?: UniqueEntityID) {
        super(props, id);
    }

    public static Create(props: IDexiCash_Deposit, id?: UniqueEntityID): Deposit {
        props.Status = Deposit_Status.Created;
        const deposit = new Deposit({
            ...props,
        }, id);

        // If the id wasn't provided, it means that we're creating a new
        // user, so we should create a UserCreatedEvent.

        const idWasProvided = !!id;

        if (!idWasProvided) {
            // Method from the AggregateRoot parent class. We'll look
            // closer at this.
            deposit.addDomainEvent(new Deposit_Created(deposit));
        }

        return deposit;
    }

}
