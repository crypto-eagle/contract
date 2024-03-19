import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { BalanceInfo, MainContract } from '../../../build/MainContract/tact_MainContract';

export const getBalanceInfo = async (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): Promise<BalanceInfo | null> => {
    const { address } = deployer.getSender();

    return await contract.getBalanceInfo(address);
};
