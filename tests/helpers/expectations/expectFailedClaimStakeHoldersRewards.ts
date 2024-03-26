import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { FounderContract } from '../../../build/FounderContract/tact_FounderContract';
import { claimStakeHoldersRewards } from '../methods/claimStakeHoldersRewards';
import { expectHaveTranWith } from './expectHaveTran';
import { expectHaveFailEvents } from './expectHaveEvent';
import { ExitCodes, claimStakeHoldersRewardsGasValue } from '../consts';

export const expectFailedClaimStakeHoldersRewards = async (contract: SandboxContract<FounderContract>, sender: SandboxContract<TreasuryContract>, exitCode: ExitCodes) => {
    const contractBalanceBefore = await contract.getBalance();

    const payRewardsResult = await claimStakeHoldersRewards(contract, sender);

    expect(await contract.getBalance()).toEqual(contractBalanceBefore);
    expectHaveTranWith(contract, sender, payRewardsResult, claimStakeHoldersRewardsGasValue, exitCode);
    expectHaveFailEvents(payRewardsResult);
};
