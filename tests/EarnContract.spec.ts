import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { EarnContract } from '../wrappers/EarnContract';
import '@ton/test-utils';

const getRandomId = () => BigInt(Math.floor(Math.random() * 10000));

describe('EarnContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let earnContract: SandboxContract<EarnContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const [founder] = await blockchain.createWallets(1);
        earnContract = blockchain.openContract(await EarnContract.fromInit(getRandomId(), toNano(1), founder.address));

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

    it('should return min deposit', () => {
        const minDeposit = earnContract.getMinDeposit();
        console.log('minDeposit', minDeposit);
    });
});
