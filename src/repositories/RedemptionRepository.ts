import { BaseRepository } from './BaseRepository';
import { Redemption, IDexiCash_Redemption } from '../domain/DexiCash/Redemption';
import { IReadObject } from './interfaces/IRead';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';

export class RedemptionRepository extends BaseRepository<IDexiCash_Redemption, Redemption> implements IReadObject<Redemption> {
    async findOne(filter: Partial<IDexiCash_Redemption>): Promise<Redemption | null> {
        const findOneRes = await this._findOne(filter);

        if (!findOneRes) {
            return null;
        }

        let id = JSON.parse(JSON.stringify(findOneRes))._id.value;
        return Redemption.Create(findOneRes.props,  new UniqueEntityID(id));
    }

    async find(filter: Partial<Redemption>): Promise<Redemption[]> {
        const findAllRes = await this._find(filter);

        return findAllRes.map(doc => Redemption.Create(doc.props, doc.id));
    }
}
