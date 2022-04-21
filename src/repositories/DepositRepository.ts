import { BaseRepository } from './BaseRepository';
import { Deposit, IDexiCash_Deposit } from '../domain/DexiCash/Deposit';
import { IReadObject } from './interfaces/IRead';
import DepositModel from '../database/models/deposit.model';

export class DepositRepository extends BaseRepository<IDexiCash_Deposit, Deposit> implements IReadObject<Deposit> {
    constructor() {
        super(DepositModel);
    }

    async findOne(filter: Partial<IDexiCash_Deposit>): Promise<Deposit | null> {
        const findOneRes = await this._findOne(filter);

        if (!findOneRes) {
            return null;
        }

        return Deposit.Create(findOneRes.props, findOneRes.id);
    }

    async find(filter: Partial<Deposit>): Promise<Deposit[]> {
        const findAllRes = await this._find(filter);

        return findAllRes.map(doc => Deposit.Create(doc.props, doc.id));
    }
}
