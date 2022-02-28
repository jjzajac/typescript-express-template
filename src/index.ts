import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { logger } from './logger';
import { HOST, PORT } from './config';
import productController from './product/controller';
import orderController from './order/controller';
import { connectMongo } from './mongo';
import userController from './user/controller';

const app = express();

connectMongo();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(morgan('combined', {
    stream: {
        write: (msg) => logger.http(msg),
    },
}));

app.use('/product', productController);
app.use('/order', orderController);
app.use('/user', userController);

app.listen(PORT, () => {
    logger.debug(`App listening on port http://${HOST}:${PORT}`);
});

// type R = (req:Request, res:Response)=>Promise<void>;

// const catchError = (t:R) => async (req:Request, res:Response, next:NextFunction) => {
//     t(req, res).catch((err) => { next(err); });
// };

// const errorLogger = (err:any, req:any, res:any, next:any) => {
//     logger.error(err);
//     next(err);
// };

// const errorResponder = (err:Error, req:any, res:any) => {
//     res.status(500).send(JSON.stringify(err.name, null, 4)); // pretty print
// };
// const invalidPathHandler = (req:any, res:any) => {
//     res.redirect('/error');
// };
