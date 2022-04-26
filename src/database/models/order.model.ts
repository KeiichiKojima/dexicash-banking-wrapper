import mongoose from 'mongoose';
import { IDomainModel } from '../../domain/interfaces/IDomainModel';
import domainSchema from '../../database/domainSchema';

const OrderModel = mongoose.model<IDomainModel>(
    'order',
    domainSchema,
);

export default OrderModel;
