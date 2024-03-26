import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { BalanceInfo, Investor, MainContract } from '../../build/MainContract/tact_MainContract';
import { FounderContract } from '../../build/FounderContract/tact_FounderContract';
import { deposit } from './methods/deposit';
import { getInvestorInfo } from './methods/getInvestorInfo';
import { Address } from '@ton/core';
import { getBalanceInfo } from './methods/getBalanceInfo';
import { topUpWithFounderFee } from './methods/topUpWithFounderFee';
import { claimStakeHoldersRewards } from './methods/claimStakeHoldersRewards';

export interface MethodHelpersType {
    getMyInvestorInfo: () => Promise<Investor | null>;
    getInvestorInfo: (address: Address) => Promise<Investor | null>;
    getMyBalanceInfo: () => Promise<BalanceInfo | null>;
    getBalanceInfo: (address: Address) => Promise<BalanceInfo | null>;
    deposit: (value: bigint, upLine: Address | null) => Promise<SendMessageResult>;
}

export interface FounderContractMethodHelpersType {
    topUpWithFounderFee: (sender: SandboxContract<TreasuryContract>, value: bigint) => Promise<SendMessageResult>;
    claimStakeHoldersRewards: (sender: SandboxContract<TreasuryContract>) => Promise<SendMessageResult>;
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

export const founderContractMethodHelpers = (contract: SandboxContract<FounderContract>): FounderContractMethodHelpersType => {
    return {
        topUpWithFounderFee: (sender: SandboxContract<TreasuryContract>, value: bigint) => topUpWithFounderFee(contract, sender, value),
        claimStakeHoldersRewards: (sender: SandboxContract<TreasuryContract>) => claimStakeHoldersRewards(contract, sender),
    };
};
