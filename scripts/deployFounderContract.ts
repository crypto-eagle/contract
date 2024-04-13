import { Address, toNano } from '@ton/core';
import { FounderContract } from '../wrappers/FounderContract';
import { NetworkProvider } from '@ton/blueprint';

export async function deployFounder(provider: NetworkProvider, stakeHolders: Address[]) {
    const ui = provider.ui();

    const contractId = BigInt(Math.floor(Math.random() * 10000));

    const founderContract = provider.open(
        await FounderContract.fromInit(contractId, stakeHolders[0], stakeHolders[1], stakeHolders[2])
    );

    await founderContract.send(
        provider.sender(),
        {
            value: toNano('0.05')
        },
        {
            $$type: 'Deploy',
            queryId: 0n
        }
    );

    await provider.waitForDeploy(founderContract.address);

    ui.write('owner: ' + await founderContract.getOwner());
    ui.write('balance: ' + await founderContract.getBalance());

    return founderContract;
}

export async function run(provider: NetworkProvider) {
    // TODO: Fill constants
    const stakeHolderA: Address = Address.parse('/*_*/');
    const stakeHolderB: Address = Address.parse('/*_*/');
    const stakeHolderC: Address = Address.parse('/*_*/');

    await deployFounder(provider, [stakeHolderA, stakeHolderB, stakeHolderC]);

    // run methods on `founderContract`
}
