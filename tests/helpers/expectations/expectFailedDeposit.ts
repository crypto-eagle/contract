import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Investor, MainContract } from '../../../build/MainContract/tact_MainContract';
import { toNano } from '@ton/core';
import { methodHelpers } from '../methodHelpers';
import { expectHaveTran } from './expectHaveTran';
import { expectHaveFailEvents } from './expectHaveEvent';


export const expectFailedDeposit = async (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): Promise<Investor | null> => {
    const helper = methodHelpers(contract, deployer);

    const balanceBefore = await helper.getInvestorInfo();
    const value = toNano(0.02);

    const result = await helper.deposit(value, null);
    expectHaveTran(contract, deployer, result, value, false);

    const balanceAfter = await helper.getInvestorInfo();

    expect(balanceBefore).toBe(balanceAfter);
    expectHaveFailEvents(result);

    return balanceAfter;
};

