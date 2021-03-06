#!/usr/bin/env node

import { Order_Payment_Completed } from './domain/Events/Order_Payment';

const { logger } = require('./services/logger');
const { RABBIT_MESSAGE_SERVER, exchange } = require('./constants');

const { makePublisher } = require('amqp-simple-pub-sub');
import { Order, Order_Status } from './domain/DexiCash/Order';
import { Order_Created } from './domain/Events/Order_Created';
import { DomainEvents } from './core/domain/events/DomainEvents';
import { Account_Created } from './domain/Events/Account_Created';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const publisher = makePublisher({
    type: 'topic', // the default
    url: RABBIT_MESSAGE_SERVER,
    exchange: exchange,
});

DomainEvents.register(async (x) => {
    ;await publisher.publish(x.key[0], JSON.stringify(x));
}, Order_Created.name);
let orderNumber = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
let rewardId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
let dexiId = 'Michael';
(async () => {
    await publisher.start();

    /*await publisher.publish('orders.order_payment_completed', JSON.stringify({EventType:'Order_Payment_Completed', OrderId: '333'}))


    await publisher.publish('orders.command.create_order', JSON.stringify({EventType:'Create_Order', OrderId: '444'}))
    await publisher.publish('orders.order_payment_cancelled', JSON.stringify({EventType:'Order_Payment_Cancelled', OrderId: '444', Reason:'Lack of funds'}))
*/


})();
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else {
        logger.debug(`You pressed the "${str}" key`);
        logger.debug();
        logger.debug(key);
        logger.debug();

        let event;
        (async () => {
            switch (key.name) {
                case 'n': {
                    orderNumber = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                    event = JSON.stringify({
                        EventType: 'Create_Order',
                        OrderId: orderNumber,
                    });
                    await publisher.publish('orders.command.create_order', event);
                }
                    break;
                case 'c': {
                    event = JSON.stringify({
                        EventType: 'Order_Payment_Cancelled',
                        OrderId: orderNumber,
                        Reason: 'Lack of funds',
                    });
                    await publisher.publish('orders.order_payment_cancelled', event);
                }
                    break;
                case 'p': {
                    event = JSON.stringify({
                        EventType: 'Order_Payment_Completed',
                        OrderId: orderNumber,
                    });
                    await publisher.publish('orders.order_payment_completed', event);
                }
                    break;

                case 'r': {
                    let games = [{ GameId: '6238849ffffcdebf2f62e1f6' }];
                    games.map(async (gameId) => {
                        event = JSON.stringify({
                            EventType: 'Create_Game_Account',
                            UserId: gameId.GameId,
                        });
                        await publisher.publish('account.command.create_account', event);
                        await sleep(1000);
                    });

                    dexiId = '625ccf96c48a4b5765cad816';
                    event = JSON.stringify({
                        EventType: 'Create_Account',
                        UserId: dexiId,
                    });
                    await publisher.publish('account.command.create_account', event);

                    await sleep(1000);
                    rewardId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                    event = JSON.stringify({
                        EventType: 'Create_Reward',
                        RewardId: rewardId,
                        GameId: '6238849ffffcdebf2f62e1f6',
                        UserId: dexiId,
                        Amount: 500,
                    });
                    await publisher.publish('reward.command.create_reward', event);
                    await sleep(1000);
                    event = JSON.stringify({
                        EventType: 'Make_Claim',
                        RewardId: rewardId,
                        Amount: 500,
                    });
                    await publisher.publish('reward.command.make_claim', event);
                }
                    break;
                case 's': {

                    let games = [{ GameId: '6238849ffffcdebf2f62e1f6' }];
                    games.map(async (gameId) => {
                        event = JSON.stringify({
                            EventType: 'Create_Game_Account',
                            UserId: gameId.GameId,
                        });
                        await publisher.publish('account.command.create_account', event);
                    });
                }
                    break;
                case 'u': {
                    dexiId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                    event = JSON.stringify({
                        EventType: 'Create_Account',
                        UserId: dexiId,
                    });
                    await publisher.publish('account.command.create_account', event);
                }
                    break;
                default:
                    break;
            }


            logger.debug(event);
            await new Promise(r => setTimeout(r, 2000));


        })();
    }
});
logger.debug('Press any key...');



