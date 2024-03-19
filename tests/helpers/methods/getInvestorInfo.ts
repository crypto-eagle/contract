import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Investor, MainContract } from '../../../build/MainContract/tact_MainContract';


export const getInvestorInfo = async (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): Promise<Investor | null> => {
    const { address } = deployer.getSender();

    return await contract.getInvestorInfo(address);
};

