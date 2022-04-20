import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Deposit } from '../DexiCash/Deposit';
import { Reward } from '@domain/DexiCash/Reward';

export class Reward_Completed implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public RewardId: string;
    public Id: UniqueEntityID;

    constructor (reward: Reward) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`deposit.deposit_created`];
        this.dateTimeOccurred = new Date();
        this.RewardId = reward.RewardId;
        this.Id = reward.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
