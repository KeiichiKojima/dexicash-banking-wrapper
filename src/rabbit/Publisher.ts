const { makePublisher } = require('amqp-simple-pub-sub')
const { RABBIT_MESSAGE_SERVER, exchange } = require('../constants')
const makeService = () => makePublisher({
    type: 'topic', // the default,
    url: RABBIT_MESSAGE_SERVER,
    exchange: exchange,
});

    const start = async () => {
        const service = makeService()
        await service.start()
        return service
    }

export { start }
