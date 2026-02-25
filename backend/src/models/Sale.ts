import mongoose, { Document, Schema } from 'mongoose';

export interface ISale extends Document {
    customerName: string; 
    customerId?: mongoose.Types.ObjectId; 
    userId?: mongoose.Types.ObjectId; 
    items: {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceAtSale: number;
    }[];
    totalAmount: number;
    saleDate: Date;
    paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Other';
    createdAt: Date;
    updatedAt: Date;
}

const SaleSchema: Schema = new Schema(
    {
        customerName: { type: String, required: true },
        customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, min: 1 },
                priceAtSale: { type: Number, required: true, min: 0 }
            }
        ],
        totalAmount: { type: Number, required: true, min: 0 },
        saleDate: { type: Date, default: Date.now },
        paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI', 'Other'], default: 'Cash' }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ISale>('Sale', SaleSchema);
