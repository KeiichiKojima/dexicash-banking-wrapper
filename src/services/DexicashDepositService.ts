
const { makePublisher } = require('amqp-simple-pub-sub');
import { Order, Order_Status } from '../domain/DexiCash/Order';
import { Order_Created } from '../domain/Events/Order_Created';
import { DomainEvents } from '../core/domain/events/DomainEvents';
import { Deposit } from '../domain/DexiCash/Deposit';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;

const { logger } = require('../services/logger');

let deposits: any = [];

const makeHandler = (subscriber:any, name:string) => async (message:any) => {
    try {
        let dataMessage = JSON.parse(Buffer.from(message.content).toString());

        logger.info('Message Received', dataMessage);
        switch (dataMessage.EventType) {
            case 'Create_Deposit': {
                console.log('I DO listen to this message ###### ', dataMessage.EventType);
                let deposit = Deposit.Create({ OrderId: dataMessage.OrderId });
                deposits.push(deposit);
                DomainEvents.dispatchEventsForAggregate(deposit.id);
                logger.debug(deposits.length);
                subscriber.ack(message);
            }
                break;
            case 'Deposit_Created': {
                console.log('I DO listen to this message ###### ', dataMessage.EventType);
                let deposit = deposits.find((x: any) => x.OrderId === dataMessage.OrderId);
                logger.debug(deposit);
                subscriber.ack(message);
            }
                break;

            case 'Order_Created': {

                logger.debug('*********** ddeposit will be created here **********');
                let deposit = Deposit.Create({ OrderId: dataMessage.OrderId });
                deposits.push(deposit);

                DomainEvents.dispatchEventsForAggregate(deposit.id);
                logger.debug(deposits.length);

                subscriber.ack(message);
                //await publisher.publish('orders.command.create_order', JSON.stringify({EventType:'Create_Order', OrderId: '123'}))
            }
                break;

            case 'Order_Payment_Completed': {

                console.log('Order_Completed ***** ', dataMessage);
                let deposit = deposits.find((x: any) => x.OrderId === dataMessage.OrderId);
                if (deposit) {
                    deposit.complete();
                    DomainEvents.dispatchEventsForAggregate(deposit.id);
                    logger.debug(deposit);
                    subscriber.ack(message);
                } else {
                    logger.error('deposit not found', dataMessage);
                    subscriber.nack(message, false, true);
                }
            }
                break;

            case 'Order_Payment_Cancelled': {
                console.log('Order_Cancelled ***** ', dataMessage);
                let deposit = deposits.find((x: any) => x.OrderId === dataMessage.OrderId);
                if (deposit) {
                    deposit.cancelled(dataMessage.Reason);
                    DomainEvents.dispatchEventsForAggregate(deposit.id);
                    logger.debug(deposit);
                    subscriber.ack(message);
                } else {
                    logger.error('deposit not found', dataMessage);
                    subscriber.nack(message, false, true);
                }
            }
                break;
            default:
                console.log('I dont listen to this message ***** ', dataMessage);
                break;

        }
    } catch (error) {
        logger.debug(message);
        logger.error('Deposit error', error);
    }
}

const { DEPOSITS_QUEUE: queueName, DEPOSIT_routingKey: routingKey } = require('../constants')
const { genericSubscriber } = require('../rabbit/genericSubscriber');
const DepositSubscriber = genericSubscriber(queueName, routingKey, makeHandler)
export { DepositSubscriber }
