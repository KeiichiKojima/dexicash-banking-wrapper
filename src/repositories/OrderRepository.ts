import { BaseRepository } from './BaseRepository';
import { Order } from '../domain/DexiCash/Order';
import OrderModel from '@database/models/order.model';

export class OrderRepository extends BaseRepository<Order> {
    constructor() {
        super(OrderModel);
    }
}
