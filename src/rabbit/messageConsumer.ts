import rabbit from 'amqplib';

export const messageConsumer = (msg: rabbit.ConsumeMessage) => {
    console.log(msg.content.toString());
};
