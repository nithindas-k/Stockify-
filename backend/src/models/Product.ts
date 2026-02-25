import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    sku: string;
    category: string;
    quantity: number;
    price: number;
    lowStockThreshold: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, required: true, default: 10 },
    description: { type: String, default: '' },
}, {
    timestamps: true,
});

export default mongoose.model<IProduct>('Product', ProductSchema);
