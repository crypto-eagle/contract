import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { EarnContract, ProfileDataResponse } from '../../build/EarnContract/tact_EarnContract';
import { FounderContract } from '../../build/FounderContract/tact_FounderContract';
import { deposit } from './methods/deposit';
import { getInvestorProfile } from './methods/getInvestorProfile';
import { Address } from '@ton/core';
import { topUpWithFounderFee } from './methods/topUpWithFounderFee';
import { claimStakeHoldersRewards } from './methods/claimStakeHoldersRewards';
import { getDepositConstraints } from './methods/getDepositConstraints';
import { claimRewards } from './methods/claimRewards';

export interface MethodHelpersType {
    getDepositConstraints: (address: Address) => Promise<{ min: BigInt, max: BigInt }>;
    getInvestorProfile: (address: Address) => Promise<ProfileDataResponse | null>;
    deposit: (investor: SandboxContract<TreasuryContract>, value: bigint, upLine: Address | null) => Promise<SendMessageResult>;
    claimRewards: (investor: SandboxContract<TreasuryContract>) => Promise<SendMessageResult>;
}

export interface FounderContractMethodHelpersType {
    topUpWithFounderFee: (sender: SandboxContract<TreasuryContract>, value: bigint) => Promise<SendMessageResult>;
    claimStakeHoldersRewards: (sender: SandboxContract<TreasuryContract>) => Promise<SendMessageResult>;
}

export const methodHelpers = (contract: SandboxContract<EarnContract>): MethodHelpersType => {
    return {
        getDepositConstraints: (address: Address) => getDepositConstraints(contract, address),
        getInvestorProfile: (address: Address) => getInvestorProfile(contract, address),
        deposit: (investor: SandboxContract<TreasuryContract>, value: bigint, upLine: Address | null) => deposit(contract, investor, value, upLine),
        claimRewards: (investor: SandboxContract<TreasuryContract>) => claimRewards(contract, investor)
    };
};

export const founderContractMethodHelpers = (contract: SandboxContract<FounderContract>): FounderContractMethodHelpersType => {
    return {
        topUpWithFounderFee: (sender: SandboxContract<TreasuryContract>, value: bigint) => topUpWithFounderFee(contract, sender, value),
        claimStakeHoldersRewards: (sender: SandboxContract<TreasuryContract>) => claimStakeHoldersRewards(contract, sender)
    };
};
