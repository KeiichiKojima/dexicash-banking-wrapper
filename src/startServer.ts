import express from 'express';
import routers from './routers';

const startServer = () => {
    console.log('starting server...');

    const port = process.env.SERVER_PORT || 8080;

    const app = express();

    app.get('/', (_, res) => {
        res.status(200).send('Dexicash Banking Wrapper');
    });

    app.use('/api', routers);

    app.listen(port, () => console.log(`Running on port ${port}`));
};

export default startServer;
