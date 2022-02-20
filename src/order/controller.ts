import {
    Router, RequestHandler,
} from 'express';
import { OrderEntity, OrderModel } from './model';
import * as http from '../utils/http';
import { fold } from '../utils/ResponseC';
import { FindOneOrder, DeleteOneOrder, ModifyOneOrder } from './service';

type PostT = RequestHandler<never, OrderEntity, OrderEntity, never>
const Post:PostT = async (req, res) => {
    const { body } = req; // TODO validate https://github.com/typestack/class-validator

    const newProduct = new OrderModel(body);
    try {
        const savedProduct = await newProduct.save();
        http.created(res)(savedProduct);
    } catch (err) {
        if ((err as any).code === 11000) {
            http.unprocessableEntity(res)({ wrong: (err as any).keyPattern });
        }
        http.internal(res)(err);
    }
};

type GetT = RequestHandler<never, OrderEntity[], never, {lastId?:String, page?:number, limit?:number}>
const Get:GetT = async (req, res) => {
    const { lastId, page = 0, limit = 2 } = req.query;
    try {
        const filter = lastId ? { _id: { $gt: lastId } } : {};
        const products = await OrderModel.find(filter).skip(page * limit).sort('createdAt').limit(limit);
        http.ok(res)(products);
    } catch (err) {
        http.internal(res)(err);
    }
};

type GetByIdT = RequestHandler<{id: string;}, OrderEntity, never, unknown>
const GetById:GetByIdT = async (req, res) => {
    const { id } = req.params;

    const respProduct = await FindOneOrder(id);
    fold(respProduct)({
        onOk: (r) => { http.ok(res)(r); },
        onError: (err) => { http.internal(res)(err); },
        onNotFound: () => { http.notFound(res)(''); },
    });
};

type GetSummaryT = RequestHandler<never, unknown, never, never>
const GetSummary:GetSummaryT = async (req, res) => {
    try {
        const respProduct = await OrderModel.aggregate([
            {
                $unwind: {
                    path: '$products',
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'products',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    products: { $push: '$products' },
                },
            },
        ]);
        http.created(res)(respProduct);
    } catch (err) {
        if ((err as any).code === 11000) {
            http.unprocessableEntity(res)({ wrong: (err as any).keyPattern });
        }
        http.internal(res)(err);
    }
};

type PutT = RequestHandler<{id: string;}, unknown, OrderEntity, unknown>
const Put:PutT = async (req, res) => {
    const { id } = req.params;
    const { body } = req; // TODO validate https://github.com/typestack/class-validator

    const updated = await ModifyOneOrder(id, body);
    fold(updated)({
        onOk: () => { http.noContent(res)(); },
        onError: (err) => { http.internal(res)(err); },
        onNotFound: () => { http.notFound(res)(''); },
    });
};

type DeleteT = RequestHandler<{id: string;}, unknown, never, unknown>
const Delete:DeleteT = async (req, res) => {
    const { id } = req.params;

    const deleted = await DeleteOneOrder(id);
    fold(deleted)({
        onOk: () => { http.noContent(res)(); },
        onError: (err) => { http.internal(res)(err); },
        onNotFound: () => { http.notFound(res)(''); },
    });
};

const orderController = Router();
orderController
    .post('/', Post)
    .get('/', Get)
    .get('/summary', GetSummary)
    .put('/:id', Put)
    .delete('/:id', Delete)
    .get('/:id', GetById);

export default orderController;
