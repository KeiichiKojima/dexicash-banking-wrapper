import mongoose from 'mongoose';
import { IDomainModel } from '../../domain/interfaces/IDomainModel';
import domainSchema from '../../database/domainSchema';

const AccountModel = mongoose.model<IDomainModel>(
    'account',
    domainSchema,
);

export default AccountModel;
