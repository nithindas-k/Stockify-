import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    userId: mongoose.Types.ObjectId;
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
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, required: true, default: 10 },
    description: { type: String, default: '' },
}, {
    timestamps: true,
});

ProductSchema.index({ userId: 1, sku: 1 }, { unique: true });
ProductSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
