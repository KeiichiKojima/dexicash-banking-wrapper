import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { Order_Created } from '../Events/Order_Created';
import { DomainEvents } from '../../core/domain/events/DomainEvents';
import { Order_Payment_Cancelled, Order_Payment_Completed } from '../Events/Order_Payment';
import { logger } from '../../services/logger';
import { User_Created } from '../Events/User_Created';


export enum Order_Status {
    Created,
    Cancelled,
    Completed
}

interface IDexiCash_User {
    DexiUserId: string;
    Auth0Id: string;
}

export class User extends AggregateRoot<IDexiCash_User> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get DexiUserId(): string {
        return this.props.DexiUserId;
    }
    get Auth0Id(): string {
        return this.props.Auth0Id;
    }

    private constructor(props: IDexiCash_User, id?: UniqueEntityID) {
        super(props, id);
    }

    public static Create(props: IDexiCash_User, id?: UniqueEntityID): User {
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
