
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

export interface IDomainEvent {
  key:string[];
  EventType:string;
  dateTimeOccurred: Date;
  getAggregateId (): UniqueEntityID;
}

