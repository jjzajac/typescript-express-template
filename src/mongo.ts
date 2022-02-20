import { connect } from 'mongoose';
import { logger } from './logger';
import { MONGO_URL } from './config';

export const connectMongo = () => {
    connect(MONGO_URL)
        .then(() => logger.debug('DB Connection Successfull!'))
        .catch((err) => {
            logger.error(err);
        });
};
