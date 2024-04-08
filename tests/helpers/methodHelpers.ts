import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { Profile, EarnContract } from '../../build/EarnContract/tact_EarnContract';
import { FounderContract } from '../../build/FounderContract/tact_FounderContract';
import { deposit } from './methods/deposit';
import { getInvestorProfile } from './methods/getInvestorProfile';
import { Address } from '@ton/core';
import { topUpWithFounderFee } from './methods/topUpWithFounderFee';
import { claimStakeHoldersRewards } from './methods/claimStakeHoldersRewards';

export interface MethodHelpersType {
    getInvestorProfile: () => Promise<Profile | null>;
    deposit: (value: bigint, upLine: Address | null) => Promise<SendMessageResult>;
}

export interface FounderContractMethodHelpersType {
    topUpWithFounderFee: (sender: SandboxContract<TreasuryContract>, value: bigint) => Promise<SendMessageResult>;
    claimStakeHoldersRewards: (sender: SandboxContract<TreasuryContract>) => Promise<SendMessageResult>;
}

export const methodHelpers = (contract: SandboxContract<EarnContract>, deployer: SandboxContract<TreasuryContract>): MethodHelpersType => {
    return {
        getInvestorProfile: () => getInvestorProfile(contract),
        deposit: (value: bigint, upLine: Address | null) => deposit(contract, deployer, value, upLine),
    };
};

export const founderContractMethodHelpers = (contract: SandboxContract<FounderContract>): FounderContractMethodHelpersType => {
    return {
        topUpWithFounderFee: (sender: SandboxContract<TreasuryContract>, value: bigint) => topUpWithFounderFee(contract, sender, value),
        claimStakeHoldersRewards: (sender: SandboxContract<TreasuryContract>) => claimStakeHoldersRewards(contract, sender),
    };
};
