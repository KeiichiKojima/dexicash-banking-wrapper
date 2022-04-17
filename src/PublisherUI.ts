#!/usr/bin/env node

import { Order_Payment_Completed } from './domain/Events/Order_Payment';

const { logger } = require('./services/logger');

const { makePublisher } = require('amqp-simple-pub-sub');
import { Order, Order_Status } from './domain/DexiCash/Order';
import { Order_Created } from './domain/Events/Order_Created';
import { DomainEvents } from './core/domain/events/DomainEvents';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
} = process.env;


const publisher = makePublisher({
    type: 'topic', // the default
    exchange: 'topic_orders',
});

DomainEvents.register(async (x) => {
    ;await publisher.publish(x.key[0], JSON.stringify(x));
}, Order_Created.name);
let orderNumber = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

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
        console.log(`You pressed the "${str}" key`);
        console.log();
        console.log(key);
        console.log();

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
                    let rewardId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                    event = JSON.stringify({
                        EventType: 'Create_Reward',
                        RewardId: rewardId,
                        GameId: 'DexiKnights',
                        UserId: orderNumber,
                        Amount: 500,
                    });
                    await publisher.publish('reward.command.create_reward', event);
                }
                    break;
                default:
                    break;
            }


            console.log(event);
            await new Promise(r => setTimeout(r, 2000));


        })();
    }
});
console.log('Press any key...');



