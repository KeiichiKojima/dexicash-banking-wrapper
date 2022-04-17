import axios from 'axios';

export type BankAccountDBRecordType = {
    id: string;
    name: string;
    cpf: string;
    balance: number;
    created_at: string;
};

export type BankAccountCreateRequestType = Omit<
    BankAccountDBRecordType,
    'id' | 'created_at'
>;

export type BankAccountBalanceResponseType = {
    balance: number;
};

const BANKING_SYSTEM_URL = process.env.BANKING_SYSTEM_URL;

export class BankingSystem {
    constructor() { }

    async getAccounts(): Promise<BankAccountDBRecordType[]> {
        return await axios.get<{}, BankAccountDBRecordType[]>(
            `${BANKING_SYSTEM_URL}/v1/accounts`,
        );
    }

    async createAccount(
        data: BankAccountCreateRequestType,
    ): Promise<BankAccountDBRecordType> {
        return await axios.post<{}, BankAccountDBRecordType>(
            `${BANKING_SYSTEM_URL}/v1/accounts`,
            data,
        );
    }

    async getAccountBalance(accountId: string) {
        return await axios.get<{}, BankAccountBalanceResponseType>(
            `${BANKING_SYSTEM_URL}/v1/accounts/${accountId}/balance`,
        );
    }
}

const bankingSystem = new BankingSystem();

export default bankingSystem;
