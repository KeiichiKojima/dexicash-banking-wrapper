import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Deposit } from '../DexiCash/Deposit';
import { Claim } from '@domain/DexiCash/Claim';

export class Claim_Completed implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public ClaimId: string;
    public Id: UniqueEntityID;

    constructor (reward: Claim) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`reward.reward_completed`];
        this.dateTimeOccurred = new Date();
        this.ClaimId = reward.ClaimId;
        this.Id = reward.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
