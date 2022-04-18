import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { Order_Created } from '../Events/Order_Created';
import { DomainEvents } from '../../core/domain/events/DomainEvents';
import { Order_Payment_Cancelled, Order_Payment_Completed } from '../Events/Order_Payment';
import { logger } from '../../services/logger';
import { User_Created } from '../Events/User_Created';
import { Order_Status } from './Order';


export enum Account_Status {
    Created,
    Cancelled,
    Completed
}

interface IDexiCash_User {
    UserId: string;
    BankId?: string;
    Status?: Account_Status;
}

export class User extends AggregateRoot<IDexiCash_User> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get UserId(): string {
        return this.props.UserId;
    }
    get BankId(): string {
        return this.props.BankId;
    }

    get Status(): Account_Status {
        return this.props.Status;
    }

    assign(bankId:string) {
        this.props.BankId = bankId;
        this.props.Status = Account_Status.Completed;
        logger.debug('************ assign completed *************');
    }

    cancelled(reason: string) {
        this.props.Status = Account_Status.Cancelled;
        logger.debug('************ order cancelled *************');
    }

    private constructor(props: IDexiCash_User, id?: UniqueEntityID) {
        super(props, id);
    }

    public static Create(props: IDexiCash_User, id?: UniqueEntityID): User {
        props.Status = Account_Status.Created
        const user = new User({
            ...props,
        }, id);

        // If the id wasn't provided, it means that we're creating a new
        // user, so we should create a UserCreatedEvent.

        const idWasProvided = !!id;

        if (!idWasProvided) {
            // Method from the AggregateRoot parent class. We'll look
            // closer at this.
            user.addDomainEvent(new User_Created(user));
        }

        return user;
    }

}
