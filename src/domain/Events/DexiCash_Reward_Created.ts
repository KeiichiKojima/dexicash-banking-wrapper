import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Reward } from '../DexiCash/Reward';

export class DexiCash_Reward_Created implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public RewardId: string;
    public GameId: string;
    public UserId: string;
    public Amount: number;
    public Id: UniqueEntityID;

    constructor (reward: Reward) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`reward.dexicash_reward_created`];
        this.dateTimeOccurred = new Date();
        this.RewardId = reward.RewardId;
        this.GameId = reward.GameId;
        this.UserId = reward.UserId;
        this.Amount = reward.Amount;
        this.Id = reward.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
