import { User } from '../domain/DexiCash/User';

const { makePublisher } = require('amqp-simple-pub-sub');
import { Order, Order_Status } from '../domain/DexiCash/Order';
import { Order_Created } from '../domain/Events/Order_Created';
import { DomainEvents } from '../core/domain/events/DomainEvents';
import { Deposit } from '../domain/DexiCash/Deposit';

var axios = require('axios');
require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;

const { logger } = require('../services/logger');
let games = [ {GameId: '6238849ffffcdebf2f62e1f6', BankId: 'd66d1c20-e58b-4c5e-bc57-5aedaa1da26c'}]
let users: any = [ ];

const createAccount = async (UserId:string) => {
    var data = JSON.stringify({
        "name": UserId,
        "cpf": UserId,
        "balance": 1
    });

    var config = {
        method: 'post', url: 'http://localhost:3001/v1/accounts',
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    };

    console.log(data)

    return axios(config)
    .then( async function(response:any) {
        logger.debug(JSON.stringify(response.data));

        let json =  response.data
        logger.debug(json.id);
        return json.id;
    })
        .catch(function(error:any) {
            logger.error(error);
            throw error;
        });
};


const createTransfer = async (GameId:string,UserId:string,Amount:number) => {
    var data = {
        "account_origin_id": GameId,
        "account_destination_id": UserId,
        "amount": Amount
    };

    var config = {
        method: 'post', url: 'http://localhost:3001/v1/transfers',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
    };

    console.log(config)
    return axios(config)
        .then( async function(response:any) {
            logger.debug(JSON.stringify(response.data));

            let json =  response.data
            logger.debug(json.id);
            return json.id;
        })
        .catch(function(error:any) {
            logger.error(error);
            throw error;
        });
};
const makeHandler = (subscriber: any, name: string) => async (message: any) => {
    try {
        let dataMessage = JSON.parse(Buffer.from(message.content).toString());

        logger.info('Message Received', dataMessage);
        switch (dataMessage.EventType) {
            case 'Create_User': {
                logger.debug('I DO listen to this message ###### ', dataMessage.EventType);
                let user = User.Create({ UserId: dataMessage.UserId });
                users.push(user);
                DomainEvents.dispatchEventsForAggregate(user.id);
                logger.debug(users.length);
            }
                subscriber.ack(message);
                break;
            case 'User_Created': {
                let user = users.find((x: any) => x.UserId === dataMessage.UserId);
                if (user) {
                    // get Id
                    try{
                        let bankId = await createAccount(user.UserId)
                        user.assign(bankId);
                        logger.debug(JSON.stringify(user));
                        subscriber.ack(message);
                    }
                    catch (e){
                        logger.error(e);

                        subscriber.nack(message);
                    }

                } else {
                    logger.error('user not found', dataMessage);
                    subscriber.nack(message, false, true);
                }
            }
                break;
            case 'Reward_Created': {
                let user = users.find((x: any) => x.UserId === dataMessage.UserId);

                let game = games.find((x: any) => x.GameId === dataMessage.GameId);
                if (user) {
                    // get Id
                    try{
                        logger.debug(JSON.stringify(dataMessage));

                        let bankId = await createTransfer(game.BankId, user.BankId, dataMessage.Amount)
                        logger.debug(JSON.stringify(bankId));
                        subscriber.ack(message);
                    }
                    catch (e){
                        logger.error(e);

                        subscriber.nack(message);
                    }

                } else {
                    logger.error('user not found', dataMessage);
                    subscriber.nack(message, false, true);
                }
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
};


const { USER_QUEUE: queueName, USER_routingKey: routingKey } = require('../constants');
const { genericSubscriber } = require('../rabbit/genericSubscriber');
const UserSubscriber = genericSubscriber(queueName, routingKey, makeHandler);
export { UserSubscriber };
