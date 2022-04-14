#!/usr/bin/env node

import { Order, Order_Status } from '../domain/DexiCash/Order';
import { Order_Created } from '../domain/Events/Order_Created';
import { DomainEvents } from '../core/domain/events/DomainEvents';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL
} = process.env;

const { logger } = require('../services/logger');
var amqp = require('amqplib/callback_api');
const {MessageHandler, NotImplementedProcessorImpl, GenericService_Processor, MessageQueueProcessorImpl} = require('../rabbit/MessageHandler');
const NAImpl = new NotImplementedProcessorImpl()

const rabbitImpl = new MessageQueueProcessorImpl(CHANNEL)
let processors:any = []
processors['orderService'] = new GenericService_Processor(rabbitImpl);


class DexiCash_Order_MessageHandler {
    processors:any = [];
    constructor(processors:any) {
        this.processors = processors
    }

    async Handle(message:any) {
        let result = ""
        result = await this.processors['orderService'].Process(message)
        return result
    }
}
const messageHandler = new DexiCash_Order_MessageHandler(processors);
DomainEvents.register( async (x)=> {
    await console.log(`************* domain event ${JSON.stringify(x)} ************ `)}, Order_Created.name);
DomainEvents.register( async (x)=> { await messageHandler.Handle({ message : { type : x.Type}}) }, Order_Created.name);

var order = Order.Create({ OrderId : '123', Status : Order_Status.Created})


console.log(order)


DomainEvents.dispatchEventsForAggregate(order.id);

amqp.connect(MESSAGE_SERVER, function (error0: any, connection: any) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1:any, channel:any) {
        if (error1) {
            throw error1;
        }

        var queue = CHANNEL;

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function (msg:any) {
            var message = JSON.parse(msg.content.toString())
            console.log(" [x] Received %s", message);
            messageHandler.Handle(message).then((r:any) =>
                logger.debug(r.message)
            )
        }, {
            noAck: true
        });
    });
});
