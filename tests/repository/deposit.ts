import { DepositRepository } from '../../src/repositories/DepositRepository';
import { Deposit, Deposit_Status } from '../../src/domain/DexiCash/Deposit';
import { expect } from 'chai';
import "dotenv/config";
import DepositModel from '../../src/database/models/deposit.model';
import { DBContext } from '../../src/repositories/DBContext';
import { InMemoryContext } from '../../src/repositories/InMemoryContext';

describe('Deposit Repo tests', () => {
    const depositRepo = new DepositRepository(new InMemoryContext());

    const deposit1 = Deposit.Create({ OrderId: "1", StatusReason: "no reason" });
    const deposit2 = Deposit.Create({ OrderId: "2", StatusReason: "no reasons" });

    before(async () => {
        const connectMongo = require('../../src/connectMongo').default;
        await connectMongo();

        await DepositModel.remove({});
    });

    it('create', async () => {
        expect(await depositRepo.create(deposit1), "Create deposit 1").to.be.true;

        expect(await depositRepo.create(deposit2), "Create deposit 2").to.be.true;
    });

    it('update', async () => {
        deposit2.complete();

        const updateRes = await depositRepo.update(deposit2.id, deposit2);

        expect(updateRes, "Update deposit 2 with completed status").to.be.true;
    });

    it('save', async () => {
        deposit2.cancelled("Some reason");

        const saveRes = await depositRepo.save(deposit2);

        expect(saveRes, "Save deposit 2 with cancelled status").to.be.true;

        const findRes = await depositRepo.findOne({ OrderId: deposit2.OrderId });

        expect(findRes.StatusReason, "Cancelled status reason").to.equal("Some reason");
    });

    it('find', async () => {
        const findOneRes = await depositRepo.findOne({ OrderId: "2" });

        findOneRes.complete();

        expect(findOneRes.Status, "Completed Deposit 2").to.equal(Deposit_Status.Completed);

        findOneRes.cancelled("some cancel reason");

        expect(findOneRes.StatusReason, "Cancelled Deposit 2").to.equal("some cancel reason");

        expect(findOneRes, "Findone by DepositId 2").to.not.be.null;

        const findAllRes = await depositRepo.find({});

        expect(findAllRes.length, "Find all").to.equal(2);
    });

    it('delete', async () => {
        await depositRepo.delete(deposit2.id);

        const findDeposit2Res = await depositRepo.findOne({ OrderId: deposit2.OrderId });

        expect(findDeposit2Res).to.be.null;

        const findAllRes = await depositRepo.find({});

        expect(findAllRes.length).equal(1);
    });
});