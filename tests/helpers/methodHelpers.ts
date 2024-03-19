import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { BalanceInfo, Investor, MainContract } from '../../build/MainContract/tact_MainContract';
import { deposit } from './methods/deposit';
import { getInvestorInfo } from './methods/getInvestorInfo';
import { Address } from '@ton/core';
import { getBalanceInfo } from './methods/getBalanceInfo';

export interface MethodHelpersType {
    getInvestorInfo: () => Promise<Investor | null>;
    getBalanceInfo: () => Promise<BalanceInfo | null>;
    deposit: (value: bigint, upLine: Address | null) => Promise<SendMessageResult>;
}

export const methodHelpers = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): MethodHelpersType => {
    return {
        getInvestorInfo: () => getInvestorInfo(contract, deployer),
        deposit: (value: bigint, upLine: Address | null) => deposit(contract, deployer, value, upLine),
        getBalanceInfo: () => getBalanceInfo(contract, deployer),
    };
};
