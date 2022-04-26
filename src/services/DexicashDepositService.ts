import { DepositRepository } from '../repositories/DepositRepository';

const { makePublisher } = require('amqp-simple-pub-sub');
import { Order, Order_Status } from '../domain/DexiCash/Order';
import { Order_Created } from '../domain/Events/Order_Created';
import { DomainEvents } from '../core/domain/events/DomainEvents';
import { Deposit } from '../domain/DexiCash/Deposit';
import { depositRepository } from '../repositories';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;

const { logger } = require('../services/logger');

const makeHandler = (subscriber:any, name:string) => async (message:any) => {
    try {
        let dataMessage = JSON.parse(Buffer.from(message.content).toString());

        logger.info(`Message Received by ${name}: dataMessage`);
        switch (dataMessage.EventType) {
            /*case 'Create_Deposit': {
                let deposit = Deposit.Create({ OrderId: dataMessage.OrderId });
                await depositRepository.save(deposit);
                DomainEvents.dispatchEventsForAggregate(deposit.id);
                subscriber.ack(message);
            }
                break;*/
            case 'Order_Created': {
                let deposit = Deposit.Create({ OrderId: dataMessage.OrderId });
                await depositRepository.save(deposit);

                DomainEvents.dispatchEventsForAggregate(deposit.id);

                subscriber.ack(message);
                //await publisher.publish('orders.command.create_order', JSON.stringify({EventType:'Create_Order', OrderId: '123'}))
            }
                break;

            case 'Order_Payment_Completed': {

                let deposit = await depositRepository.findOne( { OrderId : dataMessage.OrderId});
                if (deposit) {
                    deposit.complete();
                    await depositRepository.save(deposit)
                    DomainEvents.dispatchEventsForAggregate(deposit.id);
                    logger.debug(deposit);
                    logger.info('deposit_Completed ***** ', dataMessage);
                    subscriber.ack(message);
                } else {
                    logger.error('deposit not found', dataMessage);
                    subscriber.nack(message, false, true);
                }
            }
                break;

            case 'Order_Payment_Cancelled': {
                let deposit = await depositRepository.findOne( { OrderId : dataMessage.OrderId});
                if (deposit) {
                    deposit.cancelled(dataMessage.Reason);
                    await depositRepository.save(deposit)
                    DomainEvents.dispatchEventsForAggregate(deposit.id);
                    logger.debug(deposit);
                    logger.info('deposit_Cancelled ***** ', dataMessage);
                    subscriber.ack(message);
                } else {
                    logger.error('deposit not found', dataMessage);
                    subscriber.nack(message, false, true);
                }
            }
                break;
            default:
                logger.info('I dont listen to this message ***** ', dataMessage);
                subscriber.ack(message);

                break;

        }
    } catch (error) {
        logger.info(message);
        logger.error('Deposit error', error);
    }
}

const { DEPOSITS_QUEUE: queueName, DEPOSIT_routingKey: routingKey } = require('../constants')
const { genericSubscriber } = require('../rabbit/genericSubscriber');
const DepositSubscriber = genericSubscriber(queueName, routingKey, makeHandler)
export { DepositSubscriber }
