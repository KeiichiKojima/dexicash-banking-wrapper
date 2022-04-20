import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Claim_Created } from '../Events/Claim_Created';
import { logger } from '../../services/logger';
import { Claim_Cancelled } from '../Events/Claim_Cancelled';
import { Claim_Completed } from '../Events/Claim_Completed';


export enum Claim_Status {
    Created,
    Cancelled,
    Completed
}

export interface IDexiCash_Claim {
    ClaimId: string;
    RewardId: string;
    LootId: string;
    Amount: number;
    Status?: Claim_Status;
    StatusReason?: string;
}

export class Claim extends AggregateRoot<IDexiCash_Claim> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get ClaimId(): string {
        return this.props.ClaimId;
    }
    get RewardId(): string {
        return this.props.RewardId;
    }

    get LootId(): string {
        return this.props.LootId;
    }

    get Status(): Claim_Status {
        return this.props.Status;
    }

    get StatusReason(): string {
        return this.props.StatusReason;
    }

    complete() {
        this.props.Status = Claim_Status.Completed;
        logger.debug('************ reward completed *************');
    }

    cancelled(reason: string) {
        this.props.Status = Claim_Status.Cancelled;
        this.props.StatusReason = reason;
        logger.debug('************ reward cancelled *************');
    }


    private constructor(props: IDexiCash_Claim, id?: UniqueEntityID) {
        super(props, id);
    }

    public static Create(props: IDexiCash_Claim, id?: UniqueEntityID): Claim {
        props.Status = Claim_Status.Created;
        const claim = new Claim({
            ...props,
        }, id);

        // If the id wasn't provided, it means that we're creating a new
        // user, so we should create a UserCreatedEvent.

        const idWasProvided = !!id;

        if (!idWasProvided) {
            // Method from the AggregateRoot parent class. We'll look
            // closer at this.
            claim.addDomainEvent(new Claim_Created(claim));
        }
        return claim;
    }

}
