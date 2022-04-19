const exchange: string = 'topic_orders';
const ORDER_routingKey: string[] = ['orders.#'];
const DEPOSIT_routingKey: string[] = ['deposit.#'];
const REWARD_routingKey: string[] = ['reward.#'];
const ACCOUNT_routingKey: string[] = ['account.#'];
const DEPOSITS_QUEUE: string = 'DEPOSIT';
const ORDER_QUEUE: string = 'ORDER';
const REWARD_QUEUE: string = 'REWARD';
const ACCOUNT_QUEUE: string = 'ACCOUNT';
export {
    exchange,
    ORDER_routingKey, DEPOSIT_routingKey, REWARD_routingKey,ACCOUNT_routingKey,
    DEPOSITS_QUEUE,
    ORDER_QUEUE,
    REWARD_QUEUE,ACCOUNT_QUEUE
};
