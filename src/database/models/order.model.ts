import mongoose from 'mongoose';
import { IDexiCash_Order, Order_Status } from '@domain/DexiCash/Order';

const orderSchema = new mongoose.Schema<
    IDexiCash_Order,
    mongoose.Model<IDexiCash_Order>
>({
    OrderId: {
        type: String,
        required: true
    },
    Status: {
        type: Number,
        default: Order_Status.Created
    },
    StatusReason: {
        type: String
    }
});

orderSchema.virtual('id').get(function () {
    return this._id;
});

orderSchema.index({ OrderId: 1 }, { unique: true });

orderSchema.set('toJSON', {
    virtuals: true,
});

orderSchema.set('toObject', {
    virtuals: true,
});

const OrderModel = mongoose.model<IDexiCash_Order>(
    'Order',
    orderSchema,
);

export default OrderModel;
