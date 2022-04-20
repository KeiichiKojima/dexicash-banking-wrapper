import { RewardRepository } from './repositories/RewardRepository';
import { AccountRepository } from './repositories/AccountRepository';
import { DepositRepository } from './repositories/DepositRepository';
import { OrderRepository } from './repositories/OrderRepository';

const rewardRepository:RewardRepository = new RewardRepository();

const accountRepository:AccountRepository = new AccountRepository();

const depositRepository:DepositRepository = new DepositRepository();

const ordersRepository:OrderRepository = new OrderRepository()
export {
    rewardRepository, accountRepository, depositRepository, ordersRepository
};
