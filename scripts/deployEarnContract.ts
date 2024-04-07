import { toNano } from '@ton/core';
import { EarnContract } from '../wrappers/EarnContract';
import { NetworkProvider } from '@ton/blueprint';
import { Blockchain } from '@ton/sandbox';

const getRandomId = () => BigInt(Math.floor(Math.random() * 10000));

export async function run(provider: NetworkProvider) {
    const blockchain = await Blockchain.create();
    const [founder] = await blockchain.createWallets(1);

    const earnContract = provider.open(await EarnContract.fromInit(getRandomId(), toNano(1), founder.address));

    await earnContract.send(
        provider.sender(),
        {
            value: toNano('0.1')
        },
        {
            $$type: 'Deploy',
            queryId: 0n
        }
    );

    await provider.waitForDeploy(earnContract.address);

    // run methods on `earnContract`
}
