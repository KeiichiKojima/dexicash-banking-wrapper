import 'dotenv/config';

import connectMongo from './connectMongo';
import startServer from './startServer';

const execute = async () => {
    await connectMongo();

    startServer();
};

execute();
