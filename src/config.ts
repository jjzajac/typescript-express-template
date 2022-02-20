import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URL = process.env.MONGO_URL || 'mongodb://root:example@localhost:27017';
export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || '0.0.0.0';
export const JWT_SEC = process.env.JWT_SEC || 'testSecret';
