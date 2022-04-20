import { Reward } from '../domain/DexiCash/Reward';

const { makePublisher } = require('amqp-simple-pub-sub');
import { Order, Order_Status } from '../domain/DexiCash/Order';
import { Order_Created } from '../domain/Events/Order_Created';
import { DomainEvents } from '../core/domain/events/DomainEvents';
import { Deposit } from '../domain/DexiCash/Deposit';
import { RewardRepository } from '../repositories/RewardRepository';
import { createLootRequest, getLootRequest } from '../services/DexiEmporiumAPIService';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;

const { logger } = require('../services/logger');

let rewardRepository:RewardRepository = new RewardRepository();

const makeHandler = (subscriber:any, name:string) => async (message:any) => {
    try {
        let dataMessage = JSON.parse(Buffer.from(message.content).toString());

        logger.info(`Message Received by ${name}: dataMessage`);
        switch (dataMessage.EventType) {

            case 'Create_Reward': {

                logger.info('Create_Reward Message Received', dataMessage);
                let reward = Reward.Create({ Amount: dataMessage.Amount, GameId: dataMessage.GameId, UserId: dataMessage.UserId, RewardId: dataMessage.RewardId });

                await rewardRepository.save(reward);
                DomainEvents.dispatchEventsForAggregate(reward.id);
                subscriber.ack(message);
            }
                break;

            case 'Reward_Created': {

                logger.info('Reward_Created Message Received', dataMessage);
                logger.debug('*********** ddeposit will be created here **********');
                let reward = await rewardRepository.findOne( {UserId : dataMessage.UserId });
                let requestId = await createLootRequest(reward.UserId, reward.GameId).catch(
                    (error) => {
                        throw JSON.stringify(error);
                    },
                );
                console.log(requestId)
                let data = await getLootRequest(reward.UserId, "requestId");
                console.log("!!!!!!!!!!!!!!!!!!!!", data.data.winStatus)
                if(data.data.winStatus === 'Win'){
                    reward.complete()
                }else{
                    reward.cancelled('Lose')
                }

                console.log("domainEvents", reward.domainEvents, reward.id as UniqueEntityID)
                await rewardRepository.save(reward);
                DomainEvents.dispatchEventsForAggregate(reward.id as UniqueEntityID);
                /*let userRewards = await rewardRepository.findOne( {UserId : dataMessage.UserId });
                const total = Object.values(userRewards).reduce((t, {Amount}) => t + Amount, 0)

                logger.debug(`Balance for ${dataMessage.UserId} is ${ total || 0}`)*/
                subscriber.ack(message);
                //await publisher.publish('orders.command.create_order', JSON.stringify({EventType:'Create_Order', OrderId: '123'}))
            }
                break;
            default:
                logger.debug('I dont listen to this message ***** ', dataMessage);
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
