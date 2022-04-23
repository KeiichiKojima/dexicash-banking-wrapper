import mongoose from 'mongoose';
import { IDomainModel } from '../../domain/interfaces/IDomainModel';
import domainSchema from '../../database/domainSchema';

const DepositModel = mongoose.model<IDomainModel>(
    'deposit',
    domainSchema,
);

export default DepositModel;
