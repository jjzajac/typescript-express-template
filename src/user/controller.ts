import { Router, RequestHandler } from 'express';
import M from 'mongoose';
import {
    Role, UserCreateModel, UserEntity, UserModel,
} from './model';
import * as http from '../utils/http';
import { fold } from '../utils/ResponseC';
import { FindOneUser, DeleteOneUser, ModifyOneUser } from './service';
import { Sign } from '../auth/jwt';

type SigninT = RequestHandler<never, UserEntity, UserCreateModel, never>
const Signin:SigninT = async (req, res) => {
    const { body } = req; // TODO validate https://github.com/typestack/class-validator

    const newProduct = new UserModel({ role: Role.User, ...body });
    try {
        const savedProduct = await newProduct.save();
        http.created(res)(savedProduct);
    } catch (err) {
        http.internal(res)(err);
    }
};

type LoginT = RequestHandler<never, { token:string } | string, UserEntity, never>
const Login:LoginT = async (req, res) => {
    const { body } = req; // TODO validate https://github.com/typestack/class-validator
    // TODO make it simple
    try {
        const user = await UserModel.findOne({ name: body.name }).exec();
        if (user !== null && user.validatePass(body.password)) {
            const { _id: id, role } = user;
            http.ok(res)({ token: Sign({ id, isAdmin: role === Role.Admin }) });
        } else {
            http.notFound(res)('');
        }
    } catch (err: unknown) {
        if (err instanceof M.Error.CastError) {
            http.notFound(res)('');
        } else {
            http.internal(res)('unknown');
        }
    }
};

type GetT = RequestHandler<never, UserEntity[], never, { lastId?:String, page?:number, limit?:number }>
const Get:GetT = async (req, res) => {
    const { lastId, page = 0, limit = 2 } = req.query;
    try {
        const filter = lastId ? { _id: { $gt: lastId } } : {};
        const products = await UserModel.find(filter).skip(page * limit).sort('createdAt').limit(limit);
        http.ok(res)(products);
    } catch (err) {
        http.internal(res)(err);
    }
};

type GetByIdT = RequestHandler<{id: string;}, UserEntity, never, unknown>
const GetById:GetByIdT = async (req, res) => {
    const { id } = req.params;

    const respProduct = await FindOneUser(id);
    fold(respProduct)({
        onOk: (r) => { http.ok(res)(r); },
        onError: (err) => { http.internal(res)(err); },
        onNotFound: () => { http.notFound(res)(''); },
    });
};

type PutT = RequestHandler<{id: string;}, unknown, Partial<UserEntity>, unknown>
const Put:PutT = async (req, res) => {
    const { id } = req.params;
    const { body } = req; // TODO validate https://github.com/typestack/class-validator

    const updated = await ModifyOneUser(id, body);
    fold(updated)({
        onOk: () => { http.noContent(res)(); },
        onError: (err) => { http.internal(res)(err); },
        onNotFound: () => { http.notFound(res)(''); },
    });
};

type DeleteT = RequestHandler<{id: string;}, unknown, never, unknown>
const Delete:DeleteT = async (req, res) => {
    const { id } = req.params;

    const deleted = await DeleteOneUser(id);
    fold(deleted)({
        onOk: () => { http.noContent(res)(); },
        onError: (err) => { http.internal(res)(err); },
        onNotFound: () => { http.notFound(res)(''); },
    });
};

const userController = Router();
userController
    .post('/signin', Signin)
    .post('/login', Login)
    .get('/', Get)
    .put('/:id', Put) // TODO allow update password
    .delete('/:id', Delete)
    .get('/:id', GetById);

export default userController;
