import { BaseRepository } from './BaseRepository';
import { Deposit, IDexiCash_Deposit } from '../domain/DexiCash/Deposit';

export class DepositRepository extends BaseRepository<IDexiCash_Deposit, Deposit> { }