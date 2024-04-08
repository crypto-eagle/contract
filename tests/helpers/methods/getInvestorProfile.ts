import { SandboxContract } from '@ton/sandbox';
import { Profile, EarnContract } from '../../../build/EarnContract/tact_EarnContract';
import { Address } from '@ton/core';

export const getInvestorProfile = async (contract: SandboxContract<EarnContract>, address: Address): Promise<Profile | null> => {
    return await contract.getInvestorProfile(address);
};

