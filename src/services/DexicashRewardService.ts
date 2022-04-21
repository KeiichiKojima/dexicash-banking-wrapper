import { Reward } from '../domain/DexiCash/Reward';

import { DomainEvents } from '../core/domain/events/DomainEvents';
import { RewardRepository } from '../repositories/RewardRepository';
import { createInventoryTransfer, createLootRequest, getLootRequest } from '../services/DexiEmporiumAPIService';
import { transfer } from '../services/GoBankingService';
import { accountRepository, rewardRepository } from '../repositories';

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

            case 'Create_Reward': {

                logger.info('Create_Reward Message Received', dataMessage);
                let reward = Reward.Create({ Amount: dataMessage.Amount, GameId: dataMessage.GameId, UserId: dataMessage.UserId, RewardId: dataMessage.RewardId });

                await rewardRepository.save(reward);
                DomainEvents.dispatchEventsForAggregate(reward.id);
                subscriber.ack(message);
            }
                break;

            case 'Make_Claim': {

                logger.info('Make_Claim Message Received', dataMessage);
                let reward = await rewardRepository.findOne( {RewardId : dataMessage.RewardId });
                if(reward){
                    reward.claim(dataMessage.Amount);
                    await rewardRepository.save(reward);
                    DomainEvents.dispatchEventsForAggregate(reward.id);
                    subscriber.ack(message);
                }else{
                    logger.error(`Make_Claim ERROR: reward not found`)
                    subscriber.nack(message);
                }
            }
                break;
            case 'Reward_Created': {

                logger.info('Reward_Created Message Received', dataMessage);
                let reward = await rewardRepository.findOne( {RewardId : dataMessage.RewardId });
                if(reward) {

                    let requestId = await createLootRequest(reward.UserId, reward.GameId).catch(
                        (error) => {
                            throw JSON.stringify(error);
                        },
                    );

                    let data = await getLootRequest(reward.UserId, "requestId");
                    if (data.data.winStatus === 'Won') {
                        reward.authorised(data.data.loot)
                    } else {
                        reward.cancelled('Lose')
                    }

                    await rewardRepository.save(reward);
                    DomainEvents.dispatchEventsForAggregate(reward.id);
                    subscriber.ack(message);
                }
            }
                break;
            case 'Reward_Cancelled': {

                logger.info('Reward_Cancelled Message Received', dataMessage);
                subscriber.ack(message);
                //await publisher.publish('orders.command.create_order', JSON.stringify({EventType:'Create_Order', OrderId: '123'}))
            }
                break;
            case 'Reward_Completed': {

                logger.info('Reward_Completed Message Received', dataMessage);
                subscriber.ack(message);
                //await publisher.publish('orders.command.create_order', JSON.stringify({EventType:'Create_Order', OrderId: '123'}))
            }
                break;
            case 'DexiCash_Reward_Created': {

                let reward = await rewardRepository.findOne( {RewardId : dataMessage.RewardId });
                if(reward) {
                    let account = await accountRepository.findOne({ UserId: dataMessage.UserId });
                    let game = await accountRepository.findOne({ UserId: dataMessage.GameId });
                    if (account && game) {
                        // get Id
                        try {
                            logger.debug(JSON.stringify(dataMessage));

                            let request = await transfer(game.BankId, account.BankId, dataMessage.Amount);
                            logger.info(request)

                            if (request && request?.status === 'success') {
                                reward.completed()
                                await rewardRepository.save(reward);
                                DomainEvents.dispatchEventsForAggregate(reward.id);
                            }

                            subscriber.ack(message);
                        } catch (e) {
                            logger.error(e);

                            subscriber.nack(message);
                        }

                    } else {
                        logger.error('accounts not found', dataMessage);
                        subscriber.nack(message, false, true);
                    }
                }
            }
                break;
            case 'Item_Reward_Claimed': {

                let reward = await rewardRepository.findOne( {RewardId : dataMessage.RewardId });
                if(reward) {
                    logger.info('Item_Reward_Claimed Message Received', dataMessage);

                    let request = await createInventoryTransfer(reward.UserId, reward.GameId, dataMessage.Prize).catch(
                        (error) => {
                            throw JSON.stringify(error);
                        },
                    );
                    logger.debug(request)

                    if(request && request?.status === 'success'){
                        reward.completed()
                        await rewardRepository.save(reward);
                        DomainEvents.dispatchEventsForAggregate(reward.id);
                    }
                    subscriber.ack(message);
                }
            }
                break;
            default:
                subscriber.ack(message);
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
