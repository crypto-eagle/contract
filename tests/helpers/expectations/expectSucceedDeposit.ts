import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { ProfileDataResponse, EarnContract } from '../../../build/EarnContract/tact_EarnContract';
import { Address } from '@ton/core';

export const expectSucceedDeposit = async (contract: SandboxContract<EarnContract>, deployer: SandboxContract<TreasuryContract>, upLine: Address | null): Promise<ProfileDataResponse | null> => {
    /*const helper = methodHelpers(contract, deployer);

    const value = minDeposit;

    const result = await helper.deposit(value, upLine);
    expectHaveTran(contract, deployer, result, value, true);

    const investorInfoAfter = await helper.getInvestorProfile();

    expect(investorInfoAfter).not.toBeNull();
    expectHaveOnlyOneEvent(contract, deployer, result, value);

    expect(investorInfoAfter!.upLine).toEqualAddress(upLine ?? await contract.getOwner());
    expect(investorInfoAfter!.transfersCount).toBe(1n);
    expect(investorInfoAfter!.transfers.size).toBe(1);
    expect(investorInfoAfter!.transfers.get(0)?.isDeposit).toBeTruthy();

    expect(investorInfoAfter!.transfers.get(0)?.amount).toBeLessThanOrEqual((await contract.getTotalBalance()) + 100000000n);
    expect(investorInfoAfter!.transfers.get(0)?.amount).toBe(value);

    const balanceInfo = await helper.getMyBalanceInfo();
    expect(balanceInfo?.totalDeposits).toBe(value);
    expect(balanceInfo?.totalWithdrawals).toBe(0n);

    return balanceInfo!;*/

    return null;
};

