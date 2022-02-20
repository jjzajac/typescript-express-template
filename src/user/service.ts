import M from 'mongoose';
import { UserEntity, UserModel } from './model';
import {
    error, notFound, ok, ResponseC,
} from '../utils/ResponseC';

export const FindOneUser = async (id: string): Promise<ResponseC<UserEntity, string>> => {
    try {
        const product = await UserModel.findOne({ _id: id });
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

export const ModifyOneUser = async (id: string, v:Partial<UserEntity>): Promise<ResponseC<{}, string>> => {
    try {
        const updated = await UserModel.updateOne({ _id: id }, v, { upsert: true });
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

export const DeleteOneUser = async (id: string): Promise<ResponseC<{}, string>> => {
    try {
        const deleted = await UserModel.deleteOne({ _id: id });
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
