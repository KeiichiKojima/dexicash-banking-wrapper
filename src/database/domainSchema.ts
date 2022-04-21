import mongoose from 'mongoose';
import { IDomainModel } from '../domain/interfaces/IDomainModel';

const domainSchema = new mongoose.Schema<
    IDomainModel
>({
    entityId: {
        type: String,
        required: true,
    },
    objectJson: {
        type: Object,
        required: true
    }
});

domainSchema.virtual('id').get(function () {
    return this._id;
});

domainSchema.index({ entityId: 1 }, { unique: true });

domainSchema.set('toJSON', {
    virtuals: true,
});

domainSchema.set('toObject', {
    virtuals: true,
});

export default domainSchema;