import { toNano } from '@ton/core';
import { EarnTest } from '../wrappers/EarnTest';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const earnTest = provider.open(await EarnTest.fromInit());

    await earnTest.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(earnTest.address);

    // run methods on `earnTest`
}
