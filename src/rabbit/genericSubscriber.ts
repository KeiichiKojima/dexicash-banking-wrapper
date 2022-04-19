const { makeSubscriber } = require('amqp-simple-pub-sub')
const { RABBIT_MESSAGE_SERVER, exchange } = require('../constants')
const genericSubscriber = (queueName:string, routingKeys:string[], makeHandler:Function) => {
    const makeService = () =>
        makeSubscriber({ type: 'topic', url: RABBIT_MESSAGE_SERVER, exchange, queueName, routingKeys })
    const start = async (name:string) => {
        const service = makeService()
        const handler = makeHandler(service, name)
        await service.start(handler)
        return service
    }
    return { start }
}
export { genericSubscriber }
