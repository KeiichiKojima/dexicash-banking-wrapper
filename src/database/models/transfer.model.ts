import mongoose from 'mongoose';

export interface ITransfer extends mongoose.Document {
    dexiId: string;
    gameId: string;
    date: Date;
    status: 'created' | 'completed';
}

const transferSchema = new mongoose.Schema<
    ITransfer,
    mongoose.Model<ITransfer>
>({
    dexiId: {
        type: String,
        required: true,
    },
    gameId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['created', 'completed'],
        default: 'created',
        required: true,
    },
});

transferSchema.virtual('id').get(function () {
    return this._id;
});

transferSchema.set('toJSON', {
    virtuals: true,
});

transferSchema.set('toObject', {
    virtuals: true,
});

const Transfer = mongoose.model<ITransfer>('Transfer', transferSchema);

export default Transfer;
