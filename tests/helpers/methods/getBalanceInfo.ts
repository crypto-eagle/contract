import { SandboxContract } from '@ton/sandbox';
import { BalanceInfo, MainContract } from '../../../build/MainContract/tact_MainContract';
import { Address } from '@ton/core';

export const getBalanceInfo = async (contract: SandboxContract<MainContract>, address: Address): Promise<BalanceInfo | null> => {
    return await contract.getBalanceInfo(address);
};
