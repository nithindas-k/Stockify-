import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'LOW_STOCK' | 'SYSTEM';
    productId?: mongoose.Types.ObjectId;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['LOW_STOCK', 'SYSTEM'], default: 'LOW_STOCK' },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
}, {
    timestamps: true,
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
