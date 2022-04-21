import mongoose from 'mongoose';
import { IDomainModel } from '../../domain/interfaces/IDomainModel';
import domainSchema from '../domainSchema';

const RewardModel = mongoose.model<IDomainModel>(
    'reward',
    domainSchema,
);

export default RewardModel;
