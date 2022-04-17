import { Order, Order_Status } from '../domain/DexiCash/Order';
import { DomainEvents } from '../core/domain/events/DomainEvents';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;

const { logger } = require('../services/logger');

let orders: any = [];

const makeHandler = (subscriber: any, name: string) => async (message: any) => {
    try {
        let dataMessage = JSON.parse(Buffer.from(message.content).toString());

        logger.info('Message Received', dataMessage);
        switch (dataMessage.EventType) {
            case 'Create_Order': {

                let order = orders.find((x: any) => x.OrderId === dataMessage.OrderId);
                if (!order) {
                    let order = Order.Create({ OrderId: dataMessage.OrderId });
                    orders.push(order);
                    DomainEvents.dispatchEventsForAggregate(order.id);
                    logger.debug(orders.length);
                    subscriber.ack(message);
                } else {

                    subscriber.nack(message, false, true);
                    logger.error('Duplicate order', order);
                }
            }
                break;
            case 'Order_Payment_Completed': {
                let order = orders.find((x: any) => x.OrderId === dataMessage.OrderId);
                if (order) {
                    order.complete();
                    DomainEvents.dispatchEventsForAggregate(order.id);
                    logger.debug(order);
                    subscriber.ack(message);
                } else {
                    logger.error('order not found', dataMessage);
                    subscriber.nack(message, false, true);
                }
            }
                break;
            case 'Order_Payment_Cancelled': {
                let order = orders.find((x: any) => x.OrderId === dataMessage.OrderId);
                if (order) {
                    order.cancelled(dataMessage.Reason);
                    DomainEvents.dispatchEventsForAggregate(order.id);
                    logger.debug(order);
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
