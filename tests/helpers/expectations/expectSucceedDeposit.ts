import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Investor, MainContract } from '../../../build/MainContract/tact_MainContract';
import { toNano } from '@ton/core';
import { methodHelpers } from '../methodHelpers';
import { expectHaveTran } from './expectHaveTran';
import { expectHaveOnlyOneEvent } from './expectHaveEvent';

export const expectSucceedDeposit = async (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): Promise<Investor> => {
    const helper = methodHelpers(contract, deployer);

    const investorInfoBefore = await helper.getInvestorInfo();
    const value = toNano(5);

    const result = await helper.deposit(value);
    expectHaveTran(contract, deployer, result, value, true);

    const investorInfoAfter = await helper.getInvestorInfo();

    expect(investorInfoBefore).toBeNull();
    expect(investorInfoAfter).not.toBeNull();
    expectHaveOnlyOneEvent(contract, deployer, result, value);

    return investorInfoAfter!;
};
