import { SandboxContract } from '@ton/sandbox';
import { EarnContract } from '../../../build/EarnContract/tact_EarnContract';
import { Address } from '@ton/core';
import { rewardsPercent } from '../consts';

export const expectInvestorProfile = async (
    contract: SandboxContract<EarnContract>,
    investorAddress: Address,
    totalDeposit: bigint,
    totalClaimedRewards: bigint,
    totalReferralBonus: bigint,
    depositIsAvailable: boolean,
    currentRound: bigint,
    currentRoundDurationInDays: bigint,
    currentDeposit: bigint,
    currentClaimedRewards: bigint,
    currentClaimableRewards: bigint,
    upLine: Address
) => {
    let investorProfile = await contract.getInvestorProfile(investorAddress);

    expect(investorProfile).not.toBeNull();

    investorProfile = investorProfile!!;

    expect(investorProfile.$$type).toEqual('Profile');
    expect(investorProfile.totalDeposit).toEqual(totalDeposit);
    expect(investorProfile.totalClaimedRewards).toEqual(totalClaimedRewards);
    expect(investorProfile.totalReferralBonus).toEqual(totalReferralBonus);
    expect(investorProfile.depositIsAvailable).toEqual(depositIsAvailable);
    expect(investorProfile.currentRound).toEqual(currentRound);
    expect(investorProfile.currentRoundDurationInDays).toEqual(currentRoundDurationInDays);
    expect(investorProfile.currentDeposit).toEqual(currentDeposit);
    expect(investorProfile.currentClaimedRewards).toEqual(currentClaimedRewards);
    expect(investorProfile.currentClaimableRewards).toEqual(currentClaimableRewards);
    expect(investorProfile.currentMaxRewards).toEqual(BigInt(currentDeposit * rewardsPercent / 100n));
    expect(investorProfile.upLine).toEqualAddress(upLine);
};
