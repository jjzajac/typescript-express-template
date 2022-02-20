import mongoose from 'mongoose';

export type ProductEntity = {
    title:String;
    img:String;
    price:Number;
    inOrder?:Boolean
}

const ProductSchema = new mongoose.Schema<ProductEntity>(
    {
        title: { type: String, required: true, unique: true },
        img: { type: String, required: true },
        price: { type: Number, required: true },
        inOrder: { type: Boolean, required: true, default: false },
    },
    { timestamps: true },
);

export const ProductDocumentName = 'Product';

export const ProductModel = mongoose.model(ProductDocumentName, ProductSchema);
