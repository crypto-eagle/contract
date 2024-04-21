import { Address, fromNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { EarnContract } from '../build/EarnContract/tact_EarnContract';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Earn Contract address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);

        return;
    }

    const earnContract = provider.open(EarnContract.fromAddress(address));

    const investorProfile = await earnContract.getInvestorProfile(provider.sender().address!);

    ui.clearActionPrompt();
    if (!investorProfile) {
        throw Error('Profile required');
    }

    const profileData = {
        totalDeposit: fromNano(investorProfile.totalDeposit),
        totalClaimedRewards: fromNano(investorProfile.totalClaimedRewards),
        totalReferralBonus: fromNano(investorProfile.totalReferralBonus),
        depositIsAvailable: investorProfile.depositIsAvailable,
        currentRound: Number(investorProfile.currentRound),
        currentRoundDurationInDays: Number(investorProfile.currentRoundDurationInDays),
        currentDeposit: fromNano(investorProfile.currentDeposit),
        currentClaimedRewards: fromNano(investorProfile.currentClaimedRewards),
        currentClaimableRewards: fromNano(investorProfile.currentClaimableRewards),
        currentMaxRewards: fromNano(investorProfile.currentMaxRewards)
    };
    ui.write('investorProfile: ' + JSON.stringify(profileData));
}
