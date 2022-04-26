import { Account } from '../domain/DexiCash/Account';
import { DomainEvents } from '../core/domain/events/DomainEvents';
import { create, getaccount, transfer } from '../services/GoBankingService';
import { AccountRepository } from '../repositories/AccountRepository';
import { accountRepository } from '../repositories';

var axios = require('axios');
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
            case 'Create_Account': {

                logger.debug('I DO listen to this message ###### ', dataMessage.EventType);
                try {
                    let account = Account.Create({ UserId: dataMessage.UserId });
                    let bankId = await create(account.UserId).catch(
                        (error) => {
                            if (error.toString().includes('duplicate key value')) {
                                return getaccount(dataMessage.UserId).then(function(response) {
                                    logger.debug(`create existing account: ${JSON.stringify(response)}`);
                                    return response;
                                }).catch(({ response }) => {
                                    logger.error(response.data);
                                    throw new Error(response.data);
                                });
                            }
                        },
                    );
                    account.assign(bankId);
                    await accountRepository.save(account);
                    DomainEvents.dispatchEventsForAggregate(account.id);
                    subscriber.ack(message);

                } catch (error: any) {
                    logger.error(error);
                    subscriber.nack(message);

                }

            }
                break;
            case 'Create_Game_Account': {
                logger.debug('I DO listen to this message ###### ', dataMessage.EventType);
                try {
                    let account = Account.Create({ UserId: dataMessage.UserId });
                    let bankId = await create(account.UserId, 100000000000000).catch(
                        (error) => {
                            if (error.toString().includes('duplicate key value')) {
                                return getaccount(dataMessage.UserId).then(function(response) {
                                    logger.debug(`create existing account: ${JSON.stringify(response)}`);
                                    return response;
                                }).catch(({ response }) => {
                                    logger.error(response.data);
                                    throw new Error(response.data);
                                });
                            }
                        },
                    );
                    account.assign(bankId);
                    await accountRepository.save(account);
                    DomainEvents.dispatchEventsForAggregate(account.id);
                    subscriber.ack(message);

                } catch (error: any) {
                    logger.error(error);
                    subscriber.nack(message);

                }

            }
                break;
            case 'Account_Created': {
                logger.debug(`Account_Created ${JSON.stringify(dataMessage)}`);
                let account = await accountRepository.findOne({ UserId: dataMessage.UserId });
                subscriber.ack(message);
                logger.debug(`Account_Created ${JSON.stringify(account)}`);
            }
                break;

            default:
                logger.debug('I dont listen to this message ***** ', dataMessage);
                subscriber.ack(message);
                break;

        }
    } catch (error) {
        logger.debug(message);
        logger.error('Account error', error);
    }
};


const { ACCOUNT_QUEUE: queueName, ACCOUNT_routingKey: routingKey } = require('../constants');
const { genericSubscriber } = require('../rabbit/genericSubscriber');
const AccountSubscriber = genericSubscriber(queueName, routingKey, makeHandler);
export { AccountSubscriber };
