import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Deposit } from '../DexiCash/Deposit';
import { Reward } from '@domain/DexiCash/Reward';

export class Reward_Cancelled implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public RewardId: string;
    public Reason: string;
    public Id: UniqueEntityID;

    constructor (reward: Reward) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`reward.reward_cancelled`];
        this.dateTimeOccurred = new Date();
        this.RewardId = reward.RewardId;
        this.Reason = reward.StatusReason;
        this.Id = reward.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
