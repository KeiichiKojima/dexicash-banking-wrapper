import { BaseRepository } from './BaseRepository';
import { Redemption, IDexiCash_Redemption } from '../domain/DexiCash/Redemption';
import { IReadObject } from './interfaces/IRead';

export class RedemptionRepository extends BaseRepository<IDexiCash_Redemption, Redemption> implements IReadObject<IDexiCash_Redemption, Redemption> {
    async findOne(filter: Partial<IDexiCash_Redemption>): Promise<Redemption | null> {
        const findOneRes = await this._findOne(filter);

        if (!findOneRes) {
            return null;
        }

        return Redemption.Create(findOneRes.props, findOneRes.id);
    }

    async find(filter: Partial<Redemption>): Promise<Redemption[]> {
        const findAllRes = await this._find(filter);

        return findAllRes.map(doc => Redemption.Create(doc.props, doc.id));
    }
}
