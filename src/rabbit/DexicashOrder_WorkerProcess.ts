#!/usr/bin/env node

import { IDomainEvent } from '../core/domain/events/IDomainEvent';

const { makePublisher } = require('amqp-simple-pub-sub');
import { Order, Order_Status } from '../domain/DexiCash/Order';
import { Order_Created } from '../domain/Events/Order_Created';
import { DomainEvents } from '../core/domain/events/DomainEvents';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;

const { logger } = require('../services/logger');

const { makeSubscriber } = require('amqp-simple-pub-sub');

const subscriber = makeSubscriber({
    type: 'topic', // the default
    exchange: 'topic_orders',
    queueName: 'topic_orders',
    routingKeys: ['orders.#'],
    onError: (err: any) => { // optional
        console.error('A connection error happened', err); // or do something clever
    },
    onClose: () => { // optional
        console.log('The connection has closed.'); // or do something clever
    },
});

let orders: any = [];

const orderProcessHandler = (message: any) => {

    try {
        let dataMessage = JSON.parse(Buffer.from(message.content).toString());

        logger.info('Message Received', dataMessage);
        switch (dataMessage.EventType) {
            case 'Create_Order': {
                let order = Order.Create({ OrderId: dataMessage.OrderId});
                orders.push(order);
                logger.debug(orders.length);
                break;
            }
            case 'Order_Created': {
                break;
            }
            case 'Order_Payment_Completed': {
                let order = orders.find((x: any) => x.OrderId === dataMessage.OrderId);
                if(order) {
                    order.complete();
                    logger.debug(order);
                }
                else{
                    logger.error('order not found', dataMessage)
                }
                break;
            }
            case 'Order_Payment_Cancelled': {
                let order = orders.find((x: any) => x.OrderId === dataMessage.OrderId);
                if(order) {
                    order.cancelled(dataMessage.Reason);
                    logger.debug(order);
                }
                else{
                    logger.error('order not found', dataMessage)
                }
                break;
            }
            default: {
                console.log(dataMessage.EventType);
                break;
            }
        }
        subscriber.ack(message);
    } catch (error) {
        logger.debug(message);
        logger.error('Order error', error)
    }
};

subscriber.start(orderProcessHandler);

