import { Connection } from 'amqplib';

const logger = require('../services/logger');
const amqp = require("amqplib/callback_api");
require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL,
    DEXI_SUPPORTED_MESSAGES: SUPPORTED_MESSAGES
} = process.env;


const RabbitServer = MESSAGE_SERVER

class MessageQueueProcessorImpl {
    public exchange:string;

    constructor(exchange:any) {
        this.exchange = exchange;
    }
    send(message:any) {
        amqp.connect(RabbitServer, function (error0:any, connection:any) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1:any, channel:any) {
                if (error1) {
                    throw error1;
                }

                var queue = CHANNEL;
                var msg = message;

                channel.assertQueue(queue, {
                    durable: false
                });
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));

                console.log(" [x] Sent %s", msg);

            });
        });
    }
    publish(message:any) {

        let exchange = this.exchange;
        amqp.connect(RabbitServer, function (error0:any, connection:any) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1:any, channel:any) {
                if (error1) {
                    throw error1;
                }
                message = message.message
                var key = (message.key.length > 0) ? message.key[0] : 'anonymous.info';
                var msg = JSON.stringify(message)

                channel.assertExchange(exchange, 'topic', {
                    durable: false
                });
                channel.publish(exchange, key, Buffer.from(msg));

                console.log(" [x] Sent %s:'%s'", key, msg);

            });
        });
    }

    Process(message:any) {
        return this.publish(message)
    }
}

class NotImplementedProcessorImpl {
    Process(message:any) {
        console.info(message)
        return "not_supported_right_now"
    }
}

class GenericService_Processor {
    service:any

    constructor(doerService:any) {
        this.service = doerService;
    }

    async Process(message:any) {
        try {
            return {status: 'completed', payload: await this.service.Process(message)}
        } catch (err) {
            logger.error('error')
            return {status: 'error', error: err}
        }
    }
}


export {MessageQueueProcessorImpl, NotImplementedProcessorImpl, GenericService_Processor}
