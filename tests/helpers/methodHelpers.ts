import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { MainContract } from '../../build/MainContract/tact_MainContract';
import { deposit } from './methods/deposit';
import { getBalanceInfo, InvestorBalanceInfo } from './methods/getBalanceInfo';

export interface MethodHelpersType {
    getBalanceInfo: () => Promise<InvestorBalanceInfo | null>;
    deposit: (value: bigint) => Promise<SendMessageResult>;
}

export const methodHelpers = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): MethodHelpersType => {
    return {
        getBalanceInfo: () => getBalanceInfo(contract, deployer),
        deposit: (value: bigint) => deposit(contract, deployer, value)
    };
};
