import M from 'mongoose';
import { ProductEntity, ProductModel } from './model';
import {
    error, notFound, ok, ResponseC,
} from '../utils/ResponseC';

export const FindOneProduct = async (id: string): Promise<ResponseC<ProductEntity, string>> => {
    try {
        const product = await ProductModel.findOne({ _id: id });
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

export const ModifyOneProduct = async (id: string, v:ProductEntity): Promise<ResponseC<{}, string>> => {
    try {
        const updated = await ProductModel.updateOne({ _id: id }, v);
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

export const DeleteOneProduct = async (id: string): Promise<ResponseC<{}, string>> => {
    try {
        const deleted = await ProductModel.deleteOne({ _id: id });
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
