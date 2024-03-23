import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { BalanceInfo, MainContract } from '../../../build/MainContract/tact_MainContract';
import { Address } from '@ton/core';
import { methodHelpers } from '../methodHelpers';
import { expectHaveTran } from './expectHaveTran';
import { expectHaveOnlyOneEvent } from './expectHaveEvent';
import { depositGasConsumption, minDeposit } from '../consts';

export const expectSucceedDeposit = async (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>, upLine: Address | null): Promise<BalanceInfo> => {
    const helper = methodHelpers(contract, deployer);

    const value = minDeposit;

    const result = await helper.deposit(value, upLine);
    expectHaveTran(contract, deployer, result, value, true);

    const investorInfoAfter = await helper.getMyInvestorInfo();

    expect(investorInfoAfter).not.toBeNull();
    expectHaveOnlyOneEvent(contract, deployer, result, value);

    expect(investorInfoAfter!.upLine).toEqualAddress(upLine ?? await contract.getOwner());
    expect(investorInfoAfter!.transfersLength).toBe(1n);
    expect(investorInfoAfter!.transfers.size).toBe(1);
    expect(investorInfoAfter!.transfers.get(0)?.isDeposit).toBeTruthy();

    expect(investorInfoAfter!.transfers.get(0)?.amount).toBeLessThanOrEqual(await contract.getTotalBalance());
    expect(investorInfoAfter!.transfers.get(0)?.amount).toBe(value - depositGasConsumption);

    const balanceInfo = await helper.getMyBalanceInfo();
    expect(balanceInfo?.totalDeposits).toBe(value - depositGasConsumption);
    expect(balanceInfo?.totalWithdrawals).toBe(0n);

    return balanceInfo!;
};

