const { makeSubscriber } = require('amqp-simple-pub-sub')
const { exchange } = require('../constants')
const genericSubscriber = (queueName:string, routingKeys:string[], makeHandler:Function) => {
    const makeService = () =>
        makeSubscriber({ type: 'topic', exchange, queueName, routingKeys })
    const start = async (name:string) => {
        const service = makeService()
        const handler = makeHandler(service, name)
        await service.start(handler)
        return service
    }
    return { start }
}
export { genericSubscriber }
