import { Account } from '../domain/DexiCash/Account';

const { makePublisher } = require('amqp-simple-pub-sub');
import { Order, Order_Status } from '../domain/DexiCash/Order';
import { Order_Created } from '../domain/Events/Order_Created';
import { DomainEvents } from '../core/domain/events/DomainEvents';
import { Deposit } from '../domain/DexiCash/Deposit';
import { create, getaccount, transfer } from '../services/GoBankingService';
import { AccountRepository } from '../repositories/AccountRepository';

var axios = require('axios');
require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;

const { logger } = require('../services/logger');
let accountRepo = new AccountRepository()

const makeHandler = (subscriber: any, name: string) => async (message: any) => {
    try {
        let dataMessage = JSON.parse(Buffer.from(message.content).toString());


        logger.info(`Message Received by ${name}: dataMessage`);
        switch (dataMessage.EventType) {
            case 'Create_Account': {

                try {
                    logger.debug(`********* Create_Account ${JSON.stringify(dataMessage)}`);

                    logger.debug('I DO listen to this message ###### ', dataMessage.EventType);
                    let account = Account.Create({ UserId: dataMessage.UserId });
                    let bankId = await create(account.UserId).catch(
                        (error) => {
                            throw JSON.stringify(error);
                        },
                    );

                    account.assign(bankId);
                    await accountRepo.save(account);
                    DomainEvents.dispatchEventsForAggregate(account.id);
                    logger.debug(`********* Finished Create_Account ${JSON.stringify(accountRepo)}`);

                } catch (error: any) {
                    logger.error(error);
                    subscriber.nack(message);

                }

            }
                subscriber.ack(message);
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
                    await accountRepo.save(account);
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
                let account = await accountRepo.findOne({UserId : dataMessage.UserId });
                subscriber.ack(message);
                logger.debug(`Account_Created ${JSON.stringify(account)}`);
            }
                break;
            case 'Reward_Created': {
                subscriber.ack(message);

                /*let account = await accountRepo.findOne({UserId : dataMessage.UserId });
                logger.debug(JSON.stringify(account));

                let game = await accountRepo.findOne({UserId : dataMessage.GameId });
                logger.debug(JSON.stringify(game));
                if (account && game) {
                    // get Id
                    try {
                        logger.debug(JSON.stringify(dataMessage));

                        let bankId = await transfer(game.BankId, account.BankId, dataMessage.Amount);
                        subscriber.ack(message);
                    } catch (e) {
                        logger.error(e);

                        subscriber.nack(message);
                    }

                } else {
                    logger.error('account not found', dataMessage);
                    subscriber.nack(message, false, true);
                }*/
            }
                break;
            default:
                logger.debug('I dont listen to this message ***** ', dataMessage);
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
