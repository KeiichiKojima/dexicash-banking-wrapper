import { OrderRepository } from '../../src/repositories/OrderRepository';
import { Order } from '../../src/domain/DexiCash/Order';
import { expect } from 'chai';

describe('Order Repo tests', () => {
    const orderRepo = new OrderRepository();

    const order1 = Order.Create({ OrderId: "1", StatusReason: "no reason"});
    const order2 = Order.Create({ OrderId: "2", StatusReason: "no reasons"});
    
    it('create', async () => {
        expect(await orderRepo.create(order1), "Create order 1").to.be.true;

        expect(await orderRepo.create(order2), "Create order 2").to.be.true;
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

        console.log(findRes);

        expect(findRes.props.StatusReason, "Cancelled status reason").to.equal("Some reason");
    });

    it('find', async () => {
        const findOneRes = await orderRepo.findOne({ OrderId: "2" });

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