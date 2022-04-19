import { BaseRepository } from './BaseRepository';
import { Order, IDexiCash_Order } from '../domain/DexiCash/Order';

export class OrderRepository extends BaseRepository<IDexiCash_Order, Order> { }