import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { Investor, MainContract } from '../../build/MainContract/tact_MainContract';
import { deposit } from './methods/deposit';
import { getInvestorInfo } from './methods/getInvestorInfo';

export interface MethodHelpersType {
    getInvestorInfo: () => Promise<Investor | null>;
    deposit: (value: bigint) => Promise<SendMessageResult>;
}

export const methodHelpers = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): MethodHelpersType => {
    return {
        getInvestorInfo: () => getInvestorInfo(contract, deployer),
        deposit: (value: bigint) => deposit(contract, deployer, value)
    };
};
