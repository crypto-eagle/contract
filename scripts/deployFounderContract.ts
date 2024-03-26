import { Address, toNano } from '@ton/core';
import { FounderContract } from '../wrappers/FounderContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractId = BigInt(Math.floor(Math.random() * 10000));
    // TODO: Fill constants
    const stakeHolderA: Address = Address.parse('/*_*/');
    const stakeHolderB: Address = Address.parse('/*_*/');
    const stakeHolderC: Address = Address.parse('/*_*/');

    const founderContract = provider.open(
        await FounderContract.fromInit(contractId, stakeHolderA, stakeHolderB, stakeHolderC)
    );

    await founderContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(founderContract.address);

    // run methods on `founderContract`
}
