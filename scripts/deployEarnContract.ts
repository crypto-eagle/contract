import { Address, toNano } from '@ton/core';
import { EarnContract } from '../wrappers/EarnContract';
import { NetworkProvider } from '@ton/blueprint';

export async function deployEarn(provider: NetworkProvider, founder: Address) {
    const ui = provider.ui();

    const contractId = BigInt(Math.floor(Math.random() * 10000));
    // TODO: Fill constants
    const minDeposit = toNano('1.0');
    const maxDepositMultiplier = 100n;
    const rewardsPercent = 310n;
    const depositDirectUpLineBonusPercent = 10n;
    const depositFounderBonusPercent = 1n;

    const earnContract = provider.open(
        await EarnContract.fromInit(
            contractId,
            founder,
            minDeposit,
            maxDepositMultiplier,
            rewardsPercent,
            depositDirectUpLineBonusPercent,
            depositFounderBonusPercent
        )
    );

    await earnContract.send(
        provider.sender(),
        {
            value: toNano('0.05')
        },
        {
            $$type: 'Deploy',
            queryId: 0n
        }
    );

    await provider.waitForDeploy(earnContract.address);

    earnContract.getMinDepositAmount(founder);

    ui.write('owner: ' + await earnContract.getOwner());
    ui.write('min deposit: ' + await earnContract.getMinDepositAmount(founder));
    ui.write('max deposit: ' + await earnContract.getMaxDepositAmount(founder));
    ui.write('profile: ' + JSON.stringify(await earnContract.getInvestorProfile(founder)));
}

export async function run(provider: NetworkProvider) {
    const founder: Address = Address.parse('/*_*/');

    await deployEarn(provider, founder);

    // run methods on `earnContract`
}
