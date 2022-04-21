import { Order, Order_Status } from '../domain/DexiCash/Order';
import { DomainEvents } from '../core/domain/events/DomainEvents';
import OrderModel from '@database/models/order.model';
import { OrderRepository } from '../repositories/OrderRepository';
import { ordersRepository } from '../repositories';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;

const { logger } = require('../services/logger');

const makeHandler = (subscriber: any, name: string) => async (message: any) => {
    try {
        let dataMessage = JSON.parse(Buffer.from(message.content).toString());

        logger.info(`Message Received by ${name}: dataMessage`);
        switch (dataMessage.EventType) {
            case 'Create_Order': {
                let order = await ordersRepository.findOne({ OrderId: dataMessage.OrderId });
                if (!order) {
                    let order = Order.Create({ OrderId: dataMessage.OrderId });
                    logger.debug(JSON.stringify(dataMessage))

                    await ordersRepository.save(order)
                    DomainEvents.dispatchEventsForAggregate(order.id);
                    logger.debug(JSON.stringify(order));
                    subscriber.ack(message);
                } else {

                    subscriber.nack(message, false, true);
                    logger.error('Duplicate order', order);
                }
            }
                break;
            case 'Order_Payment_Completed': {
                let order = await ordersRepository.findOne({ OrderId: dataMessage.OrderId });
                if (order) {
                    order.complete();
                    await ordersRepository.save(order)
                    DomainEvents.dispatchEventsForAggregate(order.id);
                    logger.debug(JSON.stringify(order));
                    subscriber.ack(message);
                } else {
                    logger.error('order not found', dataMessage);
                    subscriber.nack(message, false, true);
                }
            }
                break;
            case 'Order_Payment_Cancelled': {
                let order = await ordersRepository.findOne({ OrderId: dataMessage.OrderId });
                if (order) {
                    order.cancelled(dataMessage.Reason);
                    await ordersRepository.save(order)
                    DomainEvents.dispatchEventsForAggregate(order.id);
                    logger.debug(JSON.stringify(order));
                    subscriber.ack(message);
                } else {
                    logger.error('order not found', dataMessage);
                    subscriber.nack(message, false, true);
                }
            }
                break;
            default: {
                logger.debug('I dont listen to this message ***** ', dataMessage.EventType);
                subscriber.nack(message);
            }
                break;
        }
    } catch (error) {
        logger.debug(message);
        logger.error('Order error', error);
    }
};

const { ORDER_QUEUE: queueName, ORDER_routingKey: routingKey } = require('../constants');
const { genericSubscriber } = require('../rabbit/genericSubscriber');
const OrderSubscriber = genericSubscriber(queueName, routingKey, makeHandler);
export { OrderSubscriber };
