import '@ton/test-utils';
import { Blockchain } from '@ton/sandbox';
import { maxDepositMultiplier, minDeposit, rewardsPercent } from './consts';
import { toNano } from '@ton/core';
import { createFounderContractInstance } from './createFounderContractInstance';
import { EarnTest } from '../../build/EarnTest/tact_EarnTest';

export const createEarnTestContractInstance = async () => {
    const blockchain = await Blockchain.create();

    const founderContract = await createFounderContractInstance();

    const contract = blockchain.openContract(
        await EarnTest.fromInit(
            BigInt(Math.floor(Math.random() * 10000)),
            founderContract.contract.address,
            minDeposit,
            maxDepositMultiplier,
            rewardsPercent,
            10n,
            1n
        )
    );
    const deployer = await blockchain.treasury('deployer');
    const investor = await blockchain.treasury('investor');
    const upLine = await blockchain.treasury('upLine');

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

    return { contract, deployer, blockchain, founderContract, investor, upLine };
};
