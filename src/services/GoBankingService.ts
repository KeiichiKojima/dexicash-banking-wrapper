import axios, { AxiosRequestConfig } from 'axios';
import { logger } from './logger';
const { BANK_API } = require('../constants')

const create = async (UserId: string, StartingBalance?: number) => {
    var data = JSON.stringify({
        'name': UserId,
        'cpf': UserId,
        'balance': StartingBalance || 1,
    });
    logger.debug(`********** create ${JSON.stringify(data)}`);

    var config: AxiosRequestConfig = {
        method: 'post', url: `${BANK_API}/v1/accounts`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    };
    let bankId = 'undefined';
    const response = await axios.post(config.url, config.data, config).catch(({ response }) => {
        logger.error(`create ${JSON.stringify(response.data)}`);
        logger.error(`create ${response.status}`);
        logger.error(`create ${JSON.stringify(response.headers)}`);

        if (JSON.stringify(response.data).includes('duplicate key value violates unique constraint')) {
            logger.debug(`create need to get existing account ${JSON.stringify(response.data).includes('duplicate key value violates unique constraint')}`);

            throw new Error(`ERROR duplicate key value ${JSON.stringify(response.data)}`);

        }
        throw new Error(`ERROR  ${JSON.stringify(response.data)}`);
    });
    let json = response?.data;
    bankId = json?.id;

    logger.debug(`********** end create ${bankId}`);
    return bankId;
};

const transfer = async (GameId: string, UserId: string, Amount: number) => {
    var data = {
        'account_origin_id': GameId,
        'account_destination_id': UserId,
        'amount': Amount,
    };
    logger.debug(`********** transfer ${JSON.stringify(data)}`);

    var config: AxiosRequestConfig = {
        method: 'post', url: `${BANK_API}/v1/transfers`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
    };

    const response = await axios.post(config.url, config.data, config).catch(({ response }) => {
        logger.error(`transfer ${JSON.stringify(response.data)}`);
        logger.error(`transfer ${response.status}`);
        logger.error(`transfer ${JSON.stringify(response.headers)}`);

        throw new Error(`ERROR create ${JSON.stringify(response.data)}`);
    });

    let result = response?.data;
    logger.debug(`********** end transfer ${JSON.stringify(result)}`);
};

const getaccount = async (UserId: string) => {

    var config: AxiosRequestConfig = {
        method: 'get', url: `${BANK_API}/v1/accounts`,
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

export { create, transfer,getaccount };
