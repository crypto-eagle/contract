import { Address, toNano } from '@ton/core';
import { MainContract } from '../wrappers/MainContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // TODO: Fill constants
    const founder: Address = Address.parse('/*_*/');

    const mainContract = provider.open(await MainContract.fromInit(BigInt(Math.floor(Math.random() * 10000)), toNano(1), founder));

    await mainContract.send(
        provider.sender(),
        {
            value: toNano('0.05')
        },
        {
            $$type: 'Deploy',
            queryId: 0n
        }
    );

    await provider.waitForDeploy(mainContract.address);

    console.log('mainContract.getOwner', await mainContract.getOwner());
    // run methods on `mainContract`
}
