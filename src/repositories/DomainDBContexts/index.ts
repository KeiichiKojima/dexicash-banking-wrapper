import { DBContext } from '../DBContext';
import { AggregateRoot } from '../../core/domain/AggregateRoot';
import OrderModel from '../../database/models/order.model';
import AccountModel from '../../database/models/account.model';
import DepositModel from '../../database/models/deposit.model';
import RewardModel from '../../database/models/reward.model';
import RedemptionModel from '../../database/models/redemption.model';
import ClaimModel from '../../database/models/claim.model';

export class OrderDBContext<Q extends Object, T extends AggregateRoot<Q>> extends DBContext<Q, T> {
    constructor() {
        super(OrderModel);
    }
}

export class AccountDBContext<Q extends Object, T extends AggregateRoot<Q>> extends DBContext<Q, T> {
    constructor() {
        super(AccountModel);
    }
}

export class DepositDBContext<Q extends Object, T extends AggregateRoot<Q>> extends DBContext<Q, T> {
    constructor() {
        super(DepositModel);
    }
}

export class RewardDBContext<Q extends Object, T extends AggregateRoot<Q>> extends DBContext<Q, T> {
    constructor() {
        super(RewardModel);
    }
}

export class RedemptionDBContext<Q extends Object, T extends AggregateRoot<Q>> extends DBContext<Q, T> {
    constructor() {
        super(RedemptionModel);
    }
}

export class ClaimDBContext<Q extends Object, T extends AggregateRoot<Q>> extends DBContext<Q, T> {
    constructor() {
        super(ClaimModel);
    }
}