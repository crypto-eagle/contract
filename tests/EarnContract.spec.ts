import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { EarnContract } from '../wrappers/EarnContract';
import '@ton/test-utils';

describe('EarnContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let earnContract: SandboxContract<EarnContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        earnContract = blockchain.openContract(await EarnContract.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await earnContract.send(
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
            to: earnContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and earnContract are ready to use
    });
});
