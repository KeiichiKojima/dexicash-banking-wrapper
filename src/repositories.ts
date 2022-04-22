import { RewardRepository } from './repositories/RewardRepository';
import { AccountRepository } from './repositories/AccountRepository';
import { DepositRepository } from './repositories/DepositRepository';
import { OrderRepository } from './repositories/OrderRepository';
import { InMemoryContext } from './repositories/InMemoryContext';

const rewardRepository:RewardRepository = new RewardRepository(new InMemoryContext());

const accountRepository:AccountRepository = new AccountRepository(new InMemoryContext());

const depositRepository:DepositRepository = new DepositRepository(new InMemoryContext());

const ordersRepository:OrderRepository = new OrderRepository(new InMemoryContext());
export {
    rewardRepository, accountRepository, depositRepository, ordersRepository
};
