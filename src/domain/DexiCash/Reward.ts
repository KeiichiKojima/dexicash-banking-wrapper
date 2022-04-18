import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Deposit_Created } from '../Events/Deposit_Created';
import { Reward_Created } from '../Events/Reward_Created';
import { logger } from '../../services/logger';


export enum Reward_Status {
    Created,
    Cancelled,
    Completed
}

interface IDexiCash_Reward {
    RewardId: string;
    GameId: string;
    UserId: string;
    Amount: number;
    Status?: Reward_Status;
    StatusReason?: string;
}

export class Reward extends AggregateRoot<IDexiCash_Reward> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get RewardId(): string {
        return this.props.RewardId;
    }

    get GameId(): string {
        return this.props.GameId;
    }

    get UserId(): string {
        return this.props.UserId;
    }
    get Amount(): number {
        return this.props.Amount;
    }

    get Status(): Reward_Status {
        return this.props.Status;
    }

    get StatusReason(): string {
        return this.props.StatusReason;
    }

    complete() {
        this.props.Status = Reward_Status.Completed;
        logger.debug('************ order completed *************');
    }

    cancelled(reason: string) {
        this.props.Status = Reward_Status.Cancelled;
        this.props.StatusReason = reason;
        logger.debug('************ order cancelled *************');
    }


    private constructor(props: IDexiCash_Reward, id?: UniqueEntityID) {
        super(props, id);
    }

    public static Create(props: IDexiCash_Reward, id?: UniqueEntityID): Reward {
        props.Status = Reward_Status.Created;
        const reward = new Reward({
            ...props,
        }, id);

        // If the id wasn't provided, it means that we're creating a new
        // user, so we should create a UserCreatedEvent.

        const idWasProvided = !!id;

        if (!idWasProvided) {
            // Method from the AggregateRoot parent class. We'll look
            // closer at this.
            reward.addDomainEvent(new Reward_Created(reward));
        }

        return reward;
    }

}
