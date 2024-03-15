import { toNano } from '@ton/core';
import { MainContract } from '../wrappers/MainContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mainContract = provider.open(await MainContract.fromInit(1n, toNano(10)));

    await mainContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(mainContract.address);

    console.log('mainContract.getBalanceInfo', await mainContract.getBalanceInfo());
    // run methods on `mainContract`
}
