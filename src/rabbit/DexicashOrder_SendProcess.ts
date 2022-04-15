#!/usr/bin/env node

import { Order_Payment_Completed } from '../domain/Events/Order_Payment';

const { logger } = require('../services/logger');

const { makePublisher } = require('amqp-simple-pub-sub')
import { Order, Order_Status } from '../domain/DexiCash/Order';
import { Order_Created } from '../domain/Events/Order_Created';
import { DomainEvents } from '../core/domain/events/DomainEvents';

require('dotenv').config();
const {
    RABBIT_MESSAGE_SERVER: MESSAGE_SERVER,
    RABBIT_CHANNEL: CHANNEL
} = process.env;


const publisher = makePublisher({
    type: 'topic', // the default
    exchange: 'topic_orders' })

DomainEvents.register( async (x)=> {
    ; await publisher.publish(x.key[0], JSON.stringify(x)); }, Order_Created.name);
(async () => {
    await publisher.start()
    await publisher.publish('orders.command.create_order', JSON.stringify({EventType:'Create_Order', OrderId: '123'}))
    await publisher.publish('orders.order_payment_completed', JSON.stringify({EventType:'Order_Payment_Completed', OrderId: '123'}))


    await publisher.publish('orders.command.create_order', JSON.stringify({EventType:'Create_Order', OrderId: '222'}))
    await publisher.publish('orders.order_payment_cancelled', JSON.stringify({EventType:'Order_Payment_Cancelled', OrderId: '222', Reason:'Lack of funds'}))



})().then(()=>{
    //var order = Order.Create({ OrderId : '123', Status : Order_Status.Created})
    //DomainEvents.dispatchEventsForAggregate(order.id);

})




