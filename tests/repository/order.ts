import { OrderRepository } from '../../src/repositories/OrderRepository';
import { Order, Order_Status } from '../../src/domain/DexiCash/Order';
import { expect } from 'chai';
import "dotenv/config";
import OrderModel from '../../src/database/models/order.model';
import { DBContext } from '../../src/repositories/DBContext';
import { InMemoryContext } from '../../src/repositories/InMemoryContext';
import { OrderDBContext } from '../../src/repositories/DomainDBContexts/index';

describe('Order Repo tests', () => {
    const orderRepo = new OrderRepository(new DBContext(OrderModel));
    // or const orderRepo = new OrderRepository(new OrderDBContext());

    const order1 = Order.Create({ OrderId: "1", StatusReason: "no reason"});
    const order2 = Order.Create({ OrderId: "2", StatusReason: "no reasons"});

    before(async () => {
        const connectMongo = require('../../src/connectMongo').default;
        await connectMongo();

        await OrderModel.remove({});
    });
    
    it('create', async () => {
        expect(await orderRepo.save(order1), "Create order 1").to.be.true;
        order1.complete();
        expect(await orderRepo.save(order1), "Create order 1").to.be.true;

        expect(await orderRepo.save(order2), "Create order 2").to.be.true;

        const findAllRes = await orderRepo.find({});

        expect(findAllRes.length).equal(2);
    });

    it('update', async () => {
        order2.complete();
        
        const updateRes = await orderRepo.update(order2.id, order2);

        expect(updateRes, "Update order 2 with completed status").to.be.true;
    });

    it('save', async () => {
        order2.cancelled("Some reason");
        
        const saveRes = await orderRepo.save(order2);

        expect(saveRes, "Save order 2 with cancelled status").to.be.true;

        const findRes = await orderRepo.findOne({ OrderId: order2.OrderId });

        expect(findRes.StatusReason, "Cancelled status reason").to.equal("Some reason");
    });

    it('find', async () => {
        const findOneRes = await orderRepo.findOne({ OrderId: "2" });

        findOneRes.complete();

        expect(findOneRes.Status, "Completed Order 2").to.equal(Order_Status.Completed);

        findOneRes.cancelled("some cancel reason");

        expect(findOneRes.StatusReason, "Cancelled Order 2").to.equal("some cancel reason");

        expect(findOneRes, "Findone by OrderId 2").to.not.be.null;

        const findAllRes = await orderRepo.find({});

        expect(findAllRes.length, "Find all").to.equal(2);
    });

    it('delete', async () => {
        await orderRepo.delete(order2.id);

        const findOrder2Res = await orderRepo.findOne({ OrderId: order2.OrderId });

        expect(findOrder2Res).to.be.null;

        const findAllRes = await orderRepo.find({});

        expect(findAllRes.length).equal(1);
    });
});