import { Blockchain } from '@ton/sandbox';
import { FounderContract } from '../../build/FounderContract/tact_FounderContract';
import { toNano } from '@ton/core';

export const createFounderContractInstance = async () => {
    const contractId = BigInt(Math.floor(Math.random() * 10000));

    const blockchain = await Blockchain.create();

    const mainContract = await blockchain.treasury('mainContract');

    const stakeHolderAContract = await blockchain.treasury('stakeHolderA');
    const stakeHolderBContract = await blockchain.treasury('stakeHolderB');
    const stakeHolderCContract = await blockchain.treasury('stakeHolderC');

    const contract = blockchain.openContract(
        await FounderContract.fromInit(
            contractId,
            stakeHolderAContract.address,
            stakeHolderBContract.address,
            stakeHolderCContract.address,
        )
    );
    const deployer = await blockchain.treasury('deployer');

    const deployResult = await contract.send(
        deployer.getSender(),
        {
            value: toNano('0.05')
        },
        {
            $$type: 'Deploy',
            queryId: 0n
        }
    );

    expect(deployResult.transactions).toHaveTransaction({
        from: deployer.address,
        to: contract.address,
        deploy: true,
        success: true
    });

    return {contract, deployer, mainContract, stakeHolderAContract, stakeHolderBContract, stakeHolderCContract};
};
