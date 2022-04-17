const exchange: string = 'topic_orders';
const ORDER_routingKey: string[] = ['orders.#'];
const DEPOSIT_routingKey: string[] = ['deposit.#'];
const REWARD_routingKey: string[] = ['reward.#'];
const DEPOSITS_QUEUE: string = 'DEPOSIT';
const ORDER_QUEUE: string = 'ORDER';
const REWARD_QUEUE: string = 'REWARD';

export {
    exchange,
    ORDER_routingKey, DEPOSIT_routingKey, REWARD_routingKey,
    DEPOSITS_QUEUE,
    ORDER_QUEUE,
    REWARD_QUEUE,
};
