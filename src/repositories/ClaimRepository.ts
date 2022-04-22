import { BaseRepository } from './BaseRepository';
import { Claim, IDexiCash_Claim } from '../domain/DexiCash/Claim';
import { IReadObject } from './interfaces/IRead';

export class ClaimRepository extends BaseRepository<IDexiCash_Claim, Claim> implements IReadObject<IDexiCash_Claim, Claim> {
    async findOne(filter: Partial<IDexiCash_Claim>): Promise<Claim | null> {
        const findOneRes = await this._findOne(filter);

        if (!findOneRes) {
            return null;
        }

        return Claim.Create(findOneRes.props, findOneRes.id);
    }

    async find(filter: Partial<Claim>): Promise<Claim[]> {
        const findAllRes = await this._find(filter);

        return findAllRes.map(doc => Claim.Create(doc.props, doc.id));
    }
}
