import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { BalanceInfo, Investor, MainContract } from '../../build/MainContract/tact_MainContract';
import { deposit } from './methods/deposit';
import { getInvestorInfo } from './methods/getInvestorInfo';
import { Address } from '@ton/core';
import { getBalanceInfo } from './methods/getBalanceInfo';

export interface MethodHelpersType {
    getMyInvestorInfo: () => Promise<Investor | null>;
    getInvestorInfo: (address: Address) => Promise<Investor | null>;
    getMyBalanceInfo: () => Promise<BalanceInfo | null>;
    getBalanceInfo: (address: Address) => Promise<BalanceInfo | null>;
    deposit: (value: bigint, upLine: Address | null) => Promise<SendMessageResult>;
}

export const methodHelpers = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): MethodHelpersType => {
    return {
        getMyInvestorInfo: () => getInvestorInfo(contract, deployer.address),
        getInvestorInfo: (address: Address) => getInvestorInfo(contract, address),
        deposit: (value: bigint, upLine: Address | null) => deposit(contract, deployer, value, upLine),
        getMyBalanceInfo: () => getBalanceInfo(contract, deployer.address),
        getBalanceInfo: (address: Address) => getBalanceInfo(contract, address)
    };
};
