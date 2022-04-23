import mongoose from 'mongoose';
import { IDomainModel } from '../../domain/interfaces/IDomainModel';
import domainSchema from '../../database/domainSchema';

const ClaimModel = mongoose.model<IDomainModel>(
    'claim',
    domainSchema,
);

export default ClaimModel;
