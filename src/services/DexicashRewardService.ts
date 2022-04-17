import { Reward } from '../domain/DexiCash/Reward';

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

let rewards: any = [];

const makeHandler = (subscriber:any, name:string) => async (message:any) => {
    try {
        let dataMessage = JSON.parse(Buffer.from(message.content).toString());

        logger.info('Message Received', dataMessage);
        switch (dataMessage.EventType) {

            case 'Create_Reward': {
                console.log('I DO listen to this message ###### ', dataMessage.EventType);
                console.log(dataMessage)
                let reward = Reward.Create({ Amount: dataMessage.Amount, GameId: dataMessage.GameId, UserId: dataMessage.UserId, RewardId: dataMessage.RewardId });
                rewards.push(reward);
                DomainEvents.dispatchEventsForAggregate(reward.id);

                subscriber.ack(message);
            }
                break;

            case 'Reward_Created': {

                logger.debug('*********** ddeposit will be created here **********');
                let userRewards = rewards.filter( (x:any)=>{
                    return x.UserId === dataMessage.UserId
                });
                const total = Object.values(userRewards).reduce((t, {Amount}) => t + Amount, 0)

                console.log(total)
                console.log(`Balance for ${dataMessage.UserId} is ${ total || 0}`)
                subscriber.ack(message);
                //await publisher.publish('orders.command.create_order', JSON.stringify({EventType:'Create_Order', OrderId: '123'}))
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

const { REWARD_QUEUE: queueName, REWARD_routingKey: routingKey } = require('../constants')
const { genericSubscriber } = require('../rabbit/genericSubscriber');
const RewardSubscriber = genericSubscriber(queueName, routingKey, makeHandler)
export { RewardSubscriber }
