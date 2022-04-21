import dbConfig from '@database/config';
import mongoose from 'mongoose';

const connectMongo = () => {
    console.log('connecting to mongodb...');

    const connect = mongoose.connect(dbConfig.url);

    const env = process.env.NODE_ENV || 'development';
    const debug = env === 'development';
    mongoose.set('debug', debug);

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', () => {
        console.log('connected to mongodb');
    });

    return connect;
};

export default connectMongo;
