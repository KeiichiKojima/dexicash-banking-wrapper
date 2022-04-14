
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

export interface IDomainEvent {
  Type:string;
  dateTimeOccurred: Date;
  getAggregateId (): UniqueEntityID;
}

