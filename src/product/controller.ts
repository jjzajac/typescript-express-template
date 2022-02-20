/* eslint-disable max-classes-per-file */
import {
    Router, RequestHandler,
} from 'express';
import { ProductEntity, ProductModel } from './model';
import * as http from '../utils/http';
import { fold } from '../utils/ResponseC';
import { FindOneProduct, DeleteOneProduct, ModifyOneProduct } from './service';
import { verifyToken, verifyTokenAndAdmin } from '../auth/jwt';

type PostT = RequestHandler<never, ProductEntity, ProductEntity, never>
const Post:PostT = async (req, res) => {
    const { body } = req; // TODO validate https://github.com/typestack/class-validator

    const newProduct = new ProductModel(body);
    try {
        const savedProduct = await newProduct.save();
        http.created(res)(savedProduct);
    } catch (err) {
        http.internal(res)(err);
    }
};

type GetT = RequestHandler<never, ProductEntity[], never, {lastId?:String, page?:number, limit?:number}>
const Get:GetT = async (req, res) => {
    const { lastId, page = 0, limit = 2 } = req.query;
    try {
        const filter = lastId ? { _id: { $gt: lastId } } : {};
        const products = await ProductModel.find(filter).skip(page * limit).sort('createdAt').limit(limit);
        http.ok(res)(products);
    } catch (err) {
        http.internal(res)(err);
    }
};

type GetByIdT = RequestHandler<{id: string;}, ProductEntity, never, unknown>
const GetById:GetByIdT = async (req, res) => {
    const { id } = req.params;

    const respProduct = await FindOneProduct(id);
    fold(respProduct)({
        onOk: (r) => { http.ok(res)(r); },
        onError: (err) => { http.internal(res)(err); },
        onNotFound: () => { http.notFound(res)(''); },
    });
};

type PutT = RequestHandler<{id: string;}, unknown, ProductEntity, unknown>
const Put:PutT = async (req, res) => {
    const { id } = req.params;
    const { body } = req; // TODO validate https://github.com/typestack/class-validator

    const updated = await ModifyOneProduct(id, body);
    fold(updated)({
        onOk: () => { http.noContent(res)(); },
        onError: (err) => { http.internal(res)(err); },
        onNotFound: () => { http.notFound(res)(''); },
    });
};

type DeleteT = RequestHandler<{id: string;}, unknown, never, unknown>
const Delete:DeleteT = async (req, res) => {
    const { id } = req.params;

    const deleted = await DeleteOneProduct(id);
    fold(deleted)({
        onOk: () => { http.noContent(res)(); },
        onError: (err) => { http.internal(res)(err); },
        onNotFound: () => { http.notFound(res)(''); },
    });
};

const productController = Router();
productController
    .post('/', Post)
    .get('/', Get)
    .put('/:id', Put)
    .delete('/:id', Delete)
    .get('/:id', GetById);

export default productController;
