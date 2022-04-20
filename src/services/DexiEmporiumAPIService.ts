import axios, { AxiosRequestConfig } from 'axios';
import { logger } from './logger';
const { DEXI_API } = require('../constants')

const createLootRequest = async (UserId: string,GameId: string) => {
    var data = JSON.stringify({
        "message_type": "create_loot_request",
        "userId" : UserId,
        "game": GameId
    });
    logger.debug(`********** create_loot_request ${JSON.stringify(data)}`);

    /*var config: AxiosRequestConfig = {
        method: 'post', url: `${DEXI_API}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    };
    const response = await axios.post(config.url, config.data, config).catch(({ response }) => {
        logger.error(`create ${JSON.stringify(response.data)}`);
        logger.error(`create ${response.status}`);
        logger.error(`create ${JSON.stringify(response.headers)}`);
    });
    logger.info(`create ${JSON.stringify(response)}`);*/

    let lootRequestId = "625f6f1b26b3ce2bdcbc46e2";
    logger.debug(`********** end create ${lootRequestId}`);
    return lootRequestId;
};

const getLootRequest = async (UserId: string, RequestId: string) => {
    return {
        "status": 200,
        "data": {
            "_id": "625f6f1b26b3ce2bdcbc46e2",
            "user": "625ccf96c48a4b5765cad816",
            "winStatus": "Lose",
            "loot": null,
            "createdAt": "2022-04-20T02:25:31.451Z",
            "updatedAt": "2022-04-20T02:25:31.451Z",
            "__v": 0
        }
    }

    var config: AxiosRequestConfig = {
        method: 'get', url: `${DEXI_API}/v1/accounts`,
    };

    return axios(config)
        .then(async function(response: any) {
            let accounts = response.data;
            //accounts = JSON.parse(JSON.stringify(accounts));
            let found = accounts.find((x: any) => x.cpf === UserId);
            logger.info(JSON.stringify(found));
            return found.id;
        })
        .catch(({ response }) => {
            logger.error(`get ${JSON.stringify(response)}`);
            logger.error(`get ${JSON.stringify(response.data)}`);
            logger.error(`get ${response.status}`);
            logger.error(`get ${JSON.stringify(response.headers)}`);

            throw JSON.stringify(response.data);
        });
};

export { createLootRequest, getLootRequest };
