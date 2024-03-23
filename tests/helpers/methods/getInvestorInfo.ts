import { SandboxContract } from '@ton/sandbox';
import { Investor, MainContract } from '../../../build/MainContract/tact_MainContract';
import { Address } from '@ton/core';


export const getInvestorInfo = async (contract: SandboxContract<MainContract>, address: Address): Promise<Investor | null> => {
    return await contract.getInvestorInfo(address);
};

