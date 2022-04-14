import mongoose from 'mongoose';

export interface IDexiAccount extends mongoose.Document {
    dexiId: string;
    accountId: string;
}

const dexiAccountSchema = new mongoose.Schema<
    IDexiAccount,
    mongoose.Model<IDexiAccount>
>({
    dexiId: {
        type: String,
        required: true,
    },
    accountId: {
        type: String,
        required: true,
    },
});

dexiAccountSchema.virtual('id').get(function () {
    return this._id;
});

dexiAccountSchema.index({ dexiId: 1 }, { unique: true });

dexiAccountSchema.set('toJSON', {
    virtuals: true,
});

dexiAccountSchema.set('toObject', {
    virtuals: true,
});

const DexiAccount = mongoose.model<IDexiAccount>(
    'DexiAccount',
    dexiAccountSchema,
);

export default DexiAccount;
