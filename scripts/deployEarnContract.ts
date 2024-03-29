import { toNano } from '@ton/core';
import { EarnContract } from '../wrappers/EarnContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const earnContract = provider.open(await EarnContract.fromInit());

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
