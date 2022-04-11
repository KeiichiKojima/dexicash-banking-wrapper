import {Router} from 'express';

const apiRouterV1 = Router();

apiRouterV1.get('/ping', (_, res) => {
    res.json({message: 'pong'});
});

export default apiRouterV1;
