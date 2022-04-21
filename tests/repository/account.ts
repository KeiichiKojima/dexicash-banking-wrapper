import { AccountRepository } from '../../src/repositories/AccountRepository';
import { Account, Account_Status } from '../../src/domain/DexiCash/Account';
import { expect } from 'chai';
import "dotenv/config";
import AccountModel from '../../src/database/models/account.model';

describe('Account Repo tests', () => {
    const accountRepo = new AccountRepository();

    const account1 = Account.Create({ UserId: "1" });
    const account2 = Account.Create({ UserId: "2" });``

    it('create', async () => {
        expect(await accountRepo.create(account1), "Create account 1").to.be.true;

        expect(await accountRepo.create(account2), "Create account 2").to.be.true;
    });

    before(async () => {
        const connectMongo = require('../../src/connectMongo').default;
        await connectMongo();

        await AccountModel.remove({});
    });

    it('update', async () => {
        account2.cancelled("Some cancel reason");

        const updateRes = await accountRepo.update(account2.id, account2);

        expect(updateRes, "Update account 2 with cancel status").to.be.true;
    });

    it('save', async () => {
        account2.assign("123");

        const saveRes = await accountRepo.save(account2);

        expect(saveRes, "Save account 2 with bankId 123").to.be.true;

        const findRes = await accountRepo.findOne({ UserId: account2.UserId });

        expect(findRes.BankId, "save with bankId 123").to.equal("123");
    });

    it('find', async () => {
        const findOneRes = await accountRepo.findOne({ UserId: "2" });

        findOneRes.cancelled("Some reason");

        expect(findOneRes.Status, "Cancelled Account 2").to.equal(Account_Status.Cancelled);

        expect(findOneRes, "Findone by AccountId 2").to.not.be.null;

        const findAllRes = await accountRepo.find({});

        expect(findAllRes.length, "Find all").to.equal(2);
    });

    it('delete', async () => {
        await accountRepo.delete(account2.id);

        const findAccount2Res = await accountRepo.findOne({ UserId: account2.UserId });

        expect(findAccount2Res).to.be.null;

        const findAllRes = await accountRepo.find({});

        expect(findAllRes.length).equal(1);
    });
});