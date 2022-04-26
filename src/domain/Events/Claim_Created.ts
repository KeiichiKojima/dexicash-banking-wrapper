import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Claim } from '../DexiCash/Claim';

export class Claim_Created implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public ClaimId: string;
    public RewardId: string;
    public Id: UniqueEntityID;

    constructor (claim: Claim) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`reward.reward_created`];
        this.dateTimeOccurred = new Date();
        this.ClaimId = claim.ClaimId;
        this.RewardId = claim.RewardId;
        this.Id = claim.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
