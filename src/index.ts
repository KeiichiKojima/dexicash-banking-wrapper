import 'dotenv/config';

import connectMongo from './connectMongo';
import startServer from './startServer';
import connectRabbit from './connectRabbit';

const execute = async () => {
    await connectMongo();

    await connectRabbit();

    startServer();
};

execute();
