import { SandboxContract } from '@ton/sandbox';
import { Profile, EarnContract } from '../../../build/EarnContract/tact_EarnContract';

export const getInvestorProfile = async (contract: SandboxContract<EarnContract>): Promise<Profile | null> => {
    return await contract.getInvestorProfile();
};

