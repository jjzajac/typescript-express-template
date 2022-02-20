import M from 'mongoose';
import { OrderEntity, OrderModel } from './model';
import {
    error, notFound, ok, ResponseC,
} from '../utils/ResponseC';

export const FindOneOrder = async (id: string): Promise<ResponseC<OrderEntity, string>> => {
    try {
        const product = await OrderModel.findOne({ _id: id });
        if (product === null) {
            return notFound();
        }
        return ok(product);
    } catch (err: unknown) {
        if (err instanceof M.Error.CastError) {
            return notFound();
        }
        return error('unknown');
    }
};

export const ModifyOneOrder = async (id: string, v:OrderEntity): Promise<ResponseC<{}, string>> => {
    try {
        const updated = await OrderModel.updateOne({ _id: id }, v);
        if (updated.modifiedCount === 1) {
            return ok({});
        }
        return notFound();
    } catch (err: unknown) {
        if (err instanceof M.Error.CastError) {
            return notFound();
        }
        return error('unknown');
    }
};

export const DeleteOneOrder = async (id: string): Promise<ResponseC<{}, string>> => {
    try {
        const deleted = await OrderModel.deleteOne({ _id: id });
        if (deleted.deletedCount === 1) {
            return ok({});
        }
        return notFound();
    } catch (err: unknown) {
        if (err instanceof M.Error.CastError) {
            return notFound();
        }
        return error('unknown');
    }
};
