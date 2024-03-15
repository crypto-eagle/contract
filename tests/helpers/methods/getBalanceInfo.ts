import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { MainContract } from '../../../build/MainContract/tact_MainContract';

export interface InvestorBalanceInfo {
    total: number;
}

export const getBalanceInfo = async (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): Promise<InvestorBalanceInfo | null> => {
    const { address } = deployer.getSender();

    return await contract.getBalanceInfo(address) as InvestorBalanceInfo | null;
};
