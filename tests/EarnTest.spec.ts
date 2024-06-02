import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { EarnTest } from '../wrappers/EarnTest';
import '@ton/test-utils';

describe('EarnTest', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let earnTest: SandboxContract<EarnTest>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        earnTest = blockchain.openContract(await EarnTest.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await earnTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: earnTest.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and earnTest are ready to use
    });
});
