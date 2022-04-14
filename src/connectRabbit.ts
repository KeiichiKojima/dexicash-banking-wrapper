import rabbit from 'amqplib';
import { exit } from 'process';
import { messageConsumer } from '@rabbit/messageConsumer';

export let rabbitChannel: rabbit.Channel;

const connectRabbit = async () => {
    try {
        const connection = await rabbit.connect(process.env.RABBITMQ_URI);

        rabbitChannel = await connection.createChannel();

        const queue = process.env.RABBIT_QUEUE;

        await rabbitChannel.assertQueue(queue, { autoDelete: true });

        rabbitChannel.consume(queue, messageConsumer);

        console.log('Connected rabbit');
    } catch (e) {
        console.error('rabbit connection failed:', e);

        exit(1);
    }
};

export default connectRabbit;
