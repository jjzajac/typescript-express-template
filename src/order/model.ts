import M from 'mongoose';
import { ProductDocumentName } from '../product/model';
import { UserDocumentName } from '../user/model';

type ProductOrder = {
    productId: M.Types.ObjectId;
};

export type OrderEntity = {
    userId: M.Types.ObjectId;
    products: ProductOrder[]
}

const OrderSchema = new M.Schema<OrderEntity>(
    {
        userId: { type: 'ObjectId', ref: UserDocumentName, unique: true },
        products: [{
            productId: { type: 'ObjectId', ref: ProductDocumentName },
        }],
    },
    { timestamps: true },
);

export const OrderDocumentName = 'Order';
export const OrderModel = M.model(OrderDocumentName, OrderSchema);
