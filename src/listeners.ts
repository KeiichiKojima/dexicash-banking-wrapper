import { DomainEvents } from './core/domain/events/DomainEvents';
import { Order_Created } from './domain/Events/Order_Created';
import { Deposit_Created } from './domain/Events/Deposit_Created';
import { Order_Payment_Cancelled, Order_Payment_Completed } from './domain/Events/Order_Payment';
import { Reward_Created } from './domain/Events/Reward_Created';
import { AccountSubscriber } from './services/DexicashAccountService';
import { Account_Created } from './domain/Events/Account_Created';
import { Reward_Cancelled } from './domain/Events/Reward_Cancelled';
import { Reward_Completed } from './domain/Events/Reward_Completed';
import { DexiCash_Reward_Created } from './domain/Events/DexiCash_Reward_Created';
import { Item_Reward_Claimed } from './domain/Events/Item_Reward_Claimed';
const { OrderSubscriber }  = require('./services/DexicashOrderService')
const { DepositSubscriber }  = require('./services/DexicashDepositService')
const { RewardSubscriber }  = require('./services/DexicashRewardService')
const Publisher = require('./rabbit/Publisher')

const FIVE_SECONDS = 5000
const start = async () => {
    const domainPublisher = await Publisher.start()

/*    DomainEvents.register(async (x) => {
        await console.log(`************* domain event ${JSON.stringify(x)} ************ `);
    }, Order_Created.name);
    DomainEvents.register(async (x) => {
        await console.log(`************* domain event ${JSON.stringify(x)} ************ `);
    }, Deposit_Created.name);*/


    /*DomainEvents.register(async (x) => {
        await domainPublisher.publish('orders.order_created',
            JSON.stringify(x));
    }, Order_Created.name);*/
    DomainEvents.register(async (x) => {
        await domainPublisher.publish('deposit.order_created',
            JSON.stringify(x));
    }, Order_Created.name);
    DomainEvents.register(async (x) => {
        await domainPublisher.publish('deposit.deposit_created',
            JSON.stringify(x));
    }, Deposit_Created.name);

    DomainEvents.register(async (x) => {
        await domainPublisher.publish('deposit.order_cancelled',
            JSON.stringify(x));
    }, Order_Payment_Cancelled.name);

    DomainEvents.register(async (x) => {
        await domainPublisher.publish('deposit.order_completed',
            JSON.stringify(x));
    }, Order_Payment_Completed.name);

    DomainEvents.register(async (x) => {
        await domainPublisher.publish('reward.reward_created',
            JSON.stringify(x));
    }, Reward_Created.name);
    DomainEvents.register(async (x) => {
        await domainPublisher.publish('reward.reward_completed',
            JSON.stringify(x));
    }, Reward_Completed.name);
    DomainEvents.register(async (x) => {
        await domainPublisher.publish('reward.reward_cancelled',
            JSON.stringify(x));
    }, Reward_Cancelled.name);

    DomainEvents.register(async (x) => {
        await domainPublisher.publish('reward.dexicash_reward_created',
            JSON.stringify(x));
    }, DexiCash_Reward_Created.name);
    DomainEvents.register(async (x) => {
        await domainPublisher.publish('reward.item_reward_created',
            JSON.stringify(x));
    }, Item_Reward_Claimed.name);

    DomainEvents.register(async (x) => {
        await domainPublisher.publish('account.account_created',
            JSON.stringify(x));
    }, Account_Created.name);

    const listeners = await Promise.all([
        OrderSubscriber.start('OrderService'),
        DepositSubscriber.start('DepositService'),
        RewardSubscriber.start('RewardService'),
        AccountSubscriber.start('AccountService')
    ])
    return { domainPublisher, listeners }
}

let running = false

const run = async () => {
    const { domainPublisher, listeners } = await start()
    const stop = async () => {
        console.log('stopping listeners')
        await Promise.all(listeners.map(s => s.close()))

        console.log('stopping publisher')
        await domainPublisher.close()
    }
    const doShutdown = () => {
        // see https://en.wikipedia.org/wiki/POSIX_terminal_interface#Controlling_terminals_and_process_groups
        // SIGINT gets sent to all processes so check to see if we are running
        // before trying to shut down the connections.
        if (running) {
            running = false
            console.log('\nClosing down all microservices')
            stop()
                .then(() => {
                    process.exit(0)
                })
                .catch(err => {
                    console.error(err)
                    process.exit(1)
                })
        }
    }

    process.on('SIGINT', doShutdown)
    running = true
}
run()
    .then(() => {
        console.log('Services running.')
    })
    .catch(err => {
        console.error(err)
    })
