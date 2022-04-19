import { BaseRepository } from './BaseRepository';
import { Order, IDexiCash_Order } from '../domain/DexiCash/Order';
import { IReadObject } from './interfaces/IRead';

export class OrderRepository extends BaseRepository<IDexiCash_Order, Order> implements IReadObject<Order> {
    async findOne(filter: Partial<Order>): Promise<Order | null> {
        const findOneRes = await this._findOne(filter);

        if (!findOneRes) {
            return null;
        }

        return Order.Create(findOneRes.props, findOneRes.id);
    }

    async find(filter: Partial<Order>): Promise<Order[]> {
        const findAllRes = await this._find(filter);

        return findAllRes.map(doc => Order.Create(doc.props, doc.id));
    }
}