import { Address, toNano } from '@ton/core';
import { EarnContract } from '../wrappers/EarnContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractId = BigInt(Math.floor(Math.random() * 10000));
    // TODO: Fill constants
    const founder: Address = Address.parse('/*_*/');
    const minDeposit = toNano('10.0');
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
            depositFounderBonusPercent,
        )
    );

    await earnContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(earnContract.address);

    // run methods on `earnContract`
}
