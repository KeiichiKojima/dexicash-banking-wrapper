import { IDomainEvent } from '../../core/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Reward } from '../DexiCash/Reward';

export class Create_Reward implements IDomainEvent {
    public key:string[];
    public EventType: string;
    public dateTimeOccurred: Date;
    public RewardId: string;
    public Amount: number;
    public Id: UniqueEntityID;

    constructor (reward: Reward) {

        const domainEventClass = Reflect.getPrototypeOf(this);
        this.EventType = domainEventClass.constructor.name;
        this.key = [`orders.command.create_order`];
        this.dateTimeOccurred = new Date();
        this.RewardId = reward.RewardId;
        this.Amount = reward.Amount;
        this.Id = reward.id
    }

    getAggregateId (): UniqueEntityID {
        return this.Id;
    }
}
