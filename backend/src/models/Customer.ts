import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    address: string;
    mobile: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
