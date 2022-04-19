import { BaseRepository } from './BaseRepository';
import { Reward, IDexiCash_Reward } from '../domain/DexiCash/Reward';
import { IReadObject } from './interfaces/IRead';

export class RewardRepository extends BaseRepository<IDexiCash_Reward, Reward> implements IReadObject<Reward> {
    async findOne(filter: Partial<IDexiCash_Reward>): Promise<Reward | null> {
        const findOneRes = await this._findOne(filter);

        if (!findOneRes) {
            return null;
        }

        return Reward.Create(findOneRes.props, findOneRes.id);
    }

    async find(filter: Partial<Reward>): Promise<Reward[]> {
        const findAllRes = await this._find(filter);

        return findAllRes.map(doc => Reward.Create(doc.props, doc.id));
    }
}