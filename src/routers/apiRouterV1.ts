import { rabbitChannel } from 'connectRabbit';
import { Router } from 'express';

const apiRouterV1 = Router();

apiRouterV1.get('/ping', (_, res) => {
    res.json({ message: 'pong' });
});

apiRouterV1.get('/hello', (_, res) => {
    const queue = process.env.RABBIT_QUEUE;

    rabbitChannel.sendToQueue(queue, Buffer.from('Hello!'));
    res.json({ message: 'success' });
});

export default apiRouterV1;
