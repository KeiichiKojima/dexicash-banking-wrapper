import axios, { AxiosRequestConfig } from 'axios';
import { logger } from './logger';

const { DEXI_API } = require('../constants');

const getManagementToken = async () => {
    var data = {
        'client_id': 'I354QgWPwcLYDBiPMf8gUWXOmQR5Spd7',
        'client_secret': 'nki5xew-KffWanz3OHNqYjbZgnQQwi44MwVarazF0msur-WpeVFy-cerKMWyVEhQ',
        'audience': 'http://uat.dexigas.com:3330/api/v1',
        'grant_type': 'client_credentials',
        'scope': 'read:inventory update:inventory',
    };

    var config: AxiosRequestConfig = {
        method: 'post', url: 'https://dev-x8a-qve9.us.auth0.com/oauth/token',
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    };
    return axios.post(config.url, config.data, config).then((response) => {
        let result = response?.data;
        logger.debug(`********** end transfer ${JSON.stringify(result)}`);
        return result;
    }).catch(({ response }) => {
        logger.error(`create ${JSON.stringify(response.data)}`);
        logger.error(`create ${response.status}`);
        logger.error(`create ${JSON.stringify(response.headers)}`);
    });
};

const createLootRequest = async (UserId: string, GameId: string) => {
    var data = JSON.stringify({
        'message_type': 'create_loot_request',
        'userId': UserId,
        'game': GameId,
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

    let lootRequestId = '625f6f1b26b3ce2bdcbc46e2';
    logger.debug(`********** end create ${lootRequestId}`);
    return lootRequestId;
};
const loot = [];
const items = [
    {
        'itemId': 15112,
        'itemName': 'The Sword Of Jamarcus',
        'itemDetails': {
            'itemName': 'Greataxe 2',
            'itemDescription': 'For',
            'itemIdentifier': 'item.weapon.greataxe.1001',
            'itemType': 'greataxe',
            'itemCategory': 'weapon',
            'itemDamage': 25,
        },
    }, {
        'itemId': 15113,
        'itemName': 'The Sword Of Jamarcus',
        'itemDetails': {
            'itemName': 'Curved Greatsword',
            'itemDescription': 'For',
            'itemIdentifier': 'item.weapon.greatsword.1002',
            'itemType': 'greatsword',
            'itemCategory': 'weapon',
            'itemDamage': 25,
        },
    }, {
        'itemId': 15114,
        'itemName': 'The Sword Of Jamarcus',
        'itemDetails': {
            'itemName': 'Warrior\'s Set',
            'itemDescription': 'For',
            'itemIdentifier': 'item.armor.1005',
            'itemType': 'armor',
            'itemCategory': 'armor',
            'itemDefense': 25,
        },
    }];
let prizes = [
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            // DEXI x2
            'winStatus': 'Won',
            'loot': '624d67b6025ef198c50b9a50',
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Won',
            'loot': '15112',
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    },
    {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Lose',
            'loot': null,
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    }, {
        'status': 200,
        'data': {
            '_id': '625f6f1b26b3ce2bdcbc46e2',
            'user': '625ccf96c48a4b5765cad816',
            'winStatus': 'Won',
            'loot': '15112',
            'createdAt': '2022-04-20T02:25:31.451Z',
            'updatedAt': '2022-04-20T02:25:31.451Z',
            '__v': 0,
        },
    }];
const getLootRequest = async (UserId: string, RequestId: string) => {
    let max = prizes.length;
    let min = 0;
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    randomNumber = 1;
//DEXICASH x2
    return prizes[randomNumber - 1];

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

const createInventoryTransfer = async (UserId: string, GameId: string, Prize: string) => {
    const Item = items.find((x: any) => {
        return x.itemId === parseInt(Prize);
    });

    var data = {
        'message_type': 'update_inventory',
        'userId': UserId,
        'game': GameId,
        'type': 'shared',
        'item': Item,
    };

    let { access_token } = await getManagementToken();
    var config: AxiosRequestConfig = {
        method: 'post', url: `${DEXI_API}`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + access_token,
        },
        data: data,
    };
    return axios.post(config.url, config.data, config).then((response) => {
        let result = response?.data;
        return { status : 'success', data : result } ;
    }).catch(({ response }) => {
        logger.error(`create ${JSON.stringify(response.data)}`);
        logger.error(`create ${response.status}`);
        logger.error(`create ${JSON.stringify(response.headers)}`);
    });

};
export { createLootRequest, getLootRequest, createInventoryTransfer };
