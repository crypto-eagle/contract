import { toNano } from '@ton/core';
import { EarnTest } from '../wrappers/EarnTest';
import { NetworkProvider } from '@ton/blueprint';
import { deployFounder } from './deployFounderContract';
import { founders } from './deployContractsAll';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const contractFounder = await deployFounder(provider, founders);

    const contractId = BigInt(Math.floor(Math.random() * 10000));
    // TODO: Fill constants
    const minDeposit = toNano('10.0');
    const maxDepositMultiplier = 100n;
    const rewardsPercent = 310n;
    const depositDirectUpLineBonusPercent = 10n;
    const depositFounderBonusPercent = 1n;

    const earnContract = provider.open(
        await EarnTest.fromInit(
            contractId,
            contractFounder.address,
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

    ui.write('owner: ' + await earnContract.getOwner());
    ui.write('min/max deposit: ' + JSON.stringify(await earnContract.getDepositConstraints(contractFounder.address)));
    ui.write('profile: ' + JSON.stringify(await earnContract.getInvestorProfile(contractFounder.address)));
}
